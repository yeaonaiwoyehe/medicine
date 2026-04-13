// Mock 数据开关 - 设置为 true 使用模拟数据，设置为 false 切换到真实后端 API
// 切换到真实 API 时，需要修改 recognizeArtifact 函数中的 API 端点
export const USE_MOCK = true;

// API 端点配置（切换真实后端时使用）
export const API_CONFIG = {
  baseUrl: '/api', // 真实后端 API 基础路径
  recognizeEndpoint: '/recognize', // 识别接口
  timeout: 30000, // 请求超时时间（毫秒）
};

export interface ArtifactData {
  id: string;
  name: string;
  dynasty: string;
  period: string;
  material: string;
  dimensions: string;
  usage: string;
  description: string;
  herbs: string[];
  herbDescriptions: string[];
  prescription: {
    name: string;
    story: string;
    ingredients: string[];
    effect: string;
  };
  modernApplication: {
    title: string;
    description: string;
    examples: string[];
  };
  similarity: number;
  imageUrl: string;
  radarData: {
    craftsmanship: number;
    historicalValue: number;
    medicinalRelevance: number;
    rarity: number;
    culturalInfluence: number;
  };
}

export interface RecognitionResult {
  top1: ArtifactData;
  top2: ArtifactData;
  top3: ArtifactData;
  dynastyDistribution: { name: string; value: number }[];
  relatedArtifacts: ArtifactData[];
  timeline: { dynasty: string; year: string; count: number; isHighlighted: boolean }[];
}

// 示例文物列表
export const SAMPLE_ARTIFACTS = [
  { id: 'tang-mortar', name: '唐代铜药臼', icon: 'fa-mortar-pestle' },
  { id: 'song-jar', name: '宋代青瓷药罐', icon: 'fa-jar' },
  { id: 'ming-roller', name: '明代铁药碾', icon: 'fa-dharmachakra' },
  { id: 'qing-acupuncture', name: '清代针灸铜人', icon: 'fa-person' },
  { id: 'han-bamboo', name: '汉代医简', icon: 'fa-scroll' },
  { id: 'ming-scale', name: '明代药秤', icon: 'fa-scale-balanced' },
];

