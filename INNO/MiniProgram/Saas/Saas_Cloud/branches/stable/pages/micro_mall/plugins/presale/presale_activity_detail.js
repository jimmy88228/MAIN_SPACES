// var DateDown = require("../../../../common/helper/utils/DateDown.js");
var WxParse = require("../../../../components/thirdParty/wxParse/wxParse.js");
import countDownTextHelp from "../../../../common/helper/handle/countDownTextHelp.js";
import MyDate from '../../../../common/support/utils/date-util.js';
import {
    CountDown
} from "../../../../common/manager/timer-manager.js";
import StrH from "../../../../common/helper/handle/strHandle.js";
import AllStaffApply from '../../../../common/helper/all-staff-apply'
const PAGE_TYPE = "PRE_SALE_GOODS";
var app = getApp();
Page(app.BP({
    data: {
        isLogin: app.LM.isLogin,
        isIphoneX: app.SIH.isIphoneX,
        user_info: app.globalData.userInfo,
        brand_info: app.globalData.brand_info,
        activity_info: [],
        sys_info: {},
        swiper_current: 0,
        count_down: [],
        show_msg_pop: false,
        //动画参数
        show_style_pop: false,
        style_pop_animate: false,
        activity_attr_list: {},
        buy_number: 1,
        select_style: {
            select_size_index: 0,
            select_color_index: 0,
            select_img: '',
            size_list: {},
            color_info: {},
            size_info: {}
        },
        activity_end:false
    },
    activity_id: 0,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log('onLoadonLoad',options);
        let bInfo = this.data.brand_info || {};
        let Home = bInfo.icon_url + "micro_mall/tabBar/main/getHomes.png";
        let rule_img = bInfo.icon_url + "micro_mall/rule.png";
        let server_close = bInfo.icon_url + "micro_mall/server_close.png";
        let detail_share = bInfo.icon_url + "micro_mall/detail_share.png";
        let g_reduce = bInfo.icon_url + "micro_mall/shopping_cart/g_reduce.png";
        let g_reduce_none = bInfo.icon_url + "micro_mall/shopping_cart/g_reduce_none.png";
        let g_add = bInfo.icon_url + "micro_mall/shopping_cart/g_add.png";
        let g_add_none = bInfo.icon_url + "micro_mall/shopping_cart/g_add_none.png";
        let pre_color = bInfo.style.pre_color;
        this.setData({
            Home: Home,
            pre_color: pre_color,
            rule_img: rule_img,
            server_close: server_close,
            detail_share: detail_share,
            g_reduce: g_reduce,
            g_reduce_none: g_reduce_none,
            g_add: g_add,
            g_add_none: g_add_none
        })
        this.options = options;
    },
    onShow() {
        console.log('onShowonShow');
        let options = this.options;
        if (options.scene) {
          console.log("布置SceneParamsChange");
            app.SHP.getParams(["activity_id","staffCode"]).then((params)=>{
              this.options = {
                ...this.options,
                ...params
              }
              onShowEvent.call(this, this.options);
            })
        } else {
            onShowEvent.call(this, this.options);
        }
    },
    preView(e) {
      let dataset = e.currentTarget.dataset || {};
      let activity_info = this.data.activity_info || {};
      let imglist = activity_info.imglist;
      let imgs = [];
      for (let i = 0; i < imglist.length; i++) {
        imgs.push(imglist[i].img_url)
      }
      wx.previewImage({
        current: dataset.url,
        urls: imgs,
      })
    },
    onShareAppMessage: function() {
        if(this.options.activity_id){
          let activity_info = this.data.activity_info || {};
          this.addActionLog("goods_share", "PRESELL", {
            activity_id: this.options.activity_id,
            goods_id: activity_info.goods_id
          })
        }
        return {
            addActionName:"goods_share",
            shareType: app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL,
            title: this.data.activity_info.goods_name || '',
            path: `/pages/micro_mall/plugins/presale/presale_activity_detail?activity_id=${this.options.activity_id}`,
            imageUrl: this.data.activity_info.imglist[0].img_url
        }
    },
    onUnload: function() {
        this.setData({
            show_style_pop: false
        })
        WxParse.wxParse('goods_detail', 'html', '', this, 5);
        unListen.call(this);
        stopCountDown.call(this);
    },
    onHide() {
        this.setData({
            show_style_pop: false
        })
        WxParse.wxParse('goods_detail', 'html', '', this, 5);
        unListen.call(this);
        stopCountDown.call(this);
    },
    /**
     * 轮播切换
     */
    changeSwiper: function(e) {
        var swiper_current = e.detail.current;
        this.setData({
            swiper_current: swiper_current
        })
    },
    /**设置规则红点 */
    getRuleClass: function(rule_list, sale_number) {
        for (var i in rule_list) {
            var rule_rate = rule_list[i].rule_rate;

            //JIMMY
            // rule_list[i].class = 'is_rule';
            // if (i > 0) {
            //     rule_list[i - 1].class = 'ruled'
            // }

            if (sale_number >= rule_rate) {
                rule_list[i].class = 'is_rule';
                if (i > 0) {
                    rule_list[i - 1].class = 'ruled'
                }
            } else {
                rule_list[i].class = '';
            }
        }
        return rule_list;
    },
    chooseShareType(data) {
        let activity_info = this.data.activity_info;
        let imglist = activity_info.imglist || [];
        let detail = data.detail;
        let opKind = app.OpKind[PAGE_TYPE] || app.OpKind.NORMAL;
        let shareType = app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL;
        activity_info.max_price = activity_info.min_deposit_price;
        activity_info.min_price = activity_info.min_deposit_price;
        activity_info.min_tail_price = activity_info.min_tail_price;
        activity_info.price = activity_info.min_price;
        activity_info.market_price = activity_info.min_market_price;
        this.shareImg = this.shareImg || this.selectComponent("#shareImg");
        let allData = {
            info:{
              imgUrl: imglist[0].img_url,
              goodsInfo: activity_info,
              opKind: opKind,
            },
            scene: {
              "shareType": shareType,
              "activity_id": activity_info.activity_id,
              'staffCode': detail.shareId == 3 ? detail.staffInfo.staffCode : ""
            },
            draw: {
              template: "goods"
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
    /**
     * ---------分销
     */
    getShare() {
        this.shareModule = this.shareModule || this.selectComponent("#shareModule");
        this.shareModule.checkIfStaffDstb();
        // authorizeUserInfo.call(this).then(e => {
        //     if (app.LM.isLogin) {
        //         this.shareModule.checkIfStaffDstb();
        //         this.setData({
        //             isLogin: true
        //         })
        //     }
        // })

    },
    /**选择颜色 */
    selectColor: function(e) {
        var select_color_index = e.currentTarget.dataset.index;
        this.current_SizeIndex = -1;
        if (this.data.activity_attr_list.color_list[select_color_index].size_list.length == 1) {
            this.current_SizeIndex = 0;
        }
        this.setData({
            buy_number: 1
        })
        // this.current_SizeIndex = this.current_SizeIndex >= 0 ? this.current_SizeIndex : -1;
        this.setSelectStyle(select_color_index, this.current_SizeIndex);
    },
    /**选择尺码 */
    selectSize: function(e) {
        var select_size_index = e.currentTarget.dataset.index;
        this.current_SizeIndex = select_size_index;
        var select_color_index = this.data.select_style.select_color_index;
        this.setSelectStyle(select_color_index, select_size_index);
    },
    /**设置选中样式 */
    setSelectStyle(select_color_index, select_size_index) {
        let attr_list = this.data.activity_attr_list.color_list[select_color_index];
        let select_color_name = attr_list.color_name;
        let select_img = '';
        let imglist = this.data.activity_info.imglist;
        console.log('select_color_name',select_color_name)
        for (let i in imglist) {
            if (!select_img) {
                let color_name = imglist[i].color_name;
                console.log('匹配',color_name,select_color_name)
                if (select_color_name == color_name) {
                    select_img = imglist[i].thumb_url;
                }
            }
        }
        let size_list = attr_list.size_list;
        for (let item in size_list) {
            size_list[item]['is_enable'] = size_list[item]['product_number'] > 0
        }
        let size_info = '';
        if (select_size_index >= 0 || size_list.length == 1) {
            size_info = select_size_index >= 0 ? size_list[select_size_index] : size_list[0];
            let rule_list = size_info.rule_list;
            let sale_number = size_info.sale_number;
            size_info.rule_list = this.getRuleClass(rule_list, sale_number);
        }
        if (select_size_index < 0 && size_list.length == 1) {
            size_info = '';
        }
        if (this.data.attr_count == 1) {
            size_info = size_list[0]
        }
        let select_style = {
            select_size_index: select_size_index,
            select_color_index: select_color_index,
            select_img: select_img,
            size_list: size_list,
            color_info: attr_list,
            size_info: size_info
        };
        select_style.size_list.map((item)=>{
            item.size_n = StrH.ellipsisStr(item.size_name);
        })
        let activity_type = this.data.sumary_info.activity_type
        let sumary_info = attr_list;
        sumary_info['activity_type'] = activity_type;
        this.setData({
            select_style: select_style,
            sumary_info: sumary_info
        })
    },
    /**
     * 倒计时
     */
    activityDateDown(end_time, callback) {
        var that = this;
        var now_time = new Date();
        DateDown.DateDown(that, now_time, end_time, function(date) {
            typeof callback == 'function' && callback(date);
        })
    },
    /**打开规则说明 */
    showMsgPop: function(e) {
        this.switchStylePop(e, true);
    },
    /**打开尺码选择 */
    openSize: function(e) {
        this.loginCallback();
        // var that = this;
        // authorizeUserInfo.call(this).then(e => {
        //     if (app.LM.isLogin) {
        //         this.loginPage = this.loginPage || this.selectComponent("#loginPage");
        //         this.loginPage.checkLogin({}, "need");
        //     }
        // })
        // this.switchStylePop(e, !this.data.show_style_pop); 

        //??不确定
        // if (typeof(this.data.activity_attr_list) != 'string') {
        //     return;
        // }   

        // var reqData = {
        //     activity_id: this.activity_id
        // }
        // app.wxReq('', 'presale_getSizeList', reqData, function(res) {
        //     var activity_attr_list = res.data;
        //     that.setData({
        //         activity_attr_list: activity_attr_list,
        //         sumary_info: activity_attr_list.sumary_info
        //     });
        //     that.setSelectStyle(0, 0);
        //     that.switchStylePop(e, true);
        // });
    },
    /**
     * 页面弹框
     */
    switchStylePop(e, show) {
        var key = '',
            that = this;
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
                [pop_animate]: true,
                noScroll: true
            })
        } else {
            this.setData({
                [pop_animate]: false,
                noScroll: false
            })
            let _timer = setTimeout(function() {
                clearTimeout(_timer);
                that.setData({
                    [show_pop]: false
                })
            }, 350)
        }
    },
    changeGoodsNum(e) {
        let dataset = e.currentTarget.dataset;
        let buy_number = parseInt(this.data.buy_number);
        let activity_info = this.data.activity_info;
        let canChange = false;
        if (dataset.type == "add" && (parseInt(activity_info.limitBuys) > buy_number || (dataset.type == "add" && activity_info.limitBuys == 0)) && (this.data.select_style.size_info && (this.data.buy_number < this.data.select_style.size_info.product_number))) {
            buy_number++;
            canChange = true;
        } else if (dataset.type == "reduce" && buy_number > 1) {
            buy_number--;
            canChange = true;
        }
        this.setData({
            buy_number: buy_number
        })
    },
    /**结算页 */
    buyActivityGoods: function() {
        let _this = this;
        var select_style = this.data.select_style;
        var buy_number = this.data.buy_number;
        var color_info = select_style.color_info;
        var size_info = select_style.size_info;
        var color_name = color_info.color_name;
        var size_name = size_info.size_name;
        var product_id = size_info.product_id;
        if (!color_name || select_style.color_info.total_number <= 0) {
            app.SMH.showToast({
                title: '请选择' + this.data.color_name_title || '请选择完整规格',
            });
            return;
        }
        if (!size_name && this.data.attr_count > 1) {
            app.SMH.showToast({
                title: '请选择' + this.data.size_name_title || '请选择完整规格',
                icon: 'none'
            });
            return;
        }
        // if (this.data.select_style.size_info.product_number<=0){
        //     app.SMH.showToast({
        //         title: '库存不足',
        //         icon: 'none'
        //     });
        //     return;
        // }
        var activity_id = this.options.activity_id || 0;
        // this.setData({
        //     [`select_style.size_info`]: ''
        // })
        this.data.select_style.size_info = ""
        this.current_SizeIndex = -1;
        this.setData({
            style_pop_animate: false,
            noScroll: false
        })
        let _timer =setTimeout(() => {
            clearTimeout(_timer);
            let userChoiceData = app.StorageH.get("userChoiceData") || {};
            delete userChoiceData.selectAddr;
            app.StorageH.set("userChoiceData", userChoiceData);
            setAnim.call(this);
            wx.navigateTo({
                url: 'presale_buy_info?activityGoodsId=' + product_id + '&activityId=' + activity_id + '&goodsNumber=' + buy_number + '&delta=' + 2
            })
        }, 200)
    },
    goHome: function() {
        wx.switchTab({
            url: '/pages/micro_mall/index/index'
            // url: 'presale_activity_list'
        })
    },

    /** 手机登录回调 */
    loginCallback() {
        // this.switchStylePop('style_pop', !this.data.show_style_pop);
        setAnim.call(this,'show')
    },

    // // 用户信息授权回调
    // getUserInfo: function(e) {
    //     var that = this;
    //     console.log('授权按钮', e);
    //     // this.setData({
    //     //     isLogin:true
    //     // });
    //     authorizeUserInfo.call(this).then(e => {
    //         this.loginPage = this.loginPage || this.selectComponent("#loginPage");
    //         this.loginPage.checkLogin({}, "need");
    //     })
    // }
}))

