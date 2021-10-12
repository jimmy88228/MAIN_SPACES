<style lang="less">
	.articles-cat{
    .table-topbar{
        .ivu-form-item{
            margin-bottom: 10px;
        }
		.ivu-input-icon-clear{
			right:50px;
	    }
    }

    .ivu-table-expanded-cell{
    	padding:0;
    }
    .ivu-table-wrapper{
    	border: 0 none;
    }
    .ivu-table td{
    	border-bottom:0 none;
    }
    .ivu-table:after{
    	width:0;
    }
    /*自定义的table背景颜色*/
    td.c1-column{
    	background-color:#f3f3f3de;
    }
    td.c2-column{
    	background-color:#eeeeee4f;
    }
}
</style>

<template>
	<div class="articles-cat">
		<Card v-show="showList">
			<!--列表搜索框-->
			<div class="table-topbar">
				<Row>
					<Col span="20">
					<Form ref="formSearch" :model="formSearch" inline>
						<FormItem>
							<Input v-model="formSearch.searchq" style="width:280px;" placeholder="分类名称 模糊查询" clearable search enter-button
							 @on-search="searchPage" @on-clear="onClear" @keydown.native.enter.prevent="searchPage"></Input>
						</FormItem>
					</Form>
					</Col>
					<Col span="4">
					<Button v-if="canCreate" type="info" icon="md-add" @click="createCat" style="float:right">添加文章分类</Button>
					</Col>
				</Row>
			</div>

			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data" no-data-text="暂无分类"></Table>
		</Card>

		<articleCatForm ref="article-cat-form" @on-close="showCatList" @on-success="reloadCatList"></articleCatForm>
	</div>
</template>

