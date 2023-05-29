<template>
	<view class="index-page">
		<custom-page :customType="customType" :scroll-height="scrollHeight" :nav-full="true" :navIsTransparent="true" ref="customPageRef"></custom-page>
		<share ref="shareModule"></share>
	</view>
</template>

<script>
	const app = getApp();
	const pageOption = Page.BasePage({
		data() {
			return {
				curBsnUserToken: '',
				userInfo: {},
				pageShare: {},
				scrollHeight:0
			}
		},
		onLoad() {},
		onShow() {
			this.init();
		},
		// onShareAppMessage(e) {
		// 	return this.pageShare;
		// },
		onPageScroll(res) {
			this.scrollHeight = res.scrollTop;
			// uni.$emit('onPageScroll', res.scrollTop); //传递参数
		},
		methods: {
			init() {
				this._checkLogin().then(() => {
					this.reFreshInfo();
				})
				this.getPage();
			},
			getPage() {
				return this.$Http(this.$Apis.getPageDetail, {
					other: {
						isShowLoad: true
					}
				}).then(res => {
					if (res.code == 1) {
						let data = res.data || {};
						this.$refs["customPageRef"].initData(data);
						if (data.wx_share_title) this.pageShare.title = data.wx_share_title;
						if (data.wx_share_img) this.pageShare.imageUrl = data.wx_share_title;
					}
				})
			},
			reFreshInfo() {
				// this._getUserInfo().then(res=>{
				// 	this.authUserInfo = res;
				// })
				// this.authUserInfo = app.IM.authUserInfo || {};
				// if(this.curBsnUserToken != app.LM.bsnUserToken){
				// 	this._getUserInfo().then(res=>{
				// 		this.authUserInfo = res;
				// 	})
				// }
				this.authUserInfo = app.IM.authUserInfo || {};
			},
		},
	})
	export default pageOption;
</script>

<style lang="scss">
page { 
    font-family: KAITI;
}
	.index-page {
		.main-points {
			margin-top: 200rpx;
			padding: 0px 20rpx;

			.main-point {
				border-radius: 10rpx;
				box-shadow: 0px 0px 20rpx #D9FAF6;
				padding: 20rpx;

				.point-item {
					text-align: center;
					flex: 1;
					margin: 0px 10rpx;

					.item-img {
						width: 80rpx;
						height: 80rpx;
						display: block;
						margin: 0 auto;
						margin-bottom: 10rpx;
					}

					.item-name {}

					.item-tip {
						font-size: 20rpx;
						color: #b2b2b2;
					}
				}
			}
		}

		.school-area {
			position: absolute;
			top: 120rpx;
			left: 50rpx;
			background-color: rgba(0, 0, 0, 0.2);
			color: #fff;
			border-radius: 100rpx;
			padding: 10rpx 20rpx;
			line-height: 30rpx;
			display: flex;
			align-items: center;
			z-index: 10;
			max-width: 80%;
		}
	}
</style>