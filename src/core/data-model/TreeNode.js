/**
 * 树节点类
 * 扩展BaseNode，添加树操作特定功能
 */

// 导入BaseNode
let BaseNode;
if (typeof window !== 'undefined') {
    // 浏览器环境
    BaseNode = window.BaseNode;
} else {
    // Node.js环境
    const BaseNodeModule = await import('./BaseNode.js');
    BaseNode = BaseNodeModule.BaseNode || BaseNodeModule.default;
}

class TreeNode extends BaseNode {
    /**
     * 创建树节点
     * @param {Object} options - 节点配置
     */
    constructor(options = {}) {
        super(options);
        
        // 树特定属性
        this.collapsed = options.collapsed || false;
        this.priority = options.priority || 1;
        this.tags = options.tags || [];
        this.notes = options.notes || '';
        
        // 可视化布局属性
        this.angleStart = options.angleStart || 0;
        this.angleRange = options.angleRange || 0;
        this.radius = options.radius || 0;
    }
    
    /**
     * 获取所有后代节点（递归）
     * @returns {Array<TreeNode>} 后代节点数组
     */
    getDescendants() {
        const descendants = [];
        
        const collectDescendants = (node) => {
            node.children.forEach(child => {
                descendants.push(child);
                if (child.hasChildren()) {
                    collectDescendants(child);
                }
            });
        };
        
        collectDescendants(this);
        return descendants;
    }
    
    /**
     * 获取所有叶子节点
     * @returns {Array<TreeNode>} 叶子节点数组
     */
    getLeaves() {
        const leaves = [];
        
        const collectLeaves = (node) => {
            if (!node.hasChildren()) {
                leaves.push(node);
            } else {
                node.children.forEach(child => {
                    collectLeaves(child);
                });
            }
        };
        
        collectLeaves(this);
        return leaves;
    }
    
    /**
     * 获取节点路径（从根节点到当前节点）
     * @returns {Array<TreeNode>} 路径节点数组
     */
    getPath(treeManager) {
        const path = [this];
        let currentNode = this;
        
        while (currentNode.parentId && treeManager) {
            const parent = treeManager.findNode(currentNode.parentId);
            if (parent) {
                path.unshift(parent);
                currentNode = parent;
            } else {
                break;
            }
        }
        
        return path;
    }
    
    /**
     * 计算子树大小（节点总数）
     * @returns {number} 子树节点总数
     */
    getSubtreeSize() {
        let count = 1; // 包括自己
        
        this.children.forEach(child => {
            count += child.getSubtreeSize();
        });
        
        return count;
    }
    
    /**
     * 计算子树深度
     * @returns {number} 子树最大深度
     */
    getSubtreeDepth() {
        if (!this.hasChildren()) {
            return this.depth;
        }
        
        let maxDepth = this.depth;
        
        this.children.forEach(child => {
            const childDepth = child.getSubtreeDepth();
            if (childDepth > maxDepth) {
                maxDepth = childDepth;
            }
        });
        
        return maxDepth;
    }
    
    /**
     * 折叠/展开节点
     * @param {boolean} collapsed - 是否折叠
     */
    setCollapsed(collapsed) {
        this.collapsed = collapsed;
        this.updatedAt = new Date().toISOString();
    }
    
    /**
     * 切换折叠状态
     */
    toggleCollapsed() {
        this.setCollapsed(!this.collapsed);
    }
    
    /**
     * 添加标签
     * @param {string} tag - 标签
     */
    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
            this.updatedAt = new Date().toISOString();
        }
    }
    
    /**
     * 移除标签
     * @param {string} tag - 标签
     */
    removeTag(tag) {
        const index = this.tags.indexOf(tag);
        if (index > -1) {
            this.tags.splice(index, 1);
            this.updatedAt = new Date().toISOString();
        }
    }
    
    /**
     * 检查是否有特定标签
     * @param {string} tag - 标签
     * @returns {boolean} 是否有该标签
     */
    hasTag(tag) {
        return this.tags.includes(tag);
    }
    
    /**
     * 转换为JSON对象（扩展基类）
     * @returns {Object} JSON表示
     */
    toJSON() {
        const baseJson = super.toJSON();
        return {
            ...baseJson,
            collapsed: this.collapsed,
            priority: this.priority,
            tags: this.tags,
            notes: this.notes,
            angleStart: this.angleStart,
            angleRange: this.angleRange,
            radius: this.radius
        };
    }
    
    /**
     * 从JSON对象创建树节点
     * @param {Object} json - JSON对象
     * @returns {TreeNode} 新树节点实例
     */
    static fromJSON(json) {
        const node = new TreeNode({
            id: json.id,
            name: json.name,
            parentId: json.parentId,
            depth: json.depth,
            children: [], // 子节点稍后添加
            data: json.data,
            color: json.color,
            expanded: json.expanded,
            value: json.value,
            createdAt: json.createdAt,
            updatedAt: json.updatedAt,
            collapsed: json.collapsed,
            priority: json.priority,
            tags: json.tags || [],
            notes: json.notes || '',
            angleStart: json.angleStart,
            angleRange: json.angleRange,
            radius: json.radius
        });
        
        // 递归创建子节点
        if (json.children && Array.isArray(json.children)) {
            json.children.forEach(childJson => {
                const childNode = TreeNode.fromJSON(childJson);
                node.addChild(childNode);
            });
        }
        
        return node;
    }
    
    /**
     * 转换为ECharts旭日图数据格式
     * @returns {Object} ECharts数据项
     */
    toEChartsData() {
        return {
            name: this.name,
            value: this.value,
            id: this.id,
            depth: this.depth,
            itemStyle: {
                color: this.color
            },
            children: this.children.map(child => child.toEChartsData())
        };
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TreeNode;
}