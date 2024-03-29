import brandConfig from "./brand.config.js";
import setConfig from "./setConfig.js";
let config = {
	env: 'prod', // 环境，分dev, prod, test （h5的环境下，只填写dev 就可以，可以根据域名来判断）
	log: true,
	supplierCode :"SUPPLIER_INNO", //英朗,SUPPLIER_INNO_PLAT //上馨,SUPPLIER_SX
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
};
// #ifdef H5
config.platformSrc = "H5"
// #endif
// #ifdef MP
config.platformSrc = "WXAPP"
// #endif
config = setConfig(config, brandConfig);
export default config;
