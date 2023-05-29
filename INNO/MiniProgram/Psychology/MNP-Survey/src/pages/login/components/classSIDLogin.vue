<template>
  <view class="account-main class-sid-main">
    <image class="login-logo" mode="widthFix" :src="schoolInfo.schoolLogo || customerInfo.logo ||  ''"></image>
    <view v-if="schoolInfo.schoolId">
      <view class="title">{{schoolInfo.schoolName}}</view>
      <view v-if="actInfo.activityId" class="content">活动：{{actInfo.activityName||""}}</view>
    </view>
    <view v-else>
      <view class="title">{{customerInfo.customerName||""}}</view>
    </view>
    <view class="input-area">
      <view class="input-item">
        <view class="input-label">班级</view>
        <ori-picker :disabled="!!Number(ops.classId)" class="input-picker" @pickerChange="(e)=>pickerChange(e)"
          @columnchange="columnchange" range-key="campusClassName" mode="multiSelector" :range="classRange"
          :pickerValue="picker_value">
          <template v-slot:content>
            <div class="flex-b-c content">
              <view>
                <template v-if="picker_value.length>0">
                  <text v-for="(item,index) in classRange"
                    :key="index">{{classRange[index][picker_value[index]].campusClassName||''}}</text>
                </template>
                <view v-else class="place">请选择</view>
              </view>
              <view class="switch font-32" v-show="picker_value && picker_value.length > 0">
                <image class="choosed-icon" :src="requireStatic('/login/choosed.png')" mode="widthFix" />
              </view>
            </div>
          </template>
        </ori-picker>
      </view>
      <view class="input-item">
        <view class="input-label">学号</view>
        <ori-input @onInput="e=>onInput(e,'studentNumber')" :value="inputData.studentNumber||''" placeholder="输入账号"
          placeholderClass="hold-style" class="_input" :boxStyle="inputStyle">
        </ori-input>
      </view>
    </view>
    <view class="agree-area" @click="chooseAgree">
      <view class="agree-icon">
        <view class="select-switch" :class="{'selected': selectAgree}"></view>
      </view>
      <view>已阅读并同意心理 <view class="agree-link" @click.stop="checkAgree">用户隐私保护指引</view>
      </view>
    </view>
    <button class="btn-box" @click="bindStudentByClassSID">
      <text class="C_fff font-36">确认</text>
    </button>
    <confirmStudent ref="confirmStudentRef" @ok="confirmOk"></confirmStudent>
  </view>
</template>

