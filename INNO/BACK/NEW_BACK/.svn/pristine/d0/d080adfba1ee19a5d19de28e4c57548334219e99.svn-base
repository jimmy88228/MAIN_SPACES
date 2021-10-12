<template>
    <Card class="">
        <Table :loading="tableLoading" :height="tableHeight" :columns="columns"  :data="tableData" ref="myTable">
            <template slot-scope="{ row }" slot="handle">
                <a v-if="row.handle.state" @click="handleState(row.id)">运行</a> <span v-if="row.handle.state" style="color:	#F5F5F5;"> | </span> <a v-if="row.handle.remove" @click="handleRemove(row.id)">删除</a>
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
        <!--异步处理导出excel组件-->
        <!-- <div class="col">
            <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
        </div> -->
  </Card>
</template>
<script>
    import util from '@/libs/util.js';
    import PageHelper from '@/libs/page-helper.js';
    import mixins from "./mixins.js";
    // import searhForm from "./component/searhForm"
    export default {
        name:"",
        mixins: [ PageHelper, mixins],
        components: {
            
        },
        data(){
            return {
                data:[],
            }
        },
        mounted(){
            this.loadData();
        },
        methods: {
            searchMarket(data){
                console.log(data);
            },
            onLoadData (page, data) {
                return this.$ajax.post(this.$api.QuickTaskList, {
                    ...data
                })
                .then(response => {
                    const res = response.data;
                    if (res.code) {
                        this.data = res.data;
                    }
                });
            },
            handleState(id){
                this.tableLoading = true;
                return this.$ajax.post(this.$api.QuickTaskState, {
                    id:id
                })
                .then(response => {
                    const res = response.data;
                    if (res.code) {
                        this.$Message.success('运行成功!');
                        this.loadData();
                    }else{
                        this.$Message.error(res.message);
                        this.tableLoading = false;
                    }
                });
            },
            handleRemove(id){
                this.tableLoading = true;
                return this.$ajax.post(this.$api.QuickTaskRemove, {
                    id:id
                })
                .then(response => {
                    const res = response.data;
                    if (res.code) {
                        this.$Message.success('移除成功!');
                        this.loadData();
                    } else {
                        this.$Message.error(res.message);
                        this.tableLoading = false;
                    }
                });
            }
        }
    }
</script>