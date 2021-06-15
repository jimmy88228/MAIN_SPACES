const BrandConf = {
    INNOVATION: "TES",
}
const INNOVATION = {
    "UseBrandBgColor": 1,
    "brand_name": "活动矩阵测试",
    "brand_name_en": "TES",
    "BRAND_CODE": "INNOVATION",
    "is_onlyUserCenter": 0,
    "icon_url": "https://devimgtest.innourl.com/wechat_applet_image/icon/KINGCODE/",
    "logo_path": "https://devimgtest.innourl.com/wechat_applet_image/icon/KINGCODE/",
    "default_icon_url": "https://devimgtest.innourl.com/wechat_applet_image/icon/default/",
    "uploadImgUrl": "https://devimgtest.innourl.com/ImgManager/ImgUpload/UploadImage",
    "uploadMvUrl": "https://devimgtest.innourl.com/ImgManager/MvUpLoad/UploadMv",
    "videoUrl": "https://devimgtest.innourl.com/saas_image/",
    "webViewUrl": "https://devweb01.innourl.com",
    "webMh5Url": "https://devweb01.innourl.com/mh5/pages/home/jump",
    "webContactUrl": "http://devweb01.innourl.com/mobile/customer_service.php",
    "webSatffContactUrl": "http://devweb01.innourl.com/staff_wap/cs_service.php",
    "tagImg": "https://devimgtest.innourl.com/SAAS_IMAGE/",
    "style": {
        "font_color": "rgba(205,113,143,1)",
        "bg_color": "rgba(205,113,143,1)",
        "draw_color":"rgba(240,87,15,1)"
    },
    "tabbar_list": [],
    "api_domain": {
        REG_DOMIN: 'https://developtest.innourl.com/MatrixLotteryApi',
        GOODS_DOMIN: 'https://developtest.innourl.com/MatrixLotteryApi',
        LOTTERY_DOMIN: 'https://developtest.innourl.com/MatrixLotteryApi',
        MATRIX_DOMIN: 'https://developtest.innourl.com/MatrixLotteryApi',
    },
}


function getSetConfig(config = {}) {
    let brandConfig = config || {};
    if (brandConfig.brandCode == 'INNOVATION') {
        brandConfig = {
            ...config,
            ...INNOVATION
        };
    }
    brandConfig.LOG = config.debug || false;
    if (config.brandCode) {
        brandConfig.brand_name_en = config.brandCode;
        brandConfig.BRAND_CODE = config.brandCode;
        config.iconFileName = config.iconFileName || BrandConf[brandConfig.BRAND_CODE] || "";
    }
    if (config.iconFileName) {
        brandConfig.iconFileName = config.iconFileName;
        config.iconFileName = config.iconFileName;
        let icon_url = brandConfig.icon_url;
        let index1 = icon_url.lastIndexOf("/", icon_url.lastIndexOf("/") - 1);
        brandConfig.icon_url = icon_url.substring(0, index1 + 1) + config.iconFileName + "/";
        let logo_path = brandConfig.logo_path;
        let index2 = logo_path.lastIndexOf("/", logo_path.lastIndexOf("/") - 1);
        brandConfig.logo_path = logo_path.substring(0, index2 + 1) + config.iconFileName + "/";
    }
    return brandConfig;
}
export default getSetConfig;