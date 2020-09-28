import MyDate from '../../../support/utils/date-util.js';
import {
  CountDown
} from "../../../helper/manager/timer-manager.js";
import countDownTextHelp from '../../../helper/handle/countDownTextHelp.js';
import StrH from "../../../helper/handle/strHandle.js"; 

const setTitle = {
  ["pages/micro_mall/index/index"]: true,
  ["pages/micro_mall/custom_page/custom_page"]: true
}
const app = getApp();
const INIT_TOP = 45; //顶部高度 (90)/2
const INIT_LIMIT = 4; //一次加载模块数量
const SHOW_MOD = INIT_LIMIT * 2; //限制模块
const SCREEN_TIMES = 1.2; //懒加载x屏
const MAX_READ = 2000; //最大阅读量
const TAG_TIME = 3200; //商品tag下载节流时间
const ActArrStatus = {  //state匹配->对比时间->开启倒计时/刷新
  1: { id: 1, name: "距开始" },   //对比资格开发时间
  2: { id: 2, name: "抢资格" },   //对比活动开始时间
  3: { id: 3, name: "秒杀中" }, //对比结束时间
  4: { id: 4, name: "已结束" }      //无
}
Component(app.BTAB({
  options: {
    addGlobalClass: true,
  },
  properties: {
    isLogin: {
      type: Boolean,
      value: false
    },
    actData: {
      type: Object,
      value: ""
    },
    showSalesVolume: {
      type: Boolean,
      value: false
    },
    sysConf: {
      type: Object,
      value: {}
    },
  },
  data: {
    img_url: '',
    module_data: [],
    page_module_list: "",
    bind_type_list: [],
    act_count_down: {},
    hideModule: {}, 
    detailListObj: {},
    actCountDown: {},
    limit_num: INIT_LIMIT,
    motion_data: {},
    tagList: {},
    tagVal: {},
    curr_show_mod: SHOW_MOD,
    pageEnable:true,
  },
  pageLifetimes: {
    show() {},
    hide() {
      this.unListen();
    }
  }, 
  attached() {
    this.nodeInfo = {};
    this.loadModuleObj = {};
  },
  methods: {
    getCustomData: function(options = {}, isHomePage, lockTime,tab_H = 0) {
      let ops = options;
      if(ops.NoSet){//该页面没有设置，同不启用
        this.setData({
          pageEnable: 0
        })
        return;
      }
      this.tab_H = tab_H;
      this.options = options;
      
      this.loadDataType = this.loadDataType || options.loadDataType||"scroll";
      if(options.loadDataType == "bottom"){
        this.setData({
          curr_show_mod:INIT_LIMIT
        })
      }
      this.isHomePage = isHomePage;
      this.lockTime = lockTime;
      // this.fromType = type;
      initAttach.call(this, tab_H);
      onShowEvent.call(this, ops);
      initPageType.call(this, ops);
    },
    detachedTime: function() {
      let act_count_down = this.actCountDown;
      if (act_count_down) {
        for (let i in act_count_down) {
          let countDown = act_count_down[i].countDown;
          if (countDown) {
            stopCountDown.call(this, countDown);
          }
        }
      }
    },
    unListen() { 
      clearTimeout(this.timer);
      if (this._tagId) {
        this._tagId = 0;
        clearTimeout(this._tagId);
      }
      if (this.data.pageModelList && this.pageId && (this.loadIndex != 0)) { //排除扰乱因素的if
        this.loadIndex_label = this.loadIndex; //标记
        let _limitE = this.loadIndex * this.loadNum < this.data.pageModelList.length ? this.loadIndex * this.loadNum : this.data.pageModelList.length;
        this.limitE_label = _limitE || 0; //标记
      }
      this.singleSwitchLoad = {};
      this.loadIndex = 0;
      this.activityId = this.activityId || this.selectComponent('#activityId');
      this.activityId && this.activityId.unListen();
      this.detachedTime();
    },
    singleSwitch(e) {
      let detail = e.detail || {};
      let id ='' + detail.module_num + '_' + detail.acId;
      this.singleSwitchLoad = this.singleSwitchLoad||{};
      // console.log('singleSwitchLoad',this.singleSwitchLoad[id],id,this.data.motion_data[detail.module_num]);
      if(this.singleSwitchLoad[id])return;
      switchApi.call(this, detail.bindType, detail.data, detail.module_num, {  //秒杀点击load数据
        acId: detail.acId,
        index: detail.index
      }).then(res => {
        this.singleSwitchLoad[id] = true;
        this.setData({
          [`motion_data[${detail.module_num}]`]: this.motion_data[detail.module_num] || [],
        })
      });
    },
    checkTop(top, nodeShow=false) {
      if (this.lock)return;
      // if (nodeShow){
      //   checkNodes.call(this, top);
      // }
      if (this.allDataAlready) {
        return
      }
      // console.log('滚',top,this.bottom_line, 'line:',this.bottom_line - top - this.One_Screen)
      if (top && this.bottom_line && (this.bottom_line - top <= this.One_Screen)) { //this.bottom_line-top  小于视窗高度One_Screen时loadData
        if (!this.checkTopVal[this.Screen_Num]) {
          this.checkTopVal[this.Screen_Num] = true;
          this.bottom_line += (this.One_Screen * 1.8);
          this.Screen_Num += 1;
          loadData.call(this, false, true);
        }
      }
    },

    gotoView(id) {
      // --节点跳转--
      let top = this.nodeInfo[`custom${id}`] && this.nodeInfo[`custom${id}`].topLine;
      let that = this;
      // console.log('跳', id, top,this.nodeInfo);
      if (!top && top != 0 ){
        if (this.loadModuleObj[id]){
          // console.log('此模块已被隐藏',id);
        }else{ 
          // console.log('没加载到此模块,先触底', this.bottom_line - this.One_Screen + 100);
          wx.pageScrollTo({
            duration: 300,
            scrollTop: ((that.bottom_line - that.One_Screen + 100)),
            complete: res => {}
          })
        }
        return
      }
      this.lock = true; 
      wx.pageScrollTo({
        duration: 300,
        scrollTop: top,
        complete: res => {
          checkNodes.call(that,'',id);
          setTimeout(() => {
            that.lock = false;
          }, 330)
        }
      })
    },
    loadData(){ //父页面采用触底加载的实现
      loadData.call(this, false, true);
    }
  },
}))
function initPageType(option){
  if (!option.pageType) return;
  if (!this.page && option.pageType) {
    this.page = getCurrentPages().pop();
  }
  this.page.pageType = option.pageType;
}

