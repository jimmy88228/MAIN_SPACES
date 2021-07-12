<style lang="less">
	.page-goods-list{
	.table-topbar{
        margin-bottom: 10px;
        text-align: right;
    }
}
</style>

<template>
	<div>
		<Card v-show="showList" class="page-goods-list">
			<Row type="flex">
				<Col style="flex:1 1 0%;">
				<Form ref="formSearch" :model="formSearch" inline>
					<FormItem>
						状态：
						<Select v-model="formSearch.status" placeholder="页面状态" style="width:110px">
							<Option value="-1">全部状态</Option>
							<Option v-for="(item, key) in statusList" :value="key" :key="key">{{item.name}}</Option>
						</Select>
					</FormItem>
					<FormItem>
						分类：
						<Select v-model="formSearch.catId" placeholder="分类" style="width:110px">
							<Option value="-1">全部分类</Option>
							<Option v-for="(item, key) in catList" :value="item.id" :key="item.id">{{item.name}}</Option>
						</Select>
					</FormItem>
					<FormItem>
						<Input v-model="formSearch.searchq" :style="{width: 300 +'px'}" placeholder="" clearable search enter-button
						 @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent="searchPage">
						<Select v-model="formSearch.searchqType" slot="prepend" style="width:90px">
							<Option value="title">标题</Option>
						</Select>
						</Input>
					</FormItem>
				</Form>
				</Col>
				<Col style="width:250px;text-align: right;">
				<div class="table-topbar">
					<Button v-if="canCreate" type="success" icon="md-add" @click="createPage">创建微页面</Button>
					<Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
				</div>
				</Col>
			</Row>

			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
			<div v-show="pageTotal>0" style="margin:10px;overflow: hidden">
				<div style="float: right;">
					<Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
				</div>
			</div>

			<!--选择页面模板-->
			<pageTemplate ref="page-template" @on-success="createPageCallback"></pageTemplate>
		</Card>

		<editorMain v-if="!showList" title="自定义页面 - " pageType="page" ref="page-editor" @on-close="onBack"></editorMain>
	</div>
</template>

