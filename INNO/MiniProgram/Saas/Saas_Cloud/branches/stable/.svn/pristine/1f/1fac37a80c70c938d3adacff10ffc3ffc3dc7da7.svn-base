// import Promise from "../libs/promise/promise.js";
const duration = 3000;  
class pollingManager {
  static getInstance() {
    if (!pollingManager.instance) {
      pollingManager.instance = new pollingManager();
    }
    return pollingManager.instance;
  }
  constructor() {
     
  }
  _pollingRun(fn,type="",_that) {
    let count = 5;
    function polling() {
      console.log('轮询index',count,fn);
      let that = this;
      console.log(this);
      count = count - 1;
      if (count >= 0) {
        return fn().then((res) => {
          console.log('轮询中', res)
          res = res || {};
          if(!type){
            if (res.data == 1 || count <= 0) {
              return Promise.resolve(res);
            }
          }else if(type == "mall" && res.data == 1 || count <= 0){
            return Promise.resolve(res);
          }else if(type == "point"){
            if (res.data && res.data.pay_status == 1 || count <= 0) {
              return Promise.resolve(res);
            }
          } 
          return new Promise ((rs,rj)=>{
            _that.pollingId = setTimeout(() => {
              rs(polling())
            }, duration)
          }) 
        }).catch(e=>{
          console.log("polling catch",e)
          return Promise.reject({});
        })
      }
      return Promise.resolve({});
    }
    return polling;
  }

  setPolling(fn,succ,fail,end,extra={}){
    extra = extra||{};
    let orderSync = extra.orderSync||{};
    orderSync.show && orderSync.show(); 
    let type = extra.type || "";
    this._pollingRun(fn,type,this)().then(res => {
        orderSync.dismiss && orderSync.dismiss(); 
        console.log('轮询结束', res);
        //通常订单、商城订单、积分商城
        let _payStatus = (!type && res && res.data == 1) || (type == "mall" && res && res.data == 1) || (type == "point" && res && res.data && res.data.pay_status == 1) ? true : false;
        // let _payStatus = (!type && res && res.data == 1) || (type == "mall" && res && res.data == 2) || (type == "point" && res && res.data && res.data.pay_status == 2) ? true : false;
        if (_payStatus) {
            console.log('支付成功'); 
            // do something 
            succ && succ();
        } else{
          console.log('支付无效');
          if(end && end instanceof(Function)){
            end().then(res=>{
              console.log('end',res)
              this._showModal(fail,extra,res);
            })
          }else{
            this._showModal(fail,extra);
          }
        }
    }).catch(e=>{
        console.log('轮询catch',e)
        orderSync.dismiss && orderSync.dismiss(); 
    }) 
  }

  stopPolling(){
    console.log('clearTimeout',this.pollingId);
    this.pollingId && clearTimeout(this.pollingId);
  }

  _showModal(fail,extra={},obj={}){
    obj = obj || {};
    let dialog = extra && extra.dialog;
    if(!dialog)return 
    dialog.setTitle && dialog.setTitle(obj.title || "提示");
    dialog.setTouchCancel && dialog.setTouchCancel(false);
    dialog.setCentent && dialog.setCentent(obj.text || "订单正在审核中，请稍后查看订单状态");
    dialog.show && dialog.show();
    dialog.setSingleBtn && dialog.setSingleBtn({
        name: "确认",
        tap: function () {
          //do something
          fail && fail();
        }
    });
  }
}
// export const pollingManager = _pollingManager; //含括整个轮询流程
// export const pollingRun = _pollingRun;         //只包含循环部分，循环前后的代码可以在页面中编写

export default pollingManager.getInstance();