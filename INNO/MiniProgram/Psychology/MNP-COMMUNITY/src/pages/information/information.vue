<template>
  <view>
    <page-nav :full="true" isHideHome :hideBtn="!isLogin"></page-nav>
    <view v-if="!showLoading" :style="navStyle" class="information">
      <view class="box">
        <view class="perfect_info">
          <view class="title" v-if="!isLogin">
            <view>进入测评前</view>
            <view>请先确认你的个人信息</view>
          </view>
          <view class="item">
            <view class="label">头像</view>
            <view class="content">
              <auth-button class="avatar-wrapper" :onlyPath="true" @chooseavatar="chooseavatar" open-type="chooseAvatar">
                <image v-if="avatar.url" class="avatar" :src="avatar.url"></image>
                <image v-else-if="formData.profilePicture" class="avatar" :src="formData.profilePicture"></image>
              </auth-button>
            </view>
          </view>
          <view class="item">
            <view class="label">姓名</view>
            <ori-input maxlength="15" @onInput="(e) => onInput(e, 'realName')" :value="formData.realName"
              placeholder="请输入" placeholderClass="hold-style" type="nickname" class="input content"
              boxStyle="padding:25rpx 0;height:44rpx"></ori-input>
          </view>
          <template v-if="canInputPhone && !mobilePhone">
            <view class="item relative">
              <view class="label">手机号</view>
              <ori-input maxlength="11" @onInput="(e) => onInput(e, 'mobilePhone')" :value="formData.mobilePhone"
                placeholder="请输入手机号" placeholderClass="hold-style" class="input content"
                boxStyle="padding:25rpx 0;height:44rpx"></ori-input>
              <auth-button class="authorized_phone absolute" @clicked="()=>{attemptGetPhone = true}" :auth="true"
                :openType="openType" @getphonenumberErr="()=>{attemptGetPhone = false}" @getphonenumber="getPhoneNumber"><view class="authorized">
                  <view class="loading" :style="attemptGetPhone && 'opacity:1;'"></view>
                  <text
                    :style="{'opacity':`${attemptGetPhone && 0}`,'transition':'opacity 0.3s'}">{{ mobilePhone ? "重新授权" : "授权"}}</text>
                </view>
              </auth-button>
            </view>
          </template>
          <template v-else>
            <view class="item relative">
              <view class="label">手机号</view>
              <view class="content p-t-25 p-b-25 flex-e-c">
                <text
                  :style="{ opacity: `${mobilePhone}` ? '1' : '0.1' }">{{ mobilePhone ? _phoneEllipsis(mobilePhone) : "授权获取手机号" }}</text>
                <view class="authorized">
                  <view class="loading" :style="attemptGetPhone && 'opacity:1;'"></view>
                  <text
                    :style="{'opacity':`${attemptGetPhone && 0}`,'transition':'opacity 0.3s'}">{{ mobilePhone ? "重新授权" : "授权"}}</text>
                </view>
              </view>
              <auth-button v-if="!isLogin || !isTest" class="authorized_phone_button absolute" :auth="true"
                :openType="openType" @clicked="()=>{attemptGetPhone = true}" @getphonenumberErr="()=>{attemptGetPhone = false}" @getphonenumber="getPhoneNumber">
              </auth-button>
            </view>
          </template>
          <ori-picker @pickerChange="(e) => pickerChange(e, 'gender')" range-key="genderName" :mode="mode.school"
            :range="genderRange" :pickerValue="picker_value_gender">
            <template v-slot:content>
              <view class="item">
                <view class="label">性别</view>
                <div class="flex-e-c content">
                  <view>
                    <template v-if="picker_value_gender >= 0">
                      <text>{{
                        genderRange[picker_value_gender].genderName
                      }}</text>
                    </template>
                    <view v-else class="place">请选择</view>
                  </view>
                  <view class="arrow"></view>
                </div>
              </view>
            </template>
          </ori-picker>
          <ori-picker @pickerChange="(e) => pickerChange(e, 'marriage')" range-key="marriageName" :mode="mode.school"
            :range="marriageRange" :pickerValue="picker_value_marriage">
            <template v-slot:content>
              <view class="item">
                <view class="label">婚姻状况</view>
                <div class="flex-e-c content">
                  <view>
                    <template v-if="picker_value_marriage >= 0">
                      <text>{{
                        marriageRange[picker_value_marriage].marriageName
                      }}</text>
                    </template>
                    <view v-else class="place">请选择</view>
                  </view>
                  <view class="arrow"></view>
                </div>
              </view>
            </template>
          </ori-picker>
          <view class="item" @click="showStructureList">
            <view class="label">所在位置</view>
            <div class="flex-e-c content">
              <template v-if="selectStr.trim().length > 0">
                <text>{{selectStr}}</text>
              </template>
              <view v-else>
                <view class="place">请选择</view>
              </view>
              <view class="arrow"></view>
            </div>
          </view>
          <view class="btn-box flex-c-s fixed">
            <view v-if="(canInputPhone && !isLogin) || !isTest" class="btn flex-c-c" @click="confirm">保存</view>
            <view v-else class="btn flex-c-c" style="background-color:#8f8f8f" @click="confirm">保存</view>
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
  import SIH from "@/common/helper/sys-infos-handler"
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
        navStyle: `padding-top: ${SIH.navPlace}px;`,
        showLoading: true,
        isTest: false,
        isLogin: false,
        formData: {
          avatarUrl: "",
          gender: "",
          marriage: "",
          realName: "",
          mobilePhone: "",
          structureId: 0
        },
        // 新获取头像
        avatar:{
          path:'',
          url:''
        },
        // 是否正在获取手机号
        attemptGetPhone: false,
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
        this.isLogin = app.LM.isLogin;
        // 确保该页面在账号登陆配置时，不展示，不可用
        app.Sysm.getSysConf("can_input_phone").finally(() => {
          let canInputPhone = app.Sysm.sysConf["can_input_phone"] == 1;
          if (this.mobilePhone) return
          this.canInputPhone = canInputPhone;
          if (this.isLogin) {
            this.loadUserInfo(this.loadStructure)
          } else {
            this.loadStructure()
            this.showLoading = false
          };
        });
      },
      getPhoneNumber({
        e
      }) {
        if (e.detail.iv) {
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
            this.attemptGetPhone = false;
            app.SMH.showToast({
              title:'授权成功'
            })
          });
        }
        
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
            // structureWithParents.forEach((item, i) => {
            //   let e = {
            //     currentTarget: {
            //       dataset: {
            //         selectIndex: i,
            //         item: item
            //       }
            //     }
            //   }
            //   this.changeSelect(e)
            // })
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

        // console.log(e, "popupChange",this.old_picker_value_belong != this.picker_value_belong)
        // if(e.show == false && this.old_picker_value_belong != this.picker_value_belong){
        // console.log("不一样")
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
      loadUserInfo(callback) {
        return new Promise((rs, rj) => {
          rs(app.IM.authUserInfo);
        }).then((res) => {
          let data = {
            ...this.formData,
            ...res
          } || {};
          let isTest = app.IM.authUserInfo.isTest == 1;
          this.mobilePhone = res.mobilePhone || "";
          this.isTest = isTest;
          if (!isTest) {
            // "非测试流程不需要手机参数，直接从授权处获取"
            delete data.mobilePhone;
          }
          // 由于之前是有未知选项为了确保之前选了未知选项的用户能正常使用筛选了一下，如果没有该选项改为空值
          let selectGender = this.genderRange.filter((item, index) => {
            item.index = index;
            return item.value === data.gender;
          });
          if (!!selectGender[0]) {
            this.picker_value_gender = selectGender[0].index;
          } else {
            this.picker_value_gender = -1;
            data.gender = "";
          }

          let selectMarriage = this.marriageRange.filter((item, index) => {
            item.index = index;
            return item.value === data.marriage;
          });
          if (!!selectMarriage[0]) {
            this.picker_value_marriage = selectMarriage[0].index;
          } else {
            this.picker_value_marriage = -1;
            data.marriage = "";
          }
          this.picker_value_gender = !!selectGender[0] ? selectGender[0].index : -1;
          this.picker_value_marriage = !!selectMarriage[0] ? selectMarriage[0].index : -1;


          this.formData = data;
          // this.$forceUpdate()
          // this.schoolRange = data;
          typeof (callback) == "function" && callback()
        }).finally(() => {
          this.showLoading = false
        });
      },
      confirm(e) {
        if ((this.canInputPhone && this.isLogin)) {
          app.SMH.showToast({
            title: "暂时无法修改个人信息"
          })
          return
        }
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
      chooseavatar(e) {
        this.avatar = e;
        this.formData.avatarUrl = e.path;
      },
      updateUserInfo() {
        this.lockPage = true;
        let reqData = this.formData;

        if (!this.canInputPhone) {
          if (this.mobilePhone != (app.IM.authUserInfo.mobilePhone || "")) {
            reqData.sessionId = app.LM.sessionId;
          }
        } else {
          if (!this.isLogin) {
            reqData.sessionId = app.LM.sessionId;
          }
        }

        return this.$Http(
            this.isLogin ? this.$Apis.updateUserInfo : this.$Apis.register, {
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
              this._checkLogin().then(() => {
                app.IM.getAuthUserInfo();
              });

              app.SMH.showToast({
                title: `${this.isLogin ? "修改成功" : "新建成功"}`,
              });

              this.backAction();
              // }
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
        if (!this.formData.structureId || this.formData.structureId == 0) {
          console.log("请选择所属地区")
          return "请选择所属地区";
        }
        // else if(!this.formData.classId){
        //        return "请选择学生所在班级"
        //      }
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
    box-sizing: border-box;
    min-height: 100vh;
    background: #EFEFEF;

    .box {
      .perfect_info {
        padding: 25rpx;
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
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          height: 130rpx;
          width: 700rpx;
          background: #FFF;
          border-radius: 20rpx;
          margin-bottom: 20rpx;
          padding: 0 27rpx 0 38rpx;
          // border-bottom: 1px solid rgba($color: #979797, $alpha: 0.63);

          .label {
            font-size: 30rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #7F7F7F;
            line-height: 42px;
          }

          .content {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            text-align: right;
            height: 100%;
            font-size: 30rpx;
            color: #7F7F7F;
            flex: 1;

            &.input {
              padding: 0;
            }

            .avatar-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 66rpx;
              height: 66rpx;
              padding: 0px !important;
              border-radius: 50%;
              background-color: #dfdfdf;
              overflow: hidden;
              flex-shrink: 0;

              .avatar {
                width: 66rpx;
                height: 66rpx;
                border-radius: 50%;
                display: block;
              }
            }

            .arrow {
              margin-left: 33rpx;
              right: 40rpx;
              top: 50%;
              -webkit-transform: translateY(-50%);
              transform: translateY(-50%);
              width: 15rpx;
              height: 15rpx;
              border-right: 2rpx solid #CECECE;
              border-bottom: 2rpx solid #CECECE;
              -webkit-transform: rotate(-45deg);
              transform: rotate(-45deg);
            }
          }

          .loading {
            opacity: 0;
            transition: all 0.3s;
            position: absolute;
            transform: translate(-50%, -50%);
            animation-name: rotate;
            animation-duration: 1s;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
            width: 30rpx;
            height: 30rpx;
            border-right: 4rpx solid $uni-main-color;
            border-top: 4rpx solid $uni-main-color;
            border-left: 4rpx solid rgba($color: $uni-main-color, $alpha: 0.3);
            border-bottom: 4rpx solid rgba($color: $uni-main-color, $alpha: 0.3);
            border-radius: 50%;
          }

          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }

            100% {
              transform: rotate(360deg);
            }
          }

          .place {
            opacity: 0.1;
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
            position: relative;
            margin-left: 18rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30rpx;
            line-height: 42rpx;
            width: 169rpx;
            height: 78rpx;
            background: rgba($color: $uni-main-color, $alpha: 0.04);
            border-radius: 6rpx;
            color: $uni-main-color;
            font-size: 32rpx;
          }
        }

        .btn-box {
          width: 100%;
          height: 200rpx;
          box-sizing: border-box;
          padding-top: 40rpx;
          left: 0;
          bottom: 0;

          .btn {
            font-size: 32rpx;
            width: 700rpx;
            height: 120rpx;
            border-radius: 20rpx;
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