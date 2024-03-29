// pages/coupon/my_coupon.js
import {
    barcode
} from "../../../common/utils/codeCanvas/index.js"
import PageJump from "../../../common/helper/page-jump.js"
import MyDate from '../../../common/support/utils/date-util.js';
import modulesTimerManager from "../../../common/helper/modules-timer-manager.js";
/**
 * 优惠券 列表   注  因接口原因  page 从0 开始 一页10 个
 */
const module_id = 1;
var app = getApp();
Page(app.BP({

    data: {
        selected: 0,
        brand_info: app.globalData.brand_info,
        UseItem: "",
        UseItemCode: "",
        bonus_type: '',
        toShow: true,
        scrollHeight: '',
        showPanel: true,
        bonus_tab: [{
                _type: 1,
                txt: "可用",
                data:[],
                status:1,
            },
            {
                _type: 4,
                txt: "过期/已用",
                data:[],
                status:1,
            }
        ],
        actCountDown:{},
        filter: false,
        // bonus_list: [],
        brand_info: {},
        storeBonus: "",
        onlineBonus: "",
        isEmptyCan: false,
        isEmptyNo: false,
        canvasPath:"",
    },
    // send_type: 0: 商城  3: 智慧支付 4:门店使用 5: 通用劵
    //CAT分类，VCAT虚拟分类，GOODS单品，PAGE自定义页面，URL小程序路径
    jumpConf:{
      CAT: "CA",
      VCAT:"VC",
      GOODS:"GOODS",
      PAGE:"CMPAGE",
      URL:"LINKURL"
    },
    page: [],
    hasMore: [],
    drawNum: 2,
    // page: 0,
    // hasMore: true,
    onLoad: function(options) {
        this.options = options;
        initTips.call(this);
        stateInit.call(this);
        getBonusList.call(this);
    },

    onReady: function() {
        let storeBonus = this.data.brand_info.icon_url + "micro_mall/coupon/storeBonus.jpg";
        let onlineBonus = this.data.brand_info.icon_url + "micro_mall/coupon/onlineBonus.jpg";
        let arrow = this.data.brand_info.icon_url + "micro_mall/coupon/arrow.png";
        let bonus_none = this.data.brand_info.icon_url + "micro_mall/coupon/bonus_none.png";
        let bonus_use_btn = this.data.brand_info.icon_url + "micro_mall/coupon/bonus_use_btn.png";
        let bonus_guoqi_btn = this.data.brand_info.icon_url + "micro_mall/coupon/bonus_guoqi_btn.png";
        let overdueStoreBonus = this.data.brand_info.icon_url + "micro_mall/coupon/overdueStoreBonus.jpg";
        let overdueOnlineBonus = this.data.brand_info.icon_url + "micro_mall/coupon/overdueOnlineBonus.jpg";
        let close = this.data.brand_info.icon_url + "micro_mall/server_close.png";
        let img_past = this.data.brand_info.default_icon_url + "coupon_past.png";
        let img_used = this.data.brand_info.default_icon_url + "coupon_used.png";
        this.setData({
            storeBonus: storeBonus,
            onlineBonus: onlineBonus,
            arrow: arrow,
            bonus_none: bonus_none,
            bonus_use_btn: bonus_use_btn,
            bonus_guoqi_btn: bonus_guoqi_btn,
            overdueStoreBonus: overdueStoreBonus,
            overdueOnlineBonus: overdueOnlineBonus,
            close: close,
            img_past,
            img_used
        });
    },

    onShow: function() {
        // getBonusList.call(this);
        this.pageHome = this.pageHome || this.selectComponent("#pageHome")
        this.pageHome && this.pageHome.initPageHome();
        resetCountDown.call(this);
    },

    onHide: function() {
        stopCountDown.call(this);
    },
    onUnload: function() {
      stopCountDown.call(this);
      clearTimeout(this.offLoadingId);
      clearTimeout(this.resetId);
    },
    onShareAppMessage(e){
      console.log(e);
      let target = e.target || {};
      let dataset = target.dataset || {};
      let send_bonus = this.onGiveAway(dataset) || {};
      let brand_info = this.data.brand_info;
      //设置开始分享
      BeginSharingCoupon.call(this, send_bonus.bonus_id);
      return {
        isCustom:true,
        title: send_bonus.share_title || '赠送你优惠券',
        path: '/pages/micro_mall/coupon/get_coupon?bonus_id=' + send_bonus.bonus_id + '&bonusUserToken=' + app.LM.userToken,
        imageUrl: send_bonus.share_image || brand_info.icon_url + 'micro_mall/coupon/share_coupon_bg.jpg',
      }
    },
    swiperChangeCallback(e,reset=false,_cur=-1){
        let type = e && e.type||"";
        let cur=0;
        if(type == "swiperChange"){
            let detail = e.detail;
            cur = reset?_cur:detail.current;
        }else if(type == "tap"){
            let dataset = e.currentTarget.dataset;
            cur = reset?_cur:dataset.tabId;
        }else if(reset){
            cur = _cur;
        }else{
            return
        }
        let selected = this.data.selected;
        let bonus_tab = this.data.bonus_tab||[];
        if (cur == selected && !reset) return; 
        // bonus_tab[cur] && (bonus_tab[cur].data = []);
        this.setData({
            // showLimitArr:[],
            selected: cur, 
        }) 
        if(reset || this.hasMore[cur] && bonus_tab[cur] && bonus_tab[cur].data.length ==0){
            stateInit.call(this,'single',cur);
            getBonusList.call(this,reset);
        }
    },
    scrolltolowerCallback(e){
        console.log(e);
        let cur = this.data.selected;
        if (this.hasMore[cur]) {
            getBonusList.call(this);
        } else {
            app.SMH.showToast({
                "title": "已经到底啦！"
            })
        }
    },
    refreshCallback(e){
        let cur = this.data.selected;
        this.page[cur] = 0;
        this.hasMore[cur] = true;
        let bonus_tab = this.data.bonus_tab||[];
        bonus_tab[cur] && bonus_tab[cur].data && (bonus_tab[cur].data = []);
        stopCountDown.call(this);
        getBonusList.call(this,false,true).then(()=>{
            this.list = this.list || this.selectComponent("#list");
            this.list.refreshEnd();
        })
    },
    onUseCounpon: function(e) {
        let dataset = e.currentTarget.dataset || {};
        let id = dataset.id;
        let currentBonusSn = dataset.bonusSn;
        let canOff = dataset.canOff;
        let cur = this.data.selected;
        let that = this;
        let list = this.data.bonus_tab[cur] && this.data.bonus_tab[cur].data||[];
        let bonus_sn = list[id].bonus_sn;
        // let user_infos = app.StorageH.get("USER_INFOS") || {};
        this.setData({
            realWidth: realMarker.call(this, 519, 136).width,
            realHeight: realMarker.call(this, 519, 136).height,
        })
        this.getUserInfo().then(user_infos=>{
            let cb = ()=>{
                barcode('barCanvas', bonus_sn, 519, 136,function(){
                    setTimeout(()=>{
                        canvasToPath.call(that,"barCanvas","init");
                    },300)
                });
            }
            if(list[id].invalid_time_show_code == 0){ //判断是否冻结时间范围不显示
                if(MyDate.parse(list[id].server_time) < MyDate.parse(list[id].use_start_date)){ //判断冻结时间
                    list[id].onlyShowTime = true;
                    list[id].use_start_date_new = MyDate.format(MyDate.parse(list[id].use_start_date),'yyyy-MM-dd HH:mm:ss')
                }else{
                    cb();
                }
            }else{
                cb();
            } 
            console.log('UseItem',list[id])
            this.setData({
                user_infos,
                UseItem: list[id],
                toShow: false,
                showPanel: false,
                showButton: canOff == 1 ? true : false,
                currentBonusSn: currentBonusSn
            }) 
        });
       
    },
    getUserInfo(){
        if(this.data.user_infos)return Promise.resolve(this.data.user_infos);
        return app.RunApi.go('UserApi', 'getUserSimpleInfo', {}).then(res=>{
            if(res.code == '1'){
                return Promise.resolve(res&&res.data||{});
            }
            return Promise.resolve(app.StorageH.get("USER_INFOS") || {})
          })
    },
    userJump(e){
      let dataset = e.currentTarget.dataset;
      let jumpConfig = dataset.jumpConfig;
      if(!jumpConfig){
          wx.switchTab({
            url: '/pages/micro_mall/index/index',
          })
      }else{
        let func_type = this.jumpConf[jumpConfig.jump_type] || "";
        let related_id = jumpConfig.related_content || "";
        let tag = jumpConfig.tag;
        if (!func_type) return;
        PageJump({
          func_type,
          related_id,
          tag,
          fromModule: "COUPON"
        })
      }
       
    },
    handleWriteOff(e) {
        let type = e.currentTarget.dataset.type;
        checkOffCoupon.call(this, type);
    },
    handleWriteOffConfirm(e) {
        this.setData({
            filter: false
        })
        this.onCloseUseCoupon();
        writeOffCoupon.call(this, this.data.currentBonusSn);
    },
    onCloseUseCoupon: function(e) {
        this.setData({
            UseItem: "",
            toShow: true,
            showPanel: true
        })
        //条形码绘制失败，重新生成路径
        this.drawNum = 2;
    },
    onCheckCode: function() {
        // this.setData({
        //     UseItemCode: true
        // })
        canvasToPath.call(this,"barCanvas");
    },
    onCloseCode: function() {
        this.setData({
            UseItemCode: ""
        })
    },
    onGiveAway: function(dataset) { //赠送
        let bonus_id = dataset.bonus_id;
        let send_index = dataset.send_index;
        let cur = this.data.selected;
        let bonus_list = this.data.bonus_tab[cur] && this.data.bonus_tab[cur].data||[];
        // let bonus_list = this.data.bonus_list;
        let send_bonus = bonus_list[send_index];
        this.send_bonus = send_bonus;
        return this.send_bonus;
    },
    onShowUseLimit: function(e) {
        let index = e.currentTarget.dataset.id;
        let bonus_tab = this.data.bonus_tab;
        let cur = this.data.selected;
        let list = bonus_tab[cur].data;
        list[index].showLimit = !!!list[index].showLimit;
        let showLimitArr = bonus_tab;
        this.setData({
            showLimitArr:showLimitArr
        })
    },
    _noFn: function() {}
}))
//优惠券列表
function getBonusList(callback=false,reset=false) {
    let cur = this.data.selected;
    this.page = this.page || [];
    this.page[cur] = this.page[cur] + 1;
    let bonus_tab = this.data.bonus_tab;
    return app.UserApi.getBonusList({
        params: {
            userToken: app.LM.userToken,
            type: bonus_tab[cur]._type, //1可用， 2已用，3过期，4已用/过期
            page_num: this.page[cur], //暂时
            sort: 0,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == 1) {
            let data = e.data;
            if (data.length == 0) {
                this.hasMore[cur] = false;
            }
            // this.actCountDown = {};//重置
            if(reset){
                this.actCountDown = {};
            }
            for (let i in data) {
                data[i].showLimit = false; 
                if (data[i].bonus_type == 4){
                  data[i].discountStr = app.NH.getDiscount(data[i].discount);
                }else{
                  data[i].discountStr = data[i].discount;
                  data[i].type_money = parseFloat(data[i].type_money);
                }
                setDateStr.call(this,data[i]);
                data[i].max_amount = parseFloat(data[i].max_amount);
                data[i].min_amount = parseFloat(data[i].min_amount);
                data[i].min_goods_amount = parseFloat(data[i].min_goods_amount); 
            }
            if(!callback){
                resetCountDown.call(this);
            }
            let bonus_tab = this.data.bonus_tab||[];
            let bonus_list = bonus_tab[cur] && bonus_tab[cur].data||[];
            if (this.page[cur] == 1) {
                bonus_list = data;
            } else {
                bonus_list = bonus_list.concat(data);
            }
            bonus_tab[cur] && (bonus_tab[cur].data = bonus_list);
            if(this.page[cur] == 1 && bonus_list && bonus_list.length == 0){
                bonus_tab[cur].status = 0;
            }
            let showLimitArr = this.data.showLimitArr||[];
            if(!showLimitArr[cur]){
                showLimitArr[cur] = JSON.parse(JSON.stringify(bonus_tab[cur]));
                this.setData({
                    showLimitArr
                })
            }
            this.setData({
                // bonus_list: bonus_list,
                [`bonus_tab[${cur}]`]:bonus_tab[cur]
            }); 
            return Promise.resolve(e);
        }
        return Promise.reject();
    }).finally(e => {
        if (!this.data.isReady) {
            this.setData({
                isReady: true
            })
        }
    });
}

