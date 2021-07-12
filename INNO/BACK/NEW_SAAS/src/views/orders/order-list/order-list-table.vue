<template>
	<div class="order-list-table">
		<Table :columns="tableColums" :data="tableData" :span-method="handleSpan" disabled-hover>
			<template slot-scope="{ row }" slot="orderInfo">
				<div class="header_padding" v-if="status != 1000">
					<div class="item g_item">
						<template v-if="row.order_status == 10">
							<span class="split_sign">拆单</span>
						</template>
						<span class="header_item">主订单号:{{row.order_sn}}</span>
						<span class="header_item">下单时间:{{row.create_time_format}}</span>
						<span class="header_item">配送方式:{{row.shipping_name_format}}</span>
						<span class="header_item">订单来源:{{row.platform_src_str}}</span>
					</div>
					<div class="item m_item">
						<span class="header_item">所属店员:{{row.staff_name}}</span>
						<span class="header_item">所属店铺:{{row.store_name}}</span>
						<template v-if="row.orderDistributor_one||row.orderDistributor_two">
							<span>所属分销员:</span>
							<span class="header_item" v-if="row.orderDistributor_one">{{row.orderDistributor_one}}</span>
							<span class="header_item" v-if="row.orderDistributor_two">{{row.orderDistributor_two}}</span>
						</template>
					</div>
				</div>
				<div class="header_inline" v-else>
					<span class="header_item">主订单号:{{row.order_sn}}</span>
					<Divider type="vertical" />
					<span class="header_item">下单时间:{{row.create_time_format}}</span>
					<Divider type="vertical" />
					<span class="header_item">订单来源:{{row.from_name_format}}</span>
					<Divider type="vertical" />
					<span class="header_item">配送方式:{{row.shipping_name_format}}</span>
					<Divider type="vertical" />
					<span class="header_item">所属店员:{{row.staff_name}}</span>
					<Divider type="vertical" />
					<span class="header_item">所属店铺:{{row.store_name}}</span>
				</div>
			</template>
			<template slot-scope="{ row }" slot="handle">
				<div v-if="status != 1000">
					<Icon v-if="row.red_flag === '0'" title="设为红旗" type="ios-flag-outline" size="24" style="cursor: pointer;" @click="handleFlagLimit(true, row.order_id)" />

					<Icon v-else title="取消红旗" type="ios-flag" color="red" size="24" style="cursor: pointer;" @click="handleFlagLimit(false, row.order_id)" />
				</div>
				<div v-if="row.order_status == 10 && status != 1000">
					<router-link tag="a" :to="{name: 'order-info', params: {sn: row.order_id}}" target="_blank" v-if="row.handle.edit">查看</router-link>
				</div>
			</template>
		</Table>
		<div class="page" v-show="pageTotal">
			<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="changePage"
			 @on-page-size-change="ps => handlePageSize(ps)" show-total show-elevator show-sizer></Page>
		</div>
	</div>
</template>

<script>
	import Mixin from './mixin.js';
	import Conf from '@/config/index.js';
	import VueUntils from '@/libs/vue-utils.js';

	export default {
		name: 'orderListTable',
		mixins: [Mixin],
		data() {
			return {
				tableData: [],
				pageTotal: 0,
				currentPage: Conf.PAGE_START,
				pageSize: Conf.PAGE_SIZE_DEF,
				pageSizeOpts: Conf.PAGE_SIZE_OPTS,
				status: '0',
				// 允许切换分页标志位
				changeSizeSign: false,
				searchForm: {}
			}
		},
		methods: {
			initData(status, searchForm = {}) {
				this.currentPage = 1;
				this.status = status;
				this.searchForm = searchForm;
				this.loadData();
			},
			loadData() {
			
				this.$store.commit('setLoading', true);
				return this.$ajax.post(this.$api.orderList, {
						page: this.currentPage,
						pageSize: this.pageSize,
						orderStatus: this.status,
						...this.searchForm
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.tableData = res.data && res.data.items;
							// isVisible与nodeValue,这两个值会用于备注的显示及内容
							this.tableData.forEach(item => {
								if (item.order_status == '10') {
									// 当前是拆单的情况
									item.order_message.forEach(order => {
										order.isVisible = false;
										order.nodeValue = '';
									});
								}
							});
							this.pageTotal = res.data && res.data.total;
						}
						this.$store.commit('setLoading', false);
					});
			},
			changePage(page) {
				if (this.changeSizeSign) {
					this.changeSizeSign = false;
					return false;
				}
				this.currentPage = page;
				this.loadData();
			},
			handlePageSize(pageSize) {
				// 阻止页码的切换操作
				this.currentPage !== 1 && (this.changeSizeSign = true);
				this.currentPage = 1;
				this.pageSize = pageSize;
				this.loadData(1);
			},
			handleSpan({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (columnIndex === 1) {
					return [1, 7];
				} else if (columnIndex === 0 || columnIndex === 8) {
					return [1, 1];
				} else {
					return [0, 0];
				}
			},
			clearTableData() {
				this.tableData = [];
			},
			// 防抖
			handleFlagLimit: VueUntils.debounce(function() {
				this.handleFlag(arguments[0], arguments[1]);
			}, 380),
			handleFlag(bool, orderId) {
				this.tableData.forEach(item => {
					if (item.order_id == orderId) {
						item['red_flag'] = bool ? '1' : '0';
					}
				});
				return this.$ajax.post(this.$api.redFlagOrder, {
					order_id: orderId,
					flag: bool ? 1 : 0
				}).then(response => {
					const res = response.data;
					if (res.code) {
						this.$Message.success(res.message);
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.order-list-table {
		.ivu-table-tbody {
			font-size: 13px;
		}

		.page {
			float: right;
			margin-top: 10px;
		}

		.header_padding {
			padding: 4px 0;

			.item {
				white-space: pre-wrap;

				&.m_item {
					margin-top: 14px;
					margin-left: 4px;
				}

				.header_item {
					display: inline-block;
					margin-right: 30px;
				}
			}
		}

		.split_sign {
			display: inline-block;
			width: 34px;
			height: 18px;
			line-height: 16px;
			text-align: center;
			color: #f16762;
			border: 1px solid;
			border-radius: 4px;
			font-size: 10px;
		}

		.header_inline {
			white-space: pre-wrap;
		}

		.common_divider {
			margin: 6px 0;
		}
	}
</style>
