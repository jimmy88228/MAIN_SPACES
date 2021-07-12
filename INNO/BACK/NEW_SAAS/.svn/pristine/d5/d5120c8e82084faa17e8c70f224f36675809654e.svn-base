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
					<FormItem>
						<date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra />
					</FormItem>
					<FormItem>
						客服人员：
						<Tag closable v-for="(item,index) in formSearch.workerSelected" :key="index" size="large" @on-close="workerClose(index)">{{item.nick_name}}</Tag>
						<Button icon="md-add" type="dashed" @click="onSelectWorker">选择客服</Button>
					</FormItem>
					<FormItem>
						客服分组：
						<Select v-model="formSearch.worker_group_id" placeholder="" style="width:160px" clearable>
							<Option :value="-1">全部分组</Option>
							<Option v-for="(item, key) in groupList" :value="item.id" :key="key">{{item.name}}</Option>
						</Select>
					</FormItem>
					<FormItem>
						<Button type="primary" @click="searchPage">搜索</Button>
						<Button v-if="canExport" type="success" @click="exportExcel">导出当前报表</Button>
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

		<!--异步处理导出excel组件-->
		<mqNotice ref="mq-notice"></mqNotice>
	</Card>
</template>

<script>
	import csWorkerSelect from '@/views/my-components/cs-worker-select/cs-worker-select';
	import DateSelect from '@/views/my-components/date-select/index.vue';
	import mqNotice from '@/views/my-components/mq-notice/mq-notice';
	import PageHelper from '@/libs/page-helper.js';
	/**
	 * 客服的在线工时统计报表
	 */
	export default {
		mixins:[ PageHelper ],
		name: 'csOnliveLogTable',
		components: {
			DateSelect,
			csWorkerSelect,
			mqNotice,
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

				// 搜索表单
				formSearch: {
					worker_group_id: -1,
					searchTime: [],
					workerSelected: [],
				},

				groupList: [],
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				// 动态计算表高度
				this.tableHeight = document.body.clientHeight - 240;

				this.loadData();
			},
			onLoadData(page, extData) {
				// this.tableLoading = true;
				// ajax 请求获取初始化数据，
				let worker_ids = [];
				for (let i in this.formSearch.workerSelected) {
					worker_ids.push(this.formSearch.workerSelected[i].id);
				}
				return this.$ajax.post(this.$api.csOnliveLogTable, {
					isInit: 1,
					worker_group_id: this.formSearch.worker_group_id,
					worker_ids: worker_ids,
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
						}
						this.groupList = data.groupList;
						// this.pageTotal = Number(res.data.total);
						// this.pageSize = Number(res.data.pageSize);
						this.canExport = data.canExport;

					}
				});
			},
			// 初始化表
			initTable(res) {
				this.columns = res.data.columns;

				// 用户头像 + 名称
				this.columns[0].render = (h, params) => {
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
									src: params.row.avatar_format,
									icon: 'md-person',
									size: 'large',
								},
								style: {
									marginRight: '5px',
									marginTop: '10px',
									marginBottom: '10px',
									cursor: 'pointer',
								},
								attrs: {
									title: '点击查看大图',
								},
								nativeOn: {
									click: () => {
										this.$util.viewImage(params.row.avatar_format, this);
									}
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
								}, params.row.nick_name),
								h('div', {
									style: {
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}
								}, params.row.get_admin_info.name != '' ? params.row.get_admin_info.name : ''),
							]),
					]);
				};

				// 操作按钮
				this.columns[(this.columns.length - 1)]['render'] = (h, params) => {
					var buttons = [];

					// 查看按钮
					buttons.push(
						h('span', {
								attrs: {
									title: '查看明细'
								}
							},
							[h('span', {
								class: 'table-handle-button',
								on: {
									click: () => {
										this.viewInfo(params.row);
									}
								}
							}, '明细')]
						)
					);

					return h('div', buttons);
				}
			},
			// // 切换分页
			// changePage(page) {

			// 	var worker_ids = [];
			// 	for (var i in this.formSearch.workerSelected) {
			// 		worker_ids.push(this.formSearch.workerSelected[i].id);
			// 	}

			// 	this.tableLoading = true;
			// 	// ajax 请求获取数据，然后动态更新下面数据源
			// 	this.$ajax.post(this.$api.csOnliveLogTable, {
			// 			page: page,

			// 			worker_group_id: this.formSearch.worker_group_id,
			// 			worker_ids: worker_ids,
			// 			search_time: this.formSearch.searchTime,
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

				let worker_ids = [];
				for (let i in this.formSearch.workerSelected) {
					worker_ids.push(this.formSearch.workerSelected[i].id);
				}
				
				// ajax 请求获取初始化数据，
				this.$ajax.post(this.$api.csOnliveLogTable, {
						worker_group_id: this.formSearch.worker_group_id,
						worker_ids: worker_ids,
						search_time: this.formSearch.searchTime,
					})
					.then((response) => {
						let res = response.data;
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
			// 导出excel
			exportExcel() {
				var worker_ids = [];
				for (var i in this.formSearch.workerSelected) {
					worker_ids.push(this.formSearch.workerSelected[i].id);
				}

				this.tableLoading = true;
				// ajax 请求获取数据
				this.$ajax.post(this.$api.csOnliveLogExport, {
						worker_group_id: this.formSearch.worker_group_id,
						worker_ids: worker_ids,
						search_time: this.formSearch.searchTime,
					})
					.then((response) => {
						this.tableLoading = false;
						var res = response.data;
						if (res.code) {
							var jobId = res.data;
							// 打开异步提示组件
							this.$refs['mq-notice'].showNotice(jobId);
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
			// 跳转到标签关联的用户列表
			viewInfo(row) {
				this.$router.push('/plugins/cs-onlivelog-list/' + row.id);
			},
			// 清除选中的客服人员
			workerClose(index) {
				this.$delete(this.formSearch.workerSelected, index);
			},
			// 打开客服选择器
			onSelectWorker() {
				this.$refs['cs-worker-select'].openModal([], 'checkbox');
			},
			// 选客服的组件的 回调
			onSelectOk(items) {
				if (items.length > 0) {
					this.$set(this.formSearch, 'workerSelected', items);
				}
			},
		},
	}
</script>
