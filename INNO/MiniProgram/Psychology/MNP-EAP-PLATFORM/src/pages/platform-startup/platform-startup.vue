<template>
	<view class="startup flex-c-c">
		<loading-view v-show="showLoading"></loading-view>
	</view>
</template>

<script>
	import LoadingView from '@/components/css3/loading/loading.vue';
	import ScanCode from '@/common/helper/scan-code-handler.js';
	import utils from '@/common/support/utils.js';
	import StorageH from '@/common/helper/storage-handler.js'
	import SSXI from "@/common/manager/showSXIndex-manager.js";
	import LgMg from "@/common/manager/log-manager.js";

	const app = getApp();
	const pageOption = Page.BasePage({
		components: {
			LoadingView
		},
		data() {
			return {
				showLoading: false,
				acInfo: null,
				activityId: 0
			}
		},
		onLoad(options) {
			this.options = options || {};
			app.PM.setParams('initId', parseInt(this.options.id || 0) || app.PM.getParams('initId') || 0);
			this.activityId = app.PM.getParams('initId');
		},
		onShow() {
			this.init();
		},
		onReady() {
			this.showLoading = true;
		},
		methods: {
			init() {
				// #ifdef H5
				this.redirectAction(`/pages/login/login?id=${this.options.id||0}`);
				// #endif

				// #ifdef MP
				ScanCode.scan("platform").then((data) => {
					this.initLogin(data);
				})
				// #endif
			},
			initLogin(data) {
				if (ScanCode.scene) {
					// if (data.sceneOption && data.sceneOption.appCode) {
					// 		app.PLM.setCustomerInfo().then(() => {
					// 			this.afterCheckCode(data)
					// 		})
					// 	}
					// } else {
					this._checkLastLogin().then(() => {
						this.afterCheckCode(data)
					})
					// .catch(() => {
					// 	this._checkLogin()
					// })
				}
			},

			afterCheckCode(data) {
				return this._checkLogin(null, false).then((login) => {
					if (!login) return Promise.reject()
						// 没有AppCode小程序无法从app.vue设置详细会话，需要获得appCode之后从startup设置会话。
					if (LgMg.createNewSession && app.PLM.platformInfo.appCode) {
						this.setNewBaseChannel()
					}
					if (data && data.pagePath) {
						this.redirectAction("/" + data.pagePath + "?customType=platform&" + utils.paramsByJson(data
							.sceneOption))
					} else {
						SSXI.getShowSXIndexConfig({
							isHome: true
						})
					}
					ScanCode.clearData(true); // 二维码流程走完释放扫码信息
				}).catch(() => {
					// 没有最后一次登录,跳转登录界面
					let loginAuth = StorageH.get("LOGIN_AUTH");
					let targetRoute = !!loginAuth ? "pages/register/register" : "pages/login/login";
					this.jumpAction("/" + targetRoute);
				})
			},
			setNewBaseChannel() {
				if (!(LgMg.channel && LgMg.channel.clientSessionId)) {
					LgMg.setBaseChannel();
					LgMg.addPageLog(null, ops.path, ops.query, 0)
				}
				if (app.LM.openId) {
					LgMg.setChannel();

				}

			}

		},
	})
	export default pageOption;
</script>

<style scoped>
	.startup {
		width: 100%;
		height: 100vh;
	}
</style>