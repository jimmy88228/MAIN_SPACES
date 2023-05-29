// pages/micro_mall/collageGroup/my_collage_detail.js
// var DateDown = require("../../../common/helper/utils/DateDown.js");
import MyDate from '../../../common/support/utils/date-util.js';
import {
    CountDown
} from "../../../common/manager/timer-manager.js";
const PAGE_TYPE = "COLLAGE_GROUP";
var app = getApp();
Page(app.BP({

    /**
     * 页面的初始数据
     */
    data: {
        goods_info: {},
        user_join_list: [],
        activity_id: 0,
        count_down: {},
        sys_info: {},
        customData:{
          type1: { type: 1 },
          type2: { type: 2 },
          type3: { type: 3 },
          type4: { type: 4 }
        },
        isLogin:app.LM.isLogin,
        timeCounting:true
    },
    options: {},
    list_page: 0,
    is_more: true,
    is_pull_down: false,
    //
    modal: '',
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //临时数据
        this.is_pull_down = false;
        this.options = options;
        this.getCollageDetail();
        this.getUserJoinList();
        this.modal = this.selectComponent("#custom_modal");
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
      listen.call(this);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
      unListen.call(this);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
      stopCountDown.call(this);
      unListen.call(this);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.pageRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.is_more) {
            this.getUserJoinList();
        } else {
            app.SMH.showToast({
                title:"已经到底啦！"
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        var that = this;
        var goods_info = that.data.goods_info;
        var options = this.options;
        return {
            shareType: app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL,
            path: 'pages/micro_mall/collageGroup/my_collage_detail?activity_id=' + this.options.activity_id + '&user_activity_id=' + this.options.user_activity_id + '&captain_id=' + this.options.captain_id,
            title: goods_info.share_title,
            imageUrl: goods_info.share_image
        };
    },
    getCollageDetail(options) {
        getUserCollageDetail.call(this);
        return;
    },
    /**
     * 获取参与列表
     */
    getUserJoinList() {
        var that = this;
        getUserJoingGroupGoodActivityList.call(this);
        return;
    },
    /**
     * 倒计时
     */
    // joinDateDown(end_time, callback) {
    //     var that = this;
    //     var now_time = new Date();
    //     DateDown.DateDown(that, now_time, end_time, function(date) {
    //         console.log('DateDown2')
    //         if (!date.sec) {
    //             that.pageRefresh();
    //         }
    //         typeof callback == 'function' && callback(date);
    //     })
    // },
    /**
     * 授权
     */
    getUserInfo(e) {
        // var errMsg = e.detail.errMsg;
        // if (errMsg != 'getUserInfo:ok') {
        //     return;
        // }
        // var type = e.currentTarget.dataset.type;
        // app.LM.getUserTokenAsync(true).then(e => {
            
        // })
        console.log(e);
        let detail = e.detail || {};
        this.loginCallback(this, detail.type);
    },
    loginCallback(e, type) {
        console.log(type);
        type += ""; 
        let goods_info = this.data.goods_info;
        let options = this.options;
        switch (type) {
            case "1":
                wx.navigateTo({
                    url: 'my_collage',
                })
                break;
            case "2":
                wx.navigateTo({
                    url: 'activity_list',
                })
                break;
            case "3": //
                if (goods_info.is_user_joined == 1) {
                    wx.navigateTo({
                        url: 'activity_goods_detail?activity_id=' + options.activity_id,
                    })
                } else {
                    wx.navigateTo({
                        url: 'activity_goods_detail?activity_id=' + options.activity_id + '&useractivityid=' + options.user_activity_id,
                    })
                }
                break;
            case "4":
                wx.navigateTo({
                    url: 'activity_goods_detail?activity_id=' + options.activity_id,
                })
                break;
        }
    },
    pageRefresh() {
        this.is_pull_down = true;
        var options = this.options;
        this.list_page = 0;
        wx.stopPullDownRefresh();
        this.getCollageDetail(options);
        this.getUserJoinList(options);
    }
}))


function getUserCollageDetail() {
    var that = this;
    return app.CL_CollageApi.getUserCollageDetail({
        params: {
            activityId: this.options.activity_id,
            userActivityId: this.options.user_activity_id,
            userId: this.options.captain_id,
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            var data = e.data;
            data.activity_id = this.options.activity_id;
            data.diff_mans = data.join_mans - data.has_joins;
            this.setData({
                goods_info: data, 
            })
             if(MyDate.parse(data.server_time) >= MyDate.parse(data.to_date)){
                this.setData({
                    timeCounting:false
                })
            }else{
                if (!this.finish) {
                    let startTime = '',
                        endTime = '';
                    startTime = data.server_time;
                    endTime = data.to_date;
                    startCountDown.call(this, startTime, endTime);
                    if (this.is_pull_down) {
                        wx.stopPullDownRefresh()
                        app.SMH.showToast({
                          title:"刷新成功！"
                        })
                    }
                }
            } 
            return Promise.resolve(e);
        }
        return Promise.reject(e);
    })

}

function getUserJoingGroupGoodActivityList() {
    this.list_page = this.list_page + 1;
    return app.CL_CollageApi.getUserJoingGroupGoodActivityList({
        params: {
            userActivityId: this.options.user_activity_id,
            pageIndex: this.list_page,
            pageSize: app.Conf.PAGE_SIZE,
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {

            if (e.data.length < app.Conf.PAGE_SIZE) {
                this.is_more = false;
            } else {
                this.is_more = true;
            }
            let user_join_list = this.data.user_join_list;
            if (this.list_page == 1) {
                user_join_list = [];
            }
            user_join_list = user_join_list.concat(e.data.list);
            this.setData({
                user_join_list: user_join_list || []
            })
            this.list_page++;
            return Promise.resolve(e);
        }
        return Promise.reject(e);
    })

}

//倒计时
function startCountDown(startTime, endTime) {
    if (!this.countDown) {
        stopCountDown.call(this);
        this.countDown = new CountDown(MyDate.parse(startTime));
    }
    this.countDown.setTarget(MyDate.parse(endTime));
    setTime.call(this, this.countDown);
    if (!this.countDown.isRunning) {
        this.countDown.start(e => {
            if (e.value <= 0) {
                this.finish = true;
                stopCountDown.call(this);
                getUserCollageDetail.call(this);
            }
            setTime.call(this, e);
        });
    }
}

function stopCountDown() {
    if (this.countDown) {
        this.countDown.stop();
    }
}

function setTime(e) {
    let day = Math.floor(e.value / (60 * 60 * 24 * 1000));
    let hour = parseInt(e.value % (60 * 60 * 24 * 1000) / (1000 * 60 * 60));
    let minutes = parseInt((e.value % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = parseInt((e.value % (1000 * 60)) / 1000);
    let count_down = {
        day: day < 10 ? "0" + day : day,
        hour: hour < 10 ? "0" + hour : hour,
        min: minutes < 10 ? "0" + minutes : minutes,
        sec: seconds < 10 ? "0" + seconds : seconds
    }
    this.setData({
        count_down: count_down
    });
}

function listen() {
  if (this.data.isLogin) return;
  if (app.LM.isLogin && !this.data.isLogin) {
    this.setData({
      isLogin: app.LM.isLogin
    });
    return;
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    this.setData({
      isLogin: app.LM.isLogin
    });
  });
}

function unListen() {
  app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
}
