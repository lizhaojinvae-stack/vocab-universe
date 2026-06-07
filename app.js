const palette = {
  gold: "#ffd86b",
  pink: "#ff83b7",
  cyan: "#8ff4eb",
  orange: "#ff9d57",
  violet: "#a792ff",
  white: "#f8fbff",
};

const defaultWords = [
  {
    id: "radiat",
    word: "radiat",
    phonetic: "/ˈreɪdiət/",
    meaning: "词根：光线，辐射，向外发散",
    unit: "Unit 01 核心词根",
    theme: "自然与科学",
    root: "radi",
    parts: ["radi 光线", "-at 动作倾向"],
    memory: "把一束光从中心向四周射出去，所有带 radi 的词都像从同一颗恒星发出光。",
    related: ["radiate", "radiation", "radial", "radius", "radical"],
    style: "core",
  },
  {
    id: "radiate",
    word: "radiate",
    phonetic: "/ˈreɪdieɪt/",
    meaning: "v. 发出；辐射；流露",
    unit: "Unit 01 核心词根",
    theme: "自然与科学",
    root: "radi",
    parts: ["radi 光线", "-ate 使成为/做"],
    memory: "太阳把光 radiate 到四面八方，人也可以 radiate confidence。",
    related: ["radiat", "radiation", "emit", "glow", "confidence"],
    style: "planet",
  },
  {
    id: "radiation",
    word: "radiation",
    phonetic: "/ˌreɪdiˈeɪʃn/",
    meaning: "n. 辐射；放射线",
    unit: "Unit 01 核心词根",
    theme: "自然与科学",
    root: "radi",
    parts: ["radi 光线", "-ation 名词后缀"],
    memory: "医院放射科、太阳光、核能都在提醒你 radiation 是能量向外传播。",
    related: ["radiat", "radiate", "energy", "nuclear", "therapy"],
    style: "nebula",
  },
  {
    id: "radial",
    word: "radial",
    phonetic: "/ˈreɪdiəl/",
    meaning: "adj. 辐射状的；半径的",
    unit: "Unit 01 核心词根",
    theme: "自然与科学",
    root: "radi",
    parts: ["radi 光线/半径", "-al 形容词"],
    memory: "车轮辐条从中心向外延伸，就是 radial pattern。",
    related: ["radiat", "radius", "circular", "orbit"],
    style: "ring",
  },
  {
    id: "radius",
    word: "radius",
    phonetic: "/ˈreɪdiəs/",
    meaning: "n. 半径；范围",
    unit: "Unit 01 核心词根",
    theme: "自然与科学",
    root: "radi",
    parts: ["radi 射线", "-us 名词尾"],
    memory: "圆心发出一条光线抵达边界，这条线就是 radius。",
    related: ["radiat", "radial", "range", "circular"],
    style: "planet",
  },
  {
    id: "radical",
    word: "radical",
    phonetic: "/ˈrædɪkl/",
    meaning: "adj. 根本的；激进的 n. 激进分子",
    unit: "Unit 01 核心词根",
    theme: "社会与思想",
    root: "radic",
    parts: ["radic 根", "-al 形容词"],
    memory: "radical 原本指触及根部，思想上就是从根本处改变。",
    related: ["radiat", "root", "reform", "revolution"],
    style: "ring",
  },
  {
    id: "emit",
    word: "emit",
    phonetic: "/iˈmɪt/",
    meaning: "v. 发出；排放",
    unit: "Unit 02 自然科学",
    theme: "自然与科学",
    root: "mit",
    parts: ["e- 向外", "mit 送出"],
    memory: "烟囱向外送出气体，就是 emit fumes。",
    related: ["radiate", "release", "fume", "pollution"],
    style: "planet",
  },
  {
    id: "nuclear",
    word: "nuclear",
    phonetic: "/ˈnuːkliər/",
    meaning: "adj. 核的；原子能的",
    unit: "Unit 02 自然科学",
    theme: "自然与科学",
    root: "nucle",
    parts: ["nucle 核", "-ar 形容词"],
    memory: "nucleus 是核心，nuclear 就是和核心或原子核有关。",
    related: ["radiation", "energy", "atomic", "core"],
    style: "star",
  },
  {
    id: "therapy",
    word: "therapy",
    phonetic: "/ˈθerəpi/",
    meaning: "n. 治疗；疗法",
    unit: "Unit 02 自然科学",
    theme: "医学与生命",
    root: "therap",
    parts: ["therap 治疗", "-y 名词"],
    memory: "radiation therapy 是放射治疗，把 radiation 和 therapy 连在一起记。",
    related: ["radiation", "medical", "recover", "patient"],
    style: "planet",
  },
  {
    id: "energy",
    word: "energy",
    phonetic: "/ˈenərdʒi/",
    meaning: "n. 能量；精力",
    unit: "Unit 02 自然科学",
    theme: "自然与科学",
    root: "erg",
    parts: ["en- 进入", "erg 工作/能量"],
    memory: "能做功的东西就是 energy，光、热、运动都能串起来。",
    related: ["radiation", "nuclear", "dynamic", "vigor"],
    style: "star",
  },
  {
    id: "gravity",
    word: "gravity",
    phonetic: "/ˈɡrævəti/",
    meaning: "n. 重力；严重性",
    unit: "Unit 03 宇宙地理",
    theme: "自然与科学",
    root: "grav",
    parts: ["grav 重", "-ity 名词"],
    memory: "gravity 把星球拉在轨道上，也表示事情的重量和严重程度。",
    related: ["orbit", "planet", "mass", "serious"],
    style: "core",
  },
  {
    id: "orbit",
    word: "orbit",
    phonetic: "/ˈɔːrbɪt/",
    meaning: "n. 轨道 v. 环绕运行",
    unit: "Unit 03 宇宙地理",
    theme: "自然与科学",
    root: "orb",
    parts: ["orb 圆/球", "-it 行进"],
    memory: "一颗小星围着大星绕圈，就是 orbit。",
    related: ["gravity", "planet", "radial", "circular"],
    style: "ring",
  },
  {
    id: "planet",
    word: "planet",
    phonetic: "/ˈplænɪt/",
    meaning: "n. 行星",
    unit: "Unit 03 宇宙地理",
    theme: "自然与科学",
    root: "plan",
    parts: ["planet 游走的星"],
    memory: "古人看到行星在星空中移动，所以 planet 有游走星的味道。",
    related: ["orbit", "gravity", "stellar", "galaxy"],
    style: "planet",
  },
  {
    id: "galaxy",
    word: "galaxy",
    phonetic: "/ˈɡæləksi/",
    meaning: "n. 星系；银河",
    unit: "Unit 03 宇宙地理",
    theme: "自然与科学",
    root: "galact",
    parts: ["galaxy 银河", "galact 乳白"],
    memory: "银河像乳白色的河流，galaxy 就是一整片星系。",
    related: ["stellar", "planet", "cosmos", "astronomy"],
    style: "nebula",
  },
  {
    id: "stellar",
    word: "stellar",
    phonetic: "/ˈstelər/",
    meaning: "adj. 星的；极好的",
    unit: "Unit 03 宇宙地理",
    theme: "自然与科学",
    root: "stell",
    parts: ["stell 星", "-ar 形容词"],
    memory: "星星级表现就是 stellar performance。",
    related: ["galaxy", "planet", "astronomy", "splendid"],
    style: "star",
  },
  {
    id: "astronomy",
    word: "astronomy",
    phonetic: "/əˈstrɑːnəmi/",
    meaning: "n. 天文学",
    unit: "Unit 03 宇宙地理",
    theme: "自然与科学",
    root: "astro",
    parts: ["astro 星", "-nomy 学科/法则"],
    memory: "astro 是星，astronomy 就是研究星空运行法则。",
    related: ["stellar", "galaxy", "cosmos", "orbit"],
    style: "planet",
  },
  {
    id: "cosmos",
    word: "cosmos",
    phonetic: "/ˈkɑːzməs/",
    meaning: "n. 宇宙；有序整体",
    unit: "Unit 03 宇宙地理",
    theme: "自然与科学",
    root: "cosm",
    parts: ["cosm 宇宙/秩序", "-os 名词尾"],
    memory: "cosmos 不只是大，还强调有序的整体。",
    related: ["astronomy", "galaxy", "universe", "order"],
    style: "core",
  },
  {
    id: "reform",
    word: "reform",
    phonetic: "/rɪˈfɔːrm/",
    meaning: "v. 改革；改造 n. 改革",
    unit: "Unit 04 社会政治",
    theme: "社会与思想",
    root: "form",
    parts: ["re- 再", "form 形态"],
    memory: "把旧形态重新塑造，就是 reform。",
    related: ["radical", "policy", "society", "improve"],
    style: "planet",
  },
  {
    id: "policy",
    word: "policy",
    phonetic: "/ˈpɑːləsi/",
    meaning: "n. 政策；方针",
    unit: "Unit 04 社会政治",
    theme: "社会与思想",
    root: "pol",
    parts: ["pol 城邦/治理", "-icy 名词"],
    memory: "城市如何治理，就形成 policy。",
    related: ["reform", "society", "govern", "principle"],
    style: "planet",
  },
  {
    id: "society",
    word: "society",
    phonetic: "/səˈsaɪəti/",
    meaning: "n. 社会；协会",
    unit: "Unit 04 社会政治",
    theme: "社会与思想",
    root: "soci",
    parts: ["soci 同伴/社会", "-ety 名词"],
    memory: "人和人连接起来就是 society。",
    related: ["policy", "reform", "community", "civil"],
    style: "nebula",
  },
  {
    id: "civil",
    word: "civil",
    phonetic: "/ˈsɪvl/",
    meaning: "adj. 公民的；文明的；民事的",
    unit: "Unit 04 社会政治",
    theme: "社会与思想",
    root: "civ",
    parts: ["civ 公民/城市", "-il 形容词"],
    memory: "城市里的公民生活，引出 civil society 和 civil law。",
    related: ["society", "citizen", "legal", "polite"],
    style: "ring",
  },
  {
    id: "legal",
    word: "legal",
    phonetic: "/ˈliːɡl/",
    meaning: "adj. 法律的；合法的",
    unit: "Unit 04 社会政治",
    theme: "社会与思想",
    root: "leg",
    parts: ["leg 法律", "-al 形容词"],
    memory: "legal document 是受法律认可的文件。",
    related: ["civil", "justice", "policy", "right"],
    style: "planet",
  },
  {
    id: "justice",
    word: "justice",
    phonetic: "/ˈdʒʌstɪs/",
    meaning: "n. 正义；司法",
    unit: "Unit 04 社会政治",
    theme: "社会与思想",
    root: "just",
    parts: ["just 公正", "-ice 名词"],
    memory: "just 是公正，justice 是把公正落到制度里。",
    related: ["legal", "right", "moral", "fair"],
    style: "star",
  },
  {
    id: "identity",
    word: "identity",
    phonetic: "/aɪˈdentəti/",
    meaning: "n. 身份；特征；同一性",
    unit: "Unit 05 人格情感",
    theme: "心理与情感",
    root: "ident",
    parts: ["ident 相同/识别", "-ity 名词"],
    memory: "能识别你是谁的东西，就是 identity。",
    related: ["individual", "personality", "self", "recognize"],
    style: "core",
  },
  {
    id: "sympathy",
    word: "sympathy",
    phonetic: "/ˈsɪmpəθi/",
    meaning: "n. 同情；赞同",
    unit: "Unit 05 人格情感",
    theme: "心理与情感",
    root: "path",
    parts: ["sym- 共同", "path 情感/痛苦"],
    memory: "和别人一起感受痛苦，就是 sympathy。",
    related: ["empathy", "apathy", "pathetic", "compassion"],
    style: "star",
  },
  {
    id: "empathy",
    word: "empathy",
    phonetic: "/ˈempəθi/",
    meaning: "n. 共情；移情",
    unit: "Unit 05 人格情感",
    theme: "心理与情感",
    root: "path",
    parts: ["em- 进入", "path 情感"],
    memory: "进入别人的感受里，就是 empathy。",
    related: ["sympathy", "apathy", "compassion", "sincere"],
    style: "planet",
  },
  {
    id: "apathy",
    word: "apathy",
    phonetic: "/ˈæpəθi/",
    meaning: "n. 冷漠；无兴趣",
    unit: "Unit 05 人格情感",
    theme: "心理与情感",
    root: "path",
    parts: ["a- 无", "path 情感"],
    memory: "没有情感反应，就是 apathy。",
    related: ["sympathy", "empathy", "pathetic", "indifferent"],
    style: "ring",
  },
  {
    id: "pathetic",
    word: "pathetic",
    phonetic: "/pəˈθetɪk/",
    meaning: "adj. 可怜的；差劲的",
    unit: "Unit 05 人格情感",
    theme: "心理与情感",
    root: "path",
    parts: ["path 情感/痛苦", "-etic 形容词"],
    memory: "能激起怜悯情绪的，就是 pathetic。",
    related: ["sympathy", "apathy", "melancholy", "grief"],
    style: "planet",
  },
  {
    id: "melancholy",
    word: "melancholy",
    phonetic: "/ˈmelənkɑːli/",
    meaning: "n. 忧郁；愁思 adj. 忧郁的",
    unit: "Unit 05 人格情感",
    theme: "心理与情感",
    root: "melan",
    parts: ["melan 黑色", "kholē 胆汁"],
    memory: "古人认为黑胆汁过多会让人忧郁，melancholy 因此带着深色情绪。",
    related: ["grief", "solitude", "wistful", "nostalgia", "pathetic"],
    style: "nebula",
  },
  {
    id: "grief",
    word: "grief",
    phonetic: "/ɡriːf/",
    meaning: "n. 悲痛；忧伤",
    unit: "Unit 05 人格情感",
    theme: "心理与情感",
    root: "grav",
    parts: ["grief 沉重的悲伤"],
    memory: "悲伤重得压在心上，和 grave/gravity 的重感可以联想。",
    related: ["melancholy", "sorrow", "despair", "mourning"],
    style: "planet",
  },
  {
    id: "sincere",
    word: "sincere",
    phonetic: "/sɪnˈsɪr/",
    meaning: "adj. 真诚的",
    unit: "Unit 05 人格情感",
    theme: "心理与情感",
    root: "sincer",
    parts: ["sincere 纯净/真诚"],
    memory: "没有掺假的情感，就是 sincere。",
    related: ["empathy", "honest", "genuine", "loyal"],
    style: "star",
  },
  {
    id: "nostalgia",
    word: "nostalgia",
    phonetic: "/nɑːˈstældʒə/",
    meaning: "n. 怀旧；乡愁",
    unit: "Unit 06 记忆与时间",
    theme: "心理与情感",
    root: "nost",
    parts: ["nostos 归乡", "algia 痛"],
    memory: "想回到过去却回不去，所以 nostalgia 是带痛感的怀旧。",
    related: ["melancholy", "memory", "wistful", "home"],
    style: "ring",
  },
  {
    id: "solitude",
    word: "solitude",
    phonetic: "/ˈsɑːlətuːd/",
    meaning: "n. 独处；孤寂",
    unit: "Unit 06 记忆与时间",
    theme: "心理与情感",
    root: "sol",
    parts: ["sol 单独", "-itude 状态"],
    memory: "一个人站在安静星球上，既可能孤独，也可能清醒。",
    related: ["melancholy", "lonely", "isolate", "quiet"],
    style: "planet",
  },
  {
    id: "wistful",
    word: "wistful",
    phonetic: "/ˈwɪstfl/",
    meaning: "adj. 惆怅的；渴望的",
    unit: "Unit 06 记忆与时间",
    theme: "心理与情感",
    root: "wist",
    parts: ["wist 渴望/思念", "-ful 充满"],
    memory: "望着远处发呆，那种想要却够不到的感觉就是 wistful。",
    related: ["melancholy", "nostalgia", "desire", "memory"],
    style: "planet",
  },
  {
    id: "memory",
    word: "memory",
    phonetic: "/ˈmeməri/",
    meaning: "n. 记忆；记忆力",
    unit: "Unit 06 记忆与时间",
    theme: "心理与情感",
    root: "memor",
    parts: ["memor 记住", "-y 名词"],
    memory: "把词变成星图，是为了让 memory 有更多钩子。",
    related: ["nostalgia", "remember", "recall", "cognitive"],
    style: "star",
  },
  {
    id: "cognitive",
    word: "cognitive",
    phonetic: "/ˈkɑːɡnətɪv/",
    meaning: "adj. 认知的",
    unit: "Unit 06 记忆与时间",
    theme: "心理与情感",
    root: "cogn",
    parts: ["cogn 知道", "-itive 形容词"],
    memory: "cognition 是认识世界的过程，cognitive 是认知相关。",
    related: ["memory", "recognize", "logic", "theory"],
    style: "ring",
  },
  {
    id: "theory",
    word: "theory",
    phonetic: "/ˈθiːəri/",
    meaning: "n. 理论；学说",
    unit: "Unit 07 学术抽象",
    theme: "学术与抽象",
    root: "theor",
    parts: ["theor 观看/思考", "-y 名词"],
    memory: "从观察中抽出解释框架，就是 theory。",
    related: ["hypothesis", "logic", "abstract", "evidence"],
    style: "core",
  },
  {
    id: "hypothesis",
    word: "hypothesis",
    phonetic: "/haɪˈpɑːθəsɪs/",
    meaning: "n. 假设；假说",
    unit: "Unit 07 学术抽象",
    theme: "学术与抽象",
    root: "thes",
    parts: ["hypo- 在下", "thesis 放置/观点"],
    memory: "先把一个观点放在下面当基础，再等证据检验。",
    related: ["theory", "evidence", "assume", "logic"],
    style: "planet",
  },
  {
    id: "abstract",
    word: "abstract",
    phonetic: "/ˈæbstrækt/",
    meaning: "adj. 抽象的 n. 摘要",
    unit: "Unit 07 学术抽象",
    theme: "学术与抽象",
    root: "tract",
    parts: ["abs- 离开", "tract 拉"],
    memory: "从具体事物里拉出来，留下概念，就是 abstract。",
    related: ["theory", "concept", "summary", "logic"],
    style: "ring",
  },
  {
    id: "logic",
    word: "logic",
    phonetic: "/ˈlɑːdʒɪk/",
    meaning: "n. 逻辑；推理方式",
    unit: "Unit 07 学术抽象",
    theme: "学术与抽象",
    root: "log",
    parts: ["log 语言/理性", "-ic 名词尾"],
    memory: "语言背后的理性秩序，就是 logic。",
    related: ["theory", "hypothesis", "deduce", "cognitive"],
    style: "star",
  },
  {
    id: "deduce",
    word: "deduce",
    phonetic: "/dɪˈduːs/",
    meaning: "v. 推断；演绎",
    unit: "Unit 07 学术抽象",
    theme: "学术与抽象",
    root: "duc",
    parts: ["de- 向下", "duc 引导"],
    memory: "从一般规律一步步引出结论，就是 deduce。",
    related: ["logic", "infer", "theory", "evidence"],
    style: "planet",
  },
  {
    id: "evidence",
    word: "evidence",
    phonetic: "/ˈevɪdəns/",
    meaning: "n. 证据；迹象",
    unit: "Unit 07 学术抽象",
    theme: "学术与抽象",
    root: "vid",
    parts: ["e- 向外", "vid 看见"],
    memory: "能被看见、拿出来支撑观点的东西，就是 evidence。",
    related: ["hypothesis", "deduce", "proof", "theory"],
    style: "planet",
  },
  {
    id: "vigor",
    word: "vigor",
    phonetic: "/ˈvɪɡər/",
    meaning: "n. 活力；精力",
    unit: "Unit 08 行动状态",
    theme: "行为与状态",
    root: "vig",
    parts: ["vig 活力", "-or 名词"],
    memory: "一个词被点亮时的闪光感，就是 vigor。",
    related: ["energy", "dynamic", "vital", "active"],
    style: "star",
  },
  {
    id: "dynamic",
    word: "dynamic",
    phonetic: "/daɪˈnæmɪk/",
    meaning: "adj. 动态的；有活力的",
    unit: "Unit 08 行动状态",
    theme: "行为与状态",
    root: "dyn",
    parts: ["dyn 力量", "-amic 形容词"],
    memory: "有力量在流动，所以 dynamic 既是动态，也是有劲。",
    related: ["energy", "vigor", "motion", "change"],
    style: "ring",
  },
  {
    id: "impulse",
    word: "impulse",
    phonetic: "/ˈɪmpʌls/",
    meaning: "n. 冲动；脉冲",
    unit: "Unit 08 行动状态",
    theme: "行为与状态",
    root: "puls",
    parts: ["im- 进入", "puls 推动"],
    memory: "内心突然被推了一下，就是 impulse。",
    related: ["dynamic", "urge", "motion", "instinct"],
    style: "planet",
  },
  {
    id: "urge",
    word: "urge",
    phonetic: "/ɜːrdʒ/",
    meaning: "v. 敦促；力劝 n. 强烈欲望",
    unit: "Unit 08 行动状态",
    theme: "行为与状态",
    root: "urg",
    parts: ["urg 推动/催促"],
    memory: "有股力量催你去做，就是 urge。",
    related: ["impulse", "desire", "persuade", "motivate"],
    style: "planet",
  },
  {
    id: "desire",
    word: "desire",
    phonetic: "/dɪˈzaɪər/",
    meaning: "n. 欲望；渴望 v. 渴望",
    unit: "Unit 08 行动状态",
    theme: "行为与状态",
    root: "sider",
    parts: ["de- 离开", "sider 星"],
    memory: "传说里望着星星许愿，desire 像对远方星体的渴望。",
    related: ["urge", "wistful", "ambition", "hope"],
    style: "nebula",
  },
  {
    id: "sophisticated",
    word: "sophisticated",
    phonetic: "/səˈfɪstɪkeɪtɪd/",
    meaning: "adj. 复杂精密的；老练的",
    unit: "Unit 09 品质描述",
    theme: "品质与表达",
    root: "soph",
    parts: ["soph 智慧", "-istic 具有", "-ated 形容词"],
    memory: "有智慧加工过的系统，既精密也老练。",
    related: ["complex", "refined", "subtle", "advanced"],
    style: "core",
  },
  {
    id: "eloquent",
    word: "eloquent",
    phonetic: "/ˈeləkwənt/",
    meaning: "adj. 雄辩的；有说服力的",
    unit: "Unit 09 品质描述",
    theme: "品质与表达",
    root: "loqu",
    parts: ["e- 向外", "loqu 说话"],
    memory: "话语向外流畅地说出来，就是 eloquent。",
    related: ["persuade", "articulate", "express", "speech"],
    style: "star",
  },
  {
    id: "subtle",
    word: "subtle",
    phonetic: "/ˈsʌtl/",
    meaning: "adj. 微妙的；精细的",
    unit: "Unit 09 品质描述",
    theme: "品质与表达",
    root: "subtil",
    parts: ["sub- 在下", "tile 细线"],
    memory: "像藏在细线里的差别，需要仔细感知。",
    related: ["sophisticated", "delicate", "implicit", "nuance"],
    style: "planet",
  },
  {
    id: "articulate",
    word: "articulate",
    phonetic: "/ɑːrˈtɪkjuleɪt/",
    meaning: "v. 清楚表达 adj. 表达清晰的",
    unit: "Unit 09 品质描述",
    theme: "品质与表达",
    root: "articul",
    parts: ["articul 关节/连接", "-ate 动词"],
    memory: "把想法一节一节接清楚，就是 articulate。",
    related: ["eloquent", "express", "clear", "speech"],
    style: "ring",
  },
  {
    id: "humble",
    word: "humble",
    phonetic: "/ˈhʌmbl/",
    meaning: "adj. 谦逊的；卑微的",
    unit: "Unit 09 品质描述",
    theme: "品质与表达",
    root: "hum",
    parts: ["hum 土地", "-ble 形容词"],
    memory: "贴近地面的人，不自高，所以 humble。",
    related: ["modest", "sincere", "ordinary", "respect"],
    style: "planet",
  },
  {
    id: "confident",
    word: "confident",
    phonetic: "/ˈkɑːnfɪdənt/",
    meaning: "adj. 自信的；确信的",
    unit: "Unit 09 品质描述",
    theme: "品质与表达",
    root: "fid",
    parts: ["con- 完全", "fid 信任", "-ent 形容词"],
    memory: "完全信任自己和判断，就是 confident。",
    related: ["radiate", "belief", "assure", "courage"],
    style: "star",
  },
];

