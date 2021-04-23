// pages/micro_mall/invoice/issue_manager/issue_manager.js
const app = getApp();
import helpManager from '../help/help.js'
Page(app.BP({
  data: { 
    cur_invoice_default:false,
    fromType:"7f",
    cur_title_type:'PERSON',
    showType:"",
  },
  defaultTitleTemp:{},
  onLoad: function (options) {
    this.options = options;
    console.log('options',options)
    let return_active = this.data.brand_info.icon_url + "micro_mall/return_active.png";
    let return_img = this.data.brand_info.icon_url + "micro_mall/return.png";
    let rightbutton = this.data.brand_info.icon_url + "micro_mall/rightbutton.png";
    this.setData({
      return_active,
      return_img,
      rightbutton,
      showType:options.type||"",
      fromId:options.id,
      price:options.price || 0
    })
    init.call(this);
  },
  onReady: function () {

  },
  onShow: function () {
    let options = this.options;
    if(options.type == 'invoice'){
      init_title_type.call(this);
      getDefaultStorage.call(this); 
    }else if(options.type == 'title'){
      this.jump = false;
      if(options.id){ //编辑
        getElectricKpInfo.call(this);
      }else{
        this.jump = false;
        this.setData({
          showMsg:true
        })
        init_title_type.call(this);
      }
    }
  },
  onHide: function () {

  },
  onUnload: function () {

  }, 
  onTap(e){
    let dataset = e.currentTarget.dataset||{};
    let type = dataset.type||"";
    let index;
    switch(type){
      case "title_type": 
        index = dataset.index||0;
        if(this.data.cur_title_type!=index){
          this.fillManager[type] = index;
          this.setData({
            cur_title_type:index
          });
          if(this.options.type=="invoice"){
            getDefault.call(this);
          }
        };
      break; 
      case "invoice_title":
        if(this.data.showType == 'invoice'){
          this.jump = true;
          wx.navigateTo({
            url:`/pages/micro_mall/invoice/title_manager/title_manager?from=issue`
          });
        }
      break;
      case "invoice_default":
        this.fillManager[type] = !!!this.data.cur_invoice_default;
        this.setData({
          cur_invoice_default:!!!this.data.cur_invoice_default
        });
      break; 
      case "confirm":
        console.log(this.fillManager); 
        if(this.options.type=='title'){
          verifyMsg.call(this);
        }else if(this.options.type=='invoice'){
          console.log('开具发票',this.data.invoiceData);
          console.log(this.options);
          createElectricTask.call(this);
        }
      break;
      default:
        console.log('typetype',type);
      break;
    }
  },
  onTapInput(e){
    let dataset = e.currentTarget.dataset||{};
    let type = dataset.type||"";
    let set_data = dataset.set_data||"";
    if(set_data){
      let invoiceData = this.data.invoiceData||{};
      invoiceData[set_data] = e.detail.value;
      let temp = this.defaultTitleTemp[this.data.cur_title_type||"PERSON"];
      if(temp){
        temp[set_data] = e.detail.value;
      }
      this.setData({
        invoiceData:invoiceData
      })
      return
    }
    if(!type)return
    this.fillManager[type] = e.detail && e.detail.value; 
  }
}))


function init(){
  let options = this.options||{};
  let type = options.type||"";
  if(!this.inited){
    this.inited = true;
    let name = "";
    if(type=='invoice'){
      name = "开具发票";
    }else if(type=='title'){
      name = "发票抬头";
    }
    wx.setNavigationBarTitle({
      title: name || "发票"
    });
  }
  let msgManager = helpManager.getManager(type);
  this.fillManager = {};
  for(let item in msgManager){
    if(item == "invoice_default"){
      this.fillManager[item] = this.data.cur_invoice_default||false;
    }else if(item == "title_type"){
      this.fillManager[item] = 0;
    }
    else{
      this.fillManager[item] = "";
    }
  }
  this.setData({
    msgManager:JSON.parse(JSON.stringify(msgManager))
  });
  console.log('初始化',this.fillManager,this.data.msgManager)
}

