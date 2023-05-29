// pages/micro_mall/classify/adaptive_ classify/classify_one/classify_one.js
import { checkCommission } from "../../../../../common/helper/checkCommission.js";
const app = getApp();
const INIT_LIMIT = 3;
const SCREEN_TIMES = 1.2; //懒加载x屏
const SHOW_MOD = INIT_LIMIT * 1; //限制模块
const extraH = 100;
Component(app.BTAB({
  properties: {
    customTab:{
      type:Boolean,
      value:false,
    },
    extraH:{
      type: Number,
      value: -1,
    },
  },
  options: {
    addGlobalClass: true,
  },
  data: {
    tabList: [],
    dataItem: [],
    classify_list: {},
    cl_curr: 0,
    scrollTop: 0,
    goodsList: {},
    tabTemp: [{}, {}, {}, {}, {}],
    detailsTemp: [{}, {}],
    goodsStatus:{}, 
  }, 
  attached(){
    let l_color = app.getColor(this.data.brand_info.style.font_color, -4, 37, 0, 1) || '';
    this.setData({
      l_color
    })
  },
  ready(){
    this.Screen_Num= 1;
    this.loadIndex= 0;
    this.loadNum= INIT_LIMIT;
  },
  methods: { 
    init(){
      this.setData({
        showPage:true
      })
    },
    onLoadFnc(){
      if (!this.onLoadAready){
        this.onLoadAready = true;
        this.Init_Screen_H = (parseInt(app.SIH.windowHeight) || 600) - (extraH * app.SIH.windowWidth / 750);
        this.Pre_Screen_H = this.Init_Screen_H * SCREEN_TIMES;
      }
    },
    onShowFnc(data = {}) {
      if(this.data.microType == 'microPage'){
        this.pageTab = this.pageTab || this.selectComponent(`#${this.data.microType}`);
        this.pageTab.getPageData({pageType:"catelog"});
        return
      }
      if (this.saveData) {
        this.jump = false;
        this.saveData = false;
        // console.log('保留')
        return
      }
      // console.log('重置')
      this.setData({
        scrollTop: 0
      })
      getCustomCategoryList.call(this, data && data.page_id || 0).then(res => {
        loadData.call(this);
      })
    }, 
    onUnloadFnc(){ 
    },
    classifyTab(e) {
      let dataset = e.currentTarget.dataset;
      let curr = dataset.curr;
      // console.log('tabStatus', this.tabStatus, this.data.tabList)
      if (curr == this.data.cl_curr) return
      this.setData({
        cl_curr: curr,
      })
      let dataItem = RDinstall(this.dataList[curr] || []);
      this.setData({
        scrollTop: 0,
        dataItem: dataItem,
      });
      if (this.data.tabList[this.data.cl_curr].initScroll && this.data.tabList[this.data.cl_curr].initScroll.length > 0) {
        this.data.tabList[this.data.cl_curr].initScroll.forEach(item => {
          let temp = this.data.dataItem[item] || {};
          marqueeView.call(this, temp.itemDetails, temp.itemConfig, this.goodsData, item, true);
        })
      }
      // console.log('切换curr', curr, dataItem);
      app.StorageH.set('tabKey', curr);
      loadData.call(this, false, false);
      // throttle.call(this, function() {
      //   // let _curr = this.data.cl_curr      
      // }, this) 
    },
    goLink: function (e) {
      this.jump = true;
      let dataset = e.currentTarget.dataset;
      let bindType = dataset.bindType;
      if (bindType == "1") {
        dataset.name = "GOODS"
      } else if (bindType == "2") {
        dataset.name = "GOODS_LIST"
      } else {
        dataset.name = "AD"
      }
      app.pageJump(dataset);
    },
    checkTop(e) {
      let top = e.detail.scrollTop || 0;
      if (this.tabStatus[this.data.cl_curr].allDataAlready) {
        return
      }
      let _status = this.tabStatus[this.data.cl_curr];
      if (!_status) return
      // console.log('滚', top + this.Init_Screen_H, _status.bottom_line, _status.Screen_Num);
      if (top && _status.bottom_line && (_status.bottom_line - top <= this.Init_Screen_H)) { // 小于视窗高度Init_Screen_H时loadData
        if (!_status.checkTopVal[_status.Screen_Num]) {
          // console.log('滚 分页', _status.Screen_Num, ' 边界:', _status.bottom_line, ' 入屏:', _status.bottom_line - top, this.Init_Screen_H);
          _status.checkTopVal[_status.Screen_Num] = true;
          _status.bottom_line += (this.Init_Screen_H * 1.8);
          _status.Screen_Num += 1;
          loadData.call(this);
        }
      }
    },
    handle_jump(e) {
      this.jump = true
    },

    //新微页面
    handle_scroll(top){
      this.pageTab = this.pageTab || this.selectComponent(`#${this.data.microType}`);
      this.pageTab && this.pageTab.handle_scroll(top||0,'hideBackTop');
    },
    reachBottom(){
      this.pageTab = this.pageTab || this.selectComponent(`#${this.data.microType}`);
      this.pageTab && this.pageTab.reachBottom();
    },
  },
  pageLifetimes: {
    show: function () {
       
    },
    hide: function () {
      if (this.jump) {
        this.saveData = true;
      } else {
        this.saveData = false;
      }
    },
  }
}))

