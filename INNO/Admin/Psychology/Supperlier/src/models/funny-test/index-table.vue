<template>
    <hold-layout :isFull="true" class="funny-test-table-layout">
      <searchForm :searchForm="searchForm" @search="loadData()" @add="editTest()"></searchForm>
      <Table ref="myTable" class="full-table" :columns="columns" :data="list" border :loading="tableLoading">
        <template slot="title" slot-scope="{ row }">
          <div class="title-area flex-s-c">
            <div class="title-img-area flex-s0 m-r-10" v-bgStyle :style="'background-image:url('+ row.cover_pic +');'"></div>
            <div>{{row.name}}</div>
          </div>
        </template>
        <template slot="state" slot-scope="{ row, index }">
            <div  @click="row.status == 1 ? $Message.warning('发布的测试不可关闭') : ''">
                <i-switch :disabled="row.status == 1" v-model="row.status" size="large" :loading="row.stateLoading" :true-value="1" :false-value="0" :before-change="()=>{return beforeChangeState(index, row)}">
                    <span slot="open">发布</span>
                    <span slot="close">关闭</span>
                </i-switch>
            </div>
        </template>
        <template slot="handle" slot-scope="{ row }">
          <div class="operate-area">
            <a class="operate" v-hasAction="true" @click="editTest(row)">编辑</a>
            <!-- <a class="operate" v-hasAction="true" @click="getProblem(row)">题目管理</a> -->
          </div>
        </template>
      </Table>
      <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";

export default {
  name: "funnyTestIndexTable",
  mixins: [ListMixin, mixins],
  components: { searchForm},
  props: {
    type: String
  },
  data() {
    return {
      searchForm: {
        show_type: '',
        searchq: ''
      },
    };
  },
  methods: {
    init(){
      this.searchForm.show_type = this.type;
      this.loadData();
    },
    onLoadData(page, extraData) {
      return this.$MainApi
        .tasteTestList({
          data: {
            ...this.searchForm,
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
              item.stateLoading = false
            })
            this.data = {
              total: data.total,
              list: items,
            };
          }
        });
    },
    beforeChangeState(index, row) {
        let id = row.id || 0;
        let status = row.status || 0;
        status = status == 1 ? 0 : 1;
        this.$set(row, "stateLoading", true);
        return new Promise((rs, rj) => {
          this.$Modal.confirm({
            title: "提示",
            content: "测试发布后，题目管理只能修改题目，选项的文案和图片，其余不可调整！是否继续发布？",
            okText: "继续发布",
            onCancel:()=>{
              this.$set(row, "stateLoading", false);
            },
            onOk:()=>{
              this.setState(id, status)
                .then(() => {
                    this.$set(row, "stateLoading", false);
                    return rs();
                })
                .catch(() => {
                    this.$set(row, "stateLoading", false);
                    return rj();
                })
            }
          })
        });
    },
    setState(id, state) {
      if (!id) {
          this.$Message.warning("无效id");
          return Promise.reject();
      }
      return this.$MainApi.issueTasteTest({
          data: {
              id: id,
              value: state,
          },
      })
      .then((res) => {
          if (res.code) {
              this.$Message.success(res.message || "修改成功");
              return Promise.resolve();
          } else {
              this.$Message.warning(res.message || "修改失败");
              return Promise.reject();
          }
      });
    },
    editTest(row = {}){
      this.$router.push({
          name: "funnyTestDetail",
          query: {
            testId: row.id || '',
            type: this.type
          },
      });
    },
    getProblem(row){
      this.$router.push({
          name: "funnyTestProblems",
          query: {
            testId: row.id || '',
            type: this.type
          },
      });
    }
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.funny-test-table-layout{
  position: relative;
  .title-area{
    padding: 10px;
  }
  .title-img-area{
    width: 75px;
    height: 50px;
    overflow: hidden;
    background-color:#D9D8DB;
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-position: left top;
  }
}
</style>
<style lang="less">
</style>