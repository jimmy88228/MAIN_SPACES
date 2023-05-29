<template>
  <view>
    <u-popup :show="isShow" ref="popup" mode="center" :round="10" customStyle="top: 0px;">
      <view class="confirm-student-cont">
        <view class="c-s-tip">先确认是不是你噢</view>
        <view class="c-s-txt">
          <view>{{classInfo.classFullName}}</view>
          <view>{{checkInfo.name}}</view>
        </view>
        <view class="confirm-operate">
          <view class="operate-item" @click="isCancel">
            <image class="operate-icon" :src="requireStatic('/login/no.png')" mode="widthFix" />
            <view style="color:#D10404;">我不是</view>
          </view>
          <view class="operate-item" @click="isOk">
            <image class="operate-icon" :src="requireStatic('/login/yes.png')" mode="widthFix" />
            <view style="color:#21B014;">我是</view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
const app = getApp();
export default {
  data(){
    return {
      isShow: false,
      classInfo: {},
      checkInfo: {}
    }
  },
  methods: {
    showPopup(params = {}){
      params = params || {}
      this.loadData(params)
    },
    loadData(params){
      app.SMH.showLoading()
      return Promise.all([this.getClassInfo(params), this.checkStudent(params)]).then(()=>{
        this.isShow = true;
      }).finally(()=>{
        app.SMH.hideLoading()
      })
    },
    getClassInfo(params){
      return this.$Http(this.$Apis.getClassInfo, {
        data: {
          classId: params.classId,
        }
      }).then(res => {
        if (res.code == 1) {
          this.classInfo = res.data || {};
          return Promise.resolve();
        }
        return Promise.reject();
      })
    },
    checkStudent(params){
      return this.$Http(this.$Apis.checkStudentByClass, {
        data: {
          classId: params.classId,
          studentNumber: params.studentNumber,
          campusId: params.campusId || 0,
          schoolId: params.schoolId || 0
        }
      }).then(res => {
        if (res.code == 1) {
          this.checkInfo = res.data || {};
          return Promise.resolve();
        }
        return Promise.reject();
      })
    },
    isCancel(){
      this.isShow = false
    },
    isOk(){
      this.$emit("ok");
      this.isCancel();
    }
  }
}
</script>

<style lang="scss" scoped>
.confirm-student-cont{
  padding: 130rpx;
  padding-top: 80rpx;
  padding-bottom: 80rpx;
  min-width: 650rpx;
  box-sizing: border-box;
  .c-s-tip{
    font-size:30rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #7F7F7F;
  line-height: 25rpx;
  margin-bottom: 60rpx;
  }
  .c-s-txt{
    font-size: 50rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: bold;
    color: #222222;
    line-height: 80rpx;
    margin-bottom: 80rpx;
    min-height: 160rpx;
  }
  .confirm-operate{
    display: flex;
    justify-content: space-between;
  }
  .confirm-operate{
    font-size: 34rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    line-height: 37rpx;
    cursor: pointer;
  }
  .operate-icon{
    width: 100rpx;
    height: 100rpx;
    display: block;
    margin-bottom: 15rpx;
   
  }
}
</style>