<style lang="less">
.cs-session{
	.ivu-card-body{
		padding: 0;
	}

	.ivu-card-bordered{
		border-radius: 0;
	}
	.ivu-card-head{
		padding:11px 16px 9px 16px;
		border-top:4px solid #eee;

		p{
			font-size: 14px;
		}
	}
	.ivu-card-extra{
		font-size:13px;
		top:12px;
	}
}
</style>

<template>
	<div class="cs-session">
		<div class="uflex">
			<div style="flex:1 1 0%;">
				<Card dis-hover style="height:100%;">
					<Alert v-if="showError" type="error" show-icon>
						<span v-if=" Number( wsErrorStatus ) == 431">账号异地登录，被强制退出</span>
						<span v-else>连接已断开，正在重连，请稍候...<a @click="reloadPage">重连</a></span>
					</Alert>

					<div class="uflex">
						<div style="width:250px;">
							<!--接入的用户列表-->
							<csUserListBox ref="cs-user-list-box" :boxHeight="boxHeight" :info="info"></csUserListBox>
						</div>
						<div style="flex: 1 1 0%;">
							<!--聊天窗口-->
							<csUserTalkBox ref="cs-user-talk-box" :info="info"
							@on-goods="showGoodsInfo"
							@on-order="showOrderInfo"
							@on-order-exchange="showOrderExchangeInfo"
							@on-clear="clearAllInfoBox"></csUserTalkBox>
						</div>
					</div>

				</Card>
			</div>
			<div :style="{width:'260px','margin-left':'8px',height:boxHeight+'px', 'background-color':'#fff'}">
				<vue-scroll ref="vue-scroll" :ops="scrollOptions">
					<!--属性栏-->
					<div :style="{'min-height':boxHeight+'px'}">

						<Tabs value="userInfo" v-show="sessInfo.get_user_info != null" :animated="false">
							<TabPane name="userInfo" label="会员详情">
								<!--用户信息栏-->
								<csUserInfoBox></csUserInfoBox>
							</TabPane>
							<TabPane name="csFeedback" label="工单">
								<!--工单栏-->
								<csFeedbackBox></csFeedbackBox>
							</TabPane>
							<TabPane name="csTags" label="标签">
								<!--客服打标签组件-->
								<csTagsBox></csTagsBox>
							</TabPane>
						</Tabs>

						<!--商品信息栏-->
						<csGoodsBox ref="cs-goods-box"></csGoodsBox>
						<!--订单信息栏-->
						<csOrderInfoBox ref="cs-orders-box"></csOrderInfoBox>
						<!--退单信息栏-->
						<csOrdersExchangeBox ref="cs-orders-exchange-box"></csOrdersExchangeBox>

						<Tabs v-show="sessInfo.get_user_info != null" value="orderList" :animated="false" style="border-top:5px solid #eee;">
							<TabPane name="orderList" label="关联订单">
								<!--订单列表栏-->
								<csOrderListBox></csOrderListBox>
							</TabPane>
							<TabPane name="orderExchange" label="关联退单">
								<!--退单列表-->
								<csOrderExchangeList></csOrderExchangeList>
							</TabPane>
						</Tabs>
					</div>
				</vue-scroll>
			</div>
		</div>

		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow" style="z-index:1000"></Spin>
	</div>
</template>

<script>
import csUserListBox from './cs-user-list-box';
import csUserTalkBox from './cs-user-talk-box';
import csUserInfoBox from './cs-user-info-box';
import csGoodsBox from './cs-goods-box';
import csOrderInfoBox from './cs-orders-box';
import csOrderListBox from './cs-orders-list-box';
import csOrderExchangeList from './cs-orders-exchange-list';
import csFeedbackBox from './cs-feedback-box';
import csTagsBox from './cs-tags-box';
import csOrdersExchangeBox from './cs-orders-exchange-box';

/**
 * 客服会话
 */
export default {
	name: 'csSessionPage',
    components: {
		csUserListBox,
		csUserTalkBox,
		csUserInfoBox,
		csGoodsBox,
		csOrderInfoBox,
		csOrderListBox,
		csOrderExchangeList,
		csOrdersExchangeBox,
		csFeedbackBox,
		csTagsBox,
	},
	data () {
	    return {
			boxHeight:500,
			spinShow: false,

			showError: false,
			wsErrorStatus: 0,

			// admin info
			info: null,

			// 会话详情
			sessInfo:{
				get_user_info: null
			},

			// 虚拟滚动条
			scrollOptions:{
				mode: 'native',
				bar:{
					keepShow: false,
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
	created() {

	},
	methods: {
		// 初始化方法
	    init () {
			// 计算整体的高度
			this.boxHeight = document.body.clientHeight - 80;

			this.initData();
		},
		initData(){
			if( this.info == null ){
				// ajax 请求获取数据，初始化客服会话
				this.$ajax.post( this.$api.csInitSession, {

				})
				.then( (response) => {
					this.spinShow = false;
					var res = response.data;
					if( res.code ){
						this.info = res.data;

						// 把worker_id 写入到 storage
						this.$util.cache.set('cs_worker_id', this.info.worker.id );
            this.$util.cache.set('is_erp_point', this.info.isErpPoint );

						// 加载一下等待接入和已经接入列表
						this.$refs['cs-user-list-box'].initData();
					}
					else{
						this.spinShow = true;
					}
				});
			}
			else{
				// 加载一下等待接入和已经接入列表
				this.$refs['cs-user-list-box'].initData();
			}
		},
		showGoodsInfo( card ){
			this.$refs['cs-goods-box'].openModal( card );
			this.$refs['cs-orders-box'].closeModal();
			this.$refs['cs-orders-exchange-box'].closeModal();
		},
		showOrderInfo( card ){
			this.$refs['cs-orders-box'].openModal( card );
			this.$refs['cs-goods-box'].closeModal();
			this.$refs['cs-orders-exchange-box'].closeModal();
		},
		showOrderExchangeInfo( card ){
		  this.$refs['cs-orders-exchange-box'].openModal( card );
		  this.$refs['cs-orders-box'].closeModal();
		  this.$refs['cs-goods-box'].closeModal();
		},
		clearAllInfoBox( obj ){
			this.$refs['cs-orders-box'].closeModal();
			this.$refs['cs-goods-box'].closeModal();
			this.$refs['cs-orders-exchange-box'].closeModal();
		},
		reloadPage(){
		  window.location.reload();
		}
	},
	watch: {
		// 监听websocket 状态
		'$store.state.app.csWebsocketStatus' ( to ){
			if( to != 1 ){
				this.wsErrorStatus = to;
				this.showError = true;
			}
			else{
				this.showError = false;
			}
		},
		// 选中某个会员会话
		'$store.state.app.selectedCsSession' ( to ){
			this.sessInfo = to;
		}
	},
	mounted () {
	    this.init();

		// 缓存页面
		this.$store.commit('setCachePage', 'csSessionPage');
	},
	// 缓存后才有的生命周期
	activated(){
		this.initData();
	}
}
</script>