let words = structuredClone(defaultWords);
let nodes = [];
let links = [];
let galaxies = [];
let selectedId = "radiat";
let viewMode = "units";
let activeGroup = "all";
let expandedGroups = new Set();
let didBootstrapExpandedGroups = false;
let showLabels = true;
let zoom = 1;
let targetZoom = 1;
let rotationX = -0.15;
let rotationY = 0.35;
let cameraFocus = { x: 0, y: 0, z: 0 };
let targetFocus = { x: 0, y: 0, z: 0 };
let selectedAt = 0;
let isDragging = false;
let lastPointer = { x: 0, y: 0 };
let dragStart = { x: 0, y: 0 };
let pointer = { x: -10000, y: -10000 };
let time = 0;

const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");
const groupList = document.getElementById("groupList");
const statusText = document.getElementById("statusText");
const learnedCount = document.getElementById("learnedCount");
const searchInput = document.getElementById("searchInput");
const detailPanel = document.getElementById("detailPanel");
const detailUnit = document.getElementById("detailUnit");
const detailWord = document.getElementById("detailWord");
const detailPhonetic = document.getElementById("detailPhonetic");
const detailMeaning = document.getElementById("detailMeaning");
const morphemes = document.getElementById("morphemes");
const memoryText = document.getElementById("memoryText");
const relatedWords = document.getElementById("relatedWords");
const learnButton = document.getElementById("learnButton");
const csvInput = document.getElementById("csvInput");
const speakButton = document.getElementById("speakButton");
const exampleSection = document.getElementById("exampleSection");
const exampleEn = document.getElementById("exampleEn");
const exampleZh = document.getElementById("exampleZh");
const speakExampleButton = document.getElementById("speakExampleButton");
const ttsProviderSelect = document.getElementById("ttsProviderSelect");
const studyPanel = document.getElementById("studyPanel");
const closeStudy = document.getElementById("closeStudy");
const dailyNewInput = document.getElementById("dailyNewInput");
const dailyReviewInput = document.getElementById("dailyReviewInput");
const saveStudySettings = document.getElementById("saveStudySettings");
const studyModePicker = document.getElementById("studyModePicker");
const studyStats = document.getElementById("studyStats");
const studyModeLabel = document.getElementById("studyModeLabel");
const studyPrompt = document.getElementById("studyPrompt");
const studySubPrompt = document.getElementById("studySubPrompt");
const studyOptions = document.getElementById("studyOptions");
const studyAnswer = document.getElementById("studyAnswer");
const startStudy = document.getElementById("startStudy");
const showStudyAnswer = document.getElementById("showStudyAnswer");
const ratingButtons = document.querySelectorAll(".rating-row button");

