<style lang='scss'>
.login-method{
	text-align: center;
	width: 220upx;
	margin-top:40upx;
	
	.icon{
		font-size:60upx;
		color:#fff;
		border-radius: 100%;
		background: #1aa034;
		padding:16upx;
	}
	.name{
		font-size:24upx;
	}
}
// 点击的效果
.icon-hover{
	opacity: 0.5;
}	
</style>
	
<template>
	<view class="flex-item login-method" hover-class="icon-hover" :hover-stay-time="80">
		<text class="icon ionmy ion-my-weixin" @click="weixinLogin"></text>
		<view class="name">微信登录</view>
	</view>
</template>

<script>
/**
 * APP 微信登录组件
 */	
import md5Libs from "uview-ui/libs/function/md5";

export default {
	name: 'weixinLogin',
	data() {
		return {
			isOpenFace: false,
			brandInfo:{
				can_face_login:false,
			},
		}
	},
	methods:{
		initData( info ){
			this.brandInfo = info;
			
			// 获取开启人脸功能的缓存
			var isopen = uni.getStorageInfoSync('isOpenFace');
			this.isOpenFace = ( isopen != null && isopen != '' ) ? true : false;
		},
		weixinLogin(){
			// #ifdef APP-PLUS
			uni.login({
				provider: 'weixin',
				fail: (rs)=>{
					uni.showToast({
						title:'微信登录出错',
						icon: 'none',
					});
				},
				success: (loginRes) => {

					// 获取用户信息
					uni.getUserInfo({
						provider: 'weixin',
						success: (infoRes) => {
							var nickName = infoRes.userInfo.nickName;
							var openId = infoRes.userInfo.openId;

							// 把openid 发送到服务器，进行管理员登录
							var sec = util.secretdate();
							var timestamp = Math.ceil( sec.timestamp/1000 );
							var token = md5Libs.md5( sec.nonce+'|||'+timestamp+'|||'+openId );
							
							util.ajax.post(util.apiUrl.appWeixinLogin, {
								data:{
									openId: openId,
									token: token,
									nonce: sec.nonce,
									timestamp: timestamp,
									userInfo: JSON.stringify(infoRes.userInfo),
								}
							})
							.then( (response) => {
								
								var res = response.data;
								if( res.code ){
									uni.showToast({
										title:'登录成功，欢迎 '+nickName,
										icon: 'none',
										position: 'bottom',
									});
									
									// 微信登录成功,通知父组件
									this.$emit( 'on-success', res);
								}
								else{
									uni.showToast({
										title: res.message,
										icon: 'none',
										duration: 5000
									});
								}
							});
						}
					});
				}
			});
			// #endif
			
			// #ifndef APP-PLUS
			uni.showToast({
				title:'APP才能使用此功能',
				icon: 'none',
			});
			// #endif
		},
	},
}
</script>	