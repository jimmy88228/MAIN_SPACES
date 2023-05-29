<template>
  <scroll-view
    class="scroll-view"
    :style="customStyle"
    :scroll-x="!scrollY"
    :scroll-y="scrollY"
    :refresher-enabled="refresh"
    :refresher-triggered="refreshTriggered"
    @scrolltolower="scrolltolower"
    @refresherrefresh="refresherrefresh"
  >
    <slot></slot>
  </scroll-view>
</template>

<script>
export default {
  props: {
    refresh:{
      type:Boolean,
      default:true,
    }, 
    scrollY:{
      type:Boolean,
      default:true,
    }, 
    customStyle:{
      type:String,
      default:"",
    }, 
  },
  data() {
    return {
      refreshTimer:null,
      refreshTriggered:false, 
    }
  },
  methods: {
    scrolltolower(){
      this.$emit('scrolltolower');
    },
    refresherrefresh(){
      clearTimeout(this.refreshTimer);
      this.refreshTimer = setTimeout(() => {
        this.$emit('refresherrefresh');
      }, 300);
    },
    refreshEnd(){
      this.refreshShow();
      uni.showToast({
        title: '已刷新',
      })
      console.log('refreshTriggered',this.refreshTriggered);
      setTimeout(()=>{
        this.refreshTriggered = false;
        console.log('refreshTriggered',this.refreshTriggered);
      },200)
    },
    refreshShow(){
      this.refreshTriggered = true;
    },
  },
};
</script>

<style lang="scss" scoped> 
.scroll_box {
  box-sizing: border-box;
}
.scroll-view{
  height: 100%;
}
</style>