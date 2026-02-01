/**
 * 布局计算器
 * 计算旭日图节点的角度和半径布局
 */
class LayoutCalculator {
    /**
     * 创建布局计算器
     * @param {Object} options - 配置选项
     */
    constructor(options = {}) {
        this.options = {
            innerRadius: 0.15,  // 内半径比例
            outerRadius: 0.90,  // 外半径比例
            gapAngle: 3,        // 间隙角度（度）
            maxDepth: 10,       // 最大深度
            ...options
        };
        
        // 缓存计算结果
        this.cache = new Map();
    }
    
    /**
     * 计算节点布局
     * @param {Array} nodes - 节点数组
     * @returns {Array} 带有布局信息的节点数组
     */
    calculateLayout(nodes) {
        if (!nodes || nodes.length === 0) {
            return [];
        }
        
        const cacheKey = this.generateCacheKey(nodes);
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        // 计算总权重
        const totalWeight = this.calculateTotalWeight(nodes);
        
        // 计算每个节点的角度范围
        const gapRadians = (this.options.gapAngle * Math.PI) / 180;
        const totalGapAngle = gapRadians * nodes.length;
        const availableAngle = 2 * Math.PI - totalGapAngle;
        
        // 计算布局
        const result = [];
        let currentAngle = 0;
        
        nodes.forEach((node, index) => {
            // 计算节点角度范围（基于权重）
            const nodeWeight = this.calculateNodeWeight(node);
            const angleRange = (nodeWeight / totalWeight) * availableAngle;
            
            // 创建带布局信息的节点副本
            const layoutNode = this.createLayoutNode(node, {
                startAngle: currentAngle,
                angleRange: angleRange,
                depth: 0,
                innerRadius: this.options.innerRadius,
                outerRadius: this.options.outerRadius
            });
            
            result.push(layoutNode);
            
            // 更新当前角度（包括间隙）
            currentAngle += angleRange;
            if (index < nodes.length - 1) {
                currentAngle += gapRadians;
            }
        });
        
        // 缓存结果
        this.cache.set(cacheKey, result);
        
        return result;
    }
    
    /**
     * 创建带布局信息的节点
     * @param {Object} node - 原始节点
     * @param {Object} layout - 布局信息
     * @returns {Object} 带布局信息的节点
     */
    createLayoutNode(node, layout) {
        const layoutNode = {
            ...node,
            startAngle: layout.startAngle,
            angleRange: layout.angleRange,
            depth: layout.depth,
            innerRadius: layout.innerRadius,
            outerRadius: layout.outerRadius
        };
        
        // 递归处理子节点
        if (node.children && node.children.length > 0) {
            const childDepth = layout.depth + 1;
            
            // 计算子节点的半径范围
            const radiusStep = (layout.outerRadius - layout.innerRadius) / (this.options.maxDepth + 1);
            const childInnerRadius = layout.innerRadius + (radiusStep * childDepth);
            const childOuterRadius = childInnerRadius + radiusStep;
            
            // 计算子节点布局
            const childTotalWeight = this.calculateTotalWeight(node.children);
            const gapRadians = (this.options.gapAngle * Math.PI) / 180;
            const totalGapAngle = gapRadians * node.children.length;
            const availableAngle = layout.angleRange - totalGapAngle;
            
            let childCurrentAngle = layout.startAngle;
            layoutNode.children = [];
            
            node.children.forEach((child, childIndex) => {
                const childWeight = this.calculateNodeWeight(child);
                const childAngleRange = (childWeight / childTotalWeight) * availableAngle;
                
                const childLayoutNode = this.createLayoutNode(child, {
                    startAngle: childCurrentAngle,
                    angleRange: childAngleRange,
                    depth: childDepth,
                    innerRadius: childInnerRadius,
                    outerRadius: childOuterRadius
                });
                
                layoutNode.children.push(childLayoutNode);
                
                // 更新角度（包括间隙）
                childCurrentAngle += childAngleRange;
                if (childIndex < node.children.length - 1) {
                    childCurrentAngle += gapRadians;
                }
            });
        }
        
        return layoutNode;
    }
    
    /**
     * 计算节点权重
     * @param {Object} node - 节点
     * @returns {number} 节点权重
     */
    calculateNodeWeight(node) {
        // 默认权重为1，可以根据需要扩展
        let weight = node.value || 1;
        
        // 考虑子节点数量
        if (node.children && node.children.length > 0) {
            weight += node.children.length * 0.1;
        }
        
        return Math.max(weight, 0.1); // 确保最小权重
    }
    
    /**
     * 计算总权重
     * @param {Array} nodes - 节点数组
     * @returns {number} 总权重
     */
    calculateTotalWeight(nodes) {
        return nodes.reduce((total, node) => {
            return total + this.calculateNodeWeight(node);
        }, 0);
    }
    
