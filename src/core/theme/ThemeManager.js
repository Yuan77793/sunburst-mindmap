/**
 * 主题管理器
 * 管理主题切换、CSS变量更新和ECharts主题切换
 */
class ThemeManager {
    /**
     * 创建主题管理器
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        this.options = {
            defaultTheme: 'light-blue',
            storageKey: 'sunburst-mindmap-theme',
            enableSystemTheme: true,
            animationDuration: 300,
            ...options
        };
        
        this.currentTheme = this.options.defaultTheme;
        this.previousTheme = null;
        this.isTransitioning = false;
        
        // 主题定义
        this.themes = {
            'dark-gold': {
                name: '深色金',
                type: 'dark',
                cssFile: 'styles/themes/dark-gold/',
                echartsTheme: 'dark',
                colors: {
                    primary: '#D4AF37',
                    primaryLight: '#FFD700',
                    primaryDark: '#B8860B',
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a1f1c 100%)',
                    textPrimary: '#F0F0F0',
                    textSecondary: '#B0B0B0',
                    border: 'rgba(212, 175, 55, 0.3)',
                    shadow: '0 0 15px rgba(255, 215, 0, 0.3)'
                }
            },
            'light-blue': {
                name: '浅色蓝',
                type: 'light',
                cssFile: 'styles/themes/light-blue/',
                echartsTheme: 'light',
                colors: {
                    primary: '#36A1D6',
                    primaryLight: '#87CEEB',
                    primaryDark: '#1E88E5',
                    background: 'linear-gradient(135deg, #E6F7FF 0%, #B3E0FF 50%, #66CCFF 100%)',
                    textPrimary: '#2C3E50',
                    textSecondary: '#4A6572',
                    border: 'rgba(54, 161, 214, 0.3)',
                    shadow: '0 0 12px rgba(102, 204, 255, 0.3)'
                }
            },
            'high-contrast': {
                name: '高对比度',
                type: 'dark',
                cssFile: null,
                echartsTheme: 'dark',
                colors: {
                    primary: '#FF6B6B',
                    primaryLight: '#FF8E8E',
                    primaryDark: '#E53E3E',
                    background: '#000000',
                    textPrimary: '#FFFFFF',
                    textSecondary: '#CCCCCC',
                    border: '#FF6B6B',
                    shadow: '0 0 20px rgba(255, 107, 107, 0.5)'
                }
            }
        };
        
        // 事件监听器
        this.eventListeners = new Map();
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化主题管理器
     */
    init() {
        // 从本地存储加载保存的主题
        this.loadSavedTheme();
        
        // 检测系统主题偏好
        if (this.options.enableSystemTheme) {
            this.detectSystemTheme();
        }
        
        // 应用初始主题
        this.applyTheme(this.currentTheme, false);
        
        this.emit('initialized', { currentTheme: this.currentTheme });
    }
    
