<template>
  <div class="upgrade-prompt" >
    <div class="upgrade-prompt-area flex-c-c animate__animated animate__bounce" v-if="_adminUserInfos.is_upgrade">
      <div class="m-r-10">新的学年已开始，请前往更新年级信息</div>
      <Button class="operate-btn set-btn m-r-10" @click="setStudentUpgrade">马上设置</Button>
      <Button class="operate-btn no-set-btn" :loading="isSetting" @click="isSetSchoolUpgrade">先不设置</Button>
    </div>
    <studentUpgrade ref="studentUpgradeRef"></studentUpgrade>
  </div>
</template>

<script>
import studentUpgrade from "../student-upgrade/index.vue";
import LM from "@/helper/manager/login-manager.js"
export default {
  components: {
    studentUpgrade
  },
  data(){
    return {
      isSetting: false
    }
  },
  methods: {
    setStudentUpgrade(state){
      if(this.$refs["studentUpgradeRef"]){
        if(state){
          this.$refs["studentUpgradeRef"] && this.$refs["studentUpgradeRef"].showModal();
        } else {
          this.$refs["studentUpgradeRef"] && this.$refs["studentUpgradeRef"].dismiss();
        }
      }
    },
    isSetSchoolUpgrade(){
      this.isSetting = true;
      this.$MainApi.isSetSchoolUpgrade({
        data: {
          school_id: this._getReqStructureId
        },
        other: {
          isErrorMsg: true
        }
      }).then((res)=>{
        if(res.code){
          this._adminUserInfos.is_upgrade = 0;
          LM.setUserInfos(this._adminUserInfos);
        }
      }).finally(()=>{
        this.isSetting = false;
      })
    }
  },
  watch: {
      $route(to, from) {
          this.setStudentUpgrade();
      },
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
@import 'animate.css';
:root {
  --animate-delay: 0.5s;
}
.upgrade-prompt{
  // padding: 10px 20px;
  width: 100%;
}
.upgrade-prompt-area{
  margin: 10px 20px;
  --animate-delay: 1s;
  background: linear-gradient(90deg, #3023AE 0%, #53A0FD 48%, #B4EC51 100%);
  border-radius: 5px;
  padding: 5px;
  font-size: 15px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 21px;
}
.operate-btn{
  background: #FFFFFF;
  border-radius: 100px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 20px;
  height: 30px;
}
.set-btn{
  color: #5DA8EC;
}
.no-set-btn{
  background: #ffffff3b !important;
  color: #fff;
}
</style>