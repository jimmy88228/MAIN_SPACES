<template>
  <view>
    <view v-if="!showLoading" class="information">
      <page-nav isHideHome :hideBtn="true"></page-nav>
      <view class="box">
        <view class="perfect_info">
          <view class="title">
            <view>请先完成用户注册信息</view>
          </view>
          <view class="item">
            <view class="label">姓名</view>
            <ori-input maxlength="15" @onInput="(e) => onInput(e, 'realName')" :value="formData.realName"
              placeholder="请输入" placeholderClass="hold-style" class="input content"
              boxStyle="padding:25rpx 0;height:44rpx"></ori-input>
          </view>
          <template v-if="canInputPhone && !mobilePhone">
            <view class="item relative">
              <view class="label">手机号</view>
              <ori-input maxlength="11" @onInput="(e) => onInput(e, 'mobilePhone')" :value="formData.mobilePhone"
                placeholder="请输入手机号" placeholderClass="hold-style" class="input content"
                boxStyle="padding:25rpx 0;height:44rpx"></ori-input>
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
                <text
                  :style="{ opacity: `${mobilePhone}` ? '1' : '0.1' }">{{ mobilePhone ? _phoneEllipsis(mobilePhone) : "授权获取手机号" }}</text>
                <text class="authorized">{{ mobilePhone ? "重新授权" : "授权"}}</text>
              </view>
              <auth-button v-if="!isTest" class="authorized_phone_button absolute" :auth="true"
                :openType="openType" @getphonenumber="getPhoneNumber">
              </auth-button>
            </view>
          </template>
        <!-- 性别暂时隐藏 -->
          <view class="item" v-if="false">
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
                  <view class="switch font-32 f-shrink-0">选择</view>
                </div>
              </template>
            </ori-picker>
          </view>
          <!-- 婚姻状况暂时隐藏 -->
          <view class="item" v-if="false">
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
                  <view class="switch font-32 f-shrink-0">选择</view>
                </div>
              </template>
            </ori-picker>
          </view>
          <view class="item" @click="showStructureList">
            <view class="label">所在位置</view>
            <div class="flex-b-c content">
              <template v-if="selectStr.trim().length > 0">
                <text class="p-r-20">{{selectStr}}</text>
              </template>
              <view v-else>
                <view class="place">请选择</view>
              </view>
              <view class="switch font-32 f-shrink-0">选择</view>
            </div>
          </view>
          <view class="tips C_7f7f7f font-20">{{ tips }}</view>
          <view class="btn-box flex-c-s fixed">
            <view class="btn flex-c-c" @click="confirm">确认信息</view>
          </view>
        </view>
      </view>
      <ori-popup @touchmove.stop.prevent="disabledScroll" @change="popupChange" ref="popup" type="bottom"
        :is-mask-click="true" :safe-area="false">
        <template v-slot:content>
          <view class="popup-content">
            <view class="popup-content-title flex-b-c">
              <view class=" C_7f font-26">选择所在地</view>
              <view class="success-select-picker" @click="confirmSelectPicker">
                完成
              </view>
            </view>
            <view class="flex popup-content-flex-item">
              <scroll-view :scroll-y="true" class="scroll-view-info">
                <view class="scroll-item"
                  :class="picker_value_belong[0].structureId == item.structureId ? 'scroll-item-act':''"
                  v-for="(item,i) in structureList[0]" :key="i" :data-item="item" data-select-index="0"
                  @click="changeSelect">
                  {{item.structureName}}
                </view>
              </scroll-view>
              <scroll-view :scroll-y="true" class="scroll-view-info" v-if="pickerCenter.length>0">
                <template>
                  <view class="scroll-item"
                    :class="picker_value_belong[1].structureId == item.structureId ? 'scroll-item-act':''"
                    v-for="(item,i) in pickerCenter" :key="i" :data-item="item" data-select-index="1"
                    @click="changeSelect">
                    {{item.structureName}}
                  </view>
                </template>
              </scroll-view>
              <scroll-view :scroll-y="true" class="scroll-view-info" v-if="pickerRight.length>0">
                <template>
                  <view class="scroll-item"
                    :class="picker_value_belong[2].structureId == item.structureId ? 'scroll-item-act':''"
                    v-for="(item,i) in pickerRight" :key="i" :data-item="item" data-select-index="2"
                    @click="changeSelect">
                    {{item.structureName}}
                  </view>
                </template>
              </scroll-view>
            </view>
          </view>
        </template>
      </ori-popup>
    </view>

    <view v-else class="loading flex-c-c">
      <loading-view></loading-view>
    </view>
  </view>
