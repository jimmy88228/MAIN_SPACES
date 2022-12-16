<script>
	import LM from "./common/manager/login-manager.js";
	import LgMg from "./common/manager/log-manager.js";
	import IM from "./common/manager/identity-manager.js";
	import PM from "./common/helper/params-handler.js";
	import SM from "./common/manager/structure-manage.js";
	import AS from "./common/helper/authorize-set";
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
	import PLH from '@/common/helper/platform-handler.js';
	import entryM from '@/common/manager/entry-manager.js';
	import "./common/base/base-page";
	import "./common/base/base-comp";
	import "@/common/base/base-manager.js";
	export default {
		onLaunch: function (ops) {
			entryM.init(ops);
		},
		onShow: function (ops) {
			IM.initUserInfo();
			console.log("app onShow", PLH.Platform, ops, PLH);
			LM.isLogin && LgMg.setBaseChannel(ops);
			LM.loginAsync(false).finally(() => {
				if (!(LgMg.channel && LgMg.channel.clientSessionId)) {
					LgMg.setBaseChannel(ops);
					LgMg.addPageLog(null, ops.path, ops.query, 0)
				}
				console.log(LM.openId,"LM.openId")
				if (!LM.openId) return
				LgMg.setChannel(ops);
			})

			let query = ops.query || {};
			ScanCode.initScan(query);
			if (query.scene && !ScanCode.scanInfo[query.scene]) {
				LM.removeLoginData('recordId');
				LM.removeLoginData('tcrUserInfos');
				LM.removeLoginData('bsnUserInfo');
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
			AS() {
				return AS
			},
			SIH() {
				return SIH;
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
			//#endif
		},

	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";

	/*导入自定义公共样式*/
	@import url('./common/css/comm.scss');

	/*导入网络字体*/
	@import url('./common/font.css');

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
</style>