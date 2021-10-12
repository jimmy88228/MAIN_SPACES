<style lang="less">
    .reportDiv{
        min-height: 800px;
        background-color: #fff;
        width: 100%;
        padding: 10px;
        .w_250{
            width: 250px;
        }
        .ivu-select-dropdown{
            max-height: 450px !important;
        }
    }
    .finance_report{
        overflow: hidden;
        min-width: 1180px;
        .ivu-table-cell{
            padding-left: 10px;
            padding-right: 10px;
        }
    }
    .flex_box{
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        -webkit-justify-content: space-between;
        justify-content: space-between;
    }
</style>

<template>
	<div class="reportDiv finance_report">
		<stats-back :isBack="brandId" :type="brandId ? 'brand':''" :data="{id: brandId, name: brandName}" @on-changeData="changeBrand"></stats-back>
		<searchForm :formSearch="formSearch" @on-search="search" @on-handleExport="handleExport"></searchForm>
		<Table ref="myTable" :columns="columns" :loading="tableLoading" :data="tableData" border :height="tableHeight" :span-method="handleSpan">
            <template slot-scope="{ row }" slot="store">
                <div>{{row.store_name}}</div>【{{ row.store_code }}】
            </template>
            <template slot-scope="{ row }" slot="order_sn">
                <div>{{row.alipay_sn}}</div>({{ row.order_sn }})
            </template>
            <template slot-scope="{ row }" slot="order_user">
                <div>{{row.card_num}}</div>{{ row.mobile_phone }}
            </template>
            <template slot-scope="{ row }" slot="goods_name">
                <div>{{row.goods_name}}</div>
                <div>({{row.goods_sn}})</div>
            </template>
            <template slot-scope="{ row,index }" slot="goods_attr">
                <div class="flex_box">
                    <div>
                        <div>规格一：{{row.color_name}}【{{row.color_code}}】</div>
                        <div v-if="row.size_code!='default' && row.size_code!=''">规格二：{{row.size_name}}【{{row.size_code}}】</div>
                    </div>
                    <span style="min-width:25px;text-align:right">X{{row.goods_number}}</span>
                </div>
            </template>
            <template slot-scope="{row}" slot="goods">
            </template>
        </Table>
				<div class="page-area list_page" >
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
				<div class="col">
					<notice :ref="'notice' + item" @finish="loadData" v-for="item in jobIdCol" :key="item"></notice>
				</div>
	</div>
</template>

<script type="text/javascript">
  import util from '@/libs/util.js';
	import PageHelper from '@/libs/page-helper.js';
	import mixin from './finance-mixin.js';
	import searchForm from './finance-report-form.vue';
	import notice from '@/views/my-components/mq-notice/mq-notice';
	import statsBack from '@/views/data/components/stats-back';
	export default{
		mixins: [ PageHelper, mixin],
		components:{ searchForm, notice },
        data () {
            return {
                storeList:[],
                // tableLoading:false,
                // tableHeight:500,
                // pageSize:15,
                export_data:[],
                storeList:[],
                // page:1,
                // data:[],
                // columns:[],
                // pageTotal:0,
                // totalCount:0,
                formSearch:{
									start_time: '',  //开始时间 默认 7天
									end_time:'', //结束时间 默认 7天
									searchq: '',   //搜索参数
									store_id: 0, //所属店铺
									platform_src: '' //排序 //订单来源
                    // activityDate:[],
                    // searchq:'',
                    // store_id:'',
                    // isExport:0,
                    // platform_src:'',
                    // pageSize:15,
                    // page:1
                },
                // data:[
                //     {"order_id":3002,"card_num":"SHB80007568","mobile_phone":"18902249649","alipay_sn":"4200000427201910103366818421","consignee":"liyafei","platform_src":"wxapp","rec_time":"2019-10-17","pay_time":"2019-10-10","add_time":"2019-10-10","order_sn":"001601910101616390007557","pay_name":"微信支付","order_amount":0.04,"store_code":"1296","store_name":"天猫正装特卖店01","order_market_sum":0.04,"goods_sn":"KINGCODE025823","goods_name":"跨境购测试商品001","goods_attr":"规格一:件","goods_number":2,"price_rate":100.00,"goods_market_sum":0.02,"color_code":"J1001","color_name":"件","size_code":"default","size_name":"","market_price":0.01,"goods_price":0.01,"goods_price_sum":0.02,"integral_amount_sum":0.00,"bonus_amount_sum":0.00,"discount_manual_sum":0.00,"real_sale_price":0.02,"delivery_store_code":"ces113","delivery_store_name":"青岛大融城店","prepaidcard_value_sum":0.00,"real_sale_price_sum":0.04,"surplus_sum":0.00,rows:2},
                //     {"order_id":3002,"card_num":"SHB80007568","mobile_phone":"18902249649","alipay_sn":"4200000427201910103366818421","consignee":"liyafei","platform_src":"wxapp","rec_time":"2019-10-17","pay_time":"2019-10-10","add_time":"2019-10-10","order_sn":"001601910101616390007557","pay_name":"微信支付","order_amount":0.04,"store_code":"1296","store_name":"天猫正装特卖店01","order_market_sum":0.04,"goods_sn":"KINGCODE026826","goods_name":"跨境购测试商品02","goods_attr":"规格一:标准","goods_number":1,"price_rate":100.00,"goods_market_sum":0.02,"color_code":"F","color_name":"标准","size_code":"default","size_name":"默认","market_price":0.02,"goods_price":0.02,"goods_price_sum":0.02,"integral_amount_sum":0.00,"bonus_amount_sum":0.00,"discount_manual_sum":0.00,"real_sale_price":0.02,"delivery_store_code":"ces113","delivery_store_name":"青岛大融城店","prepaidcard_value_sum":0.00,"real_sale_price_sum":0.04,"surplus_sum":0.00,rows:0}],
								jobIdCol: [],
								brandId:0,
								brandName: "",
            }
        },
        methods:{
					initParams(){
						let query = this.$route.query || {};
						this.brandId = query.brandId || 0;
						this.brandName = query.brandName || "";
					},
					handleSpan ({ row, column, rowIndex, columnIndex }) {
							if (column.rows===1) {
									return {
										rowspan:1,
										colspan:1
									}
							}else{
									return {
										rowspan: row.rows,
										colspan: 1
									};
							}
					},
					onLoadData(page, extraData){
						return this.$ajax.post(this.$api.otherFinanceStatsList, {
							...this.formSearch,
							...extraData,
							brand_id: this.brandId || 0,
						}).then((response)=>{
							let res = response.data || {};
							if(res.code){
								console.log("res", res);
								let data = res.data || {};
								this.data = data;
							}
						})
					},
					handleExport() {
						this.$Modal.confirm({
							title: '操作提示',
							content: '确定导出数据么',
							okText: '确定',
							cancelText: '取消',
							onOk: () => {
								let formSearch = this.formSearch;
								return this.$ajax.post(this.$api.otherFinanceStatsExport,{
									...this.formSearch,
									brand_id: this.brandId || 0,
								}).then((response) => {
										var res = response.data;
										if (res.code) {
											var jobId = res.data;
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
					},
					search(formSearch){
						console.log("formSearch", formSearch)
						this.formSearch = formSearch || {};
						this.loadData();
					},
					changeBrand(data){
						if(data){
							let brandInfo = data[0] || {};
							this.brandId = brandInfo.brandId;
							this.brandName = brandInfo.brandName;
							this.searchData();
						}
					},
        },
        mounted () {
					this.initParams();
					this.loadData();
        }
	}

</script>