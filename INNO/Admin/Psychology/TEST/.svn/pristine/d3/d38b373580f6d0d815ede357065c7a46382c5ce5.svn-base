<template>
<div>
  <transition name="fade">
    <div class="msg-error" v-if="warnNotice">
      <Icon type="md-information-circle" :size="20" class="" />
      <div class="m-l-5">{{warnNotice}}</div>
    </div>
  </transition>
  <Form ref="login-form" class="login-form" :model="fromData">
    <FormItem label="登录账号" prop="account" label-for="login-account" :rules="[{ required: true, message: '账号不能为空' }]" >
      <custom-input customClass="login-input" v-focusNext="{ref:'password'}" element-id="login-account" size="large" placeholder="请输入账号" v-model="fromData.account" :disabled="loading" :maxlength="30" :showWordLimit="false" autocomplete="on" autofocus clearable></custom-input>
    </FormItem>
    <FormItem label="登录密码" prop="password" label-for="login-password" :rules="[{ required: true, message: '密码不能为空' }]">
      <div id="password-from-item">
        <custom-input customClass="login-input" ref="password" v-focusNext="{action:'handleSubmit'}" element-id="login-password" class="password-input" :type="showPwd?'text':'password'" size="large" placeholder="请输入密码" :disabled="loading" v-model="fromData.password" :maxlength="30" :showWordLimit="false" autocomplete="off" clearable></custom-input>
        <Button class="eye-btn password-show" @mousedown.native="e=>showPwd=true" @mouseup.native="e=>showPwd=false" :disabled="loading">
          <i class="iconfont" :class="showPwd?'icon-pw-show':'icon-pw-hide'"></i>
        </Button>
      </div>
    </FormItem>
    <FormItem>
      <Button class="btn-single" size="large" type="primary" @click="handleSubmit" :loading="loading" long>{{loading?'登录中':'登录'}}</Button>
    </FormItem>
  </Form>
  <chooseCustomer ref="chooseCustomerRef" @callback="chooseCustomerCallback"></chooseCustomer>
  <chooseOrganize ref="chooseOrganizeRef" :imgPath="imgPath" :chooseCustomerId="chooseCustomerId" @callback="chooseOrganizeCallback"></chooseOrganize>
  <slideVerify ref="slideVerifyModal" @onSuccess="getLogin" @onFail="" @onAgain="loading = false" @onClose="loading = false"></slideVerify>
</div>
</template>

<script>
import chooseCustomer from "./choose-customer.vue";
import chooseOrganize from "./choose-organize.vue";
import slideVerify from "@/components/main-components/slide-verify";
import LM from "@/helper/manager/login-manager";
import Utils from "@/helper/utils/index";
export default {
  components: {
    chooseCustomer,
    chooseOrganize,
    slideVerify
  },
  props: {},
  data(){
    return {
      fromData: {
        account: null,
        password: null
      },
      chooseCustomerId: 0,
      loading: false,
      showPwd: false,
      imgPath: "",
      getErrorNum: {},
      warnNotice: ""
    }
  },
  methods:{
    handleSubmit() {
      this.$refs["login-form"].validate().then((valid) => {
        if (!valid) {
          return;
        }
        this.loading = true;
        let errorNum = this.errorNumData(); //检测该账号登录错误次数
        if (errorNum > 1) {
          this.$refs["slideVerifyModal"] &&
            this.$refs["slideVerifyModal"].showVerifyModal({
              params: {
                loginName: this.fromData.account,
              },
            });
        } else {
          this.checkLogin();
        }
      });
    },
    checkLogin(){
      this.getLogin().catch((error)=>{
        console.log("input_error", error)
        if(error.input_error){
          this.$refs["slideVerifyModal"] &&
            this.$refs["slideVerifyModal"].showVerifyModal({
              params: {
                loginName: this.fromData.account,
              },
            });
        }
      })
    },
    getLogin(detail = {}) {
      return LM.login(this.fromData.account, this.fromData.password, (detail.verifyKey || ""))
        .then((res) => {
          let data = res.data || res;
          this.imgPath = res.img_path || "";
          if (data.select_state == 1) {
            this.actChooseCustomer(data.customer_data || []);
          } else if (data.select_state == 2) {
            if (data.customer_info) {
              this.chooseCustomerId = data.customer_info.id || 0;
            }
            this.actChooseOrganize(data.structure_list || []);
          } else if (data.state == 0) {
            this.needChangePwd();
          } else {
            this.loginHandle(data);
          }
          this.errorNumData("set", 0);
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        })
        .catch((error) => {
          if(error.input_error){
            return Promise.reject(error);
          }
          this.$refs['slideVerifyModal'].reset()
          this.loading = false;
          this.$Message.error(error.message || "登陆失败");
          this.setNotice(error);
          if(typeof(error.error_num) != 'undefined'){
              this.errorNumData('set', error.error_num)
          }
        });
    },
    actChooseCustomer(customer_data) {
      this.$refs["chooseCustomerRef"] &&
        this.$refs["chooseCustomerRef"].showModal({
          customerData: customer_data,
        });
    },
    chooseCustomerCallback(res) {
      let data = res.data || res || {};
      this.imgPath = data.img_path || "";
      this.chooseCustomerId = res.chooseCustomer;
      if (data.select_state == 2) {
        this.actChooseOrganize(data.structure_list || []);
      } else {
        LM.loginDataHandle(data);
        this.loginHandle(data);
      }
    },
    actChooseOrganize(structure_list) {
      this.$refs["chooseOrganizeRef"] &&
        this.$refs["chooseOrganizeRef"].showModal({
          organizeData: structure_list,
        });
    },
    chooseOrganizeCallback(res) {
      LM.loginDataHandle(res);
      this.loginHandle(res);
    },
    setNotice(res) {
      this.warnNotice = res.message || "";
    },
    errorNumData(type = "get", error_num) {
      // 记录用户失败次数
      if (type == "set") {
        this.getErrorNum[this.fromData.account] = error_num || 0;
        Utils.local.set(
          "LoginErrorNum",
          encodeURIComponent(JSON.stringify(this.getErrorNum))
        );
      } else {
        let numData = Utils.local.get("LoginErrorNum") || "{}";
        try {
          numData = JSON.parse(decodeURIComponent(numData)) || {};
        } catch (error) {}
        this.getErrorNum = numData;
        return numData[this.fromData.account] || 0;
      }
    },
    needChangePwd(){
      this.$emit("needChangePwd", "password")
    },
    loginHandle(data){
      this.$emit("loginHandle", data);
    }
  }
}
</script>

<style lang="less" scoped>
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
      text-align: left;
  }
.login-form{
  .login-input{
    /deep/input{
      border-top-color: transparent !important;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      box-shadow: unset !important;
    }
  }
  #password-from-item {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    .password-input {
      flex: 1;
    }
    .password-show {
      flex: none;
    }
  }
  .eye-btn {
    height: 35px;
    width: 35px;
    margin-left: 5px;
    text-align: center;
    padding: 0;
    line-height: 35px;
  }
}
</style>