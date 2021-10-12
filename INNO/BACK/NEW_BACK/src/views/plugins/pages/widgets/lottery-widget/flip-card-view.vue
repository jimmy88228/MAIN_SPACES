<style lang="less">
	.filp-card-view{
	.image-item-box{
		box-sizing: border-box;
		.image-item{
			position: relative;
			overflow: hidden;
			line-height: 1;
			img{
				width:100%;
				display: block;
			}
		}
	}
	.empty{
		text-align: center;
		padding:50px 20px;
		color:#515a6e;
	}
}
</style>

<template>
	<div class="filp-card-view">

		<!-- 静态图片 -->
		<template v-if="info.images.length > 0 ">
			<Row type="flex" style="flex-wrap: wrap; justify-content: space-between;" align="middle" :gutter="info.gutter" :style="RowMarginTB">
				<template>
					<Col v-for="(item,index) in info.images" :key="index" :span="( 24 / info.row )" class="image-item-box" :style="{'padding-top': (info.gutter / 2) + 'px', 'padding-bottom': (info.gutter / 2) + 'px'}">
						<div class="image-item">
							<img :src="item.img" />
						</div>
					</Col>
				</template>
			</Row>
		</template>

		<!--空白的情况-->
		<div v-else class="empty">
			<Icon type="ios-images" size="60" color="#2d8cf0"></Icon>
			<div>请点击编辑营销logo</div>
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
				info: {
					images: []
				},
				dataList: [],
				t2_val: 0
			}
		},
		computed: {
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
		},
		watch: {

		},
		mounted() {
			this.init();
		}
	}
</script>
