import type { ScenarioQuestion } from '~/types'

export const scenarioQuestions: ScenarioQuestion[] = [
  {
    id: 1,
    narrative: '你的船队在比尔吉沃特港外遭遇海雾，前方隐约传来求救声。',
    options: [
      { label: 'A', text: '立刻驶向声源，有人需要帮助。', weights: { bond: 2, conquest: -1 } },
      { label: 'B', text: '先派斥候探查，确认不是陷阱再说。', weights: { intuition: -2, ideal: -1 } },
      { label: 'C', text: '绕道而行，我不会拿船员的命冒险。', weights: { explore: -2, ideal: -1 } },
      { label: 'D', text: '全速冲进去，海雾里说不定有宝藏！', weights: { explore: 2, chaos: 1 } },
    ],
  },
  {
    id: 2,
    narrative: '德玛西亚边境的村庄遭到袭击，你是附近唯一的战士。敌人数量远超你，但村民们正在呼救。',
    options: [
      { label: 'A', text: '毫不犹豫冲上去，哪怕以一敌百。', weights: { conquest: 2, bond: 1 } },
      { label: 'B', text: '先撤退搬救兵，活着才能救更多人。', weights: { intuition: -1, ideal: -1 } },
      { label: 'C', text: '利用地形设置陷阱，以智取胜。', weights: { agility: 2, shadow: 1 } },
      { label: 'D', text: '带领村民一起战斗，团结就是力量。', weights: { bond: 2, chaos: -1 } },
    ],
  },
  {
    id: 3,
    narrative: '你在皮尔特沃夫的实验室里发现了一项禁忌技术，它能带来巨大的力量，但也可能造成灾难。',
    options: [
      { label: 'A', text: '立刻销毁它，有些力量不该存在。', weights: { chaos: -2, ideal: 1 } },
      { label: 'B', text: '秘密研究它，知识本身没有善恶。', weights: { explore: 2, shadow: 1 } },
      { label: 'C', text: '上报给议会，让组织来决定。', weights: { chaos: -1, bond: 1 } },
      { label: 'D', text: '用它来增强自己的力量，机会难得。', weights: { conquest: 2, ideal: -1 } },
    ],
  },
  {
    id: 4,
    narrative: '艾欧尼亚的长老会议上，对于是否应该对诺克萨斯的入侵发起反攻，意见分裂。轮到你发言了。',
    options: [
      { label: 'A', text: '主和——以武止武只会让更多人受苦。', weights: { conquest: -2, ideal: 1 } },
      { label: 'B', text: '主战——必须让入侵者付出代价。', weights: { conquest: 2, chaos: 1 } },
      { label: 'C', text: '提议谈判——找到双方都能接受的方案。', weights: { agility: 1, bond: 1 } },
      { label: 'D', text: '建议暗中行动——表面和谈，背后削弱对方。', weights: { shadow: 2, agility: 1 } },
    ],
  },
  {
    id: 5,
    narrative: '弗雷尔卓德的严冬来临，你的部落粮食不足。邻近部落有充足的储备，但他们拒绝分享。',
    options: [
      { label: 'A', text: '带领战士去夺取——生存是第一法则。', weights: { conquest: 2, chaos: 1 } },
      { label: 'B', text: '用部落的工艺品去交换，互利共赢。', weights: { agility: 1, ideal: -1 } },
      { label: 'C', text: '独自去荒野狩猎，不求任何人。', weights: { bond: -2, explore: 1 } },
      { label: 'D', text: '联合其他弱小部落，一起向他们施压。', weights: { bond: 2, shadow: 1 } },
    ],
  },
  {
    id: 6,
    narrative: '你在暗影岛的废墟中发现一个被封印的灵魂，它声称自己是无辜的，请求你释放它。',
    options: [
      { label: 'A', text: '释放它——每个灵魂都值得自由。', weights: { ideal: 2, chaos: 1 } },
      { label: 'B', text: '不予理会——封印自有它的原因。', weights: { chaos: -1, intuition: -1 } },
      { label: 'C', text: '先调查封印的历史，再做决定。', weights: { explore: 1, intuition: -1 } },
      { label: 'D', text: '与它交易——释放的代价是它为你效力。', weights: { shadow: 2, conquest: 1 } },
    ],
  },
  {
    id: 7,
    narrative: '你成为了一座城邦的领袖，面临第一个决策：如何分配有限的资源。',
    options: [
      { label: 'A', text: '优先发展军事，实力是安全的保障。', weights: { conquest: 2, ideal: -1 } },
      { label: 'B', text: '投资教育和研究，知识才是长远之计。', weights: { ideal: 2, explore: 1 } },
      { label: 'C', text: '平均分配给所有民众，公平最重要。', weights: { bond: 1, chaos: -1 } },
      { label: 'D', text: '建立贸易网络，让财富自然流动。', weights: { agility: 1, explore: 1 } },
    ],
  },
  {
    id: 8,
    narrative: '恕瑞玛的沙漠中，你找到了一件远古神器。传说它能实现一个愿望，但使用者会失去最珍贵的记忆。',
    options: [
      { label: 'A', text: '毫不犹豫使用——为了更伟大的目标，牺牲是值得的。', weights: { ideal: 2, conquest: 1 } },
      { label: 'B', text: '带回去研究它的原理，也许能找到无代价的使用方式。', weights: { explore: 1, intuition: -1 } },
      { label: 'C', text: '重新封印它——这种力量不该被任何人使用。', weights: { chaos: -2, bond: 1 } },
      { label: 'D', text: '卖给出价最高的人，记忆是别人的事。', weights: { shadow: 1, ideal: -2 } },
    ],
  },
  {
    id: 9,
    narrative: '你在祖安的地下市场发现了一个孩子正在被黑帮逼迫做苦工。',
    options: [
      { label: 'A', text: '直接动手救人，管他什么后果。', weights: { bond: 2, chaos: 1 } },
      { label: 'B', text: '暗中跟踪黑帮，找到他们的老巢后一网打尽。', weights: { shadow: 2, agility: 1 } },
      { label: 'C', text: '用钱赎人，暴力解决不了根本问题。', weights: { agility: 1, ideal: -1 } },
      { label: 'D', text: '这不关我的事，祖安每天都在发生这种事。', weights: { bond: -2, ideal: -1 } },
    ],
  },
  {
    id: 10,
    narrative: '巨神峰的试炼中，你必须在两条路之间选择：一条安全但漫长，一条危险但能直达峰顶。',
    options: [
      { label: 'A', text: '选择危险的捷径——真正的勇者不会绕路。', weights: { conquest: 2, explore: 1 } },
      { label: 'B', text: '走安全的长路——活着到达才是目的。', weights: { ideal: -1, agility: -1 } },
      { label: 'C', text: '研究两条路的地形，找出第三条路线。', weights: { explore: 2, intuition: -1 } },
      { label: 'D', text: '先走危险路段一小段探探情况，不行再回头。', weights: { agility: 2, explore: 1 } },
    ],
  },
  {
    id: 11,
    narrative: '你在恕瑞玛的遗迹中发现了一段被隐藏的历史真相，它与当前统治者宣传的版本完全不同。',
    options: [
      { label: 'A', text: '公布真相——人民有权知道真实的历史。', weights: { ideal: 2, chaos: 1 } },
      { label: 'B', text: '保守秘密——稳定比真相更重要。', weights: { chaos: -2, bond: 1 } },
      { label: 'C', text: '把真相作为筹码，与统治者谈判。', weights: { shadow: 2, conquest: 1 } },
      { label: 'D', text: '继续调查，确保掌握完整的事实后再做决定。', weights: { explore: 1, intuition: -1 } },
    ],
  },
  {
    id: 12,
    narrative: '皮尔特沃夫的进步日庆典上，一个发明家展示了能取代大量工人的自动化机器。工人们正在抗议。',
    options: [
      { label: 'A', text: '支持发明家——进步不该被恐惧阻止。', weights: { explore: 2, ideal: 1 } },
      { label: 'B', text: '站在工人这边——技术不该以牺牲人的生计为代价。', weights: { bond: 2, chaos: -1 } },
      { label: 'C', text: '提议折中方案——逐步过渡，给工人转型时间。', weights: { agility: 1, bond: 1 } },
      { label: 'D', text: '不参与——这是他们自己的事，看热闹就好。', weights: { bond: -1, shadow: 1 } },
    ],
  },
  {
    id: 13,
    narrative: '你的队友在战斗中背叛了你，但现在他身负重伤倒在你面前，请求你的帮助。',
    options: [
      { label: 'A', text: '救他——以德报怨，这就是我的原则。', weights: { bond: 2, ideal: 1 } },
      { label: 'B', text: '无视他——背叛的代价就是被抛弃。', weights: { conquest: 1, shadow: 1 } },
      { label: 'C', text: '救他，但要求他从此效忠于我。', weights: { shadow: 2, conquest: 1 } },
      { label: 'D', text: '先问清楚为什么背叛，理由合理就救。', weights: { intuition: -1, agility: 1 } },
    ],
  },
  {
    id: 14,
    narrative: '艾欧尼亚的一处圣地正在被外来者开发为商业区，长老们分歧严重。你会如何影响决策？',
    options: [
      { label: 'A', text: '坚决反对——圣地不可亵渎，传统必须守护。', weights: { ideal: 2, chaos: -1 } },
      { label: 'B', text: '支持开发——发展经济才能真正保护更多东西。', weights: { ideal: -1, explore: 1 } },
      { label: 'C', text: '提议在保留核心区域的前提下有限开发。', weights: { agility: 2, bond: 1 } },
      { label: 'D', text: '暗中联络民众发起抗议，让长老会不得不让步。', weights: { shadow: 1, chaos: 2 } },
    ],
  },
  {
    id: 15,
    narrative: '你在弗雷尔卓德的冰穴中发现了一头被冰封的远古巨兽。它似乎还活着，只是沉睡。',
    options: [
      { label: 'A', text: '唤醒它——如此强大的存在不该被困住。', weights: { chaos: 2, explore: 1 } },
      { label: 'B', text: '永远封印它——谁也不知道它醒来会做什么。', weights: { chaos: -1, bond: 1 } },
      { label: 'C', text: '研究它的力量，看能否为己所用。', weights: { explore: 2, shadow: 1 } },
      { label: 'D', text: '尝试与它沟通——也许它有自己的故事。', weights: { intuition: 2, bond: 1 } },
    ],
  },
  {
    id: 16,
    narrative: '比尔吉沃特的船长选举中，你可以投给一个残暴但能带来秩序的强人，或一个善良但可能无法控制局面的领袖。',
    options: [
      { label: 'A', text: '投给强人——乱世需要铁腕。', weights: { conquest: 2, chaos: -1 } },
      { label: 'B', text: '投给善良的领袖——暴力统治终究不可持续。', weights: { ideal: 2, bond: 1 } },
      { label: 'C', text: '两个都不投，自己来当——我比他们都强。', weights: { conquest: 2, chaos: 2 } },
      { label: 'D', text: '看看谁给的好处多就投谁，政治就是交易。', weights: { shadow: 1, ideal: -2 } },
    ],
  },
]
