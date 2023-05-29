const app = getApp();
import appleCode from "../../../../../common/helper/appleCode.js"
import WxApi from "../../../../../common/helper/wx-api-helper.js"
import MyStr from "../../../../../common/support/utils/string-util.js"
const PAGE_TYPE_GOODS = "STORE_STAFF_GOODS";
const PAGE_TYPE_ACTIVITY = "STORE_STAFF_ACTIVITY";
Component(app.BTAB({
  properties: {
    tabs: {
      type: Array
    },
    current: {
      type: Number
    },
    tabHeight: {
      type: Number,
      value: 80
    },
    filterHeight: {
      type: Number,
      value: 90
    },
    user: {
      type: String,
      value: ''
    }
  },
  data: {
    filter: false,
    dataList: [],
    none: [false, false],
    pics_goods: [],
    pics_acty: [],
    showInput: true,
    scrollHeight: `calc(100% - 90rpx)`,
    progressData: {},
    actionActivityId:0,
    canvasConf: {
      width: 600,
      height: 950,
    },
    paddingBox:['',''],
    // scrollBox:['','']
  },
  attached(){
    reset.call(this);  //初始化
  },

  ready() {
    let staff_car = this.data.brand_info.icon_url + "micro_mall/staff/staff_car.png";
    let staff_share = this.data.brand_info.icon_url + "micro_mall/staff/staff_share.png";
    let acty_jump = this.data.brand_info.icon_url + "micro_mall/staff/acty_jump.png";
    let acty_filter = this.data.brand_info.icon_url + "micro_mall/staff/acty_filter.png";
    let search = this.data.brand_info.icon_url + "micro_mall/staff/search.png";
    let headerImg = this.data.brand_info.logo_path + "micro_mall/applet_logo.png";
    let light_bg_color = app.getColor(this.data.brand_info.style.bg_color, 0, 0, 0, 0.1) || '';
    this.setData({
      staff_car: staff_car,
      staff_share: staff_share,
      acty_jump: acty_jump,
      acty_filter: acty_filter,
      search: search,
      headerImg: headerImg,
      light_bg_color
    }) 
  },
  methods: {
    clickInput(e) {
      if (!this.data.showInput) {
        this.setData({
          showInput: true
        })
      }
    },
    cancelInput(e) {
      this.setData({
        showInput: !this.data.showInput
      })
      // if (this.data.showInput) {
      //   this.setData({
      //     showInput: !this.data.showInput
      //   })
      // }
    },
    handleScroll(e) {
      let num = e.currentTarget.dataset.num;
      this.reflash[num] = true;
      loadData.call(this, num);
    },
    swiperChange(e) {
      this.cancelInput();
      let index = e.detail.current;
      this.triggerEvent('swiperCurrent', e.detail.current);
      this.currentIndex = e.detail.current;
      if (this.data.filter) {
        this.setData({
          filter: false
        })
      }
      if(!this.initLabelObj || !this.initLabelObj[index]){
        console.log('内部初始化');
        this.init(this.currentIndex)
      }else{
        loadData.call(this, e.detail.current);
      }
    }, 
    init(index,id,ser) {
      console.log('index',index,this.gList)
      getGroupList(index,this.gList[index]).then(gList=>{
        if(gList && gList.length>0){
          this.gId[index] = id || gList[0].groupId;
          if(this.gList[index].length<=0){
            this.gList[index] = gList;
            wx.nextTick(()=>{
              setTimeout(() => {
                checkHeight.call(this,index);
              }, 500);
            })
          }
          this.setData({
            gId:this.gId,
            gList:this.gList,
          })
        }
        console.log('进来',index,this.gId,this.gList)
        this.initLabelObj = this.initLabelObj || {};
        !this.initLabelObj[index] && (this.initLabelObj[index] = true);
        this.initLabel = true;
        if (index == 0) {
          this.currentIndex = 0;
          reset.call(this, true, this.currentIndex,ser)
        } else if (index == 1) {
          this.currentIndex = 1;
          reset.call(this, true, this.currentIndex,ser)
        }
      })
       
    },

    getSearchGoods(e) {
      this.value = e.detail.value;
      this.setData({
        value: this.value
      })
    },
    handleClick(e) {
      if (!this.isLoading[e.currentTarget.dataset.current]) {
        this.gId[this.data.current] = 0;
        this.setData({
          gId:this.gId
        })
        reset.call(this, true, e.currentTarget.dataset.current,true);
      }
    },
    jump(e) {
      let type = e.currentTarget.dataset.type;
      let numTemp = e.currentTarget.dataset.num;
      let dataList = this.data.dataList || [];
      let id = 0, path = "";
      if (type == 'goods') {
        id = dataList[0][numTemp].relatedId;
        path = `/pages/micro_mall/goods/goods_info?goods_id=${id}`;
      } else {
        if (dataList[1][numTemp].relatedType == 1){
          path = "/" + dataList[1][numTemp].relatedUrl
        }else{
          id = dataList[1][numTemp].relatedId;
          path = `/pages/micro_mall/custom_page/custom_page?page_id=${id}`
        }
      }
      if(path){
        wx.navigateTo({
          url: path,
        })
      }
    },
    handleShare: function(e) {
      if(this.btnLock){
        return
      }
      var data = e.currentTarget.dataset;
      let actionActivityId = data.activityId || 0;
      if (data.num || data.num == 0) {
        if (this.data.current == 0) {
          this.choose_goods = data.num;
          this.setData({
            currentGoods: this.dataList[0][data.num].shareTitle || this.dataList[0][data.num].activityTitle || '分享商品',
          })
        } else {
          this.choose_acty = data.num;
          this.setData({
            currentGoods: this.dataList[1][data.num].shareTitle || this.dataList[1][data.num].activityTitle || '分享商品'
          })
        }
        this.setData({
          choose: data.num,
          currentPic: data.pic,
        })
      }
      this.setData({
        filter: !this.data.filter,
        actionActivityId: actionActivityId
      })
    },
    cancleShare(e) {
      addStaffActivityLog.call(this,0); 
      this.setData({
        filter: false,
      })
    },
    copy(e) {
      let value = e.currentTarget.dataset.value || '';
      wx.setClipboardData({
        data: value,
        success: function(res) {}
      })

    },
    handlePreview(e) {
      let listIndex = e.currentTarget.dataset.listIndex;
      let picIndex = e.currentTarget.dataset.picIndex;
      let urls = this.data.current == 0 ? this.data.pics_goods[listIndex] : this.data.pics_acty[listIndex];
      wx.previewImage({
        current: urls[picIndex],
        urls: urls
      })
    },
    handleSaveImages(e) {
      if (e.currentTarget.dataset && !this.clickCant) {
        let num = e.currentTarget.dataset.num;
        addStaffActivityLog.call(this,1); 
        if (this.data.current == 0) {
          saveImages.call(this, this.data.pics_goods[num], num)
        } else {
          saveImages.call(this, this.data.pics_acty[num], num)
        }
        this.setData({
          filter: false
        })
      }
    },
    
    handle_draw(e){      
      alertMessage.call(this,this);
    },
    onTap(e){
      let dataset = e.currentTarget.dataset||{};
      let type = dataset.type||"";
      if(type == 'gTap'){
        let gId = dataset.id||0;
        this.gId[this.data.current] = gId;
        this.setData({
          gId:this.gId
        })
        this.init(this.data.current,gId);
      }
    }
  }
}))

