import brandConfig from "./brand.config.js";
import setConfig from "./setConfig.js";
let config = {
	env: 'prod', // 环境，分 dev, prod, test （h5的环境下，只填写dev 就可以，可以根据域名来判断）
	log: true,
	platformSrc: 'WXAPP',
	clickLimitTime: 2000, // 连续点击 毫秒
	PAGE_SIZE:20,
	isVisitor: true,
	isWeixinH5() {
		let ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},
	// getBrandCode() {
	// 	let brandCode = '';
	// 	// #ifdef MP
	// 	brandCode = this.brandCode || '';
	// 	// #endif
	// 	// #ifdef APP-PLUS
	// 	brandCode = this.brandCode || '';
	// 	// #endif
	// 	// #ifdef H5
	// 	brandCode = uni.getStorageSync('brandCode');
	// 	// #endif
	// 	return brandCode;
	// }
};
let installConfig = {};
config.platformCode = "SURVEY_INNO"; // 上馨(SHANG_XIN),英朗(SURVEY_INNO),超算(CHAO_SUAN),英朗测试(SURVEY_INNO  dev):平台信息（包括配置平台的请求域名，图片域名）
// #ifdef H5
config.platformSrc = "H5";
installConfig = setConfig(config, brandConfig);
// #endif
// #ifdef MP
config.appCode = 'INNO_SXL_CMT'; // INNO_SXL_CMT: 穗心理青少年关爱 (// SURVEY_CMT_GZBY,白云区居民心理, SURVEY_CMT_INNO,英朗企业eap, SXCMT_INNO 上馨环境测试小程序)
config.platformSrc = "WXAPP";
installConfig = setConfig(config, brandConfig);
// #endif
export default installConfig;
