
<template>
  <div id="cp-root">
    <SiderMenu id="cp-sider-menu" v-if="!_isThird"></SiderMenu>
    <div id="cp-root-cont">
      <div id="cp-box" :class="{ 'show-mark':  $route.meta.watermark}">
        <OpenedPageTags v-if="$store.state.app.openPageTags && !_isThird"></OpenedPageTags>
        <div id="cp-cav-box" class="anim-box">
          <vue-scroll ref="pageVueScroll" class="anim-view-area " id="cp-cav-scroll" @handle-scroll="viewScroll" :class="{'bg-page' : !$route.meta.removeBg}">
            <div class="anim-view-area-stay ">
              <BreadcrumbBar v-if="!_isThird"></BreadcrumbBar>
              <div class="anim-view-area-title bold" v-if="$route.meta.title && !$route.meta.hideTitle">{{$route.meta.title}}</div>
              <div class="anim-router-view">
                <transition v-bind="adimData">
                  <keep-alive>
                    <router-view class="anim-router" v-if="$route.meta.keepAlive"></router-view>
                  </keep-alive>
                </transition>
                <transition v-bind="adimData">
                  <router-view class="anim-router" v-if="!$route.meta.keepAlive"></router-view>
                </transition>
              </div>
            </div>
          </vue-scroll>
          <Spin :fix="true" v-if="$store.state.app.pageLoading"></Spin>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageHelper from "@/helper/page-helper";
import SiderMenu from "./components/sider-menu";
import OpenedPageTags from "./components/opened-page-tags";
import BreadcrumbBar from "@/components/breadcrumb-bar";
// import vuescroll from "";
export default {
  name: "ControlPanel",
  components: { SiderMenu, OpenedPageTags, BreadcrumbBar },
  data() {
    return {
      mAdimData: {},
    };
  },
  computed: {
    adimData() {
      return {
        enterClass: this.mAdimData.enter,
        enterActiveClass: this.mAdimData.enterActive,
        enterToClass: this.mAdimData.enterTo,
        leaveClass: this.mAdimData.leave,
        leaveActiveClass: this.mAdimData.leaveActive,
        leaveToClass: this.mAdimData.leaveTo,
      };
    },
  },
  watch: {
    $route(to, from) {
      this.mAdimData = this.$getAnimData(from, to, 2);
      PageHelper.setNewPage(to, from);
    },
  },
  methods: {
    viewScroll(vertical, horizontal) {
      this.$store.commit("setPageScrollTop", vertical.scrollTop || 0);
    },
  },
  mounted() {
    PageHelper.setNewPage(this.$route);
  },
};
</script>
<style scoped lang="less">
@import "~@/assets/css/variables.less";
#cp-root {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
}
#cp-sider-menu {
  display: block;
  float: left;
  height: 100%;
  flex-shrink: 0;
}
#cp-root-cont {
  flex: 1;
  width: 100%;
  height: 100%;
  padding-top: 14px;
  padding-left: 14px;
}

#cp-box {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

#cp-cav-box {
  width: 100%;
  height: 100%;
}
</style>
<style lang="less">
#cp-root {
  #cp-box {
    .watermark-div {
      display: none;
    }
  }
  #cp-box.show-mark{
      .watermark-div {
        display: block;
      }
  }
}
</style>
