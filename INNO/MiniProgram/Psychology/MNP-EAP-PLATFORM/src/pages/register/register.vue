<template>
  <view>
    <view v-if="!showLoading" class="information">
      <page-nav isHideHome hideBtn></page-nav>
      <view class="box">
        <view class="perfect_info">
          <view class="title">
            <view>进入测评前</view>
            <view>请先确认你的个人信息</view>
          </view>
          <view class="item">
            <view class="label">姓名</view>
            <ori-input maxlength="15" @onInput="(e) => onInput(e, 'realName')" :value="formData.realName"
              placeholder="请输入" placeholderClass="hold-style" class="input content"
              boxStyle="padding:25rpx 0;min-height:60rpx"></ori-input>
          </view>
          <template v-if="canInputPhone && !mobilePhone">
            <view class="item relative">
              <view class="label">手机号</view>
              <ori-input maxlength="11" @onInput="(e) => onInput(e, 'mobilePhone')" :value="formData.mobilePhone"
                placeholder="请输入手机号" placeholderClass="hold-style" class="input content"
                boxStyle="padding:25rpx 0;min-height:60rpx"></ori-input>
              <auth-button class="authorized_phone absolute" :auth="true" :openType="openType"
                @getphonenumber="getPhoneNumber"><text class="authorized">{{
              mobilePhone ? "重新授权" : "授权"
            }}</text>
              </auth-button>
            </view>
          </template>
          <template v-else>
            <view class="item relative">
              <view class="label">手机号</view>
              <view class="content p-t-25 p-b-25 flex-b-c">
                <text :style="{ opacity: `${mobilePhone}` ? '1' : '0.1' }">{{
              mobilePhone ? _phoneEllipsis(mobilePhone) : "授权获取手机号"
            }}</text>
                <text class="authorized">{{
              mobilePhone ? "重新授权" : "授权"
            }}</text>
              </view>
              <auth-button v-if="!isTest" class="authorized_phone_button absolute" :auth="true" :openType="openType"
                @getphonenumber="getPhoneNumber">
              </auth-button>
            </view>
          </template>
          <view class="item">
            <view class="label">性别</view>
            <ori-picker @pickerChange="(e) => pickerChange(e, 'gender')" range-key="genderName" :mode="mode.school"
              :range="genderRange" :pickerValue="picker_value_gender">
              <template v-slot:content>
                <div class="flex-b-c content">
                  <view>
                    <template v-if="picker_value_gender >= 0">
                      <text>{{
                        genderRange[picker_value_gender].genderName
                      }}</text>
                    </template>
                    <view v-else class="place">请选择</view>
                  </view>
                  <view class="switch font-32">选择</view>
                </div>
              </template>
            </ori-picker>
          </view>
          <view class="item">
            <view class="label">婚姻状况</view>
            <ori-picker @pickerChange="(e) => pickerChange(e, 'marriage')" range-key="marriageName" :mode="mode.school"
              :range="marriageRange" :pickerValue="picker_value_marriage">
              <template v-slot:content>
                <div class="flex-b-c content">
                  <view>
                    <template v-if="picker_value_marriage >= 0">
                      <text>{{
                        marriageRange[picker_value_marriage].marriageName
                      }}</text>
                    </template>
                    <view v-else class="place">请选择</view>
                  </view>
                  <view class="switch font-32">选择</view>
                </div>
              </template>
            </ori-picker>
          </view>
          <view class="tips C_7f7f7f font-20">{{ tips }}</view>
          <view class="btn-box flex-c-s fixed">
            <view class="btn flex-c-c" @click="confirm">确认信息</view>
          </view>
        </view>
      </view>
    </view>
    <view v-else class="loading flex-c-c">
      <loading-view></loading-view>
    </view>
    <platform-select ref="pls" @selected="selectPlatform" :formData="platformFormData"></platform-select>
  </view>
</template>

