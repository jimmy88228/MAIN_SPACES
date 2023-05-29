import {
    MainApi,
} from "./http-manager";
export const installHttp = {
    install(Vue) {
        Vue.prototype.$MainApi = MainApi;
    }
}