const storageKey = "kaoyan-vocab-universe-learned";
const wordBankKey = "kaoyan-vocab-universe-word-bank";
const wordBankVersionKey = "kaoyan-vocab-universe-word-bank-version";
const wordBankVersion = "2";
const ttsProviderKey = "kaoyan-vocab-universe-tts-provider";
let learned = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));
let preferredVoice = null;
const audioCache = new Map();
let studyQueue = [];
let currentStudyCard = null;
let currentStudyStartedAt = 0;
let studyPlanReady = null;
let studySessionStarted = false;
let selectedStudyMode = "flip";

function currentTtsProvider() {
  return ttsProviderSelect.querySelector("button.active")?.dataset.provider || "qwen";
}

function setTtsProvider(provider) {
  const nextProvider = provider === "openai" ? "openai" : "qwen";
  ttsProviderSelect.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.provider === nextProvider);
  });
  localStorage.setItem(ttsProviderKey, nextProvider);
}

function chooseVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  preferredVoice =
    voices.find((voice) => voice.lang === "en-US" && /natural|online|google|microsoft|aria|jenny/i.test(voice.name)) ||
    voices.find((voice) => voice.lang === "en-US") ||
    voices.find((voice) => voice.lang?.startsWith("en"));
  return preferredVoice;
}

function normalizeAudioUrl(url) {
  if (!url) return "";
  return url.startsWith("//") ? `https:${url}` : url;
}

