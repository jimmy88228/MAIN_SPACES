<template>
	<div class="brand-list">
		<Card>
			<Row type="flex">
				<Col style="flex:1 1 0%;">
					<SearchForm ref="search" @on-search="searchPage"></SearchForm>
				</Col>
				<Col style="width:180px;text-align: right;">
					<Button type="info" icon="md-add" @click="handleCreate">创建下发任务</Button>
					<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>
			<Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
				<template slot-scope="{ row }" slot="status_str">
					<Tag :color="Number(row.status) == 2 
					? 'warning' : ( Number(row.status) == 0 
					? 'error' : ( Number(row.status) == 3 ? 'success': 'blue') ) ">{{row.status_str}}</Tag>
				</template>	
				<template slot-scope="{ row }" slot="handle">
					<span v-show="row.handle.view" @click="handleView(row)"><a>查看</a></span>
					<Divider type="vertical" v-show="row.handle.issue" />
					<span @click="handleBrocast(row)" v-show="row.handle.issue"><a>发布</a></span>
					<Divider type="vertical" v-show="row.handle.remove" />
					<span @click="delItem(row, '删除提示', '确定删除任务吗？')" v-show="row.handle.remove"><a>删除</a></span>
					<Divider type="vertical" v-show="row.handle.log" />
					<span @click="handleLog(row)" v-show="row.handle.log"><a>日志</a></span>
				</template>
			</Table>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts" @on-change="e => changePage(e)"
				 @on-page-size-change="ps => handlePageSize(ps)" show-elevator show-total show-sizer></Page>
			</div>
		</Card>
	</div>
</template>
<script>
	import SearchForm from './search-form';
	import Mixin from './mixin.js';
	import PageHelper from '@/libs/page-helper.js';

	export default {
		components: {
			SearchForm
		},
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
				let params = Object.assign({
					isInit: 1
				}, data, this.condition);
				return this.$ajax.post(this.$api.ShopPushList, params)
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
			onDelItem(row) {

				this.tableLoading = true;
				
				return this.$ajax.post(this.$api.ShopPushRemove, {
					id: row.id
				})
				.then( response => {
					this.tableLoading = false;
					const res = response.data;
					if (res.code) {
						this.$Message.success('删除成功!');
						this.loadData();
					}
				});
			},
			handleCreate() {
				this.$router.push({
					name: 'shop-goods-push-add'
				})
			},
			handleBrocast(row) {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定发布吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.tableLoading = true;
						return this.$ajax.post(this.$api.ShopPushIssue, {
								id: row.id
							})
							.then(response => {
								this.tableLoading = false;
								const res = response.data;
								if (res.code) {
									this.$Message.success('发布成功!');
									this.loadData();
								}
							});
					},
				});
			},
			handleLog(row) {
				this.$router.push({
					name: 'shop-goods-push-log',
					params: {
						id: row.id
					}
				});
			},
			handleView(row) {
				this.$router.push({
					name: 'shop-goods-push-edit',
					params: {
						id: row.id
					}
				});
			}
		},
		mounted() {
			this.loadData();
		}
	}
</script>

<style lang="less" scoped>
	.brand-list {

	}
</style>
