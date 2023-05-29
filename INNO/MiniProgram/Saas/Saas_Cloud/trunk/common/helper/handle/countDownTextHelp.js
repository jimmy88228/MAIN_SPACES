// 文案：
let Msg = { //秒杀活动页的文案
  0: { id: 0, title: "", tip: "" },
  1: { id: 1, title: "好友助力抢秒杀资格", tip: "" },
  2: { id: 2, title: "恭喜你，已获得秒杀资格", tip: "赶紧下单拼手速吧！" },
  3: { id: 3, title: "活动还未开始，敬请期待", tip: "不要急，先看看其他活动吧" },
  4: { id: 4, title: "活动已经结束啦！", tip: "马上前往其他活动场看看吧，更多好礼等着你" },
  5: { id: 5, title: "恭喜你，已获得秒杀资格", tip: "活动即将开始，敬请期待" },
}

const OrderStatus = { //秒杀订单页的订单状态
  [-1]: { id:-1,name: "未知", label: "",id:-1,tip:"",},
  [0]: { id:0,name: "待确认", label: "WAIT_CONFIRMED",tip:"",},
  [1]: { id:1,name: "待支付", label: "WAIT_PAY",tip:""}, 
  [2]: { id:2,name: "已完成", label: "COMPLETED",tip:"",},//已支付
  [3]: { id:3,name: "已结束", label: "CANCELED",tip:"",},
  [4]: { id:4,name: "退款中", label: "REFUNDING",tip:"系统将自动退款",},
  [5]: { id:5,name: "已退款", label: "REFUNDED",tip:"支付金额已退回",},
  [6]: { id:6,name: "未完成", label: "PAYED",tip:"",},  //已支付
}

const FailReason = { //秒杀记录页的订单状态
  [0]: { id:0,tip:"订单已取消",},
  [1]: { id:1,tip:"支付失败，商品库存不足",},
  [2]: { id:2,tip:"支付超时",},
}

// 倒计时:
const SkTimeMsg = { //助力秒杀活动页和详情页倒计时文案
  [0]: { id:0,tip:"",},
  [1]: { id:1,tip: "距离资格开抢",ellip_tip:"资格开抢时间"}, //tip:小于7天的文案、ellip_tip:大于7天的文案
  [2]: { id:2,tip:"距开始",ellip_tip:"开启时间"},
  [3]: { id:3,tip:"距结束",ellip_tip:"限时秒杀中"},
  [4]: { id:4,tip:"秒杀已结束",ellip_tip:"秒杀已结束"}
}

const CustomSkTimeMsg = { //自定义页广告位的助力秒杀倒计时文案
  [0]: { id:0,tip:"",},
  [1]: { id:1,tip: "距资格开抢",ellip_tip:"抢资格时间",tip2: "距资格开抢",ellip_tip2:"资格开抢时间"}, //tip:小于7天的文案、ellip_tip:大于7天的文案
  [2]: { id:2,tip:"距开始",ellip_tip:"开启时间",tip2: "距开始还剩",ellip_tip2:"秒杀开启时间"},
  [3]: { id:3,tip:"秒杀中",ellip_tip:"限时秒杀中",tip2: "距结束",ellip_tip2:"限时秒杀中"},
  [4]: { id:4,tip:"已结束",ellip_tip:"已结束",tip2: "活动已结束",ellip_tip2:"活动已结束"}
}

const TimeMsg = { //通用倒计时文案   //acInfo:{state,stime,etime,serverTime,acName} //活动数据结构规则
  [1]: { id:1,tip:"距开始",ellip_tip:"开启时间",disabled_tip:"活动未开始"},
  [2]: { id:2,tip:"距结束",ellip_tip:"限时"}, //实际文案：限时XXX中
  [3]: { id:3,tip:"已结束",ellip_tip:"已结束",disabled_tip:"活动已结束"}
}

 

