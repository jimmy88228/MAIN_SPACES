let Msg = { //活动页的文案
  0: { id: 0, title: "", tip: "" },
  1: { id: 1, title: "好友助力抢秒杀资格", tip: "" },
  2: { id: 2, title: "恭喜你，已获得秒杀资格", tip: "赶紧下单拼手速吧！" },
  3: { id: 3, title: "活动还未开始，敬请期待", tip: "不要急，先看看其他活动吧" },
  4: { id: 4, title: "活动已经结束啦！", tip: "马上前往其他活动场看看吧，更多好礼等着你" },
  5: { id: 5, title: "恭喜你，已获得秒杀资格", tip: "活动即将开始，敬请期待" },
}

const OrderStatus = { //订单页的订单状态
  [-1]: { id:-1,name: "未知", label: "",id:-1,tip:"",},
  [0]: { id:0,name: "待确认", label: "WAIT_CONFIRMED",tip:"",},
  [1]: { id:1,name: "待支付", label: "WAIT_PAY",tip:""}, 
  [2]: { id:2,name: "已完成", label: "COMPLETED",tip:"",},//已支付
  [3]: { id:3,name: "已结束", label: "CANCELED",tip:"",},
  [4]: { id:4,name: "退款中", label: "REFUNDING",tip:"系统将自动退款",},
  [5]: { id:5,name: "已退款", label: "REFUNDED",tip:"支付金额已退回",},
  [6]: { id:6,name: "未完成", label: "PAYED",tip:"",},  //已支付
}

const FailReason = { //记录页的订单状态
  [0]: { id:0,tip:"订单已取消",},
  [1]: { id:1,tip:"支付失败，商品库存不足",},
  [2]: { id:2,tip:"支付超时",},
}

const TimeMsg = { //秒杀倒计时的文案 7天前后有区别  //tip:小于7天的文案、ellip_tip:大于7天的文案
  [0]: { id:0,tip:"",},
  [1]: { id:1,tip: "距离资格开抢",ellip_tip:"资格开抢时间"},  
  [2]: { id:2,tip:"距开始",ellip_tip:"开启时间"},
  [3]: { id:3,tip:"距结束",ellip_tip:"限时秒杀中"},
  [4]: { id:4,tip:"秒杀已结束",ellip_tip:"秒杀已结束"}
}

import MyDate from '../../../../common/support/utils/date-util.js'; 

class GetStatus {
  constructor(){
  } 
  
  static getInstance() {
    if (!GetStatus.instance){
      GetStatus.instance = new GetStatus();
    }
    return GetStatus.instance;
  }

  getOrderStatus(id){
    id = id && parseInt(id);
    let res = OrderStatus[id] || {};
    return res;
  }

  getFailReason(id){
    id = id && parseInt(id);
    let res = FailReason[id] || {};
    return res;
  }

  getActMsg(acInfo, progress){
    let id = 0;
    if (acInfo.state == 4) {
      id = 4;
    } else if (acInfo.state == 1) {
      id = 3;
    } else if (progress.isComplete == 1) {
      id = 2;
      if (acInfo.state == 2){
        id = 5;
      }
    } else if (progress.now == 0 || !progress.now) {
      id = 1;
      Msg[id].tip = `分享给${progress.target || acInfo.shareCondition}位好友点击助力，马上解锁秒杀资格`
    } else if (acInfo.state){
      Msg[id].title = `还差${(progress.target - progress.now) || acInfo.shareCondition}位好友点击助力，继续努力噢！`
      Msg[id].tip = `分享给${(progress.target - progress.now) || acInfo.shareCondition}位好友点击助力，马上解锁秒杀资格`
      id = 0;
    }
    return Msg[id] || {};
  }

  getTimeMsg(acInfo={},type='detail'){
    acInfo = acInfo || {};
    let state = acInfo.state || 0;
    let seven_time = 7 * (60 * 60 * 24 * 1000);
    let n_time = MyDate.parse(acInfo.serverTime).getTime() + seven_time;
    let text = '';
    let time = '';
    let tempTime = 0;
    let etime = 0;
    let timeDown = false;
    if(state==1){
      tempTime = MyDate.parse((type == 'detail' || acInfo.shareCondition == 0) ? acInfo.stime : acInfo.rtime).getTime();
      etime = MyDate.parse((type == 'detail' || acInfo.shareCondition == 0) ? acInfo.stime : acInfo.rtime);
    }else if(state==2){
      tempTime = MyDate.parse(acInfo.stime).getTime();
      etime = MyDate.parse(acInfo.stime);
    }else if(state==3){
      tempTime = MyDate.parse(acInfo.etime).getTime();
      etime = MyDate.parse(acInfo.etime);
    }else if (state == 4){
    }else{
      return {}
    }
    // console.log('大于7天', n_time < tempTime);
    if (n_time < tempTime) { //tempTime大于今天过后的第7天
      text = TimeMsg[state].ellip_tip;
      if (state == 1 || state == 2) {
        time = MyDate.format(etime, "MM-dd HH:mm");
        if (state == 1 && (type == 'detail' || acInfo.shareCondition == 0)){
          text = TimeMsg[2].ellip_tip;
        }
      }
    } else { //小于7天
      text = TimeMsg[state].tip;
      if (state == 1 && (type == 'detail' || acInfo.shareCondition == 0)) {
        text = TimeMsg[2].tip;
      }
      timeDown = true;
    }
    return { text, time, timeDown, etime}
    //text：倒时文案 、 time：日期文案(大于7天且state为1、2时需要) 、 timeDown：是否开启倒计时 、 etime：返回state对应的etime
  }
}


export default GetStatus.getInstance();