function onShowEvent(ops) {
  this.options = ops;
  if (!this.isHomePage) { //不是主页不需要缓存
    this.pageId = ops.page_id;
    getCustomDataRequest.call(this, ops.page_id).then(pageId =>{
      loadFrame.call(this, pageId);
    });
    
  } else { //需要缓存
    this.triggerEvent('reflashId', ops.page_id);
    if (this.lockTime) { //读缓存数据流程
      app.CDateH.setCatchDate("index", 5).then(() => {
        getCustomDataRequest.call(this, ops.page_id).then(pageId => {
          loadFrame.call(this, pageId);
        });
      }).catch(() => {
        if (this.actCountDown) {
          setModuleCountDown.call(this) //重新开启倒计时
        }
        // console.log("缓存handle");
      })
    } else {
      getCustomDataRequest.call(this, ops.page_id).then(pageId => {
        loadFrame.call(this, pageId);
      });
    }
  }
  this.setData({
    isHomePage: this.isHomePage
  })
}

//获取页面信息  读config
function getCustomDataRequest(pageId) {
  let params = {
    brandCode: app.Conf.BRAND_CODE,
    userToken: app.LM.userToken
  };
  if (pageId) {
    params.param = pageId;
    params.pageType = 1;
  } else {
    params.param = "首页";
    params.pageType = 0;
  }
  return app.GoodsApi.getCustomPagesList({
    params: params,
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      let data = e.data;
      if (!data) return;
      this.triggerEvent('shareSaving', {
        data: data || {}
      }, {
        bubbles: true,
        composed: true
      });
      this.pageId = data.page_id;
      this.setData({
        pageEnable: data.is_enable
      })
      if (data.is_enable == 1){
        return Promise.resolve(data.page_id);
      }else{
        return Promise.reject(e);
      }
    }
    return Promise.reject(e);
  })
}
//标签
function setTagImgSize(tagList = {}) {
  if (this.alreadyLoaded) return
  let that = this;
  if (!that.alreadyLoaded && (that.loadIndex * that.loadNum >= that.data.pageModelList.length)) { //数据加载到尽头不再进来
    // console.log('屏蔽啦', that.loadIndex * that.loadNum, that.data.pageModelList.length, that.path, that.tag);
    that.alreadyLoaded = true;
  }
  for (let item in tagList) {
    if (tagList[item].isLoad) {
      continue
    }
    let img_url = this.data.img_url || "";
    let urlTemp = item;
    // console.log(that.loadIndex * that.loadNum,'开始下载', urlTemp);
    tagList[item].isLoad = true; 
    wx.getImageInfo({
      'src': urlTemp,
      success(res) {
        let width = res.width;
        let height = res.height;
        that.data.tagVal[`${item}`].width = width;
        that.data.tagVal[`${item}`].height = height;
        that.setData({
          tagVal: that.data.tagVal,
        });
      },
      fail(res) {
      }
    })
  }
}

function loadFrame(id) {
  let that = this;
  if (!this.allDataAlready) {
    let _id = id || 0,
      api = 'GoodsApi',
      url = 'getHomePageDataScriptList';
    let params = {
      pageId: _id
    }
    return app.RunApi.go(api, url, params).then(res => {
      if (res.code == 1) {
        let data = res.data || {};
        this.serverTime = data.server_time || '';
        if (!this.inited) {
          let pageModelList = data.pageModelList || [];
          this.pageModelList = pageModelList;
          this.inited = true;
          this.setData({
            img_url: data.imgUrl || '',
            pageModelList: pageModelList,
          })
          initData.call(this, pageModelList);
          setPageData.call(this, pageModelList);
        } 
        wx.nextTick(() => {
          loadData.call(that, false, false); //首次加载数据
        })
        // setTimeout(() => {
        //   this.triggerEvent('handle_loaded');
        // }, 150);
      }
    })
  } else {
    wx.nextTick(() => {
      loadData.call(that, true);
    })
  }
}
function setPageData(pageModelList){
  let _page = getCurrentPages().pop();
  wx.nextTick(()=>{
    _page.setData({
      hasCustomData: pageModelList.length > 0
    })
  })
}

