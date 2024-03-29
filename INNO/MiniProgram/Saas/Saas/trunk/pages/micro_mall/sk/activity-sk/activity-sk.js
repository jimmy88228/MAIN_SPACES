// pages/micro_mall/sk/activity-sk.js
import MyDate from '../../../../common/support/utils/date-util.js';
import GetStatus from '../help/getStatus.js';
// import Promise from "../../../../libs/promise/promise";
import LgMg from "../../../../common/manager/log-manager";
import WxSub from "../../../../common/helper/handle/wxSubscribe.js";
import DrawTemplate from '../../goods/popup/help/template.js';
import {
  CountDown
} from "../../../../common/manager/timer-manager.js";
const PAGE_TYPE = "SECKILL_HELP";
const app = getApp();
const ActArrStatus = {  //state匹配->对比时间->开启倒计时/刷新
  1: { id: 1, name: "即将开始" },   //对比资格开发时间
  2: { id: 2, name: "抢资格中" },   //对比活动开始时间
  3: { id: 3, name: "活动进行中" }, //对比结束时间
  4: { id: 4, name: "已结束" }      //无
}
Page(app.BP({
  data: {
    ac_conf:app.Conf.style.n_sk_color,
    temp:[{},{}], 
    arr: [{}, {}, {}, {}, {}], 
    goodsList:[],
    percent:0,
    msgShow:{},
    jumpType: "custom",
    outsideComponents: { // 该页面的最外层容器的组件对象-解决层级问题用
      agreementPop: {confirmIsGetInfoBtn: true},
      getCouponsPop: {}
    }
    // loadText:"加载中"
  },
  acNum:0,
  cur_ac_id : 0,
  api:'SecKillApi',
  extra:{diy:true},
  onLoad: function (options) {
    getTpls.call(this);
    loadingAnim.call(this, true);
    let i_color = app.getColor(this.data.ac_conf.theme_color, 7, 167, 236, 1) || '';
    this.options = options; 
    this.setData({
      isLogin:app.LM.isLogin,
      i_color
    });
  },
  // onPageScroll(e){
  //   this.dynamic_btn && this.dynamic_btn.onScroll(e);
  // },
  onReady: function () {
  },
  onShow: function () {
    assembleOptions.call(this);
  },
  onHide: function () {
    this.isBack = 1;
    loadingAnim.call(this,false);
    unListen.call(this);
    stopCountDown.call(this);
  },
  onUnload: function () {
    loadingAnim.call(this,false);
    unListen.call(this);
    stopCountDown.call(this)
  },
  onShareAppMessage(e){
    let userInfo = app.LM.userInfo || {};
    // let staffInfo = this.staffInfo || app.LM.staffInfo;
    // let realName = staffInfo.isStaffDstbData ? '' : userInfo.realName;
    let realName = userInfo.realName || "";
    let title = realName + (this.activityInfo.shareTitle || "@你 秒杀助力分享");
    let groupId = this.options.groupId || 0;
    let imageUrl = this.activityInfo.shareImg || '';
    let target = 0;
    let shareType = ""
    if (e && e.from == 'button'){
      shareType = app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL; 
      target = app.LM.isLogin ? 1 : 0;
      goAction.call(this);
      share.call(this);
    }
    
    let path = `pages/micro_mall/sk/activity-sk/activity-sk?groupId=${groupId}&activityId=${this.cur_ac_id}&target=${target}`;
    return {
      shareType: shareType,
      isCustom:true,
      title: title,
      path: path,
      imageUrl: imageUrl , 
    }
  },
  registerBack(e){
    this.setData({
      isLogin:app.LM.isLogin
    })
    app.SMH.showToast({
      title:"授权成功，请重新操作",
      duration:3000
    });
  },
  handle_tab(e){
    // console.log('当前',e&&e.detail);
    let detail = e && e.detail || {};
    this.cur_ac_id = detail.acId || 0;
    init.call(this);
    onLoadEvent.call(this,{upDate:true}); 
  }, 
  help() {
    if(this.targetProgress&&this.targetProgress.canHelp == 0){
      catchTips.call(this,{},"该活动仅限新用户参与助力",3000)
      return;
    }
    let params = {
      activityId: this.cur_ac_id,
      target: this.options.fromUser,
      own: app.LM.userToken,
      clientSessionId: LgMg.channel.clientSessionId || ""
    }
    // console.log('帮助力', params)
    //进度
    loadData.call(this, 'post', this.api, 'helpTarget', params, this.extra).then(res => {
      upDateFriend.call(this); 
    }).catch(e=>{
      catchTips.call(this,e,'助力异常');
      setTimeout(()=>{
        upDateFriend.call(this); 
      },400)
    })
  },
  onReachBottom: function () {
    if (!this.cur_ac_id) return
    //商品列表 getGoodsList
    // this.goods_list_id = this.goods_list_id || this.selectComponent('#goods_list_id');
    // this.goods_list_id && this.goods_list_id.loadData(this.cur_ac_id);
    getGoodsList.call(this,true);
  },
  jump(e){
    let dataset = e.currentTarget.dataset || {};
    let type = dataset.type || '';
    let url = dataset.url || '';
    let that = this;
    if(type=='rule'){
      app.globalData.ruleInfo = this.data.activityInfo.rules || '';
      wx.nextTick(()=>{
        wx.navigateTo({
          url: `${url}?activityId=${that.cur_ac_id}`,
        })
      })
    }
  },
  handle_friends(e){
    if (!this.friends_arr || this.friends_arr.length==0){
      let params = {};
      params = {
        activityId: this.cur_ac_id,
        userToken: app.LM.userToken
      }
      loadData.call(this, 'get', this.api, 'getFriends', params, this.extra).then(res => {
        this.friends_arr = res.data || [];
        this.friends = this.friends || this.selectComponent('#friends');
        this.friends.init(res && res.data || [], this.progress.now || 0);
      }) 
    }else{
      this.friends = this.friends || this.selectComponent('#friends');
      this.friends.init(this.friends_arr, this.progress.now || 0);
    }
  },
  handle_tip(e){
    let dataset = e.currentTarget.dataset || {};
    let type = dataset.type || '';
    if (type =='grade'){
      tipGradeAnim.call(this);
    }else if(type =='gradeToast'){
      app.SMH.showToast({
        title: `该活动只对特定会员开放`
      })
    }
  },
  img_load(e){
    this.setData({
      img_show:true
    })
  },
  /**
   * ---------分销
   */
  getShare() {
    this.shareModule = this.shareModule || this.selectComponent("#shareModule");
    this.shareModule.checkIfStaffDstb();
    getActTpls.call(this);
  },
  chooseShareType(data) {
    let goods_info = {}
    let detail = data.detail;
    this.shareImg = this.shareImg || this.selectComponent("#shareImg");
    let opKind = app.OpKind[PAGE_TYPE] || app.OpKind.NORMAL;
    let shareType = app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL;
    goods_info.opKind = opKind;
    goods_info.title1 = "考验真正友情的时刻到了";
    goods_info.title2 = "帮好友助力抢秒杀资格";
    let staffCode = detail.shareId == 3 ? detail.staffInfo.staffCode : "";
    initTemplate.call(this, goods_info, staffCode);
    let allData = {
      info: {
        goodsInfo: goods_info,
        imgUrl: this.activityInfo.shareImg,
        opKind: opKind,
      },
      scene: {
        "activityId": this.cur_ac_id,
        "target": app.LM.isLogin ? 1 : 0,
        "groupId": this.options.groupId,
        "shareType": shareType,
        "staffCode": detail.shareId == 3 ? detail.staffInfo.staffCode : ""
      },
      draw: {
        diy: true,
        drawArr: this.drawArr,
        baseInfo: {
          canvasW: 600,
          canvasH: 900,
          background: '#fff',
          codeDiy: true
        }
      }
    }
    this.staffInfo = detail.staffInfo
    this.setData({
      allData: allData
    })
    this.shareImg.show();
  },
  checkIfStaffDstbCallBack(data) {
    let detail = data.detail;
    this.staffInfo = detail.staffInfo
  },
  wxSubCallback(e){
    let that = this;
    let detail = e.detail || {};
    let subResult = detail.subResult || {};
    let actTplsList = this.data.actTplsList || [];
    let reqList = [];
    let acSubScribe = this.data.acSubScribe || {};
    for (let i = 0; i < actTplsList.length; i++){
      let wxTplId = actTplsList[i].wxTplId || "";
      let tplType = actTplsList[i].tplType || ""
      reqList.push({
        tplType: tplType,
        activityId: this.cur_ac_id,
        goodsId:0,
        brandTplId: actTplsList[i].brandTplId,
        state: subResult[wxTplId]
      })
      if (subResult[wxTplId]) {
        acSubScribe[tplType] = WxSub.SubStatus[subResult[wxTplId]]
      }
    }
    this.setData({
      acSubScribe
    })
    WxSub.setSubscribe(reqList, detail.setSub,"SECKILL").then(()=>{
      that.setData({
        "activityInfo.isSubscribe": detail.setSub
      }) 
    });
  },
  updateSubState(e){
    let SubScribe = this.data.SubScribe || {};
    let detail = e.detail ||{};
    let data = detail.subResult || {};
    let update = false;
    for (let item in data){
      if (item =='errMsg')continue
      let subState = WxSub.SubStatus[data[item]];
      console.log(this.tplsListObj[item].tplType, SubScribe[this.tplsListObj[item].tplType], subState);
      if (SubScribe[this.tplsListObj[item].tplType] != subState ){
        SubScribe[this.tplsListObj[item].tplType] = subState;
        update = true;
      }
    }
    console.log('刷新', update, SubScribe)
    if(update){
      this.setData({
        SubScribe
      })
    } 
  } 
}))
function getTpls(){
  WxSub.getTpls("SECKILL").then(data=>{
    if (data && data.length > 0){
      this.tplsList = data || [];
      this.tplsListObj = createObjKeyVal.call(this, this.tplsList,'wxTplId');
      console.log('this.tplsListObj', this.tplsListObj)
    }
    return Promise.resolve(data)
  });
}
function setGoodsTpls(){
  let tplsList = this.tplsList || [];
  console.log('tplsList', tplsList);
  let activityInfo = this.data.activityInfo;
  let goodsTplsList = [];
  for (let i = 0; i < tplsList.length; i++){
    if (tplsList[i].tplType != "SECKILL_LAUNCH_SUCC") {  //去除LAUNCH
      if (!(activityInfo.state == 2 && tplsList[i].tplType == "SECKILL_READY")) { //去除抢资格中的ready（只有在sate为1，即资格开抢之前才显示ready）。start是1、2都可以显示
        goodsTplsList.push(tplsList[i]);
      }
    }
  }
  console.log('goodsTplsList', goodsTplsList);
  this.setData({
    goodsTplsList: goodsTplsList,
    tplsListObj: this.tplsListObj
  })
}
function getActTpls(){
  let tplsList = this.tplsList || [];
  console.log('tplsList', tplsList)
  let actTplsList = []
  let activityInfo = this.data.activityInfo;
  if (activityInfo.state == 2 || activityInfo.state == 3) {
    for (let i = 0; i < tplsList.length; i++) {
      if (tplsList[i].tplType != "SECKILL_READY") { //活动没有ready
        if (!(activityInfo.state == 3 && tplsList[i].tplType == "SECKILL_START")) { //活动进行中就去除start。state 1、2都能显示start
          actTplsList.push(tplsList[i]);
        }
      }
    }
    console.log('actTplsList', actTplsList)
    this.setData({
      actTplsList: actTplsList
    })
  }
}
function assembleOptions(){
  let scene = this.options.scene;
  if (scene) {
    app.SHP.getParams(["activityId", "groupId", "target", "staffCode","fromUser"]).then((params) => {
      this.options = {
        ...this.options,
        ...params
      }
      initParams.call(this, this.options);
    })
  } else {
    initParams.call(this, this.options);
  }
}
function initParams(ops){
  listen.call(this);
  iniTabbar.call(this);
  loadAcGroup.call(this).then(res => {
    initGroup.call(this, res, {}, !this.notFirst);
    this.notFirst = true;
  });
}
function loadAcGroup(){
  if (!this.data.groupId){
    this.setData({
      groupId: this.options.groupId || 0
    })
  } else if (this.activityList && this.activityList.length>0){
    // getGoodsList.call(this);
    return Promise.resolve(this.activityList);
  }

  let params = {
    groupId: this.options.groupId || 0,
    brandCode: app.Conf.BRAND_CODE || ''
  };
  let extra = {
    diy : true
  }
  return app.RunApi.go('SecKillApi','getActivityGroup',params,extra).then(res=>{
    if(res.code=='1'){
      this.activityList = res.data && res.data.activityList || [];
      if (!this.data.groupId){
        this.setData({
          groupId: res.data && res.data.groupId || 0
        })
      }
      return Promise.resolve(this.activityList); 
    }
    catchTips.call(this,res,"活动分组异常")
    loadingAnim.call(this, false);
    return Promise.reject();
  }).catch(error=>{
    catchTips.call(this,{},"暂无活动")
    loadingAnim.call(this, false);
  })
}

