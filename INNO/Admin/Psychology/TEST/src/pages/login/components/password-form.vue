<template>
  <div class="change-pwd-area">
    <div v-if="changeSuccess" class="change-pwd-sign">
      <div class="sign-icon">
        <Icon :size="100" type="ios-checkmark-circle" color="#5DD554" />
        <div class="change-tip">设置成功</div>
      </div>
      <div class="">
        <Button class="go-login-btn" type="primary" @click="reLogin">前往登录</Button>
      </div>
    </div>
    <div v-else>
      <div class="change-title">
        <div class="m-b-5">首次登录</div>
        <div style="font-size: 18px;">请完善你的账号信息</div>
      </div>
      <changePwdForm :isHideOld="true" :isHideCancel="true" @success="changeSuccess=true"></changePwdForm>
    </div>
  </div>
</template>

<script>
import LM from "@/helper/manager/login-manager";
import changePwdForm from "@/models/components/change-pwd/form.vue";
export default {
  components: {
    changePwdForm
  },
  data(){
    return {
      changeSuccess: false
    }
  },
  methods: {
    reLogin(){
      LM.logout().then(() => this.$router.push({ name: "Login" }));
    }
  }
}
</script>

<style lang="less" scoped>
.change-pwd-area{
  margin: -20px 0px;
  .sign-icon{
    margin: 80px auto;
  }
  .change-pwd-sign{
    
  }
  .change-tip{
    margin-top: 10px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #5FC312;
    line-height: 22px;
  }
  .go-login-btn{
    width: 200px;
    height: 50px;
  }
  .change-title{
    font-size: 17px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: bold;
    color: #333333;
    line-height: 25px;
    text-align: left;
    margin-bottom: 40px;
  }
}
</style>