function switchApi(bindType, data, index, extend = {}) { //每个模块的处理： 类型  当前模块的骨架数据  模块在骨架里的排序index  extend
  let api = '',
    url = '',
    parseIndex = '' + index,
    params = {},
    tempData = [],
    _tag = [],
    _path = [],
    extra = {};
  let p = new Promise((rs, rj) => {
    switch (bindType) { //1~8 初始化参数
      case 1:
        try {
          api = 'GoodsApi';
          url = 'getALLGoodsListByGoodsIds'
          params = initParams.call(this, index, bindType, data && data.moduleItem && data.moduleItem.itemList || []);
          if (!params || !params.goodIds) {
            setEmpty.call(this, parseIndex, bindType);
            return rs([]);
          };
        } catch (e) {
          setEmpty.call(this, parseIndex, bindType);
          return rs([]);
        }
        break;
      case 2:
        try {
          api = 'GoodsApi';
          url = 'searchGoodsList';
          params = initParams.call(this, index, bindType, data);
        } catch (e) {
          setEmpty.call(this, parseIndex, bindType);
          return rs([]);
        }
        break;
      case 3:
        try {
          let s_ad = data && data.moduleItem && data.moduleItem.itemList || [];
          /*对热点数据处理*/
          if (s_ad.length > 0) {
            mapData.call(this, s_ad);
          }
          this.hideModule[parseIndex] = s_ad.length <= 0;
          this.motion_data[parseIndex] = s_ad;
          return rs(s_ad);
        } catch (e) {
          setEmpty.call(this, parseIndex, bindType);
          return rs([]);
        }
        break;
      case 4:
        try {
          let carousel_ad = data && data.moduleItem && data.moduleItem.itemList || [];
          // console.log(index, '轮广', carousel_ad);
          if (carousel_ad.length > 0) {
            mapData.call(this, carousel_ad);
          }
          this.hideModule[parseIndex] = carousel_ad.length <= 0;
          this.motion_data[parseIndex] = carousel_ad;
          return rs(carousel_ad);
        } catch (e) {
          setEmpty.call(this, parseIndex, bindType);
          return rs([]);
        }
        break;
      case 7:
        try {
          api = 'GoodsApi';
          let listItem = data.detail_list && data.detail_list[extend.index || 0] && data.detail_list[extend.index || 0] || {};
          if (listItem.activity_show_type == 'auto') {
            url = 'getSumaryALLGoodsList'; //自动获取 页数
          } else if (listItem.activity_show_type == 'manual'){
            url = 'getSeckillGoodList'; //手动获取 goods_id
          }else{
            // console.log('异常,不能初始化params',index,bindType,data)
            setEmpty.call(this, parseIndex, bindType);
            return rs([]);
          }
          params = initParams.call(this, index, bindType, data, extend);
          extra = {
            diy: true
          }
          //倒计时的初始化、启动 
          initModuleCountDown.call(this, data.moduleId, listItem.activity_id, listItem.begin_time || '', listItem.end_time || '');
          setModuleCountDown.call(this);
        } catch (e) {
          setEmpty.call(this, parseIndex, bindType);
          return rs([]);
        }
        break;
      case 8:
        try {
          api = 'CollageApi';
          url = 'getCollageGroupGoodsList';
          extra = {
            diy: true
          }
          params = initParams.call(this, index, bindType, data, extend);
        } catch (e) {
          setEmpty.call(this, parseIndex, bindType);
          return rs([]);
        }
        break;
      case 9:
        try {
          api = 'SecKillApi';
          let listItem = data.detail_list && data.detail_list[extend.index || 0] && data.detail_list[extend.index || 0] || {};
          if (data.moduleStyles == "8"){
            let itemList = data && data.moduleItem && data.moduleItem.itemList || [];
            this.motion_data[parseIndex] = itemList;
            if (itemList.length > 0){
              return rs(itemList)
            }else{
              setEmpty.call(this, parseIndex, bindType);
              return rs([]);
            }
          }else{
            if (listItem.activity_show_type == 'auto') {
              url = 'getGoodsList'; //自动获取 页数
            } else if (listItem.activity_show_type == 'manual') {
              url = 'getGoodsList'; //手动获取 goods_id
            }
            params = initParams.call(this, index, bindType, data, extend);
            extra = {
              diy: true
            }
            //倒计时的初始化、启动 
            if (listItem.timeDown == 1) {
              let b_time = listItem.state == 1 ? listItem.begin_time : listItem.begin_time2;
              initModuleCountDown.call(this, data.moduleId, listItem.activity_id, b_time || '', listItem.end_time || '');
              setModuleCountDown.call(this);
            }
          }
          
        } catch (e) {
          setEmpty.call(this, parseIndex, bindType);
          return rs([]);
        }
        break;
      case 10:
        try {
          api = 'PreSaleApi';
          url = 'getPresaleGoodsList';
          extra = {
            diy: true
          }
          params = initParams.call(this, index, bindType, data, extend);
        } catch (e) {
          setEmpty.call(this, parseIndex, bindType);
          return rs([]);
        }
        break;
      case 11:
        try {
          api = 'PointApi';
          url = 'getPointMkGoodsList';
          extra = {
            diy: true
          }
          params = initParams.call(this, index, bindType, data, extend);
        } catch (e) {
          setEmpty.call(this, parseIndex, bindType);
          return rs([]);
        }
        break;
      case 12:
          try {
            api = 'BargainApi';
            url = 'getHagglePriceActivityList';
            params = initParams.call(this, index, bindType, data, extend);
          } catch (e) {
            setEmpty.call(this, parseIndex, bindType);
            return rs([]);
          }
          break;
      default:
        setEmpty.call(this, parseIndex, bindType);
        return rs([]);
        break;
    }
    if (!params) {
      if(bindType!=7){
        // console.log('params异常不能调接口,隐藏模块:', index, bindType, data);
        setEmpty.call(this, parseIndex, bindType);
        return rs([]);
      }else{
        let acId = data.detail_list[extend.index || 0].activity_id || '0';
        // console.log('params异常 秒杀数据空', index, bindType,data.detail_list);
        this.motion_data[parseIndex] = this.motion_data[parseIndex] || {};
        this.motion_data[parseIndex][acId] = [];
        return rs([]);
      }
    }
    if (!this.allDataAlready && !this.alreadyLoaded && (this.loadIndex * this.loadNum < this.data.pageModelList.length)) {
      this._tagId && clearTimeout(this._tagId); //清除tag下载
      this._tagId = 0;
    }

    // console.log('调接口',api, url, params);
    return app.RunApi.go(api, url, params, extra).then(res => { //对应模块换数据   //广告和轮播不用另外调接口，在case已经整理完毕
      if (bindType == 1) { //单品
        tempData = res.data && res.data.goodsList || [];
      } else if (bindType == 2 || (bindType == 7 && url == 'getSumaryALLGoodsList')) { //分类、秒杀
        tempData = res.data && res.data.goods_list || [];
      } else if (bindType == 8 || (bindType == 7 && url == 'getSeckillGoodList')) { //拼团、手动添加的秒杀
        tempData = res && res.data || [];
      }else if (bindType == 9){ //助力秒杀
        tempData = res && res.data && res.data.list || [];
      }else if (bindType == 10){ //预售
        tempData = res && res.data && res.data.dataList || [];
      }else if (bindType == 11){ //积分
        tempData = res && res.data && res.data.list || [];
      }else if (bindType == 12){ //砍价
        tempData = res && res.data && res.data.dataList || [];
      }
      let name = bindType == 1 ? '单品' : bindType == 2 ? '分类' : bindType == 7 ? '秒杀' : bindType == 8 ? '拼团' : '其他' + bindType;
      // console.log(index, name, tempData)
      this.hideModule[parseIndex] = tempData.length <= 0;
      if (bindType == 1 || bindType == 2) {
        for(let i = 0,len=tempData.length;i<len;i++){
          tempData[i].salesVolumeStr = StrH.numberCarryBit(tempData[i].salesVolume);
        }
        this.motion_data[parseIndex] = tempData; 
        _tag = res.data.goodsTagList || []; 
        tagSortFnc.call(this, _tag, _path,bindType,res);  
      } else if (bindType == 7) {
        this.motion_data[parseIndex] = this.motion_data[parseIndex] || {};
        this.motion_data[parseIndex][params.issueId || params.cate_Id] = tempData;
        // if (tempData && tempData.length<=0){
        //    console.log('接口返回 秒杀数据空', index, bindType,res,this.motion_data[parseIndex]);
        // }
      } else if (bindType == 8 || bindType == 10 || bindType == 11|| bindType == 12) { //还没和秒杀合并数据结构 另外处理倒计时
        // tempData = sortGoods.call(this,tempData,data);
        this.motion_data[parseIndex] = tempData;
        let stime = '',etime='';
        tempData.forEach(item => {
          if(bindType==10){
            stime=item.presale_begin_time || '';  
            etime=item.presale_end_time || '';
          }else if(bindType == 11){
            item.activity_id = item.mk_goods_id||0
            stime=item.start_time || '';
            etime=item.end_time || '';
          }else if(bindType == 12){
            item.activity_id = item.activityId||0
            stime=item.fromTime || '';
            etime=item.toTime || '';
          }else{
            stime=item.addtime || '';
            etime=item.etime || '';
          }
          initModuleCountDown.call(this, data.moduleId, item.activity_id, stime,etime);
        })
        setModuleCountDown.call(this);
      }else if(bindType == 9){
        tempData.forEach(item=>{
          item.percent = getPercent.call(this, item.inventoryRemnant, item.inventory);
        })
        this.motion_data[parseIndex] = this.motion_data[parseIndex] || {};
        this.motion_data[parseIndex][params.activityId] = tempData;
      }
      return rs(tempData);
    }).catch(e => {
      // console.log('接口报错catch',e,index, bindType, params,url);
      setEmpty.call(this, parseIndex, bindType);
      return rs(e);
    })
  });
  return p
}

