<template>
    <div>
        <Table ref="myTable" :columns="columns" :data="list" border :loading="tableLoading">
            <template slot="handle" slot-scope="{ row, index }">
                <div class="operate-area">
                    <!-- student_file_psychology_report -->
                    <a class="operate" v-hasAction="[row.handle.report]" @click="checkReport(row)">查看报告</a>
                    <!-- student_file_psychology_answer -->
                    <a class="operate" v-hasAction="[row.handle.answer]" @click="checkAnswer(row)">查看答案</a>
                </div>
            </template>
        </Table>
        <rewrite-page :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <answer ref="answerRef"></answer>
    </div>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
import answer from "@/models/survey/activity/assess/answer/index";
export default {
    name: "actRecordTable",
    mixins: [ListMixin, mixins],
    components: { answer },
    props: {
        userId: String | Number,
        type: String
    },
    data() {
        return {
            searchForm: {
                searchq: "",
                school_id: 0,
                state: -1, // -1 全部 0:未审核  1:审核通过  2:审核不通过
            },
        };
    },
    methods: {
        onLoadData(page, extraData) {
            return this.$MainApi
                .psychologyFilesActivity({
                    data: {
                        user_id: this.userId,
                        ...extraData,
                    },
                    other: {
                        isErrorMsg: true
                    }
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        this.data = {
                            total: data.total,
                            list: data.items,
                        };
                    }
                });
        },
        checkReport(row) {
            this.$router.push({
                name: this.type == 'earlyWarn' ? "earlyWarnPsychicFilesReport" : "psychicFilesReport",
                query: {
                    modelId: Number(row.model_id),
                    recordId: row.record_id + "",
                    type: this.type || "psychic",
                    userId: this.userId + "",
                },
            });
        },
        checkAnswer(row) {
            this.$refs["answerRef"].showModule({
                recordId: row.record_id + "",
                type: this.type || "psychic",
                modelId: row.model_id,
            });
        },
    },
    mounted() {},
    watch: {
        userId: {
            handler(nV) {
                if (nV) this.loadData();
            },
            immediate: true,
        },
    },
};
</script>

<style>
</style>