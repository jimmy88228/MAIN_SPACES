<template>
    <div class="search-box flex-s-c">
        <!-- <div class="search-list flex-s-c">
            <div class="search-item flex-c-c" :class="{active:item.id == curId}" v-for="item in stateList" :key="item.id" @click="stateChange(item.id)">
                <div>{{item.text}}</div>
            </div>
        </div> -->
        <div class="source-box flex-s-c m-r-15">
            <custom-select @change="e=>change(e,'curStateSelect')" class="custom-select" :curSelect="curStateSelect" :list="stateList" :scrollViewStyle="'height:' + (stateList.length>3?240:stateList.length*80) + 'rpx;'">
                <div slot="tip" class="m-l-20 font-20">状态</div>
            </custom-select>
        </div> 
        <div class="source-box flex-s-c">
            <custom-select @change="e=>change(e,'curSourceSelect')" class="custom-select" :cur-select="curSourceSelect" :list="sourceList" :scrollViewStyle="'height:' + (sourceList.length>3?240:sourceList.length*80) + 'rpx;'">
                <div slot="tip" class="m-l-20 font-20">来源</div>
            </custom-select>
        </div>
    </div>  
</template>

<script>
import customSelect from "@/components/custom-cps/custom-select";

const pageOption = Page.BaseComp({
    data() {
        return {
            stateList:[{
                id:0,
                title:"全部",
            },{
                id:1,
                title:"已结束",
            },{
                id:2,
                title:"待开始",
            }],
            sourceList:[{
                id:0,
                title:"全部",
            },{
                id:1,
                title:"测试1",
            },{
                id:2,
                title:"测试2",
            },{
                id:3,
                title:"测试3",
            }],
            curSourceSelect:{},
            curStateSelect:{},
            
        }
    },
    components: {
        customSelect
    },
    methods: {
        // toggle() {
        //     this.sourceBool = !this.sourceBool;
        // },
        // sourceSelect(e){
        //     console.log(e);
        //     this.curSelect = e;
        //     this.dismiss();
        // },
        // stateChange(id){
        //     this.curId = id;
        // },
        // dismiss(){
        //     this.sourceBool = false;
        // }
        change(e,key){
            this[key] = e;
        }
    },
    mounted() {
        console.log('curSourceSelectcurSourceSelect',this.curSourceSelect)
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
    .select-box-bg{
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 98;
        background-color: transparent;
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

    .custom-select{
        width: 236rpx;
        height: 60rpx;
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