function initParams(index = 0, type, data = {}, extend = {}) { //传参初始化
  let params = {};
  if (type == 7) {
    this.check_detail_list = this.check_detail_list || {};
    if (!this.check_detail_list[data.moduleId] && data.detail_list) { //时间轴初始化
      this.check_detail_list[data.moduleId] = true;
      data.detail_list = data.detail_list.sort((a, b) => {
        if (a.sort > b.sort) {
          return 1
        };
        if (a.sort < b.sort) {
          return -1
        };
        if (a.sort == b.sort) {
          return 0
        };
      });
      let now_t = MyDate.parse(this.serverTime);
      data.detail_list.forEach(item => {
        let start_t = MyDate.parse(item.begin_time);
        let end_t = MyDate.parse(item.end_time);
        if (end_t <= now_t) {
          item.status = "已结束";
        } else if (now_t < start_t) {
          item.status = "敬请期待";
        } else if (now_t < end_t) {
          item.status = "正在疯抢";
        } else {
          item.status = "敬请期待";
        }
      })
      // console.log(data.moduleId, '时间轴', data.detail_list)
      this.setData({
        [`pageModelList[${index}].detail_list`]: data.detail_list
      })
    }
    let listItem = data.detail_list && data.detail_list[extend.index || 0] || {};
    let dataIds = listItem.activity_show_type == 'auto' ? '' : listItem.dataIds || '';
    let dataIds_len = dataIds && typeof dataIds == 'string' && dataIds.split(',').length || 1;
    let pageSize = listItem.activity_show_type == 'auto' ? listItem.show_number || MAX_READ : dataIds_len;
    if (!dataIds && listItem.activity_show_type == 'manual') {
      return false
    }
    if (dataIds) {
      params = { //手动
        issueId: listItem.activity_id || 0,
        goodsIds: dataIds,
        pageSize: pageSize || app.Conf.PAGE_SIZE,
        pageIndex: 1,
        brandCode: app.Conf.BRAND_CODE,
      }
    } else {
      params = { //自动
        functype: 'SK',
        strWhere: '',
        sort_field: 'goods_id',
        sort_by: 'desc',
        goods_brand_ids: '',
        cate_Id: listItem.activity_id || 0,
        pageSize: pageSize || app.Conf.PAGE_SIZE,
        pageIndex: 1,
        brandCode: app.Conf.BRAND_CODE,
        userToken: app.LM.userToken,
      }
    }
  } else if (type == 9) {
    this.new_check_detail_list = this.new_check_detail_list || {};
    if (!this.new_check_detail_list[data.moduleId] && data.detail_list) { //时间轴初始化
      this.new_check_detail_list[data.moduleId] = true;
      data.detail_list = data.detail_list.sort((a, b) => {
        if (a.sort > b.sort) {
          return 1
        };
        if (a.sort < b.sort) {
          return -1
        };
        if (a.sort == b.sort) {
          return 0
        };
      });
      let n_t = MyDate.parse(this.serverTime);
      data.detail_list.forEach(item => {
        if (n_t < MyDate.parse(item.begin_time)){
          item.state = 1;
        } else if (n_t >= MyDate.parse(item.end_time)) {
          item.state  = 4;
        } else if (n_t < MyDate.parse(item.begin_time2)) {
          item.state  = 2;
        } else {
          item.state  = 3;
        }
        // item.status = ActArrStatus[item.state].name;
        let act_info = {
          state:item.state,
          rtime:item.begin_time,
          stime:item.begin_time2,
          etime:item.end_time,
          serverTime:this.serverTime
        }
        let check = checkTime.call(this,act_info, data.showActivityTime); //返回倒计时文案对象
        item.status = check.text||"";
        if (check.timeDown) {
            // endTime = check.etime || 0;
            item.countDown = true;
            item.timeDown = 1;
        }else {
          item.timeDown = 0;
          item.showDate = check.time;
        }
      })
      // console.log(data.moduleId, '时间轴', data.detail_list)
      this.setData({
        [`pageModelList[${index}].detail_list`]: data.detail_list
      })
    }
    let listItem = data.detail_list && data.detail_list[extend.index || 0] || {};
    let dataIds = listItem.activity_show_type == 'auto' ? '' : listItem.dataIds || '';
    let dataIds_len = dataIds && typeof dataIds == 'string' && dataIds.split(',').length || 1;
    let pageSize = listItem.activity_show_type == 'auto' ? listItem.show_number || MAX_READ : dataIds_len;
    if (!dataIds && listItem.activity_show_type == 'manual') {
      return false
    }
    if (dataIds) {
      params = { //手动
        issueId: listItem.activity_id || 0,
        activityId: listItem.activity_id || 0,
        goodsIds: dataIds,
        pageSize: pageSize || app.Conf.PAGE_SIZE,
        pageIndex: 1,
        brandCode: app.Conf.BRAND_CODE,
      }
    } else {
      params = { //自动
        activityId:listItem.activity_id || 0,
        pageSize: pageSize || app.Conf.PAGE_SIZE,
        pageIndex: 1,
        userToken: app.LM.userToken,
      }
    }
  }else if (type == 8 || type == 10 || type == 11|| type == 12) {
    let arr = data && typeof data.collageGroupActivityIds == 'string' && data.collageGroupActivityIds.split(',') || [];
    let pageSize = data.activityShowType == 'auto' ? data.pageSize || MAX_READ : arr.length || app.Conf.PAGE_SIZE;
    params = {
      pageSize:pageSize,
      pageIndex: 1,
      brandCode: app.Conf.BRAND_CODE,
      activityIds:data.collageGroupActivityIds || ""
    }
  } else if (type == 2) {
    params = {
      functype: data.catType || 'CA',
      catId: data.catId || 0,
      strAttrId: '',
      strAttrValue: '',
      colorCatId: 0,
      startPrice: -1,
      endPrice: -1,
      strWhere: '',
      pageSize: data.pageSize || app.Conf.PAGE_SIZE,
      pageIndex: 1,
      sortField: 'goods_id',
      sortBy: 'desc',
      goods_brand_ids: '',
      storeId: '0',
    }
  } else if (type == 1) {
    let goodsIds = [];
    data.forEach(item => {
      if (item.goods_id) {
        goodsIds.push(item.goods_id)
      }
    })
    let ids = goodsIds.join(',');
    if (ids) {
      params = {
        goodIds: ids
      }
    }
  }
  return params
}

