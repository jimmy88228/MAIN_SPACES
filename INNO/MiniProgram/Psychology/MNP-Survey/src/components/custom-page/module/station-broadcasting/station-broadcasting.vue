<template>
  <view class="station-broadcasting">
    <view class="broadcasting-bg flex-s-c">
      <image class="icon" :src="requireStatic('/broadcast.png')" mode="aspectFit" />
      <view class="broadcasting-view" id="broadcasting">
        <view @tap.stop="jumpAction(playData[current].link)">
          <swiper class="swiper-box" :current-item-id="index" :circular="swiperOps.circular"
            :vertical="swiperOps.vertical" :autoplay="swiperOps.autoplay" :interval="swiperOps.interval"
            :duration="swiperOps.duration" @change="swiperfinish" @animationfinish="animationfinish"
            @touchmove.stop="noAction">
            <block v-for="(item,i) in playData" :key="i">
              <swiper-item v-if="playData.length>0" @touchmove.stop="noAction">
                <view class="swiper-item-out" :style="currentSwiper == i?opacity_1:opacity_0">
                  <view class="swiper-item" s :data-index="i">
                    <view
                      :style="[current == i && running && item.time > 0 && {'transform':`translateX(calc(-100% + ${msgViewWidth}px))`,'transition': `transform ${item.time/1000}s linear 0s;`}]">
                      {{item.value}}
                    </view>
                  </view>
                </view>
              </swiper-item>
            </block>
          </swiper>
        </view>
      </view>
    </view>
  </view>

</template>

<script>
  import strUtil from "@/common/support/utils/string-util.js"
  const app = getApp()
  const pageOption = Page.BasePage({
    name: "station-broadcasting",
    props: {
      moduleInfo: {
        type: Object,
        default: () => {},
      },
    },
    computed: {
      dynamicSetting() {
        return this.moduleInfo.dynamicSetting || {};
      },
      moduleData() {
        return this.moduleInfo.moduleData || {};
      },
    },
    data() {
      return {
        playData: [],
        swiperOps: {
          interval: 3000,
          autoplay: false,
          vertical: true,
          duration: 1000,
          circular: true,
        },
        running: false,
        currentSwiper: 0,
        opacity_0: "opacity:0;transition: opacity 300ms ease-in-out;",
        opacity_1: "opacity:1;transition: opacity 300ms ease-in-out 400ms;",
        current: 0,
        afterIndex: 0,
        msgViewWidth: 0,
        scrollTimer: '',
        tranUnit: 0.5,
        fontSize: '26',
        msgFontSize: '0'
      };
    },
    onReady() {
      let that = this;
      that.msgFontSize = Math.floor(app.SIH.getConvert(this.fontSize, 'PX'));
      that._getQuery('#broadcasting', 'all', 'notPage').then(res => {
        console.log(res[0][0])
        let msgViewWidth = res[0][0].width || 0
        this.msgViewWidth = msgViewWidth
        that.initData(msgViewWidth)
      })
    },
    beforeDestroy() {
      // 组件销毁前清除字体滚动定时器
      clearTimeout(this.scrollTimer)
    },
    methods: {

      // 数据初始化
      initData(msgViewWidth) {
        let broadcastGroup = this.moduleData.broadcastGroup;
        let playData = broadcastGroup[0].broadcast;
        playData.forEach((item) => {
          let msg = item.value
          let len = strUtil.getCharLength(msg) || 0
          console.log(len, "msglen")
          let itemWidth = len * this.msgFontSize / 2;
          let scrollWidth = itemWidth - msgViewWidth;
          item.tranX = scrollWidth
          if (scrollWidth > 0) {
            // 未出现部分的滚动时长
            item.time = scrollWidth * 10 / this.tranUnit
          } else {
            item.time = 0
          }
        })

        // 如果只有一条的时候复制多一条
        if (playData.length == 1) {
          playData = playData.concat(playData)
        }

        this.playData = playData
        setTimeout(() => {
          this.running = true;
          this.textScroll(0)
        }, this.swiperOps.interval)
      },

      // 消息轮播
      swiperfinish({
        detail
      }) {
        this.currentSwiper = detail.current;
        this.swiperOps.autoplay = false;
      },

      // 消息轮播动画结束
      animationfinish({
        detail
      }) {
        let current = detail.current;
        this.current = current;
        this.textScroll(current)
      },

      // 字体滚动
      textScroll(index) {
        if (this.scrollTimer) {
          clearTimeout(this.scrollTimer)
        }
        let time = this.playData[index].time

        // 等待字体滚动完毕
        this.scrollTimer = setTimeout(() => {
          clearTimeout(this.scrollTimer)
          this.swiperOps.autoplay = true;
          this.afterIndex = index;
        }, time)
      },
      jumpUrl(link) {
        this.jumpAction(link)
      }
    },
  });
  export default pageOption;
</script>

<style lang="less" scoped>
  .station-broadcasting {
    width: 100%;
    padding: 15rpx 0;
    display: flex;
    justify-content: center;

    .broadcasting-bg {
      width: 100%;
      height: 75rpx;
      // background: transparent;
      background: #FFF;
      border-radius: 10rpx;
      box-shadow: 0rpx 2rpx 12rpx 4rpx rgba(0, 0, 0, 0.06);
      padding-right: 30rpx;
    }
  }

  .icon {
    width: 32rpx;
    height: 32rpx;
    padding: 0 15rpx 0 20rpx;
    flex-shrink: 0;
  }

  .swiper-box {
    width: 100%;
    height: 75rpx;
    pointer-events: none;
  }

  .broadcasting-view {
    flex: 1;
    height: 100%;
    overflow: hidden;
  }

  .swiper-item-out {
    height: 100%;
    flex: 1
  }

  .swiper-item {
    // opacity: 1;
    color: #444;
    font-size: 26rpx;
    height: 100%;
    width: auto;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
</style>