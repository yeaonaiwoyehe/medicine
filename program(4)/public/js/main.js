/* ============================================
   器药同溯 - 主JavaScript文件
   ============================================ */

// 全局变量
let artifactsSwiper = null;
let currentTheme = 'light';
let uploadedFile = null;
let currentUser = null;
const REGISTERED_USERS_KEY = 'registeredUsers';
const CURRENT_USER_KEY = 'currentUser';
const UPLOAD_API_URL = window.UPLOAD_API_URL || 'http://39.107.123.87:5000/upload';
const LOCAL_KNOWLEDGE_FALLBACK = {
    'bianshi_001.jpg': {
        name: '砭石和骨针',
        dynasty: '新石器时期',
        type: '针灸经络',
        material: '砭石、兽骨',
        description: '中国最早的原始医疗工具，用于针刺、放血、切开痈肿，是针灸针具的前身',
        usage: '以砭石按压、刮擦、刺破体表穴位，缓解疼痛、排出脓血',
        acupoint: '体表痛处、阿是穴'
    },
    'bianshi_002.jpg': {
        name: '民国针灸针套装',
        dynasty: '民国',
        type: '针灸经络',
        material: '金属、木质',
        description: '民国时期中医行医常用针灸针具，含多规格针体，收纳于木筒，便于携带使用',
        usage: '根据病症选取对应穴位，刺入皮下留针或行针，调理脏腑气血',
        acupoint: '全身经络穴位，如合谷、足三里、三阴交'
    }
};

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// 初始化应用
async function initializeApp() {
    // 加载动画
    await simulateLoading();

    const safeInit = (fn) => {
        try {
            fn();
        } catch (error) {
            console.warn(`[init] ${fn.name || 'anonymous'} failed:`, error);
        }
    };

    // 先初始化核心交互，保证导航/登录在各页面都可用
    safeInit(initNavbar);
    safeInit(initThemeToggle);
    safeInit(initAuthSystem);
    safeInit(initAccessGuards);

    // 其余模块按页面能力容错初始化，避免单点报错中断全局
    safeInit(initParticles);
    safeInit(initScrollAnimations);
    safeInit(initArtifactsSwiper);
    safeInit(initHeroDynamicContent);
    safeInit(initUploadArea);
    safeInit(initCharts);
    safeInit(initKnowledgeGraphObserver);
    safeInit(initRecommendations);
    safeInit(initEncyclopediaSystem);
    safeInit(initBackToTop);
    safeInit(initNumberAnimations);

    // 移除加载屏幕
    hideLoadingScreen();
}

// 模拟加载
function simulateLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) {
        // 某些子页面没有加载层，直接初始化，避免导航和登录状态延迟不同步
        return Promise.resolve();
    }

    let isNavigationLoading = false;
    try {
        isNavigationLoading = sessionStorage.getItem('nav-loading') === '1';
        if (isNavigationLoading) sessionStorage.removeItem('nav-loading');
    } catch { }

    return new Promise(resolve => {
        setTimeout(resolve, isNavigationLoading ? 600 : 2000);
    });
}

// 隐藏加载屏幕
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;
    loadingScreen.classList.add('hidden');
    document.body.style.overflow = '';
}

// 初始化粒子效果
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-bg', utils.PARTICLES_CONFIG);
    }
}

// 初始化导航栏
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!navbar) return;

    const path = (window.location.pathname || '').toLowerCase();
    const isHomePage = path === '/' || path.endsWith('/index.html') || path.endsWith('index.html');

    // 非首页：导航栏始终不透明白底，避免盖住正文时仍透出背景
    if (!isHomePage) {
        navbar.classList.add('scrolled');
    }

    // 滚动效果（首页：顶部透明，滚动后白底；其他页保持白底）
    window.addEventListener('scroll', utils.throttle(() => {
        if (isHomePage) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // 更新活动链接
        updateActiveNavLink();
    }, 100));

    // 移动端菜单
    mobileToggle?.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });

    // 导航链接点击
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href) return;

            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.slice(1);
                utils.scrollToSection(targetId);
            } else if (!href.startsWith('http')) {
                if (!isRouteAllowedWithoutAuth(href) && !requireAuth('请先登录后再访问该功能')) {
                    e.preventDefault();
                    return;
                }
                e.preventDefault();
                utils.navigateWithLoading(href);
            }

            // 关闭移动端菜单
            navbarMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    updateActiveNavLink();
}

// 更新活动导航链接
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    if (!navLinks.length) return;

    const pageName = (window.location.pathname.split('/').pop() || '').toLowerCase();

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = (link.getAttribute('href') || '').toLowerCase();
        if (!href) return;

        if (href.startsWith('#')) return;

        const hrefPage = href.split('/').pop();
        if (hrefPage && hrefPage === pageName) link.classList.add('active');
        if (!pageName && (hrefPage === 'index.html' || hrefPage === '/')) link.classList.add('active');
    });
}

// 初始化滚动动画
function initScrollAnimations() {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });
}

// 初始化主题切换
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');

    // 检查本地存储
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        currentTheme = 'dark';
        icon.className = 'fas fa-sun';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', currentTheme);

        // 重新初始化图表
        setTimeout(() => {
            initCharts();
            initKnowledgeGraph();
        }, 300);
    });
}

// 初始化文物轮播
function initArtifactsSwiper() {
    const swiperWrapper = document.querySelector('.artifacts-swiper .swiper-wrapper');
    if (!swiperWrapper) return;
    if (typeof Swiper === 'undefined') return;
    if (typeof ARTIFACTS_DATA === 'undefined' || !Array.isArray(ARTIFACTS_DATA)) return;

    // 生成轮播项
    ARTIFACTS_DATA.forEach(artifact => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.setAttribute('data-type', artifact.type);
        slide.innerHTML = `
            <div class="artifact-card" data-id="${artifact.id}">
                <div class="artifact-image">
                    <img src="${artifact.image}" alt="${artifact.name}" loading="lazy">
                    <span class="artifact-badge">${artifact.dynasty}</span>
                    <div class="artifact-overlay">
                        <button class="artifact-quick-view">
                            <i class="fas fa-eye"></i> 快速查看
                        </button>
                        <button class="artifact-quick-view3d">
                             <i class="fas fa-cube"></i> 查看3D建模
                        </button>
                    </div>
                </div>
                <div class="artifact-info">
                    <h3 class="artifact-name">${artifact.name}</h3>
                    <div class="artifact-meta">
                        <span><i class="fas fa-clock"></i> ${artifact.dynasty}</span>
                        <span><i class="fas fa-tags"></i> ${artifact.type}</span>
                    </div>
                    <p class="artifact-description">${artifact.description}</p>
                </div>
            </div>
        `;
        swiperWrapper.appendChild(slide);
    });

    // 初始化 Swiper
    artifactsSwiper = new Swiper('.artifacts-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 24,
        centeredSlides: false,
        grabCursor: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 16 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1400: { slidesPerView: 4, spaceBetween: 24 }
        }
    });

    // 筛选按钮
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            filterArtifacts(filter);
        });
    });

    // 卡片交互统一为打开同一详情弹窗
    document.querySelectorAll('.artifact-card').forEach(card => {
        card.addEventListener('click', () => {
            const artifactId = parseInt(card.getAttribute('data-id'));
            showArtifactDetail(artifactId);
        });
    });

    document.querySelectorAll('.artifact-quick-view, .artifact-quick-view3d').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.artifact-card');
            const artifactId = parseInt(card.getAttribute('data-id'));
            const artifact = ARTIFACTS_DATA.find(item => item.id === artifactId);
            if (!artifact) return;

            if (btn.classList.contains('artifact-quick-view3d')) {
                if (!artifact.pageUrl) {
                    utils.showToast('该文物暂未配置3D模型页面', 'warning');
                    return;
                }
                window.open(artifact.pageUrl, '_blank');
                return;
            }

            showArtifactDetail(artifactId);
        });
    });
}

// 筛选文物
function filterArtifacts(type) {
    const slides = document.querySelectorAll('.swiper-slide');

    slides.forEach(slide => {
        const slideType = slide.getAttribute('data-type');
        if (type === 'all' || slideType === type) {
            slide.style.display = '';
        } else {
            slide.style.display = 'none';
        }
    });

    if (artifactsSwiper) artifactsSwiper.update();
}

