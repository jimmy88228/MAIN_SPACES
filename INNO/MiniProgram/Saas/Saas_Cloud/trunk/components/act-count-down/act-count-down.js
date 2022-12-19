// components/act-count-down/act-count-down.js
const app = getApp();
import countDownTextHelp from "../../common/helper/handle/countDownTextHelp.js";
import MyDate from '../../common/support/utils/date-util.js';
import {
    CountDown
} from "../../common/manager/timer-manager.js";
Component(app.BTAB({
    properties: { 
    }, 
    data: { 
        isDetail:{
            pre:true,bargain:true,collage:true,point:true,buyBonus:true,
        },
        isList:{
            'list-pre':true,'list-bargain':true,'list-collage':true,'list-point':true,'list-buyBonus':true,
        }
    },
    lifetimes:{
        detached(){
            stopCountDown.call(this);
        }
    },
    pageLifetimes:{
        show(){
            this.hideed && restartCountDown.call(this);
            this.hideed = false;
        },
        hide(){
            this.hideed = true;
            stopCountDown.call(this);
        },
    },
    methods: {
        initData(data,cb){
            if(!data)return
            this.cb = cb;
            let {style} = trimData.call(this,data.type||"",data)
            let timeMsg = countDownTextHelp.getTimeMsg.call(this, data);
            timeMsg = timeMsg || {};
            this.setData({
                bgStyle:style,
                time:timeMsg.time,
                timeMsg,
            })
            if(timeMsg.timeDown){
              let stime = data.serverTime;
              let etime = data.etime;
              if(data.state == 1){ //未开始
                etime = data.stime;
              }
              data.state && startCountDown.call(this, stime, etime , cb);
            }
            return {state:data.state,disabledTip:timeMsg.disabledTip}
        },
        initListData(){},
    }
}))

//倒计时
function startCountDown(startTime,endTime,cb) {
    if (!this.countDown) {
        stopCountDown.call(this);
        this.countDown = new CountDown(MyDate.parse(startTime));
    }
    this.countDown.setTarget(MyDate.parse(endTime));
    setTime.call(this, this.countDown);
    if (!this.countDown.isRunning) {
        this.countDown.start(e => {
            if (e.value <= 0) {
                stopCountDown.call(this,this.countDown);
                this.triggerEvent('stopCountDown');
                cb && typeof(cb) == 'function' && cb();
            }
            setTime.call(this, e);
        });
    }
}

function stopCountDown(countDown) {
    this.countDown && this.countDown.stop();
}

function setTime(e) {
    if(e.value){
        let day = Math.floor(e.value / (60 * 60 * 24 * 1000));
        this.setData({
            time: e.format(day > 0 ? "dd天 HH:mm:ss" : "HH:mm:ss")
        }); 
    }
} 

function trimData(type,data){
    let style = "";
    //0:非法 1:未开始 2:进行中 3:已结束
    data.state = 0;
    if(MyDate.parse(data.etime) <= MyDate.parse(data.serverTime)){
        data.state = 3;
    }else if(MyDate.parse(data.serverTime) < MyDate.parse(data.stime)){
        data.state = 1;
    }else{
        data.state = 2;
    }
    switch(type){
        case 'pre':
        case 'list-pre':
            style = `background:linear-gradient(to right,${app.Conf.style.pre_color.from_color},${app.Conf.style.pre_color.to_color});`;
            break;
        case 'bargain':
        case 'list-bargain':
            style = `background:linear-gradient(to right,${app.Conf.style.bargain_color.from_color},${app.Conf.style.bargain_color.to_color});`;
            break;
        case 'collage':
        case 'list-collage':
            style = `background:linear-gradient(to right,${app.Conf.style.pt_color.from_color},${app.Conf.style.pt_color.to_color});`;
            break;
        case 'point':
        case 'list-point':
            style = `background:linear-gradient(to right,${app.Conf.style.p_color.from_color},${app.Conf.style.p_color.to_color});`;
            break;
        case 'buyBonus':
        case 'list-buyBonus':
            style = `background:#DE0016;`;
            break;
        default:
            break;
    }
    return {style,data};
}

function restartCountDown(){
    let countDown = this.countDown;
    if (countDown && !countDown.isRunning) {
        countDown.start(e => {
            if (e.value <= 0) {
                stopCountDown.call(this,countDown);
                this.triggerEvent('stopCountDown');
                this.cb && typeof(this.cb) == 'function' && this.cb();
            }
            setTime.call(this, e);
        });
    }
}