function loadData(type = 0,ser) {
  console.log('当前id 加载',this.gId[this.data.current],this.gId)
  if (this.hasMore[type] && !this.isLoading[type] && this.reflash[type] && this.initLabel) {
    this.isLoading[type] = true;
    let api = 'CL_StoreCommApi',str='',extra={}; 
    if(this.data.current == 0){
      str = 'goodsList';
      if(!ser && this.gId[this.data.current]){
        str = 'getStaffDstbShareActivityGoodsListByGroup';
        extra.groupId = this.gId[this.data.current];
      }
    }
    if (this.data.current == 1) {
      str = 'activityPageList';
      if(!ser && this.gId[this.data.current]){
        str = 'getStaffDstbShareActivityPageListByGroup';
        extra.groupId = this.gId[this.data.current];
      }
    }
    app[api][str]({
      params: {
        // userToken: app.LM.userToken || "",
        // userToken: app.LM.userKey || "",
        // brandCode: app.Conf.BRAND_CODE,
        pageIndex: this.page[type] || 1,
        pageSize: app.Conf.PAGE_SIZE,
        searchStr: this.data.current == 0 ? this.value : '',
        manageStoreId: (app.LM.storeInfo && app.LM.storeInfo.manageStoreId) || app.StoreH.storeId || "",
        ...extra
      },
      other: {
        isShowLoad: true
      }
    }).then(res => {
      if (res.code == 1) {
        const data = res.data || {};
        let dataList = [];
        dataList = data.list || data.dataList || [];
        dataList.map((item, index) => {
          item.activityDescription = item.activityDescription.replace(/\r/ig, '\n');
          if (item.activityType == 0) {
            this.data.pics_goods.push(item.detailImgUrlList);
            this.data.dataList[0].push(item);
            if (this.tempFilePath_0.length < data.totalCount) {
              this.tempFilePath_0.push([]);
            }
          } else {
            this.data.pics_acty.push(item.detailImgUrlList)
            this.data.dataList[1].push(item);
            if (this.tempFilePath_1.length < data.totalCount) {
              this.tempFilePath_1.push([]);
            }
          }
        })
        console.log('pics_goods',this.data.pics_goods)
        console.log('pics_acty',this.data.pics_acty)
        this.hasMore[type] = (this.page[type] * app.Conf.PAGE_SIZE) < data.totalCount
        this.page[type] += 1;
        this.setData({
          dataList: this.data.dataList,
          [`none[${type}]`]: data.totalCount <= 0
        })
      } else {
        this.value = '';
        this.hasMore[type] = false;
        this.setData({
          [`none[${type}]`]: true
        })
        app.SMH.showToast({
          title: res.msg || "查询失败",
        })
      }
      return res
    }).finally(() => {
      this.value = ''
      this.isLoading[type] = false;
      this.reflash[type] = false;
      // console.log('status:', this.page, this.reflash, this.isLoading, this.hasMore, this.data.dataList);
      // console.log('page', 'reflash', 'load', 'more', 'data')
    })
  }
}


