<template>
    <rewrite-area class="flex-b-c">
        <Form inline class="no-tip flex" :label-width="80">
            <FormItem :label-width="0">
                <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入学校名称"></rewrite-search>
            </FormItem>
            <FormItem label="关联状态">
                <Select v-model="searchForm.state" @on-change="search">
                    <Option :value="item.key" v-for="item in stateKey" :key="item.key">{{item.name}}</Option>
                </Select>
            </FormItem>
        </Form>
        <div class="flex-s-c f-shrink-0">
            <!-- <Button type="default" @click="batchImport()" v-hasAction="'appraisal_activity_batch_import_school'">批量导入</Button>&nbsp; -->
            <label v-if="selectedNum>0" class="C_7f m-r-5">(已选{{selectedNum}})</label>
            <Button type="default" @click="setBatchRelate(1)" :loading="relatIng"
            v-hasAction="'appraisal_activity_batch_add_school'">批量关联</Button>&nbsp;
            <Button type="default" @click="setBatchRelate(0)" :loading="relatIng" v-hasAction="[activityTimeState < 2,'appraisal_activity_batch_cancel_school']">批量取关</Button>
        </div>
    </rewrite-area>
</template>

<script>
export default {
    name: "actIndexSearchForm",
    data() {
        return {
            stateKey: [
                {
                    key: -1,
                    name: "全部",
                },
                {
                    key: 0,
                    name: "未关联",
                },
                {
                    key: 1,
                    name: "已关联",
                },
            ],
        };
    },
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
        activityTimeState: {
            type: String | Number,
            default: 0
        },
        selectedNum:Number,
        relatIng: Boolean
    },
    methods: {
        search() {
            this.$emit("search");
        },
        setBatchRelate(setRelate) {
            this.$emit("setBatchRelate", setRelate);
        },
        batchImport(){
            this.$emit("batchImport");
        }
    },
};
</script>

<style>
</style>