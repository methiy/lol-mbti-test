import type { Hero } from '~/types'

export const heroes: Hero[] = [
  // ===== 德玛西亚 =====
  {
    id: 'garen', name: '盖伦', nameEn: 'Garen', title: '德玛西亚之力',
    regionId: 'demacia',
    vector: { chaos: 1, intuition: 2, bond: 8, conquest: 6, explore: 2, shadow: 1, agility: 2, ideal: 8 },
    description: '德玛西亚最坚定的守护者，用大剑和钢铁意志扞卫正义。',
    lore: '盖伦是无畏先锋的统领，他以身作则践行德玛西亚的信条。对他来说，保护弱者和维护秩序不是选择，而是与生俱来的使命。',
  },
  {
    id: 'lux', name: '拉克丝', nameEn: 'Lux', title: '光辉女郎',
    regionId: 'demacia',
    vector: { chaos: 4, intuition: 5, bond: 8, conquest: 2, explore: 6, shadow: 2, agility: 5, ideal: 9 },
    description: '天生拥有光魔法的少女，在秩序与自由之间寻找自己的道路。',
    lore: '拉克丝生于一个禁止魔法的国度，却天赋异禀。她用乐观和善良照亮身边的每一个人，也在暗中用自己的力量帮助那些被迫害的法师。',
  },
  {
    id: 'galio', name: '加里奥', nameEn: 'Galio', title: '正义巨像',
    regionId: 'demacia',
    vector: { chaos: 1, intuition: 3, bond: 9, conquest: 5, explore: 2, shadow: 1, agility: 2, ideal: 7 },
    description: '沉睡的石像巨人，只有在魔法出现时才能苏醒守护家园。',
    lore: '加里奥渴望战斗，因为只有战斗才能让他苏醒。他用巨大的石翼守护德玛西亚，对抗一切魔法威胁。他矛盾地爱着让他苏醒的魔法，又忠于消灭魔法的信条。',
  },

  // ===== 诺克萨斯 =====
  {
    id: 'darius', name: '德莱厄斯', nameEn: 'Darius', title: '诺克萨斯之手',
    regionId: 'noxus',
    vector: { chaos: 4, intuition: 3, bond: 5, conquest: 10, explore: 3, shadow: 5, agility: 2, ideal: 3 },
    description: '铁血统帅，用斧刃诠释力量即正义的诺克萨斯信条。',
    lore: '德莱厄斯从贫民窟中一路斩杀登顶，成为诺克萨斯最令人畏惧的将军。他信奉一个简单的道理：只有强者才配活着，而他，永远是最强的那个。',
  },
  {
    id: 'swain', name: '斯维因', nameEn: 'Swain', title: '诺克萨斯统领',
    regionId: 'noxus',
    vector: { chaos: 4, intuition: 5, bond: 4, conquest: 8, explore: 6, shadow: 8, agility: 7, ideal: 5 },
    description: '策略大师与暗黑权术家，用谋略而非蛮力统治帝国。',
    lore: '斯维因失去了一条手臂，却获得了恶魔之力。他用超凡的智慧和冷酷的算计将诺克萨斯带向新时代，在他的棋局中，每个人都是棋子。',
  },
  {
    id: 'katarina', name: '卡特琳娜', nameEn: 'Katarina', title: '不祥之刃',
    regionId: 'noxus',
    vector: { chaos: 7, intuition: 6, bond: 3, conquest: 8, explore: 5, shadow: 7, agility: 9, ideal: 2 },
    description: '致命的刺客，在刀锋的寒光中寻找自身的价值。',
    lore: '卡特琳娜是诺克萨斯最出色的刺客，快如闪电，狠如毒蛇。她不相信任何人，只相信手中的飞刀。在血与影中，她证明自己不只是父亲的工具。',
  },

  // ===== 艾欧尼亚 =====
  {
    id: 'yasuo', name: '亚索', nameEn: 'Yasuo', title: '疾风剑豪',
    regionId: 'ionia',
    vector: { chaos: 7, intuition: 8, bond: 3, conquest: 4, explore: 7, shadow: 4, agility: 9, ideal: 6 },
    description: '被冤枉的剑客，在流浪中寻找真相与救赎。',
    lore: '亚索背负弑师之名浪迹天涯。风是他唯一的伙伴，剑是他唯一的语言。在漫长的流浪中，他学会了放下执念，让风带走一切不属于自己的重量。',
  },
  {
    id: 'ahri', name: '阿狸', nameEn: 'Ahri', title: '九尾妖狐',
    regionId: 'ionia',
    vector: { chaos: 5, intuition: 9, bond: 5, conquest: 3, explore: 7, shadow: 5, agility: 8, ideal: 7 },
    description: '渴望成为人类的狐灵，在魅惑与真情之间挣扎。',
    lore: '阿狸拥有夺取灵魂的能力，但她内心渴望的是真正的人类情感。她游历四方，体验人间的喜怒哀乐，试图理解什么才是真正的"活着"。',
  },
  {
    id: 'shen', name: '慎', nameEn: 'Shen', title: '暮光之眼',
    regionId: 'ionia',
    vector: { chaos: 2, intuition: 7, bond: 7, conquest: 3, explore: 4, shadow: 4, agility: 6, ideal: 9 },
    description: '维护灵与物质世界平衡的守护者，责任重于一切。',
    lore: '慎是均衡教派的领袖，守护着物质世界与灵魂世界的平衡。他必须将个人情感搁置一旁，以无情的理性做出守护平衡的决定，哪怕这意味着牺牲所爱之人。',
  },

  // ===== 皮尔特沃夫 =====
  {
    id: 'jayce', name: '杰斯', nameEn: 'Jayce', title: '未来守护者',
    regionId: 'piltover',
    vector: { chaos: 3, intuition: 3, bond: 6, conquest: 5, explore: 8, shadow: 2, agility: 5, ideal: 7 },
    description: '天才发明家兼英雄，用科技之锤守护进步之城。',
    lore: '杰斯是皮尔特沃夫最杰出的发明家之一，他创造了能在锤与炮之间切换的海克斯科技武器。他既是科学家也是战士，相信技术进步能让世界变得更好。',
  },
  {
    id: 'caitlyn', name: '凯特琳', nameEn: 'Caitlyn', title: '皮城女警',
    regionId: 'piltover',
    vector: { chaos: 2, intuition: 2, bond: 6, conquest: 4, explore: 7, shadow: 3, agility: 5, ideal: 7 },
    description: '皮尔特沃夫最优秀的执法者，用理性和精准维护正义。',
    lore: '凯特琳是皮尔特沃夫的治安官，以超凡的洞察力和精准的射击闻名。她信奉法律和秩序，但也明白真正的正义有时需要深入黑暗的角落。',
  },
  {
    id: 'heimerdinger', name: '黑默丁格', nameEn: 'Heimerdinger', title: '大发明家',
    regionId: 'piltover',
    vector: { chaos: 3, intuition: 2, bond: 5, conquest: 2, explore: 10, shadow: 2, agility: 6, ideal: 8 },
    description: '约德尔族的天才科学家，对知识的追求永无止境。',
    lore: '黑默丁格是皮尔特沃夫科学院的教授，拥有无穷的好奇心和创造力。他相信科学能解答宇宙的一切奥秘，即使他的实验偶尔会把实验室炸上天。',
  },

  // ===== 祖安 =====
  {
    id: 'jinx', name: '金克丝', nameEn: 'Jinx', title: '暴走萝莉',
    regionId: 'zaun',
    vector: { chaos: 10, intuition: 7, bond: 3, conquest: 6, explore: 8, shadow: 6, agility: 8, ideal: 3 },
    description: '疯狂的破坏艺术家，在爆炸中找到生命的意义。',
    lore: '金克丝是祖安最臭名昭著的罪犯，她对爆炸和混乱有着病态的热爱。没有人知道她为什么要这么做，也许连她自己都不知道——她只知道，看着东西炸飞让她快乐。',
  },
  {
    id: 'ekko', name: '艾克', nameEn: 'Ekko', title: '时间刺客',
    regionId: 'zaun',
    vector: { chaos: 7, intuition: 5, bond: 7, conquest: 4, explore: 9, shadow: 5, agility: 9, ideal: 7 },
    description: '祖安街头的天才少年，用时间回溯守护朋友和家园。',
    lore: '艾克发明了一台能倒转时间的装置。他不是为了征服世界，而是为了保护他在祖安贫民窟的朋友们。他证明了即使在最黑暗的地方，也能诞生最明亮的希望。',
  },
  {
    id: 'singed', name: '辛吉德', nameEn: 'Singed', title: '炼金术士',
    regionId: 'zaun',
    vector: { chaos: 8, intuition: 3, bond: 1, conquest: 5, explore: 9, shadow: 9, agility: 5, ideal: 6 },
    description: '疯狂的炼金术士，为了科学可以牺牲一切，包括道德。',
    lore: '辛吉德是祖安最令人毛骨悚然的科学家。他的实验不受任何伦理束缚，在他眼中，生命不过是化学反应的集合，而他的使命是解开这些反应的终极奥秘。',
  },

  // ===== 弗雷尔卓德 =====
  {
    id: 'ashe', name: '艾希', nameEn: 'Ashe', title: '寒冰射手',
    regionId: 'freljord',
    vector: { chaos: 3, intuition: 5, bond: 7, conquest: 5, explore: 5, shadow: 2, agility: 5, ideal: 8 },
    description: '弗雷尔卓德的女王，梦想统一冰封大地、结束无尽的纷争。',
    lore: '艾希是弗雷尔卓德阿瓦罗萨部落的战母。与其他追求武力的领袖不同，她相信统一和和平才是让人民活下去的唯一出路。她用弓箭和外交同时战斗。',
  },
  {
    id: 'olaf', name: '奥拉夫', nameEn: 'Olaf', title: '狂战士',
    regionId: 'freljord',
    vector: { chaos: 8, intuition: 6, bond: 3, conquest: 9, explore: 5, shadow: 3, agility: 2, ideal: 2 },
    description: '渴望在战斗中光荣赴死的狂战士，却命运般地活了下来。',
    lore: '奥拉夫被预言将在床上老死，这对一个弗雷尔卓德战士来说是最大的耻辱。于是他冲向每一场最危险的战斗，疯狂地寻找光荣战死的机会，但死神总是与他擦肩而过。',
  },
  {
    id: 'braum', name: '布隆', nameEn: 'Braum', title: '弗雷尔卓德之心',
    regionId: 'freljord',
    vector: { chaos: 3, intuition: 5, bond: 10, conquest: 3, explore: 4, shadow: 1, agility: 2, ideal: 6 },
    description: '温暖如阳光的巨人，用门板大盾守护每一个需要帮助的人。',
    lore: '布隆是弗雷尔卓德的传奇英雄，一个拥有巨人力量和孩子般善良心灵的男人。他的存在证明，在最寒冷的土地上，也能拥有最温暖的灵魂。',
  },

  // ===== 比尔吉沃特 =====
  {
    id: 'gangplank', name: '普朗克', nameEn: 'Gangplank', title: '海洋之灾',
    regionId: 'bilgewater',
    vector: { chaos: 8, intuition: 5, bond: 2, conquest: 8, explore: 6, shadow: 8, agility: 6, ideal: 2 },
    description: '比尔吉沃特的暴君船长，用恐惧和橘子统治港口。',
    lore: '普朗克曾是比尔吉沃特不可撼动的统治者，用铁腕和残忍维持着这座混乱港口的"秩序"。即使在失去一切后，他仍在阴影中重建自己的帝国。',
  },
  {
    id: 'missfortune', name: '厄运小姐', nameEn: 'Miss Fortune', title: '赏金猎人',
    regionId: 'bilgewater',
    vector: { chaos: 7, intuition: 5, bond: 4, conquest: 7, explore: 6, shadow: 6, agility: 8, ideal: 4 },
    description: '美丽而致命的赏金猎人，誓要为母报仇。',
    lore: '厄运小姐表面上是比尔吉沃特最迷人的赏金猎人，但她的微笑背后藏着刻骨的仇恨。她一步步精心策划，终将颠覆整个港口的权力格局。',
  },
  {
    id: 'twistedfate', name: '崔斯特', nameEn: 'Twisted Fate', title: '卡牌大师',
    regionId: 'bilgewater',
    vector: { chaos: 8, intuition: 7, bond: 4, conquest: 3, explore: 8, shadow: 7, agility: 9, ideal: 3 },
    description: '浪迹天涯的赌徒和骗子，命运是他手中永远的底牌。',
    lore: '崔斯特是一个天生的赌徒和骗子，能用一副魔法纸牌改变任何人的命运。他只忠于自己，在刀尖上跳舞，在谎言中寻找真相。',
  },

  // ===== 暗影岛 =====
  {
    id: 'thresh', name: '锤石', nameEn: 'Thresh', title: '魂锁典狱长',
    regionId: 'shadowisles',
    vector: { chaos: 7, intuition: 5, bond: 2, conquest: 6, explore: 4, shadow: 10, agility: 7, ideal: 5 },
    description: '以折磨灵魂为乐的典狱长，将痛苦变成了艺术。',
    lore: '锤石不是简单的杀手，他是一个鉴赏家——痛苦和绝望的鉴赏家。他的灯笼里收集着无数灵魂，每一个都在永恒的折磨中尖叫，而他享受着每一声哀嚎。',
  },
  {
    id: 'yorick', name: '约里克', nameEn: 'Yorick', title: '牧魂人',
    regionId: 'shadowisles',
    vector: { chaos: 4, intuition: 6, bond: 5, conquest: 3, explore: 3, shadow: 7, agility: 3, ideal: 9 },
    description: '暗影岛上最后的活人，背负着解放亡灵的使命。',
    lore: '约里克是暗影岛上仅存的有自我意识的存在。他背负着岛上所有亡灵的哀嚎，日复一日地掘墓、安魂，等待着终有一天能解除这片土地的诅咒。',
  },
  {
    id: 'viego', name: '佛耶戈', nameEn: 'Viego', title: '破败之王',
    regionId: 'shadowisles',
    vector: { chaos: 8, intuition: 8, bond: 3, conquest: 7, explore: 5, shadow: 9, agility: 4, ideal: 8 },
    description: '为爱疯狂的破败之王，宁可毁灭世界也要找回她。',
    lore: '佛耶戈曾是一个王国的君主，为了复活死去的王后，他释放了毁灭一切的黑雾。在他的眼中，没有什么比他的爱情更重要——即使这份爱要以整个世界为代价。',
  },

  // ===== 恕瑞玛 =====
  {
    id: 'azir', name: '阿兹尔', nameEn: 'Azir', title: '沙漠皇帝',
    regionId: 'shurima',
    vector: { chaos: 2, intuition: 4, bond: 6, conquest: 8, explore: 5, shadow: 4, agility: 3, ideal: 10 },
    description: '复活的远古皇帝，誓要重建恕瑞玛的昔日荣光。',
    lore: '阿兹尔在沉睡千年后重生，眼前是自己帝国的废墟。但他的意志如同沙漠中的太阳般不可磨灭——恕瑞玛必将再次升起，在他的带领下重返巅峰。',
  },
  {
    id: 'sivir', name: '希维尔', nameEn: 'Sivir', title: '战争女神',
    regionId: 'shurima',
    vector: { chaos: 6, intuition: 5, bond: 3, conquest: 6, explore: 7, shadow: 5, agility: 7, ideal: 3 },
    description: '恕瑞玛沙漠中的雇佣兵，只为金币和自己而战。',
    lore: '希维尔是沙漠中最出色的雇佣兵，她的十字回旋镖从不失手。她不在乎什么帝国复兴，只关心下一单佣金。但命运似乎总是把她拉回恕瑞玛的古老传说中。',
  },
  {
    id: 'nasus', name: '内瑟斯', nameEn: 'Nasus', title: '沙漠死神',
    regionId: 'shurima',
    vector: { chaos: 2, intuition: 4, bond: 5, conquest: 4, explore: 6, shadow: 3, agility: 3, ideal: 9 },
    description: '永生的学者守护者，用知识和耐心守望着恕瑞玛的未来。',
    lore: '内瑟斯是恕瑞玛最古老的飞升者之一，拥有无尽的寿命和深邃的智慧。他选择用永恒的时光积累知识，相信智慧终将指引恕瑞玛走向正确的道路。',
  },

  // ===== 巨神峰 =====
  {
    id: 'leona', name: '蕾欧娜', nameEn: 'Leona', title: '曙光女神',
    regionId: 'targon',
    vector: { chaos: 2, intuition: 5, bond: 8, conquest: 5, explore: 4, shadow: 1, agility: 3, ideal: 9 },
    description: '太阳的化身，用烈日般的信念守护一切。',
    lore: '蕾欧娜是巨神峰烈阳教派的圣骑士，获得了太阳星灵的祝福。她的信念如正午的阳光般炽烈——守护弱者，惩罚邪恶，永不退缩，永不妥协。',
  },
  {
    id: 'diana', name: '黛安娜', nameEn: 'Diana', title: '皎月女神',
    regionId: 'targon',
    vector: { chaos: 6, intuition: 8, bond: 3, conquest: 4, explore: 7, shadow: 5, agility: 7, ideal: 9 },
    description: '月亮的信徒，在被遗忘的真相中寻找属于自己的正义。',
    lore: '黛安娜发现了被烈阳教派刻意隐藏的月之教派真相，这让她成为了异端。她用皎月之刃斩开谎言，证明黑夜的力量与白昼同样神圣。',
  },
  {
    id: 'taric', name: '塔里克', nameEn: 'Taric', title: '宝石骑士',
    regionId: 'targon',
    vector: { chaos: 3, intuition: 6, bond: 8, conquest: 3, explore: 5, shadow: 1, agility: 4, ideal: 10 },
    description: '登顶巨神峰的守护者，以美和爱之名守护万物。',
    lore: '塔里克曾是德玛西亚的骑士，因失职被流放到巨神峰。在攀登中他找到了真正的使命——成为万物之盾。他相信美和爱是宇宙中最强大的力量。',
  },
]
