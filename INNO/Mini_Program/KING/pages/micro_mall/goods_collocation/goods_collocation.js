import DrawTemplate from '../goods/popup/help/template.js';

const app = getApp();
const PAGE_TYPE = "COLLOCATE_GOODS";
Page(app.BP({

    /**
     * 页面的初始数据
     */
    data: {
        isIphoneX: app.SIH.isIphoneX,
        isLogin: app.LM.isLogin,
        style_select_show: 'hide',
        swiperImages: [{}],
        data_list: [],
        select_details: {},
        color_specs_key_list: {},
        size_specs_key_list: {},
        color_specs_array: {},
        size_specs_array: {},
        customData:{
          now:{
            buy_type:"now"
          }
        },
        
    },
    // data
    onLoad: function(options) {
        this.options = options;
        let bInfo = this.data.brand_info || {};
        let g_reduce = bInfo.icon_url + "micro_mall/shopping_cart/g_reduce.png";
        let g_reduce_none = bInfo.icon_url + "micro_mall/shopping_cart/g_reduce_none.png";
        let g_add = bInfo.icon_url + "micro_mall/shopping_cart/g_add.png";
        let g_add_none = bInfo.icon_url + "micro_mall/shopping_cart/g_add_none.png";
        let ls_icon_none = bInfo.icon_url + "micro_mall/return.png";
        let ls_icon_selected = bInfo.icon_url + "micro_mall/return_active.png";
        let main_collocation = bInfo.icon_url + "micro_mall/main_collocation.png";
        this.messageBtn = bInfo.icon_url + "micro_mall/messageIcon.png"; 
        let bottomBtn = bInfo.icon_url + "micro_mall/bottom.png";
        let detail_share = bInfo.icon_url + "micro_mall/detail_share.png";
        this.setData({
            g_reduce,
            g_reduce_none,
            g_add,
            g_add_none,
            ls_icon_none,
            ls_icon_selected,
            main_collocation,
            bottomBtn,
            detail_share
        })
        assembleOptions.call(this);
    },
    onReady() {
        this.toasts_bar = this.toasts_bar || this.selectComponent("#toasts_bar");
    },
    onShow(){
      listen.call(this);
    },
    onHide(){
      unListen.call(this);
    },
    onUnload(){
      unListen.call(this);
    },
    /**
     * 显示属性选择框
     */
    showStylePop: function(e) {
      let base_info = this.data.base_info || {};
      let data_list = this.data.data_list || [];
      if (!this.isLoading) {
          this.isLoading = true;
          let dataset = e.currentTarget.dataset;
          let goodsId = dataset.goodsId;
          if (this.data.select_details[goodsId].isValid == '0') {
              let obj = {};
              obj.image = this.messageBtn;
              obj.title = `抱歉，该商品已下架或已删除`;
              this.toasts_bar.showToastDiy(obj);
              this.isLoading = false;
              return
          }
          let num = dataset.num;
          let buy_type = dataset.buy_type;
          let selectType = dataset.selectType || '';
          let isSelect;
          this.buy_type = buy_type;
          if(!data_list[num].isSelect){
            if (base_info.maxQty > 0) {//限购
              let select_num = 0;
              for (let i = 0; i < data_list.length; i++) {
                if (data_list[i].isSelect && !data_list[i].isMaster) {
                  select_num += 1;
                }
              }
              if (!(select_num < base_info.maxQty)) {
                app.SMH.showToast({
                  title: "限购" + base_info.maxQty + "款"
                })
                this.isLoading = false;
                return;
              }
            }
          }
          if (selectType && dataset.isMust != 1) { //更新商品列表选择状态
              isSelect = !data_list[num].isSelect;
          } else {
              isSelect = true
          }
          if (selectType && dataset.isMust == 1) {
              this.isLoading = false
              return
          }
          this.data.select_details[goodsId].isSelect = isSelect; //更新select goods
          this.setData({
              [`data_list[${num}].isSelect`]: isSelect,
              style_select_show: isSelect ? 'isshow' : 'ishide',
              currentGoodsId: goodsId,
              color_specs_key_list: {},
              size_specs_key_list: {},
          })
          getSpecs.call(this, goodsId, isSelect)
      }

    },
    hideStylePop: function() {
        this.setData({
            style_select_show: 'ishide',
        })
    },
    addToCart: function(e) {
        let detail = e.detail || {};
        createShoppingCart.call(this).then(e => {
          goodsPackageAddBuyCar.call(this, detail.buy_type == "now").then((isBuyNow)=>{
            if (!isBuyNow){
              this.cart = this.cart || this.selectComponent("#cart");
              this.cart.activeAnim();
            }
          })
        });
    },
    //选择颜色
    colorSelect: function(e) {
        let dataset = e.currentTarget.dataset || {}
        let id = dataset && dataset.color_id || '';
        let name = dataset && dataset.color_name || '';
        specsMap.call(this, id, '', name)
    },
    //选择尺寸
    sizeSelect: function(e) {
        let dataset = e.currentTarget.dataset || {}
        let id = dataset && dataset.size_id || '';
        let name = dataset && dataset.size_name || '';
        specsMap.call(this, '', id, name)
    },
    //校验
    checkSpecs: function(e) {
        checkSpecsFn.call(this, this.data.currentGoodsId)
    },
    //规格数量-
    reduceGoodsNum: function(e) {
        return //功能关闭
        let select_details = this.data.select_details[this.data.currentGoodsId];
        let current = select_details.select_goods_count;
        if (current > 1) {
            select_details.select_goods_count -= 1;
            select_details.sale_price = parseFloat((select_details.select_goods_count * select_details.productInfo.sale_price).toFixed(2)) ;
            this.data.select_details[this.data.currentGoodsId].select_goods_count = select_details.select_goods_count
            this.setData({
                select_details: this.data.select_details
                // [`select_details[${this.data.currentGoodsId}].select_goods_count`]: select_details.select_goods_count
            })
            addSum.call(this)
        } else {
            return
        }
    },
    //规格数量+
    addGoodsNum: function(e) {
        return //功能关闭
        let select_details = this.data.select_details[this.data.currentGoodsId];
        let current = select_details.select_goods_count;
        let total = parseInt(select_details.productInfo && select_details.productInfo.product_number || 0);
        if (total && (current < total)) {
            select_details.select_goods_count += 1;
            select_details.sale_price = parseFloat((select_details.select_goods_count * select_details.productInfo.sale_price).toFixed(2));
            this.data.select_details[this.data.currentGoodsId].select_goods_count = select_details.select_goods_count
            this.setData({
                select_details: this.data.select_details
                // [`select_details[${this.data.currentGoodsId}].select_goods_count`]: select_details.select_goods_count
            })
            addSum.call(this)
        } else {
            return
        }
    },
    onShareAppMessage(){
      let base_info = this.data.base_info || {};
      return {
        shareType: app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL,
        isCustom: true,
        title: base_info.packageName,
        path: "/pages/micro_mall/goods_collocation/goods_collocation?package_id=" + base_info.packageId,
        imageUrl: base_info.packageBgImage,
      }
    },
  /**
 * ---------分销
 */
  getShare() {
    this.shareModule = this.shareModule || this.selectComponent("#shareModule");
    this.shareModule.checkIfStaffDstb();
  },
  chooseShareType(data) {
    let base_info = this.data.base_info;
    initTemplate.call(this, base_info);
    let detail = data.detail;
    this.shareImg = this.shareImg || this.selectComponent("#shareImg");
    base_info.opKind = app.OpKind[PAGE_TYPE] || app.OpKind.NORMAL; 
    let allData = {
      info:{
        opKind: base_info.opKind 
      },
      scene: {
        "package_id": base_info.packageId,
        'staffCode': detail.shareId == 3 ? detail.staffInfo.staffCode : "",
        "shareType": app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL
      },
      draw: {
        diy: true,
        drawArr: this.drawArr,
        baseInfo: {
          canvasW: 600,
          canvasH: 900, 
          background: '#fff',
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
  /**
   * ---------分销
   */
    jump_goods_detail(e) {
        let goodsId = e.currentTarget.dataset.goodsId || 0;
        wx.navigateTo({
            url: `/pages/micro_mall/goods/goods_info?goods_id=${goodsId}`,
        })
    },
    _noFn() {}
}))
function assembleOptions(){
  let scene = this.options.scene;
  if (scene) {
    app.SHP.getParams(["package_id","staffCode"]).then((params) => {
      this.options = {
        ...this.options,
        ...params
      }
      onShowEvent.call(this, this.options);
    })
  } else {
    onShowEvent.call(this, this.options);
  }
}
function onShowEvent(){
  loadData.call(this);
}

function authorizeUserInfo() {
    return app.LM.getUserTokenAsync(true);
}

function createShoppingCart() {
    let selectNum = 0;
    let select_details = this.data.select_details;
    //遍历已选
    for (let item in select_details) {
        if (select_details[item].isSelect) {
            selectNum += 1;
        }
    }
    if ((selectNum - 1) < this.data.base_info.minimumQty) {
        let obj = {};
        obj.image = this.messageBtn;
        obj.title = `请至少选择${this.data.base_info.minimumQty}个搭配商品`;
        this.toasts_bar.showToastDiy(obj)
        return Promise.reject();
    }
    return checkSpecsFn.call(this)
}
//获取购物车数量
function getCartNum() {
    return app.BuyApi.getCartStoageCount({
        params: {
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true,
        }
    }).then(e => {
        if (e.code == 1) {
            if (e.code == "1") {
                this.setData({
                    shopping_cart_num: e.data || 0
                })
            }
            return Promise.resolve(e);
        }
        return Promise.reject();
    })
}

function loadData() {
    app.GoodsApi.get_GoodsPackageInfo({
        params: {
            packageId: this.options.package_id || 0,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        if (res.code == 1) {
            const data = res.data || {};
            const data_list = data && data.detailList || [];
            let base_info = data;
            let listTemp = data_list;
            let imgUrlList = {};
            this.currentSalePrice = 0;
            this.currentDiscountPrice = 0;
            data_list.forEach((item, index) => {
                listTemp[index].isSelect = item.isMust == 1 ? true : false; //加选择状态属性 
                imgUrlList[item.goodsId] = createObjKeyVal.call(this, item.imgUrlList, 'color_id', item.goodsId) //图片整理数据结构
                this.data.select_details[item.goodsId] = { //select_goods 的初始化
                    goodsId: item.goodsId,
                    isSelect: item.isMaster == 1 || item.isMust == 1 ? true : false,
                    productInfo: {},
                    select_color_id: '',
                    select_size_id: '',
                    select_color: '',
                    select_size: '',
                    select_goods_count: item.qty || 1,
                    sale_price: (item.salePrice * item.qty).toFixed(2)  || 0,
                    discountPrice: item.discountPrice || 0,
                    specs_key_list: {},
                    isValid: item.isValid,
                };
            })
         
            if (this.defaultColor) {
                this.setData({
                    defaultColor: this.defaultColor || ''
                })
            }
            this.setData({
                base_info: {
                    "packageName": base_info.packageName || '',
                    "packageDecription": base_info.packageDecription || '',
                    "toDate": base_info.toDate || '',
                    "maxQty": base_info.maxQty,
                    "packageBgImage": base_info.packageBgImage || '',
                    "discountPrice": base_info.discountPrice || 0,
                    "minimumQty": base_info.minimumQty || 0,
                    "packageId": base_info.packageId || 0
                },
                imgUrlList: imgUrlList,
                data_list: listTemp,
                imgUrlList: imgUrlList,
                select_details: this.data.select_details,
            })
            // console.log(this.data.select_details)
            addSum.call(this,true);
        }
    })
}

function getSpecs(goodsId, isSelect) {
    //选择规格第一步 弹窗 
    return app.GoodsApi.get_GoodsPackageProductInfo({
        params: {
            packageId: this.options.package_id,
            goodsId: goodsId,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: false
        }
    }).then(res => {
        if (res.code == 1) {
            const data = res.data || {};
            let base_info_single = data && data.GoodsTotalInfoEntity || {};
            let specs_array = data && data.ListGoodsProductInfo || [];
            let goodsExtend = data && data.goodsExtend || {};
            let defaultColor = specs_array[specs_array.length - 1].color_id;
            let defaultColorName = specs_array[specs_array.length - 1].color_name;
            let color_specs_array = {},
                size_specs_array = {},
                color_specs_key_list = {},
                size_specs_key_list = {};

            specs_array.forEach((item, index) => {
                //初始化
                color_specs_array[item.color_id] = color_specs_array[item.color_id] || [];
                size_specs_array[item.size_id] = size_specs_array[item.size_id] || [];
                color_specs_key_list[item.color_id] = color_specs_key_list[item.color_id] || {};
                size_specs_key_list[item.size_id] = size_specs_key_list[item.size_id] || {};

                color_specs_array[item.color_id].push(item);
                size_specs_array[item.size_id].push(item);
                if (Object.keys(color_specs_key_list[item.color_id]).length == 0) {
                    color_specs_key_list[item.color_id] = {
                        color_id: item.color_id,
                        color_name: item.color_name,
                    }
                }
                if (Object.keys(size_specs_key_list[item.size_id]).length == 0) {
                    size_specs_key_list[item.size_id] = {
                        size_id: item.size_id,
                        size_name: item.size_name,
                    }
                }
            })
            let select_details = this.data.select_details;
            if (!select_details[goodsId].productInfo.product_id) {
                select_details[goodsId].productInfo = base_info_single; //未选齐，productInfo赋值 
            }
            select_details[goodsId].specs_key_list.color = color_specs_key_list;
            select_details[goodsId].specs_key_list.size = size_specs_key_list;
            this.color_specs_array = color_specs_array; //颜色规格数据实时更
            this.size_specs_array = size_specs_array; //尺寸规格数据实时更

            select_details[goodsId].specs_key_list.goodsExtend = goodsExtend
            this.setData({
                select_details: select_details
            })

            addSum.call(this); //刷新左下角
            if (!select_details[goodsId].productInfo.product_id) {  //没选齐
                specsMap.call(this, defaultColor, '', defaultColorName) //进行默认选择
            } else {
                console.log('默认选齐', select_details);
                checkProductNum.call(this, select_details[goodsId].select_color_id, select_details[goodsId].select_size_id)
                //计算组合库存，按钮是否disable 
            }

            console.log('specs_array', specs_array, this.color_specs_array, this.size_specs_array)
            console.log('specs_key_list',color_specs_key_list,size_specs_key_list)
            console.log('select_details', this.data.select_details)
            return Promise.resolve()
        }
    }).finally(() => {
        this.isLoading = false
    })
}

function specsMap(colorId, sizeId, name = '') { //判定选齐，productInfo重新赋值
    let selectAll = false;
    let select_details = this.data.select_details[this.data.currentGoodsId] || {};
    if (colorId) {
        select_details.select_color_id = colorId;
        select_details.select_color = name;
    }
    if (sizeId) {
        select_details.select_size_id = sizeId;
        select_details.select_size = name
    }
    checkProductNum.call(this, colorId, sizeId) //计算组合库存，按钮可点判断
    // let select_details = this.data.select_details[this.data.currentGoodsId] || {};
    // if (select_details.specs_key_list.goodsExtend.attr_count == 2) {
    //     if (select_details.select_color_id && select_details.select_size_id) {
    //         selectAll = true;
    //         // console.log('选齐', select_details.select_color_id, select_details.select_size_id, this.color_specs_array, this.size_specs_array);
    //         this.color_specs_array[select_details.select_color_id].forEach((item, index) => {
    //             if (select_details.select_size_id == item.size_id) {
    //                 select_details.productInfo = item;
    //                 select_details.sale_price = item.sale_price * select_details.select_goods_count;
    //                 // select_details.productInfo.sale_price = item.sale_price * select_goods_count;
    //                 select_details.selectAllDiscount = parseFloat(((item.market_price - item.sale_price) * select_details.select_goods_count) || 0).toFixed(2)
    //             }
    //         })
    //     }
    //     // else {
    //     //     console.log('没选齐', this.color_specs_array, this.size_specs_array);
    //     // }
    // } else if (select_details.specs_key_list.goodsExtend.attr_count == 1) { //单规格
    //     selectAll = true;
    //     if (select_details.select_color_id || select_details.select_size_id) {
    //         this.color_specs_array[select_details.select_color_id].forEach((item, index) => {
    //             if (select_details.select_color_id == item.color_id) {
    //                 select_details.productInfo = item;
    //                 select_details.sale_price = item.sale_price * select_details.select_goods_count;
    //                 select_details.selectAllDiscount = parseFloat(((item.market_price - item.sale_price) * select_details.select_goods_count) || 0).toFixed(2)
    //             }
    //         })
    //     }
    // }
    

     if (select_details.specs_key_list.goodsExtend.attr_count == 2) {
        if (select_details.select_color_id && select_details.select_size_id) {
            selectAll = true; 
        } 
    } else if (select_details.specs_key_list.goodsExtend.attr_count == 1) { //单规格
        selectAll = true;
         
    }
    this.data.select_details[this.data.currentGoodsId] = select_details;
    this.setData({
        select_details: this.data.select_details,
    })
    if (selectAll) {
        addSum.call(this); //选齐刷新左下角
    }
    console.log(this.data.select_details)
}

function checkSpecsFn(goodsId) { //校验
    if (goodsId) {
        let select_details = this.data.select_details[goodsId];
        if (select_details.productInfo && select_details.productInfo.product_id) {
            this.setData({
                style_select_show: 'ishide',
            })
        } else {
            let obj = {};
            obj.image = this.messageBtn;
            obj.title = `请先选择商品规格`;
            this.toasts_bar.showToastDiy(obj)
        }
    } else {
        let select_details = this.data.select_details;
        let detail = [];
        for (let item in select_details) {
            if (select_details[item].isSelect && !(select_details[item] && select_details[item].productInfo && select_details[item].productInfo.product_id)) {
                let obj = {};
                obj.image = this.messageBtn;
                obj.title = `请先选择商品规格`;
                this.toasts_bar.showToastDiy(obj)
                return Promise.reject()
            } else {
                if (select_details[item].isSelect) {
                    if (select_details[item].productInfo.product_number == 0) {
                        app.SMH.showToast({
                            title: '存在库存不足的商品'
                        })
                        return Promise.reject()
                    }
                    detail.push({
                        goodsId: select_details[item].goodsId,
                        goodsNumber: select_details[item].select_goods_count,
                        productId: select_details[item].productInfo.product_id,
                    })
                }
            }
        }
        this.detail = detail || [];
        return Promise.resolve()
    }
}

function goodsPackageAddBuyCar(buyNow = false) { //加购物车、立即购买
    if (!this.isLoading) {
        this.isLoading = true;
        return app.GoodsApi.post_GoodsPackageAddBuyCar({
            data: {
                userToken: app.LM.userToken,
                brandCode: app.Conf.BRAND_CODE,
                detail: this.detail,
                packageId: this.options.package_id,
                isBuyNow: buyNow ? 1 : 0,
                urlCode: ''
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            if (res.code == 1) {
                const data = res.data || [];
                if (!buyNow) {
                  setTimeout(()=>{
                    app.SMH.showToast({
                      title: '加入购物车成功'
                    })
                  },500)
                } else {
                    let sendData = data.join(",")
                    var userChoiceData = app.StorageH.get('userChoiceData') || {};
                    userChoiceData.rec_str = sendData;
                    app.StorageH.set('userChoiceData', userChoiceData);
                    wx.navigateTo({
                        url: '/pages/micro_mall/buy/buy?rec_str=' + sendData,
                    })
                }
               return Promise.resolve(buyNow); 
            } else {
                app.SMH.showToast({
                    title: res.msg || '商品异常'
                })
                return Promise.reject("");
            }
        }).finally(() => {
            this.isLoading = false;
        })
    }
    return Promise.reject("");
}

function addSum(first=false) { //合计价格
    let select_details = this.data.select_details;
    let singlePrice = 0;
    let singleDiscount = 0;
    let totalPrice = 0;
    let totalDiscount = 0;
    let select_details_current;
    if (!first){
        let select_details_current = this.data.select_details[this.data.currentGoodsId] || {};
        if (select_details_current.specs_key_list.goodsExtend.attr_count == 2) {
            if (select_details_current.select_color_id && select_details_current.select_size_id) {
            
                // console.log('选齐', select_details_current.select_color_id, select_details_current.select_size_id, this.color_specs_array, this.size_specs_array);
                this.color_specs_array[select_details_current.select_color_id].forEach((item, index) => {
                    if (select_details_current.select_size_id == item.size_id) {
                        select_details_current.productInfo = item;
                        select_details_current.sale_price = parseFloat((item.sale_price * select_details_current.select_goods_count).toFixed(2));
                        // select_details_current.productInfo.sale_price = item.sale_price * select_goods_count;
                        select_details_current.selectAllDiscount = parseFloat(((item.market_price - item.sale_price) * select_details_current.select_goods_count) || 0).toFixed(2)
                    }
                })
            }
            // else {
            //     console.log('没选齐', this.color_specs_array, this.size_specs_array);
            // }
        } else if (select_details_current.specs_key_list.goodsExtend.attr_count == 1) { //单规格
          
            if (select_details_current.select_color_id || select_details_current.select_size_id) {
                this.color_specs_array[select_details_current.select_color_id].forEach((item, index) => {
                    if (select_details_current.select_color_id == item.color_id) {
                        select_details_current.productInfo = item;
                        select_details_current.sale_price = parseFloat((item.sale_price * select_details_current.select_goods_count).toFixed(2));
                        select_details_current.selectAllDiscount = parseFloat(((item.market_price - item.sale_price) * select_details_current.select_goods_count) || 0).toFixed(2)
                    }
                })
            }
        }
    }
    if (select_details_current) {
        this.data.select_details[this.data.currentGoodsId] = select_details_current;
    }

    for (let item in select_details) {
        let temp = select_details[item];
        if (temp.isSelect) {
            if (select_details[item] && select_details[item].productInfo && select_details[item].productInfo.product_id) {
                singleDiscount = parseFloat(((temp.productInfo.market_price - temp.productInfo.sale_price) * temp.select_goods_count).toFixed(2) || 0);
                // singlePrice = parseFloat((temp.productInfo.sale_price).toFixed(2) || 0)
                singlePrice = parseFloat(temp.sale_price|| 0)
            } else {
                singleDiscount = parseFloat(temp.discountPrice || 0)
                singlePrice = parseFloat(temp.sale_price|| 0)
            }
            totalPrice += singlePrice;
            totalDiscount += singleDiscount;
        }
    }
    this.setData({
        totalPrice: totalPrice.toFixed(2),
        totalDiscount: totalDiscount.toFixed(2),
        select_details: this.data.select_details
    })
}

function checkProductNum(colorId = '', sizeId = '') { //设置select_details的规格key的库存（按钮实时disable） 
    let select_details = this.data.select_details;
    if (colorId) {
        this.color_specs_array[colorId].forEach(item => {//遍历color array  寻找对应size  并赋值product_number
            if (colorId == item['color_id']) {
                select_details[this.data.currentGoodsId]['specs_key_list']['size'][item.size_id]['product_number'] = item.product_number || 0
            }
        })
    }
    if (sizeId) {
        this.size_specs_array[sizeId].forEach(item => { //遍历size array  寻找对应color  并赋值product_number
            if (sizeId == item['size_id']) {
                select_details[this.data.currentGoodsId]['specs_key_list']['color'][item.color_id]['product_number'] = item.product_number || 0
            }
        })
    }
    this.setData({
        select_details: select_details
    })
}

function createObjKeyVal(arr = [], key = '', goodsId = '') { //图片数组转化成颜色对应图片的对象、及建立默认显色的对象
    let obj = {};
    this.defaultColor = this.defaultColor || {};
    if (arr instanceof Array) {
        arr.forEach(item => {
            if (!obj[item[key]]) {
                obj[item[key]] = []
            }
            obj[item[key]].push(item)
            if (goodsId) {
                this.defaultColor[goodsId] = item[key];
            }
        })
    }
    return obj
}
function listen() {
  if (app.LM.isLogin) {
    this.setData({
      isLogin: app.LM.isLogin
    });
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    this.setData({
      isLogin: app.LM.isLogin
    });
  });
}
function unListen() {
  clearTimeout(this.loadingId);
  app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
  app.EB.unListen("SceneParamsChange", this.sceneParamsChangeId);
}
function initTemplate(goods_info = {}) {
  if (this.drawArr && this.drawArr.length>0)return
  goods_info = goods_info || {};
  let canvasW = 600;
  let canvasH = 900;
  let padding = 30;
  let baseH = 10;
  let baseTopLine = canvasW + 20; 
  let baseBottomLine = canvasH - padding;
  let line = 0;
  this.drawArr = this.drawArr || [];

  let bg = DrawTemplate.initData('image', 0, 0, canvasW, canvasW);
  bg.url = goods_info.packageBgImage || '';
  bg.mode = 'widthFix';
  bg.adaptive = 'middle';
  this.drawArr.push(bg);

  if (goods_info.packageName){
    let packageName = DrawTemplate.initData('text', padding, baseTopLine, 280);
    packageName.ellipsis = 4;
    packageName.text = goods_info.packageName;
    this.drawArr.push(packageName);
    line += 1;
  }
  
  if (goods_info.discountPrice && parseFloat(goods_info.discountPrice) > 0){
    line += 1;
    let price = DrawTemplate.initData('text', padding, 0);
    price.text = '最多可省' + goods_info.discountPrice;
    price.position = 'relative';
    price.extraH = line == 2 ? 35 : baseH;
    price.color = this.data.brand_info.style.font_color || '#000';
    this.drawArr.push(price);
  }
   
  if (goods_info.toDate){
    line+=1;
    let toDate = DrawTemplate.initData('text', padding, 0);
    toDate.size = 24;
    toDate.extraH = line == 2 ? 35 : baseH;
    toDate.color = '#7f7f7f';
    toDate.text = '活动至' + goods_info.toDate;
    toDate.position= 'relative';
    this.drawArr.push(toDate);
  }
  if (goods_info.packageDecription){
    line+=1;
    let decrip = DrawTemplate.initData('text', padding, 0,280);
    decrip.size = 24;
    decrip.color = '#7f7f7f';
    decrip.text = goods_info.packageDecription;
    decrip.ellipsis = 3;
    decrip.position = 'relative';
    decrip.extraH = line == 2 ? 35 : baseH;
    this.drawArr.push(decrip);
  }
    
}