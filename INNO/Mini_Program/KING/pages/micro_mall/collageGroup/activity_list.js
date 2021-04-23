import MyDate from '../../../support/utils/date-util.js';
import {
    CountDown
} from "../../../helper/manager/timer-manager.js";
const app = getApp();
Page(app.BP({
    data: {
        activitList: [],
        actCountDown: [],
        jumpType: "custom",
        isLogin: app.LM.isLogin
    },
    page: 1,
    is_more: true,
    is_pull_down: false,

    onLoad: function(options) {
        this.is_pull_down = false;
        this.tababr = this.selectComponent("#custom_tabbar");
    },

    onReady: function() {
        this.getInitData();
    },

    onShow: function() {
        this.iniTabbar(this.data.brand_info);
    },

    onHide: function() {
        let actCountDown = this.data.actCountDown;
        for (let i in actCountDown) {
            if (actCountDown[i].countDown) {
                stopCountDown.call(this,actCountDown[i].countDown);
            }
        }
    },
    onUnLoad: function() {
        let actCountDown = this.data.actCountDown;
        for (let i in actCountDown) {
            if (actCountDown[i].countDown) {
                stopCountDown.call(this,actCountDown[i].countDown);
            }
        }
    },

    onPullDownRefresh: function() {
        this.is_more = true;
        this.page = 1;
        this.is_pull_down = true;
        wx.stopPullDownRefresh();
        this.getInitData();
    },

    onReachBottom: function() {
        if (this.is_more) {
            this.getInitData();
        } else {
            app.SMH.showToast({
                title:"已经到底啦！"
            })
        }
    },
    onShareAppMessage(){
        return {
            title:"拼团"
        }
    },
    getInitData() {
        getCollageGroupActivityList.call(this);
        return;
    },
    getKeywork(e){
        let value = e.detail.value;
        this.keyWord = value;
    },
    handleFilterSearch(){
        this.is_more = true;
        this.page = 1;
        getCollageGroupActivityList.call(this);
    },
    openCollage(e, id) {
        if (!id) {
            id = e.currentTarget.dataset.id;
        }
        wx.navigateTo({
            url: 'activity_goods_detail?activity_id=' + id,
        })
    },
    iniTabbar(brand_info) {
        this.tababr.setTabbar([{
                "pagePath": "pages/micro_mall/collageGroup/activity_list",
                "text": "拼团首页",
                "iconPath": brand_info.icon_url + "micro_mall/tabbar/collage/Home.png",
                "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/collage/getHome.png",
                "is_this_page": true,
                "select_color": brand_info.style.font_color,
                "is_original_tab": false
            },
            {
                "pagePath": "pages/micro_mall/collageGroup/my_collage",
                "text": "我的团",
                "iconPath": brand_info.icon_url + "micro_mall/tabbar/collage/myCollage.png",
                "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/collage/getMyCollage.png",
                "is_this_page": false,
                "select_color": brand_info.style.font_color,
                "is_original_tab": false,
                "need_login": true,
            }
        ]);
    },

    getUserInfo(e) {
        let dataset = e.currentTarget.dataset || {};
        let id = dataset.id;
        this.openCollage(this, id);
    },
}))

function getCollageGroupActivityList() {
    return app.CollageApi.getCollageGroupActivityList({
        params: {
            pageIndex: this.page,
            pageSize: app.Conf.PAGE_SIZE,
            brandCode: app.Conf.BRAND_CODE,
            searchVal: this.keyWord || ""
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
            let activitList = this.data.activitList;
            if (this.page == 1) {
                activitList = [];
            }
            activitList = activitList.concat(e.data);
            for (let i in activitList) {
                let actCountDown = this.data.actCountDown;
                actCountDown[i] = {};
                actCountDown[i].countDown = new CountDown(MyDate.parse(activitList[i].serverTime))
                actCountDown[i].countDown.setTarget(MyDate.parse(activitList[i].endDate));
                setTime.call(this, actCountDown[i].countDown, i);
                if (!actCountDown[i].countDown.isRunning) {
                    actCountDown[i].countDown.start(e => {
                        if (e.value <= 0) {
                            stopCountDown.call(this, actCountDown[i].countDown);
                            getCollageGroupActivityList.call(this);
                        }
                        setTime.call(this, e, i);
                    });
                }
                if(activitList[i].is_show_sale_number == 1){
                  let sale_number = parseFloat(activitList[i].sale_number) || 0;
                  let ex_number_str = sale_number;
                //   if (sale_number > 10000) {
                //     ex_number_str = parseFloat(sale_number / 10000) + "万";
                //   }
                //   if (sale_number > 100000) {
                //     ex_number_str = parseFloat(sale_number / 10000) + "万+";
                //   }
                    if (sale_number > 10000) {
                        ex_number_str = parseFloat(sale_number / 10000).toFixed(2) + "万";
                    }
                    
                  activitList[i].sale_number_str = ex_number_str
                }
            }
            
            this.setData({
                activitList: activitList
            })
            this.page++;
            return Promise.resolve(e);
        }
        return Promise.reject(e);
    }).finally(e => {
        if (!this.data.isReady) {
            this.setData({
                isReady: true
            })
        }
    });

}
//倒计时
function stopCountDown(countDown) {
    if (this.countDown) {
        this.countDown.stop();
    }
}

function setTime(e, index) {
    let actCountDown = this.data.actCountDown;
    let day = Math.floor(e.value / (60 * 60 * 24 * 1000));
    let hour = parseInt(e.value % (60 * 60 * 24 * 1000) / (1000 * 60 * 60));
    let minutes = parseInt((e.value % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = parseInt((e.value % (1000 * 60)) / 1000);
    let count_down = {
        day: day,
        hour: hour,
        min: minutes,
        sec: seconds
    }
    actCountDown[index].time = count_down;
    this.setData({
        actCountDown: actCountDown
    });
}