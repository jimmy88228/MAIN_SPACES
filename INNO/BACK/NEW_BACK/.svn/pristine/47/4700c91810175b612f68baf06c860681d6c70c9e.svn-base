<template>
  <div>
    <!-- <Table :columns="columns2" :data="data"></Table> -->
    <!-- <v-table
      is-horizontal-resize
      :columns="columns"
      :table-data="data"
      :cell-merge="cellMerge"
      style="width:100%"
    ></v-table> -->
    <!-- <Input v-model="count" @on-change="handleChange" style="position: fixed;bottom:0;right:0;width: 300px"/>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table> -->
  </div>
</template>

<script>
import Field from './field';

export default {
  mixins: [Field],
  data () {
      return {
          title1: '',
          title2: '',
          data: [],
          count: 0,
          tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
      }
  },
  mounted () {
    this.loadData();
  },
  methods: {
    handleChange () {
      this.columns[1].title = this.count;
      this.columns2[1].title = this.count;
    },
    cellMerge (rowIndex,rowData,field) {
      if (!Number.isInteger((rowIndex + 1) / 2) && field === 'goods_name') {
        return {
          colSpan: 1,
          rowSpan: 2,
          content: '<span style="color:red">单元格合并</span>',
          componentName: ''
        }
        } else if (field === 'goods_name') {
          return {
          colSpan: 0,
          rowSpan: 0,
          content: '',
          componentName: ''
        }
        }
    },
    handleSpan ({ row, column, rowIndex, columnIndex }) {
        // if (!Number.isInteger((rowIndex + 1) / 2) && columnIndex === 0) {
        //     return [2, 1];
        // } else if (columnIndex === 0) {
        //     return [0, 0];
        // }
    },
    handleData () {
      // this.columns1[this.columns1.length - 1].title = this.title1;
    },
    loadData () {
      this.$ajax.post(this.$api.goodsList, {
        isInit: 1,
        is_delete: 0,
        is_on_sale: 1,
        page: 1,
        pageSize: 150
      }).then(res => {
        this.data = res.data.data.items;
      })
    }
  }
}
</script>

<style>

</style>

