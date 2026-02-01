/**
 * 浅色蓝主题配置
 * 清新蓝色主题，适合浅色背景
 */
const LightBlueTheme = {
    // 主题基本信息
    id: 'light-blue',
    name: '浅色蓝',
    type: 'light',
    description: '清新蓝色主题，浅色背景搭配蓝色元素',
    
    // 颜色系统
    colors: {
        // 主色调
        primary: '#36A1D6',      // 主要蓝色
        primaryLight: '#87CEEB', // 浅蓝色
        primaryDark: '#1E88E5',  // 深蓝色
        
        // 背景色
        background: 'linear-gradient(135deg, #E6F7FF 0%, #B3E0FF 50%, #66CCFF 100%)',
        backgroundSolid: '#F5FBFF',
        surface: '#FFFFFF',
        surfaceLight: '#F8FDFF',
        surfaceDark: '#E6F7FF',
        
        // 文字色
        textPrimary: '#2C3E50',
        textSecondary: '#4A6572',
        textTertiary: '#7B8B9A',
        textInverse: '#FFFFFF',
        
        // 边框色
        border: 'rgba(54, 161, 214, 0.3)',
        borderLight: 'rgba(54, 161, 214, 0.2)',
        borderDark: 'rgba(54, 161, 214, 0.4)',
        
        // 状态色
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
        
        // 特殊效果
        glow: 'rgba(102, 204, 255, 0.3)',
        shadow: 'rgba(0, 0, 0, 0.1)',
        overlay: 'rgba(255, 255, 255, 0.9)'
    },
    
    // 渐变配置
    gradients: {
        primary: 'linear-gradient(135deg, #36A1D6 0%, #87CEEB 50%, #1E88E5 100%)',
        background: 'linear-gradient(135deg, #E6F7FF 0%, #B3E0FF 50%, #66CCFF 100%)',
        surface: 'linear-gradient(135deg, #FFFFFF 0%, #F8FDFF 100%)',
        blue: 'linear-gradient(45deg, #36A1D6, #87CEEB, #1E88E5)'
    },
    
    // 阴影配置
    shadows: {
        sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
        md: '0 4px 12px rgba(0, 0, 0, 0.15)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.2)',
        xl: '0 12px 48px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
        blue: '0 0 15px rgba(102, 204, 255, 0.3)',
        blueStrong: '0 0 30px rgba(102, 204, 255, 0.4)'
    },
    
    // 边框半径
    borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px'
    },
    
    // 间距系统
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px'
    },
    
    // 字体系统
    typography: {
        fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
        fontSize: {
            xs: '12px',
            sm: '14px',
            md: '16px',
            lg: '20px',
            xl: '24px',
            xxl: '32px'
        },
        fontWeight: {
            light: 300,
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700
        },
        lineHeight: {
            tight: 1.2,
            normal: 1.5,
            relaxed: 1.75
        }
    },
    
    // 动画配置
    animations: {
        duration: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms'
        },
        easing: {
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
        }
    },
    
    // ECharts主题配置
    echarts: {
        backgroundColor: 'transparent',
        color: [
            '#36A1D6', '#87CEEB', '#1E88E5',
            '#66CCFF', '#B3E0FF', '#E6F7FF'
        ],
        textStyle: {
            color: '#2C3E50',
            fontSize: 14
        },
        title: {
            textStyle: {
                color: '#1E88E5',
                fontWeight: 'bold'
            }
        },
        legend: {
            textStyle: {
                color: '#4A6572'
            }
        },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#36A1D6',
            textStyle: {
                color: '#2C3E50'
            }
        }
    },
    
    // 旭日图特定配置
    sunburst: {
        levels: [
            {
                // 第0层（根节点）
                itemStyle: {
                    color: '#36A1D6',
                    borderColor: '#1E88E5',
                    borderWidth: 2,
                    shadowBlur: 10,
                    shadowColor: 'rgba(54, 161, 214, 0.3)'
                }
            },
            {
                // 第1层
                r0: '15%',
                r: '30%',
                itemStyle: {
                    color: '#1E88E5',
                    borderColor: '#36A1D6',
                    borderWidth: 1.5,
                    shadowBlur: 8,
                    shadowColor: 'rgba(30, 136, 229, 0.3)'
                }
            },
            {
                // 第2层
                r0: '30%',
                r: '50%',
                itemStyle: {
                    color: '#66CCFF',
                    borderColor: '#1E88E5',
                    borderWidth: 1,
                    shadowBlur: 6,
                    shadowColor: 'rgba(102, 204, 255, 0.2)'
                }
            },
            {
                // 第3层
                r0: '50%',
                r: '70%',
                itemStyle: {
                    color: '#87CEEB',
                    borderColor: '#66CCFF',
                    borderWidth: 0.5,
                    shadowBlur: 4,
                    shadowColor: 'rgba(135, 206, 235, 0.2)'
                }
            },
            {
                // 第4层
                r0: '70%',
                r: '90%',
                itemStyle: {
                    color: '#B3E0FF',
                    borderColor: '#87CEEB',
                    borderWidth: 0.5,
                    shadowBlur: 2,
                    shadowColor: 'rgba(179, 224, 255, 0.1)'
                }
            }
        ],
        label: {
            color: '#2C3E50',
            fontSize: 14,
            fontWeight: 'normal'
        },
        emphasis: {
            itemStyle: {
                shadowBlur: 20,
                shadowColor: 'rgba(102, 204, 255, 0.4)'
            }
        }
    },
    
    // UI组件样式
    components: {
        button: {
            primary: {
                background: 'linear-gradient(135deg, #36A1D6 0%, #1E88E5 100%)',
                color: '#FFFFFF',
                border: '1px solid #36A1D6',
                hover: {
                    background: 'linear-gradient(135deg, #66CCFF 0%, #36A1D6 100%)',
                    boxShadow: '0 0 15px rgba(102, 204, 255, 0.3)'
                },
                active: {
                    background: 'linear-gradient(135deg, #1E88E5 0%, #36A1D6 100%)'
                }
            },
            secondary: {
                background: 'transparent',
                color: '#36A1D6',
                border: '1px solid #36A1D6',
                hover: {
                    background: 'rgba(54, 161, 214, 0.1)',
                    boxShadow: '0 0 10px rgba(54, 161, 214, 0.2)'
                }
            }
        },
        toolbar: {
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(54, 161, 214, 0.3)',
            backdropFilter: 'blur(10px)'
        },
        modal: {
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FDFF 100%)',
            border: '1px solid rgba(54, 161, 214, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
        },
        contextMenu: {
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(54, 161, 214, 0.3)',
            backdropFilter: 'blur(10px)'
        }
    },
    
    // 纹理和效果
    effects: {
        noise: {
            opacity: 0.02,
            blendMode: 'multiply'
        },
        grain: {
            opacity: 0.01,
            size: '1px'
        },
        glow: {
            primary: '0 0 20px rgba(102, 204, 255, 0.3)',
            strong: '0 0 40px rgba(102, 204, 255, 0.4)'
        }
    },
    
    // 导出配置
    export: {
        png: {
            backgroundColor: '#FFFFFF',
            quality: 0.95
        },
        svg: {
            backgroundColor: '#FFFFFF'
        }
    },
    
    // 辅助函数
    utils: {
        /**
         * 获取颜色变体
         * @param {string} baseColor - 基础颜色
         * @param {number} lightnessDelta - 亮度变化 (-100 到 100)
         * @returns {string} 调整后的颜色
         */
        adjustLightness(baseColor, lightnessDelta) {
            // 简化实现，实际应使用颜色库
            if (baseColor.startsWith('#')) {
                return baseColor; // 简化处理
            }
            return baseColor;
        },
        
        /**
         * 获取对比色
         * @param {string} color - 原始颜色
         * @returns {string} 对比色
         */
        getContrastColor(color) {
            // 简化实现
            return '#2C3E50';
        },
        
        /**
         * 创建渐变
         * @param {Array} colors - 颜色数组
         * @param {string} direction - 方向
         * @returns {string} 渐变字符串
         */
        createGradient(colors, direction = '135deg') {
            return `linear-gradient(${direction}, ${colors.join(', ')})`;
        },
        
        /**
         * 创建玻璃态效果
         * @returns {Object} 玻璃态样式
         */
        createGlassEffect() {
            return {
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            };
        }
    },
    
    // 主题变体
    variants: {
        ocean: {
            colors: {
                primary: '#0077B6',
                background: 'linear-gradient(135deg, #CAF0F8 0%, #90E0EF 50%, #00B4D8 100%)'
            }
        },
        sky: {
            colors: {
                primary: '#1E88E5',
                background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #64B5F6 100%)'
            }
        },
        ice: {
            colors: {
                primary: '#4FC3F7',
                background: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 50%, #81D4FA 100%)'
            }
        }
    },
    
    // 主题元数据
    metadata: {
        created: '2024-01-01',
        version: '1.0.0',
        author: 'Sunburst MindMap Team',
        tags: ['light', 'blue', 'fresh', 'modern']
    }
};

// 导出主题配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LightBlueTheme;
}