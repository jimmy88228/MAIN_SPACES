<style lang="less">

</style>

<template>
	<div>
		<Card v-show="modalShow">
			<div slot="title" class="icard-header">
				<Tooltip content="返回" placement="bottom-start">
					<Icon type="ios-arrow-dropleft" @click="goBack" class="card-back"/>
				</Tooltip>
				<span>角色和权限管理</span>
			</div>
			<div slot="extra">
				<Button type="primary" @click="modalOk">保存</Button>
			</div>
			
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
				<FormItem label="角色名称" prop="roleName">
					<Input v-model="formItem.roleName" placeholder="请输入角色名称"></Input>
				</FormItem>
				<FormItem label="备注说明" prop="roleRemark">
					<Input v-model="formItem.roleRemark" placeholder="备注说明信息"></Input>
				</FormItem>
				<FormItem label="角色权限">
					<Tree :data="menuTree" show-checkbox multiple></Tree>
				</FormItem>
			</Form>
			
			<div class="form-footer-button-box">
				<Button @click="goBack">取消</Button>
				<Button type="primary" @click="modalOk">保存</Button>
			</div>
			
			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>
		</Card>
	</div>
</template>

<script>
	import util from '@/libs/util.js';

	export default {
		name: 'roleForm',
		components: {

		},
		data() {
			return {
				// 表单内容
				formItem: {
					roleId: '',
					roleName: '',
					roleRemark: '',
				},
				// 表单数据规则
				ruleValidate: {
					roleName: [{
						required: true,
						message: '角色名称不能为空',
						trigger: 'blur'
					}]
				},
				// 模态框
				modalShow: false,
				modalTitle: '',
				spinShow: false,

				// 菜单树数据
				menuTree: [{
					title: '',
					expand: true,
					// 子数据
					children: []
				}]
			}
		},
		methods: {
			// 初始化方法
			init() {},
			// 父级传递初始化树
			initData(res) {
				// 初始化菜单树
				this.menuTree[0].title = res.data.roleTree.rootName;
				this.menuTree[0].children = res.data.roleTree.children;
			},
			// 打开模态框
			openModal(row, isAdd, showFooter) {
				this.modalShow = true;
				// 重置表单
				this.$refs.formValidate.resetFields();

				if (isAdd) {
					this.modalTitle = '添加角色';
				} else if (showFooter == true) {
					this.modalTitle = '修改角色';
					this.footerHide = false;
				} else {
					// 屏蔽 确定按钮
					this.modalTitle = '查看角色';
					this.footerHide = true;
				}

				// 初始化表单数据
				// 如果是新增 roleId = 0;否则就是大于0
				this.formItem.roleId = typeof(row.id) !== 'undefined' ? Number(row.id) : 0;
				if (this.formItem.roleId == 0) {
					// 新建时候的初始化数据
					this.formItem.roleName = '';
					this.formItem.roleRemark = '';
					this.formItem.actionList = [];

					this.setMenuTree(this.menuTree[0].children, true);
					this.menuTree[0].checked = false;
				} else {
					// 编辑时候的初始化数据
					this.formItem.roleName = row.role_name;
					this.formItem.roleRemark = row.role_remark;
					this.formItem.actionList = row.action_list;

					// 初始化编辑的权限树
					this.setMenuTree(this.menuTree[0].children, false);
					this.menuTree[0].checked = this.formItem.actionList[0] == 'all';
				}
			},
			// 递归设置 tree
			setMenuTree(arrTree, isAdd) {
				for (var i in arrTree) {
					if (typeof(arrTree[i].children) !== 'undefined') {
						// 递归设置
						this.setMenuTree(arrTree[i].children, isAdd);
					}

					if (this.formItem.actionList.indexOf(arrTree[i].actionCode) !== -1) {
						this.$set(arrTree[i], 'checked', true);
					} else if (isAdd && arrTree[i].actionCode == 'ownspace') {
						// 在新增的情况下，个人中心默认勾选
						this.$set(arrTree[i], 'checked', true);
					} else {
						this.$set(arrTree[i], 'checked', false);
					}
				}
				/*
				arrTree.map( (item, index) => {
					if( typeof(item.children) != 'undefined' ){
						this.setMenuTree( item.children, isAdd );
					}
					if( this.formItem.actionList.indexOf( item.actionCode ) !== -1 ){
						this.$set(item, 'checked', true);
					}
					else if(isAdd && item.actionCode == 'ownspace' ){
						// 在新增的情况下，个人中心默认勾选
						this.$set(item, 'checked', true);
					}
					else{
						this.$set(item, 'checked', false);
					}
				}); */
			},
			// 模态框确认事件
			modalOk() {
				this.$refs.formValidate.validate((valid) => {
					if (valid) {
						this.spinShow = true;
						
						// ajax 保存数据
						util.ajax.post((this.formItem.roleId == 0 ? util.apiUrl.adminRoleAdd : util.apiUrl.adminRoleEdit), {
								roleId: this.formItem.roleId,
								roleName: this.formItem.roleName,
								roleRemark: this.formItem.roleRemark,
								actionList: JSON.stringify( this.filterMenuTree(this.menuTree) )
							})
							.then((response) => {
								var res = response.data;
								this.spinShow = false;
								
								if (res.code) {
									// 保存成功
									this.$Message.success(res.message);
									this.modalShow = false;

									if (this.formItem.roleId == 0) {
										this.$emit('on-add', res.data);
									} else {
										this.$emit('on-update', res.data);
									}
								} else {
									this.modalShow = true;
									this.$Message.error(res.message);
								}
							});
					}
				})
			},
			// 递归过滤不用的信息
			filterMenuTree( tree ){
				tree.forEach( (item)=>{
					
					delete item.title;
					delete item.nodeKey;
					delete item.expand;
					delete item.indeterminate;
					
					if( item.checked == false ){
						delete item.actionCode;
						delete item.checked;
					}
					if( item.children != null && item.children.length > 0 ){
						item.children = this.filterMenuTree( item.children );
					}
				});
				
				return tree;
			},
			goBack(){
				this.modalShow = false;
				this.$emit('on-back');
			}
		},
		mounted() {
			this.init();
		}
	}
</script>
