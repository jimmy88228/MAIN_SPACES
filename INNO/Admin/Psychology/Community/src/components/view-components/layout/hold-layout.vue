<template>
  <div class="hold-layout" :class="{'full-height-layout':isFullHeight || isFull}" :style="layoutCustomStyle">
    <div class="hold-layout-content" :style="layoutContentCustomStyle" :class="{ 'full-height' : isFullHeight || isFull }">
      <slot></slot>
    </div>
    <div class="hold-layout-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "holdLayout",
  props: {
    'layout-custom-style':{
      type:String,
      default:''
    },
    'layout-content-custom-style':{
      type:String,
      default:''
    },
    'isFullHeight':{
      type:Boolean,
      default:false
    },
    'isFull':{
      type:Boolean,
      default:false
    },
  }
}
</script>

<style lang="less" scoped>
.hold-layout{
  width:100%;
  min-height: calc(100%);
  display: flex;
  flex-direction: column;
  &.full-height-layout{
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: calc(100%);
  }
  .hold-layout-content{
    flex: 1;
    overflow: hidden;
  }
  .full-height{
    display: flex;
    flex-direction: column;
    // height:100%;
    // min-height: calc(100%);
  }
  .hold-layout-footer{
    position: sticky;
    bottom: 0px;
  }
}
</style>