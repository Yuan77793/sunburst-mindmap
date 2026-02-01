/**
 * DOM操作工具
 * 提供常用的DOM操作和事件处理函数
 */
class DOMUtils {
    /**
     * 创建元素
     * @param {string} tag - 标签名
     * @param {Object} attributes - 属性对象
     * @param {string|HTMLElement} content - 内容
     * @returns {HTMLElement} 创建的元素
     */
    static createElement(tag, attributes = {}, content = null) {
        const element = document.createElement(tag);
        
        // 设置属性
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else if (key === 'style' && typeof attributes[key] === 'object') {
                Object.assign(element.style, attributes[key]);
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, attributes[key]);
            } else if (key === 'html') {
                element.innerHTML = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        // 设置内容
        if (content !== null) {
            if (typeof content === 'string') {
                element.textContent = content;
            } else if (content instanceof HTMLElement) {
                element.appendChild(content);
            } else if (Array.isArray(content)) {
                content.forEach(child => {
                    if (child instanceof HTMLElement) {
                        element.appendChild(child);
                    }
                });
            }
        }
        
        return element;
    }
    
    /**
     * 获取元素
     * @param {string} selector - CSS选择器
     * @param {HTMLElement} parent - 父元素（可选）
     * @returns {HTMLElement|null} 找到的元素
     */
    static getElement(selector, parent = document) {
        return parent.querySelector(selector);
    }
    
    /**
     * 获取元素列表
     * @param {string} selector - CSS选择器
     * @param {HTMLElement} parent - 父元素（可选）
     * @returns {NodeList} 元素列表
     */
    static getElements(selector, parent = document) {
        return parent.querySelectorAll(selector);
    }
    
    /**
     * 添加类名
     * @param {HTMLElement} element - 元素
     * @param {string} className - 类名
     */
    static addClass(element, className) {
        if (element && className) {
            element.classList.add(className);
        }
    }
    
    /**
     * 移除类名
     * @param {HTMLElement} element - 元素
     * @param {string} className - 类名
     */
    static removeClass(element, className) {
        if (element && className) {
            element.classList.remove(className);
        }
    }
    
    /**
     * 切换类名
     * @param {HTMLElement} element - 元素
     * @param {string} className - 类名
     * @returns {boolean} 切换后是否包含该类名
     */
    static toggleClass(element, className) {
        if (element && className) {
            return element.classList.toggle(className);
        }
        return false;
    }
    
    /**
     * 检查是否包含类名
     * @param {HTMLElement} element - 元素
     * @param {string} className - 类名
     * @returns {boolean} 是否包含
     */
    static hasClass(element, className) {
        return element && element.classList.contains(className);
    }
    
    /**
     * 设置样式
     * @param {HTMLElement} element - 元素
     * @param {Object} styles - 样式对象
     */
    static setStyles(element, styles) {
        if (element && styles) {
            Object.assign(element.style, styles);
        }
    }
    
    /**
     * 获取计算样式
     * @param {HTMLElement} element - 元素
     * @param {string} property - 样式属性
     * @returns {string} 样式值
     */
    static getComputedStyle(element, property) {
        if (!element || !property) return '';
        return window.getComputedStyle(element).getPropertyValue(property);
    }
    
    /**
     * 显示元素
     * @param {HTMLElement} element - 元素
     * @param {string} display - 显示方式（默认 'block'）
     */
    static show(element, display = 'block') {
        if (element) {
            element.style.display = display;
        }
    }
    
    /**
     * 隐藏元素
     * @param {HTMLElement} element - 元素
     */
    static hide(element) {
        if (element) {
            element.style.display = 'none';
        }
    }
    
    /**
     * 切换元素显示/隐藏
     * @param {HTMLElement} element - 元素
     * @param {string} display - 显示时的display值
     * @returns {boolean} 切换后是否显示
     */
    static toggleVisibility(element, display = 'block') {
        if (!element) return false;
        
        if (element.style.display === 'none') {
            this.show(element, display);
            return true;
        } else {
            this.hide(element);
            return false;
        }
    }
    
    /**
     * 设置元素文本
     * @param {HTMLElement} element - 元素
     * @param {string} text - 文本内容
     */
    static setText(element, text) {
        if (element) {
            element.textContent = text;
        }
    }
    
