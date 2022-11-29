export default {
  methods: {
    checkValidTime(rule, value, callback) {
      const {
        field
      } = rule;
      if(field.type == 'Array'){
        if(value instanceof Array && value.length > 0 ) {
          callback(field.message || '请选择有效时间');
        } else {
          callback();
        }
      } else {
        value ? callback() : callback(field.message || '请选择有效时间');
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
      if(value){
        callback();
      } else {
        callback(field.message || '值不能为空');
      }
    },
    _checkEmptyArray(rule, value, callback){
      const {
        field
      } = rule;
      if(value.length > 0 && value[0]){
        callback();
      } else {
        callback(field.message || '值不能为空');
      }
    },
    _checkArray(rule, value, callback){
      const {
        field
      } = rule;
      if(value.length > 0 && (value[0] || value[0] == 0)){
        callback();
      } else {
        callback(field.message || '值不能为空');
      }
    },
    _checkPureArray(rule, value, callback){
      const {
        field
      } = rule;
      if(value.length > 0){
        callback();
      } else {
        callback(field.message || '值不能为空');
      }
    },
    _checkInt(rule, value, callback){
      const {
        field
      } = rule;
      if(Number(value) || Number(value) == 0){
        callback();
      } else {
        callback(field.message || '请输入正确的值');
      }
    },
    _checkThanInt(rule, value, callback){
      const {
        field
      } = rule;
      if(Number(value) > 0){
        callback();
      } else {
        callback(field.message || '请输入正确的值');
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
  }
}