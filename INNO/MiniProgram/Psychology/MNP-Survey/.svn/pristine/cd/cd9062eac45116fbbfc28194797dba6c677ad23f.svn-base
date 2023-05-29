<template>
	<view class="container">
		<global-com></global-com>
		
		<view class="content">
			<scroll-view class="msg-list" scroll-y="true" 
			upper-threshold="50"
			:scroll-with-animation="scrollAnimation" 
			:scroll-top="scrollTop" 
			:scroll-into-view="scrollToView">
				
				<view class="row" v-for="(row,index) in msgList" :key="index" :id="'msg'+row.id">
					
					<!-- 系统消息 -->
					<block v-if="row.type=='system'" >
						<view class="system">
							<!-- 文字消息 -->
							<view v-if="row.content_type == 'text'" class="text-box">
								{{row.content}}
							</view>
							
							<!--要求评价的消息-->
							<view v-else-if="row.content_type == 'rate' " class="rate-box">
								<view style="margin-bottom: 20rpx;">您对此次服务是否满意？</view>
								<u-rate :size="50"  
								active-color="warning" 
								v-model="row.rate" 
								:disabled="(row.rate>0?true:false)" 
								@change="commentRate">
								</u-rate>
								<view v-if="row.rate>0" style="margin-top: 10rpx;">感谢您的嘉奖(已评分)</view>
							</view>
						</view>
					</block>
					
					<block v-else>
						<!-- 自己发出的消息 -->
						<view class="my" v-if="row.get_user != null && row.get_user.isUserContent == 1">
							<!-- 左-消息 -->
							<view class="left">
		
								<!-- 文字消息 -->
								<view class="bubble">
									<span class="arrow-out"></span>
									<rich-text :nodes="row.content"></rich-text>
									
									<view style="display: flex;margin-top:6rpx;">
										<u-image 
										v-for="(src,index) in row.images" :key="index"
										style="margin:10rpx 10rpx 0 0;"
										:width="90" 
										:height="90" 
										:src="src" 
										:border-radius="10"
										@click="showPic(src, row.images)"/>
									</view>
								</view>
								
								<view class="time-box">
									<view class="time">{{row.created_at_format}}</view>
								</view>
							</view>
							<!-- 右-头像 -->
							<view class="right">
								<u-avatar :src="row.get_user.wx_avatar" mode="square"></u-avatar>
							</view>
						</view>
						
						<!-- 别人发出的消息 -->
						<view class="other" v-if="row.get_user == null || row.get_user.isUserContent == 0">
							<!-- 左-头像 -->
							<view class="left">
								<u-avatar mode="square"></u-avatar>
							</view>
							<!-- 右-用户名称-时间-消息 -->
							<view class="right">
								
								<!-- 文字消息 -->
								<view class="bubble">
									<text class="arrow-out"></text>
									<rich-text :nodes="row.content"></rich-text>
									<view style="display: flex;margin-top:6rpx;">
										<u-image 
										v-for="(src,index) in row.images" :key="index"
										style="margin:10rpx 10rpx 0 0;"
										:width="90" 
										:height="90" 
										:src="src" 
										:border-radius="10"
										@click="showPic(src, row.images)"/>
									</view>
								</view>

								<view class="username">
									<view class="name">{{row.get_user != null ? row.get_user.username : ''}}</view> 
									<view class="time">{{row.created_at_format}}</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		
		<!--底部工具条-->
		<view class="bottom-box">
			<u-button type="primary" style="width:100%;" @click="goReply">回复</u-button>
		</view>
		
		<!--回复表单-->
		<feedbackReplyForm ref="reply-form" @on-success="loadData(true)"></feedbackReplyForm>
	</view>	
</template>

<script>
import feedbackReplyForm from './feedback-reply-form';
	
