import Conf from "../../config/config.js";
import * as ApisList from './http.api.js';

// import { WechatApiList, UserApiList, EduApiList,EvaluateApiList, pageManageApiList,resourceApiList,consultantApiList, commonApiList,interveneApiList,supervisionApiList,archivesApiList,commissionerApiList,gameApiList,authApiList,treeHoleApiList,psyserviceApiList,logApiList} from './http.api.js';
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
	...addRequests(ApisList.logApiList, apiDomain.LOGAPI),
	...addRequests(ApisList.WechatApiList, apiDomain.WECHATAPI),
	...addRequests(ApisList.EduApiList, apiDomain.EDEAPI),
	...addRequests(ApisList.UserApiList, apiDomain.USERAPI),
	...addRequests(ApisList.EvaluateApiList, apiDomain.EVALUATEAPI),
	...addRequests(ApisList.pageManageApiList, apiDomain.PAGEAPI),
	...addRequests(ApisList.resourceApiList, apiDomain.RESOURCEAPI),
	...addRequests(ApisList.consultantApiList, apiDomain.CONSULTANTAPI),
	...addRequests(ApisList.commonApiList, apiDomain.COMMONAPI),
	...addRequests(ApisList.supervisionApiList, apiDomain.SUPERVISIONAPI),
	...addRequests(ApisList.interveneApiList, apiDomain.SUPERVISORAPI),
	...addRequests(ApisList.archivesApiList, apiDomain.ARCHIVESAPI),
	...addRequests(ApisList.commissionerApiList,apiDomain.COMMISSIONERAPI),
	...addRequests(ApisList.treeHoleApiList,apiDomain.TREEHOLEAPI),
	...addRequests(ApisList.psyserviceApiList,apiDomain.PSYSERVICEAPI),
	...addRequests(ApisList.gameApiList,apiDomain.GAMEAPI),
	...addRequests(ApisList.authApiList,apiDomain.AUTHAPI),
	...addRequests(ApisList.funTestApiList,apiDomain.FUNTESTAPI),
	...addRequests(ApisList.specialSectionApiList,apiDomain.SPECIALSECTIONAPI),
	...addRequests(ApisList.wxSubscribeApiList,apiDomain.WXSUBSCRIBEAPI),
}
console.log("install", Apis)
