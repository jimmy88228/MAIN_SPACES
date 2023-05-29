function getSetConfig(config = {}, brandConfig) {
	let brandCode = config.brandCode;
	let env = config.env;
	console.log("[brandCode].env", `${brandCode}`)
	return {
		...config,
		...brandConfig,
		...((allBrandConfig[brandCode] && allBrandConfig[brandCode][env]) || {})
	}
}
export default getSetConfig;
const allBrandConfig = {
	// 英朗
	SURVEY_CMT_INNO: {
		dev: {
			appCode: "SURVEY_CMT_INNO",
			staticConfig: "https://psyimage.innourl.com/v/asset/eap/general/static",
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
				"WXSUBSCRIBEAPI": "https://devgovpsyapi.innourl.com",
			}
		},
		prod: {
			appCode: "SURVEY_CMT_INNO",
			staticConfig: "https://psyimage.innourl.com/v/asset/eap/general/static",
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
				"WXSUBSCRIBEAPI": "https://govpsyapi.innourl.com",
			}
		}

	},
	// 海珠心理关爱
	HZ_CMT: {
		dev: {
			appCode: "HZ_CMT",
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
				"WXSUBSCRIBEAPI": "https://devgovpsyapi.innourl.com",
			}
		},
		prod: {
			appCode: "HZ_CMT",
			staticConfig: "https://psyimage.innourl.com/v/asset/community/general/static",
			"apiDomain": {
				"LOGAPI": "https://ylpsyvsapi.innourl.com/cmt",
				"USERAPI": "https://govpsyapi2.innourl.com",
				"REGAPI": "https://govpsyapi2.innourl.com",
				"WECHATAPI": "https://govpsyapi2.innourl.com",
				"EDEAPI": "https://govpsyapi2.innourl.com",
				"EVALUATEAPI": "https://govpsyapi2.innourl.com",
				"PAGEAPI": "https://govpsyapi2.innourl.com",
				"RESOURCEAPI": "https://govpsyapi2.innourl.com",
				"CONSULTANTAPI": "https://govpsyapi2.innourl.com",
				"COMMONAPI": "https://govpsyapi2.innourl.com",
				"SUPERVISIONAPI": "https://govpsyapi2.innourl.com",
				"SUPERVISORAPI": "https://govpsyapi2.innourl.com",
				"WARNINGAPI": "https://govpsyapi2.innourl.com",
				"ARCHIVESAPI": "https://govpsyapi2.innourl.com",
				"COMMISSIONERAPI": "https://govpsyapi2.innourl.com",
				"PSYSERVICEAPI": "https://govpsyapi2.innourl.com",
				"TREEHOLEAPI": "https://govpsyapi2.innourl.com",
				"GAMEAPI": "https://govpsyapi2.innourl.com",
				"AUTHAPI": "https://govpsyapi2.innourl.com",
				"FUNTESTAPI": "https://govpsyapi2.innourl.com",
				"SPECIALSECTIONAPI": "https://govpsyapi2.innourl.com",
				"WXSUBSCRIBEAPI": "https://govpsyapi2.innourl.com",
			}
		}

	},
	// 白云区居民心理
	SURVEY_CMT_GZBY: {
		dev: {
			appCode: "SURVEY_CMT_GZBY",
			staticConfig: "https://shximage.innourl.com/v/asset/eap/general/static",
			"apiDomain": {
				"LOGAPI": "https://shxgovapi.innourl.com/log",
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
				"WXSUBSCRIBEAPI": "https://shxgovapi.innourl.com",
			}
		},
		prod: {
			appCode: "SURVEY_CMT_GZBY",
			staticConfig: "https://shximage.innourl.com/v/asset/eap/general/static",
			"apiDomain": {
				"LOGAPI": "https://shxgovapi.innourl.com/log",
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
				"WXSUBSCRIBEAPI": "https://shxgovapi.innourl.com",
			}
		}

	},
	// 上馨环境测试小程序
	SXCMT_INNO: {
		dev: {
			appCode: "SXCMT_INNO",
			staticConfig: "https://shximage.innourl.com/v/asset/eap/general/static",
			"apiDomain": {
				"LOGAPI": "https://shxgovapi.innourl.com/log",
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
				"WXSUBSCRIBEAPI": "https://shxgovapi.innourl.com",
			}
		},
		prod: {
			appCode: "SXCMT_INNO",
			staticConfig: "https://shximage.innourl.com/v/asset/eap/general/static",
			"apiDomain": {
				"LOGAPI": "https://shxgovapi.innourl.com/log",
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
				"WXSUBSCRIBEAPI": "https://shxgovapi.innourl.com",
			}
		}

	},
	// (cs)英朗心理关爱
	INNO_CMT: {
		dev: {
			appCode: "INNO_CMT",
			staticConfig: "https://cseduimage.innourl.com/v/asset/community/general/static",
			"apiDomain": {
				"LOGAPI": "https://cspsyvsapi.innourl.com/cmt",
				"USERAPI": "https://csgovapi.innourl.com",
				"REGAPI": "https://csgovapi.innourl.com",
				"WECHATAPI": "https://csgovapi.innourl.com",
				"EDEAPI": "https://csgovapi.innourl.com",
				"EVALUATEAPI": "https://csgovapi.innourl.com",
				"PAGEAPI": "https://csgovapi.innourl.com",
				"RESOURCEAPI": "https://csgovapi.innourl.com",
				"CONSULTANTAPI": "https://csgovapi.innourl.com",
				"COMMONAPI": "https://csgovapi.innourl.com",
				"SUPERVISIONAPI": "https://csgovapi.innourl.com",
				"SUPERVISORAPI": "https://csgovapi.innourl.com",
				"WARNINGAPI": "https://csgovapi.innourl.com",
				"ARCHIVESAPI": "https://csgovapi.innourl.com",
				"COMMISSIONERAPI": "https://csgovapi.innourl.com",
				"PSYSERVICEAPI": "https://csgovapi.innourl.com",
				"TREEHOLEAPI": "https://csgovapi.innourl.com",
				"GAMEAPI": "https://csgovapi.innourl.com",
				"AUTHAPI": "https://csgovapi.innourl.com",
				"FUNTESTAPI": "https://csgovapi.innourl.com",
				"SPECIALSECTIONAPI": "https://csgovapi.innourl.com",
				"WXSUBSCRIBEAPI": "https://csgovapi.innourl.com",
			}
		},
		prod: {
			appCode: "INNO_CMT",
			staticConfig: "https://cseduimage.innourl.com/v/asset/community/general/static",
			"apiDomain": {
				"LOGAPI": "https://cspsyvsapi.innourl.com/cmt",
				"USERAPI": "https://csgovapi.innourl.com",
				"REGAPI": "https://csgovapi.innourl.com",
				"WECHATAPI": "https://csgovapi.innourl.com",
				"EDEAPI": "https://csgovapi.innourl.com",
				"EVALUATEAPI": "https://csgovapi.innourl.com",
				"PAGEAPI": "https://csgovapi.innourl.com",
				"RESOURCEAPI": "https://csgovapi.innourl.com",
				"CONSULTANTAPI": "https://csgovapi.innourl.com",
				"COMMONAPI": "https://csgovapi.innourl.com",
				"SUPERVISIONAPI": "https://csgovapi.innourl.com",
				"SUPERVISORAPI": "https://csgovapi.innourl.com",
				"WARNINGAPI": "https://csgovapi.innourl.com",
				"ARCHIVESAPI": "https://csgovapi.innourl.com",
				"COMMISSIONERAPI": "https://csgovapi.innourl.com",
				"PSYSERVICEAPI": "https://csgovapi.innourl.com",
				"TREEHOLEAPI": "https://csgovapi.innourl.com",
				"GAMEAPI": "https://csgovapi.innourl.com",
				"AUTHAPI": "https://csgovapi.innourl.com",
				"FUNTESTAPI": "https://csgovapi.innourl.com",
				"SPECIALSECTIONAPI": "https://csgovapi.innourl.com",
				"WXSUBSCRIBEAPI": "https://csgovapi.innourl.com",
			}
		}

	}
}