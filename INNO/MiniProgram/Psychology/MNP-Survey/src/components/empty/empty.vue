<template>
	<view class="list-empty">
		<image :src="requireStatic('/list-empty.png')" class="empty-img" :style="imgStyle" mode="aspectFit" />
		<view class="empty-txt">
			<slot></slot>
		</view>
		<view class="empty-operate">
			<slot name="operate">
				<view v-if="showBack" class="back-operate" @click="backAction('/pages/startup/startup')">返回</view>
			</slot>
		</view>
	</view>
</template>

<script>
	const pageOption = Page.BaseComp({
		name: "empty",
		props: {
			showBack: {
				type: Boolean,
				default: true
			},
			imgStyle:{
				type:String,
				default:''
			}
		},
		data() {
			return {

			}
		},
		methods: {

		},
	})
	export default pageOption
</script>

<style lang="scss" scoped>
	.list-empty {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		text-align: center;

		.empty-img {
			width: 254rpx;
			height: 254rpx;
			display: block;
			margin: 0 auto;
			margin-bottom: 45rpx;
		}

		.empty-txt {
			font-family: PingFangSC-Regular;
			font-size: 32rpx;
			color: #B2B2B2;
		}

		.empty-operate {
			margin-top: 45rpx;

			.back-operate {
				background: #FAFAFA;
				border-radius: 80rpx;
				width: 180rpx;
				height: 80rpx;
				display: flex;
				margin: 0 auto;
				align-items: center;
				justify-content: center;
				font-family: PingFangSC-Regular;
				font-size: 28rpx;
				color: #B2B2B2;
			}
		}
	}
</style>