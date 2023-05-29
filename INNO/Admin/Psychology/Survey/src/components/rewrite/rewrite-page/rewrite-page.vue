<template>
    <div class="rewrite-page" >
        <div class="rewrite-page-stay">
            <div class="all-sel-box flex-s-c" v-if="isShowAllSel">
                <Checkbox v-model="isCheckAll" @on-change="onSelAll">
                    <label class="m-l-5">全部全选</label>
                    <label class="font-20 C_red m-l-5" v-if="selectedNum>0">(已选{{selectedNum}})</label>
                </Checkbox>
            </div>
            <Page
            :total="total"
            :current="current"
            :page-size="pageSize"
            :page-size-opts="pageSizeOpts"
            @on-change="onChange"
            @on-page-size-change="onPageSizeChange"
            @on-prev="onPrev"
            @on-next="onNext"
            :placement="placement"
            :size="size"
            :simple="simple"
            :prev-text="prevText"
            :next-text="nextText"
            show-sizer
            show-elevator
            show-total
            :transfer="transfer"
            ></Page>
        </div>
    </div>
</template>
<script>
    export default {
        name: "rewrite-page",
        props: {
            "current": Number,
            "total": Number,
            "page-size": Number,
            "page-size-opts": Array,
            "placement": String,
            "size": {
                type: String,
                default: "default"
            },
            "simple": Boolean,
            "show-total": Boolean,
            "show-elevator": Boolean,
            "show-sizer": Boolean,
            "class-name": String,
            "styles": Object,
            "transfer": {
                type: Boolean,
                default: true
            },
            "prev-text": {
                type: String,
            },
            "next-text": {
                type: String,
            },
            "disabled": Boolean,
            "events-enabled": Boolean,
            "isShowAllSel": Boolean,
            "selectedNum":Number
        },
        data(){
            return {
                isCheckAll:false
            }
        },
        methods:{
            onChange(e){
                this.$emit("on-change", e);
            },
            onPageSizeChange(e){
                this.$emit("on-page-size-change", e)
            },
            onPrev(e){
                this.$emit("on-prev", e);
            },
            onNext(e){
                this.$emit("on-next", e);
            },
            onSelAll(e){
                // this.isCheckAll = e;
                this.$emit("on-sel-all", e);
            },
            setCheckAll(bool=false){
                this.isCheckAll = bool;
            }
        }
    }
</script>
<style scoped lang="less">
.rewrite-page{
    position: relative;
    padding: 10px 0px;
    text-align: center;
    background-color: #fff;
    border-top: 1px solid #F2F2F2;
}
.rewrite-page-stay{
    display: inline-block;
    background-color: #fff;
}
.all-sel-box{
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 100%;
    padding-left: 21px;
}
</style>