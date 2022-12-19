var time ={
  _interval:null,
  surplus_time:0,// 剩余时间
  init_time:0,//判断是自动倒计时结束还是直接赋值为0
 
  setTime(func){//传入时间戳
       var that = this;
      var day = 0, 
        hour = 0,
        minute = 0,
        second = 0; //时间默认值
      var time = this.surplus_time;
      var init_time = this.init_time;
      if (time >= 0) {
        // day = Math.floor(intDiff/60);
        // hour = Math.floor(intDiff / (60 * 60));
        // minute = Math.floor(intDiff / 60) - (hour * 60);
        // second = Math.floor(intDiff) - (hour * 60 * 60) - (minute * 60);
        day = parseInt(parseInt(parseInt(time / 60) / 60) / 24); 
        hour = parseInt(parseInt(time / 60) / 60) % 24;
        minute = parseInt(time / 60) % 60;
        second = parseInt(time) % 60;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        var date = {
          day: day,
          hour: hour,
          min: minute,
          sec: second
        }
        typeof (func) === "function" & func(date, time, init_time);
      } else {
        clearInterval(this._interval);
      }
  },
  TimeDown(intDiff,func){
    var that = this;
    this.surplus_time = intDiff;
    this.init_time = intDiff;
    if (this._interval == null && this.surplus_time>0){
           this._interval = setInterval(function () {
                  if (that.surplus_time <= 0) {
                         clearInterval(that._interval);
                         that._interval = null;
                  }
                  that.setTime(func);
                  that.surplus_time--;
                  
           }, 1000);

    }
   
  },
  destroy(){
       if (this._interval != null){
           clearInterval(this._interval);
           this._interval = null;
       }
  }
}
export default time;