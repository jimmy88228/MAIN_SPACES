<template>
  <view class="textarea-out">
    <textarea
      :type="type"  
      :value="inputValue"
      :password="password"
      :placeholder="placeholder"
      :placeholder-style="placeholderStyle"
      :placeholder-class="placeholderClass"
      :disabled="disabled"
      :maxlength="maxlength"
      :focus="focus"
      :confirm-type="confirmType"
      :style="boxStyle"
      :auto-height="autoHeight"
      class="textarea"
      @focus="onFocus"
      @input="onInput"
      @blur="onBlur"
      @confirm="onConfirm" 
      />
      <view v-if="customPlaceholder && inputValue.length <= 0 && !focusInput" class="custom-placeholder" :style="customPlaceholderStyle">{{customPlaceholder}}</view>
  </view>
</template>

<script>
const pageOption = Page.BaseComp({
  props: {
    value: {
      type: String|Number,
      default: ''
    },
    autoHeight:{
      type:Boolean,
      default:false
    },
    boxStyle: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    customPlaceholder:{
      type:String,
      default:""
    },
    customPlaceholderStyle:{
      type:String,
      default:""
    },
    placeholder: {
      type: String,
      default: ''
    },
    placeholderStyle: {
      type: String,
      default: ''
    },
    placeholderClass: {
      type: String,
      default: ''
    },
    maxlength: {
      type: Number,
      default: 140
    },
    'confirm-type': {
      type: String,
      default: ''
    },
    password:{
      type:Boolean,
      default:function(){
        return false
      }
    },
    focus:{
      type:Boolean,
      default:function(){
        return false
      }
    },
    disabled:{
      type:Boolean,
      default:function(){
        return false
      }
    },
  },
  data() {
    return {
      inputValue: "",
      focusInput:false
    }
  },
  methods: {
    onFocus(e) {
      if(this.customPlaceholder){
        this.focusInput = true;
      }
      this.$emit('onFocus',e);
    },
    onInput(e) {
      this.inputValue = e.detail.value;  
      this.$emit('onInput',e);
    },
    onBlur(e) {
      if(this.customPlaceholder){
        this.focusInput = false;
      }
      this.$emit('onBlur',e);
    },
    onConfirm(e) {
      this.$emit('onConfirm',e);
    },
    reset(){
      this.inputValue = "";
    },
  },
  watch:{
    value:{
      handler(nV){
        nV && (this.inputValue = nV);
      },
      immediate:true
    }
  }
})
export default pageOption
</script>

<style scoped lang="scss">
.textarea-out{
  position: relative;
  width: 100%;
  height: 100%;
}
.custom-placeholder{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 20rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #B2B2B2;
}
.textarea{
  width: 100%;
  height: 100%;
}
</style>