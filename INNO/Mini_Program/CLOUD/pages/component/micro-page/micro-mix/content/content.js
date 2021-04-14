// pages/component/micro-page/micro-mix/content/content.js 
import mcBehavior from '../../help/mc-behavior.js'
import {ContentParentNodes} from '../../help/parent-nodes.js';
import {ContentChildNodes} from '../../help/child-nodes.js';
const app = getApp();
Component(app.BTAB({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  behaviors: [mcBehavior],
  relations: {
    // ...ContentParentNodes,
    // ...ContentChildNodes,
  }, 
  properties: {
    dt:{
      type:Object,
      value:{},
      observer:function(n,o){
        // console.log('dtdt',n)
        // if(!this.isAttached)return
        n && this.init(n);
      }
    },
    isLogin: {
      type: Boolean,
      value: false
    },
    cIndex: {
      type: Number,
      value: 0
    },
    // actData: {
    //   type: Object,
    //   value: ""
    // },
    // showSalesVolume: {
    //   type: Boolean,
    //   value: false
    // },
    // autoShow: {
    //   type: Boolean,
    //   value: false
    // },
    // customTab: {
    //   type: Boolean,
    //   value: false
    // },
    // isCustomNav: {
    //   type: Boolean,
    //   value: false
    // },
    // sysConf: {
    //   type: Object,
    //   value: {}
    // },
    // extraSumH:{
    //   type: Number,
    //   value:0,
    // },
    // extraH:{
    //   type: Number,
    //   value:0,
    // },
  },
  data: { 
  },
  pageLifetimes: {
    show() {},
    hide() {
      // this.unListen();
    }
  }, 
  attached() {
    this.nodeInfo = {};
    this.loadModuleObj = {};
  },
  ready(){
  },
  methods: {
    init(_data){
      this.setData({
        _data
      })
    },
    // queryRefresh(e){
    //   console.log('queryRefresh content',this.data._data.moduleId)
    //   this.getQuery(); //获取节点信息
    // },
    loadData(){ 
      //获取slot里面组件 并loadData
      // let code = this.data._data && this.data._data.code||'';
      // if(!code)return;
      // let temp = this.getAllNodes(this.data._data.code + '-key');
      // this.itemNodes = temp && temp[0] || {};
      // this.itemNodes.loadData && this.itemNodes.loadData(this.data._data);

      this.cItem = this.cItem || this.selectComponent('#cItem') || {};
      this.cItem.loadData && this.cItem.loadData();
    },
    // getAutoData:function (data) { //只有骨架的自动加载
    //   this.setData({
    //     // img_url: data.ImgDomain || '',
    //     pageModelList: data || [],
    //   })
    //   initAttach.call(this);
    //   wx.nextTick(() => {
    //     this.setAutoShow();
    //   })
    // },
    // getCustomData: function(options = {}, isHomePage, lockTime) { //自定义模块加载启动 
    //   this.loadLock = false;
    //   this.options = options; 
    //   this.isHomePage = isHomePage;
    //   this.lockTime = lockTime; 
    //   initAttach.call(this);
    //   initPageType.call(this, options);
    //   onShowEvent.call(this, options);
    // }, 
    // checkTop(top) { //滚动检测
    //   this.nowTop = this.One_Screen + top;
    //   // console.log('滚',top,'倒计数:',this.bottom_line - top - this.One_Screen,'累积:',this.nowTop,'line:',this.bottom_line)
    //   if (this.allDataAlready || this.data.pageEnable == 0 || (this.loadDataType == "bottom" && !this.data.autoShow)) {
    //     return
    //   }
    //   if (this.data.autoShow || (top && this.bottom_line && (this.bottom_line - top <= this.One_Screen))) { //this.bottom_line-top  小于视窗高度One_Screen时loadData
    //     if (!this.checkTopVal[this.Screen_Num]) {
    //       this.checkTopVal[this.Screen_Num] = true;
    //       this.bottom_line += (this.One_Screen * 1.3); //暂时给一个line
    //       this.Screen_Num += 1;
    //       loadData.call(this, false, true);
    //     }
    //   }
    // },
    // setEmpty(){
    //   this.setData({
    //     pageEnable: 0
    //   })
    // },
    // detachedTime: function() { //倒计时销毁
    //   let act_count_down = this.actCountDown;
    //   if (act_count_down) {
    //     for (let i in act_count_down) {
    //       let countDown = act_count_down[i].countDown;
    //       if (countDown) {
    //         stopCountDown.call(this, countDown);
    //       }
    //     }
    //   }
    // },
    // unListen() {//消除、记录状态
    //   clearTimeout(this.timer);
    //   clearTimeout(this.divisionId);
    //   this.loadLock = true;
    //   if (this._tagId) {
    //     this._tagId = 0;
    //     clearTimeout(this._tagId);
    //   }
    //   // if (this.data.pageModelList && this.pageId && (this.loadedNum != 0)) { //排除扰乱因素的if
    //   //   this.loadedNum_label = this.loadedNum; //标记
    //   //   let _limitE = this.loadedNum < this.data.pageModelList.length ? this.loadedNum : this.data.pageModelList.length;
    //   //   this.limitE_label = _limitE || 0; //标记
    //   //   console.log('标记',this.loadedNum_label,this.limitE_label);
    //   // }
    //   this.attachStatus = false;
    //   this.loadedNum = 0;
    //   this.singleSwitchLoad = {};
    //   this.activityId = this.activityId || this.selectComponent('#activityId');
    //   this.activityId && this.activityId.unListen();
    //   this.detachedTime();
    // },
    // singleSwitch(e) { //独立活动单击TAB
    //   let detail = e.detail || {};
    //   let dataset = e.currentTarget.dataset||{};
    //   let i = dataset.m_index||0;
    //   let tab_index = detail.index;
    //   let id ='' + 'module_' + i + '_' + tab_index;
    //   this.singleSwitchLoad = this.singleSwitchLoad || {};
    //   console.log(id,this.singleSwitchLoad[id])
    //   if(this.singleSwitchLoad[id]){//单击缓存
    //     setMotionData.call(this,this.singleSwitchLoad[id],i);
    //     return
    //   };
    //   let extend = {
    //     index: tab_index
    //   }
    //   let p_mode_l = this.data.pageModelList||[];
    //   let params = {
    //     code:p_mode_l[i].code,
    //     setting:p_mode_l[i].setting && p_mode_l[i].setting.setting || p_mode_l[i].setting,
    //     data:p_mode_l[i],
    //     index:i,
    //     sr_t : this.serverTime,
    //     extend
    //   }
    //   SwitchApi({...params}).then(initMsg=>{
    //     trimModule.call(this,i,extend);//模块处理
    //     if(initMsg && initMsg.goApi){
    //       GetData(initMsg.apiParams||{},params.code,i).then(res=>{
    //         let data = res.data;
    //         let resExtra = res.resExtra||{};
    //         this.singleSwitchLoad[id] = data||[];
    //         trimModule.call(this,i,extend,'after',data,resExtra);//模块处理
    //         setMotionData.call(this,data,i,initMsg.apiParams.params);
    //       });
    //     }
    //   })
    //   return 
    // }, 
    // setAutoShow(){ //自动加载
    //   console.log('setAutoShow',this.allDataAlready,this)
    //   if(!this.allDataAlready && this.data.pageEnable != 0){
    //     !this.data.autoShow && this.setData({
    //       autoShow:true
    //     })
    //     setTimeout(()=>{
    //       this.checkTop();
    //       this.setAutoShow();
    //     },850)
    //   }
    // },
    // callEvent(e){ //用于分类模块的触底
    //   if(this.loadDataType == "bottom" && this.data.limitNum >= 0){
    //     this.loadData();
    //   }
    // }
  },
}))
// //PageType初始化
// function initPageType(option){
//   if (!option.pageType) return;
//   if (!this.page && option.pageType) {
//     this.page = getCurrentPages().pop();
//   }
//   this.page.pageType = option.pageType;
// }
// //onShow事件整合
// function onShowEvent(ops) {
//   if (!this.isHomePage) { //不是主页不需要缓存
//     console.log('不是主页不需要缓存')
//     this.pageId = ops.page_id;
//     refreshData.call(this,ops.page_id);
//   } else { //需要缓存
//     console.log('需要缓存')
//     this.triggerEvent('reflashId', ops.page_id);
//     if (this.lockTime) { //读缓存数据流程
//       app.CDateH.setCatchDate("index", 5).then(() => {
//         refreshData.call(this,ops.page_id);
//       }).catch(() => { //缓存中
//         console.log('缓存中')
//         if(this.Screen_Num==1){
//           loadData.call(this);
//         }
//         if (this.actCountDown) {
//           setModuleCountDown.call(this) //重新开启倒计时
//         }
//       })
//     } else {
//       refreshData.call(this,ops.page_id);
//     }
//   }
// }
// //获取页面信息
// function getCustomDataRequest(pageId) {
//   let ops = this.options||{};
//   let params = {
//     // userToken:app.LM.userToken,
//     // brandCode:app.Conf.BRAND_CODE,
//   },apiPack = {
//     api:"CL_GoodsApi",
//     url:"getCustomPagesInfo"
//   };
//   if(ops.pageType == 'getParentPage'){
//    return Promise.resolve(0);
//   }
//   if (pageId) {
//     params.param = pageId;
//     params.pageType = 1;
//   } else {
//     params.param = "首页";
//     params.pageType = 0;
//   }
//   return app[apiPack.api][apiPack.url]({
//     params: params,
//     extraData: {
//       isShowLoad: true
//     }
//   }).then(e => {
//     if (e.code == 1) {
//       let data = e.data;
//       if (!data) return;
//       this.triggerEvent('shareSaving', { //page_button_mod share
//         data: data || {}
//       }, {
//         bubbles: true,
//         composed: true
//       });
//       this.pageId = data.page_id;
//       this.setData({
//         pageEnable: data.is_enable
//       })
//       if (data.is_enable == 1){
//         return Promise.resolve(data.page_id);
//       }else{
//         return Promise.reject(e);
//       }
//     }
//     return Promise.reject(e);
//   })
// } 
// //初始化数据
// function initAttach(){
//   if(!this.attachStatus){
//     this.attachStatus = true;
//     let ops = this.options||{};
//     let staffInfo = app.StorageH.get("STAFFINFO") || {};
//     let _setData = {};
//     this.loadDataType = this.loadDataType || ops.loadDataType || "scroll";
//     if(this.loadDataType == "bottom"){
//       _setData = {
//         cur_show_mod:INIT_LIMIT,
//       } 
//     }
//     this.setData({
//       isStaff: staffInfo.isStaffDstbData || false,
//       isHomePage: this.isHomePage,
//       ..._setData,
//     });
//     this.One_Screen = app.SIH.windowHeight - this.data.extraSumH || 600;
//     this.X_Screen = this.One_Screen * SCREEN_TIMES;
//     this.Screen_Num = 1;
//     this.loadIndex = 0;
//     this.loadNum = INIT_LIMIT;
//     this.loadedNum = 0;
//     this.motion_data = {};
//     this.hideModule = {};
//     this.bottom_line = this.X_Screen;
//     this.checkTopVal = {};
//     this.singleSwitchLoad = {};
//     this.checkTopVal[this.Screen_Num] = false;
//   }
// }
// //骨架加载
// function loadFrame(id) {
//   let that = this;
//   if (this.last_id != id || !this.inited) {
//     this.last_id = id;
//     let params = {
//       pageId: id || 0,
//     },apiPack = {
//       api:"CL_GoodsApi",
//       url:"getCustomPageDataScript",
//       extra:{diy:true}
//     },ops = this.options||{}; 
//     if(ops.pageType == 'getParentPage'){
//       params={ brandCode: app.Conf.BRAND_CODE };
//       apiPack.url = "getParentPageDataScript";
//     }
//     return app.RunApi.go(apiPack.api, apiPack.url, params,apiPack.extra).then(res => {
//       if (res.code == 1) {
//         this.inited = true;
//         (ops.pageType == 'getParentPage') && 
//         this.setData({
//           pageEnable: 1
//         })
//         let data = res.data || {};
//         this.serverTime = data.server_time || '';
//         let pageModelList = data.pageModelList || [];
//         // pageModelList = installDataBygoodsid.call(this, pageModelList);
//         this.pageModelList = pageModelList;
//         this.setData({
//           img_url: data.imgUrl || '',
//           pageModelList: pageModelList,
//         })
//         // initData.call(this, pageModelList);
//         setPageData.call(this, pageModelList);
//         console.log('骨架',this.data.pageModelList)
//         wx.nextTick(() => {
//           loadData.call(that, false, false); //首次加载数据
//         })
//       }
//     }).catch(e=>{
//       (ops.pageType == 'getParentPage') && 
//       this.setData({
//         pageEnable: 0
//       }) 
//     })
//   }else {
//     // wx.nextTick(() => {
//     //   loadData.call(that, true);
//     // })
//     console.log('重置数据');
//   }
// } 

