<template>
  <scroll-view
    class="scroll-view"
    :style="customStyle"
    :scroll-x="!scrollY"
    :scroll-y="scrollY"
    :refresher-enabled="refresh"
    :refresher-triggered="refreshTriggered"
    :show-scrollbar="true"
    @scrolltolower="scrolltolower"
    @refresherrefresh="refresherrefresh"
  >
    <slot></slot>
  </scroll-view>
</template>

<script>
const app = getApp();
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
    refreshAutoClose:{
      type:Boolean,
      default:true
    },
    showScrollbar:{
      type:Boolean,
      default:true
    },
  },
  data() {
    return {
      refreshTimer:null,
      refreshAutoCloseTimer:null,
      refreshTriggered:false, 
    }
  },
  methods: {
    scrolltolower(){
      this.$emit('scrolltolower');
    },
    refresherrefresh(){
      clearTimeout(this.refreshTimer);
      clearTimeout(this.refreshAutoCloseTimer);
      this.refreshTimer = setTimeout(() => {
        this.$emit('refresherrefresh'); 
        this.refreshAutoClose && (this.refreshAutoCloseTimer = setTimeout(() => {
          this.refreshEnd(false);
        }, 300));
      }, 300);
    },
    refreshEnd(isShowTip=true){
      this.refreshShow();
      isShowTip && app.SMH.showToast({
        title: '已刷新',
      })
      setTimeout(()=>{
        this.refreshTriggered = false;
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