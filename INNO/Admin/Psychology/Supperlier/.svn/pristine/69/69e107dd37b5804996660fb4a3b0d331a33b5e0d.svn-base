<template>
  <div class="time-item flex-c-c" :class="{ 'full-booked': fullBooked, 'selected': selected }" @click="selectItem">
    <template v-if="!fullBooked && !stateLess">
      <Icon class="time-item-cancel" type="md-close" v-if="isView" @click="cancelItem"/>
      <div class="item-radio" v-else >
        <span class="item-radio-inner "></span>
      </div>
    </template>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fullBooked: Boolean, // 预约满期
    isView: Boolean, // 是否展示
    selected: Boolean, // 选中状态
    stateLess: Boolean // 无状态
  },
  data(){
    return {}
  },
  methods: {
    selectItem(){
      if(this.fullBooked || this.stateLess){
        return;
      }
      this.$emit("select")
    },
    cancelItem(){
      this.$emit("cancel")
    }
  }
}
</script>

<style lang="less" scoped>
.time-item{
  width: 77px;
  height: 80px;
  background: #FFFFFF;
  border: 1px solid #B2B2B2;
  text-align: center;
  margin-right: 5px;
  margin-bottom: 5px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 18px;
  cursor: pointer;
  position: relative;
  border-radius: 2px;
}
.time-item.selected{
  border-color: #049ED1;
  color: #049ED1;
  background-color: #EAFAFF;
}
.time-item-cancel{
  position: absolute;
  top: 0px;
  right: 0px;
  color:#000;
  background-color: #F5F5F5;
}
.time-item.full-booked{
  color: #B2B2B2;
  background-color: #FFFFFF;
  border-color:#B2B2B2;
  cursor: not-allowed;
}
.time-item.full-booked:after{
  position: absolute;
  top: -1px;
  left: -1px;
  content: "约满";
  color: #B2B2B2;
  padding: 2px 0px;
  border: 1px solid #B2B2B2;
  writing-mode: vertical-lr;
  background-color: #F7F7F7;
  font-size: 12px;
  transform-origin: 0 50%;
  transform: scaleX(0.8);
}
.item-radio{
  position:absolute;
  top: 3px;
  right: 3px;
}
.item-radio-inner{
  display: block;
  width: 15px;
  height: 15px;
  background-color: #fff;
  border: 1px solid #B2B2B2;
  border-radius: 100%;
  position:relative;
}
.selected .item-radio-inner{
  background: #049ED1;
  border-color: #049ED1;
}
.selected .item-radio-inner:after{
  content: "";
  border: 2px solid #fff;
  width: 40%;
  height: 60%;
  position: absolute;
  top: 45%;
  left: 50%;
  border-top: none;
  border-left: none;
  transform: translate(-50%, -50%) rotate(45deg);
}
</style>