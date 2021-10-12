<template>
  <div class="supplier-list">
    <Card>
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary" class="supplier-list_export" v-if="canCreate.export" :loading="exportLoading" @click="handleExport">导出</Button>
          <Button type="primary" icon="md-add" class="supplier-list_import" @click="handleImport">批量导入</Button>
          <Button type="primary" icon="md-add" @click="openModal({})" v-if="canCreate.add">添加商品供应商</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="suppliers_name">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.portrait_path" v-if="row.portrait_path" :alt="row.suppliers_name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.suppliers_name" v-viewer v-else></img>
            </div>
            <span class="name">{{row.suppliers_name}}</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="createTime">
          <p>{{row.created_at_format | initDate}}</p>
          <p>{{row.created_at_format | initTime}}</p>
        </template>
        <template slot-scope="{ row}" slot="handle">
          <span v-show="row.handle.edit" @click="editSupplier(row)"><a>编辑</a></span>
        </template>
      </Table>
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
    <SupplierForm ref="supplierForm" @on-success="onFormSuccess"></SupplierForm>
    <BatchImport ref="batchImport" @on-success="onImportSuccess"></BatchImport>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import SupplierForm from './supplier-form';
import BatchImport from '@/views/my-components/batch-import/batch-import';
import PageHelper from '@/libs/page-helper.js';

export default {
  components: {
    SearchForm,
    SupplierForm,
    BatchImport
  },
  data () {
    return {
      canCreate: {},
      exportLoading: false,
      condition: {
        searchq: '',
        type: 1
      }
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
      return this.$ajax.post(this.$api.goodsSupplierList, params)
    		.then(response => {
    			const res = response.data;
    			if (res.code) {
            this.data = res.data;
            this.canCreate = res.data && res.data.canCreate;
          }
        });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    openModal (row) {
      this.$refs.supplierForm.openModal(row);
    },
    // 编辑商品供应商
    editSupplier (row) {
      this.openModal(row);
    },
    handleImport () {
      this.$refs.batchImport.openModal(this.canCreate, this.$api.goodsSupplierUpload, this.$api.goodsSupplierDownload);
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
          this.exportLoading = true;
          // tips: 如果搜索所有的数据，不能带参数
          return this.$ajax.post(this.$api.goodsSupplierExport, this.condition)
          .then((response) => {
            const res = response.data;
            this.$refs.myTable.exportCsv({
              filename: '供应商数据',
              columns: res.data.columns,
              data: res.data.items
            });
            this.exportLoading = false;
          });
        }
      });
    },
    // 开启/关闭
    updateEnabled (index, row) {
      this.tableLoading = true;
      return this.$ajax.post(this.$api.goodsSupplierIsenable, {
        id: row.id,
        is_enabled: !Number(row.is_enabled)
      })
    		.then((response) => {
          var res = response.data;
    			if (res.code) {
            this.$Message.success('保存成功');
            this.handleUpdate();
          }
          this.tableLoading = false;
        });
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>
<style lang="less" scoped>
.supplier-list{
  .supplier-list_import, .supplier-list_export{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
