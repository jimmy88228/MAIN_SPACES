// pages/micro_mall/invoice/issue_invoice/issue_invoice.js
const app = getApp();
import helpManager from '../help/help.js'
Page(app.BP({
  data: { 
    title_type_data:["个人","单位"],
    cur_title_type:0,
    cur_invoice_default:false,
    cur_invoice_default_cmpy:false,
    fromType:"7f"
  },
  onLoad: function (options) {
    this.options = options;
    console.log('options',options)
    let return_active = this.data.brand_info.icon_url + "micro_mall/return_active.png";
    let return_img = this.data.brand_info.icon_url + "micro_mall/return.png";
    this.setData({
      return_active,
      return_img
    })
    init.call(this);
  },
  onReady: function () {

  },
  onShow: function () {

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
          this.setData({
            cur_title_type:index
          })
        };
      break; 
      case "confirm":
        console.log(this.fillManager)
        console.log(this);
      break;
      case "invoice_title":
        wx.navigateTo({
          url: `/pages/micro_mall/invoice/issue_title/issue_tittle`,
        })
      break;
      default:
        console.log('typetype',type)
      break;
    }
  },
  onTapInput(e){
    let dataset = e.currentTarget.dataset||{};
    let type = dataset.type||"";
    if(!type)return
    this.fillManager[type] = e.detail && e.detail.value; 
  }
}))


function init(){
  let msgManager = helpManager.getManager('invoice');
  this.fillManager = {};
  for(let item in msgManager){
    if(item == "invoice_default"){
      this.fillManager[item] = true;
    }else{
      this.fillManager[item] = "";
    }
  }
  this.setData({
    msgManager:JSON.parse(JSON.stringify(msgManager))
  });
  console.log('初始化',this.fillManager,this.data.msgManager)
}