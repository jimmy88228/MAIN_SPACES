class retainSessionManage {
  static getInstance() {
    if (!retainSessionManage.instance) {
      retainSessionManage.instance = new retainSessionManage();
    }
    return retainSessionManage.instance;
  }
  constructor() {
    //短暂切换为后台模式
    this.beforeBack = {
      shortHome: false, // 是否短暂后台模式
      shortPath: '',
    }
  }
  /**
   * 判断是否保留js全局变量中进入参数  标准：
   * 页面路径： 进入页面是否与退出前页面路劲一致
   * option: 场景值： 进入页面是否与退出前场景值一致
   * 标识： 是否为短暂切换后台模式
   * barCodeId | sence： 二维码解析的参数存在，则视为一次新的会话
   * option.query：customChannel：是否与上一次一致
   * 
   * 逻辑仍需调整，
  */
  isCoverSession(appOps, prevOps){
    appOps = appOps || {};
    prevOps = prevOps || {};
    let appQuery = appOps.query || {};
    let prevQuery = prevOps.query || {};
    let beforeBack = JSON.parse(JSON.stringify(this.beforeBack)) || {};
    this.saveRetainSession();
    console.log("before saveRetainSession", beforeBack);
    // 存在扫码进入
    if(appQuery.barCodeId || appQuery.scene){
      return true;
    }
    console.log("通过验证扫码进入")
    // 存在短暂切换后台模式
    if(!beforeBack.shortHome){
      return true;
    }
    console.log("通过验证临时后台切换")
    // 路径是否相同
    if(!beforeBack.shortPath || beforeBack.shortPath != appOps.path){
      return true;
    }
    console.log("通过验证路径")
    // 场景值是否保持一致
    if(appOps.scene != prevOps.scene){
      return true;
    }
    console.log("通过验证场景值")
    // 自定义渠道是否一致
    // if(prevQuery.customChannel && (appQuery.customChannel != prevQuery.customChannel)){
    //   return true;
    // }
    // console.log("通过验证自定义渠道")
    return false;
  }
  saveRetainSession(config){
    config = config || {};
    this.beforeBack.shortPath = config.shortPath || '';
    this.beforeBack.shortHome = config.shortHome || false;
  }

  

}


export default retainSessionManage.getInstance();
