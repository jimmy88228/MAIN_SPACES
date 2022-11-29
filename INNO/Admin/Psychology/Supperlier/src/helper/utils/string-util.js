export default {
    trim(str, s = "\\s") {
        str = str + "";
        let reg = new RegExp("^(" + s + ")+|(" + s + ")+$", "gm");
        return str && str.replace(reg, "");
    },
    trimStart(str, s = "\\s") {
        let reg = new RegExp("^(" + s + ")+", "gm");
        return str && str.replace(reg, "");
    },
    trimEnd(str, s = "\\s") {
        let reg = new RegExp("(" + s + ")+$", "gm");
        return str && str.replace(reg, "");
    },
    getTimeStr(time){
        let str = "";
        // 转换为式分秒
        let h = parseInt(time / 60 / 60 % 24)
        h = h < 10 ? '0' + h : h
        let m = parseInt(time / 60 % 60)
        m = m < 10 ? '0' + m : m
        let s = parseInt(time % 60)
        s = s < 10 ? '0' + s : s
        str = h + ':' + m + ':' + s
        return str || "";
    },
    getStrLen(str){
        if(str){
            let strL = parseInt(str.length);
            let ch = cLength(str); // 中文字数；
            let ot = strL - ch; // 中文外字数；
            let total = ch * 2 + ot;
            return total;
        } else {
            return 0
        }
    },
    getArrIdsStr(arr, idKey = 'id'){
        let str = ""
        if(arr instanceof Array){
            let ids = arr.map((item)=>{
                return item[idKey];
            })
            str = ids.join(',');
        }
        return str;
    }
};
// 
function cLength(str){
    var reg = /[^\u4E00-\u9FA5\uf900-\ufa2d]/g;
    var temp = str.replace(reg,'');
    return temp.length;
}