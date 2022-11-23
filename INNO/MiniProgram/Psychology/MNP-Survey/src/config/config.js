import brandConfig from "./brand.config.js";
import setConfig from "./setConfig.js";
let config = {
	env: 'prod', // 环境，分 dev, prod, test （h5的环境下，只填写dev 就可以，可以根据域名来判断）
	log: true,
	clickLimitTime: 2000, // 连续点击 毫秒
	PAGE_SIZE:20,
	isWeixinH5() {
		let ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	}
};
let installConfig = {};
config.platformCode = "SURVEY_INNO"; // 上馨(SHANG_XIN),英朗(SURVEY_INNO),超算(CHAO_SUAN),英朗测试(SURVEY_INNO  dev):平台信息（包括配置平台的请求域名，图片域名）
// #ifdef H5
config.platformSrc = "H5"
installConfig = setConfig(config, brandConfig);
// #endif
// #ifdef MP
config.appCode = 'SURVEY_INNO'; // 白云区青少年(上馨):SURVEY_GZBY, 英朗:SURVEY_INNO //街道版:SURVEY_INNO_STREET //独立版测试环境:SURVEY_INNO_THXX //独立版:SURVEY_INNO_SCHOOL //英朗区版 SURVEY_INNO_THQ // 超算 CS 全科(超算)SURVEY_QKTY  穗心(超算)SURVEY_QKGZ 昌岗(超算) SURVEY_CG_STREET
config.platformSrc = "WXAPP";
installConfig = setConfig(config, brandConfig);
// #endif
//
export default installConfig;
