<template>
  <div class="change-pwd-page">
    <div class="inline-b change-pwd-cont">
      <div class="change-tit">修改密码</div>
      <div class="change-tip desc-notice">*首次登录，需要强制修改密码</div>
      <div class="change-form">
        <changePwdForm :isHideOld="true"  @success="changeSuccess" :isHideCancel="true" :isShieldMsg="true"></changePwdForm>
      </div>
    </div>
  </div>
</template>

<script>
import { $pm } from "@/plugins/router";
import changePwdForm from "@/models/components/change-pwd/form.vue";
import LM from "@/helper/manager/login-manager";
export default {
  components: { changePwdForm },
  data(){
    return {
      timer: null
    }
  },
  beforeRouteEnter: (to, from, next) => {
      $pm.setOverrideAnim({
          openEnter: {
              active: "bounceInDown anim-top anim-1000"
          },
          openLeave: {
              active: "fadeOut anim-bottom anim-1000"
          }
      });
      next();
  },
  beforeRouteLeave(to, from, next) {
      $pm.setOverrideAnim({
          openEnter: {
              active: "fadeIn anim-bottom anim-1000"
          },
          openLeave: {
              active: "bounceOutUp anim-top anim-1000"
          }
      });
      next();
  },
  methods: {
    changeSuccess(){
      this.$Message.info({
          content: '修改成功，即将跳转到重新登录...',
          duration: 3
      });
      this.timer = setTimeout(()=>{
        LM.logout().then(() => this.$router.push({ name: "Login" }));
        this.timer = null;
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.change-pwd-page{
  width: 100%;
  height: 100%;
  display: flex;
  // flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: left;
}
.change-pwd-cont{
  padding: 30px 40px;
  background-color: #fff;
  border-radius: 6px;
  margin-top: -100px;
}
.change-tit{
  font-size: 20px;
  margin-bottom: 10px;
}
.change-tip{
  margin-bottom: 30px;
}
.change-form{
  padding: 10px;
}
</style>