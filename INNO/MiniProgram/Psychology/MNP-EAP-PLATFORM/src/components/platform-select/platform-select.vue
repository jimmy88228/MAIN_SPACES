<template>
  <view>
    <ori-popup @touchmove.stop.prevent="disabledScroll" @change="popupChange" ref="popup" type="bottom"
      :is-mask-click="true" :safe-area="false">
      <template v-slot:content>
        <view class="popup-content" :style="safeArea>0?'margin-bottom:'+safeArea+'rpx;':''">
          <view>
            <view class="m-b-25">
              <view class="font-38 bold m-b-15">选择账号登录</view>
              <view class="font-22 C_B2">选择一个主体进入</view>
            </view>
            <template v-if="limitList.length > 0">
              <scroll-view :scroll-y="true" class="scroll-view-info">
                <view v-for="(item,i) in limitList" :key="i" @click="selectOrganize" :data-item="item">
                  <view class="organize-item flex-b-c">
                    <view class="flex-s-c flex1" style="min-height: 0 ">
                      <image class="organize-icon" :src="item.smallLogo" mode="widthFix" />
                      <view class="flex1 clamp">
                        <view class="font-26 clamp m-b-5">{{item.customerName}}</view>
                        <view v-if="item.appCode == platformSaveInfo.appCode" class="font-22 flex-c-c selected">当前绑定
                        </view>
                      </view>
                    </view>
                    <text class="arrow-right"></text>
                  </view>
                </view>
              </scroll-view>
            </template>
            <template v-else>
              <view class="empty-list">
                <image class="empty-icon" :src="staticAddress+emptyIcon" mode="widthFix" />
                <view class="C_B2 font-32">暂无可选主体~</view>
              </view>
            </template>
          </view>
        </view>
      </template>
    </ori-popup>
    <ori-popup @touchmove.stop.prevent="disabledScroll" ref="popupTips" type="center" :is-mask-click="true"
      :safe-area="false">
      <template slot="content">
        <view class="popup-content-tips">
          <view class="popup-title">
            提示
          </view>
          <view class="popup-info">
            {{tips}}
          </view>
          <view class="popup-button" @click="hideTips">
            好的
          </view>
        </view>
      </template>
    </ori-popup>
  </view>
</template>

<script>
  import oriPopup from "@/components/ori-comps/popup/ori-popup";
  import SMH from "@/common/helper/show-msg-handler.js";
  import ScanCode from '@/common/helper/scan-code-handler.js';

  const app = getApp();
  const pageOption = Page.BasePage({
    name: "work-bench",
    props: {
      activityId: {
        type: Number,
        default: 0
      },
      formData: {
        type: Object,
        default: {
          mobilePhone: ""
        }
      },
      safeArea: {
        type: Number,
        default: 0
      },
      platformSaveInfo: {
        type: Object,
        default: {}
      }
    },
    components: {
      oriPopup
    },
    onReady() {
    },
    computed: {
      limitList() {
        let list = this.list || [];
        let limitList = [];
        let appCode = ScanCode.appCode || "";
        for (let i = 0; i < list.length; i++) {
          if (appCode) {
            if (appCode == list[i].appCode) {
              limitList.push(list[i])
            }
          } else {
            limitList.push(list[i]);
          }
        }
        return limitList;
      }
    },
    watch: {
      limitList: {
        handler(newVal, oldVal) {
          let appCode = ScanCode.appCode || "";
          if (newVal.length > 0) {
            this.showBench()
          } else {
            if (appCode) {
              this.tips = `登录失败\r\n用户信息不在“${app.PLM.platformInfo.customerName}”中`
            } else {
              this.tips = "若手机号确认无误，请先去后台绑定人员噢"
            }
            let ref = "popupTips";
            this.$refs[ref].show();
          }
        }
      }
    },
    data() {
      return {
        organizeIcon: "/organize.png",
        emptyIcon: "/list-empty.png",
        list: [],
        getPlatformList: '',
        tips: '若手机号确认无误，请先去后台绑定人员噢'
      };
    },
    methods: {
      checkValid() {
        if (this.formData.mobilePhone.trim().length == 0) {
          return "请先输入手机号";
        }
        if (this.formData.mobilePhone && (!/^1[123456789]\d{9}$/.test(this.formData.mobilePhone))) {
          return "请先输入正确的手机号";
        }
      },
      loadData() {
        if (this.getPlatformList) return
        // if (this.checkValid()) {
        //   SMH.showToast({
        //     title: this.checkValid()
        //   })
        //   return
        // }
        this.getPlatformList = app.PLM.getPlatformList(this.formData.mobilePhone)
        this.getPlatformList.then(res => {
          this.list = res || []
          console.log(res, "获取的列表")
          this.$emit("loadSuccess", res)
          if (res.customerList.length > 0) {
            this.list = res.customerList;
          }
        }).finally(() => {
          setTimeout(() => {
            this.getPlatformList = null
          }, 500);
        })
      },
      showBench() {
        let ref = "popup";
        this.$refs[ref].show();
        this.$emit("showBench")
      },
      hideBench() {
        let ref = "popup";
        this.$refs[ref].dismiss();
        this.$emit("closeBench")
      },
      selectOrganize({
        currentTarget
      }) {
        let ref = "popup";
        let item = currentTarget.dataset.item;
        this.$emit("selected", item)
        this.$refs[ref].dismiss();
      },
      popupChange(e) {
        this.$emit("popupChange", e.show)
      },
      hideTips(){
        let ref = "popupTips";
            this.$refs[ref].dismiss();
      }
    },
  });
  export default pageOption;
</script>

<style lang="scss">
  // 弹出框
  .popup-content {
    background: #ffffff;
    border-radius: 20rpx 20rpx 0px 0px;
    padding-top: 50rpx;
    padding-left: 55rpx;
    padding-right: 55rpx;
    padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
    position: relative;

    .scroll-view-info {
      height: 650rpx;
      width: 100%;
    }

    .organize-item {
      padding: 36rpx 36rpx 36rpx 28rpx;
      border-bottom: 2rpx solid #E1E1E1;

      &>view:first-child {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .structureName,
      .parentStructureName {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .organize-icon {
        width: 62rpx;
        height: 62rpx;
        overflow: hidden;
        border-radius: 50%;
        margin-right: 24rpx;
        flex-shrink: 0;
      }

      .arrow-right {
        display: inline-block;
        width: 18rpx;
        height: 18rpx;
        border-top: 4rpx solid rgba(0, 0, 0, 0.9);
        border-right: 4rpx solid rgba(0, 0, 0, 0.9);
        transform: rotate(45deg);
        flex-shrink: 0;
      }

      .selected {
        width: 108rpx;
        height: 39rpx;
        border-radius: 7rpx;
        background: #F3F3F3;
        color: #8B8B8B;
      }
    }
  }

  .empty-list {
    height: 650rpx;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .empty-icon {
      width: 254rpx;
      height: 254rpx;
      margin-bottom: 47rpx;
      margin: 0 auto;
    }
  }

  .popup-content-tips {
    width: 600rpx;
    border-radius: 22rpx;
    background: #ffffff;

    .popup-title {
      display: flex;
      flex-direction: row;
      justify-content: center;
      padding-top: 25rpx;
      font-size: 32rpx;
      color: $uni-main-color;
    }

    .popup-info {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 40rpx;
      font-size: 28rpx;
      text-align: center;
    }

    .popup-button {
      color: $uni-main-color;
      height: 90rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      border-top-color: #f5f5f5;
      border-top-style: solid;
      border-top-width: 1px;
      font-size: 32rpx;
    }
  }
</style>