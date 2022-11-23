<template>
  <view class="stage-popup">
    <oriPopup ref="oriPopup" type="bottom">
      <template v-slot:content>
        <view class="popup-content">
          <image :src="staticAddress+finishIcon" mode="scaleToFill" />
          <view class="title">完成进度</view>
          <view class="tips">太厉害了，完成{{infoData.successIndex + 1}}个测评啦。</view>
          <view class="procress-group flex-c-c">
            <view :class="['procress-item',i <= infoData.successIndex?'finish':'']" v-for="(item,i) in infoData.modelIds"
              :key="i"></view>
          </view>
          <view class="button-group flex-c-c">
            <view class="back flex-c-c" @click="close">返回</view>
            <view class="continue flex-c-c" @click="jumpNewScale">进入新的量表</view>
          </view>
        </view>
      </template>
    </oriPopup>
  </view>
</template>

<script>
  import oriPopup from '@/components/ori-comps/popup/ori-popup'
  const pageOption = Page.BasePage({
    name: "stage-popup",
    components: {
      oriPopup
    },
    props: {
      scaleInfo: {
        type: Object,
        default: {},
        successCounr: 0
      }
    },
    data() {
      return {
        finishIcon: "/finish_stage.png",
        infoData: {}
      };
    },
    computed: {},
    onShow() {},
    onReady() {},
    methods: {
      showStagePopup() {
        this.$refs.oriPopup.show()
      },
      close() {
        this.$refs.oriPopup.dismiss()
      },
      jumpNewScale(){
        this.close()
        this.$emit('jumpNewScale')
      }

    },
    watch: {
      scaleInfo: {
        handler(nV) {
          console.log(nV, "indoData")
          this.infoData = nV;
        },
        immediate: true,
        deep: true
      }
    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .popup-content {
    position: fixed;
    bottom: 0;
    width: 750rpx;
    height: 633rpx;
    background: #FFFFFF;
    border-radius: 42px 42px 0px 0px;
    text-align: center;

    &>image {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -50%);
      width: 203rpx;
      height: 203rpx;
      border-radius: 50%;
    }

    .title {
      margin-top: 160rpx;
      font-size: 42rpx;
      font-weight: bold;
      color: #00328E;
      line-height: 59rpx;
    }

    .tips {
      margin-top: 32rpx;
      font-size: 24rpx;
      color: #7F7F7F;
    }

    .procress-group {
      margin-top: 45rpx;
      width: 100%;

      .procress-item {
        width: 76rpx;
        height: 10rpx;
        background-color: #DDDDDD;
        border-radius: 8rpx;
        margin-right: 10rpx;
      }

      .finish {
        background-color: $uni-main-color;
      }

      .procress-item:last-child {
        margin-right: 0;
      }
    }

    .button-group {
      position: absolute;
      bottom: 40rpx;
      left: 0;
      width: 100%;

      .back {
        width: 206rpx;
        height: 110rpx;
        background: #FAFAFA;
        border-radius: 58rpx;
        font-size: 28rpx;
        color: #7F7F7F;
        line-height: 40rpx;
        margin-right: 27rpx;
      }

      .continue {
        width: 442rpx;
        height: 110rpx;
        background: #F5FAFF;
        border-radius: 58rpx;
        font-size: 28rpx;
        color: #06509B;
      }
    }
  }
</style>