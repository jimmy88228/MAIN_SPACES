<template>
  <view>
    <view class="nav-stay" :style="navStayStyle" v-if="!full"></view>
    <view class="nav fixed" :style="navStyle+boxStyle">
      <view class="nav-bg" :style="{'opacity':bgOpacity}">
      </view>
      <view class="nav-body" :style="MenuObjectPadding+bodyStyle">
        <view class="back-link" hover-class="back-link-hover" v-if="hasBack && !hideBtn" @click="toBack">
          <image v-if="isClose" class="back-close" :src="requireStatic(closeIcon)" mode="widthFix" />
          <image v-else :class="[backMode.c]" :src="'/static/' + backMode.i + '.png'" mode="widthFix"></image>
        </view>
        <view class="custom-content-box">
          <slot name="custom-content"></slot>
        </view>
        <view :style="{'opacity':bgOpacity}" style="transition: 0.5s all;"
          :class="['title-content',hasBack?'with-back':'']">
          <slot name="title"></slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import SIH from "@/common/helper/sys-infos-handler"
  import NavConf from "./nav-config";
  const app = getApp();

  const BackMode = {
    Auto: {
      m: "Auto",
      c: "back-i"
    },
    None: {
      m: "None",
      c: "back-i"
    },
    Back: {
      m: "Back",
      i: "nav-back",
      c: "back-i"
    },
    Close: {
      m: "Back",
      i: "close",
      c: "back-close"
    },
    Home: {
      m: "Home",
      i: "nav-home",
      c: "back-i"
    },
  };
  const pageOption = Page.BaseComp({
    name: "page-nav",
    props: {
      navTitle: String,
      full: {
        type: Boolean,
        default: false
      },
      stay: {
        type: Boolean,
        default: false
      },
      boxStyle: {
        type: String,
        default: ""
      },
      isTransparent: {
        type: Boolean,
        default: false
      },
      bodyStyle: {
        type: String,
        default: ""
      },
      cover: {
        type: Boolean,
        default: false
      },
      mode: {
        type: String,
        default: BackMode.Auto.m
      },
      isHideHome: {
        type: Boolean,
        default: false
      },
      hideBtn: {
        type: Boolean,
        default: false
      },
      isClose: {
        type: Boolean,
        default: false
      },
      scrollHeight: {
        type: Number,
        default: 0
      }

    },
    data() {
      return {
        closeIcon: "/close.png",
        navStayStyle: 0,
        navStyle: 0,
        hasBack: false,
        backMode: {},
        navBackground: "rgba(255,255,255,1)",
        bgOpacity: 0,
        MenuObjectPadding: "padding-right:0;"
      }
    },
    created() {
      if (this.isCreated) return;
      this.isCreated = true;
      this.setMode(this.mode);
      this.initBg()
      this.setMenuObject();
      this.initHeight()
      // this.onScroll()
    },
    methods: {
      initHeight() {
        this.$nextTick(() => {
          this.navStayStyle = `height: ${SIH.navPlace}px;`
          this.navStyle = `height: ${SIH.navPlace}px;padding-top:${SIH.statusBarHeight}px;`
        })
      },
      toBack() {
        let mode = this.backMode;
        console.log('mode.m', mode.m, mode)
        if (mode.m == BackMode.Back.m) {
          uni.navigateBack({
            delta: 1
          });
        } else if (mode.m == BackMode.Home.m) {
          console.log(123)
          let bsnUserInfo = app.IM.bsnUserInfo.relateType;
          let hasTeacher = {
            "class_teacher": 1,
            "psyc_teacher": 1,
            "teacher": 1
          }
          if (hasTeacher[bsnUserInfo]) {
            uni.reLaunch({
              url: `/${NavConf.TEACHER_INDEX_PATH}`
            })
          } else {
            uni.reLaunch({
              url: `/${NavConf.INDEX_PATH}`
            });
          }

        }
      },
      setMode(mode) {
        let backMode = BackMode.None;
        let pages = getCurrentPages();
        if (!mode || mode == BackMode.Auto.m) {
          if (pages.length > 1) {
            backMode = BackMode.Back
          } else if (pages.length <= 1 && Array.isArray(NavConf.EXCLUDE_PATH) && NavConf.EXCLUDE_PATH.every(item =>
              pages[0].route != item)) {
            backMode = !this.isHideHome && BackMode.Home || BackMode.None
          }
        } else if (BackMode[mode]) {
          backMode = BackMode[mode];
        }
        this.hasBack = backMode.m != BackMode.None.m,
          this.backMode = backMode;
      },
      initBg() {
        console.log('initBg', this.isTransparent, )
        if (this.isTransparent) {
          this.bgOpacity = 0
        } else {
          this.bgOpacity = 1
        }
      },
      setMenuObject() {
        let menuObj = SIH.getMenuObject || {};
        this.MenuObjectPadding = 'box-sizing:border-box;padding-right:' + ((menuObj.width || 0) + ((SIH
          .screenWidth - (menuObj.right || 0))) * 2) + 'px;';
      }
    },
    watch: {
      mode: {
        handler(nV) {
          this.setMode(nV);
        },
        immediate: true
      },
      isTransparent: {
        handler(nV) {
          this.initBg();
        },
        immediate: true
      },
      scrollHeight: {
        handler(nV) {
          if (!this.isTransparent) return
          let that = this;
          let transparentPrecent = (nV / SIH.navPlace).toFixed(2) > 1 ? 1 : 0
          if (that.bgOpacity == transparentPrecent) return
          that.bgOpacity = transparentPrecent
        },
        immediate: true
      }
    }
  })
  export default pageOption
</script>

<style lang="scss" scoped>
  :host {
    --title-color: #171717;
    width: 100%;
  }

  .nav-stay {
    width: 100%;
  }

  .nav {
    width: 100%;
    color: var(--title-color);
    box-sizing: border-box;
    height: 0;
  }

  .fixed {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1001;
  }

  .nav-bg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: white;
    transition: 0.5s all;
  }

  .nav-body {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    padding-left: 30rpx;
    padding-right: 30rpx;
    height: 100%;
  }

  .back-link-hover {
    background-color: rgba(127, 127, 127, 0.05);
  }

  .back-i {
    width: 32rpx;
    height: 32rpx;
  }

  .back-close {
    width: 56rpx;
    height: 56rpx;

  }

  .custom-content-box {
    display: inline-block;
    font-size: 30rpx;
    width: 100%;
  }

  .title-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 30rpx;
    max-width: 380rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #000;
  }
</style>