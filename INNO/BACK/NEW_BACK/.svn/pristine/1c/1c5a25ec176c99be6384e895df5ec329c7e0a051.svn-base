<style lang="less">
.cs-user-list-box{
	border:1px solid #dedede;

	.header-box{
		padding:3px 5px;
		background: #f8f8f9;
		border-bottom: 1px solid #ddd;
	}

	.cell-avatar-box{
		width:45px;
		position: relative;

		.badge{
			position: absolute;
			top: -5px;
			left: -12px;
		}
	}
	.cell-content-box{
		width:118px;
		font-size:12px;
		line-height: 1.6;
	}

	.ivu-cell{
		border-bottom: 1px solid #eee;
	}
	.worker-name{
		font-size:13px;
		max-width: 130px;
	}
	.worker-status{
		font-size:10px;
	}
	.ivu-cell-group .title{
		color:#515a6e;
		background: #f8f8f9;
	}

	.history-btn{
		width:60px;
		font-size:12px;
		line-height:3.5;
		height:100%;
		cursor: pointer;
		text-align: right;
	}

	.badge-text{
		width: 42px;
		height: 20px;
		line-height: 2;
		border-radius: 6px;
		display: inline-block;
		font-size:12px;
		margin-left:10px;
	}
	.my-header{
		.ivu-cell-footer{
			top:60%;
		}
	}

	.ivu-page-simple-pager{
		input{
			font-size:12px;
			width:40px;
		}
	}

	.from-other-worker{
		background-color: rgba(237,64,20,0.21);
	}
	
	.extra-box{
		position: relative;
		
		.close-session{
			position: absolute;
			top:-20px;
			right:-6px;
			display: none;
		}
	}
	.cell-box:hover{
		.extra-box{
			.close-session{
				display: block;
			}
		}
	}
}
</style>