async function fetchDictionaryAudio(wordText) {
  const key = wordText.toLowerCase();
  if (audioCache.has(key)) return audioCache.get(key);
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`);
    if (!response.ok) throw new Error("No dictionary audio");
    const entries = await response.json();
    const phonetics = entries.flatMap((entry) => entry.phonetics || []);
    const preferred = phonetics.find((item) => item.audio);
    const url = normalizeAudioUrl(preferred?.audio || "");
    audioCache.set(key, url);
    return url;
  } catch {
    audioCache.set(key, "");
    return "";
  }
}

function localDefaultAudioUrl(wordText) {
  const safeWord = wordText.toLowerCase().replace(/[^a-z0-9-]/g, "");
  return safeWord ? `audio/default/${safeWord}.mp3` : "";
}

function localRecordedAudioUrl(wordText) {
  const safeWord = wordText.toLowerCase().replace(/[^a-z0-9-]/g, "");
  return safeWord ? `audio/us/${safeWord}.mp3` : "";
}

function playAudioUrl(url) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    const timer = window.setTimeout(() => {
      audio.pause();
      reject(new Error("Audio timeout"));
    }, 2400);
    audio.onplay = () => {
      window.clearTimeout(timer);
      speakButton.textContent = "播放中";
    };
    audio.onended = () => {
      speakButton.textContent = "美音";
      resolve();
    };
    audio.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("Audio failed"));
    };
    audio.play().catch(reject);
  });
}

function speakWithSystemVoice(wordText) {
  if (!("speechSynthesis" in window) || !wordText) {
    speakButton.textContent = "不可用";
    window.setTimeout(() => {
      speakButton.textContent = "美音";
    }, 1200);
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(wordText);
  utterance.lang = "en-US";
  utterance.rate = 0.82;
  utterance.pitch = 1;
  utterance.voice = preferredVoice || chooseVoice();
  utterance.onstart = () => {
    speakButton.textContent = "播放中";
  };
  utterance.onend = utterance.onerror = () => {
    speakButton.textContent = "美音";
  };
  window.speechSynthesis.speak(utterance);
}

async function speakWord(wordText = detailWord.textContent) {
  if (!wordText) return;
  window.speechSynthesis?.cancel();
  speakButton.textContent = "获取中";
  speakButton.disabled = true;

  try {
    await playAudioUrl(localDefaultAudioUrl(wordText));
    speakButton.disabled = false;
    return;
  } catch {
    // Cached dictionary audio is optional; try Google/Oxford via the local server next.
  }

  if (["http:", "https:"].includes(window.location.protocol)) {
    try {
      const response = await fetch("./api/default-word-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: wordText }),
      });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || "No default audio");
      speakButton.disabled = false;
      await playAudioUrl(result.url);
      return;
    } catch {
      // Google/Oxford may not have every word; continue to other sources.
    }
  }

  try {
    await playAudioUrl(localRecordedAudioUrl(wordText));
    speakButton.disabled = false;
    return;
  } catch {
    // Optional recorded local fallback.
  }

  const audioUrl = await fetchDictionaryAudio(wordText);
  speakButton.disabled = false;

  if (audioUrl) {
    try {
      await playAudioUrl(audioUrl);
      return;
    } catch {
      // Dictionary audio can occasionally be blocked or missing; try final fallback next.
    }
  }

  speakWithSystemVoice(wordText);
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function colorFor(word) {
  const colors = [palette.gold, palette.pink, palette.cyan, palette.orange, palette.violet, palette.white];
  let sum = 0;
  for (const char of word) sum += char.charCodeAt(0);
  return colors[sum % colors.length];
}

function galaxyNameFor(word) {
  return viewMode === "units" ? normalizeUnitName(word.unit) : word.theme || "未分主题";
}

function sortGalaxyNames(names) {
  return [...names].sort((a, b) => {
    const unitA = a.match(/Unit\s+(\d+)/i)?.[1];
    const unitB = b.match(/Unit\s+(\d+)/i)?.[1];
    if (unitA && unitB) return Number(unitA) - Number(unitB);
    return a.localeCompare(b);
  });
}

function buildGraph() {
  const byId = new Map(words.map((word) => [word.id, word]));
  const grouped = new Map();
  for (const word of words) {
    const name = galaxyNameFor(word);
    if (!grouped.has(name)) grouped.set(name, []);
    grouped.get(name).push(word);
  }

  const galaxyNames = sortGalaxyNames(grouped.keys());
  const galaxyCount = Math.max(1, galaxyNames.length);
  const orbitRadius = Math.max(320, Math.min(920, 230 + galaxyCount * 58));
  galaxies = galaxyNames.map((name, index) => {
    const items = grouped.get(name) || [];
    const angle = galaxyCount === 1 ? 0 : -Math.PI / 2 + (index / galaxyCount) * Math.PI * 2;
    const centerRadius = galaxyCount === 1 ? 0 : orbitRadius;
    return {
      name,
      count: items.length,
      color: colorFor(name),
      x: Math.cos(angle) * centerRadius,
      y: Math.sin(angle) * centerRadius * 0.68,
      z: Math.sin(angle * 1.7) * 180,
      radius: Math.max(110, Math.min(260, 68 + Math.sqrt(items.length) * 32)),
    };
  });
  const galaxyByName = new Map(galaxies.map((galaxy) => [galaxy.name, galaxy]));

  nodes = [];
  for (const [name, items] of grouped) {
    const galaxy = galaxyByName.get(name);
    items.forEach((word, localIndex) => {
      const globalIndex = words.indexOf(word);
      const angle = localIndex * 2.399963 + galaxy.x * 0.001;
      const ring = localIndex === 0 ? 0 : 28 + Math.sqrt(localIndex) * 34 + (localIndex % 4) * 7;
      const vertical = Math.sin(localIndex * 1.37) * galaxy.radius * 0.24;
      nodes.push({
        ...word,
        galaxy: name,
        x: galaxy.x + Math.cos(angle) * ring,
        y: galaxy.y + Math.sin(angle) * ring * 0.78 + vertical * 0.25,
        z: galaxy.z + vertical,
        vx: 0,
        vy: 0,
        vz: 0,
        radius: word.style === "core" ? 15 : word.style === "star" ? 12 : word.style === "nebula" ? 14 : 10,
        color: colorFor(word.word),
        screen: { x: 0, y: 0, scale: 1 },
        sortIndex: globalIndex,
      });
    });
  }

  const linkMap = new Map();
  for (const word of words) {
    for (const targetId of word.related || []) {
      if (!byId.has(targetId)) continue;
      const key = [word.id, targetId].sort().join("__");
      linkMap.set(key, { source: word.id, target: targetId });
    }
  }
  links = [...linkMap.values()];
}

function normalizeUnitName(unit) {
  const raw = String(unit || "未分单元").trim();
  const unitMatch = raw.match(/unit\s*0*(\d+)/i);
  const cnMatch = raw.match(/第\s*0*(\d+)\s*(单元|课|章)/);
  const number = unitMatch?.[1] || cnMatch?.[1];
  return number ? `Unit ${String(Number(number)).padStart(2, "0")}` : raw;
}

function groupValueFor(word, groupKey) {
  return groupKey === "unit" ? normalizeUnitName(word.unit) : word.theme;
}

function currentGroupKey() {
  return viewMode === "units" ? "unit" : "theme";
}

function groupNameForWord(word) {
  return word ? groupValueFor(word, currentGroupKey()) : "";
}

function matchesQuery(word, query) {
  return (
    !query ||
    word.word.toLowerCase().includes(query) ||
    word.meaning.toLowerCase().includes(query) ||
    word.root.toLowerCase().includes(query) ||
    normalizeUnitName(word.unit).toLowerCase().includes(query)
  );
}

function wordsRelatedTo(items, primaryIds, query) {
  const ids = new Set();
  for (const word of items) {
    for (const relatedId of word.related || []) ids.add(normalizeWordKey(relatedId));
  }
  return words
    .filter((word) => ids.has(normalizeWordKey(word.word)) && !primaryIds.has(word.id) && matchesQuery(word, query))
    .sort((a, b) => a.word.localeCompare(b.word));
}

function normalizeWordKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\uFEFF/, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9-]/g, "");
}

function normalizeList(items) {
  return (Array.isArray(items) ? items : String(items || "").split(/[;|]/))
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

function normalizeWordRecord(word, index = 0) {
  const wordText = String(word.word || word.id || "").trim().replace(/^\uFEFF/, "");
  const key = normalizeWordKey(wordText);
  if (!key) return null;
  return {
    ...word,
    id: key,
    word: wordText,
    phonetic: String(word.phonetic || "").trim(),
    meaning: String(word.meaning || "").trim(),
    meaning_full: String(word.meaning_full || word.meaningFull || word.full_meaning || word.fullMeaning || "").trim(),
    unit: String(word.unit || `Unit ${String(Math.floor(index / 20) + 1).padStart(2, "0")}`).trim(),
    theme: String(word.theme || "红宝书导入").trim(),
    root: String(word.root || key.slice(0, 5)).trim(),
    parts: normalizeList(word.parts),
    memory: String(word.memory || "导入后可在 CSV 的 memory 列补充个人记忆故事。").trim(),
    related: normalizeList(word.related).map(normalizeWordKey).filter(Boolean),
    example_en: String(word.example_en || word.exampleEn || "").trim(),
    example_zh: String(word.example_zh || word.exampleZh || "").trim(),
    pronunciation_text: String(word.pronunciation_text || word.pronunciationText || "").trim(),
    style: word.style || (index % 9 === 0 ? "core" : index % 4 === 0 ? "ring" : index % 5 === 0 ? "nebula" : "planet"),
  };
}

function loadSavedWordBank() {
  if (["http:", "https:"].includes(window.location.protocol)) return;
  try {
    if (localStorage.getItem(wordBankVersionKey) !== wordBankVersion) {
      localStorage.removeItem(wordBankKey);
      return;
    }
    const saved = JSON.parse(localStorage.getItem(wordBankKey) || "[]");
    if (Array.isArray(saved) && saved.length) {
      words = mergeWords(words, saved);
      selectedId = words[0]?.id || selectedId;
      saveWordBank();
    }
  } catch {
    words = mergeWords([], words.length ? words : structuredClone(defaultWords));
  }
}

async function loadAllWordsFile() {
  if (["http:", "https:"].includes(window.location.protocol)) {
    try {
      const response = await fetch("./api/words", { cache: "no-store" });
      if (!response.ok) throw new Error("database unavailable");
      const payload = await response.json();
      if (Array.isArray(payload.words)) {
        words = mergeWords([], payload.words);
        learned = new Set(payload.words.filter((word) => word.learned).map((word) => word.id));
        selectedId = words[0]?.id || "";
        return true;
      }
    } catch {
      // Fall back to embedded data when the local service is not available.
    }
  }

  if (typeof window !== "undefined" && typeof window.ALL_WORDS_CSV === "string") {
    const fileWords = parseCsv(window.ALL_WORDS_CSV);
    if (fileWords.length) {
      words = mergeWords([], fileWords);
      selectedId = words[0].id;
      return true;
    }
  }

  if (window.location.protocol === "file:") {
    return false;
  }

  try {
    const response = await fetch("./all-words.csv", { cache: "no-store" });
    if (!response.ok) throw new Error("all-words.csv not found");
    const fileWords = parseCsv(decodeCsvBuffer(await response.arrayBuffer()));
    if (fileWords.length) {
      words = mergeWords([], fileWords);
      selectedId = words[0].id;
      return true;
    }
  } catch {
    // Opening through file:// may block fetch in some browsers; the embedded seed remains available.
  }
  return false;
}

function saveWordBank() {
  words = mergeWords([], words);
  if (["http:", "https:"].includes(window.location.protocol)) return;
  localStorage.setItem(wordBankVersionKey, wordBankVersion);
  localStorage.setItem(wordBankKey, JSON.stringify(words));
}

function rotatePoint(node) {
  const cosY = Math.cos(rotationY);
  const sinY = Math.sin(rotationY);
  const cosX = Math.cos(rotationX);
  const sinX = Math.sin(rotationX);
  const localX = node.x - cameraFocus.x;
  const localY = node.y - cameraFocus.y;
  const localZ = node.z - cameraFocus.z;
  const x1 = localX * cosY - localZ * sinY;
  const z1 = localX * sinY + localZ * cosY;
  const y1 = localY * cosX - z1 * sinX;
  const z2 = localY * sinX + z1 * cosX;
  const depth = 880;
  const scale = (depth / (depth + z2)) * zoom;
  return {
    x: window.innerWidth / 2 + x1 * scale,
    y: window.innerHeight / 2 + y1 * scale,
    z: z2,
    scale,
  };
}

function easeCamera() {
  cameraFocus.x += (targetFocus.x - cameraFocus.x) * 0.075;
  cameraFocus.y += (targetFocus.y - cameraFocus.y) * 0.075;
  cameraFocus.z += (targetFocus.z - cameraFocus.z) * 0.075;
  zoom += (targetZoom - zoom) * 0.075;
}

function focusAll() {
  targetFocus = { x: 0, y: 0, z: 0 };
  targetZoom = 1;
}

function focusGalaxy(name) {
  const galaxy = galaxies.find((item) => item.name === name);
  if (!galaxy) {
    focusAll();
    return;
  }
  targetFocus = { x: galaxy.x, y: galaxy.y, z: galaxy.z };
  targetZoom = Math.max(1.28, Math.min(2.25, 185 / Math.max(90, galaxy.radius)));
}

function focusWord(id) {
  const node = nodes.find((item) => item.id === id);
  if (!node) return;
  targetFocus = { x: node.x, y: node.y, z: node.z };
  targetZoom = Math.min(3.15, words.length > 1200 ? 3.05 : 2.65);
}

function selectedContext() {
  const selectedNode = nodes.find((item) => item.id === selectedId);
  if (!selectedNode) return null;
  const related = new Set([selectedNode.id]);
  for (const link of links) {
    if (link.source === selectedNode.id) related.add(link.target);
    if (link.target === selectedNode.id) related.add(link.source);
  }
  return { node: selectedNode, galaxy: selectedNode.galaxy, related };
}

function nodeRelevance(node, context) {
  if (!context) return "normal";
  if (node.id === context.node.id) return "selected";
  if (context.related.has(node.id)) return "related";
  if (node.galaxy === context.galaxy) return "same-galaxy";
  return "distant";
}

function activeWords() {
  const query = searchInput.value.trim().toLowerCase();
  if (viewMode === "units" && activeGroup !== "all") {
    const primaryIds = new Set(
      words
        .filter((word) => groupValueFor(word, "unit") === activeGroup && matchesQuery(word, query))
        .map((word) => word.id),
    );
    const relatedIds = new Set();
    for (const word of words) {
      if (!primaryIds.has(word.id)) continue;
      for (const relatedId of word.related || []) relatedIds.add(relatedId);
    }
    return new Set(
      words
        .filter((word) => (primaryIds.has(word.id) || relatedIds.has(word.id)) && matchesQuery(word, query))
        .map((word) => word.id),
    );
  }

  return new Set(
    words
      .filter((word) => {
        const groupValue = groupValueFor(word, viewMode === "units" ? "unit" : "theme");
        const groupOk = activeGroup === "all" || groupValue === activeGroup;
        return groupOk && matchesQuery(word, query);
      })
      .map((word) => word.id),
  );
}

function drawBackground() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createRadialGradient(width * 0.62, height * 0.28, 0, width * 0.5, height * 0.5, width);
  gradient.addColorStop(0, "#111735");
  gradient.addColorStop(0.42, "#050613");
  gradient.addColorStop(1, "#02030a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  for (let i = 0; i < 260; i++) {
    const x = (Math.sin(i * 91.17) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 43.71) * 0.5 + 0.5) * height;
    const twinkle = 0.35 + Math.sin(time * 0.03 + i) * 0.25;
    ctx.globalAlpha = Math.max(0.08, twinkle);
    ctx.fillStyle = i % 17 === 0 ? "#c8fff4" : "#ffffff";
    ctx.fillRect(x, y, i % 9 === 0 ? 2 : 1, i % 9 === 0 ? 2 : 1);
  }
  ctx.restore();
}

function drawGalaxyClouds(visibleIds, context) {
  const visibleNodesByGalaxy = new Map();
  for (const node of nodes) {
    if (!visibleIds.has(node.id)) continue;
    visibleNodesByGalaxy.set(node.galaxy, (visibleNodesByGalaxy.get(node.galaxy) || 0) + 1);
  }

  for (const galaxy of galaxies) {
    const visibleCount = visibleNodesByGalaxy.get(galaxy.name) || 0;
    const isActive = activeGroup === "all" || activeGroup === galaxy.name;
    const isSelectedGalaxy = context?.galaxy === galaxy.name;
    const isDistantGalaxy = context && !isSelectedGalaxy;
    const screen = rotatePoint(galaxy);
    const radius = galaxy.radius * Math.max(0.35, screen.scale);
    const alpha = visibleCount ? (isSelectedGalaxy ? 0.32 : isDistantGalaxy ? 0.055 : isActive ? 0.22 : 0.1) : 0.035;
    const focusPulse = activeGroup === galaxy.name || isSelectedGalaxy ? 1 + Math.sin(time * 0.06) * 0.035 : 1;

    ctx.save();
    ctx.globalAlpha = alpha;
    const gradient = ctx.createRadialGradient(screen.x, screen.y, 0, screen.x, screen.y, radius);
    gradient.addColorStop(0, `${galaxy.color}55`);
    gradient.addColorStop(0.48, `${galaxy.color}18`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(
      screen.x,
      screen.y,
      radius * 1.36 * focusPulse,
      radius * 0.78 * focusPulse,
      Math.sin(time * 0.004 + galaxy.x) * 0.35,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    ctx.globalAlpha = isSelectedGalaxy ? 0.82 : isDistantGalaxy ? 0.16 : activeGroup === galaxy.name ? 0.72 : visibleCount ? 0.42 : 0.12;
    ctx.strokeStyle = galaxy.color;
    ctx.lineWidth = isSelectedGalaxy ? 2.8 : activeGroup === galaxy.name ? 2.4 : isActive ? 1.4 : 0.8;
    ctx.beginPath();
    ctx.ellipse(
      screen.x,
      screen.y,
      radius * 1.42 * focusPulse,
      radius * 0.82 * focusPulse,
      Math.sin(time * 0.004 + galaxy.x) * 0.35,
      0,
      Math.PI * 2,
    );
    ctx.stroke();

    if (showLabels && radius > 34 && visibleCount) {
      ctx.globalAlpha = isSelectedGalaxy ? 0.92 : isDistantGalaxy ? 0.24 : isActive ? 0.86 : 0.48;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#000";
      ctx.fillStyle = "#eef3ff";
      ctx.font = `${Math.max(12, Math.min(18, 13 * screen.scale + 4))}px Microsoft YaHei, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(`${galaxy.name} · ${visibleCount}`, screen.x, screen.y + radius * 0.92);
    }
    ctx.restore();
  }
}

