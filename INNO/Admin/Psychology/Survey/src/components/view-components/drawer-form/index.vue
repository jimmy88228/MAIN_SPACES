<template>
  <div class="form" :style="layoutCustomStyle">
    <div class="title" :style="layoutTitleCustomStyle">
      <slot name="title"></slot>
    </div>
    <div class="content" :style="layoutContentCustomStyle">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
  export default {
  name: "drawerForm",
  props: {
    'layout-custom-style':{
      type:String,
      default:''
    },
    'layout-title-custom-style':{
      type:String,
      default:''
    },
    'layout-content-custom-style':{
      type:String,
      default:''
    }
  }
}
</script>

<style lang="less" scoped>
  .form {
    border: 2px solid #F2F2F2;
    margin-top: -2px;
  }

  .title {
    background: rgba(216, 216, 216, 0.11);
    border-bottom: 2px solid #F2F2F2;
    padding: 12px 22px;
    font-weight: 600;
    color: #171717;
    line-height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
  }
  .content{
    padding: 28px;
  }
</style>