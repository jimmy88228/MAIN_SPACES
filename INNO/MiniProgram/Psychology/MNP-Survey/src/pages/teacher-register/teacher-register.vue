<template>
  <view class="information">
    <image class="green-bg" :src="requireStatic('/green-bg.png')" mode="widthFix" />
    <page-nav isHideHome :isTransparent="true"></page-nav>
    <view class="custom-title" :style="{'height':allHeight+'px'}">填写信息</view>
    <view class="box" :style="{'height':`calc(100vh - ${navHeight}px)`}">
      <view class="perfect_info">
        <view class="title">
          <view>Hi 老师好</view>
          <view>请授权手机号进入</view>
        </view>
        <view class="font-26 C_B2 p-b-20">教师手机号需匹配后台录入的手机号</view>
        <view class="item relative">
          <view class="content p-t-25 p-b-25">
            <text :style="{ opacity: `${mobilePhone}` ? '1' : '0.1' }">{{mobilePhone ? mobilePhone : "授权手机号"}}</text>
            <auth-button class="authorized_phone absolute" :auth="true" :openType="openType"
              @getphonenumber="getPhoneNumber">
            </auth-button>
          </view>
        </view>
        <view class="tips C_7f7f7f font-20">{{tips}}</view>
        <view class="btn-box flex-c-s">
          <view class="btn flex-c-c relative">
            授权手机号
            <auth-button class="authorized_phone absolute" :auth="true" :openType="openType"
              @getphonenumber="getPhoneNumber">
            </auth-button>
          </view>
        </view>
      </view>
    </view>
    <work-bench ref="workBench" @selected="selectClass"></work-bench>
  </view>
</template>

<script>
  import oriPicker from '@/components/ori-comps/picker/ori-picker.vue';
  import oriInput from '@/components/ori-comps/input/ori-input.vue';
  import SIH from "@/common/helper/sys-infos-handler"
  import workBench from "@/components/custom-page/work-bench/work-bench"
  import SMH from "@/common/helper/show-msg-handler.js"
  import AuthButton from "@/components/auth-button/auth-button.vue";
  import ScanCode from '@/common/helper/scan-code-handler.js';


  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      oriPicker,
      oriInput,
      workBench,
      AuthButton
    },
    data() {
      return {
        allHeight: SIH.navPlace + SIH.statusBarHeight,
        navHeight: SIH.navPlace,
        formData: {
          account: "",
          password: ""
        },
        mobilePhone: "",
        lockPage: false,
        openType: "getPhoneNumber",
      }
    },
    onLoad(options) {
      this.options = options || {};
    },
    onReady() {

    },
    onShow() {
      this.init();
    },
    methods: {
      init() {

      },
      confirm(e) {
        if (this.lockPage) return;
        let invalid = this.checkValid();
        if (invalid) {
          app.SMH.showToast({
            title: invalid
          })
          return
        };
        return this.bindTeacherByPhone();
      },
      getPhoneNumber({
        e
      }) {
        return this.$Http(this.$Apis.getPhoneNumber, {
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
          this.mobilePhone = this._phoneEllipsis(res.data) || "";
          this.bindTeacherByPhone()
        });
      },
      bindTeacherByPhone() {
        this.lockPage = true;
        return this.$Http(this.$Apis.bindTeacherByPhone, {
          data: {
            sessionId: app.LM.sessionId || 0,
          },
          other: {
            isShowLoad: true
          }
        }).then(res => {
          if (res.code == 1) {
            if (!app.LM.recordId) {
              app.LM.savePrivateInfo({
                recordId: res.data || ''
              });
              this._getAuthUserInfo();
              app.IM.getTeacherUserInfo();
            }
            app.SMH.showToast({
              title: "绑定成功"
            });
            app.IM.checkBindTeacher().then(teacherInfo => {
              console.log(teacherInfo, "teacherInfo")
              if (ScanCode.currScanInfo.sceneOption) {
                this.reLaunchAction(`/pages/startup/startup`)
              } else {
                if (teacherInfo.roleType == "class_teacher") {
                  // 班主任
                  app.SM.saveStructureInfo(teacherInfo.classList[0])

                  if (teacherInfo.classList.length == 0) {
                    SMH.showToast({
                      title: "请先到后台绑定班级"
                    })
                    setTimeout(() => {
                      this.reLaunchAction(`/pages/user-type-select/user-type-select`)
                    }, 300);
                  } else if (teacherInfo.classList.length == 1) {
                    this.reLaunchAction(`/pages/work-bench/work-bench-detail/work-bench-detail`)
                  } else {
                    let ref = "workBench";
                    this.$refs[ref].loadData()
                  }
                } else {
                  // 心理老师或者普通老师
                  this.reLaunchAction(`/pages/work-bench/work-bench-detail/work-bench-detail`)
                }
              }
            }).catch(err => {})
            return res
          }
          return Promise.reject(res)
        }).catch(e => {
          return Promise.reject(e);
        }).finally(() => {
          this.lockPage = false;
        })
      },
      checkValid() {
        if (!this.formData.account) {
          return "请输入账号/手机号"
        } else if (!this.formData.password) {
          return "请输入密码"
        }
      },
      onInput(e, type) {
        let detail = e.detail || {};
        let value = detail.value;
        this.formData[type] = value;
      },
      showOrganizeLsit() {
        let ref = "workBench";
        this.$refs[ref].showBench();
      },
      selectClass() {
        this.reLaunchAction(`/pages/work-bench/work-bench-detail/work-bench-detail`)
      },
    },
  })
  export default pageOption
</script>

<style lang="scss" scpoed>
  .information {
    .green-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: -1;
    }

    .custom-title {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: -1;
    }

    .box {
      display: flex;
      align-items: center;

      .perfect_info {
        width: 100%;
        padding: 64rpx;
        padding-bottom: 200rpx;

        .title {
          font-size: 46rpx;
          color: #222222;
          padding-bottom: 5rpx;
          margin-bottom: 20rpx;

          &>view:first-child {
            line-height: 100rpx;
          }
        }

        .item {
          padding-top: 100rpx;
          border-bottom: 1px solid rgba($color: #979797, $alpha: 0.3);

          .label {
            font-size: 26rpx;
            color: #B2B2B2;
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

          .iden {
            height: 80rpx;
            font-size: 28rpx;
            border-radius: 100rpx;
            background: #FAFAFA;

            &.active {
              color: #fff;
              background-color: $uni-main-color;
            }
          }

          &.iden-box {
            padding-bottom: 40rpx;
          }

        }

        .tips {
          padding-top: 30rpx;
        }

        .btn-box {
          width: 100%;
          height: 200rpx;
          box-sizing: border-box;
          padding-top: 133rpx;
          left: 0;
          bottom: 0;
          background-color: #fff;

          .btn {
            width: 600rpx;
            height: 120rpx;
            border-radius: 60rpx;
            background-color: $uni-main-color;
            color: #fff;
          }
        }
      }

      .hold-style {
        color: #E9E9E9;
      }
    }
  }

  .authorized_phone {
    width: 100%;
    height: 100%;
    z-index: 2;
    top: 0;
    left: 0;

    button {
      padding: 0;
    }
  }
</style>