<script>
	import LM from "./common/manager/login-manager.js";
	import LgMg from "./common/manager/log-manager.js";
	import IM from "./common/manager/identity-manager.js";
	import PM from "./common/helper/params-handler.js";
	import SM from "./common/manager/structure-manage.js";
	import AS from "@/common/helper/authorize-set";
	import PLM from '@/common/manager/platform-manager';
	import Conf from '@/config/config.js'
	import {
		Apis
	} from "@/common/http/http.api.install.js";
	import {
		Http
	} from "@/common/http/http.interceptor.js";
	import SMH from "@/common/helper/show-msg-handler.js";
	import Sysm from "@/common/helper/system-config.js"
	import ScanCode from '@/common/helper/scan-code-handler.js';
	import SIH from '@/common/helper/sys-infos-handler.js';
	// import tabBarH from "@/common/manager/tabbar-manager.js";

	import "./common/base/base-page";
	import "./common/base/base-comp";
	import "@/common/base/base-manager.js";
	export default {
		onLaunch: function (ops) {
			console.log("app onlaunch", ops);
			if (ops.path == undefined) {
				uni.redirectTo({
					url: 'pages/public/404'
				});
			}
			// #ifdef APP-PLUS
			plus.navigator.setFullscreen(true);
			// #endif
		},
		onShow: function (ops) {
			console.log("app onShow", ops);
			LgMg.setBaseChannel(ops);
			if (PLM.platformInfo.appCode) {
				LM.loginAsync(false).finally(() => {
					if (!(LgMg.channel && LgMg.channel.clientSessionId)) {
						LgMg.setBaseChannel(ops);
						LgMg.addPageLog(null, ops.path, ops.query, 0)
					}
					if (!LM.openId) return
					LgMg.setChannel(ops);
				})
			}
			let query = ops.query || {};
			ScanCode.initScan(query);
			if (query.scene) {
				LM.removeLoginData('recordId');
			}
			PM.initParams("appShow", ops);
		},
		onHide: function () {
			ScanCode.hideScan();
			LgMg.hideMP();
		},
		computed: {
			//#ifdef H5
			Sysm() {
				return Sysm
			},
			LM() {
				return LM
			},
			IM() {
				return IM
			},
			SM() {
				return SM
			},
			PLM() {
				return PLM
			},
			Conf() {
				return Conf
			},
			Http() {
				return Http
			},
			Apis() {
				return Apis
			},
			SMH() {
				return SMH
			},
			PM() {
				return PM
			},
			SIH() {
				return SIH;
			},
			AS() {
				return AS;
			},
			//#endif
		},
		methods: {
			//#ifdef MP
			get Sysm() {
				return Sysm;
			},
			get SIH() {
				return SIH;
			},
			get LM() {
				return LM
			},
			get IM() {
				return IM
			},
			get SM() {
				return SM
			},
			get PLM() {
				return PLM
			},
			get Conf() {
				return Conf
			},
			get Http() {
				return Http
			},
			get Apis() {
				return Apis
			},
			get SMH() {
				return SMH
			},
			get PM() {
				return PM
			},
			get AS() {
				return AS
			},
			// get tabBarH(){
			// 	return tabBarH;
			// }
			//#endif
		},

	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";

	/*导入后台icon*/
	@import url('./common/myIcon.css');

	/*导入 yticon */
	@import url('./common/yticon.css');

	/*导入自定义公共样式*/
	@import url('./common/css/comm.scss');

	/*一行省略号*/
	.clamp {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
	}

	/*两行省略号*/
	.clamp2 {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	/*三行省略号*/
	.clamp3 {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
	}
</style>