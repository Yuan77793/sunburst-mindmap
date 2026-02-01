/**
 * 颜色管理器
 * 基于层级和兄弟节点位置计算HSL颜色值
 */
class ColorManager {
    /**
     * 创建颜色管理器
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        this.options = {
            theme: 'light-blue',      // 当前主题
            saturationBase: 70,       // 基础饱和度
            lightnessBase: 50,        // 基础亮度
            hueVariation: 30,         // 色相变化范围
            depthEffect: 5,           // 深度对饱和度的影响
            siblingEffect: 20,        // 兄弟节点对亮度的影响
            useGradient: true,        // 是否使用渐变
            ...options
        };
        
        // 主题颜色配置
        this.themes = {
            'dark-gold': {
                baseHue: 50,          // 金色色调
                saturationRange: [40, 80],
                lightnessRange: [30, 70],
                gradient: true
            },
            'light-blue': {
                baseHue: 200,         // 蓝色色调
                saturationRange: [50, 90],
                lightnessRange: [50, 90],
                gradient: true
            },
            'high-contrast': {
                baseHue: 0,           // 红色色调
                saturationRange: [80, 100],
                lightnessRange: [20, 80],
                gradient: false
            }
        };
        
        // 颜色缓存
        this.colorCache = new Map();
    }
    
    /**
     * 为节点分配颜色
     * @param {Object} node - 节点对象
     * @param {number} siblingIndex - 在兄弟节点中的索引
     * @param {number} totalSiblings - 兄弟节点总数
     * @returns {string} 颜色值（HSL或十六进制）
     */
    assignColor(node, siblingIndex = 0, totalSiblings = 1) {
        // 生成缓存键
        const cacheKey = `${node.id}_${siblingIndex}_${totalSiblings}_${this.options.theme}`;
        
        if (this.colorCache.has(cacheKey)) {
            return this.colorCache.get(cacheKey);
        }
        
        const theme = this.themes[this.options.theme] || this.themes['light-blue'];
        const depth = node.depth || 0;
        
        // 计算HSL值
        const hue = this.calculateHue(depth, siblingIndex, totalSiblings, theme);
        const saturation = this.calculateSaturation(depth, siblingIndex, totalSiblings, theme);
        const lightness = this.calculateLightness(depth, siblingIndex, totalSiblings, theme);
        
        // 生成HSL颜色
        const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // 缓存结果
        this.colorCache.set(cacheKey, hslColor);
        
        return hslColor;
    }
    
    /**
     * 计算色相
     * @param {number} depth - 节点深度
     * @param {number} siblingIndex - 兄弟节点索引
     * @param {number} totalSiblings - 兄弟节点总数
     * @param {Object} theme - 主题配置
     * @returns {number} 色相值 (0-360)
     */
    calculateHue(depth, siblingIndex, totalSiblings, theme) {
        const baseHue = theme.baseHue;
        const hueVariation = this.options.hueVariation;
        
        // 基于深度调整色相
        let hue = baseHue + (depth * 15);
        
        // 基于兄弟节点位置微调
        if (totalSiblings > 1) {
            const siblingRatio = siblingIndex / (totalSiblings - 1);
            hue += (siblingRatio - 0.5) * hueVariation;
        }
        
        // 确保在0-360范围内
        hue = ((hue % 360) + 360) % 360;
        
        return Math.round(hue);
    }
    
    /**
     * 计算饱和度
     * @param {number} depth - 节点深度
     * @param {number} siblingIndex - 兄弟节点索引
     * @param {number} totalSiblings - 兄弟节点总数
     * @param {Object} theme - 主题配置
     * @returns {number} 饱和度百分比
     */
    calculateSaturation(depth, siblingIndex, totalSiblings, theme) {
        const [minSat, maxSat] = theme.saturationRange;
        const depthEffect = this.options.depthEffect;
        
        // 基于深度调整饱和度（越深饱和度越低）
        let saturation = this.options.saturationBase - (depth * depthEffect);
        
        // 基于兄弟节点位置微调
        if (totalSiblings > 1) {
            const siblingRatio = siblingIndex / totalSiblings;
            saturation += (siblingRatio - 0.5) * 10;
        }
        
        // 限制在主题范围内
        saturation = Math.max(minSat, Math.min(maxSat, saturation));
        
        return Math.round(saturation);
    }
    
