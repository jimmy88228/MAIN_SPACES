<template>
  <view :class="['animate-custom',animationClass]" :style="{'animation-delay':`${animationDelay}s`,'animation-duration':`${animationDuration}s`}">
      <slot name="content"></slot>
  </view>
</template>

<script>
  export default Page.BaseComp({
    props: {
      animationDelay: {
        type: Number,
        default: 0
      },
      animationDuration:{
        type:Number,
        default: 0.6
      },
      animationClass:{
        type:String,
        default:"animate-fade-in-top"
      }
    },
    data() {
      return {

      }
    }
  })
</script>

<style lang="scss" scoped>
  @import "./animate.scss";
  .animate-custom{
    width: 100%;
    opacity: 0;
  }
</style>