function getCustomCategoryList(pageId = 0) {
  return app.GoodsApi.getCustomCategoryList({
    params: {
      pageId: pageId,
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  })
    .then(e => {
      if (e.code == 1) {
        let data = e.data;
        let j = 0,
          cl_curr;
        let tabList = [];
        let dataList = [];
        let tabStatus = [];
        for (let i in data) {
          if (j === 0) {
            cl_curr = i
          }
          tabList[i] = {
            func_name: data[i].func_name,
            sort_order: data[i].sort_order,
            curr_show_mod: SHOW_MOD
          }
          //初始化
          tabStatus[i] = {
            func_name: data[i].func_name,
            loadIndex: 0,
            allDataAlready: false,
            Screen_Num: 1,
            bottom_line: this.Pre_Screen_H,
            checkTopVal: {},
            curr_show_mod: SHOW_MOD
          }
          tabStatus[i].checkTopVal[this.Screen_Num] = false;
          dataList[i] = data[i].items;
          j++;
        }
        this.dataList = dataList;
        if (app.StorageH.get('tabKey') && app.StorageH.get('tabKey') != "") {
          cl_curr = app.StorageH.get('tabKey');
        }
        this.tabStatus = tabStatus;
        this.setData({
          tabList: tabList,
          dataItem: RDinstall(dataList[cl_curr] || []),
          cl_curr: cl_curr,
        })
        // console.log('分类', '\n', this.data.tabList, '\n', dataList, '\n', dataList[cl_curr]);
        return Promise.resolve(dataList[cl_curr]);
      }
      return Promise.reject();
    })
}


function loadData(reset = false, scroll = true) {
  let _status = this.tabStatus[this.data.cl_curr];
  if (!scroll && !reset && _status.loadIndex > 0) {
    // console.log('初始化过,return');
    return
  }
  if (_status.allDataAlready) {
    // console.log('load完过，return')
    return
  }
  let dataItem = this.data.dataItem || [];
  let limitS = _status.loadIndex * this.loadNum < dataItem.length ? _status.loadIndex * this.loadNum : dataItem.length;
  _status.loadIndex += 1; // 
  let limitE = _status.loadIndex * this.loadNum < dataItem.length ? _status.loadIndex * this.loadNum : dataItem.length;

  let curr_show = this.data.tabList[this.data.cl_curr].curr_show_mod;
  if (curr_show < limitE) { //限制模块的累加开放
    setTimeout(() => {
      this.data.tabList[this.data.cl_curr].curr_show_mod = this.data.tabList[this.data.cl_curr].curr_show_mod += INIT_LIMIT;
      this.setData({
        tabList: this.data.tabList
      })
      // console.log('当前curr_show_mod', this.data.tabList[this.data.cl_curr].curr_show_mod)
    }, 500)
  }
  if ((limitE - limitS < this.loadNum || limitE == dataItem.length) || ((limitS >= dataItem.length && dataItem.length > 0) && !reset)) {
    _status.allDataAlready = true;
    // console.log('加载完', limitE - 1,this.data.dataItem,this.goodsData)
    if (((limitS >= dataItem.length && dataItem.length > 0) && !reset)) {
      return
    }
  }
  // console.log('加载', limitS, limitE, '限模块:',curr_show)
  promiseAll.call(this, limitS, limitE, this.loadNum).then(res => {
    // console.log('promiseAll', '当前tab:', this.data.cl_curr,'limitS,E:',limitS, limitE, res);
    // console.log(this.data.dataItem,this.goodsData);

    res && res.forEach(item => {
      if (item || item == 0) {
        let temp = this.data.dataItem[item] || {};
        marqueeView.call(this, temp.itemDetails, temp.itemConfig, this.goodsData, item);
      }
    })

    if (!_status.allDataAlready) {
      let _timer = setTimeout(() => {
        lazyLoad.call(this, limitE - 1); //promiseAll数据之后计算bottom_line，若是首次打开则还会计算首屏
        clearTimeout(_timer);
      }, 500);
    }
  })
}

function switchType(index = 0, end = 0, num = this.loadNum) {
  let p = new Promise((rs, rj) => {
    this.goodsData = this.goodsData || {};
    let data = this.data.dataItem || [];
    let cur = this.data.cl_curr || 0;
    let arr = [];
    this.noneObj = this.noneObj || {};
    // console.log('模块', index, data[index].itemConfig ? data[index].itemConfig.bind_type == '1' ? "商品" : "分类" : "广告", data[index].itemDetails, data[index].itemConfig);
    if (data[index].status) {
      // console.log('模块', index, '已经加载过return');
      return rs();
    };

    if (!data[index].itemConfig) { //广告
      data[index].status = true;
      return rs();
    } else if (data[index].itemConfig.bind_type == '2') { //分类 
      return searchGoodsList.call(this, data[index].itemConfig, rs).then(res => {
        data[index].status = true;
        let mapData = res && res.data && Array.isArray(res.data.goods_list) && res.data.goods_list || [];
        let newIds = [];
        mapData.forEach(item => {
          let temp = {};
          if (!this.goodsData[item.goods_id]) { //新数据
            newIds.push(item.goods_id);
            temp = {
              ...item,
              status: true
            }
            data[index].itemDetails.push(temp);
            this.goodsData[item.goods_id] = {
              ...this.goodsData[item.goods_id],
              ...item,
              status: true
            }
          } else { //重复数据
            temp = {
              ...item,
              status: true
            }
            data[index].itemDetails.push(temp);
          }
        })
        if(newIds.length>0){
          getCommission.call(this,newIds.join(','));
        }
        if (data[index].itemConfig.module_styles == '3') {
          // marqueeView.call(this, data[index].itemDetails, data[index].itemConfig, this.goodsData, index);
          return rs(index);
        }
        return rs();
      }).catch(e => {
        // console.log('分类catch', e);
        return rs();
      });
    } else if (data[index].itemConfig.bind_type == '1') { //单品
      let details = data[index].itemDetails || [];
      data[index].status = true;
      for (let i=0,len=details.length;i<len;i++) {
        let id = details[i].goods_id;
        if (this.goodsData[id]) { //已经存在的goods
          continue
        };
        arr.push(id); //需要加载的goodsId
        this.goodsData[id] = this.goodsData[id] || {};
        this.goodsData[id].status = false;
        this.goodsData[id].img_path = details[i].img_path || false;
      };
      if (arr.length <= 0) {
        if (data[index].itemConfig.module_styles == '3') { //左右滑动
          return rs(index);
        }
        return rs();
      };
      return goodsListByGoodsIds.call(this, arr).then(res => { //需要下载的goods
        let mapData = res && res.data && Array.isArray(res.data.goodsList) && res.data.goodsList || [];
        let newIds = [];
        arr.forEach(item=>{
          newIds.push(item);
          (this.noneObj[item] = this.noneObj[item] || {}) && (this.noneObj[item].hide = true);
        })
        if(newIds.length>0){
          getCommission.call(this,newIds.join(','));
        }
        mapData.forEach(item => {
          this.noneObj[item.goods_id].hide = false;
          this.goodsData[item.goods_id || 0] = {
            ...this.goodsData[item.goods_id || 0],
            ...item,
            status: true
          }
        })
        if (data[index].itemConfig.module_styles == '3') { //左右滑动
          return rs(index);
        }
        return rs();
      }).catch(e => {
        // console.log('商品catch', e);
        return rs();
      })
    } else {
      return rs();
    };
  })
  return p
}

function searchGoodsList(data = {}) {
  let params = {
    functype: data.cat_type || 'CA',
    catId: data.cat_id || 0,
    strAttrId: '',
    strAttrValue: '',
    colorCatId: 0,
    startPrice: -1,
    endPrice: -1,
    strWhere: '',
    pageSize: data.show_number || app.Conf.PAGE_SIZE,
    pageIndex: 1,
    sortField: 'DEFAULT',
    sortBy: 'desc',
    goods_brand_ids: '',
    storeId: '0',
  }
  return app.RunApi.go('GoodsApi', 'searchGoodsList', params);
}

function goodsListByGoodsIds(arr = [], ) {
  let temp = arr.join(',');
  if (!temp) {
    return Promise.reject();
  }
  let params = {
    goodIds: temp
  };
  return app.RunApi.go('GoodsApi', 'getALLGoodsListByGoodsIds', params);
}

//组合x个模块为一个组合  总架构
function promiseAll(start = 0, end = 0, n = 0) { //数据加载的开始 、 结束 、 加载数量
  let arr = [];
  let that = this;
  n = end - start < n ? end - start : n; //不足n取区间
  return new Promise((rs, rj) => {
    for (let i = 0; i < n; i++) {
      arr.push(setPromise.call(that, start + i, end - 1)); //单个模块
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
  let that = this;
  return new Promise((rs, rj) => {
    switchType.call(this, i).then(res => { //数据分开整理  motion_data 的形成
      this.setData({
        noneObj:this.noneObj,
        goodsData: this.goodsData,
        dataItem: this.data.dataItem
      })
      rs(res)
    }).catch(e => {
      rs(e)
    })
  })
}

function lazyLoad(index = 0) {
  const query = wx.createSelectorQuery().in(this);
  // let cur = this.data.cl_curr;
  let _status = this.tabStatus[this.data.cl_curr];
  let that = this;
  let id = '#custom' + index + ',#custom0';
  query.selectAll(id, '#custom0').boundingClientRect(function (res) {
    // console.log('resresres', res)
    if ((!res || res.length <= 1) || ((res[1].top - res[0].top < 0) && _status.Screen_Num != 1)) return; //刚好边界模块被隐藏了  数据不准确return
    if (_status.Screen_Num <= 1) {
      _status.bottom_line = res[1].top - res[0].top + res[1].height; //刷新底边界  //new设定
    } else {
      _status.bottom_line = res[1].top - res[0].top; //刷新底边界  
    }
    // console.log('刷新边界', _status.bottom_line)
    if (_status.Screen_Num != 1) return //只有首次加载检测补全
    if ((res[1].top - res[0].top) <= (that.Pre_Screen_H * _status.Screen_Num)) { //动态检测x屏内
      if (((res[1]['top'] - res[0]['top']) + res[1].height) > (that.Pre_Screen_H * _status.Screen_Num)) {
        //检测 边界+最后的模块内容height 满足撑满x屏
        _status.Screen_Num += 1;
        return
      }
      loadData.call(that); //当前内容 < x屏高度 ，继续loadData
    } else { //超x屏外
      _status.Screen_Num += 1;
      return
    }
  }).exec()
}

//数组转jSON
function createObjKeyVal(obj, key) {
  if (obj instanceof Array) {
    let json = {};
    for (let i in obj) {
      let Id = obj[i][key];
      json[Id] = obj[i];
    }
    return json;
  }
}

function marqueeView(data = [], config = {}, details = {}, index = 0, tab = false) {
  // console.log('滑动初始化',this.data.cl_curr,index,data,details)
  if (!tab) {
    this.data.tabList[this.data.cl_curr].initScroll = this.data.tabList[this.data.cl_curr].initScroll || [];
    this.data.tabList[this.data.cl_curr].initScroll.push(index);
    // console.log('初始化数组', this.data.cl_curr, this.data.tabList[this.data.cl_curr].initScroll)
  }
  let id = '#marquee' + this.data.cl_curr + '_' + index;
  let marquee = this.selectComponent(id);
  marquee && marquee.initScroll(data, config, '', 'classify', details,this.noneObj);
}

function throttle(fn, that) {
  clearTimeout(this._throttleId);
  this._throttleId = setTimeout(() => {
    fn && typeof fn == 'function' && fn.call(that);
  }, 300)
}


function getCommission(ids){
  if(!ids)return Promise.reject();
  let params = {
    goodsIds:ids,
    goodsType:"NORMAL",
    relatedId:0
  };
  return checkCommission().then(checkConf=>{
    if(checkConf.isShowCommission){
      app.sysTemConfig('goods_list_close_commission').then(res=>{
        if(!res || res.Value != 1){
          return app.RunApi.go('GoodsApi','getGoodsCommissionAmountByTypeAll',params).then(res=>{
            let data = res.data||[];
            let commission = this.data.commission || {};
            data.forEach(item=>{
              commission[item.goods_id] = item
            })
            this.setData({
              commission,
              showCommission:true
            })
          })
        }
      })
    }
  })
}
// 转换热点数据
function RDinstall(data){
  if(data instanceof Array){
    for(let i = 0; i < data.length; i++){
      let itemDetails = data[i].itemDetails || [];
      for(let j = 0; j < itemDetails.length; j++){
        let extend_content = itemDetails[j].extend_content || '';
        if(extend_content){
          itemDetails[j]._extend_content = JSON.parse(decodeURIComponent(extend_content));
        }
      }
    }
  }
  return data;
}