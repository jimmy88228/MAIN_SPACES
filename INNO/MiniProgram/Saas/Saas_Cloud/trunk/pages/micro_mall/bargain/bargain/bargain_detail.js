// pages/micro_mall/bargain/bargain/bargain_detail.js
import {
    CountDown
} from "../../../../common/manager/timer-manager.js";
import MyDate from '../../../../common/support/utils/date-util.js';
import Utils from "../../../../common/support/utils/utils";
import DrawTemplate from '../../goods/popup/help/template.js';
const PAGE_TYPE = "BARGAIN_SHARE";
var app = getApp();
Page(app.BP({
    data: {
        jumpType: "custom",
        // 控制砍价状态
        selfGoing: false,
        selfSuccess: false,
        failure: false,
        isSingleBtn: false,
        showPay: false,
        friendBefore: false,
        friendBargain: false,
        friendGoing: false,
        success: false,
        // 控制砍价状态
        distance: 0,
        isHidden: true,
        isAnimate: false,
        customStyle: "bottom: 200rpx;"
    },
    onLoad: function (options) {
        this.tababr = this.selectComponent("#custom_tabbar");
        this.options = options;
        // this.userActivityId = options.userActivityId;
        this.loading = false;
        this.popup = this.popup || this.selectComponent("#popup");
        let banner = this.data.brand_info.icon_url + "micro_mall/bargain/bargain_banner.jpg";
        let rule_img = this.data.brand_info.icon_url + "micro_mall/bargain/alert.png";
        let line = this.data.brand_info.icon_url + "micro_mall/bargain/line.jpg";
        let tips = this.data.brand_info.icon_url + "micro_mall/bargain/tips.png";
        let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png";
        this.setData({
            banner,
            rule_img,
            line,
            server_close,
            moneyTips: tips
        });
    },
    onShow: function () {
        if(this.onReadyed){
            listen.call(this);
        }
        this.pageHome = this.pageHome || this.selectComponent("#pageHome");
        this.pageHome.initPageHome();
        this.iniTabbar(this.data.brand_info); 
    },
    onReady(){
        this.onReadyed = true;
        listen.call(this);
    },
    onHide: function () {
        stopCountDown.call(this);
        unListen.call(this);
    },
    onUnload: function () {
        unListen.call(this);
        stopCountDown.call(this);
    },
    onShareAppMessage: function () {
        let userActivityId = this.options.userActivityId || 0;
        let activity_info = this.data.activity_info || {};
        console.log("activity_info 砍价",activity_info)
        return {
            shareType: app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL,
            isCustom: true,
            imageUrl: activity_info.sharePicture || activity_info.activityImg,
            title: activity_info.shareTitle || "帮我砍个价，送你一个么么哒",
            path: `/pages/micro_mall/bargain/bargain/bargain_detail?userActivityId=${userActivityId}`,
        }
    },
    onPullDownRefresh: function () {
        loadData.call(this);
        getRecord.call(this);
        let _timer1 = setTimeout(() => {
            clearTimeout(_timer1);
            wx.stopPullDownRefresh();
            app.SMH.showToast({
                "title": "刷新成功"
            });
        }, 500);
    },
    toBuy() {
        let userActivityId = this.options.userActivityId || 0;
        wx.navigateTo({
            url: `/pages/micro_mall/bargain/bargain/order_detail?userActivityId=${userActivityId}`
        });
    },
    iniTabbar(brand_info) {
        this.tababr.setTabbar([{
            "pagePath": "pages/micro_mall/bargain/index/bargain_index",
            "text": "砍价首页",
            "iconPath": brand_info.icon_url + "micro_mall/tabbar/bargain/bargainHome.png",
            "selectedIconPath": brand_info.icon_url + "micro_mall/tabbar/bargain/bargainHomeActive.png",
            "is_this_page": false,
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
    /**
     * 页面弹框
     */
    showMsgPop: function (e) {
        this.switchStylePop(e, true);
    },
    switchStylePop(e, show) {
        var key = '';
        var show_pop, pop_animate;
        if (e.currentTarget) {
            key = e.currentTarget.dataset.key;
        } else {
            key = e;
        }
        show_pop = "show_" + key;
        pop_animate = key + "_animate";

        if (show) {
            this.setData({
                [show_pop]: true,
                [pop_animate]: true
            });
        } else {
            this.setData({
                [pop_animate]: false
            })
            let _timer2 = setTimeout(() => {
                clearTimeout(_timer2);
                this.setData({
                    [show_pop]: false
                });
            }, 350);
        }
    },
    bargainHandle(e) {
        let type = e.currentTarget.dataset.type;
        // 自己先来一刀/帮好友砍价/我也要参与/立即下单/查看更多优惠
        if (type == "bargain") {
            checkCanClick.call(this).then(res=>{
                this.slideVerify = this.slideVerify || this.selectComponent("#slideVerify");
                this.slideVerify && this.slideVerify.showSlide(()=>{
                    controlClick.call(this, () => {
                        startBargain.call(this);
                    });
                });
                // controlClick.call(this, () => {
                //     startBargain.call(this);
                // });
            })
        } else if (type == "join" || type == "reduction") {
            // this.popup && this.popup.dismiss();
            wx.navigateTo({
                url: '/pages/micro_mall/bargain/index/bargain_index'
            });
        } else if (type == "order") {
            let userActivityId = this.options.userActivityId;
            let hasOrder = this.data.activity_info.hasOrder;
            if (hasOrder) {
                wx.navigateTo({
                    url: `/pages/micro_mall/bargain/bargain/order_confirm?userActivityId=${userActivityId}`
                });
            } else {
                wx.navigateTo({
                    url: `/pages/micro_mall/bargain/bargain/order_detail?userActivityId=${userActivityId}`
                });
            }
        }
    },
    toGoods(e) {
        let goodsId = e.currentTarget.dataset.goodsId;
        wx.navigateTo({
            url: `/pages/micro_mall/goods/goods_info?goods_id=${goodsId}`
        });
    },
    onTapShare(e) {
        controlClick.call(this, () => {
            this.shareModule = this.shareModule || this.selectComponent("#shareModule");
            this.shareModule.checkIfStaffDstb();
        })
    },
    chooseShareType(data) { 
        let goods_info = {}
        let detail = data.detail;
        this.shareImg = this.shareImg || this.selectComponent("#shareImg");
        let opKind = app.OpKind[PAGE_TYPE] || app.OpKind.NORMAL;
        let shareType = app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL;
        goods_info.opKind = opKind;
        goods_info.title1 = "考验真正友情的时刻到了";
        goods_info.title2 = "帮好友砍价赢取优惠";
        let staffCode = detail.shareId == 3 ? detail.staffInfo.staffCode : "";
        initTemplate.call(this, goods_info, staffCode);
        let allData = {
            info: {
                goodsInfo: goods_info,
                imgUrl: this.data.activity_info.activityImg,
                opKind: opKind,
            },
            scene: {
                "userActivityId": this.options.userActivityId,
                "shareType": shareType,
                "staffCode": detail.shareId == 3 ? detail.staffInfo.staffCode : ""
            },
            draw: {
                diy: true,
                drawArr: this.drawArr,
                baseInfo: {
                canvasW: 600,
                canvasH: 900,
                background: '#fff',
                codeDiy: true
                }
            }
        }
        this.staffInfo = detail.staffInfo
        this.setData({
            allData: allData
        })
        this.shareImg.show();
    },
    checkIfStaffDstbCallBack(data) {
        let detail = data.detail;
        this.staffInfo = detail.staffInfo
    },
    onPageScroll(e) {
        this.mcPage = this.mcPage || this.selectComponent("#mcPage");
        this.mcPage && this.mcPage.handle_scroll(e && e.scrollTop);
    },
    onReachBottom() {
        this.mcPage = this.mcPage || this.selectComponent("#mcPage");
        this.mcPage && this.mcPage.reachBottom();
    },
    dismiss() {
        if (!this.pageId) return;
        let timer = setTimeout(() => {
            wx.pageScrollTo({
                selector:"#bargain_info",
                duration:400
            })
            clearTimeout(timer)
        },300)
    }
}))

function loadData() {
    if (!this.loading) {
        this.loading = true;
        return app.CL_BargainApi.getUserHagglePriceActivityDetail({
            params: {
                userToken: app.LM.userKey,
                brandCode: app.Conf.BRAND_CODE,
                userActivityId: this.options.userActivityId || 0
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            let data = res.data || {};
            if (res.code == 1) {
                let activity_info = {
                    activityId: data.activityId,
                    activityRule: data.activityRule, //0:底价购买 1:随时买
                    activityStatus: data.activityStatus, //0：进行中 1：已完成，   3：无库存
                    alreadyHagglePrice: Number(data.alreadyHagglePrice),
                    myHagglePrice: data.myHagglePrice, //当前登录人该砍价的砍价金额
                    factPrice: data.factPrice, //当前价
                    laveHagglePrice: data.laveHagglePrice, //剩余未砍价格
                    createTime: data.createTime,
                    endTime: data.endTime,
                    canHaggle: data.canHaggle, //根据是否参与过砍价判断，属于自己的砍价
                    canBuy: data.canBuy,
                    isMy: data.isMy,
                    payEndTime: data.payEndTime,  //支付截至时间
                    payStatus: data.payStatus,
                    ruleDescription: data.ruleDescription,
                    hasOrder: data.hasOrder,
                    isNewUser:data.isNewUser,
                    limitNewUser:data.limitNewUser,
                    userHelpCount:data.userHelpCount,
                    limitHelpCount:data.limitHelpCount,
                    newCanClick: !(data.limitNewUser == 1 && !data.isNewUser) || !(!data.isMy && data.activityStatus==0 && data.payStatus==0 && data.canHaggle), //新用户+帮人砍判断
                    countCanClick: !(data.limitHelpCount && data.userHelpCount >= data.limitHelpCount) || !(!data.isMy && data.activityStatus==0 && data.payStatus==0 && data.canHaggle),
                    activityImg:data.activityImg||"",
                    sharePicture:data.sharePicture||"",
                    shareTitle:data.shareTitle||"",
                };
                let goods_info = {
                    goodsId: data.goodsId,
                    goodsImg: data.goodsImg,
                    goodsName: data.goodsName,
                    goodsSn: data.goodsSn,    
                    sizeName: data.sizeName,
                    marketPrice: data.marketPrice,
                    bottomPrice: data.bottomPrice
                };
                let user_info = {
                    realName: data.creatorInfo.realName,
                    hagglePrice: data.creatorInfo.hagglePrice,
                    portraitPath: data.creatorInfo.portraitPath
                };
                this.setData({
                    activity_info,
                    goods_info,
                    user_info,
                    isHidden: false,
                    isAnimate: true
                });
                this.mcPage = this.mcPage || this.selectComponent("#mcPage");
                this.mcPage.getPageData({page_id:data.pageId});
                // this.pageTab = this.pageTab || this.selectComponent("#pageTab");
                // data.pageId && !this.autoShowed && autoShow(this.pageTab, data.pageId);
                this.autoShowed || (this.autoShowed = true);
                this.pageId = data.pageId;
                startCountDown.call(this, data.serverTime, data.endTime);
                this.data.activity_info.isMy ? selfBargain.call(this) : friendBargain.call(this);
                calcProgress.call(this);
                return Promise.resolve(data);
            } else {
                app.SMH.showToast({
                    "title": res.msg
                });
                return Promise.reject(res);
            }
        }).finally(() => {
            this.loading = false;
        });
    }
}

function selfBargain() {
    let activity_info = this.data.activity_info||{};
    let activityStatus = this.data.activity_info.activityStatus;
    let payStatus = this.data.activity_info.payStatus;
    let canHaggle = this.data.activity_info.canHaggle;
    if (activityStatus == 1) {
        // 砍价成功   
        this.setData({
            selfGoing: false,
            isSingleBtn: true
        });
        if (Boolean(payStatus)) {
            // 支付
            this.setData({
                selfSuccess: false,
                success: true,
                showPay: false,
                btnText: '查看更多优惠',
                bargainType: 'reduction'
            });
        } else {
            this.setData({
                selfSuccess: true,
                showPay: true,
                btnText: '立即下单',
                bargainType: 'order'
            });
        }
    } else if (activityStatus < 1) {
        // 砍价进行中
        this.setData({
            selfGoing: true
        });
        if (canHaggle) {
            this.setData({
                isSingleBtn: true,
                btnText: '自己先来一刀',
                bargainType: 'bargain'
            });
        } else {
            this.setData({
                isSingleBtn: false
            });
        }
    } else {
        resetData.call(this);
        this.setData({
            failure: true,
            failText: activityStatus == 2 ? "砍价失效" : activityStatus == 3 ? "库存不足" :activityStatus == 4 ? "超过支付时间":"砍价失败",
            isSingleBtn: true,
            btnText: '查看更多优惠',
            bargainType: 'reduction'
        });
    }
}

function friendBargain() {
    let activityStatus = this.data.activity_info.activityStatus;
    let payStatus = this.data.activity_info.payStatus;
    let canHaggle = this.data.activity_info.canHaggle;
    if (activityStatus < 1 && payStatus == 0) {
        if (canHaggle) {
            // 还未帮好友砍价
            this.setData({
                friendBefore: true,
                friendGoing: true,
                isSingleBtn: true,
                btnText: '帮好友砍价',
                bargainType: 'bargain'
            });
        } else {
            this.setData({
                friendBefore: false,
                friendBargain: true,
                friendGoing: true,
                isSingleBtn: true,
                btnText: '我也要参与',
                bargainType: 'join'
            });
        }
    } else if (activityStatus == 1) {
        this.setData({
            success: true,
            friendBefore: false,
            friendGoing: false,
            isSingleBtn: true,
            btnText: '我也要参与',
            bargainType: 'join'
        });
    } else {
        resetData.call(this);
        this.setData({
            failure: true,
            failText: activityStatus == 2 ? "砍价失效" : activityStatus == 3 ? "库存不足" :activityStatus == 4 ? "超过支付时间":"砍价失败",
            isSingleBtn: true,
            btnText: '查看更多优惠',
            bargainType: 'reduction'
        });
    }
}

function startBargain() {
    return app.CL_BargainApi.postUserHagglePrice({
        data: {
            userActivityId: this.options.userActivityId || 0,
            brandCode: app.Conf.BRAND_CODE,
            userToken: app.LM.userKey
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        let data = res.data||{};
        if (res.code == 1) {
            if (this.data.activity_info.isMy) {
                this.setData({
                    curType: 0
                });
            } else {
                // 是否砍价成功
                this.setData({
                    curType: data.isFinish ? 2 : 1
                }); 
            }
            let extra = {
                integral:data.integral||0,
                couponNum:data.couponNum||0,
            }
            this.setData({
                curHagglePrice: data.hagglePrice,
                extra
            });
            // this.popupShow = true;
            this.popup.show();
            return Promise.resolve(data);
        } else {
            app.SMH.showToast({
                "title": res.msg
            });
            return Promise.reject(res);
        }
    }).finally(() => {
        loadData.call(this);
        getRecord.call(this);
    });
}

function getRecord() {
    return app.CL_BargainApi.getUserHagglePriceActivityDetailRecord({
        data: {
            userToken: app.LM.userKey,
            brandCode: app.Conf.BRAND_CODE, 
            userActivityId: this.options.userActivityId || 0,
            pageIndex: 1,
            pageSize: 100  //全部加载
        },
        other: {
            isShowLoad: false
        }
    }).then(res => {
        let data = res.data;
        if (res.code == 1) {
            this.setData({
                detailTotalCount: data.detailTotalCount,
                detailList: data.detailList
            });
            return Promise.resolve(data);
        } else {
            app.SMH.showToast({
                "title": res.msg
            });
            return Promise.reject(res);
        }
    });
}

function calcProgress() {
    let alreadyHagglePrice = this.data.activity_info.alreadyHagglePrice;
    let range = this.data.goods_info.marketPrice - this.data.goods_info.bottomPrice;
    let percentage = (alreadyHagglePrice / range).toFixed(2) * 100;
    this.setData({
        distance: percentage,
        opacityVal: 1
    });
}

let controlClick = Utils.debounce(fn => {
    fn();
}, 400);

function resetData() {
    this.setData({
        selfGoing: false,
        selfSuccess: false,
        failure: false,
        isSingleBtn: false,
        showPay: false,
        friendBefore: false,
        friendBargain: false,
        friendGoing: false,
        success: false
    });
}

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
                stopCountDown.call(this);
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
    let day = Math.floor((e.value + 60000) / (60 * 60 * 24 * 1000));
    let hour = parseInt((e.value + 60000) % (60 * 60 * 24 * 1000) / (1000 * 60 * 60));
    let minutes = parseInt(((e.value + 60000) % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = parseInt(((e.value + 60000) % (1000 * 60)) / 1000);
    let count_down = {
        day: day,
        hour: hour >= 10 ? hour : '0' + hour,
        min: minutes >= 10 ? minutes : '0' + minutes,
        sec: seconds >= 10 ? seconds : '0' + seconds
    }
    this.setData({
        count_down: count_down
    });
}

function onShowEvent() {
    loadData.call(this);
    getRecord.call(this);
}

function listen() {
    if (app.LM.isLogin) {
        this.setData({
            isLogin: app.LM.isLogin
        });
    } else {
        this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
            if (app.LM.isLogin) onShowEvent.call(this);
            this.setData({
                isLogin: app.LM.isLogin
            });
        });
    }
    let scene = this.options.scene;
    if (scene) {
        app.SHP.getParams(["userActivityId"]).then((params) => {
            this.options = {
                ...this.options,
                ...params
            }
            onShowEvent.call(this);
        })
    } else {
        onShowEvent.call(this);
    }

}

function unListen() {
    app.EB.unListen("SceneParamsChange", this.sceneParamsChangeId);
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
}
function checkCanClick(){
    let activity_info = this.data.activity_info||{};
    let name = "";
    if(!activity_info.newCanClick){ 
        name = "此活动只有新用户才可以参与";
    }else if(!activity_info.countCanClick){
        name = "帮砍次数已达到上限";
    }
    if(name){
        app.SMH.showToast({
            title:name
        })
        return Promise.reject();
    }else {
        return Promise.resolve();
    }
}

function initTemplate(goods_info = {}, staffCode = '') {
    if (this.drawArr && this.drawArr.length > 0) {
        return
    }
    goods_info = goods_info || {};
    let canvasW = 600;
    let canvasH = 900;
    let padding = 20;
    let baseH = 30;
    let baseTopLine = canvasW + 80;
    let codeW = 200;
    let baseBottomLine = canvasH - padding;
    this.drawArr = this.drawArr || [];
  
    let bg = DrawTemplate.initData('image', 0, 0, canvasW, canvasW);
    bg.url = this.data.activity_info.activityImg || '';
    bg.mode = 'fitORfill';
    this.drawArr.push(bg);
  
    let userHead = DrawTemplate.initData('image', padding, baseTopLine, 74, 74);
    userHead.type = 'userHead';
    this.drawArr.push(userHead);
    let eq_params = {
      img_y: baseTopLine,
      img_h: 74,
    }
    let realName = DrawTemplate.initData('text', 74 + padding + 20, DrawTemplate.equation('v_m', eq_params), 200, 0);
    realName.type = "realName"
    realName.ellipsis = 2;
    realName.color = '#7f7f7f';
    this.drawArr.push(realName);
    baseTopLine = baseTopLine + 74 + 50;
    let img_l = DrawTemplate.initData('image', padding, baseTopLine, 26, 23);
    img_l.url = this.data.brand_info.default_icon_url + "share/left_quotes.png";
    this.drawArr.push(img_l);
    let tip1 = DrawTemplate.initData('text', padding + 26 + 10, baseTopLine);
    tip1.text = goods_info.title1;
    this.drawArr.push(tip1);
    baseTopLine += baseH;
  
    let tip2 = DrawTemplate.initData('text', padding + 26 + 10, baseTopLine);
    tip2.text = goods_info.title2;
    let img_r = DrawTemplate.initData('image', padding + 26 + 10 + 286, baseTopLine + 10, 26, 23);
    img_r.url = this.data.brand_info.default_icon_url + "share/right_quotes.png";
    this.drawArr.push(img_r);
  
    this.drawArr.push(tip2);
    let normalTip = DrawTemplate.initData('text', canvasW - padding, baseBottomLine - 22);
    normalTip.size = 22;
    realName.color = '#7f7f7f';
    normalTip.text = '长按识别小程序码';
    normalTip.align = 'right';
    this.drawArr.push(normalTip);
    baseBottomLine -= baseH;
    if (staffCode) {
      let staff = DrawTemplate.initData('text', canvasW - padding, baseBottomLine - 22);
      staff.size = 22;
      realName.color = '#7f7f7f';
      staff.text = staffCode;
      staff.align = 'right';
      this.drawArr.push(staff);
      baseBottomLine -= baseH;
    }
    baseBottomLine -= codeW;
    let code = DrawTemplate.initData('image', canvasW - padding - codeW, baseBottomLine, codeW, codeW);
    code.type = 'code';
    this.drawArr.push(code);
  }

  
//数组转jSON {'':{}}
function createObjKeyVal(obj, key) {
    if (obj instanceof Array) {
      let json = {};
      for (let i = 0; i < obj.length; i++) {
        let Id = obj[i][key];
        if (!json[Id]) {
          json[Id] = (obj[i])
        }
       }
      return json;
    }
  }
  
function autoShow(tab,id) { 
    tab.getPageData({
        page_id:id,
        pageType:"autoHide"
    });
}
