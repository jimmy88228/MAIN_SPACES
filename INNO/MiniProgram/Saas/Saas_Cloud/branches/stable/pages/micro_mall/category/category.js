const app = getApp(); 
import StrH from "../../../common/helper/handle/strHandle.js"; 
import { checkCommission, checkStoreCommission } from "../../../common/helper/commission-helper.js";
import { getPromotionLabels } from "../../../components/promotionLabel/promotionHelper.js";
const SORT_PARAMS={
  "GOODS_ID":{sortField:"GOODS_ID",sortBy:"desc",num:0},
  "SALESVOLUME":{sortField:"SALESVOLUME",sortBy:"desc",num:1},
  "PRICE":{sortField:"PRICE",sortBy:"asc",num:2},
  // "GOODS_ID":{sortField:"goods_id",sortBy:"desc",num:0},
  // "SALESVOLUME":{sortField:"salesVolume",sortBy:"desc",num:1},
  // "PRICE":{sortField:"Price",sortBy:"asc",num:2},
}
Page(app.BP({
    /**
     * 页面的初始数据
     */
    data: {
        goods_list:[],
        goods_list1: [],//二位数组
        goods_list2: [],//二位数组
        goodsTagList: [],
        none: null,
        list_page: 1,
        has_no_data: false,
        propertyList: {},
        brand_info: app.globalData.brand_info,
        noScroll: false,
        tagJson:{},
        commission: {},
        showCommission: false,
        promotionLabels: {},
    },
    isLoading:false,
    page: 0,
    hasMore: true,
    noData:false,
    tagsInfo:{},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.options = options;
        this.search_value = decodeURIComponent(options.search_input || '');
        this.func_type = options.func_type || "SE";
        let icon_url = this.data.brand_info && this.data.brand_info.icon_url;
        let search_icon = icon_url + "micro_mall/search_icon.png";
        let resetImg = icon_url + "micro_mall/comment_edit/remove_btn_icon.png";
        getVirtualGoodsShare.call(this);
        this.setData({
            search_icon: search_icon,
            resetImg: resetImg,
            search_value:this.search_value||'',
            initVal:this.search_value || ""
        }) 
    },
    onShow() {
        this.pageHome = this.pageHome || this.selectComponent("#pageHome")
        this.pageHome.initPageHome();
    },
    onReady: function() {
        this.tab = this.tab || this.selectComponent('#tabs');
        getSortDefault(this.options,this.tab).then(res=>{ 
            this.params = res || {};
            console.log('resres',res);
            checkSalesVolume.call(this);
            search.call(this); //搜索商品
            loadProperty.call(this,true); //初始化筛选
        });
    },
    onReachBottom: function() {},
    handleScroll(e){ 
        console.log(e);
        if (this.hasMore) {
            search.call(this, this.options);
        } else {
            app.SMH.showToast({
                "title": "已经到底啦！"
            })
        }
    },
    onSort: function(e) { //tab点击
        this.hasMore = true;
        this.page = 0;
        let newVal = e.detail; 
        this.params = Object.assign({},this.params, newVal);
        search.call(this, this.options);
        //调新接口
    },
    onConfim: function(e) { //筛选点击
        this.hasMore = true;
        this.page = 0;
        let result = e.detail;
        this.params = Object.assign({},this.params, result);
        search.call(this);
    }, 
    handleFilterSearch: function(e) {
        console.log('筛选搜索',this.data.search_value,e);
        this.search_value = this.data.search_value || '';
        this.hasMore = true;
        this.page = 0; 
        this.params = {
            strAttrId: [],
            strAttrValue: [],
            colorCatId: "",
            startPrice: -1,
            endPrice: -1,
            sortField: "goods_id", //搜索关键 goods_id、price
            sortBy: "desc", //降序
            goods_brand_ids: this.options.brand_ids ? [this.options.brand_ids] : []
        };
        loadProperty.call(this);
        search.call(this);
    },
    get_value(e) {
        let value = e.detail && e.detail.value || ''
        this.search_value = value;
        this.setData({
            search_value: value
        })
    },
    resetValue() {
        this.search_value = '';
        this.setData({
            search_value: ''
        })
    },
    handleJump(e) {
        let dataset = e.currentTarget.dataset;
        let url = dataset.url;
        if (url) {
            wx.navigateTo({
                url: url,
            })
        } 
    },
    onShareAppMessage(res) {
        let options = this.options
        options.func_type = this.func_type || 'CA';
        options.search_input = this.search_input || '';
        options.related_id = options.related_id || 0;
        options.brand_ids = options.brand_ids || '';
        let extra = {};
        if(this.hasCustomShareConf && this.hasCustomShareConf.has){
          extra.imageUrl = this.hasCustomShareConf.imageUrl||"";
          extra.title = this.hasCustomShareConf.title||""; 
          extra.isCustom = true;
        }
        console.log('hasCustomShareConf',this.hasCustomShareConf,extra)
        return {
          title: '商品列表',
          path: '/pages/micro_mall/category/category?func_type=' + options.func_type + '&search_input=' + options.search_input + '&related_id=' + options.related_id + '&brand_ids=' + options.brand_ids,
          ...extra,
        }
    },
    installData(data, page) {
      if (page == 1) {
        this.list = [];
        this.setData({
          list: []
        })
      }

      this.list[page - 1] = data;//缓存数据，优化性能时使用
      this.setData({
        [`list[${page - 1}]`]: data//分页渲染数据
      })
      if (data.length == 0 || !data) return;
      //计算并记录数据的边界值
      this.boundings = Array.isArray(this.boundings) ? this.boundings : [];
      let index = page - 1;
      wx.createSelectorQuery().select(`#page${index}`).boundingClientRect((rect) => {
        if(!rect)return
        this.boundings[index] = {
          height: rect && rect.height || 0,//高度
          top: index == 0 ? rect.top : this.boundings[index - 1].top + this.boundings[index - 1].height,//上边界
          bottom: index == 0 ? rect.bottom : this.boundings[index - 1].bottom + rect.height//下边界
        };
        this.handleScroll(this.scrollTop);
      }).exec();
      
    },
    onPageScroll(e) {
      if(this.timer){
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.scrollTop = e.detail.scrollTop || 0;
      let that = this;
      this.timer = setTimeout(() => {
        that.handleScroll(this.scrollTop);
      },500)
      
    },

    handleScroll(scrollTop){
      //当前与滚动区域底部相交的元素索引
      scrollTop = scrollTop || 0
      this.index = this.index ? this.index : 0;
      this.windowHeight = this.windowHeight || app.SIH.windowHeight;
      this.boundings.forEach((item, index) => {
        if ((item.top < scrollTop + this.windowHeight) && (scrollTop + this.windowHeight <= item.bottom)) {
          this.index = index;
        }
      })
      console.log("page index",this.index);
      //当前相交元素的前2后2元素显示，超出部分隐藏
      this.data.list.forEach((item, index) => {
        if ((index == this.index || index == this.index - 1 || index == this.index - 2 || index == this.index + 1 || index == this.index + 2) && this.data.list[index] && !Array.isArray(this.data.list[index])
        ) {
          this.setData({
            [`list[${index}]`]: this.list[index]
          })
        }
        if ((index > this.index + 2 || index < this.index - 2) && Array.isArray(this.data.list[index])) {
          this.setData({
            [`list[${index}]`]: { height: this.boundings[index].height }
          })
        }
      })
      console.log("scrollTop", scrollTop)
      console.log("page data", this.data.list);
    },
    scrolltolower(){
      if (this.hasMore) {
        search.call(this, this.options);
      } else {
        app.SMH.showToast({
          "title": "已经到底啦！"
        })
      }
    },
}))