function initGroup(res = {}, params = {},reset=false) {
  if (reset || !this.cur_ac_id){
    sortActArrTime.call(this).then(_boolType => {
      let boolType = _boolType || {};
      let f_ac_id = res && res[0] && res[0].activityId || 0;
      this.nav_bar = this.nav_bar || this.selectComponent('#nav_bar');
      if (boolType.type == 'init' || boolType.type == 'invalid') {  //首次初始化活动 、 //当前活动失效
        this.cur_ac_id = boolType.initAcId || f_ac_id || this.options.activityId || 0;
        this.nav_bar && (this.nav_bar.init(this.cur_ac_id));
      } else {
        if (!this.first_init_nav) {
          this.first_init_nav = true;
          let initAcId = this.options.activityId || f_ac_id;
          this.nav_bar && (this.nav_bar.init(initAcId));
        }
        this.cur_ac_id = this.cur_ac_id || this.options.activityId || f_ac_id || 0; //正常刷新
      }
      // console.log('活动组', this.cur_ac_id, res);
      onLoadEvent.call(this, params || {});
    });
  }else{
    onShowEvent.call(this, params || {});
  }
  this.pageHome = this.pageHome || this.selectComponent("#pageHome")
  this.pageHome && this.pageHome.initPageHome();
}

function onShowEvent(carry_params={}) {  //统一调用函数
    logSession.call(this);
    let params = {}; 
    params = {
      activityId: this.cur_ac_id,
      userToken: app.LM.userToken
    }
    setDownTime.call(this, carry_params);//倒计时 
    //2进度
    let p2 = loadData.call(this, 'get', this.api, 'getProgress', params, this.extra).then(res => {
      getProgress.call(this, res);
      setActMsg.call(this); 
    }).catch(e => {
      setActMsg.call(this);
    })

    getGoodsList.call(this);

    showPage.call(this, [p2]).then(res => {
      //4检测是否分享进入、获取target信息
      checkFromFriend.call(this);
    })

    
}

