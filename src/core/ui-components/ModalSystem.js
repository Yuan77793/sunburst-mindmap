/**
 * 模态对话框系统
 * 管理模态对话框的显示、隐藏和交互
 */
class ModalSystem {
    /**
     * 创建模态对话框系统
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        this.options = {
            overlayId: 'modalOverlay',
            modalId: 'modal',
            animationDuration: 300,
            closeOnEsc: true,
            closeOnOverlayClick: true,
            focusTrap: true,
            ...options
        };

        this.overlay = null;
        this.modal = null;
        this.modalTitle = null;
        this.modalBody = null;
        this.modalFooter = null;
        this.modalConfirm = null;
        this.modalCancel = null;
        this.modalClose = null;

        this.isVisible = false;
        this.currentModalType = null;
        this.currentModalData = null;
        this.resolvePromise = null;
        this.rejectPromise = null;

        // 事件监听器
        this.eventListeners = new Map();

        // 焦点管理
        this.focusableElements = [];
        this.currentFocusIndex = 0;

        // 初始化
        this.init();
    }

    /**
     * 初始化模态对话框系统
     */
    init() {
        this.overlay = document.getElementById(this.options.overlayId);
        this.modal = document.getElementById(this.options.modalId);

        if (!this.overlay || !this.modal) {
            console.warn('模态对话框元素未找到，尝试创建');
            this.createModalElements();
        }

        // 获取子元素
        this.modalTitle = this.modal.querySelector('.modal-title');
        this.modalBody = this.modal.querySelector('.modal-body');
        this.modalFooter = this.modal.querySelector('.modal-footer');
        this.modalConfirm = this.modal.querySelector('#modalConfirm');
        this.modalCancel = this.modal.querySelector('#modalCancel');
        this.modalClose = this.modal.querySelector('.modal-close');

        // 绑定事件
        this.bindEvents();

        // 初始隐藏
        this.hide();

        this.emit('initialized', {
            overlay: this.overlay,
            modal: this.modal
        });
    }