function drawLink(a, b, visibleIds, context) {
  const isStrong = selectedId && (a.id === selectedId || b.id === selectedId);
  const aRelevant = nodeRelevance(a, context);
  const bRelevant = nodeRelevance(b, context);
  const sameSelectedGalaxy = context && a.galaxy === context.galaxy && b.galaxy === context.galaxy;
  const contextLink = !context || isStrong || sameSelectedGalaxy || aRelevant === "related" || bRelevant === "related";
  const alpha = visibleIds.has(a.id) && visibleIds.has(b.id) ? (isStrong ? 0.96 : contextLink ? 0.28 : 0.045) : 0.025;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineWidth = isStrong ? 2.6 : contextLink ? 1.05 : 0.7;
  ctx.strokeStyle = isStrong ? "#fff4bd" : contextLink ? "rgba(218, 229, 255, 0.72)" : "rgba(218, 229, 255, 0.38)";
  ctx.beginPath();
  const midX = (a.screen.x + b.screen.x) / 2 + Math.sin(time * 0.012 + a.x) * 18;
  const midY = (a.screen.y + b.screen.y) / 2 + Math.cos(time * 0.012 + b.y) * 18;
  ctx.moveTo(a.screen.x, a.screen.y);
  ctx.quadraticCurveTo(midX, midY, b.screen.x, b.screen.y);
  ctx.stroke();
  ctx.restore();
}