// function initData(pageModelList, imgUrl = '') {
//   let page_module_list = pageModelList || [];
//   let arr = [];
//   page_module_list && page_module_list.forEach((item, index) => {
//     let temp = ''
//     item.hasData = true;
//     if (item.bindType == 7 || item.bindType == 8) {
//       temp = {};
//     } else if (item.bindType == 1 || item.bindType == 2) {
//       temp = [];
//     } else {
//       temp = new Array(1).fill({});
//     }
//     arr.push(temp);
//   });
//   this.setData({
//     motion_data: arr || [],
//   })
//   return arr;
// }
// //多个goodsids的分拼处理
// function installDataBygoodsid(data){
//   let _data = JSON.parse(JSON.stringify(data));
//   let  addNum = 0;
//   for(let i = 0; i < data.length; i++){
//     let item = data[i];
//     let moduleItem = item.moduleItem || {};
//     if(data[i].bindType == 1 && data[i].moduleStyles != 4 && moduleItem.itemList.length > LIMIT_GOODSIDS){
//       let mergeData = [];
//       let num = Math.ceil(moduleItem.itemList.length / LIMIT_GOODSIDS);
//       for(let j = 0; j < num; j++){
//         let itemData = moduleItem.itemList.splice(0, LIMIT_GOODSIDS);
//         let _item = JSON.parse(JSON.stringify(item));
//         _item.moduleId = item.moduleId + "_" + j;
//         _item.moduleItem.moduleId = _item.moduleId;
//         _item.moduleItem.itemList = itemData;
//         mergeData.push(_item);
//       }
//       _data.splice(addNum + i, 1, ...mergeData);
//       addNum = addNum + num - 1;
//     } else {
//       continue;
//     }
//   }
//   return _data;
// }
// //PageData处理
// function setPageData(pageModelList){
//   let _page = getCurrentPages().pop();
//   wx.nextTick(()=>{
//     _page.setData({
//       hasCustomData: pageModelList.length > 0
//     })
//   })
// } 
// //刷新数据整合
// function refreshData(id) {
//   getCustomDataRequest.call(this, id).then(pageId => {
//     if(!id){
//       loadFrame.call(this, pageId);
//     }
//   });
//   if(id){
//     loadFrame.call(this, id);
//   }
// }
// //加载数据多个组合处理
// function promiseAll(start = 0, end = 0) {  //数据加载的开始 、 结束 、 加载数量
//   let arr = [];
//   let that = this;
//   let n = end - start;
//   return new Promise((rs, rj) => {
//     for (let i = 0; i < n; i++) {
//       arr.push(setPromise.call(that, start + i, end - 1,n));  //单个模块
//     }
//     Promise.all(arr).then(res => {
//       rs(res)
//     }).catch(e => {
//       rs(e)
//     })
//   });
// }
// //加载数据单个基层
// function setPromise(i,end,n) {
//   let p_mode_l = this.data.pageModelList;
//   let params = {
//     code:p_mode_l[i].code,
//     setting:p_mode_l[i].setting && p_mode_l[i].setting.setting || p_mode_l[i].setting,
//     data:p_mode_l[i],
//     index:i,
//     motion_data:this.motion_data,
//     hideModule:this.hideModule,
//     sr_t : this.serverTime, 
//     Limit_S:LIMIT_SORTS
//   }
//   return new Promise((rs, rj) => {
//     SwitchApi({...params}).then(initMsg=>{
//       initMsg = initMsg||{};
//       checkTag.call(this);    //标签
//       trimModule.call(this,i,{},'',[],{},n);//模块处理
//       if(initMsg.goApi){
//         GetData(initMsg.apiParams||{},params.code,i).then(res=>{
//           let data = res.data;
//           let resExtra = res.resExtra||{};
//           trimModule.call(this,i,{},'after',data,resExtra);//模块处理
//           setHideMod.call(this,!data || data.length<=0,i);
//           setMotionData.call(this,data,i,initMsg.apiParams.params);
//           return rs(res);
//         });
//       }else{
//         setHideMod.call(this,initMsg.hide,i)
//         setMotionData.call(this,initMsg.data,i,initMsg.apiParams.params);
//         return rs(initMsg.data || [])
//       }
//     }).catch(e=>{
//       console.log(e);
//       rs(e)
//     });
//   })
// }
// //接口分流
// function loadDivision(s,e,sum,init,fnc){
//   if(Math.ceil(sum/MostApiNum)>1){
//     e = init ? s + MostApiNum : e;
//     sum -= MostApiNum;
//     console.log('分段加载',s,e,sum);
//     let nextAdd = sum < MostApiNum ? sum : MostApiNum;
//     fnc(s,e,sum);
//     this.divisionId = setTimeout(()=>{
//       loadDivision.call(this,e,e + nextAdd,sum,false,fnc);
//     },1000)
//   }else{
//     !init && console.log('分段最后加载',s,e,sum);
//     fnc(s,e,sum);
//     return
//   }
// }
// //加载数据逻辑处理
// function loadData(reset = false, scroll = false) {
//   if(this.loadLock)return
//   let {limitS,limitE,loadOver} = trimLoadNum.call(this,scroll,reset); 
//   if(loadOver)return  //全部加载完
//   let pageModelList = this.data.pageModelList || this.pageModelList || [];
//   let that = this;
//   loadDivision.call(this,limitS, limitE, limitE - limitS,true, (_limitS, _limitE)=>{ 
//     promiseAll.call(this, _limitS, _limitE).then(res => {
//       //X个模块加载全部完成
//       console.log('--PromiseAll',_limitS,_limitE,res);
//       if (_limitS < pageModelList.length) {        //懒加载计算流程
//           let {id_arr,id_len} = getIdMsg.call(this,_limitS,_limitE);
//           let _timer = setTimeout(() => { 
//             lazyLoad.call(this, id_arr, id_len);  //promiseAll数据之后计算bottom_line，若是首次打开则还会自动加载满X屏
//             clearTimeout(_timer);
//           }, 1000);
//       }

