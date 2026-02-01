/**
 * 深色金主题配置
 * 奢华金色主题，适合深色背景
 */
const DarkGoldTheme = {
    // 主题基本信息
    id: 'dark-gold',
    name: '深色金',
    type: 'dark',
    description: '奢华金色主题，深色背景搭配金色元素',
    
    // 颜色系统
    colors: {
        // 主色调
        primary: '#D4AF37',      // 主要金色
        primaryLight: '#FFD700', // 亮金色
        primaryDark: '#B8860B',  // 暗金色
        
        // 背景色
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a1f1c 100%)',
        backgroundSolid: '#1a1a1a',
        surface: '#2a2a2a',
        surfaceLight: '#3a3a3a',
        surfaceDark: '#1a1a1a',
        
        // 文字色
        textPrimary: '#F0F0F0',
        textSecondary: '#B0B0B0',
        textTertiary: '#808080',
        textInverse: '#1a1a1a',
        
        // 边框色
        border: 'rgba(212, 175, 55, 0.3)',
        borderLight: 'rgba(212, 175, 55, 0.2)',
        borderDark: 'rgba(212, 175, 55, 0.4)',
        
        // 状态色
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#F44336',
        info: '#2196F3',
        
        // 特殊效果
        glow: 'rgba(255, 215, 0, 0.3)',
        shadow: 'rgba(0, 0, 0, 0.5)',
        overlay: 'rgba(0, 0, 0, 0.7)'
    },
    
    // 渐变配置
    gradients: {
        primary: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a1f1c 100%)',
        surface: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)',
        gold: 'linear-gradient(45deg, #D4AF37, #FFD700, #B8860B)'
    },
    
    // 阴影配置
    shadows: {
        sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
        md: '0 4px 12px rgba(0, 0, 0, 0.4)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
        xl: '0 12px 48px rgba(0, 0, 0, 0.6)',
        inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
        gold: '0 0 15px rgba(255, 215, 0, 0.3)',
        goldStrong: '0 0 30px rgba(255, 215, 0, 0.5)'
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
            '#D4AF37', '#FFD700', '#B8860B',
            '#C19A6B', '#E6BE8A', '#F0E68C'
        ],
        textStyle: {
            color: '#F0F0F0',
            fontSize: 14
        },
        title: {
            textStyle: {
                color: '#FFD700',
                fontWeight: 'bold'
            }
        },
        legend: {
            textStyle: {
                color: '#B0B0B0'
            }
        },
        tooltip: {
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            borderColor: '#D4AF37',
            textStyle: {
                color: '#F0F0F0'
            }
        }
    },
    
    // 旭日图特定配置
    sunburst: {
        levels: [
            {
                // 第0层（根节点）
                itemStyle: {
                    color: '#D4AF37',
                    borderColor: '#FFD700',
                    borderWidth: 2,
                    shadowBlur: 10,
                    shadowColor: 'rgba(255, 215, 0, 0.3)'
                }
            },
            {
                // 第1层
                r0: '15%',
                r: '30%',
                itemStyle: {
                    color: '#B8860B',
                    borderColor: '#D4AF37',
                    borderWidth: 1.5,
                    shadowBlur: 8,
                    shadowColor: 'rgba(212, 175, 55, 0.3)'
                }
            },
            {
                // 第2层
                r0: '30%',
                r: '50%',
                itemStyle: {
                    color: '#C19A6B',
                    borderColor: '#B8860B',
                    borderWidth: 1,
                    shadowBlur: 6,
                    shadowColor: 'rgba(184, 134, 11, 0.2)'
                }
            },
            {
                // 第3层
                r0: '50%',
                r: '70%',
                itemStyle: {
                    color: '#E6BE8A',
                    borderColor: '#C19A6B',
                    borderWidth: 0.5,
                    shadowBlur: 4,
                    shadowColor: 'rgba(193, 154, 107, 0.2)'
                }
            },
            {
                // 第4层
                r0: '70%',
                r: '90%',
                itemStyle: {
                    color: '#F0E68C',
                    borderColor: '#E6BE8A',
                    borderWidth: 0.5,
                    shadowBlur: 2,
                    shadowColor: 'rgba(230, 190, 138, 0.1)'
                }
            }
        ],
        label: {
            color: '#F0F0F0',
            fontSize: 14,
            fontWeight: 'normal'
        },
        emphasis: {
            itemStyle: {
                shadowBlur: 20,
                shadowColor: 'rgba(255, 215, 0, 0.5)'
            }
        }
    },
    
    // UI组件样式
    components: {
        button: {
            primary: {
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                color: '#1a1a1a',
                border: '1px solid #D4AF37',
                hover: {
                    background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
                    boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
                },
                active: {
                    background: 'linear-gradient(135deg, #B8860B 0%, #D4AF37 100%)'
                }
            },
            secondary: {
                background: 'transparent',
                color: '#D4AF37',
                border: '1px solid #D4AF37',
                hover: {
                    background: 'rgba(212, 175, 55, 0.1)',
                    boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)'
                }
            }
        },
        toolbar: {
            background: 'rgba(26, 26, 26, 0.9)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            backdropFilter: 'blur(10px)'
        },
        modal: {
            background: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
        },
        contextMenu: {
            background: 'rgba(42, 42, 42, 0.95)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            backdropFilter: 'blur(10px)'
        }
    },
    
    // 纹理和效果
    effects: {
        noise: {
            opacity: 0.03,
            blendMode: 'overlay'
        },
        grain: {
            opacity: 0.02,
            size: '2px'
        },
        glow: {
            primary: '0 0 20px rgba(212, 175, 55, 0.3)',
            strong: '0 0 40px rgba(255, 215, 0, 0.5)'
        }
    },
    
    // 导出配置
    export: {
        png: {
            backgroundColor: '#1a1a1a',
            quality: 0.95
        },
        svg: {
            backgroundColor: '#1a1a1a'
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
            return '#FFFFFF';
        },
        
        /**
         * 创建渐变
         * @param {Array} colors - 颜色数组
         * @param {string} direction - 方向
         * @returns {string} 渐变字符串
         */
        createGradient(colors, direction = '135deg') {
            return `linear-gradient(${direction}, ${colors.join(', ')})`;
        }
    }
};

// 导出主题配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkGoldTheme;
}