//加载数据motion_data
function loadData(reset = false, scroll = false) {
  let pageModelList = this.data.pageModelList || this.pageModelList || [];
  if (this.limitE_label && (this.loadIndex == 0) && scroll) { //首页缓存时间未过 继续回来滚动
    this.loadIndex = this.loadIndex_label; //恢复loadIndex
  }
  let limitS = this.loadIndex * this.loadNum < pageModelList.length ? this.loadIndex * this.loadNum : pageModelList.length;
  this.loadIndex += 1; //只要onhide loadIndex重置0 ，可通过label恢复
  let limitE = this.loadIndex * this.loadNum < pageModelList.length ? this.loadIndex * this.loadNum : pageModelList.length;
  if (this.limitE_label && !scroll && (this.loadIndex == 1)) { //首页缓存时间过了 tab切换
    if (limitS <= this.limitE_label){
      limitE = this.limitE_label; //暂存的页数尾
      this.loadIndex = this.loadIndex_label; //恢复loadIndex
    }
  }
  // console.log("判断全部加载",limitS,'----',pageModelList.length,'reset',reset);
  if (limitS >= pageModelList.length && pageModelList.length > 0 && !reset) { //全部加载完毕
    if(!this.logAlready){
      this.logAlready = true;
      setTimeout(()=>{
        // console.log(limitE, '模块Load完:', this.data.motion_data);
        // console.log(this.data.pageModelList);
        this.allDataAlready = true;
      },800)
    }
    return
  }
  if (this.data.curr_show_mod <= limitE && !(this.loadDataType=="bottom" && !scroll)) { //限制模块的累加开放
    this.data.curr_show_mod += (INIT_LIMIT);
    let time = 500;
    this.loadDataType=="bottom" && (time = 0);
    setTimeout(() => {
      this.setData({
        curr_show_mod: this.data.curr_show_mod
      })
    }, time)
  }
  // console.log('加载', limitS, limitE, ', 模块开放了',this.data.curr_show_mod);

  let that = this;
  let goLazyLoad = limitE - limitS <= INIT_LIMIT;
  let label = limitE - 1;
  let num = goLazyLoad ? INIT_LIMIT : limitE - limitS;
  //数据加载流程
  promiseAll.call(this, limitS, limitE, num).then(res => { //默认X个模块数据加载完毕，开始算标签高度, lazyLoad实现懒加载
    // console.log('promiseAll',limitS,limitE,res,this.motion_data)
    if (goLazyLoad) {
      let id_arr = [];
      let msg = {};
      if(!this.firstNode && this.firstNode!=0){ //找到第一个有内容的模块并记录index
        for (let item in this.hideModule) {
          if(this.hideModule[item]){
            continue
          }else{
            this.firstNode = item;
            break
          }
        }
      }
      let f_num = this.firstNode || 0;
      let last_id = "";
      for (let i = limitE - 1, len = limitS; i >= len; i--) {
        if (i != f_num && !this.hideModule[i]) {
          last_id = '#custom' + (this.pageModelList[i] && this.pageModelList[i].moduleId || 0);
          break
          // id_arr.push('#custom' + (this.pageModelList[i] && this.pageModelList[i].moduleId || 0));

          // msg['custom' + this.pageModelList[i].moduleId] = {
          //   moduleId: this.pageModelList[i].moduleId,
          // }
        }
      }
      last_id && id_arr.push(last_id);

      //添加首个模块的数据--计算bottomline
      let f_id = this.pageModelList[f_num].moduleId;
      id_arr.push(`#custom${f_id}`);
      // msg['custom' + f_id] = {
      //   moduleId: f_id,
      // }
      let id_len = id_arr.length - 1;
      id_arr = id_arr.join(',');
      if (goLazyLoad) {
        let delay = 1000;
        let _timer = setTimeout(() => {
          //懒加载流程  //msg--节点跳转
          lazyLoad.call(this, id_arr, id_len, msg);  //promiseAll数据之后计算bottom_line，若是首次打开则还会计算首屏
          clearTimeout(_timer);
        }, delay);
      }
    } 

    //tag图标下载流程
    if ((!this.delay_once && this.tag) || this.tag && (!this.alreadyLoaded) && (scroll || (!scroll && (limitE - limitS >= this.pageModelList.length)))) {
      //tag加载条件： 首屏+tag存在的时候 || tag存在+数据没全加载 || 滚动 || 不滚动&&(点击回来)
      let delay = !that.alreadyLoaded && (that.loadIndex * that.loadNum >= that.data.pageModelList.length) ? 100 : TAG_TIME;
      if (!this.delay_once) {
        this.delay_once = true
        delay = 500;
      } 
      this._tagId = setTimeout(() => {
        if (!this._tagId) return
        setTagImgSize.call(this, this.path); //标签下载
      }, delay)
      // console.log('promiseAll', 'timer:', this._tagId, '滚动加载', scroll, this.loadIndex, this.loadIndex * this.loadNum);
    }    
  });
}

