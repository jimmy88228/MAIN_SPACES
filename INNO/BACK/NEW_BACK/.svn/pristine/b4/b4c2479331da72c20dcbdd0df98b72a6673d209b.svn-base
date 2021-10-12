<style lang="less">
	.cs-user-talk-box{
	border-top:1px solid #dedede;
	border-right:1px solid #dedede;

	.header-box{
		background: #f8f8f9;
		padding:8px 15px;
		line-height:2.2;
		min-height:46px;
		min-width:540px;
		border-bottom:1px solid #ddd;

		.right-box{
			cursor: pointer;
		}
	}
	.body-box{
		position: relative;

		.talk-area{
			height:100%;
			background-color: #f5f5f5;
		}
		.input-area{
			height:100%;
			z-index:9;
			margin-top:5px;

			.input-area-mask{
				z-index: 1010;
				position: absolute;
				top: 0;
				left: 0;
				width:100%;
				height: 100%;
				background-color: rgba(0,0,0,.25);
				text-align: center;
			}
			.send-btn{
				position: absolute;
				z-index:1000;
				right:40px;
				bottom: 10px;

        .tips{
        	font-size:13px;
        	color:#bbb;
        }
			}
		}
	}
  .quick-reply-tips{
  	position: absolute;
  }
	.quick-reply{
		position: absolute;
		top:10px;
		right:10px;
		z-index: 1000;
	}
	.cs-material-box{
		position: absolute;
		top:10px;
		right:90px;
		z-index: 1000;
	}
	.mini-card{
		position: absolute;
		top:10px;
		right:180px;
		z-index: 1000;
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
				/*max-width: 70%;*/
				min-height: 25px;
				border-radius: 5px;
				padding: 8px 10px;
				display: flex;
				align-items: center;
				font-size: 14px;
				word-break: break-word;

				&.img{
					background: center center no-repeat #fff;
					background-size: 100% auto;
					padding:0;
					overflow: hidden;
					cursor: pointer;
					width: 160px;
					height: 160px;
				}

				&.card{
					width:220px;
					display:block;
					cursor: pointer;

					&.currCard{
						background:red;
						color:#fff;
						.tips{
							color:#fff;
						}
						.arrow-out{
							border-color: transparent red transparent transparent;

							&.my{
								border-color: transparent transparent transparent red;
							}
						}
					}
					.title{
						font-size:14px;
					}
					.img{
						background: center center no-repeat #fff;
						background-size: 100% auto;
						width:100%;
						height:170px;
					}
					.tips{
						font-size:12px;
						text-align: center;
						margin-top:4px;
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
.cs-view-box{
	width:100%;
	height:550px;
	background:center center no-repeat;
	background-size:auto 100%;
}
.ueditor-box{
	textarea{
		display: none;
	}
	#ueditor{
		width:100% !important;
	}
}
</style>

<template>
	<div class="cs-user-talk-box" :style="{height: boxHeight+'px'}">

		<div class="header-box uflex" style="justify-content: space-between;">
			<div v-if="sessInfo.get_user_info != null ">
				<Avatar icon="ios-person" :src="sessInfo.get_user_info.wx_avatar"></Avatar>
				{{sessInfo.get_user_info.wx_nick_name}} {{sessInfo.session_from}}
			</div>
			<div v-else>
				<Avatar icon="ios-person"></Avatar>
			</div>
			<div class="right-box" v-if="sessInfo.id > 0">
				<Row type="flex" :gutter="24">
					<Col>
					<!--内容搜索组件-->
					<csSearchContent :sessInfo="sessInfo" :height="(boxHeight-inputBoxHeight-40)" @on-search="onSearchContent"></csSearchContent>
					</Col>
					<Col style="font-size: 13px;">
					<span v-show="sessInfo.in_history == false" style="margin-right:15px;" @click="transferSession">
						转接到
					</span>
					<span v-show="sessInfo.in_history == false" @click="closeSession">
						关闭会话
					</span>
					<span v-show="sessInfo.in_history == true" @click="closeHistoryBox">
						关闭历史窗口
					</span>
					</Col>
				</Row>
			</div>
		</div>

		<div class="body-box" :style="{height: (boxHeight-47)+'px'}">
			<Split v-model="split" mode="vertical" min="300px" @on-moving="onMoving">

				<div slot="top" class="talk-area">
					<vue-scroll ref="vue-scroll" :ops="scrollOptions" @handle-scroll="handleScroll">

						<div class="row" v-for="(row,index) in userHistoryList[ sessInfo.id ]" :key="index" :id="'msg'+row.id">

							<!--系统提示-->
							<div class="system" v-if=" typeof( row.isLast ) != 'undefined' ">
								<div class="text">
									没有更多内容了
								</div>
							</div>

							<template v-if=" row.content_type == 'system' ">
								<div class="system">
									<div class="text">
										{{row.content_search}}
									</div>
								</div>
							</template>
							<template v-else-if=" row.content_type == 'system-button' ">
								<div class="system">
									<div class="text">
										<!--固定的重新刷新当前会话列表的按钮-->
										<a @click="getUserContentList(sessInfo.user_id, 0)">{{row.content_search}}</a>
									</div>
								</div>
							</template>

							<template v-else>
								<!-- 自己发出的消息 -->
								<div class="my" v-if="row.originator_type == 'worker' ">
									<!-- 左-消息 -->
									<div class="left">
										<!-- 文字消息 -->
										<div v-if="row.content_type=='text'" class="bubble">
											<span class="arrow-out"></span>
											<span v-html="row.content.text.replace(/\n/g,'<br/>')"></span>
										</div>
										<!-- 图片消息 -->
										<div v-if="row.content_type=='image' && row.content != null " class="bubble img" 
										@click="showImage( row.content.url )" :style="{'background-image':'url('+row.content.url+')'}">
										</div>

										<!--小程序卡片-->
										<div v-if="row.content_type=='miniprogrampage' && typeof( row.content.miniprogrampage ) != 'undefined' "
										 class="bubble card" :class="index == cardIndex ? 'currCard': ''" @click="showCard( index, row.id, row.content.miniprogrampage )">
											<span class="arrow-out my"></span>
											<div class="title clamp">{{row.content.miniprogrampage.Title}}</div>
											<div class="img" :style="{'background-image':'url('+row.content.miniprogrampage.LocalUrl+')'}"></div>
											<div class="tips">小程序卡片</div>
										</div>

										<div class="time-box">
											<span class="time">{{row.created_at_format}}</span>
											<span class="name">{{row.get_worker_info !=null ? row.get_worker_info.nick_name + '('+ ( row.get_worker_info.get_admin_info != null ? row.get_worker_info.get_admin_info.user_name : '') + ')'  : '系统'}}
											</span>
										</div>
									</div>
									<!-- 右-头像 -->
									<div class="right">
										<Avatar :src="row.get_worker_info !=null ? row.get_worker_info.avatar_format : '' " icon="ios-person" shape="square"></Avatar>
									</div>
								</div>

								<!-- 用户发出的消息 -->
								<div class="other" v-if="row.originator_type == 'user' ">
									<!-- 左-头像 -->
									<div class="left">
										<Avatar :src="row.get_user_info != null ? row.get_user_info.wx_avatar : '' " icon="ios-person" shape="square"></Avatar>
									</div>
									<!-- 右-用户名称-时间-消息 -->
									<div class="right">

										<!-- 文字消息 -->
										<div v-if="row.content_type =='text'" class="bubble">
											<span class="arrow-out"></span>
											<span v-html="row.content.text.replace(/\n/g,'<br/>')"></span>
										</div>
										<!-- 图片消息 -->
										<div v-if="row.content_type=='image' && row.content != null " class="bubble img" 
										@click="showImage( row.content.url )" :style="{'background-image':'url('+row.content.url+')'}">
										</div>

										<!--小程序卡片-->
										<div v-if="row.content_type=='miniprogrampage' && typeof( row.content.miniprogrampage ) != 'undefined' "
										 class="bubble card" :class="index == cardIndex ? 'currCard': ''" @click="showCard( index, row.id, row.content.miniprogrampage )">
											<span class="arrow-out"></span>
											<div class="title clamp">{{row.content.miniprogrampage.Title}}</div>
											<div class="img" :style="{'background-image':'url('+row.content.miniprogrampage.LocalUrl+')'}"></div>
											<div class="tips">小程序卡片</div>
										</div>

										<div class="username">
											<span class="time">{{row.created_at_format}}</span>
										</div>
									</div>
								</div>
							</template>
						</div>

						<div id="talk-area-bottom"></div>
					</vue-scroll>

					<!--加载提示-->
					<Spin size="large" fix v-if="spinShow"></Spin>
				</div>
				<div slot="bottom" class="input-area">
					<div v-if="showMaskCode > 0" class="input-area-mask">
						<Button v-if="showMaskCode == 1" type="primary" :style="{'margin-top': inputBoxHeight/2 + 'px'}" @click="userJoinSession">接入会话</Button>
						<Button v-if="showMaskCode == 2" type="primary" :style="{'margin-top': inputBoxHeight/2 + 'px'}" @click="workerCreateSession">创建并接入会话</Button>
						<Button v-if="showMaskCode == 3" disabled :style="{'margin-top': inputBoxHeight/2 + 'px'}">当前已被其他客服接入，不能操作</Button>
						<Button v-if="showMaskCode == 4" disabled :style="{'margin-top': inputBoxHeight/2 + 'px'}">会话已经超过48小时，不能操作</Button>
						<div v-if="showMaskCode == 100" :style="{'margin-top': inputBoxHeight/2 + 'px',color:'#fff'}">当前不可操作</div>
					</div>

					<!--键盘激活的快速回复-->
					<csQuickTips class="quick-reply-tips" ref="quick-reply-tips" :info="info" @on-select="onQuickTipSelect" @on-change="onQuickReplyChange"></csQuickTips>

					<!--快速回复-->
					<csQuickReply v-show="sessInfo.get_user_info != null" class="quick-reply" :info="info" @on-send="onQuickSend"></csQuickReply>

					<!--客服库-->
					<csMaterialBox v-show="sessInfo.get_user_info != null" class="cs-material-box" @on-send="onSendMaterial"></csMaterialBox>

					<!--发送小程序卡-->
					<csMiniCard v-show="sessInfo.get_user_info != null" class="mini-card" @on-send="onMiniCardSend"></csMiniCard>

					<!--编辑器组件-->
					<div class="ueditor-box">
						<UEditor ref="ueditor"></UEditor>
					</div>

					<!--发送按钮-->
					<span class="send-btn">
						<Button type="primary" :disabled="sessInfo.get_user_info == null || is_sending " @click="workerSendMsg('text')">Enter
							发送</Button>
						<div class="tips">Shift+Enter换行</div>
					</span>
				</div>

			</Split>
		</div>

		<!--查看图片-->
		<Modal closable footer-hide mask-closable v-model="showModal" title="" width="780">
			<div class="cs-view-box" :style="getContentHeight"></div>
			<div style="text-align: center;">
				<Button type="default" style="margin:10px auto;" @click="showModal = false;">关闭</Button>
				<Button type="info" style="margin:10px auto;" @click="viewBigPic(imgSrc)">查看原图</Button>
			</div>
		</Modal>

		<!--弹出的会话标签框-->
		<Modal closable v-model="showTagsSessionBox" title="请添加会话标签" width="680">
			<Row type="flex" style="margin-bottom:10px;">
				<Col style="width:50px;">
				<Avatar :src="tagsSessInfo.get_user_info.wx_avatar" :size="40"></Avatar>
				</Col>
				<Col style="flex:1 1 0%;">
				<div>{{tagsSessInfo.get_user_info.wx_nick_name}}</div>
				<div>{{tagsSessInfo.get_user_info.card_num}}</div>
				</Col>
			</Row>

			<csTagsSessionBox :loadData="showTagsSessionBox"></csTagsSessionBox>
		</Modal>

		<!--选择在线客服-->
		<csWorkerSelect ref="cs-worker-select" @on-ok="onSelectWorker"></csWorkerSelect>

	</div>
</template>

<script>
	import UEditor from '@/views/my-components/ueditor/ueditor';
	import csQuickReply from './cs-quick-reply.vue';
	import csWorkerSelect from '@/views/my-components/cs-worker-select/cs-worker-select';
	import csMiniCard from './cs-mini-card.vue';
	//import pasteImage from './paste-image.vue';
	import csMaterialBox from './cs-material-box';
	import csSearchContent from './cs-search-content.vue';
	import csTagsSessionBox from './cs-tags-session-box.vue';
	import csQuickTips from './cs-quick-tips.vue';

	/**
	 * 聊天窗口 组件
	 */
	export default {
		name: "csUserTalkBox",
		components: {
			UEditor,
			csQuickReply,
			csWorkerSelect,
			csMiniCard,
			//pasteImage,
			csMaterialBox,
			csSearchContent,
			csTagsSessionBox,
			csQuickTips,
		},
		props: {
			// admin info
			info: {
				type: Object,
				default: () => {}
			},
		},
		computed: {
			// 获取内容框高度
			getContentHeight() {
				var tableHeight = document.body.clientHeight - 320;

				// 创建对象
				var img = new Image();
				// 改变图片的src
				img.src = this.imgSrc;

				// 动态计算弹出框的高度
				return {
					height: tableHeight + 'px',
					'background-image': 'url(' + this.imgSrc + ')',
					'background-size': img.width > img.height ? '100% auto' : 'auto 100%',
				};
			},
		},
		data() {
			return {
				// ueditor 配置
				ueditorConfig: {
					initialFrameHeight: '100%',
					initialFrameWidth: '100%',
					autoFloatEnabled: false, // 取消工具条悬浮
					toolbars: [
						['customimage', 'emotion']
					], // 工具条配置

					// 图片上传接口(必须初始会的)
					serverUrl: '',
					// 关闭状态栏
					elementPathEnabled: false,
					wordCount: false,
					// 取消内容区域的自动长高
					autoHeightEnabled: false,
				},

				initEditor: false,
				spinShow: false,

				boxHeight: 500,
				is_sending: false,
				base64_is_sending: false,
				base64Data: '',
				inputBoxHeight: 200,
				// 遮罩层
				showMaskCode: 100,

				// 快速回复文本提示框
				quickTipsStatus: false,

				// 打开过的用户，sessionId 作为键值对
				userHistoryList: {},
				// 当前打开session 的用户详情
				sessInfo: {
					id: 0,
					get_user_info: null
				},

				// 上下分层的比例
				split: 0.7,

				// 预览的图片
				imgSrc: '',
				showModal: false,

				showTagsSessionBox: false,
				tagsSessInfo: {
					get_user_info: {},
				},

				// 卡片的index
				cardIndex: -1,

				// 虚拟滚动条
				scrollOptions: {
					mode: 'native',
					bar: {
						keepShow: true,
						background: '#c8c8c8',
						size: '3px',
					},
					// 滚动轨道
					rail: {
						size: '3px',
					},
					scrollPanel: {
						scrollingX: false,
					}
				},
			}
		},
		methods: {
			// 初始化方法
			init() {
				// 计算整体的高度
				this.boxHeight = document.body.clientHeight - 82;
				// 动态计算上下分层比例
				this.inputBoxHeight = this.boxHeight > 650 ? 270 : 210;
				this.split = (this.boxHeight - this.inputBoxHeight) / this.boxHeight;

				if (this.initEditor == false) {
					// 自定义按钮的图片类型
					this.$store.commit('setUeditorImageType', 'customerService');

					// 初始化 ueditor
					this.initUeditor(true);
				} else {
					this.resetHeight();
				}
			},
			// 监听ueditor 的事件
			initUeditor(isInit = false) {
				this.$nextTick(() => {
					// 配置加载完毕，才初始化 ueditor
					this.$refs['ueditor'].init(this.ueditorConfig);
					this.initEditor = true;

					window.setTimeout(() => {
						this.spinShow = false;

						// 监听 ctrl+enter事件
						var ue = this.$refs['ueditor'].getUE();
						if (ue == null) {
							// ue 加载失败的情况下，重新加载ueditor 组件
							setTimeout(() => {
								this.initUeditor();
							}, 3000);
						} else {
							ue.ready(() => {
								// 监听键盘事件
								UE.dom.domUtils.on(ue.body, "keyup", (oEvent) => {
									var oEvent = oEvent || window.oEvent;

									//获取键盘的keyCode值
									var nKeyCode = oEvent.keyCode || oEvent.which || oEvent.charCode;console.log(nKeyCode);
									//获取ctrl 键对应的事件属性
									var bCtrlKeyCode = oEvent.ctrlKey || oEvent.metaKey;
									// shift 键
									var bShiftKeyCode = oEvent.shiftKey || oEvent.metaKey;

									if (nKeyCode == 13 && bShiftKeyCode == false && bCtrlKeyCode == false && this.quickTipsStatus == false) {
										this.workerSendMsg('text');
										oEvent.returnValue = false;
									}
									// 监听 回车键 (选中提示消息)
									else if (nKeyCode == 13 && bShiftKeyCode == false && bCtrlKeyCode == false && this.quickTipsStatus ==
										true) {
										// 清空 ueditor 的内容
										this.$refs['ueditor'].getUE().setContent('');

										this.$refs['quick-reply-tips'].select();
									}
									// 监听 上下键
									else if (this.quickTipsStatus && (nKeyCode == 38 || nKeyCode == 40)) {
										if (nKeyCode == 38) {
											this.$refs['quick-reply-tips'].up();
										} else {
											this.$refs['quick-reply-tips'].down();
										}
									} 
									// 监听 删除键
									else if( this.base64Data != '' && (nKeyCode == 8 || nKeyCode == 46) ){
										let tmpCont = this.$refs['ueditor'].getUEContent();
										// 当发现用户已经删除了截图，那么把截图的变量清空
										if( tmpCont.indexOf('img src="data:image/png;base64') === -1 ){
											this.base64Data = '';
										}
									}
									else {
										// 自动匹配快速回复的消息
										this.showQuickReply();
									}
								});

								var that = this;
								// 监听贴图事件
								UE.dom.domUtils.on(ue.body, "paste", function(e) {
									const cbd = e.clipboardData;
									const ua = window.navigator.userAgent;

									// 如果是 Safari 直接 return
									if (!(e.clipboardData && e.clipboardData.items)) {
										return;
									}
									if (cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind ===
										"file" &&
										cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" &&
										ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
										return;
									}
									for (let i = 0; i < cbd.items.length; i++) {
										let item = cbd.items[i];
										if (item.kind == "file") {
											// blob 就是从剪切板获得的文件，可以进行上传或其他操作
											const blob = item.getAsFile();
											if (blob.size === 0) {
												return;
											}
											const reader = new FileReader();
											const imgs = new Image();
											imgs.file = blob;

											reader.onload = ((aImg) => {
												return function(e) {
													that.base64Data = e.target.result;
													aImg.src = e.target.result;

													// 插入到编辑器内
													ue.execCommand('inserthtml', '<img src="' + e.target.result +
														'" class="blob-image" style="max-width:300px;max-height:300px;"/>');
												};
											})(imgs);
											reader.readAsDataURL(blob);
										}
									}
								});

								window.setTimeout(() => {
									this.resetHeight();
								}, isInit ? 1000 : 300);
							});
						}
					}, isInit ? 3000 : 100);
				});
			},
			// 自动匹配快速回复的消息
			showQuickReply() {
				var inputMsg = this.$refs['ueditor'].getUEContent();
				// 过滤全部html
				inputMsg = inputMsg.replace(/<.*?>/g, "");

				this.$refs['quick-reply-tips'].showModal(inputMsg);
			},
			// 消息tips 的状态
			onQuickReplyChange(status) {
				this.quickTipsStatus = status;
			},
			// 上线移动框大小事件
			onMoving(val) {
				this.resetHeight();
			},
			resetHeight() {
				this.$refs['ueditor'].getUE().setHeight((1 - this.split) * (this.boxHeight - 72 - 100));
			},
			// 当前会话打开后，把用户未读的内容设置为已读
			setContentIsRead() {
				this.$ajax.post(this.$api.csContentIsRead, {
						user_id: this.sessInfo.get_user_info.id,
						session_id: this.sessInfo.id,
					})
					.then((response) => {
						var res = response.data;
						if (res.code) {
							// 触发已读
							if (res.data > 0) {
								this.$store.commit('setCsIsRead', (new Date()).valueOf());
							}
						}
					});
			},
			// 聊天框滚动到最底部
			scrollToBottom(sec = 500) {
				this.$nextTick(() => {
					this.$refs['vue-scroll'].scrollIntoView("#talk-area-bottom", sec);
				});
			},
			// 聊天框滚动触发的事件
			handleScroll(vertical, horizontal, nativeEvent) {
				if (vertical.scrollTop == 0 &&
					typeof(this.userHistoryList[this.sessInfo.id]) != 'undefined' &&
					typeof(this.userHistoryList[this.sessInfo.id][0].isLast) == 'undefined'
				) {
					// 触发加载历史
					this.getUserContentList(this.sessInfo.get_user_info.id, this.userHistoryList[this.sessInfo.id][0].id);
				}
			},
			// 加载当前用户和客服的会话内容
			getUserContentList(userId, lastId) {
				this.spinShow = true;
				// 因为异步处理的回调直接读取 this.sessInfo.id 会发现已经被修改了，所以发送前一定要记录下
				var listSessionId = this.sessInfo.id;

				this.$ajax.post(this.$api.csUserContentList, {
						user_id: userId,
						last_id: lastId, // 当前会话最后id（用于历史查询）
					})
					.then((response) => {
						this.spinShow = false;
						var res = response.data;
						if (res.code) {

							// 格式化emoji
							var list = res.data.items;
							if (list.length == 0) {
								this.$Message.info('没有更多内容了');
								this.$set(this.userHistoryList[listSessionId][0], 'isLast', true);
							} else {
								for (var i in list) {
									if (list[i].content_type == 'text') {
										list[i].content.text = this.replaceEmoji(list[i].content.text);
									}
								}

								// 写入到数组
								if (lastId == 0) {
									// 第一次写入数组
									this.$set(this.userHistoryList, listSessionId, list);

									// 滚动到底部
									this.scrollToBottom();

									setTimeout(() => {
										// 刷新接入列表，主要是把未读数字刷掉
										this.$store.commit('setJoinedSession', (new Date()).valueOf());
									}, 5000);
								} else {
									// 加载历史记录的
									for (var i in list) {
										this.userHistoryList[listSessionId].unshift(list[i]);
									}

									// 滚动到上次加载的位置
									this.$nextTick(() => {
										this.$refs['vue-scroll'].scrollIntoView("#msg" + lastId, 0);
									});
								}

								// 当前会话打开后，把用户未读的内容设置为已读
								this.setContentIsRead();
							}
						}
					});
			},
			// 键盘触发提示框内容的选中回调
			onQuickTipSelect(val) {
				// 清空ueditor内容
				this.$refs['ueditor'].getUE().setContent('');

				this.onQuickSend(val);
			},
			// 快速回复
			onQuickSend(val) {
				// 把内容写入到ueditor
				this.$refs['ueditor'].getUE().focus();
				this.$refs['ueditor'].getUE().execCommand('inserthtml', val);
			},
			// 发送小程序卡片
			onMiniCardSend(obj) {
				this.workerSendMsg('miniprogrampage', '', '', obj);
			},
			// 发送素材库内容
			onSendMaterial(obj) {
				switch (obj.type) {
					case 'TEXT':
						this.workerSendMsg('material_text', '', '', obj);
						break;

					case 'IMAGE':
						this.workerSendMsg('image', obj.img_src_format);
						break;

					case 'CARD':
						var newObj = {
							Title: obj.content,
							PagePath: obj.link_url,
							LocalUrl: obj.img_src_format,
						};
						this.workerSendMsg('miniprogrampage', '', '', newObj);
						break;
				}
			},
			// 客服人员发送消息
			workerSendMsg(contentType, imgUrl = '', quickText = '', obj = {}) {

				if (this.sessInfo.get_user_info == null) {
					this.$Message.error('会话为空，不能发送！');
					return false;
				}

				// 如果是微信，最多只能连续发送5条信息
				var uLength = this.userHistoryList[this.sessInfo.id].length;
				if (this.sessInfo.openid_type != 'APP') {
					for (var u = 1; u < 10; u++) {
						if (this.userHistoryList[this.sessInfo.id][uLength - u].originator_type == 'worker') {
							if (u >= 5) {
								this.$Message.error('不能连续发送5条以上的信息给用户！');
								return false;
							}
						} else {
							break;
						}
					}
				}

				// 微信规定最后一条信息，不能超过48 小时
				var userLastDate = new Date(this.userHistoryList[this.sessInfo.id][uLength - 1].created_at);
				var userTimestamp = userLastDate.getTime(); // 毫秒级别
				var currTimestamp = new Date().getTime(); // 毫秒级别
				if (this.sessInfo.openid_type != 'APP' && userTimestamp + (48 * 3600 * 1000) < currTimestamp) {
					this.$Modal.error({
						title: '错误提示',
						content: '微信规定，超过48小时未发送过信息的用户，客服是不能主动发出信息的！',
					});
					return false;
				}

				var msg = '';
				var workerId = this.$util.cache.get('cs_worker_id');
				var content = {};
				var content2 = {};

				// 优先发送粘贴的图片
				//var base64Data = this.$refs['paste-image'].getBase64Data();
				var base64Data = this.base64Data;
				if (base64Data != '') {
					// 发送base64图片
					this.sendBase64Image(workerId, base64Data, contentType, imgUrl, quickText, obj);
					return;
				}

				if (contentType == 'text') {
					msg = this.$refs['ueditor'].getUEContent();
					// 替换表情为字符
					for (var i in this.info.emojiList) {
						var reg = new RegExp('emoji\/' + this.info.emojiList[i].url + '"\/>', "g");
						msg = msg.replace(reg, '">' + this.info.emojiList[i].alt);
					}
					// 替换换行符
					msg = msg.replace(/<br\/>/g, "\n");
					msg = msg.replace(/<\/p>/g, "\n");
					msg = msg.replace(/\n$/, "");

					// 过滤全部html
					msg = msg.replace(/<.*?>/g, "");
					if (msg == '' || msg == null) {
						this.$Message.error('内容为空，不能发送！');
						return;
					}
					// 过滤掉最尾部的换行符
					msg = msg.replace(/\n$/, "");
					msg = msg.replace(/\n$/, "");
					// 加入客服的签名昵称
					msg = '【' + this.info.worker.nick_name + '】' + msg;

					content = {
						text: this.replaceEmoji(msg),
					};
					content2 = {
						text: msg,
					};
					// 清空 ueditor 的内容
					this.$refs['ueditor'].getUE().setContent('');
				}
				// 素材库的文本内容
				else if (contentType == 'material_text') {
					contentType = 'text';
					msg = obj.content;

					// 替换换行符
					msg = msg.replace(/<br\/>/g, "\n");
					msg = msg.replace(/<\/p>/g, "\n");
					msg = msg.replace(/\n$/, "");

					if (msg == '' || msg == null) {
						this.$Message.error('内容为空，不能发送！');
						return;
					}

					// 加入客服的签名昵称
					msg = '【' + this.info.worker.nick_name + '】' + msg;

					content = {
						text: this.replaceEmoji(msg),
					};
					content2 = {
						text: msg,
					};
				} else if (contentType == 'image') {
					msg = '图片';
					content = {
						url: imgUrl,
					};
					content2 = {
						url: imgUrl,
					};
				} else if (contentType == 'miniprogrampage') {
					msg = '小程序卡片';
					content = {
						miniprogrampage: {
							Title: obj.Title,
							PagePath: obj.PagePath, // 后台会根据路由来判断小卡片类型
							LocalUrl: obj.LocalUrl,
						}
					};
					content2 = content;
				}

				// 1.直接写入到数组
				this.userHistoryList[this.sessInfo.id].push({
					id: (new Date()).valueOf(),
					originator_type: 'worker',
					content_type: contentType,
					created_at_format: this.getTimeFormat("yyyy-MM-dd hh:mm"),
					content: content,
					content_search: msg,
					get_worker_info: {
						nick_name: this.info.worker.nick_name,
						avatar_format: this.info.worker.avatar_format,
						get_admin_info: {
							user_name: this.info.userName,
						},
					}
				});

				// 2.滚动到最底部
				this.scrollToBottom();

				// 3.把内容发送到服务器
				this.$ajax.post(this.$api.csworkerAddContent, {
						session_id: this.sessInfo.id,
						user_id: this.sessInfo.get_user_info.id,
						worker_id: workerId,
						content_type: contentType,
						content: JSON.stringify(content2),
						content_search: msg,
					})
					.then((response) => {
						var res = response.data;
						if (res.code) {
							// 发送成功，

							// 刷新接入列表中的内容提示
							this.$store.commit('setCsUpdateUserContent', {
								session_id: this.sessInfo.id,
								content_search: msg,
							});
						} else {
							this.$Modal.error({
								title: '错误提示',
								content: res.message,
							});

							if (res.data == -1) {
								this.$delete(this.userHistoryList[this.sessInfo.id], (this.userHistoryList[this.sessInfo.id].length - 1));
								// 滚动到最底部
								this.scrollToBottom();
							}
						}
					});
			},
			sendBase64Image(workerId, base64Data, contentType, imgUrl, quickText, card) {
				if (this.base64_is_sending == false) {
					this.base64_is_sending = true;

					// 把内容发送到服务器
					this.$ajax.post(this.$api.csworkerAddContent, {
							session_id: this.sessInfo.id,
							user_id: this.sessInfo.get_user_info.id,
							worker_id: workerId,
							content_type: 'image',
							content_search: '粘贴图片',
							is_base64: 1,
							content: base64Data,
						})
						.then((response) => {
							this.base64_is_sending = false;

							var res = response.data;
							if (res.code) {
								// 发送成功清理掉粘贴区域的图片
								//this.$refs['paste-image'].clearData();
								this.base64Data = '';

								// 1.写入到数组
								this.userHistoryList[this.sessInfo.id].push({
									id: (new Date()).valueOf(),
									originator_type: 'worker',
									content_type: 'image',
									created_at_format: this.getTimeFormat("yyyy-MM-dd hh:mm"),
									content: {
										url: res.data
									},
									content_search: '粘贴图片',
									get_worker_info: {
										nick_name: this.info.worker.nick_name,
										avatar_format: this.info.worker.avatar_format,
									}
								});

								// 2.滚动到最底部
								this.scrollToBottom();

								// 3.判断是否还有文字
								var msg = this.$refs['ueditor'].getUEContent();
								// 过滤全部html
								msg = msg.replace(/<.*?>/g, "");

								// 4.触发第二次发送文字
								if (contentType == 'text' && msg != '') {
									this.$nextTick(() => {
										this.workerSendMsg(contentType, imgUrl, quickText, card);
									});
								} else {
									// 清空 ueditor 的内容
									this.$refs['ueditor'].getUE().setContent('');
								}
							}
						});
				} else {
					// base64 图片正在发送中
				}
			},
			// 收到用户发送过来的信息处理
			getWsMsg(obj) {
				if (obj.content_type == 'text') {
					// 格式化emoji
					obj.content.text = this.replaceEmoji(obj.content.text);
				}

				// 如果当前用户是打开了聊天框的
				if (this.sessInfo.get_user_info != null && obj.user.id == this.sessInfo.get_user_info.id) {
					// 1.直接写入到数组
					if (typeof(obj.data_type) != 'undefined' && obj.data_type == 'keyword_reply') {
						// 接收自动回复的消息
						setTimeout(() => {
							this.userHistoryList[obj.session_id].push({
								id: obj.content_id,
								originator_type: 'worker',
								content_type: obj.content_type,
								created_at_format: obj.created_at_format,
								content: obj.content,
								content_search: obj.content_search,
								get_worker_info: {
									nick_name: obj.worker.nick_name,
									avatar_format: obj.worker.avatar_format,
								}
							});
							// 2.滚动到最底部
							this.scrollToBottom();

						}, 1000);
					} else {
						this.userHistoryList[obj.session_id].push({
							id: obj.content_id,
							originator_type: 'user',
							content_type: obj.content_type,
							created_at_format: obj.created_at_format,
							content: obj.content,
							content_search: obj.content_search,
							get_user_info: {
								wx_nick_name: obj.user.wx_nick_name,
								wx_avatar: obj.user.wx_avatar,
							}
						});

						// 2.滚动到最底部
						this.scrollToBottom();
					}

				}
				// 如果当前用户未打开聊天框的
				else {
					// 1.直接写入到数组
					if (typeof(this.userHistoryList[obj.session_id]) != 'undefined') {
						if (typeof(obj.data_type) != 'undefined' && obj.data_type == 'keyword_reply') {
							// 接收自动回复的消息
							setTimeout(() => {
								this.userHistoryList[obj.session_id].push({
									id: obj.content_id,
									originator_type: 'worker',
									content_type: obj.content_type,
									created_at_format: obj.created_at_format,
									content: obj.content,
									content_search: obj.content_search,
									get_worker_info: {
										nick_name: obj.worker.nick_name,
										avatar_format: obj.worker.avatar_format,
									}
								});
							}, 1000);
						} else {
							this.userHistoryList[obj.session_id].push({
								id: obj.content_id,
								originator_type: 'user',
								content_type: obj.content_type,
								created_at_format: obj.created_at_format,
								content: obj.content,
								content_search: obj.content,
								get_user_info: {
									wx_nick_name: obj.user.wx_nick_name,
									wx_avatar: obj.user.wx_avatar,
								}
							});
						}
					}

					// 2. 刷新列表接入列表
					this.$store.commit('setJoinedSession', (new Date()).valueOf());
				}
			},
			// 格式化当前时间
			getTimeFormat(fmt) {
				var d = new Date();
				var o = {
					"M+": d.getMonth() + 1, //月份
					"d+": d.getDate(), //日
					"h+": d.getHours(), //小时
					"m+": d.getMinutes(), //分
					"s+": d.getSeconds(), //秒
					"q+": Math.floor((d.getMonth() + 3) / 3), //季度
					"S": d.getMilliseconds() //毫秒
				};
				if (/(y+)/.test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
				}
				for (var k in o) {
					if (new RegExp("(" + k + ")").test(fmt)) {
						fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
					}
				}
				return fmt;
			},
			// 打开转接框
			transferSession() {
				this.$refs['cs-worker-select'].openModal([], 'radio', 1);
			},
			// 选择客服成功的回调，处理转接
			onSelectWorker(obj) {
				if (typeof(obj[0].id) != 'undefined') {
					if (this.info.worker.id != obj[0].id) {
						this.spinShow = true;

						// 发送转接请求
						this.$ajax.post(this.$api.csSessionTransfer, {
								session_id: this.sessInfo.id,
								from_worker_id: this.info.worker.id,
								to_worker_id: obj[0].id,
							})
							.then((response) => {
								this.spinShow = false;
								var res = response.data;
								if (res.code) {
									this.$Message.success(res.message);

									// 清除掉当前会话信息
									this.sessInfo = {};

									// 触发刷新已接入的会话列表
									this.$store.commit('setJoinedSession', (new Date()).valueOf());
								}
							});
					} else {
						this.$Modal.error({
							title: '错误提示',
							content: '老哥，不能转接给自己啊！',
						});
					}
				}
			},
			// 关闭会话
			closeSession() {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定关闭会话吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.tagsSessInfo = this.sessInfo;

						// 发送关闭会话
						this.$ajax.post(this.$api.csCloseSession, {
								session_id: this.sessInfo.id,
							})
							.then((response) => {
								var res = response.data;
								if (res.code) {
									this.sessInfo = {};

									// 触发刷新已接入的会话列表
									this.$store.commit('setJoinedSession', (new Date()).valueOf());

									// 打开遮罩层
									this.showMaskCode = 100;

									// 触发弹出会话标签
									if (res.popupTags == 1) {
										this.showTagsSessionBox = true;
									}
								}
							});

					},
				});
			},
			// 关闭历史窗口
			closeHistoryBox() {
				// 关闭遮罩层
				this.$store.commit('setCsMaskCode', 0);

				this.sessInfo = {};
			},
			// 主动把用户接入到会话
			userJoinSession() {
				var workerId = this.$util.cache.get('cs_worker_id');

				this.spinShow = true;
				this.$ajax.post(this.$api.csJoinSession, {
						from_worker_id: 0,
						to_worker_id: workerId,
						session_id: this.sessInfo.id,
					})
					.then((response) => {
						this.spinShow = false;
						var res = response.data;
						if (res.code) {

							// 关闭历史 返回到接入列表
							this.$store.commit('setCsHideHistory', (new Date()).valueOf());

							// 把内容参数传递到对话框组件
							this.sessInfo.in_history = false;
							this.$store.commit('setSelectedCsSession', this.sessInfo);

							// 刷新接入列表
							this.$store.commit('setWaitingSession', (new Date()).valueOf());
							// 刷新待接入列表
							this.$store.commit('setJoinedSession', (new Date()).valueOf());
						}
					});

			},
			// 客服主动创建会话
			workerCreateSession() {
				this.spinShow = true;
				this.$ajax.post(this.$api.csWorkerCreateSession, {
						user_id: this.sessInfo.get_user_info.id,
					})
					.then((response) => {
						this.spinShow = false;
						var res = response.data;
						if (res.code) {

							// 关闭历史 返回到接入列表
							this.$store.commit('setCsHideHistory', (new Date()).valueOf());

							// 把内容参数传递到对话框组件
							this.$store.commit('setSelectedCsSession', res.data);

							// 刷新接入列表
							this.$store.commit('setWaitingSession', (new Date()).valueOf());
							// 刷新待接入列表
							this.$store.commit('setJoinedSession', (new Date()).valueOf());
						}
					});
			},
			//替换表情符号为图片
			replaceEmoji(str) {
				let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
					for (let i = 0; i < this.info.emojiList.length; i++) {
						let row = this.info.emojiList[i];

						if (row.alt == item) {
							let imgstr = '<img src="' + this.info.emHost + row.url + '">';
							return imgstr;
						}
					}
					// 如果匹配不成功，返回原表情意思
					return item;
				});

				// 这里是富文本解析，是可以使用div 的
				return '<div style="word-wrap:break-word;">' + replacedStr + '</div>';
			},
			// 显示卡片
			showCard(index, id, cardContent) {
				this.cardIndex = index;

				// 判断是商品卡片还是订单卡片
				if (cardContent.PagePath.indexOf('goods_info') !== -1) {
					this.$emit('on-goods', cardContent);
				} else if (cardContent.PagePath.indexOf('order_info') !== -1) {
					this.$emit('on-order', cardContent);
				} else if (cardContent.PagePath.indexOf('order_exchange_info') !== -1) {
					this.$emit('on-order-exchange', cardContent);
				}
			},
			hasClass(ele, cls) {
				return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
			},
			//为指定的dom元素添加样式
			addClass(ele, cls) {
				if (!this.hasClass(ele, cls)) ele.className += " " + cls;
			},
			//删除指定dom元素的样式
			removeClass(ele, cls) {
				if (this.hasClass(ele, cls)) {
					var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
					ele.className = ele.className.replace(reg, " ");
				}
			},
			// 查看大图
			showImage(imgSrc) {
				if (imgSrc != '') {
					this.imgSrc = imgSrc.replace('_thumb.jpg', '', imgSrc);
					this.showModal = true;
				}
			},
			// 新页查看原图
			viewBigPic(imgSrc) {
				window.open(imgSrc);
			},
			// 内容搜索组件的回调
			onSearchContent(obj) {
				this.userHistoryList[this.sessInfo.id] = obj.list;

				// 滚动到搜索点
				setTimeout(() => {
					this.$nextTick(() => {
						this.$refs['vue-scroll'].scrollIntoView("#msg" + obj.content_id, 200);
					});
				}, 500);
			}
		},
		mounted() {
			this.init();
		},
		activated() {
			// 重新进入，都滚动到底部
			this.$nextTick(() => {
				this.scrollToBottom(0);

				if (this.initEditor) {
					// 监听ueditor 的事件
					this.initUeditor();
				}
			});
		},
		watch: {
			// 选中session 触发的
			'$store.state.app.selectedCsSession'(to) {
				this.sessInfo = to;
				// 清空提示小红点
				this.$store.commit('setKefuCount', 0);
				// 请空显示的商品或订单窗
				this.$emit('on-clear', {});
				// 关闭遮罩
				this.showMaskCode = 0;

				if (typeof(this.userHistoryList[to.id]) == 'undefined') {
					// 第一次进入，需要加载这个客服的当前会话内容
					this.getUserContentList(to.get_user_info.id, 0);
				} else {
					// 滚动到底部
					this.$nextTick(() => {
						this.scrollToBottom();
					});

					// 当前会话打开后，把用户未读的内容设置为已读
					this.setContentIsRead();
				}
			},
			// 当接收到用户发送回来的 ws 信息
			'$store.state.app.csSession'(to) {
				this.getWsMsg(to);

				// 刷新接入列表中的内容提示
				this.$store.commit('setCsUpdateUserContent', to);
			},
			// 选中的客服图片回调，触发发送图片消息
			'$store.state.app.csImageSelected'(to) {
				this.workerSendMsg('image', to);
			},
			// 遮罩层的显示监听
			'$store.state.app.csMaskCode'(to) {
				this.showMaskCode = to;
			}
		}
	}
</script>
