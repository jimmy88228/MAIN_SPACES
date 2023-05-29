<template>
     <div v-if="viewShow" :class="{show:animShow}" class="progress_box">
        <Progress :percent="percent" :stroke-width="strokeW" :status="status" text-inside class="progress" />
    </div>
</template>
<script>
    export default {
        data() {
            return {
            }
        },
        props: {
            viewShow: {
                type: Boolean,
                default: false
            },
            animShow: {
                type: Boolean,
                default: false
            },
            percent: {
                type: Number,
                default: 0
            },
            strokeW: {
                type: Number,
                default: 40
            },
            status: {
                type: String,
                default: "active"
            },
        },
    }
</script>

<style lang="less" scoped>
.progress_box{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    box-sizing: border-box;
    padding-bottom: 100px; 
    opacity: 0;
    background:rgba(255,255,255,0.9);
    transition: all 0.32s;
    display: flex;
    justify-content: center;
    align-items: center;
    .progress{
        width: 40%;
    }
}
.progress_box.show{
    opacity: 1;
}
</style>