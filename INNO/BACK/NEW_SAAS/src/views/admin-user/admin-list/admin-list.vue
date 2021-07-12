<style lang="less">
.admin-list{
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
	<div class="admin-list">
		<Card v-show="showList">
			<!--列表搜索框-->
			<div class="table-topbar">
				<Row type="flex">
					<Col style="flex:1 1 0%;">
					<Form ref="formSearch" :model="formSearch" inline>
						<FormItem>
							<Select v-model="formSearch.status" placeholder="用户状态" style="width:110px" clearable>
								<Option value="-1">全部状态</Option>
								<Option v-for="(item, key) in statusList" :value="key" :key="key">{{item}}</Option>
							</Select>
						</FormItem>
						<FormItem>
							<Input v-model="formSearch.searchq" style="width:320px;" placeholder="" clearable search enter-button @on-search="searchPage"
							 @on-clear="searchPage" @keydown.native.enter.prevent="searchPage">
							<Select v-model="formSearch.searchqType" slot="prepend" style="width:100px">
								<Option value="userName">用户名</Option>
								<Option value="nickName">昵称</Option>
								<Option value="mobile">手机号</Option>
								<Option value="email">Email</Option>
							</Select>
							</Input>
						</FormItem>
					</Form>
					</Col>
					<Col style="width:200px;text-align: right;">
					<Button v-if="canCreate" type="info" icon="md-add" @click="openModal({},true)">添加管理员</Button>
					<Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
					</Col>
				</Row>
			</div>

			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
			<div v-show="pageTotal>0" style="margin:10px;overflow: hidden">
				<div style="float: right;">
					<Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
				</div>
			</div>
		</Card>
		
		<!--管理员编辑表单-->
		<adminForm ref="admin-form" @on-success="formSuccess" @on-close="formClose"></adminForm>

		<!--重置密码组件-->
		<resetPassword ref="reset-password"></resetPassword>

		<!--重置手机号组件-->
		<resetMobile ref="reset-mobile" @on-success="setMobileSuccess"></resetMobile>

	</div>
</template>

<script>
import util from '@/libs/util.js';
import resetPassword from './reset-password';
import resetMobile from './reset-mobile';
import adminForm from './admin-form';

export default {
	components: {
		resetPassword,
		resetMobile,
		adminForm
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
			showList: true,
			
			// 搜索表单
			formSearch: {
				searchq: '',
				searchqType: 'userName'
			},

			modalEditIndex: '',

			// 角色列表
			roleList: [],

			// 用户状态列
			statusList: [],

			// 组织列
			organizeList: [],

			brandEnName: '',
		};
	},
	methods: {
		init(){
			this.initData();
		},
		// 初始化方法
		initData() {
			// 动态计算表高度
			this.tableHeight = document.body.clientHeight - 210;

			this.tableLoading = true;
			// ajax 请求获取初始化数据
			util.ajax.post(util.apiUrl.adminUserList, {
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

						// 初始化角色列表
						this.roleList = res.data.roleList;
						this.organizeList = res.data.organizeList;
						this.statusList = res.data.statusList;
						this.brandEnName = res.data.brandEnName;

					}
				});
		},
		// 初始化表
		initTable(res) {
			this.columns = res.data.columns;
			const _this = this;
			
			// 头像
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
						[h('Avatar', {
							props: {
								src: params.row.wx_avatar,
								icon: 'md-person',
								size: 'large',
							},
							style: {
								marginTop: '10px',
								marginBottom: '10px'
							}
						})
						]),
					h('Col', {
							style: {
								padding: '10px 0 10px 4px',
								flex: '1 1 0%',
							}
						},
						[
							h('div', {
								style: {
									lineHeight:1.5
								}
							}, params.row.user_name ),
							
							h('div', {
								style: {
									lineHeight:1.5
								}
							}, params.row.wx_nick_name ),
						]),
				]);
			};

			// 角色名
			this.columns[1].render = (h, params) => {
				var tag = [];
				for (var i in params.row.role_names) {
					tag.push(
						h('Tag', {
							props: {
								color: (params.row.user_type == 2 ? "primary" : "default")
							}
						}, params.row.role_names[i])
					);
				}
				return h('div', {
					style:{
						padding:'5px 0',
					},
				}, tag);
			};

			// 状态标识
			this.columns[(this.columns.length - 3)].render = (h, params) => {
				const row = params.row;
				
				return h('i-switch',{
					props: {
						size: 'large',
						value: row.status,
						'true-value': 1,
						'false-value': 2,
						'before-change'() {
							return new Promise((resolve) => {
								if( row.handle.edit ){
									
									if( row.status == 1 ){
										this.$Modal.confirm({
											title: '操作提示',
											content: '确定设为离职状态吗？设置后，员工会被锁定无法登录后台。',
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
					}, '正常'),
					h('span', {
						slot: 'close'
					}, '离职')
				]);
			};

			// 操作按钮
			this.columns[(this.columns.length - 1)].render = (h, params) => {
				var buttons = [];

				if (params.row.handle.edit) {
					// 编辑按钮
					buttons.push(
						h('span', [
							h('a', {
								on: {
									click: () => {
										this.editAdminUser(params.index, params.row, true);
									}
								}
							}, '编辑'),
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
				if (params.row.handle.setmobile) {
					// 编辑手机按钮
					buttons.push(
						h('span', [
							h('a', {
								on: {
									click: () => {
										this.editMobile(params.index, params.row);
									}
								}
							}, '修改手机号'),
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

				if (params.row.handle.reset) {
					// 重设密码
					buttons.push(
						h('span', [
							h('a', {
								on: {
									click: () => {
										this.resetAdminUser(params.row.id);
									}
								}
							}, '重设密码'),
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

				if (params.row.handle.remove) {
					// 删除
					buttons.push(
						h('a', {
							style: {
								display: 'inline-block'
							},
							on: {
								click: () => {
									this.removeAdminUser(params.index, params.row);
								}
							}
						}, '删除')
					);
				}
				
				if( params.row.user_type == 2 ){
					// 超管提示
					buttons.push(
						h('span', {
							style: {
								display: 'inline-block',
								color: '#dddddd',
							},
						}, '不能编辑超管账号')
					);
				}
				return h('div', buttons);
			}
		},
		// 切换分页
		changePage(page) {
			this.tableLoading = true;
			// ajax 请求获取数据，然后动态更新下面数据源
			util.ajax.post(util.apiUrl.adminUserList, {
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
		// 搜索
		searchPage() {
			this.tableLoading = true;
			// ajax 请求获取数据，然后动态更新下面数据源
			util.ajax.post(util.apiUrl.adminUserList, {
					searchq: this.formSearch.searchq,
					searchqType: this.formSearch.searchqType,
					status: this.formSearch.status
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
		// 删除管理员
		removeAdminUser(index, row) {
			this.$Modal.confirm({
				title: '删除管理员',
				content: '确定删除管理员吗？删除后不能恢复！确定吗？',
				okText: '确定删除',
				cancelText: '取消',
				onOk: () => {
					this.tableLoading = true;
					// ajax 请求获取数据，然后动态更新下面数据源
					util.ajax.post(util.apiUrl.adminUserRemove, {
							adminId: row.id
						})
						.then((response) => {
							var res = response.data;
							if (res.code) {
								// 修改表数据
								this.pageTotal--;
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
		// 编辑按钮
		editAdminUser(index, row, showFooter) {
			this.modalEditIndex = index;
			// 打开编辑模态框
			this.openModal(row, showFooter);
		},
		// 查看按钮处理
		viewAdminUser(index, row) {
			this.editAdminUser(index, row, false);
		},
		// 打开模态框
		openModal(row, showFooter) {
			this.showList = false;
			this.$refs['admin-form'].openModal(row, showFooter, this.roleList, this.organizeList, this.brandEnName);
		},
		// 表单关闭回调函数
		formClose(){
			this.showList = true;
		},
		// 表单保存后的 回调函数
		formSuccess(res) {
			this.showList = true;
			this.initData();
		},
		// 打开重设密码
		resetAdminUser(adminId) {
			this.$refs['reset-password'].openModal(adminId);
		},
		// 打开重置手机号
		editMobile(index, row) {
			this.$refs['reset-mobile'].openModal(index, row);
		},
		// 设置手机号的组件回调函数
		setMobileSuccess(obj) {
			this.$set(this.data[obj.index], 'mobile', obj.mobile);
		},
		// 直接在列表更新状态
		updateStatus(index, row){
			this.tableLoading = true;
			var status = (row.status === 2 ? 1 : 2);
			
			// ajax 保存数据
			this.$ajax.post( this.$api.adminUserStatus , {
				id : row.id,
				status: status,
			})
			.then( (response) => {
				this.tableLoading = false;
				var res = response.data;
				
				if( res.code ){
					// 保存成功
		            this.$Message.success( res.message );
		            
		            this.initData();
		        }
			});
		},
	},
	mounted() {
		this.init();
	}
}
</script>
