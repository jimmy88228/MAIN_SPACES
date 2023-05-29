<template>
    <hold-layout :isFull="true">
        <searchForm @search="loadData" :searchForm="searchForm"></searchForm>
        <rewrite-table ref="myTable" class="full-table" :columns="columns" :data="list" :loading="tableLoading">
            <template slot="join_user" slot-scope="{ row }">
                {{row.name}}{{row.relate_type_desc ? '的' + row.relate_type_desc : ''}}
            </template>
            <template slot="organize" slot-scope="{ row }">
                {{row.grade}}{{_structureLimit(['edu_customer', 'edu_area', 'edu_street']) ? '' : row.class}}({{row.school_year}})
            </template>
            <template slot="test_progress" slot-scope="{ row }">
                {{row.finish_content_count}}/{{row.examCount}}
            </template>
        </rewrite-table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
import searchForm from "./search-form.vue";
import DateUtil from "@/helper/utils/date-util.js";
export default {
    name: "gaugeIndex",
    mixins: [ListMixin, mixins],
    components: { searchForm },
    data() {
        return {
            searchForm: {
                searchq: "",
                school_id: 0,
                grade: "",
                state: -1
            },
        };
    },
    computed: {},
    methods: {
        init(){
            this.searchForm.school_id = this.pageQuery.schoolId || 0;
        },
        onLoadData(page, extraData) {
            let taskId = this.pageQuery.taskId || 0;
            let courseId = this.pageQuery.courseId || 0;
            if(!Number(taskId) || !Number(courseId)) return Promise.reject();
            return this.$MainApi.generalList({
              data: {
                  ...this.searchForm,
                  id: taskId,
                  course_id: courseId,
                  grade: this.searchForm.grade_name,
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
                      if(item.create_time){
                        item.join_time = DateUtil.format(new Date(item.create_time), 'yyyy-MM-dd')
                      }
                  })
                  this.data = {
                      total: data.total,
                      list: items
                  };
              }
          });
        },
        // removeItem(id, index){
        //   this.batchRemoveActReq([id]).then(()=>{
        //     this.delItem(index);
        //   })
        // },
        // batchRemoveItem(){
        //   this.batchRemoveActReq(this.ids).then(()=>{
        //     this.delItems(this.ids);
        //   })
        // },
        // batchRemoveActReq(ids) {
        //     if (ids.length == 0 || !ids[0]) {
        //         this.$Message.warning("请勾选删除项！");
        //         return Promise.reject(); 
        //     }
        //     this.tableLoading = true;
        //     return this.$MainApi.appraisalActRemove({
        //         data: {
        //             ids: ids,
        //         },
        //     })
        //     .then((res) => {
        //         if (res.code) {
        //             this.$Message.success(res.message || "删除成功");
        //             return Promise.resolve();
        //         } else {
        //             this.$Message.warning(res.message || "删除失败");
        //             return Promise.reject();
        //         }
        //     })
        //     .finally(() => {
        //         this.tableLoading = false;
        //     });
        // },
    },
    mounted() {
        this.init();
        this.loadData();
    },
};
</script>

<style lang="less" scoped>
.state-tip{
    display: inline-block;
    padding: 2px 20px;
    background: #EFFCE7;
    border-radius: 3px;
    margin-top: 5px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #14A93C;
    line-height: 17px;
}
</style>