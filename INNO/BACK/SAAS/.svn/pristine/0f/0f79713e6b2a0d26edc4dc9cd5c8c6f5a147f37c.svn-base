import Vue from "vue";
import store from "@/store";
import { MainApi } from "./http-manager";
import Conf from "@/config";
import Cookies from "js-cookie";

const LoginManager = new Vue({
    data: {
        mIsLogin: false,
        mUserInfos: {},
        mLoginToken: "",
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
            return this.userInfos.id;
        },
        isSenior() {
            return this.userInfos.adminType === 1;
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
        this.mAuthJson = this.getAuthJson();
    },
    methods: {
        login(account, password, brandcode = Conf.BRAND_CODE) {
            return MainApi.postAdminLogin({
                data: {
                    accounts: account,
                    password: password,
                    brandcode: brandcode
                }
            }).then(res => {
                if (res.code === "1") {
                    this.setLoginToken(res.data);
                    return this.updateUserInfos();
                }
                return Promise.reject(res.msg);
            });
        },
        updateUserInfos() {
            if (!this.mLoginToken) {
                let msg = "请先登录";
                return Promise.reject(msg);
            }
            return MainApi.postGetAdminInfos({}).then(res => {
                if (res.code === "1") {
                    let data = JSON.parse(JSON.stringify(res.data || {}));
                    let authList = JSON.parse(JSON.stringify(data.authList)) || [];
                    delete data.authList;
                    this.setUserInfos(data);
                    this.setAuthList(authList);
                    return true;
                }
                return Promise.reject(res.msg);
            });
        },
        setLoginToken(loginToken) {
            this.mLoginToken = loginToken;
            if (loginToken) {
                Cookies.set("LoginToken", loginToken);
            } else {
                Cookies.remove("LoginToken");
            }
        },
        setUserInfos(userInfos) {
            this.mUserInfos = userInfos;
            if (userInfos) {
                Cookies.set("UserInfo", JSON.stringify(userInfos));
            } else {
                Cookies.remove("UserInfo");
            }
        },
        clear() {
            this.setLoginToken(null);
            this.setUserInfos(null);
            this.setAuthList(null);
        },
        readLoginToken() {
            return Cookies.get("LoginToken") || "";
        },
        readUserInfo() {
            let userInfosStr = Cookies.get("UserInfo");
            if (userInfosStr) {
                try {
                    return JSON.parse(userInfosStr);
                } catch (e) {}
            }
        },
        getAuthJson(){
           let authJson = sessionStorage.getItem("AUTHJSON") || "{}";
           try {
            authJson = JSON.parse(authJson);
           } catch (error) {
               console.log(error)
           }
            store.commit({
                type: "setData",
                name: "authJson",
                data: authJson
            })
            return authJson;
        },
        transformAuthJson(authList){
            if(!authList || authList.length == 0){ return null; }
            let authJson = {};
            for(let i = 0; i < authList.length; i++){
                let authCode = authList[i].authCode;
                authJson[authCode] = authList[i];
            }
            this.mAuthJson = authJson;
            return authJson;
        },
        setAuthList(authList){
            let authJson = this.transformAuthJson(authList);
            try {
                if(authJson){
                    sessionStorage.setItem("AUTHJSON", JSON.stringify(authJson));
                } else {
                    sessionStorage.removeItem("AUTHJSON");
                }
            } catch (error) {
                console.log(error)
            }
            //
            store.commit({
                type: "setData",
                name: "authJson",
                data: authJson
            })
        },
        logout() {
            return new Promise(rs => {
                this.clear();
                rs();
            });
        }
    }
});
export default LoginManager;
