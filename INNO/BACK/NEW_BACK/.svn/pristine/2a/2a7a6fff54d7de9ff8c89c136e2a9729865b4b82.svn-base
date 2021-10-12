<style lang="less">
	.goods-editor-body{

	.view-box{
		width:375px;
		background: #fff;
		margin:30px auto;

		.view-header{
			background: url('~@rs/images/page-editor-header.png') top center no-repeat;
			background-size: 100% auto;
			height:64px;
		}
		.view-body{
			position: relative;

			.draggable-box{
				padding-bottom:100px;
				min-height:430px;
			}

			.com-item{
				position: relative;
				// width: 100%;
				min-height: 50px;

				&:hover::before{
					content: '';
					display:block;
					position: absolute;
					width: 100%;
					height: 100%;
					left: 0px;
					top: 0;
					-moz-box-sizing: border-box;
					box-sizing: border-box;
					border: 1px dotted #155bd4;
					z-index: 10;
					cursor: move;
				}

				&.selected::before{
					content: '';
					display:block;
					position: absolute;
					width: 100%;
					height: 100%;
					left: 0px;
					top: 0;
					-moz-box-sizing: border-box;
					box-sizing: border-box;
					border: 2px solid #2d8cf0;
					z-index: 10;
					cursor: move;
				}

				&:hover{
					.com-tips{
						.txt{
							display:none;
						}
						.close{
							display:block;
						}
					}
				}
				.com-tips{
					position:absolute;
					right:-75px;
					top:0;
					font-size:12px;
					background:#fff;
					box-shadow: 0 0 4px 0 rgba(10,42,97,.2);
					padding:5px 10px;
					width:70px;
					text-align: center;

					.arrow-out{
						width: 0;
						height: 0;
						border-width: 5px;
						border-style: solid;
						border-color: transparent #fff transparent transparent;
						position: absolute;
						top: 7px;
						left: -10px;
					}
					.close{
						font-size:18px;
						display:none;
						cursor: pointer;
					}
				}
			}

		}

		.ghost {
			opacity: 0.5;
			background: #ddd;
		}
	}

	/*拖动时候左侧组件的样式*/
	.left-com-item{
		opacity: 0.9;
		background: #ed4014;
		text-align: center;
		color:#fff;
		padding:15px;
		&::before{
			border:1px dotted #fff;
		}

		.icon{
			display:none;
		}
	}

  .plugins-empty-tips{
  	text-align: center;
  	padding:20px 0;
    position:absolute;
    left:0;
    top:0;
    width:375px;
  }
}
</style>

