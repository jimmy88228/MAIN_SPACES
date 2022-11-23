<template>
  <view class="game-index-area text-c">
    <template v-if="showLoading">
      <view class="game-index-area flex-c-c">
        <loading-view></loading-view>
      </view>
    </template>
    <template v-else>
      <page-nav :isTransparent="true">
        <template v-if="!noData">
          <view slot="custom-content">
            <image @click="getRank" class="game-rank-icon" :src="staticAddress + '/game/different/rank-icon.png'"
              mode="widthFix">
          </view>
        </template>
      </page-nav>
      <template v-if="!noData">
        <image @load="getBgSize" v-show="isLoadBg" :style="{height:bgHeight,width:bgWidth}" class="game-index-bg"
          :src="bgImg" mode="widthFix">
          <view class="operate-area">
            <view class="operate-btn" @click="startGame">
              <image class="operate-icon" :src="staticAddress + '/game/different/game-start.png'" mode="widthFix">
            </view>
          </view>
      </template>
      <template v-else>
        <empty>暂无活动信息噢～</empty>
      </template>
    </template>
  </view>
</template>

<script>
  import LoadingView from '@/components/css3/loading/loading.vue';
  import utils from '@/common/support/utils.js'
  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      LoadingView
    },
    data() {
      return {
        showLoading: true,
        noData: true,
        bgWidth: "100%",
        bgHeight: 0,
        isLoadBg: false,
        info: []
      };
    },

    onLoad(options) {
      this.options = options || {};
    },
    computed: {
      bgImg() {
        let info = this.info;
        let bgImg = info.bgImg || (this.staticAddress + '/game/different/game-index-bg.jpg');
        return bgImg
      }
    },
    onReady() {
      this.getGameInfo()
    },
    onShow() {},
    onHide() {},
    onUnload() {},
    methods: {
      getGameInfo() {
        this.$Http(this.$Apis.getGameActivityBaseInfo, {
          data: {
            activityId: this.options.gameActivityId || 1
          }
        }).then(res => {
          if (res.code == 1) {
            this.info = res.data
            this.noData = false
          } else {
            this.noData = true;
          }
        }).catch(err => {
          this.noData = true;
        }).finally(() => {
          this.showLoading = false
        })
      },
      getBgSize({
        detail
      }) {
        let width = detail.width;
        let height = detail.height;
        utils.getBgSize(width, height).then(res => {
          this.bgWidth = res.imgW + "px"
          this.bgHeight = res.imgH + "px"
          this.isLoadBg = true;
        })
      },
      getRank() {
        this.jumpAction(
          `/pages/game/find-out-difference/rank/list?gameActivityId=${this.options.gameActivityId || 1}`);
      },
      startGame() {
        this.jumpAction(`/pages/game/find-out-difference/game?gameActivityId=${this.options.gameActivityId || 1}`);
      }
    },
  });
  export default pageOption;
</script>

<style lang="scss">
  .game-index-area {
    width: 100%;
    height: calc(100vh);
    position: relative;

    .game-rank-icon {
      width: 90rpx;
      height: 90rpx;
    }

    .game-index-bg {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
    }

    .operate-area {
      position: absolute;
      left: 0px;
      bottom: 0px;
      width: 100%;
    }

    .operate-icon {
      width: 100%;
      display: block;
    }
  }
</style>