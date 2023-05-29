<template>
    <div id="main-root" class="main-layout">
        <pageHeader v-if="!_isThird"></pageHeader>
        <div id="main-cev" class="anim-box">
            <transition v-bind="adimData">
                <router-view class="anim-view"></router-view>
            </transition>
        </div>
        <div id="main-footer">2019-2023 &copy; {{ title }}</div>
        <!-- <PreviewImg></PreviewImg> -->
        <LayoutSetting title="布局设置" ref="layoutSetting"></LayoutSetting>
    </div>
</template>

<script>
import LM from "@/helper/manager/login-manager";
import pageHeader from "@/pages/components/page-header.vue";
// import PreviewImg from "@/components/preview-img";
import LayoutSetting from "./components/layout-setting";
import Conf from "@/config";
// import logoImg from "./assets/logo.png";
export default {
    name: "App",
    components: { pageHeader, LayoutSetting },
    data() {
        return {
            title: Conf.TITLE,
            mAdimData: {},
            // logoImg
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
        
    },
    watch: {
        $route(to, from) {
            this.mAdimData = this.$getAnimData(to, from, 1);
        }
    },
    methods: {
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
    mounted(){
    }
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

</style>
