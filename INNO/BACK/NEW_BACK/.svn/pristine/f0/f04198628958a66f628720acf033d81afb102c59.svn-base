<style lang="less">
	.matrix-active-view{

	.image-item{
		position: relative;
		overflow: hidden;
		line-height: 1;
		img{
			width:100%;
			display: block;
			margin:5px auto;
			margin-top:20px;
		}
	}
	.change-tip{
		font-size:12px;
		margin:15px auto;
		background-color:rgba(0,0,0,0.6);
		color:#fff;
		border-radius:100px;
		display:flex;
		width: 130px;
		align-items: center;
		justify-content: center;
		height:30px;
		padding:0px 10px;
	}
	.empty{
		text-align: center;
		padding:50px 20px;
		color:#515a6e;
	}
}
</style>

<template>
	<div class="matrix-active-view">

		<!-- 静态图片 -->
		<template >
			<div>
				<div class="image-item" >
					<img v-if="info.activeBtn.img" :src="info.activeBtn.img" :style="getImgStyle(info.activeBtn)"/>
					<div class="change-tip-area">
						<p class="change-tip">你还有X次抽奖机会</p>
					</div>
				</div>
			</div>
		</template>

		<!--空白的情况-->
		<!-- <div v-else class="empty">
			<Icon type="ios-images" size="60" color="#2d8cf0"></Icon>
			<div>请点击编辑营销logo</div>
		</div> -->
	</div>
</template>

<script>
	import lotteryMixins from '@/views/plugins/pages/widgets/mixins/lottery-mixins.js';
	export default {
		name: 'matrixActiveView',
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
					activeBtn: {
						img: "",
						mix: 0
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
				if(!this.info.activeBtn){
					this.$set(this.info, 'activeBtn', {img: "", mix: 0})
				}
			},
			
		},
		watch: {

		},
		mounted() {
			this.init();
		}
	}
</script>