function loadProperty(init = false) { //筛选信息
    let that = this;
    let search_value = this.search_value || '';
    console.log('词条', search_value, this.func_type)
    return app.CL_GoodsApi.getGoodsPropertyList({
        params: {
            functype: this.func_type,
            strWhere: search_value,
            catId: this.options.related_id || 0,
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == 1) {
            let data = e.data;
            this.setData({
                propertyList: data
            });
            that.tab = that.tab || that.selectComponent("#tabs");
            !init && that.tab.resetFnc();
            that.tab.checkChange();
            return Promise.resolve(e);
        }
        return Promise.reject(e);
    })
}

function search() { //最终loadData接口
    if (this.isLoading) return;
    let initColorCartId = (this.params['colorCatId'] != "") ? encodeURI(this.params['colorCatId']) : ("0");
    let initBrandId = encodeURI(this.params['goods_brand_ids'].join(","));
    let initAttrId = encodeURIComponent(this.params['strAttrId'].join(","));
    let initAttrValue = encodeURIComponent(this.params['strAttrValue'].join("$#_!"));
    this.isLoading = true;
    let page = this.page + 1;
    // let func_type = options.func_type || this.func_type || 'CA'; 
    return app.CL_GoodsApi.searchGoodsList({
        data: {
            functype: this.func_type || 'SE', //SE 搜索
            catId: this.options.related_id || 0,
            strWhere: this.search_value || "",
            pageSize: app.Conf.PAGE_SIZE,
            pageIndex: page,
            sortField: this.params.sortField,
            sortBy: this.params.sortBy, //asc/desc 

            strAttrId: initAttrId,
            strAttrValue: initAttrValue,
            colorCatId: initColorCartId,
            startPrice: this.params.startPrice,
            endPrice: this.params.endPrice,
            goods_brand_ids: initBrandId, 
            goodsIds:[]
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == 1) {
            let data = e.data || {};
            let list = data.goods_list || [];
            let tagList = data.goodsTagList;
            this.setData({
              tagList
            })
            if((this.params.sortField == "DEFAULT" || this.params.sortBy == "DEFAULT")){
            // if((this.params.sortField == "DEFAULT" || this.params.sortBy == "DEFAULT") && data.sortField){
              this.params.sortField = data.sortField || "GOODS_ID";
              this.params.sortBy = data.sortBy || "DESC";
              this.tab.resetFnc(SORT_PARAMS[this.params.sortField].num,this.params.sortField == 'ASC' || (this.params.sortField == 'GOODS_ID') ? true : false);
            }
             
            this.page = page || 1;
            let noData = false
            if(list.length == 0){
              this.hasMore = false;
              if (this.page == 1){
                noData = true
              }
            }else{
              this.hasMore = true
            }
            this.setData({
              noData: noData
            })
            let ids = [];
            list && list.forEach(item=>{
              item.scoreStr = StrH.numberCarryBit(item.salesVolume);
              ids.push(item.goods_id);
            })
            ids = ids.join(',');
            ids && getCommission.call(this,ids);
            ids && getPromLabels.call(this,ids);
            this.installData(list,this.page);
            // setTags.call(this,tagList);
            return Promise.resolve(e);
        }
        return Promise.reject(e);
    }).finally(()=>{
      if(this.isLoading){
        this.isLoading = false
      } 
    })
}

