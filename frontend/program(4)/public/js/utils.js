/* ============================================
   器药同溯 - 工具函数文件
   ============================================ */

// 防抖函数
function debounce(func, wait) {
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

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 数字动画
function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeOutQuart(progress);
        const current = Math.floor(start + (target - start) * easeProgress);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// 缓动函数
function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// 显示 Toast 通知
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// 平滑滚动到元素
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;
    loadingScreen.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function navigateWithLoading(url) {
    if (!url) return;

    const isHashLink = typeof url === 'string' && url.startsWith('#');
    if (isHashLink) {
        scrollToSection(url.slice(1));
        return;
    }

    try {
        sessionStorage.setItem('nav-loading', '1');
    } catch { }

    showLoadingScreen();

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            window.location.href = url;
        });
    });
}

// 延迟函数
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 随机数生成
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 格式化日期
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 检查元素是否在视口中
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 检查元素是否部分在视口中
function isPartiallyInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom > 0 &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right > 0
    );
}

// 创建 Intersection Observer
function createObserver(callback, options = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
}

// 复制到剪贴板
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('已复制到剪贴板', 'success');
    } catch (err) {
        showToast('复制失败', 'error');
    }
}

// 文件大小格式化
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 验证文件类型
function validateFileType(file, allowedTypes) {
    const fileType = file.type.split('/')[1];
    return allowedTypes.includes(fileType);
}

// 读取文件为 DataURL
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 生成唯一ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// 深拷贝
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// 获取元素相对于文档的偏移
function getOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
    };
}

// 添加类名（支持多个）
function addClass(element, ...classNames) {
    element.classList.add(...classNames);
}

// 移除类名（支持多个）
function removeClass(element, ...classNames) {
    element.classList.remove(...classNames);
}

// 切换类名
function toggleClass(element, className) {
    element.classList.toggle(className);
}

// 检查是否有类名
function hasClass(element, className) {
    return element.classList.contains(className);
}

// 获取所有兄弟元素
function getSiblings(element) {
    return [...element.parentNode.children].filter(child => child !== element);
}

// 创建元素
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else if (key.startsWith('on')) {
            element.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    });

    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });

    return element;
}

// 鼠标跟随效果
function createMouseFollower(element, options = {}) {
    const { intensity = 0.1, resetOnLeave = true } = options;

    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        element.style.transform = `
            perspective(1000px)
            rotateX(${-y * intensity}deg)
            rotateY(${x * intensity}deg)
        `;
    });

    if (resetOnLeave) {
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    }
}

// 打字机效果
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    return new Promise(resolve => {
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

// 粒子效果配置
const PARTICLES_CONFIG = {
    particles: {
        number: {
            value: 50,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ["#1a4d2e", "#2d6a4f", "#c9a87c"]
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: 0.3,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 4,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#1a4d2e",
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "grab"
            },
            onclick: {
                enable: true,
                mode: "push"
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 0.5
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
};

// 导出到全局
window.utils = {
    debounce,
    throttle,
    animateNumber,
    showToast,
    scrollToSection,
    showLoadingScreen,
    navigateWithLoading,
    delay,
    random,
    formatDate,
    isInViewport,
    isPartiallyInViewport,
    createObserver,
    copyToClipboard,
    formatFileSize,
    validateFileType,
    readFileAsDataURL,
    generateId,
    deepClone,
    getOffset,
    addClass,
    removeClass,
    toggleClass,
    hasClass,
    getSiblings,
    createElement,
    createMouseFollower,
    typeWriter,
    PARTICLES_CONFIG
};
