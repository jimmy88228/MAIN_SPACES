<template>
    <div class="slide-box" @click="clickSlide">
        <slot/>
    </div>
</template>
<script>
    export default {
        methods: {
            clickSlide() {
                this.$emit('click')
            }
        }
    }
</script>
<style lang="less" scoped>
    .slide-box {
        width: 100%;
        height: 100%;
        -ms-flex-negative: 0;
        flex-shrink: 0;
        z-index: 1;
    }

    .slide-box img {
        display: block;
    }
</style>