class tabbarManager {
  static getInstance() {
    if (!tabbarManager.instance) {
      tabbarManager.instance = new tabbarManager();
    }
    return tabbarManager.instance;
  }
  constructor() {
    this._tabbarKey = {};
    this._tabbarData = [{
      "pagePath": "pages/index/index",
      "iconPath": "/static/images/tabbar/Homes.png",
      "selectedIconPath": "/static/images/tabbar/getHomes.png",
      "key": "index",
      "text": "上馨心理"
    }, {
      "pagePath": "pages/platform-index/platform-index",
      "homePath": "/static/images/tabbar/home.png",
      "iconPath": "static/images/tabbar/Report.png",
      "selectedIconPath": "/static/images/tabbar/getReport.png",
      "key": "platformIndex",
      "text": "测评"
    },
    {
      "pagePath": "pages/user/user",
      "iconPath": "/static/images/tabbar/Users.png",
      "selectedIconPath": "/static/images/tabbar/getUsers.png",
      "key": "userCenter",
      "text": "我的"
    }]
    this.initTabrbar();
  }
  get tabbarKey(){
    return this._tabbarKey || {};
  }
  get tabbarData(){
    return this._tabbarData || [];
  }
  initTabrbar(){
    let _tabbarData = this._tabbarData || [];
    let _tabbarKey = {}
    for(let i = 0; i < _tabbarData.length; i++){
      let item = _tabbarData[i] || {};
      _tabbarKey[item.pagePath] = item.key
    }
    this._tabbarKey = _tabbarKey
  }
  setTabbarData(data){
    if(data instanceof Array){
      this._tabbarData = data;
    }
  }

}

export default tabbarManager.getInstance();