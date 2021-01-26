
<template>
    <div id="cp-root">
        <SiderMenu></SiderMenu>
        <div id="cp-box">
            <div id="cp-cav-box" class="anim-box">
                <transition v-bind="adimData">
                    <keep-alive>
                        <router-view class="anim-view" v-if="$route.meta.keepAlive"></router-view>
                    </keep-alive>
                </transition>
                <transition v-bind="adimData">
                    <router-view class="anim-view" v-if="!$route.meta.keepAlive"></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import PageHelper from "@/helper/page-helper";
import SiderMenu from "./components/sider-menu";
export default {
    name: "ControlPanel",
    components: { SiderMenu },
    data() {
        return {
            mAdimData: {}
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
        }
    },
    watch: {
        $route(to, from) {
            this.mAdimData = this.$getAnimData(from, to, 2);
            PageHelper.setNewPage(to);
        }
    },
    mounted() {
        PageHelper.setNewPage(this.$route);
    }
};
</script>
<style scoped>
    #cp-root {
        width: 100%;
        height: 100%;
        position: relative;
        padding-left: 50px;
    }
    #cp-box {
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
    }
    #cp-cav-box {
        width: 100%;
        height: 100%;
    }
</style>
