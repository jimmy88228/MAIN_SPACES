import Util from "./common/utils/util";
import BaseOptions from "./config/config";
import GetSetConfig from "./config/getConfig"; //dev,prod

const brand = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
const BRAND_CODE = "INNOVATION";
const ICON_NAME = ""; //可传空
const Set_Config = {
    brandCode: BRAND_CODE,
    iconFileName: ICON_NAME,
    PLATFORM: {
        TYPE: "INTERACT",
    }
}
const config = Util.merge(BaseOptions, GetSetConfig(Set_Config));
console.log('configconfig',config)
// const config = Util.merge(BaseOptions, GetSetConfig(Set_Config), brand);
export default config;