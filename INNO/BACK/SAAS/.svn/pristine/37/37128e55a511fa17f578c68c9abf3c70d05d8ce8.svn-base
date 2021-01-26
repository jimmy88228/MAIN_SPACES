<template>
    <div id="main-root" class="layout">
        <div id="main-header">
            <a id="main-logo">{{ title }}</a>
            <template v-if="isLogin">
                <div id="main-breadcrumb-box">
                    <BreadcrumbBar></BreadcrumbBar>
                </div>
                <Menu
                    id="main-menu"
                    mode="horizontal"
                    @on-select="onMenuSelect"
                    :active-name="''"
                    :open-names="[]"
                >
                    <Submenu name="User" key="User" class="main-menu-btn">
                        <template slot="title">{{ userName }}</template>
                        <MenuItem name="Edit">
                            <div class="main-menu-item">
                                <i class="iconfont icon-edit"></i>编辑
                            </div>
                        </MenuItem>
                        <MenuItem name="Exit">
                            <div class="main-menu-item">
                                <i class="iconfont icon-exit"></i>退出
                            </div>
                        </MenuItem>
                    </Submenu>
                </Menu>
            </template>
        </div>
        <div id="main-cev" class="anim-box">
            <transition v-bind="adimData">
                <router-view class="anim-view"></router-view>
            </transition>
        </div>
        <div id="main-footer">2018-2022 &copy; {{ title }}</div>
        <AdminEditDialog ref="aditDialog"></AdminEditDialog>
        <PreviewImg></PreviewImg>
    </div>
</template>

<script>
import LM from "@/helper/manager/login-manager";
import BreadcrumbBar from "@/components/breadcrumb-bar";
import PreviewImg from "@/components/preview-img";
import AdminEditDialog from "./components/admin-edit-dialog";
import Conf from "@/config";
export default {
    name: "App",
    components: { BreadcrumbBar, AdminEditDialog, PreviewImg },
    data() {
        return {
            title: Conf.TITLE,
            mAdimData: {},
            focus: false
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
        userName() {
            return LM.userInfos.userName;
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
            if (name === "Edit") {
                this.$refs.aditDialog
                    .setData({
                        adminId: LM.adminId,
                        userName: this.userName
                    })
                    .show();
                return;
            }
            this.$router.replace({ name: name });
        }
    }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/variables.less";
#main-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
}
#main-header {
    background-color: @bg-cp-color;
    display: flex;
    padding: 0, 0;
    padding-left: 10px !important;
    padding-right: 10px !important;
    box-sizing: border-box;
    height: 60px;
    flex-direction: row;
    align-items: center;
    flex: none;
}

#main-logo {
    flex: none;
    padding: 0, 0;
    padding-left: 20px !important;
    padding-right: 20px !important;
    height: 40px;
    line-height: 40px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 3px;
    font-size: 16px;
}
#main-breadcrumb-box {
    padding: 0 20px;
    flex: 1;
}
#main-menu {
    flex: none;
    height: 100%;
    margin-left: 30px;
    margin-right: 20px;
    z-index: 30;
    .main-menu-btn {
        text-align: center;
        min-width: 120px;
    }
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
