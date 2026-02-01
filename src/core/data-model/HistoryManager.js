/**
 * 历史记录管理器
 * 实现3步撤销/重做功能
 */
class HistoryManager {
    /**
     * 创建历史记录管理器
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        this.maxSteps = options.maxSteps || 3; // 最大历史步骤
        this.undoStack = []; // 撤销栈
        this.redoStack = []; // 重做栈
        this.enabled = options.enabled !== false;
        
        // 事件系统
        this.eventListeners = new Map();
    }
    
    /**
     * 记录状态快照
     * @param {Object} state - 状态对象
     * @param {string} action - 动作描述
     */
    record(state, action = '未知操作') {
        if (!this.enabled) return;
        
        // 创建快照
        const snapshot = {
            state: this.deepClone(state),
            action: action,
            timestamp: new Date().toISOString(),
            id: this.generateSnapshotId()
        };
        
        // 添加到撤销栈
        this.undoStack.push(snapshot);
        
        // 限制栈大小
        if (this.undoStack.length > this.maxSteps) {
            this.undoStack.shift();
        }
        
        // 清空重做栈（新操作后重做栈无效）
        this.redoStack = [];
        
        // 触发事件
        this.emit('historyRecorded', { 
            snapshot, 
            undoCount: this.undoStack.length,
            redoCount: this.redoStack.length 
        });
    }
    
    /**
     * 撤销操作
     * @returns {Object|null} 恢复的状态或null
     */
    undo() {
        if (!this.canUndo()) {
            console.warn('无法撤销：撤销栈为空');
            return null;
        }
        
        // 从撤销栈弹出
        const snapshot = this.undoStack.pop();
        
        // 添加到重做栈
        this.redoStack.push(snapshot);
        
        // 触发事件
        this.emit('undoPerformed', { 
            snapshot,
            undoCount: this.undoStack.length,
            redoCount: this.redoStack.length
        });
        
        return snapshot.state;
    }
    
    /**
     * 重做操作
     * @returns {Object|null} 恢复的状态或null
     */
    redo() {
        if (!this.canRedo()) {
            console.warn('无法重做：重做栈为空');
            return null;
        }
        
        // 从重做栈弹出
        const snapshot = this.redoStack.pop();
        
        // 添加回撤销栈
        this.undoStack.push(snapshot);
        
        // 触发事件
        this.emit('redoPerformed', { 
            snapshot,
            undoCount: this.undoStack.length,
            redoCount: this.redoStack.length
        });
        
        return snapshot.state;
    }
    
    /**
     * 检查是否可以撤销
     * @returns {boolean} 是否可以撤销
     */
    canUndo() {
        return this.enabled && this.undoStack.length > 0;
    }
    
    /**
     * 检查是否可以重做
     * @returns {boolean} 是否可以重做
     */
    canRedo() {
        return this.enabled && this.redoStack.length > 0;
    }
    
    /**
     * 获取撤销栈大小
     * @returns {number} 撤销栈大小
     */
    getUndoCount() {
        return this.undoStack.length;
    }
    
    /**
     * 获取重做栈大小
     * @returns {number} 重做栈大小
     */
    getRedoCount() {
        return this.redoStack.length;
    }
    
    /**
     * 获取最大步骤数
     * @returns {number} 最大步骤数
     */
    getMaxSteps() {
        return this.maxSteps;
    }
    
    /**
     * 设置最大步骤数
     * @param {number} maxSteps - 最大步骤数
     */
    setMaxSteps(maxSteps) {
        if (maxSteps < 1) {
            throw new Error('最大步骤数必须大于0');
        }
        
        this.maxSteps = maxSteps;
        
        // 调整栈大小
        if (this.undoStack.length > maxSteps) {
            this.undoStack = this.undoStack.slice(-maxSteps);
        }
        
        if (this.redoStack.length > maxSteps) {
            this.redoStack = this.redoStack.slice(-maxSteps);
        }
    }
    
    /**
     * 获取最近的撤销动作描述
     * @returns {string|null} 动作描述
     */
    getLastUndoAction() {
        if (this.undoStack.length === 0) return null;
        return this.undoStack[this.undoStack.length - 1].action;
    }
    
    /**
     * 获取最近的重做动作描述
     * @returns {string|null} 动作描述
     */
    getLastRedoAction() {
        if (this.redoStack.length === 0) return null;
        return this.redoStack[this.redoStack.length - 1].action;
    }
    
    /**
     * 获取所有历史记录
     * @returns {Array} 历史记录数组
     */
    getAllHistory() {
        return {
            undoStack: [...this.undoStack],
            redoStack: [...this.redoStack],
            maxSteps: this.maxSteps,
            enabled: this.enabled
        };
    }
    
    /**
     * 清空历史记录
     */
    clear() {
        this.undoStack = [];
        this.redoStack = [];
        
        this.emit('historyCleared');
    }
    
    /**
     * 启用/禁用历史记录
     * @param {boolean} enabled - 是否启用
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        
        if (!enabled) {
            this.clear();
        }
    }
    
    /**
     * 生成快照ID
     * @returns {string} 快照ID
     */
    generateSnapshotId() {
        return 'snapshot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * 深克隆对象
     * @param {Object} obj - 要克隆的对象
     * @returns {Object} 克隆的对象
     */
    deepClone(obj) {
        // 简单实现，适用于JSON可序列化对象
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (error) {
            console.error('深克隆失败:', error);
            // 回退到浅克隆
            return { ...obj };
        }
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
    
    /**
     * 批量记录操作
     * @param {Array} operations - 操作数组
     * @param {string} groupName - 组名
     */
    recordBatch(operations, groupName = '批量操作') {
        if (!this.enabled || !operations || operations.length === 0) return;
        
        const batchSnapshot = {
            state: {
                operations: this.deepClone(operations),
                groupName: groupName
            },
            action: `${groupName} (${operations.length}个操作)`,
            timestamp: new Date().toISOString(),
            id: this.generateSnapshotId(),
            isBatch: true
        };
        
        this.record(batchSnapshot.state, batchSnapshot.action);
    }
    
    /**
     * 获取历史统计信息
     * @returns {Object} 统计信息
     */
    getStats() {
        return {
            totalUndoable: this.undoStack.length,
            totalRedoable: this.redoStack.length,
            maxSteps: this.maxSteps,
            enabled: this.enabled,
            lastUndoAction: this.getLastUndoAction(),
            lastRedoAction: this.getLastRedoAction()
        };
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HistoryManager;
}