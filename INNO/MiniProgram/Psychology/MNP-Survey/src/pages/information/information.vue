<template>
  <view class="information" v-if="!hidePage">
    <image class="green-bg" :src="requireStatic('/green-bg.png')" mode="widthFix" />
    <page-nav isHideHome :isTransparent="true"></page-nav>
    <view class="custom-title" :style="{'height':navHeight+'px'}">填写信息</view>
    <view class="box" v-show="!showLoading">
      <view class="perfect_info">
        <view class="actInfo flex-s-c">
          <view :style="actInfo.activityId?'max-width:48%':''" v-if="schoolInfo.schoolId">{{schoolInfo.schoolName}}
          </view>
          <view v-if="actInfo.activityId">/</view>
          <view style="flex:1" v-if="actInfo.activityId">{{actInfo.activityName}}</view>
        </view>
        <view class="title">请先填写你的信息</view>
        <view class="item">
          <view class="label">学生姓名</view>
          <ori-input :value="formData.name" @onInput="e=>onInput(e,'name')" placeholder="请输入"
            placeholderClass="hold-style" class="input content" boxStyle="padding:5rpx 0;height: calc(1.4rem + 40rpx)">
          </ori-input>
        </view>
        <view class="item">
          <view class="label">所在学校</view>
          <template v-if="schoolInfo.schoolId">
            <view class="content">{{schoolInfo.schoolName}}</view>
          </template>
          <template v-else>
            <ori-picker @pickerChange="(e)=>pickerChange(e,'school')" :select-fir="selectFstSchool"
              range-key="schoolName" :mode="mode.school" :range="schoolRange" :pickerValue="picker_value_school">
              <template v-slot:content>
                <view class="flex-b-c content" v-if="!selectFstSchool">
                  <view>
                    <template v-if="picker_value_school>=0">
                      <text>{{schoolRange[picker_value_school].schoolName}}</text>
                    </template>
                    <view v-else class="place">请选择</view>
                  </view>
                  <view class="switch font-32">选择</view>
                </view>
                <view class="flex-b-c content" v-else>
                  <view>{{schoolRange[0].schoolName}}</view>
                </view>
              </template>
            </ori-picker>
          </template>
        </view>
        <view class="item">
          <view class="label">所属校区</view>
          <template v-if="classInfo.campusId">
            <view class="content">{{classInfo.campusName}}</view>
          </template>
          <template v-else>
            <ori-picker @pickerChange="(e)=>pickerChange(e,'campus')" :disabled="formData.schoolId == 0" range-key="campusName" :mode="mode.school"
              :range="campusRange" :pickerValue="picker_value_campus">
              <template v-slot:content>
                <view class="flex-b-c content">
                  <view>
                    <template v-if="picker_value_campus>=0">
                      <text>{{campusRange[picker_value_campus].campusName}}</text>
                    </template>
                    <view v-else class="place">请选择</view>
                  </view>
                  <view class="switch font-32">选择</view>
                  <view class="disabled-view" @click="campusDisabled" v-if="formData.schoolId == 0"></view>
                </view>
              </template>
            </ori-picker>
          </template>
        </view>
        <view class="item" v-if="classInfo.classId">
          <view class="label">所属班级</view>
          <view class="content">{{classInfo.classFullName}}（{{classInfo.schoolYear}}级）</view>
        </view>
        <view class="item" v-else>
          <view class="label">所属班级</view>
          <view class="flex-b-c content" @click="showSelectClass">
            <view>
              <text v-if="selectClassInfo.grade">{{selectClassInfo.grade}}{{selectClassInfo.className}}（{{selectClassInfo.schoolYear}}级）</text>
              <text v-else class="place">请选择</text>
            </view>
            <view class="switch font-32">选择</view>
          </view>
        </view>
        <view class="item">
          <view class="label">填写学号</view>
          <ori-input :value="formData.studentNumber" @onInput="e=>onInput(e,'studentNumber')" placeholder="请输入"
            placeholderClass="hold-style" class="input content" boxStyle="padding:5rpx 0;height: calc(1.4rem + 40rpx)">
          </ori-input>
        </view>
        <!-- <view class="item"> -->
        <view class="item iden-box flex-s-c" v-if="!options.type">
          <view class="label flex1 f-shrink-0">选择你的身份</view>
          <view class="flex-s-c flex1 f-shrink-0">
            <view :class="['iden','flex-c-c','flex1',formData.relateType == item.relateType?'active':'']"
              @click="formData.relateType = item.relateType" v-for="(item) in relateArr" :key="item.relateType">
              {{item.name}}
            </view>
          </view>
        </view>
        <!-- 家长：获取手机号 -->
        <view class="item" v-if="options.type == 'child'">
          <view class="label">我的信息</view>
          <view class="content flex-s-c">
            <ori-picker @pickerChange="(e)=>pickerChange(e,'relateTypeDesc')" :select-fir="selectFstrelateTypeDescRange"
              range-key="relateTypeDesc" :mode="mode.school" :range="relateTypeDescRange"
              :pickerValue="picker_value_relateTypeDesc">
              <template v-slot:content>
                <view class="select_family_member flex-b-c">
                  <view class="m-r-38">{{relateTypeDescRange[picker_value_relateTypeDesc].relateTypeDesc}}</view>
                  <u-icon name="arrow-down" color="#000000" :size="dropdownSize()"></u-icon>
                </view>
              </template>
            </ori-picker>
            <view class="select_family_member_splite"></view>
            <view class="flex1 flex-b-c relative">
              <view :style="{'opacity':mobilePhone?'1':'0.1'}">{{mobilePhone?mobilePhone:'授权手机号'}}</view>
              <view v-show="mobilePhone" class="font-32" :style="{'color':_style.themeColor}">更改</view>
              <auth-button class="authorized_phone absolute" :auth="true" :openType="openType"
                @getphonenumber="getPhoneNumber"></auth-button>
            </view>
          </view>
        </view>
        <!-- 学生：获取手机号 -->
        <view class="item" v-else :style="mobilePhone?'':'border-bottom: none;'">
          <view class="label">我的信息</view>
          <view class="content flex-s-c" v-if="mobilePhone">
            <view class="flex1 flex-b-c relative">
              <view :style="{'opacity':mobilePhone?'1':'0.1'}">{{mobilePhone?mobilePhone:'授权手机号'}}</view>
              <view v-show="mobilePhone" class="font-32" :style="{'color':_style.themeColor}">更改</view>
              <auth-button class="authorized_phone absolute" :auth="true" :openType="openType"
                @getphonenumber="getPhoneNumber"></auth-button>
            </view>
          </view>
          <view class="get_auth_button font-32 flex-c-c relative" v-else>
            授权手机号
            <auth-button class="authorized_phone absolute" :auth="true" :openType="openType"
              @getphonenumber="getPhoneNumber"></auth-button>
          </view>
        </view>
        <view class="tips C_7f7f7f font-20">{{tips}}</view>
        <view class="btn-box flex-c-s fixed">
          <view class="btn flex-c-c" @click="confirm">确认信息</view>
        </view>
        <view class="tips_popup" @touchmove.stop.prevent="noAction">
          <ori-popup ref="popup" type="center" :isMaskClick="false" background-color="transparent">
            <template v-slot:content>
              <view class="tips_popup_info">
                <view class="tips_popup_info_message">
                  <view class="font-36 bold text-align-c m-b-55">待验证通过</view>
                  <view class="font-30 m-b-45">{{tipsContent}}</view>
                  <view class="font-30" :style="{'color':_style.themeColor}">已发送验证到小程序中通知家长验证</view>
                </view>
                <view class="tips_popup_button flex-c-c font-30" @click="tipsConfirm">知道了</view>
              </view>
            </template>
          </ori-popup>
        </view>
      </view>
    </view>
    <selectClass ref="selectClass" :dataList="oriClassArr" @selectClass="(e)=>{selectClassInfo = e}"></selectClass>
    <view class="loading_view flex-c-c" v-show="showLoading">
      <loading-view></loading-view>
    </view>
  </view>
