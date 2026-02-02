/**
 * 数学计算工具
 * 提供常用的数学计算函数
 */
class MathUtils {
    /**
     * 将角度转换为弧度
     * @param {number} degrees - 角度
     * @returns {number} 弧度
     */
    static degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }
    
    /**
     * 将弧度转换为角度
     * @param {number} radians - 弧度
     * @returns {number} 角度
     */
    static radiansToDegrees(radians) {
        return radians * 180 / Math.PI;
    }
    
    /**
     * 标准化角度到 [0, 2π) 范围
     * @param {number} angle - 角度（弧度）
     * @returns {number} 标准化后的角度
     */
    static normalizeAngle(angle) {
        const twoPi = 2 * Math.PI;
        let normalized = angle % twoPi;
        if (normalized < 0) {
            normalized += twoPi;
        }
        return normalized;
    }
    
    /**
     * 计算两点之间的距离
     * @param {number} x1 - 点1的x坐标
     * @param {number} y1 - 点1的y坐标
     * @param {number} x2 - 点2的x坐标
     * @param {number} y2 - 点2的y坐标
     * @returns {number} 距离
     */
    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * 计算点到线段的距离
     * @param {number} px - 点的x坐标
     * @param {number} py - 点的y坐标
     * @param {number} x1 - 线段起点x坐标
     * @param {number} y1 - 线段起点y坐标
     * @param {number} x2 - 线段终点x坐标
     * @param {number} y2 - 线段终点y坐标
     * @returns {number} 距离
     */
    static distanceToLineSegment(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        
        if (lenSq !== 0) {
            param = dot / lenSq;
        }
        
        let xx, yy;
        
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * 线性插值
     * @param {number} start - 起始值
     * @param {number} end - 结束值
     * @param {number} t - 插值系数 (0-1)
     * @returns {number} 插值结果
     */
    static lerp(start, end, t) {
        return start + (end - start) * t;
    }
    
    /**
     * 限制值在指定范围内
     * @param {number} value - 原始值
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number} 限制后的值
     */
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
    
    /**
     * 将值映射到新范围
     * @param {number} value - 原始值
     * @param {number} inMin - 原始范围最小值
     * @param {number} inMax - 原始范围最大值
     * @param {number} outMin - 目标范围最小值
     * @param {number} outMax - 目标范围最大值
     * @returns {number} 映射后的值
     */
    static map(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }
    
    /**
     * 生成随机整数
     * @param {number} min - 最小值（包含）
     * @param {number} max - 最大值（包含）
     * @returns {number} 随机整数
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * 生成随机浮点数
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number} 随机浮点数
     */
    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    /**
     * 生成随机布尔值
     * @param {number} probability - 真值的概率 (0-1)
     * @returns {boolean} 随机布尔值
     */
    static randomBool(probability = 0.5) {
        return Math.random() < probability;
    }
    
    /**
     * 从数组中随机选择一个元素
     * @param {Array} array - 数组
     * @returns {*} 随机元素
     */
    static randomChoice(array) {
        if (!array || array.length === 0) {
            return null;
        }
        return array[Math.floor(Math.random() * array.length)];
    }
    
    /**
     * 计算平均值
     * @param {Array} numbers - 数字数组
     * @returns {number} 平均值
     */
    static average(numbers) {
        if (!numbers || numbers.length === 0) {
            return 0;
        }
        const sum = numbers.reduce((acc, val) => acc + val, 0);
        return sum / numbers.length;
    }
    
    /**
     * 计算标准差
     * @param {Array} numbers - 数字数组
     * @returns {number} 标准差
     */
    static standardDeviation(numbers) {
        if (!numbers || numbers.length === 0) {
            return 0;
        }
        const avg = this.average(numbers);
        const squareDiffs = numbers.map(value => {
            const diff = value - avg;
            return diff * diff;
        });
        const avgSquareDiff = this.average(squareDiffs);
        return Math.sqrt(avgSquareDiff);
    }
    
    /**
     * 计算阶乘
     * @param {number} n - 非负整数
     * @returns {number} 阶乘结果
     */
    static factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    /**
     * 计算组合数 C(n, k)
     * @param {number} n - 总数
     * @param {number} k - 选择数
     * @returns {number} 组合数
     */
    static combinations(n, k) {
        if (k < 0 || k > n) return 0;
        if (k === 0 || k === n) return 1;
        
        k = Math.min(k, n - k);
        let result = 1;
        for (let i = 1; i <= k; i++) {
            result *= (n - k + i) / i;
        }
        return Math.round(result);
    }
    
    /**
     * 计算排列数 P(n, k)
     * @param {number} n - 总数
     * @param {number} k - 选择数
     * @returns {number} 排列数
     */
    static permutations(n, k) {
        if (k < 0 || k > n) return 0;
        
        let result = 1;
        for (let i = 0; i < k; i++) {
            result *= (n - i);
        }
        return result;
    }
    
    /**
     * 计算圆的面积
     * @param {number} radius - 半径
     * @returns {number} 面积
     */
    static circleArea(radius) {
        return Math.PI * radius * radius;
    }
    
    /**
     * 计算圆的周长
     * @param {number} radius - 半径
     * @returns {number} 周长
     */
    static circleCircumference(radius) {
        return 2 * Math.PI * radius;
    }
    
    /**
     * 计算扇形的面积
     * @param {number} radius - 半径
     * @param {number} angle - 角度（弧度）
     * @returns {number} 扇形面积
     */
    static sectorArea(radius, angle) {
        return 0.5 * radius * radius * angle;
    }
    
    /**
     * 计算弧长
     * @param {number} radius - 半径
     * @param {number} angle - 角度（弧度）
     * @returns {number} 弧长
     */
    static arcLength(radius, angle) {
        return radius * angle;
    }
    
    /**
     * 计算两点间的角度
     * @param {number} x1 - 点1的x坐标
     * @param {number} y1 - 点1的y坐标
     * @param {number} x2 - 点2的x坐标
     * @param {number} y2 - 点2的y坐标
     * @returns {number} 角度（弧度）
     */
    static angleBetweenPoints(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }
    
    /**
     * 计算向量的长度
     * @param {number} x - x分量
     * @param {number} y - y分量
     * @returns {number} 向量长度
     */
    static vectorLength(x, y) {
        return Math.sqrt(x * x + y * y);
    }
    
    /**
     * 标准化向量
     * @param {number} x - x分量
     * @param {number} y - y分量
     * @returns {Object} 标准化后的向量 {x, y}
     */
    static normalizeVector(x, y) {
        const length = this.vectorLength(x, y);
        if (length === 0) {
            return { x: 0, y: 0 };
        }
        return {
            x: x / length,
            y: y / length
        };
    }
    
    /**
     * 计算点积
     * @param {number} x1 - 向量1的x分量
     * @param {number} y1 - 向量1的y分量
     * @param {number} x2 - 向量2的x分量
     * @param {number} y2 - 向量2的y分量
     * @returns {number} 点积
     */
    static dotProduct(x1, y1, x2, y2) {
        return x1 * x2 + y1 * y2;
    }
    
    /**
     * 计算叉积
     * @param {number} x1 - 向量1的x分量
     * @param {number} y1 - 向量1的y分量
     * @param {number} x2 - 向量2的x分量
     * @param {number} y2 - 向量2的y分量
     * @returns {number} 叉积
     */
    static crossProduct(x1, y1, x2, y2) {
        return x1 * y2 - y1 * x2;
    }
    
    /**
     * 计算两个向量间的角度
     * @param {number} x1 - 向量1的x分量
     * @param {number} y1 - 向量1的y分量
     * @param {number} x2 - 向量2的x分量
     * @param {number} y2 - 向量2的y分量
     * @returns {number} 角度（弧度）
     */
    static angleBetweenVectors(x1, y1, x2, y2) {
        const dot = this.dotProduct(x1, y1, x2, y2);
        const length1 = this.vectorLength(x1, y1);
        const length2 = this.vectorLength(x2, y2);
        
        if (length1 === 0 || length2 === 0) {
            return 0;
        }
        
        const cosAngle = dot / (length1 * length2);
        return Math.acos(Math.max(-1, Math.min(1, cosAngle)));
    }
    
    /**
     * 检查点是否在圆内
     * @param {number} px - 点的x坐标
     * @param {number} py - 点的y坐标
     * @param {number} cx - 圆心的x坐标
     * @param {number} cy - 圆心的y坐标
     * @param {number} radius - 圆的半径
     * @returns {boolean} 是否在圆内
     */
    static pointInCircle(px, py, cx, cy, radius) {
        const dx = px - cx;
        const dy = py - cy;
        return dx * dx + dy * dy <= radius * radius;
    }
    
    /**
     * 检查点是否在矩形内
     * @param {number} px - 点的x坐标
     * @param {number} py - 点的y坐标
     * @param {number} rx - 矩形左上角x坐标
     * @param {number} ry - 矩形左上角y坐标
     * @param {number} width - 矩形宽度
     * @param {number} height - 矩形高度
     * @returns {boolean} 是否在矩形内
     */
    static pointInRectangle(px, py, rx, ry, width, height) {
        return px >= rx && px <= rx + width && py >= ry && py <= ry + height;
    }
    
    /**
     * 检查点是否在多边形内（射线法）
     * @param {number} px - 点的x坐标
     * @param {number} py - 点的y坐标
     * @param {Array} polygon - 多边形顶点数组 [{x, y}, ...]
     * @returns {boolean} 是否在多边形内
     */
    static pointInPolygon(px, py, polygon) {
        if (!polygon || polygon.length < 3) {
            return false;
        }
        
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, yi = polygon[i].y;
            const xj = polygon[j].x, yj = polygon[j].y;
            
            const intersect = ((yi > py) !== (yj > py)) &&
                (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
            
            if (intersect) inside = !inside;
        }
        
        return inside;
    }
    
    /**
     * 计算贝塞尔曲线上的点
     * @param {Array} points - 控制点数组 [{x, y}, ...]
     * @param {number} t - 参数 (0-1)
     * @returns {Object} 曲线上的点 {x, y}
     */
    static bezierPoint(points, t) {
        if (!points || points.length === 0) {
            return { x: 0, y: 0 };
        }
        
        if (points.length === 1) {
            return { ...points[0] };
        }
        
        // 递归计算
        const newPoints = [];
        for (let i = 0; i < points.length - 1; i++) {
            const x = this.lerp(points[i].x, points[i + 1].x, t);
            const y = this.lerp(points[i].y, points[i + 1].y, t);
            newPoints.push({ x, y });
        }
        
        return this.bezierPoint(newPoints, t);
    }
    
    /**
     * 生成UUID
     * @returns {string} UUID字符串
     */
    static generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    /**
     * 格式化数字（添加千位分隔符）
     * @param {number} number - 数字
     * @param {number} decimals - 小数位数
     * @returns {string} 格式化后的字符串
     */
    static formatNumber(number, decimals = 0) {
        if (isNaN(number)) return 'NaN';
        
        const fixed = number.toFixed(decimals);
        const parts = fixed.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        return parts.join('.');
    }
    
    /**
     * 计算百分比
     * @param {number} value - 值
     * @param {number} total - 总值
     * @param {number} decimals - 小数位数
     * @returns {string} 百分比字符串
     */
    static percentage(value, total, decimals = 1) {
        if (total === 0) return '0%';
        const percent = (value / total) * 100;
        return percent.toFixed(decimals) + '%';
    }
}

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathUtils;
}

// ES6模块导出
export { MathUtils };