<template>
	<div class="goods-editor-body" :style="{height: ( height - (pageType =='goods' ? 70: 0) ) +'px'}">

		<vue-scroll ref="vue-scroll" :ops="scrollOptions">
			<div class="view-box">
				<div class="view-header" v-if="pageType != 'lottery'"></div>
				<div class="view-body" :style="getPageStyle">
					<div v-if="dataList.length == 0" class="plugins-empty-tips">
						请拖拽左边的组件到此区域进行创建
					</div>
					<pageSettingLotteryBody></pageSettingLotteryBody>
					<draggable class="draggable-box" ghost-class="ghost" :list="dataList" :group="{name:'itemBox'}" v-bind="dragOptions"
					 @start="dragStart" @end="dragEnd" @change="dragChange" :disabled="pageType == 'lottery'">

						<!--数据渲染组件池-->
						<div v-for="(item,index) in dataList" :key="t+'|'+index" :class="'com-item '+ ( item.selected === true ? 'selected' : '' )"
						 :style="getCompStyle(item.setting)" @click="itemChange(index, true)">

							<!--组件tips-->
							<div class="com-tips">
								<span class="arrow-out"></span>
								<span class="txt">
									<template v-if="item.code == null || typeof( componentsList[item.code] ) == 'undefined'">未知组件</template>
									<template v-else>
									{{componentsList[item.code]}}
									<span v-if="item.setting != null && item.setting.widgetRemark != null && item.setting.widgetRemark != ''" style="display: block;">
										{{ '备注：'+item.setting.widgetRemark }}
									</span>
									
									</template>
								</span>

								<template v-if="item.can_remove == null || item.can_remove == 1">
									<Poptip confirm placement="top-end" style="float:right;text-align: left;" title="确定删除吗？" @on-ok="removeComp(index)">
										<Icon class="close" type="md-trash" style="width:48px;"></Icon>
									</Poptip>
								</template>
								<template v-else>
									<span class="close" style="font-size: 12px;">不可移除</span>
								</template>
							</div>

							<!--图片广告显示组件-->
							<imageAdView v-if=" item.code == 'imageAd' " :currIndex="index"></imageAdView>
							
							<!--用户卡片-->
							<userCardView v-else-if=" item.code == 'userCard' " :currIndex="index"></userCardView>
							
							<!--标题文字显示组件-->
							<textView v-else-if=" item.code == 'text' " :currIndex="index"></textView>

							<!--富文本显示组件-->
							<richTextView v-else-if=" item.code == 'richText' " :currIndex="index"></richTextView>

							<!--商品列表显示组件-->
							<goodsListView v-else-if=" item.code == 'goodsList' " :currIndex="index"></goodsListView>

							<!--视频组件-->
							<videoView v-else-if=" item.code == 'video' " :currIndex="index"></videoView>

							<!--公告组件-->
							<textScrollView v-else-if=" item.code == 'textScroll' " :currIndex="index"></textScrollView>

							<!--客服组件-->
							<customerServiceView v-else-if=" item.code == 'customerService' " :currIndex="index"></customerServiceView>

							<!--图文导航组件-->
							<imageTextNavigateView v-else-if=" item.code == 'imageTextNavigate' " :currIndex="index"></imageTextNavigateView>

							<!--【Tab导航组件】-->
							<tabNavigateView v-else-if=" item.code == 'tabNavigate' " :currIndex="index"></tabNavigateView>

							<!--积分兑换活动组件-->
							<integralSaleView v-else-if=" item.code == 'integralSale' " :currIndex="index"></integralSaleView>

							<!--拼团组件-->
							<pinSaleView v-else-if=" item.code == 'pinSale' " :currIndex="index"></pinSaleView>

							<!--预售组件-->
							<preSaleView v-else-if=" item.code == 'preSale' " :currIndex="index"></preSaleView>

							<!--砍价组件-->
							<kanSaleView v-else-if=" item.code == 'kanSale' " :currIndex="index"></kanSaleView>

							<!--秒杀组件-->
							<secKillView v-else-if=" item.code == 'secKill' " :currIndex="index"></secKillView>

							<!--限时特惠-->
							<limitTimeSaleView v-else-if=" item.code == 'limitTimeSale' " :currIndex="index"></limitTimeSaleView>

							<!--搭配套餐-->
							<packageSaleView v-else-if=" item.code == 'packageSale' " :currIndex="index"></packageSaleView>

							<!--订单条（个人中心用）-->
							<orderBarView v-else-if=" item.code == 'orderBar' " :currIndex="index"></orderBarView>

							<!--资产条（个人中心用）-->
							<assetsBarView v-else-if=" item.code == 'assetsBar' " :currIndex="index"></assetsBarView>
							
							<!--签到（个人中心用）-->
							<ucSignView v-else-if=" item.code == 'ucSign' " :currIndex="index"></ucSignView>
							
							<!--N单有礼（个人中心用）-->
							<ucGiftView v-else-if=" item.code == 'ucGift' " :currIndex="index"></ucGiftView>
							
							<!--用户头部（个人中心用）-->
							<userCenterHeaderView v-else-if=" item.code == 'userCenterHeader' " :currIndex="index" :pageType="pageType"></userCenterHeaderView>

							<!--会员服务（个人中心用）-->
							<userServiceView v-else-if=" item.code == 'userService' " :currIndex="index"></userServiceView>

							<!--导购服务（个人中心用）-->
							<staffServiceView v-else-if=" item.code == 'staffService' " :currIndex="index"></staffServiceView>
							
							<!--营销logo（营销活动用）-->
							<lotteryLogo v-else-if=" item.code == 'lotteryLogo' " :currIndex="index"></lotteryLogo>
							
							<!--营销奖项列表（营销活动用）-->
							<lotteryWinningList v-else-if=" item.code == 'winningList' " :currIndex="index"></lotteryWinningList>
							
							<!--翻翻看（营销活动用）-->
							<flipCard v-else-if=" item.code == 'flipCard' " :currIndex="index"></flipCard>
							
							<!--水果机（营销活动用）-->
							<fruitLottery v-else-if=" item.code == 'fruitLottery' " :currIndex="index"></fruitLottery>
							
							<!--大转盘（营销活动用）-->
							<bigWheel v-else-if=" item.code == 'bigWheel' " :currIndex="index"></bigWheel>
							
							<!--砸金蛋（营销活动用）-->
							<goldenEggs v-else-if=" item.code == 'goldenEggs' " :currIndex="index"></goldenEggs>
							
							<!--矩阵主体（矩阵营销活动用）-->
							<matrixMain v-else-if=" item.code == 'matrixMain' " :currIndex="index"></matrixMain>
							
							<!--参与矩阵（矩阵营销活动用）-->
							<matrixActive v-else-if=" item.code == 'matrixActive' " :currIndex="index"></matrixActive>
							
							<!--矩阵奖品池（矩阵营销活动用）-->
							<matrixPrizes v-else-if=" item.code == 'matrixPrizes' " :currIndex="index"></matrixPrizes>
							
							<!--矩阵任务（矩阵营销活动用）-->
							<matrixTasks v-else-if=" item.code == 'matrixTasks' " :currIndex="index"></matrixTasks>
						</div>

					</draggable>
				</div>
			</div>
		</vue-scroll>
	</div>
