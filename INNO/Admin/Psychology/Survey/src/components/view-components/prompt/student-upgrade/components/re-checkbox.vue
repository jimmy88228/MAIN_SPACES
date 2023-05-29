<template>
  <label class="re-checkbox-wrapper" @click="changeCheckbox">
    <span class="re-checkbox" :class="setClass()">
      <span class="re-checkbox-inner"></span>
    </span>
    <slot></slot>
  </label>
</template>

<script>
export default {
  model: {
      prop: "value",
      event: "on-change",
  },
  props: {
    checkRadio: Number,
    value: Number | Boolean,
    valuesKey: {
      type: Array,
      default(){
        return [0, 1, 2];
      }
    },
    disabled: Boolean,
    disabledTip: String
  },
  data(){
    return {
      checkValue: false,
      valuesState: ["", "re-checkbox-checked", "re-checkbox-indeterminate"],
      checkClass: ""
    }
  },
  methods: {
    setClass(){
      let value = this.checkValue || 0;
      let index = this.valuesKey.indexOf(value);
      if(index == -1){
        return "";
      }
      return this.valuesState[index];
    },
    changeCheckbox(){
      if(this.disabled){
        this.disabledTip && this.$Message.warning(this.disabledTip);
        this.$emit("on-disabled");
        return;
      }
      let valuesKey = this.valuesKey;
      if(this.checkValue != valuesKey[1]){
        this.checkValue = this.valuesKey[1];
        this.$emit("on-change", this.checkValue);
      } else {
        this.checkValue = this.valuesKey[0];
        this.$emit("on-change", this.checkValue);
      }
    }
  },
  watch:{
    value:{
      handler(nV){
        // console.log("")
        this.checkValue = nV;
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.re-checkbox-wrapper{
  display: inline-flex;
  vertical-align: middle;
  white-space: nowrap;
  cursor: pointer;
  line-height: 1;
  position: relative;
  margin-right: 5px;
}
.re-checkbox{
  display: inline-flex;
  margin-right: 4px;
  white-space: nowrap;
  position: relative;
  line-height: 1;
  vertical-align: middle;
  cursor: pointer;
  margin-right: 5px;
}
.re-checkbox-inner{
  display: inline-block;
  width: 16px;
  height: 16px;
  position: relative;
  top: 0;
  left: 0;
  border: 1px solid #dcdee2;
  border-radius: 2px;
  background-color: #fff;
  transition: border-color .2s ease-in-out,background-color .2s ease-in-out,box-shadow .2s ease-in-out;
}
.re-checkbox-checked{
  .re-checkbox-inner{
    border-color: #2d8cf0;
    background-color: #2d8cf0;
  }
  .re-checkbox-inner:after{
    content: "";
    display: table;
    width: 4px;
    height: 8px;
    position: absolute;
    top: 2px;
    left: 5px;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg) scale(1);
    transition: all .2s ease-in-out;
  }
}
.re-checkbox-indeterminate{
  .re-checkbox-inner{
    border-color: #2d8cf0;
    background-color: #2d8cf0;
  }
  .re-checkbox-inner:after{
      content: "";
      width: 60%;
      height: 2px;
      transform: translate(-50%, -50%) scale(1);
      position: absolute;
      left: 50%;
      top: 50%;
  }
}
 
</style>