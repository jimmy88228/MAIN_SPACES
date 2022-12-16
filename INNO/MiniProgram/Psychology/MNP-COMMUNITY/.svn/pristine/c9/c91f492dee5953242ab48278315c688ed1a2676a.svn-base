import brandConfig from "./brand.config.js";
import setConfig from "./setConfig.js";
let config = {
	env: 'dev', // 环境，分 dev, prod, test （h5的环境下，只填写dev 就可以，可以根据域名来判断）
	log: true,
	brandCode: 'SURVEY_CMT_INNO',  // SURVEY_CMT_GZBY,白云区居民心理, SURVEY_CMT_INNO,英朗企业eap, SXCMT_INNO 上馨环境测试小程序, HZ_CMT 海珠心理关爱 , INNO_CMT (cs)英朗心理关爱
	platformSrc: 'WXAPP',
	clickLimitTime: 2000, // 连续点击 毫秒
	PAGE_SIZE:20,
	isWeixinH5() {
		let ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		} 
	},
	getBrandCode() {
		let brandCode = '';
		// #ifdef MP
		brandCode = this.brandCode || '';
		// #endif
		// #ifdef APP-PLUS
		brandCode = this.brandCode || '';
		// #endif
		// #ifdef H5
		brandCode = uni.getStorageSync('brandCode');
		// #endif
		return brandCode;
	}
};
// #ifdef H5
config.platformSrc = "H5"
// #endif
// #ifdef MP
config.platformSrc = "WXAPP"
// #endif
config = setConfig(config, brandConfig);
export default config;