export default {
	components: {
		feedbackReplyForm,
	},
	data() {
		return {
			info:{},
			feedbackId: 0,
			
			scrollAnimation:false,
			scrollTop:0,
			scrollToView:'',
			msgList:[],
		}
	},
	// 下拉刷新事件
	onPullDownRefresh(){
		this.loadData( true );
	},
	onLoad( options ) {
		this.feedbackId = options.id;
		this.init();
	},
	methods:{
		init(){
			this.loadData();
		},
		loadData( isRefresh = false ){
			// 加载数据
			this.$util.showLoading( this );
			this.$u.post( this.$api.feedBackReplyList, {
				feedback_id: this.feedbackId,
			})
			.then( (response) => {
				this.$util.hideLoading();
				var res = response.data;
				if( res.code ){
					if( isRefresh ){
						this.msgList = res.data.items;
						uni.stopPullDownRefresh();
						
						// 滚动到指定位置
						let lastId = this.msgList[ (this.msgList.length -1 ) ].id;
						this.$nextTick( () => {
							this.scrollToView = 'msg' + lastId;
							this.$nextTick( () => {
								this.scrollAnimation = true;//恢复滚动动画
							});
						});
					}
					else{
						// 追加到数组后面
						for(var i in res.data.items ){
							this.msgList.push( res.data.items[i] );
						}
						
						// 滚动到底部
						this.$nextTick( () => {
							//进入页面滚动到底部
							this.scrollTop = 99999;
							this.$nextTick( () => {
								this.scrollAnimation = true;
							});
						});
					}
				}
				else{
					this.$u.toast( res.message );
				}
			});
		},
		// 预览图片
		showPic(currImage, images ){
			uni.previewImage({
				indicator:"none",
				current: currImage.replace(/\_thumb\.jpg/, ''),
				urls: images
			});
		},
		// 打开回复表单
		goReply(){
			this.$refs['reply-form'].openPopup( this.feedbackId );
		},
		// 评价反馈
		commentRate( currRate ){
			this.$u.post( this.$api.feedBackRate, {
				id: this.feedbackId,
				rate: currRate,
			})
			.then( (response) => {
				var res = response.data;
				if( res.code ){

				}
				else{
					// 不响应
				}
			});
		}
	},
}
</script>

<style lang="scss">
page,.container{
	background: $page-color-base;
}

.content{
	width: 100%;
	
	.msg-list{
		width: 100%;
		position: absolute;
		top: 0;
		bottom: 100upx;

		.row{
			padding: 20upx;
			&:first-child{
				margin-top: 20upx;
			}
			
			.system{
				display: flex;
				justify-content: center;
				
				.text-box{
					padding: 0 30upx;
					height: 50upx;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #c9c9c9;
					color: #fff;
					font-size: 24upx;
					border-radius: 40upx;
				}
				.rate-box{
					background-color: #fff;
					padding:40rpx;
					border-radius: 10rpx;
				}
			}
			
			.my .left,.other .right{
				width: 100%;
				display: flex;

				.bubble{
					max-width: 70%;
					min-height: 50upx;
					border-radius: 10upx;
					padding: 12upx 20upx;
					align-items: center;
					font-size: 28upx;
					word-break: break-word;
				}
			}

			.my{
				width: 100%;
				display: flex;
				justify-content: flex-end;
				
				.left{
					min-height: 100upx;
					align-items: center;
					justify-content: flex-end;
					flex-wrap: wrap;
					
					.bubble{
						background-color:#9eea6a;
						position: relative;
						.arrow-out{
							width: 0;
							height: 0;
							border-width: 16rpx;
							border-style: solid;
							border-color: transparent transparent transparent #9eea6a;
							position: absolute;
							top: 18rpx;
							right: -28rpx;
						}
					}
					
					.time-box{
						width:100%;
						font-size: 12px;
						color: #999;
						text-align: right;
					}
				}
				.right{
					margin-left: 15upx;
				}
			}
			.other{
				width: 100%;
				display: flex;
				.left{
					margin-right: 15upx;
				}
				.right{
					flex-wrap: wrap;
					.username{
						width: 100%;
						height: 45upx;
						font-size: 24upx;
						color: #999;
						display: flex;
						.name{
							margin-right: 20upx;
						}
					}
					.bubble{
						background-color: #fff;
						color: #333;
						position: relative;
						.arrow-out{
							width: 0;
							height: 0;
							border-width: 16rpx;
							border-style: solid;
							border-color: transparent #fff transparent transparent;
							position: absolute;
							top: 20rpx;
							left: -28rpx;
						}
					}
				}
			}
		}
	}
}

.bottom-box{
	width: 100%;
	min-height: 100upx;
	padding: 0 1%;
	background-color: $page-color-base;
	display: flex;
	position: fixed;
	z-index: 20;
	bottom:0;
	transition: all .15s linear;
	
}	
</style>