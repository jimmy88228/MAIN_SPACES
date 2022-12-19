<template>
  <view class="ori-swiper">
    <swiper 
      class="swiper" 
      :autoplay="autoplay" 
      :interval="interval" 
      :duration="duration"
      :circular="circular"
      :current="current"
      :vertical="vertical"
      :disable-touch="disable-touch"
      :easing-function="easing-func"
      :previous-margin="previous-margin"
      :next-margin="next-margin"
      :indicator-dots="indicator-dots" 
      :indicator-color="indicator-color" 
      :indicator-active-color="indicator-active-color"
      :display-multiple-items="display-multiple-items"
      >
      <swiper-item v-for="(item,index) in list" :key="index">
        <slot></slot>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
  const pageOption = Page.BaseComp({
    props: { 
      'list':{
        type:Array,
        default:function (){
          return []
        }
      },
      'current': {
        type: Number,
        default: 0
      }, 
      'autoplay': {
        type: Boolean,
        default: false
      },
      'circular': {
        type: Boolean,
        default: false
      },
      'vertical': {
        type: Boolean,
        default: false
      }, 
      'interval': {
        type: Number,
        default: 5000
      },
      'duration': {
        type: Number,
        default: 500
      }, 
      'display-multiple-items': {
        type: Number,
        default: 1
      },
      'indicator-dots': {
        type: Boolean,
        default: false
      },
      'indicator-color': {
        type: String,
        default: 'rgba(0, 0, 0, .3)'
      },
      'indicator-active-color': {
        type: String,
        default: '#000000'
      },
      'previous-margin': {
        type: String,
        default: '0px'
      },
      'next-margin': {
        type: String,
        default: '0px'
      }, 
      'easing-func': {
        type: String,
        default: 'default'
      }, 
      'disable-touch': {
        type: Boolean,
        default: false
      },
    },
  })
  export default pageOption
</script>

<style lang="scss" scoped>
.ori-swiper{
  .swiper{
    width: 100%;
    height: 100vh;
  }
}
</style>