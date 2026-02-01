/**
 * 基础节点类
 * 定义节点基础属性和方法
 */
class BaseNode {
    /**
     * 创建新节点
     * @param {Object} options - 节点配置
     * @param {string} options.name - 节点名称
     * @param {string} options.id - 节点ID（可选，自动生成）
     * @param {string} options.parentId - 父节点ID
     * @param {number} options.depth - 节点深度
     * @param {Array} options.children - 子节点数组
     * @param {Object} options.data - 额外数据
     */
    constructor(options = {}) {
        this.id = options.id || this.generateId();
        this.name = options.name || '未命名节点';
        this.parentId = options.parentId || null;
        this.depth = options.depth || 0;
        this.children = options.children || [];
        this.data = options.data || {};
        
        // 可视化相关属性
        this.color = options.color || null;
        this.expanded = options.expanded !== undefined ? options.expanded : true;
        this.value = options.value || 1;
        
        // 创建时间戳
        this.createdAt = options.createdAt || new Date().toISOString();
        this.updatedAt = options.updatedAt || new Date().toISOString();
    }
    
    /**
     * 生成唯一ID
     * @returns {string} 唯一标识符
     */
    generateId() {
        return 'node_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * 添加子节点
     * @param {BaseNode} childNode - 子节点
     */
    addChild(childNode) {
        if (!(childNode instanceof BaseNode)) {
            throw new Error('子节点必须是BaseNode实例');
        }
        
        childNode.parentId = this.id;
        childNode.depth = this.depth + 1;
        this.children.push(childNode);
        this.updatedAt = new Date().toISOString();
        
        return this;
    }
    
    /**
     * 移除子节点
     * @param {string} childId - 子节点ID
     * @returns {boolean} 是否成功移除
     */
    removeChild(childId) {
        const initialLength = this.children.length;
        this.children = this.children.filter(child => child.id !== childId);
        const removed = this.children.length < initialLength;
        
        if (removed) {
            this.updatedAt = new Date().toISOString();
        }
        
        return removed;
    }
    
    /**
     * 获取子节点数量
     * @returns {number} 子节点数量
     */
    getChildCount() {
        return this.children.length;
    }
    
    /**
     * 检查是否有子节点
     * @returns {boolean} 是否有子节点
     */
    hasChildren() {
        return this.children.length > 0;
    }
    
    /**
     * 查找子节点
     * @param {string} childId - 子节点ID
     * @returns {BaseNode|null} 找到的子节点或null
     */
    findChild(childId) {
        return this.children.find(child => child.id === childId) || null;
    }
    
    /**
     * 转换为JSON对象
     * @returns {Object} JSON表示
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            parentId: this.parentId,
            depth: this.depth,
            children: this.children.map(child => child.toJSON()),
            data: this.data,
            color: this.color,
            expanded: this.expanded,
            value: this.value,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
    
    /**
     * 从JSON对象创建节点
     * @param {Object} json - JSON对象
     * @returns {BaseNode} 新节点实例
     */
    static fromJSON(json) {
        const node = new BaseNode({
            id: json.id,
            name: json.name,
            parentId: json.parentId,
            depth: json.depth,
            data: json.data,
            color: json.color,
            expanded: json.expanded,
            value: json.value,
            createdAt: json.createdAt,
            updatedAt: json.updatedAt
        });
        
        // 递归创建子节点
        if (json.children && Array.isArray(json.children)) {
            json.children.forEach(childJson => {
                const childNode = BaseNode.fromJSON(childJson);
                node.addChild(childNode);
            });
        }
        
        return node;
    }
    
    /**
     * 克隆节点
     * @returns {BaseNode} 克隆的节点
     */
    clone() {
        return BaseNode.fromJSON(this.toJSON());
    }
    
    /**
     * 更新节点属性
     * @param {Object} updates - 要更新的属性
     */
    update(updates) {
        Object.keys(updates).forEach(key => {
            if (key in this && key !== 'id' && key !== 'createdAt') {
                this[key] = updates[key];
            }
        });
        this.updatedAt = new Date().toISOString();
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaseNode;
}

// ES6模块导出
if (typeof window !== 'undefined') {
    window.BaseNode = BaseNode;
}

export { BaseNode };