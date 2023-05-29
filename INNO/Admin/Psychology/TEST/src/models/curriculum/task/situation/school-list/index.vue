<template>
    <hold-layout>
        <rewrite-screen :base="screenData.base" :searchForm="searchForm" @search="loadData"></rewrite-screen>
        <div class="school-situation">
            <div class="situation-item" v-for="(item, index) in generalTotalList" :key="item.id">
                <div class="item-cont">
                    <p class="school-name">{{item.structure_name}}</p>
                    <div class="item-tip m-b-5">学习完成率</div>
                    <div class="">
                        <span class="percent-tip">{{getPercent(item.student_join, item.student_total)}}</span>
                        <span class="count-tip">共{{item.student_total}}人</span>
                    </div>
                </div>
                <div class="arrow-area pointer" @click="getSituation(item)">
                    <span>查看</span>
                    <Icon type="ios-arrow-forward" />
                </div>
            </div>
        </div>
        <Spin v-if="searchIng" fix></Spin>
        <!-- <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page> -->
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
export default {
    name: "gaugeIndex",
    mixins: [ListMixin, mixins],
    components: { },
    data() {
        return {
            searchIng: false,
            searchForm: {
                searchq: ""
            },
            generalTotalList:[]
        };
    },
    computed: {},
    methods: {
        onLoadData(page, extraData) {
            let taskId = this.pageQuery.taskId || 0;
            if(!Number(taskId)) return Promise.reject();
            this.searchIng = true;
            return this.$MainApi.studyTaskGeneralTotal({
              data: {
                  id: taskId,
                  ...this.searchForm
              },
              other: {
                  isErrorMsg: true
              }
          })
          .then((res) => {
              if (res.code) {
                  let data = res.data || {};
                  this.generalTotalList = data;
              }
          }).finally(()=>{
            this.searchIng = false;
          })
        },
        getPercent(studentJoin, studentTotal){
            let result = 0;
            console.log("studentJoin", studentJoin)
            console.log("studentTotal", studentTotal)
            if(parseFloat(studentJoin) > 0 && parseFloat(studentTotal) > 0){
                 result = ((studentJoin / studentTotal) * 100).toFixed(2);
            }
            return result + "%"
        },
        getSituation(item){
            this.$router.push({
                name: "curriculumTaskSituation",
                query: {
                    taskId: this.pageQuery.taskId || 0,
                    courseId: this.pageQuery.courseId,
                    schoolId: item.id
                },
            });
        }
    },
    mounted() {
        this.loadData();
    },
};
</script>

<style lang="less" scoped>
.school-situation{
    padding: 20px 20px 20px 5px;
}
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
.situation-item{
    width: 300px;
    min-width: 260px;
    height: 200px;
    padding: 23px 14px 14px 23px;
    background: #FFFFFF;
    box-shadow: 0px 2px 27px 0px rgba(0,0,0,0.05);
    border-radius: 5px;
    font-family: PingFangSC-Semibold, PingFang SC;
    display: inline-flex;
    flex-direction: column;
    margin: 0px 15px 15px 0px;
}
.item-cont{
    flex: 1;
    padding-bottom: 20px;
}
.item-tip{
    font-size: 13px;
    font-weight: 400;
    color: #B2B2B2;
    line-height: 18px;
}
.school-name{
    font-weight: bold;
    color: #171717;
    line-height: 20px;
    font-size: 14px;
    margin-bottom: 18px;
}
.percent-tip{
    font-size: 26px;
    font-weight: bold;
    color: #21B014;
    line-height: 37px;
    margin-right: 12px;
}
.count-tip{
    font-size: 13px;
    font-weight: 400;
    color: #171717;
    line-height: 18px;
}
.arrow-area{
    display: inline-flex;
    margin-left: auto;
    background: #F7F7F7;
    border-radius: 50px;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-weight: 400;
    color: #909090;
    line-height: 18px;
    padding: 3px 5px 3px 10px;
}
</style>