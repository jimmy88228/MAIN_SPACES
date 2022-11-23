<template>
  <view>
    <web-view :src="targetUrl"></web-view>
  </view>
</template>

<script>
  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        targetUrl:''
      };
    },
    onLoad(options){
      this.targetUrl = decodeURIComponent(options.url)
    },
    components: {

    },
    onReady() {

    },
    methods: {

    },
    onUnload() {},
    onShow() {},
  });
  export default pageOption;
</script>

<style lang="scss" scoped>

</style>