<template>
  <view>
    <ori-popup @change="popupChange" ref="popup" type="bottom" :is-mask-click="true" :safe-area="false">
      <template v-slot:content>
        <view class="popup-content">
          <view class="popup-content-title flex-b-c">
            <view class=" C_7f font-26">选择所属班级</view>
            <view class="success-select-picker" @click="confirmSelectPicker">
              确认
            </view>
          </view>
          <view>
            <view class="picker-view-title flex">
              <view class="picker-view-title-item">年级</view>
              <view class="picker-view-title-item">入学年份</view>
              <view class="picker-view-title-item">班级</view>
            </view>
            <picker-view v-if="visible" indicator-class="select-view-class" :value="value" @change="bindChange"
              class="picker-view">
              <picker-view-column>
                <view class="item" v-for="(item,index) in classList" :key="index">{{item.grade}}</view>
              </picker-view-column>
              <picker-view-column>
                <view class="item" v-for="(item,index) in classList[value[0]].classInfos" :key="index">
                  {{item.schoolYear}}</view>
              </picker-view-column>
              <picker-view-column>
                <view class="item" v-for="(item,index) in classList[value[0]].classInfos[value[1]].clazz" :key="index">
                  {{item.className}}</view>
              </picker-view-column>
            </picker-view>
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
    components: {
      oriPopup
    },
    data() {
      return {
        title: 'picker-view',
        value: [0, 0, 0],
        visible: true,
      }
    },
    props: {
      dataList: {
        type: Array,
        default: []
      }
    },
    computed: {
      classList() {
        let dataList = this.dataList;
        return dataList
      }
    },
    onReady() {

    },
    methods: {
      show() {
        this.$refs['popup'].show();
        this.$emit('toggleShow', true)
      },
      popupChange(e) {
        console.log(e)
      },
      confirmSelectPicker() {
        let classList = this.classList || [];
        let value = this.value || [];
        let grade = classList[value[0]].grade;
        let schoolYear = classList[value[0]].classInfos[value[1]].schoolYear;
        let classInfo = classList[value[0]].classInfos[value[1]].clazz[value[2]]
        this.$emit('selectClass', {
          grade,
          schoolYear,
          ...classInfo,
        })
        this.$refs['popup'].dismiss();
      },
      bindChange(e) {
        this.value = e.detail.value;
        console.log(e, this.value, "change")
      },
      clearSelect() {
        this.value = [0, 0, 0]
      }
    },
  })
  export default pageOption
</script>

<style lang="scss" scpoed>
  // 底部弹出框
  .popup-content {
    background: #ffffff;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    position: relative;

    .popup-content-title {
      padding: 40rpx 20rpx 40rpx 50rpx;
    }


    .scroll-item-act {
      background: rgba($color: #D8D8D8, $alpha: 0.1);
      color: #008ACB;
    }

    .success-select-picker {
      color: $uni-main-color;
      font-size: 30rpx;
      padding: 4rpx;
      // position: absolute;
      // right: 30rpx;
      // top: 20rpx;
    }

    .picker-view-title {
      width: 100%;
      height: 90rpx;
      background: rgba($color: #D8D8D8, $alpha: 0.1);

      .picker-view-title-item {
        width: 33.33%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        font-size: 26rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #121212;
        line-height: 37rpx;
      }
    }

    .picker-view {
      width: 100%;
      height: 500rpx;
    }

    .item {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .select-view-class {
      height: 100rpx;
    }
  }
</style>