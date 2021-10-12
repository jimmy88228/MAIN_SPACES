<style lang="less" scoped>
.qrcode-list{
    .btn-group{
        text-align: right;
    }
    .table_handle{
        margin-bottom: 10px;
    }
}
</style>
<template>
    <div class="qrcode-list">
        <Card>
            <SearchForm
                @on-search="searchPage"
                :cat-list="catList"
                :vcat-list="vcatList"
                :good-sale-type="goodSaleType"></SearchForm>
            <div class="table_handle">
                <Button type="primary" @click="handleSingleSelect">全选单款</Button>
                <Button type="primary" @click="handleCreateBatch">批量生成</Button>
                <Button type="primary" @click="handleExportBatch">批量导出</Button>
            </div>
            <Table
                :loading="tableLoading"
                :height="tableHeight"
                :columns="columns"
                :data="tableData"
                ref="myTable"
                @on-select="handleSelect"
                @on-select-cancel="handleSelectCancel"
                @on-select-all="handleSelectAll"
                @on-select-all-cancel="handleSelectAllCancel"></Table>
            <div v-show="pageTotal" class="list_page">
                <Page :total="pageTotal" :page-size="pageSize" :current="currentPage" @on-change="changePage" show-total></Page>
            </div>
        </Card>
        <!--异步处理导出excel组件-->
		<!-- <notice ref="notice" @finish="handleFinish"></notice> -->
        <div class="col">
            <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
        </div>
    </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import notice from '@/views/my-components/mq-notice/mq-notice';

export default {
  components: {
    SearchForm,
    notice
  },
  data () {
    return {
      canCreate: {},
      searchForm: {
        searchq: '',
        type: 1
      },
      catList: [],
      vcatList: [],
      goodSaleType: {},
      // 批量操作的数组
      selectColor: [],
      isShowNotice: true,
      jobIdCol: []
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onChangePage (page) {
      const searchForm = this.searchForm;
        	return this.$ajax.post(this.$api.goodsQrcodeList, {
        page: page,
        ...searchForm
      })
    		.then((response) => {
    			var res = response.data;
    			if (res.code) {
            this.data = res.data;
            this.initData();
          }
        });
    },
    onLoadData (page) {
        	return this.$ajax.post(this.$api.goodsQrcodeList, { page })
    		.then(response => {
    			const res = response.data;
    			if (res.code) {
            this.data = res.data;
            this.canCreate = res.data && res.data.canCreate;
            this.catList = [...res.data.cat];
            this.vcatList = [...res.data.vcat];
            this.goodSaleType = { ...res.data.sale_type };
            this.initData();
          }
        });
    },
    onSearchPage (searchForm) {
      this.searchForm = { ...searchForm };
        	return this.$ajax.post(this.$api.goodsQrcodeList, searchForm)
    		.then((response) => {
    			var res = response.data;
    			if (res.code) {
            this.data = res.data;
            this.initData();
            this.currentPage = 1;
          }
        });
    },
    initData () {
      this.tableData.forEach(item => {
        this.$set(item, '_checked', false);
        item.color.forEach(colorItem => {
          this.$set(colorItem, 'isChecked', false);
        });
      });
    },
    checkSelected () {
      this.selectColor = [];
      this.tableData.forEach(item => {
        item.color.forEach(colorItem => {
          if (colorItem.isChecked) {
            this.selectColor.push(colorItem);
          }
        });
      });
    },
    // 单品是否全选
    isCheckAll (bool, index) {
      this.tableData[index]._checked = bool;
    },
    createQrcode (ids) {
      return this.$ajax.post(this.$api.goodsQrcodeCreate, {
        color_ids: ids
      })
    		.then((response) => {
    			var res = response.data;
    			if (res.code) {
            var jobId = res.data;
            // 打开异步提示组件
            this.jobIdCol.push(jobId);
            this.$nextTick(() => {
              this.$refs[`notice${jobId}`][0].showNotice(jobId, 'none');
            });
            this.$Message.success(res.message);
          }
        });
    },
    downLoadQrcode (ids) {
      return this.$ajax.post(this.$api.goodsQrcodeDown, {
        color_ids: ids
      })
    		.then((response) => {
    			var res = response.data;
    			if (res.code) {
            var jobId = res.data;
            // 打开异步提示组件
            this.jobIdCol.push(jobId);
            this.$nextTick(() => {
              this.$refs[`notice${jobId}`][0].showNotice(jobId);
            });
            this.$Message.success(res.message);
          }
        });
    },
    // 表单操作
    handleSelect (selection, row) {
      const curId = row.goods_id;
      let curIndex = 0;
      this.tableData.forEach((item, index) => {
        if (item.goods_id == curId) curIndex = index;
      });
      this.tableData[curIndex].color.forEach(item => {
        item.isChecked = true;
      });
      // 手动设置_checked ???不设置会导致复选框勾选状态异常
      this.tableData[curIndex]._checked = true;
      this.checkSelected();
    },
    handleSelectCancel (selection, row) {
      const curId = row.goods_id;
      let curIndex = 0;
      this.tableData.forEach((item, index) => {
        if (item.goods_id == curId) curIndex = index;
      });
      this.tableData[curIndex].color.forEach(item => {
        item.isChecked = false;
      });
      this.tableData[curIndex]._checked = false;
      this.checkSelected();
    },
    handleSelectAll () {
      this.tableData.forEach(item => {
        item._checked = true;
        item.color.forEach(colorItem => {
          colorItem.isChecked = true;
        });
      });
      this.checkSelected();
    },
    handleSelectAllCancel () {
      this.tableData.forEach(item => {
        item._checked = false;
        item.color.forEach(colorItem => {
          colorItem.isChecked = false;
        });
      });
      this.checkSelected();
    },
    handleCreateBatch () {
      if (this.selectColor.length === 0) {
        this.$Message.error('请选择要生成的颜色或单款');
        return false;
      }
      const name = this.selectColor.map(item => item.color_name).join(',');
      this.$Modal.confirm({
        title: '操作提示',
        content: `确定批量生成二维码: ${name}?`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const ids = this.selectColor.map(item => item.color_id);
          this.createQrcode(ids);
        }
      });
    },
    handleExportBatch () {
      if (this.selectColor.length === 0) {
        this.$Message.error('请选择要下载的颜色或单款');
        return false;
      }
      const hasCreated = this.selectColor.every(item => !!item.is_create);
      const ids = this.selectColor.map(item => item.color_id);
      const name = this.selectColor.map(item => item.color_name).join(',');
      if (!hasCreated) {
        this.$Message.error('请先生成要下载的颜色或单款');
        return false;
      }
      this.$Modal.confirm({
        title: '操作提示',
        content: `确定批量导出二维码: ${name}?`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.downLoadQrcode(ids);
        }
      });
    },
    handleSingleSelect () {
      this.tableData.forEach(item => {
        item.color.forEach(colorItem => {
          if (colorItem.is_single) colorItem.isChecked = true;
        });
      });
      this.checkSelected();
    },
    handleFinish () {
      // 异步下载结束后刷新
      this.loadData();
      this.currentPage = 1;
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>
