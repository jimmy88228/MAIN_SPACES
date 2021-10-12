<template>
  <div class="related-list">
    <Card>
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary" icon="md-add" class="related-list_import" @click="handleImport">批量导入</Button>
          <Button type="primary" class="related-list_export" v-if="canCreate.export" @click="handleExport">导出</Button>
        </Col>
      </Row>
      <Table
        :loading="tableLoading"
        :height="tableHeight"
        :columns="columns"
        :data="tableData"
        ref="myTable"
        :span-method="handleSpan"
        border></Table>
      <div v-show="pageTotal" class="list_page">
        <Page
          :total="pageTotal"
          :page-size="pageSize"
          :current="currentPage"
          :page-size-opts="pageSizeOpts"
          @on-change="e => changePage(e)"
          @on-page-size-change="ps => handlePageSize(ps)"
          show-elevator
          show-total
          show-sizer></Page>
      </div>
    </Card>
    <BatchImport ref="batchImport" @on-success="onImportSuccess"></BatchImport>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import BatchImport from '@/views/my-components/batch-import/batch-import';

export default {
  components: {
    SearchForm,
    BatchImport
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        type: 1
      },
      showSupply: false,
      selectSupply: [],
      goods_id: 0
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    clearOptions () {
      this.condition = {
        searchq: '',
        type: 1
      };
      this.$refs.search.clearOptions();
    },
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.goodsRelatedInformationList, params)
    		.then(response => {
    			const res = response.data;
    			if (res.code) {
            const result = this.initData(res.data);
            this.data = result;
            this.canCreate = res.data && res.data.canCreate;
          }
        });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    initData (data) {
      const result = [];
      let prev = null;
      data && data.items.forEach(item => {
        const itemLen = item.get_products.length;
        item.get_products.forEach(prodItem => {
          result.push(Object.assign({}, prodItem, {
            isVisible: false,
            edit_extend_product_sn: prodItem.extend_product_sn,
            rowSpan: (!prev || prev != prodItem.goods_sn) ? itemLen : 0,
            colSpan: (!prev || prev != prodItem.goods_sn) ? 1 : 0
          }));
          prev = prodItem.goods_sn;
        });
      });
      return Object.assign(data, {
        items: result
      });
    },
    handleSpan ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        return [this.tableData[rowIndex].rowSpan, this.tableData[rowIndex].colSpan];
      }
      if (columnIndex == 3) {
        return [this.tableData[rowIndex].rowSpan, this.tableData[rowIndex].colSpan];
      }
      if (columnIndex == 4) {
        return [this.tableData[rowIndex].rowSpan, this.tableData[rowIndex].colSpan];
      }
      if (columnIndex == 5) {
        return [this.tableData[rowIndex].rowSpan, this.tableData[rowIndex].colSpan];
      }
    },
    handleImport () {
      this.$refs.batchImport.openModal(this.canCreate, this.$api.goodsRelatedInformationUpload, this.$api.goodsRelatedInformationDownload);
    },
    onImportSuccess () {
      this.loadData();
    },
    handleExport () {
      this.$Modal.confirm({
        title: '操作提示',
        content: `确定进行导出操作`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.$refs.myTable.exportCsv({
            filename: '商品关联信息',
            columns: this.columns,
            data: this.tableData
          });
        }
      });
    },
    editRelatedInformation (data) {
      return this.$ajax.post(this.$api.goodsRelatedInformationEdit, {
        id: data.extend_id, // 关联条码的id，修改的时候传关联条码id，新增的时候传0
        goods_id: data.goods_id,
        product_sn: data.product_sn,
        extend_product_sn: data.edit_extend_product_sn // 关联条码
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.handleUpdate();
        }
      });
    },
  },
  mounted () {
    this.loadData();
  }
}
</script>
<style lang="less" scoped>
.related-list{
  .related-list_import, .related-list_export{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