import MyDate from '../../support/utils/date-util.js';

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

  getSkTimeMsg(acInfo={},type='detail'){
    acInfo = acInfo || {};
    let state = acInfo.state || 0;
    let seven_time = 7 * (60 * 60 * 24 * 1000);
    let n_time = MyDate.parse(acInfo.serverTime).getTime() + seven_time;
    let text = '',time = '',tempTime = 0,etime = 0,timeDown = false;
    if(state==1){
      tempTime = MyDate.parse(type == 'detail' ? acInfo.stime : acInfo.rtime).getTime();
      etime = MyDate.parse(type == 'detail' ? acInfo.stime : acInfo.rtime);
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
    if (n_time < tempTime) { //tempTime大于今天过后的第7天
      text = SkTimeMsg[state].ellip_tip;
      if (state == 1 || state == 2) {
        time = MyDate.format(etime, "MM-dd HH:mm");
        if (state == 1 && type == 'detail'){
          text = SkTimeMsg[2].ellip_tip;
        }
      }
    } else { //小于7天
      text = SkTimeMsg[state].tip;
      if (state == 1 && type == 'detail') {
        text = SkTimeMsg[2].tip;
      }
      timeDown = true;
    }
    return { text, time, timeDown, etime}
    //text：倒时文案 、 time：日期文案(大于7天且state为1、2时需要) 、 timeDown：是否开启倒计时 、 etime：返回state对应的etime
  }

  getCustomSkTimeMsg(acInfo={},type=''){
    acInfo = acInfo || {};
    let state = acInfo.state || 0;
    let seven_time = 7 * (60 * 60 * 24 * 1000);
    let n_time = MyDate.parse(acInfo.serverTime).getTime() + seven_time;
    let text = '',time = '',tempTime = 0,etime = 0,timeDown = false;
    if(state==1){
      tempTime = MyDate.parse(acInfo.rtime).getTime();
      etime = MyDate.parse(acInfo.rtime);
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
    if (n_time < tempTime) { //tempTime大于今天过后的第7天
      text = type == 1 ? CustomSkTimeMsg[state].ellip_tip : CustomSkTimeMsg[state].ellip_tip2;
      if (state == 1 || state == 2) {
        time = type == 1 ? MyDate.format(etime, "M.dd HH:mm") : MyDate.format(etime, "M,dd,HH,mm") ;
        if(type==2){
          time = time.split(',');
        }
      } else if (state == 3){
        text = type == 1 ? CustomSkTimeMsg[state].ellip_tip : CustomSkTimeMsg[state].ellip_tip2;
      }
    } else { //小于7天
      text =  type == 1 ?  CustomSkTimeMsg[state].tip :CustomSkTimeMsg[state].tip2; ;
      timeDown = true;
    }
    //说明：text：倒时文案 、 time：日期文案(大于7天且state为1、2时需要) 、 timeDown：是否开启倒计时 、 etime：返回state对应的etime
    return { text, time, timeDown, etime}
  }

  getTimeMsg(acInfo={},type=''){
    acInfo = acInfo || {};
    let state = acInfo.state || 0;
    let acName = acInfo.acName || "";
    let seven_time = 7 * (60 * 60 * 24 * 1000);
    let n_time = MyDate.parse(acInfo.serverTime).getTime() + seven_time;
    let text = '',time = '',tempTime = 0,etime = 0,timeDown = false;
    if(state==1){
      tempTime = MyDate.parse(acInfo.stime).getTime();
      etime = acInfo.stime;
    }else if(state==2){
      tempTime = MyDate.parse(acInfo.etime).getTime();
      etime = acInfo.etime;
    }else if (state == 3){
    }else{
      return {}
    }
    if (n_time < tempTime) { //tempTime大于今天过后的第7天
      text = state == 2 ? TimeMsg[state].ellip_tip + acName + "中" : state == 3 ? acName + TimeMsg[state].ellip_tip : TimeMsg[state].ellip_tip;
      if (state == 1) {
        time = MyDate.format(MyDate.parse(etime), "MM-dd HH:mm");
      }
    } else { //小于7天
      text =  state == 3 ? acName + TimeMsg[state].tip : TimeMsg[state].tip;
      timeDown = (state == 1 || state == 2);
    }
    let disabledTip = TimeMsg[state] && TimeMsg[state].disabled_tip || "";
    return { ...acInfo,text,time,timeDown,etime,disabledTip}
    //text：倒时文案 、 time：日期文案(大于7天且state为1、2时需要) 、 timeDown ：是否开启倒计时 、 etime：返回state对应的etime
  }
}


export default GetStatus.getInstance();