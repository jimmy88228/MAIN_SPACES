<template>
  <view class="input-area">
    <input
      class="input-elem"
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
      @focus="onFocus"
      @input="onInput"
      @blur="onBlur"
      @confirm="onConfirm" 
      />

  </view>
</template>

<script>
const pageOption = Page.BaseComp({
  props: {
    value: {
      type: String|Number,
      default: ''
    },
    boxStyle: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
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
    }
  },
  
  methods: {
    onFocus(e) {
      this.$emit('onFocus',e);
    },
    onInput(e) {
      this.inputValue = e.detail.value;  
      this.$emit('onInput',e);
    },
    onBlur(e) {
      this.$emit('onBlur',e);
    },
    onConfirm(e) {
      this.$emit('onConfirm',e);
    },
  },
  watch:{
    value:{
      handler(nV){
        this.inputValue = nV;
      },
      immediate:true
    }
  }
})
export default pageOption
</script>

<style scoped lang="scss">
.input-area{
  height: 100%;
  .input-elem{
    
  }
}
</style>