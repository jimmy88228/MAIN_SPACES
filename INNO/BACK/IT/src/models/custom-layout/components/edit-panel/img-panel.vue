<template>
    <div class="panel-img" v-if="node">
        <EditItem name="广告位图片">
            <UploadImage slot="edit" :imgs.sync="picture" type="CUSTOM_LAYOUT" single/>
        </EditItem>
        <JumpPanel :node="node"/>
    </div>
</template>

<script>
import EditItem from "@/support/components/edit-item";
import UploadImage from "@/components/upload-img-group";
import JumpPanel from "./jump-panel";
import PanelMixin from "./panel-mixin.js";

export default {
    name: "ImgPanel",
    mixins: [PanelMixin],
    components: { EditItem, UploadImage, JumpPanel },
    computed: {
        picture: {
            get() {
                return this.params.src || "";
            },
            set(val) {
                this.params = { src: val || "" };
            }
        }
    }
};
</script>

<style lang="less" scoped>
    .panel-img {
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
</style>
