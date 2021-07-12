<style lang="less">
	.tags-list{
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
	<Card class="tags-list">
		<!--列表搜索框-->
		<div class="table-topbar">
			<Row type="flex">
				<Col style="flex:1 1 0%;">
				<Form ref="formSearch" :model="formSearch" inline>
					<FormItem>
						<date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra />
					</FormItem>
					<FormItem>
						分类：
						<Select v-model="formSearch.cat_id" placeholder="" style="width:160px" clearable>
							<Option :value="-1">全部分类</Option>
							<OptionGroup v-for="(group, gindex) in catList" :key="gindex" :label="group.name">
								<Option v-for="(item,index) in group.children" :value="item.id" :key="index">{{item.name}}</Option>
							</OptionGroup>
						</Select>
					</FormItem>
					<FormItem>
						客服人员：
						<Tag closable size="large" v-if="formSearch.workerSelected.admin_id > 0" @on-close="workerClose">{{formSearch.workerSelected.nick_name}}</Tag>
						<Button v-else icon="md-add" type="dashed" @click="onSelectWorker">选择客服</Button>
					</FormItem>
					<FormItem>
						<Input v-model="formSearch.searchq" :style="formSearch.searchq != '' ? 'width:260px': 'width:220px' " placeholder="请输入 标签名 搜索"
						 clearable search enter-button @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent="searchPage">
						</Input>
					</FormItem>
					<FormItem>
						<Button type="success" icon="md-arrow-round-down" @click="exportExcel({id:0})">导出当前结果</Button>
					</FormItem>
				</Form>
				</Col>
				<Col style="width:90px;text-align: right;">
					<Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>
		</div>

		<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData"></Table>
		<div v-show="pageTotal" class="list_page table-pager-footer">
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
	import mqNotice from '@/views/my-components/mq-notice/mq-notice';
	import csWorkerSelect from '@/views/my-components/cs-worker-select/cs-worker-select';
	import DateSelect from '@/views/my-components/date-select/index.vue';
	import PageHelper from '@/libs/page-helper.js';

	/**
	 * 这个可以作为通用标签统计列表来使用
	 */
	export default {
		name: 'tagsList',
		mixins: [PageHelper],
		components: {
			mqNotice,
			csWorkerSelect,
			DateSelect,
		},
		props: {
			tagsType: {
				type: String,
				default: 'csTags',
			}
		},
		data() {
			return {
				// 搜索表单
				formSearch: {
					cat_id: -1,
					searchq: '',
					searchTime: [],
					workerSelected: {
						admin_id: 0,
					},
				},

				catList: [],
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.loadData();
			},
			onLoadData(page, extData) {
				// ajax 请求获取初始化数据，
				return	this.$ajax.post(this.$api.tagsTableList, {
						isInit: 1,
						searchq: this.formSearch.searchq,
						cat_id: this.formSearch.cat_id,
						searchTime: this.formSearch.searchTime,
						admin_id: this.formSearch.workerSelected.admin_id,
						type: this.tagsType,
						...extData
					})
					.then((response) => {
						let res = response.data;
						let data = res.data || {};
						if (res.code) {
							// 初始化表头
							this.initTable(res);
							// this.data = res.data.items;
							this.catList = res.data.catList;
							// this.pageTotal = Number(res.data.total);
							// this.pageSize = Number(res.data.pageSize);
							this.data = {
								total: data.total,
								items: data.items
							}
						}
					});
			},
			// 初始化表
			initTable(res) {
				this.columns = res.data.columns;
				// 在线状态标识
				this.columns[2]['render'] = (h, params) => {

					return h('a', {
						props: {},
						on: {
							click: () => {
								this.tagsUserList(params.row);
							}
						}
					}, params.row.get_user_related_tags_count);
				};

				// 操作按钮
				this.columns[(this.columns.length - 1)]['render'] = (h, params) => {
					var buttons = [];
					// 查看按钮
					buttons.push(
						h('span', {
								attrs: {
									title: '查看'
								}
							},
							[h('span', {
								class: 'table-handle-button',
								on: {
									click: () => {
										this.tagsUserList(params.row);
									}
								}
							}, '查看')]
						)
					);

					// 查看按钮
					buttons.push(
						h('span', {
								attrs: {
									title: '导出标签用户'
								}
							},
							[h('span', {
								class: 'table-handle-button',
								on: {
									click: () => {
										this.exportExcel(params.row);
									}
								}
							}, '导出标签用户')]
						)
					);

					return h('div', buttons);
				}
			},
			// 切换分页
			// changePage(page) {
			// 	this.tableLoading = true;
			// 	// ajax 请求获取初始化数据，
			// 	this.$ajax.post(this.$api.tagsTableList, {
			// 			type: this.tagsType,
			// 			page: page,
			// 			searchq: this.formSearch.searchq,
			// 			cat_id: this.formSearch.cat_id,
			// 			admin_id: this.formSearch.workerSelected.admin_id,
			// 		})
			// 		.then((response) => {
			// 			var res = response.data;
			// 			this.tableLoading = false;

			// 			if (res.code) {
			// 				this.data = res.data.items;

			// 				this.pageTotal = Number(res.data.total);
			// 				this.pageSize = Number(res.data.pageSize);
			// 			}
			// 		});
			// },
			// 搜索
			searchPage() {
				this.tableLoading = true;
				// // ajax 请求获取初始化数据，
				this.$ajax.post(this.$api.tagsTableList, {
						type: this.tagsType,
						searchq: this.formSearch.searchq,
						cat_id: this.formSearch.cat_id,
						searchTime: this.formSearch.searchTime,
						admin_id: this.formSearch.workerSelected.admin_id,
					})
					.then((response) => {
						let res = response.data;
						let data = res.data || {};
						this.tableLoading = false;
						if (res.code) {
							this.data = {
								total: data.total,
								items: data.items
							}
						}
					});
			},
			// 导出excel
			exportExcel(item) {
				this.tableLoading = true;
				// ajax 请求获取数据
				this.$ajax.post(this.$api.tagsTableExport, {
						type: this.tagsType,
						tag_id: item.id,
						searchq: this.formSearch.searchq,
						cat_id: this.formSearch.cat_id,
						searchTime: this.formSearch.searchTime,
						admin_id: this.formSearch.workerSelected.admin_id,
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
			// 跳转到标签关联的用户列表
			tagsUserList(row) {
				let url = '/data/tags-user-list/' + row.id + '?';
				
				// 下面是把搜索的参数传递给下一个页面
				if( this.formSearch.searchTime[0] != null && this.formSearch.searchTime[0] != '' ){
					url += '&searchTimeFrom=' + this.formSearch.searchTime[0];
				}
				if( this.formSearch.searchTime[1] != null && this.formSearch.searchTime[1] != '' ){
					url += '&searchTimeTo=' + this.formSearch.searchTime[1];
				}
				this.$router.push( url );
			},
			// 清除选中的客服人员
			workerClose() {
				this.formSearch.workerSelected.admin_id = 0;
			},
			// 打开客服选择器
			onSelectWorker() {
				this.$refs['cs-worker-select'].openModal([], 'radio');
			},
			// 选客服的组件的 回调
			onSelectOk(items) {
				if (items.length > 0) {
					this.$set(this.formSearch, 'workerSelected', items[0]);
				}
			},
			// 选择日期的回调
			handleStart(date) {
				this.$set(this.formSearch.searchTime, 0, date);
			},
			handleEnd(date) {
				this.$set(this.formSearch.searchTime, 1, date);
			},
		},
	}
</script>
