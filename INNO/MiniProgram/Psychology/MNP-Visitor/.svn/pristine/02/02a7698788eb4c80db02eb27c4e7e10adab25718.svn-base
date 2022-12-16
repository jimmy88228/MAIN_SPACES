<template>
	<view class="startup flex-c-c">
		<loading-view v-show="showLoading"></loading-view>
	</view>
</template>
 
<script>
	import LoadingView from '@/components/css3/loading/loading.vue';
	import ScanCode from '@/common/helper/scan-code-handler.js';
	import utils from '@/common/support/utils.js';
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
			this.options = options || {};
			app.PM.setParams('initId',parseInt(this.options.id||0)||app.PM.getParams('initId')||0);
			this.activityId = app.PM.getParams('initId');
		},
		onShow(){
			this.init();
		},
		onReady(){
			this.showLoading = true;
		},
		methods: {
			init(){
				// #ifdef H5
				this.redirectAction(`/pages/login/login?id=${this.options.id||0}`);
				// #endif

				// #ifdef MP
				ScanCode.scan().then((data)=>{
					this.initLogin(data);
				})
				// #endif
			},
			initLogin(data){
				return this._checkLogin().then((login)=>{
					// let isCheck = !!ScanCode.scene;
					// app.LM.loginBsnAsync(false, isCheck).then(()=>{
					// 	if(app.LM.recordId){
					// 		if(data && data.pagePath){
					// 			this.redirectAction("/" + data.pagePath + "?" + utils.paramsByJson(data.sceneOption))
					// 		} else {
					// 			this.redirectAction('/pages/index/index');
					// 		}
					// 		ScanCode.clearData(); // 二维码流程走完释放扫码信息
					// 	} else {
					// 		this.jumpAction('/pages/user-switch/user-switch');
					// 	}
					// })
					if(!login) return
					if(data && data.pagePath){
							this.redirectAction("/" + data.pagePath + "?" + utils.paramsByJson(data.sceneOption))
						} else {
							this.redirectAction('/pages/index/index');
						}
						ScanCode.clearData(true); // 二维码流程走完释放扫码信息
				}).catch(()=>{
					this.jumpAction('/pages/register/register');
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
