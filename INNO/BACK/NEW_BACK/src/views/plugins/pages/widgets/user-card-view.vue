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
	
	.ivu-tabs-bar{
		border-bottom: 0 none;
	}
	.ivu-tabs-nav {
		display: flex;
		width: 100%;
		background-color: rgba(0,0,0,.03);
	
		.ivu-tabs-tab{
			flex:1 1 0%;
			text-align: center;
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
		
		<template v-if="info.imagesGroup.length > 0">
			<Tabs v-if="info.imagesGroup.length > 1" :value="info.currTab">
				<TabPane
				v-for="(group, gindex) in info.imagesGroup" :key="gindex"
				:label="group.name"
				:name="'tab'+gindex"></TabPane>
			</Tabs>
			
			<template
			v-for="(group, gindex) in info.imagesGroup"
			v-if="info.imagesGroup.length == 1 || info.currTab == 'tab'+gindex ">
			
				<!-- 静态图片 -->
				<template v-if=" group.images.length > 0 ">
					<Row type="flex" style="flex-wrap: wrap;" align="middle" :gutter="info.gutter">

						<Col v-for="(item,index) in group.images" :key="index" v-if="info.open_slide == null || info.open_slide == false || ( info.open_slide == true && index +1 <= info.row ) "
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
					
					</Row>
				</template>
				
			</template>
		</template>
		
		<!--空白的情况-->
		<div v-else class="empty">
			<Icon type="ios-card" size="60" color="#2d8cf0"></Icon>
			<div>请点击编辑会员卡片</div>
		</div>
	</div>
</template>

<script>
	/**
	 * 用户卡片渲染组件
	 */
	export default {
		name: 'userCardView',
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
				info: {
					imagesGroup:[],
				},
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
				
				if( typeof(this.info.imagesGroup) == 'undefined' ){
					this.$set(this.info, 'imagesGroup', []);
				}
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
			adCarouselStyle(group, index, item) {
				let height = 375 * group.images[0].height / group.images[0].width;

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
