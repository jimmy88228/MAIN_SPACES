<template>
  <view class="student-edit flex flex-col">
    <page-nav :full="false"></page-nav>
    <view class="edit_form">
      <view class="edit_item flex-b-c">
        <view class="font-28 shrink0 m-r-45">姓名</view>
        <view class="font-28 bold">
          <ori-input :value="formData.name" maxlength="30" @onInput="e=>onInput(e,'name')" placeholder="请输入"
            placeholderClass="hold-style" class="input content"
            boxStyle="padding:5rpx 0;height: calc(1.4rem + 40rpx);text-align: right;">
          </ori-input>
        </view>
      </view>
      <ori-picker @pickerChange="(e) => pickerChange(e, 'gender')" range-key="genderName" mode="selector"
        :range="genderRange" :pickerValue="picker_value_gender">
        <template v-slot:content>
          <view class="edit_item flex-b-c">
            <view class="font-28 shrink0 m-r-45">性别</view>
            <view class="font-28 bold">{{formData.sex}}</view>
          </view>
        </template>
      </ori-picker>
      <view class="edit_item flex-b-c">
        <view class="font-28 shrink0 m-r-45">年级</view>
        <view class="font-28 bold C_B2">{{formData.structureName}}</view>
      </view>
      <view class="edit_item flex-b-c">
        <view class="font-28 shrink0 m-r-45">学年</view>
        <view class="font-28 bold C_B2">
          <ori-input :disabled="true" :value="formData.schoolYear" @onInput="e=>onInput(e,'schoolYear')" placeholder="请输入"
            placeholderClass="hold-style" class="input content" maxlength="4" type="number"
            boxStyle="padding:5rpx 0;height: calc(1.4rem + 40rpx);text-align: right;">
          </ori-input>
        </view>
      </view>
    </view>
    <view class="bottom_button flex-c-c" @click="submitSave">保存并完成</view>
  </view>
</template>

<script>
  import oriPicker from '@/components/ori-comps/picker/ori-picker.vue';
  import oriInput from '@/components/ori-comps/input/ori-input.vue';

  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        formData: {
          name: "",
          schoolYear: 0,
          sex: "",
          userId: 0
        },
        genderRange: [{
            genderName: "未知",
            value: "未知",
          }, {
            genderName: "男",
            value: "男",
          },
          {
            genderName: "女",
            value: "女",
          },
        ],
        picker_value_gender: -1,
      };
    },
    components: {
      oriPicker,
      oriInput
    },
    computed: {},
    onLoad(options) {
      this.options = options
    },
    onReady() {
      this.loadData()
    },
    methods: {
      loadData() {
        this.$Http(this.$Apis.getStudentDetail, {
          data: {
            userId: this.options.userId
          }
        }).then(res => {
          if (res.code == 1) {
            let data = res.data;
            let picker_value_gender = this.picker_value_gender;
            this.genderRange.forEach((item, i) => {
              if (item.genderName == data.sex) {
                this.picker_value_gender = i;
              }
            })
            this.formData = data;
            this.formData.userId = this.options.userId;
          }
        })
      },
      pickerChange(e, type) {
        if (type == "gender") {
          // 性别选择
          this.picker_value_gender = e.detail.value;
          let item = this.genderRange[this.picker_value_gender] || {};
          this.formData.sex = item.value || 0;
        }
      },
      onInput(e, type) {
        let detail = e.detail || {};
        let value = detail.value;
        this.formData[type] = value;
      },
      submitSave() {
        this.$Http(this.$Apis.updateStudentDetail, {
          data: {
            ...this.formData
          }
        }).then(res => {
          if (res.code == 1) {
            this.backAction()
          }
        })
      }
    },
    onShow() {

    },
  });
  export default pageOption;
</script>

<style lang="scss">
  .student-edit {
    width: 100%;
    min-height: 100vh;
    background: #F7F7F7;
  }

  .edit_form {
    padding: 35rpx;

    .edit_item {
      width: 100%;
      height: 132rpx;
      box-sizing: border-box;
      background: #FFFFFF;
      border-radius: 10rpx;
      margin-bottom: 23rpx;
      padding: 0 45rpx;
    }
  }

  .bottom_button {
    position: fixed;
    bottom: 33rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 680rpx;
    height: 110rpx;
    background: #21B014;
    border-radius: 10rpx;
    color: #FFFFFF;
    font-size: 36rpx;
  }
</style>