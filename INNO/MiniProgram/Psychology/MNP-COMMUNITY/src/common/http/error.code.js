import LM from '../manager/login-manager.js';
import Tools from "../support/utils.js";
import Sysm from "@/common/helper/system-config.js"
import PM from "@/common/helper/params-handler.js";
import UniApi from "@/common/support/tools/uni-api-promise.js";
import StorageH from "@/common/helper/storage-handler";


let loginPage = "pages/login/login"
// 统一处理错误code    code的具体错误参看同目录下 ./http.md
export const checkTokenValid = function (e) {
	if (e.code == -40002 || e.code == -40003) { //刷新主token
		//#ifdef MP
		return LM.logout().loginAsync().catch(e => {
			console.log("返回注册")
			let loginAuth = StorageH.get("LOGIN_AUTH");
			let page = getCurrentPages().slice(-1)[0] || {};
			let targetRoute = !!loginAuth ? "pages/register/register" : loginPage;
			if (page.route != targetRoute) {
				uni.navigateTo({
					url: "/" + targetRoute
				});
			}
			return Promise.reject()
		})
		//#endif

		//#ifdef H5
		LM.logout().logout('bsnUserToken');
		uni.redirectTo({
			url: `/pages/startup/startup?id=${PM.getParams('initId')||0}`
		})
		return Promise.resolve();
		//#endif
	}else if (e.code == -40006) {
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
		return Promise.reject(e);
	} else {
		return Promise.reject(e)
	};
}