function onLoadEvent(carry_params){
  let params = {};
  params = {
    activityId: this.cur_ac_id,
    brandCode: app.Conf.BRAND_CODE,
  }
  logSession.call(this);
  if(!this.cur_ac_id) {
    loadingAnim.call(this, false);
    catchTips.call(this, {}, '暂无活动');
    return Promise.reject();
  }
  //活动
  this.extra.diy = false;
  app.RunApi.go(this.api, 'getActivity', params, this.extra).then(resActData => {
    let p1 = getActivity.call(this, resActData).then(res => {
      setDownTime.call(this, carry_params);//倒计时 
      return Promise.resolve()
    }); 

    params = {
      activityId: this.cur_ac_id,
      userToken: app.LM.userToken
    }
    //2进度
    let p2 = loadData.call(this, 'get', this.api, 'getProgress', params, this.extra).then(res => {
      getProgress.call(this, res);
      setActMsg.call(this);
    }).catch(e => {
      setActMsg.call(this);
    })

    //3checkRank
    let p3 = loadData.call(this, 'get', this.api, 'checkUserRank', params, this.extra).then(res => {
      return checkUserRank.call(this, true);
    }).catch(e => {
      return checkUserRank.call(this, false);
    })  

    showPage.call(this, [p1, p2, p3]).then(res => {
      //4检测是否分享进入、获取target信息
      checkFromFriend.call(this);
    }) 

    //6商品列表 getGoodsList
    // this.goods_list_id = this.goods_list_id || this.selectComponent('#goods_list_id');
    // this.goods_list_id && this.goods_list_id.loadData(this.cur_ac_id, { init: true, layout: resActData.data.layoutType || "ONE", acState: this.activityInfo.state }).then(()=>{
    //   setGoodsTpls.call(this);
    // });
    getGoodsList.call(this);
    initAdsModle.call(this, resActData.data.advert);
    //
  }).catch(e => {
    loadingAnim.call(this, false);
    catchTips.call(this, e, '活动努力加载中...');
  });
}

