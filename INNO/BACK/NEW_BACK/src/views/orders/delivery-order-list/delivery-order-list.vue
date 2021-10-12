<template>
	<Card class="delivery-order-list">
		<Row type="flex" style="margin-bottom: 10px;">
			<Col style="flex:1 1 0%;">
				<searchForm :status-list="statusList" @on-search="searchPage"></searchForm>
			</Col>	
			<Col style="width:360px;text-align: right;">
				<Button type="info" @click="handleExport">导出</Button>
				<Button type="success" @click="handleOrderUpload">上传物流单号</Button>
				<Button type="warning" @click="handleOrderCreate">批量生成发货单</Button>
				<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
			</Col>
		</Row>

		<Table ref="myTable" :columns="tableColums" :data="tableData" :span-method="handleSpan" disabled-hover>
			<template slot-scope="{ row }" slot="orderInfo">
				<div class="header_inline">
					<span class="header_item">发货号:{{row.delivery_sn}}</span>
					<span class="header_item">关联订单号:<a @click="handleGoOrderInfo(row)">{{row.order_sn}}</a></span>
					<span class="header_item" v-if="row.out_delivery_sn">ERP发货单号:{{row.out_delivery_sn}}</span>
					<span class="header_item">所属店铺:{{row.store_name}}</span>
					<span class="header_item">发货门店:{{row.delivery_store_name ? row.delivery_store_name : '--'}}</span>
				</div>
			</template>
		</Table>
		<div class="list_page" v-show="pageTotal">
			<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="changePage"
			 @on-page-size-change="ps => handlePageSize(ps)" show-total show-elevator show-sizer></Page>
		</div>
		<BatchImport ref="batchImport" :download-pay-load="downloadPayLoad" :up-load-pay-load="payLoad" @on-success="onImportSuccess">
			<template v-slot:content>
				<div style="margin: 10px 0;">
					<label>导入类型</label>
					<Select v-model="importType" class="basic_select">
						<Option value="0">ERP发货单号</Option>
						<Option value="1">发货单号</Option>
					</Select>
				</div>
			</template>
		</BatchImport>
		<BatchImport ref="batchImport2" :download-pay-load="downloadPayLoad2" @on-success="onImportSuccess"></BatchImport>
	</Card>
</template>

<script>
	import searchForm from './search-form';
	import PageHelper from '@/libs/page-helper.js';
	import Mixin from './mixin.js';
	import BatchImport from '@/views/my-components/batch-import/batch-import';

	export default {
		props: ['sn'],
		mixins: [PageHelper, Mixin],
		components: {
			searchForm,
			BatchImport
		},
		data() {
			return {
				condition: {
					search_type: '',
					keywords: '',
					startTime: '',
					endTime: '',
					status: 0,
					store_id: 0,
					delivery_store_id: 0
				},
				statusList: {},
				isClose: false,
				importType: '0',
				payLoad: {
					import_type: '0'
				},
				downloadPayLoad: {
					type: 1
				},
				downloadPayLoad2: {
					type: 2
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
				let params = Object.assign({}, data, this.condition, this.sn ? {
					search_type: 'delivery_sn',
					keywords: this.sn
				} : {});
				return this.$ajax.post(this.$api.shipmentList, params)
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
						this.$store.commit('setLoading', true);
						return this.$ajax.post(this.$api.deliveryExport, this.condition)
							.then(response => {
								const res = response.data;
								if (res.code) {
									this.$refs.myTable.exportCsv({
										filename: '发货单数据',
										columns: res.data.columns,
										data: res.data.items
									});
								}
								this.$store.commit('setLoading', false);
							});
					}
				});
			},
			confirm() {},
			cancel() {},
			confirmCreate() {},
			cancelCreate() {},
			handleOrderUpload() {
				this.$refs.batchImport.openModal({
					upload: true,
					download: true
				}, this.$api.uploadLogisticsBill, this.$api.downloadLogisticsBill);
			},
			handleOrderCreate() {
				this.$refs.batchImport2.openModal({
					upload: true,
					download: true
				}, this.$api.uploadLogisticsBill, this.$api.downloadLogisticsBill);
			},
			onImportSuccess() {
				this.loadData();
			},
			handleGoOrderInfo(row) {
				let routeUrl = this.$router.resolve({
					name: 'order-info',
					params: {
						sn: row.order_id
					}
				});
				window.open(routeUrl.href, '_blank');
			}
		},
		watch: {
			importType(nV) {
				this.payLoad.import_type = nV;
			}
		},
		mounted() {
			this.loadData();
		}
	}
</script>

<style lang="less" scoped>
	.delivery-order-list {
		.header_inline {
			white-space: pre-wrap;

			.header_item {
				margin-right: 30px;
			}
		}
	}
</style>
<style lang="less">
	.delivery-order-list {
		.ivu-table-cell-expand {
			display: none;
		}

		td.ivu-table-expanded-cell {
			padding: 0 0 10px 0;
		}
	}
</style>
