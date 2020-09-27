const accountInfo = wx.getAccountInfoSync();
const envVersion = accountInfo && accountInfo.miniProgram && accountInfo.miniProgram.envVersion;
const debug = envVersion === "trial" || envVersion === "develop";
module.exports = {
    BRAND_CODE: "IT",
    PAGE_SIZE: 30,
    MINI_PROGRAM_QRCODE: "/static/images/common/promini_code.jpg",
    IS_DEBUG: debug,
    APPIDS: { ESHOP: "wxe420e95216e5aa6c" }
};
