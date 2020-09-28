// pages/micro_mall/bargain/index/bargain_index.js
var app = getApp();
import MyDate from '../../../../support/utils/date-util.js'; 

Page(app.BP({
    data: {
        jumpType: "custom",
        bargainList: [],
        isEmpty: false
    },
    onLoad: function (options) {
        resetData.call(this);
        this.tababr = this.selectComponent("#custom_tabbar");
        let banner = this.data.brand_info.icon_url + "micro_mall/bargain/bargain_banner.jpg";
        this.setData({
            banner
        });
    },
    onShow: function () {
        this.iniTabbar(this.data.brand_info);
        console.log("load");
        loadData.call(this);
    },
    onHide() {
        resetData.call(this);
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
        this.tababr.setTabbar([{
            "pagePath": "pages/micro_mall/bargain/index/bargain_index",
            "text": "砍价首页",
            "iconPath": brand_info.icon_url + "micro_mall/tabbar/bargain/bargainHome.png",
            "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/bargain/bargainHomeActive.png",
            "is_this_page": true,
            "select_color": brand_info.style.bargain_color.theme_color,
            "is_original_tab": false
        },
        {
            "pagePath": "pages/micro_mall/bargain/index/my_bargain",
            "text": "我的砍价",
            "iconPath": brand_info.icon_url + "micro_mall/tabbar/bargain/myBargin.png",
            "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/bargain/myBarginActive.png",
            "is_this_page": false,
            "select_color": brand_info.style.bargain_color.theme_color,
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
    }
}))
function loadData() {
    if (!this.loading) {
        this.loading = true;
        console.log("after loading");
        return app.BargainApi.getHagglePriceActivityList({
            params: {
                userToken: app.LM.userToken,
                brandCode: app.Conf.BRAND_CODE,
                pageIndex: this.page,
                pageSize: app.Conf.PAGE_SIZE,
                activityIds:"",
                searchVal:this.keyWord || "",
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            let data = res.data;
            if (res.code == 1) {
                let currentPage = this.data.bargainList;
                let totalCount = data.totalCount;
                let newData = data.dataList || [];
                newData.forEach(item=>{
                    item.stime =  MyDate.format(MyDate.parse(item.fromTime || ''), "MM-dd HH:mm");
                })
                if (this.page > 1) {
                    newData = currentPage.concat(newData);
                }
                console.log('newData',newData)
                this.setData({
                    bargainList: newData,
                    totalCount: data.totalCount
                });
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
}