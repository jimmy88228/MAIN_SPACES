// import MobileM from "../../../common/helper/handle/mobileHandle.js"
import MyDate from "../../../../common/support/utils/date-util.js"
const app = getApp();
Page(app.BP({
  
  data: {
    sexList: ['男', '女'],
    nickName: '',
    email: '',
    sex: '',
    birthday: '',
    mobile: '', 
    address:'',
    info: {},
    user_info:{},
    address_info:{},
    customUserFieldList:[],
    isShow: true,
    personal_page:{"show_mobile":1,"required":["sex","name","birthday"],"optional":[]},
  },
  toUserToken:"",
  merge_mobile:"",
  onLoad(options){
    this.options = options || {} 
    initDate.call(this); 
    getUserInfoEvent.call(this);
  },
  onShow: function() { 
  },
  onHide(){
  },
  onUnload(){
  }, 
  bindChange(e) {
    let dataset = e.target.dataset;
    let key = dataset.key;
    let isColumn = dataset.isColumn;
    if (isColumn == "true"){
      let customList = this.data.customUserFieldList;
      customList[key].txtData = e.detail.value;
      this.setData({
        customUserFieldList: customList
      })
    }else{
      this.setData({
        [key]: e.detail.value
      });
    }
  },
  bindPhoneHandle(e){
    console.log(e,'bindPhoneHandle');
    let mobile = this.data.mobile;
    this.phoneLogin = this.phoneLogin || this.selectComponent("#phoneLogin");
    if(mobile){
      this.phoneLogin.changePhoneNumber(e);
    }else{
      this.phoneLogin.getPhoneNumber(e);
    }
    
  },
  loginCallback(e){
    console.log(e,"loginCallback");
    let user_info = this.data.user_info || {};
    let detail = e.detail || {};
    user_info.mobilePhone = detail.mobilePhone || "";
    this.setData({
      user_info: user_info,
      mobile: detail.mobilePhone || "" 
    })
  },
  /**
   * 选择地区
  */
  showAreaPicker:function(){
    var that = this;
    var address_info = this.data.address_info;
    //
    this.areaSelect = this.areaSelect || this.selectComponent("#areaSelect");
    this.areaSelect.SwitchAreaSelect(address_info,function(info){
      that.setData({
        address_info: info
      })
    });
  }, 
  confirmEdit:function(){
    let that = this;
    const data = this.data;
    //
    const info = data.info;
    const address = data.address;
    const address_info = data.address_info;
    const user_info = data.user_info;
    const profile_modify = user_info.profile_modify;
    const personal_page = data.personal_page;
    let customList = this.data.customUserFieldList;
    let tip = "";
    console.log(data,"data");
    if(data.sex === ""){
      tip="请选择性别";
    } else if (!data.nickName){
      tip="请输入姓名";
    }  else if (!data.birthday){
      tip="请选择生日日期";
    } else if (!data.mobile){
      tip="请绑定手机号";
    }
    // else if (!address_info.district_str){
    //   tip="请选择地区";
    // } 
    // else if (!address){
    //   tip="请输入详细地址";
    // } else if (!(data.email.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1)) {
    //   tip = "请输入正确的email";
    // }  
    if(tip){
      app.SMH.showToast({
        title: tip
      })
      return;
    }
    if(this.lock)return;
    lockFnc.call(this,true);
    let saveReqData = {
      realName: data.nickName,//
      sex: data.sex,//
      email: data.email,
      birthday: data.birthday,//
      province: address_info.province ? address_info.province : 0,
      city: address_info.city ? address_info.city : 0,
      district: address_info.district ? address_info.district : 0,
      address: address,
      brandCode:app.Conf.BRAND_CODE,
      userToken:app.LM.userKey
    };
    saveReqData['mobilePhone'] = data.mobile; //
    saveReqData['isNeedBindPhone'] = data.mobile ? 0 : 1;
    console.log('提交',saveReqData); 
    handlerUserInfo.call(this, saveReqData);
  },
  clickMsg:function(e){
    app.SMH.showToast({
      "title":"您已修改过生日，不能再修改！"
    })
  },
  onTap(e){
    let dataset = e.currentTarget.dataset;
    let type = dataset.type||""; 
  },
  _noFn(){}
}))

//处理用户信息
function handlerUserInfo(saveReqData){
  return saveUserInfo.call(this, saveReqData).then(res=>{
    return createUserDockPool.call(this);
  }).catch(e=>{
    lockFnc.call(this,false);
    app.SMH.showToast({
      title:e&&e.msg||"注册异常"
    })
  });
}

//获取用户信息
function getUserInfoEvent() {
  return app.UserApi.getUserExtendInfo({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      let personal_page = (typeof (data.personal_page) == "string" && data.personal_page) ? JSON.parse(data.personal_page) : data.personal_page;
      personal_page = personal_page || {};
      if (data.mobilePhone == "" && personal_page.show_mobile == 1){
        data.IsBindMobile = 1
      }
      let address_info = {
        city_str: data.cityName || "",
        district_str: data.districtName || "",
        province_str: data.provinceName || "",
        province : data.province || 0,
        city : data.city || 0,
        district: data.district || 0
      }
      data.address_info = address_info;
      data.personal_page = personal_page;
      this.setData({
        nickName: data.realName,
        email: data.email,
        sex: data.sex,
        birthday: data.birthday,
        mobile: data.mobilePhone,
        info: data,
        personal_page: personal_page,
        user_info: data,
        address_info: address_info,
        address: data.address,
        agreementList: data.agreementList || [],
        customUserFieldList: data.customUserFieldList || {},
        isShow: false
      });
      //计算倒计时
      return Promise.resolve(e);
    }
    return Promise.reject(e);
  }).catch(e=>{
    app.SMH.showToast({
      title:e&&e.msg||"数据异常"
    });
    this.setData({
      disabled:true
    })
  })
}

//保存用户信息
function saveUserInfo(reqData){
  return app.UserApi.completeUserInfo({
    data: reqData,
    other:{
      isShowLoad:true
    }
  }).then( e=>{
    if(e.code == 1){
      return Promise.resolve(e);
    }else{
      app.SMH.showToast({
        "title": e && e.msg || "请求错误"
      })
      return Promise.reject(e);
    }
  })
}
function saveCallback(){
  let user_infos = app.StorageH.get("USER_INFOS") || {};
  user_infos.isPerfected = true;
  app.StorageH.set("USER_INFOS", user_infos);
  wx.navigateBack();
}

function initDate(){
  let nowDate = new Date();
  let nowDateStr = MyDate.format(nowDate,"yyyy-MM-dd");
  let nowTime = nowDate.getTime() 
  let prevTime = nowTime - ( 1000 * 60 * 60 * 24 * 365 * 80);
  let preDateStr = MyDate.format(new Date(prevTime), "yyyy-MM-dd");
  this.setData({
    nowDateStr,
    preDateStr
  })
}

function createUserDockPool() {
  return app.UserDockApi.createUserDockPool({
    data:{
      dockId: this.options.dockId||"",
      brandCode:app.Conf.BRAND_CODE,
      userToken:app.LM.userKey
    },other:{
      isShowLoad:false
    }
  }).then(res=>{
    if(res.code==1){
      let msg = res.msg||"注册完成";
      this.setData({
        showTips:true,
        msg
      })
      lockFnc.call(this,false);
      return Promise.resolve(res);
    }
    return Promise.reject(res); 
  })
}

function lockFnc(bool=false) {
    this.lock = bool;
    this.setData({
      lock:bool
    })
}
 