function realMarker(w, h) {
    let [scale, tranferWidth, tranferHeight] = [0, 0, 0];
    wx.getSystemInfo({
        success(res) {
            scale = (750 / res.windowWidth).toFixed(2);
            tranferWidth = (w / scale).toFixed(2);
            tranferHeight = (h / scale).toFixed(2);
        }
    });
    return {
        width: Math.ceil(tranferWidth),
        height: Math.ceil(tranferHeight)
    };
}


function checkOffCoupon(type) {
    let that = this; 
    if (type == 'show') {
        this.setData({
            filter: true
        })
    } else{
        this.setData({
            filter: false
        })
    }
}

function writeOffCoupon(bonusSn) {
    if (!this.offLoading) {
        this.offLoading = true;
        return app.UserApi.writeOffCoupon({
            data: {
                userToken: app.LM.userToken,
                brandCode: app.Conf.BRAND_CODE,
                bonusSn: bonusSn,
            },
            other: {
                isShowLoad: false
            }
        }).then(res => {
            if (res.code == 1) {
                app.SMH.showToast({
                    title: '核销成功',
                    duration: 600
                })
                console.log('刷新页面')
                this.resetId = setTimeout(() => {
                    clearTimeout(this.resetId);
                    // reset.call(this);
                    stateInit.call(this,'single',this.data.selected);
                    getBonusList.call(this);
                }, 800)
            } else {
                app.SMH.showToast({
                    title: res.msg || '核销失败',
                    duration: 600
                })
            }
        }).finally(() => {
            this.offLoadingId = setTimeout(() => {
                clearTimeout(this.offLoadingId);
                this.offLoading = false;
            }, 600)
        })
    }
}
function canvasToPath(canvasId,type){
  let that = this;
  wx.canvasToTempFilePath({
    canvasId: canvasId,
    success(res) {
      let tempFilePath = res.tempFilePath || "";
      if(type == "init"){
      that.setData({
        canvasPath: tempFilePath,
        }) 
      }else{
        that.setData({
            canvasPath: tempFilePath,
            UseItemCode:true,
        });
      }
    },
    fail(error) {
        if(this.drawNum > 0){//失败时重新绘制
            canvasToPath.call(this, canvasId, type);
            this.drawNum = this.drawNum - 1;
        }
    },
    complete(res) {
        console.log("canvasToTempFilePath", res)
    }
  }, that)
}

