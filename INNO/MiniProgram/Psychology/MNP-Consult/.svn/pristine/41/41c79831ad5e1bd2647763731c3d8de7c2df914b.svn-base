import Conf from "../../config/config.js";
import * as ApisList from './http.api.js';

function addRequests(apiList, apiHost){
	if(apiList instanceof Object){
		for(let i in apiList){
			let api  = apiList[i];
			if(api instanceof Object){
				api.u = apiHost + api.u;
				api.m = api.m ? api.m : '';
			} else if(typeof(api) == 'string'){
				api = apiHost + api
			}
			apiList[i] = api;
		}
		return apiList;
	}
	return {};
}
let apiDomain = Conf.apiDomain || {};

// 拼装API
export const Apis = {
	...addRequests(ApisList.WechatApiList, apiDomain.WECHATAPI),
	...addRequests(ApisList.UserApiList, apiDomain.USERAPI),
	...addRequests(ApisList.ConsultList,apiDomain.CONSULTAPI),
	...addRequests(ApisList.SupplierList,apiDomain.SUPPLIERAPI),
	...addRequests(ApisList.commonApiList,apiDomain.COMMONAPI),
}
console.log("install", Apis)
