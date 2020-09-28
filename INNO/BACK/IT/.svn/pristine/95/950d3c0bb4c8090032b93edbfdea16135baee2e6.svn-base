<template>
    <div class="tree-item">
        <div
            ref="itemName"
            :class="{'tree-item-name':true,'selected':selected}"
            :style="{'padding-left':paddingLeft }"
            @click.stop="select"
        >{{viewName}}({{typeName}})
            <div
                class="tree-item-del"
                @click.stop="del"
            >
                删除
            </div>
        </div>
        <div
            class="tree-child-box"
            v-if="type==viewType.Group && child && child.length > 0"
        >
            <TreeItemView
                v-for="(item,index) in child"
                :key="index"
                :node="item"
                :level="level+1"
                @select="onSelect"
            ></TreeItemView>
        </div>
    </div>
</template>
<script>
import TreeItemView from "./tree-item";
import ViewType from "../helper/view-type.js";
export default {
    name: "TreeItemView",
    components: { TreeItemView },
    props: ["node", "level"],
    computed: {
        viewType() {
            return ViewType;
        },
        nodeData() {
            return this.node.data;
        },
        child() {
            return this.node.child;
        },
        type() {
            return this.node.type;
        },
        viewName() {
            return this.node.name;
        },
        typeName() {
            return this.node.typeName;
        },
        paddingLeft() {
            return `${Number(this.level) * 10}px`;
        },
        selected() {
            return this.node.isEdit;
        }
    },
    mounted() {
        if (this.selected) {
            this.callSelect();
        }
    },
    watch: {
        selected(newVal) {
            if (newVal) {
                this.callSelect();
            }
        }
    },
    methods: {
        callSelect() {
            let v = this.$refs.itemName;
            if (v) {
                this.$emit("select", v);
            }
        },
        onSelect(v) {
            this.$emit("select", v);
        },
        select() {
            this.node.toEdit();
        },
        del() {
            this.node.removeFromParent();
        }
    }
};
</script>
<style lang="less" scoped>
    .tree-item-name {
        overflow: hidden;
        position: relative;
        padding-right: 10px;
        line-height: 40px;
        height: 40px;
        border-top: 2px dashed rgba(0, 0, 0, 0);
        border-right: 2px dashed rgba(0, 0, 0, 0);
        border-bottom: 2px dashed #efefef;
        border-left: 2px dashed rgba(0, 0, 0, 0);
    }
    .tree-item-name.selected {
        border-top: 2px dashed #2d8cf0;
        border-right: 2px dashed #2d8cf0;
        border-bottom: 2px dashed #2d8cf0;
        border-left: 2px dashed #2d8cf0;
    }
    .tree-item-del {
        line-height: 40px;
        height: 40px;
        position: absolute;
        text-align: center;
        cursor: pointer;
        color: #fff;
        width: 50px;
        right: -52px;
        top: 0px;
        background: #2d8cf0;
        transition: all 0.24s ease-in-out 0.1s;
    }
    .tree-item-name.selected .tree-item-del,
    .tree-item-name:hover .tree-item-del {
        right: 0px;
    }
</style>