function setTags(tagList){
  let tagJson = this.data.tagJson || {};
  tagList && tagList.map((item, index) => {
    let urlTemp = item.pic_path;
    let keyIndex = urlTemp.lastIndexOf("/");
    let urlKey = urlTemp.slice(keyIndex + 1);
    let goods_id = item.goods_id;
    if (!(tagJson[goods_id] instanceof Array)){
      tagJson[goods_id] = [];
    }else{
      for(let i = 0; i < tagJson[goods_id].length; i++){
        if(tagJson[goods_id][i].pic_key == urlKey){
          //同一个goods_id下存在相同的图片，不再添加
          return;
        }
      }
    }
    tagJson[goods_id].push({
      pic_path: urlTemp,
      pic_key: urlKey
    })
  })
  this.setData({
    tagJson: tagJson
  })
  console.log("tagJson",tagJson);
}

function checkSalesVolume(){
  app.sysTemConfig("is_show_goods_sales_volume").then(data=>{
    this.setData({
      showSalesVolume: data.Value||0
    })
  })
}

function getSortDefault(ops,tab) { 
  let params = {
    strAttrId: [],
    strAttrValue: [],
    colorCatId: "",
    startPrice: -1,
    endPrice: -1,
    sortField: "goods_id", //搜索关键 goods_id (重置默认)
    sortBy: "desc", //降序 
    goods_brand_ids: ops.brand_ids ? [ops.brand_ids] : [],
  };
  let label = 0; //接口数据 -- 默认排序
  if(ops.func_type == 'CA' && ops.related_id){ 
    params.sortField = "DEFAULT";
    params.sortBy = "DEFAULT";
    // params.sortField = SORT_PARAMS[label] && SORT_PARAMS[label].sortField || "goods_id";
    // params.sortBy = SORT_PARAMS[label] && SORT_PARAMS[label].sortBy || "desc";
    // tab.resetFnc(label,SORT_PARAMS[label].sortBy == 'asc' || (label == 0) ? true : false);
    return Promise.resolve(params);
  }else{
    tab.resetFnc();
    return Promise.resolve(params);
  }
}

// 获取店员的佣金信息
function getCommission(ids){
  let params = {
    goodsIds:ids,
    goodsType:"NORMAL",
    relatedId:0,
    byStore: true, // true为店员分销，false为分销员分销
  };
  const processFn = () => {
    app.RunApi.go('CL_GoodsApi','getGoodsCommissionAmount',params).then(res=>{
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
  return checkStoreCommission()
  .then(()=>processFn())
  .catch(err => {
    console.log("获取店铺分享佣金信息失败->", err)
    checkCommission().then(checkConf=>{
      if(checkConf.isShowCommission){
        params.byStore = false;
        processFn();
      }
    })
  })
}
function getPromLabels(ids){
  return getPromotionLabels(ids)
    .then(promotionLabels => {
      this.setData({
        promotionLabels: {...this.data.promotionLabels, ...promotionLabels}
      })
      return Promise.resolve(promotionLabels);
    })
}

function getVirtualGoodsShare(){
  let options = this.options||{};
  let ids = options.related_id||"";
  console.log('idsids',ids)
  if(ids.indexOf(',')>-1){
    return Promise.resolve(true)
  }else if(ids){
    return app.CL_GoodsApi.getVirtualGoodsShare({
      params:{
        catId:ids
      }
    }).then(res=>{
      if(res.code == 1){
        let data = res.data||{};
        this.hasCustomShareConf = {
          imageUrl:data.cfg_pic||"",
          title:data.cfg_title||"",
          has:!!(data.cfg_pic || data.cfg_title)
        } 
      }
      return res;
    })
  }else{
    return Promise.resolve(true)
  }
}