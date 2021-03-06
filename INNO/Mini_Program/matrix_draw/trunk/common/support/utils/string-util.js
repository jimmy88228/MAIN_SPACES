export default {
    trim(str, s = "\\s") {
        if (!str) {
            return str
        }
        let reg = new RegExp("^(" + s + ")+|(" + s + ")+$", "gm");
        return str.replace(reg, "");
    },
    trimStart(str, s = "\\s") {
        if (!str) {
            return str
        }
        let reg = new RegExp("^(" + s + ")+", "gm");
        return str.replace(reg, "");
    },
    trimEnd(str, s = "\\s") {
        if (!str) {
            return str
        }
        let reg = new RegExp("(" + s + ")+$", "gm");
        return str.replace(reg, "");
    },
    encodePrice(str, s = "") {
        if (str.length <= 1) {
            return s;
        } else {
            let idx = str.indexOf(".");
            let arr = str.split("");
            arr.splice(0, idx, s);
            return arr.join('');
        }
    }, 
    safeFilter(value,type){
        let pattern = new RegExp("[`~!@$^&*=|{}':;',.<>/?~！@￥……&*——|{}【】‘；：”“'。，、？]", 'g');
        switch(type){
          case "address":
            break;
          case "remarks":
            pattern = new RegExp("[`@$^&*=|{}';',.<>/?~！@￥……&*——|{}‘；”“'，、？]", 'g');
            break;
        }
        value = value.replace(pattern, "");
        return value
    }, 
    getCharLength(str) { 
        let realLength = 0;
        try{
          let len = str.length, charCode = -1;
          for (let i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
          }
        }catch(e){}
        return realLength
    },
};
