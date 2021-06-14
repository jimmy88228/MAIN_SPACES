// pages/draw/draw.js
// pages/micro_mall/lottery/lottery.js
import LIST from "./lottery-config.js";
// import ImgLoader from "./img_loader/img_loader";
import MyDate from '../../common/support/utils/date-util.js';

const app = getApp();
Page.BasePage({
    data: {
        iconUrl: app.Conf.ICON_URL,
        isDecode: true,
        activityType: 0,
        lotteryInfo: {},
        activityId: 0,
        isHided: false,
        isClosed: true,
        isLogin: app.LM.isLogin,
        isNeedBindPhone: false,
        showTips: false,
        // maskBg:"rgba(0, 0, 0, 0.4)",
    },
    onLoad: function (options) { 
        this.options = options;
        this.setData({
            activityId:options.activityId||0
        }) 
    },
    onReady() {
        // getAdSlot.call(this)
    },
    onShow: function () {
        app.LM.login(true).ignore(()=>{
            this.checkLoginChange();
            this.draw_box = this.draw_box || this.selectComponent("#draw_box");
            this.draw_box._onShow();
        })
        // listen.call(this);
        // console.log('draw_box',this.draw_box)
        // this.draw_box.showReset(); 
        // this.pageHome = this.pageHome || this.selectComponent("#pageHome")
        // this.pageHome.initPageHome();
    },
    // draw(){
    //     console.log('bind draw')
    //     if(app.clickHold("draw",2000)){
    //         this.setData({
    //             initLoadingAnim:true
    //         })
    //         wx.nextTick(()=>{
    //             this.setData({
    //                 loadShow:true
    //             })
    //         })
    //         setTimeout(() => {
    //             this.draw_result = this.draw_result || this.selectComponent("#draw_result");
    //             this.setData({
    //                 loadShow:false,
    //                 showfilter:true,
    //                 initLoadingAnim:false,
    //             })
    //             this.draw_result && this.draw_result._show();
    //         }, 1000);   
    //     }
    // },
    onHide(){ 
    },
    onUnload() {  
    },
    onShareAppMessage: function () {
        return {
            // isCustom: true,
            // title: this.data.shareTitle,
            // path: '/pages/micro_mall/lottery/lottery?activityId=' + this.options.activityId,
            // imageUrl: this.data.shareImg
        };
    },    
    onPageScroll(e) {
        // this.mcPage = this.mcPage || this.selectComponent("#mcPage");
        // if(this.mcPage){
        //     this.mcPage.handle_scroll(e && e.scrollTop,"lottery");
        // }
    },   
    // loginTaped(){
    //     console.log(app.LM.isLogin)
    //     this.checkLoginChange();
    // }
})
function loadData(isShowLoad = true) {
    return app.LotteryApi.lotteryActivitDetail({
        params: {
            activityId: this.options.activityId || 0,
            brandCode: app.Conf.BRAND_CODE,
            userToken: app.LM.userKey
        },
        extraData: {
            isShowLoad: isShowLoad
        }
    }).then(res => {
        console.log('loadData')
        let data = res.data;
        if (res.code == 1) {
            let tips = [];
            if(data.canJoinTimes>0){
                tips.push({type:"joinTimes",value:"还剩" + data.canJoinTimes + "次机会"});   
            }
            if(data.joinIntegral>0){
                tips.push({type:"integral",value:"每次消耗" + data.joinIntegral + "积分"});   
            }
            this.setData({
                activityTypeName: data.activityTypeName,
                activityTypeCode: data.activityTypeCode || '',
                activityDescription: data.activityDescription,
                isShowWinnings: data.isShowWinnings || false,
                showWinningsRecords: data.showWinningsRecords || 0,  
                joinIntegral: data.joinIntegral || 0,  
                actBgImg: data.actBgImg, 
                shareTitle: data.shareTitle, 
                shareImg: data.shareImg, 
                pushImg: data.pushImg,
                canJoinTimes: data.canJoinTimes || 0,
                tips,
                activityNeedBindMobile: data.activityNeedBindMobile || 0, //活动是否需要绑定手机
                isNeedBindMobile: !!data.isNeedBindMobile, //登录之后，且没有手机号，且活动设置了需要绑定手机号才可以参与，返回1
                activityStatus: data.activityStatus || 0,
                isShowJoinTime: data.isShowJoinTime || false,
                joinTime: data.joinTime || 0,
                prizeList: data.prizeList || [], 
                activityType: LIST.lottery[data.activityTypeCode]
            });
            // this.preloadImgs(isShowLoad);
            wx.hideLoading();
            this.setData({
                isHided: false
            });
            // this.draw_box.loadData();
            return Promise.resolve(data);
        } else {
            this.setData({
                showTips: true
            });
            return Promise.reject(res);
        }
    });
}