function drawNode(node, visibleIds, context) {
  const visible = visibleIds.has(node.id);
  const isSelected = node.id === selectedId;
  const isLearned = learned.has(node.id);
  const relevance = nodeRelevance(node, context);
  const selectAge = isSelected ? Math.max(0, time - selectedAt) : 999;
  const entrance = isSelected ? 1 + Math.max(0, 1 - selectAge / 38) * 1.15 : 1;
  const selectedPulse = isSelected ? 1 + Math.sin(time * 0.13) * 0.12 : 1;
  const relationScale = relevance === "related" ? 1.24 : relevance === "same-galaxy" ? 1.04 : relevance === "distant" ? 0.82 : 1;
  const rawSize = node.radius * node.screen.scale * (isSelected ? 2.25 : 1) * relationScale * entrance * selectedPulse;
  const size = isSelected ? Math.min(rawSize, 48) : rawSize;
  const glow = isSelected ? 54 : relevance === "related" ? 28 : isLearned ? 24 : 14;
  const alpha = !visible ? 0.08 : relevance === "distant" ? 0.14 : relevance === "same-galaxy" ? 0.72 : 1;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(node.screen.x, node.screen.y);

  const pulse = Math.sin(time * 0.045 + node.x) * 0.08 + 1;
  const radius = Math.max(3, size * pulse);

  if (isSelected) {
    ctx.save();
    ctx.globalAlpha = visible ? 0.92 : 0.32;
    const markerRadius = Math.min(Math.max(radius, 16), 44);
    ctx.shadowBlur = 24;
    ctx.shadowColor = "#7dfff2";
    ctx.strokeStyle = "#fff4bd";
    ctx.lineWidth = Math.min(3.2, Math.max(1.8, 2.4 * node.screen.scale));
    for (let i = 0; i < 4; i++) {
      const ringRadius = markerRadius * (1.45 + i * 0.32 + Math.sin(time * 0.085 + i) * 0.08);
      ctx.beginPath();
      ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = "#7dfff2";
    ctx.setLineDash([7, 7]);
    ctx.lineWidth = Math.min(2.2, Math.max(1.2, 1.55 * node.screen.scale));
    ctx.beginPath();
    ctx.arc(0, 0, markerRadius * (2.75 + Math.sin(time * 0.06) * 0.12), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if (relevance === "related") {
    ctx.save();
    ctx.globalAlpha = 0.46;
    ctx.strokeStyle = "#7dfff2";
    ctx.lineWidth = Math.max(1, 1.3 * node.screen.scale);
    ctx.beginPath();
    ctx.arc(0, 0, radius * 2.15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  const aura = ctx.createRadialGradient(0, 0, 0, 0, 0, radius + glow);
  aura.addColorStop(0, node.color);
  aura.addColorStop(0.22, node.color);
  aura.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, radius + glow, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = isSelected ? 42 : relevance === "related" ? 24 : 16;
  ctx.shadowColor = isSelected ? "#fff4bd" : relevance === "related" ? "#7dfff2" : node.color;
  ctx.fillStyle = isSelected ? "#fff7cf" : isLearned ? "#ffffff" : node.color;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  if (node.style === "ring" || node.style === "core") {
    ctx.shadowBlur = 0;
    ctx.strokeStyle = isSelected ? "#ffffff" : node.color;
    ctx.lineWidth = isSelected ? 2.4 : 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.min(radius * 1.9, 78), Math.min(radius * 0.62, 25), -0.35, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (node.style === "nebula" || node.style === "core") {
    ctx.shadowBlur = 0;
    ctx.strokeStyle = isSelected ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.65)";
    ctx.lineWidth = isSelected ? 1.8 : 1;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        radius * (1.4 + i * 0.22),
        radius * (0.55 + i * 0.13),
        time * 0.01 + i * 0.8,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
  }

  if (showLabels && visible && (!context || isSelected || relevance === "related" || relevance === "same-galaxy")) {
    ctx.shadowBlur = 7;
    ctx.shadowColor = "#000";
    ctx.fillStyle = isSelected ? "#ffffff" : "rgba(245, 247, 255, 0.9)";
    ctx.font = `${Math.min(isSelected ? 26 : 18, Math.max(isSelected ? 16 : 11, (isSelected ? 18 : 13) * node.screen.scale))}px Microsoft YaHei, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(node.word, 0, -radius - 10);
  }
  ctx.restore();
}

function render() {
  time += 1;
  easeCamera();
  drawBackground();
  const visibleIds = activeWords();
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const context = selectedContext();

  for (const node of nodes) {
    node.screen = rotatePoint(node);
  }

  drawGalaxyClouds(visibleIds, context);

  const sortedLinks = links
    .map((link) => [nodeById.get(link.source), nodeById.get(link.target)])
    .filter(([a, b]) => a && b)
    .sort((pairA, pairB) => pairA[0].screen.scale + pairA[1].screen.scale - pairB[0].screen.scale - pairB[1].screen.scale);
  for (const [a, b] of sortedLinks) drawLink(a, b, visibleIds, context);

  const sortedNodes = [...nodes].sort((a, b) => a.screen.scale - b.screen.scale);
  for (const node of sortedNodes) {
    if (node.id !== selectedId) drawNode(node, visibleIds, context);
  }
  const selectedNode = sortedNodes.find((node) => node.id === selectedId);
  if (selectedNode) {
    drawNode(selectedNode, visibleIds, context);
  }

  requestAnimationFrame(render);
}

function setSelected(id) {
  const word = words.find((item) => item.id === id) || words[0];
  if (!word) {
    selectedId = "";
    detailPanel.hidden = true;
    speakButton.disabled = true;
    renderGroups();
    return;
  }
  selectedId = word.id;
  const selectedGroup = groupNameForWord(word);
  if (selectedGroup) expandedGroups.add(selectedGroup);
  selectedAt = time;
  focusWord(word.id);
  detailUnit.textContent = word.unit;
  detailWord.textContent = word.word;
  detailPhonetic.textContent = word.phonetic || "";
  speakButton.disabled = false;
  speakButton.title = "播放美式发音";
  detailMeaning.textContent = word.meaning_full || word.meaning || "";
  morphemes.innerHTML = "";
  for (const part of word.parts || []) {
    const span = document.createElement("span");
    span.className = "morpheme";
    span.textContent = part;
    morphemes.appendChild(span);
  }
  memoryText.textContent = word.memory || "这里可以放红宝书原词条之外的个人记忆故事。";
  const hasExample = Boolean(word.example_en || word.example_zh);
  exampleSection.hidden = !hasExample;
  exampleEn.textContent = word.example_en || "";
  exampleZh.textContent = word.example_zh || "";
  speakExampleButton.disabled = !word.example_en;
  speakExampleButton.textContent = "读例句";
  relatedWords.innerHTML = "";
  for (const idOrWord of word.related || []) {
    const related = words.find((item) => item.id === idOrWord);
    if (!related) continue;
    const button = document.createElement("button");
    button.className = "chip";
    button.type = "button";
    button.textContent = related.word;
    button.addEventListener("click", () => setSelected(related.id));
    relatedWords.appendChild(button);
  }
  learnButton.textContent = learned.has(word.id) ? "已点亮" : "标记已学";
  detailPanel.hidden = viewMode === "study";
  renderGroups();
}

function updateStats() {
  const learnedTotal = words.filter((word) => learned.has(word.id)).length;
  learnedCount.textContent = `${learnedTotal}/${words.length}`;
  statusText.textContent = `Universe LAB | ${words.length} words | ${links.length} connections | ${learnedTotal} learned`;
}

function renderGroups() {
  updateStats();
  const groupKey = currentGroupKey();
  const query = searchInput.value.trim().toLowerCase();
  const groups = new Map();
  for (const word of words) {
    if (!matchesQuery(word, query)) continue;
    const value = groupValueFor(word, groupKey);
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(word);
  }

  groupList.innerHTML = "";
  const allButton = document.createElement("button");
  allButton.className = `word-row ${activeGroup === "all" ? "active" : ""}`;
  allButton.type = "button";
  allButton.innerHTML = `<span class="dot" style="color:${palette.white}"></span><span>全部星系</span><small>${words.length}</small>`;
  allButton.addEventListener("click", () => {
    activeGroup = "all";
    focusAll();
    renderGroups();
  });
  groupList.appendChild(allButton);

  const sortedGroups = [...groups.entries()].sort(([a], [b]) => {
    const unitA = a.match(/Unit\s+(\d+)/i)?.[1];
    const unitB = b.match(/Unit\s+(\d+)/i)?.[1];
    if (unitA && unitB) return Number(unitA) - Number(unitB);
    return a.localeCompare(b);
  });

  const appendSubgroupTitle = (group, label, count) => {
    const title = document.createElement("div");
    title.className = "subgroup-title";
    title.innerHTML = `<span>${label}</span><small>${count}</small>`;
    group.appendChild(title);
  };

  const appendWordRow = (group, word, variant = "primary") => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = `word-row ${variant === "related" ? "related-row" : ""} ${selectedId === word.id ? "active" : ""}`;
    const meta = variant === "related" ? normalizeUnitName(word.unit) : word.root;
    row.innerHTML = `<span class="dot" style="color:${learned.has(word.id) ? "#fff" : colorFor(word.word)}"></span><span>${word.word}</span><small>${meta}</small>`;
    row.addEventListener("click", () => setSelected(word.id));
    group.appendChild(row);
  };

  const selectedWord = words.find((item) => item.id === selectedId);
  const selectedGroup = groupNameForWord(selectedWord);
  if (!didBootstrapExpandedGroups && selectedGroup) {
    expandedGroups.add(selectedGroup);
    didBootstrapExpandedGroups = true;
  }

  for (const [groupName, items] of sortedGroups) {
    const group = document.createElement("div");
    const isExpanded = Boolean(query) || expandedGroups.has(groupName);
    group.className = `group ${isExpanded ? "expanded" : "collapsed"}`;
    const primaryIds = new Set(items.map((item) => item.id));
    const relatedItems = viewMode === "units" ? wordsRelatedTo(items, primaryIds, query) : [];
    const totalInGroup = items.length + relatedItems.length;
    const learnedInGroup = items.filter((item) => learned.has(item.id)).length;
    group.innerHTML = `<button class="group-header" type="button" aria-expanded="${isExpanded}"><span class="group-title"><span class="group-caret"></span><span>${groupName}</span></span><small>${learnedInGroup}/${items.length}</small></button>`;
    const header = group.querySelector(".group-header");
    header.addEventListener("click", () => {
      if (expandedGroups.has(groupName) && !query) expandedGroups.delete(groupName);
      else expandedGroups.add(groupName);
      activeGroup = groupName;
      focusGalaxy(activeGroup);
      renderGroups();
    });

    if (viewMode === "units") {
      appendSubgroupTitle(group, "本单元词", items.length);
    }
    for (const word of items) {
      appendWordRow(group, word);
    }
    if (relatedItems.length) {
      appendSubgroupTitle(group, "关联词", relatedItems.length);
      for (const word of relatedItems) appendWordRow(group, word, "related");
    }
    group.dataset.total = String(totalInGroup);
    groupList.appendChild(group);
  }
}

function findNodeAt(x, y) {
  const visibleIds = activeWords();
  return [...nodes]
    .filter((node) => visibleIds.has(node.id))
    .sort((a, b) => b.screen.scale - a.screen.scale)
    .find((node) => {
      const dx = node.screen.x - x;
      const dy = node.screen.y - y;
      return Math.hypot(dx, dy) < Math.max(14, node.radius * node.screen.scale + 8);
    });
}

function findGalaxyAt(x, y) {
  const visibleIds = activeWords();
  const visibleNodesByGalaxy = new Map();
  for (const node of nodes) {
    if (!visibleIds.has(node.id)) continue;
    visibleNodesByGalaxy.set(node.galaxy, (visibleNodesByGalaxy.get(node.galaxy) || 0) + 1);
  }

  return [...galaxies]
    .map((galaxy) => {
      const visibleCount = visibleNodesByGalaxy.get(galaxy.name) || 0;
      if (!visibleCount) return null;
      const screen = rotatePoint(galaxy);
      const radius = galaxy.radius * Math.max(0.35, screen.scale);
      const angle = Math.sin(time * 0.004 + galaxy.x) * 0.35;
      const cos = Math.cos(-angle);
      const sin = Math.sin(-angle);
      const dx = x - screen.x;
      const dy = y - screen.y;
      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;
      const axisX = radius * 1.52;
      const axisY = radius * 0.92;
      const score = (rx * rx) / (axisX * axisX) + (ry * ry) / (axisY * axisY);
      return score <= 1 ? { galaxy, score, z: screen.z } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score || b.z - a.z)[0]?.galaxy;
}

function parseCsvLine(line) {
  const cols = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index++) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cols.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cols.push(current);
  return cols;
}

function parseCsvRows(text) {
  const rows = [];
  let current = "";
  let quoted = false;
  const normalized = text.replace(/^\uFEFF/, "");
  for (let index = 0; index < normalized.length; index++) {
    const char = normalized[index];
    const next = normalized[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '""';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
      current += char;
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (current.trim()) rows.push(parseCsvLine(current));
      current = "";
      if (char === "\r" && next === "\n") index += 1;
    } else {
      current += char;
    }
  }
  if (current.trim()) rows.push(parseCsvLine(current));
  return rows;
}

function parseCsv(text) {
  const rows = parseCsvRows(text);
  if (!rows.length) return [];
  const header = rows.shift().map((item) => item.trim().toLowerCase());
  const read = (cols, name, fallback = "") => {
    const index = header.indexOf(name);
    return index >= 0 ? (cols[index] || "").trim() : fallback;
  };
  return rows
    .map((cols, index) => {
      const word = read(cols, "word").replace(/^\uFEFF/, "").trim();
      if (!word) return null;
      const related = read(cols, "related")
        .split(/[;|]/)
        .map((item) => item.trim())
        .filter(Boolean);
      return normalizeWordRecord({
        id: normalizeWordKey(word),
        word,
        phonetic: read(cols, "phonetic"),
        meaning: read(cols, "meaning"),
        meaning_full: read(cols, "meaning_full", read(cols, "full_meaning")),
        unit: read(cols, "unit", `Unit ${String(Math.floor(index / 20) + 1).padStart(2, "0")}`),
        theme: read(cols, "theme", "红宝书导入"),
        root: read(cols, "root", word.slice(0, 5).toLowerCase()),
        parts: read(cols, "parts", word).split(/[;|]/).filter(Boolean),
        memory: read(cols, "memory", "导入后可在 CSV 的 memory 列补充个人记忆故事。"),
        related,
        example_en: read(cols, "example_en"),
        example_zh: read(cols, "example_zh"),
        pronunciation_text: read(cols, "pronunciation_text"),
        style: index % 9 === 0 ? "core" : index % 4 === 0 ? "ring" : index % 5 === 0 ? "nebula" : "planet",
      }, index);
    })
    .filter(Boolean);
}

function decodeCsvBuffer(buffer) {
  const bytes = new Uint8Array(buffer);
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder("utf-8").decode(bytes);
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder("gb18030").decode(bytes);
  }
}

function mergeWords(existing, incoming) {
  const merged = new Map();
  const order = [];
  for (const word of [...existing, ...incoming]) {
    const normalized = normalizeWordRecord(word, order.length);
    if (!normalized) continue;
    const key = normalizeWordKey(normalized.word);
    if (!merged.has(key)) order.push(key);
    const previous = merged.get(key) || {};
    merged.set(key, { ...previous, ...normalized, id: key });
  }
  return order.map((key) => merged.get(key));
}

async function persistImportOnServer(text) {
  if (!["http:", "https:"].includes(window.location.protocol)) return false;
  try {
    const response = await fetch("./api/merge-csv", {
      method: "POST",
      headers: { "Content-Type": "text/csv;charset=utf-8" },
      body: text,
    });
    if (!response.ok) throw new Error("merge failed");
    const result = await response.json();
    statusText.textContent = `Universe LAB | ${result.total} words | saved to all-words.csv`;
    return true;
  } catch {
    return false;
  }
}

async function importCsv(text) {
  const imported = parseCsv(text);
  if (!imported.length) return;
  words = mergeWords(words, imported);
  saveWordBank();
  activeGroup = "all";
  selectedId = imported[0].id || words[0].id;
  buildGraph();
  focusAll();
  setSelected(selectedId);
  const saved = await persistImportOnServer(text);
  if (!saved) exportWordBank("all-words.csv");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function exportWordBank(filename = "all-words.csv") {
  words = mergeWords([], words);
  const header = ["word", "phonetic", "meaning", "meaning_full", "unit", "theme", "root", "parts", "memory", "related", "example_en", "example_zh", "pronunciation_text"];
  const rows = words.map((word) =>
    [
      word.word,
      word.phonetic,
      word.meaning,
      word.meaning_full || "",
      word.unit,
      word.theme,
      word.root,
      (word.parts || []).join("|"),
      word.memory,
      (word.related || []).join("|"),
      word.example_en || "",
      word.example_zh || "",
      word.pronunciation_text || "",
    ]
      .map(csvEscape)
      .join(","),
  );
  const blob = new Blob([[header.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function fullMeaningFor(word) {
  return String(word?.meaning_full || word?.meaning || "").trim();
}

function compactMeaningFor(word, maxLength = 92) {
  const text = fullMeaningFor(word);
  if (!text) return "";
  const normalized = text
    .replace(/\s+/g, " ")
    .replace(/\uFF1B\s*/g, "\uFF1B")
    .replace(/;\s*/g, "\uFF1B")
    .trim();
  if (normalized.length <= maxLength) return normalized;
  const parts = normalized.split(/(?=\b(?:n|v|vt|vi|adj|adv|prep|conj|pron)\.)|[\u3002]/i).filter(Boolean);
  let result = "";
  for (const part of parts) {
    const next = result ? `${result} ${part.trim()}` : part.trim();
    if (next.length > maxLength && result) break;
    result = next;
  }
  if (!result) result = normalized.slice(0, maxLength - 1);
  return `${result.replace(/[\uFF1B;,\s]+$/, "")}\u2026`;
}
function shuffleItems(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function wrongOptionsFor(card, count = 3) {
  return shuffleItems(words.filter((word) => word.id !== card.id && fullMeaningFor(word)))
    .slice(0, count)
    .map((word) => ({ id: word.id, label: compactMeaningFor(word), correct: false }));
}

function wrongWordOptionsFor(card, count = 3) {
  return shuffleItems(words.filter((word) => word.id !== card.id && word.word))
    .slice(0, count)
    .map((word) => ({ id: word.id, label: word.word, correct: false }));
}

function normalizedSpelling(text) {
  return String(text || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
}

function studyModeText(mode) {
  return {
    flip: "翻卡",
    word_to_meaning: "词辨意",
    meaning_to_word: "意辨词",
    spelling: "拼写检查",
    audio_to_word: "读音辨词",
  }[mode] || "翻卡";
}

function setStudyMode(mode) {
  selectedStudyMode = mode || "flip";
  studyModePicker.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === selectedStudyMode);
  });
}

async function saveStudySettingsToServer() {
  if (!["http:", "https:"].includes(window.location.protocol)) return;
  await fetch("./api/study/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dailyNew: Number(dailyNewInput.value) || 30,
      dailyReviewLimit: Number(dailyReviewInput.value) || 200,
      questionModes: [selectedStudyMode],
    }),
  }).catch(() => {});
}

function renderStudyStats(plan) {
  if (!plan) {
    studyStats.textContent = "今日队列尚未加载";
    return;
  }
  studyStats.textContent = `队列 ${studyQueue.length} 词 | 到期复习 ${plan.stats.dueReview} | 今日新词剩余 ${plan.stats.dailyNewLeft} | 范围 ${plan.stats.totalInScope} 词`;
}

async function loadStudyPlan() {
  if (!["http:", "https:"].includes(window.location.protocol)) {
    studyStats.textContent = "学习模式需要通过本地服务打开";
    return;
  }
  const response = await fetch("./api/study/today", { cache: "no-store" });
  const plan = await response.json();
  if (!response.ok) throw new Error(plan.error || "学习计划加载失败");
  dailyNewInput.value = plan.settings.dailyNew;
  dailyReviewInput.value = plan.settings.dailyReviewLimit;
  setStudyMode(plan.settings.questionModes?.[0] || "flip");
  studyQueue = plan.queue || [];
  studyPlanReady = plan;
  studySessionStarted = false;
  renderStudyStats(plan);
  renderStudyHome();
}

function renderStudyHome() {
  currentStudyCard = null;
  studyOptions.innerHTML = "";
  studyAnswer.hidden = true;
  studyAnswer.innerHTML = "";
  showStudyAnswer.disabled = true;
  ratingButtons.forEach((button) => (button.disabled = true));
  startStudy.textContent = studyQueue.length ? "开始学习" : "刷新计划";
  studyModeLabel.textContent = "READY";
  studyPrompt.textContent = studyQueue.length ? "准备开始今日学习" : "今日没有待学卡片";
  studySubPrompt.textContent = studyQueue.length ? `今天队列里有 ${studyQueue.length} 张卡片，点击开始后再播放第一个单词。` : "可以调整每日目标或导入更多单词。";
}

function startStudySession() {
  if (!studyPlanReady) {
    loadStudyPlan()
      .then(() => startStudySession())
      .catch((error) => (studyStats.textContent = error.message));
    return;
  }
  studySessionStarted = true;
  startStudy.textContent = "刷新计划";
  renderStudyCard(studyQueue[0] || null);
}

function showStudyPanel() {
  studyPanel.hidden = false;
  detailPanel.hidden = true;
  loadStudyPlan().catch((error) => {
    studyStats.textContent = error.message;
  });
}

function hideStudyPanel() {
  studyPanel.hidden = true;
  studySessionStarted = false;
  currentStudyCard = null;
  window.speechSynthesis?.cancel();
}

function renderStudyAnswer(card) {
  if (!card) {
    studyAnswer.hidden = true;
    studyAnswer.innerHTML = "";
    return;
  }
  studyAnswer.hidden = false;
  studyAnswer.innerHTML = `
    <strong>${card.word}</strong> <span>${card.phonetic || ""}</span>
    <p>${fullMeaningFor(card)}</p>
    ${card.memory ? `<p>${card.memory}</p>` : ""}
    ${card.example_en ? `<p>${card.example_en}</p>` : ""}
  `;
}

function renderStudyCard(card) {
  currentStudyCard = card;
  currentStudyStartedAt = Date.now();
  studyOptions.innerHTML = "";
  studyAnswer.hidden = true;
  studyAnswer.innerHTML = "";
  ratingButtons.forEach((button) => (button.disabled = !card));
  showStudyAnswer.disabled = !card;

  if (!card) {
    studyModeLabel.textContent = "DONE";
    studyPrompt.textContent = "\u4eca\u65e5\u5b66\u4e60\u5b8c\u6210";
    studySubPrompt.textContent = "\u53ef\u4ee5\u56de\u5230\u661f\u56fe\u81ea\u7531\u590d\u4e60\uff0c\u6216\u8c03\u6574\u6bcf\u65e5\u76ee\u6807\u540e\u5237\u65b0\u3002";
    startStudy.textContent = "\u5237\u65b0\u8ba1\u5212";
    return;
  }

  const markChoice = (button, correct, correctLabel) => {
    button.classList.add(correct ? "correct" : "wrong");
    if (!correct && correctLabel) {
      const correctButton = [...studyOptions.querySelectorAll("button")].find((item) => item.textContent === correctLabel);
      correctButton?.classList.add("correct");
    }
    renderStudyAnswer(card);
    submitStudyRating(correct ? 2 : 0, correct);
  };

  setSelected(card.id);
  if (viewMode === "study") detailPanel.hidden = true;
  studyModeLabel.textContent = `${card.study.source === "new" ? "\u65b0\u8bcd" : "\u590d\u4e60"} ? ${studyModeText(card.study.mode)}`;

  if (card.study.mode === "word_to_meaning") {
    studyPrompt.textContent = card.word;
    studySubPrompt.textContent = card.phonetic || "\u9009\u62e9\u6700\u63a5\u8fd1\u7684\u4e2d\u6587\u91ca\u4e49";
    const correctLabel = compactMeaningFor(card);
    const options = shuffleItems([{ id: card.id, label: correctLabel, correct: true }, ...wrongOptionsFor(card)]);
    for (const option of options) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option.label;
      button.addEventListener("click", () => markChoice(button, option.correct, correctLabel));
      studyOptions.appendChild(button);
    }
  } else if (card.study.mode === "meaning_to_word") {
    studyPrompt.textContent = compactMeaningFor(card, 120);
    studySubPrompt.textContent = "\u9009\u62e9\u5bf9\u5e94\u7684\u82f1\u6587\u5355\u8bcd";
    const options = shuffleItems([{ id: card.id, label: card.word, correct: true }, ...wrongWordOptionsFor(card)]);
    for (const option of options) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option.label;
      button.addEventListener("click", () => markChoice(button, option.correct, card.word));
      studyOptions.appendChild(button);
    }
  } else if (card.study.mode === "audio_to_word") {
    studyPrompt.textContent = "\u542c\u8bfb\u97f3\uff0c\u9009\u62e9\u5355\u8bcd";
    studySubPrompt.textContent = "\u5982\u679c\u6ca1\u542c\u6e05\uff0c\u53ef\u4ee5\u70b9\u51fb\u4e0b\u9762\u7684\u64ad\u653e\u6309\u94ae\u91cd\u542c\u3002";
    const replay = document.createElement("button");
    replay.type = "button";
    replay.className = "study-replay";
    replay.textContent = "\u64ad\u653e\u8bfb\u97f3";
    replay.addEventListener("click", () => speakWord(card.word));
    studyOptions.appendChild(replay);
    const options = shuffleItems([{ id: card.id, label: card.word, correct: true }, ...wrongWordOptionsFor(card)]);
    for (const option of options) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option.label;
      button.addEventListener("click", () => markChoice(button, option.correct, card.word));
      studyOptions.appendChild(button);
    }
  } else if (card.study.mode === "spelling") {
    studyPrompt.textContent = compactMeaningFor(card, 120);
    studySubPrompt.textContent = card.phonetic || "\u8f93\u5165\u5bf9\u5e94\u82f1\u6587\u5355\u8bcd";
    const form = document.createElement("form");
    form.className = "spelling-form";
    form.innerHTML = '<input autocomplete="off" spellcheck="false" placeholder="??????" /><button type="submit">??</button>';
    const input = form.querySelector("input");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const correct = normalizedSpelling(input.value) === normalizedSpelling(card.word);
      input.classList.toggle("correct", correct);
      input.classList.toggle("wrong", !correct);
      renderStudyAnswer(card);
      submitStudyRating(correct ? 2 : 0, correct);
    });
    studyOptions.appendChild(form);
    window.setTimeout(() => input.focus(), 80);
  } else {
    studyPrompt.textContent = card.word;
    studySubPrompt.textContent = card.phonetic || "\u5148\u56de\u5fc6\u4e2d\u6587\u91ca\u4e49\uff0c\u518d\u663e\u793a\u7b54\u6848\u5e76\u81ea\u8bc4\u3002";
  }

  if (studySessionStarted) {
    window.setTimeout(() => {
      if (currentStudyCard?.id === card.id && studySessionStarted && !studyPanel.hidden) speakWord(card.word);
    }, 260);
  }
}

