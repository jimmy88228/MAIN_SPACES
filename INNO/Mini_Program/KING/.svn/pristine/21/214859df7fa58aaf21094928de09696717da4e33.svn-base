import WxAPi from "../../../helper/wx-api-helper.js";
import coordtransform from "../../../libs/map/index.js";
const app = getApp();
Page(app.BP({
    data: {
        keyword: "",
        // store_data: [],
        currlocation: {
            o_latitude: 23.099994,
            o_longitude: 113.324520,
        },
        markers: [],
        select_store: {
            store_id: "",
            key_word: ""
        },
        showImg: 0,
        url: "",
        brand_info: {},
        isEmpty: false,
        height: 0,
        loc_f:0,
        type: ""// contactStaff:联系店员， 
                //selectByGoods: 商品详情选择门店，
                //selectByCart: 购物车切换门店，
                //selectStore: 普通选择门店，
                //""： 附近门店
    },
    page: 0,
    hasMore:true,
    all_store_data:{},
    brand_giude_point: "", 
    onLoad: function(options) {
        this.options = options;
        this.setData({
            height: wx.getSystemInfoSync().windowHeight
        })
        let store_id = options.select_store_id;
        let key_word = options.key_word ? options.key_word : '';
        let loc_f = options.loc_f ? options.loc_f : 0;
        if (typeof(store_id) != 'undefined') {
            let select_store = {
                store_id: store_id,
                key_word: key_word
            }
            this.setData({
                select_store: select_store,
                keyword: key_word,
                loc_f: loc_f
            })
          console.log('select_store', this.data.select_store)
        }
        this.authorizeData();
        //
        this.brand_guide_url = this.data.brand_info.icon_url + "micro_mall/guide_point.png";
    },
    onHide() {
        this.setData({
            isEmpty: false
        })
    },
    onShow() {},
    authorizeData(){
      let key_word = this.options.key_word || ""
      let that = this;
      app.AS.checkAuthorize("scope.userLocation", function () {
        that.setData({
          showImg: 1
        })
        getStoreData.call(that, key_word);
      }, function () {
        app.SMH.showToast({
          title: "定位失败"
        })
        that.setData({
          showImg: -1
        })
      });
    },
    onReady: function() {
        let str = this.data.brand_info.icon_url + "micro_mall/search_icon.png";
        let rightBtn = this.data.brand_info.icon_url + "micro_mall/rightbutton.png";
        this.setData({
            url: str,
            btn_url: rightBtn
        });
        this.getBandGuidePoin();
    },
    //下载网络图
    getBandGuidePoin() {
        var that = this;
        wx.downloadFile({
            url: that.brand_guide_url,
            success: function(res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                    that.brand_giude_point = res.tempFilePath
                }
            }
        })
    },
    //组装map marker
    handleMarkers: function(dataList) {
        var that = this;
        return dataList && dataList.map((item, index) => {
            var bd09togcj02 = coordtransform.bd09togcj02(item.lon, item.lat);
            return {
                iconPath: that.brand_guide_url,
                id: index,
                latitude: bd09togcj02[1],
                longitude: bd09togcj02[0],
                width: realMarker.call(that, 32, 45).width,
                height: realMarker.call(that, 32, 45).height, 
            }
        });
    },
    onReachBottom(){
      if(this.data.isEmpty){
        return;
      }
      if (this.hasMore){
        let ops = this.options || {};
        if(ops.type == "selectByGoods" || ops.type == "selectByCart"){
          let keyword = this.data.keyword;
          getStoreData.call(this, keyword);
        }else{
          this.page++;
          storeListHandle.call(this,this.all_store_data,false ,this.page);
        }
      }else{
        app.SMH.showToast({
          title:"已经到底了"
        })
      }
      
    },
    /**
     * 搜索店铺
     */
    synchroInput: function(e) {
        var val = e.detail.value;
        this.setData({
            keyword: val
        })
    },
    searchStore() {
        var keyword = this.data.keyword;
        this.page = 0;
        getStoreData.call(this, keyword);
    },
    getAddrMap(e) {
        let store_data = this.all_store_data;
        let dataset = e.currentTarget.dataset;
        let store_sub = dataset.store_sub;
        let clickType = dataset.clickType;
        let addr = store_data[store_sub].address || '';
        let city = store_data[store_sub].area_name || '';
        let distinct = store_data[store_sub].distinct || '';
        let lat = parseFloat(store_data[store_sub].lat) || 0;
        let lon = parseFloat(store_data[store_sub].lon) || 0;
        let phone = store_data[store_sub].phone || '';
        let store_id = store_data[store_sub].id || '';
        let store_name = store_data[store_sub].name || '';
        let latlon = lat + "," + lon;
        let place = lat + "," + lon;
        let select_store = this.data.select_store;
        if (clickType == "selected") { //查看门店
          let keyword = this.data.keyword;
          select_store.store_id = store_id;
          select_store.key_word = keyword;
          this.setData({
            select_store: select_store
          })
          store_data[store_sub].key_word = keyword;
          app.StorageH.set("select_store", store_data[store_sub]);
          app.SMH.showToast({
            "title":"选择成功"
          })
          let _timer = setTimeout(function () {
            clearTimeout(_timer);
            wx.navigateBack()
          }, 500)
        } else { //选择门店地址
          wx.navigateTo({
              url: "store_map?store_name=" + store_name + "&place=" + place + "&city=" + city + "&select_store_id=" + store_id + "&distinct=" + distinct + "&phone=" + phone + "&latlon=" + latlon + "&addr=" + addr + "&lat=" + lat + "&lon=" + lon + "&loc_f=" + (this.data.loc_f || 0) 
          })
        }

    }
}))
/*
 *获取当前位置
 */
