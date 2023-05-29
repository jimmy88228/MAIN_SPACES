<style lang='scss'>
/* 底部分享 */
.uni-share {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
	background-color: #fff;
}

.uni-share-title {
	line-height: 60rpx;
	font-size: 26rpx;
	padding: 40rpx 0;
	text-align: center;
}

.uni-share-content {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	padding: 50rpx 30rpx 120rpx 30rpx;
}
</style>

<template>
	<view>
		
		<!-- 底部弹窗 -->
		<u-popup ref="weapp-login-box" mode="bottom" mask>
			<view class="uni-share">
				<text class="uni-share-title">请授权小程序登录，以便获取更好的用户体验</text>
				<view class="uni-share-content">
					<button type="primary" size="mini" openType="getUserInfo" @getuserinfo="weappLogin">授权登录</button>
				</view>
			</view>
		</u-popup>
		
	</view>
</template>
		
<script>
import { mapMutations } from 'vuex';

/**
 * 全局组件
 * 小程序弹出的半透明授权提示框
 * 可以配置是否需要弹出；不弹出的情况下，可以在页面做登录按钮
 */	
export default {
	name:'weappLoginBox',
	components: {

	},
	data() {
		return {

		}
	},
	mounted(){
		// 接收和处理全局微信登录成功回调事件
		uni.$on('weapp-global-login', ( userInfo )=>{
			this.weappLogin( userInfo );
		});
	},
	destroyed(){
		// 注销全局事件
		uni.$off('weapp-global-login',()=>{});
	},
	computed:{
		
	},
	watch:{

	},
	methods:{
		...mapMutations(['login']),
		
		// 小程序登录
		weappLogin( userInfo = null ){
			uni.checkSession({
				// session 未过期
				success: () => {
					// userToken 过期
					if( this.checkUserToken() == false ){
						// 登录
						uni.login({
							provider: 'weixin',
							success: (loginRes) => {
								this.weappApiLogin( loginRes, userInfo );
							}
						});
					}
					// userToken 未过期
					else{
						// 不用处理
						console.log('登录session 已经存在');
						
						// 触发 重新刷新当前页面 事件
						this.loginSuccessJump();
					}
				},
				// session 过期
				fail:() => {
					// 登录
					uni.login({
						provider: 'weixin',
						success: (loginRes) => {
							this.weappApiLogin( loginRes, userInfo );
						}
					});
				},
			});
			
		},
		
		// 监测userToken
		checkUserToken(){
			var userToken = uni.getStorageSync('userToken');
			if( userToken == '' || userToken == null ){
				return false;
			}
			else{
				return true;
			}
		},
		
		// 小程序 api 登录
		weappApiLogin( loginRes, userInfo ){
			
			if( userInfo != null && typeof(userInfo.detail) != 'undefined' ){
				// 如果授权成功的，可以关闭授权框
				this.$refs['weapp-login-box'].close();
			}
			
			// 发送code 给服务器，服务器会根据这个code 换取openid
			this.$u.post( this.$api.weappLoginByCode, {
				data:{
					code: loginRes.code,
					user: ( userInfo != null && typeof(userInfo.detail) != 'undefined' ? userInfo.detail.rawData : '' ),
				}
			})
			.then( (response) => {
				var res = response.data;
				if( res.code ){
					// api 登录成功
					
					// 缓存用户登录 token
					uni.setStorage({
						key: 'userToken',
						data: res.accessToken,
					});
					
					// 更新store
					this.login({
						userId: res.id,
						realName: res.realName,
						nickName: res.nickName,
						avatar: res.avatar,
						userCode: res.userCode,
					});
					
					// 登录成功后的跳转
					this.loginSuccessJump();
				}
				else{
					// api 登录失败 或需要授权
					if( res.message == '' ){
						// 需要小程序进行授权
						var cburl = uni.getStorageSync('currRoute');
						if( util.weappNologinBoxRouter.indexOf( cburl ) === -1 ){
							// 弹出授权框
							this.$refs['weapp-login-box'].open();
						}
						else{
							// 不弹授权框，什么也不处理
						}
					}
					else{
						
						// 登录出现错误，直接弹出提示
						uni.showToast({
							title: res.message,
							icon: 'none',
						});
					}
				}
			});
		},
		// 登录成功后的跳转
		loginSuccessJump(){
			var cburl = uni.getStorageSync('currRoute');
			if( cburl != '' && cburl != null ){
				// 给父组件传递小程序登录成功的事件
				this.$emit('mp-login-success',{});
				
				if( cburl == 'pages/my/index' || cburl == 'pages/shop/cart/index' ){
					uni.switchTab({
						url: '/'+cburl
					});
				}
				else{
					// 关闭所有的方式跳转
					uni.reLaunch({
						url: '/'+cburl
					});
				}
			}
			else{
				// 默认跳回主页
				uni.switchTab({
					url: '/pages/home/index'
				});
			}
		}
	}
}
</script>	