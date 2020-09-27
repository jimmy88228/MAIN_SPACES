<template>
    <div ref="viewRoot" v-if="node" class="layout-img" :class="{selected:selected}" :style="styleStr.value">
        <div v-if="canEdit" class="layout-click" @click="editLayout"></div>
        <EasyImage ref="img" :src="params.src" :mode="styleStr.mode" v-if="params.src" class="layout-img-cav"/>
        <Border v-if="canEdit" :text="viewName" :selected="selected"/>
    </div>
</template>

<script>
import EasyImage from "@/support/components/easy-image";
import Border from "../base/border";
import ViewMixin from "./view-mixin.js";
export default {
    name: "Img",
    mixins: [ViewMixin],
    components: { Border, EasyImage },
    computed: {
        styleObj() {
            return this.nodeData && this.nodeData.style;
        },
        width() {
            return this.styleObj && this.styleObj.width;
        },
        height() {
            return this.styleObj && this.styleObj.height;
        }
    },
    watch: {
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
        },
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
<style scoped>
    .layout-img {
        position: relative;
        transition: all 0.24s;
        overflow: hidden;
        box-sizing: border-box;
    }
    .layout-img.selected {
        min-width: 1px;
        min-height: 1px;
    }
    .layout-click {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
    }
    .layout-img-cav {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }
</style>
