<template>
	<Card class="return-order-list">
		<Row type="flex" style="margin-bottom: 10px;">
			<Col style="flex:1 1 0%;">
				<searchForm @on-search="searchPage" ref="search-form"></searchForm>
			</Col>	
			<Col style="width:110px;text-align: right;">
				<Button type="info" @click="handleExport">导出</Button>
				<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
			</Col>
		</Row>

		<Tabs :value="tabName" :animated="false" type="card" @on-click="onTabsClick">
			<TabPane name="all" label="全部">
				<orderListTable ref="all"></orderListTable>
			</TabPane>
			<TabPane name="wait-confirm" label="待确认">
				<orderListTable ref="wait-confirm"></orderListTable>
			</TabPane>
			<TabPane name="wait-receive" label="待收货">
				<orderListTable ref="wait-receive"></orderListTable>
			</TabPane>
			<TabPane name="wait-sum" label="待结算">
				<orderListTable ref="wait-sum"></orderListTable>
			</TabPane>
			<TabPane name="suming" label="结算中">
				<orderListTable ref="suming"></orderListTable>
			</TabPane>
			<TabPane name="sumed" label="已结算">
				<orderListTable ref="sumed"></orderListTable>
			</TabPane>
		</Tabs>
		<!--异步操作组件-->
		<mqNotice ref="mq-notice"></mqNotice>
	</Card>
</template>

<script>
	import orderListTable from './return-order-list-table';
	import searchForm from './search-form';
	import TabsHelper from '@/libs/tabs-helper.js';
	import mqNotice from '@/views/my-components/mq-notice/mq-notice';

	export default {
		mixins: [TabsHelper],
		components: {
			searchForm,
			orderListTable,
			mqNotice,
		},
		data() {
			return {
				tabName: 'all'
			}
		},
		methods: {
			loadData(){
				this.onTabsClick( this.tabName );
			},
			handleExport() {
				// this.$refs[this.$route.query.act].handleExport();
				this.tableLoading = true;
				// ajax 请求获取数据
				this.$ajax.post(this.$api.returnOrderExport, this.searchForm)
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
		}
	}
</script>

<style lang="less">
	.return-order-list {
		.ivu-table-cell-expand {
			display: none;
		}

		td.ivu-table-expanded-cell {
			padding: 0 0 10px 0;
		}
	}
</style>
