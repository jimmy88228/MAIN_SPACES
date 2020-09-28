<template>
    <div class="panel-gallery-item" v-if="node">
        <Tooltip placement="left" content="删除当前轮播页" class="del-btn">
            <Icon type="md-close-circle" size="30" @click="del"/>
        </Tooltip>
        <EditItem name="广告位图片">
            <UploadImage slot="edit" :imgs.sync="picture" type="CUSTOM_LAYOUT" single/>
        </EditItem>
        <BaseStylePanel :node="node"/>
        <JumpPanel :node="node"/>
    </div>
</template>
<script>
import EditItem from "@/support/components/edit-item";
import UploadImage from "@/components/upload-img-group";
import BaseStylePanel from "./base-style-panel";
import JumpPanel from "./jump-panel";
import PanelMixin from "./panel-mixin.js";
export default {
    name: "GalleryItemPanel",
    mixins: [PanelMixin],
    components: { EditItem, UploadImage, JumpPanel, BaseStylePanel },
    computed: {
        picture: {
            get() {
                return this.params.src || "";
            },
            set(val) {
                this.params = { src: val || "" };
            }
        }
    },
    methods: {
        del() {
            this.node.removeFromParent();
        }
    }
};
</script>
<style lang="less" scoped>
    .panel-gallery-item {
        border: #ddd solid 1px;
        padding-bottom: 20px;
        border-left: 0px;
        border-right: 0px;
        border-top: 0px;
        position: relative;
        margin-bottom: 20px;
        width: 100%;
        overflow-x: hidden;
        > * {
            width: 100%;
            margin-top: 10px;
        }
        :first-child {
            margin-top: 0;
        }
    }

    .del-btn {
        width: auto;
        position: absolute;
        right: 4px;
        top: 4px;
        cursor: pointer;
        z-index: 2;
    }
</style>
