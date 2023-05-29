import StringUtils from "../../../../../common/utils/string/index.js"
const ERR_KEY_FRAMES = [ 
  { translateX: 0, backgroundColor: 'rgba(0, 0, 0, 0)' },
  { translateX: -4, backgroundColor: 'rgba(0, 0, 0, 0.04)' },
  { translateX: 3, backgroundColor: 'rgba(0, 0, 0, 0.08)' },
  { translateX: -4, backgroundColor: 'rgba(0, 0, 0, 0.1)' },
  { translateX: 3, backgroundColor: 'rgba(0, 0, 0, 0.08)' }, 
  { translateX: -3, backgroundColor: 'rgba(0, 0, 0, 0.04)' },
  { translateX: 3, backgroundColor: 'rgba(0, 0, 0, 0.02)' }, 
  { translateX: 0, backgroundColor: '' },
]
const NOT_EMPTY = (value)=>{
  return new Promise((rs)=>{
    if(!value && value !== 0){
      return rs(MsgError("不能为空"));
    }
    return rs(MsgSucc(value));
  })
}
const NUMBER_PLUS = (value)=>{
  return new Promise((rs)=>{
    if(value < 0 || checkInvalid(value)){
      return rs(MsgError("必须大于等于0"));
    }
    return rs(MsgSucc(value));
  })
}
const NUMBER_LG_0 = (value)=>{
  return new Promise((rs)=>{
    if(value <= 0 || checkInvalid(value)){
      return rs(MsgError("必须大于0"));
    }
    return rs(MsgSucc(value));
  })
}
const NUMBER_MAX_6 = (value)=>{
  return new Promise((rs)=>{
    if(value > 999999){
      return rs(MsgError("不能超过6位数"));
    }
    return rs(MsgSucc(value));
  })
}

const NUMBER_VALID = (value,limit)=>{
  return new Promise((rs)=>{
    if(!StringUtils.checkValidNumber(value,limit||2)){
      return rs(MsgError("输入不合法"));
    }
    return rs(MsgSucc(value));
  })
}
export default {
  ERR_KEY_FRAMES,
  NOT_EMPTY,
  NUMBER_PLUS,
  NUMBER_LG_0,
  NUMBER_MAX_6,
  NUMBER_VALID
}
function MsgSucc(data,code=1){
  return {code,data}
}
function MsgError(msg,code=-1){
  return {code,msg}
}
function checkInvalid(value){
  if(value === '' || value === null || value === undefined || value === NaN){
    return true;
  }
  return false;
}