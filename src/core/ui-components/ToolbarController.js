/**
 * 工具栏控制器
 * 管理工具栏按钮状态和事件
 */
class ToolbarController {
    /**
     * 创建工具栏控制器
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        this.options = {
            toolbarId: 'mainToolbar',
            enableShortcuts: true,
            animationDuration: 200,
            ...options
        };

        this.toolbar = null;
        this.buttons = new Map();
        this.buttonStates = new Map();
        this.shortcuts = new Map();

        // 事件监听器
        this.eventListeners = new Map();

        // 初始化
        this.init();
    }

    /**
     * 初始化工具栏
     */
    init() {
        this.toolbar = document.getElementById(this.options.toolbarId);

        if (!this.toolbar) {
            console.warn(`工具栏元素未找到: ${this.options.toolbarId}`);
            return;
        }

        // 收集所有按钮
        this.collectButtons();

        // 绑定事件
        this.bindEvents();

        // 初始化快捷键
        if (this.options.enableShortcuts) {
            this.initShortcuts();
        }

        // 初始状态
        this.updateButtonStates();

        this.emit('initialized', { buttonCount: this.buttons.size });
    }

    /**
     * 收集工具栏按钮
     */
    collectButtons() {
        const buttonElements = this.toolbar.querySelectorAll('.toolbar-btn, .theme-btn, .primary-btn, .secondary-btn');

        buttonElements.forEach(button => {
            const buttonId = button.id;
            if (buttonId) {
                this.buttons.set(buttonId, button);
                this.buttonStates.set(buttonId, {
                    enabled: true,
                    visible: true,
                    active: false,
                    loading: false
                });

                // 提取快捷键信息
                const title = button.getAttribute('title') || '';
                const shortcutMatch = title.match(/\(([^)]+)\)/);
                if (shortcutMatch) {
                    this.shortcuts.set(buttonId, shortcutMatch[1]);
                }
            }
        });
    }

    /**
     * 绑定按钮事件
     */
    bindEvents() {
        this.buttons.forEach((button, buttonId) => {
            button.addEventListener('click', (event) => {
                this.handleButtonClick(buttonId, event);
            });

            button.addEventListener('mouseenter', () => {
                this.handleButtonHover(buttonId, true);
            });

            button.addEventListener('mouseleave', () => {
                this.handleButtonHover(buttonId, false);
            });
        });
    }

    /**
     * 初始化快捷键
     */
    initShortcuts() {
        document.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });
    }

    /**
     * 处理按钮点击
     * @param {string} buttonId - 按钮ID
     * @param {Event} event - 点击事件
     */
    handleButtonClick(buttonId, event) {
        const button = this.buttons.get(buttonId);
        const state = this.buttonStates.get(buttonId);

        if (!button || !state.enabled) {
            return;
        }

        // 防止重复点击
        if (state.loading) {
            return;
        }

        // 添加点击反馈
        this.addClickFeedback(button);

        // 触发事件
        this.emit('buttonClick', {
            buttonId,
            button,
            event,
            state: { ...state }
        });

        // 特定按钮处理
        switch (buttonId) {
            case 'btnNew':
                this.handleNewButton();
                break;
            case 'btnSave':
                this.handleSaveButton();
                break;
            case 'btnUndo':
                this.handleUndoButton();
                break;
            case 'btnRedo':
                this.handleRedoButton();
                break;
            case 'btnAddRoot':
                this.handleAddRootButton();
                break;
            case 'btnEdit':
                this.handleEditButton();
                break;
            case 'btnDelete':
                this.handleDeleteButton();
                break;
            case 'btnExport':
                this.handleExportButton();
                break;
            case 'btnImport':
                this.handleImportButton();
                break;
            case 'btnFullscreen':
                this.handleFullscreenButton();
                break;
            case 'btnThemeLight':
                this.handleThemeLightButton();
                break;
            case 'btnThemeDark':
                this.handleThemeDarkButton();
                break;
        }
    }

    /**
     * 处理按钮悬停
     * @param {string} buttonId - 按钮ID
     * @param {boolean} isHovering - 是否悬停
     */
    handleButtonHover(buttonId, isHovering) {
        const button = this.buttons.get(buttonId);

        if (!button) return;

        if (isHovering) {
            button.classList.add('hover');
            this.emit('buttonHover', { buttonId, button, isHovering: true });
        } else {
            button.classList.remove('hover');
            this.emit('buttonHover', { buttonId, button, isHovering: false });
        }
    }

    /**
     * 处理键盘按下
     * @param {KeyboardEvent} event - 键盘事件
     */
    handleKeyDown(event) {
        // 检查是否在输入框中
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        const key = event.key.toLowerCase();
        const ctrlKey = event.ctrlKey || event.metaKey;
        const shiftKey = event.shiftKey;

        // 检查快捷键
        this.shortcuts.forEach((shortcut, buttonId) => {
            if (this.matchesShortcut(shortcut, key, ctrlKey, shiftKey)) {
                event.preventDefault();
                this.triggerButton(buttonId);
            }
        });
    }

    /**
     * 检查是否匹配快捷键
     * @param {string} shortcut - 快捷键描述
     * @param {string} key - 按下的键
     * @param {boolean} ctrlKey - Ctrl键是否按下
     * @param {boolean} shiftKey - Shift键是否按下
     * @returns {boolean} 是否匹配
     */
    matchesShortcut(shortcut, key, ctrlKey, shiftKey) {
        const shortcutLower = shortcut.toLowerCase();

        // 解析快捷键
        if (shortcutLower.includes('ctrl+')) {
            if (!ctrlKey) return false;
            const shortcutKey = shortcutLower.replace('ctrl+', '').trim();
            return shortcutKey === key;
        }

        if (shortcutLower.includes('shift+')) {
            if (!shiftKey) return false;
            const shortcutKey = shortcutLower.replace('shift+', '').trim();
            return shortcutKey === key;
        }

        // 功能键
        const functionKeys = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'];
        if (functionKeys.includes(key) && shortcutLower === key) {
            return true;
        }

        // 单个键
        return shortcutLower === key;
    }

    /**
     * 触发按钮点击
     * @param {string} buttonId - 按钮ID
     */
    triggerButton(buttonId) {
        const button = this.buttons.get(buttonId);
        if (button) {
            button.click();
        }
    }

    /**
     * 添加点击反馈
     * @param {HTMLElement} button - 按钮元素
     */
    addClickFeedback(button) {
        button.classList.add('clicked');

        setTimeout(() => {
            button.classList.remove('clicked');
        }, this.options.animationDuration);
    }

    /**
     * 更新按钮状态
     */
    updateButtonStates() {
        this.buttons.forEach((button, buttonId) => {
            const state = this.buttonStates.get(buttonId);

            // 更新DOM状态
            if (state.enabled) {
                button.removeAttribute('disabled');
                button.classList.remove('disabled');
            } else {
                button.setAttribute('disabled', 'disabled');
                button.classList.add('disabled');
            }

            if (state.visible) {
                button.style.display = '';
            } else {
                button.style.display = 'none';
            }

            if (state.active) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }

            if (state.loading) {
                button.classList.add('loading');
                const originalHTML = button.innerHTML;
                button.setAttribute('data-original-html', originalHTML);
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';
            } else {
                button.classList.remove('loading');
                const originalHTML = button.getAttribute('data-original-html');
                if (originalHTML) {
                    button.innerHTML = originalHTML;
                    button.removeAttribute('data-original-html');
                }
            }
        });
    }

    /**
     * 设置按钮状态
     * @param {string} buttonId - 按钮ID
     * @param {Object} state - 状态对象
     */
    setButtonState(buttonId, state) {
        if (!this.buttonStates.has(buttonId)) {
            console.warn(`按钮不存在: ${buttonId}`);
            return;
        }

        const currentState = this.buttonStates.get(buttonId);
        this.buttonStates.set(buttonId, { ...currentState, ...state });

        this.updateButtonStates();

        this.emit('buttonStateChanged', { buttonId, state: this.buttonStates.get(buttonId) });
    }

    /**
     * 启用/禁用按钮
     * @param {string} buttonId - 按钮ID
     * @param {boolean} enabled - 是否启用
     */
    setButtonEnabled(buttonId, enabled) {
        this.setButtonState(buttonId, { enabled });
    }

    /**
     * 显示/隐藏按钮
     * @param {string} buttonId - 按钮ID
     * @param {boolean} visible - 是否可见
     */
    setButtonVisible(buttonId, visible) {
        this.setButtonState(buttonId, { visible });
    }

    /**
     * 设置按钮激活状态
     * @param {string} buttonId - 按钮ID
     * @param {boolean} active - 是否激活
     */
    setButtonActive(buttonId, active) {
        this.setButtonState(buttonId, { active });
    }

    /**
     * 设置按钮加载状态
     * @param {string} buttonId - 按钮ID
     * @param {boolean} loading - 是否加载中
     */
    setButtonLoading(buttonId, loading) {
        this.setButtonState(buttonId, { loading });
    }

    /**
     * 批量更新按钮状态
     * @param {Object} states - 状态映射
     */
    updateButtons(states) {
        Object.keys(states).forEach(buttonId => {
            if (this.buttonStates.has(buttonId)) {
                const currentState = this.buttonStates.get(buttonId);
                this.buttonStates.set(buttonId, { ...currentState, ...states[buttonId] });
            }
        });

        this.updateButtonStates();
    }

    /**
     * 获取按钮状态
     * @param {string} buttonId - 按钮ID
     * @returns {Object|null} 按钮状态
     */
    getButtonState(buttonId) {
        return this.buttonStates.get(buttonId) || null;
    }

    /**
     * 获取所有按钮状态
     * @returns {Object} 所有按钮状态
     */
    getAllButtonStates() {
        const states = {};
        this.buttonStates.forEach((state, buttonId) => {
            states[buttonId] = { ...state };
        });
        return states;
    }

    /**
     * 添加新按钮
     * @param {Object} config - 按钮配置
     * @returns {string} 按钮ID
     */
    addButton(config) {
        const {
            id,
            text,
            icon,
            title,
            className = 'toolbar-btn',
            group = 'custom',
            position = 'append'
        } = config;

        if (!id) {
            throw new Error('按钮必须包含ID');
        }

        // 创建按钮元素
        const button = document.createElement('button');
        button.id = id;
        button.className = className;
        button.title = title || text;

        // 设置内容
        let html = '';
        if (icon) {
            html += `<i class="${icon}"></i> `;
        }
        if (text) {
            html += `<span>${text}</span>`;
        }
        button.innerHTML = html;

        // 添加到工具栏
        let targetGroup = this.toolbar.querySelector(`.toolbar-group.${group}`);
        if (!targetGroup) {
            targetGroup = document.createElement('div');
            targetGroup.className = `toolbar-group ${group}`;

            if (position === 'prepend') {
                this.toolbar.prepend(targetGroup);
            } else {
                this.toolbar.appendChild(targetGroup);
            }
        }

        targetGroup.appendChild(button);

        // 注册按钮
        this.buttons.set(id, button);
        this.buttonStates.set(id, {
            enabled: true,
            visible: true,
            active: false,
            loading: false
        });

        // 绑定事件
        button.addEventListener('click', (event) => {
            this.handleButtonClick(id, event);
        });

        // 更新状态
        this.updateButtonStates();

        this.emit('buttonAdded', { buttonId: id, button, config });

        return id;
    }

    /**
     * 移除按钮
     * @param {string} buttonId - 按钮ID
     */
    removeButton(buttonId) {
        const button = this.buttons.get(buttonId);
        if (!button) return;

        button.remove();
        this.buttons.delete(buttonId);
        this.buttonStates.delete(buttonId);
        this.shortcuts.delete(buttonId);

        this.emit('buttonRemoved', { buttonId });
    }

    /**
     * 处理新建按钮
     */
    handleNewButton() {
        this.emit('newRequested');
    }

    /**
     * 处理保存按钮
     */
    handleSaveButton() {
        this.emit('saveRequested');
    }

    /**
     * 处理撤销按钮
     */
    handleUndoButton() {
        this.emit('undoRequested');
    }

    /**
     * 处理重做按钮
     */
    handleRedoButton() {
        this.emit('redoRequested');
    }

    /**
     * 处理添加根节点按钮
     */
    handleAddRootButton() {
        this.emit('addRootRequested');
    }

    /**
     * 处理编辑按钮
     */
    handleEditButton() {
        this.emit('editRequested');
    }

    /**
     * 处理删除按钮
     */
    handleDeleteButton() {
        this.emit('deleteRequested');
    }

    /**
     * 处理导出按钮
     */
    handleExportButton() {
        this.emit('exportRequested');
    }

    /**
     * 处理导入按钮
     */
    handleImportButton() {
        this.emit('importRequested');
    }

    /**
     * 处理全屏按钮
     */
    handleFullscreenButton() {
        this.emit('fullscreenRequested');
    }

    /**
     * 处理浅色主题按钮
     */
    handleThemeLightButton() {
        this.emit('themeChangeRequested', { theme: 'light-blue' });
    }

    /**
     * 处理深色主题按钮
     */
    handleThemeDarkButton() {
        this.emit('themeChangeRequested', { theme: 'dark-gold' });
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
     * 销毁工具栏控制器
     */
    destroy() {
        // 移除事件监听器
        this.buttons.forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });

        // 清除数据
        this.buttons.clear();
        this.buttonStates.clear();
        this.shortcuts.clear();
        this.eventListeners.clear();

        this.toolbar = null;
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToolbarController;
}

// ES6模块导出
export { ToolbarController };
