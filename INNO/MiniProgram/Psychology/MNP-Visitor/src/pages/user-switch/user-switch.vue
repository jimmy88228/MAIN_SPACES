<template>
	<view class="information">
		<page-nav></page-nav>
		<view class="box">
			<view class="user_select">
				<view class="user_select_header">
					<view class="acMsg flex" ><view v-if="schoolInfo.schoolId">{{schoolInfo.schoolName}}</view><view v-if="actInfo.activityId">/{{actInfo.activityName}}</view></view>
					<view class="title">选择测评对象</view>
				</view>
				<view class="card-box">
					<view @click="userSelect(item)" v-for="item in userList" :key="item.recordId" class="card flex-b-c"
						:class="item.canSelect != 1 ? 'unselect' : ''">
						<view class="flex-s-c">
							<view>
								<view class="user-name f-shrink-0">{{item.name}}</view>
								<view v-if="curRecordId == item.recordId" class="bang-area">
									<image :src="staticAddress+'/bang.png'" class="bang-img" />
									绑定中
								</view>
							</view>
							<view class="line"></view>
							<view class="user-msg">
								<view class="school p-b-15 C_7f">
									<text class="p-r-10">{{item.schoolName}}</text><text>{{item.classFullName}}</text>
									</view>
								<view class="no"><text class="p-r-10">账号<!--学号--></text><text>{{item.studentNumber}}</text></view>
							</view>
						</view>
						<view v-if="curRecordId != item.recordId" class="change-area">
							<image :src="staticAddress+'/change.png'" class="change-img" />
							切换
						</view>
					</view>
				</view>
				<view class="btn C_7f fixed translateX-50 flex-c-c" @click="addUser">
					<text class="p-r-10">+</text>
					<view>新增信息</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import oriPicker from '@/components/ori-comps/picker/ori-picker.vue'
	import oriInput from '@/components/ori-comps/input/ori-input.vue'
	import scanCode from '@/common/helper/scan-code-handler.js';
	const app = getApp();
	const pageOption = Page.BasePage({
		components: {
			oriPicker,
			oriInput
		},
		data() {
			return {
				curRecordId: 0,
				userList: [],
				schoolInfo: {},
				classInfo: {},
				actInfo: {}
			}
		},
		onLoad(options) {
			this.options = options || {};
		},
		onShow() {
			this.init();
		},
		methods: {
			init() {
				if(this.options.type != 'user'){
					this.schoolInfo = scanCode.schoolInfo || {};
					this.classInfo = scanCode.classInfo || {};
					this.actInfo = scanCode.actBaseInfo || {};
				}
				this._checkLogin().then(() => {
					return this.loadStudentList();
				})
			},
			loadStudentList() {
				return this.$Http(this.$Apis.getRelateStudentList, {
					data: {
						schoolId: this.schoolInfo.schoolId || 0,
						classId: this.classInfo.classId || 0
					},
					other: {
						isShowLoad: true
					}
				}).then(res => {
					if (res.code == 1) {
						let data = res.data || {};
						let list = data.childList || [];
						this.userList = list;
						list.map((item)=>{
							if(item.recordId == app.LM.recordId){
								this.curRecordId = item.recordId;
							}
						})
						return res
					}
					return Promise.reject(res)
				})
			},
			userSelect(e) {
				if (e.canSelect != 1) {
					app.SMH.showToast({
						title: this.classInfo.classId ? "所在班级不在活动内" : "所在学校不在活动内"
					})
					return
				};
				this.curRecordId = e.recordId || 0;
				return this.bsnUserLogin().then(() => {
					app.LM.savePrivateInfo({recordId: e.recordId});
					this.backAction(this.options.fromRoute || '/pages/index/index');
				}).catch(e => {
					app.SMH.showToast({
						title: e.msg || "选择异常"
					})
				})
			},
			bsnUserLogin() {
				return app.LM.registerBsnAsync(true, this.curRecordId);
			},
			addUser() {
				app.Sysm.getSysConf('applet_login_type').finally(()=>{
					let isAccountLogin =  app.Sysm.sysConf['applet_login_type'] == 'password';
					let url = isAccountLogin ? '/pages/login/login' : '/pages/register/register'
					this.jumpAction(url)
				})
			},
			onInput(e, type) {
				let detail = e.detail || {};
				let value = detail.value;
				this.formData[type] = value;
			},
		},
	})
	export default pageOption
</script>

<style lang="scss" scpoed>
	.information {
		.box {
			.user_select {
				padding: 20rpx 64rpx;
				padding-bottom: 160rpx;
				position: relative;
				.user_select_header{
					position: sticky;
					top: 0px;
					left: 0px;
					padding: 10rpx;
					background-color:#fff;
				}
				.acMsg {
					font-size: 26rpx;
					color: #B2B2B2;
					padding-bottom: 20rpx;
				}

				.title {
					font-size: 46rpx;
					color: #222222;
				}

				.card-box {
					padding-top: 50rpx;
				}

				.card {
					width: 100%;
					height: 190rpx;
					border-radius: 20rpx;
					background: rgba($color: #FFFFFF, $alpha: 0.8);
					border: 1px solid rgba($color: #EFEFEF, $alpha: 0.8);
					box-shadow: 0 2rpx 17rpx 0 rgba(0, 0, 0, 0.09);
					margin-bottom: 40rpx;
					padding: 40rpx;
					box-sizing: border-box;
					transition: all 0.2s;

					&.unselect {
						opacity: 0.8;
						background: rgba($color: #FAFAFA, $alpha: 1.0);
						color: #B2B2B2;

						.school {
							color: #B2B2B2;
						}
					}

					&:last-child {
						margin-bottom: 0;
					}

					.user-name {
						font-size: 32rpx;
					}

					.line {
						width: 1px;
						height: 105rpx;
						margin: 0 40rpx;
						background-color: rgba($color: #979797, $alpha: 0.2);
					}
				}

				.btn {
					width: 660rpx;
					height: 88rpx;
					bottom: 50rpx;
					border-radius: 20rpx;
					background: rgba($color: #FAFAFA, $alpha: 0.8);
					border: 1px solid rgba($color: #EFEFEF, $alpha: 0.3);
					box-sizing: border-box;
				}
			}
		}
		.bang-area{
			background: #F4FDF3;
			border: 1px solid #C7E5C5;
			border-radius: 15rpx;
			margin-top: 10rpx;
			display: flex;
			width:100rpx;
			height:30rpx;
			align-items: center;
			justify-content: center;
			font-family: PingFangSC-Medium;
			font-size: 18rpx;
			color: #21B014;
			.bang-img{
				width:22rpx;
				height:22rpx;
				display: block;
				margin-right: 4rpx;
			}
		}
		.change-area{
			font-family: PingFangSC-Regular;
			font-size: 16rpx;
			color: #333333;
			.change-img{
				width:22rpx;
				height:22rpx;
				display: block;
				margin:0 auto;
				margin-bottom: 4rpx;
				
			}
		}
	}
</style>
