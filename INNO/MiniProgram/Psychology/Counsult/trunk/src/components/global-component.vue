<style lang="scss">
.global-loading{
	position: fixed;
	z-index: 1000;
}	
</style>
	
<template>
	<view>
		<!--微信登录的全局组件-->
		<weappLoginBox @mp-login-success="onMpLoginSuccess"></weappLoginBox>
		
		<!-- 全局loading 加载图标 -->
		<mixLoading v-if="loading" class="global-loading" @on-close="closeLoading"></mixLoading>
	</view>
</template>	

<script>
import weappLoginBox from './weappLoginBox.vue';
import mixLoading from '@/components/mix-loading/mix-loading';

/**
 * 全局组件
 * 这里作为一个组件集
 */	
export default {
	name:'global-com',
	components: {
		weappLoginBox,
		mixLoading,
	},
	data() {
		return {
			loading: false,
		}
	},
	mounted(){
		// 接收和处理全局微信登录成功回调事件
		uni.$on('app-global-loading', ( obj )=>{
			this.loading = obj.val;
		});
		
		// #ifdef H5
		// 如果是公众号，凡是进入任何页面都触发登录
		if( this.$util.isWeixinH5() ){
			let userToken = uni.getStorageSync('userToken');
			if( userToken == null || userToken == '' ){
				this.$u.post( this.$api.checkLogin, {})
				.then( (response) => {});
			}
		}
		// #endif
	},
	destroyed(){
		// 注销全局事件
		uni.$off('weapp-global-loading',()=>{});
	},
	computed:{
		
	},
	watch:{

	},
	methods:{
		closeLoading(){
			this.loading = false;
		},
		onMpLoginSuccess( obj ){
			// 通知父组件，小程序登录成功
			this.$emit('mp-login-success', obj );
		}
	}
}
</script>			