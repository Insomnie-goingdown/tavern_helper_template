import { createPinia as __WEBPACK_EXTERNAL_MODULE_https_testingcf_jsdelivr_net_npm_pinia_esm_b723a504_createPinia__, defineStore as __WEBPACK_EXTERNAL_MODULE_https_testingcf_jsdelivr_net_npm_pinia_esm_b723a504_defineStore__, storeToRefs as __WEBPACK_EXTERNAL_MODULE_https_testingcf_jsdelivr_net_npm_pinia_esm_b723a504_storeToRefs__ } from "https://testingcf.jsdelivr.net/npm/pinia/+esm";
import { klona as __WEBPACK_EXTERNAL_MODULE_https_testingcf_jsdelivr_net_npm_klona_esm_74666e88_klona__ } from "https://testingcf.jsdelivr.net/npm/klona/+esm";
import { default as __WEBPACK_EXTERNAL_MODULE_https_testingcf_jsdelivr_net_npm_dedent_esm_422736dc_default__ } from "https://testingcf.jsdelivr.net/npm/dedent/+esm";
/******/ var __webpack_modules__ = ({

/***/ 335
() {


// 在加载脚本时执行某个函数
$(() => {
    toastr.success('你已经成功加载示例脚本!', '恭喜你!');
});
// 在卸载脚本时执行某个函数
$(window).on('pagehide', () => {
    toastr.info('你已经卸载示例脚本!', '再见!');
});


/***/ },

/***/ 412
() {


eventOn(tavern_events.MESSAGE_UPDATED, (message_id) => {
    toastr.error(`谁让你动我第 ${message_id} 楼消息的😡`, `干什么!`);
});


/***/ },

/***/ 491
() {


$(() => {
    replaceScriptButtons([{ name: '晚上好', visible: true }]);
    eventOn(getButtonEvent('晚上好'), () => {
        toastr.warning('晚安, 络络');
    });
});


/***/ }

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/

// EXTERNAL MODULE: ./示例/脚本示例/加载和卸载时执行函数.ts
var _ = __webpack_require__(335);
// EXTERNAL MODULE: ./示例/脚本示例/添加按钮和注册按钮事件.ts
var _0 = __webpack_require__(491);
// EXTERNAL MODULE: ./示例/脚本示例/监听消息修改.ts
var _1 = __webpack_require__(412);
;// ./util/script.ts
async function loadReadme(url) {
    const readme = await fetch(url);
    if (!readme.ok) {
        return false;
    }
    const readme_text = await readme.text();
    replaceScriptInfo(readme_text);
    return true;
}
function teleportStyle() {
    if ($(`head > div[script_id="${getScriptId()}"]`).length > 0) {
        return;
    }
    const $div = $(`<div>`).attr('script_id', getScriptId()).append($(`head > style`, document).clone());
    $('head').append($div);
}
function deteleportStyle() {
    $(`head > div[script_id="${getScriptId()}"]`).remove();
}
function createScriptIdDiv() {
    return $('<div>').attr('script_id', getScriptId());
}
function destroyScriptIdDiv() {
    $(`div[script_id="${getScriptId()}"]`).remove();
}
function reloadOnChatChange() {
    let chat_id = SillyTavern.getCurrentChatId();
    return eventOn(tavern_events.CHAT_CHANGED, new_chat_id => {
        if (chat_id !== new_chat_id) {
            chat_id = new_chat_id;
            window.location.reload();
        }
    });
}

;// ./示例/脚本示例/聊天文件变更时重载脚本.ts

reloadOnChatChange();

;// external "Vue"
const external_Vue_namespaceObject = Vue;
;// external "https://testingcf.jsdelivr.net/npm/pinia/+esm"

;// external "z"
const external_z_namespaceObject = z;
;// external "https://testingcf.jsdelivr.net/npm/klona/+esm"

;// ./示例/脚本示例/settings.ts




const Settings = external_z_namespaceObject.z
    .object({
    button_selected: external_z_namespaceObject.z.boolean().default(false),
})
    .prefault({});
const useSettingsStore = __WEBPACK_EXTERNAL_MODULE_https_testingcf_jsdelivr_net_npm_pinia_esm_b723a504_defineStore__('settings', () => {
    const settings = (0,external_Vue_namespaceObject.ref)(Settings.parse(getVariables({ type: 'script', script_id: getScriptId() })));
    (0,external_Vue_namespaceObject.watchEffect)(() => {
        insertOrAssignVariables(__WEBPACK_EXTERNAL_MODULE_https_testingcf_jsdelivr_net_npm_klona_esm_74666e88_klona__(settings.value), { type: 'script', script_id: getScriptId() });
    });
    return { settings };
});

;// ./node_modules/.pnpm/unplugin@2.3.11/node_modules/unplugin/dist/webpack/loaders/transform.js??unplugin-vue-components!./node_modules/.pnpm/unplugin@2.3.11/node_modules/unplugin/dist/webpack/loaders/transform.js??unplugin-auto-import!./node_modules/.pnpm/ts-loader@9.5.4_typescript@6.0.0-dev.20250807_webpack@5.104.1/node_modules/ts-loader/index.js??clonedRuleSet-150!./node_modules/.pnpm/vue-loader@17.4.2_vue@3.5.26_typescript@6.0.0-dev.20250807__webpack@5.104.1/node_modules/vue-loader/dist/index.js??ruleSet[1].rules[6].use[0]!./示例/脚本示例/设置界面.vue?vue&type=script&setup=true&lang=ts
/* unplugin-vue-components disabled */

const _hoisted_1 = { class: "example-extension-settings" };
const _hoisted_2 = { class: "inline-drawer" };
const _hoisted_3 = { class: "inline-drawer-content" };
const _hoisted_4 = { class: "example-extension_block flex-container" };


/* harmony default export */ const _vue_type_script_setup_true_lang_ts = (/*@__PURE__*/(0,external_Vue_namespaceObject.defineComponent)({
    __name: '设置界面',
    setup(__props) {
        const { settings } = __WEBPACK_EXTERNAL_MODULE_https_testingcf_jsdelivr_net_npm_pinia_esm_b723a504_storeToRefs__(useSettingsStore());
        const handle_button_click = () => {
            toastr.success('你好呀!');
        };
        return (_ctx, _cache) => {
            return ((0,external_Vue_namespaceObject.openBlock)(), (0,external_Vue_namespaceObject.createElementBlock)("div", _hoisted_1, [
                (0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_2, [
                    _cache[3] || (_cache[3] = (0,external_Vue_namespaceObject.createElementVNode)("div", { class: "inline-drawer-toggle inline-drawer-header" }, [
                        (0,external_Vue_namespaceObject.createElementVNode)("b", null, (0,external_Vue_namespaceObject.toDisplayString)(`脚本示例`)),
                        (0,external_Vue_namespaceObject.createElementVNode)("div", { class: "inline-drawer-icon fa-solid fa-circle-chevron-down down" })
                    ], -1 /* CACHED */)),
                    (0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_3, [
                        (0,external_Vue_namespaceObject.createElementVNode)("div", { class: "example-extension_block flex-container" }, [
                            (0,external_Vue_namespaceObject.createElementVNode)("input", {
                                class: "menu_button",
                                type: "submit",
                                value: `示例按钮`,
                                onClick: handle_button_click
                            })
                        ]),
                        (0,external_Vue_namespaceObject.createElementVNode)("div", _hoisted_4, [
                            (0,external_Vue_namespaceObject.withDirectives)((0,external_Vue_namespaceObject.createElementVNode)("input", {
                                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => (((0,external_Vue_namespaceObject.unref)(settings).button_selected) = $event)),
                                type: "checkbox"
                            }, null, 512 /* NEED_PATCH */), [
                                [external_Vue_namespaceObject.vModelCheckbox, (0,external_Vue_namespaceObject.unref)(settings).button_selected]
                            ]),
                            _cache[1] || (_cache[1] = (0,external_Vue_namespaceObject.createElementVNode)("label", { for: "example_setting" }, (0,external_Vue_namespaceObject.toDisplayString)(`示例开关`), -1 /* CACHED */))
                        ]),
                        _cache[2] || (_cache[2] = (0,external_Vue_namespaceObject.createElementVNode)("hr", { class: "sysHR" }, null, -1 /* CACHED */))
                    ])
                ])
            ]));
        };
    }
}));

;// ./示例/脚本示例/设置界面.vue?vue&type=script&setup=true&lang=ts
/* unplugin-vue-components disabled */ 
;// ./示例/脚本示例/设置界面.vue
/* unplugin-vue-components disabled */


const __exports__ = _vue_type_script_setup_true_lang_ts;

/* harmony default export */ const _2 = (__exports__);
;// ./示例/脚本示例/设置界面.ts





const app = (0,external_Vue_namespaceObject.createApp)(_2).use(__WEBPACK_EXTERNAL_MODULE_https_testingcf_jsdelivr_net_npm_pinia_esm_b723a504_createPinia__());
$(() => {
    const $app = createScriptIdDiv();
    $('#extensions_settings2').append($app);
    teleportStyle();
    app.mount($app[0]);
});
$(window).on('pagehide', () => {
    app.unmount();
    deteleportStyle();
    destroyScriptIdDiv();
});

;// external "https://testingcf.jsdelivr.net/npm/dedent/+esm"

;// ./示例/脚本示例/调整消息楼层.ts

"use strict";
$(async () => {
    const message_id = getLastMessageId();
    if (message_id !== 0) {
        return;
    }
    await createChatMessages([
        {
            role: 'assistant',
            message: __WEBPACK_EXTERNAL_MODULE_https_testingcf_jsdelivr_net_npm_dedent_esm_422736dc_default__(`
                   [查看日记: 这是第二次看我的日记了呢~]
                   <roleplay_options>
                   接受日记本并翻阅: 青空黎接过她递来的粉色日记本，在天台阳光下缓缓翻开第一页
                   保持沉默盯着她看: 青空黎没有接本子，只是盯着她略显紧张的表情和轻颤的声音
                   坐到她身边: 青空黎没有立刻回应，而是缓缓走到络络身边坐下，等待她自己继续说
                   开玩笑化解气氛: 青空黎微微一笑，开玩笑地说「所以，是要让我当监督官啦？」
                   跳过时间: 青空黎接过日记本，安静地翻了几页，时间悄然流逝至黄昏深处
                   和络络聊天: 青空黎试探性地问：「这本是从哪天开始写的？都写些什么呀？」
                   </roleplay_options>
                 `),
        },
        {
            role: 'assistant',
            message: __WEBPACK_EXTERNAL_MODULE_https_testingcf_jsdelivr_net_npm_dedent_esm_422736dc_default__(`
                   [查看日记: 真是的, 就这么喜欢看吗(v〃ω〃)]
                   <roleplay_options>
                   阅读日记第一页：青空黎打开粉色的日记本，从第一页开始认真阅读络络的记录内容。
                   问她封面上的兔子贴纸：青空黎好奇那枚蓝色兔子贴纸的来历，转头向络络询问。
                   观察络络的小动作：青空黎不急着翻开日记，而是注意到络络表情里一丝期待与不安。
                   和她闲聊天气：青空黎随口聊起傍晚风有点凉，试图舒缓紧张气氛。
                   调侃她：“有哪页是‘不许看’的？”青空黎轻松地试图化解她的小慌乱。
                   转身回教室：青空黎接过日记却并未立刻翻开，而是表示回教室再看，打算慢慢阅读。
                   </roleplay_options>
                 `),
        },
    ], { refresh: 'all' });
});

;// ./示例/脚本示例/index.ts








//# sourceMappingURL=index.js.map