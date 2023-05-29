// pages/micro_mall/presale/presale_address_info.js
const app=getApp();
Page(app.BP({

  /**
   * 页面的初始数据
   */
  data: {
       address_info:{
            addressId:0
       },
       check_null: {
            consignee: false,
            mobile: false,
            district: false
       }
  },
  onLoad: function (options) {
  },
  onReady: function () {},
  onShow: function () {
  },
  onShareAppMessage: function () {
  
  },
     showAreaPicker: function () {
          var that = this;
          var address_info = this.data.address_info;
          var check_null = this.data.check_null;
          //
          this.areaSelect = this.selectComponent("#areaSelect");
          this.areaSelect.SwitchAreaSelect(address_info.selected, function (info) {
               address_info.selected = info;
               check_null.district = false;
               that.setData({
                    address_info: address_info,
                    check_null:check_null
               })
          });
     },
     bindKeyInput: function (e) {
          var input_type = e.currentTarget.dataset.input_type;
          var address_info = this.data.address_info;
          var check_null = this.data.check_null;
          var value = e.detail.value;
          if(value){
               check_null[input_type] = false;
          }
          
          address_info[input_type] = value;
          this.setData({
               address_info: address_info,
               check_null: check_null
          });
          
     },
     validateMobileNumber: function (e) {
          var mobile_number = e.detail.value;
          var validate_mobile = false;
          if ((/^1[3456789]\d{9}$/.test(mobile_number))) {
               validate_mobile = true;
          }
          var address_info = this.data.address_info;
          address_info['mobile'] = mobile_number;
          this.setData({
               address_info: address_info,
               validate_mobile: validate_mobile,
          })
     },
     saveAddress:function(){
          var address_info = this.data.address_info;
          var check_null = this.data.check_null;
          var error_txt = '';

          if (!address_info.consignee) {
               check_null.consignee = true;
               error_txt = "请输入收货人";
          } else {
               check_null.consignee = false;
          }

          if (!error_txt && !address_info.mobile) {
               check_null.mobile = true;
               error_txt = "请输入手机号码";
          } else {
               check_null.mobile = false;
          }
          if (!error_txt && !this.data.validate_mobile) {
               check_null.mobile = true;
               error_txt = "手机号不正确";
          } else {
               check_null.mobile_is_null = false;
          }

          if (!error_txt && !address_info.selected) {
               check_null.district = true;
               error_txt = "请选择所在区域";
          } else {
               check_null.district_is_null = false;
          }

          if (!error_txt && !address_info.address) {
               check_null.address = true;
               error_txt = "请输入详细地址";
          } else {
               check_null.address = false;
          }

          this.setData({
               check_null: check_null
          })
          if (!error_txt){
               var address_from  = {
                    "consignee": address_info.consignee,
                    "country": 1,
                    "province": address_info.selected.province,
                    "city": address_info.selected.city,
                    "district": address_info.selected.district,
                    "address": address_info.address,
                    "mobile": address_info.mobile,
                    addressId: address_info.addressId
               }
               app.wxReq('', 'presale_createAddress', address_from, function (info) {
                    
                    wx.navigateBack({
                         delta: 1
                    })
               });
               
          }
     }
}))