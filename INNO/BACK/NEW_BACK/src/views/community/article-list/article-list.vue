<style lang="less">
	.article-list{

}
</style>

<template>
	<div class="article-list">
		<div class="table-topbar">
			<Row>
				<Col span="20">&nbsp;</Col>
				<Col span="4">
				<Button v-if="canCreate" type="info" icon="md-add" style="float:right" @click="openModal('', true)">添加文章</Button>
				</Col>
			</Row>
		</div>

		<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
		<div v-show="pageTotal>0" style="margin: 10px;overflow: hidden">
			<div style="float: right;">
				<Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
			</div>
		</div>

		<!--表单组件-->
		<articleForm ref="article-form" @on-add="formAdd" @on-update="formUpdate"></articleForm>
	</div>
</template>

<script>
	import util from '@/libs/util.js';
	import articleForm from './article-form';

	export default {
		components: {
			articleForm
		},
		data() {
			return {
				// 表单数据
				columns: [],
				data: [],
				tableHeight: 500,
				tableLoading: false,

				canCreate: false,

				pageTotal: 0,
				pageSize: 20,

				modalEditIndex: 0
			}
		},
		methods: {
			// 初始化方法
			init() {
				// 动态计算表高度
				this.tableHeight = document.body.clientHeight - 170;

				this.tableLoading = true;
				// ajax 请求获取初始化数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.articleList, {
						isInit: 1
					})
					.then((response) => {
						this.tableLoading = false;
						var res = response.data;

						if (res.code) {
							this.initTable(res);

							// 初始化表格数据
							this.data = res.data.items;

							this.canCreate = res.data.canCreate;
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);

							// 初始化表单
							this.$refs['role-form'].initForm(res);
						}
					});
			},
			// 初始化表
			initTable(res) {
				// 初始化字段
				this.columns = res.data.columns;

				// 自定义的操作按钮
				this.columns[(this.columns.length - 2)].render = (h, params) => {
					const row = params.row;
					const color = row.status == 1 ? 'success' : row.status == 2 ? 'error' : 'error';
					const text = row.status == 1 ? '已发布' : row.status == 2 ? '已禁用' : '未知状态';

					return h('Tag', {
						props: {
							type: 'dot',
							color: color
						}
					}, text);
				}

				this.columns[(this.columns.length - 1)].render = (h, params) => {
					var buttons = [];

					if (params.row.handle.edit) {
						// 编辑按钮
						buttons.push(h('Button', {
							props: {
								type: 'primary',
								size: 'small'
							},
							style: {
								marginRight: '5px'
							},
							on: {
								click: () => {
									this.editArticle(params.index, params.row, true)
								}
							}
						}, '编辑'));
					}

					if (params.row.handle.view) {
						// 查看按钮
						buttons.push(h('Button', {
							props: {
								type: 'success',
								size: 'small'
							},
							on: {
								click: () => {
									this.viewArticle(params.index, params.row)
								}
							}
						}, '预览文章'));
					}

					return h('div', buttons);
				}
			},
			// 编辑角色
			editArticle(index, row, showFooter) {
				this.modalEditIndex = index;
				this.$refs['article-form'].editRole(index, row, showFooter);
			},
			// 查看按钮处理
			viewArticle(index, row) {
				this.$refs['article-form'].editRole(index, row, false);
			},
			openModal(row, isAdd) {
				this.$refs['article-form'].openModal(row, isAdd);
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
			// 保存成功后
			formAdd(data) {
				// 新增： 给role 列表数组加入新数据
				this.data.unshift(data);
			},
			formUpdate(data) {
				// 修改：更新data 数据即可,更新数据用 this.$set()
				this.$set(this.data, this.modalEditIndex, data);
			}
		},
		mounted() {
			this.init();
		}
	}
</script>
