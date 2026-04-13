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
]
