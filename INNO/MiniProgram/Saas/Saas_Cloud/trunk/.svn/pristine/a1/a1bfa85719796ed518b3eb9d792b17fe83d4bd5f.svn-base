/*倒计时*/
var DateDown= function(this_page,now_time_str, time_str, callback) {
  var that = this;
  var end_date, now_date;
  //转换为
  if ( typeof(time_str) == 'string'){
    var end_date_arr = time_str.split(/[- : \/]/);
    end_date = new Date(end_date_arr[0], end_date_arr[1] - 1, end_date_arr[2], end_date_arr[3], end_date_arr[4], end_date_arr[5]);
  }else{
    end_date = time_str;
  }
  //
  if (typeof(now_time_str) == 'string'){
    var now_date_arr = now_time_str.split(/[- : \/]/);
    now_date = new Date(now_date_arr[0], now_date_arr[1] - 1, now_date_arr[2], now_date_arr[3], now_date_arr[4], now_date_arr[5]);
  }else{
    now_date = now_time_str;
  }
  var end_time = end_date.getTime();
  var now_time, timer;
  var int_day, int_hour, int_minute, int_second;
  var distance_txt;
  //
  //计算时差
  var countDown = function () {
    now_date = new Date(now_date.getTime() + 1000);
    now_time = now_date.getTime();
    var time_distance = end_time - now_time; // 时间差：活动结束时间减去当前时间
    if (time_distance > 0) {
      int_day = Math.floor(time_distance / 86400000);
      time_distance -= int_day * 86400000;
      int_hour = Math.floor(time_distance / 3600000);
      time_distance -= int_hour * 3600000;
      int_minute = Math.floor(time_distance / 60000);
      time_distance -= int_minute * 60000;
      int_second = Math.floor(time_distance / 1000);
      //
      time_code();
      //
      setHtml(int_day, int_hour, int_minute, int_second);
    } else {
      clearInterval(timer);
    }

  }
  //小于10，加0
  var time_code = function () {
    // 判断小时小于10时，前面加0进行占位 
    if (int_hour < 10) {
      int_hour = "0" + int_hour;
    }
    // 判断分钟小于10时，前面加0进行占位     
    if (int_minute < 10) {
      int_minute = "0" + int_minute;
    }
    // 判断秒数小于10时，前面加0进行占位
    if (int_second < 10) {
      int_second = "0" + int_second;
    }
  }
  //返回时间html
  var setHtml = function (int_day, int_hour, int_minute, int_second) {
    var date = {
      day: int_day,
      hour: int_hour,
      min: int_minute,
      sec: int_second
    }
    // console.log(date.day + "-" + date.hour + "-" + date.min + "-" + date.sec);
    typeof (callback) == "function" && callback(date);
  }
  timer = setInterval(function () {
    countDown();
  }, 1000);
}
module.exports= {
  DateDown: DateDown
}