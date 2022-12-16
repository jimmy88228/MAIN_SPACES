<template>
    <div class="custom-select" :style="customStyle">   
        <div class="select-box" :style="''">
            <div class="select-view flex-s-c" @click.stop="toggle">
                <slot name="tip"></slot>
                <div class="select-text text-overflow">{{curSelect.title}}</div>
                <div class="arrow"></div>
            </div>
            <template v-if="bool">
                <div class="select-box-bg" @click.stop="dismiss"></div>
                <ori-scroll-view :style="scrollViewStyle" class="list-box" :class="bool?'active':''">
                    <div class="list-item flex-s-c" @click.stop="selectTap(item)" v-for="item in list" :key="item.id">
                        <div class="source-text">{{item.title}}</div>
                    </div>
                </ori-scroll-view>
            </template>
        </div>
    </div>  
</template>

<script>
import oriScrollView from "@/components/ori-comps/scroll/ori-scroll-view.vue";
// const pageOption = Page.BaseComp({
export default ({
    props: {
        customStyle:String,
        scrollViewStyle:String,
        curSelect:{
            type:Object,
            default:()=>({})
        },
        list:{
            type:Array,
            default:()=>[]
        }
    },
    components: {
        oriScrollView,
    },
    computed:{ 
    },
    data() {
        return { 
            bool:false,
            inited:false,
        }
    },
    methods: {  
        selectTap(e){
            console.log(e);
            // this.$set(this.curSelect,'id',e.id);
            // this.$set(this.curSelect,'title',e.title);
            // this.$set(this.jimmy,'a',e.title);
            this.$emit('change',e);
            this.dismiss();
        }, 
        toggle() {
            this.bool = !this.bool;
        },
        dismiss(){
            this.bool = false;
        },
        show(){
            this.bool = true;
        },
    },
    watch: {
        list:{
            handler(nV){
                if(nV&&nV.length>0&&nV[0]&&!this.inited){
                    this.inited = true;
                    this.$emit('change',nV[0]);
                }
            },immediate:true,deep:true
        }
    },
})
// export default pageOption
</script>

<style lang="scss" scoped>
.custom-select{
    width: 100%;
    height: 100%;
    .select-box{
        // width: 236rpx;
        // height: 60rpx;
        width: 100%;
        height: 100%;
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