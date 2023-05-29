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
	}
	// else if(e.code == -40001){ // 刷新子token
	// 	return LM.logout('bsnUserToken').loginBsnAsync()
	// }else if(e.code == -40004 || e.code == -40005){
	// 	let page = getCurrentPages().slice(-1)[0] || {};
	// 	let route = page.route || '';
	// 	let params = Tools.paramsByJson(page.options);
	// 	let fromRoute = params ? encodeURIComponent(route + "?" + params) : encodeURIComponent(route);
	// 	LM.logout('bsnUserToken');
	// 	fromRoute = '/' + fromRoute;
	// 	if(route == loginPage) fromRoute = "";
	// 	if(e.code == -40004 ){ //-40004 需要重新选择子用户
	// 		let targetRoute = 'pages/user-switch/user-switch';
	// 		if(route != targetRoute){
	// 			setTimeout(()=>{
	// 				uni.navigateTo({
	// 					url:`/${targetRoute}?fromRoute=${fromRoute}`
	// 				})
	// 			}, 1500)
	// 		}
	// 	} else { //  -40005 需要绑定测评子用户
	// 		Sysm.getSysConf('applet_login_type').finally(()=>{ // 检测登录方式
	// 			let targetRoute = Sysm.sysConf['applet_login_type'] == 'password' ? 'pages/login/login' : 'pages/information/information'
	// 			if(route != targetRoute){
	// 				setTimeout(()=>{
	// 					uni.navigateTo({
	// 						url:`/${targetRoute}?fromRoute=${fromRoute}`
	// 					})
	// 				})
	// 			}
	// 		})
	// 	}
	// 	return Promise.reject(e);
	// }
	else if (e.code == -40006) {
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
		return Promise.reject(e);
	} else {
		return Promise.reject(e)
	};
}