<template>
  <view class="psychology-protocol" @touchmove.stop.prevent="noAction">
    <ori-popup ref="popup" type="center" @change="change" background-color="transparent">
      <template v-slot:content>
        <view class="psychology-protocol-info">
          <view>
            <view class="psychology-protocol-bg bold">
              <view class="psychology-protocol-title font-28 m-t-15 m-b-20">EAP专员保密协议</view>
              <scroll-view scroll-y class="psychology-protocol-detail">
                <text class="p-b-32 font-24">
                  本协议是保障EAP心理关爱活动正常开展的基本框架，为了保障职工的个人隐私不被泄露，您的关爱工作能顺利有效地进行，请仔细阅读以下内容并确认表示同意。

                  保密条款
                  一、EAP专员应本着尊重、保护职工个人隐私的原则,对心理关爱过程中的有关信息,包括个案记录、测评报告、信件、录音和其他资料,均属保密信息,都应在严格保密的情况下进行保存。
                  二、 EAP专员必须严格遵守EAP工作的保密原则,对职工个人心理档案的相关资料进行严格保密。
                  三、上述保密资料,除您本人之外的任何人〔包括直属领导或非直属领导、其他EAP专员、其他同事〕均不得查阅。
                  四、保密例外（包括但不限于）:
                  1. 当您发现您负责关爱的职工可能存在伤害自身或伤害他人的严重风险时；
                  2. 您负责关爱的职工有致命的传染性疾病且可能危及他人生命健康时；
                  3. 有未成年人可能处于受到性侵犯或虐待的情境时；
                  4. 法律规定需要披露时；

                  请确认:
                  我已阅读、知晓并同意以上全部内容。
                </text>
              </scroll-view>
            </view>
          </view>
          <view>
            <view class="agree-area" @click="chooseAgree">
              <view class="agree-icon">
                <view class="select-switch" :class="{ selected: selectAgree }"></view>
              </view>
              <view>我已阅读、知晓并同意以上全部内容。</view>
            </view>
          </view>
          <view class="confirm C_17 font-32 flex-c-c" @click="confirm">确认</view>
        </view>
      </template>
    </ori-popup>
  </view>
</template>

<script>
  import SMH from "@/common/helper/show-msg-handler.js";
  import oriPopup from "@/components/ori-comps/popup/ori-popup";
  const BaseComp = Page.BaseComp({
    name: "psychology-protocol",
    data() {
      return {
        selectAgree: false
      };
    },
    components: {
      oriPopup
    },
    methods: {
      showModal() {
        this.$refs.popup.show();
      },
      change(e) {
        console.log(e)
        if (e.show == false) this.selectAgree = false
        this.$emit('change', e)
      },
      chooseAgree() {
        this.selectAgree = !this.selectAgree;
      },
      confirm() {
        if (!this.selectAgree) {
          SMH.showToast({
            title: "请先阅读、知晓并同意以上全部内容"
          })
          return
        }
        this.$refs.popup.dismiss();
        this.$emit('confirm')
      }
    },
  });
  export default BaseComp
</script>

<style lang="scss" scoped>
  .psychology-protocol {
    position: relative;
    overflow: hidden;


    .psychology-protocol-info {
      background: #FFFFFF;
      border-radius: 33rpx;
      color: #000000;
      width: 660rpx;

      &>view:first-child {
        padding: 23rpx 20rpx 0;

        .psychology-protocol-bg {
          background: #F0F7FD;
          box-sizing: border-box;
          width: 100%;
          height: 700rpx;
          border-radius: 20rpx;
          padding: 30rpx;
          margin: 0 auto;

          .psychology-protocol-title {
            text-align: center;
          }

          .psychology-protocol-detail {
            height: 600rpx;
            line-height: 50rpx;
          }
        }


      }

      .agree-area {
        padding: 0 20rpx;
        line-height: 70rpx;
        font-family: PingFangSC-Regular;
        font-size: 22rpx;
        display: flex;
        align-items: center;

        .agree-icon {
          padding: 5rpx 20rpx;

          .select-switch {
            background: #fefefe;
            border: 1px solid #979797;
            border-radius: 4rpx;
            width: 23rpx;
            height: 23rpx;
            position: relative;
          }

          .selected::after {
            content: "";
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            width: 30%;
            height: 80%;
            border-radius: 4rpx;
            border: 6rpx solid $uni-main-color;
            border-top-color: transparent;
            border-left-color: transparent;
            transform: translate(-18%, -80%) rotate(40deg);
          }
        }

        .agree-link {
          display: inline-block;
          color: #178ed2;
          padding: 0px 10rpx;
          text-decoration: underline;
        }
      }

      .confirm {
        border-top: 1px solid #CBCBCB;
        width: 100%;
        height: 105rpx;
      }
    }
  }
</style>