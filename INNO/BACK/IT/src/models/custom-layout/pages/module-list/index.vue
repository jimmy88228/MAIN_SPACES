<template>
    <div class="cev-root bg-page spin-box padding10">
        <div class="layout-box bg-card padding20">
            <LayoutPreview ref="layoutPreview" :module-list="list"/>
        </div>
        <div class="bg-card layout-module-list-box padding20">
            <EditItem name="布局名" label="必填">
                <Input slot="edit" size="large" v-model="layoutName" clearable/>
            </EditItem>
            <EditItem name="索引名" label="非必填">
                <Input slot="edit" size="large" v-model="layoutIndexName" clearable/>
            </EditItem>
            <div class="cev-toolbar end">
                <Button size="large" type="primary" @click="gotoAdd">
                    <i class="iconfont min r5 icon-add"></i>添加模块
                </Button>
            </div>
            <div id="layout-module-list" class="layout-module-list" v-bar>
                <Table ref="table" class="point-table" style="position: static;" :columns="columns" :data="list" border @on-row-click="selectRow">
                    <template slot="test" slot-scope="p">
                        <i-switch class="item-table-action" type="primary" :value="p.row.isTest!=0" @on-change="e=>updateBool(p.index,'isTest',e)">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </template>
                    <template slot="enable" slot-scope="p">
                        <i-switch class="item-table-action" type="primary" :value="p.row.enable!=0" @on-change="e=>updateBool(p.index,'enable',e)">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </template>
                    <template slot="action" slot-scope="p">
                        <Button class="item-table-action" type="primary" size="small" @click="edit(p.index)">编辑</Button>
                        <Poptip confirm title="确定删除该模块？" @on-ok="del(p.index)" transfer>
                            <Button class="item-table-action" type="error" size="small">删除</Button>
                        </Poptip>
                    </template>
                </Table>
            </div>
            <div class="cev-toolbar end">
                <Button size="large" type="primary" @click.native="submit">保存</Button>
            </div>
        </div>
        <Spin v-if="loading" class="spin" size="large" fix></Spin>
    </div>
</template>

<script>
import { MainApi } from "@/helper/manager/http-manager";
import ListPageMixin from "@/helper/mixin/list-page";
import EditItem from "@/support/components/edit-item";
import LayoutPreview from "../../components/preview-layout";
import LayoutUtils from "../../components/helper/utils.js";
import Mixin from "./mixin";

export default {
    name: "CustomModuleList",
    mixins: [ListPageMixin, Mixin],
    components: { EditItem, LayoutPreview },
    data() {
        return {};
    },
    mounted() {
        this.loadData();
    },

    computed: {
        layoutId() {
            return this.$route.query.id;
        },
        mainData: {
            get() {
                return this.data || {};
            },
            set(val) {
                this.vueDataMerge(this.data || (this.data = {}), val);
            }
        },
        layoutName: {
            get() {
                return this.mainData.name || "";
            },
            set(val) {
                this.mainData = { name: val || "" };
            }
        },
        layoutIndexName: {
            get() {
                return this.mainData.indexName || "";
            },
            set(val) {
                this.mainData = { indexName: val || "" };
            }
        }
    },
    methods: {
        loadData() {
            this.loading = true;
            MainApi.getLayoutDetail({
                data: {
                    layoutId: this.layoutId
                }
            })
                .then(res => {
                    if (res.code === "1") {
                        res.data.list = res.data.layoutModelList.map(item => {
                            return {
                                ...item,
                                layoutId: this.layoutId,
                                moduleNode: LayoutUtils.JsonToNode(
                                    item.layoutJson
                                )
                            };
                        });
                        delete res.data.layoutModelList;
                        this.data = res.data;
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    this.$Message.error(msg || "加载失败");
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        selectRow(row, index) {
            this.$refs.layoutPreview.selectedModule(index);
        },
        gotoAdd() {
            this.$router.push({
                name: "CustomModuleEdit",
                query: {
                    layoutId: this.layoutId
                }
            });
        },
        edit(index) {
            let item = this.getItem(index);
            if (!item) {
                return;
            }
            this.$router.push({
                name: "CustomModuleEdit",
                query: {
                    layoutModelId: item.layoutModelId || "0"
                }
            });
        },
        updateBool(index, name, val) {
            let item = this.getItem(index);
            if (!item) {
                return;
            }
            let _val = val ? 1 : 0;
            item[name] = _val;
            this.$nextTick(() => {
                item[name] = val ? 0 : 1;
                return this.update(item.layoutModelId, { [name]: _val }).then(
                    e => e && (item[name] = _val)
                );
            });
        },
        update(id, data) {
            this.loading = true;
            return MainApi.updateLayoutModel({
                data: {
                    layoutModelId: id,
                    ...data
                }
            })
                .then(res => {
                    if (res.code === "1") {
                        this.$Message.success("修改成功");
                        return this.loadData();
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    this.$Message.error(msg || "修改失败");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        del(index) {
            let item = this.getItem(index);
            if (!item) {
                return;
            }
            this.loading = true;
            MainApi.deleteLayoutModel({
                data: {
                    layoutModelId: item.layoutModelId
                }
            })
                .then(res => {
                    if (res.code === "1") {
                        this.$Message.success("修改成功");
                        this.loadData();
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    this.$Message.error(msg || "修改失败");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        submit() {
            if (this.layoutName === "") {
                this.$Message.error("布局名不能为空");
                return;
            }
            // if (this.layoutIndexName === "") {
            //     this.$Message.error("索引名不能为空");
            //     return;
            // }
            this.loading = true;
            MainApi.updateLayout({
                data: {
                    layoutId: this.layoutId,
                    name: this.layoutName,
                    indexName: this.layoutIndexName
                }
            })
                .then(res => {
                    if (res.code === "1") {
                        this.$Message.success(res.msg || "提交成功");
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    this.$Message.error(msg || "加载失败");
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>
<style lang="less">
    #layout-module-list {
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
    }
    #layout-module-list .ivu-table-header {
        top: -1px;
        position: absolute;
        z-index: 1;
    }
    #layout-module-list .ivu-table::after,
    #layout-module-list .ivu-table::before {
        display: none;
    }
    #layout-module-list .ivu-table-body {
        margin-top: 38px;
    }
</style>

<style lang="less"  scoped>
    .cev-root {
        display: flex;
        flex-direction: row;
    }
    .layout-box {
        width: auto;
        height: 100%;
        display: inline-block;
        flex: none;
    }
    .layout-module-list-box {
        flex: 1;
        min-width: 750px;
        margin-left: 10px;
        height: 100%;
        > * {
            margin-top: 10px;
            flex: none;
        }
        display: flex;
        flex-direction: column;
    }
    .layout-module-list {
        flex: 1;
    }
</style>