<template>
	<div class="cs-user-list-box" :style="{height: boxHeight+'px'}">
		<div class="header-box">
			<div class="uflex">
				<div style="width:40px;padding-top:4px;">
					<Avatar icon="ios-person" :src="( info != null && typeof(info.worker) != 'undefined' ? info.worker.avatar_format : '')"></Avatar>
				</div>
				<div style="flex: 1 1 0%;">
					<div class="worker-name clamp">
						{{ info != null && typeof(info.worker) != 'undefined' ? info.worker.nick_name : ''}}
						{{ info != null && typeof(info.worker) != 'undefined' && info.worker.get_group != null ? ' ['+info.worker.get_group.name + ']' : ''}}
					</div>
					<div>
						<Dropdown transfer trigger="click" @on-click="onStatusDropdown" @on-visible-change="onStatusChange">
						    <a href="javascript:void(0)">
						        <span class="worker-status" :style="getWorkerStatusStyle()">{{getWorkerStatusName()}}</span>
						        <Icon type="md-arrow-dropdown" color="#333"></Icon>
						    </a>
						    <DropdownMenu slot="list"
							v-if="info != null && typeof(info.statusList) != 'undefined' && info.statusList != null ">
						        <DropdownItem
								v-for="(item,index) in info.statusList" :key="index"
								:name="index"
								:style="{color: item.color }">{{item.name}}</DropdownItem>
						    </DropdownMenu>
						</Dropdown>
					</div>
				</div>

				<div v-if="showHistoryBox" class="history-btn" @click="onHideHistory">
					<Icon type="md-arrow-round-back" :size="16" />返回
				</div>
				<div v-else class="history-btn" @click="onShowHistory">
					接入历史
				</div>
			</div>
		</div>

		<!--用户历史-->
		<csUserHistory v-show="showHistoryBox" ref="cs-user-history" :boxHeight="boxHeight" @on-show-joined="selectSessionFromHistory"></csUserHistory>

		<!--接待中列表-->
		<div v-show="!showHistoryBox">
			<CellGroup :style="{height: (boxHeight-45-40 )*( showWaitingList ? 0.6 : 1 ) +'px'}">
				<Cell title="接待中" class="title my-header">
					<span slot="extra">
						<Badge :count="myTotal" type="info" show-zero>
							<a class="badge-text">接入总数</a>
						</Badge>
						<Badge :count="unReadUserCount" type="error" show-zero>
							<a class="badge-text">未处理</a>
						</Badge>
					</span>
				</Cell>
				<div :style="{height: (boxHeight-45-40-(showWaitingList ? 65:45) )*(showWaitingList ? 0.6 : 1) +'px'}">
					<vue-scroll ref="vue-scroll" :ops="scrollOptions">
						<Cell v-for="(item,index) in myList" :key="index" v-if="item.get_user_info!=null "
						:selected="item.id == currSessionId "
						:class="item.get_session_join_log != null ? 'cell-box from-other-worker' :'cell-box' "
						@click.native="selectSession(item)">
							<div class="uflex">
								<div class="cell-avatar-box">
									<Avatar icon="ios-person" size="large" :src="item.get_user_info.wx_avatar"/>
									<Badge :count="Number(item.get_user_content_count)" class="badge" />
								</div>
								<div class="cell-content-box">
									<div class="clamp">{{item.session_from}}{{item.get_user_info.wx_nick_name}}</div>
									<div class="clamp">{{item.get_user_content_once != null ? item.get_user_content_once.content_search : '' }}</div>
								</div>
							</div>
							<div slot="extra" class="extra-box">
								<Icon type="md-close-circle" class="close-session" color="#2d8cf0" @click.stop="closeSession(item)" />
								<div style="font-size:13px;">{{item.get_user_content_once != null ? item.get_user_content_once.created_at_format : ''}}</div>
								<div v-if="item.get_session_join_log != null" class="clamp" style="font-size:13px;max-width: 50px;"
								:title="item.get_session_join_log.get_from_worker_info != null
									&& typeof(item.get_session_join_log.get_from_worker_info) != 'undefined' ?
									'转接来自：' + item.get_session_join_log.get_from_worker_info.nick_name : ''">
									{{ item.get_session_join_log.get_from_worker_info != null
									&& typeof(item.get_session_join_log.get_from_worker_info) != 'undefined' ?
									item.get_session_join_log.get_from_worker_info.nick_name : ''}}
								</div>
							</div>
						</Cell>
					</vue-scroll>
				</div>
				<Cell class="title" style="border-bottom: 1px solid #ddd;">
					<Page :current="myCurrPage" :total="myTotal" :page-size="myPageSize" size="small" simple
					@on-change="joinedSessionList"/>
				</Cell>
			</CellGroup>

			<!--待接入列表-->
			<CellGroup v-show="!showHistoryBox && showWaitingList" :style="{height: (boxHeight-45-40-65)*0.4 +'px', 'margin-top':'40px','border-top':'1px solid #ddd'}">
				<Cell title="待接入" class="title">
					<Badge :count="waitingTotal" slot="extra" overflow-count="999" type="info" />
				</Cell>
				<div :style="{height: (boxHeight-45-40-65-150 )*0.4 +'px'}">
					<vue-scroll ref="vue-scroll" :ops="scrollOptions">
						<Cell v-for="(item,index) in waitingList" :key="index" v-if="item.get_user_info!=null ">
							<div class="uflex">
								<div class="cell-avatar-box">
									<Avatar icon="ios-person" size="large" :src="item.get_user_info.wx_avatar"/>
									<Badge :count="Number(item.get_user_content_count)" class="badge" />
								</div>
								<div class="cell-content-box">
									<div class="clamp">{{item.session_from}}{{item.get_user_info.wx_nick_name}}</div>
									<div class="clamp">{{item.get_user_content_once != null ? item.get_user_content_once.content_search : '' }}</div>
								</div>
							</div>
							<div slot="extra">
								<div style="font-size:12px;text-align: center;">
								{{item.get_user_content_once != null ? item.get_user_content_once.created_at_format : ''}}
								</div>
								<Button size="small" type="info"
								:loading="item.loading"
								@click.stop="userJoinSession(index, item.id)" >接入</Button>
							</div>

						</Cell>
					</vue-scroll>
				</div>
				<Cell class="title" style="border-bottom: 1px solid #ddd;">
					<Page :current="waitingCurrPage" :total="waitingTotal" :page-size="waitingPageSize" size="small" simple
					 @on-change="waitingSessionList"/>
				</Cell>
			</CellGroup>
		</div>
	</div>
</template>

<script>
import csUserHistory from './cs-user-history';

/**
 * 接入用户列表 组件
 */
