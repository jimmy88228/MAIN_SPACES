<template>
    <div class="bg-page cev-root spin-box flex-column">
        <div class="cev-root bg-shadow padding10 flex-auto tabs-box">
            <div class="tabs">
                <div class="tabs-header">
                    <div class="tabs-name" :class="{'selected':nowTabs===0}" @click="selectTab(0)">基础设置</div>
                    <div class="tabs-name" :class="{'selected':nowTabs===1}" @click="selectTab(1)">编辑模块</div>
                </div>
                <div class="tabs-content-box">
                    <div class="tabs-content">
                        <transition
                            :enter-active-class="oldNowTabs>nowTabs?'slideInLeft':'slideInRight'"
                            :leave-active-class="oldNowTabs>nowTabs?'slideOutRight':'slideOutLeft'"
                        >
                            <div class="tabs-page animated" v-if="nowTabs===0" key="base">
                                <div class="edit-body cev-max-width">
                                    <EditItem name="是否启用" label="必填">
                                        <i-switch slot="edit" v-model="enable">
                                            <span slot="open">开</span>
                                            <span slot="close">关</span>
                                        </i-switch>
                                    </EditItem>
                                    <EditItem name="是否测试" label="必填">
                                        <i-switch slot="edit" v-model="isTest">
                                            <span slot="open">开</span>
                                            <span slot="close">关</span>
                                        </i-switch>
                                    </EditItem>
                                    <EditItem name="模块名" label="必填">
                                        <Input slot="edit" size="large" v-model="layoutName" clearable/>
                                    </EditItem>
                                    <EditItem name="排序" description="数字越大，排序越靠前">
                                        <InputNumber slot="edit" size="large" v-model="sort" clearable/>
                                    </EditItem>
                                </div>
                            </div>
                            <div class="tabs-page animated" v-else-if="nowTabs===1" key="detail">
                                <ModuleEditPanel :module-node="moduleNode"/>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-bottom-toolbar flex-fixed padding10">
            <div class="cev-toolbar end cev-max-width">
                <Button size="large" type="primary" @click.native="submit">保存</Button>
            </div>
        </div>
        <Spin v-if="loading" class="spin" size="large" fix></Spin>
    </div>
</template>
<script>
import EditItem from "@/support/components/edit-item";
import ModuleEditPanel from "../components/panel-module-edit";
import { MainApi } from "../../../helper/manager/http-manager";
import LayoutUtils from "../components/helper/utils.js";
import StringHelper from "@/helper/utils/string-util";

export default {
    name: "CustomModuleEdit",
    data() {
        return {
            loading: false,
            isShow: true,
            data: null,
            url: null,
            layoutName: "",
            layoutStatName: "",
            sort: 0,
            enable: false,
            isTest: false,
            moduleNode: null,
            oldNowTabs: 0,
            nowTabs: 0
        };
    },

    components: { EditItem, ModuleEditPanel },
    mounted() {
        this.moduleNode = LayoutUtils.createRootNode();
        this.layoutModelId && this.loadData();
    },
    computed: {
        layoutId() {
            return this.$route.query.layoutId;
        },
        layoutModelId() {
            return this.$route.query.layoutModelId;
        }
    },
    methods: {
        selectTab(index) {
            this.oldNowTabs = this.nowTabs;
            this.nowTabs = index;
        },
        getUrl(urls) {
            this.url = urls;
        },
        check() {
            if (!StringHelper.trim(this.layoutName)) {
                this.showError("模块名不能为空");
                return false;
            }
            return true;
        },
        showError(err) {
            this.$Message.error(err);
        },
        submit() {
            if (!this.check()) {
                this.selectTab(0);
                return;
            }
            if (!LayoutUtils.check(this.moduleNode, this.showError)) {
                this.selectTab(1);
                return;
            }
            this.loading = true;
            const requestInterface = this.layoutModelId
                ? MainApi.updateLayoutModel
                : MainApi.addLayoutModel;
            const data = this.layoutModelId
                ? {
                      layoutModelId: this.layoutModelId,
                      name: this.layoutName,
                      layoutJson: LayoutUtils.nodeToJson(this.moduleNode),
                      statName: this.layoutStatName,
                      sort: this.sort,
                      enable: this.enable ? 1 : 0,
                      isTest: this.isTest ? 1 : 0
                  }
                : {
                      layoutId: this.layoutId,
                      name: this.layoutName,
                      layoutJson: LayoutUtils.nodeToJson(this.moduleNode),
                      statName: this.layoutStatName,
                      sort: this.sort,
                      enable: this.enable ? 1 : 0,
                      isTest: this.isTest ? 1 : 0
                  };
            return requestInterface({
                data: data
            })
                .then(res => {
                    if (res.code === "1") {
                        this.$Message.success(res.msg || "提交成功");
                        this.$router.back();
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    if (StringHelper.trim(msg)) {
                        this.$Message.error(msg || "数据加载失败");
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        loadData() {
            this.loading = true;
            return MainApi.getLayoutModelDetail({
                data: {
                    layoutModelId: this.layoutModelId
                }
            })
                .then(res => {
                    if (res.code === "1") {
                        this.layoutName = res.data.name || "";
                        this.layoutStatName = res.data.statName || "";
                        this.sort = res.data.sort || 0;
                        this.enable = !!res.data.enable;
                        this.isTest = !!res.data.isTest;
                        this.moduleNode = LayoutUtils.JsonToNode(
                            res.data.layoutJson
                        );
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    if (StringHelper.trim(msg)) {
                        this.$Message.error(msg || "数据加载失败");
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>

<style lang="less" scoped >
    .tabs-box {
        height: 100%;
        display: flex;
        flex-direction: column;
        > * {
            flex: none;
        }
    }
    .tabs {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        .tabs-header {
            width: 100%;
            display: flex;
            border-bottom: 1px solid #efefef;
            .tabs-name {
                height: 40px;
                line-height: 40px;
                padding: 0 20px;
                cursor: pointer;
            }
            .tabs-name.selected {
                color: #2d8cf0;
                border-bottom: 2px solid #2d8cf0;
            }
        }
        .tabs-content-box {
            margin-top: 10px;
            position: relative;
            overflow: hidden;
            width: 100%;
            height: 100%;
            .tabs-content {
                position: absolute;
                display: flex;
                overflow: hidden;
                width: 100%;
                height: 100%;
                .tabs-page {
                    animation-duration: 0.3s;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
            }
        }
    }
</style>