//组合x个模块为一个组合  总架构
function promiseAll(start = 0, end = 0, n = 0) {  //数据加载的开始 、 结束 、 加载数量
  let arr = [];
  let that = this;
  n = end - start < n ? end - start : n;
  return new Promise((rs, rj) => {
    for (let i = 0; i < n; i++) {
      arr.push(setPromise.call(that, start + i, end - 1));  //单个模块
    }
    Promise.all(arr).then(res => {
      rs(res)
    }).catch(e => {
      rs(e)
    })
  });
}

//单个模块的整理
function setPromise(i, label) {
  let pageModelList = this.data.pageModelList;
  let that = this;
  return new Promise((rs, rj) => {
    switchApi.call(this, pageModelList[i].bindType, pageModelList[i], i).then(res => {  //数据分开整理  motion_data的形成
      // console.log(i,'数据then', pageModelList[i].moduleId,this.motion_data[i],pageModelList[i].bindType);
      this.loadModuleObj[`${pageModelList[i].moduleId}`] = this.hideModule[i];
      this.setData({
        [`hideModule[${i}]`]: this.hideModule[i], 
      })
      // console.log(i,'hideModule', this.hideModule,this.hideModule[i])
      wx.nextTick(() => {
        that.setData({
          [`motion_data[${i}]`]: that.motion_data[i] || [],
        })
      })
      rs(res);
    }).catch(e => {
      // console.log('-------switch catch',e)
      rs(e)
    })
  })
}

//底边界刷新、首次加载足够x屏内容:
function lazyLoad(id = '', id_len = 1, msg) {
  if (!id) return;
  const query = wx.createSelectorQuery().in(this);
  let data = this.data.motion_data || [];
  let that = this; 
  query.selectAll(id).boundingClientRect(function (res) {
    id_len = res && (res.length - 1) || 0;
    // console.log('resresres', res[id_len].top - res[0].top, res, that.nodeInfo);
    if (((!res || res.length <= 1 || !res[id_len]) || (res[id_len].top - res[0].top < 0)) && that.Screen_Num != 1 ) return;  //刚好边界模块被隐藏了  数据不准确return
    // --节点跳转--
    // for (let i = 0, len = id_len; i <= len; i++) {
    //   if(res[i] && res[i].id){
    //     that.nodeInfo[res[i].id] = that.nodeInfo[res[i].id] || {};
    //     that.nodeInfo[res[i].id].topLine = res[i].top - res[0].top;
    //     if (i == 0 && that.nodeInfo[res[0].id].moduleId) { continue; };
    //     that.nodeInfo[res[i].id] = { ...that.nodeInfo[res[i].id], ...msg[res[i].id] };
    //   }
    // }
    if (!res[id_len])return
    that.bottom_line = res[id_len].top - res[0].top || that.bottom_line; //刷新底边界
    // console.log('模块',id, ' 新边界', res[id_len].top - res[0].top,res);
    if (that.Screen_Num != 1) return //只有首次加载检测补全
    if ((res[id_len].top - res[0].top) <= (that.X_Screen * that.Screen_Num)) { //动态检测x屏内
      if (((res[id_len]['top'] - res[0]['top']) + res[id_len].height) > (that.X_Screen * that.Screen_Num) + 50) {
        //检测 边界+最后的模块内容height 内容撑满x屏
        that.Screen_Num += 1;
        return
      }
      //当前内容 < x屏高度 ，继续loadData
      loadData.call(that,false,true); 
    } else { //满足x屏外
      that.Screen_Num += 1;
      return
    }
  }).exec()
}