function reset(single = false, num = 0,ser) {
  console.log('resetreset',single,num)
  if (!single) {
    this.value = '';
    this.page = [];
    this.reflash = [];
    this.isLoading = [];
    this.hasMore = [];
    this.dataList = [];
    this.tempFilePath_0 = [];
    this.tempFilePath_1 = [];
    this.gId = [];
    this.gList = [];
    this.data.tabs.forEach(item=>{
      this.page.push(1);
      this.reflash.push(true);
      this.isLoading.push(false);
      this.hasMore.push(true);
      this.dataList.push([]);
      this.gId.push(0);
      this.gList.push([]);
    })
    this.setData({
      dataList: this.dataList,
    })
  } else {
    this.reflash[num] = [];
    this.isLoading[num] = [];
    this.hasMore[num] = [];
    this.dataList[num] = [];
    this.page[num] = 1;
    this.reflash[num] = true;
    this.isLoading[num] = false;
    this.hasMore[num] = true;
    this.dataList[num] = []; 
    let _data={};
    if(num==0){
      _data.pics_goods = [];
    }else{
      _data.pics_acty = [];
    }
    this.setData({
      value: '',
      ..._data
    })
    loadData.call(this,num,ser);
  }
}

//授权前置
function saveImages(arr, label) {
  let that = this;
  if (arr) {
    app.AS.modalCheckAuthorize('scope.writePhotosAlbum', {
      title: "授权提示",
      content: "正在授权小程序保存图片"
    }, function() {
      that.btnLock = true;
      initAllData.call(that,arr);
      setTimeout(()=>{
        that.shareImg = that.shareImg || that.selectComponent("#shareImg");
        that.shareImg.show();
      },500)
    })
  }
} 

