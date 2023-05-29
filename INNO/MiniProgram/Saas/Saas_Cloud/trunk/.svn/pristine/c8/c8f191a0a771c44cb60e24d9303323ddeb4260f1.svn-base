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
    resetData(){
        this.is_more = true;
        this.page = 1;
        this.is_pull_down = true;
        this.getInitData();
    },
    onPullDownRefresh: function() {
        this.resetData();
        wx.stopPullDownRefresh();
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
        let brandStyle = this.data.brandStyle;
        this.tababr.setTabbar([{
                "pagePath": "pages/micro_mall/collageGroup/activity_list",
                "text": "拼团首页",
                "iconfont": "icon-pintuan",
                // "iconPath": brand_info.icon_url + "micro_mall/tabbar/collage/Home.png",
                // "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/collage/getHome.png",
                "is_this_page": true,
                "select_color": brandStyle.pt_color.to_color,
                "is_original_tab": false
            },
            {
                "pagePath": "pages/micro_mall/collageGroup/my_collage",
                "text": "我的拼团",
                "iconfont": "icon-huodongzhongxin",
                // "iconPath": brand_info.icon_url + "micro_mall/tabbar/collage/myCollage.png",
                // "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/collage/getMyCollage.png",
                "is_this_page": false,
                "select_color": brandStyle.pt_color.to_color,
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
    return app.CL_CollageApi.getCollageGroupActivityList({
        params: {
            pageIndex: this.page,
            pageSize: app.Conf.PAGE_SIZE,
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
                if(activitList[i].is_show_sale_number == 1){
                  let sale_number = parseFloat(activitList[i].sale_number) || 0;
                  let ex_number_str = sale_number;
                    if (sale_number > 10000) {
                        ex_number_str = parseFloat(sale_number / 10000).toFixed(2) + "万";
                    }
                    
                  activitList[i].sale_number_str = ex_number_str
                }
            }
            this.setData({
                activitList: activitList
            })
            wx.nextTick(()=>{
                activitList.forEach((item,index)=>{
                    initCountDownData.call(this,item,index,item.serverTime)
                })
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
        day: day < 10 ? "0" + day : day,
        hour: hour < 10 ? "0" + hour : hour,
        min: minutes < 10 ? "0" + minutes : minutes,
        sec: seconds < 10 ? "0" + seconds : seconds,
    }
    actCountDown[index].time = count_down;
    this.setData({
        actCountDown: actCountDown
    });
}

function initCountDownData(data,index,serverTime){
    if(!data)return;
    let result = {};
    result.stime = data.fromDate || "";
    result.etime = data.endDate || "";
    result.serverTime = serverTime || "";
    result.acName = "拼团";
    result.type = "list-collage"
    let id = `actCountDownId${index}`;
    let component = this.selectComponent(`#${id}`);
    component.initData(result,()=>{
        this.resetData();
    });
}