function lotteryWinningRecord(isShowLoad = true) {
    return app.LotteryApi.lotteryWinningRecord({
        params: {
            brandCode: app.Conf.BRAND_CODE,
            activityId: this.options.activityId || 0
        },
        extraData: {
            isShowLoad: isShowLoad
        }
    }).then(res => {
        let data = res.data;
        if (res.code == 1) {
            this.setData({
                winningRecordList: data.map(item => {
                    return Object.assign(item, {
                        createTime: MyDate.format(MyDate.parse((String(item.createTime).replace(/\-/gmi, "/"))),"yyyy-MM-dd")
                    });
                }) || []
            });
            initData.call(this);
        }
    }).finally(() => {
        console.log('lotteryWinningRecord')
        console.log('lotteryStatus EB',this.lotterySign)
        if (this.lotterySign) {
            this.lotterySign = false;
            app.EB.call("lotteryStatus");
        }
    });
}

function initData() {
    wx.setNavigationBarTitle({
        title: this.data.activityTypeName || '活动'
    });
    let length = this.data.showWinningsRecords;
    if (this.data.isShowWinnings && length > 0) {
        this.setData({
            winningRecordList: this.data.winningRecordList.slice(0, length)
        });
    }
}

function staticImg() {
    // 预加载所有"静态"图片,默认样式的图片
    let addList = [];
    if (this.data.activityTypeCode === "shengxiao") {
        for (let i = 1; i <= 12; i++) {
            let path = this.data.brand_info.icon_url + `micro_mall/lottery/fan-${i}.png`;
            addList.push(path);
        }
    }
    return {
        "dazhuanpan": [
            this.data.brand_info.icon_url + "micro_mall/lottery/pan-box.png",
            this.data.brand_info.icon_url + "micro_mall/lottery/pan-box_stay.png",
            this.data.brand_info.icon_url + "micro_mall/lottery/pointer.png"
        ],
        "shuiguoji": [
            this.data.brand_info.icon_url + "micro_mall/lottery/sgj-box.png",
            this.data.brand_info.icon_url + "micro_mall/lottery/lottery_start.png",
            this.data.brand_info.icon_url + "micro_mall/lottery/sg_bg.png",
            this.data.brand_info.icon_url + "micro_mall/lottery/sg_bg_active.png"
        ],
        "shengxiao": [
            this.data.brand_info.icon_url + "micro_mall/lottery/fan-fan.png",
            ...addList
        ],
        "yidianlingquan": [
            this.data.brand_info.icon_url + "micro_mall/lottery/click-start.png",
            this.data.brand_info.icon_url + "micro_mall/lottery/click-end.png"
        ],
        "zajingdan": [
            this.data.brand_info.icon_url + "micro_mall/lottery/egg.png",
            this.data.brand_info.icon_url + "micro_mall/lottery/broken_egg.png",
            this.data.brand_info.icon_url + "micro_mall/lottery/ribbon.png",
            this.data.brand_info.icon_url + "micro_mall/lottery/hammer.png"
        ],
        "yaoyiyao": [
            this.data.brand_info.icon_url + "micro_mall/lottery/cycle.png"
        ]
    }
}

function onShowEvent(options = {}){
    loadData.call(this).then((res) => {
        lotteryWinningRecord.call(this);
    });
    this.setData({
        activityId: options.activityId
    });
}

function listen() {
    app.LM.loginAsync(false).ignore(()=>{
        let scene = this.options.scene;
        if (scene) {
            app.SHP.getParams(["activityId"]).then((params) => {
            this.options = {
                ...this.options,
                ...params
            }
            onShowEvent.call(this, this.options);
            })
        } else {
            onShowEvent.call(this, this.options);
        }
    })
}

function getAdSlot(){
    if(this.adSlotGeted){
        return Promise.resolve();
    }
    return app.LotteryApi.getLotteryAdSlot({
        params: {
            brandCode: app.Conf.BRAND_CODE,
        },
        extraData: {
            isShowLoad: true
        }
    }).then(res=>{
        this.adSlotGeted = true;
        if(res.code=="1"){
            let data = res&&res.data;
            if(data){
                this.setData({
                    showCustomPage:1,
                })
                // wx.nextTick(()=>{
                //     setTimeout(()=>{
                //         this.mcPage = this.mcPage || this.selectComponent("#mcPage");
                //         this.mcPage.getPageData({page_id:data.pageId||"",pageType:"autoHide"});
                //     },200)
                // })
            }
            return Promise.resolve(res);
        }
        return Promise.reject(res);
    }).finally(()=>{
        // this.setData({
        //     showPage:true
        // })
    })
}