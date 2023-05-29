<template>
    <div class="search-box flex-c-c" @click="dismiss">
        <div class="search-list flex-s-c">
            <div class="search-item flex-c-c" :class="{active:item.id == curId}" v-for="item in searchList" :key="item.id" @click="stateChange(item.id)">
                <div>{{item.text}}</div>
            </div>
        </div>
        <div class="source-box f-shrink-0 flex-1 flex-e-c">
            <div class="m-r-15 font-20">来源</div>
            <div class="select-box" :style="''">
                <div class="select-view flex-s-c" @click.stop="toggle">
                    <div class="select-text text-overflow">{{curSource.text}}</div>
                    <div class="arrow"></div>
                </div>
                <template v-if="sourceBool">
                    <ori-scroll-view class="list-box" :style="'height:' + (sourceList.length>3?240:sourceList.length*80) + 'rpx;'" :class="sourceBool?'active':''">
                        <div class="list-item flex-s-c" @click.stop="sourceSelect(item)" v-for="item in sourceList" :key="item.id">
                            <div class="source-text">{{item.text}}</div>
                        </div>
                    </ori-scroll-view>
                </template>
            </div>
        </div>
    </div>  
</template>

<script>
import oriScrollView from "@/components/ori-comps/scroll/ori-scroll-view.vue"
const pageOption = Page.BaseComp({
    data() {
        return {
            searchList:[{
                id:0,
                text:"全部",
            },{
                id:1,
                text:"已结束",
            },{
                id:2,
                text:"待开始",
            }],
            sourceList:[{
                id:0,
                text:"全部",
            },{
                id:1,
                text:"测试1",
            },{
                id:2,
                text:"测试2",
            },{
                id:3,
                text:"测试3",
            }],
            curId:0,
            curSource:{
                id:0,
                text    :"全部"
            },
            sourceBool:false
            
        }
    },
    components: {
        oriScrollView,
    },
    methods: {
        toggle() {
            this.sourceBool = !this.sourceBool;
        },
        sourceSelect(e){
            console.log(e);
            this.curSource = e;
            this.dismiss();
        },
        stateChange(id){
            this.curId = id;
        },
        dismiss(){
            this.sourceBool = false;
        }
    },
})
export default pageOption
</script>

<style lang="scss" scoped>
.search-box{
    .search-list{
        width: 396rpx; 
        .search-item{
            width: 102rpx;
            height: 60rpx; 
            border-radius: 33rpx;
            margin-right: 8rpx;
            background: #FFFFFF;
            color: #7F7F7F;
            transition: all 250ms linear;
            font-size: 20rpx;
            &.active{
                background: #21B014;
                color: #fff;
            }
            &:last-child{
                margin-right: 0;
            }
        }
    }
    .source-box{
        .select-box{
            width: 236rpx;
            height: 60rpx;
            position: relative;
            .select-view{
                width: 100%;
                height: 100%;
                overflow: hidden;
                border-radius: 33rpx;
                background: #fff;
                position: relative;
                .select-text{
                    font-size: 20rpx;
                    padding-left: 18rpx;
                    color: #7F7F7F;
                }
                .arrow{
                    position: absolute;
                    right: 20rpx;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 0;
                    height: 0;
                    margin-top: 8rpx;
                    border: 10rpx solid transparent;
                    border-top-color: #525252;
                }
            }
        }
    }

    .list-box{
        width: 100%;
        // height: 300rpx;
        font-size: 20rpx;
        opacity: 0;
        position: absolute;
        top: calc(100% + 20rpx);
        left: 0;
        background-color: #fff;
        z-index: 99;
        padding-left: 20rpx;
        box-sizing: border-box;
        box-shadow: 0 0 10rpx 1px rgba($color: #525252, $alpha: 0.2);
        &.active{
            animation: toggleAnim 350ms forwards;
        }
        .list-item{
            width: 100%;
            height: 80rpx;
        }
    }

}
@keyframes toggleAnim {
    0%{
        opacity: 0; 
    }
    100%{
        opacity: 1; 
    }
}
</style>

<!-- <div class="source-box flex-1 flex-s-c">
    <div>来源</div>
    <div class="select-box" :style="''">
        <div class="select-view">
            <div>{{curSource.text}}</div>
            <div class="arrow"></div>
        </div>
                    <div class="list-box" :class="sourceBool?'active':''">
                        <div class="list-item" @click.stop="sourceSelect" v-for="item in sourceList" :key="item.id">
                            <div class="source-text">{{item.text}}</div>
                        </div>
                    </div>
    </div>
</div> -->