//       //tag图标省流量下载
//       if ((!this.delay_once && this.tag) || this.tag && (!this.alreadyLoaded) && (scroll || (!scroll && (_limitE - _limitS >= this.pageModelList.length)))) {
//         //tag加载条件： 首屏+tag存在的时候 || tag存在+数据没全加载 || 滚动 || 不滚动&&(点击回来)
//         let delay = !that.alreadyLoaded && (that.loadedNum >= that.data.pageModelList.length) ? 100 : TAG_TIME;
//         if (!this.delay_once) {
//           this.delay_once = true
//           delay = 500;
//         } 
//         this._tagId = setTimeout(() => {
//           if (!this._tagId) return
//           setTagImgSize.call(this, this.path); //标签下载
//         }, delay)
//         // console.log('promiseAll', 'timer:', this._tagId, '滚动加载', scroll, this.loadIndex, this.loadIndex * this.loadNum);
//       }
//     });
//   })
// }
// //懒加载与计算bottom_line的处理
// function lazyLoad(id = '', id_len = 1) {
//   // console.log('进来lazyLoad',id,this.loadDataType,this.Screen_Num);
//   if (!id || (this.loadDataType == 'bottom' && this.Screen_Num!=1)) return;
//   const query = wx.createSelectorQuery().in(this);
//   let that = this; 
//   query.selectAll(id).boundingClientRect(function (res) {
//     try{
//       id_len = res && (res.length - 1) || 0;
//       if (((!res || res.length <= 1 || !res[id_len]) || (res[id_len].top - res[0].top < 0)) && that.Screen_Num != 1 ) return;  //刚好边界模块被隐藏了  数据不准确return
//       that.bottom_line = res[id_len] && res[id_len].height && (res[id_len].top + res[id_len].height / 2 - that.data.extraH) || that.bottom_line; //刷新底边界
//       console.log('模块',id, ' 新边界', that.bottom_line,res,that.Screen_Num);
//       if(res[0] && !that.initScreen){
//         that.initScreen = true;
//         that.One_Screen =  app.SIH.windowHeight - that.data.extraSumH;
//         that.X_Screen = that.One_Screen * SCREEN_TIMES;
//       }
//       if(that.Screen_Num != 1 && that.bottom_line <= that.nowTop && !that.allDataAlready){ //首屏没加载完就进行TAB切换或hide，然后切回来的检测
//         that.checkTop(that.nowTop - that.One_Screen) //继续补首屏
//       }
//       if (that.Screen_Num != 1) return //只有首次加载检测补全
//       if ((that.bottom_line) <= (that.X_Screen * that.Screen_Num)) { //动态检测x屏内
//         if (((res[id_len]['top'] - res[0]['top']) + res[id_len].height) > (that.X_Screen * that.Screen_Num) + 50) {
//           console.log('边界+最后的模块内容height 内容撑满x屏')
//           that.Screen_Num += 1;
//           return
//         }
//         console.log('当前内容 < x屏高度 ，继续loadData')
//         loadData.call(that,false,true); 
//       } else {
//         console.log('满足x屏外')
//         that.Screen_Num += 1;
//         return
//       }
//     }catch(e){
//       console.log('catch',e)
//     }
//   }).exec()
// }
// //模块数据赋值
// function setMotionData(data,i,params={}) {
//   // let moduleList = this.data.pageModelList||[];
//   // let mod = moduleList[i] || {}; 
//   // let bindType = mod.bindType; 
//   // let index = '' + i;
//   // if(bindType == 7 || bindType == 9){
//   //   this.motion_data[index] = this.motion_data[index] || {};
//   //   this.motion_data[index][ bindType == 9 ? params.activityId : (params.issueId || params.cate_Id)] = data;
//   // }else{
//   //   this.motion_data[i] = data || [];
//   // }
//   this.motion_data[i] = data || [];
//   wx.nextTick(() => {
//     this.setData({
//       [`motion_data[${i}]`]: this.motion_data[i],
//     })
//   })
// }
// //模块空数据赋值
// function setHideMod(bool,i) {
//   this.hideModule[i] = bool || false;
//   this.setData({
//     [`hideModule[${i}]`]: this.hideModule[i], 
//   })
// }
// //模块数据的定位处理
// function trimModule(i,extend={},type,tempData=[],resExtra={},n) {
//   return
//   let pageModelList = this.data.pageModelList||[];
//   let data = pageModelList[i] || {};
//   let bindType = data.bindType;
//   if(!type && (bindType == 7 || bindType == 9)){
//     this.setData({
//       [`pageModelList[${i}].detail_list`]: data.detail_list
//     })
//     let listItem = data.detail_list && data.detail_list[extend && extend.index || 0] && data.detail_list[extend && extend.index || 0] || {};
//     let bg_time = bindType == 7 ? (listItem.begin_time) : listItem.state == 1 ? listItem.begin_time : listItem.begin_time2;
//     if(bindType == 9 && listItem.timeDown != 1)return;
//     initModuleCountDown.call(this, data.moduleId, listItem.activity_id, bg_time || '', listItem.end_time || '');
//     setModuleCountDown.call(this); 
//   }else if(type == 'after' && (bindType == 8 || bindType == 10 || bindType == 11|| bindType == 12 || bindType == 14)){
//     let stime = '',etime='';
//     tempData.forEach(item => {
//       if(bindType==10){
//         stime=item.presale_begin_time || '';  
//         etime=item.presale_end_time || '';
//       }else if(bindType == 11){
//         item.activity_id = item.mk_goods_id||0
//         stime=item.start_time || '';
//         etime=item.end_time || '';
//       }else if(bindType == 12){
//         item.activity_id = item.activityId||0
//         stime=item.fromTime || '';
//         etime=item.toTime || '';
//       }else if(bindType == 14){
//         if(data.showActivityTime!='1')return
//         item.activity_id = item.packageId||0;
//         stime= item.fromTime||'';
//         etime=item.toDate || '';
//       }else{
//         stime=item.addtime || '';
//         etime=item.etime || '';
//       }
//       initModuleCountDown.call(this, data.moduleId, item.activity_id, stime,etime);
//     })
//     setModuleCountDown.call(this);
//   }else if((type == 'after' && (bindType == 1 || bindType == 2)) || (!type && bindType == 2)){
//     if(n > INIT_LIMIT)return
//     if(bindType == 2 && data.moduleStyles != '4'){ //分类分模块
//       let needPaging = false;
//       let _setData = {};
//       if(type == 'after' && !data.pagedLabel && resExtra.data){
//         if(data.pageSize>0 && resExtra.data.allCount > data.pageSize){
//           resExtra.data.allCount = data.pageSize;
//         }
//         needPaging = resExtra.data.allCount > LIMIT_SORTS;
//         data.pagingEnd = !needPaging;
//       }
//       if(needPaging){
//         let num = Math.ceil((resExtra.data.allCount - LIMIT_SORTS) / LIMIT_SORTS);
//         let arr = []; 
//         let moduleId = data.moduleId;
//         let allCount = resExtra.data.allCount;
//         data.pagedLabel = true;
//         for(let i = 1,len=num;i<=len;i++){
//           let mod = JSON.parse(JSON.stringify(data));
//           mod.pagedLabel = true;
//           mod.moduleId = '' + moduleId + i;
//           mod.pagingEnd = i == len;
//           let pageSize = allCount - LIMIT_SORTS * i > LIMIT_SORTS ? LIMIT_SORTS : allCount - LIMIT_SORTS * i;
//           mod.pageIndex = i;
//           mod.pageSize = pageSize;
//           mod.skip = LIMIT_SORTS * i;
//           // console.log(allCount,"已过滤", mod.skip,"剩余",allCount - mod.skip)
//           arr.push(mod);
//         }
//         pageModelList.splice(i+1,0,...arr);
//         this.setData({
//           pageModelList
//         })
//         // console.log('pageModelList',this.data.pageModelList)
//       }
//       if(!type){ //分类前置
//         this.loadDataType != "bottom" && (this.loadDataType = "bottom");
//         _setData.limitNum = i;
//         this.data.sortShowLoad[data.moduleId] = true;
//         _setData.sortShowLoad = this.data.sortShowLoad;
//         this.setData({
//           ..._setData,
//         })
//       }else{
//         if(!tempData || tempData.length == 0){
//           data.pagingEnd = true;
//         }
//         if(data.pagingEnd){ //分类分块结束
//           _setData.limitNum = -1;
//         }
//         setTimeout(()=>{
//           data.pagingEnd && (this.loadDataType = "scroll");
//           this.data.sortShowLoad[data.moduleId] = false;
//           this.setData({
//             ..._setData,
//             sortShowLoad:this.data.sortShowLoad,
//           })
//         },200)
//       }
//     }
//     if(type == 'after'){ //标签
//       let resData = resExtra && resExtra.data || {};
//       let _tag = resData.goodsTagList || [];
//       let _path = [];
//       tagSortFnc.call(this, _tag, _path, bindType, resData.goodsTagList);
//     }
//   }
// }
// //倒计时模块初始化
// function initModuleCountDown(mId, actId, mStart, mEnd) {
//   if (!mId || !actId) return;
//   let aCD = this.actCountDown || {};
//   mStart = mStart ? MyDate.parse(mStart) : '';
//   mEnd = mEnd ? MyDate.parse(mEnd) : '';
//   let cD = {
//     mStart,
//     mEnd
//   };
//   if (aCD[mId]) {
//     if (mStart)
//       aCD[mId].mStart = aCD[mId].mStart > mStart ? mStart : aCD[mId].mStart
//     if (mEnd)
//       aCD[mId].mEnd = aCD[mId].mEnd > mEnd ? aCD[mId].mEnd : mEnd

