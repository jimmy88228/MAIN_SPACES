<style lang="less">
.admin-form{
	.default-input{
		width:300px;
	}
	.image-box{
		width:80px;
		height:80px;
		line-height:90px;
		border: 1px solid #eee;
	    border-radius: 5px;
	    text-align: center;
	    float:left;
	    cursor: pointer;
	    background: center center no-repeat;
	    background-size: 100% auto;
	}
}
</style>

<template>
	<div class="admin-form">
		<Card v-show="modalShow">
			<div slot="title" class="icard-header">
				<Tooltip content="返回" placement="bottom-start">
					<Icon type="ios-arrow-dropleft" @click="goBack" class="card-back" />
					<span style="margin:0 0 0 10px;">{{modalTitle}}</span>
				</Tooltip>
			</div>
			<div slot="extra">
				<Button type="primary" @click="modalOk">保存</Button>
			</div>

			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">

				<FormItem label="用户名" prop="user_name">
					<Input v-model="formItem.user_name" class="default-input" placeholder="请输入管理员用户名" :disabled="adminNameDisabled">
					<span v-if="formItem.adminId == 0" slot="prepend">{{brandEnName}}</span>
					</Input>
					<div>账号初始密码为888888，创建后或登录后请及时修改密码</div>
				</FormItem>
				<FormItem label="微信" v-if="formItem.adminId!=0">
					<div v-if="formItem.wx_nick_name">
						<Avatar :src="formItem.wx_avatar" size="large" icon="md-person" shape="square" />
						<span>{{formItem.wx_nick_name}}</span>
					</div>
					<div v-else>
						未绑定微信
					</div>
				</FormItem>
				<FormItem label="昵称" prop="nickName">
					<Input v-model="formItem.wx_nick_name" class="default-input" placeholder="请输入管理员昵称"></Input>
				</FormItem>
				<FormItem label="Email" prop="email">
					<Input v-model="formItem.email" class="default-input" placeholder="请输入管理员Email"></Input>
				</FormItem>
				<FormItem label="授权角色" prop="roleIds">
					<Select v-model="formItem.roleIds" class="default-input" multiple>
						<Option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.role_name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="绑定店铺">
					<template v-for="(store,index) in formItem.stores">
						<Tag v-if="typeof(store.name) != 'undefined' && store.name!='' " closable 
						@on-close="storeClose(index)">{{store.name}} {{store.code}}</Tag>
					</template>	
					<Button @click="onSelectStore" size="small" type="info">选择店铺...</Button>
					<div>未绑定指店铺的管理员，默认可访问全部店铺</div>
				</FormItem>	
				<FormItem label="所属组织" prop="organizeIds">
					<Cascader :data="organizeList" class="default-input" v-model="formItem.organizeIds"></Cascader>
				</FormItem>

			</Form>

			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>

			<div class="form-footer-button-box">
				<Button @click="goBack">取消</Button>
				<Button type="primary" @click="modalOk">保存</Button>
			</div>
		</Card>
		
		<!--店铺选择器-->
		<storeSelect ref="store-select" @on-ok="onStoreOk"></storeSelect>
	</div>
</template>

<script>
import util from '@/libs/util.js';
import storeSelect from '@/views/my-components/store-select/store-select';

