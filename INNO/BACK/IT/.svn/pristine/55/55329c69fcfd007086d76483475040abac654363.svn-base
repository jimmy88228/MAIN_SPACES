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
                    <div class="right">
                        <Button type="primary" @click="createAct">
                            <i class="iconfont min r5 icon-add"></i>创建活动
                        </Button>
                    </div>
                </div>
                <Table ref="table" class="table" :columns="columns" :data="list" border>
                    <template slot="detail" slot-scope="p">
                        <div class="flex-">
                            <img class="item-table-inline-img" :src="p.row.picture" />
                            <div class="padding-left-20 text-align-l">
                                <div>{{ p.row.name }}</div>
                                <div class="padding-top-10">{{ p.row.dateStr }}</div>
                            </div>
                        </div>
                    </template>
                    <template slot="state" slot-scope="p">
                        <span>{{ actStateConf[p.row.state] }}</span>
                    </template>
                    <template slot="action" slot-scope="p">
                        <div class="padding-top-10"><Button class="item-table-action" type="primary" size="small" @click="editAct(p.row.id)">编辑</Button></div>
                        <div class="padding-top-10"><Button class="item-table-action" type="primary" size="small" @click="getEnroll(p.row.id)">查看名单</Button></div>
                        <div class="padding-top-10">
                            <Poptip confirm title="确定删除该活动" @on-ok="deleteAct(p.row)">
                                <Button class="item-table-action" size="small" type="primary" >删除</Button>
                            </Poptip>
                        </div>
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
        <Spin v-if="loading" class="spin" size="large" fix></Spin>
    </div>
</template>

<script>
import { MainApi } from "@/helper/manager/http-manager";
import ListPageMixin from "@/helper/mixin/list-page";
import Mixin from "./mixin";
import dateUtil from "@/helper/utils/date-util";

export default {
    name: "ActivityLottery",
    mixins: [ListPageMixin, Mixin],
    components: {},
    data() {
        return {
            keywords: "",
            actStateConf: {
                0: "未开始",
                1: "进行中",
                2: "已过期",
                3: "已关闭"
            }
        };
    },
    mounted() {
        this.loadData();
    },
    methods: {
        
        onLoadData(index, data) {
            this.loading = true;
            data = {
                stime: "",
                etime: "",
                keywords: this.keywords,
                orderBy: "",
                ...data
            };
            MainApi.postSpecialList({
                data: data
            })
                .then(res => {
                    if (res.code === "1") {
                        this.pageIndex = index;
                        this.data = res.data;
                        for(let i = 0,len=this.list.length;i<len;i++){
                            this.list[i].dateStr = dateUtil.format(dateUtil.parse(this.list[i].startTime || ""),"yyyy-MM-dd") + ' - ' + dateUtil.format(dateUtil.parse(this.list[i].endTime || "") , "yyyy-MM-dd")
                        }
                        return Promise.resolve(res.data);
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    this.$Message.error(msg || "加载失败");
                    return Promise.reject();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        createAct() {
            this.$router.push({
                name: "ChosenOneNew",
                query: {
                    id: 0
                }
            });
        },
        editAct(id) {
            if (!id) return;
            this.$router.push({
                name: "ChosenOneEdit",
                query: {
                    actId: id
                }
            });
        }, 
        deleteAct(item) {
            console.log(item);
            if (!item.id) return;
            this.loading = true;
            let _data = {activityId: item.id};
            this.netData(MainApi,"postSpecialDelete",_data).then(res=>{
                this.$Message.success("删除成功");
                this.list.splice(item._index ,1);
            });
        }, 
        getEnroll(id) {
            if (!id) return;
            this.$router.push({
                name: "ChosenOneEnrollList",
                query: {
                    actId: id
                }
            });
        },
        
        netData(api,url,data){
            if(!api || !url || !data){
                return Promise.reject();
            }
            return api[url]({
                        data : data
                    })
                    .then(res => {
                        if (res.code === "1") {
                            return Promise.resolve(res.data);
                        } else {
                            return Promise.reject(res.msg);
                        }
                    })
                    .catch(msg => {
                        this.$Message.error(msg || "加载失败");
                        return Promise.reject();
                    })
                    .finally(() => {
                        this.loading = false;
                    });
        }
    }
};
</script> 