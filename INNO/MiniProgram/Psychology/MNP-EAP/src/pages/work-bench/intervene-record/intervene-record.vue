<template>
  <view class="reserve-supervise">
    <page-nav>
      <template slot="title">
        <view>干预记录</view>
      </template>
    </page-nav>
    <view class="form-list">
      <view class="text-area-input">
        <textarea placeholder="请在此输入" v-model="formData.remark" placeholder-style="color:#DDDDDD;"
          :maxlength="maxlength"></textarea>
        <view class="select-hotkey flex-s-c" @click="showHotKey">
          <image :src="staticAddress+hotKeyIcon" mode="widthFix" />
          <view class="font-28 C_7f">使用快捷键输入</view>
        </view>
      </view>
      <view class="input-panel flex-s-c">
        <view class="input-title">干预对象</view>
        <view class="referrals-name">{{_nameEllipsis(options.memberName)}}</view>
      </view>
      <ori-picker @pickerChange="(e) => pickerChange(e, 'superviseType')" range-key="interventionName" mode="selector"
        :range="superviseTypeGroup" :pickerValue="superviseTypeValue">
        <template v-slot:content>
          <view class="input-panel flex-b-c">
            <view class="flex flex1">
              <view class="input-title">干预方式</view>
              <view class="flex1">{{superviseTypeGroup[superviseTypeValue].interventionName || ''}}</view>
            </view>
            <view class="font-26 m-l-13 C_80abae">
              选择
            </view>
          </view>
        </template>
      </ori-picker>

      <view class="input-panel flex-b-c" @click="showDatePicker">
        <view class="flex flex1">
          <view class="input-title">干预日期</view>
          <view class="flex1">{{formData.interventionDate}}</view>
        </view>
        <view class="font-26 m-l-13 C_80abae">
          选择
        </view>
      </view>
      <u-calendar title="干预日期" :closeOnClickOverlay="true" round="30" :show="showDate" @confirm="selectDate"
        @close="closeDatePicker" :monthNum="6"></u-calendar>
    </view>
    <view class="bottom-area flex-c-c">
      <view class="submit-button flex-c-c font-30" @click="submitForm">
        提交
      </view>
    </view>
    <ori-popup @touchmove.stop.prevent="disabledScroll" ref="popup" type="bottom" :is-mask-click="true"
      :safe-area="false">
      <template v-slot:content>
        <view class="popup-content">
          <view class="popup-title">
            <view class="font-28 C_333">
              快捷输入
            </view>
            <image class="close-icon" :src="staticAddress+closeIcon" mode="widthFix" @click="closePupup" />
          </view>
          <view>
            <ori-scroll-view :refresh="false" customStyle="height: 550rpx;width: 100%;">
              <view @click="hotKeySel(item.content||'')" class="hot-key-item" v-for="(item,index) in fastWords" :key="index">{{item.content||''}}</view>
            </ori-scroll-view>
          </view>
        </view>
      </template>
    </ori-popup>
  </view>
</template>

