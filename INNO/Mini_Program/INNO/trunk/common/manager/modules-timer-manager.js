import {CountDown} from "./timer-manager.js"
import MyDate from "../support/utils/date-util.js"
class Modules_Timer_Manager{
  static getInstance(){
    if(!Modules_Timer_Manager.instance){
      Modules_Timer_Manager.instance =  new Modules_Timer_Manager();
    }
    return Modules_Timer_Manager.instance;
  }
  constructor(){}

  initModuleCountDown(mId,actId,mStart,mEnd,serTime,aCD) {
    if (!mId || !actId) return;
    aCD = aCD || {};
    mStart = mStart ? MyDate.parse(mStart) : '';
    mEnd = mEnd ? MyDate.parse(mEnd) : '';
    serTime = serTime ? MyDate.parse(serTime) : '';
    let cD = {
      mStart,
      mEnd,
      serTime
    };
    if (aCD[mId]) {
      if (mStart)
        aCD[mId].mStart = aCD[mId].mStart > mStart ? mStart : aCD[mId].mStart
      if (mEnd)
        aCD[mId].mEnd = aCD[mId].mEnd > mEnd ? aCD[mId].mEnd : mEnd
  
    } else {
      aCD[mId] = {
        mStart,
        mEnd,
        serTime,
        cDs: {}
      }
    }
    aCD[mId].cDs[actId] = cD;
    return aCD;
  }
  
  setModuleCountDown(aCD={},fnc) {
    for (let i in aCD) { //模块遍历     
      let mStart = aCD[i].mStart;
      let mEnd = aCD[i].mEnd;
      let servTime = aCD[i].serTime;
      if (servTime >= mEnd) {
        this.setTimeData(i, aCD[i].cDs, {},{over:true});
        if (aCD.countDown) {
          stopCountDown.call(this, aCD.countDown);
        }
      } else {
        if (!aCD[i].countDown) {
          aCD[i].countDown = new CountDown(servTime);
        }
        let targetTime = mEnd;
        if (mStart > servTime) {
          targetTime = mStart;
        }
        if (!aCD[i].countDown.isRunning) { //已存在的模块倒计时不会进去start
          aCD[i].countDown.setTarget(targetTime);
          aCD[i].countDown.start(e => {
            if (e.value <= 0) {
              stopCountDown.call(this, aCD[i].countDown);
              if(typeof(fnc) == "function"){
                fnc();
              }
            } else {
              this.setTimeData(i, aCD[i].cDs, e)
            }
          })
        }
      }
    }
  }
  
  setTimeData(mId, cDs, time,extra={}) {
    let servTime = new Date(time.nowTime);
    for (let i in cDs) { //模块里面的多活动遍历
      let mStart = cDs[i].mStart;
      let mEnd = cDs[i].mEnd;
      let active = 0; //0:未开始，1：进行中，2：结束
      let _value = "";
      if (extra.over || servTime > mEnd || servTime == mEnd) { //结束
        _value = "";
        active = 2;
      } else {
        let targetTime = mStart > servTime ? mStart : mEnd;
        active = mStart > servTime ? 0 : 1;
        _value = targetTime.getTime() - servTime.getTime();
      }
      cDs[i] = {
        active,
        ...cDs[i],
        ...this.timeHandle(_value)
      }
    } 
    //先遍历全部活动 再下面setData
    let page = getCurrentPages().pop(); 
    page.data.actCountDown = page.data.actCountDown || {};
    page.data.actCountDown[mId] = cDs;
    page.setData({
      actCountDown: page.data.actCountDown
    })
    // if(!this.firstShow){
    //   this.firstShow = true;
    //   console.log('倒计时',page.data.actCountDown);
    // }
    console.log('倒计时',page.data.actCountDown);  //每秒log
  }
  
  timeHandle(value) {
    if (!value) return "";
    let day = Math.floor(value / (60 * 60 * 24 * 1000));
    let hour = parseInt(value % (60 * 60 * 24 * 1000) / (1000 * 60 * 60));
    let minutes = parseInt((value % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = parseInt((value % (1000 * 60)) / 1000);
    let data = {};
    data.day = day;
    data.hour = hour > 9 ? hour : '0' + hour;
    data.min = minutes > 9 ? minutes : '0' + minutes;
    data.sec = seconds > 9 ? seconds : '0' + seconds;
    return data;
  }
  
  setStopCountDown(countDown){
    stopCountDown.call(this,countDown);
  }
}

function stopCountDown(countDown) {
  if (countDown) {
    countDown.stop();
  }
}

export default Modules_Timer_Manager.getInstance();