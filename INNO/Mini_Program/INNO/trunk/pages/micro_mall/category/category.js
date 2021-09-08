const app = getApp(); 
import StrH from "../../../common/helper/handle/strHandle.js";
import { checkCommission } from "../../../common/helper/checkCommission.js";
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
        tagsJson:{},
        commission:{},
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
        let l_color = app.getColor(this.data.brand_info.style.font_color, -4, 37, 0, 1) || '';
        this.setData({
            l_color,
            search_icon: search_icon,
            resetImg: resetImg,
            search_value:this.search_value||'',
            initVal:this.search_value
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
    handleTab: function(e) { //tab点击
        this.hasMore = true;
        this.page = 0;
        let newVal = e.detail;
        Object.assign(this.params, newVal)
        search.call(this, this.options);
        //调新接口
    },
    handleFilter: function(e) { //筛选点击
        this.hasMore = true;
        this.page = 0;
        let result = e.detail;
        Object.assign(this.params, result)
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
    handleFilterSearch: function(e) {
        console.log('筛选搜索',this.data.search_value,e);
        // let _value = e.detail && e.detail._value || '';
        // let _search = e.detail && e.detail._search || false;
        // let dataset = e.currentTarget && e.currentTarget.dataset || {}; 
        this.search_value = this.data.search_value || '';
        this.hasMore = true;
        this.page = 0;
        //jimmy
        this.params = {
            strAttrId: [],
            strAttrValue: [],
            colorCatId: "",
            startPrice: -1,
            endPrice: -1,
            sortField: "goods_id", //搜索关键 goods_id、price
            sortBy: "desc", //降序
            colorIds:[],
            sizeIds:[],
            goods_brand_ids: this.options.brand_ids ? [this.options.brand_ids] : []
        };
        loadProperty.call(this);
        // if (dataset.type=='search') {
            search.call(this);
        // } 
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
        return {
            title: '商品列表',
            path: '/pages/micro_mall/category/category?func_type=' + options.func_type + '&search_input=' + options.search_input + '&related_id=' + options.related_id + '&brand_ids=' + options.brand_ids
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
      console.log("boundings", this.boundings)
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
    loadTag(e){
      let dataset = e.currentTarget.dataset || {};
      let id = dataset.id;
      let index = dataset.index;
      let width = e.detail.width;
      let height = e.detail.height;
      let key = `tagJson.${id}[${index}].width`
      let key2 = `tagJson.${id}[${index}].height`
      console.log(e,'lodaTap')
      this.setData({
        [key]: width,
        [key2]: height
      })
    }
}))

function loadProperty(init = false) { //筛选信息
    let that = this;
    let search_value = this.search_value || '';
    console.log('词条', search_value, this.func_type)
    return app.GoodsApi.getGoodsPropertyList({
        params: {
            functype: this.func_type,
            strWhere: search_value,
            catId: this.options.related_id || 0,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == 1) {
            let data = e.data;
            // delete data.SizePropertyListArray;
            // console.log('datadata',data,data.SizePropertyListArray)
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
    console.log('this.params',this.params)
    let initColorCartId = (this.params['colorCatId'] != "") ? encodeURI(this.params['colorCatId']) : ("0");
    let initBrandId = encodeURI(this.params['goods_brand_ids'].join(","));
    let initColorIds = encodeURI(this.params['colorIds'].join(","));
    let initSizeIds = encodeURI(this.params['sizeIds'].join(","));
    let initAttrId = encodeURIComponent(this.params['strAttrId'].join(","));
    let initAttrValue = encodeURIComponent(this.params['strAttrValue'].join("$#_!"));
    this.isLoading = true;
    let page = this.page + 1;
    return app.GoodsApi.searchGoodsList({
        params: {
            functype: this.func_type || 'SE', //SE 搜索
            catId: this.options.related_id || 0,
            strWhere: this.search_value || "",
            pageSize: app.Conf.PAGE_SIZE,
            pageIndex: page,
            sortField: this.params.sortField,
            sortBy: this.params.sortBy, //asc/desc
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE,

            colorIds:initColorIds,
            sizeIds:initSizeIds,
            strAttrId: initAttrId,
            strAttrValue: initAttrValue,
            colorCatId: initColorCartId,
            startPrice: this.params.startPrice,
            endPrice: this.params.endPrice,
            goods_brand_ids: initBrandId,
            storeId: 0,
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == 1) {
            let data = e.data || {};
            let list = data.goods_list || [];
            let goods_list = this.data.goods_list;
            let tagList = data.goodsTagList;
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
              ids.push(item.goods_id);
              item.scoreStr = StrH.numberCarryBit(item.salesVolume);
            })
            ids = ids.join(',');
            ids && getCommission.call(this,ids);
            this.installData(list,this.page);
            setTags.call(this,tagList);
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
    colorIds:[],
    sizeIds:[],
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

function getCommission(ids){
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