class StrManager {
  static getInstance() {
    if (!StrManager.instance) {
      StrManager.instance = new StrManager();
    }
    return StrManager.instance;
  }
  constructor() {
    
  }
  getDiscount(num) {
    num = parseFloat(num);
    let numArr = num.toString().split(".");
    if (numArr[0] == 1) return num;
    num = parseFloat((num * 10).toFixed(2));
    return num;
  }
  //中间省略
  ellipsisStr(str = "", limitL = 48) {
    if(!str) return "";
    let len = 0, strInfo = {};
    let point = parseInt(limitL / 2) - 2;
    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      //单字节加1 
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
        len++;
      }
      else {
        len += 2;
      }
      //临界线
      if (len < point) {
        strInfo.strL = strInfo.strL ? strInfo.strL + str[i] : str[i];
        strInfo.strLLen = len;
      } else {
        if (strInfo.strRLen > 0 && strInfo.strRLen > point) {
          strInfo.strR = strInfo.strR.slice(1);
          strInfo.strR += str[i];
        } else {
          strInfo.strR = strInfo.strR ? strInfo.strR + str[i] : str[i];
          strInfo.strRLen = len - point;
        }
      }
    }
    if (len > limitL) {
      return strInfo.strL + "..." + strInfo.strR;
    }
    return str;
  }
  //数组转json
  createJsonByKey(obj, key) {
    if (obj instanceof Array) {
      let json = {};
      for (let i in obj) {
        let Id = obj[i][key];
        if (!json[Id]) {
          json[Id] = obj[i];
        }else{
          if (json[Id] instanceof Array){
            json[Id].push(obj[i]);
          }else{
            let temData = json[Id];
            json[Id] = {
              temData,
              ...obj[i]
            }
          }
        }
      }
      return json;
    }
    return obj
  }
  getStrByKey(obj,key){
    if(!obj) return "";
    let keys = "";
    if (obj instanceof Array && obj.length > 0){
      for (let i = 0; i < obj.length; i++){
        keys = keys ?  keys + "," + obj[i][key] : obj[i][key]
      }
    }else{
      for (let i in obj){
        keys = keys ? keys + "," + obj[i][key] : obj[i][key]
      }
    }
    return keys;
  }
  numberCarryBit(num=0){ //万进制
    num = parseFloat(num);
    if(isNaN(num))return "";
    num = (num/10000) >= 1? parseFloat((num/10000).toFixed(2)) + "万" : num
    return num
  }
}


export default StrManager.getInstance();