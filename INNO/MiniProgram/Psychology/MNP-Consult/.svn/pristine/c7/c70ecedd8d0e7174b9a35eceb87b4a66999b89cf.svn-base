<template>
	<view>
		<u-popup v-model="popupShow" :mode="mode">
				<view class="share-type">
					<view class="s-t-item">
						<button class="s-t-btn font-26" open-type="share">分享好友/群</button>
					</view>
					<view class="s-t-item">
						<auth-button customStyle="border:0 none;" open-type="getUserProfile" class="s-t-btn" @authed="showPost">生成海报分享</auth-button>
					</view>
				</view>
		</u-popup>
		<share-poster ref="sharePosterRef" id="sharePosterId"></share-poster>
	</view>
</template>
<script>
	import sharePoster from "./share-poster/share-poster.vue";
	// export default new Page.pageManage({
	// 			components: {
	// 				sharePoster
	// 			},
	// 			props: {
	// 				mode: {
	// 					type: String,
	// 					default: "bottom"
	// 				}
	// 			},
	// 			data(){
	// 				return {
	// 					popupShow: false,
	// 					shareDetail: {}
	// 				}
	// 			},
	// 			methods:{
	// 				showPopup(shareDetail = {}){
	// 					this.shareDetail = shareDetail || {};
	// 					this.popupShow = true;
	// 				},
	// 				showPost(detail){
	// 					if(detail.userToken){
	// 						this._getRefs("sharePosterRef").showView({
	// 						      info: {},
	// 						      view: [
	// 						        {
	// 						          type: "avatar",
	// 						          css: {
	// 						            width: 80,
	// 						            height: 80,
	// 						            top: 72,
	// 						            left: 30,
	// 						            borderRadius: "100%"
	// 						          }
	// 						        },
	// 						        {
	// 						          type: "avatarName",
	// 						          css: {
	// 						            fontSize: 24,
	// 						            fontStyle: "Microsoft YaHei,Arial,sans-serif",
	// 						            color: '#333',
	// 						            top: 88,
	// 						            left: 130
	// 						          }
	// 						        },
	// 						        {
	// 						          type: "text",
	// 						          text: "邀请你参与精彩活动",
	// 						          css: {
	// 						            fontSize: 24,
	// 						            fontStyle: "Microsoft YaHei,Arial,sans-serif",
	// 						            color: '#333',
	// 						            top: 126,
	// 						            left: 130
	// 						          }
	// 						        },
	// 						        {
	// 						          type: "code",
	// 						          css: {
	// 						            top: 22,
	// 						            left: 440,
	// 						            width: 115,
	// 						            height: 115
	// 						          },
	// 						          data: {
	// 						            params: {},
	// 						            targetPath: "pages/micro_mall/index/index"
	// 						          }
	// 						        },
	// 						        {
	// 						          type: "text",
	// 						          text: "识别二维码参与活动",
	// 						          css: {
	// 						            fontSize: 18,
	// 						            fontStyle: "Microsoft YaHei,Arial,sans-serif",
	// 						            color: '#b2b2b2',
	// 						            top: 154,
	// 						            left: 420
	// 						          }
	// 						        },
	// 						        {
	// 						          type: "image",
	// 						          url: "https://devimgtest.innourl.com/SAAS_IMAGE/images/INNO/applet_user_center/ads/20220218/20220218145024647_8474252.jpg",
	// 						          css: {
	// 						            width: 540,
	// 						            height: 267,
	// 						            top: 197,
	// 						            left: 30,
	// 						          }
	// 						        },
	// 						        {
	// 						          type: "text",
	// 						          text: "测试活动",
	// 						          css: {
	// 						            fontSize: 28,
	// 						            fontStyle: "Microsoft YaHei,Arial,sans-serif",
	// 						            color: '#333',
	// 						            top: 514,
	// 						            left: 30
	// 						          }
	// 						        },
	// 						        {
	// 						          type: "text",
	// 						          text: "报名截止时间：",
	// 						          css: {
	// 						            fontSize: 20,
	// 						            fontStyle: "Microsoft YaHei,Arial,sans-serif",
	// 						            color: '#333',
	// 						            textAlign: 'center',
	// 						            top: 575,
	// 						            left: 30
	// 						          }
	// 						        },
	// 						        {
	// 						          type: "text",
	// 						          text: "结束时间",
	// 						          css: {
	// 						            fontSize: 20,
	// 						            fontStyle: "Microsoft YaHei,Arial,sans-serif",
	// 						            color: '#787f91',
	// 						            textAlign: 'center',
	// 						            top: 575,
	// 						            left: 168
	// 						          }
	// 						        },
	// 						        {
	// 						          type: "text",
	// 						          text: "活动时间",
	// 						          css: {
	// 						            fontSize: 20,
	// 						            fontStyle: "Microsoft YaHei,Arial,sans-serif",
	// 						            color: '#333',
	// 						            textAlign: 'center',
	// 						            top: 619,
	// 						            left: 30
	// 						          }
	// 						        },
	// 						      ],
	// 						      path: "",
	// 						      scene: {}
	// 						    })
	// 					}
	// 				}
	// 			}
	// })
