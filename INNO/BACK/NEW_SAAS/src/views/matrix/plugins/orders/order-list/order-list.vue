<template>
	<Card class="order-list">
		<div class="flex f-just-between" style="margin-bottom: 10px;">
			<div>
			<searchForm ref="search-form" :order-status-list="orderStatusList" :store-list="storeList" :order-from="orderFrom"
			 :order-type-list="orderTypeList" :sale-kind="saleKind" :pay-method="payMethod" :shipping-ways="shippingWays"
			 :check-order="checkOrder" :search-type-list="searchTypeList" :order-status-select="order_status_select" @on-search="searchPage"></searchForm>
			</div>
			<div class="action_btn flex">
				<!-- <Button type="success" icon="md-add" @click="handleCustomer">添加手工客服订单</Button>
				<Button type="warning" @click="handleRstOrderCommission">重置订单提成</Button> -->

				<Poptip v-model="showPop" placement="bottom-end" width="500">
					<Button type="info" style="margin-right:5px;">导出</Button>
					<div slot="content" class="export-box">
						<Row :gutter="16">
							<Col :span="12">
							<div class="col-box">
								<div class="title">明细报表</div>
								<div class="desc">
									<div>包含订单商品信息</div>
									<div>导出符合当前搜索条件下的全部订单</div>
								</div>
								<Button type="primary" @click="handleExport(2)">立即导出</Button>
							</div>
							</Col>
							<Col :span="12">
							<div class="col-box">
								<div class="title">汇总报表</div>
								<div class="desc">
									<div>无订单商品信息</div>
									<div>导出符合当前搜索条件下的全部订单</div>
								</div>
								<Button type="info" @click="handleExport(1)">立即导出</Button>
							</div>
							</Col>
						</Row>
					</div>
				</Poptip>

				<Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
			</div>
		</div>

		<Tabs :value="order_status" :animated="false" type="card" @on-click="onTabsClick">
			<template v-for="(item,index) in DEFAULT_TAB">
				<TabPane :name="item.key+''" :label="item.name" :key="index" v-if="orderStatusList[item.key]">
					<orderListTable :ref="'list-' + item.key+''"></orderListTable>
				</TabPane>
			</template>
			<!-- <TabPane name="0" label="全部" >
				<orderListTable ref="list-0"></orderListTable>
			</TabPane>
			<TabPane name="1" label="待确认">
				<orderListTable ref="list-1"></orderListTable>
			</TabPane>
			<TabPane name="2" label="待付款">
				<orderListTable ref="list-2"></orderListTable>
			</TabPane>
			<TabPane name="11" label="申请取消">
				<orderListTable ref="list-11"></orderListTable>
			</TabPane>
			<TabPane name="3" label="待发货">
				<orderListTable ref="list-3"></orderListTable>
			</TabPane>
			<TabPane name="4" label="配货中">
				<orderListTable ref="list-4"></orderListTable>
			</TabPane>
			<TabPane name="5" label="已发货">
				<orderListTable ref="list-5"></orderListTable>
			</TabPane>
			<TabPane name="6" label="已完成">
				<orderListTable ref="list-6"></orderListTable>
			</TabPane>
			<TabPane name="14" label="已退款">
				<orderListTable ref="list-14"></orderListTable>
			</TabPane>
			<TabPane name="15" label="待退款">
				<orderListTable ref="list-15"></orderListTable>
			</TabPane>
			<TabPane name="1000" label="ERP完成订单">
				<orderListTable ref="list-1000"></orderListTable>
			</TabPane>
			<TabPane name="19" label="付款订单">
				<orderListTable ref="list-19"></orderListTable>
			</TabPane> -->
		</Tabs>
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
		<!-- 重置订单提成 -->
		<!-- <Modal v-model="rstOrderCommission" title="重置订单提成" :loading="loading" @on-ok="confirmRst">
			<label style="margin-bottom: 10px;display: inline-block;">订单编号：</label>
			<Input type="textarea" v-model="orderIdText" placeholder="多个请用逗号(,)隔开" @on-change="handleOrderIdText" />
		</Modal> -->

		<!--异步操作组件-->
		<mqNotice ref="mq-notice"></mqNotice>
	</Card>
</template>

