<template>
    <div class="view-tree" v-bar>
        <div ref="scrollCev" class="view-tree-cav">
            <template v-if="moduleNode">
                <TreeItemView v-for="(item,index) in moduleNode.child" :key="index" :node="item" :level="1" @select="onSelect"></TreeItemView>
            </template>
        </div>
    </div>
</template>
<script>
import TreeItemView from "./tree-item";
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
    name: "ModuleTreeView",
    components: { TreeItemView },
    props: ["moduleNode"],
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
<style lang="less" scoped>
    .view-tree {
        height: 100%;
    }
    .view-tree-cav {
        overflow-x: hidden;
    }
</style>
