<style lang="less" scoped="scoped">
	.fruit-lottery-view{
	.image-item-box{
		box-sizing: border-box;
		
		.image-item{
			position: relative;
			overflow: hidden;
			min-height:90px;
			text-align: center;
			background-size: 100% auto;
			.image-item-cont{
				position:absolute;
				top:50%;
				left:50%;
				transform: translate(-50%, -50%);
				img{
					width:50px;
					display:block;
					margin:0 auto;
					margin-bottom:5px;
				}
				.lottery-tip{
					font-size:16px;
					margin-bottom:10px;
				}
				.lottery-txt{
					font-size:12px;
				}
			}
			.bg_img{
				width:100%;
				display: block;
			}
			.map{
				position: absolute;
				background: rgba(0,0,204,.3);
				z-index: 100;
				font-size:12px;
				color:#fff;
				text-align: center;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
	

	.carousel-title{
		text-align:center;
		color:#fff;
		position:absolute;
		bottom:0;
		width:100%;
		padding:5px 0;
		background-color: rgba(0,0,0,.25);
	}
	.empty{
		text-align: center;
		padding:50px 20px;
		color:#515a6e;
	}
}
</style>

<template>
	<div class="fruit-lottery-view">

		<!-- 静态图片 -->
		<template v-if="prizeNum">
			<Row type="flex" style="flex-wrap: wrap; justify-content: space-between;" align="middle" :gutter="info.gutter" :style="RowMarginTB">
				<template>
					<Col v-for="(index) in prizeNum" :key="index"
					 :span="8" class="image-item-box" :style="{'padding-top': (info.gutter / 2) + 'px', 'padding-bottom': (info.gutter / 2) + 'px'}">
						<div class="image-item">
							<div class="image-item-cont" :style="getBgStyle(index)">
								<template v-if="index == 5">
									<div class="lottery-tip space-nowrap bold">开始抽奖</div>
									<div class="lottery-txt space-nowrap">(还剩2次机会)</div>
								</template>
								<template v-else>
									<img :src="img" />
									<p class="space-nowrap">谢谢参与</p>
								</template>
							</div>
							<img :src="getBgImg(index)" class="bg_img">
						</div>
					</Col>
				</template>
			</Row>
		</template>

		<!--空白的情况-->
		<div v-else class="empty">
			<Icon type="ios-images" size="60" color="#2d8cf0"></Icon>
			<div>请点击编辑水果机配置</div>
		</div>
	</div>
</template>

<script>
	/**
	 * 图片广告渲染组件
	 */
	export default {
		name: 'imageAdView',
		components: {

		},
		props: {
			currIndex: {
				type: [Number, String],
				default: 0
			},
			// 是否使用用在 tab 导航页面内
			inTab: {
				type: Boolean,
				default: false,
			}
		},
		
		data() {
			return {
				prizeNum: 9,
				info: {},
				dataList: [],
				t2_val: 0,
				img: "https://devimgtest.innourl.com/wechat_applet_image/icon/INNO/micro_mall/lottery/Kiwi_fruit.png"
			}
		},
		computed:{
			RowMarginTB(){
				let gutter = this.info.gutter || 0;
				let style = "";
				if(gutter){
					let m = parseFloat((gutter / 2).toFixed(2));
					style = `margin-top:${-m}px;margin-bottom:${-m}px;`
				}
				return style
			}
		},
		methods: {
			init() {
				this.dataList = this.inTab ? this.$store.state.app.tabPageCompList : this.$store.state.app.pageCompList;
				this.info = this.dataList[this.currIndex].setting;
				
			},
			getBgStyle(index, type){
				let info = this.info || {};
				let style = "";
				if(!info.activePrize) { return style; }
				if(index == 1){
					style = `color:${info.activePrize.color}`;
				} else if(index == 5){
					style = `color:${info.lotteryBtn.color}`;
				} else {
					style = `color:${info.defaultPrize.color}`;
				}
				return style;
			},
			getBgImg(index){
				let info = this.info || {};
				let img = ""
				if(!info.activePrize) { return img; }
				if(index == 1){
					img = info.activePrize.img;
				} else if(index == 5){
					img = info.lotteryBtn.img;
				} else {
					img = info.defaultPrize.img;
				}
				return img;
			}
		},
		watch: {

		},
		mounted() {
			this.init();
		}
	}
</script>
