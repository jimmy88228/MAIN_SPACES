<template>
    <div class="custom-module-item" :class="{'selected': selected}" :style="getModuleStyle(itemInfo.setting)">
        <div class="module-tips">
            <span class="module-tips-arrow"></span>
            <div class="txt">
                <template v-if="!itemInfo.module_type || !itemInfo.module_name">未知组件</template>
                <template v-else>
                    <div>{{itemInfo.module_name}}</div>
                    <div class="text-flow3" v-if="itemInfo.setting && itemInfo.setting.widgetRemark">{{ '备注：'+itemInfo.setting.widgetRemark }}</div>
                </template>
            </div>
            <div class="operate">
                <template ><!--v-if="itemInfo.is_deletable == 1"-->
                    <Poptip confirm placement="left-start" class="text-l" :width="180" title="确定删除吗？" @on-ok="removeModule()">
                        <Icon class="close" type="md-trash" :size="16" style="width:48px;"></Icon>
                    </Poptip>
                </template>
                <!-- <template v-else>
                    <span class="close">不可移除</span>
                </template> -->
            </div>
        </div>
        <slot></slot>
        <!--选择边框-->
        <template>
            <span class="line-i line-t"></span>
            <span class="line-i line-r"></span>
            <span class="line-i line-b"></span>
            <span class="line-i line-l"></span>
        </template>
    </div>
</template>

<script>
export default {
    name: "module-contain",
    props: {
        itemIndex: Number,
        selected: {
            type: Boolean,
            default: false,
        },
        itemInfo: {
            type: Object,
            default() {
                return {
                    setting: {
                        backgroundColor: "",
                        backgroundImage: "",
                        backgroundRepeat: "",
                        backgroundSize: "",
                        backgroundPosition: "",
                        marginTop: "",
                        marginBottom: "",
                        marginLeftRight: "",
                        paddingLeftRight: "",
                        paddingTop: "",
                        paddingBottom: "",
                        is_enable: 1,
                    },
                    is_deletable: 1,
                };
            },
        },
    },
    data() {
        return {};
    },
    methods: {
        removeModule() {
            this.$emit("remove", this.itemIndex);
        },
        getModuleStyle(setting) {
            if (setting != null) {
                setting = JSON.parse(JSON.stringify(setting));
                return {
                    "background-color": setting.backgroundColor,
                    "background-image": "url(" + setting.backgroundImage + ")",
                    "background-repeat": "no-repeat",
                    "background-size": "100% auto",
                    "background-position":
                        "center " + setting.backgroundPosition,
                    "margin-top": setting.marginTop + "px",
                    "margin-bottom": setting.marginBottom + "px",
                    "margin-left": setting.marginLeftRight + "px",
                    "margin-right": setting.marginLeftRight + "px",
                    "padding-left": setting.paddingLeftRight + "px",
                    "padding-right": setting.paddingLeftRight + "px",
                    "padding-top": setting.paddingTop + "px",
                    "padding-bottom": setting.paddingBottom + "px",
                    opacity:
                        setting.is_enable == 1 ||
                        typeof setting.is_enable == "undefined"
                            ? 1
                            : 0.4,
                };
            } else {
                return {};
            }
        },
        noFun() {},
    },
};
</script>

<style lang="less">
.custom-module-item {
    position: relative;
    min-height: 45px;
    box-sizing: border-box;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // border: 2px solid transparent;
    cursor: move;
    .module-tips {
        background: #fff;
        box-shadow: 0 0 4px 0 rgba(10, 42, 97, 0.2);
        padding: 8px 10px;
        // padding: 10px 15px;
        position: absolute;
        will-change: top, left;
        top: 5px;
        right: -10px;
        z-index: 2;
        transform: translateX(100%);
        text-align: center;
        font-size: 10px;
        max-width: 68px;
        .module-tips-arrow {
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            position: absolute;
            top: 8px;
            left: 0px;
            border-width: 7px 7px 7px 0;
            border-right-color: hsla(0, 0%, 85%, 0.5);
            transform: translateX(-100%);
        }
        .module-tips-arrow::after {
            content: " ";
            display: block;
            width: 0;
            height: 0;
            position: absolute;
            border: 7px solid transparent;
            left: 1px;
            bottom: -7px;
            border-left-width: 0;
            border-right-color: #fff;
        }
        .close {
            cursor: pointer;
            font-size: 12px;
        }
        .txt {
            display: block;
        }
        .operate {
            display: none;
            .ivu-poptip-popper {
                .ivu-poptip-footer{
                    display: flex;
                }
            }
        }
    }
    .line-i {
        position: absolute;
        display: block;
        background-color: #0883cc;
        width: 100%;
        height: 2px;
        opacity: 0;
        transition: opacity 0.2s;
    }
    .line-t {
        top: 0px;
        left: 0px;
    }
    .line-r {
        top: 0px;
        right: 0px;
        width: 2px;
        height: 100%;
    }
    .line-b {
        bottom: 0px;
        left: 0px;
    }
    .line-l {
        top: 0px;
        left: 0px;
        width: 2px;
        height: 100%;
    }
}
.custom-module-item:hover {
    .line-i {
        // opacity: 0.5;
        opacity: 1;
    }
}
.custom-module-item.selected {
    // border-color: #0883cc;
    .line-i {
        opacity: 1;
    }
}
.custom-module-item:hover {
    .module-tips {
        .txt {
            display: none;
        }
        .operate {
            display: block;
        }
    }
}
</style>