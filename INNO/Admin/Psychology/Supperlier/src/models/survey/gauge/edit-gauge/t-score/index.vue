<template>
  <hold-layout :isFull="true">
    <searchForm @batchImport="batchImportTScore" :publishState="!!baseInfo.publish_state"></searchForm>
    <Table
      :border="true"
      ref="tableRef"
      class="full-table border"
      :columns="columns"
      :loading="tableLoading"
      :data="tScoreData"
       
    >
    <template slot="rule" slot-scope="{ row }">
      {{row.ruleName || '--'}}
    </template>
    <template slot="mean" slot-scope="{ row }">
      {{row.factor && row.factor.mean || '--'}}
    </template>
    <template slot="standardDeviation" slot-scope="{ row }">
      {{row.factor && row.factor.standard_deviation || '--'}}
    </template>
    </Table>
  </hold-layout >
</template>

<script>
import searchForm from "./search-form.vue";
export default {
  components: { searchForm },
  props: {
    baseInfo:{
      type: Object,
      default:()=>{ return {} }
    }
  },
  data(){
    return {
      tScoreData: [],
      defaultColumns: [
        {
          title: "统计规则名称",
          minWidth: 150,
          slot: "rule"
        },
        {
          title: "平均分",
          minWidth: 150,
          slot: "mean"
        },
        {
          title: "标准差",
          minWidth: 150,
          slot: "standardDeviation"
        }
      ],
      columns: [],
      tableLoading: false
    }
  },
  methods: {
    loadTscoreData(){
      let pageQuery = this.pageQuery || {};
      if(!pageQuery.id) return Promise.reject();
      this.tableLoading = true;
      return this.$MainApi.scaleTscoreList({
            data: {
                id: pageQuery.id
            }, 
            other: {
            isErrorMsg: true
          }
        })
        .then((res) => {
            if (res.code) {
                let data = res.data || {};
                let items = data.items || {};
                let question_sorts = items.question_sorts || [];
                let tscore_data = items.tscore_data || [];
                let columns = [], tScoreData = [];
                let defaultColumns = JSON.parse(JSON.stringify(this.defaultColumns));
                tscore_data.map((tItem, tIndex)=>{
                  let get_factor = tItem.get_factor || [];
                  get_factor.map((item, index)=>{
                    tScoreData.push({
                      ruleId: (tItem.get_rule && tItem.get_rule.id) || 0,
                      ruleName: (tItem.get_rule && tItem.get_rule.name) || '',
                      factor: item
                    })
                  })
                })
                question_sorts.map((item, index)=>{
                  columns.push({
                    title: `条件${index + 1} - ${item}`,
                    minWidth: 150,
                    render: (h, params)=>{
                      let row = params.row || {};
                      let factor = row.factor || {};
                      let options_data = factor.options_data || [];
                      return h('div',{
                        style: {}
                      }, options_data[index] || '--')
                    }
                  })
                })
                defaultColumns.splice(1, 0, ...columns)
                this.columns = defaultColumns;
                this.tScoreData = tScoreData;
            }else{
                return Promise.reject(res);
            }
        }).finally(()=>{
          this.tableLoading = false;
        })
    },
    batchImportTScore(){
      this.$UIModule({
          mode: "batch-import",
          props: {
            upLoadPayLoad: {
              id: this.pageQuery.id || 0
            }
          },
          options: {
              canCreate: { upload: true, download: true },
              uploadUrl: "batchImportTscore",
              downloadUrl: "batchImportTscoreTpl",
          },
          success: () => {
              this.loadTscoreData();
          },
      });
    },
    init(){
      this.loadTscoreData();
    }
  }
}
</script>

<style>

</style>