function onShowEvent(ops) {
    console.log(this.options,"this.options");
    let goodsId = 0;
    getPresaleGoodsDetail.call(this).then(res => {
            getPresaleGoodsProductList.call(this);
            goodsId = res.data && res.data.goods_id;
            this.addPageLog(null,this.route,{
              activity_id: this.options.activity_id,
              goods_id: goodsId
            })
        })
        .then(e => {
            this.commission = this.commission || this.selectComponent("#commission");
            return this.commission.getCommission("PRESALE", goodsId, this.options.activity_id, true);
        }).catch(e => {})
    listen.call(this);
    this.setData({
        buy_number: 1,
    })
}

function getPresaleGoodsDetail() {
    return app.CL_PreSaleApi.getPresaleGoodsDetail({
        params: {
            activityId: this.options.activity_id || 62,
            brandCode: app.Conf.BRAND_CODE,
            userToken: app.LM.userKey
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        if (res.code == 1) {
            var activity_info = res.data || {};
            initCountDownData.call(this,activity_info||{});
            AllStaffApply.checkAllStaffApply(this,{goods_id:activity_info.goods_id||0,relatedId:activity_info.activity_id||0,goodsType:"PRESALE"});
            // activity_info.state = getStatus.call(this,activity_info);
            // {state,stime,etime,serverTime,acName}
            if (activity_info.rulelist) {
                var rule_list = activity_info.rulelist;
                var sale_number = activity_info.sale_number;
                activity_info.rule_list = this.getRuleClass(rule_list, sale_number);
            }
            //调用富文本
            var goods_desc = activity_info.goods_desc;
            WxParse.wxParse('goods_detail', 'html', goods_desc, this, 5);
            if(activity_info.is_show_sale_number == 1){
              let sale_number = parseFloat(activity_info.sale_number) || 0;
              let ex_number_str = sale_number;
              if (sale_number > 10000) {
                ex_number_str = parseFloat(sale_number / 10000) + "万";
              }
              if (sale_number > 100000) {
                ex_number_str = parseFloat(sale_number / 10000) + "万+";
              }
              activity_info.sale_number_str = ex_number_str
            }
            this.setData({
                activity_info: activity_info
            })

            // let check = checkTime.call(this,activity_info)||{}; //返回倒计时文案对象
            // //倒计时 
            // if (!activity_info.isNormal && activity_info.state == 3) {
            //     this.setData({
            //         activity_end: true
            //     })
            // }else if(check.timeDown){
            //   let stime = activity_info.server_time,etime = activity_info.pre_end_time;
            //   if(activity_info.state == 1){
            //     etime = activity_info.pre_begin_time;
            //   }
            //   startCountDown.call(this, stime, etime);
            // } 
        } else {
            app.SMH.showToast({
                "title": res.msg
            });
            this.setData({
                cantUse: true
            })
        }
        return res
    }).finally(()=>{
      if (this.data.pageHidden){
        this.setData({
          pageHidden: false
        })
      }
    })
}

function getPresaleGoodsProductList() {
    return app.CL_PreSaleApi.getPresaleGoodsProductList({
        params: {
            activityId: this.options.activity_id || 0,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        if (res.code == 1) {
            const data = res.data || {};
            let color_list = data.color_list;
            color_list.map((item)=>{
              item.color_n = StrH.ellipsisStr(item.color_name);
            })
            this.setData({
                "activity_attr_list.color_list": color_list || [],
                sumary_info: data.sumary_info || '',
                color_name_title: data.color_name_title || '',
                size_name_title: data.size_name_title || '',
                attr_count: data.attr_count || 1,
                is_enable: data.total_number > 0
            })
            if ((data.color_list[0].size_list && data.color_list[0].size_list.length > 1) || data.color_list[0].total_number<=0) {
                this.setSelectStyle(0, -1);
            } else if (data.color_list[0].size_list && data.color_list[0].size_list.length == 1) {
                this.setSelectStyle(0, 0);
            }
            return Promise.resolve(res)
        }
        return Promise.reject(res);
    }).catch(e=>{
        app.SMH.showToast({
            title:e && e.msg||"活动异常"
        })
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
                stopCountDown.call(this);
                getPresaleGoodsDetail.call(this, this.options);
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
    // let day = Math.floor(e.value / (60 * 60 * 24 * 1000));
    // let hour = parseInt(e.value % (60 * 60 * 24 * 1000) / (1000 * 60 * 60));
    // let minutes = parseInt((e.value % (1000 * 60 * 60)) / (1000 * 60));
    // let seconds = parseInt((e.value % (1000 * 60)) / 1000);
    // let count_down = {
    //     day: day,
    //     hour: hour,
    //     min: minutes,
    //     sec: seconds >= 10 ? seconds : '0' + seconds
    // }
    // this.setData({
    //     count_down: count_down
    // });
    let day = Math.floor(e.value / (60 * 60 * 24 * 1000));
    this.setData({
        time: e.format(day > 0 ? "dd天 HH:mm:ss" : "HH:mm:ss")
    }); 
}

function authorizeUserInfo() {
    return app.LM.getUserTokenAsync(true);
}


function listen() {
    if (app.LM.isLogin) {
        this.setData({
            isLogin: true
        });
        return
    }
    this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
        this.setData({
            isLogin: app.LM.isLogin
        });
    });
}

function unListen() {
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
    app.EB.unListen("SceneParamsChange", this.sceneParamsChangeId);
}

function checkTime(activityInfo={}) {
    activityInfo = activityInfo || {};
    let result = countDownTextHelp.getTimeMsg.call(this, activityInfo);
    result = result || {};
    this.setData({
      timeText: result.text || '',
      time: result.time || ''
    })
    console.log('time文案文案', result, this.data.timeText);
    return result
}

function getStatus(data={}){
    data = data||{};
    data.stime = data.pre_begin_time||"";
    data.etime = data.pre_end_time||"";
    data.serverTime = data.server_time||"";
    data.acName = "预售";
    if(MyDate.parse(data.etime)<=MyDate.parse(data.serverTime)){
        data.status = 3;
    }else if(MyDate.parse(data.stime) > MyDate.parse(data.serverTime)){
        data.status = 1;
    }else{
        data.status = 2;
    }
    return data.status
}

function setAnim(type){
    this.specPop = this.specPop || this.selectComponent('#specPop') ;
    if(type == "show"){
        this.style_select_show = true;
        this.specPop.setShow(); 
    }else {
        this.style_select_show = false;
        this.specPop.setHide();
    }
}

function initCountDownData(data){
    if(!data)return;
    let result = {};
    result.stime = data.pre_begin_time || "";
    result.etime = data.pre_end_time || "";
    result.serverTime = data.server_time || "";
    result.acName = "预售";
    result.type = "pre"
    this.actCountDownId || (this.actCountDownId = this.selectComponent('#actCountDownId'));
    let cbData = this.actCountDownId.initData(result,()=>{
        getPresaleGoodsDetail.call(this, this.options);
    });
    this.setData({
        disabledTip: cbData && cbData.state != 2 && cbData.disabledTip || ""
    })
}