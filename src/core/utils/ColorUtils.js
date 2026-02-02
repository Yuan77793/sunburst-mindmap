/**
 * 颜色计算工具
 * 提供颜色转换、计算和操作函数
 */
class ColorUtils {
    /**
     * 将十六进制颜色转换为RGB对象
     * @param {string} hex - 十六进制颜色（如 #RRGGBB 或 #RGB）
     * @returns {Object} RGB对象 {r, g, b}
     */
    static hexToRgb(hex) {
        // 移除#号
        hex = hex.replace(/^#/, '');

        // 处理缩写形式 (#RGB -> #RRGGBB)
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }

        // 解析RGB值
        const num = parseInt(hex, 16);
        return {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255
        };
    }

    /**
     * 将RGB对象转换为十六进制颜色
     * @param {Object} rgb - RGB对象 {r, g, b}
     * @returns {string} 十六进制颜色
     */
    static rgbToHex(rgb) {
        const { r, g, b } = rgb;
        const toHex = (n) => {
            const hex = n.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    /**
     * 将RGB转换为HSL
     * @param {Object} rgb - RGB对象 {r, g, b}
     * @returns {Object} HSL对象 {h, s, l}
     */
    static rgbToHsl(rgb) {
        let { r, g, b } = rgb;

        // 归一化到 [0, 1]
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // 无色
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    /**
     * 将HSL转换为RGB
     * @param {Object} hsl - HSL对象 {h, s, l}
     * @returns {Object} RGB对象 {r, g, b}
     */
    static hslToRgb(hsl) {
        let { h, s, l } = hsl;

        // 归一化
        h /= 360;
        s /= 100;
        l /= 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l; // 无色
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    /**
     * 将十六进制颜色转换为HSL
     * @param {string} hex - 十六进制颜色
     * @returns {Object} HSL对象 {h, s, l}
     */
    static hexToHsl(hex) {
        const rgb = this.hexToRgb(hex);
        return this.rgbToHsl(rgb);
    }

    /**
     * 将HSL转换为十六进制颜色
     * @param {Object} hsl - HSL对象 {h, s, l}
     * @returns {string} 十六进制颜色
     */
    static hslToHex(hsl) {
        const rgb = this.hslToRgb(hsl);
        return this.rgbToHex(rgb);
    }

    /**
     * 生成HSL颜色字符串
     * @param {number} h - 色相 (0-360)
     * @param {number} s - 饱和度 (0-100)
     * @param {number} l - 亮度 (0-100)
     * @returns {string} HSL颜色字符串
     */
    static hslToString(h, s, l) {
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    /**
     * 调整颜色亮度
     * @param {string} color - 原始颜色（十六进制）
     * @param {number} amount - 调整量 (-100 到 100)
     * @returns {string} 调整后的颜色（十六进制）
     */
    static lighten(color, amount) {
        const hsl = this.hexToHsl(color);
        hsl.l = Math.min(100, Math.max(0, hsl.l + amount));
        return this.hslToHex(hsl);
    }

    /**
     * 调整颜色饱和度
     * @param {string} color - 原始颜色（十六进制）
     * @param {number} amount - 调整量 (-100 到 100)
     * @returns {string} 调整后的颜色（十六进制）
     */
    static saturate(color, amount) {
        const hsl = this.hexToHsl(color);
        hsl.s = Math.min(100, Math.max(0, hsl.s + amount));
        return this.hslToHex(hsl);
    }

    /**
     * 调整颜色色相
     * @param {string} color - 原始颜色（十六进制）
     * @param {number} amount - 调整量 (-360 到 360)
     * @returns {string} 调整后的颜色（十六进制）
     */
    static adjustHue(color, amount) {
        const hsl = this.hexToHsl(color);
        hsl.h = (hsl.h + amount) % 360;
        if (hsl.h < 0) hsl.h += 360;
        return this.hslToHex(hsl);
    }

    /**
     * 计算颜色的互补色
     * @param {string} color - 原始颜色（十六进制）
     * @returns {string} 互补色（十六进制）
     */
    static complementary(color) {
        return this.adjustHue(color, 180);
    }

    /**
     * 计算颜色的三色组
     * @param {string} color - 原始颜色（十六进制）
     * @returns {Array} 三色组数组 [原始色, 色相+120°, 色相+240°]
     */
    static triadic(color) {
        const hsl = this.hexToHsl(color);
        return [
            color,
            this.adjustHue(color, 120),
            this.adjustHue(color, 240)
        ];
    }

    /**
     * 计算颜色的相邻色
     * @param {string} color - 原始颜色（十六进制）
     * @param {number} angle - 角度差 (默认30)
     * @returns {Array} 相邻色数组 [色相-angle, 原始色, 色相+angle]
     */
    static analogous(color, angle = 30) {
        return [
            this.adjustHue(color, -angle),
            color,
            this.adjustHue(color, angle)
        ];
    }

    /**
     * 计算颜色的分裂互补色
     * @param {string} color - 原始颜色（十六进制）
     * @returns {Array} 分裂互补色数组 [原始色, 色相+150°, 色相+210°]
     */
    static splitComplementary(color) {
        return [
            color,
            this.adjustHue(color, 150),
            this.adjustHue(color, 210)
        ];
    }

    /**
     * 计算颜色的四色组
     * @param {string} color - 原始颜色（十六进制）
     * @returns {Array} 四色组数组 [原始色, 色相+90°, 互补色, 色相+270°]
     */
    static tetradic(color) {
        return [
            color,
            this.adjustHue(color, 90),
            this.complementary(color),
            this.adjustHue(color, 270)
        ];
    }

    /**
     * 计算颜色的单色系
     * @param {string} color - 原始颜色（十六进制）
     * @param {number} steps - 步数
     * @returns {Array} 单色系数组
     */
    static monochromatic(color, steps = 5) {
        const hsl = this.hexToHsl(color);
        const colors = [];

        // 计算亮度步长
        const lightStep = 100 / (steps + 1);

        for (let i = 1; i <= steps; i++) {
            const newHsl = { ...hsl };
            newHsl.l = lightStep * i;
            colors.push(this.hslToHex(newHsl));
        }

        return colors;
    }

    /**
     * 混合两种颜色
     * @param {string} color1 - 颜色1（十六进制）
     * @param {string} color2 - 颜色2（十六进制）
     * @param {number} weight - 颜色1的权重 (0-1)
     * @returns {string} 混合后的颜色（十六进制）
     */
    static mix(color1, color2, weight = 0.5) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);

        const w = Math.max(0, Math.min(1, weight));
        const w2 = 1 - w;

        const r = Math.round(rgb1.r * w + rgb2.r * w2);
        const g = Math.round(rgb1.g * w + rgb2.g * w2);
        const b = Math.round(rgb1.b * w + rgb2.b * w2);

        return this.rgbToHex({ r, g, b });
    }

    /**
     * 计算颜色对比度（WCAG标准）
     * @param {string} color1 - 颜色1（十六进制）
     * @param {string} color2 - 颜色2（十六进制）
     * @returns {number} 对比度比率
     */
    static contrastRatio(color1, color2) {
        const luminance1 = this.relativeLuminance(color1);
        const luminance2 = this.relativeLuminance(color2);

        const lighter = Math.max(luminance1, luminance2);
        const darker = Math.min(luminance1, luminance2);

        return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * 计算相对亮度（WCAG标准）
     * @param {string} color - 颜色（十六进制）
     * @returns {number} 相对亮度 (0-1)
     */
    static relativeLuminance(color) {
        const rgb = this.hexToRgb(color);

        // 归一化并应用gamma校正
        const normalize = (value) => {
            value /= 255;
            return value <= 0.03928
                ? value / 12.92
                : Math.pow((value + 0.055) / 1.055, 2.4);
        };

        const r = normalize(rgb.r);
        const g = normalize(rgb.g);
        const b = normalize(rgb.b);

        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    /**
     * 检查颜色对比度是否满足WCAG标准
     * @param {string} foreground - 前景色（十六进制）
     * @param {string} background - 背景色（十六进制）
     * @param {string} level - WCAG级别 ('AA' 或 'AAA')
     * @returns {Object} 检查结果
     */
    static checkWCAGContrast(foreground, background, level = 'AA') {
        const ratio = this.contrastRatio(foreground, background);

        const standards = {
            'AA': { normal: 4.5, large: 3.0 },
            'AAA': { normal: 7.0, large: 4.5 }
        };

        const standard = standards[level] || standards['AA'];

        return {
            ratio: ratio,
            passesNormal: ratio >= standard.normal,
            passesLarge: ratio >= standard.large,
            requiredNormal: standard.normal,
            requiredLarge: standard.large,
            level: level
        };
    }

    /**
     * 获取颜色的最佳文本颜色（黑或白）
     * @param {string} backgroundColor - 背景色（十六进制）
     * @returns {string} 最佳文本颜色（#000000 或 #FFFFFF）
     */
    static getBestTextColor(backgroundColor) {
        const luminance = this.relativeLuminance(backgroundColor);
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }

    /**
     * 生成随机颜色
     * @param {Object} options - 选项
     * @returns {string} 随机颜色（十六进制）
     */
    static randomColor(options = {}) {
        const {
            hueRange = [0, 360],
            saturationRange = [50, 100],
            lightnessRange = [30, 70]
        } = options;

        const randomInRange = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        const h = randomInRange(hueRange[0], hueRange[1]);
        const s = randomInRange(saturationRange[0], saturationRange[1]);
        const l = randomInRange(lightnessRange[0], lightnessRange[1]);

        return this.hslToHex({ h, s, l });
    }

    /**
     * 生成调色板
     * @param {number} count - 颜色数量
     * @param {Object} options - 选项
     * @returns {Array} 调色板数组
     */
    static generatePalette(count, options = {}) {
        const {
            baseHue = 0,
            hueStep = 360 / count,
            saturation = 70,
            lightness = 50
        } = options;

        const palette = [];

        for (let i = 0; i < count; i++) {
            const h = (baseHue + i * hueStep) % 360;
            palette.push(this.hslToHex({ h, s: saturation, l: lightness }));
        }

        return palette;
    }

    /**
     * 创建颜色渐变
     * @param {Array} colors - 颜色数组（十六进制）
     * @param {number} steps - 渐变步数
     * @returns {Array} 渐变颜色数组
     */
    static createGradient(colors, steps) {
        if (!colors || colors.length < 2) {
            return colors || [];
        }

        const gradient = [];
        const segmentSteps = Math.floor((steps - 1) / (colors.length - 1));

        for (let i = 0; i < colors.length - 1; i++) {
            const color1 = colors[i];
            const color2 = colors[i + 1];

            for (let j = 0; j <= segmentSteps; j++) {
                const weight = j / segmentSteps;
                const mixedColor = this.mix(color1, color2, 1 - weight);

                // 避免重复添加连接点
                if (i > 0 && j === 0) continue;

                gradient.push(mixedColor);
            }
        }

        // 确保总步数正确
        return gradient.slice(0, steps);
    }

    /**
     * 计算颜色距离（CIE76 Delta E）
     * @param {string} color1 - 颜色1（十六进制）
     * @param {string} color2 - 颜色2（十六进制）
     * @returns {number} 颜色距离
     */
    static colorDistance(color1, color2) {
        const lab1 = this.rgbToLab(this.hexToRgb(color1));
        const lab2 = this.rgbToLab(this.hexToRgb(color2));

        const dL = lab1.L - lab2.L;
        const da = lab1.a - lab2.a;
        const db = lab1.b - lab2.b;

        return Math.sqrt(dL * dL + da * da + db * db);
    }

    /**
     * 将RGB转换为Lab颜色空间
     * @param {Object} rgb - RGB对象 {r, g, b}
     * @returns {Object} Lab对象 {L, a, b}
     */
    static rgbToLab(rgb) {
        // 简化实现，实际应使用完整的转换公式
        const xyz = this.rgbToXyz(rgb);

        // 简化转换
        const L = 116 * this.xyzToLabHelper(xyz.Y) - 16;
        const a = 500 * (this.xyzToLabHelper(xyz.X) - this.xyzToLabHelper(xyz.Y));
        const b = 200 * (this.xyzToLabHelper(xyz.Y) - this.xyzToLabHelper(xyz.Z));

        return { L, a, b };
    }

    /**
     * 将RGB转换为XYZ颜色空间
     * @param {Object} rgb - RGB对象 {r, g, b}
     * @returns {Object} XYZ对象 {X, Y, Z}
     */
    static rgbToXyz(rgb) {
        let { r, g, b } = rgb;

        // 归一化
        r /= 255;
        g /= 255;
        b /= 255;

        // 应用gamma校正
        r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

        // 转换为XYZ
        const X = r * 0.4124 + g * 0.3576 + b * 0.1805;
        const Y = r * 0.2126 + g * 0.7152 + b * 0.0722;
        const Z = r * 0.0193 + g * 0.1192 + b * 0.9505;

        return { X, Y, Z };
    }

    /**
     * XYZ到Lab转换的辅助函数
     * @param {number} t - 输入值
     * @returns {number} 转换后的值
     */
    static xyzToLabHelper(t) {
        const epsilon = 0.008856;
        const kappa = 903.3;

        return t > epsilon ? Math.pow(t, 1 / 3) : (kappa * t + 16) / 116;
    }

    /**
     * 格式化颜色值
     * @param {string} color - 颜色（十六进制）
     * @param {string} format - 格式 ('hex', 'rgb', 'hsl')
     * @returns {string} 格式化后的颜色字符串
     */
    static formatColor(color, format = 'hex') {
        switch (format.toLowerCase()) {
            case 'rgb':
                const rgb = this.hexToRgb(color);
                return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

            case 'hsl':
                const hsl = this.hexToHsl(color);
                return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

            case 'hex':
            default:
                return color;
        }
    }

    /**
     * 验证颜色字符串
     * @param {string} color - 颜色字符串
     * @returns {boolean} 是否有效
     */
    static isValidColor(color) {
        // 检查十六进制格式
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
            return true;
        }

        // 检查RGB格式
        if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color)) {
            return true;
        }

        // 检查HSL格式
        if (/^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/.test(color)) {
            return true;
        }

        return false;
    }
}

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorUtils;
}

// ES6模块导出
export { ColorUtils };