<script>
	import Untils from '@/libs/vue-utils.js';
	import orderListTable from './order-list-table';
	import searchForm from './search-form';
	import mqNotice from '@/views/my-components/mq-notice/mq-notice';

	// const DEFAULT_TAB = [0, 1, 2, 11, 3, 4, 5, 6, 14, 15, 1000, 19];
	export default {
		props: ['userId'],
		components: {
			orderListTable,
			searchForm,
			mqNotice,
		},
		data() {
			return {
				// 负责展示tab
				order_status: '0',
				// 传递搜索参数
				order_status_select: '0',
				spinShow: false,
				prev_status: '0',
				orderStatusList: {},
				storeList: {},
				orderFrom: {},
				orderTypeList: [],
				saleKind: [],
				payMethod: [],
				shippingWays: [],
				checkOrder: {},
				searchTypeList: {},
				searchForm: {},
				// rstOrderCommission: false,
				orderIdText: '',
				loading: true,

				showPop: false,
				DEFAULT_TAB: [
					{key:0,name: "全部"},					{key:1,name: "待确认"},					{key:2,name: "待付款"},					{key:11,name: "申请取消"},					{key:3,name: "待发货"},					{key:4,name: "配货中"},					{key:5,name: "已发货"},					{key:6,name: "已完成"},					{key:14,name: "已退款"},					{key:15,name: "待退款"},					{key:1000,name: "完成订单"},					{key:19,name: "付款订单"}]
			}
		},
		
		methods: {
			init() {
				if (this.$route.query.isErp && Number(this.$route.query.isErp)) {
					// 会员跳转强制更新为ERP状态
					this.order_status = '1000';
					this.prev_status = '1000';
				} else {
					// 选中的tabs 加载数据
					this.prev_status = this.order_status;
				}
				setTimeout(()=>{
						this.$refs['list-' + this.order_status][0].initData(this.order_status, {
							...this.searchForm,
							user_id: this.userId || 0
						});
				})
			},
			// tabs 点击事件
			onTabsClick(status) {
				// 注意:ERP和非ERP数据结构不一致，切换tab前需要将前一个table数据进行清空,防止渲染错误
				this.order_status = status;
				this.order_status_select = status;
				this.searchForm.orderStatus = status;
				this.$refs['list-' + this.prev_status][0].clearTableData();
				this.$refs['list-' + status][0].initData(this.order_status, {
					...this.searchForm,
					user_id: this.userId || 0
				});
				this.prev_status = status;
			},
			loadExtraData() {
				this.spinShow = true;
				return this.$ajax.all(
					[
						this.$ajax.post(this.$api.MatrixOrderSearchList),
						// this.$ajax.post(this.$api.storeTree)
					]
				).then(
					this.$ajax.spread((searchList, storeList) => {
						let searchRes = searchList.data;
						if (searchRes.code) {
							this.orderStatusList = searchRes.data && searchRes.data.orderStatus;
							this.orderFrom = searchRes.data && searchRes.data.orderFrom;
							this.orderTypeList = searchRes.data && searchRes.data.orderType;
							this.saleKind = searchRes.data && searchRes.data.saleKind;
							this.payMethod = searchRes.data && searchRes.data.payMethod;
							this.shippingWays = searchRes.data && searchRes.data.shippingWays;
							this.checkOrder = searchRes.data && searchRes.data.checkOrder;
							this.searchTypeList = this.orderStatusList//searchRes.data && searchRes.data.searchType;
						}
						// let storeRes = storeList.data;
						// if (storeRes.code) {
						// 	this.storeList = storeRes.data;
						// 	this.init();
						// }
						this.init();
						this.spinShow = false;
					})
				);
			},
			searchPage(searchForm) {
				this.searchForm = searchForm;
				this.order_status = this.hasStatus(searchForm.orderStatus); //this.DEFAULT_TAB.indexOf(Number(searchForm.orderStatus)) === -1 ? '0' : searchForm.orderStatus;
				this.order_status_select = searchForm.orderStatus;
				this.$refs['list-' + this.order_status][0].initData(searchForm.orderStatus, {
					...this.searchForm,
					user_id: this.userId || 0
				});
			},
			hasStatus(status){
				let DEFAULT_TAB = this.data.DEFAULT_TAB || [];
				let isHasStatus = false;
				for(let i = 0; i < DEFAULT_TAB.length; i++){
					let key = DEFAULT_TAB[i].key;
					if(key === status){
						isHasStatus = true;
						break;
					}
				}
				return isHasStatus ? status : '0'
			},
			// confirmRst() {
			// 	if (!this.orderIdText.trim()) {
			// 		this.rstOrderCommission = true;
			// 		this.$Message.error('提交的内容不能为空');
			// 		return false;
			// 	}
			// 	return this.$ajax.post(this.$api.resetOrderCommission, {
			// 		// 过滤得出合法的字符串
			// 		order_sn_list: Untils.checkChars(this.orderIdText)
			// 	}).then(response => {
			// 		const res = response.data;
			// 		if (res.code) {
			// 			this.$Message.success(res.message);
			// 		}
			// 		this.rstOrderCommission = false;
			// 		// 重置
			// 		this.orderIdText = '';
			// 	})
			// },
			// handleRstOrderCommission() {
			// 	this.rstOrderCommission = true;
			// },
			// handleOrderIdText(e) {
			// 	let value = e.target.value;
			// 	if (value.trim()) {
			// 		this.loading = false;
			// 	} else {
			// 		this.loading = true;
			// 	}
			// },
			// handleCustomer() {
			// 	this.$router.push({
			// 		name: 'customer-service'
			// 	});
			// },
			// 导出订单
			handleExport(type) {
				this.showPop = false;
				this.tableLoading = true;
				this.$set(this.searchForm, 'export_type', type);
				// ajax 请求获取数据
				this.$ajax.post(this.$api.MatrixOrderExport, this.searchForm)
					.then((response) => {
						this.tableLoading = false;
						var res = response.data;
						if (res.code) {
							var jobId = res.data;
							// 打开异步提示组件
							this.$refs['mq-notice'].showNotice(jobId);
						}
					});
			}
		},
		mounted() {
			this.loadExtraData();
		}
	}
</script>

<style lang="less" scoped>
	.order-list {
		.ivu-tabs-tab {
			font-size: 12px;
			line-height: 23px;
		}

		.action_btn {
			text-align: right;
		}
	}
</style>
<style lang="less">
	.order-list {
		.ivu-table-cell-expand {
			display: none;
		}

		td.ivu-table-expanded-cell {
			padding: 0 0 10px 0;
		}

		.export-box {
			padding: 5px 0;
			text-align: center;
			overflow: hidden;

			.col-box {
				background: #efefef;
				padding: 15px;

				.title {
					font-size: 14px;
				}

				.desc {
					font-size: 12px;
					margin: 10px 0;
				}
			}
		}
	}
</style>
