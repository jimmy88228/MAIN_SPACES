<template>
    <div class="bg-page cev-root spin-box flex-column">
        <div class="cev-root bg-shadow padding10 flex-auto tabs-box">
            <div class="tabs">
                    <Tabs :value="currentTab" type="card" @on-click="selectTab">
                        <TabPane label="基础设置" name="base" >
                            <div class="tabs-page">
                                <div class="edit-body cev-max-width">
                                    <div class="edit-title">活动信息</div>
                                    <EditItem name="活动名称" label="必填">
                                        <Input class="input-large" slot="edit" size="large" v-model="mainData.activityName" clearable/>
                                    </EditItem>
                                    <EditItem name="活动时间" label="必填">
                                        <span slot="edit">
                                            <DatePicker class="inputable date-selecter-range" size="large" type="datetimerange" placeholder="活动时间" v-model="activityTime"></DatePicker>
                                        </span>
                                    </EditItem>
                                    <EditItem name="活动规则" label="必填">
                                        <Select slot="edit" style="width:100px;" v-model="mainData.ruleArticleId">
                                            <Option :value="item.id" v-for="(item, index) in ruleList" :key="index">{{ item.name }}</Option>
                                        </Select>
                                    </EditItem>
                                    <EditItem name="活动公告"  full label="没有参与资格的用户进入后浏览到的内容">
                                        <div slot="edit">
                                            <Editor ref="editor" v-model="mainData.content"></Editor>
                                        </div>
                                    </EditItem>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane label="活动详情" name="detail">
                                <div class="cev-max-width">
                                    <EditItem name="活动图片" description="">
                                        <UploadImage slot="edit" :imgs.sync="mainData.picture" type="SPECIAL_ACTIVITY" single></UploadImage>
                                    </EditItem>
                                </div>
                                <div class="edit-title cev-max-width module_title" style="margin:20px auto;">自定义页编辑</div>
                                <ModuleEditPanel :module-node="moduleNode" class="cev-max-width module_box"/>
                        </TabPane>
                    </Tabs>
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
import { MainApi } from "@/helper/manager/http-manager";
import Editor from "@/components/editor/index";
import StringHelper from "@/helper/utils/string-util";
import UploadImage from "@/components/upload-img-group";
import ModuleEditPanel from "@/models/custom-layout/components/panel-module-edit";
import dateUtil from "@/helper/utils/date-util";
import LayoutUtils from "@/models/custom-layout/components/helper/utils.js";

