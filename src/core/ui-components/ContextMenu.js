/**
 * 右键菜单组件
 * 自定义右键菜单，支持动态菜单项
 */
class ContextMenu {
    /**
     * 创建右键菜单
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        this.options = {
            menuId: 'contextMenu',
            animationDuration: 200,
            autoHide: true,
            maxItems: 15,
            ...options
        };
        
        this.menu = null;
        this.isVisible = false;
        this.currentTarget = null;
        this.menuItems = new Map();
        
        // 事件监听器
        this.eventListeners = new Map();
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化右键菜单
     */
    init() {
        this.menu = document.getElementById(this.options.menuId);
        
        if (!this.menu) {
            console.warn(`右键菜单元素未找到: ${this.options.menuId}`);
            this.createMenuElement();
        }
        
        // 绑定事件
        this.bindEvents();
        
        // 初始隐藏
        this.hide();
        
        this.emit('initialized', { menu: this.menu });
    }
    
    /**
     * 创建菜单元素
     */
    createMenuElement() {
        this.menu = document.createElement('div');
        this.menu.id = this.options.menuId;
        this.menu.className = 'context-menu';
        this.menu.style.display = 'none';
        
        const menuList = document.createElement('ul');
        menuList.className = 'context-menu-list';
        this.menu.appendChild(menuList);
        
        document.body.appendChild(this.menu);
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 全局点击隐藏菜单
        document.addEventListener('click', (event) => {
            if (this.isVisible && this.options.autoHide) {
                // 检查点击是否在菜单内
                if (!this.menu.contains(event.target)) {
                    this.hide();
                }
            }
        });
        
        // ESC键隐藏菜单
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
        
        // 菜单项点击事件
        this.menu.addEventListener('click', (event) => {
            const menuItem = event.target.closest('.context-menu-item');
            if (menuItem) {
                event.preventDefault();
                event.stopPropagation();
                
                const action = menuItem.getAttribute('data-action');
                const data = menuItem.getAttribute('data-context-data');
                
                this.handleMenuItemClick(action, data ? JSON.parse(data) : null);
                
                if (this.options.autoHide) {
                    this.hide();
                }
            }
        });
    }
    
    /**
     * 显示菜单
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {Object} context - 上下文数据
     */
    show(x, y, context = {}) {
        if (!this.menu) return;
        
        // 更新上下文
        this.currentTarget = context.target || null;
        
        // 更新菜单项（基于上下文）
        this.updateMenuItems(context);
        
        // 定位菜单
        this.positionMenu(x, y);
        
        // 显示菜单
        this.menu.style.display = 'block';
        this.isVisible = true;
        
        // 添加显示动画
        this.menu.classList.add('visible');
        
        this.emit('shown', { x, y, context });
    }
    
    /**
     * 隐藏菜单
     */
    hide() {
        if (!this.menu || !this.isVisible) return;
        
        // 添加隐藏动画
        this.menu.classList.remove('visible');
        
        setTimeout(() => {
            this.menu.style.display = 'none';
            this.isVisible = false;
            this.currentTarget = null;
            
            this.emit('hidden');
        }, this.options.animationDuration);
    }
    
    /**
     * 定位菜单
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     */
    positionMenu(x, y) {
        if (!this.menu) return;
        
        const menuRect = this.menu.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // 调整位置，确保菜单在视口内
        let adjustedX = x;
        let adjustedY = y;
        
        // 检查右边界
        if (x + menuRect.width > windowWidth) {
            adjustedX = windowWidth - menuRect.width - 10;
        }
        
        // 检查下边界
        if (y + menuRect.height > windowHeight) {
            adjustedY = windowHeight - menuRect.height - 10;
        }
        
        // 确保位置不为负
        adjustedX = Math.max(10, adjustedX);
        adjustedY = Math.max(10, adjustedY);
        
        this.menu.style.left = `${adjustedX}px`;
        this.menu.style.top = `${adjustedY}px`;
    }
    