    /**
     * 从本地存储加载保存的主题
     */
    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem(this.options.storageKey);
            if (savedTheme && this.themes[savedTheme]) {
                this.currentTheme = savedTheme;
            }
        } catch (error) {
            console.warn('无法从本地存储加载主题:', error);
        }
    }
    
    /**
     * 检测系统主题偏好
     */
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // 系统偏好深色主题
            if (this.currentTheme === this.options.defaultTheme) {
                // 如果当前是默认主题，切换到深色主题
                const darkTheme = Object.keys(this.themes).find(key => this.themes[key].type === 'dark');
                if (darkTheme && darkTheme !== this.currentTheme) {
                    this.switchTheme(darkTheme, false);
                }
            }
        }
        
        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
            if (this.options.enableSystemTheme) {
                const newTheme = event.matches ? 'dark-gold' : 'light-blue';
                this.emit('systemThemeChanged', { prefersDark: event.matches, suggestedTheme: newTheme });
            }
        });
    }
    
    /**
     * 切换主题
     * @param {string} themeName - 主题名称
     * @param {boolean} savePreference - 是否保存偏好
     * @returns {Promise} 切换完成Promise
     */
    switchTheme(themeName, savePreference = true) {
        return new Promise((resolve, reject) => {
            if (!this.themes[themeName]) {
                reject(new Error(`主题不存在: ${themeName}`));
                return;
            }
            
            if (this.isTransitioning) {
                reject(new Error('主题切换中，请稍后重试'));
                return;
            }
            
            if (themeName === this.currentTheme) {
                resolve({ theme: themeName, changed: false });
                return;
            }
            
            this.isTransitioning = true;
            this.previousTheme = this.currentTheme;
            this.currentTheme = themeName;
            
            // 触发切换开始事件
            this.emit('themeChangeStart', {
                from: this.previousTheme,
                to: themeName,
                theme: this.themes[themeName]
            });
            
            // 应用主题
            this.applyTheme(themeName, true)
                .then(() => {
                    // 保存偏好
                    if (savePreference) {
                        this.saveThemePreference(themeName);
                    }
                    
                    // 触发切换完成事件
                    this.emit('themeChangeComplete', {
                        from: this.previousTheme,
                        to: themeName,
                        theme: this.themes[themeName]
                    });
                    
                    this.isTransitioning = false;
                    resolve({ theme: themeName, changed: true });
                })
                .catch(error => {
                    this.isTransitioning = false;
                    this.currentTheme = this.previousTheme;
                    this.previousTheme = null;
                    
                    this.emit('themeChangeError', { error, attemptedTheme: themeName });
                    reject(error);
                });
        });
    }
    
    /**
     * 应用主题
     * @param {string} themeName - 主题名称
     * @param {boolean} animate - 是否使用动画
     * @returns {Promise} 应用完成Promise
     */
    applyTheme(themeName, animate = true) {
        return new Promise((resolve) => {
            const theme = this.themes[themeName];
            if (!theme) {
                resolve();
                return;
            }
            
            // 开始应用主题
            const startTime = Date.now();
            
            // 1. 更新HTML的data-theme属性
            document.documentElement.setAttribute('data-theme', themeName);
            
            // 2. 更新CSS变量
            this.updateCSSVariables(theme);
            
            // 3. 更新ECharts主题
            this.updateEChartsTheme(themeName);
            
            // 4. 加载主题CSS文件（如果有）
            this.loadThemeCSS(theme).then(() => {
                // 计算动画时间
                const elapsed = Date.now() - startTime;
                const remaining = animate ? Math.max(0, this.options.animationDuration - elapsed) : 0;
                
                setTimeout(() => {
                    resolve();
                }, remaining);
            }).catch(error => {
                console.warn('加载主题CSS失败:', error);
                resolve(); // 即使CSS加载失败也继续
            });
        });
    }
    
    /**
     * 更新CSS变量
     * @param {Object} theme - 主题配置
     */
    updateCSSVariables(theme) {
        const root = document.documentElement;
        
        // 设置颜色变量
        Object.keys(theme.colors).forEach(key => {
            const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssVarName, theme.colors[key]);
        });
        
        // 设置主题类型变量
        root.style.setProperty('--theme-type', theme.type);
        root.style.setProperty('--theme-primary', theme.colors.primary);
        root.style.setProperty('--theme-background', theme.colors.background);
    }
    
    /**
     * 更新ECharts主题
     * @param {string} themeName - 主题名称
     */
    updateEChartsTheme(themeName) {
        if (typeof echarts === 'undefined') {
            return;
        }
        
        const theme = this.themes[themeName];
        if (!theme) return;
        
        // 注册自定义ECharts主题
        const customThemeName = `custom-${themeName}`;
        
        if (!echarts.getTheme(customThemeName)) {
            echarts.registerTheme(customThemeName, {
                color: [
                    theme.colors.primary,
                    theme.colors.primaryLight,
                    theme.colors.primaryDark
                ],
                backgroundColor: 'transparent',
                textStyle: {
                    color: theme.colors.textPrimary,
                    fontSize: 14
                },
                title: {
                    textStyle: {
                        color: theme.colors.textPrimary
                    }
                },
                legend: {
                    textStyle: {
                        color: theme.colors.textSecondary
                    }
                }
            });
        }
        
        // 触发ECharts主题更新事件
        this.emit('echartsThemeUpdated', { themeName: customThemeName, theme });
    }
    
    /**
     * 加载主题CSS文件
     * @param {Object} theme - 主题配置
     * @returns {Promise} 加载完成Promise
     */
    loadThemeCSS(theme) {
        return new Promise((resolve, reject) => {
            if (!theme.cssFile) {
                resolve();
                return;
            }
            
            // 检查是否已加载
            const linkId = `theme-css-${theme.name}`;
            let link = document.getElementById(linkId);
            
            if (link) {
                // 已加载，直接返回
                resolve();
                return;
            }
            
            // 创建新的link元素
            link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = `${theme.cssFile}colors.css`;
            
            link.onload = () => resolve();
            link.onerror = () => reject(new Error(`无法加载主题CSS: ${theme.cssFile}`));
            
            document.head.appendChild(link);
        });
    }
    
    /**
     * 保存主题偏好
     * @param {string} themeName - 主题名称
     */
    saveThemePreference(themeName) {
        try {
            localStorage.setItem(this.options.storageKey, themeName);
            this.emit('themePreferenceSaved', { themeName });
        } catch (error) {
            console.warn('无法保存主题偏好:', error);
            this.emit('themeSaveError', { error, themeName });
        }
    }
    
    /**
     * 获取当前主题
     * @returns {Object} 当前主题配置
     */
    getCurrentTheme() {
        return {
            name: this.currentTheme,
            config: this.themes[this.currentTheme],
            isDark: this.themes[this.currentTheme].type === 'dark'
        };
    }
    
    /**
     * 获取所有可用主题
     * @returns {Array} 主题列表
     */
    getAvailableThemes() {
        return Object.keys(this.themes).map(key => ({
            id: key,
            name: this.themes[key].name,
            type: this.themes[key].type,
            colors: this.themes[key].colors
        }));
    }
    
    /**
     * 获取主题颜色
     * @param {string} colorName - 颜色名称
     * @returns {string} 颜色值
     */
    getThemeColor(colorName) {
        const theme = this.themes[this.currentTheme];
        return theme.colors[colorName] || null;
    }
    
    /**
     * 切换到下一个主题
     * @returns {Promise} 切换完成Promise
     */
    nextTheme() {
        const themeKeys = Object.keys(this.themes);
        const currentIndex = themeKeys.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        const nextTheme = themeKeys[nextIndex];
        
        return this.switchTheme(nextTheme);
    }
    
    /**
     * 切换到上一个主题
     * @returns {Promise} 切换完成Promise
     */
    previousTheme() {
        const themeKeys = Object.keys(this.themes);
        const currentIndex = themeKeys.indexOf(this.currentTheme);
        const prevIndex = (currentIndex - 1 + themeKeys.length) % themeKeys.length;
        const prevTheme = themeKeys[prevIndex];
        
        return this.switchTheme(prevTheme);
    }
    
    /**
     * 切换明暗主题
     * @returns {Promise} 切换完成Promise
     */
    toggleDarkLight() {
        const currentTheme = this.themes[this.currentTheme];
        const targetType = currentTheme.type === 'dark' ? 'light' : 'dark';
        
        // 查找相反类型的主题
        const targetTheme = Object.keys(this.themes).find(key => 
            this.themes[key].type === targetType
        );
        
        if (targetTheme) {
            return this.switchTheme(targetTheme);
        }
        
        return Promise.reject(new Error(`未找到${targetType}类型的主题`));
    }
    
    /**
     * 创建主题预览
     * @param {string} themeName - 主题名称
     * @returns {HTMLElement} 预览元素
     */
    createThemePreview(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return null;
        
        const preview = document.createElement('div');
        preview.className = 'theme-preview';
        preview.dataset.theme = themeName;
        
        const colors = document.createElement('div');
        colors.className = 'theme-colors';
        
        // 创建颜色样本
        Object.keys(theme.colors).forEach(key => {
            if (key.includes('primary') || key.includes('background')) {
                const colorSample = document.createElement('div');
                colorSample.className = 'color-sample';
                colorSample.style.backgroundColor = theme.colors[key];
                colorSample.title = `${key}: ${theme.colors[key]}`;
                colors.appendChild(colorSample);
            }
        });
        
        const name = document.createElement('div');
        name.className = 'theme-name';
        name.textContent = theme.name;
        
        const type = document.createElement('div');
        type.className = 'theme-type';
        type.textContent = theme.type === 'dark' ? '深色' : '浅色';
        
        preview.appendChild(colors);
        preview.appendChild(name);
        preview.appendChild(type);
        
        // 添加点击事件
        preview.addEventListener('click', () => {
            this.switchTheme(themeName);
        });
        
        return preview;
    }
    
    /**
     * 获取主题统计信息
     * @returns {Object} 统计信息
     */
    getThemeStats() {
        const themeKeys = Object.keys(this.themes);
        
        return {
            totalThemes: themeKeys.length,
            darkThemes: themeKeys.filter(key => this.themes[key].type === 'dark').length,
            lightThemes: themeKeys.filter(key => this.themes[key].type === 'light').length,
            currentTheme: this.currentTheme,
            previousTheme: this.previousTheme,
            isTransitioning: this.isTransitioning
        };
    }
    
    /**
     * 导出主题配置
     * @returns {Object} 可序列化的配置
     */
    exportConfig() {
        return {
            currentTheme: this.currentTheme,
            previousTheme: this.previousTheme,
            options: { ...this.options },
            themes: Object.keys(this.themes).reduce((acc, key) => {
                acc[key] = {
                    name: this.themes[key].name,
                    type: this.themes[key].type,
                    cssFile: this.themes[key].cssFile
                };
                return acc;
            }, {})
        };
    }
    
    /**
     * 导入主题配置
     * @param {Object} config - 配置对象
     */
    importConfig(config) {
        if (config.currentTheme && this.themes[config.currentTheme]) {
            this.currentTheme = config.currentTheme;
        }
        
        if (config.previousTheme && this.themes[config.previousTheme]) {
            this.previousTheme = config.previousTheme;
        }
        
        if (config.options) {
            this.options = { ...this.options, ...config.options };
        }
        
        // 应用当前主题
        this.applyTheme(this.currentTheme, false);
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
     * 销毁主题管理器
     */
    destroy() {
        // 移除事件监听器
        this.eventListeners.clear();
        
        // 移除系统主题监听
        if (this.systemThemeListener) {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.systemThemeListener);
        }
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}