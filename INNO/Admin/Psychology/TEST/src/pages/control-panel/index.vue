
<template>
    <div id="cp-root">
        <SiderMenu id="cp-sider-menu" v-if="!_isThird"></SiderMenu>
        <div id="cp-root-cont">
            <div id="cp-box" :class="{ 'show-mark':  $route.meta.watermark, 'bg-page' : !$route.meta.removeBg}"  :style="$route.meta.bgColor ? 'background-color:' + $route.meta.bgColor + ';' : ''">
                <OpenedPageTags v-if="$store.state.app.openPageTags && !_isThird"></OpenedPageTags>
                <UpgradePrompt></UpgradePrompt>
                <div id="cp-cav-box" class="anim-box">
                    <vue-scroll ref="pageVueScroll" class="anim-view-area" @handle-scroll="viewScroll"  >
                        <div class="anim-view-area-stay ">
                            <div class="flex-s0" :class="{ 'is-expand': isExpand }">
                                <div v-if="!_isThird && !$route.meta.hideBreadcrumb" class="anim-view-area-breadcrumb"><BreadcrumbBar ></BreadcrumbBar></div>
                                <div class="anim-view-area-title bold" v-if="$route.meta.title && !$route.meta.hideTitle">{{$route.meta.title}}</div>
                            </div>
                            <div class="anim-router-view" id="animRouterView">
                                <transition v-bind="adimData">
                                    <keep-alive>
                                        <router-view class="anim-router" v-if="$route.meta.keepAlive"></router-view>
                                    </keep-alive>
                                </transition>
                                <transition v-bind="adimData">
                                    <router-view class="anim-router" v-if="!$route.meta.keepAlive"></router-view>
                                </transition>
                                <Spin :fix="true" v-if="$store.state.app.pageLoading"></Spin>
                            </div>
                            <div class="view-operate-area">
                                <div class="view-operate" @click="isExpand = !isExpand">
                                    <Icon type="md-contract" v-if="isExpand"/>
                                    <Icon type="md-expand" v-else />
                                </div>
                            </div>
                        </div>
                    </vue-scroll>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PageHelper from "@/helper/page-helper";
import SiderMenu from "./components/sider-menu";
import OpenedPageTags from "./components/opened-page-tags";
import BreadcrumbBar from "@/components/breadcrumb-bar";
import UpgradePrompt from "@/components/view-components/prompt/upgrade-prompt/index.vue";
// import vuescroll from "";
export default {
    name: "ControlPanel",
    components: { SiderMenu, OpenedPageTags, BreadcrumbBar, UpgradePrompt },
    data() {
        return {
            mAdimData: {},
            isExpand: false
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
                leaveToClass: this.mAdimData.leaveTo,
            };
        },
    },
    watch: {
        $route(to, from) {
            this.mAdimData = this.$getAnimData(from, to, 2);
            PageHelper.setNewPage(to, from);
        },
    },
    methods: {
        viewScroll(vertical, horizontal) {
            // this.$store.commit("setPageScrollTop", vertical.scrollTop || 0);
        },
    },
    mounted() {
        PageHelper.setNewPage(this.$route);
    },
};
</script>
<style scoped lang="less">
@import "~@/assets/css/variables.less";
#cp-root {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
}
#cp-sider-menu {
    display: block;
    // float: left;
    height: 100%;
    flex-shrink: 0;
}
#cp-root-cont {
    flex: 1;
    width: 100%;
    height: 100%;
    padding-top: 14px;
    padding-left: 14px;
}

#cp-box {
    display: flex;
    height: 100%;
    flex-direction: column;
    overflow: hidden;
    position: relative;
}

#cp-cav-box {
    width: 100%;
    height: 100%;
}
.view-operate-area{
    width: 30px;
    height: 30px;
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 5;
    overflow: hidden;
}
.view-operate{
    width: 100%;
    height: 100%;
    font-size: 20px;
    border-radius: 100%;
    cursor: pointer;
    background: rgba(0,0,0,0.5);
    box-shadow: 0 0 5px #b2b2b2;
    opacity: 0.5;
    transition: all .35s;
    transform: translate(100%,100%);
    .ivu-icon{
        color:#fff;
        position:absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
.view-operate:hover{
    opacity: 1;
}
.is-expand{
    display: block;
}
@media screen and (max-height:600px){
    .view-operate{
        transform: translate(0,0);
    }
    .is-expand{
        display: none;
    }
}
</style>
<style lang="less">
#cp-root {
    #cp-box {
        .watermark-div {
            display: none;
        }
    }
    #cp-box.show-mark {
        .watermark-div {
            display: block;
        }
    }
}
</style>
