<template>
    <div class="preview-module" v-bar>
        <div class="preview-module-cav" ref="scrollCev">
            <Module :module-node="moduleNode" :editable="true" :root-width="450" @select="onSelect"/>
        </div>
    </div>
</template>

<script>
import Module from "./module";
import $ from "jquery";

function offsetTop(target) {
    let top = 0;
    do {
        top += target.offsetTop;
        target = target.offsetParent;
    } while (target);
    return top;
}

export default {
    name: "ModulePreview",
    components: { Module },
    props: ["moduleNode"],
    data() {
        return {};
    },
    methods: {
        onSelect(target) {
            this.scrollTo(target);
        },
        scrollTo(target) {
            let scrollCev = this.$refs.scrollCev;
            let parent = this.$refs.scrollCev.parentNode;

            let parentHeight = parent.offsetHeight;
            let targetHeight = target.offsetHeight;

            let cevTop = offsetTop(scrollCev);
            let scrollTop = parent.scrollTop;
            let targetTop = offsetTop(target) - cevTop - scrollTop;
            let targetBottom = targetTop + targetHeight;

            let dy = 0;
            if (targetHeight >= parentHeight) {
                dy = targetTop;
            } else if (targetTop < 0) {
                dy = targetTop;
            } else if (targetBottom > parentHeight) {
                dy = targetBottom - parentHeight;
            }
            $(parent)
                .stop()
                .animate({ scrollTop: scrollTop + dy }, 300);
        }
    }
};
</script>
<style lang="less">
    .preview-module.eb {
        > .eb-bar-h,
        > .eb-bar-v {
            z-index: 4;
        }
    }
</style>

<style lang="less" scoped>
    .preview-module {
        width: 450px;
        height: 100%;
        overflow: hidden;
        background-color: #efefef;
    }
    .preview-module-cav {
        width: 100%;
        overflow-x: hidden;
    }
</style>
