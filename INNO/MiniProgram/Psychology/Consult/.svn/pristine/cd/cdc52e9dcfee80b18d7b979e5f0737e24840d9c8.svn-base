import brandConfig from "./brand.config.js";
import setConfig from "./setConfig.js";
let config = {
	env: 'dev', // 环境:dev, prod, test （h5的环境下，只填写dev 就可以，可以根据域名来判断）
	log: true,
	brandCode: 'SURVEY_INNO', // SURVEY_GZHG,中华人民共和国广州海关;SURVEY_SXFW,上馨心理咨询中心; SURVEY_INNO,英朗企业eap;SURVEY_GDHD,省航道;
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
