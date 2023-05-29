<template>
  <div class="text-c">
    <div id="login-layout" class="login-layout bg-page">
      <div id="login-title" class="login-title" v-if="loginType != 'password'">
        <div class="title-tip" :class="{'isActive': loginType == 'account'}" @click="changeLoginType('account')">密码登录</div>
        <div class="m-l-20 m-r-20" style="color: rgb(221 221 221);">|</div>
        <div class="title-tip" :class="{'isActive': loginType == 'phone'}" @click="changeLoginType('phone')">验证码登录</div>
      </div>
      <div id="login-card">
        <Layout id="login-box" class="login-box">
          <accountForm v-if="loginType == 'account'" @loginHandle="loginHandle" @needChangePwd="changeLoginType"></accountForm>
          <phoneForm v-else-if="loginType == 'phone'" @loginHandle="loginHandle" @needChangePwd="changeLoginType"></phoneForm>
          <passwordForm v-else-if="loginType == 'password'" @reLogin="changeLoginType"></passwordForm>
          <Spin v-if="isFormSpin" fix></Spin>
        </Layout>
      </div>
    </div>
  </div>
</template>
<script>
import { $pm } from "@/plugins/router";
import LM from "@/helper/manager/login-manager";
import PageHelper from "@/helper/page-helper";
import accountForm from "./components/account-form.vue";
import phoneForm from "./components/phone-form.vue";
import passwordForm from "./components/password-form.vue";
export default {
  name: "Login",
  components: {
    accountForm,
    phoneForm,
    passwordForm,
  },
  data() {
    return {
      loginType: "phone", // account, phone, password
      sendIng: false, // 发送验证码
      sendCountDown: 0,
      fromData: {
        account: null,
        password: null,
        phone: null,
        code: null
      },
      chooseCustomerId: 0,
      loading: false,
      showPwd: false,
      imgPath: "",
      warnNotice: "",
      getErrorNum: {},
      isFormSpin: false
    };
  },
  beforeRouteEnter: (to, from, next) => {
    $pm.setOverrideAnim({
      openEnter: {
        active: "bounceInDown anim-top anim-1000",
      },
      openLeave: {
        active: "fadeOut anim-bottom anim-1000",
      },
    });
    next();
  },
  beforeRouteLeave(to, from, next) {
    $pm.setOverrideAnim({
      openEnter: {
        active: "fadeIn anim-bottom anim-1000",
      },
      openLeave: {
        active: "bounceOutUp anim-top anim-1000",
      },
    });
    next();
  },
  computed: {
    isNeedResetPwd(){
      return LM.isNeedResetPwd
    }
  },
  methods: {
    initLoginType(){
      if(this.isNeedResetPwd){
        this.changeLoginType("password")
      } else {
        this.changeLoginType("account")
      }
    },
    changeLoginType(type){
      if(this.loginType != type){
        this.isFormSpin = true;
        this.loginType = type
        setTimeout(()=>{
          this.isFormSpin = false;
        }, 350)
      }
    },
    // handleSubmit() {
    //   this.$refs["login-form"].validate().then((valid) => {
    //     if (!valid) {
    //       return;
    //     }
    //     this.loading = true;
    //     let errorNum = this.errorNumData(); //检测该账号登录错误次数
    //     if (errorNum > 1 && this.loginType == 'account') {
    //       this.$refs["slideVerifyModal"] &&
    //         this.$refs["slideVerifyModal"].showVerifyModal({
    //           params: {
    //             loginName: this.fromData.account,
    //           },
    //         });
    //     } else {
    //       this.getLogin();
    //     }
    //   });
    // },
    // getLogin() {
    //   LM.login(this.fromData.account, this.fromData.password)
    //     .then((res) => {
    //       console.log("res", res);
    //       this.imgPath = res.img_path || "";
    //       if (res.select_state == 1) {
    //         this.actChooseCustomer(res.customer_data || []);
    //       } else if (res.select_state == 2) {
    //         if (res.customer_info) {
    //           this.chooseCustomerId = res.customer_info.id || 0;
    //         }
    //         this.actChooseOrganize(res.structure_list || []);
    //       } else if (res.state == 0) {
    //         this.checkResetPwd();
    //       } else {
    //         this.loginHandle(res);
    //       }
    //       this.errorNumData("set", 0);
    //       setTimeout(() => {
    //         this.loading = false;
    //       }, 1000);
    //     })
    //     .catch((error) => {
    //         this.$refs['slideVerifyModal'].reset()
    //         this.loading = false;
    //         this.$Message.error(error.message || "登陆失败");
    //         this.setNotice(error);
    //         if(typeof(error.error_num) != 'undefined'){
    //             this.errorNumData('set', error.error_num)
    //         }
    //     });
    // },
    // actChooseCustomer(customer_data) {
    //   this.$refs["chooseCustomerRef"] &&
    //     this.$refs["chooseCustomerRef"].showModal({
    //       customerData: customer_data,
    //     });
    // },
    // chooseCustomerCallback(res) {
    //   this.imgPath = res.img_path || "";
    //   this.chooseCustomerId = res.chooseCustomer;
    //   if (res.select_state == 2) {
    //     this.actChooseOrganize(res.structure_list || []);
    //   } else {
    //     LM.loginDataHandle(res);
    //     this.loginHandle(res);
    //   }
    // },
    // actChooseOrganize(structure_list) {
    //   this.$refs["chooseOrganizeRef"] &&
    //     this.$refs["chooseOrganizeRef"].showModal({
    //       organizeData: structure_list,
    //     });
    // },
    // chooseOrganizeCallback(res) {
    //   LM.loginDataHandle(res);
    //   this.loginHandle(res);
    // },
    // checkResetPwd() {
    //   this.$router.replace({
    //     name: "ChangePwd",
    //   });
    // },
    loginHandle(data) {
      PageHelper.setMenus(data.initialMenu, data.hasactionCode);
      this.$Message.success("登陆成功");
      let target = this.$route.params.target;
      let to;
      if (target) {
        to = {
          ...target,
          query: { ...target.query, $pt: null },
        };
      } else {
        to = "/";
      }
      this.$router.replace(to);
    },
    // setNotice(res) {
    //   this.warnNotice = res.message || "";
    // },
    // errorNumData(type = "get", error_num) {
    //   // 记录用户失败次数
    //   if (type == "set") {
    //     this.getErrorNum[this.fromData.account] = error_num || 0;
    //     Utils.local.set(
    //       "LoginErrorNum",
    //       encodeURIComponent(JSON.stringify(this.getErrorNum))
    //     );
    //   } else {
    //     let numData = Utils.local.get("LoginErrorNum") || "{}";
    //     try {
    //       numData = JSON.parse(decodeURIComponent(numData)) || {};
    //       console.log("numData", numData);
    //     } catch (error) {}
    //     this.getErrorNum = numData;
    //     return numData[this.fromData.account] || 0;
    //   }
    // },
  },
  mounted() {
    this.warnNotice = "";
  },
  watch:{
    isNeedResetPwd:{
      handler(){
        this.initLoginType();
      },
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
.login-layout{
  display: inline-block;
  margin: 10px auto;
  margin-top: 20px;
  overflow: hidden;
  box-sizing: border-box;
  padding: 40px;
  transition: padding-bottom 0.3s;
  border-radius: 10px;
  /deep/.ivu-form-item-label{
    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #171717;
    line-height: 20px;
  }
}
// @media screen and (max-height: 600px) {
//   #login-layout {
//     padding-bottom: 0px;
//   }
// }
.login-title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #7F7F7F;
  line-height: 25px;
}
.title-tip{
  cursor:pointer;
}
.title-tip.isActive{
  font-weight: bold;
  color: #333333;
}
#login-card {
  padding: 30px 0 20px 0;
}
.login-box {
  position:relative;
  box-sizing: content-box;
  width: 300px;
  background: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > * {
    width: 100%;
  }
}
.msg-error{
    font-size: 12px;
    display: flex;
    align-items: center;
    position: relative;
    background: #ffebeb;
    color: #e4393c;
    border: 1px solid #faccc6;
    padding: 3px 10px 3px 10px;
    line-height: 15px;
    height: auto;
}
</style>
