<style lang="less">
	.editor-big-wheel-view{

	.wheel{
		position:relative;
		width:100%;
		padding-top:100%;
		height:0px;
			.wheel-item{
				text-align:center;
				position:absolute;
				top:0px;
				left:50%;
				width: 40%;
				height: 50%;
				transform-origin: center bottom;
				padding-bottom:10%;
				box-sizing: border-box;
				.item-cont{
					// background-color:#fff;
					.item-img{
						width:50px;
						height:50px;
						display:block;
						margin:0 auto;
						background-color:#efefef;
					}
					.item-txt{
						margin-top:5px;
					}
				}
			}
			.target-img{
				width:100px;
				height:100px;
				position:absolute;
				top:50%;
				left:50%;
				transform: translate(-50%,-50%);
				img{
					width:100%;
					display:block;
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
	<div class="editor-big-wheel-view">

		<!-- 静态图片 -->
		<template v-if="prizeList.length > 0 ">
			<div class="wheel">
					<template v-for="(item, index) in prizeList" >
						<div class="wheel-item" :key="index" :style="getTransform(index)">
							<div class="item-cont">
								<img src="" class="item-img"/>
								<p class="item-txt">奖品{{index}}</p>
							</div>
						</div>
					</template>
					<div class="target-img">
						<img :src="info.targetImg.img" />
					</div>
			</div>
		</template>

		<!--空白的情况-->
		<div v-else class="empty">
			<Icon type="ios-images" size="60" color="#2d8cf0"></Icon>
			<div>请点击编辑营销大转盘配置</div>
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
					targetImg: { img:"" }
				},
				dataList: [],
				t2_val: 0,
				prizeList:[
					{},
					{},
					{},
					{},
					{},
					{}
				]
			}
		},
		computed: {
		},
		methods: {
			init() {
				this.dataList = this.inTab ? this.$store.state.app.tabPageCompList : this.$store.state.app.pageCompList;
				this.info = this.dataList[this.currIndex].setting || {targetImg: {}};
			},
			getTransform(index){
				let prizeList = this.prizeList;
				let len = prizeList.length;
				return 'transform: translate(-50%, 0) rotate(' + (index * (360 / len)) + 'deg);';
			}
		},
		watch: {

		},
		mounted() {
			this.init();
		}
	}
</script>