function loadData(action = 'get', api = '', url = '', params = {}, extra = {}) {
  if (this.activityInfo && (this.activityInfo.state == 1 || this.activityInfo.state == 4 || (this.activityInfo.shareCondition == 0 && url !='checkUserRank')) || !this.data.isLogin){
    return Promise.reject();
  }
  return app.RunApi.go(action, api, url, params, extra).then(res => {
    if (res.code == '1') {
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  })
}

function getActivity(res){
  this.activityInfo = res.data || {}; 
  checkSubState.call(this, this.activityInfo);
  this.setData({
    activityInfo: this.activityInfo,
  });
  return Promise.resolve();
}

function getProgress(res){
  let data = res.data || {};
  this.progress = data;
  let percent = getPercent.call(this, data.now, data.target);
  this.setData({
    progress:res.data,
    percent
  }); 
}
function getGoodsList(isReachBottom){
  let loadConf = isReachBottom ? {} : {
    init: true, 
    layout: this.activityInfo.layoutType || "ONE",
    acState: this.activityInfo.state
}
  this.goods_list_id = this.goods_list_id || this.selectComponent('#goods_list_id');
  this.goods_list_id && this.goods_list_id.loadData(this.cur_ac_id, loadConf).then(()=>{
    setGoodsTpls.call(this);
  });
}

function checkUserRank(bool=false){
  if (!this.data.isLogin) {
    return Promise.resolve();
  }
  let checkUserRank = bool || false;
  this.setData({
    checkUserRank,
    showRankBtn:!checkUserRank
  })
  return Promise.resolve();
}

function getFriends(res){
  // this.setData({
  //   friends_arr : res.data || []
  // })
  return Promise.resolve(res.data)
} 

function setDownTime(params={}){
  let activityInfo = this.activityInfo || {};
  let state = activityInfo.state || 0;
  let startTime = MyDate.parse(activityInfo.serverTime || '') || '';
  let endTime = 0;
  let check = checkTime.call(this); //返回倒计时文案对象
  if (check.timeDown) {
    endTime = check.etime || 0;
  }
  // console.log(state,'开始 结束时间', startTime,endTime);
  stopCountDown.call(this);
  if(!startTime || !endTime)return
  if (!this.countDown || params && params.upDate) {
    // console.log('刷新stime');
    stopCountDown.call(this);
    this.countDown = new CountDown(startTime);
  }
  this.countDown.setTarget(endTime);
  setTime.call(this, this.countDown);
  if (!this.countDown.isRunning) {
    this.countDown.start(e => {
      if (e.value <= 0) {
        stopCountDown.call(this); 
        console.log('刷新时间')
        statusUpdate.call(this); 
      }
      setTime.call(this, e);
    });
  }
}

function sortActArrTime(){
  let activityList = this.activityList || [];
  let n_t = new Date();
  let state = 0;
  let exist = false;
  let initAcId = 0;
  let tempState = 0;
  let cur_ac_id = this.cur_ac_id || this.options.activityId 
  activityList.forEach(item=>{
    if (!cur_ac_id || (!exist && (item.activityId == cur_ac_id))){
      exist = true;
    }
    if (n_t < MyDate.parse(item.readyTime)){
      state = 1
    } else if (n_t >= MyDate.parse(item.endTime)) {
      state = 4;
    } else if (n_t < MyDate.parse(item.startTime)) {
      if (item.shareCondition > 0){
        state = 2;
      }else{
        state = 1;
      }
    } else {
      state = 3;
    }
    item.status = ActArrStatus[state];
    if ((!initAcId || tempState == 4 || (state > tempState && state != 4))){ //优先级选中显示：进行、抢资格、未开始、结束
      tempState = state;
      initAcId = item.activityId;
    }
  })
  this.setData({
    activityList: activityList,
  }); 
  if (!exist){
    console.log('活动失效', cur_ac_id);
    return Promise.resolve({ type: "invalid", initAcId});
  }else if (!cur_ac_id) { //自主进入没有options acId
    console.log('初始化活动', initAcId);
    return Promise.resolve({ type: "init", initAcId});
  }
  return Promise.resolve();
}
  
function listen(){
  if (app.LM.isLogin) {
    if(!this.data.isLogin){
      this.setData({
        isLogin: true
      });
    }
    return
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    this.setData({
      isLogin: app.LM.isLogin
    });
    onLoadEvent.call(this);
  });
}

