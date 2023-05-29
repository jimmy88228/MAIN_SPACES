export default {
    format(date, fmt = "yyyy-MM-dd HH:mm:ss") {
        const o = {
            "M+": date.getMonth() + 1, // 月份
            "d+": date.getDate(), // 日
            "H+": date.getHours(), // 小时
            "h+": date.getHours() % 12, // 小时
            "m+": date.getMinutes(), // 分
            "s+": date.getSeconds(), // 秒
            "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
            "S+": date.getMilliseconds() // 毫秒
        };

        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (date.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
        }

        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length)
                );
            }
        }
        return fmt;
    },
    parse(dataStr) {
        return new Date(dataStr && dataStr.replace(/-/g, "/"));
    },
    formatStr(dataStr, fmt = "yyyy-MM-dd HH:mm:ss") {
        return this.format(this.parse(dataStr), fmt);
    },
    getWeekStr(week, isFull){
        let weekStrArr = ['日', '一', '二', '三', '四', '五', '六'];
        if(parseInt(week) || parseInt(week) == 0){
            return isFull ? '星期' + weekStrArr[week] : weekStrArr[week];
        }
    }
};
