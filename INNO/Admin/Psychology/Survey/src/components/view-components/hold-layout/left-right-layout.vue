<template>
  <div class="left-right-layout">
    <div class="layout-header" v-if="isShowTitle">
      <slot name="header">
        <div class="layout-header-cont flex-b-c">
          <div class="header-title">{{$route.meta && $route.meta.title}}</div>
          <div >
            <slot name="header-r"></slot>
          </div>
        </div>
      </slot>
    </div>
    <div class="layout-cont-area">
      <div class="layout-cont">
        <div class="layout-l">
          <slot name="left"></slot>
        </div>
        <div class="layout-r" v-bar>
          <slot name="right"></slot>
        </div>
      </div>
    </div>
    <div class=""><!--存放页面引用modal组件，避免层级样式受内层影响-->
      <slot name="modal"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "leftRightLayout",
  components: {},
  props: {
    beforeInit: Function,
    isShowTitle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    init() {
      if (typeof this.beforeInit == "function") {
        try {
          this.beforeInit().then(() => {
            this.initData();
          });
        } catch (error) {
          this.initData();
        }
      } else {
        this.initData();
      }
    },
    initData() {},
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="less" scoped>
.left-right-layout {
  display: flex;
  height: 100%;
  flex-direction: column;
  .layout-header{
    flex-shrink: 0;
    .layout-header-cont{
      padding: 10px 0px 25px 28px;
      .header-title{
          font-size: 24px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #171717;
          line-height: 33px;
      }
    }
  }
  .layout-cont-area {
    flex: 1;
    overflow: hidden;
    .layout-cont{
      display: flex;
      height:100%;
    }
    .layout-l {
      width: 25%;
      min-width: 230px;
      max-width: 300px;
      display: block;
      border-right: 1px solid #efefef;
      flex-shrink: 0;
      padding: 10px;
      padding-top: 0px;
      height: 100%;
    }
    .layout-r {
      flex-shrink: 0;
      flex: 1;
      height: 100%;
    }
  }
}
</style>