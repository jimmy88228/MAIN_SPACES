<template>
    <div class="editor-image-ad-view">
        <template v-if="checkEmpty">
            <template v-for="(group,gindex) in module_data.imagesGroup">
                <template v-if="module_data.imagesGroup.length > 0 || dynamic_setting.currTab == 'tab' + gindex">
                    <!-- 静态图片 -->
                    <Row v-if="dynamic_setting.type == 't1' && group" type="flex" style="flex-wrap: wrap" align="middle" :gutter="dynamic_setting.gutter" :key="gindex">
                        <template v-if="dynamic_setting.row == 5">
                            <!--五张图的时候显示不下，只能采用自动适配-->
                            <Col v-for="(item, index) in group.images" :key="index" style="width: 20%" class="image-item">
                                <template v-if="
                                dynamic_setting.open_slide == null ||
                                dynamic_setting.open_slide == false ||
                                (dynamic_setting.open_slide == true && index + 1 <= dynamic_setting.row)
                                ">
                                    <img :src="item.img" />
                                    <div v-if="item.videoSrc != null && item.videoSrc != ''" class="play-icon-box">
                                        <Icon type="md-play" class="play-icon"></Icon>
                                    </div>
                                </template>
                            </Col>
                        </template>
                        <template v-else>
                            <Col v-for="(item, index) in group.images" :key="index" :span="24 / dynamic_setting.row" class="image-item">
                                <template v-if="
                                    dynamic_setting.open_slide == null ||
                                    dynamic_setting.open_slide == false ||
                                    (dynamic_setting.open_slide == true && index + 1 <= dynamic_setting.row)
                                ">
                                    <img :src="item.img" /> 
                                    <div v-if="item.videoSrc != null && item.videoSrc != ''" class="play-icon-box">
                                        <Icon type="md-play" class="play-icon"></Icon>
                                    </div> 
                                    <!--热点示意图(只有单张图片的时候才显示)-->
                                    <template v-if="item.poster_map && dynamic_setting.row == 1">
                                        <div v-for="(map, mi) in item.poster_map" :key="'map-' + mi" class="map" :style="mapStyle(map)">
                                            <template v-if="map.link">
                                                {{ map.link.typeName }} {{ map.link.name }}
                                            </template>
                                        </div>
                                    </template>
                                </template>
                            </Col>
                        </template>
                    </Row>
                    <!-- 图片轮播 -->
                    <div v-if="dynamic_setting.type == 't2' && group" :key="gindex">
                        <template v-if="dynamic_setting.showStyle == 1">
                            <!--全屏轮播-->
                            <Carousel v-model="t2_val" loop :dots="dynamic_setting.indicator == 'none' ? 'none' : 'inside'" :radius-dot="dynamic_setting.indicator == 'dot'" :autoplay="dynamic_setting.autoPlay" :autoplay-speed="
                    (dynamic_setting.interval != '' && dynamic_setting.interval != null
                    ? dynamic_setting.interval
                    : 3) * 1000
                ">
                                <CarouselItem v-for="(item, index) in group.images" :key="index">
                                    <div style="width:100%;">
                                        <img :src="item.img" style="width:100%;"/>
                                        <div v-if="item.videoSrc != null && item.videoSrc != ''" class="play-icon-box">
                                            <Icon type="md-play" class="play-icon"></Icon>
                                        </div>

                                        <div v-show="dynamic_setting.showTitle" class="carousel-title" :style="
                        dynamic_setting.indicator != 'none' ? 'padding-bottom:15px;' : ''
                        ">
                                            {{ item.title }}
                                        </div>
                                    </div>
                                </CarouselItem>
                            </Carousel>
                        </template>
                        <template v-if="dynamic_setting.showStyle == 2">
                            <!-- v-if="index + 1 <= 5" -->
                            <!--左右滑动-->
                            <Row type="flex" style="flex-wrap: wrap" align="middle" :gutter="dynamic_setting.gutter">
                                <Col v-for="(item, index) in group.images" :key="index" :style="group.images.length > 5 ? 'width: 20%;' : 'flex: 1;'" class="image-item">
                                    <img :src="item.img" />
                                    <div v-if="item.videoSrc != null && item.videoSrc != ''" class="play-icon-box">
                                        <Icon type="md-play" class="play-icon"></Icon>
                                    </div>
                                </Col>
                            </Row>
                        </template>
                        <!--浮动轮播-->
                        <template v-if="dynamic_setting.showStyle == 3">
                            <div class="float_swiper" :current="t2_val" @touchstart="swiperTouchS" @touchend="swiperTouchE">
                                <div class="float_swiper_item" v-for="(item, index) in group.images" :key="index" :style="styleList[index] && styleList[index].style">
                                    <div class="list-img">
                                        <img :src="item.img" mode="widthFix" class="img-item"/>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div> 
                </template>
            </template>
        </template>
        <div v-else class="empty">
            <div class="img-box flex-c-c">
                <img :src="AdImg" alt="" class="img-logo">
            </div>
            <div class="m-t-20">图片模块</div>
        </div>
    </div>
