import { registerMvuSchema as __WEBPACK_EXTERNAL_MODULE_https_testingcf_jsdelivr_net_gh_StageDog_tavern_resource_dist_util_mvu_zod_js_8998c919_registerMvuSchema__ } from "https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js";

;// external "https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js"

;// external "z"
const external_z_namespaceObject = z;
;// ./示例/角色卡示例/schema.ts

const Schema = external_z_namespaceObject.z.object({
    世界: external_z_namespaceObject.z.object({
        当前时间: external_z_namespaceObject.z.string(),
        当前地点: external_z_namespaceObject.z.string(),
        近期事务: external_z_namespaceObject.z.record(external_z_namespaceObject.z.string().describe('事务名'), external_z_namespaceObject.z.string().describe('事务描述')),
    }),
    白娅: external_z_namespaceObject.z
        .object({
        依存度: external_z_namespaceObject.z.coerce.number().transform(v => _.clamp(v, 0, 100)),
        着装: external_z_namespaceObject.z.record(external_z_namespaceObject.z.enum(['上装', '下装', '内衣', '袜子', '鞋子', '饰品']), external_z_namespaceObject.z.string().describe('服装描述')),
        称号: external_z_namespaceObject.z.record(external_z_namespaceObject.z.string().describe('称号名'), external_z_namespaceObject.z.object({
            效果: external_z_namespaceObject.z.string(),
            自我评价: external_z_namespaceObject.z.string(),
        })),
    })
        .transform(data => {
        const $依存度阶段 = data.依存度 < 20
            ? '消极自毁'
            : data.依存度 < 40
                ? '渴求注视'
                : data.依存度 < 60
                    ? '暗中靠近'
                    : data.依存度 < 80
                        ? '忐忑相依'
                        : '柔软依存';
        data.称号 = _(data.称号)
            .entries()
            .takeRight(Math.ceil(data.依存度 / 10))
            .fromPairs()
            .value();
        return { ...data, $依存度阶段 };
    }),
    主角: external_z_namespaceObject.z.object({
        物品栏: external_z_namespaceObject.z
            .record(external_z_namespaceObject.z.string().describe('物品名'), external_z_namespaceObject.z.object({
            描述: external_z_namespaceObject.z.string(),
            数量: external_z_namespaceObject.z.coerce.number(),
        }))
            .transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0)),
    }),
});

;// ./示例/角色卡示例/脚本/变量结构/index.ts


$(() => {
    __WEBPACK_EXTERNAL_MODULE_https_testingcf_jsdelivr_net_gh_StageDog_tavern_resource_dist_util_mvu_zod_js_8998c919_registerMvuSchema__(Schema);
});


//# sourceMappingURL=index.js.map