// 初始化首页动态内容
function initHeroDynamicContent() {
    const container = document.getElementById('hero-dynamic-content');
    const thumbContainer = document.getElementById('hero-thumbnails-arc');
    if (!container || !thumbContainer) return;

    // 选取前五个文物作为展示项，增强弧形效果
    const featuredItems = ARTIFACTS_DATA.slice(0, 5);

    // 1. 生成大图内容
    container.innerHTML = featuredItems.map((item, index) => `
        <div class="dynamic-item ${index === 0 ? 'active' : ''}" data-index="${index}">
            <div class="dynamic-image-container">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="dynamic-info">
                <div class="dynamic-type">${item.type}</div>
                <h3 class="dynamic-title">${item.name}</h3>
                <p class="dynamic-desc">${item.description.substring(0, 80)}...</p>
                <a href="artifacts.html" class="btn-view-more">
                    <span>查看更多</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join('');

    // 2. 生成右侧弧形缩略图
    thumbContainer.innerHTML = featuredItems.map((item, index) => `
        <div class="hero-thumbnail-item ${index === 0 ? 'active' : ''}" data-index="${index}">
            <img src="${item.image}" alt="${item.name}">
            <div class="thumbnail-tooltip">${item.name}</div>
        </div>
    `).join('');

    let currentIndex = 0;
    const items = container.querySelectorAll('.dynamic-item');
    const thumbnails = thumbContainer.querySelectorAll('.hero-thumbnail-item');
    let timer = null;

    // 切换函数
    const switchContent = (index) => {
        if (index === currentIndex) return;

        // 移除当前状态
        items[currentIndex].classList.remove('active');
        thumbnails[currentIndex].classList.remove('active');

        // 更新索引
        currentIndex = index;

        // 添加新状态
        setTimeout(() => {
            items[currentIndex].classList.add('active');
            thumbnails[currentIndex].classList.add('active');
        }, 50);
    };

    // 缩略图点击事件
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            clearInterval(timer); // 用户点击时暂停自动播放
            switchContent(index);
            startAutoPlay(); // 重新开始计时
        });
    });

    // 自动播放逻辑
    const startAutoPlay = () => {
        timer = setInterval(() => {
            let nextIndex = (currentIndex + 1) % items.length;
            switchContent(nextIndex);
        }, 6000);
    };

    if (items.length > 1) {
        startAutoPlay();
    }
}

// 显示文物详情
function buildArtifactExtension(artifact) {
    const typeHints = {
        "器具": "器身结构强调实用性，常见握持、切削或捣研痕迹。",
        "文献": "版式与字体信息可反映版本流传、校勘与传抄路径。",
        "标本": "形态、纹理和颜色层次是判读药性与来源的重要线索。",
        "容器": "容量、口沿和纹饰组合多用于指示用途与时代审美。"
    };

    return {
        summary: `${artifact.name}以${artifact.material}材质呈现，图像中可见其${artifact.type}属性明确，整体风格与${artifact.dynasty}器物特征相吻合。`,
        points: [
            `图像观察：轮廓与主体比例稳定，便于识别其核心用途。`,
            `材质线索：${artifact.material}的表面质感与反光/纹理表现较为典型。`,
            `功能推断：作为${artifact.type}，${typeHints[artifact.type] || "其造型与使用场景之间存在较强对应关系。"}`
        ]
    };
}

function showArtifactDetail(artifactId) {
    const artifact = ARTIFACTS_DATA.find(a => a.id === artifactId);
    if (!artifact) return;

    const modal = document.getElementById('artifact-detail-modal');

    // 填充数据
    document.getElementById('detail-image').src = artifact.image;
    document.getElementById('detail-name').textContent = artifact.name;
    document.getElementById('detail-dynasty').textContent = artifact.dynasty;
    document.getElementById('detail-dynasty-badge').textContent = artifact.dynasty;
    document.getElementById('detail-type').textContent = artifact.type;
    document.getElementById('detail-material').textContent = artifact.material;
    document.getElementById('detail-description').textContent = artifact.description;
    const extension = buildArtifactExtension(artifact);
    const extensionSummary = document.getElementById('detail-extension-summary');
    const extensionList = document.getElementById('detail-extension-list');

    if (extensionSummary) extensionSummary.textContent = extension.summary;
    if (extensionList) {
        extensionList.innerHTML = extension.points.map(point => `<li>${point}</li>`).join('');
    }

    // 显示弹窗
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 禁止滚动

    // 绑定关闭事件
    const closeBtn = document.getElementById('artifact-detail-close');
    const closeBtn2 = document.getElementById('artifact-detail-close-btn');
    const overlay = modal.querySelector('.modal-overlay');

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.onclick = closeModal;
    closeBtn2.onclick = closeModal;
    overlay.onclick = closeModal;
}

// 初始化上传区域
function initUploadArea() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const previewImage = document.getElementById('preview-image');
    const uploadPreview = document.getElementById('upload-preview');
    const removePreview = document.getElementById('remove-preview');
    const analyzeBtn = document.getElementById('analyze-btn');
    const demoBtn = document.getElementById('demo-btn');
    if (!uploadArea || !fileInput || !previewImage || !uploadPreview || !removePreview || !analyzeBtn || !demoBtn) return;

    // 点击上传
    uploadArea.addEventListener('click', () => {
        if (!uploadArea.classList.contains('has-file')) {
            fileInput.click();
        }
    });

    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });

    // 文件选择
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });

    // 移除预览
    removePreview.addEventListener('click', (e) => {
        e.stopPropagation();
        clearUpload();
    });

    // 开始分析
    analyzeBtn.addEventListener('click', () => {
        if (!requireAuth('请先登录后再进行智能识别')) return;
        if (uploadedFile) {
            startAnalysis();
        }
    });

    // 演示按钮
    demoBtn.addEventListener('click', () => {
        if (!requireAuth('请先登录后再使用演示识别')) return;
        runDemo();
    });
}

// 处理文件选择
async function handleFileSelect(file) {
    if (!requireAuth('请先登录后再上传图片')) return;

    const allowedTypes = ['png', 'jpg', 'jpeg', 'webp'];

    if (!utils.validateFileType(file, allowedTypes)) {
        utils.showToast('请上传 PNG、JPG 或 WEBP 格式的图片', 'warning');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        utils.showToast('文件大小不能超过 10MB', 'warning');
        return;
    }

    try {
        const dataUrl = await utils.readFileAsDataURL(file);
        displayPreview(dataUrl);
        uploadedFile = file;

        document.getElementById('analyze-btn').disabled = false;
        utils.showToast('图片上传成功，点击开始分析', 'success');
    } catch (error) {
        utils.showToast('文件读取失败', 'error');
    }
}

// 显示预览
function displayPreview(dataUrl) {
    const uploadArea = document.getElementById('upload-area');
    const previewImage = document.getElementById('preview-image');

    previewImage.src = dataUrl;
    uploadArea.classList.add('has-file');
}

// 清除上传
function clearUpload() {
    const uploadArea = document.getElementById('upload-area');
    const previewImage = document.getElementById('preview-image');
    const fileInput = document.getElementById('file-input');
    const analyzeBtn = document.getElementById('analyze-btn');

    previewImage.src = '';
    uploadArea.classList.remove('has-file');
    fileInput.value = '';
    analyzeBtn.disabled = true;
    uploadedFile = null;
}

function normalizeHerbs(rawHerbs) {
    if (!rawHerbs) return [];
    if (Array.isArray(rawHerbs)) {
        return rawHerbs.map(item => String(item).trim()).filter(Boolean);
    }
    return String(rawHerbs)
        .split(/[、,，;；/\s]+/)
        .map(item => item.trim())
        .filter(Boolean);
}

function pickFirstText(core, keys) {
    for (const key of keys) {
        const value = core && core[key];
        if (value !== undefined && value !== null && String(value).trim()) {
            return String(value).trim();
        }
    }
    return '';
}

function pickFirstAny(obj, keys) {
    if (!obj || typeof obj !== 'object') return '';
    for (const key of keys) {
        const value = obj[key];
        if (value !== undefined && value !== null && String(value).trim()) {
            return String(value).trim();
        }
    }
    return '';
}

function normalizeHistoricalChanges(rawChanges) {
    if (!Array.isArray(rawChanges)) return [];
    return rawChanges
        .map((item) => {
            if (!item || typeof item !== 'object') return null;
            const period = pickFirstText(item, ['period', 'date', 'year', '时期']);
            const title = pickFirstText(item, ['title', 'name', '阶段']);
            const change = pickFirstText(item, ['change', 'content', '描述']);
            const impact = pickFirstText(item, ['impact', 'value', '意义']);
            const desc = [change, impact].filter(Boolean).join(' ');
            if (!period && !title && !desc) return null;
            return {
                date: period || '未知时期',
                title: title || '历史节点',
                desc: desc || '暂无描述'
            };
        })
        .filter(Boolean);
}

function buildResultFromBackend(apiData) {
    if (!apiData || apiData.success === false) {
        throw new Error((apiData && (apiData.error || apiData.message)) || '后端返回异常');
    }

    const isDbMatched = apiData.source === 'database' && apiData.top1;
    const core = isDbMatched ? apiData.top1 : apiData;

    const imageId = pickFirstText(core, ['image_id', 'image', 'filename']) || '未知图片';
    const fallbackRecord = LOCAL_KNOWLEDGE_FALLBACK[imageId] || {};
    const merged = { ...fallbackRecord, ...core };
    const artifactName = pickFirstText(merged, ['name', 'title', '名称']) || imageId;
    const artifactType = pickFirstText(merged, ['type', 'usage_type', '类别', '类型']) || '未知类型';
    const artifactDynasty = pickFirstText(merged, ['dynasty', 'era', '年代', '朝代']) || '未知';
    const artifactMaterial = pickFirstText(merged, ['material', '材质']) || '未知';
    const artifactDescription = pickFirstText(merged, ['description', 'desc', 'story', '内容简介', '详细介绍']) || '暂无详细描述';
    const acupointText = pickFirstText(merged, ['acupoint', '穴位']);

    const herbNames = normalizeHerbs(
        pickFirstAny(merged, [
            'herbs',
            'chineseMedicinalMaterials',
            'acupoint',
            '药材',
            '中药材',
            '穴位'
        ])
    );
    const herbIcons = ['fa-leaf', 'fa-seedling', 'fa-spa', 'fa-circle', 'fa-tree', 'fa-seedling'];

    const herbs = herbNames.length > 0
        ? herbNames.slice(0, 6).map((name, idx) => ({
            name,
            property: pickFirstText(merged, ['material', 'function', 'value', 'benefit']) || '知识库字段',
            icon: herbIcons[idx % herbIcons.length],
            efficacy: pickFirstText(merged, ['usage', 'benefit', 'content_introduction']) || '见文物信息'
        }))
        : (artifactType && artifactType !== '未知类型'
            ? [{
                name: artifactType,
                property: artifactMaterial,
                icon: herbIcons[0],
                efficacy: pickFirstText(merged, ['usage', 'content_introduction']) || '见文物信息'
            }]
            : []);

    const descriptionParts = [artifactDescription, merged.story, merged.modern]
        .filter(Boolean)
        .map(item => String(item).trim());
    if (acupointText) {
        descriptionParts.push(`穴位/经络：${acupointText}`);
    }

    const knowledgeSource = pickFirstText(merged, ['author', 'celebrity', '来源']) || '知识库';
    const knowledgeSummary = pickFirstText(merged, ['content_introduction', 'usage', 'benefit', 'value', 'function', 'description']);
    const knowledgeCulture = pickFirstText(merged, ['cultural_value', 'culturalValue', 'culturalSignificance']);

    const prescriptions = [{
        name: artifactName,
        source: knowledgeSource,
        herbs: herbNames.length > 0 ? herbNames.slice(0, 5) : [artifactType || '未知类型'],
        efficacy: knowledgeSummary || '暂无补充说明'
    }];

    const historicalTimeline = normalizeHistoricalChanges(
        merged.historical_changes || merged.historicalChanges
    );
    const timeline = historicalTimeline.length > 0
        ? historicalTimeline
        : [
            {
                date: artifactDynasty || '未知时期',
                title: artifactName || '知识条目',
                desc: artifactDescription || '暂无描述'
            }
        ];

    if (knowledgeCulture && !historicalTimeline.length) {
        timeline.push({
            date: '文化价值',
            title: '知识库补充',
            desc: knowledgeCulture
        });
    }

    return {
        artifact: {
            name: artifactName,
            dynasty: artifactDynasty,
            type: artifactType,
            material: artifactMaterial,
            confidence: Number((((core.similarity ?? apiData.similarity) || 0) * 100).toFixed(2)),
            description: descriptionParts.length > 0 ? descriptionParts.join('；') : '暂无详细描述'
        },
        herbs,
        prescriptions,
        timeline
    };
}

// 开始分析
async function startAnalysis() {
    const uploadArea = document.getElementById('upload-area');
    const analyzeBtn = document.getElementById('analyze-btn');

    // 显示扫描动画
    uploadArea.classList.add('scanning');
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 分析中...';

    utils.showToast('AI正在识别文物，请稍候...', 'info');

    try {
        if (!(uploadedFile instanceof File)) {
            throw new Error('请先上传图片文件');
        }

        const formData = new FormData();
        formData.append('image', uploadedFile);

        const response = await fetch(UPLOAD_API_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`请求失败（HTTP ${response.status}）`);
        }

        const apiData = await response.json();
        const normalizedResult = buildResultFromBackend(apiData);
        showResults(normalizedResult);
    } catch (error) {
        utils.showToast(`识别失败：${error.message}`, 'error');
    } finally {
        // 隐藏扫描动画
        uploadArea.classList.remove('scanning');
        analyzeBtn.innerHTML = '<i class="fas fa-search-plus"></i> <span>开始智能分析</span>';
        analyzeBtn.disabled = false;
    }
}

// 运行演示
async function runDemo() {
    const uploadArea = document.getElementById('upload-area');

    // 使用示例图片
    const demoImage = ARTIFACTS_DATA[0].image;
    displayPreview(demoImage);
    uploadedFile = { name: 'demo.jpg' };

    document.getElementById('analyze-btn').disabled = false;
    utils.showToast('已加载演示图片', 'success');

    // 自动开始演示（不请求后端）
    await utils.delay(1000);
    showResults(MOCK_RECOGNITION_RESULT);
}

// 显示识别结果
function showResults(result) {
    const resultSection = document.getElementById('result-section');

    // 更新文物信息
    document.getElementById('result-image').src = document.getElementById('preview-image').src || ARTIFACTS_DATA[0].image;
    document.getElementById('artifact-name').textContent = result.artifact.name;
    document.getElementById('artifact-dynasty').innerHTML = `<i class="fas fa-clock"></i> ${result.artifact.dynasty}`;
    document.getElementById('artifact-type').innerHTML = `<i class="fas fa-tags"></i> ${result.artifact.type}`;
    document.getElementById('artifact-material').innerHTML = `<i class="fas fa-cube"></i> ${result.artifact.material}`;
    document.getElementById('artifact-description').textContent = result.artifact.description;
    document.getElementById('confidence-value').textContent = result.artifact.confidence + '%';

    // 更新药材网格
    const herbsGrid = document.getElementById('herbs-grid');
    herbsGrid.innerHTML = result.herbs.map(herb => `
        <div class="herb-card">
            <div class="herb-icon">
                <i class="fas ${herb.icon}"></i>
            </div>
            <div class="herb-name">${herb.name}</div>
            <div class="herb-property">${herb.property}</div>
        </div>
    `).join('');

    // 更新方剂列表
    const prescriptionsList = document.getElementById('prescriptions-list');
    prescriptionsList.innerHTML = result.prescriptions.map(rx => `
        <div class="prescription-item">
            <div class="prescription-icon">
                <i class="fas fa-prescription"></i>
            </div>
            <div class="prescription-info">
                <div class="prescription-name">${rx.name}</div>
                <div class="prescription-source">${rx.source}</div>
                <div class="prescription-herbs">
                    ${rx.herbs.map(h => `<span>${h}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');

    // 更新横向历史时间轴（来自数据库/后端结果）
    const timelineHorizontal = document.getElementById('timeline-horizontal');
    if (timelineHorizontal) {
        const timelineData = Array.isArray(result.timeline) ? result.timeline : [];
        if (!timelineData.length) {
            timelineHorizontal.innerHTML = '<div class="timeline-horizontal-empty">暂无历史变革数据</div>';
        } else {
            timelineHorizontal.innerHTML = timelineData.map(item => `
                <div class="timeline-horizontal-item">
                    <span class="timeline-horizontal-dot"></span>
                    <div class="timeline-horizontal-date">${item.date || '未知时期'}</div>
                    <div class="timeline-horizontal-title">${item.title || '历史节点'}</div>
                    <div class="timeline-horizontal-desc">${item.desc || '暂无描述'}</div>
                </div>
            `).join('');
        }
    }

    // 显示结果区域
    resultSection.style.display = 'block';

    // 滚动到结果
    setTimeout(() => {
        utils.scrollToSection('result-section');
    }, 300);

    utils.showToast('识别完成！', 'success');
}

// 初始化图表
function initCharts() {
    // 等待图表容器可见
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chartId = entry.target.id;
                switch (chartId) {
                    case 'dynasty-chart':
                        charts.initDynastyChart();
                        break;
                    case 'type-chart':
                        charts.initTypeChart();
                        break;
                    case 'efficacy-chart':
                        charts.initEfficacyChart();
                        break;
                    case 'trend-chart':
                        charts.initTrendChart('week');
                        break;
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.chart').forEach(chart => {
        observer.observe(chart);
    });

    // 趋势图表切换
    document.querySelectorAll('.chart-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.chart-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const period = btn.getAttribute('data-period');
            charts.initTrendChart(period);
        });
    });
}

// 初始化知识图谱
function initKnowledgeGraph(viewType = 'hexagonal') {
    const chartDom = document.getElementById('knowledge-graph');
    if (!chartDom) return;

    // 清除原有实例并重新初始化
    const existingChart = echarts.getInstanceByDom(chartDom);
    if (existingChart) {
        existingChart.dispose();
    }
    const chart = echarts.init(chartDom);

    let option = {};

    if (viewType === 'hexagonal') {
        // 蜂巢式/六边形矩阵布局 (Hexagonal Layout)
        const nodes = KNOWLEDGE_GRAPH_DATA.nodes.map((node, index) => {
            // 计算六边形坐标
            // 采用螺旋环状布局
            let x = 0, y = 0;
            if (index > 0) {
                const ring = Math.floor((Math.sqrt(12 * index - 3) - 3) / 6) + 1;
                const ringIndex = index - (3 * ring * (ring - 1) + 1);
                const angle = (Math.PI * 2 / (6 * ring)) * ringIndex;
                const radius = ring * 120;
                x = Math.cos(angle) * radius;
                y = Math.sin(angle) * radius;
            }

            return {
                ...node,
                x: x,
                y: y,
                label: {
                    show: true,
                    position: 'bottom',
                    fontSize: 12,
                    color: '#2c3e2d',
                    formatter: '{b}'
                },
                symbol: 'polygon', // 使用多边形模拟六边形
                symbolSize: node.symbolSize * 1.2,
                itemStyle: {
                    color: CHART_COLORS.gradient[node.category] || CHART_COLORS.primary,
                    borderColor: '#fff',
                    borderWidth: 3,
                    shadowBlur: 15,
                    shadowColor: 'rgba(0, 0, 0, 0.15)',
                    opacity: 0.9
                }
            };
        });

        option = {
            ...CHART_BASE_OPTIONS,
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderColor: '#d4e0d6',
                borderWidth: 1,
                padding: [10, 15],
                textStyle: { color: '#2c3e2d' },
                formatter: function (params) {
                    if (params.dataType === 'node') {
                        const cat = KNOWLEDGE_GRAPH_DATA.categories[params.data.category].name;
                        return `<div style="font-weight:bold;margin-bottom:5px;">知识图谱</div>
                                <div style="display:flex;align-items:center;">
                                    <span style="display:inline-block;width:10px;height:100%;background:${params.color};margin-right:8px;"></span>
                                    ${params.name} <span style="color:#8a9b8c;margin-left:8px;">${cat}</span>
                                </div>`;
                    }
                }
            },
            series: [{
                type: 'graph',
                layout: 'none', // 使用自定义坐标
                data: nodes,
                links: KNOWLEDGE_GRAPH_DATA.links.map(link => ({
                    ...link,
                    lineStyle: {
                        color: 'rgba(212, 224, 214, 0.6)',
                        width: 2,
                        curveness: 0.1
                    }
                })),
                categories: KNOWLEDGE_GRAPH_DATA.categories,
                roam: true,
                focusNodeAdjacency: true,
                itemStyle: {
                    emphasis: {
                        scale: true,
                        shadowBlur: 25,
                        shadowColor: 'rgba(26, 77, 46, 0.4)'
                    }
                },
                lineStyle: {
                    opacity: 0.8,
                    width: 1,
                    curveness: 0
                }
            }]
        };
    } else if (viewType === 'tree') {
        // 树状图布局
        const treeData = buildTreeData(KNOWLEDGE_GRAPH_DATA);
        option = {
            ...CHART_BASE_OPTIONS,
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderColor: '#d4e0d6',
                borderWidth: 1,
                padding: [10, 15],
                textStyle: { color: '#2c3e2d' },
                formatter: function (params) {
                    let catName = "未知";
                    if (params.data && params.data.category !== undefined && KNOWLEDGE_GRAPH_DATA.categories[params.data.category]) {
                        catName = KNOWLEDGE_GRAPH_DATA.categories[params.data.category].name;
                    }
                    const color = params.color || CHART_COLORS.primary;
                    return `<div style="font-weight:bold;margin-bottom:5px;">知识树谱</div>
                            <div style="display:flex;align-items:center;">
                                <span style="display:inline-block;width:10px;height:100%;background:${color};margin-right:8px;"></span>
                                ${params.name} <span style="color:#8a9b8c;margin-left:8px;">${catName}</span>
                            </div>`;
                }
            },
            series: [{
                type: 'tree',
                data: [treeData],
                top: '5%',
                left: '15%',
                bottom: '5%',
                right: '25%',
                symbolSize: 12,
                initialTreeDepth: 2,
                label: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: 12
                },
                leaves: {
                    label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left'
                    }
                },
                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750,
                itemStyle: {
                    color: function (params) {
                        if (params.data && params.data.category !== undefined) {
                            return CHART_COLORS.gradient[params.data.category] || CHART_COLORS.primary;
                        }
                        return CHART_COLORS.primary;
                    },
                    borderColor: CHART_COLORS.accent
                },
                lineStyle: {
                    color: '#d4e0d6',
                    width: 2,
                    curveness: 0.5
                }
            }]
        };
    } else if (viewType === 'radial') {
        // 放射图布局
        const treeData = buildTreeData(KNOWLEDGE_GRAPH_DATA);
        option = {
            ...CHART_BASE_OPTIONS,
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderColor: '#d4e0d6',
                borderWidth: 1,
                padding: [10, 15],
                textStyle: { color: '#2c3e2d' },
                formatter: function (params) {
                    let catName = "未知";
                    if (params.data && params.data.category !== undefined && KNOWLEDGE_GRAPH_DATA.categories[params.data.category]) {
                        catName = KNOWLEDGE_GRAPH_DATA.categories[params.data.category].name;
                    }
                    const color = params.color || CHART_COLORS.primary;
                    return `<div style="font-weight:bold;margin-bottom:5px;">知识网络(放射)</div>
                            <div style="display:flex;align-items:center;">
                                <span style="display:inline-block;width:10px;height:100%;background:${color};margin-right:8px;"></span>
                                ${params.name} <span style="color:#8a9b8c;margin-left:8px;">${catName}</span>
                            </div>`;
                }
            },
            series: [{
                type: 'tree',
                data: [treeData],
                top: '10%',
                left: '10%',
                bottom: '10%',
                right: '10%',
                layout: 'radial',
                symbolSize: 10,
                initialTreeDepth: 2,
                animationDuration: 550,
                animationDurationUpdate: 750,
                expandAndCollapse: true,
                label: {
                    fontSize: 11,
                    distance: 10
                },
                itemStyle: {
                    color: function (params) {
                        if (params.data && params.data.category !== undefined) {
                            return CHART_COLORS.gradient[params.data.category] || CHART_COLORS.primary;
                        }
                        return CHART_COLORS.primary;
                    },
                    borderColor: CHART_COLORS.accent
                },
                lineStyle: {
                    color: '#d4e0d6',
                    width: 2,
                    curveness: 0.2
                }
            }]
        };
    }

    chart.setOption(option);

    // 点击节点裂变/展开逻辑
    chart.on('click', (params) => {
        if (params.dataType === 'node' && viewType === 'hexagonal') {
            // 模拟裂变效果：放大节点并高亮关系
            chart.dispatchAction({
                type: 'focusNodeAdjacency',
                seriesIndex: 0,
                dataIndex: params.dataIndex
            });
            utils.showToast(`正在探索 ${params.name} 的关联层级...`, 'success');
        }
    });

    window.addEventListener('resize', () => chart.resize());
    return chart;
}

// 将图谱数据转换为树形结构
function buildTreeData(data) {
    if (!data || !data.nodes || data.nodes.length === 0) return { name: 'Root', children: [] };

    // 我们以 category 0 (器物) 中的第一个作为根节点，或者直接取第一个节点
    const rootNode = data.nodes.find(n => n.category === 0) || data.nodes[0];

    const tree = {
        name: rootNode.name,
        category: rootNode.category,
        children: []
    };

    const visited = new Set([rootNode.id]);

    const build = (parentId, currentDepth, maxDepth = 3) => {
        if (currentDepth >= maxDepth) return [];

        const children = [];
        data.links.forEach(link => {
            let childId = null;
            if (link.source === parentId && !visited.has(link.target)) {
                childId = link.target;
            } else if (link.target === parentId && !visited.has(link.source)) {
                childId = link.source;
            }

            if (childId) {
                const childNode = data.nodes.find(n => n.id === childId);
                if (childNode) {
                    visited.add(childNode.id);
                    children.push({
                        name: childNode.name,
                        category: childNode.category,
                        value: childNode.symbolSize,
                        children: build(childNode.id, currentDepth + 1, maxDepth)
                    });
                }
            }
        });
        return children;
    };

    tree.children = build(rootNode.id, 0, 3);

    // 如果生成的树太小（比如只有一个节点），为了演示效果，我们按类别分组构建一个伪树
    if (tree.children.length === 0 && data.categories) {
        const root = { name: "中医药知识库", children: [] };
        data.categories.forEach((cat, index) => {
            const nodesInCat = data.nodes.filter(n => n.category === index);
            if (nodesInCat.length > 0) {
                root.children.push({
                    name: cat.name,
                    category: index,
                    children: nodesInCat.map(n => ({
                        name: n.name,
                        category: n.category,
                        value: n.symbolSize
                    }))
                });
            }
        });
        return root;
    }

    return tree;
}

// 修改初始化调用
function initKnowledgeGraphObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initKnowledgeGraph('hexagonal');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const graphContainer = document.getElementById('knowledge-graph');
    if (graphContainer) {
        observer.observe(graphContainer);
    }

    // 工具栏切换逻辑
    document.querySelectorAll('.tool-btn[data-view]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tool-btn[data-view]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const viewType = btn.getAttribute('data-view') === 'force' ? 'hexagonal' : btn.getAttribute('data-view');
            initKnowledgeGraph(viewType);
        });
    });

    // 缩放控件
    document.getElementById('zoom-in')?.addEventListener('click', () => {
        const chart = echarts.getInstanceByDom(document.getElementById('knowledge-graph'));
        if (chart) {
            const option = chart.getOption();
            const zoom = option.series[0].zoom || 1;
            chart.setOption({ series: [{ zoom: zoom * 1.2 }] });
        }
    });

    document.getElementById('zoom-out')?.addEventListener('click', () => {
        const chart = echarts.getInstanceByDom(document.getElementById('knowledge-graph'));
        if (chart) {
            const option = chart.getOption();
            const zoom = option.series[0].zoom || 1;
            chart.setOption({ series: [{ zoom: zoom / 1.2 }] });
        }
    });

    document.getElementById('reset-view')?.addEventListener('click', () => {
        initKnowledgeGraph('hexagonal');
    });

    document.getElementById('fullscreen')?.addEventListener('click', () => {
        const container = document.querySelector('.knowledge-container');
        if (!container) return;
        if (!document.fullscreenElement) {
            container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
}

// 初始化推荐区域
function initRecommendations() {
    const recommendGrid = document.getElementById('recommend-grid');
    if (!recommendGrid) return;

    recommendGrid.innerHTML = RECOMMEND_DATA.map(item => `
        <div class="recommend-card">
            <div class="recommend-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="recommend-content">
                <div class="recommend-type">${item.type}</div>
                <h4 class="recommend-title">${item.title}</h4>
                <p class="recommend-desc">${item.desc}</p>
            </div>
        </div>
    `).join('');

    // 卡片点击
    document.querySelectorAll('.recommend-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            showContentDetail(RECOMMEND_DATA[index]);
        });
    });
}

function initEncyclopediaSystem() {
    const gridEl = document.getElementById('ency-grid');
    const topTabs = document.getElementById('ency-top-tabs');
    const subcatsEl = document.getElementById('ency-subcats');
    const searchInput = document.getElementById('ency-search-input');
    const favToggleBtn = document.getElementById('ency-favorite-toggle');
    const shareBtn = document.getElementById('ency-share-btn');
    const printBtn = document.getElementById('ency-print-btn');
    const clearNoteBtn = document.getElementById('ency-clear-note-btn');
    const modal = document.getElementById('ency-modal');
    const modalBackdrop = document.getElementById('ency-modal-backdrop');
    const modalClose = document.getElementById('ency-modal-close');
    const modalContent = document.getElementById('ency-modal-content');
    if (!gridEl || !topTabs || !subcatsEl || !searchInput || !favToggleBtn || !modal || !modalContent) return;

    const items = buildEncyclopediaItems();
    const state = {
        top: 'artifact',
        sub: 'all',
        keyword: '',
        onlyFavorite: false,
        selectedId: '',
        items,
        favorites: new Set(readJson('encyFavorites', [])),
        notes: readJson('encyNotes', {})
    };

    const updateSubcats = () => {
        const list = ['all', ...new Set(state.items.filter(item => item.top === state.top).map(item => item.sub))];
        subcatsEl.innerHTML = list.map(name => `
            <button class="tool-btn ${name === state.sub ? 'active' : ''}" data-sub="${name}">
                ${name === 'all' ? '全部分类' : name}
            </button>
        `).join('');
    };

    const getFilteredItems = () => state.items.filter(item => {
        if (item.top !== state.top) return false;
        if (state.sub !== 'all' && item.sub !== state.sub) return false;
        if (state.onlyFavorite && !state.favorites.has(item.id)) return false;
        if (!state.keyword) return true;
        const text = `${item.name} ${item.era} ${item.desc} ${item.topLabel} ${item.sub}`.toLowerCase();
        return text.includes(state.keyword.toLowerCase());
    });

    const renderGrid = () => {
        const list = getFilteredItems();
        if (!list.length) {
            gridEl.innerHTML = '<div class="ency-empty">未检索到相关条目，请调整分类或关键词。</div>';
            return;
        }
        gridEl.innerHTML = list.map(item => `
            <article class="ency-card ${state.selectedId === item.id ? 'active' : ''}" data-item-id="${item.id}">
                <img class="ency-card-img" src="${item.image}" alt="${item.name}" loading="lazy">
                <div class="ency-card-body">
                    <div class="ency-card-title">${item.name}</div>
                    <div class="ency-card-meta">${item.era || '未知朝代'} · ${item.sub}</div>
                    <div class="ency-card-desc">${item.desc}</div>
                </div>
            </article>
        `).join('');
    };

    const renderModal = () => {
        const current = state.items.find(item => item.id === state.selectedId);
        if (!current) {
            modalContent.innerHTML = '';
            return;
        }
        const related = current.relatedIds
            .map(id => state.items.find(item => item.id === id))
            .filter(Boolean);
        const isFav = state.favorites.has(current.id);
        const noteText = state.notes[current.id] || '';
        modalContent.innerHTML = `
            <div class="ency-modal-grid">
                <div>
                    <img class="ency-modal-image" src="${current.image}" alt="${current.name}">
                </div>
                <div>
                    <h3 class="ency-modal-title">${current.name}</h3>
                    <p class="ency-card-meta">${current.topLabel} · ${current.sub} · ${current.era || '未知朝代'}</p>
                    <p class="ency-modal-text" style="margin-top:.7rem;">${current.desc}</p>
                    <p class="ency-modal-text" style="margin-top:.6rem;"><strong>核心知识：</strong>${current.core}</p>
                    <div style="margin-top:.8rem;">
                        <button class="tool-btn" id="ency-toggle-fav-btn"><i class="fas ${isFav ? 'fa-star' : 'fa-star-half-stroke'}"></i> ${isFav ? '取消收藏' : '加入收藏'}</button>
                    </div>
                    <div style="margin-top:.9rem;">
                        <h4>关联知识</h4>
                        <div class="ency-rel-list">
                            ${related.length ? related.map(item => `<button class="ency-rel-btn" data-target-id="${item.id}">${item.name}</button>`).join('') : '<span class="ency-card-meta">暂无关联项</span>'}
                        </div>
                    </div>
                    <div class="ency-note-box" style="margin-top:1rem;">
                        <h4>个人笔记</h4>
                        <textarea id="ency-note-input" placeholder="记录你的学习要点...">${noteText}</textarea>
                        <button class="tool-btn" id="ency-save-note-btn" style="margin-top:.5rem;"><i class="fas fa-save"></i> 保存笔记</button>
                    </div>
                </div>
            </div>
        `;
    };

    const renderAll = () => {
        updateSubcats();
        renderGrid();
        favToggleBtn.classList.toggle('active', state.onlyFavorite);
    };

    topTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-top]');
        if (!btn) return;
        topTabs.querySelectorAll('[data-top]').forEach(node => node.classList.remove('active'));
        btn.classList.add('active');
        state.top = btn.getAttribute('data-top');
        state.sub = 'all';
        state.selectedId = '';
        renderAll();
    });

    subcatsEl.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-sub]');
        if (!btn) return;
        state.sub = btn.getAttribute('data-sub');
        renderAll();
    });

    searchInput.addEventListener('input', (e) => {
        state.keyword = e.target.value.trim();
        renderGrid();
    });


    favToggleBtn.addEventListener('click', () => {
        state.onlyFavorite = !state.onlyFavorite;
        renderGrid();
        favToggleBtn.classList.toggle('active', state.onlyFavorite);
    });

    gridEl.addEventListener('click', (e) => {
        const card = e.target.closest('[data-item-id]');
        if (!card) return;
        state.selectedId = card.getAttribute('data-item-id');
        renderModal();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    modalContent.addEventListener('click', (e) => {
        const relBtn = e.target.closest('[data-target-id]');
        if (relBtn) {
            const targetId = relBtn.getAttribute('data-target-id');
            const target = state.items.find(item => item.id === targetId);
            if (!target) return;
            state.top = target.top;
            state.sub = 'all';
            state.selectedId = targetId;
            topTabs.querySelectorAll('[data-top]').forEach(node => {
                node.classList.toggle('active', node.getAttribute('data-top') === state.top);
            });
            renderAll();
            renderModal();
            return;
        }

        const favBtn = e.target.closest('#ency-toggle-fav-btn');
        if (favBtn && state.selectedId) {
            if (state.favorites.has(state.selectedId)) state.favorites.delete(state.selectedId);
            else state.favorites.add(state.selectedId);
            localStorage.setItem('encyFavorites', JSON.stringify([...state.favorites]));
            renderModal();
            return;
        }

        const saveBtn = e.target.closest('#ency-save-note-btn');
        if (saveBtn && state.selectedId) {
            const input = modalContent.querySelector('#ency-note-input');
            state.notes[state.selectedId] = input ? input.value.trim() : '';
            localStorage.setItem('encyNotes', JSON.stringify(state.notes));
            utils.showToast('笔记已保存', 'success');
        }
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };
    modalBackdrop?.addEventListener('click', closeModal);
    modalClose?.addEventListener('click', closeModal);

    shareBtn?.addEventListener('click', async () => {
        const current = state.items.find(item => item.id === state.selectedId);
        if (!current) {
            utils.showToast('请先选择一个条目再分享', 'warning');
            return;
        }
        const text = `${current.name} - ${current.core}`;
        try {
            await navigator.clipboard.writeText(text);
            utils.showToast('条目信息已复制，可直接分享', 'success');
        } catch {
            utils.showToast('复制失败，请手动复制', 'error');
        }
    });

    printBtn?.addEventListener('click', () => {
        if (!state.selectedId) {
            utils.showToast('请先选择一个条目再打印', 'warning');
            return;
        }
        window.print();
    });

    clearNoteBtn?.addEventListener('click', () => {
        if (!state.selectedId) return;
        delete state.notes[state.selectedId];
        localStorage.setItem('encyNotes', JSON.stringify(state.notes));
        renderModal();
        utils.showToast('当前条目笔记已清空', 'info');
    });

    renderAll();
}

function readJson(key, fallbackValue) {
    try {
        const value = localStorage.getItem(key);
        if (!value) return fallbackValue;
        return JSON.parse(value);
    } catch {
        return fallbackValue;
    }
}

function buildEncyclopediaItems() {
    const artifactItems = (ARTIFACTS_DATA || []).map(item => ({
        id: `artifact-${item.id}`,
        top: 'artifact',
        topLabel: '中医药器具',
        sub: mapArtifactSubType(item),
        name: item.name,
        image: item.image,
        era: item.dynasty,
        desc: item.description,
        core: `${item.material}材质，类别为${item.type}，可用于教学与文物认知。`,
        relatedIds: []
    }));

    const herbSeed = [
        { name: '人参', property: '甘、微苦，微温', efficacy: '大补元气、复脉固脱', image: 'main-image/人参.png' },
        { name: '黄芪', property: '甘，微温', efficacy: '补气升阳、固表止汗', image: 'main-image/黄芪.png' },
        { name: '当归', property: '甘、辛，温', efficacy: '补血活血、调经止痛', image: 'main-image/当归.png' },
        { name: '白术', property: '苦、甘，温', efficacy: '健脾益气、燥湿利水', image: 'main-image/白术.jpg' },
        { name: '茯苓', property: '甘、淡，平', efficacy: '利水渗湿、健脾宁心' ,image:'main-image/茯苓.jpg'},
        { name: '甘草', property: '甘，平', efficacy: '补脾益气、调和诸药', image:'main-image/甘草.jpg'},
        { name: '熟地黄', property: '甘，微温', efficacy: '滋阴补血、益精填髓', image:'main-image/熟地黄.jpg' },
        { name: '山药', property: '甘，平', efficacy: '补脾养胃、补肾涩精', image:'main-image/山药.jpg' },
        { name: '山茱萸', property: '酸、涩，微温', efficacy: '补益肝肾、收敛固涩', image:'main-image/山茱萸.jpg'},
        { name: '丹参', property: '苦，微寒', efficacy: '活血祛瘀、凉血安神', image:'main-image/丹参.jpg' },
        { name: '川芎', property: '辛，温', efficacy: '活血行气、祛风止痛', image:'main-image/川芎.jpg' },
        { name: '白芍', property: '苦、酸，微寒', efficacy: '养血调经、柔肝止痛', image:'main-image/白芍.jpg' },
        { name: '柴胡', property: '苦、辛，微寒', efficacy: '疏肝解郁、和解少阳', image:'main-image/柴胡.jpg' },
        { name: '黄连', property: '苦，寒', efficacy: '清热燥湿、泻火解毒', image:'main-image/黄连.jpg' },
        { name: '黄芩', property: '苦，寒', efficacy: '清热燥湿、泻火除烦', image:'main-image/黄芩.jpg' },
        { name: '连翘', property: '苦，微寒', efficacy: '清热解毒、消肿散结', image:'main-image/连翘.jpg' },
        { name: '金银花', property: '甘，寒', efficacy: '清热解毒、疏散风热', image:'main-image/金银花.jpg' },
        { name: '板蓝根', property: '苦，寒', efficacy: '清热解毒、凉血利咽', image:'main-image/板蓝根.jpg' },
        { name: '枸杞子', property: '甘，平', efficacy: '滋补肝肾、益精明目', image:'main-image/枸杞子.jpg' },
        { name: '菊花', property: '甘、苦，微寒', efficacy: '疏风清热、平肝明目', image:'main-image/菊花.jpg' },
        { name: '决明子', property: '甘、苦、咸，微寒', efficacy: '清肝明目、润肠通便', image:'main-image/决明子.jpg' },
        { name: '天麻', property: '甘，平', efficacy: '息风止痉、平抑肝阳', image:'main-image/天麻.jpg' },
        { name: '钩藤', property: '甘，微寒', efficacy: '息风止痉、清热平肝', image:'main-image/钩藤.jpg' },
        { name: '半夏', property: '辛，温；有毒', efficacy: '燥湿化痰、降逆止呕', image:'main-image/半夏.jpg' },
        { name: '陈皮', property: '辛、苦，温', efficacy: '理气健脾、燥湿化痰', image:'main-image/陈皮.jpg' },
        { name: '麦冬', property: '甘、微苦，微寒', efficacy: '养阴生津、润肺清心', image:'main-image/麦冬.jpg' },
        { name: '五味子', property: '酸、甘，温', efficacy: '收敛固涩、益气生津', image:'main-image/五味子.jpg' },
        { name: '附子', property: '辛、甘，大热；有毒', efficacy: '回阳救逆、补火助阳', image:'main-image/附子.jpg' },
        { name: '肉桂', property: '辛、甘，大热', efficacy: '补火助阳、散寒止痛', image:'main-image/肉桂.jpg' },
        { name: '杜仲', property: '甘，温', efficacy: '补肝肾、强筋骨', image: 'main-image/杜仲.jpg' }
    ];
    const herbItems = herbSeed.map((item, index) => ({
        id: `herb-${index + 1}`,
        top: 'herb',
        topLabel: '中药材标本',
        sub: mapHerbSubType(item.name),
        name: item.name,
        image: item.image || `main-image/${item.name}.jpeg`,
        era: '传统本草',
        desc: `${item.name}，性味${item.property}，常见功效为${item.efficacy}。`,
        core: `药材属性：${item.property}；核心功效：${item.efficacy}。`,
        relatedIds: []
    }));

    const doctorSeed = [
        { id: 1, name: '扁鹊', era: '战国', desc: '以望闻问切与针砭术闻名，是先秦医学代表人物。', core: '开创四诊思路，推动临床辨识发展。', image:'main-image/扁鹊.jpg' },
        { id: 2, name: '淳于意', era: '西汉', desc: '著有《诊籍》，重视病案记录与诊疗过程追踪。', core: '中国早期病案医学实践代表。', image:'main-image/淳于意.jpg' },
        { id: 3, name: '张仲景', era: '东汉', desc: '著有《伤寒杂病论》，奠定辨证论治基础。', core: '经方体系奠基者。', image:'main-image/张仲景.jpg' },
        { id: 4, name: '华佗', era: '东汉', desc: '擅长外科与针灸，相传创制麻沸散与五禽戏。', core: '外科麻醉与康复导引的重要先驱。', image:'main-image/华佗.jpg' },
        { id: 5, name: '王叔和', era: '西晋', desc: '编撰《脉经》，系统整理脉学理论与临床应用。', core: '脉学体系标准化关键人物。', image:'main-image/王叔和.jpg' },
        { id: 6, name: '葛洪', era: '东晋', desc: '著有《肘后备急方》，强调急症简便治疗。', core: '急症医学与方药实用化代表。', image:'main-image/葛洪.jpg' },
        { id: 7, name: '陶弘景', era: '南朝梁', desc: '整理《本草经集注》，推动本草分类与校勘。', core: '本草文献整理与药性体系完善者。', image:'main-image/陶弘景.jpg' },
        { id: 8, name: '巢元方', era: '隋代', desc: '主持编撰《诸病源候论》，重视病因病机分析。', core: '病因病机学系统化代表。', image:'main-image/巢元方.jpg' },
        { id: 9, name: '孙思邈', era: '唐代', desc: '著有《千金要方》《千金翼方》，倡导“大医精诚”。', core: '医德与临床并重的典范。', image:'main-image/孙思邈.jpg' },
        { id: 10, name: '王焘', era: '唐代', desc: '编著《外台秘要》，汇集前代医方与经验。', core: '大型医方文献集成者。', image:'main-image/王焘.jpg' },
        { id: 11, name: '钱乙', era: '北宋', desc: '著有《小儿药证直诀》，创立儿科辨证体系。', core: '中医儿科奠基人物。', image:'main-image/钱乙.jpg' },
        { id: 12, name: '王惟一', era: '北宋', desc: '主持铸造针灸铜人并校定腧穴，推动针灸标准化。', core: '针灸教学与穴位标准化代表。', image:'main-image/王惟一.jpg' },
        { id: 13, name: '陈无择', era: '南宋', desc: '提出“三因学说”，强调内外因与不内外因辨析。', core: '病因分类理论重要发展者。', image:'main-image/陈无择.jpg' },
        { id: 14, name: '朱丹溪', era: '元代', desc: '倡导“阳常有余，阴常不足”，重视养阴学说。', core: '金元四大家之一，滋阴理论代表。', image:'main-image/朱丹溪.jpg' },
        { id: 15, name: '李杲', era: '金代', desc: '著有《脾胃论》，提出“内伤脾胃，百病由生”。', core: '补土派代表，脾胃学说核心人物。', image:'main-image/李杲.jpg' },
        { id: 16, name: '张从正', era: '金代', desc: '主张汗吐下三法，重视邪实祛除。', core: '攻邪派代表，治法理论鲜明。', image:'main-image/张从正.jpg' },
        { id: 17, name: '叶天士', era: '清代', desc: '完善温病卫气营血辨证体系。', core: '温病学临床体系关键人物。', image:'main-image/叶天士.jpg' },
        { id: 18, name: '吴鞠通', era: '清代', desc: '著有《温病条辨》，推动温病理论系统化。', core: '温病学经典理论建构者。', image:'main-image/吴鞠通.jpg' },
        { id: 19, name: '李时珍', era: '明代', desc: '著有《本草纲目》，系统总结本草学。', core: '本草学集大成者。', image:'main-image/李时珍.jpg' },
        { id: 20, name: '张景岳', era: '明代', desc: '著有《景岳全书》，重视温补与辨证治本。', core: '明代临床医学与理论综合代表。', image:'main-image/张景岳.jpg' },
    ];
    const doctorItems = doctorSeed.map(item => ({
        id: `doctor-${item.id}`,
        top: 'doctor',
        topLabel: '历代医家',
        sub: item.era,
        name: item.name,
        image: item.image || 'main-image/《本草纲目》原刻本.jpeg',
        era: item.era,
        desc: item.desc,
        core: item.core,
        relatedIds: []
    }));

    const allItems = [...artifactItems, ...herbItems, ...doctorItems];

    artifactItems.forEach((item, index) => {
        const herb = herbItems[index % herbItems.length];
        const doctor = doctorItems[index % doctorItems.length];
        item.relatedIds = [herb?.id, doctor?.id].filter(Boolean);
    });
    herbItems.forEach((item, index) => {
        const doctor = doctorItems[index % doctorItems.length];
        const artifact = artifactItems[index % artifactItems.length];
        item.relatedIds = [artifact?.id, doctor?.id].filter(Boolean);
    });
    doctorItems.forEach((item, index) => {
        const herb = herbItems[index % herbItems.length];
        const artifact = artifactItems[index % artifactItems.length];
        item.relatedIds = [herb?.id, artifact?.id].filter(Boolean);
    });

    return allItems;
}

function ensureMinItemsPerSubcategory(items, minCount = 18) {
    const grouped = new Map();
    items.forEach(item => {
        const key = `${item.top}::${item.sub}`;
        grouped.set(key, (grouped.get(key) || 0) + 1);
    });
    const deficientGroups = [];
    grouped.forEach((count, key) => {
        if (count < minCount) deficientGroups.push(`${key}(${count}/${minCount})`);
    });
    if (deficientGroups.length) {
        console.warn(`[百科提示] 以下小类真实条目不足 ${minCount} 条：`, deficientGroups.join(', '));
    }
    return items;
}

function topLabelByKey(top) {
    const map = {
        artifact: '中医药器具',
        herb: '中药材标本',
        doctor: '历代医家'
    };
    return map[top] || top;
}

function mapArtifactSubType(item) {
    const text = `${item.name}${item.type}`;
    if (/碾|杵|钵|研/.test(text)) return '粉碎研磨';
    if (/刀|切/.test(text)) return '切制加工';
    if (/炉|煎|灶/.test(text)) return '煎煮炮制';
    if (/瓶|罐|坛|容器/.test(text)) return '盛药制剂';
    return '理疗养生';
}

function mapHerbSubType(name) {
    if (/参|麻|草|根/.test(name)) return '根类';
    if (/叶/.test(name)) return '叶类';
    if (/花/.test(name)) return '花类';
    if (/果|枣|子/.test(name)) return '果实类';
    if (/石|朱砂|矿/.test(name)) return '矿物类';
    if (/鹿|虫|蛤|海马/.test(name)) return '动物类';
    return '茎类';
}

// 显示内容详情 (推荐位)
function showContentDetail(data) {
    const modal = document.getElementById('content-detail-modal');
    if (!modal) return;

    // 填充数据
    document.getElementById('content-detail-type').textContent = data.type;
    document.getElementById('content-detail-title').textContent = data.title;
    document.getElementById('content-detail-image').src = data.image;
    document.getElementById('content-detail-desc').textContent = data.desc;

    // 动态生成额外信息 (基于不同类型)
    const extraSection = document.getElementById('content-extra-section');
    let extraHTML = '';

    if (data.type === '医疗器具') {
        extraHTML = `
            <h4><i class="fas fa-history"></i> 历史背景</h4>
            <p class="content-desc-text">该器具广泛应用于古代中医临床诊断。其精湛的制作工艺体现了当时医药器械制造的高超水平，是研究古代医疗文化的重要实物资料。</p>
        `;
    } else if (data.type === '古籍文献') {
        extraHTML = `
            <h4><i class="fas fa-feather-alt"></i> 文献价值</h4>
            <p class="content-desc-text">此文献记载了大量珍贵的中医药理论与临床方剂，是中国医药文化宝库中的灿烂明珠，对现代中医研究具有深远的指导意义。</p>
        `;
    } else if (data.type === '药材标本') {
        extraHTML = `
            <h4><i class="fas fa-microscope"></i> 药用特征</h4>
            <p class="content-desc-text">此标本保存完好，清晰展示了该药材的原始形态特征，是中药鉴定学中极具参考价值的典型范本。</p>
        `;
    }

    extraSection.innerHTML = extraHTML;

    // 显示弹窗
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // 绑定关闭事件
    const closeBtn = document.getElementById('content-detail-close');
    const closeBtn2 = document.getElementById('content-detail-close-btn');
    const overlay = modal.querySelector('.modal-overlay');

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.onclick = closeModal;
    closeBtn2.onclick = closeModal;
    overlay.onclick = closeModal;
}

// 初始化返回顶部
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', utils.throttle(() => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, 100));

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 初始化数字动画
function initNumberAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-target'));
                utils.animateNumber(element, target);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => observer.observe(num));
}

// 全局函数
window.scrollToSection = utils.scrollToSection;

/* ============================================
   器药同溯 - 图表配置文件
   ============================================ */

// 颜色配置
const CHART_COLORS = {
    primary: '#1a4d2e',
    primaryLight: '#2d6a4f',
    secondary: '#40916c',
    accent: '#c9a87c',
    accentLight: '#d4b896',
    success: '#52b788',
    gradient: ['#1a4d2e', '#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2']
};

// 通用图表配置
const CHART_BASE_OPTIONS = {
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut'
};

// 初始化朝代分布图表
function initDynastyChart() {
    const chartDom = document.getElementById('dynasty-chart');
    if (!chartDom) return;

    const chart = echarts.init(chartDom);

    const option = {
        ...CHART_BASE_OPTIONS,
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#d4e0d6',
            borderWidth: 1,
            textStyle: {
                color: '#2c3e2d'
            },
            axisPointer: {
                type: 'shadow',
                shadowStyle: {
                    color: 'rgba(26, 77, 46, 0.1)'
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: DYNASTY_CHART_DATA.xAxis,
            axisLine: {
                lineStyle: {
                    color: '#d4e0d6'
                }
            },
            axisLabel: {
                color: '#5a6b5b',
                fontSize: 12
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: false
            },
            axisLabel: {
                color: '#5a6b5b',
                fontSize: 12
            },
            splitLine: {
                lineStyle: {
                    color: '#e6f0e8',
                    type: 'dashed'
                }
            }
        },
        series: [{
            name: '文物数量',
            type: 'bar',
            barWidth: '50%',
            data: DYNASTY_CHART_DATA.data,
            itemStyle: {
                borderRadius: [6, 6, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: CHART_COLORS.primaryLight },
                    { offset: 1, color: CHART_COLORS.primary }
                ])
            },
            emphasis: {
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: CHART_COLORS.secondary },
                        { offset: 1, color: CHART_COLORS.primaryLight }
                    ])
                }
            }
        }]
    };

    chart.setOption(option);

    // 响应式
    window.addEventListener('resize', () => chart.resize());

    return chart;
}

// 初始化类型占比图表
function initTypeChart() {
    const chartDom = document.getElementById('type-chart');
    if (!chartDom) return;

    const chart = echarts.init(chartDom);

    const option = {
        ...CHART_BASE_OPTIONS,
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#d4e0d6',
            borderWidth: 1,
            textStyle: {
                color: '#2c3e2d'
            },
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: '5%',
            top: 'center',
            textStyle: {
                color: '#5a6b5b',
                fontSize: 12
            },
            itemWidth: 12,
            itemHeight: 12,
            itemGap: 12
        },
        series: [{
            name: '文物类型',
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['35%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 8,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#2c3e2d'
                },
                itemStyle: {
                    shadowBlur: 20,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.2)'
                }
            },
            labelLine: {
                show: false
            },
            data: TYPE_CHART_DATA.map((item, index) => ({
                ...item,
                itemStyle: {
                    color: CHART_COLORS.gradient[index]
                }
            }))
        }]
    };

    chart.setOption(option);

    window.addEventListener('resize', () => chart.resize());

    return chart;
}

// 初始化功效分析图表
function initEfficacyChart() {
    const chartDom = document.getElementById('efficacy-chart');
    if (!chartDom) return;

    const chart = echarts.init(chartDom);

    const option = {
        ...CHART_BASE_OPTIONS,
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#d4e0d6',
            borderWidth: 1,
            textStyle: {
                color: '#2c3e2d'
            }
        },
        radar: {
            indicator: EFFICACY_CHART_DATA.indicators,
            shape: 'polygon',
            splitNumber: 4,
            axisName: {
                color: '#5a6b5b',
                fontSize: 12
            },
            splitLine: {
                lineStyle: {
                    color: '#e6f0e8'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(26, 77, 46, 0.02)', 'rgba(26, 77, 46, 0.05)']
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#d4e0d6'
                }
            }
        },
        series: [{
            name: '功效分析',
            type: 'radar',
            symbol: 'circle',
            symbolSize: 8,
            data: [{
                value: EFFICACY_CHART_DATA.data,
                name: '药材功效',
                lineStyle: {
                    color: CHART_COLORS.primary,
                    width: 2
                },
                areaStyle: {
                    color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                        { offset: 0, color: 'rgba(26, 77, 46, 0.3)' },
                        { offset: 1, color: 'rgba(26, 77, 46, 0.1)' }
                    ])
                },
                itemStyle: {
                    color: CHART_COLORS.primary,
                    borderColor: '#fff',
                    borderWidth: 2
                }
            }]
        }]
    };

    chart.setOption(option);

    window.addEventListener('resize', () => chart.resize());

    return chart;
}

// 初始化趋势图表
function initTrendChart(period = 'week') {
    const chartDom = document.getElementById('trend-chart');
    if (!chartDom) return;

    const chart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
    const data = TREND_CHART_DATA[period];

    const option = {
        ...CHART_BASE_OPTIONS,
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#d4e0d6',
            borderWidth: 1,
            textStyle: {
                color: '#2c3e2d'
            },
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.xAxis,
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#d4e0d6'
                }
            },
            axisLabel: {
                color: '#5a6b5b',
                fontSize: 12
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: false
            },
            axisLabel: {
                color: '#5a6b5b',
                fontSize: 12
            },
            splitLine: {
                lineStyle: {
                    color: '#e6f0e8',
                    type: 'dashed'
                }
            }
        },
        series: [{
            name: '识别次数',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            data: data.data,
            lineStyle: {
                color: CHART_COLORS.primary,
                width: 3
            },
            itemStyle: {
                color: CHART_COLORS.primary,
                borderColor: '#fff',
                borderWidth: 2
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(26, 77, 46, 0.3)' },
                    { offset: 1, color: 'rgba(26, 77, 46, 0.05)' }
                ])
            }
        }]
    };

    chart.setOption(option);

    window.addEventListener('resize', () => chart.resize());

    return chart;
}

// 旧版知识图谱（保留兼容，不再作为主入口）
function initLegacyKnowledgeGraph() {
    const chartDom = document.getElementById('knowledge-graph');
    if (!chartDom) return;

    const chart = echarts.init(chartDom);

    const option = {
        ...CHART_BASE_OPTIONS,
        animationDuration: 2000,
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#d4e0d6',
            borderWidth: 1,
            textStyle: {
                color: '#2c3e2d'
            }
        },
        legend: {
            data: KNOWLEDGE_GRAPH_DATA.categories.map(c => c.name),
            orient: 'horizontal',
            bottom: 10,
            textStyle: {
                color: '#5a6b5b',
                fontSize: 12
            },
            itemWidth: 12,
            itemHeight: 12
        },
        series: [{
            name: '知识图谱',
            type: 'graph',
            layout: 'force',
            data: KNOWLEDGE_GRAPH_DATA.nodes.map(node => ({
                ...node,
                label: {
                    show: true,
                    position: 'bottom',
                    fontSize: 11,
                    color: '#2c3e2d'
                },
                itemStyle: {
                    color: CHART_COLORS.gradient[node.category] || CHART_COLORS.primary,
                    borderColor: '#fff',
                    borderWidth: 2,
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.2)'
                }
            })),
            links: KNOWLEDGE_GRAPH_DATA.links.map(link => ({
                ...link,
                lineStyle: {
                    color: '#d4e0d6',
                    width: 2,
                    curveness: 0.1
                }
            })),
            categories: KNOWLEDGE_GRAPH_DATA.categories.map((cat, index) => ({
                name: cat.name,
                itemStyle: {
                    color: CHART_COLORS.gradient[index]
                }
            })),
            roam: true,
            draggable: true,
            force: {
                repulsion: 200,
                edgeLength: [80, 150],
                gravity: 0.1
            },
            emphasis: {
                focus: 'adjacency',
                lineStyle: {
                    width: 4,
                    color: CHART_COLORS.accent
                },
                itemStyle: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(26, 77, 46, 0.5)'
                }
            }
        }]
    };

    chart.setOption(option);

    window.addEventListener('resize', () => chart.resize());

    return chart;
}

// 初始化迷你知识图谱
function initMiniKnowledgeGraph() {
    const chartDom = document.getElementById('knowledge-mini-graph');
    if (!chartDom) return;

    const chart = echarts.init(chartDom);

    // 简化版数据
    const miniNodes = KNOWLEDGE_GRAPH_DATA.nodes.slice(0, 8);
    const miniLinks = KNOWLEDGE_GRAPH_DATA.links.filter(link =>
        miniNodes.some(n => n.id === link.source) &&
        miniNodes.some(n => n.id === link.target)
    );

    const option = {
        animation: true,
        animationDuration: 1000,
        series: [{
            type: 'graph',
            layout: 'force',
            data: miniNodes.map(node => ({
                ...node,
                symbolSize: node.symbolSize * 0.6,
                label: {
                    show: true,
                    fontSize: 9,
                    color: '#5a6b5b'
                },
                itemStyle: {
                    color: CHART_COLORS.gradient[node.category] || CHART_COLORS.primary
                }
            })),
            links: miniLinks.map(link => ({
                ...link,
                lineStyle: {
                    color: '#d4e0d6',
                    width: 1
                }
            })),
            roam: false,
            force: {
                repulsion: 80,
                edgeLength: 50,
                gravity: 0.2
            }
        }]
    };

    chart.setOption(option);

    window.addEventListener('resize', () => chart.resize());

    return chart;
}

// 导出到全局
window.charts = {
    initDynastyChart,
    initTypeChart,
    initEfficacyChart,
    initTrendChart,
    initKnowledgeGraph: () => initKnowledgeGraph('hexagonal'),
    initLegacyKnowledgeGraph,
    initMiniKnowledgeGraph,
    CHART_COLORS
};


/* ============================================
   器药同溯 - 数据文件
   ============================================ */

// 文物数据
const ARTIFACTS_DATA = [
    {
        id: 1,
        name: "青铜药碾",
        dynasty: "明代",
        type: "器具",
        material: "青铜",
        image: "main-image/青铜药碾.jpeg",
        description: "此药碾为明代宫廷御药房所用，采用精铜铸造，碾槽内壁光滑细腻，用于研磨贵重药材。",
        confidence: 98.5,
        pageUrl: "3D/medicine_grinder.html",
    },
    {
        id: 2,
        name: "灵芝",
        dynasty: "明代",
        type: "标本",
        material: "植物",
        image: "main-image\\灵芝标本.jpeg",
        description: "李时珍著，明万历年间金陵初刻本，是中国古代最完整的药学巨著。",
        confidence: 99.2,
        pageUrl: "3D/lingzhi.html",
    },
    {
        id: 16,
        name: "《本草纲目》原刻本",
        dynasty: "明代",
        type: "文献",
        material: "纸质",
        image: "main-image/《本草纲目》原刻本.jpeg",
        description: "本草纲目》，本草著作，52卷。明代李时珍（东璧）撰于嘉靖三十一年（1552年）至万历六年（1578年），稿凡三易，初刊于金陵（南京）。李时珍的长子李建中在任蓬溪知县期间，帮助李时珍编辑修订了《本草纲目》，并助该书出版。 被联合国教科文组织列入《世界记忆名录》的文献遗产",
        confidence: 99.2,
        pageUrl: "3D/compendium_of_materia_medica.html",
    },
    {
        id: 3,
        name: "青花瓷药瓶",
        dynasty: "清代",
        type: "容器",
        material: "瓷器",
        image: "main-image/青花瓷药瓶.jpeg",
        description: "清代官窑烧制的青花药瓶，用于储存名贵中药材，瓶身绘有灵芝祥云图案。",
        confidence: 97.8,
        pageUrl: "3D/blue_white_medicine_bottle.html",
    },
    {
        id: 4,
        name: "铜制针灸针",
        dynasty: "汉代",
        type: "器具",
        material: "铜",
        image: "main-image/铜制针灸针.jpeg",
        description: "汉代铜制九针之一，针身细长，针尖锋利，是古代针灸医术的重要工具。",
        confidence: 96.4,
        pageUrl: "3D/bronze_acupuncture_needle.html",
    },
    {
        id: 5,
        name: "人参标本",
        dynasty: "清代",
        type: "标本",
        material: "植物",
        image: "main-image/人参标本.jpeg",
        description: "清代宫廷珍藏的百年野山参标本，根须完整，形态优美，药用价值极高。",
        confidence: 95.6,
        pageUrl: "3D/ginseng.html",
    },
    {
        id: 6,
        name: "铁制药刀",
        dynasty: "宋代",
        type: "器具",
        material: "铁",
        image: "main-image/铁制药刀.jpeg",
        description: "宋代药铺专用切药工具，刀身宽厚，刃口锋利，用于切制各类药材。",
        confidence: 94.2,
        pageUrl: "3D/herb_knife.html",
    },
    {
        id: 7,
        name: "《黄帝内经》抄本",
        dynasty: "唐代",
        type: "文献",
        material: "纸质",
        image: "main-image/《黄帝内经》抄本.jpeg",
        description: "唐代敦煌藏经洞出土的《黄帝内经》残卷，是研究中医理论的珍贵文献。",
        confidence: 98.9,
        pageUrl: "3D/huangdi_neijing.html",
    },
    {
        id: 8,
        name: "玉制药杵",
        dynasty: "清代",
        type: "器具",
        material: "玉石",
        image: "main-image/玉制药杵.jpeg",
        description: "清代皇室专用的和田玉药棒，温润细腻，用于捣碎珍贵药材时不沾染杂质。",
        confidence: 97.3,
        pageUrl: "3D/jade_pestle.html",
    },
    {
        id: 9,
        name: "“天下第一泉”青花诗文罐",
        dynasty: "清代",
        type: "容器",
        material: "瓷器",
        image: "main-image\\药罐.jpeg",
        description: "亦称“大清光绪年制”款青花“天下第一泉”题诗瓷盖罐。陶瓷类文物。小口短颈，鼓腹，体形硕大，罐口处置有平顶盖，盖面绘有龙戏珠图案，肩部是篆书的“天下第一泉”",
        confidence: 97.8,
        pageUrl: "3D/medicine_jar.html",
    },
    {
        id: 10,
        name: "清代伏羲象牙雕像‌",
        dynasty: "清代",
        type: "文献",
        material: "象牙",
        image: "main-image\\雕像1.jpg",
        description: "造像符合伏羲的传统神话形象特征：头生双角，以羽毛树叶制成衣物围身，赤足，和传说中伏羲始创中华文明、生于洪荒的设定吻合；雕像中伏羲双手捧持八卦图，对应“伏羲画八卦”的传说，《帝王世纪》记载伏羲画八卦后，梳理了阴阳、五行与百病的理法，还尝药制针，被尊为中华医药始祖之一。",
        confidence: 97.8,
        pageUrl: "3D/fuxi_ivory_statue.html",
    },
    {
        id: 11,
        name: "伤寒杂病论石碑",
        dynasty: "后汉",
        type: "文献",
        material: "石碑",
        image: "main-image\\伤寒杂病论2.png",
        description: "此块木刻板主要讲述了后汉医圣张仲景所著《伤寒论》在历史上的散佚与流传，以及后人如刘昆湘、黄君竹斋等对其进行的补充和研究。",
        confidence: 97.8,
        pageUrl: "3D/shanghan_tablet.html",
    },
    {
        id: 12,
        name: "冬虫夏草",
        dynasty: "汉代",
        type: "标本",
        material: "真菌",
        image: "main-image\\冬虫夏草.jpg",
        description: "冬虫夏草多生于海拔3000-4000米的高寒山区，主要生于草原、河谷、草丛的土壤中。在中国主要分布于西藏、青海、甘肃、四川、贵州、云南等省（自治区）的高寒地带和雪山草原。冬虫夏草是中国特有的中药材，与人参、鹿茸并列为三大补品，功能与主治为补肾益肺、止血化痰",
        confidence: 97.8,
        pageUrl: "3D/cordyceps.html",
    },
    {
        id: 13,
        name: "天麻",
        dynasty: "汉代",
        type: "标本",
        material: "植物",
        image: "main-image\\天麻.png",
        description: "天麻，中药名。为兰科植物天麻Gastrodia elata Bl.的干燥块茎。具有息风止痉，平抑肝阳，祛风通络的功效。主治肝风内动，惊痫抽搐，眩晕，头痛，肢体麻木，手足不遂，风湿痹痛等。",
        confidence: 97.8,
        pageUrl: "3D/gastrodia.html",
    },
    {
        id: 14,
        name: "粉彩双龙戏珠纹“葠术健脾丸”药坛",
        dynasty: "清代",
        type: "容器",
        material: "瓷器",
        image: "main-image\\药坛.jpg",
        description: "此器用于存放“葠术健脾丸”，“葠”同“参”。参术健脾丸为滋补类成药，用于脾胃虚弱，食少便溏，消化不良，脘腹胀满。此器印有双龙戏珠纹，龙珠是龙的精华，是它们修炼的原神所在，人们在艺术表达中，通过两条龙对玉珠的争夺，象征着人们对美好生活的追求。",
        confidence: 97.8,
        pageUrl: "3D/medicine_vat.html",
    },
    {
        id: 15,
        name: "同治粉彩刀马人物纹带杵研钵",
        dynasty: "清代",
        type: "容器",
        material: "瓷器",
        image: "main-image\\研钵.png",
        description: "此研钵纹饰丰富，画面饱满，线条勾画精美，人物特色鲜明、栩栩如生。用于研磨中药材。",
        confidence: 97.8,
        pageUrl: "3D/mortar_bowl.html",
    },
];

// 药材数据herbs
const HERBS_DATA = [
    { id: 1, name: "人参", property: "甘、微苦，温", icon: "fa-seedling", efficacy: "补气" },
    { id: 2, name: "黄芪", property: "甘，微温", icon: "fa-leaf", efficacy: "补气" },
    { id: 3, name: "当归", property: "甘、辛，温", icon: "fa-spa", efficacy: "补血" },
    { id: 4, name: "川芎", property: "辛，温", icon: "fa-cannabis", efficacy: "活血" },
    { id: 5, name: "白术", property: "苦、甘，温", icon: "fa-seedling", efficacy: "健脾" },
    { id: 6, name: "茯苓", property: "甘、淡，平", icon: "fa-circle", efficacy: "利水" },
    { id: 7, name: "甘草", property: "甘，平", icon: "fa-leaf", efficacy: "调和" },
    { id: 8, name: "大枣", property: "甘，温", icon: "fa-circle", efficacy: "补中" }
];
//针灸经络herbs
const HERBS_DATA_ACUPUNCTURE = [
    { id: 1, name: "艾叶", property: "苦、辛，温", icon: "fa-leaf", efficacy: "温经" },
    { id: 2, name: "生姜", property: "辛，温", icon: "fa-seedling", efficacy: "解表" },
    { id: 3, name: "肉桂", property: "辛、甘，大热", icon: "fa-tree", efficacy: "补火" },
    { id: 4, name: "附子", property: "辛、甘，热", icon: "fa-skull", efficacy: "回阳" },
    { id: 5, name: "威灵仙", property: "辛、咸，温", icon: "fa-spa", efficacy: "祛风" },
    { id: 6, name: "透骨草", property: "辛，温", icon: "fa-leaf", efficacy: "活血" },
    { id: 7, name: "伸筋草", property: "苦、辛，温", icon: "fa-seedling", efficacy: "舒筋" },
    { id: 8, name: "细辛", property: "辛，温", icon: "fa-leaf", efficacy: "散寒" }
];
//诊疗器具herbs
const HERBS_DATA_DIAGNOSTIC = [
    { id: 1, name: "朱砂", property: "甘，微寒", icon: "fa-gem", efficacy: "安神" },
    { id: 2, name: "珍珠", property: "甘、咸，寒", icon: "fa-circle", efficacy: "定惊" },
    { id: 3, name: "牛黄", property: "甘，凉", icon: "fa-circle", efficacy: "豁痰" },
    { id: 4, name: "麝香", property: "辛，温", icon: "fa-spa", efficacy: "开窍" },
    { id: 5, name: "远志", property: "苦、辛，温", icon: "fa-leaf", efficacy: "宁心" },
    { id: 6, name: "酸枣仁", property: "甘、酸，平", icon: "fa-seedling", efficacy: "养肝" },
    { id: 7, name: "柏子仁", property: "甘，平", icon: "fa-leaf", efficacy: "润肠" },
    { id: 8, name: "龙骨", property: "甘、涩，平", icon: "fa-bone", efficacy: "镇静" }
];

//制药器具herbs
const HERBS_DATA_PHARMACEUTICAL = [
    { id: 1, name: "三七", property: "甘、微苦，温", icon: "fa-seedling", efficacy: "化瘀" },
    { id: 2, name: "红花", property: "辛，温", icon: "fa-spa", efficacy: "通经" },
    { id: 3, name: "乳香", property: "辛、苦，温", icon: "fa-leaf", efficacy: "消肿" },
    { id: 4, name: "没药", property: "辛、苦，平", icon: "fa-leaf", efficacy: "散瘀" },
    { id: 5, name: "桃仁", property: "苦、甘，平", icon: "fa-seedling", efficacy: "润燥" },
    { id: 6, name: "丹参", property: "苦，微寒", icon: "fa-leaf", efficacy: "凉血" },
    { id: 7, name: "益母草", property: "苦、辛，微寒", icon: "fa-leaf", efficacy: "利尿" },
    { id: 8, name: "延胡索", property: "辛、苦，温", icon: "fa-seedling", efficacy: "理气" }
];
//药材标本herbs
const HERBS_DATA_SPECIMENS = [
    { id: 1, name: "冬虫夏草", property: "甘，平", icon: "fa-bug", efficacy: "补肺" },
    { id: 2, name: "鹿茸", property: "甘、咸，温", icon: "fa-tree", efficacy: "补髓" },
    { id: 3, name: "阿胶", property: "甘，平", icon: "fa-square", efficacy: "止血" },
    { id: 4, name: "燕窝", property: "甘，平", icon: "fa-dove", efficacy: "养阴" },
    { id: 5, name: "蛤蚧", property: "咸，平", icon: "fa-frog", efficacy: "纳气" },
    { id: 6, name: "海马", property: "甘，温", icon: "fa-fish", efficacy: "调气" },
    { id: 7, name: "藏红花", property: "甘，微寒", icon: "fa-spa", efficacy: "解郁" },
    { id: 8, name: "天山雪莲", property: "微苦，温", icon: "fa-snowflake", efficacy: "强筋" }
];
//养生保健herbs
const HERBS_DATA_WELLNESS = [
    { id: 1, name: "枸杞子", property: "甘，平", icon: "fa-circle", efficacy: "明目" },
    { id: 2, name: "山药", property: "甘，平", icon: "fa-seedling", efficacy: "补脾" },
    { id: 3, name: "芡实", property: "甘、涩，平", icon: "fa-seedling", efficacy: "益肾" },
    { id: 4, name: "薏苡仁", property: "甘、淡，微寒", icon: "fa-leaf", efficacy: "渗湿" },
    { id: 5, name: "莲子", property: "甘、涩，平", icon: "fa-circle", efficacy: "补脾" },
    { id: 6, name: "百合", property: "甘，寒", icon: "fa-leaf", efficacy: "清心" },
    { id: 7, name: "大枣", property: "甘，温", icon: "fa-circle", efficacy: "养血" },
    { id: 8, name: "核桃仁", property: "甘，温", icon: "fa-seedling", efficacy: "温肺" }
];
//医药文献herbs
const HERBS_DATA_LITERATURE = [
    { id: 1, name: "麻黄", property: "辛、微苦，温", icon: "fa-leaf", efficacy: "发汗" },
    { id: 2, name: "桂枝", property: "辛、甘，温", icon: "fa-tree", efficacy: "助阳" },
    { id: 3, name: "柴胡", property: "苦，微寒", icon: "fa-leaf", efficacy: "解表" },
    { id: 4, name: "大黄", property: "苦，寒", icon: "fa-seedling", efficacy: "泻下" },
    { id: 5, name: "黄连", property: "苦，寒", icon: "fa-leaf", efficacy: "燥湿" },
    { id: 6, name: "附子", property: "辛、甘，热", icon: "fa-skull", efficacy: "回阳" },
    { id: 7, name: "干姜", property: "辛，热", icon: "fa-seedling", efficacy: "温中" },
    { id: 8, name: "五味子", property: "酸、甘，温", icon: "fa-circle", efficacy: "敛肺" }
];

// 方剂数据prescriptions
const PRESCRIPTIONS_DATA = [
    {
        id: 1,
        name: "四君子汤",
        source: "《太平惠民和剂局方》",
        herbs: ["人参", "白术", "茯苓", "甘草"],
        efficacy: "益气健脾"
    },
    {
        id: 2,
        name: "四物汤",
        source: "《仙授理伤续断秘方》",
        herbs: ["当归", "川芎", "白芍", "熟地黄"],
        efficacy: "补血调经"
    },
    {
        id: 3,
        name: "六味地黄丸",
        source: "《小儿药证直诀》",
        herbs: ["熟地黄", "山茱萸", "山药", "泽泻", "茯苓", "丹皮"],
        efficacy: "滋阴补肾"
    },
    {
        id: 4,
        name: "补中益气汤",
        source: "《脾胃论》",
        herbs: ["黄芪", "人参", "白术", "当归", "陈皮", "升麻"],
        efficacy: "补中益气"
    }
];
//针灸经络prescriptions
const PRESCRIPTIONS_DATA_ACUPUNCTURE = [
    {
        id: 1,
        name: "阳和汤",
        source: "《外科证治全生集》",
        herbs: ["熟地黄", "麻黄", "鹿角胶", "肉桂"],
        efficacy: "温阳补血"
    },
    {
        id: 2,
        name: "独活寄生汤",
        source: "《备急千金要方》",
        herbs: ["独活", "桑寄生", "杜仲", "牛膝"],
        efficacy: "祛风除湿"
    },
    {
        id: 3,
        name: "小活络丹",
        source: "《太平惠民和剂局方》",
        herbs: ["川乌", "草乌", "地龙", "乳香"],
        efficacy: "祛风除湿"
    },
    {
        id: 4,
        name: "当归四逆汤",
        source: "《伤寒论》",
        herbs: ["当归", "桂枝", "芍药", "细辛"],
        efficacy: "温经散寒"
    }
];
//诊疗器具prescriptions
const PRESCRIPTIONS_DATA_DIAGNOSTIC = [
    {
        id: 1,
        name: "安宫牛黄丸",
        source: "《温病条辨》",
        herbs: ["牛黄", "麝香", "朱砂", "珍珠"],
        efficacy: "清热解毒"
    },
    {
        id: 2,
        name: "至宝丹",
        source: "《太平惠民和剂局方》",
        herbs: ["麝香", "犀角", "琥珀", "朱砂"],
        efficacy: "化浊开窍"
    },
    {
        id: 3,
        name: "紫雪丹",
        source: "《外台秘要》",
        herbs: ["石膏", "寒水石", "滑石", "磁石"],
        efficacy: "清热开窍"
    },
    {
        id: 4,
        name: "天王补心丹",
        source: "《摄生秘剖》",
        herbs: ["生地黄", "人参", "玄参", "丹参"],
        efficacy: "滋阴养血"
    }
];
//制药器具prescriptions
const PRESCRIPTIONS_DATA_PHARMACEUTICAL = [
    {
        id: 1,
        name: "云南白药",
        source: "民间秘方",
        herbs: ["三七", "冰片", "麝香", "草乌"],
        efficacy: "化瘀止血"
    },
    {
        id: 2,
        name: "血府逐瘀汤",
        source: "《医林改错》",
        herbs: ["当归", "生地黄", "桃仁", "红花"],
        efficacy: "活血化瘀"
    },
    {
        id: 3,
        name: "逍遥散",
        source: "《太平惠民和剂局方》",
        herbs: ["柴胡", "当归", "白芍", "白术"],
        efficacy: "疏肝解郁"
    },
    {
        id: 4,
        name: "生脉散",
        source: "《内外伤辨惑论》",
        herbs: ["人参", "麦冬", "五味子"],
        efficacy: "益气养阴"
    }
];
//药材标本prescriptions
const PRESCRIPTIONS_DATA_SPECIMENS = [
    {
        id: 1,
        name: "龟鹿二仙胶",
        source: "《医便》",
        herbs: ["鹿角", "龟板", "人参", "枸杞子"],
        efficacy: "滋阴填精"
    },
    {
        id: 2,
        name: "左归丸",
        source: "《景岳全书》",
        herbs: ["大熟地", "山药", "山茱萸", "枸杞"],
        efficacy: "滋阴补肾"
    },
    {
        id: 3,
        name: "右归丸",
        source: "《景岳全书》",
        herbs: ["大熟地", "山药", "山茱萸", "当归"],
        efficacy: "温补肾阳"
    },
    {
        id: 4,
        name: "十全大补汤",
        source: "《太平惠民和剂局方》",
        herbs: ["人参", "白术", "茯苓", "甘草", "熟地黄"],
        efficacy: "温补气血"
    }
];
//养生保健prescriptions
const PRESCRIPTIONS_DATA_WELLNESS = [
    {
        id: 1,
        name: "八珍汤",
        source: "《正体类要》",
        herbs: ["人参", "白术", "茯苓", "甘草", "当归"],
        efficacy: "气血双补"
    },
    {
        id: 2,
        name: "参苓白术散",
        source: "《太平惠民和剂局方》",
        herbs: ["人参", "白术", "茯苓", "山药"],
        efficacy: "补气健脾"
    },
    {
        id: 3,
        name: "玉屏风散",
        source: "《丹溪心法》",
        herbs: ["黄芪", "白术", "防风"],
        efficacy: "益气固表"
    },
    {
        id: 4,
        name: "归脾汤",
        source: "《正体类要》",
        herbs: ["黄芪", "龙眼肉", "酸枣仁", "人参"],
        efficacy: "益气补血"
    }
];
//医药文献prescriptions
const PRESCRIPTIONS_DATA_LITERATURE = [
    {
        id: 1,
        name: "麻黄汤",
        source: "《伤寒论》",
        herbs: ["麻黄", "桂枝", "杏仁", "甘草"],
        efficacy: "发汗解表"
    },
    {
        id: 2,
        name: "桂枝汤",
        source: "《伤寒论》",
        herbs: ["桂枝", "芍药", "生姜", "大枣"],
        efficacy: "解肌发表"
    },
    {
        id: 3,
        name: "小柴胡汤",
        source: "《伤寒论》",
        herbs: ["柴胡", "黄芩", "人参", "半夏"],
        efficacy: "和解少阳"
    },
    {
        id: 4,
        name: "白虎汤",
        source: "《伤寒论》",
        herbs: ["石膏", "知母", "甘草", "粳米"],
        efficacy: "清热生津"
    }
];


// 历史时间线数据timeline
const TIMELINE_DATA = [
    { date: "远古时期", title: "神农尝百草", desc: "原始医药知识的萌芽与积累" },
    { date: "战国秦汉", title: "理论体系确立", desc: "《黄帝内经》奠定了中医理论基础" },
    { date: "唐宋时期", title: "医药学繁荣", desc: "官修本草出现，对外医药交流频繁" },
    { date: "明清时期", title: "总结与集成", desc: "《本草纲目》问世，中医各学科深度发展" }
];
//针灸经络timeline
const TIMELINE_DATA_ACUPUNCTURE = [
    { date: "新石器时代", title: "砭石起源", desc: "最早的原始针刺工具出现" },
    { date: "战国时期", title: "经络学说成型", desc: "《灵枢》系统论述经络与针灸" },
    { date: "皇甫谧·晋", title: "针灸学总结", desc: "《针灸甲乙经》确立了穴位标准" },
    { date: "北宋时期", title: "天圣铜人", desc: "王惟一铸造铜人模型，开创形象教学先河" }
];
//诊疗器具timeline
const TIMELINE_DATA_DIAGNOSTIC = [
    { date: "战国秦汉", title: "四诊法确立", desc: "脉诊、望诊工具开始应用于临床" },
    { date: "隋唐时期", title: "专科化发展", desc: "出现了更精细的眼科、外科手术工具" },
    { date: "清代", title: "诊疗器械精进", desc: "象牙、玳瑁材质的诊脉垫与诊断器械流行" },
    { date: "现代", title: "中西医结合", desc: "数字化脉诊仪等现代科技赋能传统四诊" }
];
//制药器具timeline
const TIMELINE_DATA_PHARMACEUTICAL = [
    { date: "汉代", title: "炼丹与研磨", desc: "早期药臼与炼丹炉标志着制药技术的起源" },
    { date: "唐宋", title: "研粉与丸散", desc: "药碾与瓷质药罐普及，丸、散、膏、丹技术成熟" },
    { date: "明代", title: "宫廷御药工艺", desc: "精铜药碾与特制煎药炉代表了制药工艺的巅峰" },
    { date: "清代", title: "老字号规模化", desc: "同仁堂等老字号确立了严苛的制药工具与流程标准" }
];
//药材标本timeline
const TIMELINE_DATA_SPECIMENS = [
    { date: "秦汉", title: "本草收藏", desc: "《神农本草经》记载了365种早期药材" },
    { date: "唐代", title: "《新修本草》", desc: "世界上第一部药典，包含大量药材图谱" },
    { date: "明代", title: "万物归类", desc: "《本草纲目》将药材分为十六部，建立完整分类体系" },
    { date: "现代", title: "基因组学研究", desc: "通过DNA条形码技术实现药材标本的精准鉴定" }
];
//养生保健timeline
const TIMELINE_DATA_WELLNESS = [
    { date: "先秦", title: "导引按跷", desc: "《庄子》记载“吹呴呼吸，吐故纳新”" },
    { date: "东汉", title: "五禽戏", desc: "华佗创编模拟动物动作的健身功法" },
    { date: "隋唐", title: "药食同源", desc: "孙思邈提出“食能排邪而安脏腑”" },
    { date: "宋明", title: "八段锦与太极", desc: "内外兼修的养生功法在民间广泛流传" }
];
//医药文献timeline
const TIMELINE_DATA_LITERATURE = [
    { date: "汉代", title: "奠基之作", desc: "《伤寒杂病论》开创了辨证论治的先河" },
    { date: "唐代", title: "百科全书", desc: "《备急千金要方》总结了唐以前的医学成就" },
    { date: "宋代", title: "雕版印刷普及", desc: "大量中医古籍得以保存与广泛传播" },
    { date: "明代", title: "东方医学巨典", desc: "《本草纲目》系统总结了16世纪前的中国医药学" }
];



// 知识图谱数据
const KNOWLEDGE_GRAPH_DATA = {
    nodes: [
        { id: "artifact1", name: "青铜药碾", category: 0, symbolSize: 65 },
        { id: "artifact2", name: "青花瓷药瓶", category: 0, symbolSize: 55 },
        { id: "artifact3", name: "铜制针灸针", category: 0, symbolSize: 50 },
        { id: "herb1", name: "人参", category: 1, symbolSize: 45 },
        { id: "herb2", name: "黄芪", category: 1, symbolSize: 40 },
        { id: "herb3", name: "当归", category: 1, symbolSize: 42 },
        { id: "herb4", name: "川芎", category: 1, symbolSize: 38 },
        { id: "herb5", name: "白术", category: 1, symbolSize: 35 },
        { id: "prescription1", name: "四君子汤", category: 2, symbolSize: 50 },
        { id: "prescription2", name: "四物汤", category: 2, symbolSize: 48 },
        { id: "prescription3", name: "补中益气汤", category: 2, symbolSize: 45 },
        { id: "book1", name: "本草纲目", category: 3, symbolSize: 55 },
        { id: "book2", name: "神农本草经", category: 3, symbolSize: 50 },
        { id: "book3", name: "伤寒杂病论", category: 3, symbolSize: 52 },
        { id: "doctor1", name: "李时珍", category: 4, symbolSize: 45 },
        { id: "doctor2", name: "张仲景", category: 4, symbolSize: 48 },
        { id: "dynasty1", name: "明代", category: 5, symbolSize: 35 },
        { id: "dynasty2", name: "东汉", category: 5, symbolSize: 35 },
        { id: "dynasty3", name: "清代", category: 5, symbolSize: 35 }
    ],
    links: [
        { source: "artifact1", target: "herb1" },
        { source: "artifact1", target: "herb2" },
        { source: "artifact1", target: "dynasty1" },
        { source: "artifact2", target: "dynasty3" },
        { source: "artifact3", target: "dynasty2" },
        { source: "herb1", target: "prescription1" },
        { source: "herb2", target: "prescription1" },
        { source: "herb5", target: "prescription1" },
        { source: "herb3", target: "prescription2" },
        { source: "herb4", target: "prescription2" },
        { source: "herb1", target: "prescription3" },
        { source: "herb2", target: "prescription3" },
        { source: "herb1", target: "book1" },
        { source: "herb2", target: "book1" },
        { source: "herb3", target: "book1" },
        { source: "book1", target: "doctor1" },
        { source: "book2", target: "doctor2" },
        { source: "book3", target: "doctor2" },
        { source: "doctor1", target: "dynasty1" },
        { source: "doctor2", target: "dynasty2" }
    ],
    categories: [
        { name: "器物" },
        { name: "药材" },
        { name: "方剂" },
        { name: "典籍" },
        { name: "医家" },
        { name: "朝代" }
    ]
};

// 图表数据 - 朝代分布
const DYNASTY_CHART_DATA = {
    xAxis: ["商周", "秦汉", "魏晋", "隋唐", "宋元", "明清", "近现代"],
    data: [320, 890, 560, 1240, 1680, 4520, 3640]
};

// 图表数据 - 类型占比
const TYPE_CHART_DATA = [
    { value: 3520, name: "医疗器具" },
    { value: 2840, name: "药材标本" },
    { value: 2160, name: "古籍文献" },
    { value: 1920, name: "储药容器" },
    { value: 2407, name: "其他文物" }
];

// 图表数据 - 功效分析
const EFFICACY_CHART_DATA = {
    indicators: [
        { name: "补气", max: 100 },
        { name: "补血", max: 100 },
        { name: "活血", max: 100 },
        { name: "清热", max: 100 },
        { name: "利水", max: 100 },
        { name: "安神", max: 100 }
    ],
    data: [85, 78, 72, 68, 65, 58]
};

// 图表数据 - 识别趋势
const TREND_CHART_DATA = {
    week: {
        xAxis: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        data: [320, 450, 380, 520, 480, 680, 590]
    },
    month: {
        xAxis: ["第1周", "第2周", "第3周", "第4周"],
        data: [2840, 3120, 2960, 3580]
    },
    year: {
        xAxis: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        data: [8400, 9200, 8800, 11200, 12400, 13800, 14200, 15600, 14800, 16200, 17400, 18900]
    }
};

// 推荐数据
const RECOMMEND_DATA = [
    {
        id: 1,
        type: "医疗器具",
        title: "青花瓷药瓶",
        desc: "清代官窑烧制，胎质细腻，用于盛装名贵丹丸。",
        image: "main-image/青花瓷药瓶.jpeg"
    },
    {
        id: 2,
        type: "医药文献",
        title: "《本草纲目》",
        desc: "李时珍著，中医本草学集大成之作。",
        image: "main-image/《本草纲目》原刻本.jpeg"
    },
    {
        id: 3,
        type: "药材标本",
        title: "人参标本",
        desc: "野山参标本，大补元气，复脉固脱。",
        image: "main-image/人参标本.jpeg"
    },
    {
        id: 4,
        type: "制药器具",
        title: "青铜药碾",
        desc: "明代宫廷御用，用于研磨贵重药材。",
        image: "main-image/青铜药碾.jpeg"
    }
];

// 根据类型获取对应数据源
// 数据源映射表
// 根据类型获取对应数据源
function getDataByType(type) {
    // 各类型的数据映射（如果变量存在则使用，否则用默认数据）
    const sources = {
        '针灸经络': {
            herbs: typeof HERBS_DATA_ACUPUNCTURE !== 'undefined' ? HERBS_DATA_ACUPUNCTURE : HERBS_DATA,
            prescriptions: typeof PRESCRIPTIONS_DATA_ACUPUNCTURE !== 'undefined' ? PRESCRIPTIONS_DATA_ACUPUNCTURE : PRESCRIPTIONS_DATA,
            timeline: typeof TIMELINE_DATA_ACUPUNCTURE !== 'undefined' ? TIMELINE_DATA_ACUPUNCTURE : TIMELINE_DATA
        },
        '诊疗器具': {
            herbs: typeof HERBS_DATA_DIAGNOSTIC !== 'undefined' ? HERBS_DATA_DIAGNOSTIC : HERBS_DATA,
            prescriptions: typeof PRESCRIPTIONS_DATA_DIAGNOSTIC !== 'undefined' ? PRESCRIPTIONS_DATA_DIAGNOSTIC : PRESCRIPTIONS_DATA,
            timeline: typeof TIMELINE_DATA_DIAGNOSTIC !== 'undefined' ? TIMELINE_DATA_DIAGNOSTIC : TIMELINE_DATA
        },
        '制药器具': {
            herbs: typeof HERBS_DATA_PHARMACEUTICAL !== 'undefined' ? HERBS_DATA_PHARMACEUTICAL : HERBS_DATA,
            prescriptions: typeof PRESCRIPTIONS_DATA_PHARMACEUTICAL !== 'undefined' ? PRESCRIPTIONS_DATA_PHARMACEUTICAL : PRESCRIPTIONS_DATA,
            timeline: typeof TIMELINE_DATA_PHARMACEUTICAL !== 'undefined' ? TIMELINE_DATA_PHARMACEUTICAL : TIMELINE_DATA
        },
        '药材标本': {
            herbs: typeof HERBS_DATA_SPECIMENS !== 'undefined' ? HERBS_DATA_SPECIMENS : HERBS_DATA,
            prescriptions: typeof PRESCRIPTIONS_DATA_SPECIMENS !== 'undefined' ? PRESCRIPTIONS_DATA_SPECIMENS : PRESCRIPTIONS_DATA,
            timeline: typeof TIMELINE_DATA_SPECIMENS !== 'undefined' ? TIMELINE_DATA_SPECIMENS : TIMELINE_DATA
        },
        '养生保健': {
            herbs: typeof HERBS_DATA_WELLNESS !== 'undefined' ? HERBS_DATA_WELLNESS : HERBS_DATA,
            prescriptions: typeof PRESCRIPTIONS_DATA_WELLNESS !== 'undefined' ? PRESCRIPTIONS_DATA_WELLNESS : PRESCRIPTIONS_DATA,
            timeline: typeof TIMELINE_DATA_WELLNESS !== 'undefined' ? TIMELINE_DATA_WELLNESS : TIMELINE_DATA
        },
        '医药文献': {
            herbs: typeof HERBS_DATA_LITERATURE !== 'undefined' ? HERBS_DATA_LITERATURE : HERBS_DATA,
            prescriptions: typeof PRESCRIPTIONS_DATA_LITERATURE !== 'undefined' ? PRESCRIPTIONS_DATA_LITERATURE : PRESCRIPTIONS_DATA,
            timeline: typeof TIMELINE_DATA_LITERATURE !== 'undefined' ? TIMELINE_DATA_LITERATURE : TIMELINE_DATA
        }
    };

    return sources[type] || { herbs: HERBS_DATA, prescriptions: PRESCRIPTIONS_DATA, timeline: TIMELINE_DATA };
}

// 模拟识别结果数据
const MOCK_RECOGNITION_RESULT = {
    artifact: {
        name: "青铜药碾",
        dynasty: "明代",
        type: "制药器具",
        material: "青铜",
        confidence: 98.5,
        description: "此药碾为明代宫廷御药房所用，采用精铜铸造，碾槽内壁光滑细腻，用于研磨贵重药材。碾轮雕有云龙纹饰，工艺精湛，体现了明代宫廷医药器具的高超制作水平。"
    },
    get herbs() {
        const data = getDataByType(this.artifact.type);
        return data.herbs.slice(0, 6);
    },
    get prescriptions() {
        const data = getDataByType(this.artifact.type);
        return data.prescriptions;
    },
    get timeline() {
        const data = getDataByType(this.artifact.type);
        return data.timeline;
    }
};

/* ============================================
   认证系统
   ============================================ */

// 初始化认证系统
function initAuthSystem() {
    // 检查本地存储的用户信息
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
        try {
            const parsedUser = JSON.parse(savedUser);
            const registeredUsers = getRegisteredUsers();
            const matched = registeredUsers.find(user => user.email === parsedUser.email);
            if (matched) {
                currentUser = {
                    id: matched.id,
                    username: matched.username,
                    email: matched.email,
                    avatar: matched.avatar || 'placeholder-user.jpg'
                };
            } else {
                localStorage.removeItem(CURRENT_USER_KEY);
            }
        } catch {
            localStorage.removeItem(CURRENT_USER_KEY);
        }
    }
    updateAuthButton();

    // 绑定认证按钮事件
    bindAuthButtonHandler();

    // 绑定模态框事件
    const authModal = document.getElementById('auth-modal');
    const authModalBackdrop = document.getElementById('auth-modal-backdrop');
    const authModalClose = document.getElementById('auth-modal-close');

    if (authModalBackdrop) {
        authModalBackdrop.addEventListener('click', closeAuthModal);
    }

    if (authModalClose) {
        authModalClose.addEventListener('click', closeAuthModal);
    }

    // 绑定表单切换事件
    const switchToRegisterBtn = document.getElementById('switch-to-register');
    const switchToLoginBtn = document.getElementById('switch-to-login');

    if (switchToRegisterBtn) {
        switchToRegisterBtn.addEventListener('click', () => switchAuthForm('register'));
    }

    if (switchToLoginBtn) {
        switchToLoginBtn.addEventListener('click', () => switchAuthForm('login'));
    }

    // 绑定表单提交事件
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// 切换认证模态框显示状态
function toggleAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (currentUser) {
        // 如果已登录，执行登出
        handleLogout();
        return;
    }

    if (authModal) {
        // 如果未登录，显示登录模态框
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        switchAuthForm('login');
    } else {
        // 某些页面没有登录模态框时的兜底提示
        if (utils && typeof utils.showToast === 'function') {
            utils.showToast('当前页面未加载登录弹窗，请返回首页登录', 'warning');
        }
    }
}

// 关闭认证模态框
function closeAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 切换登录/注册表单
function switchAuthForm(formType) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const modalTitle = document.querySelector('.auth-modal-title');

    if (formType === 'register') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
        modalTitle.textContent = '注册账号';
    } else {
        registerForm.style.display = 'none';
        loginForm.style.display = 'flex';
        modalTitle.textContent = '登录账号';
    }
}

// 处理登录
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        utils.showToast('请填写完整的登录信息', 'error');
        return;
    }

    const registeredUsers = getRegisteredUsers();
    const matchedUser = registeredUsers.find(user => user.email === email);
    if (!matchedUser) {
        utils.showToast('该邮箱尚未注册，请先注册后登录', 'warning');
        switchAuthForm('register');
        return;
    }

    if (matchedUser.password !== password) {
        utils.showToast('密码错误，请重新输入', 'error');
        return;
    }

    currentUser = {
        id: matchedUser.id,
        username: matchedUser.username,
        email: matchedUser.email,
        avatar: matchedUser.avatar || 'placeholder-user.jpg'
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    updateAuthButton();
    closeAuthModal();
    utils.showToast(`欢迎回来，${currentUser.username}`, 'success');
    event.target.reset();
}

// 处理注册
function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // 验证表单
    if (!username || !email || !password || !confirmPassword) {
        utils.showToast('请填写完整的注册信息', 'error');
        return;
    }

    if (password !== confirmPassword) {
        utils.showToast('两次输入的密码不一致', 'error');
        return;
    }

    if (password.length < 6) {
        utils.showToast('密码长度至少为6位', 'error');
        return;
    }

    const registeredUsers = getRegisteredUsers();
    const emailExists = registeredUsers.some(user => user.email === email);
    if (emailExists) {
        utils.showToast('该邮箱已注册，请直接登录', 'warning');
        switchAuthForm('login');
        return;
    }

    const user = {
        id: Date.now(),
        username: username,
        email: email,
        password: password,
        avatar: 'placeholder-user.jpg'
    };

    registeredUsers.push(user);
    saveRegisteredUsers(registeredUsers);

    currentUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

    updateAuthButton();
    closeAuthModal();

    utils.showToast('注册成功！已自动登录', 'success');

    // 清空表单
    event.target.reset();
}

// 处理登出
function handleLogout() {
    showLogoutConfirmDialog().then((confirmed) => {
        if (!confirmed) return;
        currentUser = null;
        localStorage.removeItem(CURRENT_USER_KEY);
        updateAuthButton();
        utils.showToast('已退出登录', 'info');
    });
}

function showLogoutConfirmDialog() {
    return new Promise((resolve) => {
        const existing = document.getElementById('logout-confirm-overlay');
        if (existing) existing.remove();

        const styleId = 'logout-confirm-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .logout-confirm-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.25);
                    z-index: 20000;
                }
                .logout-confirm-dialog {
                    position: fixed;
                    top: 62px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: min(340px, calc(100vw - 24px));
                    background: rgba(24, 24, 24, 0.95);
                    color: #fff;
                    border-radius: 12px;
                    box-shadow: 0 14px 38px rgba(0, 0, 0, 0.35);
                    padding: 14px 14px 12px;
                    z-index: 20001;
                }
                .logout-confirm-title {
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 10px;
                }
                .logout-confirm-message {
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.85);
                    margin-bottom: 12px;
                }
                .logout-confirm-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                }
                .logout-confirm-btn {
                    border: none;
                    border-radius: 8px;
                    padding: 6px 14px;
                    font-size: 12px;
                    cursor: pointer;
                }
                .logout-confirm-btn.cancel {
                    background: rgba(255, 255, 255, 0.14);
                    color: #fff;
                }
                .logout-confirm-btn.ok {
                    background: #ffffff;
                    color: #222;
                    font-weight: 600;
                }
            `;
            document.head.appendChild(style);
        }

        const overlay = document.createElement('div');
        overlay.id = 'logout-confirm-overlay';
        overlay.className = 'logout-confirm-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'logout-confirm-dialog';
        dialog.innerHTML = `
            <div class="logout-confirm-title">此页面显示</div>
            <div class="logout-confirm-message">确定要退出登录吗？</div>
            <div class="logout-confirm-actions">
                <button type="button" class="logout-confirm-btn cancel">取消</button>
                <button type="button" class="logout-confirm-btn ok">确定</button>
            </div>
        `;

        const cleanup = (result) => {
            overlay.remove();
            dialog.remove();
            resolve(result);
        };

        overlay.addEventListener('click', () => cleanup(false));
        dialog.querySelector('.logout-confirm-btn.cancel').addEventListener('click', () => cleanup(false));
        dialog.querySelector('.logout-confirm-btn.ok').addEventListener('click', () => cleanup(true));

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    });
}

