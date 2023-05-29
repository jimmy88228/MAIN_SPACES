<template>
  <view class="ori-image">
    <image :class="['image',showImg?'opa-100':'opa-0']" :style="customStyle" :src="src" :mode="mode"
      :lazy-load="lazyLoad" :webp="webp" show-menu-by-longpress="" @error="error" @load="load" />
      <view v-show="showLoading" :class="['image-loading',showImg?'opa-0':'opa-100']" :style="customStyle"></view>
  </view>
</template>

<script>
  const pageOption = Page.BaseComp({
    props: {
      customStyle: {
        type: String,
        default: "",
      },
      src: {
        type: String,
        default: "",
      },
      mode: {
        type: String,
        default: "scaleToFill",
      },
      lazyLoad: {
        type: Boolean,
        default: false,
      },
      webp: {
        type: Boolean,
        default: false,
      },
      showMenuByLongpress: {
        type: Boolean,
        default: false,
      },
      showLoading:{
        type:Boolean,
        default:true
      }
    },
    data() {
      return {
        showImg: false
      }
    },
    methods: {
      error(e) {
        this.$emit("error", e)
      },
      load(e) {
        this.showImg = true;
        this.$emit("load", e)
      },
    },
  })
  export default pageOption
</script>

<style scoped lang="scss">
  .ori-image {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .image {
    width: 100%;
    height: 100%;
    transition: opacity 0.4s;
  }
  .image-loading{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($color: #8f8f8f, $alpha: 0.1);
    transition: opacity 0.4s;
  }
</style>