<template>
  <view class="stage-popup">
    <!-- #ifdef MP -->
    <oriPopup ref="oriPopup" type="bottom" :isMaskClick="false">
      <template v-slot:content>
        <view class="popup-content-mp">
          <image :src="staticAddress+finishIcon" mode="scaleToFill" />
          <view class="title">完成进度{{infoData.successIndex + 1}}/{{infoData.modelIds && infoData.modelIds.length}}</view>
          <view class="tips">太厉害了，完成{{infoData.successIndex + 1}}个测评啦。</view>
          <view class="procress-group flex-c-c">
            <view :class="['procress-item',i <= infoData.successIndex?'finish':'']"
              v-for="(item,i) in infoData.modelIds" :key="i"></view>
          </view>
          <view class="button-group flex-c-c">
            <view class="back flex-c-c" @click="close">返回</view>
            <view class="continue flex-c-c" @click="jumpNewScale">进入新的量表</view>
          </view>
        </view>
      </template>
    </oriPopup>
    <!-- #endif -->

    <!-- #ifdef H5 -->
    <oriPopup ref="oriPopup" :type="isSmallScreen?'bottom':'center'">
      <template v-slot:content>
        <view class="popup" @click="closeMask">
          <view @click.stop="noAction" :style="{'opacity':stagePopupShow?1:0,'transition':'0.4s all'}"
            :class="isSmallScreen?'popup-content-h5-small':'popup-content-h5'">
            <image :src="staticAddress+finishIcon" mode="scaleToFill" />
            <view class="title">完成进度{{infoData.successIndex + 1}}/{{infoData.modelIds && infoData.modelIds.length}}
            </view>
            <view class="tips">太厉害了，完成{{infoData.successIndex + 1}}个测评啦。</view>
            <view class="procress-group flex-c-c">
              <view :class="['procress-item',i <= infoData.successIndex?'finish':'']"
                v-for="(item,i) in infoData.modelIds" :key="i"></view>
            </view>
            <view class="button-group flex-c-c">
              <view class="continue flex-c-c" @click="jumpNewScale">进入新的量表</view>
            </view>
            <image :src="requireStatic('close.png')" @click="close" class="close-icon" v-if="!isSmallScreen"></image>
          </view>
          <view class="filter-blur-background" :style="{'opacity':stagePopupShow?1:0}"></view>
        </view>
      </template>
    </oriPopup>
    <!-- #endif -->
  </view>
</template>

<script>
  import oriPopup from '@/components/ori-comps/popup/ori-popup'
  const app = getApp()

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
        infoData: {},
        isSmallScreen: 0,
        stagePopupShow: false
      };
    },
    computed: {},
    onShow() {},
    onReady() {},
    methods: {
      showStagePopup() {
        this.$refs.oriPopup.show()
        this.stagePopupShow = true;
      },
      closeMask() {
        if(this.isSmallScreen){
          this.$refs.oriPopup.dismiss()
          this.stagePopupShow = false;
        }
      },
      close(emit = true) {
        this.$refs.oriPopup.dismiss()
        this.stagePopupShow = false;
        emit && this.$emit('close')
      },
      jumpNewScale() {
        this.close(false)
        this.$emit('jumpNewScale')
      },
      // 获取屏幕的宽度，若屏幕宽度<580则使用小程序的弹窗形式
      getWindowWidth() {
        let windowWidth = app.SIH.windowWidth;
        this.isSmallScreen = windowWidth < 580
        console.log(this.isSmallScreen, "this.isSmallScreen")
      }

    },
    watch: {
      scaleInfo: {
        handler(nV) {
          this.infoData = nV;
          this.getWindowWidth()
        },
        immediate: true,
        deep: true
      }
    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  @import './H5.scss';
  @import './MP.scss';
</style>