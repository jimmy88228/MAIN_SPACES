<template>
  <custom-modal class="hold-modal-zindex" :hideTBPadding="true" :isSlotHeader="true" :isSlotFooter="true" ref="modal" :width="1100" :closable="true">
    <div class="" slot="header">量表总题目预览</div>
    <previewForm :modelId="modelId" :searchForm="searchForm" @search="search"></previewForm>
    <div class="" style="margin-top: -1px;">
      <Table
        ref="myTable"
        :height="600"
        :columns="columns"
        :data="list"
        border
        :loading="tableLoading"
      >
      <template slot="instruction" slot-scope="{ row, index }">
        {{gaugeInfo.instruction || '--'}}
      </template>
      <template slot="dimensions" slot-scope="{ row, index }">
        {{row.dimensionsStr || '--'}}
      </template>
      </Table>
    </div>
    <div slot="footer">
      <!-- <Button @click="dismiss()">取消</Button> -->
      <Button type="primary" @click="dismiss()">确定</Button>
    </div>
  </custom-modal>
</template>
<script>
import ListMixin from "@/helper/mixin/list-mixin";
import previewMixins from "./preview-mixins.js";
import previewForm from "./preview-form.vue";
export default {
  mixins: [ ListMixin, previewMixins ],
  components: { previewForm },
  data(){
    return {
      searchForm: {
        dimensions: []
      },
      gaugeInfo: {},
      gaugeProblems: [],
      modelId: 0,
      allData: []
    }
  },
  methods: {
    dismiss() {
      this.$refs.modal.dismiss();
    },
    showModal(detail = {}){
      this.$refs.modal.show();
      this.data = { list: [], total: 0 }
      this.searchForm.dimensions = [];
      this.modelId = detail.id;
      this.loadGaugeInfo(detail.id);
      this.loadProblemsData(detail.id);
    },
    loadGaugeInfo(id){
      if(!Number(id)) return Promise.reject();
      return this.$MainApi.scaleInfo({
            data: {
                id: id
            }, 
            other: {
            isErrorMsg: true
          }
        })
        .then((res) => {
            if (res.code) {
                let data = res.data || {};
                this.gaugeInfo = data.items;
            }else{
                return Promise.reject(res);
            }
        })
    },
    loadProblemsData(id){
      if(!Number(id)) return Promise.reject();
      this.tableLoading = true;
      return this.$MainApi.scaleSubjectInfo({
        data: {
          id: id
        },
        other: {
          isShowLoad: true,
          isErrorMsg: true
        }
      }).then((res)=>{
        if(res.code){
          let data = res.data || {};
          let items = data.items || [];
          let maxCol = 0;
          items.map((item)=>{
            let option_data = item.option_data || [];
            let dimensionsIds = [], dimensions = [], dimensionsStr = "";
            maxCol = Math.max(maxCol, option_data.length)
            option_data.map((option)=>{
              option.points = [];
              let factor_data = option.factor_data;
              factor_data.map((factor)=>{
                let dimension_data = factor.dimension_data || {};
                if(factor.dimension_id && dimensionsIds.indexOf(factor.dimension_id) == -1){
                  dimensionsIds.push(factor.dimension_id);
                  dimensions.push(dimension_data);
                  dimensionsStr = dimensionsStr ? dimensionsStr + '、' + (dimension_data.name || '') : (dimension_data.name || '');
                }
                factor.points && option.points.push(parseInt(factor.points));
              })
            })
            item.dimensionsIds = dimensionsIds;
            item.dimensions = dimensions;
            item.dimensionsStr = dimensionsStr
            item.isHide = false;
          })
          this.allData = JSON.parse(JSON.stringify(items || []))
          this.data = {
            list: items,
            total: items.length
          }
          let columns = JSON.parse(JSON.stringify(this.fixedColumns));
          for(let i = 0; i < maxCol; i++){
            columns.push({
              title: "选项",
              minWidth: 150,
              maxWidth: 250,
              render: (h, params)=>{
                let row = params.row || {};
                let optionData = row.option_data;
                let option = optionData[i] || {};
                let points = option.points || [];
                let dataStr = points.length ? '(' + points.join(",") + ') ' + (option.option_content || '') : (option.option_content || '')
                return h('div',{
                  style: {}
                }, dataStr || '--')
              }
            })
          }
          this.columns = columns;
        }
      }).finally(()=>{
        this.tableLoading = false;
      })
    },
    tdStyle(item){
      let style = "";
      if(item.width){
        style = style + "max-width:" + item.width + "px;"
      }
      if(item.minWidth){
        style = style + "min-width:" + item.minWidth + "px;"
      }
      if(item.align){
        style = style + "text-align:" + item.align + ";justify-content:" + item.align + ";"
      }
      return style
    },
    search(){
      let allData = this.allData;
      let sDimensions = this.searchForm.dimensions || [];
      console.log("sDimensions", sDimensions);
      console.log("allData", allData)
      let list = [];
      if(sDimensions.length){
        allData.map((item)=>{
          let dimensionsIds = item.dimensionsIds || [];
          console.log("dimensionsIds", dimensionsIds);
          let hasMix = dimensionsIds.filter((id)=>{
            return sDimensions.includes(id)
          })
          if(hasMix.length){
            list.push(item);
          }
        })
        this.data = {
          list: list,
          total: list.length
        };
      } else {
        let list = this.data.list || [];
        if(this.allData.length != list.length){
          this.data = {
            list: JSON.parse(JSON.stringify(this.allData)),
            total: this.allData.length
          };
        }
      }
    },
    confirm(){

    }
  }
}
</script>
<style lang="less" scoped>
.preview-table{
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #DDDDD0;
    border-bottom: 0 none;
    .p-table-tr{
      display: flex;
      width:100%;
      background-color:#fff;
      border-bottom: 1px solid #DDDDD0;
      transition: all .35s;
      min-height: 50px;
      cursor: pointer;
    }
  }
  .p-table-header{
    .p-table-tr{
      background: #F6F6F6;
    }
    .p-table-th{
      min-width: 0;
      text-align: left;
      text-overflow: ellipsis;
      vertical-align: middle;
      font-size: 14px;
      position: relative;
      padding: 8px;
      flex: 1;
      flex-shrink: 0;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #7F7F7F;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }
  }
  .p-table-body{
    max-height: 400px;
    min-height: 200px;
    display: flex;
    .p-table-tr:hover{
      background-color:#EBF7FF;
    }
    .p-table-td{
      min-width: 0;
      box-sizing: border-box;
      text-align: left;
      text-overflow: ellipsis;
      vertical-align: middle;
      padding: 8px;
      flex: 1;
      flex-shrink: 0;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      border-right:1px solid #DDDDD0;
      &.handle{
        padding: 0;
      }
    }
    .p-table-hold{
      flex: 1;
    }
  }
</style>