function unListen() {
  app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
}

function stopCountDown() {
  if (this.countDown) {
    this.countDown.stop();
  }
}

function setTime(e) {
  let day = Math.floor(e.value / (60 * 60 * 24 * 1000));
  this.setData({
    time: e.format(day > 0 ? "dd天 HH:mm:ss" : "HH:mm:ss")
  }); 
} 

function statusUpdate(){
  onLoadEvent.call(this,{ upDate: true });
  // initGroup.call(this, res, { upDate: true });
}

function setActMsg(){
  let acInfo = this.activityInfo || {};
  let msgShow =  {};
  let progress = {}; 
  progress = this.progress || {};
  msgShow = GetStatus.getActMsg(acInfo, progress);  
  this.setData({
    msgShow: msgShow
  });
}

function share(){
  let params = {
    activityId:this.cur_ac_id,
    userToken: app.LM.userToken
  }
  loadData.call(this, 'post', this.api, 'addActivityLaunch', params, this.extra)
}
  
function checkFromFriend(){
  if (this.activityInfo && (this.activityInfo.state == 1 || this.activityInfo.state == 4 || this.check || this.activityInfo.shareCondition == 0))return
  // console.log('checkFromFriend', this.options.target, this.options.activityId, this.activityInfo.state);
  let check = checkToken.call(this);
  if (!check) return
  if (this.options.target == 1 && this.options.activityId && (this.options.activityId == this.cur_ac_id)) {
    upDateFriend.call(this).then(res=>{
      setTimeout(() => {
        app.SMH.showLoading({
          title: "加载中..."
        })
      }, 200)
      setTimeout(() => {
        app.SMH.hideLoading();
      }, 800)
      this.invited_sk = this.invited_sk || this.selectComponent('#invited_sk');
      setTimeout(() => {
        this.check = true;
        this.invited_sk.show();
      }, 1000)
    })
  }
}

