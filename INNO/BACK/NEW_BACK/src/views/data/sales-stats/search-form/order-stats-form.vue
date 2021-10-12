<template>
    <div class="search-form">
        <Form inline :label-width="80">
            <div class="flex f-just-between">
                <div>
                    <FormItem label="选择日期">
                        <div class="flex f-align-center">
                        <date-select ref="dateSelect" class="space-nowrap" dateType="report" defaultTime="month" @sT="handleStart" @eT="handleEnd" @extra="search" extra/>
                        &nbsp;&nbsp;<Button type="primary" @click="search" icon="ios-search">搜索</Button>&nbsp;&nbsp;
                        </div>
                    </FormItem>
                </div>
            </div>
        </Form>
    </div>
</template>
<script>
import util from '@/libs/util.js';
import DateSelect from '@/views/my-components/date-select/index.vue';
import StoreSelect from '@/views/my-components/list-component/index-edit';
export default {
    name: "searchForm",
    components: {
        DateSelect,
        StoreSelect
    },
    props:["formSearch"],
    data(){
        return {}
    },
    mounted(){
        this.initParams();
    },
    methods:{
        initParams(){
          let query = this.$route.query || {};
					this.brandId = query.brandId;
        },
        handleStart (date) {
            this.formSearch.start_time = date;
        },
        handleEnd (date) {
            this.formSearch.end_time = date;
        },
        handleExport(){
            this.$emit("on-handleExport", this.formSearch);
        },
        search(){
            this.$emit("on-search", this.formSearch);
        }
    }
}
</script>
<style  lang="less">
    .search-form{
        .basic-width{
            width: 180px;
        }
    }
</style>
