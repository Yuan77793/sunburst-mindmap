/**
 * 间隙管理器
 * 管理节点间的固定间隙，实现视觉分离效果
 */
class GapManager {
    /**
     * 创建间隙管理器
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        this.options = {
            gapAngle: 3,           // 间隙角度（度）
            gapColor: 'transparent', // 间隙颜色
            gapOpacity: 0,         // 间隙透明度
            enableGaps: true,      // 是否启用间隙
            minChildrenForGap: 2,  // 最小子节点数才添加间隙
            ...options
        };
        
        this.gapNodes = new Map(); // 存储间隙节点信息
    }
    
    /**
     * 在数据中插入间隙节点
     * @param {Array} data - 原始旭日图数据
     * @returns {Array} 包含间隙的数据
     */
    insertGaps(data) {
        if (!this.options.enableGaps || this.options.gapAngle <= 0) {
            return data;
        }
        
        const gapRadians = (this.options.gapAngle * Math.PI) / 180;
        this.gapNodes.clear();
        
        const processNode = (node, parentAngleRange = 2 * Math.PI, parentStartAngle = 0) => {
            if (!node.children || node.children.length < this.options.minChildrenForGap) {
                return node;
            }
            
            const childrenCount = node.children.length;
            const totalGapAngle = gapRadians * childrenCount;
            const childAngle = (parentAngleRange - totalGapAngle) / childrenCount;
            
            const newChildren = [];
            let currentAngle = parentStartAngle;
            let gapIndex = 0;
            
            node.children.forEach((child, index) => {
                // 设置子节点角度
                child.startAngle = currentAngle;
                child.angleRange = childAngle;
                currentAngle += childAngle;
                
                // 递归处理子节点
                newChildren.push(processNode(child, childAngle, child.startAngle));
                
                // 插入间隙节点（最后一个不插）
                if (index < childrenCount - 1) {
                    const gapNode = this.createGapNode(currentAngle, gapRadians, node, gapIndex);
                    currentAngle += gapRadians;
                    newChildren.push(gapNode);
                    gapIndex++;
                }
            });
            
            node.children = newChildren;
            return node;
        };
        
        return data.map(node => processNode(node));
    }
    
    /**
     * 创建间隙节点
     * @param {number} startAngle - 起始角度
     * @param {number} angleRange - 角度范围
     * @param {Object} parentNode - 父节点
     * @param {number} gapIndex - 间隙索引
     * @returns {Object} 间隙节点
     */
    createGapNode(startAngle, angleRange, parentNode, gapIndex) {
        const gapId = `gap_${parentNode.id || 'root'}_${gapIndex}`;
        
        const gapNode = {
            name: '',
            value: 0,
            id: gapId,
            startAngle: startAngle,
            angleRange: angleRange,
            children: [],
            isGap: true,
            itemStyle: {
                color: this.options.gapColor,
                opacity: this.options.gapOpacity,
                borderWidth: 0
            },
            label: {
                show: false
            },
            emphasis: {
                disabled: true
            },
            tooltip: {
                show: false
            }
        };
        
        // 存储间隙节点信息
        this.gapNodes.set(gapId, {
            id: gapId,
            parentId: parentNode.id,
            startAngle,
            angleRange,
            gapIndex
        });
        
        return gapNode;
    }
    
    /**
     * 从数据中移除间隙节点
     * @param {Array} data - 包含间隙的数据
     * @returns {Array} 移除间隙后的数据
     */
    removeGaps(data) {
        const removeGapsFromNode = (node) => {
            if (!node.children) {
                return node;
            }
            
            // 过滤掉间隙节点
            const realChildren = node.children.filter(child => !child.isGap);
            
            // 重新计算角度（均匀分布）
            if (realChildren.length > 0) {
                const childAngle = node.angleRange / realChildren.length;
                
                realChildren.forEach((child, index) => {
                    child.startAngle = node.startAngle + (childAngle * index);
                    child.angleRange = childAngle;
                    
                    // 递归处理子节点
                    removeGapsFromNode(child);
                });
            }
            
            node.children = realChildren;
            return node;
        };
        
        this.gapNodes.clear();
        return data.map(node => removeGapsFromNode(node));
    }
    