<script>
  import oriPopup from "@/components/ori-comps/popup/ori-popup";
  import oriPicker from "@/components/ori-comps/picker/ori-picker.vue";
  import SMH from "@/common/helper/show-msg-handler.js";
  // import OriScrollView from "@/components/ori-comps/scroll/ori-scroll-view.vue"
  import oriScrollView from "@/components/ori-comps/scroll/ori-scroll-view.vue"

  const app = getApp();
  const pageOption = Page.BasePage({ 
    data() {
      return {
        maxlength:200,
        closeIcon: "/close-popup-icon.png",
        hotKeyIcon: "/hot-key.png",
        TESTDATA:["经评估，该对象又明显好转，达到解除心理预警条件。","经评估，该对象又明显好转，达到解除心理预警条件。"],
        formData: {
          serviceId: "",
          remark: "",
          interventionDate: ""
        },
        superviseTypeGroup:[],
        fastWords:[],
        isLoading:false, 
        superviseTypeValue: -1,
        showDate: false
      }
    },
    components: {
      oriPicker,
      oriPopup,
      oriScrollView
    },
    methods: {
      disabledScroll() {
        return
      },
      init() {
        this.getAllWarningInterventionInfos();
        this.getWarningInterventionShortcutList();
      },
      getAllWarningInterventionInfos(){
        return this.$Http(this.$Apis.getAllWarningInterventionInfos, {
          data:{}
        }).then(res=>{
          if(res.code){
            this.superviseTypeGroup = res.data||[];
          }
          return res
        })
      },
      getWarningInterventionShortcutList(){ 
        return this.$Http(this.$Apis.getWarningInterventionShortcutList, {
          data:{}
        }).then(res=>{
          if(res.code){
            this.fastWords = res.data||[];
          }
          return res
        })
      },
      pickerChange({
        detail
      }, type) {
        if (type == "superviseType") {
          this.superviseTypeValue = detail.value;
          this.formData.serviceId = String(this.superviseTypeGroup[this.superviseTypeValue].id) || "";
        }
      },
      checkForm() {
        let msg = "";
        let formData = this.formData;
        if(!formData.remark){
          msg = "请填写记录详情"
        }else if (!formData.serviceId) {
          msg = "请选择干预方式"
        } else if (!formData.interventionDate) {
          msg = "请选择干预日期"
        }
        if (msg) {
          SMH.showToast({
            title: msg,
          });
          return false
        } else {
          return true
        }

      },
      submitForm() {
        if (this.checkForm()) {
          this.submitRecord();
        }
      },
      submitRecord(){
        if(this.isLoading)return
        this.isLoading = true;
        return this.$Http(this.$Apis.submitRecord, {
          data:{
            "assessSuggest": this.formData.remark.slice(0,this.maxlength),
            "customerId": 0,
            "recordId": 0,
            "interventionId": this.superviseTypeGroup[this.superviseTypeValue].id,
            "interventionTime": this.formData.interventionDate||"",
            "structureId": this.options.structureId||0,
            "userId": this.options.userId||0,
            "warningLevel": this.options.warningLevel||0,
          }
        }).then(res=>{
          if(res.code){
            app.SMH.showToast({
              title:"提交成功"
            })
          }
          setTimeout(() => {
            this.backAction();
          }, 500);
        }).finally(()=>{
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        })
      },
      showDatePicker() {
        this.showDate = true
      },
      closeDatePicker() {
        this.showDate = false
      },
      selectDate(e) {
        console.log(e)
        this.$set(this.formData, "interventionDate", e[0] ? e[0] : "")
        this.showDate = false
      },
      showHotKey() {
        let ref = "popup";
        this.$refs[ref].show();
      },
      closePupup() {
        let ref = "popup";
        this.$refs[ref].dismiss();
      },
      hotKeySel(words){
        this.formData.remark = this.formData.remark + (words||"");
        this.closePupup();
      }
    },
    onLoad(options) { 
      this.options = options;
      this.init()
    }
  })
  export default pageOption
</script>

<style lang="scss" scoped>
  .reserve-supervise {
    min-height: 100vh;
    background-color: #F7F7F7;

    .form-list {
      // padding: 30rpx 25rpx calc(env(safe-area-inset-bottom) + 165rpx);
      padding: 30rpx 25rpx 165rpx;

      .input-panel {
        box-sizing: border-box;
        padding: 0 30rpx;
        height: 130rpx;
        background-color: #FFFFFF;
        width: 100%;
        border-radius: 20rpx;
        margin-bottom: 20rpx;
        font-size: 28rpx;

        .input-title {
          width: 110rpx;
          margin-right: 37rpx;
          color: #7f7f7f;
          flex-shrink: 0;
        }

        .referrals-name {
          padding: 7rpx 15rpx;
          background: rgba($color: #008ACB, $alpha: 0.08);
          border-radius: 10rpx;
          color: #008ACB;
        }
      }

      .text-area-input {
        background-color: #FFFFFF;
        padding: 40rpx 36rpx 0 36rpx;
        margin-bottom: 20rpx;
        border-radius: 20rpx;

        textarea {
          width: 100%;
          height: 400rpx;
          resize: none;
          line-height: 37rpx;
          border-bottom: 2rpx solid #008ACB;
        }

        .select-hotkey {
          box-sizing: border-box;
          padding: 32rpx 16rpx;

          &>image {
            width: 48rpx;
            height: 48rpx;
            margin-right: 16rpx;
          }

        }
      }
    }
  }

  .bottom-area {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 140rpx;
    background: #FFFFFF;
    z-index: 2;

    .submit-button {
      background: $uni-main-color;
      color: #FFFFFF;
      width: 660rpx;
      height: 100rpx;
      border-radius: 16rpx;
    }
  }

  // 弹出框
  .popup-content {
    background: #ffffff;
    border-radius: 20rpx 20rpx 0px 0px;
    box-sizing: border-box;
    width: 100%;
    padding-top: 32rpx;
    padding-left: 32rpx;
    padding-right: 32rpx;
    padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(16rpx + env(safe-area-inset-bottom));

    .popup-title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 33rpx;

      .close-icon {
        width: 23rpx;
        height: 23rpx;
      }
    }

    .scroll-view-info {
      height: 550rpx;
      width: 100%;

    }
    .hot-key-item {
      width: 100%;
      box-sizing: border-box;
      padding: 35rpx 20rpx;
      background: #F4F9FA;
      border-radius: 10rpx;
      color: #333333;
      font-size: 26rpx;
      margin-bottom: 20rpx;
    }

  }
</style>