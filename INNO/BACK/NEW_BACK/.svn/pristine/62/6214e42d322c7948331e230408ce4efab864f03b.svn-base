<style lang="less">
	.page-editor-right-side{
	padding:10px 0px 0 5px;

	.draggable-box{
		padding-top:20px;
		min-height:170px;
	}
	.com-item{
		box-shadow: 0 0 4px 0 rgba(10,42,97,.2);
		border-radius: 2px;
		background-color: #fff;
		margin:10px;
		padding:5px;

		.handle_r{
			font-size:20px;
			color:#ccc;
			cursor: move;
			margin-top:2px;
		}
		.close{
			font-size:20px;
			color:#ccc;
			float:right;
			cursor: pointer;
			margin-top:2px;
		}
	}
	.clear-all{
		float:right;
		height:30px;
		line-height:30px;
		margin-right: 10px;
		cursor: pointer;
	}
	.ghost {
		opacity: 0.5;
		background: #ddd;
	}
}
</style>

<template>
	<div class="page-editor-right-side">
		<Tabs :value="currTabName" type="card" :animated="false" @on-click="onTabsClick">

			<TabPane name="CURR_COMPONENT" label="组件" :style="getPanelStyle">
				<vue-scroll ref="vue-scroll" :ops="scrollOptions">
					<!--组件表单池-->
					<!--广告图片表单-->
					<imageAdForm v-if=" currSelectCode == 'imageAd' " :currIndex="currSelectIndex"></imageAdForm>
					
					<!--用户卡片-->
					<userCardForm v-else-if=" currSelectCode == 'userCard' " :currIndex="currSelectIndex"></userCardForm>
					
					<!--商品列表单-->
					<goodsListForm v-else-if=" currSelectCode == 'goodsList' " :currIndex="currSelectIndex"></goodsListForm>

					<!--富文本表单-->
					<richTextForm v-else-if=" currSelectCode == 'richText' " :currIndex="currSelectIndex"></richTextForm>

					<!--文本标题表单-->
					<textForm v-else-if=" currSelectCode == 'text' " :currIndex="currSelectIndex"></textForm>

					<!--视频表单-->
					<videoForm v-else-if=" currSelectCode == 'video' " :currIndex="currSelectIndex"></videoForm>

					<!--公告组件-->
					<textScrollForm v-else-if=" currSelectCode == 'textScroll' " :currIndex="currSelectIndex"></textScrollForm>

					<!--客服组件-->
					<customerServiceForm v-else-if=" currSelectCode == 'customerService' " :currIndex="currSelectIndex"></customerServiceForm>

					<!--图文导航组件-->
					<imageTextNavigateForm v-else-if=" currSelectCode == 'imageTextNavigate' " :currIndex="currSelectIndex"></imageTextNavigateForm>

					<!--顶部导航组件-->
					<tabNavigateForm v-else-if=" currSelectCode == 'tabNavigate' " :currIndex="currSelectIndex"></tabNavigateForm>

					<!--积分兑换活动组件-->
					<integralSaleForm v-else-if=" currSelectCode == 'integralSale' " :currIndex="currSelectIndex"></integralSaleForm>

					<!--拼团组件-->
					<pinSaleForm v-else-if=" currSelectCode == 'pinSale' " :currIndex="currSelectIndex"></pinSaleForm>

					<!--预售组件-->
					<preSaleForm v-else-if=" currSelectCode == 'preSale' " :currIndex="currSelectIndex"></preSaleForm>

					<!--砍价组件-->
					<kanSaleForm v-else-if=" currSelectCode == 'kanSale' " :currIndex="currSelectIndex"></kanSaleForm>

					<!--秒杀组件-->
					<secKillForm v-else-if=" currSelectCode == 'secKill' " :currIndex="currSelectIndex"></secKillForm>

					<!--秒杀组件-->
					<limitTimeSaleForm v-else-if=" currSelectCode == 'limitTimeSale' " :currIndex="currSelectIndex"></limitTimeSaleForm>

					<!--搭配套餐组件-->
					<packageSaleForm v-else-if=" currSelectCode == 'packageSale' " :currIndex="currSelectIndex"></packageSaleForm>

					<!--订单条（个人中心用）-->
					<orderBarForm v-else-if=" currSelectCode == 'orderBar' " :currIndex="currSelectIndex"></orderBarForm>

					<!--资产条（个人中心用）-->
					<assetsBarForm v-else-if=" currSelectCode == 'assetsBar' " :currIndex="currSelectIndex"></assetsBarForm>
					
					<!--签到（个人中心用）-->
					<ucSignForm v-else-if=" currSelectCode == 'ucSign' " :currIndex="currSelectIndex"></ucSignForm>
					
					<!--N单有礼（个人中心用）-->
					<ucGiftForm v-else-if=" currSelectCode == 'ucGift' " :currIndex="currSelectIndex"></ucGiftForm>
					
					<!--用户中心头部（个人中心用）-->
					<userCenterHeaderForm v-else-if=" currSelectCode == 'userCenterHeader' " :currIndex="currSelectIndex"></userCenterHeaderForm>

					<!--会员服务（个人中心用）-->
					<userServiceForm v-else-if=" currSelectCode == 'userService' " :currIndex="currSelectIndex"></userServiceForm>

					<!--导购服务（个人中心用）-->
					<staffServiceForm v-else-if=" currSelectCode == 'staffService' " :currIndex="currSelectIndex"></staffServiceForm>
					
					<!--logo（营销组件用）-->
					<lotteryLogoForm v-else-if=" currSelectCode == 'lotteryLogo' " :currIndex="currSelectIndex"></lotteryLogoForm>
					
					<!--中奖名单列表（营销组件用）-->
					<lotteryWinningListForm v-else-if=" currSelectCode == 'winningList' " :currIndex="currSelectIndex"></lotteryWinningListForm>
					
					<!--翻翻看（营销组件用）-->
					<flipCardForm v-else-if=" currSelectCode == 'flipCard' " :currIndex="currSelectIndex"></flipCardForm>
					
					<!--水果机（营销组件用）-->
					<fruitLotteryForm v-else-if=" currSelectCode == 'fruitLottery' " :currIndex="currSelectIndex"></fruitLotteryForm>
					
					<!--大转盘（营销组件用）-->
					<bigWheelForm v-else-if=" currSelectCode == 'bigWheel' " :currIndex="currSelectIndex"></bigWheelForm>
					
					<!--砸金蛋（营销组件用）-->
					<goldenEggsForm v-else-if=" currSelectCode == 'goldenEggs' " :currIndex="currSelectIndex"></goldenEggsForm>
					
					<!--矩阵主体（矩阵营销活动用）-->
					<matrixMainForm v-else-if=" currSelectCode == 'matrixMain' " :currIndex="currSelectIndex"></matrixMainForm>
					
					<!--参与矩阵（矩阵营销活动用）-->
					<matrixActiveForm v-else-if=" currSelectCode == 'matrixActive' " :currIndex="currSelectIndex"></matrixActiveForm>
					
					<!--矩阵奖品池（矩阵营销活动用）-->
					<matrixPrizesForm v-else-if=" currSelectCode == 'matrixPrizes' " :currIndex="currSelectIndex"></matrixPrizesForm>
					
					<!--矩阵任务（矩阵营销活动用）-->
					<matrixTasksForm v-else-if=" currSelectCode == 'matrixTasks' " :currIndex="currSelectIndex"></matrixTasksForm>
					
					<!--未选中组件-->
					<div v-else style="text-align: center;padding:20px;">
						<span>请选中组件后再操作</span>
					</div>
					
					<!--组件备注功能-->
					<commonRemarkForm v-if=" currSelectCode != '' && pageType != 'goods' " :currIndex="currSelectIndex"></commonRemarkForm>
					
					<!--功能背景设置组件-->
					<backgroundForm v-if=" currSelectCode != '' && pageType != 'goods' " :currIndex="currSelectIndex"></backgroundForm>

				</vue-scroll>
			</TabPane>

			<TabPane v-if=" pageType != 'goods' && pageType != 'goodsCat' " name="COMPONENTS" label="组件管理" :style="getPanelStyle">
				<span style="margin-left:10px;">可以拖动排序组件</span>
				<div class="clear-all" v-show="dataList.length>0 && pageType == 'page' ">
					<Poptip confirm style="float:right;" title="确定清空吗？" @on-ok="removeComp('all')">
						清空组件
					</Poptip>
				</div>

				<draggable class="draggable-box" ghost-class="ghost" :list="dataList" :group="{name:'itemBox'}" handle=".handle_r"
				 v-bind="dragOptions" @start="dragStart" @end="dragEnd" @change="dragChange" :disabled="pageType == 'lottery'">

					<div v-for="(item,index) in dataList" :key="index" :class="'com-item '+ ( item.selected ? 'selected' : '' )">
						<Row>
							<Col :span="3">
							<Icon type="md-menu" class="handle_r" />
							</Col>
							<Col :span="18" style="font-size:13px;line-height:2.1;">
							{{ item.name != '' && item.name != null ? item.name : ( componentsList[item.code] ) }}
							{{ item.setting != null && item.setting.widgetRemark != '' && item.setting.widgetRemark != null ? "备注：[" + item.setting.widgetRemark + ']' : '' }}
							</Col>
							<Col :span="3">
							<Poptip confirm v-if="item.can_remove == null || item.can_remove" style="float:right;" title="确定删除吗？" @on-ok="removeComp(index)">
								<Icon type="md-trash" class="close" />
							</Poptip>
							</Col>
						</Row>
					</div>

				</draggable>

			</TabPane>

			<TabPane v-if="pageType=='page' || pageType == 'lottery' || pageType=='matrixUserCenter'" name="PAGE" label="页面设置" :style="getPanelStyle">
				<vue-scroll ref="vue-scroll" :ops="scrollOptions">
					<!--页面设置表单-->
					<pageSettingForm :catList="catList" v-if="pageType != 'lottery' && pageType != 'matrixUserCenter'"></pageSettingForm>

					<!--微信分享设置-->
					<pageSettingWeixin v-if="canWeixin"></pageSettingWeixin>
					
					<!--营销页面功能设置-->
					<pageSettingLottery v-if="pageType == 'lottery'"></pageSettingLottery>
					
					<!--页面背景设置-->
					<pageSettingBackground ></pageSettingBackground>
					
					
				</vue-scroll>
			</TabPane>
		</Tabs>
	</div>
