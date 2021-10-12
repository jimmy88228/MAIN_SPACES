<style lang="less">
	.matrix-prizes-view{

	.image-item{
		position: relative;
		overflow: hidden;
		line-height: 1;
		img{
			display:block;
			margin:0 auto;
		}
	}
	.scroll-area{
		width:100%;
		padding: 10px 0px;
		overflow: hidden;
		display: flex;
		.prize-item{
			flex-shrink: 0;
			padding:10px;
			text-align: center;
			background-color:#fff;
			border-radius: 6px;
			margin-right:5px;
			display:inline-block;
			font-weight:bold;
			.item-cont{
				width:50px;
				height:50px;
				line-height:50px;
				background-color:#efefef;
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
	<div class="matrix-prizes-view">

		<!-- 静态图片 -->
		<template >
			<!-- <div class="image-item">
				<img :src="info.prizeTitle.img" :style="{'width': info.prizeTitle.mix + '%'}"/>
			</div> -->
			<div>
				<div class="scroll-area">
					<div v-for="item in temL" :key="item" class="prize-item">
						<div class="item-cont">奖品{{item}}</div>
					</div>
				</div>
			</div>
		</template>

		<!--空白的情况-->
		<!-- <div v-else class="empty">
			<Icon type="ios-images" size="60" color="#2d8cf0"></Icon>
			<div>请点击编辑奖品池配置</div>
		</div> -->
	</div>
</template>

<script>
	/**
	 * 图片广告渲染组件
	 */
	export default {
		name: 'matrixPrizes',
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
				temL: 5,
				info: {
					// prizeTitle:{
					// 	// img: "",
					// 	mix: 0
					// }
				},
				dataList: [],

				t2_val: 0,
			}
		},
		computed: {

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