function getCurrLoation() {
    let that = this;
    if (this.data.loc_f==0){ 
        return WxAPi.getLocation({
            type: 'gcj02',
        }).then(res => {
          let latitude = res.latitude;
          let longitude = res.longitude;
            let currlocation = {
                o_latitude: latitude,
                o_longitude: longitude,
            }
            this.setData({
                currlocation: currlocation,
            })
            return Promise.resolve(res);
        }).catch(e=>{
          that.data.loc_f = 1;
          that.setData({
            loc_f : true
          })
          let res = {};
          res.latitude = -1;
          res.longitude = -1;
          return Promise.resolve(res);
        })

    }else{
        console.log('定位失败');
        let res = {};
        res.latitude = -1;
        res.longitude = -1; 
        return Promise.resolve(res);
    } 
        
}

function getStoreData(searchName) {
    let sType = 0, hasPaging = false;
    // let select_store = this.data.select_store;
    let ops = this.options || {};
    let page = this.page + 1 || 1;
    let reqUrl = "getNearbyStoreList";
    let reqParams = {
      searchName: searchName || "",
      lat: -1,
      lon: -1,
      brandCode: app.Conf.BRAND_CODE,
      userToken: ops.userToken || app.LM.userToken || "",
      sType: sType //0 附近店铺 ，1店铺自提
    }
    let req = app.UserApi[reqUrl];
    switch(ops.type){
      case "selectByGoods":
        sType = 1;
        reqUrl ="getShippingStoreList";
        delete reqParams.sType;
        reqParams.goodsId = ops.goods_id;
        reqParams.pageIndex = page;
        reqParams.pageSize = app.Conf.PAGE_SIZE;
        reqParams.goodsNum = ops.goodsNum || 1;
        reqParams.type = ops.fromType == 'sk' ? 1 : 0;
        req = app.GoodsApi[reqUrl];
        hasPaging = true;
        break;
      case "selectByCart":
        sType = 1;
        reqUrl ="getShippingStoreListByCartId";
        delete reqParams.sType
        reqParams.recId = ops.rec_id;
        reqParams.pageIndex = page;
        reqParams.pageSize = app.Conf.PAGE_SIZE;
        req = app.GoodsApi[reqUrl];
        hasPaging = true;
        break;
      case "selectStore":
        sType = 1;
        reqUrl = "getNearyByInStoreListWithInventory";
        delete reqParams.sType
        reqParams.recIds = ops.recIds || 0;
        req = app.UserApi[reqUrl];
        break;
      case "contactStaff":
        break;
    }
    return getCurrLoation.call(this).then(res => {
      reqParams.lat = res.latitude;
      reqParams.lon = res.longitude;
      return req({
            params: reqParams,
            other: {
                isShowLoad: true
            }
        }).then(e => {
            if (e.code == 1) {
                let data = e.data || {};
                // let totalReocrds = data.totalReocrds || 0;
                let store_data =  (ops.type == "selectByGoods" || ops.type == "selectByCart") ? data.datalist : data;
                this.all_store_data = store_data;
                this.page = page;
                storeListHandle.call(this,store_data, hasPaging,page);
                return Promise.resolve(e);
            }
            return Promise.reject();
        })
    })
}
function storeListHandle(store_data, hasPaging = false, page = 1){
  let handleData;
  let pageSize = app.Conf.PAGE_SIZE;
  if(hasPaging){
    handleData = store_data || [];
  }else{//从全部数据中抽取
    let preIndex = (page - 1) * pageSize, nextIndex = page * pageSize;
    handleData = store_data.slice(preIndex, nextIndex) || [];
  }
  let viewData = this.data.viewData || [];
  if(handleData.length == 0){
    this.hasMore = false;
    this.setData({
      isEmpty: viewData.length == 0
    })
  }
  //获取坐标
  let markers = this.data.markers || [];
  let _markers = this.handleMarkers(handleData);
  markers = page == 1 ? _markers : markers.concat(_markers);
  //计算店铺
  let select_store = this.data.select_store || {};
  let store_id = select_store.store_id != '0' ? select_store.store_id : 0 ;
  let currlocation = handleData[0] ? {
    o_latitude: handleData[0].lat,
    o_longitude: handleData[0].lon,
  } : {};
  for (let i = 0; i < handleData.length; i++) {
      if (store_id && store_id == handleData[i].id){
          currlocation = {
              o_latitude: handleData[i].lat,
              o_longitude: handleData[i].lon,
          }
      }
    if (handleData[i].distince || handleData[i].distince == 0){
      let distince = parseFloat(handleData[i].distince);
      handleData[i].sort_str = distince.toFixed(1) + "km"
    }else{
      let sort = handleData[i].sort;
      if (parseFloat(sort) > 0) {
        handleData[i].sort_str = sort.toFixed(1) + "km";
      } else {
        sort = sort * 1000;
        handleData[i].sort_str = sort.toFixed(1) + "m";
      }
    }
  }
  this.hasMore = !(handleData.length < pageSize)
  viewData = page == 1 ? handleData : viewData.concat(handleData);
  console.log("数据",page,store_data,viewData,handleData);
  if(hasPaging){//存在分页,存起所有数据
    this.all_store_data = viewData;
  }
  this.setData({
    viewData,
    currlocation,
    markers
  })
}

function realMarker(w, h) {
    let [scale, tranferWidth, tranferHeight] = [0, 0, 0];
    wx.getSystemInfo({
        success(res) {
            scale = (750 / res.windowWidth).toFixed(2);
            tranferWidth = (w / scale).toFixed(2);
            tranferHeight = (h / scale).toFixed(2);
        }
    });
    return {
        width: Math.ceil(tranferWidth),
        height: Math.ceil(tranferHeight)
    };
}
function sortDistance(a, b) {
  let num = Number(a.productNum) - Number(b.productNum);
  let space = Number(a.sort_str.replace("km", '')) - Number(b.sort_str.replace("km", ''));
  return num;
  // if (num > 0 && space < 0){
  //   return 1
  // }else{
  //   return -1;
  // }
}