</template>

<script>
  import selectClass from "./components/select-class.vue"
  import oriPopup from "@/components/ori-comps/popup/ori-popup";
  import AuthButton from "@/components/auth-button/auth-button.vue";
  import oriPicker from '@/components/ori-comps/picker/ori-picker.vue';
  import oriInput from '@/components/ori-comps/input/ori-input.vue';
  import scanCode from '@/common/helper/scan-code-handler.js';
  import SIH from "@/common/helper/sys-infos-handler"
  import LoadingView from '@/components/css3/loading/loading.vue';
  import UniApi from "../../common/support/tools/uni-api-promise";
  import entryM from '@/common/manager/entry-manager.js';

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      oriPicker,
      oriInput,
      AuthButton,
      oriPopup,
      LoadingView,
      selectClass,
    },
    data() {
      return {
        showLoading: true,
        navHeight: SIH.navPlace + SIH.statusBarHeight,
        formData: {
          name: '',
          relateType: '',
          classId: 0,
          schoolId: 0,
          campusId: 0,
          studentNumber: '',
          relateTypeDesc: '',
        },
        mode: {
          'grade': 'multiSelector',
          'school': 'selector',
        },

        lockPage: false,
        campusRange: [],
        oriClassArr: [],
        schoolRange: [],
        selectClassInfo: {
          grade: "",
          schoolYear: 0,
          classId: 0,
          className: ""
        },
        picker_value_school: -1,
        picker_value_campus: -1,
        relateArr: [{
          name: '我是家长',
          relateType: 'child'
        }, {
          name: '我是学生',
          relateType: 'none'
        }],
        tips: '请务必准确填写以上信息，方便老师辨别孩子身份，归档学籍信息',
        curRecordId: 0,
        actInfo: {},
        schoolInfo: {},
        classInfo: {},
        selectFstSchool: false,
        hidePage: true,
        // 获取手机号
        relateTypeDescRange: [],
        picker_value_relateTypeDesc: -1,
        openType: "getPhoneNumber",
        mobilePhone: '',
        tipsContent: ""
      }
    },
    onLoad(options) {
      this.options = options || {};
    },
    onReady() {
      this.init();
      let relateType = this.options.type || 'child'
      this.formData.relateType = relateType;
    },
    computed: {

    },
    onShow() {},
    methods: {
      showSelectClass() {
        if(this.formData.campusId == 0){
          app.SMH.showToast({
            title:'请先选择校区'
          })
          return
        }
        this.$refs['selectClass'].show()
      },
      init() {
        this.schoolInfo = scanCode.schoolInfo || {};
        this.classInfo = scanCode.classInfo || {};
        this.actInfo = scanCode.actBaseInfo || {};
        this.formData.classId = this.classInfo.classId || 0;
        this.formData.campusId = this.classInfo.campusId || 0;
        this.formData.schoolId = this.schoolInfo.schoolId || 0;
        this.picker_value_school = -1;
        this.mobilePhone = this._phoneEllipsis(app.IM.authUserInfo.mobilePhone) || ""
        if (this.options.type == "child") {
          this.picker_value_relateTypeDesc = 0;
          this.formData.relateTypeDesc = "家长"
        }
        // 确保该页面在账号登陆配置时，不展示，不可用
        // app.Sysm.getSysConf('applet_login_type').finally(()=>{
        app.Sysm.getLoginConfig(this.schoolInfo.schoolId || 0).then((res) => {
          let isAccountLogin = res.data == 'password';
          if (isAccountLogin) {
            this.redirectAction('/' + entryM.loginPath)
          } else {
            this.hidePage = false;
          }
        })
        this.loadRelatePicker()
        this._checkLogin().then(() => {
          this.loadSchool();
        })
        setTimeout(() => {
          this.showLoading = false
        }, 200);
      },
      // 加载家长选择器数据
      loadRelatePicker() {
        let relateList = ['家长', '妈妈', '爸爸', '爷爷', '奶奶', '公公', '婆婆', '姐姐', '哥哥']
        let relateTypeDescRange = []
        relateList.forEach(item => {
          relateTypeDescRange.push({
            relateTypeDesc: item
          })
        })
        this.relateTypeDescRange = relateTypeDescRange;
      },
      loadSchool() {
        return this.$Http(this.$Apis.getSchoolListInfo, {
          other: {
            isShowLoad: true
          }
        }).then(res => {
          if (res.code == 1) {
            let data = res.data || [];
            let dataList = [];
            data.forEach(item => {
              dataList.push({
                ...item.schoolInfo,
                campusInfo: item.campusInfo
              })
            })
            this.schoolRange = dataList;
            console.log(dataList, "dataList,ssafasgasgasgasg")
            // 检查扫码进来是否有schoolId
            let schoolId = this.schoolInfo.schoolId || 0;
            if (parseInt(schoolId) > 0) {
              let picker_value_school = dataList.findIndex(item => {
                return item.schoolId == schoolId
              })
              this.campusRange = dataList[picker_value_school].campusInfo || []
            } else if (dataList.length == 1) {
              this.selectFstSchool = true
              this.formData.schoolId = dataList[0].schoolId || 0;
              this.campusRange = dataList[0].campusInfo || [];
            }
          }
        })
      },
      loadGradeClass() {
        let schoolId = this.formData.schoolId || 0;
        let campusId = this.formData.campusId || 0;
        // return this.$Http(this.$Apis.getSchoolClassList,{
        return this.$Http(this.$Apis.getSchoolClassInfo, {
          data: {
            schoolId,
            campusId,
          },
          other: {
            isShowLoad: true
          }
        }).then(res => {
         this. initClassSelectCom()
          if (res.code == 1) {
            let data = res.data || [];
            this.oriClassArr = data;
          }
        })
      },
      initClassSelectCom(){
         this.selectClassInfo = {
            grade: "",
            schoolYear: 0,
            classId: 0,
            className: ""
          }
          this.$refs['selectClass'].clearSelect()
      },
      pickerChange(e, type) {
        if(type == 'school') {
          if (e.detail.value >= 0 && this.picker_value_school != e.detail.value) {
            this.picker_value_school = e.detail.value;
            let item = this.schoolRange[this.picker_value_school] || {};
            this.formData.schoolId = item.schoolId || 0;
            // 初始化校区选择
            this.campusRange = item.campusInfo || [];
            this.picker_value_campus = -1;
            this.formData.campusId = 0;
            // 初始化班级选择
            this. initClassSelectCom()
          }
        } else if (type == 'campus') {
          if (e.detail.value >= 0 && this.picker_value_campus != e.detail.value) {
            this.picker_value_campus = e.detail.value;
            let item = this.campusRange[this.picker_value_campus] || {};
            this.formData.campusId = item.campusId || 0;

            this.loadGradeClass();
          }
        } else if (type == 'relateTypeDesc') {
          let index = e.detail.value;
          this.picker_value_relateTypeDesc = index;
          this.formData.relateTypeDesc = this.relateTypeDescRange[index].relateTypeDesc || '家长'
        }
      },
      campusDisabled(){
        app.SMH.showToast({
          title:"请先选择学校"
        })
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
        return this.bindStudent();
      },
      bindStudent() {
        let formData = this.formData;
        let classId = this.classInfo.classId || this.selectClassInfo.classId
        return this.$Http(this.$Apis.bindStudent, {
          data: {
            ...formData,
            classId
          },
          other: {
            isShowLoad: true
          }
        }).then(res => {
          if (res.code == 1) {
            this.lockPage = true;
            if (res.data.content) {
              this.tipsContent = res.data.content;
              this.$refs.popup.show();
              return
            }
            this._getAuthUserInfo()

            app.SMH.showToast({
              title: "新建成功"
            });
            if (this.options.fromRoute == "/pages/user-switch/user-switch") {
              this.redirectAction(
                `/pages/user-switch/user-switch?selectType=${this.options.type == 'child'?1:2}&fromRoute=/pages/startup/startup`
              )
            } else {
              this.backAction();
            }
            return res
          }
          return Promise.reject(res)
        }).catch(e => {
          if (e.code == '-40008') {
            UniApi.showModal({
              title: '绑定失败',
              content: '请先绑定家长后再绑定学生信息',
              showCancel: false,
              confirmText: "知道了",
              confirmColor: "#222222"
            })
          } else if (e.code == '-40010') {
            this.mobilePhone = ''
          }
          return Promise.reject(e);
        })
      },
      tipsConfirm() {
        this.$refs.popup.dismiss();
        if (this.options.fromRoute == "/pages/user-switch/user-switch") {
          this.redirectAction(
            `/pages/user-switch/user-switch?selectType=${this.options.type == 'child'?1:2}&fromRoute=/pages/startup/startup`
          )
        } else {
          this.backAction();
        }
      },
      checkValid() {
        if (!this.formData.name) {
          return "请输入学生姓名"
        }else if (!this.formData.schoolId) {
          return "请选择学生所在学校"
        }else if (!this.formData.campusId) {
          return "请选择学生所在校区"
        } else if(!this.formData.classId && !this.selectClassInfo.classId){
          return "请选择学生所在班级"
        } else if (!this.formData.studentNumber) {
          return "请输入学生学号"
        }  else if (!this.mobilePhone) {
          return "请先授权手机号"
        }
      },
      onInput(e, type) {
        let detail = e.detail || {};
        let value = detail.value;
        this.formData[type] = value;
      },
      dropdownSize() {
        let px = app.SIH.getConvert(26, "PX")
        return px
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
          this.formData.sessionId = app.LM.sessionId || 0
        });
      },
    },
  })
  export default pageOption
