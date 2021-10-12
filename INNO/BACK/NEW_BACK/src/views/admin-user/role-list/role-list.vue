<style lang="less">
.role-list{
	.table-topbar{
		margin-bottom: 10px;
	}
}
</style>

<template>
	<div class="role-list">
		<Card v-show="showList">
			<div class="table-topbar">
				<Row type="flex">
					<Col style="flex:1 1 0%;">&nbsp;</Col>
					<Col style="width:160px;text-align: right;">
						<Button v-if="canCreate" type="info" icon="md-add" @click="openModal('', true, true)">添加角色</Button>
						<Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
					</Col>
				</Row>
			</div>

			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
			<div v-show="pageTotal>0" style="margin: 10px;overflow: hidden">
				<div style="float: right;">
					<Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
				</div>
			</div>
		</Card>
		
		<!--表单组件-->
		<roleForm ref="role-form" @on-add="formAdd" @on-update="formUpdate" @on-back="formBack"></roleForm>

	</div>
</template>

<script>
	import util from '@/libs/util.js';
	import roleForm from './role-form';

	export default {
		components: {
			roleForm
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

				modalEditIndex: '',
				showList: true,
			};
		},
		methods: {
			// 初始化方法
			init() {
				// 动态计算表高度
				this.tableHeight = document.body.clientHeight - 210;

				this.tableLoading = true;
				// ajax 请求获取初始化数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.adminRoleList, {
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
							this.$refs['role-form'].initData(res);
						}
					});
			},
			// 初始化表
			initTable(res) {
				// 初始化字段
				this.columns = res.data.columns;
				let _this = this;
				
				// 自定义的操作按钮
				this.columns[(this.columns.length - 2)].render = (h, params) => {
					const row = params.row;
					
					return h('i-switch',{
						props: {
							size: 'large',
							value: row.role_status,
							'true-value': 1,
							'false-value': 2,
							'before-change'() {
								return new Promise((resolve) => {
									if( row.handle.edit ){
										
										if( row.role_status == 1 ){
											this.$Modal.confirm({
												title: '操作提示',
												content: '确定设为关闭状态吗？设置后，角色会失效。',
												okText: '确定',
												cancelText: '取消',
												onOk: () => {
													_this.updateStatus(params.index, row);
												}
											});
										}
										else{
											_this.updateStatus(params.index, row);
										}
									}
									else{
										_this.$Message.error('权限不足');
									}
								});
							},
						},
					},[
						h('span', {
							slot: 'open'
						}, '启用'),
						h('span', {
							slot: 'close'
						}, '关闭')
					]);
				}

				this.columns[(this.columns.length - 1)].render = (h, params) => {
					var buttons = [];

					if (params.row.handle.view) {
						// 查看按钮
						buttons.push(
							h('span', [
								h('a', {
									on: {
										click: () => {
											this.viewRoles(params.index, params.row);
										}
									}
								}, '查看'),
								h('Divider', {
									style: {
										display: 'inline-block'
									},
									props: {
										type: "vertical"
									}
								})
							])
						);
					}

					if (params.row.handle.edit) {
						// 编辑按钮
						buttons.push(
							h('a', {
								style: {
									display: 'inline-block'
								},
								on: {
									click: () => {
										this.editRole(params.index, params.row);
									}
								}
							}, '编辑')
						);
					}

					return h('div', buttons);
				}
			},
			// 编辑角色
			editRole(index, row) {
				this.modalEditIndex = index;
				this.openModal(row, false, true);
				// this.$refs['role-form'].editRole( index,row,showFooter );
			},
			// 查看按钮处理
			viewRoles(index, row) {
				// this.$refs['role-form'].editRole( index,row, false );
				this.openModal(row, false, false);
			},
			openModal(row, isAdd, showFooter) {
				this.showList = false;
				this.$refs['role-form'].openModal(row, isAdd, showFooter);
			},
			// 切换分页
			changePage(page) {
				this.tableLoading = true;
				// ajax 请求获取数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.adminRoleList, {
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
				this.showList = true;
				
				this.init();
			},
			formUpdate(data) {
				this.showList = true;
				
				this.init();
			},
			// 直接在列表更新状态
			updateStatus(index, row){
				this.tableLoading = true;
				var status = (row.role_status === 2 ? 1 : 2);
				
				// ajax 保存数据
				this.$ajax.post( this.$api.adminRoleStatus , {
					id : row.id,
					status: status,
				})
				.then( (response) => {
					this.tableLoading = false;
					var res = response.data;
					
					if( res.code ){
						// 保存成功
			            this.$Message.success( res.message );
			            
			            this.init();
			        }
				});
			},
			formBack(){
				this.showList = true;
			}
		},
		mounted() {
			this.init();
		}
	}
</script>
