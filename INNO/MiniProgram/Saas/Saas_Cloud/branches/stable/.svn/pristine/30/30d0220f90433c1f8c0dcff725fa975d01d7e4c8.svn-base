import MyDate from '../../../../common/support/utils/date-util.js';
import {
    CountDown
} from "../../../../common/manager/timer-manager.js";

import PromH from "../../../../common/helper/handle/promHandle.js";

const app = getApp();
Page(app.BP({
    data: {
        goods_list: [],
        height: 100,
        WEEK: {
            1: "一",
            2: "二",
            3: "三",
            4: "四",
            5: "五",
            6: "六",
            7: "日",
        }
    },
    onLoad: function(options) {
        this.options = options;
        init.call(this).then(()=>{
            loadData.call(this);
        });
    },
    onShow: function() {
      if(this._onshow){
        setTimeDown.call(this, this.promData.endTime || '',this.promData.dateNow);
      }
      this._onshow = true; 
    },
    onHide() {
        stopCountDown.call(this);
    },
    onUnload() {
        stopCountDown.call(this);
    },
    onReachBottom(){
        if (this.hasMore) {
            loadData.call(this);
        }else{
            app.SMH.showToast({
                title: "已经到底啦！"
            })
        }
    },
    handleJump(e) {
        let dataset = e.currentTarget.dataset || {};
        let goods_id = dataset.goods_id || '0';
        let color_id = dataset.color_id || '0';
        wx.navigateTo({
            url: `/pages/micro_mall/goods/goods_info?goods_id=${goods_id}&color_id=${color_id}`,
        })
    },
}))

function loadData() {
    if (!this.isLoading) {
        this.isLoading = true;
    }
    let params = {
        ruleId: this.options.ruleId,
        pageIndex: this.page,
        pageSize: app.Conf.PAGE_SIZE,
    }
    app.RunApi.go('CL_GoodsApi', 'getPromotionGoodsList', params).then(res => {
        if (res.code == '1') {
            let data = res && res.data || {};
            let goods_list = data.list || [];
            if (goods_list.length == 0) {
                this.setData({
                    none: true
                });
                return
            }
            this.hasMore = this.page * app.Conf.PAGE_SIZE < (data.count || 0);
            this.page += 1;
            this.setData({
                goods_list: [...this.data.goods_list, ...goods_list],
            })
            return Promise.resolve();
        }
        if(res.msg){
            app.SMH.showToast({
                title: res.msg
            })
        }
    }).finally(() => {
        this.isLoading = false;
    })
}

function init() {
    this.hasMore = true;
    this.isLoading = true;
    this.page = 1;
    return PromH.getGoodsPromotion(this.options.ruleId,'ruleId').then(res=>{
        console.log('resres',res)
        let promList = res && res.promList||[];
        this.promData = getCurPromData(promList,this.options.ruleId) || {};
        let weekdays = this.promData.limitWeekdays && this.promData.limitWeekdays.split(",") || [];
        this.promData.weekdays = weekdays;
        let obj = {};
        this.data.goods_list = [];
        this.setData({
            goods_list:[]
        })
        obj = this.promData || {};
        if(obj.endTime){
            setTimeDown.call(this, obj.endTime,obj.dateNow);
        }
        this.setData({
            baseInfo: obj,
            promList: [this.promData]
        });
        return Promise.resolve();
    }); 
     
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
                wx.navigateBack({
                    delta: 1
                })
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
        hour: hour < 10 ? '0' + hour : hour,
        min: minutes < 10 ? '0' + minutes : minutes,
        sec: seconds < 10 ? '0' + seconds : seconds,
    }
    this.setData({
        count_down: count_down
    });
}


function setTimeDown(eTime='', dateNow){
  if (!eTime)return
  if (this.promData.timeType == 0 || (this.promData.timeType != 1 && this.promData.timeType != 2)) {
    this.startTime = dateNow;
    startCountDown.call(this, this.startTime, eTime);
  }
}

function getCurPromData(data,ruleId){
    let result = -1;
    for(let i = 0,len=data.length;i<len;i++){
        if(data[i].ruleId == ruleId){
            result = i;
            break;
        }
    }
    return data[result] || {};
}