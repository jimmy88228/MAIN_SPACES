<template>
    <rewrite-area>
        <Form :label-width="80" class="no-tip flex-b-c" inline>
            <div>
                <FormItem label="时间筛选">
                  <date-time @change="changeTime" type="datetimerange" :value="[searchForm.startTime, searchForm.endTime]"></date-time>
                </FormItem>
            </div>
            <div class="flex">
                <Button @click="addRecord()" v-hasAction="'forewarning_survey_add_record'">新增记录</Button>
            </div>
        </Form>
    </rewrite-area>
</template>

<script>
import linkageSelect from "@/models/components/linkage-select";
export default {
    name: "studentIndexSearchForm",
    components: { linkageSelect },
    data() {
        return {};
    },
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
    },
    methods: {
        changeTime(dateTime){
            this.$set(this.searchForm, "startTime", dateTime[0]);
            this.$set(this.searchForm, "endTime", dateTime[1]);
            this.search();
        },
        search() {
            this.$emit("search");
        },
        addRecord() {
            this.$emit("addRecord");
        },
    },
};
</script>

<style lang="less" scoped></style>