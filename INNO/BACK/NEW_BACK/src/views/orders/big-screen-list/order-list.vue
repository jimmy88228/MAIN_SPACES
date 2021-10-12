<template>
	<Card class="big-order-list">
		<Row type="flex" style="margin-bottom: 10px;">
			<Col style="flex:1 1 0%;">
				<searchForm ref="search-form" :order-status-list="orderStatusList" :store-list="storeList" :order-from="orderFrom"
				 :order-type-list="orderTypeList" :sale-kind="saleKind" :pay-method="payMethod" :shipping-ways="shippingWays"
				 :check-order="checkOrder" :search-type-list="searchTypeList" :order-status-select="order_status_select" @on-search="searchPage"></searchForm>
			</Col>
			<Col style="width:160px;">
				<Button type="info" @click="handleRstOrderCommission">重置订单提成</Button>
				<Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
			</Col>	
		</Row>
		<Tabs :value="order_status" :animated="false" type="card" @on-click="onTabsClick">
			<TabPane name="0" label="全部">
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
		</Tabs>
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
		<!-- 重置订单提成 -->
		<Modal v-model="rstOrderCommission" title="重置订单提成" :loading="loading" @on-ok="confirmRst">
			<label style="margin-bottom: 10px;display: inline-block;">订单编号：</label>
			<Input type="textarea" v-model="orderIdText" placeholder="多个请用逗号(,)隔开" @on-change="handleOrderIdText" />
		</Modal>
	</Card>
</template>

<script>
	import Untils from '@/libs/vue-utils.js';
	import orderListTable from './order-list-table';
	import searchForm from './search-form';

	const DEFAULT_TAB = [0, 1, 2, 11, 3, 4, 5, 6, 14, 15, 1000];
	export default {
		components: {
			orderListTable,
			searchForm
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
				rstOrderCommission: false,
				orderIdText: '',
				loading: true,
			}
		},
		methods: {
			init() {
				// 选中的tabs 加载数据
				this.prev_status = this.order_status;
				this.$refs['list-' + this.order_status].initData(this.order_status);
			},
			// tabs 点击事件
			onTabsClick(status) {
				// 注意:ERP和非ERP数据结构不一致，切换tab前需要将前一个table数据进行清空,防止渲染错误
				this.order_status = status;
				this.order_status_select = status;
				this.searchForm.orderStatus = status;
				this.$refs['list-' + this.prev_status].clearTableData();
				this.$refs['list-' + status].initData(this.order_status, this.searchForm);
				this.prev_status = status;
			},
			loadExtraData() {
				this.spinShow = true;
				return this.$ajax.all(
					[
						this.$ajax.post(this.$api.searchList),
						this.$ajax.post(this.$api.storeTree)
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
							this.searchTypeList = searchRes.data && searchRes.data.searchType;
						}
						let storeRes = storeList.data;
						if (storeRes.code) {
							this.storeList = storeRes.data;
							this.init();
						}
						this.spinShow = false;
					})
				);
			},
			searchPage(searchForm) {
				this.searchForm = searchForm;
				this.order_status = DEFAULT_TAB.indexOf(Number(searchForm.orderStatus)) === -1 ? '0' : searchForm.orderStatus;
				this.order_status_select = searchForm.orderStatus;
				this.$refs['list-' + this.order_status].initData(searchForm.orderStatus, this.searchForm);
			},
			confirmRst() {
				if (!this.orderIdText.trim()) {
					this.rstOrderCommission = true;
					this.$Message.error('提交的内容不能为空');
					return false;
				}
				return this.$ajax.post(this.$api.resetOrderCommission, {
					// 过滤得出合法的字符串
					order_sn_list: Untils.checkChars(this.orderIdText)
				}).then(response => {
					const res = response.data;
					if (res.code) {
						this.$Message.success(res.message);
					}
					this.rstOrderCommission = false;
					// 重置
					this.orderIdText = '';
				})
			},
			handleRstOrderCommission() {
				this.rstOrderCommission = true;
			},
			handleOrderIdText(e) {
				let value = e.target.value;
				if (value.trim()) {
					this.loading = false;
				} else {
					this.loading = true;
				}
			}
		},
		mounted() {
			this.loadExtraData();
		}
	}
</script>

<style lang="less" scoped>
	.big-order-list {
		.ivu-tabs-tab {
			font-size: 12px;
			line-height: 23px;
		}
	}
</style>
<style lang="less">
	.big-order-list {
		.ivu-table-cell-expand {
			display: none;
		}

		td.ivu-table-expanded-cell {
			padding: 0 0 10px 0;
		}
	}
</style>
