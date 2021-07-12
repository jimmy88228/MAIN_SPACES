<template>
    <div class="search-form">
        <Form>
            <div class="flex f-just-between">
                <div>
                    <FormItem label="日期">
											<div class="flex">
                        <date-select ref="dateSelect" defaultTime="yesterday" dateType="report" :limitTime="['today']" class="space-nowrap" @sT="handleStart" @eT="handleEnd" @extra="search" extra/>
												&nbsp;&nbsp;<Button type="primary" @click="search" icon="ios-search">查询</Button>
											</div>
										</FormItem>
                </div>
                <div><Button type="primary" @click="handleExport">导出</Button></div>
            </div>
        </Form>
    </div>
</template>
<script>
import DateSelect from '@/views/my-components/date-select/index.vue';
export default {
    name: "searchForm",
    components: {
        DateSelect
    },
    props:["formSearch"],
    data(){
        return {
            
        }
    },
    methods:{
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