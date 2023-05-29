<template>
  <div class="rewrite-screen" :class="{'opacirt-bg': isOpacityBg }">
        <Form :label-width="labelWidth" class="no-tip" inline>
            <rewrite-area>
                <div class="flex-b-c">
                    <div class="flex-s-c">
                        <slot name="base-l"></slot>
                        <div class="m-r-5" v-for="(item, index) in base" :key="index">
                            <FormItem v-if="!item.noFormItem" :label="item.label" :label-width="item.labelWidth" >
                                <cell :cellData="item" :searchForm="searchForm" @search="search"></cell>
                            </FormItem>
                            <cell v-else :cellData="item" :searchForm="searchForm" @search="search"></cell>
                        </div>
                        <slot name="base"></slot>
                    </div>
                    <div class="flex-e-c">
                        <slot name="extra-l"></slot>
                        <div class="m-l-5" v-for="(item, index) in extra" :key="index">
                            <FormItem v-if="!item.noFormItem" :label="item.label" :label-width="item.labelWidth" >
                                <cell :cellData="item" :searchForm="searchForm" @search="search"></cell>
                            </FormItem>
                            <cell v-else :cellData="item" :searchForm="searchForm" @search="search"></cell>
                        </div>
                        <slot name="extra"></slot>
                    </div>
                </div>
                <div class="more-screen-area">
                    <transition name="fade" appear>
                        <div class="more-screen" v-show="isMore">
                            <div class="more-screen-cont" customStyle="border-top-color: transparent;border-top-left-radius: 0px;border-top-right-radius: 0px;">
                                <div v-for="(item, index) in more" :key="index">
                                    <FormItem v-if="!item.noFormItem" :label="item.label" :label-width="item.labelWidth" >
                                        <cell :cellData="item" :searchForm="searchForm" @search="search"></cell>
                                    </FormItem>
                                    <cell v-else :cellData="item" :searchForm="searchForm" @search="search"></cell>
                                </div>
                                <slot name="more"></slot>
                            </div>
                        </div>
                    </transition>
                </div>
                <div class="screen-operate flex-c-c" v-if="more.length ||'more' in $slots">
                    <!-- <a class="C_B2 pointer p-l-5 p-r-5" @click="resetSearch">重置</a>  -->
                    <a class="more-pointer flex-c-c" @click="switchMore">
                    {{isMore ? '收起' : '高级搜索'}}
                    <Icon type="ios-arrow-down" class="more-icon" :class="{ 'is-more': isMore}"/>
                    </a>
                </div>
            </rewrite-area>
        </Form>
      
  </div>
</template>

<script>
/**
 * type: search, select, button, 
*/
import cell from "./components/cell-template.vue";

export default {
  components: { cell },
    props: {
        labelWidth: {
            type: Number,
            default: 50
        },
        searchForm: {
            type: Object,
            default(){
                return {}
            }
        },
        base: {
            type: Array,
            default(){
                return [];
            }
        },
        extra: {
            type: Array,
            default(){
                return [];
            }
        },
        more: {
            type: Array,
            default(){
                return [];
            }
        },
        isOpacityBg: {
            type: Boolean,
            default: false
        }
    },
    name: "rewrite-screen",
    data(){
        return {
            isMore: false,
            defaultSearchForm: null
        }
    },
    methods: {
        search(e){
            this.$emit("search", e);
        },
        switchMore(){
            this.isMore = !this.isMore;
            // if(this.isMore && !this.defaultSearchForm){
            //     this.defaultSearchForm = JSON.parse(JSON.stringify(this.searchForm));
            // }
        },
        resetSearch(){
            let defaults = this.defaultSearchForm || {};
            let searchForm = {
                ...this.searchForm
            }
            for(let i in searchForm){
                if(typeof(defaults[i]) == "undefined"){
                    delete this.searchForm[i]
                } else {
                    this.searchForm[i] = defaults[i]
                }
            }
            this.$nextTick(()=>{
                this.search();
            })
        }
    },
    mounted(){}
}
</script>
<style lang="less" scoped>
.rewrite-screen{
    margin-bottom: 10px;
}
.screen-operate{
    width:100%;
    text-align: center;
    padding: 5px 0px 5px 0px;
    margin-bottom: -5px;
}
.more-pointer{
    line-height:20px;
}
.more-icon{
    display: inline-block;
    // transition: all .5s;
}
.more-icon.is-more{
    transform: rotate(180deg);
}
.more-screen-area{
    z-index:3;
    position:relative;
    width:100%;
    margin-top:-1px;
}
.more-screen{
    // position:absolute;
    // top:0px;
    // left:0px;
    width:100%;
    // max-height: 0px;
    // overflow: hidden;
    transition: all .8s ease;
    // opacity: 0;
    // display: none;
}
.more-screen-cont{
    padding: 10px 0px;
}
.show-more{
    // display: block;
    // opacity: 1;
    // max-height: 200px;
}
// 动画
.fade-enter{
    opacity: 0;
    display: block;
}
.fade-enter-to{
    opacity: 1;
}
.fade-leave{
    opacity: 1;
}
.fade-leave-to{
    opacity: 0;
    display: none;
}
</style>