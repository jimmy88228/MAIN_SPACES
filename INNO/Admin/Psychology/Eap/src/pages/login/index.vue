<template>
    <div id="login-layout" class="bg-page">
        <p id="login-title">LOGIN</p>
        <div id="login-card" class="bg-card">
            <Layout id="login-box">
                <Form ref="login-form" :model="fromData">
                    <FormItem prop="account" label-for="login-account" :rules="[{ required: true, message: '账号不能为空' }]">
                        <Input
                            v-focusNext="{ref:'password'}"
                            element-id="login-account"
                            size="large"
                            placeholder="账号"
                            v-model="fromData.account"
                            :disabled="loading"
                            :maxlength="30"
                            autocomplete="on"
                            autofocus
                            clearable
                        ></Input>
                    </FormItem>
                    <FormItem prop="password" label-for="login-password" :rules="[{ required: true, message: '密码不能为空' }]">
                        <div id="password-from-item">
                            <Input
                                ref="password"
                                v-focusNext="{action:'handleSubmit'}"
                                element-id="login-password"
                                class="password-input"
                                :type="showPwd?'text':'password'"
                                size="large"
                                placeholder="密码"
                                :disabled="loading"
                                v-model="fromData.password"
                                :maxlength="30"
                                autocomplete="on"
                                clearable
                            ></Input>
                            <Button class="eye-btn password-show" @mousedown.native="e=>showPwd=true" @mouseup.native="e=>showPwd=false" :disabled="loading">
                                <i class="iconfont" :class="showPwd?'icon-pw-show':'icon-pw-hide'"></i>
                            </Button>
                        </div>
                    </FormItem>
                    <FormItem>
                        <Button class="btn-single" size="large" type="primary" @click="handleSubmit" :loading="loading" long>{{loading?'登录中':'登录'}}</Button>
                    </FormItem>
                </Form>
            </Layout>
        </div>
        <chooseCustomer ref="chooseCustomerRef" @callback="chooseCustomerCallback"></chooseCustomer>
        <!-- <slideVerify 
        ref="slideVerifyModal"
        @onSuccess="getLogin"
        @onFail=""
        @onAgain="loading = false"
        @onClose="loading = false"
        ></slideVerify> -->
    </div>
</template>
<script>
import { $pm } from "@/plugins/router";
import LM from "@/helper/manager/login-manager";
import slideVerify from "@/components/main-components/slide-verify";
import chooseCustomer from "./components/choose-customer.vue";
import PageHelper from "@/helper/page-helper";
export default {
    name: "Login",
    components: {
        slideVerify,
        chooseCustomer
    },
    data() {
        return {
            fromData: {
                account: null,
                password: null
            },
            loading: false,
            showPwd: false
        };
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
        handleSubmit() {
            this.$refs["login-form"].validate().then(valid => {
                if (!valid) {
                    return;
                }
                this.loading = true;
                this.getLogin();
                // this.$refs["slideVerifyModal"].showVerifyModal();
            });
        },
        getLogin(){
            LM.login(this.fromData.account, this.fromData.password).then((res) => {
                let data = res.data || {};
                if(data.select_state == 1){
                    let customerData = data.customer_data || [];
                    this.$refs["chooseCustomerRef"] && this.$refs["chooseCustomerRef"].showModal({ customerData })
                } else {
                    this.loginHandle(res);
                }
                setTimeout(()=>{
                    this.loading = false;
                },1000)
            })
            .catch(error => {
                // this.$refs['slideVerifyModal'].reset()
                this.loading = false;
                this.$Message.error(error.message || "登陆失败");
            })
        },
        chooseCustomerCallback(res){
            LM.loginDataHandle(res);
            this.loginHandle(res);
        },
        loginHandle(data){
            PageHelper.setMenus(data.initialMenu, data.hasactionCode);
            this.$Message.success(data.message || "登陆成功");
            let target = this.$route.params.target;
            let to;
            if (target) {
                to = {
                    ...target,
                    query: { ...target.query, $pt: null }
                };
            } else {
                to = "/";
            }
            this.$router.replace(to);
        },
        checkParams() {}
    },
    mounted(){}
};
</script>

<style lang="less" scoped>
    #login-layout { 
        height: 100%;
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-bottom: 120px;
        transition: padding-bottom 0.3s;
    } 
    @media screen and (max-height: 600px){
        #login-layout { 
            padding-bottom: 0px;
        }
    }
    #login-title {
        font-size: 60px;
    }
    #login-card {
        padding: 30px 0 20px 0;
        margin-top: 20px;
    }
    #login-box {
        padding: 10px 30px;
        box-sizing: content-box;
        width: 300px;
        background: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        > * {
            margin-top: 10px;
            width: 100%;
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
</style>
