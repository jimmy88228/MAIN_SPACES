<template>
    <hold-layout :isFull="true">
        <searchForm @search="loadData" :searchForm="searchForm"></searchForm>
        <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading">
            <template slot="join_user" slot-scope="{ row }">
                {{row.get_user_data && row.get_user_data.name}}
            </template>
            <template slot="organize" slot-scope="{ row }">
                {{row.get_user_data && row.get_user_data.structure_name}}
            </template>
            <template slot="study_progress" slot-scope="{ row }">
                {{row.finish_content_count}}/{{row.minLearnTime}}
            </template>
            <template slot="test_progress" slot-scope="{ row }">
                {{row.finish_exam_count}}/{{row.examCount}}
            </template>
            <template slot="avg_exam" slot-scope="{ row }">
                {{row.avg_exam || '--'}}
            </template>
            <template slot="time" slot-scope="{ row }">
                <div class="time-p flex-s-c">
                    <p class="t-item">{{row.start_time}}</p>~<p class="t-item">{{row.end_time}}</p>
                </div>
            </template>
        </Table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
import searchForm from "./search-form.vue";
export default {
    name: "gaugeIndex",
    mixins: [ListMixin, mixins],
    components: { searchForm },
    data() {
        return {
            searchForm: {
                searchq: "",
                state: -1
            },
        };
    },
    computed: {},
    methods: {
        onLoadData(page, extraData) {
            let taskId = this.pageQuery.taskId || 0;
            let courseId = this.pageQuery.courseId || 0;
            if(!Number(taskId) || !Number(courseId)) return Promise.reject();
            return this.$MainApi.generalList({
              data: {
                  ...this.searchForm,
                  id: taskId,
                  course_id: courseId,
                  ...extraData,
              },
              other: {
                  isErrorMsg: true
              }
          })
          .then((res) => {
              if (res.code) {
                  let data = res.data || {};
                  let items = data.items || [];
                  items.map((item)=>{
                      if(Number(item.avg_exam)) item.avg_exam = Number(item.avg_exam).toFixed(2);
                  })
                  this.data = {
                      total: data.total,
                      list: items
                  };
              }
          });
        },
        removeItem(id, index){
          this.batchRemoveActReq([id]).then(()=>{
            this.delItem(index);
          })
        },
        batchRemoveItem(){
          this.batchRemoveActReq(this.ids).then(()=>{
            this.delItems(this.ids);
          })
        },
        batchRemoveActReq(ids) {
            if (ids.length == 0 || !ids[0]) {
                this.$Message.warning("请勾选删除项！");
                return Promise.reject(); 
            }
            this.tableLoading = true;
            return this.$MainApi.appraisalActRemove({
                data: {
                    ids: ids,
                },
            })
            .then((res) => {
                if (res.code) {
                    this.$Message.success(res.message || "删除成功");
                    return Promise.resolve();
                } else {
                    this.$Message.warning(res.message || "删除失败");
                    return Promise.reject();
                }
            })
            .finally(() => {
                this.tableLoading = false;
            });
        },
    },
    mounted() {
        this.loadData();
    },
};
</script>

<style>
</style>