export default {
    name: "ActvityEdit",
    data() {
        return {
            data: null,
            loading: false,
            moduleNode: null,
            ruleList: [],
            currentTab: "base",
            showStatusList: [
                { id: 0, label: "展示" },
                { id: 1, label: "不展示" },
                { id: 2, label: "测试环境展示" }
            ],
            mainData: {
                picture: "",
                activityName: "",
                content: "",
                ruleArticleId: "",
                modelList: [],
                startTime: "",
                endTime: ""
            }
        };
    },

    components: { EditItem, Editor, UploadImage, ModuleEditPanel },
    mounted() {
        this.isAdd = !!Number(this.$route.meta.isAdd);
        this.actId = this.$route.query.actId || 0;
        this.moduleNode = LayoutUtils.createRootNode();
        this.getRuleList();
        this.loadData();
    },
    computed: {
        activityTime: {
            get() {
                return [this.mainData.startTime, this.mainData.endTime];
            },
            set(val) {
                this.mainData.startTime = val[0] && dateUtil.format(val[0]);
                this.mainData.endTime = val[1] && dateUtil.format(val[1]);
            }
        }
    },
    methods: {
        selectTab(e) {
            this.currentTab = e;
        },
        resetContent() {
            if (this.nowTabs === 0) {
                this.$nextTick(() => {
                    this.$refs.editor.resetContent(this.content);
                });
            }
        },
        check() {
            let name = "";
            if (!StringHelper.trim(this.mainData.activityName)) {
                name = "活动名不能为空";
            } else if (!this.activityTime || !this.mainData.startTime || !this.mainData.endTime) {
                name = "请选择活动时间";
            } else if (!this.mainData.ruleArticleId) {
                name = "请选择规则";
            }
            name && this.showError(name);
            return !name; // (name ? false : true);
        },
        showError(err) {
            this.$Message.error(err);
        },
        submit() {
            if (!this.check()) {
                this.checkJump(1);
                return;
            }
            if (!LayoutUtils.check(this.moduleNode, this.showError)) {
                this.checkJump(2);
                return;
            }
            this.mainData.modelList = this.formatCustomData();
            let data = {
                name: this.mainData.activityName,
                picture: this.mainData.picture,
                startTime: this.mainData.startTime,
                endTime: this.mainData.endTime,
                detail: this.mainData.content,
                ruleArtId: this.mainData.ruleArticleId,
                modelList: this.mainData.modelList
            };
            let url = this.isAdd ? "postSpecialAdd" : "postSpecialUpdate";
            if (this.isAdd) {
                data = {
                    ...data
                };
            } else {
                if (!this.actId) {
                    this.showError("活动信息异常");
                    return;
                }
                 data = {
                    activityId: this.actId,
                    ...data
                };
            }
            return this.netData(MainApi, url, data).then(res => {
                this.$Message.success("保存成功");
                this.$router.back();
            });
        },
        checkJump(index) {
            this.selectTab(index === 1 ? "base" : "detail");
        },
        formatCustomData() {
            let extra = this.isAdd ? {} : { editType: 1, modelId: this.modelId };
            return [{
                name: "customModel",
                enable: 1,
                sort: 0,
                layoutJson: (this.moduleNode && LayoutUtils.nodeToJson(this.moduleNode)) || "",
                ...extra
            }];
            // return (true || this.moduleNode.data && this.moduleNode.data.child) ? [{
            //     name: "customModel",
            //     enable: 1,
            //     sort: 0,
            //     layoutJson: (this.moduleNode && LayoutUtils.nodeToJson(this.moduleNode)) || "",
            //     ...extra
            // }] : [];
        },
        getRuleList() {
            this.loading = true;
            let _data = {
                stime: "",
                etime: "",
                pageIndex: 1,
                pageSize: 100,
                keywords: "",
                orderBy: ""
            };
            return this.netData(MainApi, "postArticleList", _data).then(res => {
                this.ruleList = res.list || [];
            });
        },
        loadData() {
            if (this.isAdd || !this.actId) {
                !this.isAdd && !this.actId && this.showError("活动信息异常");
                return Promise.reject();
            }
            let _data = { activityId: this.actId };
            return this.netData(MainApi, "postSpecialDetails", _data).then(res => {
                this.mainData.picture = res.picture || "";
                this.mainData.activityName = res.name || "";
                this.mainData.content = res.detail || "";
                this.moduleNode = LayoutUtils.JsonToNode(
                    res.modelList[0].layoutJson
                );
                this.modelId = res.modelList[0].modelId || 0;
                this.mainData.modelList = res.modelList || [];
                this.mainData.ruleArticleId = res.ruleArtId || 0;
                this.mainData.startTime = res.startTime;
                this.mainData.endTime = res.endTime;
            });
        },
        netData(api, url, data) {
            if (!api || !url || !data) {
                return Promise.reject();
            }
            return api[url]({
                        data: data
                    }).then(res => {
                        if (res.code === "1") {
                            return Promise.resolve(res.data);
                        } else {
                            return Promise.reject(res.msg);
                        }
                    }).catch(msg => {
                        this.$Message.error(msg || "加载失败");
                        return Promise.reject();
                    }).finally(() => {
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
        .ivu-tabs-content{
            .ivu-tabs-tabpane{
                .tabs-page{
                    height:calc(100vh - 220px);
                    overflow-y: scroll;
                    overflow-x: hidden;
                } 
            }
            
        }
    }
    .module_box{
        height: 90%;
    }
</style>
