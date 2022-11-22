import StringUtil from "@/helper/utils/string-util.js";
export default {
  methods: {
    checkValidTime(rule, value, callback) {
      const {
        field
      } = rule;
      if(field.type == 'Array'){
        if(value instanceof Array && value.length > 0 && value[0]) {
          callback();
        } else {
          callback(new Error(field.message || '请选择时间'));
        }
      } else {
        value ? callback() : callback(new Error(field.message || '请选择时间'));
      }
    },
    _checkBeforeTime(rule, value, callback) {
      const {
        field
      } = rule;
        if(!value){
          callback(field.message || '请选择时间')
        }else if(!_checkBeforeTimeHandle(value)){
          callback(field.message || '时间不能大于当前时间');
        } else {
          callback();
        }
    },
    _checkAfterTime(rule, value, callback) {
      const {
        field
      } = rule;
      if(!value){
        callback(field.message || '请选择时间')
      }else if(!_checkAfterTimeHandle(value)){
        callback(field.message || '时间不能小于当前时间');
      } else {
        callback();
      }
    },
    _checkPhone(rule, value, callback){
      const {
        field
      } = rule;
      if(!value){
        callback(new Error('手机号不能为空'))
      } else if(!/^1[123456789]\d{9}$/.test(value)){
        callback(new Error('手机号格式不正确'))
      } else {
        callback();
      }
    },
    _checkString(rule, value, callback){
      const {
        field
      } = rule;
      if(StringUtil.trim(value || '')){
        callback();
      } else {
        callback(new Error(field.message || '值不能为空'));
      }
    },
    _checkArray(rule, value, callback){
      const {
        field
      } = rule;
      if(value.length > 0 && (value[0] || value[0] == 0)){
        callback();
      } else {
        callback(new Error(field.message || '值不能为空'));
      }
    },
    _checkInt(rule, value, callback){
      const {
        field
      } = rule;
      if(Number(value) || value == '0'){
        callback();
      } else {
        callback(new Error(field.message || '请输入正确的值'));
      }
    },
    _checkThanInt(rule, value, callback){
      const {
        field
      } = rule;
      if(Number(value) > 0){
        callback();
      } else {
        callback(new Error(field.message || '请输入正确的值'));
      }
    },
    _checkNativeInt(rule, value, callback){
      const {
        field
      } = rule;
      if(Number(value) > -1){
        callback();
      } else {
        callback(new Error(field.message || '请输入正确的值'));
      }
    },
    _checkNumber(rule, value, callback){ // 检测是否为数字，可以负数，0，正数
      const {
        field
      } = rule;
      if(!isNaN(parseFloat(value))){
        callback();
      } else {
        callback(new Error(field.message || '请输入正确的值'));
      }
    },
    _resetField(formRef, props, formModel){ // 检测重置 formRef， props为数组，需要重置的prop, formModel:form数据对象
      if(this.$refs[formRef]){
        if(props instanceof Array && props.length > 0){
          this.$refs[formRef].fields.forEach(function(e){
            if (props.indexOf(e.prop) !== -1) {
              // 没有对象传入，直接重置验证
              if(!formModel){
                e.resetField();
                return;
              }
              let prop = e.prop;
              if(prop.indexOf('.') != -1){ // 传入对象，且字段为多层级
                let propArr = prop.split(".");
                let getObjVal = formModel;
                try {
                  for(let i = 0; i < propArr.length; i++){
                    getObjVal = getObjVal[propArr[i]];
                  }
                  if(!getObjVal){ e.resetField() }
                } catch (error) {}
                
              } else {
                if(!formModel[prop]){
                  e.resetField()
                }
              }
            }
          });
        } else {
          this.$refs[formName].resetFields();
        }
      } 
    },
    _getFormVal(key){

    }
  }
}

// 
function _checkAfterTimeHandle(value){
  if(value){
   return new Date(value).valueOf() > new Date().valueOf()
  }
}
// 
function _checkBeforeTimeHandle(value){
  if(value){
   return new Date(value).valueOf() < new Date().valueOf()
  }
}