<script>
	/**
	 * 文章分类
	 *
	 * 这个是非常经典的三级table 渲染，
	 * 可以作为案例
	 */
	import util from '@/libs/util.js';
	import articleCatForm from './article-cat-form';
	import tableExpand from './cat-table-expand';

	export default {
		name: 'articleCat',
		components: {
			articleCatForm,
			tableExpand
		},
		data() {
			return {
				// 列表
				columns: [],
				data: [],
				tableHeight: 500,
				tableLoading: false,
				pageTotal: 0,
				pageSize: 200,
				canCreate: false,

				// 搜索表单
				formSearch: {
					searchq: ''
				},

				showList: true
			}
		},
		methods: {
			// 初始化方法
			init() {
				// 动态计算表高度
				this.tableHeight = document.body.clientHeight - 200;

				this.formSearch.searchq = this.$route.params.searchq;
				this.tableLoading = true;
				// ajax 请求获取初始化数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.articleCatList, {
						isInit: 1,
						searchq: this.formSearch.searchq
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
						}
					});
			},
			// 初始化表
			initTable(res) {
				this.columns = res.data.columns;

				// 设置table 扩展信息
				this.setTableExpand();

				// 状态标识
				this.columns[(this.columns.length - 2)].render = (h, params) => {
					return this.tagsColumn(h, params);
				};

				// 操作按钮
				this.columns[(this.columns.length - 1)].render = (h, params) => {
					return this.handleButton(h, params);
				}
			},
			// 设置table 扩展信息
			setTableExpand() {
				var childColumns = [];
				for (var i in this.columns) {
					childColumns[i] = {};
					childColumns[i].title = '';
					childColumns[i].className = 'c2-column';

					if (i == this.columns.length - 2) {
						childColumns[i].render = (h, params) => {
							const row = params.row;
							const color = row.status == 1 ? 'success' : row.status == 2 ? 'error' : 'error';
							const text = row.status == 1 ? '正常' : row.status == 2 ? '隐藏' : '未知';

							return h('Tag', {
								props: {
									type: 'dot',
									color: color
								}
							}, text);
						};
					}

					if (i == this.columns.length - 1) {
						childColumns[i].render = (h, params) => {
							var buttons = [];

							if (params.row.handle.edit) {
								// 编辑按钮
								buttons.push(
									h('Tooltip', {
											props: {
												placement: 'left',
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
													this.editArticlesCat(params.index, params.row);
												}
											}
										})]
									)
								);
							}

							if (params.row.handle.remove && params.row.get_articles_count == 0) {
								// 删除
								buttons.push(
									h('Tooltip', {
											props: {
												placement: 'right',
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
													this.removeArticleCat(params.index, params.row);
												}
											}
										})]
									)
								);
							}
							return h('div', buttons);
						}
					}

					if (typeof(this.columns[i].key) !== 'undefined') {
						childColumns[i].key = this.columns[i].key;
					}
					if (typeof(this.columns[i].align) !== 'undefined') {
						childColumns[i].align = this.columns[i].align;
					}
					if (typeof(this.columns[i].width) !== 'undefined') {
						if (i == 0) {
							childColumns[i].width = 60;
						} else {
							childColumns[i].width = this.columns[i].width;
						}
					}
					if (i == 0) {
						childColumns[i].type = 'expand';

						// 第三层分类的渲染函数
						childColumns[i].render = (h, params) => {
							if (params.row.get_children.length > 0) {
								return h(tableExpand, {
									props: {
										dataList: params.row.get_children,
										columns: this.cat3Columns(),
										level: 3
									}
								});
							}
						}
					}
				}

				// 第二层分类的渲染
				this.columns[0].render = (h, params) => {
					if (params.row.get_children.length > 0) {
						return h(tableExpand, {
							props: {
								dataList: params.row.get_children,
								columns: childColumns,
								level: 2
							}
						});
					}
				};
			},
			// 组装 第三层分类的 column
			cat3Columns() {
				var childColumns = [];
				for (var i in this.columns) {
					childColumns[i] = {};
					childColumns[i].title = '';

					if (i == this.columns.length - 2) {
						childColumns[i].render = (h, params) => {
							const row = params.row;
							const color = row.status == 1 ? 'success' : row.status == 2 ? 'error' : 'error';
							const text = row.status == 1 ? '正常' : row.status == 2 ? '隐藏' : '未知';

							return h('Tag', {
								props: {
									type: 'dot',
									color: color
								}
							}, text);
						};
					}

					if (i == this.columns.length - 1) {
						childColumns[i].render = (h, params) => {
							var buttons = [];

							if (params.row.handle.edit) {
								// 编辑按钮
								buttons.push(
									h('Tooltip', {
											props: {
												placement: 'left',
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
													this.editArticlesCat(params.index, params.row);
												}
											}
										})]
									)
								);
							}

							if (params.row.handle.remove && params.row.get_articles_count == 0) {
								// 删除
								buttons.push(
									h('Tooltip', {
											props: {
												placement: 'right',
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
													this.removeArticleCat(params.index, params.row);
												}
											}
										})]
									)
								);
							}
							return h('div', buttons);
						}
					}

					if (typeof(this.columns[i].key) !== 'undefined') {
						childColumns[i].key = this.columns[i].key;
					}
					if (typeof(this.columns[i].align) !== 'undefined') {
						childColumns[i].align = this.columns[i].align;
					}
					if (typeof(this.columns[i].width) !== 'undefined') {
						if (i == 0) {
							childColumns[i].width = 80;
						} else {
							childColumns[i].width = this.columns[i].width;
						}
					}
				}
				return childColumns;
			},
			tagsColumn(h, params) {
				const row = params.row;
				const color = row.status == 1 ? 'success' : row.status == 2 ? 'error' : 'error';
				const text = row.status == 1 ? '正常' : row.status == 2 ? '隐藏' : '未知';

				return h('Tag', {
					props: {
						type: 'dot',
						color: color
					}
				}, text);
			},
			// 按钮渲染
			handleButton(h, params) {
				var buttons = [];

				if (params.row.handle.edit) {
					// 编辑按钮
					buttons.push(
						h('Tooltip', {
								props: {
									placement: 'left',
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
										this.editArticlesCat(params.index, params.row);
									}
								}
							})]
						)
					);
				}

				if (params.row.handle.remove && params.row.get_articles_count == 0) {
					// 删除
					buttons.push(
						h('Tooltip', {
								props: {
									placement: 'right',
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
										this.removeArticleCat(params.index, params.row);
									}
								}
							})]
						)
					);
				}
				return h('div', buttons);
			},
			// 搜索
			searchPage() {
				if (this.formSearch.searchq != '') {
					this.$router.replace({
						path: '/plugins/article-cat-search/' + this.formSearch.searchq
					});
				} else {
					this.$router.replace({
						path: '/plugins/article-cat'
					});
				}
			},
			// 添加分类
			createCat() {
				this.showList = false;
				this.$refs['article-cat-form'].openModal({
					id: 0
				}, this.data);
			},
			// 删除分类
			removeArticleCat(index, row) {
				this.$Modal.confirm({
					title: '删除分类',
					content: '确定删除分类吗？只有无关联文章 和 无子分类，才能删除成功。',
					okText: '确定删除',
					cancelText: '取消',
					onOk: () => {
						this.tableLoading = true;
						// ajax 请求获取数据，然后动态更新下面数据源
						util.ajax.post(util.apiUrl.articleCatRemove, {
								id: row.id
							})
							.then((response) => {
								var res = response.data;
								if (res.code) {
									// 删除后重新加载
									this.reloadCatList();
									this.$Message.success(res.message);
								} else {
									this.$Message.error(res.message);
								}
								this.tableLoading = false;
							});
					}
				});
			},
			// 编辑按钮
			editArticlesCat(index, row) {
				this.modalEditIndex = index;

				// 打开编辑模态框
				this.showList = false;
				this.$refs['article-cat-form'].openModal(row, this.data);
			},
			// 回调
			showCatList() {
				this.showList = true;
			},
			onClear() {
				this.$router.push('/plugins/article-cat');
			},
			// 重新加载列表
			reloadCatList() {
				// 因为涉及到嵌套渲染，会导致更新后渲染不处理，这里的解决是变化路由
				this.$router.push('/plugins/article-cat-reload');
			}
		},
		watch: {

		},
		mounted() {
			this.init();
		}
	}
</script>
