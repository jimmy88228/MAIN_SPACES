import Promise from "../../libs/promise/promise.js";
import Conf from "../../conf.js";
import LM from "./login-manager.js"
import StoHd from "../handle/storageHandle";
let cacheTime = 24*60*2;
class checkUpdateTimer {
  static getInstance() {
    if (!checkUpdateTimer.instance) {
      checkUpdateTimer.instance = new checkUpdateTimer();
    }
    return checkUpdateTimer.instance;
  }
  constructor() {
    this._isStaff = false;
    let storage = StoHd.get('CHECK_TIMER');
    if(!storage){
      StoHd.set('CHECK_TIMER',{});
    }
  }
  checkTimer(type=""){
    return new Promise((rs,rj)=>{
      if(type == "rankTip" || type == "staffRankTip"){ //计算与上次记录是否同一天
        checkIfStaff.call(this);
        if(Conf.staffConf.service.rank == 1 && this._isStaff){
          checkSameDay.call(this,type,rs,rj);
        }else{
          rj();
        }
      }else{
        rs();
      }
    })
  }
  updateTimer(type=""){
    return new Promise((rs,rj)=>{
      if(type == "rankTip" || type == "staffRankTip"){ //计算与上次记录是否同一天
        checkIfStaff.call(this);
        if(Conf.staffConf.service.rank == 1 && this._isStaff){
          updateTimer.call(this,type,rs,rj);
        }else{
          rj()
        }
      }else{
        rs();
      }
    })
  }
} 

function checkSameDay(type="",rs,rj){
  let date = new Date();
  let name = '' + (date.getFullYear()) + '/' + (date.getMonth()+1) + '/' + (date.getDate());
  let storage = StoHd.get('CHECK_TIMER') || {};
  if(storage[type]){
    let item = storage[type];
    if(!item.visit){
      if(item.date != name){
        storage[type].date = name;
        StoHd.set('CHECK_TIMER',storage,cacheTime);
      }
      rs && rs(storage[type]);
    }else if(item.date != name){
      storage[type].date = name;
      storage[type].visit = false;
      StoHd.set('CHECK_TIMER',storage,cacheTime);
      rs && rs(storage[type]);
    }else{
      rj && rj();
    }
  }else{
    storage[type] = {};
    storage[type].date = name;
    storage[type].visit = false;
    StoHd.set('CHECK_TIMER',storage,cacheTime);
    rs && rs({date:name,visit:false});
  }
}

function updateTimer(type=""){
  let storage = StoHd.get('CHECK_TIMER') || {};

  if(storage[type]){
    storage[type].visit = true;
    StoHd.set('CHECK_TIMER',storage,cacheTime);
  }else{
    let date = new Date();
    storage[type] = {};
    storage[type].date = '' + (date.getFullYear()) + '/' + (date.getMonth()+1) + '/' + (date.getDate());
    storage[type].visit = true;
    StoHd.set('CHECK_TIMER',storage,cacheTime);
  }
}

function checkIfStaff(){
  this.sto_staff = this.sto_staff || LM.staffInfo || "";
  this._isStaff = this.sto_staff.isStaffDstbData || false;
}

export default checkUpdateTimer.getInstance();