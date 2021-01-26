<template>
    <div class="module" v-if="moduleNode">
        <template v-for="(node,index) in moduleNode.child">
            <Group v-if="node.type === ViewType.Group" :key="index" :node="node" :root-width="rootWidth" @select="onSelect"/>
            <Img v-else-if="node.type ===  ViewType.Img" :key="index" :node="node" :root-width="rootWidth" @select="onSelect"/>
            <Gallery v-else-if="node.type ===  ViewType.Gallery" :key="index" :node="node" :root-width="rootWidth" @select="onSelect"/>
        </template>
    </div>
</template>

<script>
import Group from "./view/group";
import Img from "./view/img";
import Gallery from "./view/gallery";
import ViewType from "./helper/view-type";

export default {
    name: "Module",
    components: { Group, Img, Gallery },
    props: ["moduleNode", "editable", "rootWidth"],
    data() {
        return {};
    },
    provide() {
        return {
            isCanEdit: this.editable
        };
    },
    computed: {
        ViewType() {
            return ViewType;
        }
    },
    methods: {
        onSelect(v) {
            this.$emit("select", v);
        }
    }
};
</script>
<style lang="less" scoped>
    .module {
        width: 100%;
        height: auto;
        box-sizing: border-box;
    }
</style>
