<template>
    <Modal v-model="modalShow" :width="500" title="修改密码">
        <Form :label-width="100" :model="formData" ref="formDataRef" :rules="ruleValidate">
            <FormItem label="旧密码" prop="oldpasswd">
                <custom-input class="base-input" v-model="formData.oldpasswd" placeholder="输入旧密码"></custom-input>
            </FormItem>
            <FormItem label="新密码" prop="newpasswd">
                <custom-input class="base-input" type="password" v-model="formData.newpasswd" placeholder=输入新密码></custom-input>
            </FormItem>
            <FormItem label="确认新密码" prop="notarizepasswd">
                <custom-input class="base-input" type="password" v-model="formData.notarizepasswd" placeholder="请再次输入新密码"></custom-input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="primary" @click="confirm" :loading="btnLoading">确认</Button>
            <Button @click="modalShow = false">取消</Button>
        </div>
    </Modal>
</template>

<script>
export default {
    data() {
        return {
            modalShow: false,
            formData: {
                oldpasswd: "",
                newpasswd: "",
                notarizepasswd: "",
            },
            btnLoading: false,
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
                        validator: this._checkString,
                        trigger: "blur",
                        message: "请填写新密码",
                    },
                ],
                notarizepasswd: [
                    {
                        required: true,
                        validator: this._checkString,
                        trigger: "blur",
                        message: "请填写确认的新密码",
                    },
                ],
            },
        };
    },
    methods: {
        showModal() {
            this.modalShow = true;
        },
        confirm() {
          this.$refs["formDataRef"].validate((valid) => {
                if (valid) {
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
                    data: this.formData,
                })
                .then((res) => {
                    if (res.code) {
                        this.$Message.success(res.message || "操作成功");
                        this.modalShow = false;
                    } else {
                        this.$Message.warning(res.message || "操作失败");
                    }
                })
                .finally(() => {
                    this.btnLoading = false;
                });
        },
    },
};
</script>

<style>
</style>