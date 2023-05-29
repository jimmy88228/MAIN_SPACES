import LM from '../manager/login-manager.js';
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
			// let targetRoute = !!loginAuth ? "pages/register/register" : loginPage;
			let targetRoute = loginPage;
			if (page.route != targetRoute) {
				uni.navigateTo({
					url: "/" + targetRoute
				});
			}
			return Promise.reject()
		})
		//#endif
	}	else if (e.code == -40006) {
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
		return Promise.reject(e);
	} else {
		return Promise.reject(e)
	};
}