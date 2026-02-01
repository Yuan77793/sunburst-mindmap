/**
 * 树管理器
 * 管理整棵节点树，提供节点操作和遍历功能
 */
class TreeManager {
    /**
     * 创建树管理器
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        this.nodes = new Map(); // ID -> 节点映射
        this.rootNodes = [];    // 根节点数组
        this.selectedNodeId = null;
        this.maxDepth = options.maxDepth || 10;
        this.maxNodes = options.maxNodes || 1000;
        
        // 事件系统
        this.eventListeners = new Map();
        
        // 初始化示例数据（如果提供）
        if (options.initialData) {
            this.loadFromJSON(options.initialData);
        }
    }
    
    /**
     * 添加节点
     * @param {TreeNode} node - 要添加的节点
     * @param {string} parentId - 父节点ID（可选，为null时作为根节点）
     * @returns {boolean} 是否成功添加
     */
    addNode(node, parentId = null) {
        // 验证节点
        if (!(node instanceof TreeNode)) {
            throw new Error('节点必须是TreeNode实例');
        }
        
        // 检查节点数量限制
        if (this.nodes.size >= this.maxNodes) {
            console.warn(`达到最大节点数限制: ${this.maxNodes}`);
            return false;
        }
        
        // 检查深度限制
        if (node.depth > this.maxDepth) {
            console.warn(`节点深度超过限制: ${this.maxDepth}`);
            return false;
        }
        
        // 检查ID是否已存在
        if (this.nodes.has(node.id)) {
            console.warn(`节点ID已存在: ${node.id}`);
            return false;
        }
        
        // 添加到映射
        this.nodes.set(node.id, node);
        
        // 设置父节点关系
        if (parentId) {
            const parent = this.nodes.get(parentId);
            if (parent) {
                parent.addChild(node);
                node.parentId = parentId;
                node.depth = parent.depth + 1;
            } else {
                console.warn(`父节点不存在: ${parentId}`);
                // 如果没有父节点，作为根节点
                this.rootNodes.push(node);
                node.parentId = null;
                node.depth = 0;
            }
        } else {
            // 作为根节点
            this.rootNodes.push(node);
            node.parentId = null;
            node.depth = 0;
        }
        
        // 触发事件
        this.emit('nodeAdded', { node, parentId });
        
        return true;
    }
    
    /**
     * 删除节点及其所有后代
     * @param {string} nodeId - 要删除的节点ID
     * @returns {boolean} 是否成功删除
     */
    deleteNode(nodeId) {
        const node = this.nodes.get(nodeId);
        if (!node) {
            return false;
        }
        
        // 收集所有要删除的节点（包括后代）
        const nodesToDelete = this.getDescendants(nodeId);
        nodesToDelete.push(node);
        
        // 从父节点移除
        if (node.parentId) {
            const parent = this.nodes.get(node.parentId);
            if (parent) {
                parent.removeChild(nodeId);
            }
        } else {
            // 从根节点移除
            this.rootNodes = this.rootNodes.filter(root => root.id !== nodeId);
        }
        
        // 从映射中移除所有节点
        nodesToDelete.forEach(nodeToDelete => {
            this.nodes.delete(nodeToDelete.id);
        });
        
        // 如果删除的是选中节点，清空选中状态
        if (this.selectedNodeId === nodeId) {
            this.selectedNodeId = null;
        }
        
        // 触发事件
        this.emit('nodeDeleted', { nodeId, deletedCount: nodesToDelete.length });
        
        return true;
    }
    
    /**
     * 查找节点
     * @param {string} nodeId - 节点ID
     * @returns {TreeNode|null} 找到的节点或null
     */
    findNode(nodeId) {
        return this.nodes.get(nodeId) || null;
    }
    
    /**
     * 查找节点（通过名称）
     * @param {string} name - 节点名称
     * @returns {Array<TreeNode>} 匹配的节点数组
     */
    findNodesByName(name) {
        const results = [];
        for (const node of this.nodes.values()) {
            if (node.name.includes(name)) {
                results.push(node);
            }
        }
        return results;
    }
    
    /**
     * 获取节点的所有后代
     * @param {string} nodeId - 节点ID
     * @returns {Array<TreeNode>} 后代节点数组
     */
    getDescendants(nodeId) {
        const node = this.nodes.get(nodeId);
        if (!node) {
            return [];
        }
        
        return node.getDescendants();
    }
    
    /**
     * 获取节点的所有祖先
     * @param {string} nodeId - 节点ID
     * @returns {Array<TreeNode>} 祖先节点数组
     */
    getAncestors(nodeId) {
        const ancestors = [];
        let currentNode = this.nodes.get(nodeId);
        
        while (currentNode && currentNode.parentId) {
            const parent = this.nodes.get(currentNode.parentId);
            if (parent) {
                ancestors.unshift(parent);
                currentNode = parent;
            } else {
                break;
            }
        }
        
        return ancestors;
    }
    
    /**
     * 获取兄弟节点
     * @param {string} nodeId - 节点ID
     * @returns {Array<TreeNode>} 兄弟节点数组
     */
    getSiblings(nodeId) {
        const node = this.nodes.get(nodeId);
        if (!node || !node.parentId) {
            return [];
        }
        
        const parent = this.nodes.get(node.parentId);
        if (!parent) {
            return [];
        }
        
        return parent.children.filter(child => child.id !== nodeId);
    }
    
