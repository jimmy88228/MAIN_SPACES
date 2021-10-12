<style lang="less">
	.editor-image-ad-view{

	.image-item{
		position: relative;
		overflow: hidden;
		line-height: 1;
		img{
			width:100%;
			display: block;
			margin: 0 auto;
		}
	}
	.empty{
		text-align: center;
		padding:50px 20px;
		color:#515a6e;
	}

	.winning_area{
		width:100%;
		.winning_list{
			width:100%;
			padding:10px;
			box-sizing: border-box;
			background-color:#fff;
			border-radius:5px;
			.winning_item{
				width:100%;
				font-size:12px;
				padding: 8px 0px;
				.winn_user{width: 20px;height:20px;border-radius:100%;background-color:#b2b2b2;}
				.winn_txt{color:#E22216;}
				.winn_time{color:#b2b2b2;}
			}
		}
		.winn_rule_area{
				padding:0px 5px;
				.winn_rule{
					width:100%;
					min-height:100px;
					background:rgba(0,0,0,0.2);
					border-bottom-left-radius:5px;
					border-bottom-right-radius:5px;
					padding: 10px;
					box-sizing: border-box;
					color:#fff;
					.rule_title{
						font-size:14px;
						text-align:center;
						
					}
				}
		}
		
	}
	
}
</style>

<template>
	<div class="editor-image-ad-view">

		<!-- 静态图片 -->
		<template>
			<div class="image-item">
				<img :src="info.winningLogo.img" :style="getImgStyle(info.winningLogo)">
			</div>
			<div class="winning_area">
				<div class="winning_list">
					<div class="flex winning_item f-just-between f-align-center" v-for="(item,index) in 3">
						<div class="flex f-align-center">
							<div class="winn_user"></div>&nbsp;
							<div class="winn_name">FJD...YU</div>
						</div>&nbsp;
						<div class="winn_txt">抽中300元优惠券</div>&nbsp;
						<div class="winn_time">2021-08-23</div>
					</div>
				</div>
				<!-- <div class="winn_rule_area">
					<div class="winn_rule">
						<div class="rule_title">规则</div>
					</div>
				</div> -->
			</div>
		</template>

		<!--空白的情况-->
		<!-- <div v-else class="empty">
			<Icon type="ios-images" size="60" color="#2d8cf0"></Icon>
			<div>请点击编辑营销名单模块</div>
		</div> -->
	</div>
</template>

<script>
	import lotteryMixins from '@/views/plugins/pages/widgets/mixins/lottery-mixins.js';
	export default {
		name: 'imageAdView',
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
					winningLogo:{
						img: "",
						mix: 0
					}
				},
				dataList: [],
			}
		},
		computed: {

		},
		methods: {
			init() {
				this.dataList = this.inTab ? this.$store.state.app.tabPageCompList : this.$store.state.app.pageCompList;
				this.info = this.dataList[this.currIndex].setting;
				if(!this.info.winningLogo){
					this.$set(this.info, 'winningLogo', {img: "", mix: 0})
				}
			}
		},
		watch: {

		},
		mounted() {
			this.init();
		}
	}
</script>