export default {
	name:"csUserListBox",
    components: {
		csUserHistory
	},
	props:{
		boxHeight:{
			type:Number,
			default: 500,
		},
		// admin info
		info:{
			type:Object,
			default:()=>{}
		}
	},
	data () {
	    return {
			// 已经接入的列表
			myList:[],
			myTotal: 0,
			myPageSize: 20,
			myCurrPage: 1,

			// 等待接入的列表
			waitingList: [],
			waitingTotal: 0,
			waitingPageSize: 20,
			waitingCurrPage: 1,

			// 未处理的用户总数
			unReadUserCount: 0,

			currSessionId: 0,

			showHistoryBox: false,
			showWaitingList: true,

			tmp_old_status: 0,
			tmp_change_status: 0,
      
      // 音效对象
      audio:{},
      enableVoice: 1,
      
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
		// 初始化方法( 提供给父组件使用 )
	    initData() {
			this.joinedSessionList();
			this.waitingSessionList();

			if( this.info != null
			&& typeof(this.info.worker) != 'undefined'
			&& this.info.worker.get_group != null
			&& this.info.worker.get_group.can_join === 0
			){
				this.showWaitingList = false;
			}
			
			// 初始化 store 的WorkerStatus 状态
			if( this.info != null && this.info.worker != null ){
				this.$store.commit('setWorkerStatus', this.info.worker.status );
			}
			
			// 初始化音效
			this.audio = new Audio();
			this.audio.src = this.$util.apiHost + "/../image/show/assets-audios-kefuCalling.mp3";
			this.enableVoice = this.$util.cache.get('customerServiceEnableVoice');
      
		},
		// 获取当前客服已经接入的会话列表
		joinedSessionList( currPage = 0 ){
			var workerId = this.$util.cache.get('cs_worker_id');

      this.myCurrPage = currPage > 0 ? currPage : this.myCurrPage;

			this.$ajax.post( this.$api.csSessionList, {
				worker_id: workerId,
				status: 1, // 1 已接入
				pageSize: this.myPageSize,
				page: this.myCurrPage,
			})
			.then( (response) => {
				var rs = response.data;
				if( rs.code ){
					this.myList = rs.data.items;
					this.myTotal = rs.data.total;
					this.unReadUserCount = rs.data.unReadUserCount;
				}
			});
		},
		// 获取等待加入的会话列表
		waitingSessionList( currPage = 0 ){
			var workerId = this.$util.cache.get('cs_worker_id');

      this.waitingCurrPage = currPage > 0 ? currPage : this.waitingCurrPage;

			this.$ajax.post( this.$api.csSessionList, {
				worker_id: workerId,
				status: 0, // 0 等待接入
				pageSize: this.waitingPageSize,
				page: this.waitingCurrPage,
			})
			.then( (response) => {
				var res = response.data;
				if( res.code ){
					this.waitingList = res.data.items;
					this.waitingTotal = res.data.total;
					
					// workerStatus == 0 表示离线，不显示提示
					if( this.waitingTotal > 0 && this.info.worker.status > 0 ){
						this.$store.commit('setKefuCount', 1 );
						this.$Notice.info({
							title: '客服提醒',
							desc: '有'+this.waitingTotal+'个用户等待接入'
						});
											
						// 播放音效
						if( this.enableVoice == 1 ){
						  this.audio.play();
						}
					}
				}
			});
		},
		// 下拉框的点击事件
		onStatusDropdown( val ){
			this.tmp_change_status = val;
			this.tmp_old_status = this.info.worker.status;
		},
		// 修改客服状态
		onStatusChange( visible ){
			if( visible == false ){
				var val = this.tmp_change_status;
				if( val == 0 && this.myList.length > 0 ){
					this.$Modal.error({
						title: '警告',
						content: '当前还有会话未关闭，不能设置离线！',
						onOk:()=>{
							this.info.worker.status = this.tmp_old_status;
						}
					});

					return ;
				}

				if( this.info != null && typeof( this.info.worker ) != 'undefined' ){
					this.info.worker.status = Number( val );

					// 发送状态
					this.$ajax.post( this.$api.csSetWorkerStatus, {
						status: this.info.worker.status
					})
					.then( (response) => {
						var res = response.data;
						if( res.code ){
							// 修改状态 store
							this.$store.commit('setWorkerStatus', this.info.worker.status );
						}
					});
				}
			}
		},
		// 获取客服状态名
		getWorkerStatusName(){
			if( this.info != null && typeof(this.info.worker) != 'undefined' ){
				return this.info.statusList[ this.info.worker.status ].name;
			}
			else{
				return '';
			}
		},
		// 获取状态颜色
		getWorkerStatusStyle(){
			if( this.info != null && typeof(this.info.worker) != 'undefined' ){
				return {color: this.info.statusList[ this.info.worker.status ].color, 'font-weight':'bold' };
			}
			else{
				return {};
			}
		},
		// 把用户接入到“接收”会话
		userJoinSession( index, sessionId ){
			if(this.info.worker.status > 0 ){
				var workerId = this.$util.cache.get('cs_worker_id');

				this.waitingList[ index ].loading = true;
				this.$ajax.post( this.$api.csJoinSession, {
					from_worker_id: 0,
					to_worker_id: workerId,
					session_id: sessionId,
				})
				.then( (response) => {
					this.waitingList[ index ].loading = false;
					var res = response.data;
					if( res.code ){

						// 直接把接入的用户作为选中的session
						this.selectSession( this.waitingList[ index ] );

						// 从等待列表 移除这个用户
						this.$delete(this.waitingList, index);
						this.waitingTotal --;

						// 刷新已接入的用户列表
						this.joinedSessionList();
					}
				});
			}
			else{
				this.$Modal.error({
					title:'错误提示',
					content: '当前客服处于离线状态，不能接入用户',
				});
			}
		},
		// 从历史中回调选中会话
		selectSessionFromHistory( item ){
			this.onHideHistory();
			this.selectSession(item);
		},
		// 选中会话
		selectSession(item){
			this.currSessionId = item.id;

			// 把内容参数传递到对话框组件
			this.$store.commit('setSelectedCsSession', item);

			// 把未读红点设为 0
			item.get_user_content_count = 0;

			this.$util.title('客服会话');
		},
		// 快速关闭会话
		closeSession( item ){
			// 发送关闭会话
			this.$ajax.post(this.$api.csCloseSession, {
				session_id: item.id,
			})
			.then((response) => {
				var res = response.data;
				if (res.code) {
					// 触发刷新已接入的会话列表
					this.$store.commit('setJoinedSession', (new Date()).valueOf());
				}
			});
		},
		// 查看历史按钮
		onShowHistory(){
			this.showHistoryBox = true;
			this.$refs['cs-user-history'].initData();
		},
		// 关闭历史按钮
		onHideHistory(){
			// 关闭遮罩层
			this.$store.commit('setCsMaskCode', 0);

			this.showHistoryBox = false;
		},
		// 走马灯的形式设置浏览器的title
		setBrowserTitle( time = 0 ){
			setTimeout( () => {
				time++;
				if (time % 2 == 0) {
					this.$util.title('【新消息】');
				}
				else {
					this.$util.title('【'+(this.unReadUserCount>0?this.unReadUserCount:'')+'未读】');
				}

				if( time < 16 ){
					this.setBrowserTitle( time );
				}
			}, 200);
		}
	},
	watch:{
		'$store.state.app.waitingSession' ( to ){
			// 刷新等待加入的用户列表
			this.waitingSessionList();
		},
		'$store.state.app.joinedSession' ( to ){
			// 刷新已接入的用户列表
			this.joinedSessionList();
		},
		'$store.state.app.csIsRead' ( to ) {
			if( this.unReadUserCount > 0 ){
				this.unReadUserCount --;
			}
			else{
				this.$util.title('客服会话');
			}
		},
		'$store.state.app.csHideHistory' ( to ){
			this.onHideHistory();
		},
		'$store.state.app.csUpdateUserContent' ( to ){
			// 设置浏览器 title，让它闪烁
			this.setBrowserTitle();

			// 更新列表中，某个会话的内容
			for(var i in this.myList ){
				if( this.myList[i].id == to.session_id ){
					// 把未读红点设为 0
					this.$set(this.myList[i].get_user_content_once, 'content_search', to.content_search);
					break;
				}
			}
		},
    'info' ( to ){
    	if( to != null
    	&& typeof( to.worker) != 'undefined' 
    	&& to.worker.get_group != null 
    	&& to.worker.get_group.can_join === 0
    	){
    		this.showWaitingList = false;
    	}
    }
	},
}
</script>
