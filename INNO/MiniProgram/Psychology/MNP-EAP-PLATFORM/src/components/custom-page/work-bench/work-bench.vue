<template>
  <view>
    <ori-popup @touchmove.stop.prevent="disabledScroll" @change="popupChange" ref="popup" type="bottom"
      :is-mask-click="true" :safe-area="false">
      <template v-slot:content>
        <view class="popup-content" :style="safeArea>0?'margin-bottom:'+safeArea+'rpx;':''">
          <view>
            <view class="font-28 m-b-25">
              选择组织进入
            </view>
            <template v-if="list.length > 0">
              <scroll-view :scroll-y="true" class="scroll-view-info">
                <view v-for="(item,i) in list" :key="i" @click="selectOrganize" :data-item="item">
                  <view class="organize-item flex-b-c">
                    <view class="flex-s-c flex1" style="min-height: 0 ">
                      <image class="organize-icon" :src="staticAddress+organizeIcon" mode="widthFix" />
                      <view class="flex1 clamp">
                        <view class="font-26 clamp m-b-5">{{item.structureName}}</view>
                        <view class="font-18 C_7f clamp">{{item.parentStructureName ? item.parentStructureName : ''}}
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
                <view class="C_B2 font-32">暂无可选组织~</view>
              </view>
            </template>
          </view>
        </view>
      </template>
    </ori-popup>
  </view>
</template>

<script>
  import oriPopup from "@/components/ori-comps/popup/ori-popup";
  const app = getApp();
  const pageOption = Page.BasePage({
    name: "work-bench",
    props: {
      isChild: {
        type: Boolean,
        default: false
      },
      activityId: {
        type: Number,
        default: 0
      },
      safeArea: {
        type: Number,
        default: 0
      },
      
    },
    components: {
      oriPopup
    },
    onReady() {
      if (this.isChild) this.loadDataByAct()
    },
    computed: {},
    data() {
      return {
        organizeIcon: "/organize.png",
        emptyIcon: "/list-empty.png",
        list: [],
      };
    },
    methods: {
      loadData() {
        if (this.getStructureList) return
        this.getStructureList = app.SM.getStructureList()
        this.getStructureList.then(res => {
          this.list = res || []
          this.$emit("loadSuccess", res)
        }).finally(() => {
          setTimeout(() => {
            this.getStructureList = null
          }, 500);
        })
      },
      loadDataByAct() {
        console.log("活动组织", this.activityId)
        if (this.getStructureList) return
        let structureInfo = app.SM.structureInfo;
        this.getStructureList = app.SM.getStructureByAct
        this.getStructureList(this.activityId).then(res => {
          let list = res;
          if(list.length > 1){
            list.unshift({
              structureId: structureInfo.structureId,
              structureName: "全部",
              isAll: 1
            })
          }
          this.list = list || []
          this.$emit("loadSuccess", res)
        }).finally(() => {
          setTimeout(() => {
            this.getStructureList = null
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
        if(!this.isChild) app.SM.saveStructureInfo(item)
        this.$emit("selected", item)
        this.$refs[ref].dismiss();
      },
      popupChange(e) {
        this.$emit("popupChange", e.show)
        if (e.show && !this.isChild) {
          this.loadData()
        }
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
</style>