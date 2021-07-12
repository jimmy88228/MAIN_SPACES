<style lang="less">
	.editor-image-ad-view{

	.image-item{
		position: relative;
		overflow: hidden;
		line-height: 1;

		img{
			width:100%;
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
	<div class="editor-image-ad-view">

		<!-- 静态图片 -->
		<template v-if=" info.type == 't1' && info.images.length > 0 ">
			<Row type="flex" style="flex-wrap: wrap;" align="middle" :gutter="info.gutter">
				<template v-if="info.row == 5">
					<!--五张图的时候显示不下，只能采用自动适配-->
					<Col v-for="(item,index) in info.images" :key="index" v-if="info.open_slide == null || info.open_slide == false || ( info.open_slide == true && index +1 <= info.row ) "
					 style="width:20%;" class="image-item">
					<img :src="item.img" />
					</Col>
				</template>
				<template v-else>
					<Col v-for="(item,index) in info.images" :key="index" v-if="info.open_slide == null || info.open_slide == false || ( info.open_slide == true && index +1 <= info.row ) "
					 :span="( 24/info.row )" class="image-item">
					<img :src="item.img" />

					<!--热点示意图(只有单张图片的时候才显示)-->
					<template v-if="typeof(item.poster_map) != 'undefined' && info.row == 1">
						<div v-for="(map,mi) in item.poster_map" :key="'map-'+mi" class="map" :style="mapStyle(map)">
							<template v-if="typeof(map.link) !='undefined'">
								{{map.link.typeName}} {{map.link.name}}
							</template>
						</div>
					</template>
					</Col>
				</template>
			</Row>
		</template>

		<!-- 图片轮播 -->
		<div v-else-if=" info.type == 't2' && info.images.length > 0 ">
			<Carousel v-model="t2_val" loop :dots="info.indicator == 'none' ? 'none' : 'inside' " :radius-dot="info.indicator == 'dot' "
			 :autoplay="info.autoPlay" :autoplay-speed=" ( info.interval != '' && info.interval != null ? info.interval : 3 ) * 1000">
				<CarouselItem v-for="(item,index) in info.images" :key="index">
					<div :style="adCarouselStyle( info, index, item )">
						<div v-show="info.showTitle" class="carousel-title" :style="info.indicator != 'none' ? 'padding-bottom:15px;' : ''">{{item.title}}</div>
					</div>
				</CarouselItem>
			</Carousel>
		</div>

		<!--空白的情况-->
		<div v-else class="empty">
			<Icon type="ios-images" size="60" color="#2d8cf0"></Icon>
			<div>请点击编辑图片广告</div>
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
				info: {},
				dataList: [],

				t2_val: 0
			}
		},
		computed: {

		},
		methods: {
			init() {
				this.dataList = this.inTab ? this.$store.state.app.tabPageCompList : this.$store.state.app.pageCompList;
				this.info = this.dataList[this.currIndex].setting;
			},
			mapStyle(map) {
				// 当前比例 375，数据比例 600；
				let r = 375 / 600;
				return {
					bottom: Math.abs(Math.ceil(map.map_y * r)) - Math.ceil(map.map_height * r) + 'px',
					left: Math.ceil(map.map_x * r) + 'px',
					width: Math.ceil(map.map_width * r) + 'px',
					height: Math.ceil(map.map_height * r) + 'px',
					'line-height': Math.ceil(map.map_height * r) + 'px'
				};
			},
			adCarouselStyle(info, index, item) {
				let height = 375 * info.images[0].height / info.images[0].width;

				return {
					width: '100%',
					height: height + 'px',
					position: 'relative',
					'background-image': 'url(' + item.img + ')',
					'background-repeat': 'no-repeat',
					'background-size': (index > 0 && item.height > item.width) ? 'auto 100%' : '100% auto',
					'background-color': '#fff',
					'background-position': 'center center'
				};
			}
		},
		watch: {

		},
		mounted() {
			this.init();
		}
	}
</script>
