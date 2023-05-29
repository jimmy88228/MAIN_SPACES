<template>
	<view class="container">
		<view :style="{height: bodyHeight +'px'}">
			<!-- <u-empty text="页面不存在" mode="page"></u-empty> -->
			<!-- <Button @click="switchChat">{{isChat ? '已开启' : '已关闭'}}</Button> -->
			<Button style="margin-top: 200rpx;" @click="checkChat">{{isChat ? '发起语音' : '请授权麦克风，视频'}}</Button>
		</view>
	</view>		
</template>	

<script>
const pageOption = Page.BasePage({
	data() {
		return {
			bodyHeight: 500,
			isChat: false
		};
	},
	onLoad( option ) {
		// this.init( option );
		this.switchChat();
	},
	methods:{
		// init( option ){
		// 	// 计算屏幕高度
		// 	var system = uni.getSystemInfoSync();
		// 	this.bodyHeight = system.windowHeight;
		// },
		// goHome(){
		// 	uni.switchTab({
		// 		url: '/pages/app/course-shop/home/index'
		// 	});
		// },
		checkChat(){
			if(!this.isChat){
				this.switchChat().then(()=>{
					this.join1v1Chat();
				})
			} else {
				this.join1v1Chat();
			}
		},
		switchChat(){
			return new Promise((rs, rj)=>{
				wx.setEnable1v1Chat({
					enable: true,
					minWindowType: 1,
					success:(res)=>{
						if(res.errMsg && res.errMsg.indexOf(':ok') != -1){
							this.isChat = true;
							return rs();
						}
					},
					fail:(error)=>{
						return rj();
					}
				})
			})
		},
		join1v1Chat(){
			wx.join1v1Chat({
				caller: {
					openid: "osMXC5cOV4AkqLbLJ2uIP1QPSkhQ",
					nickname: "李亚飞"
					// openid: "osMXC5ewpGrpi5sjX0hxZ6wKy9Ql",//"osMXC5blzuZXOo6LFHPXpHajKhAs",
					// nickname: "罗镜明"
				},
				listener: {
					openid: "osMXC5ewpGrpi5sjX0hxZ6wKy9QI",//"osMXC5blzuZXOo6LFHPXpHajKhAs",
					nickname: "罗镜明"
					// openid: "osMXC5cOV4AkqLbLJ2uIP1QPSkhQ",
					// nickname: "李亚飞"
				},
				// roomType: "voice",
				success:(res)=>{
					console.log("res", res)
				},
				fail:(error)=>{
					console.log("error", error)
				}
			})
			this.createListen();
		},
		createListen(){
			wx.onVoIPChatMembersChanged(this.listenerOnline)
		},
		listenerOnline(res){
			console.log("res", res)
		}
	},
})
export default pageOption;
</script>

<style lang="scss">
page{
	background: $page-color-base;
}	
</style>