<template>
    <div class="preview-img" @click.self="closedPre" v-if="isShow&&imgList">
        <Carousel class="preview-carousel" v-model="index" arrow="always" dots="outside">
            <CarouselItem class="preview-carousel-item" v-for="url in imgList" :key="url">
                <div class="preview-carousel-item-cav" :style="{backgroundImage: 'url(' + url + ')'}"></div>
            </CarouselItem>
        </Carousel>
    </div>
</template>

<script>
import PreviewImgManager from "@/components/preview-img-manager.js";

export default {
    name: "PreviewImg",
    computed: {
        isShow: {
            get() {
                return PreviewImgManager.isShow;
            },
            set(nv) {
                PreviewImgManager.isShow = nv;
            }
        },
        index: {
            get() {
                return PreviewImgManager.index;
            },
            set(nv) {
                PreviewImgManager.index = nv;
            }
        },
        imgList() {
            return PreviewImgManager.imgList;
        }
    },
    methods: {
        closedPre() {
            this.isShow = false;
        }
    }
};
</script>
<style lang="less">
    .preview-carousel {
        .ivu-carousel-list {
            height: 100%;
            .ivu-carousel-track {
                height: 100%;
            }
        }
    }
</style>
<style lang="less" scoped>
    .preview-img {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 10001;
    }

    .preview-carousel {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.3);
        width: 70%;
        height: 80%;
    }

    .preview-carousel-item {
        height: 100% !important;
    }

    .preview-carousel-item-cav {
        width: 100%;
        height: 100%;
        background-size: contain;
        background-position: 50% 50%;
        background-repeat: no-repeat;
    }
</style>
