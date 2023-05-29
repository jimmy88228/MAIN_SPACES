<template>
	<view class="user-header header flex-s-c relative">
		<auth-button class="avatar-wrapper shrink0" :open-type="'chooseAvatar'"
			@authed="onChooseAvatar">
			<!-- <image v-if="authUserInfo.profilePicture || imgUser" class="avatar" :src="authUserInfo.profilePicture || imgUser">
			</image> -->
			<oriImage v-if="authUserInfo.profilePicture || imgUser" class="avatar" :src="authUserInfo.profilePicture || imgUser" />
			<view v-else class="avatar-txt"> 点击授权头像 </view>
		</auth-button>
		<view class="name">{{userInfo.loginName||""}}</view>
		<view class="switch-box flex-c-c absolute" v-if="userInfo.loginConfig != 'password' && authUserInfo.bindUsers > 1">

			<!-- <image class="icon-switch" :src="requireStatic('/user-switch.png')" mode="aspectFit" /> -->
			<oriImage customStyle="width: 22rpx;height: 22rpx;margin-right: 12rpx;" :src="requireStatic('/user-switch.png')" mode="aspectFit" />
			<view class="font-22 C_fff" @click="jumpAction" data-url="/pages/user-switch/user-switch?from=user">切换绑定
			</view>
		</view>
	</view>
</template>

<script>
  import oriImage from "@/components/ori-comps/image/ori-image"

	const app = getApp();
	const pageOption = Page.BasePage({
		name: "user-header",
		components:{
			oriImage
		},
		props: {
			userInfo: {
				type: Object,
				default: () => {}
			},
			authUserInfo: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				imgUser: "",
			}
		},
		mounted() {},
		methods: {
			onChooseAvatar(data) {
        uni.$emit("onChooseAvatar", data)
			}
		}
	})
	export default pageOption;
</script>

<style lang="scss" scoped>
	.user-header {
		padding: 64rpx;

		.avatar-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 120rpx;
			height: 120rpx;
			padding: 0px;
			border-radius: 50%;
			margin-right: 30rpx;
			background-color: #dfdfdf;
			overflow: hidden;

			.avatar {
				position: absolute;
				top: 0px;
				left: 0px;
				width: 100%;
				height: 100%;
				display: block;
			}

			.avatar-txt {
				color: #b2b2b2;
				font-size: 20rpx;
			}
		}

		.name {
			font-size: 38rpx;
			max-width: 370rpx;
			word-break: break-all;
		}

		.switch-box {
			padding: 12rpx 15rpx 12rpx 22rpx;
			background: #ED9712;
			border-radius: 25rpx 0 0 25rpx;
			right: 0;
			top: 50%;
			transform: translateY(-50%);

			.icon-switch {
				width: 22rpx;
				height: 22rpx;
				margin-right: 12rpx;
			}
		}
	}
</style>