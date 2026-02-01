/**
 * 数据验证器
 * 验证节点数据和导入导出数据的有效性
 */
class DataValidator {
    /**
     * 创建数据验证器
     */
    constructor() {
        // 验证规则
        this.rules = {
            nodeName: {
                required: true,
                maxLength: 100,
                pattern: /^[\s\S]{1,100}$/,
                sanitize: true
            },
            nodeId: {
                required: true,
                pattern: /^[a-zA-Z0-9_\-]{8,50}$/,
                unique: true
            },
            nodeDepth: {
                required: true,
                min: 0,
                max: 20
            },
            nodeValue: {
                required: false,
                min: 0,
                max: 1000000
            }
        };
        
        // 错误消息
        this.errorMessages = {
            required: '字段是必填的',
            maxLength: '字段长度不能超过{max}个字符',
            min: '字段值不能小于{min}',
            max: '字段值不能大于{max}',
            pattern: '字段格式无效',
            unique: '字段值必须唯一',
            invalidType: '字段类型无效',
            circularReference: '检测到循环引用',
            maxNodes: '节点数量超过限制',
            maxDepth: '节点深度超过限制'
        };
    }
    
    /**
     * 验证节点数据
     * @param {Object} nodeData - 节点数据
     * @param {boolean} isRoot - 是否是根节点
     * @returns {Object} 验证结果 { isValid: boolean, errors: Array, warnings: Array }
     */
    validateNode(nodeData, isRoot = false) {
        const errors = [];
        const warnings = [];
        
        // 检查必需字段
        if (!nodeData) {
            errors.push(this.formatError('required', '节点数据'));
            return { isValid: false, errors, warnings };
        }
        
        // 验证ID
        if (this.rules.nodeId.required && !nodeData.id) {
            errors.push(this.formatError('required', '节点ID'));
        } else if (nodeData.id && !this.rules.nodeId.pattern.test(nodeData.id)) {
            errors.push(this.formatError('pattern', '节点ID'));
        }
        
        // 验证名称
        if (this.rules.nodeName.required && !nodeData.name) {
            errors.push(this.formatError('required', '节点名称'));
        } else if (nodeData.name) {
            if (nodeData.name.length > this.rules.nodeName.maxLength) {
                errors.push(this.formatError('maxLength', '节点名称', { max: this.rules.nodeName.maxLength }));
            }
            
            // 检查名称是否包含潜在危险字符
            if (this.containsDangerousChars(nodeData.name)) {
                warnings.push('节点名称包含特殊字符，可能影响显示');
            }
        }
        
        // 验证深度
        if (nodeData.depth !== undefined) {
            if (nodeData.depth < this.rules.nodeDepth.min) {
                errors.push(this.formatError('min', '节点深度', { min: this.rules.nodeDepth.min }));
            }
            if (nodeData.depth > this.rules.nodeDepth.max) {
                errors.push(this.formatError('max', '节点深度', { max: this.rules.nodeDepth.max }));
            }
        }
        
        // 验证值
        if (nodeData.value !== undefined) {
            if (nodeData.value < this.rules.nodeValue.min) {
                warnings.push(this.formatError('min', '节点值', { min: this.rules.nodeValue.min }));
            }
            if (nodeData.value > this.rules.nodeValue.max) {
                warnings.push(this.formatError('max', '节点值', { max: this.rules.nodeValue.max }));
            }
        }
        
        // 验证父节点ID（根节点不需要）
        if (!isRoot && nodeData.parentId === undefined) {
            warnings.push('非根节点缺少parentId字段');
        }
        
        // 验证子节点数组
        if (nodeData.children && Array.isArray(nodeData.children)) {
            if (nodeData.children.length > 50) {
                warnings.push('子节点数量较多，可能影响性能');
            }
            
            // 递归验证子节点
            nodeData.children.forEach((child, index) => {
                const childResult = this.validateNode(child, false);
                if (!childResult.isValid) {
                    childResult.errors.forEach(error => {
                        errors.push(`子节点[${index}]: ${error}`);
                    });
                }
                childResult.warnings.forEach(warning => {
                    warnings.push(`子节点[${index}]: ${warning}`);
                });
            });
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
    
    /**
     * 验证树数据
     * @param {Object} treeData - 树数据
     * @returns {Object} 验证结果
     */
    validateTree(treeData) {
        const errors = [];
        const warnings = [];
        
        if (!treeData) {
            errors.push(this.formatError('required', '树数据'));
            return { isValid: false, errors, warnings };
        }
        
        // 检查版本信息
        if (!treeData.version) {
            warnings.push('数据缺少版本信息，可能影响兼容性');
        }
        
        // 检查根节点
        if (!treeData.rootNodes || !Array.isArray(treeData.rootNodes)) {
            errors.push('缺少有效的根节点数组');
            return { isValid: false, errors, warnings };
        }
        
        // 验证所有根节点
        treeData.rootNodes.forEach((rootNode, index) => {
            const nodeResult = this.validateNode(rootNode, true);
            if (!nodeResult.isValid) {
                nodeResult.errors.forEach(error => {
                    errors.push(`根节点[${index}]: ${error}`);
                });
            }
            nodeResult.warnings.forEach(warning => {
                warnings.push(`根节点[${index}]: ${warning}`);
            });
        });
        
        // 检查节点总数
        const totalNodes = this.countNodes(treeData);
        if (totalNodes > 1000) {
            warnings.push(`节点总数(${totalNodes})较多，可能影响性能`);
        }
        
        // 检查最大深度
        const maxDepth = this.calculateMaxDepth(treeData);
        if (maxDepth > this.rules.nodeDepth.max) {
            warnings.push(`树深度(${maxDepth})较深，可能影响显示`);
        }
        
        // 检查循环引用
        const hasCircularRef = this.checkCircularReferences(treeData);
        if (hasCircularRef) {
            errors.push(this.formatError('circularReference', '树结构'));
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            stats: {
                totalNodes,
                maxDepth,
                rootCount: treeData.rootNodes.length
            }
        };
    }
    
    /**
     * 验证导入数据
     * @param {Object} importData - 导入数据
     * @returns {Object} 验证结果
     */
    validateImportData(importData) {
        const errors = [];
        const warnings = [];
        
        if (!importData) {
            errors.push('导入数据为空');
            return { isValid: false, errors, warnings };
        }
        
        // 检查基本结构
        if (typeof importData !== 'object') {
            errors.push('导入数据必须是JSON对象');
            return { isValid: false, errors, warnings };
        }
        
        // 检查版本兼容性
        if (importData.version) {
            const version = importData.version;
            if (!this.isVersionCompatible(version)) {
                warnings.push(`数据版本(${version})可能与当前应用不兼容`);
            }
        }
        
        // 检查应用标识
        if (importData.application && importData.application !== 'Sunburst MindMap') {
            warnings.push(`数据来自其他应用: ${importData.application}`);
        }
        
        // 验证实际数据
        if (importData.data) {
            const dataResult = this.validateTree(importData.data);
            if (!dataResult.isValid) {
                dataResult.errors.forEach(error => errors.push(error));
            }
            dataResult.warnings.forEach(warning => warnings.push(warning));
        } else if (importData.rootNodes) {
            // 直接是树数据
            const treeResult = this.validateTree(importData);
            if (!treeResult.isValid) {
                treeResult.errors.forEach(error => errors.push(error));
            }
            treeResult.warnings.forEach(warning => warnings.push(warning));
        } else {
            errors.push('导入数据缺少有效的树结构');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
    
    /**
     * 检查版本兼容性
     * @param {string} version - 版本号
     * @returns {boolean} 是否兼容
     */
    isVersionCompatible(version) {
        // 简单版本检查：主版本号相同则兼容
        const currentMajor = '1'; // 当前主版本
        const importMajor = version.split('.')[0];
        
        return importMajor === currentMajor;
    }
    
    /**
     * 检查循环引用
     * @param {Object} treeData - 树数据
     * @returns {boolean} 是否存在循环引用
     */
    checkCircularReferences(treeData) {
        if (!treeData.rootNodes) return false;
        
        const visited = new Set();
        
        const checkNode = (node, path = []) => {
            if (!node || !node.id) return false;
            
            // 检查当前节点是否已在路径中
            if (path.includes(node.id)) {
                return true; // 发现循环引用
            }
            
            // 检查是否已访问过（避免重复检查）
            if (visited.has(node.id)) {
                return false;
            }
            
            visited.add(node.id);
            
            // 检查子节点
            if (node.children && Array.isArray(node.children)) {
                for (const child of node.children) {
                    if (checkNode(child, [...path, node.id])) {
                        return true;
                    }
                }
            }
            
            return false;
        };
        
        for (const rootNode of treeData.rootNodes) {
            if (checkNode(rootNode)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * 计算节点总数
     * @param {Object} treeData - 树数据
     * @returns {number} 节点总数
     */
    countNodes(treeData) {
        if (!treeData.rootNodes) return 0;
        
        let count = 0;
        
        const countNode = (node) => {
            count++;
            if (node.children && Array.isArray(node.children)) {
                node.children.forEach(child => countNode(child));
            }
        };
        
        treeData.rootNodes.forEach(rootNode => countNode(rootNode));
        
        return count;
    }
    
    /**
     * 计算最大深度
     * @param {Object} treeData - 树数据
     * @returns {number} 最大深度
     */
    calculateMaxDepth(treeData) {
        if (!treeData.rootNodes) return 0;
        
        let maxDepth = 0;
        
        const calculateDepth = (node, currentDepth) => {
            maxDepth = Math.max(maxDepth, currentDepth);
            
            if (node.children && Array.isArray(node.children)) {
                node.children.forEach(child => {
                    calculateDepth(child, currentDepth + 1);
                });
            }
        };
        
        treeData.rootNodes.forEach(rootNode => {
            calculateDepth(rootNode, 0);
        });
        
        return maxDepth;
    }
    
    /**
     * 检查是否包含危险字符
     * @param {string} text - 文本
     * @returns {boolean} 是否包含危险字符
     */
    containsDangerousChars(text) {
        if (typeof text !== 'string') return false;
        
        // 检查HTML标签和脚本
        const dangerousPatterns = [
            /<script\b[^>]*>/i,
            /<\/script>/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /data:/i
        ];
        
        return dangerousPatterns.some(pattern => pattern.test(text));
    }
    
    /**
     * 清理节点数据（移除危险内容）
     * @param {Object} nodeData - 节点数据
     * @returns {Object} 清理后的节点数据
     */
    sanitizeNodeData(nodeData) {
        if (!nodeData || typeof nodeData !== 'object') return nodeData;
        
        const sanitized = { ...nodeData };
        
        // 清理名称
        if (sanitized.name && typeof sanitized.name === 'string') {
            sanitized.name = this.sanitizeText(sanitized.name);
        }
        
        // 清理描述/备注
        if (sanitized.notes && typeof sanitized.notes === 'string') {
            sanitized.notes = this.sanitizeText(sanitized.notes);
        }
        
        // 清理标签
        if (sanitized.tags && Array.isArray(sanitized.tags)) {
            sanitized.tags = sanitized.tags.map(tag => 
                typeof tag === 'string' ? this.sanitizeText(tag) : tag
            ).filter(tag => tag && tag.trim().length > 0);
        }
        
        // 递归清理子节点
        if (sanitized.children && Array.isArray(sanitized.children)) {
            sanitized.children = sanitized.children.map(child => 
                this.sanitizeNodeData(child)
            );
        }
        
        return sanitized;
    }
    
    /**
     * 清理文本
     * @param {string} text - 原始文本
     * @returns {string} 清理后的文本
     */
    sanitizeText(text) {
        if (typeof text !== 'string') return text;
        
        // 移除HTML标签
        let sanitized = text.replace(/<[^>]*>/g, '');
        
        // 移除危险属性
        sanitized = sanitized.replace(/on\w+\s*=\s*"[^"]*"/gi, '');
        sanitized = sanitized.replace(/on\w+\s*=\s*'[^']*'/gi, '');
        sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]+/gi, '');
        
        // 移除JavaScript协议
        sanitized = sanitized.replace(/javascript:/gi, '');
        
        // 限制长度
        if (sanitized.length > 500) {
            sanitized = sanitized.substring(0, 500) + '...';
        }
        
        return sanitized.trim();
    }
    
    /**
     * 格式化错误消息
     * @param {string} errorType - 错误类型
     * @param {string} field - 字段名
     * @param {Object} params - 参数
     * @returns {string} 格式化后的错误消息
     */
    formatError(errorType, field, params = {}) {
        let message = this.errorMessages[errorType] || '验证错误';
        
        // 替换参数
        Object.keys(params).forEach(key => {
            message = message.replace(`{${key}}`, params[key]);
        });
        
        return `${field}: ${message}`;
    }
    
    /**
     * 获取验证规则
     * @returns {Object} 验证规则
     */
    getRules() {
        return { ...this.rules };
    }
    
    /**
     * 设置验证规则
     * @param {Object} newRules - 新规则
     */
    setRules(newRules) {
        this.rules = { ...this.rules, ...newRules };
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataValidator;
}