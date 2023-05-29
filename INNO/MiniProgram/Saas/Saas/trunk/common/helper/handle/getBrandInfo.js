//
import { TabKeys } from "../../manager/log-map.js" 
class BrandInfo{
  static getInstance() {
    if (!BrandInfo.instance) {
      BrandInfo.instance = new BrandInfo();
    }
    return BrandInfo.instance;
  }
  constructor() {
    if(!this._brandInfo){
      this._brandInfo = this.getBrandInfo();
    }
  }
  //获取ext配置
  getExtConfig() {
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    return extConfig;
  }
  //
  getBrandInfo() {
    let extConfig = this.getExtConfig();
    return extConfig;
  }
  tabbarHandle(extConfig = {}){
    let tabbar_list = extConfig.tabbar_list || [];
    if (tabbar_list && tabbar_list.length > 0){
      let icon_url = extConfig.icon_url;
      for (let i = 0; i < tabbar_list.length; i++) {
        let item = tabbar_list[i] || {};
        let pagePath = item.pagePath || "";
        if (!pagePath) continue;
        let icons = {};
        switch (TabKeys[pagePath]) {
          case "home":
            icons = {
              "is_enable":"on",
              "iconPath": icon_url + "micro_mall/tabbar/main/Homes.png",
              "selectedIconPath": icon_url + "micro_mall/tabbar/main/getHomes.png"
            }
            break;
          case "classify":
            icons = {
              "is_enable":"on",
              "iconPath": icon_url + "micro_mall/tabbar/main/Classify.png",
              "selectedIconPath": icon_url + "micro_mall/tabbar/main/getClassify.png"
            }
            break;
          case "grass":
            icons = {
              "is_enable":"on",
              "iconPath": icon_url + "micro_mall/tabbar/main/Grass.png",
              "selectedIconPath": icon_url + "micro_mall/tabbar/main/getGrass.png"
            }
            break;
          case "videoShopping":
            icons = {
              "is_enable":"on",
              "iconPath": icon_url + "micro_mall/tabbar/main/videoShop.png",
              "selectedIconPath": icon_url + "micro_mall/tabbar/main/getVideoShop.png"
            }
            break;
          case "shoppingCart":
            icons = {
              "is_enable":"on",
              "iconPath": icon_url + "micro_mall/tabbar/main/Carts.png",
              "selectedIconPath": icon_url + "micro_mall/tabbar/main/getCarts.png"
            }
            break;
          case "userCenter":
            icons = {
              "is_enable":"on",
              "iconPath": icon_url + "micro_mall/tabbar/main/Users.png",
              "selectedIconPath": icon_url + "micro_mall/tabbar/main/getUsers.png"
            }
            break;
          case "liveCustom":
              icons = {
                "is_enable":"on",
                "iconPath": icon_url + "micro_mall/tabbar/main/liveCustom.png",
                "selectedIconPath": icon_url + "micro_mall/tabbar/main/getLiveCustom.png"
              }
              break;
          case "huiyou" :  
            icons = {
              "is_enable":"on",
              "iconPath": icon_url + "micro_mall/tabbar/main/huiyou.png",
              "selectedIconPath": icon_url + "micro_mall/tabbar/main/getHuiyou.png"
            }
            break;
          case "huiyou_user_center" :  
            icons = {
              "is_enable":"on",
              "iconPath": icon_url + "micro_mall/tabbar/main/Users.png",
              "selectedIconPath": icon_url + "micro_mall/tabbar/main/getUsers.png"
            }
            break;
          default:
            break;
        }
        tabbar_list[i] = {
          ...item,
          ...icons,
          id: TabKeys[pagePath]
        }
      }
      extConfig.tabbar_list = tabbar_list
    }
    return extConfig
  }
  get BInfo(){
    return this._brandInfo || null
  }
}
export default BrandInfo.getInstance();