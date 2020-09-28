import WindowBehaviors from "../../../../../ui/cps/window/window-behaviors";
import LM from "../../../../../helper/manager/login-manager";
import FM from "../../../../../helper/manager/form-id-manager";
import BTab from "../../../../../helper/base/base-tab.js";
import EB from "../../../../../support/tools/event-bus";
const app = getApp();

Component(
    BTab({
        behaviors: [WindowBehaviors],
        properties: {
            goodsData: {
                type: Object,
                observer: function (val) {
                    this.initData(val);
                }
            },
            submitType: {
                type: String,
                value: "add"
            }
        },
        data: {
            boxStyle: "transform: translate(0,110%); transition: all 300ms ease-in-out;",
            iconUrl: app.Conf.ICON_URL,
            count: 0
        },
        attached() {
            listen.call(this);
        },
        detached() {
            unListen.call(this);
        },
        methods: {
            onAttached() {
                this.setData({
                    boxStyle: "transform: translate(0,0);transition: all 300ms ease-in-out;"
                });
            },
            onDetached() {
                this.setData({
                    boxStyle: "transform: translate(0,110%);transition: all 300ms ease-in-out;"
                });
                return 300;
            },
            initData(goodsData) {
                goodsData || (goodsData = {});
                this.infos = goodsData.goodsInfo || {};
                this.specList = this.infos.specList;
                this.productList = this.infos.productList;
                this.productSpecList = this.infos.productSpecList;
                initSpec.call(this);
                this.setData({
                    baseInfo: goodsData.baseInfo || {},
                    specList: this.specList || null,
                    selectSpecMap: this.selectSpecMap,
                    specNumMap: getSpecNumMap.call(this),
                    ...getInfos.call(this)
                });
            },
            //选择规格
            onSelectSpec(e) {
                let dataset = e.currentTarget.dataset;
                let specId = dataset.specId;
                let specValId = dataset.specValId;
                this.setData({
                    selectSpecMap: getSelectSpec.call(this, specId, specValId),
                    specNumMap: getSpecNumMap.call(this),
                    ...getInfos.call(this)
                });
            },
            closeSpecList() {
                this.dismiss();
            },
            confirmSpecList(e) {
                // authorizeUserInfo.call(this).then(e => {
                //     confirmSpecListCallback.call(this)
                // });
              confirmSpecListCallback.call(this)
            }
        }
    })
);
//初始化规格
function initSpec() {
    let specList = this.specList;
    let productList = this.productList;
    let productSpecList = this.productSpecList;
    let selectSpecMap = this.selectSpecMap;
    let specSrc = {};
    let specValSrc = {};
    if (specList) {
        for (let i = 0, n = specList.length; i < n; i++) {
            let spec = specList[i];
            if (!spec) {
                continue;
            }
            specSrc[spec.specId] = spec;
            if (spec.valueList && spec.valueList.length > 0) {
                for (let j = 0, vn = spec.valueList.length; j < vn; j++) {
                    let specVal = spec.valueList[j];
                    if (!specVal) {
                        continue;
                    }
                    specValSrc[specVal.specValId] = specVal;
                }
            }
        }
    }
    let productMapSrc = {};
    if (productList) {
        for (let i = 0, n = productList.length; i < n; i++) {
            let product = productList[i];
            if (product && product.inventory > 0) {
                productMapSrc[product.productId] = product;
            }
        }
    }
    let specMapSrc = {};
    if (productSpecList) {
        for (let i = 0, n = productSpecList.length; i < n; i++) {
            let itemSpec = productSpecList[i];
            let product = productMapSrc[itemSpec.productId];
            if (!product) {
                continue;
            }
            let specNum = specMapSrc[itemSpec.specValId];
            if (!specNum) {
                specNum = { specId: itemSpec.specId, productMap: {} };
                specMapSrc[itemSpec.specValId] = specNum;
            }
            specNum.goodsNum += product.inventory;
            specNum.productMap[product.productId] = 1;
        }
    }
    let _selectSpecMap = {};
    if (selectSpecMap) {
        for (let specId in selectSpecMap) {
            let specValId = selectSpecMap[specId];
            if (specSrc[specId] || specValSrc[specValId]) {
                _selectSpecMap[specId] = specValId;
            }
        }
    }
    this.specSrc = specSrc;
    this.specValSrc = specValSrc;
    this.productMapSrc = productMapSrc;
    this.specMapSrc = specMapSrc;
    this.selectSpecMap = _selectSpecMap;
}
//找出可选规格
function getSpecNumMap() {
    let specMapSrc = this.specMapSrc;
    let selectSpecMap = this.selectSpecMap;

    let specNumMap = {};
    for (let specValId in specMapSrc) {
        let specNum = specMapSrc[specValId];
        let productMap = specNum && specNum.productMap;
        let hasValue = hasItem.call(this, productMap);
        if (hasValue) {
            for (let specId in selectSpecMap) {
                if (specId == specNum.specId) {
                    continue;
                }
                let _specNum = specMapSrc[selectSpecMap[specId]];
                productMap = intersectMap.call(this, productMap, _specNum && _specNum.productMap);
                hasValue = hasItem.call(this, productMap);
                if (!hasValue) {
                    break;
                }
            }
        }
        specNumMap[specValId] = hasValue;
    }
    return specNumMap;
}
//组装商品信息
function getInfos() {
    let infos = this.infos;
    let specSrc = this.specSrc;
    let specValSrc = this.specValSrc;
    let selectSpecMap = this.selectSpecMap;
    let productMap = this.productMapSrc;
    let specMapSrc = this.specMapSrc;
    let mainSpecVal;
    let isComplete = true;
    for (let specId in specSrc) {
        if (!(specId in selectSpecMap)) {
            isComplete = false;
            continue;
        }
        let specValId = selectSpecMap[specId];
        let spec = specSrc[specId];
        if (spec && spec.isMain) {
            mainSpecVal = specValSrc[specValId];
        }
        let specNum = specMapSrc[specValId];
        productMap = intersectMap.call(this, productMap, specNum && specNum.productMap);
    }

    let minPrice = null,
        maxPrice = null,
        minIntegral = null,
        maxIntegral = null;
    let product = null;
    for (let key in productMap) {
        let _product = productMap[key];
        let salesPrice = _product.sales_price;
        let integral = _product.integral;
        if (minPrice == null || salesPrice < minPrice) {
            minPrice = salesPrice;
        }
        if (maxPrice == null || salesPrice > maxPrice) {
            maxPrice = salesPrice;
        }
        if (minIntegral == null || integral < minIntegral){
          minIntegral = integral
        }
        if (maxIntegral == null || integral > maxIntegral) {
          maxIntegral = integral
        }
        product = isComplete ? _product : null;
    }

    this.nowPics = {
        thumbnail: mainSpecVal ? mainSpecVal.thumbnail : infos.picture,
        picture: mainSpecVal ? mainSpecVal.picture : infos.picture
    };
    this.product = product;
    return { minPrice: minPrice, maxPrice: maxPrice, minIntegral: minIntegral, maxIntegral: maxIntegral, thumbnail: this.nowPics.thumbnail || null, product: product };
}
//
function getSelectSpec(specId, specValId) {
    let selectSpecMap = this.selectSpecMap;
    if (selectSpecMap[specId] === specValId) {
        delete selectSpecMap[specId];
    } else {
        selectSpecMap[specId] = specValId;
    }
    return selectSpecMap;
}
//添加购物车
function confirmSpecListCallback(){
    this.selectCountCp || (this.selectCountCp = this.selectComponent("#select-count"));
    let goodsCount = this.selectCountCp.getValue();
    let product = this.product;
    let baseInfo = this.data.baseInfo;
    wx.navigateTo({
      url: '/pages/point/point_settlement/integral_settlement?number=' + goodsCount + '&mkGoodsId=' + baseInfo.mkGoodsId + '&goodsId=' + baseInfo.goodsId + '&productId=' + product.productId,
    })
}
// function addToCart() {
//     this.selectCountCp || (this.selectCountCp = this.selectComponent("#select-count"));
//     let goodsCount = this.selectCountCp.getValue();
//     let product = this.product;
//     let isBuyNow = this.data.submitType == "buy" ? 1 : 0;
//     return app.ShopApi.addGoodsToShoppingCart({
//         data: {
//             token: LM.userToken,
//             productId: product.productId,
//             number: goodsCount,
//             isBuyNow: isBuyNow
//         },
//         other: {
//             isShowLoad: true
//         }
//     }).then(e => {
//         if (e.code == 1) {
//             if (!isBuyNow) {
//                 app.SMH.showToast({
//                     title: "添加成功"
//                 });
//                 this.addActionLog("ADD_SHOPPING_CART", "GOODS", {
//                     keyParam1: product.productId,
//                     keyParam2: this.infos.goodsId
//                 });
//             }
//             setTimeout(
//                 function () {
//                     this.triggerEvent("updateCartNum", null);
//                     //立即购买
//                     if (isBuyNow) {
//                         wx.navigateTo({
//                             url: "/pages/buy/settlement_page?cartIds=" + e.data
//                         });
//                         this.addActionLog("BUY_NOW", "GOODS", {
//                             keyParam1: product.productId,
//                             keyParam2: this.infos.goodsId
//                         });
//                     }
//                 }.bind(this),
//                 500
//             );
//         } else {
//             app.SMH.showToast({
//                 title: typeof e.msg == "string" ? e.msg : ""
//             });
//         }
//         this.closeSpecList();
//     });
// }
//授权
// function authorizeUserInfo() {
//     return LM.getUserTokenAsync(true);
// }
function listen() {
    this.setData({
        isLogin: LM.isLogin
    });
    this.listenLoginStatuId = EB.listen("LoginStateChange", () => {
        this.setData({
            isLogin: LM.isLogin
        });
    });
}
function unListen() {
    EB.unListen("LoginStateChange", this.listenLoginStatuId);
}
//辅助方法
//交集
function intersectMap(arrMap1, arrMap2) {
    let map = {};
    if (arrMap1 && arrMap2) {
        for (let key in arrMap1) {
            if (key in arrMap2) {
                map[key] = arrMap1[key];
            }
        }
    }
    return map;
}
//判断是否有值
function hasItem(arrMap) {
    if (!arrMap) {
        return false;
    }
    for (let key in arrMap) {
        return true;
    }
    return false;
}
