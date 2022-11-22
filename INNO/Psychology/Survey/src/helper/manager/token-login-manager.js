import Vue from "vue";
import utils from "@/helper/utils/index"; 
import DataHandle from "@/components/view-components/data-select/data-handle.js";
import WaterH from "@/helper/handler/watermarker.js";
const tokenLoginManager = new Vue({
    data: {
        mIsLogin: false,
        mUserInfos: {},
        mLoginToken: "",
        mAdminRoleData: [],
        accessToken: "",
        mAccessInfo: {},
    },
    computed: {
        isLogin() {
            return this.accessToken;
        },
        userInfos() {
            return this.mUserInfos || {};
        },
        loginToken() {
            return this.accessToken;
        },
        loginState(){
            return this.mAccessInfo.login_state; //login_state=1 是第三方登录，0不是第三方登录
        },
        accessInfo(){
            return this.mAccessInfo;
        }
        // adminId() {
        //     return (this.userInfos.admin_data && this.userInfos.admin_data.admin_id) || 0;
        // },
        // mainId(){
        //     return this.userInfos.mainId; 
        // },
        // adminRoleData(){
        //     return this.mAdminRoleData || [];
        // }
    },
    watch: {
        // userInfos(val) {
        //     this.$emit("UserInfosChange", val);
        // },
        // isLogin(val) {
        //     this.$emit("LoginStateChange", val);
        // }
    },
    created() {
        // this.mLoginToken = this.readLoginToken();
        // this.mUserInfos = this.readUserInfo();
        // this.$set(this, 'mAdminRoleData', this.readAdminRoleData());
    },
    methods: {
        // login(account, password) {
        //     return this.$MainApi.adminLogin({
        //         data: {
        //             login_name: account,
        //             login_pass: password,
        //         }
        //     }).then(res => {
        //         if (res.code) {
        //             let accessToken = res.accessToken || "";
        //             let data = JSON.parse(JSON.stringify(res));
        //             this.setLoginToken(accessToken);
        //             delete data.code;
        //             delete data.hasactionCode;
        //             delete data.initialMenu;
        //             delete data.message
        //             this.setUserInfos(data);
        //             this.getAdminRoleData();
        //             return res;
        //         }
        //         return Promise.reject(res);
        //     });
        // },
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
        // getAdminRoleData() {
        //     this.$MainApi.adminRoleData({data: {}}).then((res) => {
        //         if (res.code) {
        //             let data = res.data || {};
        //             let items = data.items;
        //             if (items) {
        //                 this.$set(this, 'mAdminRoleData', items);
        //                 utils.cache.set("adminRoleData", JSON.stringify(items));
        //                 console.log("save mAdminRoleData", this.mAdminRoleData)
        //             } else {
        //                 this.$set(this, 'mAdminRoleData', []);
        //                 utils.cache.remove("adminRoleData");
        //             }
        //         }
        //     });
        // },
        getLoginWay(){
            this.$MainApi.getLoginWay({data: {}}).then((res) => {
                if (res.code) {
                    let data = res.data || {};
                    this.mAccessInfo = data;
                    if(data.name){
                        WaterH.watermark(data.name);
                    }
                }
            });
        },
        setAccessToken(accessToken){
            if(accessToken){
                if(this.accessToken != accessToken){
                    this.accessToken = accessToken;
                    this.$nextTick(()=>{
                        this.getLoginWay();
                    })
                }
            } else {
                this.accessToken = '';
                this.mAccessInfo = {};
                WaterH.clearmark();
            }
        },
        // setLoginToken(loginToken) {
            // this.accessToken = loginToken;
            // this.mLoginToken = loginToken;
            // if (loginToken) {
            //     utils.cache.set("LoginToken", loginToken);
            // } else {
            //     utils.cache.remove("LoginToken");
            // }
        // },
        setUserInfos(userInfos) {
            this.mUserInfos = userInfos || {};
            // this.mUserInfos = userInfos;
            // if (userInfos) {
            //     utils.cache.set("UserInfo", JSON.stringify(userInfos));
            // } else {
            //     utils.cache.remove("UserInfo");
            // }
        },
        clear() {
            DataHandle.clear();
            this.setAccessToken(null);
            this.setUserInfos(null);
        },
        // readLoginToken() {
        //     return utils.cache.get("LoginToken") || "";
        // },
        // readUserInfo() {
        //     let userInfosStr = utils.cache.get("UserInfo");
        //     if (userInfosStr) {
        //         try {
        //             return JSON.parse(userInfosStr);
        //         } catch (e) {}
        //     }
        // },
        // readAdminRoleData(){
        //     let adminRoleDataStr = utils.cache.get("adminRoleData");
        //     if (adminRoleDataStr) {
        //         try {
        //             return JSON.parse(adminRoleDataStr);
        //         } catch (e) {}
        //     }
        // },
        logout() {
            this.clear();
        //    return this.$MainApi.adminLoginOut({
        //         other:{ isShowLoad: true }
        //     }).then((res)=>{
        //         if(res.code){
        //             this.clear();
        //             this.$Message.success(res.message.toString() || '退出成功')
        //         } else {
        //             this.$Message.warning(res.message.toString() || '操作失败')
        //         }
        //     }).catch((error)=>{
        //         this.$Message.warning(error.message.toString() || '操作失败')
        //     })
        },
    }
});
export default tokenLoginManager;
