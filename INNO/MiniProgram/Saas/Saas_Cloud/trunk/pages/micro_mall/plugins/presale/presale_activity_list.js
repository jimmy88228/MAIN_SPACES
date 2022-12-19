// pages/micro_mall/presal/activity_list.js
var app = getApp();
import MyDate from '../../../../common/support/utils/date-util.js'; 
Page(app.BP({
    data: {
        activity_list: [],
        sys_info: {},
        swiper_current: 0,
        brand_info: app.globalData.brand_info,
        jumpType: "custom", 
        tabHei:[],
        show:false,
        none:null,
        actCountDown: []
    },
    page: 1,
    is_more: true,
    is_pull_down: false,
    isLoading:false,
    hasMore:true,
    onLoad: function(options) {
        this.tababr = this.selectComponent("#custom_tabbar");
        let l_color = app.getColor(this.data.brand_info.style.bg_color, 0, 0, 0, 0.7);
        this.setData({
            l_color
        })
     },
    onReady: function() { 
        this.iniTabbar(this.data.brand_info);
        scroll_height.call(this); 
    },
    onShow(){
        reset.call(this);
        getPresaleGoodsList.call(this); 
    },
    onUnload(){ 
        this.restoryCountDown();
    },
    onHide(){
        this.restoryCountDown();
    },
    onPullDownRefresh: function() {
        reset.call(this);
        getPresaleGoodsList.call(this); 
        let _timer =setTimeout(() => {
            clearTimeout(_timer);
            wx.stopPullDownRefresh();
            app.SMH.showToast({
                "title": "刷新成功"
            });
        }, 500);
    },  
    onReachBottom: function() {
        if (this.hasMore) {
            getPresaleGoodsList.call(this)
        } else {
            app.SMH.showToast({
                title:"已经到底啦！"
            })
        }
    },
    getKeywork(e){
        let value = e.detail.value;
        this.keyWord = value;
    },
    handleFilterSearch(){
        reset.call(this);
        getPresaleGoodsList.call(this)
    },

    goToDetail: function(e) {
        var activity_id = e.currentTarget.dataset.activity_id;
        wx.navigateTo({
            url: 'presale_activity_detail?activity_id=' + activity_id
        });
    },
    iniTabbar(brand_info) {
        let brandStyle = this.data.brandStyle;
        this.tababr.setTabbar([{
                "pagePath": "pages/micro_mall/plugins/presale/presale_activity_list",
                "text": "预售首页",
                "iconfont": "icon-yushou",
                // "iconPath": brand_info.icon_url + "micro_mall/tabbar/pre_sale/PreHome.png",
                // "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/pre_sale/PreHomeActive.png",
                "is_this_page": true,
                "select_color": brandStyle.pre_color.to_color,
                "is_original_tab": false
            },
            {
                "pagePath": "pages/micro_mall/plugins/presale/presale_order_list",
                "text": "我的预售",
                "iconfont": "icon-huodongzhongxin",
                // "iconPath": brand_info.icon_url + "micro_mall/tabbar/pre_sale/PreMine.png",
                // "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/pre_sale/PreMineActive.png",
                "is_this_page": false,
                "select_color": brandStyle.pre_color.to_color,
                "is_original_tab": false,
                "need_login": true,
            }
        ]);
    },
    handleScrollToLower(e) {
        getPresaleGoodsList.call(this)
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
function stopCountDown(countDown) {
    countDown && countDown.stop();
}
function getPresaleGoodsList() { 
    if (!this.isLoading && this.hasMore) {
        this.isLoading = true;
        return app.CL_PreSaleApi.getPresaleGoodsList({
            params: {
                pageIndex: this.page,
                pageSize: app.Conf.PAGE_SIZE,
                brandCode: app.Conf.BRAND_CODE,
                searchVal: this.keyWord || ""
            },
            other:{
                isShowLoad:false
            }
        }).then(res => {
            if (res.code == 1) {
                let data = res.data || {};
                let dataList = data && data.dataList || [];
                let serverTime = data.serverTime || MyDate.format(new Date(), "yyyy-MM-dd HH:mm");
                dataList && dataList.forEach((item, index) => {
                    if (item.is_show_sale_number == 1){
                      let sale_number = parseFloat(item.sale_number) || 0;
                      let ex_number_str = sale_number;
                      if (sale_number > 10000) {
                        ex_number_str = parseFloat(sale_number / 10000).toFixed(2) + "万";
                      }
                      item.sale_number_str = ex_number_str;
                      if(item.status==1){
                          item.stime =  MyDate.format(MyDate.parse(item.presale_begin_time || ''), "MM-dd HH:mm");
                      }
                    }
                     //倒计时
                    //  let actCountDown = this.data.actCountDown;
                    //  actCountDown[index] = {};
                    //  actCountDown[index].countDown = new CountDown(MyDate.parse(serverTime))
                    //  actCountDown[index].countDown.setTarget(MyDate.parse(item.presale_end_time));
                    //  setTime.call(this, actCountDown[index].countDown, index);
                    //  if (!actCountDown[index].countDown.isRunning) {
                    //      actCountDown[index].countDown.start(e => {
                    //          if (e.value <= 0) {
                    //              stopCountDown.call(this, actCountDown[index].countDown);
                    //              getPresaleGoodsList.call(this);
                    //          }
                    //          setTime.call(this, e, index);
                    //      });
                    //  }
                }) 
                this.setData({
                    activity_list: [...this.data.activity_list, ...dataList]
                });
                this.hasMore = data.totalCount > (app.Conf.PAGE_SIZE * this.page)
                this.page+=1;
                wx.nextTick(()=>{
                    let activity_list = this.data.activity_list||[];
                    activity_list.forEach((item,index)=>{
                        initCountDownData.call(this,item,index,serverTime)
                    })
                })
            }
        }).finally(()=>{ 
            this.setData({
                show: true,
            })
            this.isLoading = false;
        })
    } 
}

function scroll_height() {
    let _this = this;
    const query = wx.createSelectorQuery();
    query.select('.tabbar').boundingClientRect(res => {
        _this.setData({
            scrollHeight: `calc(100% - ${300*this.data.tabHei.length}rpx)`,
            allHeight: `calc(100% - ${res.height}px)`
        })
    }).exec();
}
function reset(){
    this.data.activity_list = [];
    this.page = 1;
    this.hasMore = true;
    this.isLoading = false;
}
function setTime(e, index) {
    let day = Math.floor(e.value / (60 * 60 * 24 * 1000));
    let hour = parseInt(e.value % (60 * 60 * 24 * 1000) / (1000 * 60 * 60));
    let minutes = parseInt((e.value % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = parseInt((e.value % (1000 * 60)) / 1000);
    // console.log("setTime", e);
    let count_down = {
        day: day < 10 ? "0" + day : day,
        hour: hour < 10 ? "0" + hour : hour,
        min: minutes < 10 ? "0" + minutes : minutes,
        sec: seconds < 10 ? "0" + seconds : seconds,
    }
    let key = `actCountDown[${index}].time`;
    this.setData({
        [key]: count_down
    });
}

function initCountDownData(data,index,serverTime){
    if(!data)return;
    let result = {};
    result.stime = data.presale_begin_time || "";
    result.etime = data.presale_end_time || "";
    result.serverTime = serverTime || "";
    result.acName = "预售";
    result.type = "list-pre"
    let id = `actCountDownId${index}`;
    let component = this.selectComponent(`#${id}`);
    component.initData(result,()=>{
        reset.call(this);
        getPresaleGoodsList.call(this);
    });
}