    /**
     * 调整间隙角度
     * @param {number} newGapAngle - 新间隙角度（度）
     * @param {Array} data - 当前数据
     * @returns {Array} 调整后的数据
     */
    adjustGapAngle(newGapAngle, data) {
        this.options.gapAngle = newGapAngle;
        
        // 先移除旧间隙，再插入新间隙
        const dataWithoutGaps = this.removeGaps(data);
        return this.insertGaps(dataWithoutGaps);
    }
    
    /**
     * 检查节点是否为间隙节点
     * @param {Object} node - 节点
     * @returns {boolean} 是否是间隙节点
     */
    isGapNode(node) {
        return node.isGap === true;
    }
    
    /**
     * 获取间隙节点信息
     * @param {string} gapId - 间隙节点ID
     * @returns {Object|null} 间隙节点信息
     */
    getGapInfo(gapId) {
        return this.gapNodes.get(gapId) || null;
    }
    
    /**
     * 获取所有间隙节点信息
     * @returns {Array} 间隙节点信息数组
     */
    getAllGaps() {
        return Array.from(this.gapNodes.values());
    }
    
    /**
     * 获取父节点的间隙数量
     * @param {string} parentId - 父节点ID
     * @returns {number} 间隙数量
     */
    getGapCountForParent(parentId) {
        let count = 0;
        
        for (const gapInfo of this.gapNodes.values()) {
            if (gapInfo.parentId === parentId) {
                count++;
            }
        }
        
        return count;
    }
    
    /**
     * 计算间隙占用的总角度
     * @param {Object} node - 节点
     * @returns {number} 间隙总角度（弧度）
     */
    calculateTotalGapAngle(node) {
        if (!node.children || node.children.length < 2) {
            return 0;
        }
        
        const gapRadians = (this.options.gapAngle * Math.PI) / 180;
        return gapRadians * (node.children.length - 1);
    }
    
    /**
     * 计算实际可用于子节点的角度
     * @param {Object} node - 节点
     * @returns {number} 可用角度（弧度）
     */
    calculateAvailableAngle(node) {
        const totalGapAngle = this.calculateTotalGapAngle(node);
        return node.angleRange - totalGapAngle;
    }
    
    /**
     * 验证间隙配置
     * @param {Object} node - 节点
     * @returns {Object} 验证结果 { isValid: boolean, message: string }
     */
    validateGapConfiguration(node) {
        if (!this.options.enableGaps) {
            return { isValid: true, message: '间隙功能已禁用' };
        }
        
        if (this.options.gapAngle <= 0) {
            return { isValid: false, message: '间隙角度必须大于0' };
        }
        
        if (!node.children || node.children.length < 2) {
            return { isValid: true, message: '节点子节点数不足，无需间隙' };
        }
        
        const gapRadians = (this.options.gapAngle * Math.PI) / 180;
        const totalGapAngle = gapRadians * (node.children.length - 1);
        
        if (totalGapAngle >= node.angleRange) {
            return { 
                isValid: false, 
                message: `间隙总角度(${(totalGapAngle * 180 / Math.PI).toFixed(2)}°)超过节点角度范围(${(node.angleRange * 180 / Math.PI).toFixed(2)}°)` 
            };
        }
        
        // 计算每个子节点的最小角度
        const availableAngle = node.angleRange - totalGapAngle;
        const minChildAngle = availableAngle / node.children.length;
        
        if (minChildAngle < 0.01) { // 约0.57度
            return { 
                isValid: false, 
                message: `子节点角度过小(${(minChildAngle * 180 / Math.PI).toFixed(2)}°)，考虑减少间隙或子节点数量` 
            };
        }
        
        return { 
            isValid: true, 
            message: `间隙配置有效，每个子节点约${(minChildAngle * 180 / Math.PI).toFixed(2)}°` 
        };
    }
    
