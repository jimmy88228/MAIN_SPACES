const app = getApp();
const interval = 40;
const times = 30;

import {
    AddSum
} from "../../help/addSum.js";

Page(app.BP({
    data: {
        _value: ['0.00'], 
    },
    showImage: false,
    onLoad: function(options) {
        this.options = options;
        let staff_right = this.data.brand_info.icon_url + "micro_mall/staff/staff_right.png";
        let staff_rmb = this.data.brand_info.icon_url + "micro_mall/staff/staff_rmb.png";
        let staff_bg = this.data.brand_info.icon_url + "micro_mall/staff/staff_bg.png";
        let status = options.status || 0;
        checkTip.call(this);
        this.setData({
            staff_right: staff_right,
            staff_rmb: staff_rmb,
            staff_bg: staff_bg,
            status
        })
    },

    onHide() {
        end.call(this)
    },
    onUnload() {
        end.call(this)
    },
    onShow: function() {
        loadData.call(this)
    },
    imageLoad(e) {
        if (this.showImage) {
            this.label = setTimeout(() => {
                clearTimeout(this.label);
                this.addId['brokerage0'].init();
                delete this.label
            }, 500)
        } else {
            this.showImage = true;
        }
    },
    jump(e) {
        console.log(e.currentTarget.dataset.num);
        let jumpNum = e.currentTarget.dataset.num;
        if (jumpNum == 0) {
            wx.navigateTo({
                url: '/pages/micro_mall/distribution_center/distribution_brokerage/distribution_details/distribution_details',
            })
        } else if (jumpNum == 1) {
            wx.navigateTo({
                url: `/pages/micro_mall/distribution_center/distribution_brokerage/distribution_take_out/distribution_take_out?balance=${this.data.dataDetail.account_balance || 0}`,
            })
        } else {
            wx.navigateTo({
                url: `/pages/micro_mall/distribution_center/distribution_orders_lists/distribution_orders_lists?currentIndex=${0}&type=record`,
            })
        }
    },
    closeTip(){
        this.setData({ 
            tipStyle: "opacity:0;",
        })
        let _timer1 = setTimeout(()=>{
            clearTimeout(_timer1);
            this.setData({ 
                tipBgStyle: "opacity:0;"
            })
            let _timer2 =setTimeout(() => {
                clearTimeout(_timer2)
                this.setData({
                    showTip: false
                })
            }, 200)
        },100);
    },
}))


function loadData() {
    app.DistrApi.staffDstbInfo({
        params: {
            "brandCode": app.Conf.BRAND_CODE,
            "userToken": app.LM.userToken || "",
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        if (res.code == 1) {
            let dataDetail = res.data || {};
            this.setData({
                dataDetail: dataDetail
            });
            if (dataDetail.account_balance > 0) {
                this.addId = {};
                this.addId['brokerage0'] = new AddSum(dataDetail.account_balance, 0, interval, times, true);
                if (this.showImage) {
                    this.label = setTimeout(() => {
                        clearTimeout(this.label);
                        this.addId['brokerage0'].init();
                        delete this.label
                    }, 500)
                } else {
                    this.showImage = true;
                }
            }
        }
        return res
    })
}

function end() {
    this.showImage = true;
    if (this.label) {
        clearTimeout(this.label)
    }
    for (let item in this.addId) {
        if (this.addId[item]) {
            this.addId[item].end();
            delete this.addId[item]
        }
    }
    setTimeout(() => {
        this.setData({
            _value: ['0.00']
        })
    }, 200)
}

function checkTip(){
    let _showTip = app.Conf.staffConf.commission.cashOutTip == '1';
    if (_showTip){
       setTimeout(()=>{
           this.setData({
               showTip:_showTip
           })
           wx.nextTick(() => {
               this.setData({
                   tipStyle: "opacity:1;",
                   tipBgStyle: "opacity:0.7;"
               })
           })
       },500)
    }
}