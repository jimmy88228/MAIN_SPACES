<template>
	<view class="support-area">
		<slot></slot>
		<view class="logo-area">
			<image class="support-logo" :src="staticAddress + '/support-sx-logo.png'" mode="widthFix"> 
		</view>
	</view>
</template>

<script>
	const pageOption = Page.BaseComp({
		props: {},
		data() {
			return {
			}
		},
		methods:{
			
		},
	})
	export default pageOption;
</script>

<style scoped lang="scss">
	.support-area {
		margin-top: 10rpx;
		margin-bottom: 10rpx;
		width:100%;
	}
	.logo-area{

	}
	.support-logo{
		width: 100%;
		display: block;
		padding: 0 80rpx;
    box-sizing: border-box;
	}

</style>