const pageOption =	 Page.BaseComp({
		components: {
			sharePoster
		},
		props: {
			mode: {
				type: String,
				default: "bottom"
			}
		},
		data(){
			return {
				popupShow: false,
				shareDetail: {}
			}
		},
		methods:{
			showPopup(shareDetail = {}){
				this.shareDetail = shareDetail || {};
				this.popupShow = true;
			},
			showPost(detail){
				if(detail.userToken){
					this._getRefs("sharePosterRef").showView({
					      info: {},
					      view: [
					        {
					          type: "avatar",
					          css: {
					            width: 80,
					            height: 80,
					            top: 72,
					            left: 30,
					            borderRadius: "100%"
					          }
					        },
					        {
					          type: "avatarName",
					          css: {
					            fontSize: 24,
					            fontStyle: "Microsoft YaHei,Arial,sans-serif",
					            color: '#333',
					            top: 88,
					            left: 130
					          }
					        },
					        {
					          type: "text",
					          text: "邀请你参与精彩活动",
					          css: {
					            fontSize: 24,
					            fontStyle: "Microsoft YaHei,Arial,sans-serif",
					            color: '#333',
					            top: 126,
					            left: 130
					          }
					        },
					        {
					          type: "code",
					          css: {
					            top: 22,
					            left: 440,
					            width: 115,
					            height: 115
					          },
					          data: {
					            params: {},
					            targetPath: "pages/micro_mall/index/index"
					          }
					        },
					        {
					          type: "text",
					          text: "识别二维码参与活动",
					          css: {
					            fontSize: 18,
					            fontStyle: "Microsoft YaHei,Arial,sans-serif",
					            color: '#b2b2b2',
					            top: 154,
					            left: 420
					          }
					        },
					        {
					          type: "image",
					          url: "https://devimgtest.innourl.com/SAAS_IMAGE/images/INNO/applet_user_center/ads/20220218/20220218145024647_8474252.jpg",
					          css: {
					            width: 540,
					            height: 267,
					            top: 197,
					            left: 30,
					          }
					        },
					        {
					          type: "text",
					          text: "测试活动",
					          css: {
					            fontSize: 28,
					            fontStyle: "Microsoft YaHei,Arial,sans-serif",
					            color: '#333',
					            top: 514,
					            left: 30
					          }
					        },
					        {
					          type: "text",
					          text: "报名截止时间：",
					          css: {
					            fontSize: 20,
					            fontStyle: "Microsoft YaHei,Arial,sans-serif",
					            color: '#333',
					            textAlign: 'center',
					            top: 575,
					            left: 30
					          }
					        },
					        {
					          type: "text",
					          text: "结束时间",
					          css: {
					            fontSize: 20,
					            fontStyle: "Microsoft YaHei,Arial,sans-serif",
					            color: '#787f91',
					            textAlign: 'center',
					            top: 575,
					            left: 168
					          }
					        },
					        {
					          type: "text",
					          text: "活动时间",
					          css: {
					            fontSize: 20,
					            fontStyle: "Microsoft YaHei,Arial,sans-serif",
					            color: '#333',
					            textAlign: 'center',
					            top: 619,
					            left: 30
					          }
					        },
					      ],
					      path: "",
					      scene: {}
					    })
				}
			}
		}
	})
	export default pageOption;
</script>
<style lang="less" scoped>
	.share-type{
	  width:100%;
	  background-color:#fff;
	}
	.s-t-item{
	  // border-bottom:1px solid #efefef;
	}
	.s-t-btn{
	  width:100%;
	  height:86rpx;
	  display:flex;
	  align-items: center;
	  justify-content: center;
	}
</style>