// pages/micro_mall/bargain/bargain/order_detail.js
import Utils from "../../../../common/support/utils/utils";
var app = getApp();
Page(app.BP({
    data: {
        isIphoneX: app.SIH.isIphoneX,
        keyword: "",
        defaultTip: true,
        addressId: 0,
        isHidden: true
    },
    onLoad: function (options) {
        this.userActivityId = options.userActivityId;
        this.loading = false;
        let rightbutton = this.data.brand_info.icon_url + "micro_mall/rightbutton.png";
        this.setData({
            rightbutton
        });
    },
    onShow: function () {
        getAddress.call(this).then(addressId=>{
          console.log("addressId",addressId);
          loadData.call(this, addressId);
        });
    },
    inputRemark(e) {
        let remark = e.detail.value;
        this.setData({
            keyword: remark
        });
    },
    goAddress() {
        wx.navigateTo({
            url: "/pages/micro_mall/address/address_list",
        });
    },
    addOrder() {
        controlClick.call(this, () => {
            if (this.data.addressId == 0) {
                app.SMH.showToast({
                    "title": "请填写收货地址"
                });
                return;
            }
            createOrder.call(this);
        });
    }
}))
function loadData(addressId) {
    if (!this.loading) {
        this.loading = true;
        return app.CL_BargainApi.getUserHagglePriceSettlementPage({
            params: {
                userActivityId: this.userActivityId || 0,
                addressId: addressId || 0,
                brandCode: app.Conf.BRAND_CODE,
                userToken: app.LM.userKey
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            let data = res.data;
            if (res.code == 1) {
                this.setData({
                    goodsEntity: data.goodsEntity,
                    infoEntity: Object.assign({}, { ...data.infoEntity }, {
                        totalYouHuiPrice: Number(data.infoEntity.totalYouHuiPrice) ? data.infoEntity.totalYouHuiPrice : 0,
                        shippingFee: Number(data.infoEntity.shippingFee) ? data.infoEntity.shippingFee : 0
                    }),
                    isHidden: false
                });
                return Promise.resolve(data);
            } else {
                app.SMH.showToast({
                    "title": res.msg
                });
                return Promise.reject(res);
            }
        }).finally(() => {
            this.loading = false;
        });
    }
}

function getAddress() {
    let  p = new Promise((rs,rj)=>{
      try {
        if (app.StorageH.get('userChoiceData') && app.StorageH.get('userChoiceData').selectAddr) {
          let addressCol = app.StorageH.get('userChoiceData').selectAddr;
          this.setData({
            addressId: addressCol.address_id,
            consignee: addressCol.consignee,
            mobile: addressCol.mobile,
            address: addressCol.province_str + addressCol.city_str + addressCol.district_str + addressCol.address,
            defaultTip: false
          });
          rs(addressCol.address_id);
        } else {
          this.setData({
            defaultTip: true
          });
          rs(0);
        }
      } catch (err) {
        console.log(err);
        rs(0);
      }
    });
    return p;
}

function createOrder() {
    return app.CL_BargainApi.postHagglePriceAddOrder({
        data: {
            userActivityId: this.userActivityId || 0,
            addressId: this.data.addressId,
            remark: this.data.keyword,
            clientSessionId: app.LgMg.channel &&  app.LgMg.channel.clientSessionId || '',
            brandCode: app.Conf.BRAND_CODE,
            userToken: app.LM.userKey
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        let data = res.data;
        if (res.code == 1) {
            let userActivityId = this.userActivityId;
            let isFromOrder = true;
            wx.redirectTo({
                url: `/pages/micro_mall/bargain/bargain/order_confirm?userActivityId=${userActivityId}&&isFromOrder=${isFromOrder}`
            });
            return Promise.resolve(data);
        } else {
            app.SMH.showToast({
                "title": res.msg
            });
            return Promise.reject(res);
        }
    });
}

let controlClick = Utils.debounce(fn => {
    fn();
}, 400);