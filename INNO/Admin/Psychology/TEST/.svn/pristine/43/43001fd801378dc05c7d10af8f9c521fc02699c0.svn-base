<template>
  <div class="user-header-area">
    <div class="flex-s-c user-header-cont">
      <div class="user-header"></div>
      <div class="user-name bold">XXX的家长</div>
      <p class="user-change">
        <Icon type="md-swap" />&nbsp;
        <span class="w-nowrap">切换绑定</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "userCenterHeader",
  props: {
    compInfo: {
      type: Object,
      default:()=>{}
    }, 
  },
  computed: {
    newCompInfo() {
      // 转换一层，避免watch浅拷贝
      return JSON.parse(JSON.stringify(this.compInfo)) || {};
    },
  },
  data(){
    return {

    }
  }
}
</script>

<style lang="less" scoped>
.user-header-area{
  width:100%;
  padding: 89px 0px 30px 27px;
  .user-header-cont{
    position:relative;
    .user-header{
      width:60px;
      height:60px;
      display: block;
      background-color:#efefef;
      border-radius: 100%;
      margin-right:16px;
    }
    .user-name{
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #222222;
    }
    .user-change{
      display: block;
      position: absolute;
      top:50%;
      right:0px;
      transform: translateY(-50%);
      height:25px;
      display: flex;
      align-items: center;
      padding-left: 10px;
      padding-right:5px;
      font-size:12px;
      background: #ED9712;
      border-radius: 25px 0 0 25px;
      line-height: 25px;
      color:#fff;
    }
  }
  
}
</style>