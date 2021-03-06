// pages/micro_mall/lottery/lottery.js
import LIST from "./lottery-config.js";
import ImgLoader from "./img_loader/img_loader";
import MyDate from '../../common/support/utils/date-util.js';

const app = getApp();
Page.BasePage({
    data: {
        iconUrl: app.Conf.ICON_URL,
        isDecode: true,
        activityType: 0,
        lotteryInfo: {},
        activityId: 0,
        isHided: true,
        isClosed: true,
        isLogin: app.LM.isLogin,
        isNeedBindPhone: false,
        showTips: false
    },
    onLoad: function (options) {
        //初始化图片预加载组件，并指定统一的加载完成回调
        this.imgLoader = new ImgLoader(this, this.imageOnLoad.bind(this));
        this.options = options;
        this.loading = false;
        this.lotterySign = false; //标识是否调用EB，通知数据刷新成功
        let lotteryImg = this.data.brand_info.icon_url + "micro_mall/lottery/winList.png";
        let lotteryTipImg = this.data.brand_info.icon_url + "micro_mall/lottery/lottery_tips.png";
        this.setData({
            lotteryImg: lotteryImg,
            lotteryTipImg: lotteryTipImg
        });
        this.checkLoginChange();
    },
    onReady() {
        this.lotteryTip = this.lotteryTip || this.selectComponent("#lotteryTip");
        getAdSlot.call(this)
    },
    onShow: function () {
        listen.call(this);
        this.lotteryActivity = this.lotteryActivity || this.selectComponent("#lotteryActivity");
        this.lotteryActivity.showReset();
        // this.pageHome = this.pageHome || this.selectComponent("#pageHome")
        // this.pageHome.initPageHome();
    },
    onHide(){
        // 用来重置大转盘
        // app.EB.listen("resetData", () => {
        //     this.lotteryActivity.hideReset();
        // });
        setTimeout(() => {
            this.lotteryActivity.hideReset();
        }, 300);
        // 用来清除存储的setTimeout
        this.lotteryActivity.cancelTime();
    },
    onUnload() {
        // 用来重置大转盘
        // app.EB.listen("resetData", () => {
        //     this.lotteryActivity.hideReset();
        // });
        setTimeout(() => {
            this.lotteryActivity.hideReset();
        }, 300);
        // 用来清除存储的setTimeout
        this.lotteryActivity.cancelTime();
        // 卸载页面时候清除音频
        this.lotteryActivity.stopPlay();
        
    },
    onShareAppMessage: function () {
        return {
            isCustom: true,
            title: this.data.shareTitle,
            path: '/pages/micro_mall/lottery/lottery?activityId=' + this.options.activityId,
            imageUrl: this.data.shareImg
        };
    },    
    onPageScroll(e) {
        // this.mcPage = this.mcPage || this.selectComponent("#mcPage");
        // if(this.mcPage){
        //     this.mcPage.handle_scroll(e && e.scrollTop,"lottery");
        // }
    },
    scanRecord() {
        wx.navigateTo({
            url: './lottery_record/lottery_record?activityId=' + this.options.activityId
        });
    },
    giveTips(res) {
        console.log('giveTips',res);
        let resDetail = res.detail || {};
        this.setData({
            lotteryInfo: resDetail,
            isClosed: false
        });
        this.lotteryTip.show();
        loadData.call(this, false);
        lotteryWinningRecord.call(this, false);
    },
    windowClose() {
        this.setData({
            isClosed: true
        });
    },
    preloadImgs(isShowLoad = true) {
        if (!isShowLoad) return;
        let prizeImgList = this.data.prizeList.filter(item => item.prizeImg !== '').map(item => item.prizeImg);
        // 加载所有的图片
        let staticImgObj = staticImg.call(this);
        let staticImgList = staticImgObj[this.data.activityTypeCode];
        let allImg = [this.data.actBgImg, this.data.pushImg, ...prizeImgList, ...staticImgList].filter(item => item !== '');
        allImg = Array.from(new Set(allImg));
        this.needLoadCount = allImg.length;
        this.preLoadCount = 0;
        if (this.needLoadCount > 0) {
            wx.showLoading({
                title: '加载中...'
            });
        } 
        allImg.forEach(imgUrl => {
            this.imgLoader.load(imgUrl);
        });
    },
    imageOnLoad() {
        this.preLoadCount++;
        if (this.preLoadCount >= this.needLoadCount) {
            wx.hideLoading();
            this.setData({
                isHided: false
            });
            this.lotteryActivity.loadData();
        }
    },
    reloadData() {
        this.lotterySign = true;
        listen.call(this);
    },
    goHome() {
        wx.reLaunch({
            url: '/pages/micro_mall/index/index'
        });
    },
    loginTaped(){
        console.log(app.LM.isLogin)
        this.checkLoginChange();
    }
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
            this.preloadImgs(isShowLoad);
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
                        createTime: MyDate.format((String(item.createTime).replace(/\-/gmi, "/")),"yyyy-MM-dd")
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
    app.LM.login(false).ignore(()=>{
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