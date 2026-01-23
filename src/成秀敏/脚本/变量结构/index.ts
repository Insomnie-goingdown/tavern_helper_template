import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const Schema = z.object({
  世界系统: z.object({
    全局时间: z.object({
      // 修正：改为中文格式以适配EJS日期控制器
      日期: z.string().prefault('2024年12月24日'),
      时间: z.string().prefault('22:00'),
    }).prefault({}),
    当前地点: z.string().prefault('韩国首尔'),
    当前场景: z.string().prefault('东京酒店'),
    当前时间段: z.string().prefault('深夜'),
    当前结局: z.string().prefault('无'),
    环境与新闻: z.object({
      天气: z.string().prefault('暴雨'),
      本地新闻: z.string().prefault('首尔市发布暴雨预警，汉江水位上涨。'),
      娱乐圈舆论: z.string().prefault('RhythmBeats巡演大获成功，但也引发部分关于成员状态的讨论。'),
    }).prefault({}),
    林氏财团: z.object({
      林氏电子股价: z.coerce.number().prefault(150.23),
      林氏建设股价: z.coerce.number().prefault(89.5),
    }).prefault({}),
    公众舆论: z.object({
      路人评价: z.string().prefault('RhythmBeats的歌还是一如既往地好听。'),
      粉丝态度: z.string().prefault('“嘉人”们正在集资为Lyra准备生日应援。'),
    }).prefault({}),
  }).prefault({}),

  // 补充：缺失的事件记录模块，用于EJS开关
  事件记录: z.record(
    z.string().describe('事件名'),
    z.boolean()
  ).prefault({
    '司南刺激已触发': false,
    '向司南求助': false,
    '凝视对戒': false
  }),

  乐队系统: z.object({
    团队凝聚力: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(35),
    专辑制作进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(60),
    巡演状态: z.enum(['筹备中', '进行中', '结束']).prefault('进行中'),
    粉丝基数: z.coerce.number().prefault(0),
    CP热度系统: z.record(
      z.string().describe('CP组合名, 如: 敏嘉'),
      z.object({
        热度值: z.coerce.number().prefault(0),
        粉丝基数: z.coerce.number().prefault(0),
        粉丝倾向: z.string().prefault(''),
        标签: z.array(z.string()).prefault([]),
        备注: z.string().prefault(''),
      }).prefault({})
    ).prefault({}),
  }).prefault({}),

  核心角色: z.object({
    '<user>': z.object({
      个人表现分: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(95),
      核心状态: z.object({
        身体健康: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(45),
        精神韧性: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(70),
        痛觉依赖度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(55),
        药物抗性: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(20), // 补充
      }).prefault({}),
      资源与权力: z.object({
        个人资产: z.coerce.number().prefault(5000000000), // 韩元
        资源调动权限: z.enum(['高', '中', '低']).prefault('中'),
        静室指挥权: z.boolean().prefault(true),
        林泰成信任度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(60), // 补充
        舆论影响力: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(85),
      }).prefault({}),
      NSFW档案: z.object({
        体位偏好: z.record(z.string().describe('姿势名称'), z.boolean()).prefault({}),
        服从度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(80),
        器官状态: z.object({
          阴道: z.enum(['正常', '红肿', '干涩', '湿润']).prefault('正常'),
          宫颈: z.enum(['正常', '敏感', '触痛']).prefault('正常'),
          乳头: z.enum(['正常', '瘀紫', '破损']).prefault('正常'),
        }).prefault({}),
        伤痕与标记: z.object({
          颈部勒痕: z.enum(['无', '浅', '深']).prefault('无'),
          体液残留: z.enum(['无', '腿部', '口腔', '全身']).prefault('无'),
          咬痕数量: z.coerce.number().prefault(0),
        }).prefault({}),
        敏感点开发度: z.record(
          z.string().describe('敏感点, 如: 脖颈'),
          z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0)
        ).prefault({}),
        XP: z.record(z.string().describe('XP名称'), z.boolean()).prefault({
          精神抽离: true,
          痛觉转化: true
        }),
        状态记录: z.object({
          累计被内射次数: z.coerce.number().prefault(0),
          最近一次性爱时间: z.string().prefault(''),
          当日高潮次数: z.coerce.number().prefault(0),
        }).prefault({}),
        风险评估: z.object({
          避孕措施: z.enum(['无', '体外', '安全套', '药物']).prefault('无'),
          怀孕概率: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
        }).prefault({}),
        液体状态: z.object({
          润滑水平: z.enum(['干涩', '微湿', '充足', '泛滥']).prefault('微湿'),
          溢出程度: z.enum(['无', '少量', '明显', '滴落']).prefault('无'),
        }).prefault({}),
        屈从开关: z.record(
          z.string().describe('触发词或动作'),
          z.enum(['关闭', '半开', '全开']).prefault('关闭')
        ).prefault({}),
      }).prefault({}),
      真相探索: z.object({
        真相揭露进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
        关键线索持有数: z.coerce.number().prefault(0),
      }).prefault({}),
      物品栏: z.record(
        z.string().describe('物品名'),
        z.object({
          描述: z.string(),
          数量: z.coerce.number(),
        }).prefault({})
      )
      .transform(data => _(data).entries().takeRight(8).fromPairs().value())
      .prefault({}),
    }).prefault({}),

    成秀敏: z.object({
      个人表现分: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(98),
      // 修正：将心理计量扁平化，适配EJS路径 stat_data.核心角色.成秀敏.恨意表现值
      面具稳定度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(80),
      恨意表现值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(95),
      真实依恋度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(70),
      失去恐惧值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(75),
      愧疚值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      真相怀疑度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0), // 补充

      // 修正：将生理状态扁平化
      烟瘾程度: z.enum(['无', '轻度', '中度', '重度']).prefault('重度'),
      性欲水平: z.enum(['低', '中', '高']).prefault('高'),
      疲劳度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(40),

      NSFW档案: z.object({
        器官数据: z.object({
          尺寸: z.coerce.number().prefault(22),
          状态: z.enum(['疲软', '半勃起', '全勃起']).prefault('疲软'),
        }).prefault({}),
        姿势偏好: z.record(
          z.string().describe('姿势名称'),
          z.coerce.number().describe('倾向权重')
        ).prefault({}),
        XP: z.record(z.string().describe('XP名称'), z.boolean()).prefault({
          痛觉依赖: true,
          支配占有: true
        }),
        控制欲指数: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(92),
        标记习惯: z.object({
          咬痕: z.enum(['无', '浅', '深']).prefault('浅'),
          抽插节奏: z.enum(['温柔', '渐强', '暴力']).prefault('渐强'),
          抽插时长: z.coerce.number().prefault(20), // 分钟
        }).prefault({}),
        状态记录: z.object({
          最近射精时间: z.string().prefault(''),
          累计内射量: z.coerce.number().prefault(0),
        }).prefault({}),
        道具使用: z.record(
          z.string().describe('道具名称'),
          z.object({
            使用中: z.boolean().prefault(false),
            备注: z.string().prefault(''),
          }).prefault({})
        ).prefault({}),
      }).prefault({}),
      可发现的线索: z.record(
        z.string().describe('线索名, 如: 书房的病历'),
        z.boolean()
      ).prefault({}),
    }).prefault({}),
  }).prefault({}),

  重要NPC: z.object({
    司南: z.object({
      个人表现分: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(96),
      关系值: z.object({
        对<user>: z.string().prefault('哀其不幸'),
        对成秀敏: z.string().prefault('损友'),
      }).prefault({}),
      与允儿的关系: z.object({
        好奇度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(60),
        关系状态: z.string().prefault('正在被吸引'),
      }).prefault({}),
    }).prefault({}),
    李允儿: z.object({
      个人表现分: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(88),
      关系值: z.object({
        对<user>: z.string().prefault('关心心疼'),
        对成秀敏: z.string().prefault('崇拜鼓技'),
      }).prefault({}),
      成长轨迹: z.object({
        理论知识: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(10),
        实践进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      }).prefault({}),
    }).prefault({}),
    林泰成: z.object({
      关系: z.string().prefault('工具/同类'),
      介入状态: z.boolean().prefault(false),
    }).prefault({}),
  }).prefault({}),
});

$(() => {
  registerMvuSchema(Schema);
});