//分享状态
function BeginSharingCoupon(bonusId) {
  if(!bonusId) return;
  return app.UserApi.BeginSharingCoupon({
    data: {
      "bonusId": bonusId,
      "userToken": app.LM.userToken,
      "brandCode": app.Conf.BRAND_CODE
    }, other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      return Promise.resolve(e);
    }
    return Promise.reject(e);
  })
}

function setDateStr(data={}){
    let n_t = MyDate.parse(data.server_time||"");
    let s_t = MyDate.parse(data.use_start_date||"");
    let e_t = MyDate.parse(data.use_end_date||"");
    let day = (1000 * 60 * 60 * 24);
    if(data.state==1){
        if(s_t > n_t){//未开始
            if((MyDate.format(s_t,"yyyy.MM.dd") == MyDate.format(n_t,"yyyy.MM.dd")) && (MyDate.format(s_t,"yyyy.MM.dd") == MyDate.format(e_t,"yyyy.MM.dd"))){
                data.fromTimeStr = "今日" + MyDate.format(s_t,"hh:mm");
                data.toTimeStr = MyDate.format(e_t,"hh:mm");
            }else{
                data.fromTimeStr = MyDate.format(s_t,"yyyy.MM.dd HH:mm");
                data.toTimeStr = MyDate.format(e_t,"yyyy.MM.dd HH:mm");
            }
            data.timeType = 1;
        }else if(e_t - n_t > 3*day){
            data.fromTimeStr = MyDate.format(s_t,"yyyy.MM.dd HH:mm");
            data.toTimeStr = MyDate.format(e_t,"yyyy.MM.dd HH:mm");
            data.timeType = 1;
        }else if(e_t - n_t > 2*day && e_t - n_t <= 3*day){
            data.timeType = 2;
            data.detailTimeStr = "3天后到期";
        }else if(e_t - n_t > 1*day && e_t - n_t <= 2*day){
            data.timeType = 2;
            data.detailTimeStr = "2天后到期";
        }else if(e_t - n_t <= 1*day && e_t - n_t > 0){
            // 倒计时
            data.timeType = 3;
            let bonus_id = data.bonus_id,sTime=data.use_start_date,eTime=data.use_end_date,serTime=data.server_time;
            this.actCountDown = this.actCountDown || {};
            this.actCountDown = modulesTimerManager.initModuleCountDown(module_id,bonus_id,sTime,eTime,serTime,this.actCountDown);
        }else if(e_t - n_t <=0 && this.actCountDown && this.actCountDown[module_id] && this.actCountDown[module_id].cDs && this.actCountDown[module_id].cDs[data.bonus_id]){
            delete this.actCountDown[module_id].cDs[data.bonus_id];
        }
    }else{
        data.timeType = 0; 
    }
}

