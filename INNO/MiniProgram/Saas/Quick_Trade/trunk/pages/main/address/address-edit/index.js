import StrH from "../../../../common/utils/string/index"
const App = getApp();
Page(App.BP({
  data: {
    address_data:{
      province_str: "省份/直辖市",
      city_str: "城市",
      district_str: "地区",
    },
    validate_mobile: true,
    check_null:{
      consignee_is_null:false,
      mobile_is_null:false,
      district_is_null:false,
      address_is_null:false
    }
  },
  onLoad: function (options) {
    this.options = options;
  },
  onShow(){
    getEditAdress.call(this,this.options);
  },
  onHide(){
    App.StorageH.remove("editAddr")
  },
  onReady: function () {
  },
  bindKeyInput:function(e){
    let input_type = e.currentTarget.dataset.input_type;
    let address_data = this.data.address_data;
    let value=e.detail.value; 
    // //屏蔽特殊字符
    value = StrH.safeFilter(value,"address");
    address_data[input_type] = value;
    this.setData({
      address_data: address_data
    })
  },
  validateMobileNumber: function (e) {
     var mobile_number = e.detail.value;
     var validate_mobile = false;
     if ((/^1[3456789]\d{9}$/.test(mobile_number))) {
          validate_mobile = true;
     }
     var address_data = this.data.address_data;
     address_data['mobile'] = mobile_number;
     this.setData({
          address_data: address_data,
          validate_mobile: validate_mobile,
     })
  },
  showRegionSelect:function(){
    let that = this;
    let address_data = this.data.address_data;
    this.areaSelect = this.areaSelect || this.selectComponent("#areaSelect");
    this.areaSelect.SwitchAreaSelect(address_data, function (info) {
      confirmRegionSelect.call(that,info);
    });
  },
  handleDeliveryParse(e) {
    console.log("parse result", e.detail);
    let {name: consignee = "", mobile = "", details: address = "", region: regionData = {}} = e.detail;
    let {grand, parent, region} = regionData;
    let province, city, district;
    let province_str = "", city_str = "", district_str = "";
    if (grand && grand.region_id) { // 有省、市、区
      district = region.region_id;
      district_str = region.region_name;
      city = parent.region_id;
      city_str = parent.region_name;
      province = grand.region_id;
      province_str = grand.region_name;
    } else if (parent && parent.region_id) { // 有省、市
      district = 0;
      district_str = "地区";
      city = region.region_id;
      city_str = region.region_name;
      province = parent.region_id;
      province_str = parent.region_name;
    } else if (region && region.region_id) { // 只有省
      district = 0;
      district_str = "地区";
      city = 0;
      city_str = "城市";
      province = region.region_id;
      province_str = region.region_name;
    }

    let result = {};
    consignee && (result.consignee = consignee);
    mobile && (result.mobile = mobile);
    address && (result.address = address);
    if (district || city || province) {
      result.district = district;
      result.district_str = district_str;
      result.city = city;
      result.city_str = city_str;
      result.province = province;
      result.province_str = province_str;
      result.address = address
    }
    
    this.setData({
      address_data: {
        ...this.data.address_data,
        ...result
      }
    })
  },
  saveAddress:function(){
    var address_data = this.data.address_data;
    var check_null = this.data.check_null;
    var error_txt='';
    if (!address_data.consignee) {
      check_null.consignee_is_null=true;
      error_txt="请输入收货人";
    }else if(address_data.consignee.length>20){
      check_null.consignee_is_null=true;
      error_txt="收货人名字的长度不应大于20个字符"; 
    }else{
      check_null.consignee_is_null = false;
    }

    if (!error_txt && !address_data.mobile){
      check_null.mobile_is_null = true;
      error_txt = "请输入手机号码";
    }else{
      check_null.mobile_is_null = false;
    }

    if (!error_txt && !this.data.validate_mobile) {
        check_null.mobile_is_null = true;
        error_txt = "手机号不正确";
    } else {
        check_null.mobile_is_null = false;
    }

    if (!error_txt && !address_data.district && !this.canSaveDistrict){
      check_null.district_is_null = true;
      error_txt = "请选择所在区域";
    }else{
      check_null.district_is_null = false;
    }

    if (!error_txt && !address_data.address){
      check_null.address_is_null = true;
      error_txt = "请输入详细地址";
    }else{
      check_null.address_is_null = false;
    }

    this.setData({
      check_null: check_null
    })
      
    if (!error_txt){
      saveAddressHandle.call(this, address_data);
    }else{
      App.SMH.showToast({
        title: error_txt,
        duration: 2500
      })
    }
  }
}))

function getEditAdress(options = {}){
  let address_data = options.address_data || {};
  let editAddr = App.StorageH.get("editAddr") || null;
  if (!editAddr) return
  this.setData({
    address_data: editAddr
  })
}
function saveAddressHandle(address_data){
  let reqUrl = "";
  let reqData = {
    "userToken": this.options && this.options.userToken || App.LM.userKey,
    "consignee": address_data.consignee,
    "country": address_data.country || 1,
    "province": address_data.province,
    "city": address_data.city,
    "district": address_data.district,
    "address": address_data.address,
    "mobile": address_data.mobile,
    "brandCode": App.Conf.BRAND_CODE
  }
  if (address_data.address_id){
    reqUrl = "updateAddress";
    reqData.addressId = address_data.address_id
  }else{
    reqUrl = "createAddress";
  }
  return App.Http.UserApi[reqUrl]({
    data: reqData,
    other:{isShowLoad:true}
  }).then( e=>{
    if(e.code == "1"){
      App.SMH.showToast({
        title:"保存成功"
      })
      setTimeout(()=>{
        wx.navigateBack({});
      },500)
    }
    return Promise.reject();
  })
}
//保存地区
function confirmRegionSelect(data){
  var address_data = this.data.address_data;
  address_data.province_str = data.province_str;
  address_data.city_str = data.city_str;
  address_data.district_str = data.district_str
  address_data.province = data.province;
  address_data.city = data.city;
  address_data.district = data.district
  this.setData({
    address_data: address_data
  })
}