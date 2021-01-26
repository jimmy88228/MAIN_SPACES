<template>
    <div ref="viewRoot" v-if="node" class="layout-group" :class="{selected:selected}" :style="styleStr.value">
        <div v-if="canEdit" class="layout-click" @click="editLayout"></div>
        <template v-for="(node,index) in child">
            <Group v-if="node.type === 'Group'" :key="index" :node="node" :root-width="rootWidth" @select="onSelect"/>
            <Img v-else-if="node.type === 'Img'" :key="index" :node="node" :root-width="rootWidth" @select="onSelect"/>
            <Gallery v-else-if="node.type == 'Gallery'" :key="index" :node="node" :root-width="rootWidth" @select="onSelect"/>
        </template>
        <Border v-if="canEdit" :text="viewName" :selected="selected"/>
    </div>
</template>

<script>
import Group from "./group";
import Img from "./img";
import Gallery from "./gallery";
import Border from "../base/border";
import ViewMixin from "./view-mixin.js";

export default {
    name: "Group",
    mixins: [ViewMixin],
    components: { Group, Img, Gallery, Border },
    computed: {},
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

<style scoped>
    .layout-group {
        position: relative;
        transition: all 0.24s;
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .layout-click {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .layout-group.selected {
        min-width: 1px;
        min-height: 1px;
    }
</style>