// 更新认证按钮显示
function updateAuthButton() {
    const authButton = document.getElementById('auth-button');
    if (!authButton) return;

    if (currentUser) {
        // 已登录状态：显示用户名
        authButton.classList.add('authenticated');
        authButton.innerHTML = `
            <img src="${currentUser.avatar}" alt="${currentUser.username}" class="user-avatar">
            <span class="auth-text">${currentUser.username} | 退出</span>
        `;
    } else {
        // 未登录状态：显示登录/注册文字
        authButton.classList.remove('authenticated');
        authButton.innerHTML = `
            <i class="fas fa-user"></i>
            <span class="auth-text">登录/注册</span>
        `;
    }

    // 每次按钮内容更新后都重新绑定，避免退出后点击失效
    bindAuthButtonHandler();
}

function bindAuthButtonHandler() {
    const authButton = document.getElementById('auth-button');
    if (!authButton) return;
    authButton.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleAuthModal();
    };
}

// 认证系统API接口（供外部调用）
window.authAPI = {
    // 获取当前用户信息
    getCurrentUser: () => currentUser,

    // 检查是否已登录
    isAuthenticated: () => !!currentUser,

    // 手动登录（供外部调用）
    login: (userData) => {
        currentUser = userData;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
        updateAuthButton();
    },

    // 手动登出（供外部调用）
    logout: () => {
        currentUser = null;
        localStorage.removeItem(CURRENT_USER_KEY);
        updateAuthButton();
    },

    // 打开登录模态框（供外部调用）
    showLoginModal: () => {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            switchAuthForm('login');
        }
    },

    // 打开注册模态框（供外部调用）
    showRegisterModal: () => {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            switchAuthForm('register');
        }
    }
};

function getRegisteredUsers() {
    try {
        const raw = localStorage.getItem(REGISTERED_USERS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveRegisteredUsers(users) {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

function requireAuth(message = '请先登录') {
    if (currentUser) return true;
    utils.showToast(message, 'warning');
    window.authAPI.showLoginModal();
    return false;
}

function isRouteAllowedWithoutAuth(href) {
    const page = (href.split('/').pop() || '').toLowerCase();
    return page === '' || page === 'index.html';
}

function initAccessGuards() {
    const protectedAnchors = document.querySelectorAll('a[href]');
    protectedAnchors.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http')) return;
            if (!isRouteAllowedWithoutAuth(href) && !currentUser) {
                e.preventDefault();
                requireAuth('请先登录后再访问该页面');
            }
        });
    });
}
