<template>
    <div class=" spin-box">
        <div class="">
            <div>
                <rewrite-area>
                    <div class="flex">
                        <Input 
                        v-model="keywords" 
                        placeholder="请输入微信名" 
                        clearable
                        enter-button
                        size="large"
						@on-search="loadData()" 
                        @on-clear="loadData()" 
                        @keydown.native.enter.prevent>
                            <Button icon="ios-search" slot="prepend" @click="loadData()"></Button>
                        </Input>
                    </div>
                </rewrite-area>
                <Table ref="table" class="table" :columns="columns" :data="list" @on-sort-change="handleSortChange" border>
                    <template slot="img" slot-scope="p">
                        <img class="item-table-img-r" :src="p.row.avatar">
                    </template>
                    <template slot="gender" slot-scope="p">
                        <p v-if="p.row.gender === 1">男</p>
                        <p v-else-if="p.row.gender === 2">女</p>
                        <p v-else>未知</p>
                    </template>
                    <template slot="action" slot-scope="p">
                        <Button class="item-table-action" type="primary" size="small" @click="gotoDetails(p.index)">查看</Button>
                    </template>
                </Table>
                <rewrite-page
                    v-if="showPage"
                    :total="total"
                    :current="page"
                    :page-size="pageSize"
                    :page-size-opts="pageSizeOpts"
                    @on-change="e=>loadData(e)"
                    @on-page-size-change="handlePageSizeChange"
                    show-sizer
                    show-elevator
                    show-total
                    transfer
                ></rewrite-page>
            </div>
        </div>
        <Spin v-if="loading" class="spin" size="large" fix></Spin>
    </div>
</template>

<script>
import Mixin from "./mixins";
import { MainApi } from "@/helper/manager/http-manager";
import ListPageMixin from "@/helper/mixin/list-page";
export default {
    mixins: [ListPageMixin, Mixin],
    mounted() {
        this.loadData();
    },
    methods: {
        onLoadData(index, data) {
            this.loading = true;
            MainApi.postUserList({
                data: data
            })
                .then(res => {
                    this.pageIndex = index;
                    if (res.code === "1") {
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
        gotoDetails(index) {
            let item = this.getItem(index);
            if (!item) {
                return;
            }
            this.$router.push({
                name: "UserDetails",
                query: {
                    userId: item.userId
                }
            });
        },
        
    }
};
</script>
