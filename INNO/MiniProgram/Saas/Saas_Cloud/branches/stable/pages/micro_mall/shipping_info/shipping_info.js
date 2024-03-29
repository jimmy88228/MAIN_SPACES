const app = getApp();

Page(app.BP({

    data: {
        iconUrl: app.Conf.ICON_URL,
        isReady: false,
        initNo:0,
        curNum:0,
        unfold:false,
    },

    onLoad: function(options) {
        this.options = options;
        this.invoiceNo = options.invoiceNo || '';
        // this.invoiceNo = encodeURIComponent(options.invoiceNo || '');
        if(options.type == "LOTTERY"){
          this.setData({
            cur_no: this.invoiceNo
          })
          loadData.call(this);
          return;
        }
        initTab.call(this).then(res=>{
          loadData.call(this);
        })
    },
    onUnload() {
        clearTimeout(this.timeOutId)
    },
    onTap(e){
      let dataset = e.currentTarget.dataset ||{};
      let type = dataset.type || "";
      if (type == 'click_tap'){
        let cur_no = dataset.invoiceNo||"";
        let cur_ship_name = dataset.shipName||"";
        let curNum = dataset.curNum||0;
        let shipId = dataset.shipId||0;
        this.data.cur_no = cur_no;
        this.setData({
          cur_no:cur_no,
          cur_ship_name,
          curNum,
          cur_ship_id:shipId
        })
        console.log(this.data.tab,curNum)
        throttle.call(this, loadData);
      } else if (type == 'copy'){
        throttle.call(this, function(){
          wx.setClipboardData({
            data: this.data.cur_no || ""
          })
        });
         
      }else if(type == 'unfold'){
        this.setData({
          unfold:!this.data.unfold
        })
      }
    },  
}))

function initTab(){
  return app.CL_BuyApi.getInvoiceList({
    params:{
      orderId: this.options.orderId,
    },other:{
      isShowLoad:true
    }
  }).then(res=>{
    if(res.code=='1'){
      let tab = res.data||[];
      let initNo = this.invoiceNo || tab[0] && tab[0].invoiceNo || 0;
      let cur_ship_name = tab[0] && tab[0].shippingName || "";
      let ship_id = tab[0] && tab[0].shippingId || "";
      this.setData({
        tab,
        cur_no : initNo,
        cur_ship_id:ship_id,
        cur_ship_name
      })
      return Promise.resolve(tab);
    }
    return Promise.reject();
  })
}

function loadData() {
    if (!app.LM._userToken) return;
    let options = this.options;
    let getType = options.type || "";
    let api = app.CL_BuyApi["getInvoiceInfo"]
    let cur_no = this.data.cur_no||0;
    let cur_ship_id = this.data.cur_ship_id||0;
    let params = {
        invoiceNo: cur_no,
        shippingId:cur_ship_id,
        orderId: options.orderId,
    }
    if(getType == "LOTTERY"){
      if (!options.winningRecordId) return;
      delete params.orderId;
      params.winningRecordId = options.winningRecordId;
      cur_no = options.invoiceNo;
      params.invoiceNo = cur_no;
      params.isBackground = 1;
      api = app.CL_LotteryApi["getLotteryShippingInfo"]
    }
    api({
        params: params,
        other: {}
    }).then(e => {
        if (e.code == 1) {
            this.last_no = cur_no;
            const data = e.data || {};
            this.setData({
                logisticsList: (data.logisticsList || []).map(item => {
                    const times = item.ftime.split(" ");
                    return {
                        date: times[0],
                        time: times[1] ? times[1].slice(0, times[1].lastIndexOf(":")) : item.time,
                        context: item.context
                    }
                })
            });
        } else {
            app.SMH.showToast({
                title: e && e.msg || "物流信息获取失败",
                duration: 2000
            });
            this.timeOutId = setTimeout(() => {
                wx.navigateBack({
                    delta: 1
                })
            }, 2000)
        }
    }).finally(() => {
        if (!this.data.isReady) {
            this.setData({
                isReady: true
            });
        }
    });
}

function throttle(callBack, time = 300){
  clearTimeout(this.throttleId);
  this.throttleId = setTimeout(()=>{
    if(typeof callBack == 'function'){
      callBack.call(this);
    }
  },time)
}