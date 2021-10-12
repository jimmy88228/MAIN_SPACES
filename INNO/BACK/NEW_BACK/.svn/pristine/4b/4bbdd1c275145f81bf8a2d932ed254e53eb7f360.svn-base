<style lang="less">
.feedback-talk-box{
	.talk-area{
		height:100%;
		background-color: #f5f5f5;
	}
	
	.row{
		padding: 10px;
		&:first-child{
			margin-top: 10px;
		}
		
		.system{
			display: flex;
			justify-content: center;
			
			.text{
				padding: 0 15px;
				height: 25px;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #c9c9c9;
				color: #fff;
				font-size: 12px;
				border-radius: 20px;
			}
		}
		
		.my .left,.other .right{
			width: 100%;
			display: flex;
	
			.bubble{
				max-width: 90%;
				min-height: 25px;
				border-radius: 5px;
				padding: 8px 10px;
				display: flex;
				align-items: center;
				font-size: 14px;
				word-break: break-word;
				
				.img-box{
					margin-top:5px;
					
					.img{
						background-color: transparent;
						padding:0;
						overflow: hidden;
						width: 50px;
						height:50px;
						margin:3px;
						cursor: pointer;
					}
				}
			}
		}
		.my .right,.other .left{
			flex-shrink: 0;
			width: 40px;
			height: 40px;
		}
		.my{
			width: 100%;
			display: flex;
			justify-content: flex-end;
			.left{
				min-height: 40px;
				align-items: center;
				justify-content: flex-end;
				flex-wrap: wrap;
				
				.bubble{
					background-color:#9eea6a;
					position: relative;
					
					.arrow-out{
						width: 0;
						height: 0;
						border-width: 8px;
						border-style: solid;
						border-color: transparent transparent transparent #9eea6a;
						position: absolute;
						top: 8px;
						right: -15px;
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
				margin-left: 14px;
			}
		}
		.other{
			width: 100%;
			display: flex;
			.left{
				margin-right: 7px;
			}
			.right{
				flex-wrap: wrap;
				.username{
					width: 100%;
					height: 22px;
					font-size: 12px;
					color: #999;
					display: flex;
					.name{
						margin-right: 25px;
					}
					.time{
						margin-top:4px;
					}
				}
				.bubble{
					background-color: #fff;
					color: #333;
					position: relative;
					.arrow-out{
						width: 0;
						height: 0;
						border-width: 8px;
						border-style: solid;
						border-color: transparent #fff transparent transparent;
						position: absolute;
						top: 8px;
						left: -15px;
					}
				}
			}
		}
	}	
}	
</style>
	
<template>
	<div class="feedback-talk-box">
		<div class="talk-area" :style="{height: (boxHeight-190)+'px'}">
			<vue-scroll ref="vue-scroll" :ops="scrollOptions" @handle-scroll="handleScroll">
				<div class="row" v-for="(row,index) in replyList" :key="index" :id="'msg'+row.id">
					
					<!--系统提示-->
					<div class="system" v-if=" typeof( row.isLast ) != 'undefined' ">
						<div class="text">
							没有更多内容了
						</div>
					</div>
					
					<!-- 自己发出的消息(回答方) -->
					<div class="my" v-if="row.type == 'reply' || row.type == 'reply_log'">
						<!-- 左-消息 -->
						<div class="left">
							
							<!-- 消息内容 -->
							<div class="bubble">
								<span class="arrow-out"></span>
								<div class="uflex" style="flex-direction: column">
									<span v-html="row.content"></span>
									<div class="img-box" v-if="row.images.length > 0">
										<img v-for="(img, ix) in row.images" :key="ix" :src="img" class="img" @click="showImage(img)" />
									</div>
								</div>
							</div>
							
							<div class="time-box">
								<span class="time">{{row.created_at_format}}</span>
								<span class="name">{{row.get_user.user_name}} {{row.get_user.wx_nick_name}}</span>
							</div>
						</div>
						<!-- 右-头像 -->
						<div class="right">
							<Avatar :src="row.get_user.wx_avatar" icon="ios-person" shape="square"></Avatar>
						</div>
					</div>
					
					<!-- 用户发出的消息（提问方） -->
					<div class="other" v-if="row.type == 'ask' || row.type == 'ask_log' ">
						<!-- 左-头像 -->
						<div class="left">
							<Avatar :src="row.get_user.wx_avatar" icon="ios-person" shape="square"></Avatar>
						</div>
						<!-- 右-用户名称-时间-消息 -->
						<div class="right">
							
							<!-- 文字消息 -->
							<div class="bubble">
								<span class="arrow-out"></span>
								
								<div class="uflex" style="flex-direction: column">
									<div v-html="row.content"></div>
									<div class="img-box" v-if="row.images.length > 0">
										<img v-for="(img, ix) in row.images" :key="ix" :src="img" class="img" @click="showImage(img)" />
									</div>
								</div>
								
							</div>
							<div class="username">
								<span class="time">{{row.created_at_format}}</span>
							</div>
						</div>
					</div>
				</div>
				
				<div id="talk-area-bottom"></div>
			</vue-scroll>
		</div>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>	
</template>	

<script>
import util from '@/libs/util.js';

export default {
	name: 'feedbackTalkList',
    components: {
	},
	props:{
		info:{
			type:Object,
			default:()=>{}
		},
	},
	data() {
		return{
			boxHeight: 500,
			spinShow: false,
			
			replyList: [],
			
			// 虚拟滚动条
			scrollOptions:{
				mode: 'native',
				bar:{
					keepShow: true,
					background: '#c8c8c8',
					size:'3px',
				},
				// 滚动轨道
				rail:{
					size:'3px',
				},
				scrollPanel:{
					scrollingX:false,
				}
			},
		}
	},
	methods: {
		// 初始化方法
		initData() {
			// 计算整体的高度
			this.boxHeight = document.body.clientHeight - 110;
			
			// 获取回复列表
			this.getReplyList( 0 );
		},
		// 获取反馈的回复列表
		getReplyList( last_id ){
			this.spinShow = true;
			// ajax 请求获取数据，
			util.ajax.post( util.apiUrl.userFeedbackReplyList, {
				last_id: last_id,
				feedback_id: this.info.id,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				if( res.code ){
					// 初始化表数据
					this.replyList = res.data.items;
					
					// 滚动到底部
					this.scrollToBottom();
				}
				else{
					this.$Message.error( res.message );
				}
			});
			
		},
		// 聊天框滚动到最底部
		scrollToBottom( sec = 500 ){
			this.$nextTick(()=>{
				this.$refs['vue-scroll'].scrollIntoView("#talk-area-bottom", sec );
			});
		},
		// 聊天框滚动触发的事件
		handleScroll( vertical, horizontal, nativeEvent ){
			
		},
		// 往聊天数组加入内容
		pushList( obj ){
			this.replyList.push( obj );
		},
		// 查看大图
		showImage( imgSrc ){
			util.viewImage( imgSrc, this );
		}
	},
	mounted () {
	    //this.init();
	},
}
</script>	