<script>
  const app = getApp();
  import oriInput from '@/components/ori-comps/input/ori-input.vue';
  import oriPicker from '@/components/ori-comps/picker/ori-picker.vue';
  import confirmStudent from './confirmStudent.vue';
  export default {
    name: "classNumberLogin",
    components: {
      oriInput,
      oriPicker,
      confirmStudent
    },
    props: {
      schoolInfo: {
        type: Object,
        default: () => {
          return {}
        }
      },
      actInfo: {
        type: Object,
        default: () => {
          return {}
        }
      },
      customerInfo: {
        type: Object,
        default: () => {
          return {}
        }
      },
      inputStyle: String,
      selectAgree: Boolean
    },
    data() {
      return {
        inputData: {
          classId: 0,
          studentNumber: ""
        },
        picker_value: [],
        oriClassArr: [],
        classRange: [],
        ops: {}
      }
    },

    methods: {
      chooseAgree() {
        this.$emit("chooseAgree")
      },
      checkAgree() {
        this.$emit("checkAgree")
      },
      pickerChange(e) {
        this.picker_value = e.detail.value;
        let item = (this.classRange[1] && this.classRange[1][this.picker_value[1]]) || {};
        this.inputData.classId = item.classId || 0
      },
      columnchange(e) {
        let detail = e.detail || {};
        if (detail.column == 0) {
          this.classRange[1] = this.oriClassArr[detail.value || 0]
        }
      },
      onInput(e, key) {
        let detail = e.detail || {};
        let value = detail.value;
        this.inputData[key] = value;
      },
      initClass(ops) {
        if (!ops.schoolId || !ops.id) {
          app.SMH.showToast({
            title: !ops.schoolId ? "无效学校ID" : "无效活动ID"
          });
          return;
        }
        return this.$Http(this.$Apis.getSchoolClassListWithActivity, {
          data: {
            campusId: ops.campusId || 0,
            schoolId: ops.schoolId || 0,
            activityId: ops.id || 0
          },
          other: {
            isShowLoad: true
          }
        }).then(res => {
          if (res.code == 1) {
            let data = res.data || [];

            // 是否有同年级存在多个学年 && 检查一个学校是否拥有多个校区
            let campusArr = []
            let hasDiferentGrade = false
            for(let i = 0;i<data.length;i++){
              if(!hasDiferentGrade){
                for(let j = 0;j<data.length;j++){
                  if((data[i].gradeName == data[j].gradeName) && (data[i].schoolYear != data[j].schoolYear)){
                    hasDiferentGrade = true
                    break
                  }
              }}
              data[i].classList.forEach(classItem=>{
                campusArr.push(classItem.campus)
              })
            }
            let campusArrSet = new Set(campusArr);
            campusArr = Array.from(campusArrSet);

            // 格式化数据
            let oriClassArr = data.map((item, index) => {
              item.className = item.gradeName || '';
              item.campusClassName = (hasDiferentGrade ? `${item.gradeName}(${item.schoolYear})` : item.gradeName) || '';
              let classList = item.classList || []
              for (let cI = 0; cI < classList.length; cI++) {
                if(campusArr.length > 1){
                  classList[cI].campusClassName = classList[cI].campus ? classList[cI].className + "[" +
                    classList[cI].campus + "]" : classList[cI].className;
                }else{
                   classList[cI].campusClassName = classList[cI].className
                }
                if (classList[cI].classId == ops.classId && Number(ops.classId)) {
                  this.picker_value = [index, cI];
                }
              }
              return classList
            });
            console.log("oriClassArr", oriClassArr)
            console.log("picker_value", this.picker_value);
            this.oriClassArr = oriClassArr;
            this.$set(this.classRange, 0, data);
            this.$set(this.classRange, 1, oriClassArr[(this.picker_value[0] || 0)] || []);
            console.log("classRange", this.classRange)
          }
        })
      },
      init(ops = {}) {
        ops = ops || {}
        ops.classId = Number(ops.classId) || 0
        this.ops = ops;
        this.initClass(ops);
        if (ops.classId) {
          this.inputData.classId = ops.classId
        }
      },
      bindStudentByClassSID() {
        let warn = "";
        if (!Number(this.inputData.classId)) {
          warn = "请选择班级";
        } else if (!this.inputData.studentNumber) {
          warn = "请填写学号";
        } else if (!this.selectAgree) {
          warn = "请先勾选用户协议！"
        }
        if (warn) {
          app.SMH.showToast({
            title: warn
          });
          return;
        }
        this.$refs["confirmStudentRef"] && this.$refs["confirmStudentRef"].showPopup({
          ...this.ops,
          ...this.inputData
        });
      },
      confirmOk() {
        let ops = this.ops || {};
        return this.$Http(this.$Apis.loginByClassH5, {
          data: {
            campusId: ops.campusId,
            schoolId: ops.schoolId,
            activityId: ops.id || 0,
            classId: this.inputData.classId,
            studentNumber: this.inputData.studentNumber
          },
          other: {
            isShowLoad: true
          }
        }).then(res => {
          if (res.code == 1) {
            this.$emit("bindStudentByClassSID", res);
          }
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .class-sid-main {
    .login-logo {
      width: 160rpx;
      height: auto;
      display: block;
      margin-bottom: 65rpx;
    }

    .input-area {
      margin-bottom: 26rpx;
    }

    .input-item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
    }

    .input-label {
      flex-shrink: 0;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #7F7F7F;
      line-height: 30rpx;
      padding-left: 60rpx;
      padding-right: 20rpx;
    }

    .input-picker {
      width: 100%;
      height: 100%;
      padding: 0px 30rpx;
      padding-left: 50rpx;
      box-sizing: border-box;

      .content {
        width: 100%;
        height: 120rpx;
        color: #7F7F7F;
      }

      .choosed-icon {
        width: 36rpx;
        height: 36rpx;
        display: block;
      }
    }
  }
</style>