</script>

<style lang="scss" scpoed>
  .loading_view {
    width: 100%;
    height: 100vh;
  }

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
      .perfect_info {
        padding: 64rpx;
        padding-bottom: 200rpx;

        .actInfo {
          font-size: 26rpx;
          color: #B2B2B2;
          padding-bottom: 20rpx;
        }

        .title {
          font-size: 46rpx;
          color: #222222;
          padding-bottom: 5rpx;
        }

        .item {
          padding-top: 40rpx;
          border-bottom: 1px solid rgba($color: #979797, $alpha: 0.3);

          .label {
            font-size: 26rpx;
            color: #B2B2B2;
          }

          .content {
            position: relative;
            padding: 25rpx 0;
            font-size: 42rpx;
            color: #222222;

            &.input {
              padding: 0;
            }

            .select_family_member {}

            .select_family_member_splite {
              margin: 0 50rpx;
              width: 1rpx;
              height: 27rpx;
              opacity: 0.3;
              background-color: #979797
            }

            .disabled-view{
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
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

          .get_auth_button {
            margin: 25rpx auto;
            width: 619rpx;
            height: 110rpx;
            background: rgba($color: #9BE094, $alpha: 0.12);
            border-radius: 6rpx;
            border: 2px solid rgba($color: #108804, $alpha: 0.12);
            color: $uni-main-color;

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
            border-radius: 10rpx;
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

    button {
      padding: 0;
    }
  }

  .tips_popup {
    position: relative;
    overflow: hidden;

    .tips_popup_info {
      background: #FFFFFF;
      border-radius: 20rpx;
      width: 660rpx;

      .tips_popup_info_message {
        padding: 66rpx 75rpx 72rpx;
      }
    }

    .tips_popup_button {
      border-top: 1rpx solid #DDDDDD;
      height: 123rpx;
    }
  }
</style>