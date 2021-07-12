<style lang="less">
</style>

<template>
	<div>
		<!--数据渲染组件池-->
		<div v-for="(item,index) in dataList" :key="item.module_id" 
		:class="'com-item '+ ( item.selected === true ? 'selected' : '' )"
		:style="getCompStyle(item.setting)">

			<!--图片广告显示组件-->
			<imageAdView v-if=" item.code == 'imageAd' " :currIndex="index" :inTab="true"></imageAdView>

			<!--商品列表显示组件-->
			<goodsListView v-else-if=" item.code == 'goodsList' " :currIndex="index" :inTab="true"></goodsListView>

			<!--标题文字显示组件-->
			<textView v-else-if=" item.code == 'text' " :currIndex="index" :inTab="true"></textView>

			<!--富文本显示组件-->
			<richTextView v-else-if=" item.code == 'richText' " :currIndex="index" :inTab="true"></richTextView>

			<!--视频组件-->
			<videoView v-else-if=" item.code == 'video' " :currIndex="index" :inTab="true" :inLeft="inLeft"></videoView>

			<!--公告组件-->
			<textScrollView v-else-if=" item.code == 'textScroll' " :currIndex="index" :inTab="true"></textScrollView>

			<!--图文导航组件-->
			<imageTextNavigateView v-else-if=" item.code == 'imageTextNavigate' " :currIndex="index" :inTab="true"></imageTextNavigateView>

			<!--【tab导航组件】-->
			<tabNavigateView v-else-if=" item.code == 'tabNavigate' " :currIndex="index" :inTab="true"></tabNavigateView>

			<!--积分兑换活动组件-->
			<integralSaleView v-else-if=" item.code == 'integralSale' " :currIndex="index" :inTab="true"></integralSaleView>

			<!--拼团组件-->
			<pinSaleView v-else-if=" item.code == 'pinSale' " :currIndex="index" :inTab="true"></pinSaleView>

			<!--预售组件-->
			<preSaleView v-else-if=" item.code == 'preSale' " :currIndex="index" :inTab="true"></preSaleView>

			<!--砍价组件-->
			<kanSaleView v-else-if=" item.code == 'kanSale' " :currIndex="index" :inTab="true"></kanSaleView>

			<!--秒杀组件-->
			<secKillView v-else-if=" item.code == 'secKill' " :currIndex="index" :inTab="true"></secKillView>

			<!--限时特惠-->
			<limitTimeSaleView v-else-if=" item.code == 'limitTimeSale' " :currIndex="index" :inTab="true"></limitTimeSaleView>

			<!--搭配套餐-->
			<packageSaleView v-else-if=" item.code == 'packageSale' " :currIndex="index" :inTab="true"></packageSaleView>

		</div>

		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>

<script>
	/**
	 * 组件池，只用于内嵌的tab 页面的预览
	 */
	import imageAdView from "./image-ad-view";
	import textView from "./text-view";
	import richTextView from "./rich-text-view";
	import goodsListView from "./goods-list-view";
	import videoView from "./video-view";
	import textScrollView from "./text-scroll-view";
	import tabNavigateView from "./tab-navigate-view";
	import pinSaleView from "./activity-widget/pinSale-view";
	import preSaleView from "./activity-widget/preSale-view";
	import kanSaleView from "./activity-widget/kanSale-view";
	import secKillView from "./activity-widget/secKill-view";
	import limitTimeSaleView from "./activity-widget/limitTimeSale-view";
	import packageSaleView from "./activity-widget/packageSale-view";
	import imageTextNavigateView from "./image-text-navigate-view";
	import integralSaleView from "./activity-widget/integralSale-view";


	export default {
		name: 'widgetPool',
		components: {
			imageAdView,
			textView,
			richTextView,
			goodsListView,
			videoView,
			textScrollView,
			tabNavigateView,
			pinSaleView,
			preSaleView,
			kanSaleView,
			secKillView,
			limitTimeSaleView,
			packageSaleView,
			integralSaleView,
			imageTextNavigateView,
		},
		props: {
			// 表示tab 在左边
			inLeft: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				dataList: [],

				spinShow: false,
			}
		},
		methods: {
			// 初始化组件，只提供给父组件调用
			initData(pageId) {
				this.spinShow = true;

				// ajax 请求获取数据，获取的是当前tab 页面的组件信息
				this.$ajax.post( this.$route.fullPath.indexOf('cloud-shop') != -1 ? this.$api.cloudGoodsPageInfo : this.$api.goodsPageInfo, {
						page_id: pageId,
						goods_id: 0,
					})
					.then((response) => {
						this.spinShow = false;
						var res = response.data;
						if (res.code) {
							this.dataList = [];
							this.dataList = res.data.info.customer_pages_modules;
							this.$store.commit('setTabPageCompList', res.data.info.customer_pages_modules);
						}
					});
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
					};
				} else {
					return {};
				}
			},
		},
	}
</script>
