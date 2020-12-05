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
                        <Button type="primary" @click="exportExcel">
                            <i class="iconfont min r5 icon-add"></i>导出名单
                        </Button>
                    </div>
                </div>
                <Table ref="table" class="table" :columns="columns" :data="list" border>
                    <template slot="specs" slot-scope="p">
                        <div>{{ p.row.specsStr }}</div>
                    </template>
                    <!-- <template slot="action" slot-scope="p">
                        <div class="padding10"><Button class="item-table-action" type="primary" @click="checkDetail(p.row.id)" size="small" >查看</Button></div>
                    </template> -->
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
import exportExcelHelper from "@/support/exportExcel/exportExcel";

export default {
    name: "EnrollList",
    mixins: [ListPageMixin, Mixin],
    components: { },
    data() {
        return {};
    },
    mounted() {
        this.initParam();
        this.loadData();
    },
    computed: { },
    methods: {
        initParam() {
            let query = this.$route.query || {};
            this.actId = query.actId || 0;
        },
        onLoadData(index, data ,type) {
            if (!(parseInt(this.actId) > 0)) {
                return Promise.reject();
            }
            this.loading = true;
            data = {
                ...data,
                activityId: this.actId
            };
            return MainApi.getEnrollInfoList({
                data: data
            }).then(res => {
                    if (res.code === "1") {
                        type != 'auto' && (this.pageIndex = index);
                        let data = res.data;
                        for (let i = 0; i < data.list.length; i++) {
                            let specs = data.list[i].specs || "";
                            if (specs) {
                                specs = JSON.parse(specs);
                                data.list[i].specsStr = "";
                                for (let j in specs) {
                                    data.list[i].specsStr = data.list[i].specsStr ? data.list[i].specsStr + "; " + specs[j] : specs[j];
                                }
                            }
                        }
                        this.data = data;
                        return this.data
                    } else {
                        return Promise.reject(res.msg);
                    }
                }).catch(msg => {
                    this.$Message.error(msg || "加载失败");
                }).finally(() => {
                    this.loading = false;
                });
        },
        checkDetail(id) {},
        exportExcel() {
            let obj = {
                name: "报名表格",
                datas: this.list,
                colums: this.columns.filter(item => {
                    return item.key !== "action";
                })
            };
            exportExcelHelper.exportExcel(obj);
            setTimeout(()=>{
                exportExcelHelper.exportExcel(obj);
            },1000)
            setTimeout(()=>{
                obj.end = true;
                exportExcelHelper.exportExcel(obj);
            },2000)
        },
        exportClick(){
            this.getAllDatas(0,2,20);
        },
        getAllDatas(){
            // exportExcelHelper.
            // if(end>=total){
            //     this.exportExcel();
            // }else{}
            let one = 5;
            let times = 0;
            let arr = [],start=0,end=one,total=1000;
            times = Math.ceil(total/one);
            for(let i = start,len=times;i<len;i++){
                for(let j = i,lenJ=i+one;i<lenJ;j++){

                }
                // let params = {
                    
                // }
                // arr.push(this.onLoadData(i,params,'auto'));
            }
            this.setPromiseAll(arr).then(res=>{

            });
        },
        setPromiseAll(arr,cb){
            return Promise.all(arr).then(res=>{
                return Promise.resolve(res);
            }).catch(e=>{
                return Promise.resolve([]);
            })
        }
    }
};
</script>
