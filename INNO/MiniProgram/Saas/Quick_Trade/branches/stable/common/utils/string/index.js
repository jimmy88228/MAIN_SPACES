export default {
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
  getUrlParam(url,returnPureUrl){
    if(!url){
      return {}
    }
    url = decodeURIComponent(url);
    let pureUrl = url.split("?")[0] || ""; 
    let paramsStr = url.split("?")[1] || "";
    let singlePArr = paramsStr.split("&");
    let params = {}
    for (let i = 0; i < singlePArr.length; i++){
      let itemParam = singlePArr[i].split("=");
      params[itemParam[0]] = itemParam[1]
    }
    if (returnPureUrl){
      return {
        path: pureUrl,
        params
      }
    }else{
      return params || {};
    }
  },
  _toFixed(data,digits=2){
    return Number(Number(data).toFixed(digits));
  }
}
