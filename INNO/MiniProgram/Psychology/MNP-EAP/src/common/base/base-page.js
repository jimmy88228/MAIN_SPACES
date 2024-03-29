import LgMg from "../manager/log-manager.js";
import storageH from "@/common/helper/storage-handler.js";
import strH from "@/common/support/utils/string-util.js";
import CryptoJS from "crypto-js";
const BasePage = function (pageOption) {
	let po = pageOption || {};
	let pageParams = {};
	let pages,page,route;
	let bpo = {
		onLoad(...args) {
			let options = decodeOption(...args);
			try {
				getPageState.call(this, "onLoad");
				pages = getCurrentPages() || [];
				page = pages.slice(-1)[0] || {};
				let q = args && args.length > 0 && args[0] || {};
				route = page.route;
				pageParams = {...q};
			} catch (e) {}
			po.onLoad && po.onLoad.call(this, options);
		},
		onShow(...args) {
			try {
				getPageState.call(this, "onShow");
				console.log(LgMg.createNewSession,"LgMg.createNewSession")
				let isBack = this.pageState == "onBack"
				console.log(null, route,pageParams, isBack)
				LgMg.addPageLog(null, route,pageParams, isBack)
			} catch (e) {}
			po.onShow && po.onShow.call(this, decodeOption(...args));
		},
		onReady(...args) {
			try {
				getPageState.call(this, "onReady");
			} catch (e) {}
			po.onReady && po.onReady.call(this, decodeOption(...args));
		},
		onHide() {
			try {
				getPageState.call(this, "onHide");
			} catch (e) {}
			po.onHide && po.onHide.call(this);
		},
		onUnload() {
			try {
				getPageState.call(this, "onUnload");
			} catch (e) {}
			po.onUnload && po.onUnload.call(this);
		}
	}
	//分享
	if (po.onShareAppMessage) {
		bpo.onShareAppMessage = function (...args) {
			let _page = getCurrentPages().slice(-1)[0] || {};
			let shareData = po.onShareAppMessage && po.onShareAppMessage.call(this, ...args) || {};
			// console.log("_page22", _page.$getAppWebview())

			// if(!shareData.title){

			// }
			// shareData.path = shareData.path || po.route;
			// if (LM.userToken) {
			// 	shareData.path = shareData.path.indexOf("?") != -1 ? shareData.path + "&userToken=" + LM
			// 		.userToken : shareData.path + "?userToken=" + LM.userToken;
			// };
			return shareData;
		}
	}
	// 朋友圈
	if (po.onShareAppMessage || po.onShareTimeline) { // 页面分享，分享朋友圈
		bpo.onShareTimeline = function (...args) {
			let shareData = (this.onShareAppMessage && this.onShareAppMessage()) || {};
			let shareTimeData = (po.onShareTimeline && po.onShareTimeline.call(this, ...args)) || {};
			let path = shareData.path || '';
			if (path) {
				shareData.query = path.substr(parseInt(path.indexOf("?")) + 1);
			}
			return {
				...shareData,
				...shareTimeData
			}
		}
	}
	return {
		...po,
		...bpo
	}
}

function getPageState(process) {
	switch (process) {
		case "onShow":
			if (this.pageState == "onLoad" || !this.pageState) {
				this.pageState = process
			} else if (this.pageState == "onHide" && !LgMg.createNewSession) {
				this.pageState = "onBack"
			}
			break;
		case "onLoad":
		case "onReady":
		case "onHide":
		case "onUnload":
			this.pageState = process;
			break;
	}
}

// encode页面参数
function decodeOption(ops) {
	ops = {
		...ops
	}
	if(ops.paramsKey){
		let paramsKey = decodeURIComponent(ops.paramsKey)
		let paramsStr = CryptoJS.AES.decrypt(paramsKey, 'paramsKey').toString(CryptoJS.enc.Utf8);
		let params = strH.getUrlParam(paramsStr.replace(/\"/g, ''));
		ops = params;
	}
	for (let i in ops) {
		ops[i] = decodeURIComponent(ops[i]);
	}
	return ops
}

// function checkLogin() {
// 	//#ifdef MP
// 	// 小程序登录流程
// 	return this._checkLogin().then(() => {
// 		let page = getCurrentPages().slice(-1);
// 		let route = page && page[0] && page[0].route || '';
// 		if (!LM.isLogin && !NotNeedLoginPage[route]) {
// 			this.reLaunchAction('/pages/login/login');
// 		} else if (LM.isLogin && !NotNeedLoginPage[route]) {
// 			return LM.loginBsnAsync(); //检测业务token
// 		}
// 	})
// 	//#endif

// 	//#ifdef H5
// 	console.log('H5 登录', this);
// 	//#endif
// }
Page.BasePage = BasePage;

export default BasePage