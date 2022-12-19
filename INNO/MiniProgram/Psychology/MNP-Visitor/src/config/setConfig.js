function getSetConfig(config = {}, brandConfig){
	let platformCode = config.platformCode; // 决定平台接口，图片域名配置
	let env = config.env;
	// #ifdef H5
		// brandM记录每次地址栏带进来的appCode
		// let pageParams = stringUtil.getAppUrlParams(); 
		// if(pageParams.appCode){
		// 	brandM.setData({appCode: pageParams.appCode}) // 决定请求头appCode参数
		// }
		return {
			...config,
			...brandConfig,
			...((allBrandConfig[platformCode] && allBrandConfig[platformCode][env]) || {})
		}
	// #endif
	// #ifndef H5
		return {
			...config,
			...brandConfig,
			...((allBrandConfig[platformCode] && allBrandConfig[platformCode][env]) || {}),
			appCode: config.appCode || '' // 决定小程序appCode
		}
	// #endif
}
export default getSetConfig;
const allBrandConfig = {
	// 英朗平台
	SURVEY_INNO: {
		dev: {
			staticConfig: "https://psyimage.innourl.com/v/asset/community/general/static",
			"apiDomain": {
				"LOGAPI": "https://devgovpsyapi.innourl.com/log",
				"USERAPI": "https://devgovpsyapi.innourl.com",
				"REGAPI": "https://devgovpsyapi.innourl.com",
				"WECHATAPI": "https://devgovpsyapi.innourl.com",
				"EDEAPI": "https://devgovpsyapi.innourl.com",
				"EVALUATEAPI": "https://devgovpsyapi.innourl.com",
				"PAGEAPI": "https://devgovpsyapi.innourl.com",
				"RESOURCEAPI": "https://devgovpsyapi.innourl.com",
				"CONSULTANTAPI": "https://devgovpsyapi.innourl.com",
				"COMMONAPI": "https://devgovpsyapi.innourl.com",
				"SUPERVISIONAPI": "https://devgovpsyapi.innourl.com",
				"SUPERVISORAPI": "https://devgovpsyapi.innourl.com",
				"WARNINGAPI": "https://devgovpsyapi.innourl.com",
				"ARCHIVESAPI": "https://devgovpsyapi.innourl.com",
				"COMMISSIONERAPI": "https://devgovpsyapi.innourl.com",
				"PSYSERVICEAPI": "https://devgovpsyapi.innourl.com",
				"TREEHOLEAPI": "https://devgovpsyapi.innourl.com",
				"GAMEAPI": "https://devgovpsyapi.innourl.com",
				"AUTHAPI": "https://devgovpsyapi.innourl.com",
				"FUNTESTAPI": "https://devgovpsyapi.innourl.com",
				"SPECIALSECTIONAPI": "https://devgovpsyapi.innourl.com",
			}
		},
		prod: {
			staticConfig: "https://psyimage.innourl.com/v/asset/community/general/static",
			"apiDomain": {
				"LOGAPI": "https://ylpsyvsapi.innourl.com/cmt",
				"USERAPI": "https://govpsyapi.innourl.com",
				"REGAPI": "https://govpsyapi.innourl.com",
				"WECHATAPI": "https://govpsyapi.innourl.com",
				"EDEAPI": "https://govpsyapi.innourl.com",
				"EVALUATEAPI": "https://govpsyapi.innourl.com",
				"PAGEAPI": "https://govpsyapi.innourl.com",
				"RESOURCEAPI": "https://govpsyapi.innourl.com",
				"CONSULTANTAPI": "https://govpsyapi.innourl.com",
				"COMMONAPI": "https://govpsyapi.innourl.com",
				"SUPERVISIONAPI": "https://govpsyapi.innourl.com",
				"SUPERVISORAPI": "https://govpsyapi.innourl.com",
				"WARNINGAPI": "https://govpsyapi.innourl.com",
				"ARCHIVESAPI": "https://govpsyapi.innourl.com",
				"COMMISSIONERAPI": "https://govpsyapi.innourl.com",
				"PSYSERVICEAPI": "https://govpsyapi.innourl.com",
				"TREEHOLEAPI": "https://govpsyapi.innourl.com",
				"GAMEAPI": "https://govpsyapi.innourl.com",
				"AUTHAPI": "https://govpsyapi.innourl.com",
				"FUNTESTAPI": "https://govpsyapi.innourl.com",
				"SPECIALSECTIONAPI": "https://govpsyapi.innourl.com",
			}
		}

	},
	// 上馨平台
	SHANG_XIN: {
		dev: {
			staticConfig: "https://shximage.innourl.com/v/asset/eap/general/static",
			"apiDomain": {
				"LOGAPI": "https://shxpsyvsapi.innourl.com/cmt",
				"USERAPI": "https://shxgovapi.innourl.com",
				"REGAPI": "https://shxgovapi.innourl.com",
				"WECHATAPI": "https://shxgovapi.innourl.com",
				"EDEAPI": "https://shxgovapi.innourl.com",
				"EVALUATEAPI": "https://shxgovapi.innourl.com",
				"PAGEAPI": "https://shxgovapi.innourl.com",
				"RESOURCEAPI": "https://shxgovapi.innourl.com",
				"CONSULTANTAPI": "https://shxgovapi.innourl.com",
				"COMMONAPI": "https://shxgovapi.innourl.com",
				"SUPERVISIONAPI": "https://shxgovapi.innourl.com",
				"SUPERVISORAPI": "https://shxgovapi.innourl.com",
				"WARNINGAPI": "https://shxgovapi.innourl.com",
				"ARCHIVESAPI": "https://shxgovapi.innourl.com",
				"COMMISSIONERAPI": "https://shxgovapi.innourl.com",
				"PSYSERVICEAPI": "https://shxgovapi.innourl.com",
				"TREEHOLEAPI": "https://shxgovapi.innourl.com",
				"GAMEAPI": "https://shxgovapi.innourl.com",
				"AUTHAPI": "https://shxgovapi.innourl.com",
				"FUNTESTAPI": "https://shxgovapi.innourl.com",
				"SPECIALSECTIONAPI": "https://shxgovapi.innourl.com",
			}
		},
		prod: {
			staticConfig: "https://shximage.innourl.com/v/asset/eap/general/static",
			"apiDomain": {
				"LOGAPI": "https://shxpsyvsapi.innourl.com/cmt",
				"USERAPI": "https://shxgovapi.innourl.com",
				"REGAPI": "https://shxgovapi.innourl.com",
				"WECHATAPI": "https://shxgovapi.innourl.com",
				"EDEAPI": "https://shxgovapi.innourl.com",
				"EVALUATEAPI": "https://shxgovapi.innourl.com",
				"PAGEAPI": "https://shxgovapi.innourl.com",
				"RESOURCEAPI": "https://shxgovapi.innourl.com",
				"CONSULTANTAPI": "https://shxgovapi.innourl.com",
				"COMMONAPI": "https://shxgovapi.innourl.com",
				"SUPERVISIONAPI": "https://shxgovapi.innourl.com",
				"SUPERVISORAPI": "https://shxgovapi.innourl.com",
				"WARNINGAPI": "https://shxgovapi.innourl.com",
				"ARCHIVESAPI": "https://shxgovapi.innourl.com",
				"COMMISSIONERAPI": "https://shxgovapi.innourl.com",
				"PSYSERVICEAPI": "https://shxgovapi.innourl.com",
				"TREEHOLEAPI": "https://shxgovapi.innourl.com",
				"GAMEAPI": "https://shxgovapi.innourl.com",
				"AUTHAPI": "https://shxgovapi.innourl.com",
				"FUNTESTAPI": "https://shxgovapi.innourl.com",
				"SPECIALSECTIONAPI": "https://shxgovapi.innourl.com",
			}
		}
	},

}