function getDefault(){
  let temp = this.defaultTitleTemp[this.data.cur_title_type||"PERSON"];
  if(temp){
    this.setData({
      defaultTitle:true,
      showMsg:true,
      invoiceData:JSON.parse(JSON.stringify(temp))
    })
  }else{
    return app.ElectricApi.getDefaultElectricKpInfo({
      params:{
        type:this.data.cur_title_type||"PERSON",
        userToken:app.LM.userToken,
        brandCode:app.Conf.BRAND_CODE,
      },other:{
        isShowLoad:false
      }
    }).then(res=>{
      if(res.code=='1'){
        console.log('选择 默认：',res.data)
        let data = res.data;
        let defaultTitle = false;
        if(data){
          defaultTitle = true;
        }
        this.defaultTitleTemp[this.data.cur_title_type||"PERSON"] = data;
        this.setData({
          showMsg:true,
          defaultTitle,
          invoiceData:data
        })
      }
    })
  }
}

function verifyMsg(type="",obj={}){
  if(type == "single"){
    obj = obj||{};
    let name = "";
    let result = helpManager.verifyMsg(obj.name,obj.data,this.data.cur_title_type)||{};
    console.log('result',result)
    if(!result.bool){
      name = result.error;
    }
    return name;
  }
  if(this.lockConfirm)return
  this.lockConfirm = true;
  this.fillManager = this.fillManager||{};
  let bool = true;
  for(let item in this.fillManager){
    let result = helpManager.verifyMsg(item,this.fillManager[item],this.data.cur_title_type)||{};
    console.log(item,result.bool,result)
    if(!result.bool){
      app.SMH.showToast({
        title:result.error || "请填写正确的信息"
      });
      bool = false;
      break;
    }
  }
  if(bool){
    ctreateOrEdit.call(this);
  }else{
    this.lockConfirm = false;
  }
}
function ctreateOrEdit(){
  let options = this.options||{};
  let msg = this.fillManager||{};
  let params = getCommitParams.call(this,msg)
  return app.ElectricApi.ctreateOrEdit({
    data:params,
    other:{
      isShowLoad:true
    }
  }).then(res=>{
    console.log('res',res);
    if(res.code=='1'){
      wx.navigateBack({
        delta:1
      });
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).finally(()=>{
    console.log('finally')
    this.lockConfirm = false;
  }).catch(e=>{
    app.SMH.showToast({
      title:e && e.msg || "抬头信息异常"
    });
  })
}
function getDefaultStorage(){
  let storage = JSON.parse(JSON.stringify(wx.getStorageSync('Invoice_Choose')||{}));
  if(this.jump && storage.exist){
    let data = storage.data||{};
    this.jump = false;
    getElectricKpInfo.call(this,data.id,'invoice').then(res=>{
      console.log('选择：',data.id,res.data)
      res = res||{};
      let resData = res.data||{};
      this.defaultTitleTemp[resData.type||"PERSON"] = resData;
      this.setData({
        defaultTitle:true,
        showMsg:true,
        cur_title_type:resData.type||"PERSON", //选中的抬头--切换抬头类型
        invoiceData:resData
      });
      wx.removeStorage({
        key: 'Invoice_Choose',
      })
    });
  }else{
    if(this.jump)this.jump = false;
    getDefault.call(this); 
  }
}

function getElectricKpInfo(id,type=""){
  return app.ElectricApi.getElectricKpInfo({
    params:{
      userToken:app.LM.userToken,
      brandCode:app.Conf.BRAND_CODE,
      id:id||this.options.id||0,
    },other:{isShowLoad:true}
  }).then(res=>{ 
    if(res.code=='1'){
      let data = res.data||{};
      if(type != 'invoice'){
        this.fillManager = this.fillManager||{};
        this.fillManager.title_type = data.type;
        this.fillManager.invoice_title = data.name;
        this.fillManager.invoice_tax_num = data.code;
        this.fillManager.invoice_bank = data.bank;
        this.fillManager.invoice_account = data.bankAccount;
        this.fillManager.invoice_address = data.address;
        this.fillManager.invoice_phone = data.phone;
        this.fillManager.invoice_msg = data.drawerPhone;
        this.fillManager.invoice_email = data.drawerEmail;
        this.fillManager.invoice_default = data.isDefault; 
        init_title_type.call(this,data.type);
      } 
      this.setData({
        cur_title_type:data.type||"PERSON",
        cur_invoice_default:data.isDefault||false,
        invoiceData:data,
        showMsg:true,
      });
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  })

}

function init_title_type(type){
  if(this.initTitleTyped)return
  this.initTitleTyped = true;
  let arr = [],cur="PERSON";
  if(type=="PERSON"){
    arr = [{id:"PERSON",name:"个人"}];
  }else if(type == "COMPANY"){
    arr = [{id:"COMPANY",name:"单位"}];
    cur = "COMPANY";
  }else{
    arr = [{id:"PERSON",name:"个人"},{id:"COMPANY",name:"单位"}];
  }
  this.setData({
    cur_title_type:cur,
    title_type_data:arr
  })
  console.log('title_type_data',this.data.title_type_data)
}

function createElectricTask(){
  let invoiceData = this.data.invoiceData||{};
  let kpInfoId = invoiceData.id||0;
  let name = "";
  let options = this.options||{};
  if(!kpInfoId){
    name = "请先选择发票抬头";
  }
  if(!options.sn){
    name="订单号异常"
  }
  let _verifyMsg = "";
  if(!name && !invoiceData.drawerPhone){
    name="请先填写手机号"
  }else{
    _verifyMsg = verifyMsg.call(this,"single",{name:"invoice_msg",data:invoiceData.drawerPhone})
  }
  if(name || _verifyMsg){
    app.SMH.showToast({
      title:name||_verifyMsg
    })
    return
  }
  return app.ElectricApi.createElectricTask({
    data:{
      userToken:app.LM.userToken,
      brandCode:app.Conf.BRAND_CODE,
      orderSn:options.sn||"",
      orderType:options.order_type||"ONLINE",
      kpInfoId:kpInfoId,
      drawerPhone:invoiceData.drawerPhone||"",
      drawerEmail:invoiceData.drawerEmail||"", 
    },other:{
      isShowLoad:false
    }
  }).then(res=>{
    if(res.code=='1'){ 
      wx.redirectTo({
        url: `/pages/micro_mall/invoice/invoice_detail/detail?type=invoice&id=${res.data||0}&sn=${options.sn}&price=${options.price}`,
      })
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).catch(e=>{
    app.SMH.showToast({
      title:e && e.msg || "信息提交异常"
    })
  })
}

function getCommitParams(params={}){
  params = params||{};
  let options = this.options||{};
  let type = this.data.cur_title_type;
  let obj = {
    id: options.id || 0, 
    type: params.title_type || "PERSON",
    name: params.invoice_title||"",
    code: params.invoice_tax_num||"",
    bank: params.invoice_bank||"",
    bankAccount:params.invoice_account||"",
    address:params.invoice_address||"",
    phone:params.invoice_phone||"",
    drawerPhone:params.invoice_msg||"",
    drawerEmail:params.invoice_email||"",
    isDefault: params.invoice_default ? 1 : 0,
    userToken:app.LM.userToken,
    brandCode:app.Conf.BRAND_CODE,
  }
  let result = {};
  if(type == "PERSON"){
    let propertyObj = helpManager.getParamsObj(type)||{};
    for(let item in obj){
      if(propertyObj[item] == 1){
        result[item] = obj[item];
      }else{
        result[item] = "";
      }
    }
    // arr.forEach(item=>{
    //   console.log(item,obj[item])
    //   if(obj.hasOwnProperty(item)){
    //     result[item] = obj[item];
    //   }
    // })
  }else{
    result = obj;
  }
  return result;
}