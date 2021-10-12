<template>
    <div class="search-form">
        <Form>
            <div class="flex f-just-between">
                <div>
                    <FormItem label="日期">
                        <date-select ref="dateSelect" defaultTime="yesterday" dateType="report" :limitTime="['today']" class="space-nowrap" @sT="handleStart" @eT="handleEnd" @extra="extra" extra/>
                    </FormItem>
                    <FormItem label="类型">
                        <RadioGroup v-model="formSearch.choose_type" type="button" btn-type="primary" @on-change="search">
                            <Radio v-for="(item, index) in filterType" :key="index" :label="item.id" border>{{ item.name }}</Radio>
                        </RadioGroup>
                        &nbsp;
                        <Button type="primary" @click="search" icon="ios-search">搜索</Button>
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
            filterType:[
				{id: "H", name: "按时"}, {id: "D", name: "按日"}, {id: "M", name: "按月"}
			]
        }
    },
    methods:{
        handleStart (date) {
            this.formSearch.start_time = date;
        },
        handleEnd (date) {
            this.formSearch.end_time = date;
        },
        extra(){
            this.search();
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