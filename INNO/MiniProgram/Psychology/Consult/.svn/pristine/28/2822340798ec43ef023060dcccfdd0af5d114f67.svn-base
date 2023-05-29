<style lang="scss">
page{
	background: $page-color-base;
}	
</style>

<template>
	<view class="container">
		<global-com></global-com>
		
	</view>		
</template>	

<script>
/**
 * 小程序二维码中间过渡，统一跳转页，
 * 用于作为着陆页
 */
import util from '@/libs/util.js';

export default {
	data() {
		return {
			params:{},
		};
	},
	onLoad( option ) {
		this.init( option );
	},
	methods:{
		init( option ){

			util.showLoading(this);
			
			util.ajax.post(util.apiUrl.weappQrcodeJump, {
				data:{
					code: option.code,
				}
			})
			.then( (response) => {
				util.hideLoading();
				
				var res = response.data;
				if( res.code ){
					var router = res.data;
					if( ['pages/home/index','pages/my/index', 'pages/shop/cart/index', 'pages/shop/category/index'].indexOf( router) !== -1 ){
						uni.switchTab({
							url: router,
						});
					}
					else{
						uni.redirectTo({
							url: router,
						});
					}
				}
				else{
					// 跳转出错
					uni.showToast({
						title: res.message,
						icon: 'none',
					});
					uni.switchTab({
						url:'pages/home/index',
					});
				}
			});
		},
		
	},
}
</script>