    /**
     * 创建模态对话框元素
     */
    createModalElements() {
        // 创建遮罩层
        this.overlay = document.createElement('div');
        this.overlay.id = this.options.overlayId;
        this.overlay.className = 'modal-overlay';
        this.overlay.style.display = 'none';

        // 创建模态框
        this.modal = document.createElement('div');
        this.modal.id = this.options.modalId;
        this.modal.className = 'modal';

        // 创建头部
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';

        this.modalTitle = document.createElement('h3');
        this.modalTitle.className = 'modal-title';
        this.modalTitle.textContent = '对话框标题';

        this.modalClose = document.createElement('button');
        this.modalClose.className = 'modal-close';
        this.modalClose.innerHTML = '<i class="fas fa-times"></i>';

        modalHeader.appendChild(this.modalTitle);
        modalHeader.appendChild(this.modalClose);

        // 创建主体
        this.modalBody = document.createElement('div');
        this.modalBody.className = 'modal-body';
        this.modalBody.innerHTML = '<!-- 动态内容 -->';

        // 创建底部
        this.modalFooter = document.createElement('div');
        this.modalFooter.className = 'modal-footer';

        this.modalConfirm = document.createElement('button');
        this.modalConfirm.id = 'modalConfirm';
        this.modalConfirm.className = 'primary-btn';
        this.modalConfirm.textContent = '确认';

        this.modalCancel = document.createElement('button');
        this.modalCancel.id = 'modalCancel';
        this.modalCancel.className = 'secondary-btn';
        this.modalCancel.textContent = '取消';

        this.modalFooter.appendChild(this.modalConfirm);
        this.modalFooter.appendChild(this.modalCancel);

        // 组装模态框
        this.modal.appendChild(modalHeader);
        this.modal.appendChild(this.modalBody);
        this.modal.appendChild(this.modalFooter);

        // 添加到遮罩层
        this.overlay.appendChild(this.modal);

        // 添加到文档
        document.body.appendChild(this.overlay);
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 关闭按钮
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => {
                this.hide();
            });
        }

        // 确认按钮
        if (this.modalConfirm) {
            this.modalConfirm.addEventListener('click', () => {
                this.handleConfirm();
            });
        }

        // 取消按钮
        if (this.modalCancel) {
            this.modalCancel.addEventListener('click', () => {
                this.handleCancel();
            });
        }

        // 遮罩层点击
        if (this.options.closeOnOverlayClick) {
            this.overlay.addEventListener('click', (event) => {
                if (event.target === this.overlay) {
                    this.hide();
                }
            });
        }

        // ESC键关闭
        if (this.options.closeOnEsc) {
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && this.isVisible) {
                    this.hide();
                }
            });
        }

        // 焦点陷阱
        if (this.options.focusTrap) {
            this.modal.addEventListener('keydown', (event) => {
                this.handleFocusTrap(event);
            });
        }
    }

    /**
     * 显示模态对话框
     * @param {Object} config - 对话框配置
     * @returns {Promise} 返回Promise，用户操作后resolve
     */
    show(config = {}) {
        return new Promise((resolve, reject) => {
            this.resolvePromise = resolve;
            this.rejectPromise = reject;

            this.currentModalType = config.type || 'default';
            this.currentModalData = config.data || {};

            // 更新对话框内容
            this.updateModalContent(config);

            // 显示对话框
            this.overlay.style.display = 'flex';
            this.isVisible = true;

            // 添加显示动画
            setTimeout(() => {
                this.overlay.classList.add('visible');
                this.modal.classList.add('visible');

                // 设置焦点
                this.setInitialFocus();

                this.emit('shown', { config, modal: this.modal });
            }, 10);
        });
    }

    /**
     * 隐藏模态对话框
     */
    hide() {
        if (!this.isVisible) return;

        // 移除显示动画
        this.overlay.classList.remove('visible');
        this.modal.classList.remove('visible');

        setTimeout(() => {
            this.overlay.style.display = 'none';
            this.isVisible = false;

            // 清理焦点
            this.clearFocus();

            // 重置Promise
            if (this.rejectPromise) {
                this.rejectPromise(new Error('对话框已关闭'));
                this.resolvePromise = null;
                this.rejectPromise = null;
            }

            this.emit('hidden');
        }, this.options.animationDuration);
    }

    /**
     * 更新对话框内容
     * @param {Object} config - 对话框配置
     */
    updateModalContent(config) {
        // 标题
        if (config.title && this.modalTitle) {
            this.modalTitle.textContent = config.title;
        }

        // 内容
        if (config.content && this.modalBody) {
            if (typeof config.content === 'string') {
                this.modalBody.innerHTML = config.content;
            } else if (config.content instanceof HTMLElement) {
                this.modalBody.innerHTML = '';
                this.modalBody.appendChild(config.content);
            } else if (typeof config.content === 'function') {
                const content = config.content();
                if (content instanceof HTMLElement) {
                    this.modalBody.innerHTML = '';
                    this.modalBody.appendChild(content);
                } else {
                    this.modalBody.innerHTML = content;
                }
            }
        }

        // 按钮文本
        if (config.confirmText && this.modalConfirm) {
            this.modalConfirm.textContent = config.confirmText;
        }

        if (config.cancelText && this.modalCancel) {
            this.modalCancel.textContent = config.cancelText;
        }

        // 按钮可见性
        if (config.showConfirm !== undefined && this.modalConfirm) {
            this.modalConfirm.style.display = config.showConfirm ? '' : 'none';
        }

        if (config.showCancel !== undefined && this.modalCancel) {
            this.modalCancel.style.display = config.showCancel ? '' : 'none';
        }

        // 自定义类名
        if (config.className) {
            this.modal.className = `modal ${config.className}`;
        } else {
            this.modal.className = 'modal';
        }

        // 大小
        if (config.size) {
            this.modal.classList.add(`modal-${config.size}`);
        }
    }

    /**
     * 处理确认按钮点击
     */
    handleConfirm() {
        const result = {
            confirmed: true,
            data: this.currentModalData,
            type: this.currentModalType
        };

        this.emit('confirmed', result);

        if (this.resolvePromise) {
            this.resolvePromise(result);
            this.resolvePromise = null;
            this.rejectPromise = null;
        }

        this.hide();
    }

    /**
     * 处理取消按钮点击
     */
    handleCancel() {
        const result = {
            confirmed: false,
            data: this.currentModalData,
            type: this.currentModalType
        };

        this.emit('cancelled', result);

        if (this.resolvePromise) {
            this.resolvePromise(result);
            this.resolvePromise = null;
            this.rejectPromise = null;
        }

        this.hide();
    }

    /**
     * 设置初始焦点
     */
    setInitialFocus() {
        if (!this.options.focusTrap) return;

        // 收集可聚焦元素
        this.collectFocusableElements();

        // 设置焦点到第一个可聚焦元素
        if (this.focusableElements.length > 0) {
            this.focusableElements[0].focus();
            this.currentFocusIndex = 0;
        }
    }

    /**
     * 收集可聚焦元素
     */
    collectFocusableElements() {
        this.focusableElements = Array.from(
            this.modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
        ).filter(element => {
            return !element.disabled && element.offsetParent !== null;
        });
    }

    /**
     * 处理焦点陷阱
     * @param {KeyboardEvent} event - 键盘事件
     */
    handleFocusTrap(event) {
        if (event.key !== 'Tab') return;

        event.preventDefault();

        // 更新焦点索引
        if (event.shiftKey) {
            // Shift+Tab: 向前移动
            this.currentFocusIndex--;
            if (this.currentFocusIndex < 0) {
                this.currentFocusIndex = this.focusableElements.length - 1;
            }
        } else {
            // Tab: 向后移动
            this.currentFocusIndex++;
            if (this.currentFocusIndex >= this.focusableElements.length) {
                this.currentFocusIndex = 0;
            }
        }

        // 设置焦点
        if (this.focusableElements[this.currentFocusIndex]) {
            this.focusableElements[this.currentFocusIndex].focus();
        }
    }

    /**
     * 清理焦点
     */
    clearFocus() {
        this.focusableElements = [];
        this.currentFocusIndex = 0;
    }

    /**
     * 显示确认对话框
     * @param {Object} config - 配置
     * @returns {Promise} 用户选择结果
     */
    confirm(config) {
        const defaultConfig = {
            type: 'confirm',
            title: '确认操作',
            content: '确定要执行此操作吗？',
            confirmText: '确定',
            cancelText: '取消',
            showConfirm: true,
            showCancel: true,
            ...config
        };

        return this.show(defaultConfig);
    }

    /**
     * 显示警告对话框
     * @param {Object} config - 配置
     * @returns {Promise} 用户选择结果
     */
    alert(config) {
        const defaultConfig = {
            type: 'alert',
            title: '提示',
            content: config.message || '操作完成',
            confirmText: '确定',
            showConfirm: true,
            showCancel: false,
            ...config
        };

        return this.show(defaultConfig);
    }

    /**
     * 显示提示对话框
     * @param {Object} config - 配置
     * @returns {Promise} 用户输入结果
     */
    prompt(config) {
        const inputId = `modal-prompt-input-${Date.now()}`;
        const input = document.createElement('input');
        input.type = 'text';
        input.id = inputId;
        input.className = 'modal-input';
        input.placeholder = config.placeholder || '请输入';
        input.value = config.defaultValue || '';

        const content = document.createElement('div');
        content.className = 'modal-prompt';

        if (config.message) {
            const message = document.createElement('p');
            message.textContent = config.message;
            content.appendChild(message);
        }

        content.appendChild(input);

        const defaultConfig = {
            type: 'prompt',
            title: config.title || '输入',
            content: content,
            confirmText: '确定',
            cancelText: '取消',
            showConfirm: true,
            showCancel: true,
            data: { inputId },
            ...config
        };

        return this.show(defaultConfig).then(result => {
            if (result.confirmed) {
                const inputElement = document.getElementById(inputId);
                return {
                    ...result,
                    value: inputElement ? inputElement.value : ''
                };
            }
            return result;
        });
    }

    /**
     * 显示节点编辑对话框
     * @param {Object} node - 节点数据
     * @returns {Promise} 编辑结果
     */
    showNodeEditor(node = {}) {
        const form = document.createElement('form');
        form.className = 'modal-form';

        // 名称字段
        const nameGroup = document.createElement('div');
        nameGroup.className = 'form-group';

        const nameLabel = document.createElement('label');
        nameLabel.textContent = '节点名称';
        nameLabel.htmlFor = 'node-name';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'node-name';
        nameInput.className = 'form-input';
        nameInput.value = node.name || '';
        nameInput.required = true;

        nameGroup.appendChild(nameLabel);
        nameGroup.appendChild(nameInput);

        // 描述字段
        const descGroup = document.createElement('div');
        descGroup.className = 'form-group';

        const descLabel = document.createElement('label');
        descLabel.textContent = '描述';
        descLabel.htmlFor = 'node-desc';

        const descTextarea = document.createElement('textarea');
        descTextarea.id = 'node-desc';
        descTextarea.className = 'form-textarea';
        descTextarea.rows = 3;
        descTextarea.value = node.description || '';

        descGroup.appendChild(descLabel);
        descGroup.appendChild(descTextarea);

        // 颜色字段
        const colorGroup = document.createElement('div');
        colorGroup.className = 'form-group';

        const colorLabel = document.createElement('label');
        colorLabel.textContent = '颜色';
        colorLabel.htmlFor = 'node-color';

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.id = 'node-color';
        colorInput.className = 'form-color';
        colorInput.value = node.color || '#36A1D6';

        colorGroup.appendChild(colorLabel);
        colorGroup.appendChild(colorInput);

        form.appendChild(nameGroup);
        form.appendChild(descGroup);
        form.appendChild(colorGroup);

        const defaultConfig = {
            type: 'node-editor',
            title: node.id ? '编辑节点' : '添加节点',
            content: form,
            confirmText: '保存',
            cancelText: '取消',
            showConfirm: true,
            showCancel: true,
            data: { node, formId: form.id },
            size: 'medium'
        };

        return this.show(defaultConfig).then(result => {
            if (result.confirmed) {
                const nameValue = document.getElementById('node-name').value;
                const descValue = document.getElementById('node-desc').value;
                const colorValue = document.getElementById('node-color').value;

                return {
                    ...result,
                    data: {
                        name: nameValue,
                        description: descValue,
                        color: colorValue,
                        originalNode: node
                    }
                };
            }
            return result;
        });
    }

    /**
     * 显示导出选项对话框
     * @returns {Promise} 导出选项
     */
    showExportDialog() {
        const content = document.createElement('div');
        content.className = 'modal-export-options';

        const formatGroup = document.createElement('div');
        formatGroup.className = 'export-format-group';

        const formats = [
            { id: 'json', label: 'JSON格式', icon: 'fas fa-file-code', description: '导出为JSON数据文件' },
            { id: 'png', label: 'PNG图片', icon: 'fas fa-file-image', description: '导出为PNG图片' },
            { id: 'svg', label: 'SVG矢量图', icon: 'fas fa-file-alt', description: '导出为SVG矢量图' }
        ];

        formats.forEach(format => {
            const option = document.createElement('div');
            option.className = 'export-option';
            option.dataset.format = format.id;

            const icon = document.createElement('i');
            icon.className = format.icon;

            const text = document.createElement('div');
            text.className = 'export-option-text';

            const title = document.createElement('div');
            title.className = 'export-option-title';
            title.textContent = format.label;

            const desc = document.createElement('div');
            desc.className = 'export-option-desc';
            desc.textContent = format.description;

            text.appendChild(title);
            text.appendChild(desc);

            option.appendChild(icon);
            option.appendChild(text);

            option.addEventListener('click', () => {
                formatGroup.querySelectorAll('.export-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');
            });

            formatGroup.appendChild(option);
        });

        // 默认选择第一个
        formatGroup.querySelector('.export-option').classList.add('selected');

        content.appendChild(formatGroup);

        const defaultConfig = {
            type: 'export',
            title: '导出选项',
            content: content,
            confirmText: '导出',
            cancelText: '取消',
            showConfirm: true,
            showCancel: true,
            size: 'large'
        };

        return this.show(defaultConfig).then(result => {
            if (result.confirmed) {
                const selectedOption = formatGroup.querySelector('.export-option.selected');
                const format = selectedOption ? selectedOption.dataset.format : 'json';

                return {
                    ...result,
                    data: { format }
                };
            }
            return result;
        });
    }

    /**
     * 获取当前状态
     * @returns {Object} 状态信息
     */
    getState() {
        return {
            isVisible: this.isVisible,
            currentModalType: this.currentModalType,
            currentModalData: this.currentModalData,
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
     * 销毁模态对话框系统
     */
    destroy() {
        this.hide();

        // 移除事件监听器
        if (this.modalClose) {
            this.modalClose.removeEventListener('click', this.boundCloseHandler);
        }

        if (this.modalConfirm) {
            this.modalConfirm.removeEventListener('click', this.boundConfirmHandler);
        }

        if (this.modalCancel) {
            this.modalCancel.removeEventListener('click', this.boundCancelHandler);
        }

        // 移除元素
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }

        // 清除数据
        this.eventListeners.clear();
        this.focusableElements = [];

        this.overlay = null;
        this.modal = null;
        this.modalTitle = null;
        this.modalBody = null;
        this.modalFooter = null;
        this.modalConfirm = null;
        this.modalCancel = null;
        this.modalClose = null;

        this.isVisible = false;
        this.currentModalType = null;
        this.currentModalData = null;
        this.resolvePromise = null;
        this.rejectPromise = null;
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalSystem;
}

// ES6模块导出
export { ModalSystem };
