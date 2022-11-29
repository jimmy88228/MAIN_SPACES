<template>
    <rewrite-area>
        <Form class="no-tip flex-b-c" inline>
            <div>
                <linkageSelect :searchForm="searchForm" @on-change="search" :hideSelect="['area', 'school']"></linkageSelect>
                <FormItem label="关联状态" :label-width="75">
                    <Select v-model="searchForm.state" @on-change="search">
                        <Option :value="item.key" v-for="item in stateList" :key="item.key">{{item.name}}</Option>
                    </Select>
                </FormItem>
            </div>
            <FormItem :label-width="0" class="text-r">
                <label v-if="selectedNum>0" class="C_7f m-r-5">(已选{{selectedNum}})</label>
                <Button @click="batchRelate(true)" :loading="relatIng" v-hasAction="'assessment_tasks_batch_class_add'">批量关联</Button>
                <Button @click="batchRelate(false)" :loading="relatIng"  v-hasAction="[activityTimeState < 2,'assessment_tasks_batch_class_cancel']">批量取关</Button>
                <Button @click="batchCode" :loading="batchCodeIng" v-hasAction="'assessment_tasks_batch_class_code'">批量生成二维码</Button>
                <!-- <Button @click="batchLink" v-hasAction="'assessment_tasks_batch_class_link'">批量下载链接</Button> -->
            </FormItem>
        </Form>
    </rewrite-area>
</template>

<script>
import linkageSelect from "@/models/components/linkage-select";
export default {
    name: "relateClassSearchForm",
    components: { linkageSelect },
    data() {
        return {
            area_id: 0,
            stateList: [
                {
                    key: -1,
                    name: "全部"
                },
                {
                    key: 0,
                    name: "未关联"
                },
                {
                    key: 1,
                    name: "已关联"
                }
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
        batchCodeIng: Boolean,
        relatIng: Boolean
    },
    methods: {
        search() {
            this.$emit("search");
        },
        batchRelate(isRelate) {
            this.$emit("batchRelate", isRelate);
        },
        batchCode() {
            this.$emit("batchCode");
        },
        batchLink() {
            this.$emit("batchLink");
        },
    },
};
</script>

<style lang="less" scoped></style>