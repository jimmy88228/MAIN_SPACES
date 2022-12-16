<template>
   <div class="select-module-area">
       <div class="flex-b-s">
            <div class="flex-s-s">
                <slot name="showAction"></slot>
                <a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
            </div>
            <div class="p-right-20">
                <Button type="primary" @click="importStore"><Icon type="md-cloud-upload" />&nbsp;导入店铺</Button>
            </div>
       </div>
       <slot></slot>
       <div class="">
           <transition name="fade">
                <div v-show="isShowExtra">
                    <slot name="showArea"></slot>
                    <div style="margin-bottom: 10px;" class="flex f-just-center f-align-center">
						<Button type="primary" @click="searchPage">搜索</Button>&nbsp;&nbsp;
						<Button type="primary" @click="clearCondition">重置</Button>&nbsp;&nbsp;
                        <a @click="isShowExtra = false" >收起</a>
					</div>
                </div>
            </transition>
       </div>
    </div> 
</template>
<script>
    export default{
        props: {
        },
        data(){
            return {
                isShowExtra: false
            }
        },
        methods:{
            searchPage(){
                this.$emit("on-search");
            },
            clearCondition(){
                this.$emit("on-clear");
            },
            showExtra(){
                this.isShowExtra = !this.isShowExtra;

            },
            importStore(){
                this.$emit("import-stores");
            },
        }
    }
</script>
<style lang="less" >
    .select-module-area{
        .search_btn{
            line-height: 30px;
        }
    }
</style>