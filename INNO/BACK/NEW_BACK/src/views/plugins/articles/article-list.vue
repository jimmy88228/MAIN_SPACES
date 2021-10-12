<style lang="less">
	.articles-list{

}
</style>

<template>
	<div class="articles-list">
		<Card v-show="showArticleList">
			<!--列表搜索框-->
			<div class="table-topbar">
				<Row>
					<Col span="20">
					<!--搜索表单-->
					<searchForm ref="search-form" @on-search="searchPage"></searchForm>
					</Col>
					<Col span="4">
					<Button v-if="canCreate" type="info" icon="md-add" @click="openModal({})" style="float:right">添加文章</Button>
					</Col>
				</Row>
			</div>

			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
			<div v-show="pageTotal>0" style="margin:10px 10px 0 10px;overflow: hidden">
				<div style="float: right;">
					<Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
				</div>
			</div>
		</Card>

		<!--文章编辑表单-->
		<articleForm ref="article-form" @on-success="formSaveCallback" @on-close="formClose"></articleForm>

	</div>
</template>

<script>
	/**
	 * 文章列表
	 */
	import util from '@/libs/util.js';
	import searchForm from './search-form';
	import articleForm from './article-form';

	export default {
		components: {
			searchForm,
			articleForm
		},
		data() {
			return {
				// 列表
				columns: [],
				data: [],
				tableHeight: 500,
				tableLoading: false,
				pageTotal: 0,
				pageSize: 20,

				canCreate: false,

				modalEditIndex: 0,
				showArticleList: true,
				catTree: [],
				uploadServer: '',
				toolbars: []
			}
		},
		computed: {},
		methods: {
			/**
			 * @desc 初始化方法
			 */
			init() {
				// 动态计算表高度
				this.tableHeight = document.body.clientHeight - 200;

				this.initData();
			},
			// 初始化 加载数据，（不会自动加载，而是父组件触发加载）
			initData() {
				this.tableLoading = true;
				// ajax 请求获取初始化数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.articleList, {
						isInit: 1
					})
					.then((response) => {
						this.tableLoading = false;
						var res = response.data;

						if (res.code) {
							// 初始化表
							this.initTable(res);

							// 初始化表数据
							this.data = res.data.items;
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);
							this.canCreate = res.data.canCreate;
							this.catTree = res.data.catTree;
							this.uploadServer = res.data.uploadServer;
							this.toolbars = res.data.toolbars;

							this.$refs['search-form'].initData(this.catTree);
						}
					});
			},
			// 表头初始化
			initTable(res) {
				this.columns = res.data.columns;

				// 状态标识
				this.columns[(this.columns.length - 2)].render = (h, params) => {
					const row = params.row;
					const color = row.status == 1 ? 'success' : row.status == 0 ? 'error' : 'error';
					const text = row.status == 1 ? '已发布' : row.status == 0 ? '未发布' : '未发布';

					return h('Tag', {
						props: {
							type: 'dot',
							color: color
						}
					}, text);
				};

				// 操作按钮
				this.columns[(this.columns.length - 1)].render = (h, params) => {
					var buttons = [];

					// 预览按钮
					buttons.push(
						h('Tooltip', {
								props: {
									placement: 'top',
									content: '预览'
								}
							},
							[h('Icon', {
								props: {
									type: 'ios-eye-outline',
									size: '28'
								},
								style: {
									marginRight: '5px',
									cursor: 'pointer'
								},
								on: {
									click: () => {
										this.viewArticle(params.index, params.row)
									}
								}
							})]
						)
					);

					if (params.row.handle.edit) {
						// 编辑按钮
						buttons.push(
							h('Tooltip', {
									props: {
										placement: 'top',
										content: '编辑'
									}
								},
								[h('Icon', {
									props: {
										type: 'ios-create-outline',
										size: '28'
									},
									style: {
										marginRight: '5px',
										cursor: 'pointer'
									},
									on: {
										click: () => {
											this.editArticle(params.index, params.row)
										}
									}
								})]
							)
						);
					}

					if (params.row.handle.remove) {
						// 删除
						buttons.push(
							h('Tooltip', {
									props: {
										placement: 'top',
										content: '删除'
									}
								},
								[h('Icon', {
									props: {
										type: 'ios-trash-outline',
										size: '28'
									},
									style: {
										marginRight: '5px',
										cursor: 'pointer'
									},
									on: {
										click: () => {
											this.removeArticle(params.index, params.row)
										}
									}
								})]
							)
						);
					}

					return h('div', buttons);
				};
			},
			// 切换分页
			changePage(page) {
				this.tableLoading = true;
				// ajax 请求获取数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.articleList, {
						page: page
					})
					.then((response) => {
						var res = response.data;
						if (res.code) {
							// 初始化表数据
							this.data = res.data.items;
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);
						}

						this.tableLoading = false;
					});
			},
			// 搜索 - 回调函数
			searchPage(searchForm) {
				this.tableLoading = true;

				// ajax 请求获取数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.articleList, searchForm)
					.then((response) => {
						var res = response.data;
						if (res.code) {
							// 初始化表数据
							this.data = res.data.items;
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);
						}

						this.tableLoading = false;
					});
			},
			// 预览文章
			viewArticle(index, row) {
				window.open('/article/info/' + row.code);
			},
			// 编辑文章
			editArticle(index, row) {
				this.modalEditIndex = index;
				this.openModal(row);
			},
			// 删除文章
			removeArticle(index, row) {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定删除文章吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.tableLoading = true;
						// ajax 请求获取数据
						util.ajax.post(util.apiUrl.articleRemove, {
								id: row.id
							})
							.then((response) => {
								var res = response.data;
								if (res.code) {
									// 删除后
									this.$delete(this.data, index);
									this.$Message.success(res.message);
								} else {
									this.$Message.error(res.message);
								}
								this.tableLoading = false;
							});
					}
				});
			},
			// 打开编辑模态框
			openModal(row) {
				this.showArticleList = false;

				this.$refs['article-form'].openModal(row, this.catTree, this.uploadServer, this.toolbars);
			},
			// 表单关闭的回调
			formClose() {
				this.showArticleList = true;
			},
			// 表单保存的回调
			formSaveCallback(obj) {
				this.showArticleList = true;
				if (obj.isAdd) {
					this.pageTotal++;
					this.data.unshift(obj.data);
				} else {
					for (var i in obj.data) {
						// 修改：更新data 数据即可,更新数据用 this.$set()
						this.$set(this.data[this.modalEditIndex], i, obj.data[i]);
					}
				}
			}
		},
		watch: {},
		mounted() {
			this.init();
		},
		created() {

		}
	};
</script>
