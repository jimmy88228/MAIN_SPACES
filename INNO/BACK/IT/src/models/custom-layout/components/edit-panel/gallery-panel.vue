<template>
    <div class="panel-gallery" v-if="node">
        <EditItem name="自动切换间隔" label="单位（毫秒）">
            <Input slot="edit" size="large" v-model="interval" clearable/>
        </EditItem>
        <EditItem name="切换滑动速度" label="单位（毫秒）">
            <Input slot="edit" size="large" v-model="duration" clearable/>
        </EditItem>
        <EditItem name="自动切换">
            <i-switch slot="edit" v-model="autoplay">
                <span slot="open">开</span>
                <span slot="close">关</span>
            </i-switch>
        </EditItem>
        <h3 class="sub-title"></h3>
        <GalleryItemPanel v-for="(item, index) in child" :key="index" :node="item"/>
        <Button type="primary" size="large" long @click="addChild(viewType.GalleryItem,false)">
            <i class="iconfont min r5 icon-add"></i>添加轮播页
        </Button>
    </div>
</template>

<script>
import EditItem from "@/support/components/edit-item";
import GalleryItemPanel from "./gallery-item-panel";
import PanelMixin from "./panel-mixin.js";

export default {
    name: "GalleryPanel",
    mixins: [PanelMixin],
    components: { EditItem, GalleryItemPanel },
    computed: {
        interval: {
            get() {
                return this.params.interval || 0;
            },
            set(val) {
                this.params = { interval: val || 0 };
            }
        },
        duration: {
            get() {
                return this.params.duration || 0;
            },
            set(val) {
                this.params = { duration: val || 0 };
            }
        },
        autoplay: {
            get() {
                return !!this.params.autoplay;
            },
            set(val) {
                this.params = { autoplay: val ? 1 : 0 };
            }
        }
    }
};
</script>

<style lang="less" scoped>
    .panel-gallery {
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

    .sub-title {
        position: relative;
        text-align: center;
        margin-bottom: 10px;
    }

    .sub-title:before {
        content: "轮播页设置";
        background: #fff;
        position: relative;
        z-index: 2;
    }

    .sub-title:after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        border-top: 1px solid #ddd;
    }
</style>
