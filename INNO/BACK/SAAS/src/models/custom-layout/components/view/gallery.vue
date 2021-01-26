<template>
    <div ref="viewRoot" v-if="node" class="layout-gallery" :class="{selected:selected}" :style="styleStr.value">
        <div v-if="canEdit" class="layout-click" @click="editLayout"></div>
        <Carousel class="layout-gallery-carousel" :autoplay="autoplay">
            <CarouselItem class="layout-gallery-item" v-for="(item,index) in child" :key="index">
                <GalleryItem class="layout-gallery-item" :node="item" :root-width="rootWidth" :pw="width" :ph="height"></GalleryItem>
            </CarouselItem>
        </Carousel>
        <Border v-if="canEdit" :text="viewName" :selected="selected"></Border>
    </div>
</template>

<script>
import Border from "../base/border";
import GalleryItem from "./gallery-item";
import ViewMixin from "./view-mixin.js";
export default {
    name: "Gallery",
    mixins: [ViewMixin],
    components: { Border, GalleryItem },
    computed: {
        autoplay() {
            return !!this.params.autoplay;
        },
        width() {
            return this.style.width || 0;
        },
        height() {
            return this.style.height || 0;
        }
    },
    methods: {
        editLayout(e) {
            if (!this.canEdit) {
                return;
            }
            e.stopPropagation();
            this.edit();
        },

        delLayout() {
            if (!this.canEdit) {
                return;
            }
            this.del();
        }
    }
};
</script>
<style lang="less">
    .layout-gallery {
        width: 100%;
        height: 100%;
        .layout-gallery-carousel {
            height: 100% !important;
            .ivu-carousel-list {
                height: 100% !important;
                .ivu-carousel-track {
                    height: 100% !important;
                    .ivu-carousel-item {
                        height: 100% !important;
                        width: 100%;
                    }
                }
            }
        }
    }
</style>

<style scoped lang="less">
    .layout-gallery {
        position: relative;
        transition: all 0.24s;
        overflow: hidden;
        box-sizing: border-box;
    }
    .layout-gallery.selected {
        min-width: 4px;
        min-height: 4px;
    }
    .layout-click {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
    }
</style>