// 完整的 Mock 数据
export const MOCK_DATA: Record<string, RecognitionResult> = {
  'tang-mortar': {
    top1: {
      id: 'tang-mortar',
      name: '唐代铜药臼',
      dynasty: '唐代',
      period: '公元618年-907年',
      material: '青铜',
      dimensions: '高15cm，口径12cm，底径8cm',
      usage: '研磨中药材，制备丸散膏丹',
      description: '此药臼为唐代典型医药器具，通体铜制，口沿微侈，腹部圆鼓，底部平稳。器身铸有缠枝莲纹，工艺精湛，反映了唐代医药事业的繁荣与铜器制作的高超技艺。配有铜杵，用于研磨各类中药材，是唐代药坊的重要器具。',
      herbs: ['人参', '黄芪', '当归', '川芎'],
      herbDescriptions: [
        '大补元气，复脉固脱，补脾益肺',
        '补气升阳，固表止汗，托毒生肌',
        '补血活血，调经止痛，润肠通便',
        '活血行气，祛风止痛，引药上行'
      ],
      prescription: {
        name: '四君子汤',
        story: '唐代药王孙思邈在《千金要方》中记载了此方。相传，长安城内一位老郎中，用此方救治了无数脾胃虚弱的病患。一日，太宗皇帝微服私访，见此药臼研药不辍，询问老郎中其中奥妙。老郎中答曰："此臼虽小，却承载着济世救人之道。研药需心静，如同治国需仁政。"太宗深以为然，特赐此药臼金字题铭。',
        ingredients: ['人参9g', '白术9g', '茯苓9g', '甘草6g'],
        effect: '益气健脾，培补后天之本'
      },
      modernApplication: {
        title: '现代药物研磨技术',
        description: '古代药臼的研磨原理启发了现代制药工业中的球磨机和超微粉碎技术。通过机械研磨使药材达到纳米级别，大大提高了药物的生物利用度。',
        examples: [
          '超微粉碎技术在中药制剂中的应用',
          '纳米中药的研发与临床应用',
          '智能药物研磨设备的开发'
        ]
      },
      similarity: 96.8,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 85,
        historicalValue: 92,
        medicinalRelevance: 95,
        rarity: 78,
        culturalInfluence: 88
      }
    },
    top2: {
      id: 'song-mortar',
      name: '宋代铜药臼',
      dynasty: '宋代',
      period: '公元960年-1279年',
      material: '青铜',
      dimensions: '高14cm，口径11cm',
      usage: '研磨中药材',
      description: '宋代铜药臼，造型简洁大方，体现了宋代崇尚简约的审美风格。',
      herbs: ['茯苓', '白术'],
      herbDescriptions: ['利水渗湿，健脾宁心', '健脾益气，燥湿利水'],
      prescription: {
        name: '二陈汤',
        story: '宋代太医院常用此方治疗痰湿之症。',
        ingredients: ['半夏15g', '陈皮15g', '茯苓9g', '甘草5g'],
        effect: '燥湿化痰，理气和中'
      },
      modernApplication: {
        title: '化痰类药物研发',
        description: '基于二陈汤的现代化研究，开发了多种祛痰止咳的中成药。',
        examples: ['二陈丸', '橘红丸']
      },
      similarity: 89.2,
      imageUrl: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 80,
        historicalValue: 85,
        medicinalRelevance: 90,
        rarity: 72,
        culturalInfluence: 82
      }
    },
    top3: {
      id: 'ming-mortar',
      name: '明代铜药臼',
      dynasty: '明代',
      period: '公元1368年-1644年',
      material: '黄铜',
      dimensions: '高16cm，口径13cm',
      usage: '研磨中药材',
      description: '明代药臼，铸工精细，器型厚重，反映了明代制药业的发达。',
      herbs: ['何首乌', '熟地黄'],
      herbDescriptions: ['补肝肾，益精血，乌须发', '补血滋阴，益精填髓'],
      prescription: {
        name: '四物汤',
        story: '明代《医方考》详载此方，为补血调经之良方。',
        ingredients: ['当归10g', '川芎6g', '白芍10g', '熟地15g'],
        effect: '补血和血，调经止痛'
      },
      modernApplication: {
        title: '补血类药物',
        description: '四物汤是现代多种补血中成药的基础方。',
        examples: ['四物颗粒', '八珍丸']
      },
      similarity: 85.6,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 88,
        historicalValue: 82,
        medicinalRelevance: 88,
        rarity: 68,
        culturalInfluence: 78
      }
    },
    dynastyDistribution: [
      { name: '汉代', value: 15 },
      { name: '唐代', value: 28 },
      { name: '宋代', value: 35 },
      { name: '明代', value: 42 },
      { name: '清代', value: 38 }
    ],
    relatedArtifacts: [
      {
        id: 'tang-jar',
        name: '唐代药瓶',
        dynasty: '唐代',
        period: '公元618年-907年',
        material: '陶瓷',
        dimensions: '高20cm',
        usage: '储存药材',
        description: '唐代储药器具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 78,
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 75, historicalValue: 80, medicinalRelevance: 70, rarity: 65, culturalInfluence: 72 }
      },
      {
        id: 'tang-spoon',
        name: '唐代药匙',
        dynasty: '唐代',
        period: '公元618年-907年',
        material: '铜',
        dimensions: '长12cm',
        usage: '取药',
        description: '唐代取药器具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 72,
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 70, historicalValue: 75, medicinalRelevance: 65, rarity: 60, culturalInfluence: 68 }
      },
      {
        id: 'tang-box',
        name: '唐代药盒',
        dynasty: '唐代',
        period: '公元618年-907年',
        material: '漆器',
        dimensions: '15x10x8cm',
        usage: '存放丸药',
        description: '唐代储药盒',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 68,
        imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 82, historicalValue: 78, medicinalRelevance: 60, rarity: 70, culturalInfluence: 75 }
      },
      {
        id: 'tang-cabinet',
        name: '唐代药柜',
        dynasty: '唐代',
        period: '公元618年-907年',
        material: '木材',
        dimensions: '120x60x180cm',
        usage: '分类存放药材',
        description: '唐代药房家具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 65,
        imageUrl: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 85, historicalValue: 82, medicinalRelevance: 55, rarity: 75, culturalInfluence: 80 }
      }
    ],
    timeline: [
      { dynasty: '汉', year: '前202-220', count: 15, isHighlighted: false },
      { dynasty: '唐', year: '618-907', count: 28, isHighlighted: true },
      { dynasty: '宋', year: '960-1279', count: 35, isHighlighted: false },
      { dynasty: '元', year: '1271-1368', count: 12, isHighlighted: false },
      { dynasty: '明', year: '1368-1644', count: 42, isHighlighted: false },
      { dynasty: '清', year: '1644-1912', count: 38, isHighlighted: false }
    ]
  },
  'song-jar': {
    top1: {
      id: 'song-jar',
      name: '宋代青瓷药罐',
      dynasty: '宋代',
      period: '公元960年-1279年',
      material: '青瓷',
      dimensions: '高22cm，口径8cm，腹径15cm',
      usage: '储存药材、药酒、药膏',
      description: '此药罐为宋代龙泉窑青瓷精品，通体施梅子青釉，釉色温润如玉，釉面开片自然。罐身饰有缠枝牡丹纹，寓意富贵吉祥。罐盖与罐身密合，可有效保存药材药性，是宋代医药储存器具的代表之作。',
      herbs: ['枸杞', '菊花', '决明子', '桑叶'],
      herbDescriptions: [
        '滋补肝肾，益精明目',
        '疏散风热，平肝明目，清热解毒',
        '清热明目，润肠通便',
        '疏散风热，清肺润燥，清肝明目'
      ],
      prescription: {
        name: '杞菊地黄丸',
        story: '宋代名医钱乙在《小儿药证直诀》中创制了六味地黄丸，后世医家在此基础上加枸杞、菊花，创制了杞菊地黄丸。相传宋徽宗年间，翰林院一位老学士因常年伏案，双目昏花。太医用青瓷药罐储存此方，令其每日服用，三月后目明如初，复能挥毫作画。',
        ingredients: ['枸杞子12g', '菊花10g', '熟地黄24g', '山茱萸12g', '山药12g', '泽泻9g', '茯苓9g', '牡丹皮9g'],
        effect: '滋肾养肝，明目退翳'
      },
      modernApplication: {
        title: '中药储存技术',
        description: '宋代青瓷药罐的密封原理被现代中药储存技术所借鉴。现代采用真空包装、氮气填充等技术，配合陶瓷内衬，有效保存中药材的有效成分。',
        examples: [
          '中药材真空包装技术',
          '智能恒温恒湿药柜',
          '陶瓷内衬储药容器的应用'
        ]
      },
      similarity: 94.5,
      imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 95,
        historicalValue: 90,
        medicinalRelevance: 88,
        rarity: 85,
        culturalInfluence: 92
      }
    },
    top2: {
      id: 'song-bottle',
      name: '宋代影青药瓶',
      dynasty: '宋代',
      period: '公元960年-1279年',
      material: '影青瓷',
      dimensions: '高18cm，口径5cm',
      usage: '储存药液',
      description: '宋代景德镇影青瓷药瓶，釉色青白，胎体轻薄。',
      herbs: ['金银花', '连翘'],
      herbDescriptions: ['清热解毒，疏散风热', '清热解毒，消肿散结'],
      prescription: {
        name: '银翘散',
        story: '此方后世广为流传，为治疗温病初起的名方。',
        ingredients: ['金银花15g', '连翘15g', '薄荷6g', '荆芥穗6g'],
        effect: '辛凉透表，清热解毒'
      },
      modernApplication: {
        title: '抗病毒药物',
        description: '银翘散的现代研究发现其具有广谱抗病毒作用。',
        examples: ['银翘解毒片', '双黄连口服液']
      },
      similarity: 87.3,
      imageUrl: 'https://images.unsplash.com/photo-1607006483224-4ebfc92e08d1?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 90,
        historicalValue: 85,
        medicinalRelevance: 82,
        rarity: 80,
        culturalInfluence: 85
      }
    },
    top3: {
      id: 'yuan-jar',
      name: '元代青花药罐',
      dynasty: '元代',
      period: '公元1271年-1368年',
      material: '青花瓷',
      dimensions: '高20cm，口径9cm',
      usage: '储存药材',
      description: '元代青花瓷药罐，纹饰大气，色泽深沉。',
      herbs: ['陈皮', '半夏'],
      herbDescriptions: ['理气健脾，燥湿化痰', '燥湿化痰，降逆止呕'],
      prescription: {
        name: '二陈汤',
        story: '此方为治痰之基础方，元代医家多有阐发。',
        ingredients: ['半夏15g', '陈皮15g', '茯苓9g', '甘草5g'],
        effect: '燥湿化痰，理气和中'
      },
      modernApplication: {
        title: '化痰药物',
        description: '二陈汤是现代许多化痰中成药的基础。',
        examples: ['二陈丸', '香砂养胃丸']
      },
      similarity: 82.1,
      imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 88,
        historicalValue: 80,
        medicinalRelevance: 78,
        rarity: 75,
        culturalInfluence: 80
      }
    },
    dynastyDistribution: [
      { name: '汉代', value: 12 },
      { name: '唐代', value: 25 },
      { name: '宋代', value: 45 },
      { name: '明代', value: 38 },
      { name: '清代', value: 32 }
    ],
    relatedArtifacts: [
      {
        id: 'song-bowl',
        name: '宋代药碗',
        dynasty: '宋代',
        period: '公元960年-1279年',
        material: '青瓷',
        dimensions: '口径15cm',
        usage: '煎药',
        description: '宋代煎药器具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 75,
        imageUrl: 'https://images.unsplash.com/photo-1530968033775-2c92736b131e?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 85, historicalValue: 80, medicinalRelevance: 75, rarity: 70, culturalInfluence: 78 }
      },
      {
        id: 'song-pot',
        name: '宋代药壶',
        dynasty: '宋代',
        period: '公元960年-1279年',
        material: '陶瓷',
        dimensions: '高25cm',
        usage: '煎煮药汤',
        description: '宋代煎药壶',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 72,
        imageUrl: 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 80, historicalValue: 78, medicinalRelevance: 80, rarity: 68, culturalInfluence: 75 }
      },
      {
        id: 'song-cup',
        name: '宋代药杯',
        dynasty: '宋代',
        period: '公元960年-1279年',
        material: '青瓷',
        dimensions: '高8cm',
        usage: '服药',
        description: '宋代服药器具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 68,
        imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 82, historicalValue: 75, medicinalRelevance: 65, rarity: 62, culturalInfluence: 70 }
      },
      {
        id: 'song-tray',
        name: '宋代药盘',
        dynasty: '宋代',
        period: '公元960年-1279年',
        material: '青瓷',
        dimensions: '直径30cm',
        usage: '晾晒药材',
        description: '宋代晾药器具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 65,
        imageUrl: 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 78, historicalValue: 72, medicinalRelevance: 60, rarity: 58, culturalInfluence: 68 }
      }
    ],
    timeline: [
      { dynasty: '汉', year: '前202-220', count: 12, isHighlighted: false },
      { dynasty: '唐', year: '618-907', count: 25, isHighlighted: false },
      { dynasty: '宋', year: '960-1279', count: 45, isHighlighted: true },
      { dynasty: '元', year: '1271-1368', count: 18, isHighlighted: false },
      { dynasty: '明', year: '1368-1644', count: 38, isHighlighted: false },
      { dynasty: '清', year: '1644-1912', count: 32, isHighlighted: false }
    ]
  },
  'ming-roller': {
    top1: {
      id: 'ming-roller',
      name: '明代铁药碾',
      dynasty: '明代',
      period: '公元1368年-1644年',
      material: '生铁',
      dimensions: '碾槽长40cm，宽15cm，碾轮直径12cm',
      usage: '碾碎坚硬药材',
      description: '此药碾为明代医药器具精品，由碾槽和碾轮两部分组成。碾槽为船形，内壁光滑；碾轮圆厚，两端有轴可握。用于碾压矿物药、坚硬的植物根茎等难以研磨的药材。器身铸有"济世良药"四字，体现了明代医者的济世情怀。',
      herbs: ['龙骨', '牡蛎', '磁石', '代赭石'],
      herbDescriptions: [
        '镇惊安神，敛汗固精，止血涩肠',
        '重镇安神，潜阳补阴，软坚散结',
        '镇惊安神，平肝潜阳，聪耳明目',
        '平肝潜阳，重镇降逆，凉血止血'
      ],
      prescription: {
        name: '镇肝熄风汤',
        story: '明代医家张介宾在《景岳全书》中详述肝风之证。相传有一武将，久经沙场后患头晕目眩、肢体麻木之症。御医以铁药碾碾碎龙骨牡蛎等重镇之药，配以柔肝熄风之品，三剂后症状大减。武将感其医术，特铸此药碾相赠，刻字以记其事。',
        ingredients: ['怀牛膝30g', '代赭石30g', '龙骨15g', '牡蛎15g', '白芍15g', '玄参15g', '天冬15g', '川楝子6g', '麦芽6g', '茵陈6g', '甘草5g'],
        effect: '镇肝熄风，滋阴潜阳'
      },
      modernApplication: {
        title: '矿物药现代研究',
        description: '明代对矿物药的碾制技术启发了现代矿物药的超微粉碎研究。现代研究发现，矿物药经超微粉碎后，其有效成分更易被人体吸收。',
        examples: [
          '龙骨牡蛎的镇静安神机制研究',
          '矿物药纳米化技术',
          '重金属成分安全性评价'
        ]
      },
      similarity: 93.2,
      imageUrl: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 82,
        historicalValue: 88,
        medicinalRelevance: 92,
        rarity: 75,
        culturalInfluence: 80
      }
    },
    top2: {
      id: 'qing-roller',
      name: '清代铜药碾',
      dynasty: '清代',
      period: '公元1644年-1912年',
      material: '黄铜',
      dimensions: '碾槽长35cm，宽12cm',
      usage: '碾碎药材',
      description: '清代铜制药碾，工艺精细，使用便利。',
      herbs: ['珍珠', '琥珀'],
      herbDescriptions: ['安神定惊，明目消翳，解毒生肌', '镇惊安神，散瘀止血，利水通淋'],
      prescription: {
        name: '珍珠散',
        story: '清宫秘方，用于美容养颜。',
        ingredients: ['珍珠粉3g', '琥珀粉2g', '朱砂1g'],
        effect: '安神定惊，解毒生肌'
      },
      modernApplication: {
        title: '珍珠粉美容',
        description: '珍珠粉的现代护肤品应用广泛。',
        examples: ['珍珠粉面膜', '珍珠美白霜']
      },
      similarity: 86.5,
      imageUrl: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 85,
        historicalValue: 80,
        medicinalRelevance: 85,
        rarity: 70,
        culturalInfluence: 75
      }
    },
    top3: {
      id: 'song-roller',
      name: '宋代石药碾',
      dynasty: '宋代',
      period: '公元960年-1279年',
      material: '青石',
      dimensions: '碾槽长38cm，宽14cm',
      usage: '碾碎药材',
      description: '宋代石制药碾，古朴厚重。',
      herbs: ['石膏', '滑石'],
      herbDescriptions: ['清热泻火，除烦止渴', '利尿通淋，清热解暑'],
      prescription: {
        name: '白虎汤',
        story: '张仲景《伤寒论》名方，清热泻火之祖方。',
        ingredients: ['石膏50g', '知母18g', '甘草6g', '粳米9g'],
        effect: '清热生津，除烦止渴'
      },
      modernApplication: {
        title: '清热药物',
        description: '白虎汤是现代退热药研究的重要参考。',
        examples: ['清热解毒口服液', '退烧贴']
      },
      similarity: 81.8,
      imageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 75,
        historicalValue: 85,
        medicinalRelevance: 88,
        rarity: 72,
        culturalInfluence: 78
      }
    },
    dynastyDistribution: [
      { name: '汉代', value: 8 },
      { name: '唐代', value: 18 },
      { name: '宋代', value: 25 },
      { name: '明代', value: 48 },
      { name: '清代', value: 35 }
    ],
    relatedArtifacts: [
      {
        id: 'ming-mortar2',
        name: '明代铜药臼',
        dynasty: '明代',
        period: '公元1368年-1644年',
        material: '铜',
        dimensions: '高18cm',
        usage: '研磨药材',
        description: '明代研药器具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 78,
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 85, historicalValue: 82, medicinalRelevance: 85, rarity: 70, culturalInfluence: 78 }
      },
      {
        id: 'ming-scale2',
        name: '明代药戥',
        dynasty: '明代',
        period: '公元1368年-1644年',
        material: '铜',
        dimensions: '长30cm',
        usage: '称量药材',
        description: '明代称药器具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 72,
        imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 90, historicalValue: 85, medicinalRelevance: 75, rarity: 80, culturalInfluence: 82 }
      },
      {
        id: 'ming-cabinet2',
        name: '明代百眼橱',
        dynasty: '明代',
        period: '公元1368年-1644年',
        material: '楠木',
        dimensions: '150x50x200cm',
        usage: '分类存放药材',
        description: '明代药房家具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 68,
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 92, historicalValue: 88, medicinalRelevance: 60, rarity: 85, culturalInfluence: 90 }
      },
      {
        id: 'ming-pot',
        name: '明代药锅',
        dynasty: '明代',
        period: '公元1368年-1644年',
        material: '砂陶',
        dimensions: '高20cm',
        usage: '煎煮药材',
        description: '明代煎药器具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 65,
        imageUrl: 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 78, historicalValue: 80, medicinalRelevance: 88, rarity: 65, culturalInfluence: 72 }
      }
    ],
    timeline: [
      { dynasty: '汉', year: '前202-220', count: 8, isHighlighted: false },
      { dynasty: '唐', year: '618-907', count: 18, isHighlighted: false },
      { dynasty: '宋', year: '960-1279', count: 25, isHighlighted: false },
      { dynasty: '元', year: '1271-1368', count: 10, isHighlighted: false },
      { dynasty: '明', year: '1368-1644', count: 48, isHighlighted: true },
      { dynasty: '清', year: '1644-1912', count: 35, isHighlighted: false }
    ]
  },
  'qing-acupuncture': {
    top1: {
      id: 'qing-acupuncture',
      name: '清代针灸铜人',
      dynasty: '清代',
      period: '公元1644年-1912年',
      material: '青铜',
      dimensions: '高175cm，仿真人体比例',
      usage: '针灸教学与穴位标识',
      description: '此针灸铜人为清代太医院教学用具，仿照人体真实比例铸造。全身标注经络走向和穴位位置，共标注361个穴位。铜人关节可活动，体内中空，外涂黄蜡。教学时，学生用针刺入正确穴位，则蜡下水流出，以此验证取穴是否准确。此铜人是中国古代医学教育的杰出代表。',
      herbs: ['艾叶', '川芎', '白芷', '细辛'],
      herbDescriptions: [
        '温经止血，散寒止痛，祛湿止痒',
        '活血行气，祛风止痛',
        '解表散寒，祛风止痛，通鼻窍',
        '祛风散寒，通窍止痛，温肺化饮'
      ],
      prescription: {
        name: '艾灸疗法配方',
        story: '清代御医将针灸与中药结合，创制了独特的艾灸配方。乾隆皇帝晚年常感腰膝酸软，御医以艾叶为主，配以温阳补肾之药制成艾条，于肾俞、命门等穴施灸。乾隆深感效验，特命太医院铸造此铜人，以传针灸之术。铜人至今保存完好，是研究清代医学的珍贵文物。',
        ingredients: ['艾叶500g', '川芎30g', '白芷30g', '细辛15g', '桂枝30g', '干姜20g'],
        effect: '温经通络，散寒止痛'
      },
      modernApplication: {
        title: '现代针灸研究',
        description: '清代针灸铜人为现代针灸教学和研究提供了重要参考。现代利用3D打印技术制作高精度针灸模型，配合虚拟现实技术进行针灸培训。',
        examples: [
          '3D打印针灸教学模型',
          '虚拟现实针灸培训系统',
          '电子针灸仪的开发与应用'
        ]
      },
      similarity: 97.5,
      imageUrl: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 98,
        historicalValue: 95,
        medicinalRelevance: 98,
        rarity: 92,
        culturalInfluence: 96
      }
    },
    top2: {
      id: 'ming-acupuncture',
      name: '明代针灸铜人',
      dynasty: '明代',
      period: '公元1368年-1644年',
      material: '青铜',
      dimensions: '高160cm',
      usage: '针灸教学',
      description: '明代针灸教学铜人，穴位标注详尽。',
      herbs: ['艾叶', '乳香'],
      herbDescriptions: ['温经止血，散寒止痛', '活血定痛，消肿生肌'],
      prescription: {
        name: '温针灸法',
        story: '明代医家发展了温针灸技术。',
        ingredients: ['艾绒适量', '乳香少许'],
        effect: '温经散寒，活血止痛'
      },
      modernApplication: {
        title: '温针技术',
        description: '现代温针灸技术在疼痛治疗中广泛应用。',
        examples: ['电温针', '红外线针灸仪']
      },
      similarity: 91.2,
      imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 92,
        historicalValue: 90,
        medicinalRelevance: 95,
        rarity: 88,
        culturalInfluence: 90
      }
    },
    top3: {
      id: 'song-acupuncture',
      name: '宋代针灸铜人',
      dynasty: '宋代',
      period: '公元960年-1279年',
      material: '青铜',
      dimensions: '高150cm',
      usage: '针灸教学与考试',
      description: '宋代天圣针灸铜人，是中国针灸史上的里程碑。',
      herbs: ['艾叶', '当归'],
      herbDescriptions: ['温经止血，散寒止痛', '补血活血，调经止痛'],
      prescription: {
        name: '天圣铜人经',
        story: '宋仁宗天圣年间铸造，用于太医院考试。',
        ingredients: ['艾绒', '当归', '川芎'],
        effect: '活血通络，温经止痛'
      },
      modernApplication: {
        title: '针灸标准化',
        description: '宋代铜人开创了针灸穴位标准化的先河。',
        examples: ['国际针灸穴位标准', 'WHO针灸穴位命名']
      },
      similarity: 88.7,
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 90,
        historicalValue: 95,
        medicinalRelevance: 92,
        rarity: 90,
        culturalInfluence: 95
      }
    },
    dynastyDistribution: [
      { name: '汉代', value: 5 },
      { name: '唐代', value: 10 },
      { name: '宋代', value: 18 },
      { name: '明代', value: 22 },
      { name: '清代', value: 30 }
    ],
    relatedArtifacts: [
      {
        id: 'qing-needles',
        name: '清代九针',
        dynasty: '清代',
        period: '公元1644年-1912年',
        material: '金银',
        dimensions: '长度不等',
        usage: '针灸治疗',
        description: '清代御用针具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 82,
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 95, historicalValue: 90, medicinalRelevance: 92, rarity: 88, culturalInfluence: 85 }
      },
      {
        id: 'qing-chart',
        name: '清代经络图',
        dynasty: '清代',
        period: '公元1644年-1912年',
        material: '绢本',
        dimensions: '150x80cm',
        usage: '教学参考',
        description: '清代经络穴位图谱',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 78,
        imageUrl: 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 88, historicalValue: 85, medicinalRelevance: 90, rarity: 75, culturalInfluence: 88 }
      },
      {
        id: 'qing-moxa',
        name: '清代艾灸盒',
        dynasty: '清代',
        period: '公元1644年-1912年',
        material: '铜木',
        dimensions: '10x10x5cm',
        usage: '艾灸',
        description: '清代艾灸器具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 72,
        imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 82, historicalValue: 78, medicinalRelevance: 85, rarity: 70, culturalInfluence: 75 }
      },
      {
        id: 'qing-cupping',
        name: '清代火罐',
        dynasty: '清代',
        period: '公元1644年-1912年',
        material: '竹陶',
        dimensions: '高10cm',
        usage: '拔罐疗法',
        description: '清代拔罐器具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 68,
        imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 75, historicalValue: 72, medicinalRelevance: 80, rarity: 65, culturalInfluence: 70 }
      }
    ],
    timeline: [
      { dynasty: '汉', year: '前202-220', count: 5, isHighlighted: false },
      { dynasty: '唐', year: '618-907', count: 10, isHighlighted: false },
      { dynasty: '宋', year: '960-1279', count: 18, isHighlighted: false },
      { dynasty: '元', year: '1271-1368', count: 8, isHighlighted: false },
      { dynasty: '明', year: '1368-1644', count: 22, isHighlighted: false },
      { dynasty: '清', year: '1644-1912', count: 30, isHighlighted: true }
    ]
  },
  'han-bamboo': {
    top1: {
      id: 'han-bamboo',
      name: '汉代医简',
      dynasty: '汉代',
      period: '公元前202年-公元220年',
      material: '竹简',
      dimensions: '简长23cm，宽1cm，共计156枚',
      usage: '记载医方与医理',
      description: '此批医简出土于汉代墓葬，为研究汉代医学的珍贵文献。简文以隶书书写，内容涉及内科、外科、妇科等多个领域，记载了50余个方剂。简文保存较为完整，字迹清晰可辨，是继马王堆医书之后又一重要的出土医学文献。',
      herbs: ['麻黄', '桂枝', '杏仁', '甘草'],
      herbDescriptions: [
        '发汗解表，宣肺平喘，利水消肿',
        '发汗解肌，温通经脉，助阳化气',
        '降气止咳平喘，润肠通便',
        '补脾益气，清热解毒，调和诸药'
      ],
      prescription: {
        name: '麻黄汤',
        story: '汉代医圣张仲景在《伤寒杂病论》中记载此方。相传东汉末年，瘟疫流行，百姓苦不堪言。张仲景辞官归乡，潜心研究伤寒之治。他将临床验证有效的方剂刻于竹简之上，其中麻黄汤为治疗外感风寒之首方。此方传承至今，历代医家视为解表之祖方。',
        ingredients: ['麻黄9g', '桂枝6g', '杏仁9g', '甘草3g'],
        effect: '发汗解表，宣肺平喘'
      },
      modernApplication: {
        title: '经方现代研究',
        description: '汉代医简中的方剂是中医经方的重要来源。现代研究发现，麻黄汤具有明确的解热、抗炎、平喘作用，其机理已被现代药理学所阐明。',
        examples: [
          '麻黄碱的发现与应用',
          '经方配伍规律的现代研究',
          '汉代医简数字化保护项目'
        ]
      },
      similarity: 92.8,
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 70,
        historicalValue: 98,
        medicinalRelevance: 95,
        rarity: 95,
        culturalInfluence: 98
      }
    },
    top2: {
      id: 'han-silk',
      name: '汉代帛书医经',
      dynasty: '汉代',
      period: '公元前202年-公元220年',
      material: '帛书',
      dimensions: '48x120cm',
      usage: '医学典籍',
      description: '汉代帛书医学文献，内容珍贵。',
      herbs: ['大黄', '芒硝'],
      herbDescriptions: ['泻下攻积，清热泻火', '泻下通便，润燥软坚'],
      prescription: {
        name: '大承气汤',
        story: '张仲景伤寒论名方，治疗阳明腑实证。',
        ingredients: ['大黄12g', '厚朴15g', '枳实12g', '芒硝9g'],
        effect: '峻下热结'
      },
      modernApplication: {
        title: '通腑泻下药物',
        description: '大承气汤是现代急腹症治疗的重要参考。',
        examples: ['通腑颗粒', '清胰汤']
      },
      similarity: 88.5,
      imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 75,
        historicalValue: 96,
        medicinalRelevance: 92,
        rarity: 98,
        culturalInfluence: 95
      }
    },
    top3: {
      id: 'qin-bamboo',
      name: '秦代医方简',
      dynasty: '秦代',
      period: '公元前221年-公元前206年',
      material: '竹简',
      dimensions: '简长25cm',
      usage: '医方记录',
      description: '秦代出土医方竹简，年代久远。',
      herbs: ['附子', '干姜'],
      herbDescriptions: ['回阳救逆，补火助阳', '温中散寒，回阳通脉'],
      prescription: {
        name: '四逆汤',
        story: '回阳救逆之祖方。',
        ingredients: ['附子15g', '干姜9g', '甘草6g'],
        effect: '回阳救逆，温中祛寒'
      },
      modernApplication: {
        title: '心血管急救药物',
        description: '四逆汤在心血管急救中有重要价值。',
        examples: ['参附注射液', '生脉注射液']
      },
      similarity: 85.2,
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 68,
        historicalValue: 98,
        medicinalRelevance: 90,
        rarity: 99,
        culturalInfluence: 92
      }
    },
    dynastyDistribution: [
      { name: '秦代', value: 5 },
      { name: '汉代', value: 25 },
      { name: '唐代', value: 15 },
      { name: '宋代', value: 20 },
      { name: '明代', value: 18 },
      { name: '清代', value: 12 }
    ],
    relatedArtifacts: [
      {
        id: 'han-seal',
        name: '汉代医官印',
        dynasty: '汉代',
        period: '公元前202年-公元220年',
        material: '铜',
        dimensions: '2x2cm',
        usage: '医官凭证',
        description: '汉代医官官印',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 72,
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 80, historicalValue: 90, medicinalRelevance: 50, rarity: 92, culturalInfluence: 85 }
      },
      {
        id: 'han-knife',
        name: '汉代砭石',
        dynasty: '汉代',
        period: '公元前202年-公元220年',
        material: '石',
        dimensions: '长8cm',
        usage: '刺血放血',
        description: '汉代医疗器具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 68,
        imageUrl: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 65, historicalValue: 88, medicinalRelevance: 85, rarity: 80, culturalInfluence: 82 }
      },
      {
        id: 'han-vessel',
        name: '汉代药壶',
        dynasty: '汉代',
        period: '公元前202年-公元220年',
        material: '陶',
        dimensions: '高22cm',
        usage: '煎药',
        description: '汉代煎药器具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 65,
        imageUrl: 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 70, historicalValue: 85, medicinalRelevance: 80, rarity: 75, culturalInfluence: 78 }
      },
      {
        id: 'han-box',
        name: '汉代药盒',
        dynasty: '汉代',
        period: '公元前202年-公元220年',
        material: '漆器',
        dimensions: '12x8x6cm',
        usage: '存放药丸',
        description: '汉代漆器药盒',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 62,
        imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 85, historicalValue: 82, medicinalRelevance: 60, rarity: 78, culturalInfluence: 80 }
      }
    ],
    timeline: [
      { dynasty: '秦', year: '前221-前206', count: 5, isHighlighted: false },
      { dynasty: '汉', year: '前202-220', count: 25, isHighlighted: true },
      { dynasty: '唐', year: '618-907', count: 15, isHighlighted: false },
      { dynasty: '宋', year: '960-1279', count: 20, isHighlighted: false },
      { dynasty: '明', year: '1368-1644', count: 18, isHighlighted: false },
      { dynasty: '清', year: '1644-1912', count: 12, isHighlighted: false }
    ]
  },
  'ming-scale': {
    top1: {
      id: 'ming-scale',
      name: '明代药秤',
      dynasty: '明代',
      period: '公元1368年-1644年',
      material: '铜骨象牙',
      dimensions: '秤杆长32cm，秤盘直径8cm',
      usage: '精确称量药材',
      description: '此药秤又称"戥子"，为明代药房必备之器。秤杆以铜为骨，外包象牙，上刻刻度精细入微，可称量钱、分、厘等极小单位。秤盘以铜制成，秤砣分大中小三枚，可根据药量选用。此秤制作精良，刻度准确，体现了明代对中药配方精确性的重视。',
      herbs: ['附子', '细辛', '马钱子', '砒霜'],
      herbDescriptions: [
        '回阳救逆，补火助阳，散寒止痛（有毒，需严格控量）',
        '祛风散寒，通窍止痛（有毒，用量不过钱）',
        '通络止痛，散结消肿（大毒，外用为主）',
        '蚀疮去腐（剧毒，现已少用）'
      ],
      prescription: {
        name: '附子理中丸',
        story: '明代《本草纲目》对附子有详尽记载，李时珍强调附子用量必须精准。相传有一名医，擅用附子治疗虚寒重症。一日，一患者病重，需用附子三钱，名医嘱药房务必精确称量。药房以此戥子反复校准，方敢抓药。患者服药后转危为安，此戥子遂成药房传世之宝，代代相传。',
        ingredients: ['附子（制）6g', '党参9g', '白术9g', '干姜6g', '甘草6g'],
        effect: '温中健脾，回阳救逆'
      },
      modernApplication: {
        title: '中药剂量现代研究',
        description: '明代药秤的精确称量理念在现代中药研究中得到传承。现代采用电子天平、自动配药系统等技术，确保中药配方的精确性和安全性。',
        examples: [
          '中药配方颗粒的剂量标准化',
          '毒性中药的安全剂量研究',
          '智能中药配药系统的开发'
        ]
      },
      similarity: 95.3,
      imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 92,
        historicalValue: 88,
        medicinalRelevance: 90,
        rarity: 82,
        culturalInfluence: 85
      }
    },
    top2: {
      id: 'qing-scale',
      name: '清代象牙戥',
      dynasty: '清代',
      period: '公元1644年-1912年',
      material: '象牙铜',
      dimensions: '秤杆长35cm',
      usage: '称量贵重药材',
      description: '清代精制象牙药戥，工艺精湛。',
      herbs: ['犀角', '牛黄'],
      herbDescriptions: ['清热凉血，定惊解毒', '化痰开窍，凉肝息风'],
      prescription: {
        name: '安宫牛黄丸',
        story: '清代温病名方，用于急救。',
        ingredients: ['牛黄1g', '麝香0.25g', '犀角1g', '黄连1g'],
        effect: '清热解毒，镇惊开窍'
      },
      modernApplication: {
        title: '急救中成药',
        description: '安宫牛黄丸是现代中医急救的重要药物。',
        examples: ['安宫牛黄丸', '至宝丹']
      },
      similarity: 89.8,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 95,
        historicalValue: 85,
        medicinalRelevance: 88,
        rarity: 85,
        culturalInfluence: 82
      }
    },
    top3: {
      id: 'song-scale',
      name: '宋代铜药戥',
      dynasty: '宋代',
      period: '公元960年-1279年',
      material: '青铜',
      dimensions: '秤杆长28cm',
      usage: '称量药材',
      description: '宋代标准药戥，刻度清晰。',
      herbs: ['雄黄', '朱砂'],
      herbDescriptions: ['解毒杀虫，燥湿祛痰', '镇心安神，清热解毒'],
      prescription: {
        name: '朱砂安神丸',
        story: '宋代安神名方。',
        ingredients: ['朱砂1g', '黄连6g', '当归3g', '甘草3g'],
        effect: '镇心安神，清热养血'
      },
      modernApplication: {
        title: '安神药物',
        description: '朱砂安神丸启发了现代安神药物研究。',
        examples: ['天王补心丹', '柏子养心丸']
      },
      similarity: 84.6,
      imageUrl: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=400&h=300&fit=crop',
      radarData: {
        craftsmanship: 85,
        historicalValue: 88,
        medicinalRelevance: 82,
        rarity: 78,
        culturalInfluence: 80
      }
    },
    dynastyDistribution: [
      { name: '汉代', value: 6 },
      { name: '唐代', value: 15 },
      { name: '宋代', value: 28 },
      { name: '明代', value: 45 },
      { name: '清代', value: 40 }
    ],
    relatedArtifacts: [
      {
        id: 'ming-weights',
        name: '明代药砝码',
        dynasty: '明代',
        period: '公元1368年-1644年',
        material: '铜',
        dimensions: '一套10枚',
        usage: '配合药秤使用',
        description: '明代标准药砝码',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 85,
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 88, historicalValue: 82, medicinalRelevance: 75, rarity: 72, culturalInfluence: 78 }
      },
      {
        id: 'ming-box2',
        name: '明代药戥盒',
        dynasty: '明代',
        period: '公元1368年-1644年',
        material: '红木',
        dimensions: '35x12x8cm',
        usage: '存放药戥',
        description: '明代药戥收纳盒',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 78,
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 90, historicalValue: 78, medicinalRelevance: 50, rarity: 75, culturalInfluence: 72 }
      },
      {
        id: 'ming-grinder',
        name: '明代药研',
        dynasty: '明代',
        period: '公元1368年-1644年',
        material: '陶瓷',
        dimensions: '直径15cm',
        usage: '研磨药粉',
        description: '明代研药器具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 72,
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 82, historicalValue: 80, medicinalRelevance: 85, rarity: 68, culturalInfluence: 75 }
      },
      {
        id: 'ming-spoon',
        name: '明代药匙',
        dynasty: '明代',
        period: '公元1368年-1644年',
        material: '铜',
        dimensions: '长15cm',
        usage: '取药',
        description: '明代取药器具',
        herbs: [],
        herbDescriptions: [],
        prescription: { name: '', story: '', ingredients: [], effect: '' },
        modernApplication: { title: '', description: '', examples: [] },
        similarity: 68,
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
        radarData: { craftsmanship: 78, historicalValue: 75, medicinalRelevance: 70, rarity: 62, culturalInfluence: 68 }
      }
    ],
    timeline: [
      { dynasty: '汉', year: '前202-220', count: 6, isHighlighted: false },
      { dynasty: '唐', year: '618-907', count: 15, isHighlighted: false },
      { dynasty: '宋', year: '960-1279', count: 28, isHighlighted: false },
      { dynasty: '元', year: '1271-1368', count: 12, isHighlighted: false },
      { dynasty: '明', year: '1368-1644', count: 45, isHighlighted: true },
      { dynasty: '清', year: '1644-1912', count: 40, isHighlighted: false }
    ]
  }
};

// 获取识别结果
export function getRecognitionResult(artifactId: string): RecognitionResult {
  return MOCK_DATA[artifactId] || MOCK_DATA['tang-mortar'];
}

// 模拟识别 API 调用
export async function recognizeArtifact(
  file: File | null, 
  sampleId?: string
): Promise<{ success: boolean; data?: RecognitionResult; message?: string }> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 2000));

  if (USE_MOCK) {
    if (sampleId && MOCK_DATA[sampleId]) {
      return { success: true, data: MOCK_DATA[sampleId] };
    }
    // 未知图片默认返回唐代铜药臼
    return { 
      success: true, 
      data: MOCK_DATA['tang-mortar'],
      message: '未能精确识别，已匹配最相似文物'
    };
  }

  // 真实 API 调用（切换 USE_MOCK = false 时启用）
  // const formData = new FormData();
  // if (file) formData.append('image', file);
  // if (sampleId) formData.append('sampleId', sampleId);
  // 
  // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.recognizeEndpoint}`, {
  //   method: 'POST',
  //   body: formData,
  // });
  // 
  // if (!response.ok) {
  //   throw new Error('识别失败');
  // }
  // 
  // return response.json();
  
  return { success: false, message: '请配置真实后端 API' };
}
