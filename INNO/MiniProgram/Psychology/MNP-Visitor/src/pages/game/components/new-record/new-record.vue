<template>
  <view class="new-record-popup" @touchmove.stop.prevent="noAction">
    <ori-popup ref="popup" type="center" @maskClick="maskClick" @change="changePopup">
      <template v-slot:content>
        <!-- 蒙层 -->
        <view class="bg-filter" :style="showFilter ? 'opacity:1;' : ''"></view>
        <!-- 抽奖结果 -->
        <view v-if="show && (showPrizeBool || showFlopBool)">
          <view class="prize-box" :style="opacityBoxStyle">
            <template v-if="showFilter">
              <image v-if="showPrizeBool || showFlopBool" class="img-anim-light-bg" :class="{ 'active': showFlopAnim }" mode="aspectFit" :src="staticAddress + '/game/different/light-bg.png'" />
              <image v-if="showPrizeBool || showFlopBool" class="img-anim-light-cir" :class="{ 'active': showFlopAnim }" mode="aspectFit" :src="staticAddress + '/game/different/light-cir.png'" @click="maskClick"/>
            </template>
            <view class="content-box _flex-col-c-c" :class="{ 'flop': (showPrizeBool || showFlopBool), 'normal': (!showPrizeBool && !showFlopBool), 'active':  showFlopAnim}">
              <view class="prize-content _flex-col-c-c" :class="{ 'active': showFlopAnim }" @click="maskClick">
                <view class="new-record-area" @click.stop="noAction">
                  <view class="record-tip-area">
                    <image class="record-tip" :src="staticAddress + '/game/different/new-record-tip.png'" mode="widthFix" />
                  </view>
                  <view class="record-txt-area">
                    <image class="record-txt-bg" :src="staticAddress + '/game/different/new-record-header.png'"
                      mode="widthFix" />
                    <view class="record-txt">
                      <view class="txt-tip">闯关记录</view>
                      <view class="txt-time">{{score}}</view>
                    </view>
                  </view>
                  <view class="new-record-tip">传说中的闪电侠说的是你吗？</view>
                  <ori-input @onInput="(e) => onInput(e, 'name')" :value="name" 
                  placeholder="给自己起个霸气的名字吧" 
                  placeholderStyle="font-size: 32rpx;line-height: 40rpx;text-align:center;" 
                  class="_input" 
                  :maxlength="20"
                  :boxStyle="inputStyle">
                  </ori-input>
                  <view class="operate-area">
                    <button class="operate-btn" @click="confirm">确认</button>
                  </view>
                  <view class="name-tips">*系统默认入榜名称为 “匿名”</view>
                  <view class="custom-page-area">
                    <custom-page :isShowNav="false" :fullScreen="false" ref="customPageRef"></custom-page>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
    </ori-popup>
  </view>
</template>

<script>
  import oriPopup from "@/components/ori-comps/popup/ori-popup.vue";
  import oriInput from "@/components/ori-comps/input/ori-input.vue";
  const BaseComp = Page.BaseComp({
    name: "new-record",
    props: {
      score: {
        type: String,
        default: "00:00:00"
      }
    },
    data() {
      return {
        show: true,
        showFilter: false,
        showPrizeBool: false,
        showFlopBool: false,
        showFlopAnim: false,
        opacityBoxStyle: '',
        name: ""
      }
    },
    computed: {
      inputStyle() {
        return "width:100%;font-size: 32rpx;line-height: 40rpx;";
      }
    },
    components: {
      oriPopup,
      oriInput
    },
    methods: {
      showModal() {
        this.$refs.popup.show();
        this.show = true;
        this._setAnim("prize", true);
      },
      onInput(e, type) {
        if (type == "name") {
          this.name = e.detail.value
        }
      },
      confirm() {
        this._setAnim("prize", false).then(()=>{
          this.show = false;
          this.$refs.popup.dismiss();
          this.$emit("confirm", this.name)
        })
      },
      maskClick(e){
        this._setAnim("prize", false).then(()=>{
          this.show = false;
          this.$refs.popup.dismiss();
          this.$emit("confirm", "")
        })
      },
      initCustomPage(data){
        this.$refs["customPageRef"] && this.$refs["customPageRef"].initData(data);
      },
      changePopup(type) {},
      // 动画
    _setAnim(type, bool, extra = {}) {
      return new Promise((rs, rj) => {
        if (type == "prize") {
          //中奖结果
          if (bool) {
            this.showScrollAnim = false;
            this.showScrollBool = false;
            this.showPrizeBool = true;
            this.showFilter = true;
            this.$nextTick(() => {
              this.opacityBoxStyle = "opacity:1;";
              this.showFlopAnim = true;
              rs();
            });
          } else {
            this.opacityBoxStyle = "opacity:0;";
            this.showFilter = false;
            setTimeout(() => {
              this.showPrizeBool = false
              rs();
            }, 150);
          }
        } else {
          rs();
        }
      });
    }
    },
  });
  export default BaseComp
</script>

<style lang="less" scoped>
  @import "./animate.less";
  .new-record-area {
    width: 600rpx;
    background: linear-gradient(0deg, #FFFFFF, #FFF1D3);
    border-radius: 60rpx;
    padding: 40rpx;
    box-sizing: border-box;
    position: relative;
    text-align: center;
    .custom-page-area {
      margin-top: 20rpx;
      border-radius: 30rpx;
      overflow: hidden;
    }
    .record-tip-area {
      width: 481rpx;
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .record-tip {
      width: 100%;
    }

    .record-txt-area {
      width: 100%;
      height: 190rpx;
      position: relative;
      margin: 60rpx 0px;
    }

    .record-txt-bg {
      width: 100%;
      display: block;
    }

    .record-txt {
      position: absolute;
      left: 50%;
      bottom: 9rpx;
      transform: translateX(-50%);
    }

    .txt-tip {
      font-size: 20rpx;
      font-family: PingFang SC;
      font-weight: 400;
      font-style: italic;
      color: #B2B2B2;
      line-height: 48rpx;
    }

    .txt-time {
      font-size: 38rpx;
      font-family: Krungthep;
      font-weight: bold;
      font-style: italic;
      color: #333333;
      line-height: 48rpx;
    }

    .new-record-tip {
      margin-bottom: 53rpx;
      font-size: 32rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #B3B3B3;
      line-height: 40rpx;
    }

    .operate-btn {
      margin: 0 auto;
      width: 300rpx;
      height: 100rpx;
      background: #F0570F;
      border-radius: 50rpx;
      font-size: 40rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFF9D9;
      line-height: 40rpx;
    }

    .name-tips {
      margin-top: 20rpx;
      width: 100%;
      font-size: 22rpx;
      color: #7f7f7f
    }
    ._input{
      width:100%;
      display: flex;
      align-items: center;
      justify-content: center;
      height:110rpx;
      // line-height: 110rpx;
      background: #FAFAFA;
      box-sizing:border-box;
      border-radius: 55rpx;
      margin-bottom: 56rpx;
    }
    ._input-placeholder{
      width: 100%; 
      font-size: 32rpx;
      // line-height: 40rpx;
      text-align:center;
    }
  }
</style>