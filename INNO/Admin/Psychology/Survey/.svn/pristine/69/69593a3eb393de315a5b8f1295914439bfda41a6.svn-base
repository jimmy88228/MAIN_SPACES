// import EasyHttp from "@y-bao/easy-http";
import axios from "axios";
import LM from "./login-manager";
import Conf from "@/config";
import Apis from "./http-api";
import qs from 'qs';
import store from "@/store/index";
import utils from "../utils/index.js";

const httpManager = {};

httpManager.ajax = axios.create({
    baseURL: Conf.API_DOMIN,
    timeout: 60000
})

httpManager.ajax.__proto__ = axios;

// 拦截request，设置全局请求为ajax请求
httpManager.ajax.interceptors.request.use((config) => {
    if (LM.loginToken) {
        config.headers || (config.headers = {});
        config.headers.Authorization = LM.loginToken;
    }
    if(config.other && config.other.isShowLoad){
        store.commit("setPageLoading", true);
    }
    // if(config.method != 'get'){
    //     config.data = qs.stringify(config.data)
    // }
    return config
})

// 拦截响应response，统一做错误处理
httpManager.ajax.interceptors.response.use((response) => {
    let data = response.data || {};
    let config = response.config || {};
    let other = config.other || {};
    // loading
    switchLoad(other, false);
    // toast
    if(response.status != 200){
        utils.debounce(showMsg(other, data), 500);
    } else {
        showMsg(other, data);
    }
    if(response.status == 200){
        return data;
    } else {
        return response;
    }
}, (error)=>{
    if(error && error.response){
        let data = error.response.data;
        let config = error.response.config || {};
        let other = config.other || {};
        // loading
        switchLoad(other, false);
        if(data && data.toString()){
            $Bus.$Message.info(data.toString());
        }
        switch (error.response.status) {
            case 401:
            case 431:
                LM.clear();
                $Bus.$router.push({ name: "Login" }); 
                break;
            case 430:
                $Bus.$Message.info("即将跳转首页");
                setTimeout(()=>{
                    $Bus.$router.push({ name: "home" })
                },1000)
                break;
            case 434:
                LM.clear();
                $Bus.$router.push({ name: "Login" });
                break;
            // case 405:

        }
    }
    return Promise.reject(error);
})
const _MainApi = {};
if(Apis){
    for(let i in Apis){
        let api = Apis[i];
        let url = typeof(api) == 'string' ? api : api["u"];
        let method = Apis[i].m || "get";
        let baseURL = Apis[i].b || Conf.API_DOMIN;
        _MainApi[i] = function(reqData){
            method = reqData.method || method;
            return httpManager.ajax(
                {
                    baseURL: baseURL,
                    method: method,
                    url: url,
                    data: reqData.data || {},
                    other: reqData.other || {}
                }
            )
        } 
    }
}
// 
function showMsg(other = {}, data = {}){
    if(other.isMsg){
        if(data.code){
            typeof(data.message) == "string" && $Bus.$Message.success(data.message);
        } else {
            typeof(data.message) == "string" && $Bus.$Message.warning(data.message);
        }
    } else if(other.isSuccessMsg && data.code){
        typeof(data.message) == "string" && $Bus.$Message.success(data.message);
    } else if(other.isErrorMsg && !data.code){ 
        typeof(data.message) == "string" && $Bus.$Message.warning(data.message);
    }
}
function switchLoad(other, state){
    if(other.isShowLoad){
        if(other.hideLoadTime){
            setTimeout(()=>{
                store.commit("setPageLoading", false);
            }, other.hideLoadTime)
        } else {
            store.commit("setPageLoading", state);
        }
    }
}
export const MainApi = _MainApi