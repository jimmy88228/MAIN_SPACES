<template>
	<view class="startup flex-c-c">
		<loading-view v-show="showLoading"></loading-view>
	</view>
</template>
 
<script>
	import LoadingView from '@/components/css3/loading/loading.vue';
	import ScanCode from '@/common/helper/scan-code-handler.js';
	// import utils from '@/common/support/utils.js'; 
	const app = getApp();
	const pageOption = Page.BasePage({
		components:{
			LoadingView
		},
		data() {
			return {
				showLoading:false,
				acInfo:null,
				activityId:0,
			}
		},
		onLoad(options){
			console.log('startup',options)
			this.options = options || {};
			let {roomKey,mobilePhone}=this.options;
			if(roomKey && mobilePhone){
				app.STH.set(app.Conf.ROOM_KEY,{
					roomKey,mobilePhone
				},2)
				// },1440)
			}
			// app.PM.setParams('initId',parseInt(this.options.id||0)||app.PM.getParams('initId')||0);
			// this.activityId = app.PM.getParams('initId');
		},
		onShow(){
			this.init();
		},
		onReady(){
			this.showLoading = true;
		},
		methods: {
			init(){
				// #ifdef MP
				ScanCode.scan().then((data)=>{
					this.initLogin(data);
				})
				// #endif
			},
			initLogin(data){
				return this._checkLogin().then((login)=>{
					if(!login) return;
					this._autoJump(data);
					ScanCode.clearData(true); // 二维码流程走完释放扫码信息
				})
			},
		},
	})
	export default pageOption;
</script>

<style scoped>
.startup{
	width: 100%;
	height: 100vh;
}
</style>
