<template>
	<view class="carousel-area">
		<template v-if="showStyle < 3">
			<swiper :style="'height:'+swiperH+'px;'" class="swiper-area" :autoplay="dynamicSetting.autoPlay" :circular="true"
				:display-multiple-items="displayMultipleItems" :interval="moveTime.interval"
				:duration="moveTime.duration" easing-function="linear" :current="swiperCurrent" @change="changeSwiper">
				<swiper-item class="swiper-item" @click="jumpAction(item.link)" v-for="(item, index) in viewData.images" :key="index">
					<view class="img-item">
						<view class="img-icon-bg" :style="'background-image:url(' + item.img + ');'"></view>
						<image @load="(data)=>handleLoad(data,index)" class="img-icon" mode="widthFix" :src="item.img" />
					</view>
				</swiper-item>
			</swiper>
		</template>
		<template v-else>
			<view class="float_swiper" :current="swiperCurrent" @touchstart="swiperTouchS" @touchend="swiperTouchE">
				<view class="float_swiper_item" @click="jumpAction(item.link)" v-for="(item, index) in viewData.images" :key="index"
					:style="styleList[index].style">
					<view class="list-img">
						<image :src="item.img" mode="widthFix" class="img-item"/>
					</view>
				</view>
			</view>
		</template>
		<view class="swiper-pointers">
			<view class="pointer" :class="{'curr-pointer': pointCurrent == index}" v-for="(item, index) in viewData.images" :key="index"></view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	const pageOption = Page.BasePage({
		name: "carousel",
		props: {
			dynamicSetting: {
				type: Object,
				default: () => {}
			},
			viewData: {
				type: Object,
				default: () => {}
			}
		},
		computed: {
			showStyle() {
				let dynamicSetting = this.dynamicSetting || {};
				let showStyle = dynamicSetting.showStyle || 1;
				if (showStyle == 1) {
					this.displayMultipleItems = 1;
					this.moveTime = {
						interval: 3000,
						duration: 500
					}
				} else if (showStyle == 2) {
					let images = this.viewData.images || [];
					this.displayMultipleItems = Math.min(images.length, 5) || 1;
					this.moveTime = {
						interval: 2000,
						duration: 2000
					}
				} else {}
				return showStyle
			},
		},
		data() {
			return {
				displayMultipleItems: 1,
				moveTime: {},
				swiperCurrent: 0,
				pointCurrent: 0,
				//
				styleList: [],
				touchs: [],
				swiperTime: null,
				swiperH:0,
			}
		},
		methods: {
			changeSwiper(event){
				let {current, source} =  event.detail;
				if(current != this.pointCurrent){
					this.pointCurrent = current;
				}
			},
			swiperChangeEvent(isAdd = true) {
				let cur = this.swiperCurrent || 0;
				let dataL = this.viewData && this.viewData.images.length || 0;
				let i = isAdd ? 1 : -1;
				if (dataL > 0) {
					cur = cur + i;
					if (isAdd) {
						if (cur == dataL) {
							cur = 0;
						}
					} else {
						if (cur < 0) {
							cur = (dataL - 1);
						}
					}
					this.pointCurrent = this.swiperCurrent;
					if (cur != this.swiperCurrent) {
						this.swiperCurrent = cur;
						this.setSwiperStyle(cur, dataL);
					}
				}
			},
			setSwiperStyle(cur, dataL) {
				let styleList = [];
				for (let i = 0; i < dataL; i++) {
					let style = ""
					if (i == cur) {
						style = "z-index: 5;opacity: 1;transform:translate(-50%, -50%); scale(1);"
					} else if ((cur - 1) == i || (cur == 0 && i == (dataL - 1))) {
						style = "z-index: 3;opacity: 0.8;left:0;transform:translate(0, -50%) scale(0.8);"
					} else if ((cur + 1) == i || (cur == (dataL - 1) && i == 0)) {
						style = "z-index: 3;opacity: 0.8;left:100%;transform:translate(-100%, -50%) scale(0.8);"
					} else {
						style = "z-index: 2;opacity: 0.8;transform:translate(-50%, -50%) scale(0.8);"
					}
					styleList.push({
						style: style
					})
				}
				this.styleList = styleList;
			},
			swiperTouchS(e) {
				let changedTouches = e.changedTouches || [];
				this.touchs = this.touchs || {};
				this.touchs.x1 = changedTouches[0].clientX;
				this.touchs.y1 = changedTouches[0].clientY;
				this.swiperTime && clearTimeout(this.swiperTime);
			},
			swiperTouchE(e) {
				let changedTouches = e.changedTouches || [];
				this.touchs.x2 = changedTouches[0].clientX;
				this.touchs.y2 = changedTouches[0].clientY;
				let touchs = this.touchs || {};
				if (touchs.x1 > touchs.x2) {
					this.swiperChangeEvent();
				} else if (touchs.x1 < touchs.x2) {
					this.swiperChangeEvent(false);
				}
			},
			handleLoad(e,index){
				console.log('handleLoad',e,index);
				let winW = app.SIH.windowWidth;
				let height = e.detail.height || 0;
				let width = e.detail.width || 0;
				let viewH = ((winW / this.displayMultipleItems) * height) / width;
				this.swiperH < viewH && (this.swiperH = viewH);
			},
		}
	})
	export default pageOption;
</script>

<style lang="scss" scoped>
	.carousel-area {
		position:relative;
		.swiper-area {
			.swiper-item {
				.img-item {
					width: 100%;
					position: relative;
					.img-icon{
						opacity: 0;
						width:100%;
						height: 100%;
						position:relative;
					}
					.img-icon-bg{
						position: absolute;
						width: 200%;
						height:200%;
						top:0px;
						left:0px;
						transform: scale(0.5);
						transform-origin: top left;
						background-repeat: no-repeat;
						background-position: top left;
						background-size: 100% 100%;
					}
					// .img-icon {
					// 	width: 100%;
					// 	height: 100%;
					// 	box-sizing: border-box;
					// }
				}
			}
		}

		.float_swiper {
			width: 100%;
			height: 480rpx;
			position: relative;
		}

		.float_swiper_item {
			width: 400rpx;
			height: 90%;
			border-radius: 10rpx;
			overflow: hidden;
			box-sizing: border-box;
			padding: 10rpx;
			position: absolute;
			z-index: 2;
			transition: opacity .3s ease-out, transform .6s, top .6s, left .6s;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			box-shadow: 0px 0px 10rpx #ccc;
		}

		.float_swiper_item .list-img {
			width: 100%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		.float_swiper_item .img-item{
			width:100%;
			// padding-top:100%;
		}
		//
		.swiper-pointers{
			display: flex;
			position: absolute;
			left: 50%;
			bottom: 10rpx;
			transform: translateX(-50%);
		}
		.pointer{
			width: 16rpx;
			height: 16rpx;
			background-color:#efefef;
			border-radius: 100%;
			margin: 5rpx 10rpx;
			transition: background .35s;
			// box-shadow: 0px 0px 5rpx #ccc;
		}
		.curr-pointer{
			background-color:#05BC4D;
		}
	}
</style>
