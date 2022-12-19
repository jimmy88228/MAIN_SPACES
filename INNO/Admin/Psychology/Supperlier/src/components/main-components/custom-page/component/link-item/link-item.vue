<template>
    <div class="link-item">
        <div class="item-line m-b-5">
            <span class="line-tit w-nowrap">标题</span>
            <div class="line-cont">
                <Input size="small" v-model="itemInfo.title" placeholder="图片名称" />
            </div>
        </div>
        <div class="item-line m-b-5" v-if="pageInfo.pageType != 'REPORT'">
            <span class="line-tit w-nowrap">链接</span>
            <div class="line-cont">
                <navLink :itemInfo="itemInfo" :pageInfo="pageInfo"></navLink>
                <!-- <navLink :linkInfo="link"></navLink> -->
            </div>
        </div>
        <!-- <div class="item-line">
            <span class="line-tit w-nowrap">标签</span>
            <div class="line-cont"><Input v-model="itemInfo.tag" size="small"></Input></div>
        </div> -->
        
        <!-- <div class="item-line">
            <span class="line-tit w-nowrap">视频</span>
            <div class="line-cont">
                <div class="video-area" @click="selectVideo()" :style="itemInfo.videoSrc ? 'background-color:#000' : ''">
                    <Icon v-if="!itemInfo.videoSrc" type="md-add" size="20" title="添加视频"></Icon>
                    <template v-else>
                        <Icon type="md-play" size="20" color="#fff"></Icon>
                        <Icon type="ios-close-circle" class="close" title="删除" @click.stop="onRemoveVideo()" />
                        <Icon type="md-arrow-dropright-circle" class="play" title="播放" @click.stop="onPlayVideo(itemInfo.videoSrc)" />
                    </template>
                </div>
            </div>
        </div> -->

        <!-- <Modal v-model="modalPlayShow" title="" :styles="{top: '20px'}" class="video-list-modal" :loading="modalPlayLoading" footer-hide>
      <video-player ref="videoPlayer" :options="playerOptions"></video-player>
    </Modal> -->
    </div>
</template>

<script>
import navLink from "../nav-link/nav-link";
// import "video.js/dist/video-js.css";
// import { videoPlayer } from "vue-video-player";
export default {
    components: {
        navLink,
        // videoPlayer
    },
    props: {
        itemInfo: {
            type: Object,
            default:() => {
                return {};
            },
        },
        pageInfo: {
            type: Object,
            default:() => {
                return {};
            },
        },
    },
    data() {
        return {
            // modalPlayShow: false,
            // modalPlayLoading: false,
            // playerOptions: {
            //     autoplay: true,
            //     sources: [
            //         {
            //             type: "video/mp4",
            //             src: "",
            //         },
            //     ],
            //     notSupportedMessage: "此视频暂无法播放，请稍后再试",
            // },
        };
    },
    computed: {
        // link() {
        //     let itemInfo = this.itemInfo || {};
        //     if(!itemInfo.link) {
        //       this.$set(this.itemInfo, "link", {
        //             code: "",
        //             id: "",
        //             remark: "",
        //             url: "",
        //       })
        //     } else {
        //       if (!itemInfo.link.code) this.$set(this.itemInfo.link, "code", "");
        //       if (!itemInfo.link.id) this.$set(this.itemInfo.link, "id", "");
        //       if (!itemInfo.link.remark) this.$set(this.itemInfo.link, "remark", "");
        //       if (!itemInfo.link.url) this.$set(this.itemInfo.link, "url", "");
        //     }
        //     return itemInfo.link;
        // },
    },
    methods: {
        // 选择视频
        // selectVideo(index, name, objType) {
            // this.$selectMaterial({
            //   type: "video",
            //   selectedData: this.groupItem.images[index].videoSrc || "",
            //   getList: (item) => {
            //     console.log("item", item);
            //     this.$set(this.groupItem.images[index], "videoSrc", item.src);
            //   },
            // });
        // },
        // 删除视频
        // onRemoveVideo() {
        //     this.$Modal.confirm({
        //         title: "提示",
        //         content: "确定清除视频吗？",
        //         onOk: () => {
        //             this.$set(this.itemInfo, "videoSrc", "");
        //         },
        //     });
        // },
        // onPlayVideo(src) {
        //     this.modalPlayShow = true;
        //     this.modalPlayLoading = true;
        //     this.playerOptions.sources[0].src = src;
        // },
    },
};
</script>

<style lang="less" scoped>
.link-item {
    .item-line {
        display: flex;
        margin-bottom: 5px;
        .line-tit {
            flex-shrink: 0;
        }
        .line-cont {
            padding-left: 10px;
            width: 100%;
            flex: 1;
            .video-area {
                width: 75px;
                height: 30px;
                line-height: 30px;
                border: 1px solid #eee;
                border-radius: 5px;
                text-align: center;
                cursor: pointer;
                background: center center no-repeat;
                background-size: 100% auto;
                position: relative;
                margin: 5px 0px;
                &:hover {
                    .close,
                    .play {
                        display: block;
                    }
                }
                .close {
                    font-size: 20px;
                    color: #ed4014;
                    position: absolute;
                    right: -10px;
                    top: -10px;
                    display: none;
                    cursor: pointer;
                    line-height: 1;
                    background-color: #fff;
                    border-radius: 100%;
                }
                .play {
                    font-size: 20px;
                    font-weight: bold;
                    color: #2d8cf0;
                    position: absolute;
                    right: -10px;
                    top: 20px;
                    display: none;
                    cursor: pointer;
                    background: #fff;
                    border-radius: 100%;
                    line-height: 1;
                }
            }
        }
    }
}
</style>