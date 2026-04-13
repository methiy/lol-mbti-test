import type { ScenarioQuestion } from '~/types'

export const scenarioQuestions: ScenarioQuestion[] = [
  {
    id: 1,
    narrative: '你在无人岛发现了一颗恶魔果实，散发着奇异的光芒。你不知道它的能力，但它价值连城。',
    options: [
      { label: 'A', text: '毫不犹豫吃掉它——未知的力量让人兴奋！', weights: { chaos: 2, explore: 1 } },
      { label: 'B', text: '带回去研究清楚再决定，盲目行动太冒险。', weights: { intuition: -2, explore: 1 } },
      { label: 'C', text: '留给伙伴中最需要它的人。', weights: { bond: 2, conquest: -1 } },
      { label: 'D', text: '拿去卖掉，换来的钱够全船花一年。', weights: { shadow: 1, ideal: -2 } },
    ],
  },
  {
    id: 2,
    narrative: '一名船员因为理念不同想要离开你的船。其他伙伴都很不舍。',
    options: [
      { label: 'A', text: '尊重他的决定，笑着送他走——真正的伙伴总会再见。', weights: { bond: 2, ideal: 1 } },
      { label: 'B', text: '跟他大打一架，把该说的话用拳头说清楚。', weights: { chaos: 2, conquest: 1 } },
      { label: 'C', text: '冷静分析他离开的原因，看能否找到折中方案。', weights: { agility: 2, intuition: -1 } },
      { label: 'D', text: '如果他要走就走，一个动摇的人留下只会拖累大家。', weights: { bond: -2, conquest: 1 } },
    ],
  },
  {
    id: 3,
    narrative: '你的船队抵达一座新岛屿，港口停满了海军军舰。岛上传来居民求助的呼声。',
    options: [
      { label: 'A', text: '直接冲进去！有人需要帮助就不能无视！', weights: { bond: 2, chaos: 1 } },
      { label: 'B', text: '先派人偷偷上岛侦查情况，知己知彼再行动。', weights: { shadow: 1, agility: 1 } },
      { label: 'C', text: '绕到岛的背面找隐蔽处登陆，避开海军主力。', weights: { agility: 2, shadow: 1 } },
      { label: 'D', text: '管他海军不海军，这座岛看起来很有趣，冲就完了！', weights: { explore: 2, chaos: 1 } },
    ],
  },
  {
    id: 4,
    narrative: '天龙人在你面前肆意殴打一个平民，周围的人都跪下了。',
    options: [
      { label: 'A', text: '一拳打飞天龙人——就算是神，伤害无辜也不可饶恕。', weights: { ideal: 2, chaos: 2 } },
      { label: 'B', text: '忍住怒火，暗中将受害者救走。现在硬拼只会牺牲更多人。', weights: { shadow: 2, agility: 1 } },
      { label: 'C', text: '记住这一切，有朝一日改变这个不合理的制度。', weights: { ideal: 2, conquest: 1 } },
      { label: 'D', text: '虽然愤怒，但这不是我能管的事。低头走过去。', weights: { bond: -1, ideal: -2 } },
    ],
  },
  {
    id: 5,
    narrative: '你的船在暴风雨中严重受损，远处有一支敌对海贼团正在逼近。',
    options: [
      { label: 'A', text: '修船的事之后再说，先调转船头迎战！进攻就是最好的防守！', weights: { conquest: 2, chaos: 1 } },
      { label: 'B', text: '全员优先修补船体，保住船就是保住一切。', weights: { bond: 1, agility: -1 } },
      { label: 'C', text: '利用暴风雨作掩护逃跑，保存实力最重要。', weights: { agility: 2, conquest: -1 } },
      { label: 'D', text: '派最强的人去拖住敌人，其他人全力修船。', weights: { shadow: 1, agility: 1 } },
    ],
  },
  {
    id: 6,
    narrative: '你得到了一张古代兵器的线索地图。这种武器足以毁灭世界，也能改变世界格局。',
    options: [
      { label: 'A', text: '去找到它并销毁——这种力量不该存在于世上。', weights: { ideal: 2, chaos: -1 } },
      { label: 'B', text: '出发去寻找它！这就是冒险的意义！', weights: { explore: 2, chaos: 1 } },
      { label: 'C', text: '掌握它来保护伙伴，但绝不滥用。', weights: { conquest: 2, bond: 1 } },
      { label: 'D', text: '把情报卖给出价最高的人，古代兵器的事跟我无关。', weights: { shadow: 2, ideal: -2 } },
    ],
  },
  {
    id: 7,
    narrative: '一个曾经背叛过你的人倒在路边奄奄一息，向你求救。',
    options: [
      { label: 'A', text: '救他。不管过去发生了什么，见死不救不是我的风格。', weights: { bond: 2, ideal: 1 } },
      { label: 'B', text: '问清楚他为什么背叛，答案合理才救。', weights: { intuition: -1, agility: 1 } },
      { label: 'C', text: '救他，但他从此欠我一条命。', weights: { shadow: 2, conquest: 1 } },
      { label: 'D', text: '背叛者自食其果，我没有义务帮他。', weights: { bond: -2, conquest: 1 } },
    ],
  },
  {
    id: 8,
    narrative: '你的航海日志上标记了两条路线：一条通向One Piece的关键线索，另一条是伙伴家乡遇难的求救信号。',
    options: [
      { label: 'A', text: '毫不犹豫转向去救伙伴的家人，宝藏什么时候都能找。', weights: { bond: 2, explore: -1 } },
      { label: 'B', text: '分头行动，一半人去救援，一半人继续追踪线索。', weights: { agility: 2, bond: 1 } },
      { label: 'C', text: '先确认求救信号的真实性，可能是陷阱。', weights: { intuition: -2, shadow: 1 } },
      { label: 'D', text: '继续追踪One Piece，成为海贼王才能保护所有人。', weights: { conquest: 2, ideal: 1 } },
    ],
  },
  {
    id: 9,
    narrative: '你意外来到一座空岛，这里的人从未见过蓝海的居民。他们视你为入侵者。',
    options: [
      { label: 'A', text: '用行动证明自己没有恶意，帮他们解决正在面临的困难。', weights: { bond: 2, ideal: 1 } },
      { label: 'B', text: '这里太有趣了！先到处探索，误会总会解开的。', weights: { explore: 2, chaos: 1 } },
      { label: 'C', text: '展示实力让他们知道我不是好惹的，然后再谈和平。', weights: { conquest: 2, shadow: 1 } },
      { label: 'D', text: '尝试找到他们的首领进行外交对话。', weights: { agility: 1, intuition: -1 } },
    ],
  },
  {
    id: 10,
    narrative: '海军总部宣布将对一个无辜小国发动"正义"清洗。你刚好在附近海域。',
    options: [
      { label: 'A', text: '立刻前去阻止，这种所谓的正义根本不是正义！', weights: { ideal: 2, chaos: 1 } },
      { label: 'B', text: '帮助岛上的居民撤离，打不过至少能救人。', weights: { bond: 2, agility: 1 } },
      { label: 'C', text: '联络其他海贼团和势力，组成临时联盟对抗海军。', weights: { agility: 2, bond: 1 } },
      { label: 'D', text: '这是大势力之间的博弈，我无力改变。只能默默记住。', weights: { bond: -1, ideal: -1 } },
    ],
  },
  {
    id: 11,
    narrative: '你的船医发现一种疾病的解药配方，但关键药材只有世界政府控制的岛屿上才有。',
    options: [
      { label: 'A', text: '带全员强行闯入，伙伴的命比什么都重要！', weights: { conquest: 2, bond: 1 } },
      { label: 'B', text: '派最擅长潜入的人悄悄取药，不打草惊蛇。', weights: { shadow: 2, agility: 1 } },
      { label: 'C', text: '尝试通过地下渠道购买或交换。', weights: { agility: 2, shadow: 1 } },
      { label: 'D', text: '让船医继续研究，也许能找到替代药材。', weights: { explore: 1, intuition: -1 } },
    ],
  },
  {
    id: 12,
    narrative: '你在深海中发现了一座沉没的古代王国遗迹，里面似乎藏着"空白的100年"的秘密。',
    options: [
      { label: 'A', text: '深入探索！真相就在眼前，这是历史的呼唤！', weights: { explore: 2, ideal: 1 } },
      { label: 'B', text: '仔细记录一切信息，带回去让考古学家分析。', weights: { intuition: -1, explore: 1 } },
      { label: 'C', text: '拿走值钱的东西就好，历史的事让别人操心。', weights: { shadow: 1, ideal: -2 } },
      { label: 'D', text: '如果世界政府要掩盖这段历史，那真相一定要公之于众。', weights: { ideal: 2, chaos: 1 } },
    ],
  },
  {
    id: 13,
    narrative: '一个极其强大的敌人向你发起挑战，实力差距悬殊。但如果逃跑，他会去伤害你保护的人。',
    options: [
      { label: 'A', text: '正面迎战！就算打不过也绝不退缩！', weights: { conquest: 2, bond: 1 } },
      { label: 'B', text: '拖延时间，让伙伴们带人撤离。我来断后。', weights: { bond: 2, conquest: 1 } },
      { label: 'C', text: '寻找环境中的有利因素，以弱胜强靠的是智慧。', weights: { agility: 2, shadow: 1 } },
      { label: 'D', text: '向他喊话谈判，找出他真正想要什么。', weights: { intuition: 1, agility: 1 } },
    ],
  },
  {
    id: 14,
    narrative: '你成为了一座岛屿的临时领袖，居民们对未来的方向产生了分歧：有人想闭关锁岛保安全，有人想开放港口发展。',
    options: [
      { label: 'A', text: '开放港口！与世界交流才能变得更强。', weights: { explore: 2, chaos: 1 } },
      { label: 'B', text: '先确保岛屿的防御安全，再逐步开放。', weights: { chaos: -1, agility: 1 } },
      { label: 'C', text: '把决定权交给居民，由他们投票决定自己的命运。', weights: { ideal: 2, bond: 1 } },
      { label: 'D', text: '我来做决定——既然当了领袖就要有担当。', weights: { conquest: 2, chaos: -1 } },
    ],
  },
  {
    id: 15,
    narrative: '你截获了一份情报：一个你敬重的人其实是世界政府的间谍。',
    options: [
      { label: 'A', text: '直接当面质问他，我相信他会给我一个解释。', weights: { bond: 1, intuition: 1 } },
      { label: 'B', text: '暗中调查，确认情报的真伪后再做决定。', weights: { shadow: 1, intuition: -2 } },
      { label: 'C', text: '不管真假，公布这个消息保护所有人的安全。', weights: { ideal: 1, chaos: 1 } },
      { label: 'D', text: '假装不知道，暗中利用这个信息为自己获利。', weights: { shadow: 2, ideal: -1 } },
    ],
  },
  {
    id: 16,
    narrative: '你终于站在了拉夫德鲁（Laugh Tale）前。要到达那里，需要牺牲船上最珍贵的宝物——全员的冒险日志。',
    options: [
      { label: 'A', text: '毫不犹豫烧掉日志——终点就在眼前，这就是一切冒险的意义！', weights: { explore: 2, conquest: 1 } },
      { label: 'B', text: '不行，这些日志记录了我们所有的回忆，没有它们到达终点也毫无意义。', weights: { bond: 2, explore: -1 } },
      { label: 'C', text: '先抄写一份副本再烧掉原件，两全其美。', weights: { agility: 2, intuition: -1 } },
      { label: 'D', text: '让全员一起做这个决定，这不是一个人能决定的事。', weights: { bond: 1, ideal: 2 } },
    ],
  },
]
