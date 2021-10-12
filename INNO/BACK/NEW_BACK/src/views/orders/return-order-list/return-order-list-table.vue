<template>
	<div class="return-order-list-table">
		<Table ref="myTable" :columns="tableColums" :data="tableData" :span-method="handleSpan" disabled-hover>
			<template slot-scope="{ row }" slot="orderInfo">
				<div class="header_inline">
					<span class="header_item">退单号:{{row.return_sn}}</span>
					<span class="header_item">关联订单号:<a @click="handleGoOrderInfo(row.related_order_id)">{{row.related_order_sn}}</a></span>
					<span class="header_item">所属店铺:{{row.store_name}}</span>
					<span class="header_item" v-if="row.outer_return_sn">erp退单号:{{row.outer_return_sn}}</span>
				</div>
			</template>
		</Table>
		<div class="list_page" v-show="pageTotal">
			<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="changePage"
			 @on-page-size-change="ps => handlePageSize(ps)" show-total show-elevator show-sizer></Page>
		</div>
	</div>
</template>

<script>
	import PageHelper from '@/libs/page-helper.js';
	import Mixin from './mixin.js';

	export default {
		mixins: [PageHelper, Mixin],
		data() {
			return {
				returnOrderList: {
					'all': 0,
					'wait-confirm': 1,
					'wait-receive': 2,
					'wait-sum': 3,
					'suming': 5,
					'sumed': 4,
				},
				condition: {
					search_type: 'related_order_sn',
					keywords: '',
					refund_type: 0,
					store_id: 0,
					add_time: [],
					return_time: []
				}
			}
		},
		methods: {
			handleSpan({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (columnIndex === 1) {
					return [1, 7];
				} else if (columnIndex > 1) {
					return [0, 0];
				}
			},
			onLoadData(page, data) {
				this.$store.commit('setLoading', true);
				let params = Object.assign({}, data, this.condition, {
					return_order_status: this.returnOrderList[this.$route.query.act],
					user_id: this.$route.query.user_id,
				});
				return this.$ajax.post(this.$api.returnOrderlist, params)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.statusList = res.data && res.data.status;
						}
						this.$store.commit('setLoading', false);
					});
			},
			searchPage(searchData) {
				this.condition = searchData;
				this.loadData();
			},
			handleExport() {
				this.$Modal.confirm({
					title: '操作提示',
					content: `确定进行导出操作`,
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						// this.$store.commit('setLoading', true);
						let params = {
							return_order_status: this.returnOrderList[this.$route.query.act],
							user_id: this.$route.query.user_id,
							...this.condition,
						};
					return 	this.$ajax.post(this.$api.returnOrderExport,params)
							.then((response) => {
								this.tableLoading = false;
								var res = response.data;
								if (res.code) {
									var jobId = res.data;
									// 打开异步提示组件
									this.$emit('showstartMq',jobId);
								}
							});
					}
				});
			},
			handleGoOrderInfo(id) {
				let routeUrl = this.$router.resolve({
					name: 'order-info',
					params: {
						sn: id
					}
				});
				window.open(routeUrl.href, '_blank');
			}
		}
	}
</script>
<style lang="less">
	.return-order-list-table {
		.header_inline {
			white-space: pre-wrap;

			.header_item {
				margin-right: 30px;
			}
		}
	}
</style>