export default {
	name: 'adminForm',
	components: {
		storeSelect,
	},
	data() {
		const checkAdminName = (rule, val, callback) => {
			if (/^[a-zA-Z0-9_]{4,19}$/.test(val)) {
				callback();
			} else {
				callback(new Error('用户名只能用字母、数字和"_"组成'));
			}
		};

		return {
			// 管理员 表单内容
			formItem: {
				adminId: 0,
				user_name: '',
				nickName: '',
				email: '',
				status: true,
				stores:[],
				roleIds: [],
				organizeIds: []
			},
			// 表单数据规则
			ruleValidate: {
				user_name: [{
						required: true,
						message: '管理员名称不能为空',
						trigger: 'blur'
					},
					{
						type: 'string',
						min: 4,
						message: '用户名不能小于4个字符！',
						trigger: 'blur'
					}
				]
			},
			// 模态框
			modalShow: false,
			modalTitle: '',
			modalLoading: true,
			modalEditIndex: '',
			modalClass: '',
			modalFooterHide: false,

			adminNameDisabled: false,
			brandEnName: '',
			
			spinShow: false,
			
			// 角色列表
			roleList: [],

			// 组织列表
			organizeList: []
		}
	},
	methods: {
		// 打开模态框
		openModal(row, showFooter, roleList, organizeList, brandEnName) {
			if (showFooter == true) {
				this.modalFooterHide = false;
				this.modalTitle = '修改管理员';
			} else {
				// 屏蔽 确定按钮
				this.modalFooterHide = true;
				this.modalTitle = '查看管理员';
			}

			this.modalShow = true;

			// 初始化角色列表
			this.roleList = roleList;

			// 初始化组织列表
			this.organizeList = organizeList;

			this.brandEnName = brandEnName;

			// 重置表单
			this.$refs.formValidate.resetFields();

			// 初始化表单数据
			// 如果是新增 roleId = 0;否则就是大于0
			this.formItem.adminId = typeof(row.user_id) !== 'undefined' ? Number(row.user_id) : 0;
			if (this.formItem.adminId == 0) {
				this.modalTitle = '添加管理员';
				this.modalClass = '';
				this.adminNameDisabled = false;

				// 新建时候的初始化数据
				this.formItem.user_name = '';
				this.formItem.nickName = '';
				this.formItem.wx_nick_name = '';
				this.formItem.status = true;
				this.formItem.email = '';
				this.formItem.stores = [];
				this.formItem.roleIds = [];
				this.formItem.organizeIds = [];
			} else {
				this.modalTitle = '修改管理员信息';
				this.adminNameDisabled = true;
				
				var stores = [];
				for( var i in row.get_admin_store ){
					stores[i] = {
						id: row.get_admin_store[i].get_store_info.id,
						name: row.get_admin_store[i].get_store_info.name,
						code: row.get_admin_store[i].get_store_info.code,
					};
				}
				
				// 编辑时候的初始化数据
				this.formItem.user_name = row.user_name;
				this.formItem.nickName = row.wx_nick_name;
				this.formItem.status = row.status == 1;
				this.formItem.email = row.email;
				this.formItem.stores = stores;
				this.formItem.roleIds = row.role_ids;
				this.formItem.wx_avatar = row.wx_avatar;
				this.formItem.wx_nick_name = row.wx_nick_name;
				this.formItem.organizeIds = (row.organize_ids == '' ? [] : row.organize_ids);
			}
		},
		// 模态框确认事件
		modalOk() {
			this.$refs.formValidate.validate((valid) => {
				if (valid) {
					this.spinShow = true;
					// ajax 保存数据
					util.ajax.post((this.formItem.adminId == 0 ? util.apiUrl.adminUserAdd : util.apiUrl.adminUserEdit), {
							adminId: this.formItem.adminId,
							adminName: this.formItem.user_name,
							nickName: this.formItem.wx_nick_name,
							email: this.formItem.email,
							status: this.formItem.status,
							roleIds: this.formItem.roleIds,
							stores: this.formItem.stores,
							organizeIds: this.formItem.organizeIds
						})
						.then((response) => {
							var res = response.data;
							this.spinShow = false;
							
							if (res.code) {
								// 保存成功
								this.$Message.success(res.message);
								this.modalShow = false;

								// 把数据返回给父级
								this.$emit('on-success', {
									data: res.data,
									type: (this.formItem.adminId == 0 ? 'add' : 'edit')
								});
							} else {
								this.modalShow = true;
								this.$Message.error(res.message);
								this.modalLoading = false;

								setTimeout(() => {
									this.modalLoading = true;
								}, 50);
							}
						});
				} else {
					// 验证失败，不关闭模态框
					this.modalShow = true;
					this.$Message.error('必填项不能为空！');
					this.modalLoading = false;

					setTimeout(() => {
						this.modalLoading = true;
					}, 50);
				}
			})
		},
		// 清除选中的门店
		storeClose( index ){
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定删除关联吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$delete( this.formItem.stores, index );
				},
			});
		},
		// 打开门店选择
		onSelectStore(){
			this.$refs['store-select'].openModal( ( this.formItem.stores == null  ? [] : this.formItem.stores ), 'multi' );
		},
		// 选门店的组件的 回调
		onStoreOk( items ){
			if( items.length > 0 ){
				this.$set( this.formItem , 'stores', items );
			}
		},
		// 返回列表
		goBack(){
			this.modalShow = false;
			this.$emit('on-close', {});
		},
	}
}
</script>