async function submitStudyRating(rating, explicitCorrect = null) {
  if (!currentStudyCard) return;
  const card = currentStudyCard;
  const responseMs = Date.now() - currentStudyStartedAt;
  await fetch("./api/study/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      word: card.id,
      rating,
      mode: card.study.mode,
      source: card.study.source,
      correct: explicitCorrect,
      responseMs,
    }),
  }).catch(() => {});
  studyQueue = studyQueue.filter((item) => item.id !== card.id);
  renderStudyStats({ stats: { dueReview: 0, dailyNewLeft: Math.max(0, studyQueue.filter((item) => item.study.source === "new").length), totalInScope: words.length } });
  renderStudyCard(studyQueue[0] || null);
}

window.addEventListener("resize", resize);
canvas.addEventListener("pointerdown", (event) => {
  isDragging = true;
  lastPointer = { x: event.clientX, y: event.clientY };
  dragStart = { x: event.clientX, y: event.clientY };
});
window.addEventListener("pointerup", (event) => {
  if (!isDragging) return;
  const moved = Math.hypot(event.clientX - dragStart.x, event.clientY - dragStart.y);
  isDragging = false;
  if (moved < 5) {
    const node = findNodeAt(event.clientX, event.clientY);
    if (node) {
      setSelected(node.id);
      return;
    }
    const galaxy = findGalaxyAt(event.clientX, event.clientY);
    if (galaxy) {
      activeGroup = activeGroup === galaxy.name ? "all" : galaxy.name;
      if (activeGroup === "all") focusAll();
      else focusGalaxy(activeGroup);
      renderGroups();
    }
  }
});
window.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY };
  if (!isDragging) return;
  const dx = event.clientX - lastPointer.x;
  const dy = event.clientY - lastPointer.y;
  rotationY += dx * 0.004;
  rotationX += dy * 0.004;
  rotationX = Math.max(-1.2, Math.min(1.2, rotationX));
  lastPointer = { x: event.clientX, y: event.clientY };
});
canvas.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    targetZoom *= event.deltaY > 0 ? 0.92 : 1.08;
    targetZoom = Math.max(0.45, Math.min(3.25, targetZoom));
  },
  { passive: false },
);

