import { Apis } from "./http/http.api.install.js";
import { Http } from "./http/http.interceptor.js";

export const installUtils = {
	install(Vue) {
		Vue.prototype.$Http = Http;
		Vue.prototype.$Apis = {
			...Apis
		};
	}
}
