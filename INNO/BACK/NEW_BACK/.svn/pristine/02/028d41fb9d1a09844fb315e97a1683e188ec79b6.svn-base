<template>
	<div class="brand-list">
		<Card>
			<Row type="flex" style="margin-bottom: 10px;">
				<Col style="flex:1 1 0%;">
					<Tooltip content="返回" placement="bottom-start">
						<Icon type="ios-arrow-dropleft" size="26" @click="goBack" style="cursor: pointer;"/>
						<span style="margin-left:30px">下发日志列表</span>
					</Tooltip>
				</Col>
				<Col style="width:60px;text-align: right;">
					<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>	
			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable"></Table>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
			</div>
		</Card>
	</div>
</template>
<script>
	import Mixin from './mixin.js';
	import PageHelper from '@/libs/page-helper.js';

	export default {
		props: ['id'],
		data() {
			return {
				canCreate: {},
				condition: {
					searchq: '',
					type: 1
				}
			}
		},
		mixins: [Mixin, PageHelper],
		methods: {
			onLoadData(page, data) {
				return this.$ajax.post(this.$api.ShopPushLog, {
						...data,
						id: this.id
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.canCreate = res.data && res.data.canCreate;
						}
					});
			},
			searchPage(searchData) {
				this.condition = searchData;
				this.loadData();
			},
			goBack(){
				this.$router.push('/cloud-shop/shop-goods-push');
			}
		},
		mounted() {
			this.loadData();
		}
	}
</script>

<style lang="less" scoped>
	.brand-list {
		.brand-list_import {
			margin-right: 10px;
		}
	}
</style>