//   } else {
//     aCD[mId] = {
//       mStart,
//       mEnd,
//       cDs: {}
//     }
//   }
//   aCD[mId].cDs[actId] = cD;
//   this.actCountDown = aCD;
// }
// //倒计时模块
// function setModuleCountDown() {
//   let aCD = this.actCountDown || {};
//   for (let i in aCD) { //模块遍历     
//     let mStart = aCD[i].mStart;
//     let mEnd = aCD[i].mEnd;
//     let servTime = MyDate.parse(this.serverTime);
//     if (servTime >= mEnd) {
//       setTimeData.call(this, i, aCD[i].cDs, {},{over:true});
//       if (aCD.countDown) {
//         stopCountDown.call(this, aCD.countDown);
//       }
//     } else {
//       if (!aCD[i].countDown) {
//         aCD[i].countDown = new CountDown(servTime);
//       }
//       let targetTime = mEnd;
//       if (mStart > servTime) {
//         targetTime = mStart;
//       }
//       if (!aCD[i].countDown.isRunning) { //已存在的模块倒计时不会进去start
//         aCD[i].countDown.setTarget(targetTime);
//         aCD[i].countDown.start(e => {
//           if (e.value <= 0) {
//             stopCountDown.call(this, aCD[i].countDown);
//           } else {
//             setTimeData.call(this, i, aCD[i].cDs, e);
//           }
//         })
//       }
//     }
//   }
// }
// //倒计时模块
// function setTimeData(mId, cDs, time,extra={}) {
//   let servTime = new Date(time.nowTime);
//   for (let i in cDs) { //模块里面的多活动遍历
//     let mStart = cDs[i].mStart;
//     let mEnd = cDs[i].mEnd;
//     let active = 0; //0:未开始，1：进行中，2：结束
//     let _value = "";
//     if (extra.over || servTime > mEnd || servTime == mEnd) { //结束
//       _value = "";
//       active = 2;
//     } else {
//       let targetTime = mStart > servTime ? mStart : mEnd;
//       active = mStart > servTime ? 0 : 1;
//       _value = targetTime.getTime() - servTime.getTime();
//     }
//     cDs[i] = {
//       active,
//       ...cDs[i],
//       ...timeHandle.call(this, _value)
//     }
//   } //先遍历全部活动 再下面setData
//   this.data.actCountDown[mId] = cDs
//   this.setData({
//     actCountDown: this.data.actCountDown
//   }) 
//   // console.log('倒计时',this.actCountDown);  //每秒log
// }
// //倒计时模块
// function timeHandle(value) {
//   if (!value) return "";
//   let day = Math.floor(value / (60 * 60 * 24 * 1000));
//   let hour = parseInt(value % (60 * 60 * 24 * 1000) / (1000 * 60 * 60));
//   let minutes = parseInt((value % (1000 * 60 * 60)) / (1000 * 60));
//   let seconds = parseInt((value % (1000 * 60)) / 1000);
//   let data = {};
//   data.day = day;
//   data.hour = hour > 9 ? hour : '0' + hour;
//   data.min = minutes > 9 ? minutes : '0' + minutes;
//   data.sec = seconds > 9 ? seconds : '0' + seconds;
//   return data;
// }
// //倒计时模块
// function stopCountDown(countDown) {
//   if (countDown) {
//     countDown.stop();
//   }
// }
// //模块start和end的处理
// function trimLoadNum(scroll=true,reset=false){
//   let _module = this.data.pageModelList || this.pageModelList || [];
//   // if (this.limitE_label && (this.loadedNum == 0) && scroll) { //首页缓存时间未过 继续回来滚动
//   //   console.log('首页缓存时间未过 继续回来滚动')
//   //   this.loadedNum = this.loadedNum_label; //恢复loadedNum
//   // }
//   let s_n = this.loadedNum;
//   let e_n = this.loadedNum + this.loadNum < _module.length ? this.loadedNum + this.loadNum : _module.length;
//   let rs = {
//     limitS:s_n,
//     limitE:e_n,
//     loadOver:false
//   };
//   // if (this.limitE_label && !scroll && (this.loadedNum <= INIT_LIMIT)) { //首页缓存时间过了 tab切换
//   //   console.log('首页缓存时间过了 tab切换')
//   //   if (rs.limitS <= this.limitE_label){
//   //     rs.limitE = this.limitE_label; //暂存的页数尾
//   //     this.loadedNum = this.loadedNum_label; //恢复loadedNum
//   //   }
//   // }else{
//   //   for(let i = s_n,len=e_n;i<len;){ //正常遍历分类模块
//   //     if(_module[i].bindType == 2 && _module[i].moduleStyles != '4'){
//   //       rs.limitE = i+1;
//   //     }
//   //     break;
//   //   }
//   //   this.loadedNum = this.loadedNum + (rs.limitE - rs.limitS);
//   // }
//   this.loadedNum = this.loadedNum + (rs.limitE - rs.limitS);
//   // console.log('加载完的判断',rs.limitS,_module.length,reset)
//   if (rs.limitS >= _module.length && _module.length > 0 && !reset) { //全部加载完毕
//     if(!this.logAlready){
//       this.logAlready = true;
//       this.Screen_Num == 1 && (this.Screen_Num += 1);
//       setTimeout(()=>{
//         console.log(rs.limitE, '全部模块完:', this.data.motion_data);
//         console.log(this.data.pageModelList);
//         this.allDataAlready = true;
//       },800)
//     }
//     rs.loadOver = true;
//   }
//   if (this.data.cur_show_mod <= rs.limitE && !(this.loadDataType=="bottom" && !scroll)) { //限制模块的累加开放
//                                                     //触底加载不需要提前开放
//     this.data.cur_show_mod += (INIT_LIMIT);
//     let time = 500;
//     this.loadDataType=="bottom" && (time = 0); //触底模式不需要延迟
//     setTimeout(() => {
//       this.setData({
//         cur_show_mod: this.data.cur_show_mod
//       })
//     }, time)
//   }
//   console.log('加载', rs.limitS, rs.limitE, ', 模块开放了',this.data.cur_show_mod);

