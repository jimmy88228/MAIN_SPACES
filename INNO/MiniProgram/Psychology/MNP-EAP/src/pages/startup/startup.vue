<template>
	<view class="startup flex-c-c">
		<loading-view v-show="showLoading"></loading-view>
	</view>
</template>
 
<script>
	import LoadingView from '@/components/css3/loading/loading.vue';
	import ScanCode from '@/common/helper/scan-code-handler.js';
	import utils from '@/common/support/utils.js';
	import loginExclude from '@/common/manager/login-exclude-path.js';
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
					// 检查扫码页面是否在登录白名单中
					let loginExcludePath = loginExclude.EXCLUDE_PATH;
					if(data && data.pagePath && loginExcludePath.includes(data.pagePath)){
						console.log(data.pagePath,loginExcludePath,loginExcludePath.includes(data.pagePath),123213213213213213)
						this.redirectAction("/" + data.pagePath + "?" + utils.paramsByJson(data.sceneOption))
					}else{
						this.initLogin(data);
					}
				})
				// #endif
			},
			initLogin(data){
				return this._checkLogin().then((login)=>{
					if(!login) return
					console.log(data,"扫码数据")
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