function stopCountDown(){
    let act_count_down = this.actCountDown;
    if (act_count_down) {
    for (let i in act_count_down) {
        let countDown = act_count_down[i].countDown;
        if (countDown) {
            modulesTimerManager.setStopCountDown(countDown);
        }
    }
    }
}

function stateInit(type="",index=0,){
    let bonus_tab = this.data.bonus_tab||[];
    this.page = this.page || [];
    index = index || 0;
    if(!type){
        for(let i = 0,len=bonus_tab.length;i<len;i++){
            this.page[i] = 0;
            this.hasMore[i] = true;
            bonus_tab[i] && (bonus_tab[i].data = []);
        }
    }else if(type == 'single'){
        this.page[index] = 0;
        this.hasMore[index] = true;
        bonus_tab[index] && (bonus_tab[index].data = []);
    }
}

function resetCountDown(){
    if(this.actCountDown){
        let cur = this.data.selected;
        let sum = 0;
        let actCountDown = this.actCountDown && this.actCountDown[module_id] && this.actCountDown[module_id].cDs||{};
        for(let item in actCountDown){
            sum+=1;
            break
        }
        if(sum>0){
            modulesTimerManager.setModuleCountDown(this.actCountDown,()=>{
                this.swiperChangeCallback("",true,cur);
            });
        }
    }
}

function initTips(){
    if(!this.options.type)return
    let tips = "";
    if(this.options.type == 'bargain'){
        tips = "新获得的优惠券一般在1-5分钟内自动到账喔";
    };
    tips && this.setData({
        tips
    })
}