const App = getApp();
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
    onFocus() {
      this.triggerEvent('focus');
    },
    onBlur() {
      this.triggerEvent('blur');
    },
    onTap() {
      this.triggerEvent('tap');
    },
    checkValid(){
      return new Promise((rs,rj)=>{
        let validArray = this.properties.validArray||[];
        if(validArray.length>0){
          let arr = [];
          validArray.forEach(item=>{
            if(ValidHelper[item] && typeof(ValidHelper[item]) == 'function'){
              arr.push(ValidHelper[item](this.data.value));
            }
          })
          Promise.all(arr).then(list=>{
            let inValid = "";
            for(let i = 0,len=list.length;i<len;i++){
              let res = list[i];
              if(res.code != 1){  
                inValid = (this.properties.errTip + res.msg);
                break;
              }
            }
            inValid && this.showError(inValid); 
            return inValid ? rj(inValid) : rs()
          })
        }else{
          return rs();
        }
      })
    },
    showError(msg){
      // console.log('showError',msg);
      if(this.animateShowing)return
      this.animateShowing = true;
      this.animate('.ori-input',ValidHelper.ERR_KEY_FRAMES,250,() => {
        this.clearAnimation('.ori-input', { backgroundColor: true, translate: true }); 
        this.animateShowing = false;
      })
    },
  }
}))