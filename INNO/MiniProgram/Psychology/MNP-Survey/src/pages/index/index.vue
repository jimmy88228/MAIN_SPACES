<template>
	<view class="index-page">
		<view class="school-area" v-if="bsnUserInfo.schoolName">{{bsnUserInfo.schoolName}}</view>
		<custom-page :customType="customType" :nav-full="true" :scroll-height="scrollHeight" :navIsTransparent="true"
			ref="customPageRef"></custom-page>
		<share ref="shareModule"></share>
		<view class="message_tips">
			<image v-if="!noMessage" @click="jumpMessageBox" class="message_tips_icon" :src="requireStatic(messageTips)" />
			<view :class="['message_tips_info',newMessageCount > 0?'show_message_info':'']">你有 {{newMessageCount}} 条消息待处理
			</view>
		</view>
	</view>
</template>

<script>
	import StorageH from "@/common/helper/storage-handler.js"

	const app = getApp();
	const pageOption = Page.BasePage({
		data() {
			return {
				curBsnUserToken: '',
				userInfo: {},
				pageShare: {},
				scrollHeight: 0,
				messageTips: 'class-manage/message-tips.png',
				newMessageCount: 0,
				allMessageCount: 0,
				noMessage: true,
				oldRecordId: 0,
				bsnUserInfo: {}
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
		},
		methods: {
			init() {
				this._checkLogin().then(() => {
					this.reFreshInfo();
				})
				this.getPage();
				this.getBindMessage();
			},
			getBindMessage() {
				// 如果切换了用户 则初始化消息弹窗
				let oldRecordId = this.oldRecordId;
				let newRecordId = app.LM.recordId;
				if (newRecordId != oldRecordId) {
					this.oldMessageCount = 0;
					this.newMessageCount = 0;
					this.noMessage = true;
					this.oldRecordId = newRecordId;
				}

				return this.$Http(this.$Apis.getBindMessageList, {
					data: {
						pageIndex: 1,
						pageSize: 1000,
					}
				}).then(res => {
					if (res.code == 1) {
						let data = res.data;
						let unReadTotalCount = data.unReadTotalCount || 0;
						let baseListResp = data.baseListResp || {};
						let list = baseListResp.list || [];
						let allMessageCount = list.length || 0;
						this.noMessage = allMessageCount > 0 ? false : true
						
						// 检查是否有新的消息
						if (allMessageCount != this.allMessageCount) {
							this.allMessageCount = allMessageCount;
							if (unReadTotalCount && unReadTotalCount > 0) {
									this.newMessageCount = unReadTotalCount
							}
						}
						return data
					}
				})
			},
			jumpMessageBox() {
				// 清零新消息
				this.newMessageCount = 0
				this.jumpAction('/pages/message-box/message-box')
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
				this.bsnUserInfo = app.IM.bsnUserInfo || {};
			},
		},
	})
	export default pageOption;
</script>

<style lang="scss">
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

	.message_tips {
		position: fixed;
		bottom: 20rpx;
		right: 20rpx;

		.message_tips_icon {

			width: 120rpx;
			height: 90rpx;
		}

		.message_tips_info {
			position: absolute;
			top: -100%;
			right: 0;
			opacity: 0;
			transform: translateY(10rpx);
			border-radius: 30rpx;
			background: rgba($color: #222222, $alpha: 0.5);
			padding: 19rpx 26rpx;
			color: #FFFFFF;
			font-size: 26rpx;
			white-space: nowrap;
			word-break: break-all;
			transition: 0.5s all;
		}

		.show_message_info {
			opacity: 1;
			transform: translateY(0rpx);
		}

		.message_tips_info::after {
			content: "";
			position: absolute;
			bottom: -18rpx;
			right: 55rpx;
			border-top: 70rpx solid transparent;
			border-left: 10rpx solid transparent;
			border-right: 30rpx solid transparent;
			border-bottom: 20rpx solid rgba($color: #222222, $alpha: 0.5);
			transform: rotate(-33.5deg);
			width: 0px;
			height: 0px;
		}
	}
</style>