    /**
     * 计算节点的屏幕坐标
     * @param {Object} node - 带布局信息的节点
     * @param {number} width - 容器宽度
     * @param {number} height - 容器高度
     * @returns {Object} 坐标信息 { x, y, radius }
     */
    calculateScreenCoordinates(node, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2;
        
        // 计算中间角度
        const midAngle = node.startAngle + (node.angleRange / 2);
        
        // 计算中间半径
        const midRadius = (node.innerRadius + node.outerRadius) / 2;
        
        // 转换为笛卡尔坐标
        const x = centerX + Math.cos(midAngle) * radius * midRadius;
        const y = centerY + Math.sin(midAngle) * radius * midRadius;
        
        // 计算实际半径（像素）
        const actualRadius = radius * (node.outerRadius - node.innerRadius) / 2;
        
        return {
            x,
            y,
            radius: actualRadius,
            angle: midAngle,
            depth: node.depth
        };
    }
    
    /**
     * 从屏幕坐标查找节点
     * @param {number} x - 屏幕X坐标
     * @param {number} y - 屏幕Y坐标
     * @param {Array} nodes - 节点数组
     * @param {number} width - 容器宽度
     * @param {number} height - 容器高度
     * @returns {Object|null} 找到的节点
     */
    findNodeByCoordinates(x, y, nodes, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2;
        
        // 计算点击位置相对于圆心的极坐标
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 如果点击在圆外，返回null
        if (distance > radius) {
            return null;
        }
        
        // 计算角度（0到2π）
        let angle = Math.atan2(dy, dx);
        if (angle < 0) angle += 2 * Math.PI;
        
        // 计算半径比例
        const radiusRatio = distance / radius;
        
        // 查找匹配的节点
        return this.findNodeByPolar(angle, radiusRatio, nodes);
    }
    
    /**
     * 通过极坐标查找节点
     * @param {number} angle - 角度（弧度）
     * @param {number} radiusRatio - 半径比例
     * @param {Array} nodes - 节点数组
     * @returns {Object|null} 找到的节点
     */
    findNodeByPolar(angle, radiusRatio, nodes) {
        for (const node of nodes) {
            // 检查角度是否在节点范围内
            const angleStart = node.startAngle;
            const angleEnd = node.startAngle + node.angleRange;
            
            // 处理角度环绕
            let angleInRange = false;
            if (angleStart <= angleEnd) {
                angleInRange = angle >= angleStart && angle <= angleEnd;
            } else {
                angleInRange = angle >= angleStart || angle <= angleEnd;
            }
            
            // 检查半径是否在节点范围内
            const radiusInRange = radiusRatio >= node.innerRadius && radiusRatio <= node.outerRadius;
            
            if (angleInRange && radiusInRange) {
                // 检查是否有子节点
                if (node.children && node.children.length > 0) {
                    const childResult = this.findNodeByPolar(angle, radiusRatio, node.children);
                    if (childResult) {
                        return childResult;
                    }
                }
                
                // 返回当前节点
                return node;
            }
        }
        
        return null;
    }
    
    /**
     * 优化布局以避免过度稀疏
     * @param {Array} nodes - 节点数组
     * @param {number} minAngle - 最小角度（弧度）
     * @returns {Array} 优化后的节点数组
     */
    optimizeLayout(nodes, minAngle = 0.05) {
        const optimizedNodes = [];
        
        // 计算总权重和需要调整的节点
        let totalWeight = 0;
        const smallNodes = [];
        const largeNodes = [];
        
        nodes.forEach(node => {
            const weight = this.calculateNodeWeight(node);
            totalWeight += weight;
            
            // 估计角度（假设均匀分布）
            const estimatedAngle = (weight / totalWeight) * 2 * Math.PI;
            
            if (estimatedAngle < minAngle) {
                smallNodes.push({ node, weight });
            } else {
                largeNodes.push({ node, weight });
            }
        });
        
        // 重新分配小节点的角度
        if (smallNodes.length > 0) {
            // 计算需要从大节点借用的角度
            const totalSmallWeight = smallNodes.reduce((sum, item) => sum + item.weight, 0);
            const angleToBorrow = (minAngle * smallNodes.length) - 
                                 (totalSmallWeight / totalWeight * 2 * Math.PI);
            
            if (angleToBorrow > 0 && largeNodes.length > 0) {
                // 从大节点按比例借用角度
                const totalLargeWeight = largeNodes.reduce((sum, item) => sum + item.weight, 0);
                
                largeNodes.forEach(item => {
                    const borrowRatio = item.weight / totalLargeWeight;
                    item.borrowedAngle = angleToBorrow * borrowRatio;
                });
            }
        }
        
        // 构建优化后的节点数组
        // 这里简化处理，实际实现需要更复杂的逻辑
        return nodes.map(node => {
            const optimizedNode = { ...node };
            
            // 确保最小角度
            if (optimizedNode.angleRange < minAngle) {
                optimizedNode.angleRange = minAngle;
            }
            
            return optimizedNode;
        });
    }
    
