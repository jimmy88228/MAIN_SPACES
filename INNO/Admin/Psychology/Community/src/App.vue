<template>
    <div id="main-root" class="main-layout">
        <div id="main-header" class="main-header flex-b-c" v-if="!_isThird">
            <div class="flex-s-c header-platform">
                <div class="main-logo" v-if="!_structureName">
                    <img class="logo-img" src="./assets/logo.png" />
                    <a class="logo-txt">{{ title }}</a>
                </div>
                <div class="main-logo" v-else>
                    <img class="logo-img" v-if="_logo" :src="_logo" />
                    <a class="logo-txt">{{ _structureName }}</a>
                </div>
            </div>
            <div class="flex-s-c">
                <template v-if="isLogin">
                    
                    <Menu
                        id="main-menu"
                        mode="horizontal"
                        @on-select="onMenuSelect"
                        :active-name="menuSelect"
                        :open-names="[]"
                    >
                        <Submenu name="User" key="User" class="main-menu-btn">
                            <template slot="title">
                                <div class="admin-user flex-s-c">
                                    <span class="user-header m-r-10">{{_adminName && _adminName.slice(-2)}}</span>
                                    <div class="user-name m-r-10">{{_adminName}}</div>
                                </div>
                            </template>
                            <MenuItem name="change-pwd" v-if="!_isNeedResetPwd">
                                <div class="main-menu-item">修改密码</div>
                            </MenuItem>
                            <MenuItem name="Exit">
                                <div class="main-menu-item">退出登录</div>
                            </MenuItem>
                        </Submenu>
                    </Menu>
                </template>
            </div>
        </div>
        <div id="main-cev" class="anim-box">
            <transition v-bind="adimData">
                <router-view class="anim-view"></router-view>
            </transition>
        </div>
        <div id="main-footer">2018-2022 &copy; {{ title }}</div>
        <PreviewImg></PreviewImg>
        <LayoutSetting title="布局设置" ref="layoutSetting"></LayoutSetting>
        <changePWD ref="changePWDRef"></changePWD>
    </div>
</template>

<script>
import LM from "@/helper/manager/login-manager";
import PreviewImg from "@/components/preview-img";
import changePWD from "./models/components/change-pwd/index.vue";
import LayoutSetting from "./components/layout-setting";
import Conf from "@/config";
export default {
    name: "App",
    components: { PreviewImg, LayoutSetting, changePWD },
    data() {
        return {
            title: Conf.TITLE,
            mAdimData: {},
            focus: false,
            menuSelect: ''
        };
    },
    computed: {
        adimData() {
            return {
                enterClass: this.mAdimData.enter,
                enterActiveClass: this.mAdimData.enterActive,
                enterToClass: this.mAdimData.enterTo,
                leaveClass: this.mAdimData.leave,
                leaveActiveClass: this.mAdimData.leaveActive,
                leaveToClass: this.mAdimData.leaveTo
            };
        },
        isLogin() {
            return LM.isLogin;
        },
        userInfos() {
            return LM.userInfos || {};
        }
    },
    watch: {
        $route(to, from) {
            this.mAdimData = this.$getAnimData(to, from, 1);
        }
    },
    methods: {
        onSearch() {
            this.$refs.inputShortcut.focus();
        },
        change(focus) {
            this.focus = focus;
        },
        onMenuSelect(name) {
            if (this.matchedPath === name) {
                return;
            }
            if (name === "Exit") {
                LM.logout().then(() => this.$router.push({ name: "Login" }));
                return;
            }
            if (name === "change-pwd") {
                this.$refs["changePWDRef"] && this.$refs["changePWDRef"].showModal();
                return;
            }
        },
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/variables.less";
.main-layout{
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color:@page-bg-color;
}
.main-header{
    background-color: @bg-cp-color;
    display: flex;
    padding: 0px 18px 0px 15px;
    box-sizing: border-box;
    height: 80px;
    flex-direction: row;
    align-items: center;
    flex: none;
    font-size: 14px;
    color: #7F7F7F;
    border-bottom: 1px solid #EFEFEF;
}
.main-header a{
    font-size: 14px;
    line-height: 30px;
    display: inline-block;
    color: #7F7F7F;
}
.header-platform{
    
}
.main-logo{
    display: flex;
    align-items: center;
    margin-right:15px;
}
.main-logo .logo-img{
    width: 50px;
    height: 50px;
    display:block;
    margin-right:14px;
    border-radius: 50%;
    background-color: #efefef;
}
.header-platform .logo-name{
    padding:0px 15px;
}
.user-header{
    width: 40px;
    height:40px;
    display:flex;
    background-color: @primary-color;
    border-radius: 100%;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
    color:#fff;
}
#main-menu {
    flex: none;
    height: 100%;
    margin-left: 30px;
}
#main-cev {
    flex: 1;
    height: 100%;
    width: 100%;
}
#main-footer {
    flex: none;
    border-top: solid 1px #cccccc;
    padding: 2px 10px;
    text-align: center;
}
.main-menu-item {
    font-size: 14px;
    i {
        margin-right: 10px;
    }
}
</style>
<style lang="less">
#main-menu{
    text-align: center;
    z-index: unset;
    .main-menu-btn {
        text-align: center;
        min-width: 120px;
        border: 0 none;
        z-index: unset;
        .ivu-select-dropdown{
            min-width: 100px !important;
            z-index: 1001;
        }
    }
    .ivu-menu-submenu-title{
       .ivu-menu-submenu-title-icon{ display: none; } 
    }
    .main-menu-item{
        padding: 0px 5px;
    }
}
#main-menu::after{
    display: none !important;
}
</style>
