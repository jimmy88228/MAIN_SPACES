var time ={
  _interval:null,
  Init(this_page,time,func){//传入时间戳
      var day = 0, 
        hour = 0,
        minute = 0,
        second = 0; //时间默认值
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
        // console.log(date.day + "-" + date.hour + "-" + date.min + "-" + date.sec);
        typeof (func) === "function" & func(date);
      } else {
        clearInterval(this._interval);
      }
  },
  TimeDown(this_page,time,func){
    var that = this;
    this._interval = setInterval(function(){
      that.Init(this_page,time,func);
      time = time - 1;
    },1000);
  }
}
export default time;