//框架数据初始化
function initData(pageModelList, imgUrl = '') {
  let page_module_list = pageModelList || [];
  let arr = [];
  page_module_list && page_module_list.forEach((item, index) => {
    let temp = ''
    item.hasData = true;
    if (item.bindType == 7 || item.bindType == 8) {
      temp = {};
    } else if (item.bindType == 1 || item.bindType == 2) {
      temp = [];
    } else {
      temp = new Array(1).fill({});
    }
    arr.push(temp);
  });
  this.setData({
    motion_data: arr || [],
  })
  // console.log('总的初始化', arr, this.data.pageModelList);
  return arr;
}

function mapData(data = []) { //热点处理
  data.forEach((item, index) => {
    let extend_content = item.extend_content || "";
    let func_type = item.func_type || "";
    
    item.customData = {
      func_type: func_type,
      related_id: item.related_id || '',
      link_url: item.link_url,
      stringJump: extend_content,
      tag: item.rd_tag || item.tag,
      goods_id: item.goods_id,
      page_id: item.page_id
    }
    // console.log(item.customData,"-----------customData");
    if (extend_content && func_type == "RD") {
      let map_data = extend_content.replace(/'/g, '"');
      map_data = JSON.parse(map_data);
      for (let k in map_data) {
        map_data[k].x = map_data[k].x * 100;
        map_data[k].y = map_data[k].y * 100;
        map_data[k].w = map_data[k].ex * 100 - map_data[k].x;
        map_data[k].h = map_data[k].ey * 100 - map_data[k].y;
      }
      item.map_data = map_data;
    }
  })
}

function stopCountDown(countDown) {
  if (countDown) {
    countDown.stop();
  }
}

//-------新修改
function initModuleCountDown(mId, actId, mStart, mEnd) {
  if (!mId || !actId) return;
  let aCD = this.actCountDown || {};
  mStart = mStart ? MyDate.parse(mStart) : '';
  mEnd = mEnd ? MyDate.parse(mEnd) : '';
  let cD = {
    mStart,
    mEnd
  };
  if (aCD[mId]) {
    if (mStart)
      aCD[mId].mStart = aCD[mId].mStart > mStart ? mStart : aCD[mId].mStart
    if (mEnd)
      aCD[mId].mEnd = aCD[mId].mEnd > mEnd ? aCD[mId].mEnd : mEnd

  } else {
    aCD[mId] = {
      mStart,
      mEnd,
      cDs: {}
    }
  }
  aCD[mId].cDs[actId] = cD;
  this.actCountDown = aCD;
}

function setModuleCountDown() {
  let aCD = this.actCountDown || {};
  for (let i in aCD) { //模块遍历     
    let mStart = aCD[i].mStart;
    let mEnd = aCD[i].mEnd;
    let servTime = MyDate.parse(this.serverTime);
    if (servTime >= mEnd) {
      setTimeData.call(this, i, aCD[i].cDs, {},{over:true});
      if (aCD.countDown) {
        stopCountDown.call(this, aCD.countDown);
      }
    } else {
      if (!aCD[i].countDown) {
        aCD[i].countDown = new CountDown(servTime);
      }
      let targetTime = mEnd;
      if (mStart > servTime) {
        targetTime = mStart;
      }
      if (!aCD[i].countDown.isRunning) { //已存在的模块倒计时不会进去start
        aCD[i].countDown.setTarget(targetTime);
        aCD[i].countDown.start(e => {
          if (e.value <= 0) {
            stopCountDown.call(this, aCD[i].countDown);
          } else {
            setTimeData.call(this, i, aCD[i].cDs, e);
          }
        })
      }
    }
  }
}

function setTimeData(mId, cDs, time,extra={}) {
  let servTime = new Date(time.nowTime);
  for (let i in cDs) { //模块里面的多活动遍历
    let mStart = cDs[i].mStart;
    let mEnd = cDs[i].mEnd;
    let active = 0; //0:未开始，1：进行中，2：结束
    let _value = "";
    if (extra.over || servTime > mEnd || servTime == mEnd) { //结束
      _value = "";
      active = 2;
    } else {
      let targetTime = mStart > servTime ? mStart : mEnd;
      active = mStart > servTime ? 0 : 1;
      _value = targetTime.getTime() - servTime.getTime();
    }
    cDs[i] = {
      active,
      ...cDs[i],
      ...timeHandle.call(this, _value)
    }
  } //先遍历全部活动 再下面setData
  this.data.actCountDown[mId] = cDs
  this.setData({
    actCountDown: this.data.actCountDown
  })
  if(!this.firstShow){
    this.firstShow = true;
    // console.log('倒计时',this.actCountDown);
  }
  // console.log('倒计时',this.actCountDown);  //每秒log
}

function timeHandle(value) {
  if (!value) return "";
  let day = Math.floor(value / (60 * 60 * 24 * 1000));
  let hour = parseInt(value % (60 * 60 * 24 * 1000) / (1000 * 60 * 60));
  let minutes = parseInt((value % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = parseInt((value % (1000 * 60)) / 1000);
  let data = {};
  data.day = day;
  data.hour = hour > 9 ? hour : '0' + hour;
  data.min = minutes > 9 ? minutes : '0' + minutes;
  data.sec = seconds > 9 ? seconds : '0' + seconds;
  return data;
}

function createObjKeyValTag(obj, key, isArray, key2, bindType = '') {
  if (obj instanceof Array) {
    let json = {};
    for (let i in obj) {
      let Id = obj[i][key];
      if (key == 'pic_path' && bindType == 1) {
        Id = this.data.img_url + obj[i][key];
      }
      if (this.tag) {
        if ((Id in this.tag)) {
          // console.log('tag已存在', Id)
          continue
        }
      }
      if (this.path) {
        if ((Id in this.path)) {
          // console.log('path已存在', Id)
          continue
        }
      }
      if (isArray) {
        if (!json[Id]) {
          json[Id] = []
        }
        let value = obj[i][key2];
        if (key != 'pic_path' && bindType == 1) {
          value = this.data.img_url + obj[i][key2]; //tag
        }
        json[Id].push(value);
      } else {
        json[Id] = {
          [`${key2}`]: obj[i][key2] //path
        };
      }
    }
    // console.log('jsonjsonjson', json)
    return json;
  }
}

function setEmpty(parseIndex = '0', bindType) {
  this.hideModule[parseIndex] = true;
  if (bindType == 7 || bindType == 8) {
    this.motion_data[parseIndex] = {};
  } else {
    this.motion_data[parseIndex] = [];
  }
}

function tagSortFnc(_tag, _path, bindType,res){
  if (_tag && _tag.length > 0 && !this.alreadyLoaded) {
    _tag = createObjKeyValTag.call(this, _tag, 'goods_id', true, 'pic_path', bindType);
    _path = createObjKeyValTag.call(this, res.data.goodsTagList, 'pic_path', false, 'tag_name', bindType);
    if (!this.tag) {
      this.tag = _tag;
      this.path = _path;
      this.setData({
        tagVal: _path || {},
        tagList: _tag || {}
      })
      // console.log('初始化_tag，_path', _tag,_path);
    } else {
      let tag_check = JSON.stringify(_tag);
      let path_check = JSON.stringify(_path);
      if (tag_check != '{}' && tag_check != '[]') {
        // console.log('新增_tag', _tag)
        for (let item in _tag) {
          this.tag[item] = _tag[item];
        }
        this.setData({
          tagList: this.tag
        })
      }
      if (path_check != '{}' && path_check != '[]') {
        // console.log('新增_path', _path)
        for (let item in _path) {
          this.path[item] = _path[item];
        }
        this.setData({
          tagVal: this.path,
        })
      }
    }
  }
}

function initAttach(tab_H){
  if(!this.attachStatus){
    this.attachStatus = true
    let staffInfo = app.StorageH.get("STAFFINFO") || {};
    this.setData({
      isStaff: staffInfo.isStaffDstbData || false
    });
    this.One_Screen = (parseInt(app.SIH.windowHeight) - INIT_TOP - (tab_H || 0)) || 600;
    this.X_Screen = this.One_Screen * SCREEN_TIMES;
    this.Screen_Num = 1;
    this.loadIndex = 0;
    this.loadNum = INIT_LIMIT;
    this.motion_data = {};
    this.hideModule = {};
    this.bottom_line = this.X_Screen;
    this.checkTopVal = {};
    this.checkTopVal[this.Screen_Num] = false;
  }  
}

 

function checkNodes(top,jump='') {
  // --节点跳转--
  let lastName = '';
  let nextName = '';
  let msg = {};
  this.nodeInfo = this.nodeInfo || {};
  if (!jump){
    for (let item in this.nodeInfo) {
      if (this.nodeInfo[item].topLine < top) {
        lastName = item;
        continue;
      } else {
        nextName = item;
        break;
      }
    };
  }else{
    lastName = 'custom' + jump;
  }
  if (!lastName) return
  if (this.currentName != lastName) {
    this.currentName = lastName;
    this.triggerEvent('nodeInfo', this.nodeInfo[lastName]);
  }
  // console.log('???', 'lastName:', lastName, 'nextName:', nextName, this.nodeInfo[lastName].topLine,top, this.nodeInfo) 
}


function getPercent(inven = 0, invenSum = 0) {
  let percent = (invenSum == 0) ? 0 : inven / invenSum >= 1 ? 100 : inven / invenSum > 0.01 ? parseInt(((inven / invenSum) * 100).toFixed(2)) : parseFloat((inven / invenSum) * 100);
  percent = percent > 0 && percent < 1 ? 1 : percent;
  return percent;
}


function checkTime(activityInfo={},type) {
  activityInfo = activityInfo || {};
  let result = countDownTextHelp.getCustomSkTimeMsg.call(this, activityInfo,type);
  result = result || {};
  // console.log('time文案文案', result);
  return result
}

function sortGoods(goods=[],data={}){ //手动的商品排序
    let tempGoods = JSON.parse(JSON.stringify(goods));
    if(data.activityShowType == "manual"){
      let sort = (data.collageGroupActivityIds || "").split(',');
      let obj = {};
      let arr = [];
      let label = data.bindType == 8? 'activity_id' : data.bindType == 10? 'activity_id' : data.bindType == 11 ? 'mk_goods_id' : data.bindType == 12 ? 'activityId' : 'activity_id'
      tempGoods.forEach(item=>{
        obj[item[label]] = item;
      })
      sort.forEach(item=>{
        arr.push(obj[item]);
      })
      return arr;
    }
    return tempGoods;
}