<template>
    <div class="cev-root bg-page spin-box">
        <div class="cev-root" v-bar>
            <div class="bg-shadow padding20 list-box">
                <div class="cev-toolbar">
                    <div class="left">
                        <Input class="inputable" placeholder="请输入搜索内容" v-model="keywords" clearable/>
                        <Button type="primary" @click="e=>loadData()">
                            <i class="iconfont min r5 icon-search"></i>搜索
                        </Button>
                    </div>
                    <div class="right" v-if="true">
                        <Button type="primary" @click="addAd">
                            <i class="iconfont min r5 icon-add"></i>添加布局
                        </Button>
                    </div>
                </div>
                <Table ref="table" class="table" :columns="columns" :data="list" border>
                    <template slot="action" slot-scope="p">
                        <Button class="item-table-action" type="primary" size="small" @click="edit(p.index)">编辑</Button>
                        <Poptip confirm title="确定删除该布局？" @on-ok="del(p.index)" transfer>
                            <Button class="item-table-action" type="error" size="small">删除</Button>
                        </Poptip>
                    </template>
                </Table>
                <Page
                    v-if="showPage"
                    :total="count"
                    :current="pageIndex"
                    :page-size="pageSize"
                    :page-size-opts="pageSizeOpts"
                    @on-change="e=>loadData(e)"
                    @on-page-size-change="handlePageSizeChange"
                    show-sizer
                    show-elevator
                    show-total
                    transfer
                ></Page>
            </div>
        </div>
        <EditDialog ref="editDialog" v-on:update:layoutNames="updateLayoutNames"/>
        <Spin v-if="loading" class="spin" size="large" fix></Spin>
    </div>
</template>

<script>
import EditDialog from "../../components/edit-dialog";
import { MainApi } from "@/helper/manager/http-manager";
import ListPageMixin from "@/helper/mixin/list-page";
import StringHelper from "@/helper/utils/string-util";
import Mixin from "./mixin";
export default {
    name: "CustomLayout",
    mixins: [ListPageMixin, Mixin],
    components: { EditDialog },
    data() {
        return {
            keywords: ""
        };
    },
    mounted() {
        this.loadData();
    },
    methods: {
        onLoadData(index, data) {
            this.loading = true;
            MainApi.getLayoutList({
                data: data
            })
                .then(res => {
                    if (res.code === "1") {
                        this.pageIndex = index;
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

        addAd() {
            this.$refs.editDialog.show();
        },
        edit(index) {
            let item = this.getItem(index);
            if (!item) {
                return;
            }
            this.$router.push({
                name: "CustomModuleList",
                query: {
                    id: item.layoutId
                }
            });
        },
        del(index) {
            let item = this.getItem(index);
            if (!item) {
                return;
            }
            this.loading = true;
            MainApi.deleteLayout({
                data: {
                    layoutId: item.layoutId
                }
            })
                .then(res => {
                    if (res.code === "1") {
                        this.$Message.success("删除成功");
                        return this.handleUpdate();
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    if (StringHelper.trim(msg)) {
                        this.$Message.error(msg || "加载失败");
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        updateLayoutNames(layoutNames) {
            if (layoutNames.layoutName === "") {
                this.$Message.error("布局名不能为空");
                return;
            }
            // if (layoutNames.layoutIndexName === "") {
            //     this.$Message.error("索引名不能为空");
            //     return;
            // }
            this.loading = true;
            MainApi.addLayout({
                data: {
                    name: layoutNames.layoutName,
                    indexName: layoutNames.layoutIndexName
                }
            })
                .then(res => {
                    if (res.code === "1") {
                        this.$router.push({
                            name: "CustomModuleList",
                            query: {
                                id: res.data
                            }
                        });
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
