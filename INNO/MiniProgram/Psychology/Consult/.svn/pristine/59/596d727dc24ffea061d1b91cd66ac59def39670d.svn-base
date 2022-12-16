export default {
    format(date, fmt) {
        const o = {
            "M+": date.getMonth() + 1, // 月份
            "d+": date.getDate(), // 日
            "H+": date.getHours(), // 小时
            "h+": date.getHours(), //% 12, // 小时
            "m+": date.getMinutes(), // 分
            "s+": date.getSeconds(), // 秒
            "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
            "S+": date.getMilliseconds() // 毫秒
        };

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return fmt;
    },
    parse(dataStr) {
        return new Date(dataStr && dataStr.replace(/-/g, "/"));
    },
    spanFormat(span, fmt = 'HH:mm:ss',isHide=false) { //isHide:隐藏等于0的时间单位
        span = span / 1000;
        let day = 0;
        if (new RegExp("(d+)").test(fmt)) {
            day = Math.floor(span / (60 * 60 * 24));
            if(isHide && day<=0){
                fmt = hideFmt(fmt,['H','h','M','m','S','s'])
            }else{
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? day : ((day > 9 ? "00" : "0") + day).substr(("" + day).length));
            }
        }
        let hour = 0;
        if (new RegExp("(H+)").test(fmt)) {
            hour = Math.floor(span / (60 * 60)) - (day * 24);
            if(isHide && hour<=0){
                fmt = hideFmt(fmt,['M','m','S','s'])
            }else{
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? hour : ("00" + hour).substr(("" + hour).length));
            }
        }
        let minute = 0;
        if (new RegExp("(m+)").test(fmt)) {
            minute = Math.floor(span / 60) - (day * 24 * 60) - (hour * 60);
            if(isHide && minute<=0){
                fmt = hideFmt(fmt,['S','s'])
            }else{
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? minute : ("00" + minute).substr(("" + minute).length));
            }
        }
        let second = 0;
        if (new RegExp("(s+)").test(fmt)) {
            second = Math.floor(span) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            if(isHide && second<=0){
                fmt = hideFmt(fmt,[])
            }else{
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? second : ("00" + second).substr(("" + second).length));
            }
        }
        return fmt;
    }, 
    CompareData(d1,d2){
     if(typeof(d1) == "string"){
       d1 = new Date(d1).getTime();
     }
     if (typeof (d2) == "string") {
       d2 = new Date(d2).getTime();
     }
     if(d1 > d2) return true;
     return false
   }, 
    getWeekFirstDay(_now_time) {
        _now_time = _now_time || new Date();
        let WeekFirstDay = new Date(_now_time - (_now_time.getDay() - 1) * (1000*60*60*24));
        let M = Number(WeekFirstDay.getMonth()) + 1;
        return WeekFirstDay.getFullYear() + "-" + M + "-" + WeekFirstDay.getDate();
    },
    getMonthFirstDay(_now_time) {
        _now_time = _now_time || new Date();
        let MonthFirstDay = new Date(_now_time.getFullYear(), _now_time.getMonth(), 1);
        let M = Number(MonthFirstDay.getMonth()) + 1
        return MonthFirstDay.getFullYear() + "-" + M + "-" + MonthFirstDay.getDate();
    },
    getDetailToday(char1="-",char2=":"){
        let year = new Date().getFullYear();
        let month = this.tenSupplement(new Date().getMonth() + 1);
        let date = this.tenSupplement(new Date().getDate());
        let hours = this.tenSupplement(new Date().getHours());
        let minutes = this.tenSupplement(new Date().getMinutes());
        let seconds = this.tenSupplement(new Date().getSeconds());
        return year + char1 + month + char1 + date + ' ' + hours + char2 + minutes + char2 + seconds;
    },
    /**
     * 获取相隔天数指定年月日
     * @param date 日期
     * @param i 相隔天数
     */
     getDate(date, i) {
        if (date === undefined || date === null) {
            date = new Date();
        }
        let month, day;
        date.setTime(date.getTime() + i * 24 * 60 * 60 * 1000);
        month = date.getMonth() + 1 < 10 ? '0' + parseInt(date.getMonth() + 1) : date.getMonth() + 1;
        day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let year = date.getFullYear();
        let time = {
            year,
            date: month + "-" + day,
            week:this.weekDay(year + '-'+ month + "-" + day)
        };
        return time;
    },

    
     /**
     * 获取今天后面n天的年月日
     * @param lastDate 经过多少天
     */
     getFollowUpDate(lastDate) {
        let nowDate = new Date();
        let caculateDate = lastDate > 0 ? lastDate - 1 : lastDate
        let timeArr = [];
        for (let i = 0; i <= caculateDate; i++) {
            let addCount = i === 0 ? 0 : 1;
            console.log(addCount, "addCount")
            nowDate.setDate(nowDate.getDate() + addCount);
            let year = nowDate.getFullYear();
            let date = this.tenSupplement(nowDate.getMonth() + 1) + '-' + this.tenSupplement(nowDate.getDate());
            timeArr.push({
                year,
                date,
                week: this.weekDay(year + '-' + date)
            }, )
        }
        return timeArr
    },

    weekDay(time) {
        let datelist = ['周日', '周一', '周二', '周三', '周四', '周五', '周六', ]
        return datelist[new Date(time).getDay()];
    },
    tenSupplement(time) {
        let result = time;
        time < 10 && (result = "0" + time);
        return result;
    }
};

function searchIndex(str,arr){
    let index = -1;
    for(let i = 0,len=arr.length;i<len;i++){
        let item = arr[i];
        index = str.indexOf(item);
        if(index>-1)break;
    }
    return index;
}

function hideFmt(fmt="",arr=[]){
    let rst = '';
    let index = searchIndex(fmt,arr);
    rst = fmt.replace(fmt.substring(fmt.indexOf(RegExp.$1),index == -1?fmt.length:index),'');
    return rst;
}