<template>
    <!-- <Card> -->
        <PageTopBase>
            <div slot="action">
                <Button type="primary" @click="handleExport">导出</Button>
            </div>
            <user-list-form
            @on-searchCallback="searchReq"
            @on-sendCouponCallback="sendCouponReq"
            @on-sendWechatCallback="sendWechatReq"
            type="base"
            ></user-list-form>
            <Table 
            row-key="id" 
            :height="tableHeight" 
            :columns="columns" 
            :data="tableData" 
            ref="myTable"
            >
                <template slot-scope="{ row }" slot="real_name">
                    <div class="img_list_wrap">
                        <div class="img_fixed">
                            <img :src="row.portrait_path" v-if="row.portrait_path" :alt="row.real_name" v-viewer/>
                            <img src="@rs/images/default-img.jpg" :alt="row.real_name" v-viewer v-else></img>
                        </div>
                    </div>
                </template>
                <template slot-scope="{ row }" slot="weixin_subscribe">
                    <Icon type="ios-close-circle-outline" size="30" color="#CE3636" v-if="row.weixin_subscribe == '1'"/>
                    <Icon type="ios-checkmark-circle-outline" size="30" color="#52BD80" v-else/>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <a @click="getUserDetail(row.user_id)">详情</a>
                </template>
            </Table>
            <div class="list_page">
            <Page
                :total="pageTotal"
                :page-size="pageSize"
                :current="currentPage"
                :page-size-opts="pageSizeOpts"
                @on-change="changePage"
                @on-page-size-change="handlePageSize"
                show-total
                show-elevator
                show-sizer></Page>
            </div>
            <!--异步处理导出excel组件-->
            <div class="col">
                <notice :ref="'notice' + item" @finish="loadData" v-for="item in jobIdCol" :key="item"></notice>
            </div>
            <Spin fix v-if="showSpan"></Spin>
        </PageTopBase>
    <!-- </Card> -->
</template>
<script>
    import util from '@/libs/util.js';
    import PageHelper from '@/libs/page-helper.js';
    import mixin from '../mixins/baseMemberMixin.js';
    import PageTopBase from '@/views/my-components/page-top-base/index';
    import userListForm from '@/views/smart-sale/components/user-list-form';
    import notice from '@/views/my-components/mq-notice/mq-notice';
    export default{
        name: 'manualLabelUserList',
        mixins: [PageHelper, mixin],
        components: {
            PageTopBase,
            userListForm,
            notice
        },
        data(){
            return {
                formData: {
                    searchq: ""
                },
                tag_id: 0,
                showSpan: false,
                jobIdCol: []
            }
        },
        mounted(){
            this.initParams();
		    this.loadData();
        },
        methods: {
            initParams(){
                let query = this.$route.query || {};
                this.tag_id = query.tag_id;
            },
            onLoadData(page, reqData){
                if(!this.tag_id) return;
                this.showSpan = true;
                reqData = {
                    ...reqData,
                    tag_id: this.tag_id,
                    searchq: this.formData.searchq
                }
                return util.ajax.post(util.apiUrl.ConsumeLabelUserList, reqData).then(e =>{
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
            searchReq(searchq){
                this.formData.searchq = searchq;
                this.loadData();
            },
            sendCouponReq(data){
                consumeLabelUserSend.call(this, data);
            },
            sendWechatReq(data){
                console.log("dadada", data);
                consumeLabelUserSend.call(this, data);
            },
            getUserDetail(userId){
                this.$router.push({
                    name: "user-view",
                    params: { id: userId}
                })
            },
            handleExport () {
                this.$Modal.confirm({
                    title: '操作提示',
                    content: '确定导出数据么',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        return this.$ajax.post(this.$api.ConsumeLabelUserExport,{
                            tag_id: this.tag_id,
                            searchq: this.formData.searchq,
                            page: 1,
                            pageSize: 20
                        }).then((response) => {
                                let res = response.data;
                                if (res.code) {
                                    let jobId = res.data;
                                    // 打开异步提示组件
                                    this.jobIdCol.push(jobId);
                                    this.$nextTick(() => {
                                        this.$refs[`notice${jobId}`][0].showNotice(jobId);
                                    });
                                    this.$Message.success(res.message);
                                } else {
                                    this.$Message.error(res.message);
                                }
                        });
                    }
                });
            }
        }
    }
    //
    function consumeLabelUserSend(data){
       if(!this.tag_id) return;
        this.showSpan = true;
        return util.ajax.post(util.apiUrl.ConsumeLabelUserSend, {
            tag_id: this.tag_id,
            ...data
        }).then(e =>{
            let res = e.data || {};
            if(res.code) {
                this.$Message.info(res.message);
            } else{
                this.$Message.warning(res.message);
            }

        }).finally(()=>{
            this.showSpan = false
        }) 
    }
</script>
