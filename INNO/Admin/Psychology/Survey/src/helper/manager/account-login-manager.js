import Vue from "vue";
// import { MainApi } from "./http-manager";
// import Conf from "@/config";
// import Cookies from "js-cookie";
import utils from "@/helper/utils/index"; 
import WaterH from "@/helper/handler/watermarker.js";

const LoginManager = new Vue({
    data: {
        mIsLogin: false,
        mUserInfos: {},
        mLoginToken: "",
        mAdminRoleData: []
    },
    computed: {
        isLogin() {
            return !!this.mUserInfos && !!this.mLoginToken;
        },
        userInfos() {
            return this.mUserInfos || {};
        },
        loginToken() {
            return this.mLoginToken;
        },
        adminId() {
            return (this.userInfos.admin_data && this.userInfos.admin_data.admin_id) || 0;
        },
        mainId(){
            return this.userInfos.mainId; 
        },
        adminRoleData(){
            return this.mAdminRoleData || [];
        }
    },
    watch: {
        userInfos(val) {
            this.$emit("UserInfosChange", val);
        },
        isLogin(val) {
            this.$emit("LoginStateChange", val);
        }
    },
    created() {
        this.mLoginToken = this.readLoginToken();
        this.mUserInfos = this.readUserInfo();
        this.$set(this, 'mAdminRoleData', this.readAdminRoleData());
    },
    methods: {
        login(account, password) {
            return this.$MainApi.adminLogin({
                data: {
                    login_name: account,
                    login_pass: password,
                }
            }).then(res => {
                if (res.code) {
                    let data = res.data || {};
                    if(data.select_state != 1 && data.select_state != 2){
                        this.loginDataHandle(res);
                    }
                    return res;
                }
                return Promise.reject(res);
            });
        },
        loginDataHandle(res){
            let accessToken = res.accessToken || "";
            let data = JSON.parse(JSON.stringify(res));
            this.setLoginToken(accessToken);
            delete data.code;
            delete data.hasactionCode;
            delete data.initialMenu;
            delete data.message
            this.setUserInfos(data);
            this.getAdminRoleData();
            this.setFavicon(data.main_data);
            this.setWatermark(data.adminName);
        },
        // updateUserInfos() {
        //     if (!this.mLoginToken) {
        //         let msg = "请先登录";
        //         return Promise.reject(msg);
        //     }
        //     return MainApi.postGetAdminInfos({}).then(res => {
        //         if (res.code === "1") {
        //             this.setUserInfos(res.data);
        //             return true;
        //         }
        //         return Promise.reject(res.msg);
        //     });
        // },
        getAdminRoleData() {
            this.$MainApi.adminRoleData({data: {}}).then((res) => {
                if (res.code) {
                    let data = res.data || {};
                    let items = data.items;
                    if (items) {
                        this.$set(this, 'mAdminRoleData', items);
                        utils.cache.set("adminRoleData", JSON.stringify(items));
                        console.log("save mAdminRoleData", this.mAdminRoleData)
                    } else {
                        this.$set(this, 'mAdminRoleData', []);
                        utils.cache.remove("adminRoleData");
                    }
                }
            });
        },
        setLoginToken(loginToken) {
            this.mLoginToken = loginToken;
            if (loginToken) {
                utils.cache.set("LoginToken", loginToken);
            } else {
                utils.cache.remove("LoginToken");
            }
        },
        setUserInfos(userInfos) {
            this.mUserInfos = userInfos;
            if (userInfos) {
                utils.cache.set("UserInfo", JSON.stringify(userInfos));
            } else {
                utils.cache.remove("UserInfo");
            }
        },
        setFavicon(main_data){
            console.log("setFavicon")
            main_data = main_data || {};
            if(main_data.logo_thumbnail){
                let item = document.querySelector("link[rel*='icon']")
                item.href = main_data.logo_thumbnail;
            }
        },
        setWatermark(name){
            if(name){
                WaterH.watermark(name);
            } else {
                WaterH.clearmark();
            }
        },
        clear() {
            this.setLoginToken(null);
            this.setUserInfos(null);
        },
        readLoginToken() {
            return utils.cache.get("LoginToken") || "";
        },
        readUserInfo() {
            let userInfosStr = utils.cache.get("UserInfo");
            if (userInfosStr) {
                let userInfosObj = {}
                try {
                    userInfosObj = JSON.parse(userInfosStr);
                } catch (e) {}
                this.setFavicon(userInfosObj.main_data);
                this.setWatermark(userInfosObj.adminName);
                return userInfosObj;
            }
        },
        readAdminRoleData(){
            let adminRoleDataStr = utils.cache.get("adminRoleData");
            if (adminRoleDataStr) {
                try {
                    return JSON.parse(adminRoleDataStr);
                } catch (e) {}
            }
        },
        logout() {
           return this.$MainApi.adminLoginOut({
                other:{ isShowLoad: true }
            }).then((res)=>{
                if(res.code){
                    this.clear();
                    this.$Message.success(res.message.toString() || '退出成功')
                } else {
                    this.$Message.warning(res.message.toString() || '操作失败')
                }
            }).catch((error)=>{
                this.$Message.warning(error.message.toString() || '操作失败')
            })
        }
    }
});
export default LoginManager;
