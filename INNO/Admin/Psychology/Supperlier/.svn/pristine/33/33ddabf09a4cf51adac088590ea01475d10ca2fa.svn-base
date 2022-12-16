<template>
  <div class="day-item" :class="selectClass()" @click="clickItem">
    <div>
      <div class="item-radio" v-if="isBatch">
        <span class="item-radio-inner "></span>
      </div>
      <div>
        <slot></slot>
      </div>
      <span class="has-data" v-if="hasData"></span>
    </div>
</div>
</template>

<script>

export default {
  props: {
    selected: Boolean,
    isBatch: Boolean,
    hasData: Boolean
  },
  data(){
    return {}
  },
  methods: {
    selectClass(){
      if(this.selected){
        return this.isBatch ? 'batcht-selected' : 'single-selected'
      }
    },
    clickItem(){
      this.$emit("clickItem");
    }
  }
}
</script>

<style lang="less" scoped>
.day-item{
  text-align: center;
  width: 80px;
  height: 80px;
  background: #FFFFFF;
  border: 1px solid #B2B2B2;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #7F7F7F;
  line-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: -1px;
  margin-top: -1px;
  position: relative;
  border-radius: 2px;
  z-index: 1;
}
.day-item:hover{
  z-index: 2;
  border-color: #049ED1;
  color: #049ED1;
  background-color: #EAFAFF;
}
.single-selected{
  z-index: 2;
  border-color: #049ED1;
  color: #049ED1;
  background-color: #EAFAFF;
}
.item-radio-inner{
  margin: 3px auto;
  display: block;
  width: 15px;
  height: 15px;
  background-color: #fff;
  border: 1px solid #B2B2B2;
  border-radius: 100%;
  position:relative;
}
.batcht-selected .item-radio-inner{
  background: #049ED1;
  border-color: #049ED1;
}
.batcht-selected .item-radio-inner:after{
  content: "";
  border: 2px solid #fff;
  width: 40%;
  height: 60%;
  position: absolute;
  top: 48%;
  left: 55%;
  border-top: none;
  border-left: none;
  transform: translate(-50%, -50%) rotate(45deg);
}
.has-data{
  width: 35%;
  height: 2px;
  background-color:#CCD6EA;
  position: absolute;
  left: 50%;
  bottom: 5px;
  transform: translateX(-50%);
}
</style>