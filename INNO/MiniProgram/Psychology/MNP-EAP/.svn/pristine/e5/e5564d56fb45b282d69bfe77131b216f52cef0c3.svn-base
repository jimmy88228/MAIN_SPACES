<template>
  <image :class="['full-screen-img',bgHeight ?'opacity-1':'transparent']" :lazy-load="lazyLoad" :src="src" @error="error" @load="getBgSize"
    :style="{height:bgHeight,width:bgWidth}"></image>
</template>

<script>
  import utils from '@/common/support/utils.js'

  const pageOption = Page.BaseComp({
    name: "full-screen-img",
    props: {
      src: {
        type: String,
        default: ""
      },
      lazyLoad:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        bgWidth: 0,
        bgHeight: 0
      }
    },
    methods: {
      getBgSize({
        detail
      }) {
        let width = detail.width;
        let height = detail.height;
        utils.getBgSize(width, height).then(res => {
          this.bgWidth = res.imgW + "px"
          this.bgHeight = res.imgH + "px"
        })
        this.$emit("load",detail)
      },
      error(e){
        this.$emit("error",e)
      }
    },
  })
  export default pageOption
</script>

<style lang="scss" scoped>
  .full-screen-img {
    transition: opacity 0.3s;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
  }

  .opacity-1 {
    opacity: 1;
  }

  .transparent {
    opacity: 0;
  }
</style>