<script>
	/**
	 * 微页面列表
	 */
	import pageTemplate from './page-template';
	import editorMain from './editor-main';
	import pageListSort from './page-list-sort';

	export default {
		components: {
			pageTemplate,
			editorMain,
			pageListSort,
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
				statusList: [],
				showList: true,
				catList: [],

				formSearch: {
					searchq: '',
					searchqType: 'title',
					status: -1,
				},
			}
		},
		methods: {
			// 初始化
			init() {
				// 动态计算表高度
				this.tableHeight = document.body.clientHeight - 220;

				this.tableLoading = true;
				// ajax 请求获取初始化数据
				this.$ajax.post( this.$api.goodsPageList, {
						isInit: 1,
						catId: this.formSearch.catId,
						searchq: this.formSearch.searchq,
						searchqType: this.formSearch.searchqType,
						status: this.formSearch.status,
					})
					.then((response) => {
						this.tableLoading = false;
						var res = response.data;

						if (res.code) {
							// 初始化表
							this.initTable(res);

							// 初始化表数据
							this.data = res.data.items;
							this.statusList = res.data.statusList;
							this.catList = res.data.catList;
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);
							this.canCreate = res.data.canCreate;
						}
					});
			},
			// 初始化表
			initTable(res) {
				this.columns = res.data.columns;
				const _this = this;

				// 图片 + 名称
				this.columns[0].render = (h, params) => {
					return h('Row', {
						props: {
							type: "flex",
							justify: "start",
						}
					}, [
						h('Col', {
								style: {
									padding: '5px 5px 5px 0',
								}
							},
							[h('div', {
								style: {
									background: 'url(' + params.row.cover_image_format + ') center center / 100% no-repeat #fff',
									backgroundSize: '100% auto',
									height: '50px',
									width: '50px',
									border: '1px solid #eee',
									borderRadius: '5px',
									cursor: 'pointer',
									display: params.row.cover_image_format == null || params.row.cover_image_format == '' ? 'none' : '',
								},
								attrs: {
									title: '点击查看大图',
								},
							})]),
						h('Col', {
								style: {
									padding: '8px 5px 5px 5px',
									flex: '1 1 0%',
								}
							},
							[h('div', {
									style: {
										fontWeight: 'blod',
										overflow: 'hidden',
										display: '-webkit-box',
										'-webkit-line-clamp': 2,
										'-webkit-box-orient': 'vertical',
										wordBreak: 'break-all',
										'lineHeight': params.row.is_index == '1' ? 1.5 : 3,
									}
								}, (params.row.get_page_cat != null ? '[ ' + params.row.get_page_cat.name + ' ] ' : '') + params.row.name),
								h('div', {
									style: {
										width: '70px'
									}
								}, [
									h('Tag', {
										props: {
											color: 'blue',
										},
										style: {
											display: params.row.is_index == '1' ? 'block' : 'none',
										}
									}, '商城主页')
								]),

							]),
					]);
				};

				// 手动排序
				this.columns[(this.columns.length - 4)]['render'] = (h, params) => {
					if (params.row.handle.edit) {
						return h(pageListSort, {
							props: {
								sort: params.row.sort,
								itemId: params.row.id,
							},
							on: {
								'on-success': () => {
									// 触发重新加载列表
									this.init();
								},
							}
						});
					}
					else{
						return h('span', {}, params.row.sort);
					}
				};

				// 状态标识
				this.columns[(this.columns.length - 3)].render = (h, params) => {
					const row = params.row;
					
					if (row.handle.edit) {
						return h('i-switch', {
							props: {
								size: 'large',
								value: Number(row.is_enable),
								'true-value': 1,
								'false-value': 0,
								'before-change'() {
									return new Promise((resolve) => {
										_this.updateStatus(params.index, params.row);
									});
								},
							},
						}, [
							h('span', {
								slot: 'open'
							}, '上线'),
							h('span', {
								slot: 'close'
							}, '下线')
						]);
					}
					else{
						return h('tag',{
							props:{
								color: Number(row.is_enable) == 1 ? 'green' : 'red'
							}
						}, Number(row.is_enable) == 1 ? '上线' : '下线');
					}
				};

				// 操作按钮
				this.columns[(this.columns.length - 1)].render = (h, params) => {
					var buttons = [];

					// 暂时不开放预览
					if (params.row.handle.view && 1 > 2) {
						// 查看按钮
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
											this.viewPage(params.index, params.row);
										}
									}
								})]
							)
						);
					}

					if (params.row.handle.edit) {
						// 编辑按钮
						buttons.push(
							h('span', {
									attrs: {
										title: '编辑'
									}
								},
								[h('a', {
									on: {
										click: () => {
											this.editPage(params.row);
										}
									}
								}, '编辑')]
							)
						);
						buttons.push(
							h('Divider', {
								style: {
									display: 'inline-block'
								},
								props: {
									type: "vertical"
								}
							})
						);

						// 主页按钮
						if (params.row.is_index == '0') {
							buttons.push(
								h('span', {
										attrs: {
											title: '设为主页'
										}
									},
									[h('a', {
										on: {
											click: () => {
												this.setHomePage(params.row);
											}
										}
									}, '设为主页')]
								)
							);
							buttons.push(
								h('Divider', {
									style: {
										display: 'inline-block'
									},
									props: {
										type: "vertical"
									}
								})
							);
						}
						
					}

					if (params.row.handle.remove) {
						// 删除
						buttons.push(
							h('span', {
									attrs: {
										title: '删除'
									}
								},
								[h('a', {
									on: {
										click: () => {
											this.removePage(params.index, params.row)
										}
									}
								}, '删除')]
							)
						);
					}
					return h('div', buttons);
				}
			},
			// 切换分页
			changePage(page) {
				this.tableLoading = true;
				// ajax 请求获取数据，然后动态更新下面数据源
				this.$ajax.post(this.$api.goodsPageList, {
						page: page,
						searchq: this.formSearch.searchq,
						searchqType: this.formSearch.searchqType,
						status: this.formSearch.status,
						catId: this.formSearch.catId,
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
			// 搜索
			searchPage() {
				this.tableLoading = true;
				// ajax 请求获取数据
				this.$ajax.post(this.$api.goodsPageList, {
						searchq: this.formSearch.searchq,
						searchqType: this.formSearch.searchqType,
						status: this.formSearch.status,
						catId: this.formSearch.catId,
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
			// 创建页面，弹出页面选择模板
			createPage() {
				this.$refs['page-template'].openModal();
			},
			// 创建成功的回调
			createPageCallback(item) {
				this.init();

				this.editPage(item);
			},
			// 预览页面
			viewPage(index, row) {
				window.open('/goods/pages/' + row.page_id);
			},
			// 设为主页
			setHomePage(row){
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定设置为商城的主页吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						// ajax 提交
						this.$ajax.post(this.$api.goodsPageSetHomePage, {
							id: row.id
						})
						.then((response) => {
							var res = response.data;
					
							if (res.code) {
								// 保存成功
								this.$Message.success(res.message);
								
								this.init();
							}
						});
					}
				});
			},
			// 编辑页面
			editPage(row) {
				this.showList = false;
				this.$nextTick(() => {
					this.$refs['page-editor'].initData(0, row.page_id);
				});
			},
			// 删除微页面
			removePage(index, row) {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定删除微页面吗？',
					okText: '确定删除',
					cancelText: '取消',
					onOk: () => {
						// ajax 提交删除页面
						this.$ajax.post(this.$api.goodsPageRemove, {
								id: row.id
							})
							.then((response) => {
								var res = response.data;

								if (res.code) {
									// 保存成功
									this.$Message.success(res.message);

									// 删除绑定的数据
									this.$delete(this.data, index);
								}
							});
					}
				});
			},

			// 直接在列表更新状态
			updateStatus(index, row) {

				var status = (row.is_enable == 0 ? 1 : 0);

				if (status == 0) {
					this.$Modal.confirm({
						title: '操作提示',
						content: '确定下线页面吗？',
						okText: '确定',
						cancelText: '取消',
						onOk: () => {
							this.updateStatusAction(index, row, status);
						},
					});
				} else {
					this.updateStatusAction(index, row, status);
				}
			},
			updateStatusAction(index, row, status) {
				this.tableLoading = true;
				// ajax 保存数据
				this.$ajax.post(this.$api.goodsPageStatus, {
						page_id: row.page_id,
						status: status,
					})
					.then((response) => {
						this.tableLoading = false;
						var res = response.data;

						if (res.code) {
							// 保存成功
							this.$Message.success(res.message);

							// 更新列表的值
							this.$set(this.data[index], 'is_enable', status);
						}
					});
			},
			onBack() {
				this.showList = true;
				this.init();
			}
		},
		mounted() {
			this.init();
		}
	}
</script>