</template>

<script>
import AdImg from "@/assets/images/custom/picture.png"
export default {
    name: "imageAdView",
    components: {},
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
            AdImg,
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
            if (!module_data.imagesGroup) {
                this.$set(this.compInfo.module_data, "imagesGroup", [])
            }
            let imagesGroup = module_data.imagesGroup || [];
            let currTab = this.dynamic_setting.currTab || "";
            let currIndex = Number(currTab.replace(/[^\d]/g, "")) || 0;
            let imgL = imagesGroup[currIndex] && imagesGroup[currIndex].images && imagesGroup[currIndex].images.length; 
            this.setSwiperStyle(this.t2_val, imgL);
            return module_data || {};
        },
        checkEmpty(){
            let module_data = this.compInfo.module_data || {};
            let group = module_data.imagesGroup||[];
            return group.length>0 && group[0] && group[0].images && group[0].images.length>0 || false;
        },
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
            let imagesGroup = this.module_data.imagesGroup || [];
            let dataL = imagesGroup && imagesGroup.images.length || 0;
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
<style lang="less">
.editor-image-ad-view {
    .image-item {
        position: relative;
        overflow: hidden;
        img {
            width: 100%;
            display: block;
        }
        .map {
            position: absolute;
            background: rgba(0, 0, 204, 0.3);
            z-index: 100;
            font-size: 12px;
            color: #fff;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .play-icon-box {
        top: 50%;
        position: absolute;
        width: 100%;
        z-index: 10;
        text-align: center;

        .play-icon {
            font-size: 20px;
            color: #fff;
            padding: 8px;
            background-color: rgba(0, 0, 0, 0.4);
            border-radius: 100%;
        }
    }
    .ivu-tabs-bar {
        border-bottom: 0 none;
    }
    .ivu-tabs-nav {
        display: flex;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.03);

        .ivu-tabs-tab {
            flex: 1 1 0%;
            text-align: center;
        }
    }

    .carousel-title {
        text-align: center;
        color: #fff;
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 5px 0;
        background-color: rgba(0, 0, 0, 0.25);
    }  
    .empty {
        text-align: center;
        padding: 40px 20px;
        color: #515a6e;
    }
    // 浮层轮播
    .float_swiper {
        width: 100%;
        height: 240px;
        position: relative;
    }
    .float_swiper_item {
        width: 200px;
        height: 90%;
        background-color: #fff;
        border-radius: 5px;
        overflow: hidden;
        box-sizing: border-box;
        padding: 5px;
        position: absolute;
        z-index: 2;
        transition: opacity .3s ease-out, transform .6s, top .6s, left .6s;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0px 0px 5px #ccc;
    }
    .float_swiper_item .list-img {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .float_swiper_item .img-item{
        width:100%;
        // padding-top:100%;
        background-color:#efefef;
    } 
    .img-box{
        width: 80px;
        height: 60px;
        border-radius: 6px;
        margin: 0 auto;
        background: rgba(239, 239, 239, 0.3);
    }
    .img-logo{
        width: 30px;
        height: 30px;
    }
}
</style>
