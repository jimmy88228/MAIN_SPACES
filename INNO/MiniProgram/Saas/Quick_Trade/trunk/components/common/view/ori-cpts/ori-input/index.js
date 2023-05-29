const App = getApp();
import validHelper from "./valid-helper.js";
import ValidHelper from "./valid-helper.js"
Component(App.BC({ 
  externalClasses: ['ext-class','ext-placeholder-class'],
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    placeholder:{
        type:String,
        value:"请输入"
    },
    value:{
      type:String | Number,
      value:""
    },
    maxlength:{
      type:Number,
      value:"-1"
    },
    type:{
        type:String,
        value:"text"
    },
    errTip:{
      type:String,
      value:"输入的内容"
    },
    isShowErr:{
      type:Boolean,
      value:true
    },
    alwaysEmbed:{
      type:Boolean,
      value:true
    },
    cursorSpacing:{
      type:Number,
      value:20
    },
    key:String,
    password:Boolean,
    disabled:Boolean,
    setFocus:Boolean,
    setBlur:Boolean,
    validArray:Array,
  },
  data: {
  },
  ready(){ 
  },
  methods: {
    onInput(e) {
      let value = e.detail.value; 
      value = value.trim();
      this.setData({value});
      this.triggerEvent('input', {value});
    },
    getValue() {
      return this.data.value;
    },
    setValue(value) { 
      value = value.trim();
      this.setData({
        value
      })
    },
    onFocus(e) {
      this.triggerEvent('focus',e,{ 
        bubbles:true,
        composed:true,
        capturePhase:true,
      });
    },
    onBlur(e) {
      this.triggerEvent('blur',e,{
        bubbles:true,
        composed:true,
        capturePhase:true,
      },);
    },
    onTap() {
      this.triggerEvent('tap');
    },
    checkValid(index,isShowError){
      return new Promise((rs,rj)=>{
        let validArray = this.properties.validArray||[];
        if(validArray.length>0){
          let ruleArr = [];
          validArray.forEach(item=>{
            if(ValidHelper[item] && typeof(ValidHelper[item]) == 'function'){
              ruleArr.push(ValidHelper[item](this.data.value));
            }
          })
          if(this.properties.type == 'digit'){
            ruleArr.push(validHelper.NUMBER_VALID(this.data.value,2))
          }
          Promise.all(ruleArr).then(list=>{
            let inValid = "";
            for(let i = 0,len=list.length;i<len;i++){
              let res = list[i];
              if(res.code != 1){  
                inValid = (this.properties.errTip + res.msg);
                break;
              }
            }
            isShowError && inValid && this.showErrorAnim(inValid,index); 
            return inValid ? rj({err:inValid,index,key:"checkValid"}) : rs()
          })
        }else{
          return rs();
        }
      })
    },
    showErrorAnim(){
      wx.MyAnims.error(this,'.ori-input');
    },
  }
}))