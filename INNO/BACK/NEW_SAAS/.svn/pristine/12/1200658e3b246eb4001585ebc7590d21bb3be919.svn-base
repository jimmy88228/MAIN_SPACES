<style lang="less">
	.own-space{

}
</style>

<template>
	<div class="own-space">
		<Card>
			<div slot="title">
				<Icon type="md-person"></Icon> 账号设置
			</div>

			<Tabs :animated="false" type="card">
				<TabPane label="基本信息">

					<Form ref="userForm" :model="userForm" :label-width="120" label-position="right" :rules="infoValidate">
						<FormItem label="微信头像：" prop="avatar">
							<span>
								<Avatar :src="userForm.avatar_format" size="large" icon="md-person" shape="square" />
							</span>
						</FormItem>

						<FormItem label="用户名：" prop="admin_name">
							<span>{{userForm.user_name}}</span>
						</FormItem>

						<FormItem label="性别：">
							<RadioGroup v-model="userForm.gender_format">
								<Radio label="男"></Radio>
								<Radio label="女"></Radio>
							</RadioGroup>
						</FormItem>
						<FormItem label="所在省市：">
							<al-selector v-model="userForm.arr_area" level="1" style="width:35%" />
						</FormItem>

						<FormItem label="最后登录时间：">
							<span>{{ userForm.least_time }}</span>
						</FormItem>
					</Form>

					<div class="form-footer-button-box">
						<Button type="primary" :loading="save_loading" @click="saveEdit">保存</Button>
					</div>
				</TabPane>

				<TabPane label="绑定微信">
					<Form :label-width="120" style="min-height:200px;">
						<FormItem v-if="userForm.wx_nick_name!='' && userForm.wx_nick_name!=null" label="微信昵称：" prop="nick_name">
							<span>{{userForm.wx_nick_name}}</span>
						</FormItem>
						<FormItem label="微信：" prop="mobile">

							<template v-if="userForm.wx_openid==''||userForm.wx_openid==null">
								<!--未绑定-->
								<Button size="small" @click="weixinBind" style="margin-left: 10px;">绑定微信</Button>
								<div>(绑定微信后，可以使用微信扫码登录后台)</div>
							</template>
							<template v-else>
								<!--已绑定-->
								<Avatar v-if="(userForm.wx_avatar!='' && userForm.wx_avatar!=null)" :src="userForm.wx_avatar" size="large" icon="md-person"
								 shape="square" />
								<span v-if="userForm.wx_nick_name!=''">{{userForm.wx_nick_name}}</span>
							</template>

						</FormItem>
					</Form>
				</TabPane>

				<TabPane label="绑定手机">
					<Form :label-width="120" style="min-height:200px;">
						<FormItem label="用户手机：" prop="mobile">
							<span>{{userForm.mobile}}</span>
							<Button size="small" @click="editMobile">
								<span v-if="userForm.mobile!=''">修改手机</span>
								<span v-else>绑定手机</span>
							</Button>
						</FormItem>
					</Form>
				</TabPane>

				<TabPane label="绑定Email">
					<Form :label-width="120" style="min-height:200px;">
						<FormItem label="Email：" prop="mobile">
							<span>{{userForm.email}}</span>
							<Button size="small" @click="editEmail">
								<span v-if="userForm.email!=''">修改Email</span>
								<span v-else>绑定Email</span>
							</Button>
						</FormItem>
					</Form>
				</TabPane>

				<TabPane label="修改密码">
					<Form :label-width="120" style="min-height:200px;">
						<FormItem label="账号密码：">
							<Button size="small" @click="showEditPassword">修改密码</Button>
						</FormItem>
					</Form>
				</TabPane>
			</Tabs>

		</Card>

		<!--绑定微信组件-->
		<bindWeixin ref="bind-weixin" @on-success="bindWeixinSuccess"></bindWeixin>

		<!--重置手机号组件-->
		<resetMobile ref="reset-mobile" @on-success="setMobileSuccess"></resetMobile>

		<!--忘记密码组件-->
		<resetPwd ref="reset-pwd"></resetPwd>

		<!--绑定Email-->
		<bindEmail ref="bind-email"></bindEmail>

	</div>
</template>

<script>
	import util from '@/libs/util.js';
	import bindWeixin from './bind-weixin';
	import bindEmail from './bind-email';
	import resetMobile from '@/views/admin-user/admin-list/reset-mobile';
	import resetPwd from '@/views/login/reset-pwd';

	export default {
		name: 'ownspace',
		components: {
			bindWeixin,
			bindEmail,
			resetMobile,
			resetPwd
		},
		data() {
			return {
				userForm: {

				},

				save_loading: false,
				infoValidate: {

				}
			};
		},
		methods: {
			init() {
				// ajax 请求获取初始化数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.ownspace, {

					})
					.then((response) => {
						var res = response.data;

						if (res.code) {
							// 初始化表单数据
							this.userForm = res.data;
							this.userForm.arr_area = res.data.arr_area_format;
						}
					});
			},
			// 重设密码
			showEditPassword() {
				this.$refs['reset-pwd'].forgetPasswordModal(this.userForm.mobile, false);
			},
			// 保存
			saveEdit() {
				this.$refs.userForm.validate((valid) => {
					if (valid) {
						this.save_loading = true;

						// ajax 请求获取初始化数据，然后动态更新下面数据源
						util.ajax.post(util.apiUrl.ownspaceSave, {
								arr_area: this.userForm.arr_area,
								gender_format: this.userForm.gender_format
							})
							.then((response) => {
								var res = response.data;

								if (res.code) {
									setTimeout(() => {
										this.$Message.success(res.message);
										this.save_loading = false;
									}, 50);
								} else {
									this.$Message.error(res.data.message);
								}
							});
					}
				});
			},

			// 绑定微信
			weixinBind() {
				this.$refs['bind-weixin'].openModal();
			},
			// 绑定微信成功的回调
			bindWeixinSuccess() {
				this.init();
			},
			// 打开重置手机号
			editMobile() {
				this.$refs['reset-mobile'].openModal(0, this.userForm);
			},
			// 验证email
			editEmail() {
				this.$refs['bind-email'].openModal();
			},
			// 设置手机号的组件回调函数
			setMobileSuccess(obj) {
				this.$set(this.userForm, 'mobile', obj.mobile);
			}
		},
		mounted() {
			this.init();
		}
	};
</script>
