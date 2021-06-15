// pages/matrix/draw_box/draw_details/draw_details.js
const app = getApp();
Page.BasePage({
    data: { 
    }, 
    onLoad: function (options) {
        this.options = options||{};
    }, 
    onReady: function () {
        this.setData({
            isAttached: true,
            showRefresh: true,
        })
        this.loadData();
    }, 
    onShow: function () {

    },
 
    onHide: function () {

    }, 
    onUnload: function () {

    }, 
    loadData(){
        let recordId = this.options.recordId || 0;
        let addressId = 0;
        return getDetails(recordId,addressId).then(data=>{
            this.setData({detailsInfo:data})
        }).catch(e=>{
            app.SMH.showToast({
                title:e&&e.msg||"数据异常"
            })
        })
        .finally(()=>{
            this.setData({ 
                showRefresh: false,
            })
        });
    }
    // onPullDownRefresh: function () {},

})


function getDetails(winningRecordId,addressId){
    return app.LotteryApi.geceivePrizeCheckout({
      data:{
        addressId,
        winningRecordId,
      }
    }).netData()
  }