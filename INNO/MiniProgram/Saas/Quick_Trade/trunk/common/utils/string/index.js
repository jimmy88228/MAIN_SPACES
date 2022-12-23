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
  }
}
