<template>
  <custom-modal ref="modal" :width="750" :footerHide="true"  :isSlotHeader="true" :isSlotFooter="false" :closable="true">
    <div slot="header" class="flex w-break">{{qaInfo.sort}} {{qaInfo.title}}</div>
    <div>
      <rewrite-area class="flex-s-c">
        <Form ref="searchForm" :model="searchForm" :label-width="90" inline class="no-tip flex-b-c">
          <rewrite-search v-model="searchForm.searchq" placeholder="答案关键词搜索" @search="loadData()" class="m-r-10"/>
          <FormItem label="统计类型" :label-width="70">
            <Select style="width: 160px;" v-model="searchForm.total_type" @on-change="loadData()">
                <Option :value="1">用户去重</Option>
                <Option :value="2">总回收份数</Option>
            </Select>
          </FormItem>
        </Form>
      </rewrite-area>
      <Table ref="myTable" class="full-table qa-table" :height="400" :columns="columns" :data="list" border :loading="tableLoading">
      </Table>
      <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    </div>
  </custom-modal>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
import dateUtil from "@/helper/utils/date-util.js";
export default {
  components: {  },
  mixins: [ ListMixin, mixins ],
  props: {

  },
  data(){
    return {
      searchForm: {
        id: 0,
        topic_id: 0,
        searchq: "",
        total_type: 0,
      },
      qaInfo: {}
    }
  },
  methods:{
    showModal(detail){
      this.searchForm.id = this.pageQuery.id; 
      this.searchForm.topic_id = detail.topicId;
      this.searchForm.total_type = detail.searchForm.total_type;
      this.$refs["modal"] && this.$refs["modal"].show();
      this.loadData();
    },
    dismiss(){
      this.$refs["modal"] && this.$refs["modal"].dismiss();
    },
    onLoadData(page, extraData) {
      return this.$MainApi.questionnaireResultDetails({
              data: {
                  ...this.searchForm,
                  ...extraData,
              },
          })
          .then((res) => {
              if (res.code) {
                  let data = res.data || {};
                  let items = data.items || [];
                  items.map((item)=>{
                    if(item.update_time){
                        item._update_time = dateUtil.format(new Date(item.update_time), "yyyy年MM月dd日 HH:mm")
                    }
                  })
                  this.data = {
                      total: data.total,
                      list: items,
                  };
                  this.qaInfo = data.title_data || {}
              }
          });
    },
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/css/variables.less";
.qa-table{
  /deep/.ivu-table-border{
    td{
      border-right: 1px solid @border-color-base;
    }
  } 
}
</style>