    /**
     * 计算亮度
     * @param {number} depth - 节点深度
     * @param {number} siblingIndex - 兄弟节点索引
     * @param {number} totalSiblings - 兄弟节点总数
     * @param {Object} theme - 主题配置
     * @returns {number} 亮度百分比
     */
    calculateLightness(depth, siblingIndex, totalSiblings, theme) {
        const [minLight, maxLight] = theme.lightnessRange;
        const siblingEffect = this.options.siblingEffect;
        
        // 基于深度调整亮度（越深亮度越低）
        let lightness = this.options.lightnessBase - (depth * 5);
        
        // 基于兄弟节点位置调整（创建差异）
        if (totalSiblings > 1) {
            const siblingRatio = siblingIndex / (totalSiblings - 1);
            lightness += siblingRatio * siblingEffect;
        }
        
        // 限制在主题范围内
        lightness = Math.max(minLight, Math.min(maxLight, lightness));
        
        return Math.round(lightness);
    }
    
    /**
     * 为整个树分配颜色
     * @param {Array} treeData - 树数据
     * @returns {Array} 带有颜色的树数据
     */
    assignColorsToTree(treeData) {
        this.colorCache.clear();
        
        const processNode = (node, siblingIndex = 0, totalSiblings = 1, depth = 0) => {
            // 分配颜色
            node.color = this.assignColor(node, siblingIndex, totalSiblings);
            
            // 递归处理子节点
            if (node.children && node.children.length > 0) {
                const childDepth = depth + 1;
                node.children.forEach((child, childIndex) => {
                    processNode(child, childIndex, node.children.length, childDepth);
                });
            }
            
            return node;
        };
        
        return treeData.map((node, index) => {
            return processNode(node, index, treeData.length, 0);
        });
    }
    