    /**
     * 更新菜单项
     * @param {Object} context - 上下文数据
     */
    updateMenuItems(context) {
        const menuList = this.menu.querySelector('.context-menu-list');
        if (!menuList) return;
        
        // 清空现有菜单项
        menuList.innerHTML = '';
        this.menuItems.clear();
        
        // 获取基于上下文的菜单项
        const items = this.getContextMenuItems(context);
        
        // 限制菜单项数量
        const limitedItems = items.slice(0, this.options.maxItems);
        
        // 创建菜单项
        limitedItems.forEach((item, index) => {
            const menuItem = this.createMenuItem(item, index);
            menuList.appendChild(menuItem);
            this.menuItems.set(item.id || `item_${index}`, menuItem);
        });
        
        // 如果没有菜单项，添加一个占位符
        if (limitedItems.length === 0) {
            const placeholder = document.createElement('li');
            placeholder.className = 'context-menu-item disabled';
            placeholder.textContent = '无可用操作';
            menuList.appendChild(placeholder);
        }
    }
    
    /**
     * 获取基于上下文的菜单项
     * @param {Object} context - 上下文数据
     * @returns {Array} 菜单项数组
     */
    getContextMenuItems(context) {
        const { nodeType = 'node', hasChildren = false, isRoot = false } = context;
        
        const baseItems = [
            {
                id: 'add-child',
                label: '添加子节点',
                icon: 'fas fa-plus',
                action: 'add-child',
                enabled: true,
                visible: true
            },
            {
                id: 'edit',
                label: '编辑节点',
                icon: 'fas fa-edit',
                action: 'edit',
                enabled: true,
                visible: true
            },
            {
                id: 'delete',
                label: '删除节点',
                icon: 'fas fa-trash',
                action: 'delete',
                enabled: !isRoot, // 根节点不能删除
                visible: true
            }
        ];
        
        if (hasChildren) {
            baseItems.push(
                {
                    id: 'separator-1',
                    type: 'separator'
                },
                {
                    id: 'expand',
                    label: '展开所有子节点',
                    icon: 'fas fa-expand',
                    action: 'expand',
                    enabled: true,
                    visible: true
                },
                {
                    id: 'collapse',
                    label: '收起所有子节点',
                    icon: 'fas fa-compress',
                    action: 'collapse',
                    enabled: true,
                    visible: true
                }
            );
        }
        
        // 添加自定义菜单项
        const customItems = this.getCustomMenuItems(context);
        if (customItems.length > 0) {
            baseItems.push(
                {
                    id: 'separator-custom',
                    type: 'separator'
                },
                ...customItems
            );
        }
        
        return baseItems.filter(item => item.visible !== false);
    }
    
    /**
     * 获取自定义菜单项
     * @param {Object} context - 上下文数据
     * @returns {Array} 自定义菜单项
     */
    getCustomMenuItems(context) {
        // 可以由子类重写或通过事件添加
        return [];
    }
    
    /**
     * 创建菜单项元素
     * @param {Object} item - 菜单项配置
     * @param {number} index - 索引
     * @returns {HTMLElement} 菜单项元素
     */
    createMenuItem(item, index) {
        if (item.type === 'separator') {
            const separator = document.createElement('li');
            separator.className = 'context-menu-divider';
            return separator;
        }
        
        const menuItem = document.createElement('li');
        menuItem.className = 'context-menu-item';
        menuItem.setAttribute('data-action', item.action);
        
        if (item.data) {
            menuItem.setAttribute('data-context-data', JSON.stringify(item.data));
        }
        
        if (!item.enabled) {
            menuItem.classList.add('disabled');
        }
        
        // 创建内容
        let html = '';
        if (item.icon) {
            html += `<i class="${item.icon}"></i> `;
        }
        html += `<span>${item.label}</span>`;
        
        // 添加快捷键显示
        if (item.shortcut) {
            html += `<span class="context-menu-shortcut">${item.shortcut}</span>`;
        }
        
        menuItem.innerHTML = html;
        
        // 添加工具提示
        if (item.tooltip) {
            menuItem.title = item.tooltip;
        }
        
        return menuItem;
    }
    