<script>
  import LoadingView from '@/components/css3/loading/loading.vue';
  import AuthButton from "@/components/auth-button/auth-button.vue";
  import oriPicker from "@/components/ori-comps/picker/ori-picker.vue";
  import oriInput from "@/components/ori-comps/input/ori-input.vue";
  import platformSelect from "@/components/platform-select/platform-select"
  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      oriPicker,
      oriInput,
      AuthButton,
      LoadingView,
      platformSelect
    },
    data() {
      return {
        showLoading: true,
        isTest: false,
        formData: {
          gender: "",
          marriage: "",
          realName: "",
          mobilePhone: "",
        },
        platformFormData: {
          mobilePhone: "",
        },
        mobilePhone: "",
        mode: {
          grade: "multiSelector",
          school: "selector",
        },
        openType: "getPhoneNumber",
        lockPage: false,
        genderRange: [
          // {
          //   genderName: "保密",
          //   value: 0,
          // },
          {
            genderName: "男",
            value: 1,
          },
          {
            genderName: "女",
            value: 2,
          },
        ],
        picker_value_gender: -1,
        marriageRange: [

          {
            marriageName: "未婚",
            value: 1,
          },
          {
            marriageName: "已婚",
            value: 2,
          },
          {
            marriageName: "离异",
            value: 3,
          },
          {
            marriageName: "丧偶",
            value: 4,
          }
          // {
          //   marriageName: "其它",
          //   value: 0,
          // },
        ],
        picker_value_marriage: -1,
        tips: "为了确保本次测评结果有效性请认真确认个人信息",
        curRecordId: 0,
        canInputPhone: false,
        platformSelectedInfo: {}
      };
    },
    onLoad(options) {
      this.options = options || {};
    },
    onShow() {
      console.log(this);
      this.init();
    },
    methods: {
      init() {
        // 确保该页面在账号登陆配置时，不展示，不可用
        app.Sysm.getSysConf("can_input_phone",true).then((res) => {
          let canInputPhone = res == 1;
          if (this.mobilePhone) return
          this.canInputPhone = canInputPhone;
          this.showLoading = false
        });
      },
      getPhoneNumber({
        e
      }) {
        return this.$Http(this.$Apis.getPhoneNumberPlatform, {
          data: {
            code: e.detail.code || "",
            encryptedData: e.detail.encryptedData || "",
            iv: e.detail.iv || "",
            sessionId: app.LM.sessionId || 0,
          },
          other: {
            isShowLoad: true,
          },
        }).then((res) => {
          delete this.formData.mobilePhone;
          this.canInputPhone = false;
          this.mobilePhone = res.data || "";
        });
      },
      pickerChange(e, type) {
        if (type == "gender") {
          // 性别选择
          this.picker_value_gender = e.detail.value;
          let item = this.genderRange[this.picker_value_gender] || {};
          this.formData.gender = item.value || 0;
        } else if (type == "marriage") {
          // 婚姻状况选择
          this.picker_value_marriage = e.detail.value;
          let item = this.marriageRange[this.picker_value_marriage] || {};
          this.formData.marriage = item.value || 0;
        }
      },
      columnchange(e) {
        let detail = e.detail || {};
        if (detail.column == 0) {
          this.$set(this.classRange, 1, this.oriClassArr[detail.value || 0]);
        }
      },
      confirm(e) {
        if (this.lockPage) return;
        let invalid = this.checkValid();
        if (invalid) {
          app.SMH.showToast({
            title: invalid,
          });
          return;
        }
        this.loadPlatFormList()
      },
      loadPlatFormList() {
        this.platformFormData = {
          mobilePhone: this.mobilePhone || this.formData.mobilePhone,
        }
        this.$nextTick(() => {
          this.$refs.pls.loadData()
        })

      },
      updateUserInfo() {
        this.lockPage = true;
        let reqData = this.formData;

        let api = "";

        api = this.$Apis.register
        reqData.sessionId = app.LM.sessionId;

        return this.$Http(api, {
            data: {
              ...this.formData,
            },
            other: {
              isShowLoad: true,
            },
          })
          .then((res) => {
            if (res.code == 1) {
              app.SMH.showToast({
                title: "新建成功",
              });

              return res;
            }
            return Promise.reject(res);
          })
          .catch((e) => {
            return Promise.reject(e);
          }).finally(() => {
            this.lockPage = false;
          });
      },
      checkValid() {
        if (!this.formData.realName) {
          return "请输入姓名";
        }
        if (this.canInputPhone && !this.formData.mobilePhone) {
          return "请先输入手机号";
        }
        if (this.canInputPhone && this.formData.mobilePhone && (!/^1[123456789]\d{9}$/.test(this.formData
            .mobilePhone))) {
          return "请先输入正确的手机号";
        }
        if (!this.canInputPhone && !this.mobilePhone) {
          return "请先授权手机号";
        }
        if (!this.formData.gender && this.formData.gender !== 0) {
          return "请选择性别";
        }
        if (!this.formData.marriage && this.formData.marriage !== 0) {
          return "请选择婚姻状况";
        }
      },
      onInput(e, type) {
        let detail = e.detail || {};
        let value = detail.value;
        this.formData[type] = value;
      },
      selectPlatform(e) {

        app.PLM.savePlatformInfo(e);
        this.updateUserInfo().then(() => {
          this._checkLogin(null, false).then((isLogin) => {
            if (isLogin) {
              this.backAction();
            } else {
              console.log("登陆失败")
            }
          })
        })
      }
    },
  });
  export default pageOption;
