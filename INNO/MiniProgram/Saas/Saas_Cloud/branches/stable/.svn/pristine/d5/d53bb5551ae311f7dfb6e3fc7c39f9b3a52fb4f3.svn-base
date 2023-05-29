// pages/micro_mall/bargain/index/bargain_index.js
var app = getApp();
import MyDate from '../../../../common/support/utils/date-util.js'; 

Page(app.BP({
    data: {
        jumpType: "custom",
        bargainList: [],
        isEmpty: false,
        actCountDown: [],
    },
    onLoad: function (options) {
        this.tababr = this.selectComponent("#custom_tabbar");
        let banner = this.data.brand_info.icon_url + "micro_mall/bargain/bargain_banner.jpg";
        this.setData({
            banner
        }); 
    },
    onReady(){
        this.iniTabbar(this.data.brand_info);
        resetData.call(this);
        loadData.call(this);
    },
    onShow: function () {
        this.restartCountDown(); 
    },
    onHide() {
        this.restoryCountDown();
    },
    onUnload(){ 
        this.restoryCountDown();
    },
    onPullDownRefresh: function () {
        resetData.call(this);
        loadData.call(this);
        let _timer =setTimeout(() => {
            clearTimeout(_timer);
            wx.stopPullDownRefresh();
            app.SMH.showToast({
                "title": "刷新成功"
            });
        }, 500);
    },
    onReachBottom: function () {
        if (this.hasMore) {
            loadData.call(this);
        } else {
            app.SMH.showToast({
                "title": "已经到底啦！"
            });
        }
    },
    getKeywork(e){
        let value = e.detail.value;
        this.keyWord = value;
    },
    handleFilterSearch(){
        resetData.call(this);
        loadData.call(this);
    },
    iniTabbar(brand_info) {
        let brandStyle = this.data.brandStyle;
        this.tababr.setTabbar([{
            "pagePath": "pages/micro_mall/bargain/index/bargain_index",
            "text": "砍价首页",
            "iconfont": "icon-kanjia",
            // "iconPath": brand_info.icon_url + "micro_mall/tabbar/bargain/bargainHome.png",
            // "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/bargain/bargainHomeActive.png",
            "is_this_page": true,
            "select_color": brandStyle.bargain_color.theme_color,
            "is_original_tab": false
        },
        {
            "pagePath": "pages/micro_mall/bargain/index/my_bargain",
            "text": "我的砍价",
            "iconfont": "icon-huodongzhongxin",
            // "iconPath": brand_info.icon_url + "micro_mall/tabbar/bargain/myBargin.png",
            // "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/bargain/myBarginActive.png",
            "is_this_page": false,
            "select_color": brandStyle.bargain_color.theme_color,
            "is_original_tab": false,
            "need_login": true
        }
        ]);
    },
    goDetails(e) {
        let activityId = e.currentTarget.dataset.activityId;
        wx.navigateTo({
            url: `/pages/micro_mall/bargain/goods/goods_detail?activityId=${activityId}`
        });
    },
    onPageScroll(e){
        this.mcPage = this.mcPage || this.selectComponent("#mcPage");
        this.mcPage && this.mcPage.handle_scroll(e&&e.scrollTop);
    },
    onReachBottom(){
        this.mcPage = this.mcPage || this.selectComponent("#mcPage");
        this.mcPage && this.mcPage.reachBottom();
    },
    restartCountDown(){
        let actCountDown = this.data.actCountDown||[];
        actCountDown.forEach((item,index)=>{
            if (!item.countDown.isRunning) {
                item.countDown.start(e => {
                    // console.log(e,index)
                    if (e.value <= 0) {
                        throttleFnc.call(this,()=>{
                            resetData.call(this);
                            loadData.call(this);
                        })
                        stopCountDown.call(this, item.countDown);
                    }
                    setTime.call(this, e, index);
                });
            }
        })
    },
    restoryCountDown(index) {
        let actCountDown = this.data.actCountDown;
        if(index || index == 0){
            if (actCountDown[index].countDown) {
                stopCountDown.call(this,actCountDown[index].countDown);
            }
        } else {
            for (let i in actCountDown) {
                if (actCountDown[i].countDown) {
                    stopCountDown.call(this,actCountDown[i].countDown);
                }
            }
        }
    }
}))
function loadData() {
    if (!this.loading) {
        this.loading = true;
        console.log("after loading");
        return app.CL_BargainApi.getHagglePriceActivityList({
            params: {
                pageIndex: this.page,
                pageSize: app.Conf.PAGE_SIZE,
                activityIds:"",
                searchVal:this.keyWord || "",
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            let data = res.data || {};
            if (res.code == 1) {
                let currentPage = this.data.bargainList;
                let totalCount = data.totalCount;
                let newData = data.dataList || [];
                // this.pageTab = this.pageTab || this.selectComponent("#pageTab");
                // data.pageId && !this.autoShowed && autoShow(this.pageTab,data.pageId); 
                // this.autoShowed || (this.autoShowed = true);
                this.mcPage = this.mcPage || this.selectComponent("#mcPage");
                data.pageId && this.mcPage.getPageData({page_id:data.pageId});
                // let serverTime = data.serverTime || MyDate.format(new Date(), "yyyy-MM-dd HH:mm");
                // newData.forEach((item, index)=>{
                    // item.stime =  MyDate.format(MyDate.parse(item.fromTime || ''), "MM-dd HH:mm");
                    // console.log("倒计时", serverTime,"-----",item.toTime)
                    // let actCountDown = this.data.actCountDown||[];
                    // let label = this.data.actCountDown.length;
                    // actCountDown.push({
                    //     countDown:new CountDown(MyDate.parse(serverTime))
                    // })
                    // actCountDown[label].countDown.setTarget(MyDate.parse(item.toTime));
                    // if (!actCountDown[label].countDown.isRunning) {
                    //     actCountDown[label].countDown.start(e => {
                    //         console.log(label,e)
                    //         if (e.value <= 0) {
                    //             throttleFnc.call(this,()=>{
                    //                 resetData.call(this);
                    //                 loadData.call(this);
                    //             })
                    //             stopCountDown.call(this, actCountDown[label].countDown);
                    //         }
                    //         setTime.call(this, e, label);
                    //     });
                    // }
                // })
                if (this.page > 1) {
                    newData = currentPage.concat(newData);
                }
                console.log('newData',newData)
                this.setData({
                    bargainList: newData,
                    totalCount: data.totalCount
                });
                wx.nextTick(()=>{
                    let bargainList = this.data.bargainList||[];
                    bargainList.forEach((item,index)=>{
                        initCountDownData.call(this,item,index,item.serverTime)
                    })
                })
                if (this.data.bargainList.length === totalCount) {
                    this.hasMore = false;
                }
                this.setData({
                    isEmpty: this.data.bargainList.length == 0 ? true : false
                });
                return Promise.resolve(data);
            } else {
                app.SMH.showToast({
                    "title": res.msg
                });
                return Promise.reject(res);
            }
        }).finally(() => {
            this.loading = false;
            this.page += 1;
        });
    }
}
function resetData() {
    this.page = 1;
    this.loading = false;
    this.hasMore = true;
    this.setData({
        actCountDown:[]
    })
}
function autoShow(tab,id) {
    tab.getPageData({
        page_id:id,
        pageType:"autoHide"
    });
}
function setTime(e, label) {
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
    let key = `actCountDown[${label}].time`;
    this.setData({
        [key]: count_down
    });
}
//倒计时模块
function stopCountDown(countDown) {
    if (countDown) {
      countDown.stop();
    }
}

function throttleFnc(fnc){
    // console.log('throttleFnc')
    this.throttleId && clearTimeout(this.throttleId);
    this.throttleId && delete this.throttleId;
    this.throttleId = setTimeout(() => {
        fnc && typeof(fnc) == 'function' && fnc();
    }, 100);
}
 


function initCountDownData(data,index,serverTime){
    if(!data)return;
    let result = {};
    result.stime = data.fromTime || "";
    result.etime = data.toTime || "";
    result.serverTime = serverTime || "";
    result.acName = "砍价";
    result.type = "list-bargain"
    let id = `actCountDownId${index}`;
    let component = this.selectComponent(`#${id}`);
    component.initData(result,()=>{
        resetData.call(this);
        loadData.call(this);
    });
}