function upDateFriend(){
  let params = {
    activityId: this.options.activityId || this.cur_ac_id || 0, //url活动id优先
    target: this.options.fromUser,
    own: app.LM.userToken,
  };
  let acInfo = {};
  let allAcInfo = this.activityInfo || {};
  acInfo.shareCondition = allAcInfo.shareCondition;
  acInfo.stime = allAcInfo.stime;
  return loadData.call(this, 'get', this.api, 'getTargetProgress', params, this.extra).then(res => {
    console.log('Target的进度', res.data);
    this.targetProgress = res.data;
    // console.log('当前checkUserRank', this.data.checkUserRank)
    this.invited_sk = this.invited_sk || this.selectComponent('#invited_sk');
    this.invited_sk.loadData(res.data || {}, acInfo || {}, this.data.checkUserRank);
    params = {
      brandCode: app.Conf.BRAND_CODE,
      userToken: this.options.fromUser || ""
    }
    getUserSimpleInfo.call(this, params)
  }).catch(e=>{
    if(!this.data.isLogin){
      getUserSimpleInfo.call(this).then(res=>{
        this.invited_sk = this.invited_sk || this.selectComponent('#invited_sk');
        this.invited_sk.loadData(res || {}, acInfo || {}, this.data.checkUserRank); 
      })
    }
  }); 
}

function showPage(arr){
  if(this.data.showPage){
    return Promise.resolve();
  }
  let p = new Promise((rs, rj) => {
    return Promise.all(arr).then(res => {
      rs(res);
    }).catch(e=>{
      rj(e);
    });
  });
  return p.finally((res)=>{
    loadingAnim.call(this, false);
    this.setData({
      showPage: true
    });
    return Promise.resolve();
  })
}


function checkToken(){
  let own = app.LM.userToken;
  let target = this.options.fromUser || ''
  if ((own && target) && (own == target)){
    return false
  }
  return true
} 

function checkTime() {
  let activityInfo = this.activityInfo || {};
  let result = GetStatus.getTimeMsg.call(this, activityInfo,'index');
  result = result || {};
  this.setData({
    timeText: result.text || '',
    time: result.time || ''
  })
  // console.log('time文案', result, this.data.timeText);
  return result
}


function init(){
  this.friends_arr = [];
  this.setData({
    friends_arr:[],
    progress:{},
    percent:0,
    showRankBtn:false,
    msgShow:{},
  })
}
function initAdsModle(advert){
  let advertList = advert.advertList || [];
  let that = this;
  wx.nextTick(() => {
    let advertConf = {
      TOP:{},
      MIDDLE:{},
      BOTTOM:{}
    };
    let advertJson = {}
    for (let i = 0; i < advertList.length; i++){
      let items = advertList[i];
      advertJson[items.type] = advertList[i];
    }
    for (let i in advertConf) {
      let moduleList = [], embedCustom;
      if (advertJson[i] && advertJson[i].moduleList && advertJson[i].moduleList.length > 0){
        moduleList = advertJson[i].moduleList;
      }else{
        moduleList = [];
      }
      console.log("moduleList", moduleList)
      switch (i) {
        case "TOP":
          this.setData({
            hasTopModule: moduleList.length > 0 ? true : false
          })
          if (moduleList.length > 0) {
            that.topEmbedId = that.topEmbedId || that.selectComponent('#topEmbedId');
            embedCustom = that.topEmbedId;
          }
          break;
        case "MIDDLE":
          this.setData({
            hasMiddleModule: moduleList.length > 0 ? true : false
          })
          if (moduleList.length > 0) {
            that.middleEmbedId = that.middleEmbedId || that.selectComponent('#middleEmbedId');
            embedCustom = that.middleEmbedId;
          }
          break;
        case "BOTTOM":
          this.setData({
            hasBottomModule: moduleList.length > 0 ? true : false
          })
          if (moduleList.length > 0) {
            that.bottomEmbedId = that.bottomEmbedId || that.selectComponent('#bottomEmbedId');
            embedCustom = that.bottomEmbedId;
          }
          break;
      }
      if (embedCustom){
        embedCustom.getPageData({
          ImgDomain: advert.domainUrl,
          ModuleList: moduleList
        });
      }
    }
  })
  
}

