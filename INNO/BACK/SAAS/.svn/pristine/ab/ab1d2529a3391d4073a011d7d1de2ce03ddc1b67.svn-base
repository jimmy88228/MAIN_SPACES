<template>
    <div class="panel-group" v-if="node">
        <h3 class="panel-group-sub-title"></h3>
        <div class="panel-group-btn-box">
            <Button type="primary" size="large" @click="addChild(viewType.Group,true)">容器</Button>
            <Button type="primary" size="large" @click="addChild(viewType.Img,true)">图片</Button>
            <Button type="primary" size="large" @click="addChild(viewType.Gallery,true)">轮播图片</Button>
        </div>
    </div>
</template>

<script>
import PanelMixin from "./panel-mixin.js";
export default {
    name: "GroupPanel",
    mixins: [PanelMixin]
};
</script>

<style lang="less" scoped>
    .panel-group {
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
    .panel-group-sub-title {
        position: relative;
        text-align: center;
    }

    .panel-group-sub-title:before {
        content: "添加子控件";
        background: #fff;
        position: relative;
        z-index: 2;
    }

    .panel-group-sub-title:after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        border-top: 1px solid #ddd;
    }
    .panel-group-btn-box {
        display: flex;
        flex-direction: row;
        > * {
            width: 100%;
            margin-left: 10px;
        }
        > *:first-child {
            margin-left: 0px;
        }
    }
</style>
