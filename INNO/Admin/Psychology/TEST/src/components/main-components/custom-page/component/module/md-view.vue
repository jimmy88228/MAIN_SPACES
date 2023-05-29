<template>
    <div class="editor-image-ad-view">
        <template v-if="checkEmpty">
            <template v-for="(group, gindex) in module_data[groupKey]">
                <div class="flex-b-s flex-wrap" v-if="module_data[groupKey].length > 0 || dynamic_setting.currTab == 'tab' + gindex" :key="gindex">
                    <div v-for="(item, index) in group[groupItemKey]" :key="index" class="image-item" :class="[`row-${dynamic_setting.row}`,`type-${dynamic_setting.type}`]">
                        <div class="img-cover-box" :class="{'init':!!!item.cover}">
                            <img v-show="item.cover" class="cover" :src="item.cover" alt="">
                        </div>
                        <div class="content-box">
                            <template v-if="type == 'video'">
                                <div class="title" v-if="dynamic_setting.showTitle == 1">{{item.title||""}}</div>
                                <div class="summary C_B2" v-if="dynamic_setting.showMsg == 1">{{item.summary||""}}</div>
                            </template>
                            <template v-if="type == 'article'">
                                <div class="title" v-if="dynamic_setting.showTitle == 1">{{item.title||""}}</div>
                                <div class="summary C_B2" v-if="dynamic_setting.showMsg == 1">{{item.summary||""}}</div>
                            </template>
                            <template v-if="type == 'audio'">
                                <div class="title" v-if="dynamic_setting.showTitle == 1">{{item.title||""}}</div>
                                <div class="summary C_B2" v-if="dynamic_setting.showMsg == 1">{{item.duration_str||""}}</div>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </template>
        <div v-else class="empty">
            <div class="img-box flex-c-c">
                <img :src="typeImg" alt="" class="img-logo">
            </div>
            <div class="m-t-20">{{typeName}}模块</div>
        </div>
    </div>
</template>

<script> 
import confMixin from "./conf.js"
export default {
    name: "imageAdView", 
    mixins:[confMixin],
    props: {
        compInfo: {
            type: Object,
            default: () => {return {}},
        },
        inTab: {
            type: Boolean,
            default: false,
        },
        type:{
            type: String,
            default: "",
        }
    },
    data() {
        return {
            t2_val: 0,
            // 浮动轮播
            styleList: [],
            touchs: [],
            swiperTime: null, 
        };
    },
    computed: {
        groupKey(){
            return this.keyInfo[this.type] && this.keyInfo[this.type].groupKey || "";
        },
        groupItemKey(){
            return this.keyInfo[this.type] && this.keyInfo[this.type].groupItemKey || "";
        },
        typeName(){
            return this.keyInfo[this.type] && this.keyInfo[this.type].name || "";
        },
        typeImg(){
            return this.keyInfo[this.type] && this.keyInfo[this.type].img || "";
        },
        dynamic_setting(){
            return this.compInfo.dynamic_setting || {};
        },
        module_data(){
            let module_data = this.compInfo.module_data || {};
            if (!module_data[this.groupKey]) {
                this.$set(this.compInfo.module_data,this.groupKey, [])
            }
            return module_data || {};
        },
        checkEmpty(){
            let module_data = this.compInfo.module_data || {};
            let group = module_data[this.groupKey]||[];
            return group.length>0 && group[0] && group[0][this.groupItemKey] && group[0][this.groupItemKey].length>0 || false;
        },
    },
    methods: {
        // checkEmpty(module_data){
        //     let group = module_data[this.groupKey]||[];
        //     return group.length>0 && group[0] && group[0][this.groupItemKey] && group[0][this.groupItemKey].length>0 || false
        // },
    },
    watch: {}, 
};
</script>

<style lang="less" scoped>
.editor-image-ad-view {
    .play-icon-box {
        top: 50%;
        position: absolute;
        width: 100%;
        z-index: 10;
        text-align: center;

        .play-icon {
            font-size: 20px;
            color: #fff;
            padding: 8px;
            background-color: rgba(0, 0, 0, 0.4);
            border-radius: 100%;
        }
    }  
    .carousel-title {
        text-align: center;
        color: #fff;
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 5px 0;
        background-color: rgba(0, 0, 0, 0.25);
    }
    .empty {
        text-align: center;
        padding: 40px 20px;
        color: #515a6e;
    }
    // 浮层轮播
    .float_swiper {
        width: 100%;
        height: 240px;
        position: relative;
    }
    .float_swiper_item {
        width: 200px;
        height: 90%;
        background-color: #fff;
        border-radius: 5px;
        overflow: hidden;
        box-sizing: border-box;
        padding: 5px;
        position: absolute;
        z-index: 2;
        transition: opacity .3s ease-out, transform .6s, top .6s, left .6s;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0px 0px 5px #ccc;
    }
    .float_swiper_item .list-img {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .float_swiper_item .img-item{
        width:100%;
        // padding-top:100%;
        background-color:#efefef;
    }
    .image-item{
        width:100%;
        &.type-list{
            display: flex;
            margin-bottom: 13px;
            &:last-child{
                margin-bottom: 0;
            }
            .img-cover-box{
                width:110px;
                height: 83px;
            }
            .content-box{
                padding-top: 5px;
                padding-left: 12px;
            }
        }
    }
    .img-cover-box{
        position: relative;
        width: 100%;
        height: 200px;
        flex-shrink: 0;
        .cover{
            width: 100%;
            height: 100%;
            display: block;
            object-fit:cover;
        }
        &.init{
            background: #D8D8D8;
        }
    } 
    .type-row{
        &.row-1{
            width: 100%;
        }
        &.row-2{
            width: 48%;
            .img-cover-box{
                height: 120px;
            }
        }
        &.row-3{
            width: 31%;
            .img-cover-box{
                height: 120px;
            }
        }
    }
    .cover{
        width: 100%;
    }
    .content-box{
        padding: 13px 0 20px 0;
        padding-left: 3px;
        width: 100%;
        overflow: hidden;
    }
    .title,.summary{
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 11px;
    }
    .title{
        padding-bottom: 8px;
        font-weight: bold;
        font-size: 16px;
    }
    
    .img-box{
        width: 80px;
        height: 60px;
        border-radius: 6px;
        margin: 0 auto;
        background: rgba(239, 239, 239, 0.3);
    }
    .img-logo{
        width: 30px;
        height: 30px;
    }
}
</style>