function catchTips(e={},msg="",time=2000){
  e = e || {};
  app.SMH.showToast({
    title:e.msg || msg || "异常",
    duration:time||2000
  })
}


function tipGradeAnim(){ 
  if (this.data.tipActive)return
  this.setData({
    tipActive: true
  })
  setTimeout(() => {
    this.setData({
      tipClassActive: true
    })
  }, 100)
  clearTimeout(this.gradeAnimId);
  this.gradeAnimId = setTimeout(() => {
    this.setData({
      tipClassActive: false
    })
    setTimeout(() => {
      this.setData({
        tipActive: false
      })
    }, 250)
  }, 1800)
}

function loadingAnim(bool=false){
  this.orderSync = this.orderSync || this.selectComponent("#orderSync");
  this.orderSync.setAnim(bool); 
} 

function getUserSimpleInfo(params){
  if(!this.options.fromUser){
    return Promise.resolve({});
  }
  params = {
    brandCode: app.Conf.BRAND_CODE,
    userToken: this.options.fromUser || ""
  }
  return app.RunApi.go('UserApi', 'getUserSimpleInfo', params, this.extra).then(res=>{
    if(res.code==1){
      let data = res.data || {};
      let obj = {};
      obj.userName = data.realName || "";
      obj.avatarUrl = data.portrait_path || "";
      return Promise.resolve(obj);
    }
    return Promise.resolve({});
  })
}

function iniTabbar() {
  if(this.first_init_tab)return
  this.first_init_tab = true;
  let ac_conf = this.data.ac_conf;
  let brand_info = this.data.brand_info;
  this.tababr = this.tababr || this.selectComponent("#custom_tabbar");
  this.tababr.setTabbar([{
    "pagePath": "pages/micro_mall/sk/activity-sk/activity-sk",
    "text": "秒杀列表",
    "iconPath": brand_info.icon_url + "micro_mall/sec_kill/sk_home.png?123",
    "selectedIconPath": brand_info.icon_url + "micro_mall/sec_kill/sk_home_active.png",
    "is_this_page": true,
    "select_color": ac_conf.theme_color,
    "is_original_tab": false
  },
  {
    "pagePath": "pages/micro_mall/sk/orders-sk/order-list",
    "text": "我的秒杀",
    "iconPath": brand_info.icon_url + "micro_mall/sec_kill/sk_order.png?123",
    "selectedIconPath": brand_info.icon_url + "micro_mall/sec_kill/sk_order_active.png",
    "is_this_page": false,
    "select_color": ac_conf.theme_color,
    "is_original_tab": false,
    "need_login": true,
    "is_this_page": false,
  }
  ]);
}


function goAction(type = '') {
  let name = 'ACTIVITY_SHARE';
  let position = 'SECKILL_ACT_PAGE'; 
  let params = {
    activityId: this.cur_ac_id || this.options.activityId || 0,
    groupId : this.data.groupId || this.options.groupId ||0
  }
  this.addActionLog(name, position, params);
}

function getPercent(inven = 0, invenSum = 0) {
  let percent = (invenSum == 0) ? 0 : inven / invenSum >= 1 ? 100 : inven / invenSum > 0.01 ? parseInt(((inven / invenSum) * 100).toFixed(2)) : parseFloat((inven / invenSum) * 100);
  percent = percent > 0 && percent < 1 ? 1 : percent;
  return percent;
}


//数组转jSON {'':{}}
function createObjKeyVal(obj, key) {
  if (obj instanceof Array) {
    let json = {};
    for (let i = 0; i < obj.length; i++) {
      let Id = obj[i][key];
      if (!json[Id]) {
        json[Id] = (obj[i])
      }
     }
    return json;
  }
}

