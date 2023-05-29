<template>
	<view class="container">
		<view :style="{height: bodyHeight +'px'}">
			<u-empty text="页面不存在" mode="page"></u-empty>
		</view>
	</view>		
</template>	

<script>
/**
 * 404 错误提示页
 */
export default {
	data() {
		return {
			bodyHeight: 500,
		};
	},
	onLoad( option ) {
		this.init( option );
	},
	methods:{
		init( option ){
			// 计算屏幕高度
			var system = uni.getSystemInfoSync();
			this.bodyHeight = system.windowHeight;
		},
		goHome(){
			uni.switchTab({
				url: '/pages/app/course-shop/home/index'
			});
		}
	},
}
</script>

<style lang="scss">
page{
	background: $page-color-base;
}	
</style>