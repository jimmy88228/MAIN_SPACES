import Conf from "../../config/config.js";
import * as ApiList from './http.api.js'
// import { WechatApiList, UserApiList, EduApiList,EvaluateApiList, pageManageApiList,resourceApiList,consultantApiList, commonApiList,interveneApiList,supervisionApiList,archivesApiList,commissionerApiList} from './http.api.js';
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
	...addRequests(ApiList.logApiList, apiDomain.LOGAPI),
	...addRequests(ApiList.WechatApiList, apiDomain.WECHATAPI),
	...addRequests(ApiList.EduApiList, apiDomain.EDEAPI),
	...addRequests(ApiList.UserApiList, apiDomain.USERAPI),
	...addRequests(ApiList.EvaluateApiList, apiDomain.EVALUATEAPI),
	...addRequests(ApiList.pageManageApiList, apiDomain.PAGEAPI),
	...addRequests(ApiList.resourceApiList, apiDomain.RESOURCEAPI),
	...addRequests(ApiList.consultantApiList, apiDomain.CONSULTANTAPI),
	...addRequests(ApiList.commonApiList, apiDomain.COMMONAPI),
	...addRequests(ApiList.supervisionApiList, apiDomain.SUPERVISIONAPI),
	...addRequests(ApiList.interveneApiList, apiDomain.SUPERVISORAPI),
	...addRequests(ApiList.archivesApiList, apiDomain.ARCHIVESAPI),
	...addRequests(ApiList.commissionerApiList,apiDomain.COMMISSIONERAPI),
	...addRequests(ApiList.psyserviceApiList,apiDomain.PSYSERVICEAPI),
	...addRequests(ApiList.gameApiList,apiDomain.GAMEAPI),
	...addRequests(ApiList.authApiList,apiDomain.AUTHAPI),
	...addRequests(ApiList.treeHoleApiList,apiDomain.TREEHOLEAPI),
	...addRequests(ApiList.funTestApiList,apiDomain.FUNTESTAPI),
	...addRequests(ApiList.specialSectionApiList,apiDomain.SPECIALSECTIONAPI),
	...addRequests(ApiList.examApiList,apiDomain.EXAMAPI),
	...addRequests(ApiList.courseApiList,apiDomain.COURSEAPI),
	...addRequests(ApiList.platform.SupplierApiList,apiDomain['PLATFORM-SUPPLIERAPI']),
	...addRequests(ApiList.platform.WechatApiList,apiDomain['PLATFORM-WECHATAPI']),
	...addRequests(ApiList.platform.UserApiList,apiDomain['PLATFORM-USERAPI']),
	...addRequests(ApiList.platform.PageApiList,apiDomain['PLATFORM-PAGEAPI']),
	...addRequests(ApiList.platform.CustomerApiList,apiDomain['PLATFORM-CUSTOMER']),
}
console.log("install", Apis)