function checkSubState(info){
    let key = WxSub.getKeyTemplate("SECKILL") || {};
    let tplsList = this.tplsList || [];
    let SubScribe = {}
    tplsList.forEach(item=>{
      SubScribe[item.tplType] = info[key[item.tplType]];
    })
    let acSubScribe = JSON.parse(JSON.stringify(SubScribe));
    this.setData({
      acSubScribe,
      SubScribe
    })
    console.log('SubScribe', SubScribe)
}


function initTemplate(goods_info = {}, staffCode = '') {
  // if (this.drawArr && this.drawArr.length > 0) { return };
  goods_info = goods_info || {};
  this.drawArr = [];
  let canvasW = 600;
  let canvasH = 900;
  let padding = 20;
  let baseH = 30;
  let baseTopLine = canvasW + 80;
  let codeW = 200;
  let baseBottomLine = canvasH - padding;
  // this.drawArr = this.drawArr || [];

  let bg = DrawTemplate.initData('image', 0, 0, canvasW, canvasW);
  bg.url = this.activityInfo.shareImg || '';
  bg.mode = 'fitORfill';
  this.drawArr.push(bg);

  let userHead = DrawTemplate.initData('image', padding, baseTopLine, 74, 74);
  userHead.type = 'userHead';
  this.drawArr.push(userHead);
  let eq_params = {
    img_y: baseTopLine,
    img_h: 74,
  }
  let realName = DrawTemplate.initData('text', 74 + padding + 20, DrawTemplate.equation('v_m', eq_params), 200, 0);
  realName.type = "realName"
  realName.ellipsis = 2;
  realName.color = '#7f7f7f';
  this.drawArr.push(realName);

  if(this.activityInfo.shareCondition != 0){ //需要分享人数为0就不需要显示该内容
    baseTopLine = baseTopLine + 74 + 50;
    let img_l = DrawTemplate.initData('image', padding, baseTopLine, 26, 23);
    img_l.url = this.data.brand_info.default_icon_url + "share/left_quotes.png";
    this.drawArr.push(img_l);
    let tip1 = DrawTemplate.initData('text', padding + 26 + 10, baseTopLine);
    tip1.text = goods_info.title1;
    this.drawArr.push(tip1);
    baseTopLine += baseH;
  
    let tip2 = DrawTemplate.initData('text', padding + 26 + 10, baseTopLine);
    tip2.text = goods_info.title2;
    let img_r = DrawTemplate.initData('image', padding + 26 + 10 + 286, baseTopLine + 10, 26, 23);
    img_r.url = this.data.brand_info.default_icon_url + "share/right_quotes.png";
    this.drawArr.push(img_r);
    this.drawArr.push(tip2);
  }

  let normalTip = DrawTemplate.initData('text', canvasW - padding, baseBottomLine - 22);
  normalTip.size = 22;
  realName.color = '#7f7f7f';
  normalTip.text = '长按识别get同款';
  normalTip.align = 'right';
  this.drawArr.push(normalTip);
  baseBottomLine -= baseH;
  if (staffCode) {
    let staff = DrawTemplate.initData('text', canvasW - padding, baseBottomLine - 22);
    staff.size = 22;
    realName.color = '#7f7f7f';
    staff.text = staffCode;
    staff.align = 'right';
    this.drawArr.push(staff);
    baseBottomLine -= baseH;
  }
  baseBottomLine -= codeW;
  let code = DrawTemplate.initData('image', canvasW - padding - codeW, baseBottomLine, codeW, codeW);
  code.type = 'code';
  this.drawArr.push(code);
}

function logSession(){
  let query = {};
  (this.data.groupId || this.options.groupId) && (query.groupId = this.data.groupId || this.options.groupId);
  (this.options.target) && (query.target = this.options.target);
  query= {
      activityId:this.cur_ac_id || 0,
      ...this.options,
      ...query
  };
  let path = 'pages/micro_mall/sk/activity-sk/activity-sk';
  this.addVisitLog(null, path, query);
  this.addPageLog(null, path, query,this.isBack);
  if (this.isBack){
    this.isBack = false;
  }
  // LgMg.setChannel(ops);
  // let ops = {
  //   path: "pages/micro_mall/sk/activity-sk/activity-sk",
  //   query:{
  //     activityId:this.cur_ac_id || 0,
  //     ...query
  //   },
  //   _reset: true,
  // }
  // LgMg.setChannel(ops);
}