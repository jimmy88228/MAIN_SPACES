import LM from '../manager/login-manager.js';
import Tools from "../support/utils.js";
import Sysm from "@/common/helper/system-config.js"
import PM from "@/common/helper/params-handler.js";
import brandM from "@/common/manager/brand-manager.js";
import entryM from '@/common/manager/entry-manager.js';
import scanCode from "@/common/helper/scan-code-handler.js"
import Conf from "@/config/config.js";
// 统一处理错误code    code的具体错误参看同目录下 ./http.md
export const checkTokenValid = function (e) {
	if (e.code == -40002 || e.code == -40003) { //刷新主token
		//#ifdef MP
		return LM.logout().loginAsync().then(() => {
			LM.loginBsnAsync()
		})
		//#endif

		//#ifdef H5
		LM.logout().logout('bsnUserToken');
		setTimeout(() => {
			uni.redirectTo({
				url: brandM._setAppCodeUrl(`/pages/startup/startup?id=${PM.getParams('initId')||0}&schoolId=${PM.getParams('schoolId')||0}&campusId=${PM.getParams('campusId')||0}&classId=${PM.getParams('classId')||0}`)
			})
		}, 1500)
		return Promise.resolve();
		//#endif
	} else if (e.code == -40001) { // 刷新子token
		return LM.logout('bsnUserToken').loginBsnAsync()
	} else if (e.code == -40004 || e.code == -40005) {
		let page = getCurrentPages().slice(-1)[0] || {};
		let route = page.route || '';
		let params = Tools.paramsByJson(page.options);
		let fromRoute = params ? encodeURIComponent(route + "?" + params) : encodeURIComponent(route);
		LM.logout('bsnUserToken');
		fromRoute = '/' + fromRoute;
		if (route == entryM.loginPath) fromRoute = "";
		if (e.code == -40004) { //-40004 需要重新选择子用户
			let targetRoute = 'pages/user-type-select/user-type-select';
			if (route != targetRoute) {
				setTimeout(() => {
					uni.navigateTo({
						url: brandM._setAppCodeUrl(`/${targetRoute}?fromRoute=${fromRoute}`)
					})
				}, 1500)
			}
		} else { //  -40005 需要绑定测评子用户
			let schoolInfo = scanCode && scanCode.schoolInfo || {};
			Sysm.getLoginConfig(schoolInfo.schoolId || PM.getParams('schoolId') || 0).then(res => { // 检测登录方式
				// Sysm.getSysConf('applet_login_type').finally(() => { // 检测登录方式
				let targetRoute = res.data == 'password' ? entryM.loginPath : 'pages/user-type-select/user-type-select'
				if (route != targetRoute) {
					setTimeout(() => {
						uni.navigateTo({
							url: brandM._setAppCodeUrl(`/${targetRoute}?fromRoute=${fromRoute}`)
						})
					})
				}
			})
		}
		return Promise.reject(e);
	} else if (e.code == -40006) {
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
		return Promise.reject(e);
	} else if (e.code == -4007 || e.code == -4009) {
		setTimeout(() => {
			LM.logout("all")
			uni.redirectTo({
				url: brandM._setAppCodeUrl("/pages/startup/startup")
			})
		}, 1500)
		return Promise.reject(e);
	} else {
		return Promise.reject(e)
	};
}