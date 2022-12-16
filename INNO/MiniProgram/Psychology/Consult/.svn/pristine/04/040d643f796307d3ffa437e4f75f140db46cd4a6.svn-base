<template>
    <div class="scroll-view-box flex flex-col">
        <div v-if="type=='counselor'" class="title flex-s-c">今日预约咨询</div>
        <ori-scroll-view class="scroll-view">
            <div class="list-box">
                <div v-for="(item,index) in listData" :key="index" class="list-item flex-s-e">
                    <div class="msg-box">
                        <div class="type-box flex-s-c">
                            <image class="img-type m-r-10" mode="aspectFit" src=""></image>
                            <div class="m-r-10">{{nameKey[item.type] || ""}}</div>
                            <div class="state" :class="{active:item.state == 2}">{{stateKey[item.state] || ""}}</div>
                        </div>
                        <div class="time-box m-b-15">
                            {{item.time||""}}
                        </div>  
                        <div class="source-box">
                            <span>来源</span>
                            <span>{{item.source||""}}</span>
                        </div>
                    </div>
                    <div v-if="!item.isHideRoom" class="btn flex-c-c" :class="{disabled:item.state!=2}" hover-class="none" @click="jump">进入房间</div>
                </div>
            </div>
        </ori-scroll-view>
    </div>
</template>

<script>
import oriScrollView from "@/components/ori-comps/scroll/ori-scroll-view.vue"
const pageOption = Page.BaseComp({
    components: {
        oriScrollView,
    },
    data() {
        return {
            nameKey: {
                video:"视频咨询",
                audio:"语音咨询",
            },
            stateKey:{
                0:"已关闭",
                1:"未开始",
                2:"进行中",
                3:"已结束",
            }
        }
    },
    props: {
        type:String,
        listData: {
            type: Array,
            default: ()=>[]
        },
    },
    methods: {
        jump(e) {
            this.jumpAction(`/pages/counseling/room/counselor?id=${e.id}`)
        }
    },
})
export default pageOption
</script>

<style lang="scss" scoped>
.scroll-view-box{
    // padding: 25rpx;
    height: 100%;
    box-sizing: border-box;
    .title{
        padding: 0 25rpx 25rpx 25rpx; 
        box-sizing: border-box;
        // height: 100rpx;
    }
    .scroll-view{
        // height: 100%;
        flex:1;
        .list-box{
            height: 100%;
            .list-item{
                background-color: #fff;
                border-radius: 12rpx;
                padding: 35rpx;
                box-sizing: border-box;
                margin-bottom: 22rpx;
                .msg-box{
                    flex:1;
                    font-size: 26rpx;
                }
                .type-box{
                    margin-bottom: 25rpx;
                    font-size: 20rpx;
                    .img-type{
                        width: 19rpx;
                        height: 19rpx;
                    }
                    .state{
                        font-size: 16rpx;
                    }
                }
                .source-box{
                    color: #7f7f7f;
                    font-size:18rpx;
                } 
                .state{
                    font-size:16rpx;
                    padding: 4rpx 6rpx;
                    color: #b2b2b2;
                    background-color:rgba(231,231,231,0.27);
                    border-radius: 6rpx;
                    border: 1px solid;
                    border-color: rgba(141,141,141,0.27);
                    &.active{
                        color: #21B014;
                        background-color:rgba(227, 255, 231, 0.5); 
                        border-color: rgba(53,172,71,0.5);
                    }
                } 
                .btn{
                    width: 160rpx;
                    height: 66rpx;
                    background:#21B014;
                    border-radius: 6rpx;
                    flex-shrink: 0;
                    margin-bottom: 6rpx;
                    color: #fff;
                    &.disabled{
                        background: #F1F1F1;
                        color: #b2b2b2;
                    }
                }
                
            }

        }
    }
}
</style>