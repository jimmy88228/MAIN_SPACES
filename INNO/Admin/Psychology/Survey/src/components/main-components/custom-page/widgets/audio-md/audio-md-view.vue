<style lang="less">
</style>

<template>
    <md-view type="audio" :compInfo="compInfo" :inTab="inTab"></md-view>
</template>

<script>
import mdView from "@/components/main-components/custom-page/component/module/md-view.vue"
export default {
    name: "imageAdView",
    components: {
        mdView
    },
    props: {
        compInfo: {
            type: Object,
            default: () => {},
        },
        inTab: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            t2_val: 0,
            // 浮动轮播
            styleList: [],
            touchs: [],
            swiperTime: null,
        };
    },
    computed: {
        dynamic_setting(){
            return this.compInfo.dynamic_setting || {};
        },
        module_data(){
            let module_data = this.compInfo.module_data || {};
            if (!module_data.audiosGroup) {
                this.$set(this.compInfo.module_data, "audiosGroup", [])
            }
            let audiosGroup = module_data.audiosGroup || [];
            let currTab = this.dynamic_setting.currTab || "";
            let currIndex = Number(currTab.replace(/[^\d]/g, "")) || 0;
            let imgL = audiosGroup[currIndex] && audiosGroup[currIndex].audios && audiosGroup[currIndex].audios.length; 
            this.setSwiperStyle(this.t2_val, imgL);
            return module_data || {};
        }
    },
    methods: {
        mapStyle(map) {
            // 当前比例 375，数据比例 600；
            let r = 375 / 600;
            return {
                bottom:
                    Math.abs(Math.ceil(map.map_y * r)) -
                    Math.ceil(map.map_height * r) +
                    "px",
                left: Math.ceil(map.map_x * r) + "px",
                width: Math.ceil(map.map_width * r) + "px",
                height: Math.ceil(map.map_height * r) + "px",
                "line-height": Math.ceil(map.map_height * r) + "px",
            };
        },
        swiperChangeEvent(isAdd = true) {
            let cur = this.swiperCurrent || 0;
            let audiosGroup = this.module_data.audiosGroup || [];
            let dataL = audiosGroup && audiosGroup.audios.length || 0;
            let i = isAdd ? 1 : -1;
            if (dataL > 0) {
                cur = cur + i;
                if (isAdd) {
                    if (cur == dataL) {
                        cur = 0;
                    }
                } else {
                    if (cur < 0) {
                        cur = (dataL - 1);
                    }
                }
                if (cur != this.swiperCurrent) {
                    this.swiperCurrent = cur;
                    this.setSwiperStyle(cur, dataL);
                }
            }
        },
        setSwiperStyle(cur, dataL) {
            let styleList = [];
            for (let i = 0; i < dataL; i++) {
                let style = ""
                if (i == cur) {
                    style = "z-index: 5;opacity: 1;transform:translate(-50%, -50%); scale(1);"
                } else if ((cur - 1) == i || (cur == 0 && i == (dataL - 1))) {
                    style = "z-index: 3;opacity: 0.8;left:0;transform:translate(0, -50%) scale(0.8);"
                } else if ((cur + 1) == i || (cur == (dataL - 1) && i == 0)) {
                    style = "z-index: 3;opacity: 0.8;left:100%;transform:translate(-100%, -50%) scale(0.8);"
                } else {
                    style = "z-index: 2;opacity: 0.8;transform:translate(-50%, -50%) scale(0.8);"
                }
                styleList.push({
                    style: style
                })
            }
            this.styleList = styleList;
        },
        swiperTouchS(e) {
            let changedTouches = e.changedTouches || [];
            this.touchs = this.touchs || {};
            this.touchs.x1 = changedTouches[0].clientX;
            this.touchs.y1 = changedTouches[0].clientY;
            this.swiperTime && clearTimeout(this.swiperTime);
        },
        swiperTouchE(e) {
            let changedTouches = e.changedTouches || [];
            this.touchs.x2 = changedTouches[0].clientX;
            this.touchs.y2 = changedTouches[0].clientY;
            let touchs = this.touchs || {};
            if (touchs.x1 > touchs.x2) {
                this.swiperChangeEvent();
            } else if (touchs.x1 < touchs.x2) {
                this.swiperChangeEvent(false);
            }
        },
    },
    watch: {},
    mounted() {
        this.$nextTick(()=>{

        })
    },
};
</script>