</script>

<style lang="scss" scpoed>
  .loading {
    width: 100%;
    height: 100vh;
  }

  .information {
    .box {
      .perfect_info {
        padding: 64rpx;
        padding-bottom: 200rpx;

        .actInfo {
          font-size: 26rpx;
          color: #b2b2b2;
          padding-bottom: 20rpx;
        }

        .title {
          font-size: 46rpx;
          color: #222222;
          padding-bottom: 5rpx;

          &>view:last-child {
            margin-top: 30rpx;
            font-weight: bold;
          }
        }

        .item {
          padding-top: 40rpx;
          border-bottom: 1px solid rgba($color: #979797, $alpha: 0.63);

          .label {
            font-size: 26rpx;
            color: #b2b2b2;
          }

          .content {
            padding: 25rpx 0;
            font-size: 42rpx;
            color: #222222;

            &.input {
              padding: 0;
            }
          }

          .place {
            opacity: 0.1;
          }

          .switch {
            color: $uni-main-color;
          }

          .organize-icon {
            width: 66rpx;
            height: 66rpx;
            overflow: hidden;
            border-radius: 50%;
            margin-right: 24rpx;
            flex-shrink: 0;
          }

          .iden {
            height: 80rpx;
            font-size: 28rpx;
            border-radius: 100rpx;
            background: #fafafa;

            &.active {
              color: #fff;
              background-color: $uni-main-color;
            }
          }

          &.iden-box {
            padding-bottom: 40rpx;
          }

          .authorized_phone_button {
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            z-index: 2;

            button {
              padding: 0;
            }
          }

          .authorized_phone {
            top: 50%;
            right: 0;
            z-index: 2;

            button {
              padding: 0;
            }
          }

          .authorized {
            color: $uni-main-color;
            font-size: 32rpx;
          }
        }

        .tips {
          padding-top: 30rpx;
        }

        .btn-box {
          width: 100%;
          height: 200rpx;
          box-sizing: border-box;
          padding-top: 40rpx;
          left: 0;
          bottom: 0;
          background-color: #fff;

          .btn {
            width: 400rpx;
            height: 100rpx;
            border-radius: 50rpx;
            background-color: $uni-main-color;
            color: #fff;
          }
        }
      }

      .hold-style {
        color: #e9e9e9;
      }
    }
  }
</style>