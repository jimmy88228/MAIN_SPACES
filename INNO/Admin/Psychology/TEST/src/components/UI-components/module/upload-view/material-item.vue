<template>
    <div class="material-item" :class="{ 'selected': selected }" @click="selectImg(data)">
        <div class="item-area" >
            <div class="item-img">
                <template v-if="data.status == 'finished' || data.src">
                    <img class="img" :src="data.src">
                </template>
                <template v-else>
                    <div class="progress-area" v-if="data.showProgress">
                        <Progress class="progress" :percent="data.percentage" hide-info></Progress>
                    </div>
                </template>
            </div>
            <Tooltip :content="data.name" placement="top" :transfer="true">
                <div class="item-name">{{data.name}}</div>
            </Tooltip>
        </div>
        <div class="select-item">
            <!--选择边框-->
            <span class="line-i line-t"></span>
            <span class="line-i line-r"></span>
            <span class="line-i line-b"></span>
            <span class="line-i line-l"></span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => {
                return {};
            },
        },
        selected: {
           type: Boolean,
            default: false 
        }
    },
    data() {
        return {};
    },
    methods:{
        selectImg(data){
            if(!data.src){
                this.$Message.warning("无效图片");
                return;
            }
            this.$emit("selectImg", data)
        }
    }
};
</script>

<style lang="less" scoped>
.material-item {
    position: relative;
    width: 122px;
    margin: 10px;
    border-radius: 3px;
    background: #fff;
    border: 1px solid #efefef;
    display: inline-block;
    cursor: pointer;
    .item-area {
        width:120px;
        .item-img {
            position: relative;
            width: 120px;
            height: 120px;
            display: block;
            overflow: hidden;
            .img {
                position: absolute;
                left: 50%;
                top: 50%;
                display: block;
                width: 120px;
                transform: translate(-50%, -50%);
                z-index: 1;
            }
            .progress-area{
                position: absolute;
                top:0px;
                left:0px;
                width:100%;
                height:100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(255,255,255,0.1)
            }
        }
        .item-name {
            display: inline-block;
            width: 120px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 4px;
            padding-left: 6px;
        }
    }
    .select-item {
        opacity: 0;
        // transition: opacity 0.2s;
        .line-i {
            position: absolute;
            display: block;
            background-color: #fe0302;
            width: 100%;
            height: 2px;
            z-index:2;
        }
        .line-t {
            top: 0px;
            left: 0px;
        }
        .line-r {
            top: 0px;
            right: 0px;
            width: 2px;
            height: 100%;
        }
        .line-b {
            bottom: 0px;
            left: 0px;
        }
        .line-l {
            top: 0px;
            left: 0px;
            width: 2px;
            height: 100%;
        }
        &::before {
            content: "\2713";
            position: absolute;
            bottom: -3px;
            right: 1px;
            font-size: 14px;
            font-weight: bold;
            color: #fff;
            z-index: 3;
        }
        &::after {
            content: "";
            position: absolute;
            bottom: -16px;
            right: -16px;
            width: 0;
            height: 0;
            border-width: 16px;
            border-color: transparent transparent transparent red;
            border-style: solid;
            transform: rotate(45deg);
        }
    }
}
.selected {
    .select-item{
        opacity: 1;
    }
}
</style>