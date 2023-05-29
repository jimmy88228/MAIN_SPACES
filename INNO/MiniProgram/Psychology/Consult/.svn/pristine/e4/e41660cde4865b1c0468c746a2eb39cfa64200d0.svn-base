<template>
  <view
    class="safe-area"
    :class="[areaType, position]"
    :style="boxStyle + safeAreaStyle"
  >
    <slot></slot>
  </view>
</template>

<script>
const app = getApp();
const pageOption = Page.BaseComp({
  props: {
    areaType: {
      type: String,
      default: "",
    },
    extra: {
      type: Number,
      default: 0,
    },
    boxStyle: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      safeArea: app.SIH.safeAreaInsets,
      safeAreaStyle: "",
    };
  },
  watch: {
    areaType: {
      handler(nV) {
        if (nV == "bottom") {
        this.safeAreaStyle = `bottom:calc(${this.safeArea.bottom + 'px + ' + this.extra + 'rpx'});`;
        }
        if (nV == "top") {
          this.safeAreaStyle = `top:calc(${this.safeArea.bottom + 'px + ' + this.extra + 'rpx'});`;
        }
        if (nV == "paddingBottom") {
          this.safeAreaStyle = `padding-bottom:calc(${this.safeArea.bottom + 'px + ' + this.extra + 'rpx'});`;
        }
        console.log("safeArea", this.safeArea,this.safeAreaStyle);
      },
      immediate: true,
    },
  },
});
export default pageOption;
</script>

<style scoped lang="scss">
.safe-area {
  width: 100%;
  &.absolute {
    position: absolute;
  }
  &.sticky {
    position: sticky;
  }
  &.fixed {
    position: fixed;
  }
}
</style>