    /**
     * 获取间隙统计信息
     * @param {Array} data - 数据
     * @returns {Object} 统计信息
     */
    getGapStats(data) {
        let totalGaps = 0;
        let maxGapsPerNode = 0;
        const nodesWithGaps = new Set();
        
        const countGaps = (node) => {
            if (!node.children) return;
            
            let nodeGapCount = 0;
            node.children.forEach(child => {
                if (child.isGap) {
                    totalGaps++;
                    nodeGapCount++;
                    nodesWithGaps.add(node.id || 'root');
                } else {
                    countGaps(child);
                }
            });
            
            maxGapsPerNode = Math.max(maxGapsPerNode, nodeGapCount);
        };
        
        data.forEach(node => countGaps(node));
        
        return {
            totalGaps,
            maxGapsPerNode,
            nodesWithGapsCount: nodesWithGaps.size,
            gapAngle: this.options.gapAngle,
            enabled: this.options.enableGaps
        };
    }
    
    /**
     * 启用/禁用间隙
     * @param {boolean} enabled - 是否启用
     */
    setEnabled(enabled) {
        this.options.enableGaps = enabled;
    }
    
    /**
     * 设置间隙颜色
     * @param {string} color - 颜色值
     */
    setGapColor(color) {
        this.options.gapColor = color;
    }
    
    /**
     * 设置间隙透明度
     * @param {number} opacity - 透明度 (0-1)
     */
    setGapOpacity(opacity) {
        this.options.gapOpacity = Math.max(0, Math.min(1, opacity));
    }
    
    /**
     * 获取当前配置
     * @returns {Object} 当前配置
     */
    getConfig() {
        return { ...this.options };
    }
    
    /**
     * 更新配置
     * @param {Object} newConfig - 新配置
     */
    updateConfig(newConfig) {
        this.options = { ...this.options, ...newConfig };
    }
    
    /**
     * 创建间隙可视化示例
     * @param {number} childCount - 子节点数量
     * @param {number} parentAngle - 父节点角度范围（度）
     * @returns {Object} 示例数据
     */
    createGapExample(childCount = 5, parentAngle = 360) {
        const parentNode = {
            name: '父节点',
            value: childCount,
            angleRange: (parentAngle * Math.PI) / 180,
            startAngle: 0,
            children: []
        };
        
        // 创建子节点
        for (let i = 0; i < childCount; i++) {
            parentNode.children.push({
                name: `子节点 ${i + 1}`,
                value: 1,
                children: []
            });
        }
        
        // 插入间隙
        const withGaps = this.insertGaps([parentNode]);
        
        // 计算统计信息
        const stats = this.getGapStats(withGaps);
        const validation = this.validateGapConfiguration(parentNode);
        
        return {
            data: withGaps,
            stats,
            validation,
            config: this.getConfig()
        };
    }
    
    /**
     * 导出间隙配置
     * @returns {Object} 可序列化的配置
     */
    exportConfig() {
        return {
            gapAngle: this.options.gapAngle,
            gapColor: this.options.gapColor,
            gapOpacity: this.options.gapOpacity,
            enableGaps: this.options.enableGaps,
            minChildrenForGap: this.options.minChildrenForGap,
            gapNodes: Array.from(this.gapNodes.values())
        };
    }
    
    /**
     * 导入间隙配置
     * @param {Object} config - 配置对象
     */
    importConfig(config) {
        this.options.gapAngle = config.gapAngle || this.options.gapAngle;
        this.options.gapColor = config.gapColor || this.options.gapColor;
        this.options.gapOpacity = config.gapOpacity || this.options.gapOpacity;
        this.options.enableGaps = config.enableGaps !== undefined ? config.enableGaps : this.options.enableGaps;
        this.options.minChildrenForGap = config.minChildrenForGap || this.options.minChildrenForGap;
        
        if (config.gapNodes && Array.isArray(config.gapNodes)) {
            this.gapNodes.clear();
            config.gapNodes.forEach(gapInfo => {
                this.gapNodes.set(gapInfo.id, gapInfo);
            });
        }
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GapManager;
}