    /**
     * 计算节点间的距离
     * @param {Object} node1 - 节点1
     * @param {Object} node2 - 节点2
     * @param {number} width - 容器宽度
     * @param {number} height - 容器高度
     * @returns {number} 距离（像素）
     */
    calculateDistanceBetweenNodes(node1, node2, width, height) {
        const coords1 = this.calculateScreenCoordinates(node1, width, height);
        const coords2 = this.calculateScreenCoordinates(node2, width, height);
        
        const dx = coords2.x - coords1.x;
        const dy = coords2.y - coords1.y;
        
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * 检查布局是否有效
     * @param {Array} nodes - 节点数组
     * @returns {Object} 检查结果 { isValid: boolean, issues: Array }
     */
    validateLayout(nodes) {
        const issues = [];
        
        // 检查角度总和
        const totalAngle = nodes.reduce((sum, node) => sum + node.angleRange, 0);
        const expectedAngle = 2 * Math.PI;
        const angleError = Math.abs(totalAngle - expectedAngle);
        
        if (angleError > 0.01) {
            issues.push(`角度总和错误: 期望 ${expectedAngle.toFixed(4)}, 实际 ${totalAngle.toFixed(4)}`);
        }
        
        // 检查角度重叠
        const sortedNodes = [...nodes].sort((a, b) => a.startAngle - b.startAngle);
        
        for (let i = 0; i < sortedNodes.length - 1; i++) {
            const node1 = sortedNodes[i];
            const node2 = sortedNodes[i + 1];
            
            const node1End = node1.startAngle + node1.angleRange;
            
            if (node1End > node2.startAngle) {
                issues.push(`节点角度重叠: ${node1.name} 和 ${node2.name}`);
            }
        }
        
        // 检查半径范围
        const checkNodeRadius = (node, depth = 0) => {
            if (node.innerRadius >= node.outerRadius) {
                issues.push(`节点半径无效: ${node.name} (内半径 >= 外半径)`);
            }
            
            if (node.innerRadius < 0 || node.outerRadius > 1) {
                issues.push(`节点半径超出范围: ${node.name}`);
            }
            
            if (node.children) {
                node.children.forEach(child => {
                    if (child.innerRadius < node.innerRadius || child.outerRadius > node.outerRadius) {
                        issues.push(`子节点半径超出父节点范围: ${child.name}`);
                    }
                    
                    checkNodeRadius(child, depth + 1);
                });
            }
        };
        
        nodes.forEach(node => checkNodeRadius(node));
        
        return {
            isValid: issues.length === 0,
            issues,
            stats: {
                totalNodes: this.countNodes(nodes),
                totalAngle,
                angleError,
                maxDepth: this.calculateMaxDepth(nodes)
            }
        };
    }
    
    /**
     * 计算节点总数
     * @param {Array} nodes - 节点数组
     * @returns {number} 节点总数
     */
    countNodes(nodes) {
        let count = 0;
        
        const countNode = (node) => {
            count++;
            if (node.children) {
                node.children.forEach(child => countNode(child));
            }
        };
        
        nodes.forEach(node => countNode(node));
        return count;
    }
    
    /**
     * 计算最大深度
     * @param {Array} nodes - 节点数组
     * @returns {number} 最大深度
     */
    calculateMaxDepth(nodes) {
        let maxDepth = 0;
        
        const calculateDepth = (node, depth) => {
            maxDepth = Math.max(maxDepth, depth);
            if (node.children) {
                node.children.forEach(child => calculateDepth(child, depth + 1));
            }
        };
        
        nodes.forEach(node => calculateDepth(node, 0));
        return maxDepth;
    }
    
    /**
     * 生成缓存键
     * @param {Array} nodes - 节点数组
     * @returns {string} 缓存键
     */
    generateCacheKey(nodes) {
        // 简单实现：使用JSON字符串
        return JSON.stringify(nodes);
    }
    
    /**
     * 清除缓存
     */
    clearCache() {
        this.cache.clear();
    }
    
    /**
     * 获取布局统计信息
     * @param {Array} nodes - 节点数组
     * @returns {Object} 统计信息
     */
    getLayoutStats(nodes) {
        return {
            totalNodes: this.countNodes(nodes),
            maxDepth: this.calculateMaxDepth(nodes),
            totalWeight: this.calculateTotalWeight(nodes),
            minAngle: Math.min(...nodes.map(n => n.angleRange)),
            maxAngle: Math.max(...nodes.map(n => n.angleRange)),
            avgAngle: nodes.reduce((sum, n) => sum + n.angleRange, 0) / nodes.length
        };
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LayoutCalculator;
}