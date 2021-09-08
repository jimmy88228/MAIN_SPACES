// import Conf from "../../../conf";
// import { BrandApi } from "../../manager/http-manager.js"
import getSysConfig from "./getSystemConfig.js"
class tabbarManager {
  static getInstance() {
    if (!tabbarManager.instance) {
      tabbarManager.instance = new tabbarManager();
    }
    return tabbarManager.instance;
  }
  constructor() {
    this.initData();
  }
  initData(){
    this.iconSyscon = {
      index:{
        "iconPath": "/images/micro_mall/tabBar/Homes.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getHomes.png"
      },
      classifyPage:{
        "iconPath": "/images/micro_mall/tabBar/Classify.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getClassify.png"
      },
      shoppingCart:{
        "iconPath": "/images/micro_mall/tabBar/Carts.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getCarts.png"
      },
      userCenter:{
        "iconPath": "/images/micro_mall/tabBar/Users.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getUsers.png"
      },
      seedingGrass:{
        "iconPath": "/images/micro_mall/tabBar/Grass.png",
        "selectedIconPath": "/images/micro_mall/tabBar/getGrass.png"
      }
    }
  }
  settabBarStyle(obj = {}){
    wx.setTabBarStyle(obj);
  }
  initTabBarItem(){
    // this.getTabBarItem().then( data=>{
    //   this.setTabBarItem(data);
    // })
  }
  setTabBarItem(data){
    console.log(data);
    if(data){
      let j = 0;
      for(let i in data){
        let t_iconSys = this.iconSyscon[data[i].key];
        wx.setTabBarItem({
          index:j,
          text: data[i].name,
          iconPath: t_iconSys.iconPath,
          selectedIconPath: t_iconSys.selectedIconPath,
          success:function(){

          }
        })
        j++;
      }
    }
  }
  getTabBarItem(){
    return tabBarDataRequest.call(this);
  }
}
function tabBarDataRequest(){
 return getSysConfig("applet_bottom_menu").then(data=>{
    let tabBarData = "";
    if (data.Value){
      tabBarData = JSON.parse(data.Value);
      return Promise.resolve(tabBarData);
    }
    return Promise.reject();
  })
}

export default tabbarManager.getInstance();