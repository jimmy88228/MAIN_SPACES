const accountInfo = wx.getAccountInfoSync();
const envVersion = accountInfo && accountInfo.miniProgram && accountInfo.miniProgram.envVersion;
const debug = envVersion === "trial" || envVersion === "develop";
console.log('envVersion',envVersion)
module.exports = {
    BRAND_CODE: "INNOVATION",
    PAGE_SIZE: 30,
    MINI_PROGRAM_QRCODE: "/static/images/common/promini_code.jpg",
    IS_DEBUG: debug,
    APPIDS: { ESHOP: "wxe420e95216e5aa6c" },
    LOGIN_VERSION:'',
    "style": {
        "font_color": "rgba(205,113,143,1)",
        "bg_color": "rgba(205,113,143,1)", 
    },
    "icon_url": "https://devimgtest.innourl.com/wechat_applet_image/icon/KINGCODE/",
    "logo_path": "https://devimgtest.innourl.com/wechat_applet_image/icon/KINGCODE/",
    "default_icon_url": "https://devimgtest.innourl.com/wechat_applet_image/icon/default/",
};
