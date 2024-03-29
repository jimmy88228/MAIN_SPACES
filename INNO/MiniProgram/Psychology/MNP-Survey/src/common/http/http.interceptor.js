import SMH from "../helper/show-msg-handler.js";
import Conf from "@/config/config.js"; 
import LM from '../manager/login-manager.js'
import UniApi from "../support/tools/uni-api-promise.js";
import Tools from "../support/utils.js";
import { checkTokenValid } from "./error.code.js";
import brandM from "../manager/brand-manager.js";

export let Http = function(api, reqData = {}){
	if(api){
		let url = api.u || api;
		let method = api.m  || 'GET'
		if(url){
			return new Promise((rs, rj)=>{
				let other = reqData.other||{};
				if(other.isShowLoad || other.showLoading){
					SMH.showLoading()
				}
				let header = reqData.header || {};
				// #ifdef H5
				header.appCode = brandM.appCode;
				// #endif
				// #ifndef H5
				header.appCode = Conf.appCode;
				// #endif
				header.appType = Conf.appType;
				header.platformType = Conf.platformSrc;
				header.authUserToken = LM.userToken || '';
				header.recordId = LM.recordId||0;
				// header.recordId = 111||LM.recordId||0;
				Conf.log && console.info("请求：", url ,"header：", header ,"参数：", reqData);
				RequestApi({reqData,method,header,url}).then(rq=>{
					Conf.log && console.info("接收：", url ,"header：", rq.header,"参数：", reqData, "结果：", rq.data);
					if(rq.statusCode != 200 || rq.data.code != 1){
						return Promise.reject(rq.data);
					}
					return rs(rq.data || {});
				}).catch(e=>{
					Conf.log && console.error("请求错误：", e);
					if(!other.isHideMsg){
						let msg = e.errMsg || e.msg || "";
						//#ifdef MP
						if(e.code == '-40002' || e.code == '-40008' || e.errno == '5' || e.errno == '600001' || e.errMsg == "request:fail net::ERR_NAME_NOT_RESOLVED"){
							msg = "";
						}
						//#endif
						msg && SMH.showToast({
							title: msg
						})
					} 		
						
					return checkTokenValid(e).then(()=>{
						// 二次请求
						header.authUserToken = LM.userToken || '';
						header.recordId = LM.recordId||0;
						if(reqData.data && reqData.data.sessionId) reqData.data.sessionId = LM.sessionId || 0;
						Conf.log && console.info("重新请求：", url ,"参数：", reqData);
						return RequestApi({reqData,method,header,url}).then(rq=>{
							if(rq.statusCode != 200 || rq.data.code != 1){
								return rj(rq.data);
							}
							return rs(rq.data || {});
						})
					}).catch(e=>{
							return rj(e);
					})
				})
				.finally(()=>{
					if(other.isShowLoad || other.showLoading){
						SMH.hideLoading()
					}
				}) 
			}) 
		}
	}
}

function RequestApi({reqData={},method="",header={},url=""}){
	return UniApi.request({
		url: reqData.customUrl ? reqData.customUrl : Tools.getPureUrl(url),
		method: method,
		header: header,
		...reqData,
	})
}

