<style lang="less">
	.matrix-main-view{
	.image-item{
		position: relative;
		overflow: hidden;
		line-height: 1;
		img{
			width:100%;
			display:block;
			margin:0 auto;
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
	<div class="matrix-main-view">

		<!-- 静态图片 -->
		<template v-if="info.beforeActive.img">
			<div>
				<div class="image-item">
					<img :src="info.beforeActive.img" :style="getImgStyle(info.beforeActive)"/>
				</div>
			</div>
		</template>

		<!--空白的情况-->
		<div v-else class="empty">
			<Icon type="ios-images" size="60" color="#2d8cf0"></Icon>
			<div>请点击编辑矩阵主体内容</div>
		</div>
	</div>
</template>

<script>
	import lotteryMixins from '@/views/plugins/pages/widgets/mixins/lottery-mixins.js';
	export default {
		name: 'matrixMainView',
		mixins: [lotteryMixins],
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
					beforeActive: {
						img: ""
					}
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
			},
		},
		watch: {

		},
		mounted() {
			this.init();
		}
	}
</script>
