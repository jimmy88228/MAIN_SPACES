<template>
  <view class="loading-box">
    <view v-show="showAnim && isShowLoadAnim">
      <view class="box flex-c-c">
        <loading-view></loading-view>
      </view>
    </view>
    <view v-show="!showAnim">
      <view class="content-box" :class="[showContent?'showContent':'']">
        <slot></slot>
      </view>
    </view>   
  </view>
</template>

<script>
  import LoadingView from '@/components/css3/loading/loading.vue';
  export default Page.BaseComp({
    components: {
      LoadingView,
    },
    props: {
      showPage: {
        type: Boolean,
        default: false
      },
      isShowLoadAnim: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        showAnim:true,
        showContent:false,
      }
    },
    watch: {
      showPage(nV) {
        if(nV){
          if(this.isShowLoadAnim){
            setTimeout(() => {
              this.showAnim = false;
              setTimeout(() => {
                this.showContent = true;
              }, 50);
            }, 700);
          }else{
            this.showAnim = false;
            setTimeout(() => {
              this.showContent = true;
            }, 50);
          }
        }
      }
    },
  })
</script>

<style lang="scss" scoped>

.loading-box{
  .box{
    width: 100%;
    position: relative;
    height: 100vh;
  }
  .content-box{
    opacity: 0;
    transition: opacity 0.25s;
  }
  .showContent{
    opacity:1;
  }
}
</style>