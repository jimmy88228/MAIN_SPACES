const  Issue_Title_Manager = { 
  // 通常
  "title_type":"抬头类型",
  "invoice_title":"发票抬头",
  "invoice_tax_num":"税号",
  // 单位
  "invoice_bank":"开户银行",
  "invoice_account":"银行账号",
  "invoice_address":"企业地址",
  "invoice_phone":"企业电话",
  "invoice_msg":"短信通知",
  
  "invoice_email":"邮件通知",
  "invoice_default":"设置默认",
  
};
const Issue_Invoice_Manager = {
  // 通常
  "invoice_type":"发票类型",
  "title_type":"抬头类型",
  "invoice_title":"发票抬头", 
  // 单位
  "invoice_tax_num":"税号",
  "invoice_bank":"开户银行",
  "invoice_account":"银行账号",
  "invoice_address":"企业地址",
  "invoice_phone":"企业电话",

  "invoice_msg":"短信通知",
  "invoice_email":"邮件通知",
  "invoice_price":"发票金额",  
};
const Params_Person = {'id':1,'type':1,'name':1,'drawerPhone':1,'drawerEmail':1,'isDefault':1,'userToken':1,'brandCode':1};

const reg_phone = /^1[2-9][0-9]{9}$/;
const reg_empty = /\S+/;
const reg_space = /\s+/;

class InvoiceManager {
  constructor (){}
  static getInstance(){
    if(!InvoiceManager.instance){
      InvoiceManager.instance = new InvoiceManager();
    }
    return InvoiceManager.instance
  }
  getParamsObj(type=""){
    if(type == 'PERSON'){
      return Params_Person
    }else return []
  }
  getManager(type=''){
    if(type=='invoice'){
      return Issue_Invoice_Manager;
    }else if(type=='title'){
      return Issue_Title_Manager;
    }else{
      return {};
    }
  }
  verifyMsg(type='',value="",title_type){
    let bool = true;
    let error = "";
    switch(type){
      case 'invoice_title':
        bool = reg_empty.test(value);
        if(!bool)error = "请填写发票抬头";
      break;
      case 'invoice_tax_num':
        if(title_type=='COMPANY'){
          bool = reg_empty.test(value);
          if(!bool)error = "请填写税号";
        }
      break;
      case 'invoice_bank':
        if(title_type=='COMPANY'){
          bool = reg_empty.test(value);
          if(!bool)error = "请填写开户银行";
        }
      break;
      case 'invoice_account':
        if(title_type=='COMPANY'){
          bool = reg_empty.test(value);
          if(!bool)error = "请填写银行账号";
        }
      break;
      case 'invoice_address':
        if(title_type=='COMPANY'){
          bool = reg_empty.test(value);
          if(!bool)error = "请填写企业地址";
        }
      break;
      case 'invoice_phone':
        if(title_type=='COMPANY'){
          bool = reg_empty.test(value);
          if(!bool)error = "请填写企业电话";
        }
      break;
      case 'invoice_msg':
        bool = reg_phone.test(value);
        if(!bool)error = "请填写正确的手机号码";
      break;
      case 'invoice_email':
        if(!!value){
          bool = !reg_space.test(value) && reg_empty.test(value);
          if(!bool)error = "邮箱信息不允许带有空格";
        }
      break;
      default:
      break
    }
    return {bool,error};
  }
}
export default InvoiceManager.getInstance();