document.querySelectorAll(".segmented button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".segmented button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    viewMode = button.dataset.view;
    activeGroup = "all";
    expandedGroups.clear();
    didBootstrapExpandedGroups = false;
    buildGraph();
    focusAll();
    renderGroups();
    if (viewMode === "study") showStudyPanel();
    else hideStudyPanel();
  });
});

searchInput.addEventListener("input", renderGroups);
closeStudy.addEventListener("click", hideStudyPanel);
startStudy.addEventListener("click", () => {
  if (studySessionStarted) {
    loadStudyPlan().catch((error) => (studyStats.textContent = error.message));
  } else {
    startStudySession();
  }
});
saveStudySettings.addEventListener("click", async () => {
  await saveStudySettingsToServer();
  await loadStudyPlan().catch((error) => (studyStats.textContent = error.message));
});
studyModePicker.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", async () => {
    setStudyMode(button.dataset.mode);
    await saveStudySettingsToServer();
    await loadStudyPlan().catch((error) => (studyStats.textContent = error.message));
  });
});
showStudyAnswer.addEventListener("click", () => renderStudyAnswer(currentStudyCard));
ratingButtons.forEach((button) => {
  button.addEventListener("click", () => submitStudyRating(Number(button.dataset.rating)));
});
learnButton.addEventListener("click", () => {
  if (learned.has(selectedId)) learned.delete(selectedId);
  else learned.add(selectedId);
  const isLearned = learned.has(selectedId);
  if (["http:", "https:"].includes(window.location.protocol)) {
    fetch("./api/learned", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: selectedId, learned: isLearned }),
    }).catch(() => {});
  } else {
    localStorage.setItem(storageKey, JSON.stringify([...learned]));
  }
  setSelected(selectedId);
});
document.getElementById("closeDetail").addEventListener("click", () => {
  detailPanel.hidden = true;
});
document.getElementById("toggleLabels").addEventListener("click", () => {
  showLabels = !showLabels;
});
document.getElementById("zoomIn").addEventListener("click", () => {
  targetZoom = Math.min(3.25, targetZoom * 1.15);
});
document.getElementById("zoomOut").addEventListener("click", () => {
  targetZoom = Math.max(0.45, targetZoom / 1.15);
});
document.getElementById("homeView").addEventListener("click", () => {
  focusAll();
  rotationX = -0.15;
  rotationY = 0.35;
  activeGroup = "all";
  renderGroups();
});
document.getElementById("focusSelected").addEventListener("click", () => {
  const node = nodes.find((item) => item.id === selectedId);
  if (!node) return;
  focusWord(selectedId);
});
document.getElementById("shuffleView").addEventListener("click", () => {
  words = words.map((word, index) => ({ ...word, style: ["planet", "ring", "star", "nebula", "core"][index % 5] }));
  buildGraph();
});
document.getElementById("resetData").addEventListener("click", () => {
  words = structuredClone(defaultWords);
  learned = new Set();
  localStorage.removeItem(storageKey);
  saveWordBank();
  activeGroup = "all";
  selectedId = "radiat";
  buildGraph();
  focusAll();
  setSelected(selectedId);
});
document.getElementById("clearBank").addEventListener("click", async () => {
  localStorage.removeItem(wordBankKey);
  localStorage.removeItem(wordBankVersionKey);
  localStorage.removeItem(storageKey);
  learned = new Set();
  if (["http:", "https:"].includes(window.location.protocol)) {
    await fetch("./api/progress", { method: "DELETE" }).catch(() => {});
    await fetch("./api/file-cache", { method: "DELETE" }).catch(() => {});
  }
  words = [];
  await loadAllWordsFile();
  activeGroup = "all";
  selectedId = words[0]?.id || "";
  buildGraph();
  focusAll();
  setSelected(selectedId);
});
document.getElementById("exportData").addEventListener("click", () => exportWordBank("all-words.csv"));
csvInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  await importCsv(decodeCsvBuffer(await file.arrayBuffer()));
  event.target.value = "";
});
speakExampleButton.addEventListener("click", async () => {
  const sentence = exampleEn.textContent.trim();
  if (!sentence) return;
  const provider = currentTtsProvider();
  localStorage.setItem(ttsProviderKey, provider);
  speakExampleButton.disabled = true;
  speakExampleButton.textContent = "生成中";
  try {
    if (["http:", "https:"].includes(window.location.protocol)) {
      const response = await fetch("./api/sentence-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sentence, provider }),
      });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || "No audio");
      speakExampleButton.textContent = result.cached ? "播放中" : "已缓存";
      await playAudioUrl(result.url);
    } else {
      speakWithSystemVoice(sentence);
    }
  } catch (error) {
    speakExampleButton.textContent = "系统朗读";
    speakWithSystemVoice(sentence);
  } finally {
    window.setTimeout(() => {
      speakExampleButton.disabled = false;
      speakExampleButton.textContent = "读例句";
    }, 500);
  }
});
setTtsProvider(localStorage.getItem(ttsProviderKey) || "qwen");
ttsProviderSelect.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    setTtsProvider(button.dataset.provider);
  });
});
speakButton.addEventListener("click", () => speakWord());
if ("speechSynthesis" in window) {
  chooseVoice();
  window.speechSynthesis.onvoiceschanged = chooseVoice;
}

async function init() {
  await loadAllWordsFile();
  loadSavedWordBank();
  resize();
  buildGraph();
  setSelected(selectedId);
  render();
}

init();
