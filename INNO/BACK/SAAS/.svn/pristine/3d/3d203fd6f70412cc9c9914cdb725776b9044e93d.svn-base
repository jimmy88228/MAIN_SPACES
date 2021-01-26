<template>
    <div class="cev-root bg-page spin-box">
        <div class="cev-root" v-bar>
            <div class="bg-shadow padding20 list-box">
                <div class="cev-toolbar">
                    <div class="left">
                        <DatePicker
                            class="inputable date-selecter-range"
                            type="datetimerange"
                            placeholder="修改时间"
                            v-model="dateRange"
                            split-panels
                            clearable
                            transfer
                        />
                        <Input class="inputable" placeholder="标题、索引、编辑者" v-model="keywords" clearable/>
                        <Button type="primary" @click="e=>loadData()">
                            <i class="iconfont min r5 icon-search"></i>搜索
                        </Button>
                    </div>
                    <div class="right">
                        <Button type="primary" :to="{ name: 'ArticleAdd' }" v-if="$store.state.authJson.btn_add_article">新建文章</Button>
                    </div>
                </div>
                <Table ref="table" class="table" :columns="columns" :data="list" @on-sort-change="handleSortChange" border>
                    <template slot="action" slot-scope="p">
                        <Button class="copy-url item-table-action" type="primary" size="small" @click="copyUrl($event,p.index)" v-if="$store.state.authJson.btn_copy_article_url">复制地址</Button>
                        <Button class="item-table-action" type="primary" size="small" @click="edit(p.index)" v-if="$store.state.authJson.btn_edit_article">编辑</Button>
                        <Poptip confirm title="确定删除该文章？" @on-ok="del(p.index)" transfer v-if="$store.state.authJson.btn_remove_article">
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
                />
            </div>
        </div>
        <Spin v-if="loading" class="spin" size="large" fix/>
    </div>
</template>

<script>
import { MainApi, WebApi } from "@/helper/manager/http-manager";
import Clipboard from "clipboard";
import ListPageMixin from "@/helper/mixin/list-page";
import ArticleMixin from "./mixin";
export default {
    name: "NormalArticle",
    mixins: [ListPageMixin, ArticleMixin],
    mounted() {
        this.loadData();
    },
    computed: {
        articleType() {
            return 1;
        }
    },
    methods: {
        onLoadData(index, data) {
            this.loading = true;
            return MainApi.postArticleList({
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
                    this.$Message.error(msg || "数据加载失败");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        copyUrl(e, index) {
            let item = this.getItem(index);
            if (!item) {
                this.$Message.error("复制失败");
                return;
            }

            let artUrl = WebApi.redirectArt.getUrl({
                id: item.id
            });
            let clipboard = new Clipboard(e.target, {
                text: () => artUrl
            });
            clipboard.on("success", e => {
                this.$Message.success("复制成功");
                clipboard.destroy();
            });
            clipboard.on("error", e => {
                this.$Message.error("复制失败");
                clipboard.destroy();
            });
            clipboard.onClick(e);
        },
        edit(index) {
            let item = this.getItem(index);
            if (!item) {
                return;
            }
            this.$router.push({
                name: "ArticleEdit",
                query: {
                    id: item.id
                }
            });
        },
        del(index) {
            let item = this.getItem(index);
            if (!item) {
                return;
            }
            this.loading = true;
            return MainApi.postArticleDel({
                data: {
                    id: item.id
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
                    this.$Message.error(msg || "删除失败");
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>