    /**
     * 生成颜色渐变
     * @param {string} startColor - 起始颜色（HSL）
     * @param {string} endColor - 结束颜色（HSL）
     * @param {number} steps - 渐变步数
     * @returns {Array} 渐变颜色数组
     */
    generateGradient(startColor, endColor, steps = 5) {
        // 解析HSL颜色
        const startHSL = this.parseHSL(startColor);
        const endHSL = this.parseHSL(endColor);
        
        if (!startHSL || !endHSL) {
            return [startColor];
        }
        
        const gradient = [];
        
        for (let i = 0; i < steps; i++) {
            const ratio = i / (steps - 1);
            
            const hue = this.interpolate(startHSL.h, endHSL.h, ratio);
            const saturation = this.interpolate(startHSL.s, endHSL.s, ratio);
            const lightness = this.interpolate(startHSL.l, endHSL.l, ratio);
            
            gradient.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
        
        return gradient;
    }
    
    /**
     * 解析HSL颜色字符串
     * @param {string} hslString - HSL颜色字符串
     * @returns {Object|null} HSL对象 { h, s, l }
     */
    parseHSL(hslString) {
        const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        
        if (!match) {
            return null;
        }
        
        return {
            h: parseInt(match[1]),
            s: parseInt(match[2]),
            l: parseInt(match[3])
        };
    }
    
    /**
     * 插值计算
     * @param {number} start - 起始值
     * @param {number} end - 结束值
     * @param {number} ratio - 比例 (0-1)
     * @returns {number} 插值结果
     */
    interpolate(start, end, ratio) {
        return Math.round(start + (end - start) * ratio);
    }
    
    /**
     * 获取对比色
     * @param {string} color - 原始颜色（HSL）
     * @returns {string} 对比色
     */
    getContrastColor(color) {
        const hsl = this.parseHSL(color);
        
        if (!hsl) {
            return '#000000';
        }
        
        // 根据亮度决定使用黑色或白色
        return hsl.l > 50 ? '#000000' : '#FFFFFF';
    }
    
    /**
     * 获取相邻色
     * @param {string} color - 原始颜色（HSL）
     * @param {number} angle - 色相差（度）
     * @returns {string} 相邻色
     */
    getAnalogousColor(color, angle = 30) {
        const hsl = this.parseHSL(color);
        
        if (!hsl) {
            return color;
        }
        
        let newHue = hsl.h + angle;
        newHue = ((newHue % 360) + 360) % 360;
        
        return `hsl(${newHue}, ${hsl.s}%, ${hsl.l}%)`;
    }
    
    /**
     * 获取互补色
     * @param {string} color - 原始颜色（HSL）
     * @returns {string} 互补色
     */
    getComplementaryColor(color) {
        return this.getAnalogousColor(color, 180);
    }
    
    /**
     * 获取三色组
     * @param {string} color - 原始颜色（HSL）
     * @returns {Array} 三色组数组
     */
    getTriadicColors(color) {
        return [
            color,
            this.getAnalogousColor(color, 120),
            this.getAnalogousColor(color, 240)
        ];
    }
    
    /**
     * 检查颜色对比度
     * @param {string} color1 - 颜色1
     * @param {string} color2 - 颜色2
     * @returns {number} 对比度比率
     */
    checkContrastRatio(color1, color2) {
        // 简化实现：将HSL转换为亮度值
        const hsl1 = this.parseHSL(color1);
        const hsl2 = this.parseHSL(color2);
        
        if (!hsl1 || !hsl2) {
            return 1;
        }
        
        // 计算相对亮度（简化版）
        const l1 = hsl1.l / 100;
        const l2 = hsl2.l / 100;
        
        // 计算对比度比率
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }
    
    /**
     * 验证颜色对比度是否满足WCAG标准
     * @param {string} foreground - 前景色
     * @param {string} background - 背景色
     * @param {string} level - WCAG级别 ('AA' 或 'AAA')
     * @returns {Object} 验证结果
     */
    validateWCAGContrast(foreground, background, level = 'AA') {
        const ratio = this.checkContrastRatio(foreground, background);
        
        const standards = {
            'AA': { normal: 4.5, large: 3.0 },
            'AAA': { normal: 7.0, large: 4.5 }
        };
        
        const standard = standards[level] || standards['AA'];
        
        return {
            ratio: ratio.toFixed(2),
            passesNormal: ratio >= standard.normal,
            passesLarge: ratio >= standard.large,
            requiredNormal: standard.normal,
            requiredLarge: standard.large,
            level
        };
    }
    
    /**
     * 设置主题
     * @param {string} themeName - 主题名称
     */
    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.options.theme = themeName;
            this.colorCache.clear(); // 清除缓存
        } else {
            console.warn(`主题 ${themeName} 不存在，使用默认主题`);
            this.options.theme = 'light-blue';
        }
    }
    
    /**
     * 获取当前主题配置
     * @returns {Object} 主题配置
     */
    getThemeConfig() {
        return this.themes[this.options.theme] || this.themes['light-blue'];
    }
    
    /**
     * 获取所有可用主题
     * @returns {Array} 主题名称数组
     */
    getAvailableThemes() {
        return Object.keys(this.themes);
    }
    
    /**
     * 生成调色板
     * @param {number} count - 颜色数量
     * @param {Object} options - 选项
     * @returns {Array} 调色板颜色数组
     */
    generatePalette(count = 5, options = {}) {
        const theme = this.getThemeConfig();
        const palette = [];
        
        for (let i = 0; i < count; i++) {
            const hue = (theme.baseHue + (i * 360 / count)) % 360;
            const saturation = options.saturation || this.options.saturationBase;
            const lightness = options.lightness || this.options.lightnessBase;
            
            palette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
        
        return palette;
    }
    
    /**
     * 清除颜色缓存
     */
    clearCache() {
        this.colorCache.clear();
    }
    
    /**
     * 获取颜色统计信息
     * @param {Array} treeData - 树数据
     * @returns {Object} 统计信息
     */
    getColorStats(treeData) {
        const colors = new Set();
        let totalNodes = 0;
        
        const collectColors = (node) => {
            totalNodes++;
            if (node.color) {
                colors.add(node.color);
            }
            
            if (node.children) {
                node.children.forEach(child => collectColors(child));
            }
        };
        
        treeData.forEach(node => collectColors(node));
        
        return {
            totalColors: colors.size,
            totalNodes,
            colorRatio: colors.size / totalNodes,
            uniqueColors: Array.from(colors)
        };
    }
    
    /**
     * 导出颜色配置
     * @returns {Object} 可序列化的配置
     */
    exportConfig() {
        return {
            options: { ...this.options },
            currentTheme: this.options.theme,
            themes: { ...this.themes },
            cacheSize: this.colorCache.size
        };
    }
    
    /**
     * 导入颜色配置
     * @param {Object} config - 配置对象
     */
    importConfig(config) {
        if (config.options) {
            this.options = { ...this.options, ...config.options };
        }
        
        if (config.themes) {
            this.themes = { ...this.themes, ...config.themes };
        }
        
        if (config.currentTheme && this.themes[config.currentTheme]) {
            this.options.theme = config.currentTheme;
        }
        
        this.colorCache.clear();
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorManager;
}