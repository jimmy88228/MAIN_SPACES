<template>
<div class="change-pwd">
  <div class="desc-notice m-b-10">*密码必须包含数字和大小写字母，且不少于8位</div>
  <Form :label-width="100" :model="formData" ref="formDataRef" :rules="ruleValidate">
      <FormItem label="旧密码" prop="oldpasswd" v-if="!isHideOld">
          <custom-input class="base-input" type="password" v-model="formData.oldpasswd" placeholder="输入旧密码"></custom-input>
      </FormItem>
      <FormItem label="新密码" prop="newpasswd">
          <custom-input class="base-input" type="password" v-model="formData.newpasswd" placeholder="输入新密码"></custom-input>
      </FormItem>
      <FormItem label="确认新密码" prop="notarizepasswd">
          <custom-input class="base-input" type="password" v-model="formData.notarizepasswd" placeholder="请再次输入新密码"></custom-input>
      </FormItem>
      <div class="p-t-10" :class="isHideCancel ? 'text-r' : 'text-c'">
        <Button @click="cancel" class="m-r-20" v-if="!isHideCancel">取消</Button>
        <Button type="primary" @click="confirm" :loading="btnLoading">确认</Button>
      </div>
  </Form>
</div>
</template>

<script>
export default {
  props: {
    isHideCancel: Boolean,
    isShieldMsg: Boolean,
    isHideOld: Boolean
  },
  data(){
    return {
      formData: {
          oldpasswd: "",
          newpasswd: "",
          notarizepasswd: "",
      },
      ruleValidate: {
          oldpasswd: [
              {
                  required: true,
                  validator: this._checkString,
                  trigger: "blur",
                  message: "请填写旧密码",
              },
          ],
          newpasswd: [
              {
                  required: true,
                  validator: this.checkPassWord,
                  trigger: "blur",
              },
          ],
          notarizepasswd: [
              {
                  required: true,
                  validator: this.checkPassWord,
                  trigger: "blur",
              },
          ],
      },
      btnLoading: false
    }
  },
  methods:{
    checkPassWord(rule, value, callback){
      const {
        field
      } = rule;
      if(!value){
        callback(new Error("请输入登录密码"))
      } 
      else if((!new RegExp(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}/).test(value))){
        callback(new Error('密码必须包含数字和大小写字母，且不少于8位'))
      } else if((new RegExp(/(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){3}\d/g).test(value))){
        callback(new Error('密码不能含有超过3位的连续数字'));
      } else {
        callback();
      }
    },
    confirm() {
      this.$refs["formDataRef"].validate((valid) => {
            if (valid) {
                if(!this.isHideOld && this.formData.oldpasswd == this.formData.newpasswd){
                  this.$Message.warning("旧密码与新密码不能相同");
                  return;
                }
                if(this.formData.newpasswd != this.formData.notarizepasswd){
                  this.$Message.warning("新密码与确认密码不一致");
                  return;
                }
                this.confirmReq();
            } else {
                this.$Message.warning("请完善信息");
            }
        });
    },
    confirmReq() {
      this.btnLoading = true;
      return this.$MainApi
          .editInitpasswd({
              data: {
                ...this.formData,
              isCheckOldPwd: this.isHideOld ? 0 : 1
              }
          })
          .then((res) => {
              if (res.code) {
                  if(!this.isShieldMsg){
                      this.$Message.success(res.message || "操作成功");
                  }
                  this.formData = {
                    oldpasswd: "",
                    newpasswd: "",
                    notarizepasswd: "",
                  }
                  this.$emit("success");
              } else {
                  this.$Message.warning(res.message || "操作失败");
              }
          })
          .finally(() => {
              setTimeout(()=>{
                  this.btnLoading = false;
              }, 2000)
          });
    },
    cancel(){
      this.$emit("cancel")
    }
  }
}
</script>

<style lang="less" scoped>
  .change-pwd{
    min-width: 400px;
  }
</style>