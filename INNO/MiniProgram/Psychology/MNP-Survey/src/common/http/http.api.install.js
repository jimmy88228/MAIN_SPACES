import Conf from "../../config/config.js";
import * as ApisList from './http.api.js';
// import { WechatApiList, UserApiList, EduApiList,EvaluateApiList, pageManageApiList, commonApiList , resourceApiList , consultantApiList , commissionerApiList } from './http.api.js';
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
	...addRequests(ApisList.commonApiList, apiDomain.COMMONAPI),
	...addRequests(ApisList.resourceApiList, apiDomain.RESOURCEAPI),
	...addRequests(ApisList.consultantApiList, apiDomain.CONSULTANTAPI),
	...addRequests(ApisList.commissionerApiList,apiDomain.COMMISSIONERAPI),
	...addRequests(ApisList.supervisionApiList, apiDomain.SUPERVISIONAPI), 
	...addRequests(ApisList.archivesApiList, apiDomain.ARCHIVESAPI),
	...addRequests(ApisList.interveneApiList, apiDomain.SUPERVISORAPI),
	...addRequests(ApisList.psyserviceApiList, apiDomain.PSYSERVICEAPI),
	...addRequests(ApisList.teacherApiList, apiDomain.TEACHERAPI),
	...addRequests(ApisList.reportApiList, apiDomain.REPORTAPI),
	...addRequests(ApisList.examApiList, apiDomain.EXAMAPI),
	...addRequests(ApisList.courseApiList, apiDomain.COURSEAPI),
	...addRequests(ApisList.classManageApiList, apiDomain.CLASSMANAGERAPI),
	...addRequests(ApisList.funTestApiList, apiDomain.FUNTESTAPI),
	...addRequests(ApisList.specialSectionApiList, apiDomain.SPECIALSECTIONAPI),
}
console.log("install", Apis)
