<style lang="less">
	.onlive-log-table{
	.table-topbar{
	    .ivu-form-item{
	        margin-bottom: 10px;
	    }
		.ivu-input-icon-clear{
			right:50px;
	    }
	}
}
</style>

<template>
	<Card class="onlive-log-table">
		<!--列表搜索框-->
		<div class="table-topbar">
			<Row type="flex">
				<Col style="flex:1 1 0%;">
				<Form ref="formSearch" :model="formSearch" inline>
					<FormItem class="icard-header">
						<Tooltip content="返回" placement="bottom-start">
							<Icon type="ios-arrow-dropleft" @click="goBack" class="card-back" />
						</Tooltip>
					</FormItem>
					<FormItem>
						<date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra />
					</FormItem>
					<FormItem>
						客服人员：
						<Tag v-if="formSearch.workerSelected != null" size="large" closable @on-close="workerClose">
							{{formSearch.workerSelected.nick_name}}({{formSearch.workerSelected.user_name}})
						</Tag>
						<Button v-else @click="onSelectWorker">选择客服...</Button>
					</FormItem>
					<FormItem>
						<Button type="primary" @click="searchPage">搜索</Button>
					</FormItem>
				</Form>
				</Col>
				<Col style="width:50px;text-align: right;">
					<Button icon="md-refresh" shape="circle" @click="init" title="刷新列表"></Button>
				</Col>
			</Row>
		</div>

		<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData"></Table>
		<div v-show="pageTotal" class="list_page">
			<Page
			:total="pageTotal"
			:page-size="pageSize"
			:current="currentPage"
			:page-size-opts="[20]"
			@on-change="e => changePage(e)"
			@on-page-size-change="ps => handlePageSize(ps)"
			show-elevator
			show-total
			show-sizer></Page>
		</div>
		<!-- <div v-show="pageTotal>0" class="table-pager-footer">
			<div style="float: right;">
				<Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
			</div>
		</div> -->

		<!--选择在线客服-->
		<csWorkerSelect ref="cs-worker-select" :canSelectAll="true" @on-ok="onSelectOk"></csWorkerSelect>

	</Card>
</template>

<script>
	import DateSelect from '@/views/my-components/date-select/index.vue';
	import csWorkerSelect from '@/views/my-components/cs-worker-select/cs-worker-select';
	import PageHelper from '@/libs/page-helper.js';
	/**
	 * 客服的在线工时统计报表
	 */
	export default {
		mixins: [ PageHelper ],
		name: 'csOnliveLogList',
		components: {
			DateSelect,
			csWorkerSelect,
		},
		data() {
			return {
				// 列表
				// columns: [],
				// data: [],
				// tableHeight: 500,
				// tableLoading: false,
				// pageTotal: 0,
				// pageSize: 20,
				canExport: false,
				workerId: 0,

				// 搜索表单
				formSearch: {
					searchTime: [],
					workerSelected: null,
				},
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				// 动态计算表高度
				// this.tableHeight = document.body.clientHeight - 200;
				this.workerId = this.$route.params.worker_id;
				this.loadData();
			},
			onLoadData(page, extData) {
				// this.tableLoading = true;
				// ajax 请求获取初始化数据，
				return this.$ajax.post(this.$api.csOnliveLogList, {
						isInit: 1,
						worker_id: this.workerId,
						search_time: this.formSearch.searchTime,
						...extData
					})
					.then((response) => {
						var res = response.data;
						// this.tableLoading = false;
						if (res.code) {
							// 初始化表头
							this.initTable(res);
							let data = res.data || {};
							this.data = {
								total: data.total,
								items: data.items
							}//res.data.items;
							this.formSearch.workerSelected = (data.items && data.items[0]) || {};

							// this.pageTotal = Number(res.data.total);
							// this.pageSize = Number(res.data.pageSize);
							this.canExport = res.data.canExport;

						}
					});
			},
			// 初始化表
			initTable(res) {
				this.columns = res.data.columns;

				// 用户头像 + 名称
				this.columns[0].render = (h, params) => {
					let row = params.row;

					return h('Row', {
						props: {
							type: "flex",
							justify: "start",
						}
					}, [
						h('Col', {
								style: {
									width: '50px',
								}
							},
							[h('Avatar', {
								props: {
									src: row.avatar_format,
									icon: 'md-person',
									size: 'large',
								},
								style: {
									marginRight: '5px',
									marginTop: '10px',
									marginBottom: '10px',
								},
							}), ]),
						h('Col', {
								style: {
									padding: '8px 5px 5px 0px',
									flex: '1 1 0%',
								}
							},
							[h('div', {
									style: {
										fontWeight: 'blod',
										overflow: 'hidden',
										display: '-webkit-box',
										'-webkit-line-clamp': 1,
										'-webkit-box-orient': 'vertical',
										wordBreak: 'break-all',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}
								}, row.nick_name),
								h('div', {
									style: {
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}
								}, row.user_name),
							]),
					]);
				};

				// 操作按钮
				this.columns[(this.columns.length - 1)]['render'] = (h, params) => {
					var buttons = '-';

					return h('div', buttons);
				}
			},
			// // 切换分页
			// changePage(page) {

			// 	this.tableLoading = true;
			// 	// ajax 请求获取数据，然后动态更新下面数据源
			// 	this.$ajax.post(this.$api.csOnliveLogList, {
			// 			worker_id: this.workerId,
			// 			search_time: this.formSearch.searchTime,
			// 			page: page,
			// 		})
			// 		.then((response) => {
			// 			var res = response.data;
			// 			if (res.code) {
			// 				// 初始化表数据
			// 				this.data = res.data.items;
			// 				this.pageTotal = Number(res.data.total);
			// 				this.pageSize = Number(res.data.pageSize);
			// 			}

			// 			this.tableLoading = false;
			// 		});
			// },
			// 搜索
			searchPage() {
				this.tableLoading = true;

				// ajax 请求获取初始化数据，
				this.$ajax.post(this.$api.csOnliveLogList, {
						worker_id: this.workerId,
						search_time: this.formSearch.searchTime,
					})
					.then((response) => {
						var res = response.data;
						this.tableLoading = false;
						if (res.code) {
							let data = res.data || {};
							this.data = {
								total: data.total,
								items: data.items
							}
							// this.pageTotal = Number(res.data.total);
							// this.pageSize = Number(res.data.pageSize);
						}
					});
			},
			// 选择日期的回调
			handleStart(date) {
				this.$set(this.formSearch.searchTime, 0, date);
			},
			handleEnd(date) {
				this.$set(this.formSearch.searchTime, 1, date);
			},
			goBack() {
				this.$router.back();
			},

			// 清除选中的客服人员
			workerClose() {
				this.formSearch.workerSelected = null;
			},
			// 打开客服选择器
			onSelectWorker() {
				this.$refs['cs-worker-select'].openModal([], 'radio');
			},
			// 选客服的组件的 回调
			onSelectOk(items) {
				if (items.length > 0) {
					this.$set(this.formSearch, 'workerSelected', items[0]);
					this.$set(this.formSearch.workerSelected, 'user_name', items[0]['get_admin_info']['name']);
					this.workerId = items[0]['id'];
				}
			},
		},
	}
</script>