</template>

<script>
  import LoadingView from '@/components/css3/loading/loading.vue';
  import AuthButton from "@/components/auth-button/auth-button.vue";
  import oriPicker from "@/components/ori-comps/picker/ori-picker.vue";
  import oriInput from "@/components/ori-comps/input/ori-input.vue";
  import oriPopup from "@/components/ori-comps/popup/ori-popup";
  import SMH from "@/common/helper/show-msg-handler.js";
  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      oriPicker,
      oriInput,
      AuthButton,
      LoadingView,
      oriPopup
    },
    data() {
      return {
        showLoading: true,
        isTest: false,
        formData: {
          // gender: "",
          // marriage: "",
          realName: "",
          mobilePhone: "",
          structureId: 0
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
        structureList: [],
        picker_value_belong: [],
        old_picker_value_belong: [],
        tips: "为了确保本次测评结果有效性请认真确认个人信息",
        curRecordId: 0,
        canInputPhone: false,
      };
    },
    onLoad(options) {
      this.options = options || {};

    },
    onShow() {
      console.log(this);
      this.init();
    },
    computed: {
      pickerCenter() {
        let picker_value_belong = this.picker_value_belong;
        let structureList = this.structureList;
        let pickerCenter = []
        if (picker_value_belong[0] && structureList[1]) {
          pickerCenter = structureList[1].filter((item) => {
            return picker_value_belong[0].structureId == item.pid
          })
        }
        console.log(picker_value_belong[0], "pickerCenter")
        return pickerCenter
      },
      pickerRight() {
        let picker_value_belong = this.picker_value_belong;
        let structureList = this.structureList;
        let pickerRight = []
        if (picker_value_belong[1] && structureList[2]) {
          pickerRight = structureList[2].filter((item) => {
            return picker_value_belong[1].structureId == item.pid
          })
        }
        console.log(picker_value_belong[1], "pickerRight")
        return pickerRight
      },
      selectStr() {
        let old_picker_value_belong = this.old_picker_value_belong;
        let str = ''
        for (let i in old_picker_value_belong) {
          if (old_picker_value_belong[i] && old_picker_value_belong[i].structureName != null) {
            str = str + old_picker_value_belong[i].structureName + '-'
          }
        }
        return str.slice(0, str.length - 1)
      }
    },
    methods: {
      init() {
        // 确保该页面在账号登陆配置时，不展示，不可用
        app.Sysm.getSysConf("can_input_phone").finally(() => {
          let canInputPhone = app.Sysm.sysConf["can_input_phone"] == 1;
          if (this.mobilePhone) return
          this.canInputPhone = canInputPhone;
            this.loadUserInfo()
            this.loadStructure()
            this.showLoading = false
        });
      },
      loadUserInfo(callback) {
        return new Promise((rs, rj) => {
          rs(app.IM.authUserInfo);
        }).then((res) => {
          this.mobilePhone = res.mobilePhone || "";
          typeof (callback) == "function" && callback()
        })
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
          delete this.formData.mobilePhone;
          this.canInputPhone = false;
          this.mobilePhone = res.data || "";
        });
      },
      loadStructure() {
        return this.$Http(this.$Apis.getStructureWithChild).then((res) => {
          let structureList = []
          let arr = res.data
          // 按等级从小到大排序
          arr.sort((x, y) => {
            if (x.level < y.level) {
              return -1
            }
            if (x.level > y.level) {
              return 1
            }
            return 0
          })
          arr.forEach(item => structureList.push(item.structureWithParents))
          this.structureList = structureList;
          // 获取用户信息
          if (this.formData.structureWithParents) {
            let structureWithParents = this.formData.structureWithParents;
            this.$nextTick(() => {
              this.picker_value_belong = JSON.parse(JSON.stringify(structureWithParents))
              this.old_picker_value_belong = JSON.parse(JSON.stringify(structureWithParents))
            })
          }
        });
      },
      confirmSelectPicker() {
        console.log(this.picker_value_belong.length, "目前选项长度")
        if ((this.pickerRight.length > 0 && this.picker_value_belong.length == 2) || (this.pickerCenter.length >
            0 && this.picker_value_belong.length == 1)) {
          SMH.showToast({
            title: "请选择完下级选项噢"
          })
          return
        }
        console.log(this.picker_value_belong.slice(-1)[0], "structureId")
        this.formData.structureId = this.picker_value_belong.slice(-1)[0] && this.picker_value_belong.slice(-1)[0]
          .structureId || 0;
        this.old_picker_value_belong = JSON.parse(JSON.stringify(this.picker_value_belong))
        let ref = "popup";
        this.$refs[ref].dismiss();
      },
      changeSelect({
        currentTarget
      }) {
        console.log(currentTarget.dataset)
        let selectIndex = currentTarget.dataset.selectIndex
        let item = currentTarget.dataset.item

        this.$set(this.picker_value_belong, selectIndex, item)

        let picker_value_belong = JSON.parse(JSON.stringify(this.picker_value_belong))

        let new_picker_value_belong = picker_value_belong.filter((item, i) => {
          return i < Number(selectIndex) + 1;
        })
        console.log(new_picker_value_belong, "new_picker_value_belong")
        this.picker_value_belong = new_picker_value_belong;

      },
      popupChange(e) {
        this.picker_value_belong = JSON.parse(JSON.stringify(this.old_picker_value_belong))
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
      showStructureList() {
        let ref = "popup";
        this.$refs[ref].show();
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
        return this.updateUserInfo();
      },
      updateUserInfo() {
        this.lockPage = true;
        let reqData = this.formData;

        if (!this.canInputPhone) {
            reqData.sessionId = app.LM.sessionId;
        }
        if(!this.formData.mobilePhone){
          this.formData.mobilePhone = this.mobilePhone
        }

        return this.$Http(this.$Apis.updateUserInfo, {
              data: {
                ...this.formData,
              },
              other: {
                isShowLoad: true,
              },
            }
          )
          .then((res) => {
            if (res.code == 1) {
              app.SMH.showToast({
                title:  "注册完成",
              });
              this.backAction();
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
        // if (!this.formData.gender && this.formData.gender !== 0) {
        //   return "请选择性别";
        // }
        // if (!this.formData.marriage && this.formData.marriage !== 0) {
        //   return "请选择婚姻状况";
        // }
        if (!this.formData.structureId || this.formData.structureId == 0) {
          console.log("请选择所属地区")
          return "请选择所属地区";
        }
      },
      onInput(e, type) {
        let detail = e.detail || {};
        let value = detail.value;
        this.formData[type] = value;
      },
      authorizedPhone() {
        console.log("授权手机号");
      },
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
            font-size: 32rpx;
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

  // 底部弹出框
  .popup-content {
    background: #ffffff;
    // border-radius: 20rpx 20rpx 0px 0px;
    // padding-top: 70rpx;
    // padding-left: 20rpx;
    // padding-right: 20rpx;
    // padding-bottom: calc(16rpx + constant(safe-area-inset-bottom));
    // padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    position: relative;

    .popup-content-title {
      padding: 40rpx 20rpx 40rpx 50rpx;
      border-bottom: 1px solid #f3f3f3;
    }

    .scroll-view-info {
      height: 492rpx;
      flex: 1 1 0;
      box-sizing: border-box;
      border-right: 1px solid #f3f3f3;

      .scroll-item {
        width: 100%;
        box-sizing: border-box;
        padding: 30rpx;
        text-align: center;
      }
    }

    .scroll-view-info:last-child {
      border-right: none;
    }

    .scroll-item-act {
      background: rgba($color: #D8D8D8, $alpha: 0.1);
      color: #008ACB;
    }

    .no-picker-data {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #dcdcdc;
    }

    .success-select-picker {
      color: $uni-main-color;
      font-size: 30rpx;
      padding: 4rpx;
      // position: absolute;
      // right: 30rpx;
      // top: 20rpx;
    }
  }
</style>