    /**
     * 处理菜单项点击
     * @param {string} action - 动作类型
     * @param {Object} data - 附加数据
     */
    handleMenuItemClick(action, data) {
        const context = {
            target: this.currentTarget,
            action,
            data,
            menu: this
        };
        
        // 触发事件
        this.emit('itemClick', context);
        
        // 特定动作处理
        switch (action) {
            case 'add-child':
                this.emit('addChildRequested', context);
                break;
            case 'edit':
                this.emit('editRequested', context);
                break;
            case 'delete':
                this.emit('deleteRequested', context);
                break;
            case 'expand':
                this.emit('expandRequested', context);
                break;
            case 'collapse':
                this.emit('collapseRequested', context);
                break;
        }
    }
    
    /**
     * 添加自定义菜单项
     * @param {Object} item - 菜单项配置
     */
    addMenuItem(item) {
        if (!item.id) {
            item.id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        
        // 存储自定义菜单项
        if (!this.customItems) {
            this.customItems = [];
        }
        
        this.customItems.push(item);
        this.emit('menuItemAdded', { item });
    }
    
    /**
     * 移除自定义菜单项
     * @param {string} itemId - 菜单项ID
     */
    removeMenuItem(itemId) {
        if (!this.customItems) return;
        
        const index = this.customItems.findIndex(item => item.id === itemId);
        if (index > -1) {
            const removedItem = this.customItems.splice(index, 1)[0];
            this.emit('menuItemRemoved', { item: removedItem });
        }
    }
    
    /**
     * 更新菜单项状态
     * @param {string} itemId - 菜单项ID
     * @param {Object} updates - 更新内容
     */
    updateMenuItem(itemId, updates) {
        const menuItem = this.menuItems.get(itemId);
        if (!menuItem) return;
        
        // 更新启用状态
        if (updates.enabled !== undefined) {
            if (updates.enabled) {
                menuItem.classList.remove('disabled');
            } else {
                menuItem.classList.add('disabled');
            }
        }
        
        // 更新标签
        if (updates.label) {
            const span = menuItem.querySelector('span');
            if (span) {
                span.textContent = updates.label;
            }
        }
        
        // 更新图标
        if (updates.icon) {
            const icon = menuItem.querySelector('i');
            if (icon) {
                icon.className = updates.icon;
            }
        }
        
        this.emit('menuItemUpdated', { itemId, updates });
    }
    
    /**
     * 绑定到元素
     * @param {HTMLElement} element - 目标元素
     * @param {Function} getContext - 获取上下文函数
     */
    bindToElement(element, getContext = null) {
        element.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            
            const context = getContext ? getContext(event) : {
                target: event.target,
                event
            };
            
            this.show(event.clientX, event.clientY, context);
        });
    }
    
    /**
     * 绑定到图表
     * @param {Object} chart - 图表实例
     */
    bindToChart(chart) {
        if (!chart || !chart.getZr) return;
        
        chart.getZr().on('contextmenu', (event) => {
            event.event.preventDefault();
            
            const point = [event.event.offsetX, event.event.offsetY];
            const dataIndex = chart.convertFromPixel('series', point);
            
            let context = {
                target: chart,
                event: event.event,
                chartPoint: point,
                dataIndex
            };
            
            // 如果有数据索引，尝试获取节点信息
            if (dataIndex && dataIndex.dataIndex !== undefined) {
                context.dataIndex = dataIndex.dataIndex;
            }
            
            this.show(event.event.clientX, event.event.clientY, context);
        });
    }
    
    /**
     * 获取当前菜单状态
     * @returns {Object} 菜单状态
     */
    getState() {
        return {
            isVisible: this.isVisible,
            currentTarget: this.currentTarget,
            itemCount: this.menuItems.size,
            options: { ...this.options }
        };
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
     * 销毁右键菜单
     */
    destroy() {
        this.hide();
        
        // 移除事件监听器
        document.removeEventListener('click', this.boundHideHandler);
        document.removeEventListener('keydown', this.boundKeyHandler);
        
        // 移除菜单元素
        if (this.menu && this.menu.parentNode) {
            this.menu.parentNode.removeChild(this.menu);
        }
        
        // 清除数据
        this.menuItems.clear();
        this.eventListeners.clear();
        this.customItems = null;
        
        this.menu = null;
        this.isVisible = false;
        this.currentTarget = null;
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContextMenu;
}

// ES6模块导出
export { ContextMenu };
