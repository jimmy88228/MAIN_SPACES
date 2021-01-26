<template>
    <div class="layout-gallery-item" v-if="node" :style="styleStr.value">
        <EasyImage ref="img" :src="params.src" :mode="styleStr.mode" v-if="params.src" class="layout-gallery-item-cav"/>
    </div>
</template>

<script>
import EasyImage from "@/support/components/easy-image";
import ViewMixin from "./view-mixin.js";
export default {
    name: "GalleryItem",
    mixins: [ViewMixin],
    props: ["pw", "ph"],
    components: { EasyImage },
    computed: {
        width() {
            return this.style.width || 0;
        },
        height() {
            return this.style.height || 0;
        }
    },
    watch: {
        pw() {
            this.refreshImg();
        },
        ph() {
            this.refreshImg();
        },
        width() {
            this.refreshImg();
        },
        height() {
            this.refreshImg();
        }
    },
    methods: {
        refreshImg() {
            let img = this.$refs.img;
            img && img.refresh(300);
        }
    }
};
</script>
<style scoped>
    .layout-gallery-item {
        overflow: hidden;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }
    .layout-gallery-item-cav {
        width: 100%;
        height: 100%;
    }
</style>
