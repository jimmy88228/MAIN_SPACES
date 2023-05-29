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
    setOmitStr(val, omitStr = "****"){
        if(!val){
            return "";
        }
        val = val.replace(/(\d{3})\d{4}(\d{4})/, "$1"+ omitStr +"$2");
        return val;
    }
};
// 
function cLength(str){
    var reg = /[^\u4E00-\u9FA5\uf900-\ufa2d]/g;
    var temp = str.replace(reg,'');
    return temp.length;
}