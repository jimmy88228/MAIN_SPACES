function getSetConfig(config = {}, brandConfig) {
	let supplierCode = config.supplierCode;
	let env = config.env;
	return {
		...config,
		...brandConfig,
		...((allBrandConfig[supplierCode] && allBrandConfig[supplierCode][env]) || {})
	}
}
export default getSetConfig;
const allBrandConfig = {
	// 上馨
	SUPPLIER_SX: {
		dev: {
			appType: "eap",
			staticConfig: "https://psyimage.innourl.com/v/asset/eap/general/static",
			"apiDomain": {
				"LOGAPI": "https://eapapi.innourl.com/log",
				"USERAPI": "https://eapapi.innourl.com",
				"REGAPI": "https://eapapi.innourl.com",
				"WECHATAPI": "https://eapapi.innourl.com",
				"EDEAPI": "https://eapapi.innourl.com",
				"EVALUATEAPI": "https://eapapi.innourl.com",
				"PAGEAPI": "https://eapapi.innourl.com",
				"RESOURCEAPI": "https://eapapi.innourl.com",
				"CONSULTANTAPI": "https://eapapi.innourl.com",
				"COMMONAPI": "https://eapapi.innourl.com",
				"SUPERVISIONAPI": "https://eapapi.innourl.com",
				"SUPERVISORAPI": "https://eapapi.innourl.com",
				"WARNINGAPI": "https://eapapi.innourl.com",
				"ARCHIVESAPI": "https://eapapi.innourl.com",
				"COMMISSIONERAPI": "https://eapapi.innourl.com",
				"PSYSERVICEAPI": "https://eapapi.innourl.com",
				"GAMEAPI": "https://eapapi.innourl.com",
				"AUTHAPI": "https://eapapi.innourl.com",
				"TREEHOLEAPI": "https://eapapi.innourl.com",
				"FUNTESTAPI": "https://eapapi.innourl.com",
				"SPECIALSECTIONAPI": "https://eapapi.innourl.com",
				"EXAMAPI": "https://eapapi.innourl.com",
				"COURSEAPI": "https://eapapi.innourl.com",
				"PLATFORM-SUPPLIERAPI": "https://eapapi.innourl.com/platform",
				"PLATFORM-WECHATAPI": "https://eapapi.innourl.com/platform",
				"PLATFORM-USERAPI": "https://eapapi.innourl.com/platform",
				"PLATFORM-PAGEAPI": "https://eapapi.innourl.com/platform",
				"PLATFORM-CUSTOMER": "https://eapapi.innourl.com/platform",
			}
		},
		prod: {
			appType: "eap",
			staticConfig: "https://shximage.innourl.com/v/asset/eap/general/static",
			"apiDomain": {
				"LOGAPI": "https://shxpsyvsapi.innourl.com/eap",
				"USERAPI": "https://shxeapapi.innourl.com",
				"REGAPI": "https://shxeapapi.innourl.com",
				"WECHATAPI": "https://shxeapapi.innourl.com",
				"EDEAPI": "https://shxeapapi.innourl.com",
				"EVALUATEAPI": "https://shxeapapi.innourl.com",
				"PAGEAPI": "https://shxeapapi.innourl.com",
				"RESOURCEAPI": "https://shxeapapi.innourl.com",
				"CONSULTANTAPI": "https://shxeapapi.innourl.com",
				"COMMONAPI": "https://shxeapapi.innourl.com",
				"SUPERVISIONAPI": "https://shxeapapi.innourl.com",
				"SUPERVISORAPI": "https://shxeapapi.innourl.com",
				"WARNINGAPI": "https://shxeapapi.innourl.com",
				"ARCHIVESAPI": "https://shxeapapi.innourl.com",
				"COMMISSIONERAPI": "https://shxeapapi.innourl.com",
				"PSYSERVICEAPI": "https://shxeapapi.innourl.com",
				"GAMEAPI": "https://shxeapapi.innourl.com",
				"AUTHAPI": "https://shxeapapi.innourl.com",
				"TREEHOLEAPI": "https://shxeapapi.innourl.com",
				"FUNTESTAPI": "https://shxeapapi.innourl.com",
				"SPECIALSECTIONAPI": "https://shxeapapi.innourl.com",
				"EXAMAPI": "https://shxeapapi.innourl.com",
				"COURSEAPI": "https://shxeapapi.innourl.com",
				"PLATFORM-SUPPLIERAPI": "https://shxeappltapi.innourl.com",
				"PLATFORM-WECHATAPI": "https://shxeappltapi.innourl.com",
				"PLATFORM-USERAPI": "https://shxeappltapi.innourl.com",
				"PLATFORM-PAGEAPI": "https://shxeappltapi.innourl.com",
				"PLATFORM-CUSTOMER": "https://shxeappltapi.innourl.com"
			}
		}

	},
	// 英朗
	SUPPLIER_INNO: {
		dev: {
			appType: "eap",
			staticConfig: "https://psyimage.innourl.com/v/asset/eap/general/static",
			"apiDomain": {
				"LOGAPI": "https://ylpsyvsapi.innourl.com/eap",
				"USERAPI": "https://eapapi.innourl.com",
				"REGAPI": "https://eapapi.innourl.com",
				"WECHATAPI": "https://eapapi.innourl.com",
				"EDEAPI": "https://eapapi.innourl.com",
				"EVALUATEAPI": "https://eapapi.innourl.com",
				"PAGEAPI": "https://eapapi.innourl.com",
				"RESOURCEAPI": "https://eapapi.innourl.com",
				"CONSULTANTAPI": "https://eapapi.innourl.com",
				"COMMONAPI": "https://eapapi.innourl.com",
				"SUPERVISIONAPI": "https://eapapi.innourl.com",
				"SUPERVISORAPI": "https://eapapi.innourl.com",
				"WARNINGAPI": "https://eapapi.innourl.com",
				"ARCHIVESAPI": "https://eapapi.innourl.com",
				"COMMISSIONERAPI": "https://eapapi.innourl.com",
				"PSYSERVICEAPI": "https://eapapi.innourl.com",
				"GAMEAPI": "https://eapapi.innourl.com",
				"AUTHAPI": "https://eapapi.innourl.com",
				"TREEHOLEAPI": "https://eapapi.innourl.com",
				"FUNTESTAPI": "https://eapapi.innourl.com",
				"SPECIALSECTIONAPI": "https://eapapi.innourl.com",
				"EXAMAPI": "https://eapapi.innourl.com",
				"COURSEAPI": "https://eapapi.innourl.com",
				"PLATFORM-SUPPLIERAPI": "https://eapapi.innourl.com/platform",
				"PLATFORM-WECHATAPI": "https://eapapi.innourl.com/platform",
				"PLATFORM-USERAPI": "https://eapapi.innourl.com/platform",
				"PLATFORM-PAGEAPI": "https://eapapi.innourl.com/platform",
				"PLATFORM-CUSTOMER": "https://eapapi.innourl.com/platform",
			}
		},
		prod: {
			appType: "eap",
			staticConfig: "https://psyimage.innourl.com/v/asset/eap/general/static",
			"apiDomain": {
				"LOGAPI": "https://ylpsyvsapi.innourl.com/eap",
				"USERAPI": "https://psyapi.innourl.com",
				"REGAPI": "https://psyapi.innourl.com",
				"WECHATAPI": "https://psyapi.innourl.com",
				"EDEAPI": "https://psyapi.innourl.com",
				"EVALUATEAPI": "https://psyapi.innourl.com",
				"PAGEAPI": "https://psyapi.innourl.com",
				"RESOURCEAPI": "https://psyapi.innourl.com",
				"CONSULTANTAPI": "https://psyapi.innourl.com",
				"COMMONAPI": "https://psyapi.innourl.com",
				"SUPERVISIONAPI": "https://psyapi.innourl.com",
				"SUPERVISORAPI": "https://psyapi.innourl.com",
				"WARNINGAPI": "https://psyapi.innourl.com",
				"ARCHIVESAPI": "https://psyapi.innourl.com",
				"COMMISSIONERAPI": "https://psyapi.innourl.com",
				"PSYSERVICEAPI": "https://psyapi.innourl.com",
				"GAMEAPI": "https://psyapi.innourl.com",
				"AUTHAPI": "https://psyapi.innourl.com",
				"TREEHOLEAPI": "https://psyapi.innourl.com",
				"FUNTESTAPI": "https://psyapi.innourl.com",
				"SPECIALSECTIONAPI": "https://psyapi.innourl.com",
				"EXAMAPI": "https://psyapi.innourl.com",
				"COURSEAPI": "https://psyapi.innourl.com",
				"PLATFORM-SUPPLIERAPI": "https://eappltapi.innourl.com",
				"PLATFORM-WECHATAPI": "https://eappltapi.innourl.com",
				"PLATFORM-USERAPI": "https://eappltapi.innourl.com",
				"PLATFORM-PAGEAPI": "https://eappltapi.innourl.com",
				"PLATFORM-CUSTOMER": "https://eappltapi.innourl.com"
			}
		}

	},
}