//   return rs;
// }
// //top和bottom模块id的处理
// function getIdMsg(limitS,limitE){
//   let id_arr = [];
//   let last_id = "";
//   // console.log('hideModule',this.hideModule)
//   if(!this.firstNode && this.firstNode!=0){ //找到第一个有内容的模块并记录index
//     for (let item in this.hideModule) {
//       if(this.hideModule[item]){
//         continue
//       }else{
//         this.firstNode = item;
//         break
//       }
//     }
//   }
//   let f_num = this.firstNode || 0;
//   for (let i = limitE - 1, len = limitS; i >= len; i--) { //找有数据的bottom模块
//     if (i != f_num && !this.hideModule[i] || (i == len)) {
//       last_id = '#custom' + (this.pageModelList[i] && this.pageModelList[i].moduleId || 0);
//       break
//     }
//   }
//   last_id && id_arr.push(last_id); //bottom模块
//   //添加首个模块的数据--计算bottomline
//   let f_id = this.pageModelList[f_num].moduleId;
//   id_arr.push(`#custom${f_id}`);
//   let id_len = id_arr.length - 1;
//   id_arr = id_arr.join(',');

//   return {id_arr,id_len};
// } 
// //obj结构化的处理
// function createObjKeyValTag(obj, key, isArray, key2, bindType = '') {
//   if (obj instanceof Array) {
//     let json = {};
//     for (let i in obj) {
//       let Id = obj[i][key];
//       if (key == 'pic_path' && bindType == 1) {
//         Id = this.data.img_url + obj[i][key];
//       }
//       if (this.tag) {
//         if ((Id in this.tag)) {
//           // console.log('tag已存在', Id)
//           continue
//         }
//       }
//       if (this.path) {
//         if ((Id in this.path)) {
//           // console.log('path已存在', Id)
//           continue
//         }
//       }
//       if (isArray) {
//         if (!json[Id]) {
//           json[Id] = []
//         }
//         let value = obj[i][key2];
//         if (key != 'pic_path' && bindType == 1) {
//           value = this.data.img_url + obj[i][key2]; //tag
//         }
//         json[Id].push(value);
//       } else {
//         json[Id] = {
//           [`${key2}`]: obj[i][key2] //path
//         };
//       }
//     }
//     return json;
//   }
// }
// //标签模块
// function setTagImgSize(tagList = {}) {
//   if (this.alreadyLoaded) return
//   let that = this;
//   if (!that.alreadyLoaded && (that.loadedNum >= that.data.pageModelList.length)) { //数据加载到尽头不再进来
//     that.alreadyLoaded = true;
//   }
//   for (let item in tagList) {
//     if (tagList[item].isLoad) {
//       continue
//     }
//     let img_url = this.data.img_url || "";
//     let urlTemp = item;
//     // console.log(that.loadIndex * that.loadNum,'开始下载', urlTemp);
//     tagList[item].isLoad = true; 
//     wx.getImageInfo({
//       'src': urlTemp,
//       success(res) {
//         let width = res.width;
//         let height = res.height;
//         that.data.tagVal[`${item}`].width = width;
//         that.data.tagVal[`${item}`].height = height;
//         that.setData({
//           tagVal: that.data.tagVal,
//         });
//       },
//       // fail(res) {
//       // }
//     })
//   }
// }
// //标签模块
// function tagSortFnc(_tag, _path, bindType,goodsTagList){
//   if (_tag && _tag.length > 0 && !this.alreadyLoaded) {
//     _tag = createObjKeyValTag.call(this, _tag, 'goods_id', true, 'pic_path', bindType);
//     _path = createObjKeyValTag.call(this, goodsTagList, 'pic_path', false, 'tag_name', bindType);
//     if (!this.tag) {
//       this.tag = _tag;
//       this.path = _path;
//       this.setData({
//         tagVal: _path || {},
//         tagList: _tag || {}
//       })
//       // console.log('初始化_tag，_path', _tag,_path);
//     } else {
//       let tag_check = JSON.stringify(_tag);
//       let path_check = JSON.stringify(_path);
//       if (tag_check != '{}' && tag_check != '[]') {
//         // console.log('新增_tag', _tag)
//         for (let item in _tag) {
//           this.tag[item] = _tag[item];
//         }
//         this.setData({
//           tagList: this.tag
//         })
//       }
//       if (path_check != '{}' && path_check != '[]') {
//         // console.log('新增_path', _path)
//         for (let item in _path) {
//           this.path[item] = _path[item];
//         }
//         this.setData({
//           tagVal: this.path,
//         })
//       }
//     }
//   }
// }
// //标签模块
// function checkTag() {
//   if (!this.allDataAlready && !this.alreadyLoaded && (this.loadedNum < this.data.pageModelList.length)) {
//     this._tagId && clearTimeout(this._tagId); //清除tag下载
//     this._tagId = 0;
//   } 
// } 