</template>

<script>
	/**
	 * 商品页面编辑器 - 右侧栏
	 */
	import draggable from 'vuedraggable';
	import pageSettingForm from './widgets/page-setting-form';
	import pageSettingBackground from "./widgets/page-setting-background";
	import imageAdForm from './widgets/image-ad-form';
	import userCardForm from './widgets/user-card-form';
	import goodsListForm from "./widgets/goods-list-form";
	import richTextForm from './widgets/rich-text-form';
	import textForm from './widgets/text-form';
	import videoForm from './widgets/video-form';
	import textScrollForm from "./widgets/text-scroll-form";
	import orderBarForm from './widgets/order-bar-form';
	import assetsBarForm from './widgets/assets-bar-form';
	import ucSignForm from './widgets/uc-sign-form';
	import ucGiftForm from './widgets/uc-gift-form';
	import userCenterHeaderForm from './widgets/user-center-header-form';
	import userServiceForm from './widgets/user-service-form';
	import staffServiceForm from './widgets/staff-service-form';
	import backgroundForm from "./widgets/background-form";
	import commonRemarkForm from "./widgets/common-remark-form";
	import pageSettingWeixin from "./widgets/page-setting-weixin";
	import tabNavigateForm from "./widgets/tab-navigate-form";
	import pinSaleForm from "./widgets/activity-widget/pinSale-form";
	import preSaleForm from "./widgets/activity-widget/preSale-form";
	import kanSaleForm from "./widgets/activity-widget/kanSale-form";
	import secKillForm from "./widgets/activity-widget/secKill-form";
	import limitTimeSaleForm from "./widgets/activity-widget/limitTimeSale-form";
	import packageSaleForm from "./widgets/activity-widget/packageSale-form";
	import integralSaleForm from "./widgets/activity-widget/integralSale-form";
	import customerServiceForm from "./widgets/customer-service-form";
	import imageTextNavigateForm from "./widgets/image-text-navigate-form";
	//
	import lotteryLogoForm from './widgets/lottery-widget/logo-form';
	import lotteryWinningListForm from './widgets/lottery-widget/winning-list-form';
	import flipCardForm from './widgets/lottery-widget/flip-card-form';
	import bigWheelForm from './widgets/lottery-widget/big-wheel-form';
	import fruitLotteryForm from './widgets/lottery-widget/fruit-lottery-form';
	import goldenEggsForm from './widgets/lottery-widget/golden-eggs-form';
	//
	//矩阵营销组件
	import matrixMainForm from './widgets/lottery-widget/matrix-main-form.vue';
	import matrixActiveForm from './widgets/lottery-widget/matrix-active-form.vue';
	import matrixPrizesForm from './widgets/lottery-widget/matrix-prizes-form.vue';
	import matrixTasksForm from './widgets/lottery-widget/matrix-tasks-form.vue';
	//
	import pageSettingLottery from "./widgets/page-setting-lottery";

	export default {
		name: 'editorRightSide',
		components: {
			draggable,
			pageSettingForm,
			backgroundForm,
			commonRemarkForm,
			pageSettingBackground,
			pageSettingWeixin,
			imageAdForm,
			userCardForm,
			goodsListForm,
			richTextForm,
			textForm,
			videoForm,
			textScrollForm,
			orderBarForm,
			assetsBarForm,
			ucSignForm,
			ucGiftForm,
			userCenterHeaderForm,
			userServiceForm,
			staffServiceForm,
			tabNavigateForm,
			pinSaleForm,
			preSaleForm,
			kanSaleForm,
			secKillForm,
			limitTimeSaleForm,
			packageSaleForm,
			integralSaleForm,
			customerServiceForm,
			imageTextNavigateForm,
			//营销
			lotteryLogoForm,
			lotteryWinningListForm,
			flipCardForm,
			bigWheelForm,
			fruitLotteryForm,
			goldenEggsForm,
			//
			//
			matrixMainForm,
			matrixActiveForm,
			matrixPrizesForm,
			matrixTasksForm,
			pageSettingLottery
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
			},
			canWeixin: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				dataList: [],
				componentsList: {},
				catList: [],

				// 当前选中的tab
				currTabName: 'CURR_COMPONENT',

				// 当前选中的组件code
				currSelectCode: '',

				// 当前选中的index
				currSelectIndex: 0,

				drag: false,

				// 虚拟滚动条
				scrollOptions: {
					mode: 'native',
					bar: {
						keepShow: false,
						background: '#c8c8c8',
						size: '3px'
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
			getPanelStyle() {
				return {
					height: (this.height - 63) + 'px',
					overflow: 'hidden auto'
				};
			}
		},
		methods: {
			/**
			 * @desc 初始化方法
			 */
			init() {
				this.dataList = this.$store.state.app.pageCompList;

				this.currSelectCode = '';
				for (var i in this.dataList) {
					// 获取当前选中的组件
					if (this.dataList[i].selected) {
						this.currSelectCode = this.dataList[i].code;
						this.currSelectIndex = i;

						break;
					}
				}

				// 默认选中的tab
				this.$nextTick(() => {
					this.currTabName = (this.currSelectCode != '' ? 'CURR_COMPONENT' : 'PAGE');
				});
			},
			// 提供给父组件使用
			initData(componentsList, catList) {
				this.catList = catList;
				for (var i in componentsList) {
					this.componentsList[componentsList[i].code] = componentsList[i].name;
				}
			},
			// 更新焦点框
			itemBox(index) {
				// 把旧的取消
				for (var i in this.dataList) {
					this.$set(this.dataList[i], 'selected', false);
				}

				// 新的增加
				this.$set(this.dataList[index], 'selected', true);
			},
			dragChange() {

			},
			// 拖动开始
			dragStart(e) {
				this.itemBox(e.oldIndex);

				this.drag = true;
			},
			// 拖动结束
			dragEnd(e) {
				// 更新选中的焦点框
				this.currSelectIndex = e.newIndex;

				this.drag = false;
			},
			// 删除组件
			removeComp(index) {
				if (index == 'all') {
					for (var i in this.dataList) {
						this.$delete(this.dataList, i);
					}
					this.$delete(this.dataList, 0);
				} else {
					this.$delete(this.dataList, index);
				}
			},
			onTabsClick(name) {
				this.currTabName = name;
			}
		},
		watch: {
			// 观察 list 的变化
			'$store.state.app.pageCompList'(to) {
				this.init();
			},
			// 观察子项变化开关
			'$store.state.app.pageCompItemChange'(to) {
				this.init();

				setTimeout(() => {
					// 开关复位
					this.$store.commit('setPageCompItemChange', false);
				}, 500);
			}
		},
		mounted() {
			this.init();
		},

	};
</script>
