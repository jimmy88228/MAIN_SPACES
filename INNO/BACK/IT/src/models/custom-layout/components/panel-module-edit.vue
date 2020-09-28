<template>
    <div class="module-edit-box">
        <div class="module-tree-box">
            <ModuleTreeView :module-node="moduleNode"/>
        </div>
        <div class="module-preview-box">
            <div class="module-preview-cev">
                <ModulePreview :module-node="moduleNode"/>
            </div>
            <div class="module-preview-view-bar">
                <Button type="primary" size="large" @click="addChild(viewType.Group,true)">容器</Button>
                <Button type="primary" size="large" @click="addChild(viewType.Img,true)">图片</Button>
                <Button type="primary" size="large" @click="addChild(viewType.Gallery,true)">轮播图片</Button>
            </div>
        </div>
        <div v-if="canEdit" class="module-panel-box">
            <EditPanel :node="editNode" />
        </div>
    </div>
</template>

<script>
import ModulePreview from "./preview-module";
import ModuleTreeView from "./base/view-tree";
import EditPanel from "./edit-panel";
import ViewType, { CreateView } from "./helper/view-type.js";
import Node from "./helper/node.js";

export default {
    components: { ModulePreview, EditPanel, ModuleTreeView },
    data() {
        return {};
    },
    props: ["moduleNode"],
    computed: {
        viewType() {
            return ViewType;
        },
        canEdit() {
            return this.moduleNode && this.moduleNode.layoutManager.canEdit;
        },
        editNode() {
            return this.moduleNode && this.moduleNode.layoutManager.editNode;
        }
    },
    methods: {
        addChild(type, select) {
            let cv = CreateView[type];
            let view = cv && cv();
            if (view) {
                let node = new Node(view);
                this.moduleNode.addChild(node);
                select && node.toEdit();
            }
        }
    }
};
</script>

<style scoped lang="less">
    .module-edit-box {
        display: flex;
        flex-direction: row;
        height: 100%;
        overflow: hidden;
    }
    .module-tree-box {
        border: 2px solid #efefef;
        height: 100%;
        min-width: 250px;
        flex: none;
    }
    .module-preview-box {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        flex: none;
        height: 100%;
    }
    .module-preview-cev {
        height: 100%;
        flex: 1;
        border: 2px solid #efefef;
        overflow: hidden;
        padding: 5px;
    }
    .module-preview-view-bar {
        display: flex;
        flex-direction: row;
        flex: none;
        margin-top: 5px;
        > * {
            width: 100%;
            margin-left: 5px;
        }
        > *:first-child {
            margin-left: 0px;
        }
    }
    .module-panel-box {
        border: 2px solid #efefef;
        width: auto;
        height: 100%;
        display: inline-block;
        flex: none;
        position: relative;
        margin-left: 16px;
    }
    .module-panel-box:after {
        content: " ";
        position: absolute;
        left: -30px;
        top: 50%;
        transform: translateY(-50%);
        border: 15px solid transparent;
        border-right-color: #efefef;
    }
</style>
