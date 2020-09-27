import MyDate from '../../../../support/utils/date-util.js';
import {
    CountDown
} from "../../../../helper/manager/timer-manager.js";

const app = getApp();
Page(app.BP({
    data: {
        goods_list: [],
        height: 100,
    },
    onLoad: function(options) {
        this.options = options;
        init.call(this);
        loadData.call(this);
    },
    onShow: function() {
      if(this._onshow){
        setTimeDown.call(this, this.storageTemp.end_time || '');
      }
      this._onshow = true;
        // init.call(this);
        // loadData.call(this);
    },
    onHide() {
        stopCountDown.call(this);
    },
    onUnload() {
        stopCountDown.call(this);
        app.StorageH.remove('CurrentPromote');
    },
    handleScroll(e) {
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
    let currentPromote = app.StorageH.get('CurrentPromote') || {}
    let params = {
        ruleId: this.options.ruleId || currentPromote.rule_id,
        // goodsId: this.data.goods_id||'0',
        pageIndex: this.page,
        pageSize: app.Conf.PAGE_SIZE,
    }
    app.RunApi.go('GoodsApi', 'getPromotionGoodsList', params).then(res => {
        if (res.code == '1') {
            let data = res && res.data || {};
            let goods_list = data.goodsList || [];
            if (goods_list.length == 0) {
                this.setData({
                    none: true
                });
                app.SMH.showToast({
                    title: "已经到底啦！"
                })
                return
            }
            this.hasMore = this.page * app.Conf.PAGE_SIZE < (data.records || 0);
            this.page += 1;
            this.setData({
                goods_list: [...this.data.goods_list, ...goods_list],
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
    this.storageTemp = this.storageTemp || app.StorageH.get('CurrentPromote') || {};
    let obj = {};
    this.data.goods_list = [];
    this.setData({
        goods_list:[]
    })
    obj.rule_id = this.storageTemp.rule_id || '0';
    obj.rule_name = this.storageTemp.rule_name || '';
    obj.rule_nick_name = this.storageTemp.rule_nick_name || '';
    obj.end_time = this.storageTemp.end_time || '';
    obj.gift_tips = this.storageTemp.gift_tips || '';
    setTimeDown.call(this, obj.end_time);
    this.setData({
        baseInfo: obj,
        gift_tips: obj.gift_tips || {},
        list: this.storageTemp
    });
    console.log('gift_tips',this.data.list, this.data.gift_tips,this.data.baseInfo)
    initHeight.call(this);
}

function initHeight() {
    let that = this;
    wx.createSelectorQuery().select('#baseInfo').boundingClientRect(function(rect) {
        that.setData({
            height: rect.height
        })
    }).exec()
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


function setTimeDown(eTime=''){
  if (!eTime)return
  if (this.storageTemp.time_type == 0 || (this.storageTemp.time_type != 1 && this.storageTemp.time_type != 2)) {
    let date = new Date();
    this.startTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    startCountDown.call(this, this.startTime, eTime);
  }
}