</template>

<script>
	/**
	 * 商品页面编辑器 - 主内容
	 */
	import draggable from 'vuedraggable';
	import imageAdView from './widgets/image-ad-view';
	import userCardView from './widgets/user-card-view';
	import textView from './widgets/text-view';
	import richTextView from './widgets/rich-text-view';
	import goodsListView from "./widgets/goods-list-view";
	import videoView from './widgets/video-view';
	import textScrollView from "./widgets/text-scroll-view";
	import customerServiceView from "./widgets/customer-service-view";
	import imageTextNavigateView from "./widgets/image-text-navigate-view";
	import orderBarView from './widgets/order-bar-view';
	import assetsBarView from './widgets/assets-bar-view';
	import ucSignView from './widgets/uc-sign-view';
	import ucGiftView from './widgets/uc-gift-view';
	import userCenterHeaderView from './widgets/user-center-header-view';
	import userServiceView from './widgets/user-service-view';
	import staffServiceView from './widgets/staff-service-view';
	import tabNavigateView from "./widgets/tab-navigate-view";
	import pinSaleView from "./widgets/activity-widget/pinSale-view";
	import preSaleView from "./widgets/activity-widget/preSale-view";
	import kanSaleView from "./widgets/activity-widget/kanSale-view";
	import secKillView from "./widgets/activity-widget/secKill-view";
	import limitTimeSaleView from "./widgets/activity-widget/limitTimeSale-view";
	import packageSaleView from "./widgets/activity-widget/packageSale-view";
	import integralSaleView from "./widgets/activity-widget/integralSale-view";
	//营销组件
	import lotteryLogo from './widgets/lottery-widget/logo-view';
	import lotteryWinningList from './widgets/lottery-widget/winning-list-view';
	import flipCard from './widgets/lottery-widget/flip-card-view';
	import bigWheel from './widgets/lottery-widget/big-wheel-view';
	import fruitLottery from './widgets/lottery-widget/fruit-lottery-view';
	import goldenEggs from './widgets/lottery-widget/golden-eggs-view';
	//矩阵营销组件
	import matrixMain from './widgets/lottery-widget/matrix-main-view.vue';
	import matrixActive from './widgets/lottery-widget/matrix-active-view.vue';
	import matrixPrizes from './widgets/lottery-widget/matrix-prizes-view.vue';
	import matrixTasks from './widgets/lottery-widget/matrix-tasks-view.vue';
	//页面配置
	import pageSettingLotteryBody from './widgets/page-setting-lottery-body.vue';

	export default {
		name: 'editorBody',
		components: {
			draggable,
			imageAdView,
			userCardView,
			textView,
			richTextView,
			goodsListView,
			videoView,
			textScrollView,
			orderBarView,
			assetsBarView,
			ucSignView,
			ucGiftView,
			userCenterHeaderView,
			userServiceView,
			staffServiceView,
			tabNavigateView,
			pinSaleView,
			preSaleView,
			kanSaleView,
			secKillView,
			limitTimeSaleView,
			packageSaleView,
			integralSaleView,
			customerServiceView,
			imageTextNavigateView,
			//
			lotteryLogo,
			lotteryWinningList,
			flipCard,
			bigWheel,
			fruitLottery,
			goldenEggs,
			//
			matrixMain,
			matrixActive,
			matrixPrizes,
			matrixTasks,
			//
			pageSettingLotteryBody
		},
		props: {
			height: {
				type: Number,
				default: 500
			},
			// 当前编辑器是否作为内嵌编辑器使用
			pageType: {
				type: String,
				default: 'page'
			}
		},
		data() {
			return {
				
				dataList: [],
				componentsList: {},
				pageInfo: {},
				pageSetting: {},
				drag: false,
				// 当前选中的index
				currSelectIndex: 0,

				// t 很重要，是强制要求位置变化的时候，重新渲染组件(这里有很大性能开销，已经关闭)
				t: 0,

				// 虚拟滚动条
				scrollOptions: {
					mode: 'native',
					bar: {
						keepShow: false,
						background: '#c8c8c8',
						size: '5px'
					},
					// 滚动轨道
					rail: {
						size: '3px'
					},
					scrollPanel: {
						scrollingX: false
					}
				}
			}
		},
		computed: {
			dragOptions() {
				return {
					animation: 200,
					group: 'description',
					disabled: false,
					ghostClass: 'ghost'
				};
			},
			// 页面背景设置
			getPageStyle() {
				if (typeof(this.pageInfo.setting) != 'undefined' && typeof(this.pageInfo.setting.backgroundColor) != 'undefined') {
					return {
						'background-color': this.pageInfo.setting.backgroundColor,
						'background-image': "url(" + this.pageInfo.setting.backgroundImage + ")",
						'background-repeat': "no-repeat",
						'background-size': "100% auto",
						'background-position': "center " + this.pageInfo.setting.backgroundPosition,
					};
				} else {
					return {};
				}
			},
		},
		methods: {
			/**
			 * @desc 初始化方法
			 */
			init() {
				this.dataList = this.$store.state.app.pageCompList;
				this.pageInfo = this.$store.state.app.pageInfo;
				// 如果只有一个组件的，默认选中
				if (this.dataList.length == 1) {
					this.$nextTick(() => {
						this.itemChange(0, true);
					});
				}
			},
			initData(componentsList) {
				for (var i in componentsList) {
					this.componentsList[componentsList[i].code] = componentsList[i].name;
				}
			},
			// 获取组件背景设置
			getCompStyle(item) {
				if (item != null) {
					return {
						'background-color': item.backgroundColor,
						'background-image': "url(" + item.backgroundImage + ")",
						'background-repeat': "no-repeat",
						'background-size': "100% auto",
						'background-position': "center " + item.backgroundPosition,
						'margin-top': item.marginTop + "px",
						'margin-bottom': item.marginBottom + "px",
						'margin-left': item.marginLeftRight + "px",
						'margin-right': item.marginLeftRight + "px",
						'padding-left': item.paddingLeftRight + "px",
						'padding-right': item.paddingLeftRight + "px",
						'padding-top': item.paddingTop + "px",
						'padding-bottom': item.paddingBottom + "px",
						'opacity': (typeof(item.is_enable) == "undefined" || item.is_enable) ? 1 : 0.4
					};
				} else {
					return {};
				}
			},
			// item 变化事件
			itemChange(index, isClick = false) {
				// 把旧的取消
				for (var i in this.dataList) {
					this.$set(this.dataList[i], 'selected', false);
				}

				// 新的增加
				this.currSelectIndex = index;
				this.$set(this.dataList[index], 'selected', true);

				// 更新store 信息
				this.$store.commit('setPageCompList', this.dataList);

				if (isClick) {
					// 子项的变化不会触发 setPageCompList，所有这里做一个子项变化的开关
					this.$store.commit('setPageCompItemChange', true);
				}
			},
			// 拖动事件
			dragChange(e) {
				if (typeof(e.added) !== 'undefined') {
					// 添加item 处理
					this.itemChange(e.added.newIndex);
					this.t = (new Date()).valueOf();
				}
			},
			// 拖动开始
			dragStart(e) {
				// 拖动开始，获取焦点
				this.itemChange(e.oldIndex);

				this.drag = true;
			},
			// 拖动结束
			dragEnd(e) {
				// 更新选中的焦点框
				this.currSelectIndex = e.newIndex;
				this.t = (new Date()).valueOf();
				this.drag = false;
			},
			// 删除组件
			removeComp(index) {
				this.$delete(this.dataList, index);
				this.t = (new Date()).valueOf();
			}
		},
		watch: {
			// 观察 list 的变化
			'$store.state.app.pageCompList'(to) {
				this.init();
				this.t = (new Date()).valueOf();
			}
		},
		mounted() {
			this.init();
		},

	};
</script>
