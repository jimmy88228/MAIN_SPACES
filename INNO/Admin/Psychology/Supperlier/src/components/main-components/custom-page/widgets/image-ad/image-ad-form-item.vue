<template>
    <div class="ad-item-form">
        <draggable ghost-class="ghost" :list="images" :group="{name:'imageList'}" handle=".handle_ad" v-bind="dragOptions" @start="dragStart" @end="dragEnd">

            <div v-for="(item,index) in images" :name="index" :key="index" class="group-item">
                <Icon type="ios-close-circle-outline" class="close" title="移除" @click="removeImg(index)" />
                <Icon type="md-apps" class="handle_ad" title="拖拽排序" />
                <div class="item-cont">
                    <div class="cont-img">
                        <img-view uploadType="custom_page" display="flex" :img="item.img" :isCustomChoose="false" @selectImg="(data)=>{selectSingleImage(index, data)}" @delImg="clearImg(index)"></img-view>
                        <!-- <div class="image-box-text">
                            <a @click="onImageHotmap(index)">热区</a>
                        </div> -->
                    </div>
                    <div class="cont-info">
                        <linkItem :itemInfo="item" :pageInfo="pageInfo"></linkItem>
                    </div>
                </div>
            </div>
        </draggable>

        <Button @click="selectImage" class="btn-box">
            <Icon type="md-add" size="18" class="m-r-5"></Icon>添加图片
        </Button> 

        <!--图片热区编辑器-->
        <!-- <imageHotmapForm ref="image-hotmap-form"></imageHotmapForm> -->

        <!-- <Modal v-model="modalPlayShow" title="" :styles="{top: '20px'}" class="video-list-modal" :loading="modalPlayLoading" footer-hide>
                <video-player ref="videoPlayer" :options="playerOptions"></video-player>
            </Modal> -->
    </div>
</template>

<script>
import draggable from "vuedraggable";
import linkItem from "../../component/link-item/link-item";
// import linkTo from "@/views/my-components/link-to/link-to";
// import imageHotmapForm from "./image-hotmap-form";
// import imageEdit from "@/views/my-components/image-edit/image-edit";
// 载入videojs 组件
// import "video.js/dist/video-js.css";
// import { videoPlayer } from "vue-video-player";