    /**
     * 获取根节点
     * @returns {Array<TreeNode>} 根节点数组
     */
    getRootNodes() {
        return [...this.rootNodes];
    }
    
    /**
     * 获取选中节点
     * @returns {TreeNode|null} 选中节点
     */
    getSelectedNode() {
        return this.selectedNodeId ? this.nodes.get(this.selectedNodeId) : null;
    }
    
    /**
     * 设置选中节点
     * @param {string} nodeId - 节点ID
     */
    setSelectedNode(nodeId) {
        const oldSelectedId = this.selectedNodeId;
        this.selectedNodeId = nodeId;
        
        // 触发事件
        this.emit('selectionChanged', { 
            oldSelectedId, 
            newSelectedId: nodeId 
        });
    }
    
    /**
     * 获取节点总数
     * @returns {number} 节点总数
     */
    getTotalNodeCount() {
        return this.nodes.size;
    }
    
    /**
     * 获取树的最大深度
     * @returns {number} 最大深度
     */
    getMaxDepth() {
        let maxDepth = 0;
        for (const node of this.nodes.values()) {
            if (node.depth > maxDepth) {
                maxDepth = node.depth;
            }
        }
        return maxDepth;
    }
    
    /**
     * 遍历所有节点（深度优先）
     * @param {Function} callback - 回调函数
     * @param {string} order - 遍历顺序：'pre'（前序）或'post'（后序）
     */
    traverse(callback, order = 'pre') {
        const traverseNode = (node) => {
            if (order === 'pre') {
                callback(node);
            }
            
            node.children.forEach(child => {
                traverseNode(child);
            });
            
            if (order === 'post') {
                callback(node);
            }
        };
        
        this.rootNodes.forEach(root => {
            traverseNode(root);
        });
    }
    
    /**
     * 转换为ECharts旭日图数据格式
     * @returns {Array} ECharts数据数组
     */
    toEChartsData() {
        return this.rootNodes.map(root => root.toEChartsData());
    }
    
    /**
     * 从ECharts数据格式导入
     * @param {Array} echartsData - ECharts数据
     */
    fromEChartsData(echartsData) {
        this.clear();
        
        const processData = (data, parentId = null, depth = 0) => {
            const node = new TreeNode({
                id: data.id || this.generateNodeId(),
                name: data.name || '未命名',
                depth: depth,
                value: data.value || 1,
                color: data.itemStyle?.color,
                parentId: parentId
            });
            
            this.addNode(node, parentId);
            
            if (data.children && Array.isArray(data.children)) {
                data.children.forEach(childData => {
                    processData(childData, node.id, depth + 1);
                });
            }
        };
        
        echartsData.forEach(data => {
            processData(data, null, 0);
        });
    }
    
    /**
     * 生成节点ID
     * @returns {string} 唯一节点ID
     */
    generateNodeId() {
        let id;
        do {
            id = 'node_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        } while (this.nodes.has(id));
        return id;
    }
    
    /**
     * 转换为JSON
     * @returns {Object} JSON表示
     */
    toJSON() {
        return {
            version: '1.0',
            createdAt: new Date().toISOString(),
            rootNodes: this.rootNodes.map(root => root.toJSON()),
            totalNodes: this.nodes.size,
            maxDepth: this.getMaxDepth(),
            selectedNodeId: this.selectedNodeId
        };
    }
    
    /**
     * 从JSON加载
     * @param {Object} json - JSON数据
     */
    loadFromJSON(json) {
        this.clear();
        
        if (json.rootNodes && Array.isArray(json.rootNodes)) {
            json.rootNodes.forEach(rootJson => {
                const rootNode = TreeNode.fromJSON(rootJson);
                this.addNode(rootNode);
            });
        }
        
        if (json.selectedNodeId) {
            this.selectedNodeId = json.selectedNodeId;
        }
        
        this.emit('treeLoaded', { nodeCount: this.nodes.size });
    }
    
    /**
     * 清空树
     */
    clear() {
        this.nodes.clear();
        this.rootNodes = [];
        this.selectedNodeId = null;
        this.emit('treeCleared');
    }
    
    /**
     * 事件监听
     * @param {string} event - 事件名称
     * @param {Function} listener - 监听函数
     */
    on(event, listener) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(listener);
    }
    
    /**
     * 移除事件监听
     * @param {string} event - 事件名称
     * @param {Function} listener - 监听函数
     */
    off(event, listener) {
        if (!this.eventListeners.has(event)) return;
        
        const listeners = this.eventListeners.get(event);
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }
    
    /**
     * 触发事件
     * @param {string} event - 事件名称
     * @param {Object} data - 事件数据
     */
    emit(event, data = {}) {
        if (!this.eventListeners.has(event)) return;
        
        const listeners = this.eventListeners.get(event);
        listeners.forEach(listener => {
            try {
                listener(data);
            } catch (error) {
                console.error(`事件监听器错误 (${event}):`, error);
            }
        });
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TreeManager;
}