    /**
     * 设置元素HTML
     * @param {HTMLElement} element - 元素
     * @param {string} html - HTML内容
     */
    static setHTML(element, html) {
        if (element) {
            element.innerHTML = html;
        }
    }
    
    /**
     * 清空元素内容
     * @param {HTMLElement} element - 元素
     */
    static clear(element) {
        if (element) {
            element.innerHTML = '';
        }
    }
    
    /**
     * 添加子元素
     * @param {HTMLElement} parent - 父元素
     * @param {HTMLElement} child - 子元素
     */
    static appendChild(parent, child) {
        if (parent && child) {
            parent.appendChild(child);
        }
    }
    
    /**
     * 移除子元素
     * @param {HTMLElement} parent - 父元素
     * @param {HTMLElement} child - 子元素
     */
    static removeChild(parent, child) {
        if (parent && child && parent.contains(child)) {
            parent.removeChild(child);
        }
    }
    
    /**
     * 移除元素
     * @param {HTMLElement} element - 要移除的元素
     */
    static remove(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }
    
    /**
     * 替换元素
     * @param {HTMLElement} oldElement - 旧元素
     * @param {HTMLElement} newElement - 新元素
     */
    static replace(oldElement, newElement) {
        if (oldElement && newElement && oldElement.parentNode) {
            oldElement.parentNode.replaceChild(newElement, oldElement);
        }
    }
    
    /**
     * 克隆元素
     * @param {HTMLElement} element - 元素
     * @param {boolean} deep - 是否深度克隆
     * @returns {HTMLElement} 克隆的元素
     */
    static clone(element, deep = true) {
        if (!element) return null;
        return element.cloneNode(deep);
    }
    
