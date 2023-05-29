<template>
<div>
  <transition name="fade">
    <div class="msg-error" v-if="warnNotice">
      <Icon type="md-information-circle" :size="20" class="" />
      <div class="m-l-5">{{warnNotice}}</div>
    </div>
  </transition>
  <Form ref="login-form" class="login-form" :model="fromData">
    <FormItem label="手机号码" prop="phone" label-for="login-phone" :rules="[{ required: true, validator: _checkPhone }]" >
      <custom-input customClass="login-input" v-focusNext="{ref:'code'}" element-id="login-phone" size="large" type="number" placeholder="请输入手机号码" v-model="fromData.phone" :disabled="loading" :maxlength="11" :showWordLimit="false" autocomplete="on" autofocus clearable></custom-input>
    </FormItem>
    <FormItem label="验证码" prop="code" label-for="login-code" :rules="[{ required: true, message: '验证码不能为空' }]">
      <div id="code-from-item" class="code-from-item">
        <custom-input customClass="login-input" ref="code" v-focusNext="{action:'handleSubmit'}" element-id="login-code" type="number" class="code-input"  size="large" placeholder="请输入验证码" :disabled="loading" v-model="fromData.code" autocomplete="off" 
        :showWordLimit="false"
        clearable></custom-input>
        <Button class="send-btn" :loading="sendIng" @click="sendActive" :disabled="sendCountDown > 0">{{sendCountDown > 0 ? sendCountDown + '秒后重发' : '发送验证码'}}</Button>
      </div>
    </FormItem>
    <FormItem>
      <Button class="btn-single" size="large" type="primary" @click="handleSubmit" :loading="loading" long>{{loading?'登录中':'登录'}}</Button>
    </FormItem>
  </Form>
  <slideVerify ref="slideVerifyModal" @onSuccess="sendLoginVcode" @onFail="" @onAgain="loading = false" @onClose="loading = false"></slideVerify>
  <chooseCustomer :isCustomReq="true" ref="chooseCustomerRef" @callback="chooseCustomerCallback"></chooseCustomer>
</div>
</template>

<script>
import chooseCustomer from "./choose-customer.vue";
import slideVerify from "@/components/main-components/slide-verify";
import LM from "@/helper/manager/login-manager";
export default {
  components: {
    chooseCustomer,
    slideVerify
  },
  data(){
    return {
      fromData: {
        phone: null,
        code: null
      },
      chooseCustomerId: 0,
      sendIng: false, // 发送验证码
      sendCountDown: 0,
      loading: false,
      warnNotice: "",
      countDownCache: {}
    }
  },
  methods: {
    sendActive(){
      this.$refs["login-form"].validateField('phone', (error)=>{
        if(!error){
          this.chooseCustomerId = 0;
          this.$refs["slideVerifyModal"] &&
            this.$refs["slideVerifyModal"].showVerifyModal({
              params: {
                loginName: this.fromData.phone,
              },
            });
        }
      })
    },
    sendLoginVcode(){
      this.sendIng = true;
      this.$MainApi.sendLoginVcode({
        data: {
          mobile_phone: this.fromData.phone,
          customer_id: this.chooseCustomerId || 0
        },
        other: {
          isErrorMsg: true
        }
      }).then((res)=>{
        if(res.code){
          if(res.customer_list){
            this.actChooseCustomer(res.customer_list);
          } else {
            this.chooseCustomerId = res.customer_id || 0;
            this.sendCountDown = res.last_time || 0;
            this.setCountDown(this.sendCountDown);
            this.$Message.success(res.message);
          }
        }
      }).finally(()=>{
        setTimeout(()=>{
          this.sendIng = false;
        }, 300);
      })
    },
    setCountDown(countDown){
      if(countDown){
        countDown = parseInt(countDown);
        this.timer = setTimeout(()=>{
          countDown = countDown - 1;
          this.sendCountDown = countDown;
          if(countDown){
            this.setCountDown(countDown);
          } else {
            clearTimeout(this.timer);
            this.timer = null;
          }
        }, 1000)
      }
    },
    actChooseCustomer(customer_data) {
      this.$refs["chooseCustomerRef"] &&
        this.$refs["chooseCustomerRef"].showModal({
          customerData: customer_data,
        });
    },
    chooseCustomerCallback(res) {
      this.chooseCustomerId = res.chooseCustomer;
      this.sendLoginVcode();
    },
    handleSubmit() {
      this.$refs["login-form"].validate().then((valid) => {
        if (!valid) {
          return;
        }
        this.getLogin();
      });
    },
    getLogin(detail = {}) {
      LM.loginByVcode(this.fromData.phone, this.fromData.code)
        .then((res) => {
          console.log("res", res);
          this.imgPath = res.img_path || "";
          if (res.state == 0) {
            this.needChangePwd();
          } else {
            this.loginHandle(res);
          }
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        })
        .catch((error) => {
            this.$refs['slideVerifyModal'].reset()
            this.loading = false;
            this.$Message.error(error.message || "登录失败");
            this.setNotice(error);
        });
    },
    setNotice(res) {
      this.warnNotice = res.message || "";
    },
    needChangePwd(){
      this.$emit("needChangePwd", "password")
    },
    loginHandle(data){
      this.$emit("loginHandle", data);
    }
  },
  destroyed(){},
  mounted(){
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
  .code-from-item{
    position: relative;
    /deep/.custom-input-box input{
      padding-right: 80px;
    }
    /deep/.ivu-icon-ios-close-circle{
      right: 80px;
    }
  }
  .send-btn{
    position: absolute;
    bottom: 1px;
    right: 0px;
    padding: 5px;
    height: 40px;
    background-color:#fff;
    color: #42A3DB;
    border: none !important;
    box-shadow: unset !important;
  }
}
</style>