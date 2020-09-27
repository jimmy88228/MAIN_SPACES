// pages/micro_mall/invoice/issue_title/issue_tittle.js
const app = getApp();
import helpManager from '../help/help.js'

Page(app.BP({
  data: { 
    title_type_data:["个人","单位"],
    cur_title_type:0,
    cur_invoice_default:false, 
  },
  fillManager:{},
  onLoad: function (options) {
    let return_active = this.data.brand_info.icon_url + "micro_mall/return_active.png";
    let return_img = this.data.brand_info.icon_url + "micro_mall/return.png";
    this.setData({
      return_active,
      return_img
    })
    init.call(this)
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
          this.fillManager[type] = index;
          this.setData({
            cur_title_type:index
          })
        };
      break;
      case "invoice_default":
        this.fillManager[type] = !!!this.data.cur_invoice_default;
        this.setData({
          cur_invoice_default:!!!this.data.cur_invoice_default
        })
      break; 
      case "confirm":
        console.log(this.fillManager)
        console.log(this);
      break;
      default:
      break;
    }
  },
  onTapInput(e){
    let dataset = e.currentTarget.dataset||{};
    let type = dataset.type||"";
    if(!type)return
    this.fillManager[type] = e.detail && e.detail.value;
    // this[type] = e.detail && e.detail.value;
    // console.log(this[type],type)
  }
}))

function init(){
  let msgManager = helpManager.getManager('title');
  this.fillManager = {};
  for(let item in msgManager){
    if(item == "invoice_default"){
      this.fillManager[item] = true;
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