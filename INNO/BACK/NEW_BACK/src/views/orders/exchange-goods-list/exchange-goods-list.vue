<template>
	<Card class="return-order-list">
		<Row type="flex" style="margin-bottom: 10px;">
			<Col style="flex:1 1 0%;">
				<searchForm @on-search="searchPage" ref="search-form"></searchForm>
			</Col>
			<Col style="width:60px;text-align: right;">
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
			<TabPane name="wait-create-order" label="待生成订单">
				<orderListTable ref="wait-create-order"></orderListTable>
			</TabPane>
			<TabPane name="finished" label="已完结">
				<orderListTable ref="finished"></orderListTable>
			</TabPane>
		</Tabs>
	</Card>
</template>

<script>
	import orderListTable from './exchange-goods-list-table';
	import searchForm from './search-form';
	import TabsHelper from '@/libs/tabs-helper.js';

	export default {
		mixins: [TabsHelper],
		components: {
			searchForm,
			orderListTable
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
