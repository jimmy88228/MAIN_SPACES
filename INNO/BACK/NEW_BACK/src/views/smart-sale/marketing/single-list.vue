<template>
    <Card class="span-parent">
        <searhForm @search="searchMarket" @create="createMarket" :canCreate="canCreate"></searhForm>
        <Table :loading="tableLoading" :height="tableHeight" :columns="columns"  :data="tableData" ref="myTable">
            <template slot-scope="{ row }" slot="action">
                <div class="v-lines">
                    <template v-if="row.handle.view"><a @click="checkMarket(row.id)">查看</a><Divider class="v-line" type="vertical" /></template>
                    <template v-if="row.handle.issue">
                        <Poptip
                        transfer
                        confirm
                        placement="right"
                        v-if="row.status_str == '未发布'"
                        title="您确定要发布该方案吗？发布后可以停止该方案"
                        @on-ok="issueMarket(row.id, 1)">
                            <a >发布</a>
                        </Poptip>
                        <Poptip
                        transfer
                        confirm
                        placement="right"
                        v-else-if="row.status == 1"
                        title="您确定要停止该方案吗？停止后，将不能恢复运行哦"
                        @on-ok="issueMarket(row.id, 3)">
                            <a >停止</a>
                        </Poptip>
                        <Divider class="v-line" type="vertical" />
                    </template>
                    <template v-if="row.handle.remove && row.status != 1">
                        <Poptip
                        transfer
                        confirm
                        placement="right"
                        title="您确定要删除该方案吗？删除后将不能查看该方案的数据"
                        @on-ok="removeMarket(row.id)">
                            <a>删除</a>
                        </Poptip>
                        <Divider class="v-line" type="vertical" />
                    </template>
                </div>
            </template>
        </Table>
        <div v-show="pageTotal" class="list_page">
            <Page
            :total="pageTotal"
            :page-size="pageSize"
            :current="currentPage"
            :page-size-opts="pageSizeOpts"
            @on-change="e => changePage(e)"
            @on-page-size-change="ps => handlePageSize(ps)"
            show-elevator
            show-total
            show-sizer></Page>
        </div>
        <spin v-if="showSpan" :fix="true"></spin>
        <!--异步处理导出excel组件-->
        <!-- <div class="col">
            <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
        </div> -->
  </Card>
</template>
<script>
    import util from '@/libs/util.js';
    import PageHelper from '@/libs/page-helper.js';
    import mixin from "./mixins/single.js";
    import searhForm from "./component/searhForm"
    export default {
        name:"smartSingleList",
        mixins: [ PageHelper, mixin],
        components: {
            searhForm
        },
        data(){
            return {
                formSearch:{},
                canCreate: {},
                showSpan: false
            }
        },
        mounted(){
            this.loadData();
        },
        methods: {
            onLoadData(page, reqData){
                this.showSpan = true;
                return util.ajax.post(util.apiUrl.OnceMarketingList, {
                    searchq: this.formSearch.searchq || "",
                    ...reqData
                }).then(e =>{
                    let res = e.data || {};
                    if(res.code) {
                        let data = res.data || {};
                        let items = data.items || [];
                        this.canCreate = data.canCreate;
                        this.data = {
                            items: items,
                            total: data.total
                        }
                    }
                }).finally(()=>{
                    this.showSpan = false
                })
            },
            removeMarket(id){
                if(!id) return;
                this.showSpan = true;
                return util.ajax.post(util.apiUrl.OnceMarketingRemove, {
                    id: id
                }).then(e =>{
                    let res = e.data || {};
                    if(res.code) {
                        this.loadData();
                        this.$Message.info(res.message);   
                    } else {
                        this.$Message.warning(res.message); 
                    }
                }).finally(()=>{
                    this.showSpan = false
                })
            },
            issueMarket(id, type){
                if(!id) return;
                this.showSpan = true;
                return util.ajax.post(util.apiUrl.OnceMarketingissue, {
                    id: id,
                    status: type
                }).then(e =>{
                    let res = e.data || {};
                    if(res.code) {
                        this.loadData();
                        this.$Message.info(res.message);   
                    } else {
                        this.$Message.warning(res.message); 
                    }
                }).finally(()=>{
                    this.showSpan = false
                })
            },
            
            searchMarket(data){
                this.formSearch = data || {};
                console.log("formSearch", this.formSearch)
                this.loadData();
            },
            checkMarket(id){
                if(!id) return;
                console.log("id",id)
                this.$router.push({
                    name: "smart-market",
                    query: {
                        id: id,
                        type: "single"
                    }
                })
            },
            createMarket(){
                this.$router.push({
                	name: "smart-market",
                	query:{
                		type: "single"
                	}
                })
            }
        }
    }
</script>