    /**
     * 获取元素位置和尺寸
     * @param {HTMLElement} element - 元素
     * @returns {Object} 位置和尺寸信息
     */
    static getBoundingRect(element) {
        if (!element) return null;
        
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y
        };
    }
    
    /**
     * 获取元素在文档中的位置
     * @param {HTMLElement} element - 元素
     * @returns {Object} 位置信息 {top, left}
     */
    static getOffset(element) {
        if (!element) return { top: 0, left: 0 };
        
        let top = 0;
        let left = 0;
        let current = element;
        
        while (current) {
            top += current.offsetTop;
            left += current.offsetLeft;
            current = current.offsetParent;
        }
        
        return { top, left };
    }
    
    /**
     * 获取视口尺寸
     * @returns {Object} 视口尺寸 {width, height}
     */
    static getViewportSize() {
        return {
            width: window.innerWidth || document.documentElement.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight
        };
    }
    
    /**
     * 获取文档尺寸
     * @returns {Object} 文档尺寸 {width, height}
     */
    static getDocumentSize() {
        return {
            width: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight
        };
    }
    
    /**
     * 获取滚动位置
     * @returns {Object} 滚动位置 {top, left}
     */
    static getScrollPosition() {
        return {
            top: window.pageYOffset || document.documentElement.scrollTop,
            left: window.pageXOffset || document.documentElement.scrollLeft
        };
    }
    
    /**
     * 滚动到元素
     * @param {HTMLElement} element - 元素
     * @param {Object} options - 滚动选项
     */
    static scrollToElement(element, options = {}) {
        if (!element) return;
        
        const defaultOptions = {
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        };
        
        element.scrollIntoView({ ...defaultOptions, ...options });
    }
    
    /**
     * 滚动到指定位置
     * @param {number} top - 顶部位置
     * @param {number} left - 左侧位置
     * @param {Object} options - 滚动选项
     */
    static scrollTo(top, left = 0, options = {}) {
        const defaultOptions = {
            behavior: 'smooth'
        };
        
        window.scrollTo({
            top,
            left,
            behavior: options.behavior || 'smooth'
        });
    }
    
    /**
     * 添加事件监听器
     * @param {HTMLElement} element - 元素
     * @param {string} event - 事件类型
     * @param {Function} handler - 事件处理函数
     * @param {Object} options - 事件选项
     */
    static on(element, event, handler, options = {}) {
        if (element && event && handler) {
            element.addEventListener(event, handler, options);
        }
    }
    
    /**
     * 移除事件监听器
     * @param {HTMLElement} element - 元素
     * @param {string} event - 事件类型
     * @param {Function} handler - 事件处理函数
     * @param {Object} options - 事件选项
     */
    static off(element, event, handler, options = {}) {
        if (element && event && handler) {
            element.removeEventListener(event, handler, options);
        }
    }
    
    /**
     * 一次性事件监听器
     * @param {HTMLElement} element - 元素
     * @param {string} event - 事件类型
     * @param {Function} handler - 事件处理函数
     */
    static once(element, event, handler) {
        if (element && event && handler) {
            const onceHandler = (e) => {
                handler(e);
                this.off(element, event, onceHandler);
            };
            this.on(element, event, onceHandler);
        }
    }
    
    /**
     * 触发自定义事件
     * @param {HTMLElement} element - 元素
     * @param {string} eventName - 事件名称
     * @param {Object} detail - 事件详情
     * @returns {boolean} 事件是否被取消
     */
    static triggerEvent(element, eventName, detail = {}) {
        if (!element || !eventName) return false;
        
        const event = new CustomEvent(eventName, {
            bubbles: true,
            cancelable: true,
            detail
        });
        
        return element.dispatchEvent(event);
    }
    
    /**
     * 阻止事件冒泡
     * @param {Event} event - 事件对象
     */
    static stopPropagation(event) {
        if (event) {
            event.stopPropagation();
        }
    }
    
    /**
     * 阻止默认行为
     * @param {Event} event - 事件对象
     */
    static preventDefault(event) {
        if (event) {
            event.preventDefault();
        }
    }
    
    /**
     * 获取事件目标
     * @param {Event} event - 事件对象
     * @returns {HTMLElement} 目标元素
     */
    static getEventTarget(event) {
        return event.target || event.srcElement;
    }
    
    /**
     * 获取事件相关元素（对于mouseover/mouseout）
     * @param {Event} event - 事件对象
     * @returns {HTMLElement} 相关元素
     */
    static getRelatedTarget(event) {
        return event.relatedTarget || event.toElement || event.fromElement;
    }
    
    /**
     * 设置元素属性
     * @param {HTMLElement} element - 元素
     * @param {string} name - 属性名
     * @param {string} value - 属性值
     */
    static setAttribute(element, name, value) {
        if (element && name) {
            element.setAttribute(name, value);
        }
    }
    
    /**
     * 获取元素属性
     * @param {HTMLElement} element - 元素
     * @param {string} name - 属性名
     * @returns {string} 属性值
     */
    static getAttribute(element, name) {
        if (element && name) {
            return element.getAttribute(name);
        }
        return null;
    }
    
    /**
     * 移除元素属性
     * @param {HTMLElement} element - 元素
     * @param {string} name - 属性名
     */
    static removeAttribute(element, name) {
        if (element && name) {
            element.removeAttribute(name);
        }
    }
    
    /**
     * 设置元素数据属性
     * @param {HTMLElement} element - 元素
     * @param {string} key - 数据键
     * @param {any} value - 数据值
     */
    static setData(element, key, value) {
        if (element && key) {
            element.dataset[key] = value;
        }
    }
    
    /**
     * 获取元素数据属性
     * @param {HTMLElement} element - 元素
     * @param {string} key - 数据键
     * @returns {string} 数据值
     */
    static getData(element, key) {
        if (element && key) {
            return element.dataset[key];
        }
        return null;
    }
    
    /**
     * 检查元素是否可见
     * @param {HTMLElement} element - 元素
     * @returns {boolean} 是否可见
     */
    static isVisible(element) {
        if (!element) return false;
        
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0' &&
               element.offsetWidth > 0 &&
               element.offsetHeight > 0;
    }
    
    /**
     * 检查元素是否在视口内
     * @param {HTMLElement} element - 元素
     * @param {number} threshold - 阈值（0-1）
     * @returns {boolean} 是否在视口内
     */
    static isInViewport(element, threshold = 0) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        const viewport = this.getViewportSize();
        
        const visibleHeight = Math.min(rect.bottom, viewport.height) - Math.max(rect.top, 0);
        const visibleWidth = Math.min(rect.right, viewport.width) - Math.max(rect.left, 0);
        
        const visibleArea = visibleHeight * visibleWidth;
        const totalArea = rect.width * rect.height;
        
        return visibleArea > totalArea * threshold;
    }
    
    /**
     * 获取元素的所有父元素
     * @param {HTMLElement} element - 元素
     * @returns {Array} 父元素数组
     */
    static getParents(element) {
        const parents = [];
        let current = element.parentElement;
        
        while (current) {
            parents.push(current);
            current = current.parentElement;
        }
        
        return parents;
    }
    
    /**
     * 获取元素的子元素
     * @param {HTMLElement} element - 元素
     * @returns {Array} 子元素数组
     */
    static getChildren(element) {
        if (!element) return [];
        return Array.from(element.children);
    }
    
    /**
     * 获取元素的兄弟元素
     * @param {HTMLElement} element - 元素
     * @returns {Object} 兄弟元素 {previous, next}
     */
    static getSiblings(element) {
        if (!element) return { previous: null, next: null };
        
        return {
            previous: element.previousElementSibling,
            next: element.nextElementSibling
        };
    }
    
    /**
     * 查找匹配选择器的父元素
     * @param {HTMLElement} element - 元素
     * @param {string} selector - CSS选择器
     * @returns {HTMLElement|null} 找到的父元素
     */
    static closest(element, selector) {
        if (!element || !selector) return null;
        
        let current = element;
        while (current) {
            if (current.matches(selector)) {
                return current;
            }
            current = current.parentElement;
        }
        
        return null;
    }
    
    /**
     * 检查元素是否匹配选择器
     * @param {HTMLElement} element - 元素
     * @param {string} selector - CSS选择器
     * @returns {boolean} 是否匹配
     */
    static matches(element, selector) {
        if (!element || !selector) return false;
        
        // 使用原生matches方法
        return element.matches(selector);
    }
    
    /**
     * 创建文档片段
     * @param {Array} elements - 元素数组
     * @returns {DocumentFragment} 文档片段
     */
    static createFragment(elements = []) {
        const fragment = document.createDocumentFragment();
        
        elements.forEach(element => {
            if (element instanceof HTMLElement) {
                fragment.appendChild(element);
            }
        });
        
        return fragment;
    }
    
    /**
     * 批量操作元素
     * @param {NodeList|Array} elements - 元素集合
     * @param {Function} callback - 回调函数
     */
    static forEach(elements, callback) {
        if (!elements || !callback) return;
        
        Array.from(elements).forEach((element, index) => {
            callback(element, index, elements);
        });
    }
    
    /**
     * 防抖函数
     * @param {Function} func - 要执行的函数
     * @param {number} wait - 等待时间（毫秒）
     * @returns {Function} 防抖后的函数
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * 节流函数
     * @param {Function} func - 要执行的函数
     * @param {number} limit - 时间限制（毫秒）
     * @returns {Function} 节流后的函数
     */
    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    /**
     * 异步加载脚本
     * @param {string} src - 脚本URL
     * @param {Object} options - 选项
     * @returns {Promise} 加载Promise
     */
    static loadScript(src, options = {}) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            
            Object.keys(options).forEach(key => {
                script[key] = options[key];
            });
            
            script.onload = () => resolve(script);
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            
            document.head.appendChild(script);
        });
    }
    
    /**
     * 异步加载样式
     * @param {string} href - 样式URL
     * @returns {Promise} 加载Promise
     */
    static loadStyle(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            
            link.onload = () => resolve(link);
            link.onerror = () => reject(new Error(`Failed to load style: ${href}`));
            
            document.head.appendChild(link);
        });
    }
    
    /**
     * 复制文本到剪贴板
     * @param {string} text - 要复制的文本
     * @returns {Promise} 复制结果
     */
    static copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            if (!navigator.clipboard) {
                // 回退方案
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    const successful = document.execCommand('copy');
                    document.body.removeChild(textArea);
                    successful ? resolve() : reject(new Error('Copy failed'));
                } catch (err) {
                    document.body.removeChild(textArea);
                    reject(err);
                }
                return;
            }
            
            navigator.clipboard.writeText(text)
                .then(resolve)
                .catch(reject);
        });
    }
    
    /**
     * 获取焦点元素
     * @returns {HTMLElement} 当前焦点元素
     */
    static getFocusedElement() {
        return document.activeElement;
    }
    
    /**
     * 设置焦点到元素
     * @param {HTMLElement} element - 元素
     * @param {Object} options - 焦点选项
     */
    static setFocus(element, options = {}) {
        if (element && typeof element.focus === 'function') {
            element.focus(options);
        }
    }
    
    /**
     * 移除焦点
     * @param {HTMLElement} element - 元素
     */
    static blur(element) {
        if (element && typeof element.blur === 'function') {
            element.blur();
        }
    }
}

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DOMUtils;
}