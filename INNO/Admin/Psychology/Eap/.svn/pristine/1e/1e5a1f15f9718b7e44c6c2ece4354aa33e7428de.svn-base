<template>
    <rewrite-area class="flex-b-c">
        <Form inline class="no-tip flex" :label-width="50">
            <FormItem :label-width="0">
                <rewrite-search v-model="searchForm.searchq" @search="search" placeholder="请输入关键词"></rewrite-search>
            </FormItem>
            <FormItem label="状态">
                <Select v-model="searchForm.state" @on-change="search">
                    <Option :value="item.key" v-for="(item) in stateList" :key="item.key">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="是否限制时间" :label-width="110">
                <Select v-model="searchForm.limitTime" @on-change="(data)=>changeData(data, 'limitTime')">
                    <Option :value="item.key" v-for="(item) in limitTimeList" :key="item.key">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="时间" v-if="searchForm.limitTime == 1">
                <date-time style="width:320px;" placeholder="选择时间" type="datetimerange" v-model="searchForm.time" @change="search"></date-time>
            </FormItem>
        </Form>
        <div class="flex">
            <Button type="primary" v-hasAction="'appraisal_activity_add'" @click="create()">创建活动</Button>&nbsp;
            <Button @click="batchCode" v-hasAction="'appraisal_activity_batch_activity_code'">批量生成二维码</Button>
            <Button @click="batchLink" v-hasAction="'assessment_tasks_batch_class_link'">批量下载链接</Button>
            <Button type="default" v-hasAction="'appraisal_activity_remove'" @click="removeIds()">删除选中活动</Button>
        </div>
    </rewrite-area>
</template>

<script>
export default {
    name: "actIndexSearchForm",
    data() {
        return {
            stateList: [
                {
                    key: -1,
                    name: "全部",
                },
                {
                    key: 0,
                    name: "关闭",
                },
                {
                    key: 1,
                    name: "未开始",
                },
                {
                    key: 2,
                    name: "进行中",
                },
                {
                    key: 3,
                    name: "已结束",
                },
            ],
            limitTimeList: [
                {
                    key: -1,
                    name: "全部",
                },
                {
                    key: 0,
                    name: "不限制",
                },
                {
                    key: 1,
                    name: "限制",
                },
            ]
        };
    },
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
    },
    methods: {
        search() {
            this.$emit("search");
        },
        create() {
            this.$emit("create");
        },
        removeIds() {
            this.$emit("removeIds");
        }, 
        batchCode() {
            this.$emit("batchCode");
        },
        batchLink() {
            this.$emit("batchLink");
        },
        changeData(val, key){
            if(key == 'limitTime'){
                this.searchForm.time = [];
            }
            this.search();
        }
    },
};
</script>

<style>
</style>