function alertMessage(that) {
  that.btnLock = false;
  // that.tipToast = that.tipToast || that.selectComponent('#tipToast');
  // that.tipToast.displayHandle(false);
  that.alertModule = that.alertModule || that.selectComponent("#alertModule");
  that.alertModule.setTitle("去朋友圈分享");
  that.alertModule.setCont(['描述文字可以长按或一键复制', '图片已自动下载至手机相册', '打开微信，从手机相册中选择图片发布']);
  that.alertModule.setBtn("知道了");
  let _timer = setTimeout(() => {
    clearTimeout(_timer);
    that.alertModule.show();
  }, 300)
}
  
function initAllData(arr){
  let dataList = this.data.dataList || [];
  let current = this.data.current;
  let choose = this.data.choose;
  let thisData = dataList[current][choose] || {};
  let staffInfo = app.LM.staffInfo || {};
  let relatedId = thisData.relatedId;
  let opKind = this.currentIndex == "0" ? app.OpKind[PAGE_TYPE_GOODS] || app.OpKind.NORMAL : app.OpKind[PAGE_TYPE_ACTIVITY] || app.OpKind.NORMAL;
  let shareType = this.currentIndex == "0" ? app.ShareType[PAGE_TYPE_GOODS] || app.ShareType.NORMAL : app.ShareType[PAGE_TYPE_ACTIVITY] || app.ShareType.NORMAL;


  let paramsJson = {};
  let paramsName = "goods_id";
  let num = this.choose_goods;
  let path = "pages/micro_mall/goods/goods_info"
  let customJump = 0;
  if (this.currentIndex == "1") {
    if (thisData.relatedType == 1){
      let urlData =  MyStr.getUrlParam(thisData.relatedUrl,true);
      console.log("urlData", urlData)
      paramsJson = urlData.params;
      paramsJson.staffActivityId = thisData.activityId||0; // lately inserted
      path = urlData.path
      // paramsName = "";
      customJump = 1;
    }else{
      path = "pages/micro_mall/custom_page/custom_page"
      // paramsName = "page_id";
      paramsJson["page_id"] = relatedId;
      paramsJson["activityId"] = thisData.activityId||0;
    }
    num = this.choose_acty;
  }else{
    paramsJson["goods_id"] = relatedId
    paramsJson["activityId"] = thisData.activityId||0;
    // if (paramsName){
    // }
  }
  console.log('paramsJsonparamsJson',paramsJson,dataList[current][choose])
  let data = {
    info:{
      gen_barcode_style: this.dataList[this.currentIndex][num].gen_barcode_style,
      opKind: opKind,
      path: path,
      goodsInfo: {
        actionActivityId: this.data.actionActivityId,
        page_id : thisData.relatedId || 0
      },
      customJump,
      tabCurrent: this.currentIndex
    },
    scene: {
      shareType: shareType,
      staffCode: staffInfo.staffCode,
      ...paramsJson
    },
  };
  this.setData({
    allData:data,
    arr: arr||[]
  })
} 


function getGroupList(cur,data){
  if(data && data.length>0)return Promise.resolve(data);
  let params = {
      // brandCode:app.Conf.BRAND_CODE,
      activityType:cur
  }
  let extra = {
      diy:true
  }
  return app.RunApi.go('CL_StoreCommApi','getStaffDstbShareGroupList',params,extra).then(res=>{
    console.log('resres',res);
    let list = res.data||[];
    return list
  }).catch(e=>{
    return Promise.resolve([])
  })
}
function checkHeight(cur){
  let that = this;
  let query = this.createSelectorQuery();
  let index = cur;
  let id = `#input_box`;
  query.select(id).boundingClientRect();
  query.exec(function(res) {
    if (res[0]) {
      let h = res[0].height || 0;
      that.setData({
        [`paddingBox[${index}]`]:`padding-top:${h}px;`,
        // [`scrollBox[${index}]`]:`height:calc(100% - ${h}px);`, 
      })
    }
  })
}

function addStaffActivityLog(type){
  let current = this.data.current||0,choose = this.data.choose||0,dataList = this.data.dataList||[];
  let item = dataList[current] && dataList[current][choose] && dataList[current][choose]
  let relatedId = item.activityId;
  let shareType = type == 0 ? current == 0 ? 'GOODS_SHARE' : 'ACTIVITY_SHARE' : current == 0 ? 'GOODS_POSTER' : 'ACTIVITY_POSTER';
  this.addStaffActivityLog(shareType,relatedId); 
}