export default {
    name: "imageAdItemForm",
    components: {
        draggable,
        linkItem,
        // linkTo,
        // imageHotmapForm,
        // videoPlayer,
        // imageEdit,
    },
    props: {
        currIndex: {
            type: [Number, String],
            default: 0,
        },
        groupItem: {
            type: Object,
            default: {
                images: [],
            },
        },
        pageInfo: {
            type: Object,
            default: ()=>{
                return {}
            },
        },
        groupIndex: {
            type: [Number, String],
            default: 0,
        },
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost",
            };
        },
        images() {
            let groupItem = this.groupItem || {};
            let images = groupItem.images || [];
            // images.map((item, index) => {
            //     if (!item.link) {
            //         this.$set(this.groupItem.images[index], "link", {
            //             code: "",
            //             id: "",
            //             remark: "",
            //             url: "",
            //         });
            //     } else {
            //       if (!item.link.code) this.$set(this.groupItem.images[index].link, "code", "");
            //       if (!item.link.id) this.$set(this.groupItem.images[index].link, "id", "");
            //       if (!item.link.remark) this.$set(this.groupItem.images[index].link, "remark", "");
            //       if (!item.link.url) this.$set(this.groupItem.images[index].link, "url", "");
            //     }
            // });
            return images;
        },
    },
    data() {
        return {
            // groupItem: {
            //   images: [],
            // },
            panelVal: "1",
            drag: false,

            modalPlayShow: false,
            modalPlayLoading: false,

            // 播放器配置
            // playerOptions: {
            //   autoplay: true,
            //   sources: [
            //     {
            //       type: "video/mp4",
            //       src: "",
            //     },
            //   ],
            //   notSupportedMessage: "此视频暂无法播放，请稍后再试",
            // },
        };
    },
    methods: {
        // init() {
        //   // 双向绑定store 的数据
        //   let dataList = this.$store.state.app.pageCompList;
        //   this.groupItem =
        //     dataList[this.currIndex].setting.imagesGroup[this.groupIndex];
        //   if (typeof this.groupItem.images == "undefined") {
        //     this.$set(this.groupItem, "images", []);
        //   }
        // },
        // 链接到 选中后的回调
        onSelectLink(index, selectedLink) {
            this.$set(this.groupItem.images[index], "link", selectedLink);
        },
        // 移除图片
        removeImg(index) {
            this.$Modal.confirm({
                title: "操作提示",
                content: "确定移除图片吗？",
                okText: "确定",
                cancelText: "取消",
                onOk: () => {
                    this.$delete(this.groupItem.images, index);
                },
            });
        },
        // // 选择图片（单选）
        selectSingleImage(index, src) {
            this.$set(this.groupItem.images[index], "img", src);
            // this.$set(this.groupItem.images[index], "width", data.width);
            // this.$set(this.groupItem.images[index], "height", data.height);
        },
        // 选择图片（多选）
        selectImage() {
            this.$UIModule({
            mode: "upload-view",
            props: {
                isMulti: true,
                extraParams: {
                    type: "custom_page"
                },
            },
            options: {},
            success:(data)=>{
                let images = []
                for(let i = 0; i < data.length; i++){
                    images.push({
                        img: data[i],
                        title: "",
                        tag: "",
                        link: {
                            // code: "",
                            // id: "",
                            // remark: "",
                            // url: "",
                        }
                    })
                }
                let result = [].concat(this.groupItem.images,images);
                this.$set(this.groupItem, "images", result);
            }
        });
            // this.$selectMaterial({
            //     type: "image",
            //     selectedData: [],
            //     multi: 1,
            //     getList: (item) => {
            //         for (let i = 0; i < item.length; i++) {
            //             this.groupItem.images.push({
            //                 img: item[i].src,
            //                 image: item[i].src,
            //                 title: "",
            //                 width: item[i].width,
            //                 height: item[i].height,
            //                 tag: "",
            //             });
            //         }
            //     },
            // });
        },
        clearImg(index) {
            this.$set(this.groupItem.images[index], "img", "");
        },
        // 图片的热区编辑
        onImageHotmap(index) {
            this.$refs["image-hotmap-form"].openModal(index, this.groupItem);
        },

        // // 选择视频
        // selectVideo(index, name, objType) {
        //   this.$selectMaterial({
        //     type: "video",
        //     selectedData: this.groupItem.images[index].videoSrc || "",
        //     getList: (item) => {
        //       console.log("item", item);
        //       this.$set(this.groupItem.images[index], "videoSrc", item.src);
        //     },
        //   });
        // },
        // // 删除视频
        // onRemoveVideo(index) {
        //   this.$Modal.confirm({
        //     title: "提示",
        //     content: "确定清除视频吗？",
        //     onOk: () => {
        //       this.$set(this.groupItem.images[index], "videoSrc", "");
        //     },
        //   });
        // },

        // onPlayVideo(src) {
        //   this.modalPlayShow = true;
        //   this.modalPlayLoading = true;
        //   this.playerOptions.sources[0].src = src;
        // },
        // 拖动开始
        dragStart(e) {
            this.drag = true;
        },
        // 拖动结束
        dragEnd(e) {
            this.drag = false;
        },
    },
    watch: {},
    mounted() {
        // this.init();
    },
};
</script>

<style lang="less" scoped>
.ad-item-form {
    .image-box {
        width: 75px;
        height: 75px;
        line-height: 75px;
        border: 1px solid #eee;
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
        background: center center no-repeat;
        background-size: 100% auto;
        margin-right: 5px;
        position: relative;
    }
    .image-box-text {
        font-size: 12px;
        padding: 0px 5px;
    }
    .group-item {
        border-radius: 5px;
        margin-bottom: 12px;
        position: relative;
        padding: 5px;
        padding-top: 10px;
        background: #fff;
        box-shadow: 0 0 4px 0 rgba(10, 42, 97, 0.2);
        .item-cont {
            display: flex;
            .cont-img {
                flex-shrink: 0;
                font-size: 0px;
            }
            .cont-info {
                width: 100%;
                flex: 1;
                padding-left: 5px;
            }
        }
        .close {
            position: absolute;
            right: -10px;
            top: -10px;
            font-size: 10px;
            cursor: pointer;
            display: none;
            color: red;
            font-size: 22px;
        }
        .handle_ad {
            position: absolute;
            right: 25px;
            top: -10px;
            font-size: 10px;
            cursor: move;
            display: none;
            color: #19be6b;
            font-size: 22px;
        }
        &:hover {
            .close,
            .handle_ad {
                display: block;
            }
        }
    }
    .ghost {
        opacity: 0.5;
    }
    .link-to .link-tags {
        max-width: 115px;
    }
    .ivu-radio-group-button.ivu-radio-group-small .ivu-radio-wrapper {
        font-size: 12px;
    }
    .btn-box{
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #ECECEC;
        width:100%;
        height: 40px;
    }
}
</style>
