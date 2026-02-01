/**
 * 旭日图引擎
 * ECharts旭日图渲染和交互控制
 */
class SunburstEngine {
    /**
     * 创建旭日图引擎
     * @param {HTMLElement} container - 图表容器元素
     * @param {Object} options - 配置选项
     */
    constructor(container, options = {}) {
        if (!container) {
            throw new Error('图表容器不能为空');
        }
        
        this.container = container;
        this.options = {
            theme: 'light-blue',
            animation: true,
            gapAngle: 3, // 间隙角度
            showLabel: true,
            showTooltip: true,
            enableHighlight: true,
            ...options
        };
        
        this.chart = null;
        this.data = [];
        this.selectedNode = null;
        this.highlightedNode = null;
        
        // 事件监听器
        this.eventListeners = new Map();
        
        // 初始化图表
        this.initChart();
    }
    
    /**
     * 初始化ECharts图表
     */
    initChart() {
        // 检查ECharts是否已加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts未加载，请确保已引入ECharts库');
            return;
        }
        
        // 创建图表实例
        this.chart = echarts.init(this.container, this.options.theme);
        
        // 设置基础配置
        this.setBaseOption();
        
        // 绑定事件
        this.bindEvents();
        
        // 窗口大小变化时重绘
        window.addEventListener('resize', () => {
            if (this.chart) {
                this.chart.resize();
            }
        });
    }
    
    /**
     * 设置基础配置
     */
    setBaseOption() {
        const baseOption = {
            backgroundColor: 'transparent',
            tooltip: {
                show: this.options.showTooltip,
                trigger: 'item',
                formatter: this.tooltipFormatter.bind(this)
            },
            series: [{
                type: 'sunburst',
                nodeClick: 'rootToNode', // 点击节点跳转到该节点
                radius: ['15%', '90%'],
                sort: null, // 保持原始顺序
                emphasis: {
                    focus: 'ancestor',
                    itemStyle: {
                        shadowBlur: 20,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                levels: this.getLevelsConfig(),
                label: {
                    show: this.options.showLabel,
                    rotate: 'radial',
                    color: '#333',
                    fontSize: 14,
                    fontWeight: 'normal',
                    formatter: this.labelFormatter.bind(this)
                },
                itemStyle: {
                    borderWidth: 1,
                    borderType: 'solid',
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                },
                data: this.data,
                animation: this.options.animation,
                animationDuration: 500,
                animationEasing: 'cubicOut',
                animationDelay: function(idx) {
                    return idx * 50;
                }
            }]
        };
        
        if (this.chart) {
            this.chart.setOption(baseOption, true);
        }
        
        return baseOption;
    }
    
    /**
     * 获取层级配置
     * @returns {Array} 层级配置数组
     */
    getLevelsConfig() {
        return [
            {}, // 第0层使用默认配置
            {
                r0: '15%',
                r: '25%',
                itemStyle: {
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.4)'
                },
                label: {
                    rotate: 'tangential'
                }
            },
            {
                r0: '25%',
                r: '45%',
                itemStyle: {
                    borderWidth: 1.5,
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                }
            },
            {
                r0: '45%',
                r: '65%',
                itemStyle: {
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                }
            },
            {
                r0: '65%',
                r: '85%',
                itemStyle: {
                    borderWidth: 0.5,
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                },
                label: {
                    position: 'outside',
                    padding: 3,
                    silent: false
                }
            }
        ];
    }
    
    /**
     * 设置数据
     * @param {Array} data - 旭日图数据
     * @param {boolean} applyGaps - 是否应用间隙
     */
    setData(data, applyGaps = true) {
        this.data = data;
        
        // 应用间隙（如果需要）
        let processedData = data;
        if (applyGaps && this.options.gapAngle > 0) {
            processedData = this.applyGaps(data, this.options.gapAngle);
        }
        
        // 更新图表
        if (this.chart) {
            this.chart.setOption({
                series: [{
                    data: processedData
                }]
            });
        }
        
        // 触发事件
        this.emit('dataChanged', { data: processedData, originalData: data });
    }
    
    /**
     * 应用间隙到数据
     * @param {Array} data - 原始数据
     * @param {number} gapAngle - 间隙角度（度）
     * @returns {Array} 包含间隙的数据
     */
    applyGaps(data, gapAngle = 3) {
        const gapRadians = (gapAngle * Math.PI) / 180;
        
        const processNode = (node, parentAngleRange = 2 * Math.PI, parentStartAngle = 0) => {
            if (!node.children || node.children.length === 0) {
                return node;
            }
            
            const childrenCount = node.children.length;
            const totalGapAngle = gapRadians * childrenCount;
            const childAngle = (parentAngleRange - totalGapAngle) / childrenCount;
            
            const newChildren = [];
            let currentAngle = parentStartAngle;
            
            node.children.forEach((child, index) => {
                // 设置子节点角度
                child.startAngle = currentAngle;
                child.angleRange = childAngle;
                currentAngle += childAngle;
                
                // 递归处理子节点
                newChildren.push(processNode(child, childAngle, child.startAngle));
                
                // 插入间隙节点（最后一个不插）
                if (index < childrenCount - 1) {
                    const gapNode = {
                        name: '',
                        value: 0,
                        itemStyle: {
                            color: 'transparent',
                            borderWidth: 0
                        },
                        startAngle: currentAngle,
                        angleRange: gapRadians,
                        children: [],
                        isGap: true
                    };
                    currentAngle += gapRadians;
                    newChildren.push(gapNode);
                }
            });
            
            node.children = newChildren;
            return node;
        };
        
        return data.map(node => processNode(node));
    }
    
    /**
     * 更新节点颜色
     * @param {string} nodeId - 节点ID
     * @param {string} color - 颜色值
     */
    updateNodeColor(nodeId, color) {
        if (!this.chart) return;
        
        // 查找节点并更新颜色
        const updateNodeColorRecursive = (nodes) => {
            for (const node of nodes) {
                if (node.id === nodeId) {
                    node.itemStyle = node.itemStyle || {};
                    node.itemStyle.color = color;
                    return true;
                }
                
                if (node.children && node.children.length > 0) {
                    if (updateNodeColorRecursive(node.children)) {
                        return true;
                    }
                }
            }
            return false;
        };
        
        if (updateNodeColorRecursive(this.data)) {
            this.refresh();
        }
    }
    
    /**
     * 高亮节点
     * @param {string} nodeId - 节点ID
     */
    highlightNode(nodeId) {
        if (!this.chart || !nodeId) return;
        
        this.highlightedNode = nodeId;
        
        // 使用ECharts的highlight API
        this.chart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: this.findNodeIndex(nodeId)
        });
        
        this.emit('nodeHighlighted', { nodeId });
    }
    
    /**
     * 清除高亮
     */
    clearHighlight() {
        if (!this.chart) return;
        
        this.chart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0
        });
        
        this.highlightedNode = null;
        this.emit('highlightCleared');
    }
    
    /**
     * 选中节点
     * @param {string} nodeId - 节点ID
     */
    selectNode(nodeId) {
        if (!this.chart) return;
        
        const oldSelected = this.selectedNode;
        this.selectedNode = nodeId;
        
        // 更新图表选中状态
        this.chart.dispatchAction({
            type: 'select',
            seriesIndex: 0,
            dataIndex: this.findNodeIndex(nodeId)
        });
        
        this.emit('nodeSelected', { 
            nodeId, 
            oldSelectedNodeId: oldSelected 
        });
    }
    
    /**
     * 查找节点索引
     * @param {string} nodeId - 节点ID
     * @returns {number} 节点索引
     */
    findNodeIndex(nodeId) {
        let index = -1;
        let currentIndex = 0;
        
        const findNodeRecursive = (nodes) => {
            for (const node of nodes) {
                if (node.id === nodeId) {
                    index = currentIndex;
                    return true;
                }
                currentIndex++;
                
                if (node.children && node.children.length > 0) {
                    if (findNodeRecursive(node.children)) {
                        return true;
                    }
                }
            }
            return false;
        };
        
        findNodeRecursive(this.data);
        return index;
    }
    
    /**
     * 刷新图表
     */
    refresh() {
        if (this.chart) {
            this.chart.setOption({
                series: [{
                    data: this.data
                }]
            }, true);
        }
    }
    
    /**
     * 重新绘制图表
     */
    resize() {
        if (this.chart) {
            this.chart.resize();
        }
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        if (!this.chart) return;
        
        // 点击事件
        this.chart.on('click', (params) => {
            if (params.componentType === 'series' && params.seriesType === 'sunburst') {
                const nodeId = params.data?.id;
                if (nodeId) {
                    this.selectNode(nodeId);
                    this.emit('nodeClicked', { 
                        nodeId, 
                        nodeName: params.data.name,
                        event: params.event
                    });
                }
            }
        });
        
        // 右键事件
        this.chart.getZr().on('contextmenu', (event) => {
            event.event.preventDefault();
            
            const point = [event.event.offsetX, event.event.offsetY];
            const dataIndex = this.chart.convertFromPixel('series', point);
            
            if (dataIndex && dataIndex.dataIndex !== undefined) {
                // 查找对应的节点
                const node = this.findNodeByIndex(dataIndex.dataIndex);
                if (node) {
                    this.emit('nodeRightClicked', {
                        nodeId: node.id,
                        nodeName: node.name,
                        event: event.event
                    });
                }
            }
        });
        
        // 悬停事件
        this.chart.on('mouseover', (params) => {
            if (params.componentType === 'series' && params.seriesType === 'sunburst') {
                const nodeId = params.data?.id;
                if (nodeId) {
                    this.emit('nodeMouseOver', { 
                        nodeId, 
                        nodeName: params.data.name
                    });
                }
            }
        });
        
        this.chart.on('mouseout', (params) => {
            this.emit('nodeMouseOut');
        });
    }
    
    /**
     * 通过索引查找节点
     * @param {number} index - 节点索引
     * @returns {Object|null} 节点对象
     */
    findNodeByIndex(index) {
        let currentIndex = 0;
        
        const findNodeRecursive = (nodes) => {
            for (const node of nodes) {
                if (currentIndex === index) {
                    return node;
                }
                currentIndex++;
                
                if (node.children && node.children.length > 0) {
                    const found = findNodeRecursive(node.children);
                    if (found) return found;
                }
            }
            return null;
        };
        
        return findNodeRecursive(this.data);
    }
    
    /**
     * 工具提示格式化器
     * @param {Object} params - 工具提示参数
     * @returns {string} 格式化后的文本
     */
    tooltipFormatter(params) {
        const node = params.data;
        if (!node) return '';
        
        let html = `<div style="font-weight: bold; margin-bottom: 5px;">${node.name}</div>`;
        
        if (node.value !== undefined && node.value !== 1) {
            html += `<div>值: ${node.value}</div>`;
        }
        
        if (node.depth !== undefined) {
            html += `<div>深度: ${node.depth}</div>`;
        }
        
        if (node.children && node.children.length > 0) {
            const childCount = node.children.filter(c => !c.isGap).length;
            html += `<div>子节点数: ${childCount}</div>`;
        }
        
        return html;
    }
    
    /**
     * 标签格式化器
     * @param {Object} params - 标签参数
     * @returns {string} 格式化后的标签文本
     */
    labelFormatter(params) {
        const node = params.data;
        
        // 间隙节点不显示标签
        if (node.isGap) {
            return '';
        }
        
        // 根据角度范围决定是否显示完整名称
        if (params.angleRange < 0.1) { // 角度太小
            return '';
        }
        
        // 截断长名称
        const maxLength = Math.floor(params.angleRange * 10); // 根据角度动态调整
        if (node.name.length > maxLength && maxLength > 3) {
            return node.name.substring(0, maxLength - 2) + '...';
        }
        
        return node.name;
    }
    
    /**
     * 设置主题
     * @param {string} theme - 主题名称
     */
    setTheme(theme) {
        this.options.theme = theme;
        
        if (this.chart) {
            // 重新初始化图表
            this.chart.dispose();
            this.chart = echarts.init(this.container, theme);
            this.setBaseOption();
            this.bindEvents();
            
            if (this.data.length > 0) {
                this.setData(this.data, false);
            }
        }
    }
    
    /**
     * 获取图表实例
     * @returns {Object} ECharts图表实例
     */
    getChartInstance() {
        return this.chart;
    }
    
    /**
     * 获取当前数据
     * @returns {Array} 当前数据
     */
    getData() {
        return this.data;
    }
    
    /**
     * 销毁图表
     */
    destroy() {
        if (this.chart) {
            this.chart.dispose();
            this.chart = null;
        }
        
        // 移除事件监听器
        this.eventListeners.clear();
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
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SunburstEngine;
}