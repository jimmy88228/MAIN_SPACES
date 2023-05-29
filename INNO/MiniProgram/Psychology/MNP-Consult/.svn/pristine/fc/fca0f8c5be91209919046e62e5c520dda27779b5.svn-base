<template>
  <view class="game-result">
    <page-nav navBoxStyle="position:relative;z-index:1;" :isTransparent="true">
      <view slot="custom-content">
        <image @click="getRank" class="game-rank-icon" :src="staticAddress + '/game/different/rank-icon.png'"
          mode="widthFix">
      </view>
    </page-nav>
    <view class="result-cont">
      <view class="cont-tip-area">
        <image class="cont-tip-icon" :src="staticAddress + '/game/different/game-success-tip.png'" mode="widthFix">
      </view>
      <view class="result-cont-main">
        <view>
          <image class="main-l-icon" :src="staticAddress + '/game/different/flower-l.png'" mode="widthFix">
        </view>
        <view class="cont-main-txt">
          <view class="txt-tip">共耗时</view>
          <view class="txt-time">{{options.score}}</view>
        </view>
        <view>
          <image class="main-r-icon" :src="staticAddress + '/game/different/flower-r.png'" mode="widthFix">
        </view>
      </view>
      <view class="result-cont-sub">
        <view class="sub-txt">加油！突破下自己</view>
        <view class="sub-time">最好成绩 {{bestScore}}</view>
      </view>
    </view>
    <view class="result-operate">
      <view class="operate-area">
        <button class="operate-btn restart-btn" @click="tryAgain">再来一局</button>
      </view>
      <view class="operate-area">
        <button class="operate-btn rest-btn" @click="getGameIndex">休息一下</button>
      </view>
    </view>
    <newRecord @confirm="confirmName" :score="options.score" ref="newRecordRef"></newRecord>
  </view>
</template>

<script>
  import newRecord from "../../components/new-record/new-record.vue";
  import DateUtil from "@/common/support/utils/date-util.js";
  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        options: {},
      };
    },
    components: {
      newRecord,
    },
    computed: {
      bestScore() {
        let options = this.options;
        let bestScore = options.bestScore;
        let bestScoreStr = DateUtil.spanFormat(bestScore * 1000);
        return bestScoreStr
      }
    },
    onLoad(options) {
      this.options = options || {};
    },
    onReady() {
      this.$nextTick(() => {
        if (this.options.newScore == 1) {
          this.$refs["newRecordRef"] && this.$refs["newRecordRef"].showModal();
        }
      })
    },
    methods: {
      getRank() {
        this.jumpAction(`/pages/game/find-out-difference/rank/list?gameActivityId=${this.options.gameActivityId}`);
      },
      tryAgain(){
        this.redirectAction(`/pages/game/find-out-difference/game?gameActivityId=${this.options.gameActivityId}`);
      },
      getGameIndex() {
        this.backAction(`/pages/game/find-out-difference/game-index?gameActivityId=${this.options.gameActivityId}`);
      },
      confirmName(name) {
        let nickName = name.trim() || "匿名"
        this.$Http(this.$Apis.saveGameUserInfo, {
          data: {
            nickName
          }
        }).then(res => {
          let msg = ""
          if (res.code != 1) {
            msg = '名字保存失败';
          } else {
            msg = '名字保存成功';
            this.getRank();
          }
          app.SMH.showToast({
            title: msg
          })
        })
      }
    },
    onShow() {

    },

  });
  export default pageOption;
</script>

<style lang="scss">
  .game-result {
    width: 100%;
    min-height: calc(100vh);
    background: linear-gradient(-43deg, #FFF6D4, #FFFDF4);

    .game-rank-icon {
      width: 90rpx;
      height: 90rpx;
    }

    .result-cont {
      margin: 0 auto;
      padding: 50rpx;
      box-sizing: border-box;
      width: 579rpx;
      margin-top: 227rpx;
      background: #FFFFFF;
      box-shadow: 0px 1px 45rpx 1px rgba(184, 128, 63, 0.1700);
      border-radius: 30rpx;
      position: relative;
      text-align: center;
    }

    .cont-tip-area {
      width: 481rpx;
      height: 101rpx;
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translate(-50%, -50%);

      .cont-tip-icon {
        width: 100%;
        display: block;
      }
    }

    .result-cont-main {
      margin: 112rpx 0px;
      display: flex;
      align-items: center;
      justify-content: center;

      .main-l-icon,
      .main-r-icon {
        width: 85rpx;
        display: block;
      }

      .cont-main-txt {
        padding: 0px 20rpx;
      }

      .txt-tip {
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #000000;
        line-height: 30rpx;
        opacity: 0.5;
        margin-bottom: 10rpx;
      }

      .txt-time {
        font-size: 46rpx;
        font-family: Krungthep;
        font-weight: bold;
        color: #333333;
        line-height: 48rpx;
      }
    }

    .result-cont-sub {}

    .sub-txt {
      font-size: 36rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFC63F;
      line-height: 40rpx;
      margin-bottom: 30rpx;
    }

    .sub-time {
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #7F7F7F;
      line-height: 40rpx;
    }

    .result-operate {
      margin-top: 108rpx;
      margin-bottom: 50rpx;
      text-align: center;

      .operate-area {}

      .operate-btn {
        margin: 0 auto;
        width: 369rpx;
        height: 100rpx;
        border-radius: 50rpx;
        font-family: PingFang SC;
        font-weight: bold;
        font-size: 40rpx;
        line-height: 40rpx;
      }

      .restart-btn {
        background: #F0570F;
        color: #FFF9D9;
        margin-bottom: 30rpx;
      }

      .rest-btn {
        background: #FFFFFF;
        color: #CF6B00;
      }
    }
  }
</style>