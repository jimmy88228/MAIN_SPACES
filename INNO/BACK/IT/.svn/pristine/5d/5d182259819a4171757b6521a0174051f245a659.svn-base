<template>
    <div
        class="border-box"
        :class="{selected: selected}"
    >
        <div
            class="tip"
            v-show="selected"
        >{{text}}</div>
    </div>
</template>
<script>
export default {
    props: ["text", "selected"]
};
</script>

<style lang="less" scoped>
    .border-box {
        pointer-events: none;
        display: inline-block;
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        box-sizing: border-box;
    }
    .border-box {
        border-top: 1px dashed #ccc;
        border-right: 1px dashed #ccc;
        border-bottom: 1px dashed #ccc;
        border-left: 1px dashed #ccc;
    }

    .border-box.selected {
        border-width: 4px;
        border-color: #2d8cf0;
    }

    .tip {
        pointer-events: none;
        width: 80%;
        text-align: center;
        display: inline-block;
        font-weight: bold;
        text-shadow: 0px 0px 4px rgb(0, 0, 0);
        font-size: 18px;
        color: #2d8cf0;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
    }
</style>
