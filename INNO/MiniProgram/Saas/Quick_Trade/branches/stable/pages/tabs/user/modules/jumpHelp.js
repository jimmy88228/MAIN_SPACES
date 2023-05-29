const App = getApp();
class JumpHelp {
  static getInstance() {
    if (!JumpHelp.instance) {
      JumpHelp.instance = new JumpHelp();
    }
    return JumpHelp.instance;
  }
  constructor() {
    this._keyPath = {
      information:"/pages/tabs/user/update_avatar/update_avatar", 
    }
  }
  get linkMap(){
    return this._keyPath || {};
  }
  jump(item={}){
    item || (item = {});
    let url = item.url||this._keyPath[item.key]||"";
    if(url){
      wx.navigateTo({
        url
      })
    }else{
      App.SMH.showToast({
        title:"敬请期待"
      })
    } 
  }
}

export default JumpHelp.getInstance();