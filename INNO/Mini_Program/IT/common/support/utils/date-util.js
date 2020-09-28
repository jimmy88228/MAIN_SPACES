export default {
    formatStr(dataStr, fmt) {
        return this.format(this.parse(dataStr), fmt);
    },
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
    spanFormat(span, fmt) {
        span = span / 1000;
        let day = 0;
        if (new RegExp("(d+)").test(fmt)) {
            day = Math.floor(span / (60 * 60 * 24));
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? day : ((day > 9 ? "00" : "0") + day).substr(("" + day).length));
        }
        let hour = 0;
        if (new RegExp("(H+)").test(fmt)) {
            hour = Math.floor(span / (60 * 60)) - (day * 24);
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? hour : ("00" + hour).substr(("" + hour).length));
        }
        let minute = 0;
        if (new RegExp("(m+)").test(fmt)) {
            minute = Math.floor(span / 60) - (day * 24 * 60) - (hour * 60);
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? minute : ("00" + minute).substr(("" + minute).length));
        }
        let second = 0;
        if (new RegExp("(s+)").test(fmt)) {
            second = Math.floor(span) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? second : ("00" + second).substr(("" + second).length));
        }
        return fmt;
    }
};