const app = getApp();
Page.BasePage({
    data: { 
    }, 
    onLoad: function (options) {
        this.options = options||{};
        this.options.type = this.options.type || "order"
        this.setData({
            options:this.options
        })
    }, 
    onReady: function () {
        this.setData({
            isAttached: true,
            showRefresh: true,
        }) 
    }, 
    onShow: function () {
        checkAddress.call(this);
    }, 
    onUnload: function () {
        // app.StorageH.remove('userChoiceData'); //清除选择记录
    }, 
    loadData(){
        this.init = true;
        let recordId = this.options.recordId || 0;
        let orderId = this.options.orderId || 0;
        let type = this.options.type || 0;
        let addressId = this.addressId || 0;
        return getDetails({recordId,addressId,orderId,type}).then(data=>{
            type == 'order' && (data.address = data.addressInfo);
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
    },
    onTap(e){
        let dataset = this.getDataset(e);
        let type = dataset.type||"";
        if(type == "address"){
            if(this.options.type == 'details'){
                wx.navigateTo({
                    url: '/pages/address/address_list',
                })
            }
        }else if(type == 'receive'){
            if(this.receiving)return
            this.receiving = true;
            return receivePrize(this.options.recordId,this.addressId).then(data=>{ 
                app.SMH.showToast({
                    title: "领取成功"
                });
                let orderId = data.orderId;
                setTimeout(() => {
                    wx.redirectTo({
                      url: `/pages/matrix/draw_box/draw_orders/draw_details/draw_details?orderId=${orderId}&type=order`,
                    })
                }, 500);
            }).catch(e=>{
                app.SMH.showToast({
                    title: e&&e.msg||"领取失败"
                });   
            }).finally(()=>{
                setTimeout(() => {
                    this.receiving = false;
                }, 500);
            });
        }
    }
    // onPullDownRefresh: function () {},

})


function getDetails({recordId,addressId,orderId,type}){
    if(type == 'order'){
        return app.LotteryApi.getOrderDetail({
            params:{
                orderId, 
            }
        }).netData()
    }else{
        return app.LotteryApi.geceivePrizeCheckout({
            data:{
              addressId,
              winningRecordId:recordId,
            }
        }).netData()
    }
     
}

function receivePrize(winningRecordId,addressId){
    return app.LotteryApi.receivePrize({
      data:{
        addressId,
        winningRecordId,
      }
    }).netData()
}

function checkAddress(){
    let userChoiceData = app.StorageH.get('userChoiceData')||{};
    // console.log('userChoiceData',this.addressId,userChoiceData.selectAddr && userChoiceData.selectAddr.address_id)
    if(userChoiceData.selectAddr && userChoiceData.selectAddr.address_id){
        if(this.addressId != userChoiceData.selectAddr.address_id){
            this.addressId = userChoiceData.selectAddr.address_id;
            this.loadData();
        }
        return
    }
    if(!this.init){
        this.loadData();
    }
}