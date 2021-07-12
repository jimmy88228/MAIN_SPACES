<template>
  <div class="appletcode-list">
    <Card>
      <SearchForm ref="search" :good-sale-type="goodSaleType" @on-search="searchPage"></SearchForm>
      <Table
        :loading="tableLoading"
        :columns="tableColumns"
        :data="tableData"
        :height="tableHeight"
        ref="myTable"
        @on-select-all="handleCheckAll"
        @on-selection-change="handleCheckChange">
        <template slot-scope="{ row }" slot="name">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.goods_img" v-if="row.goods_img" :alt="row.goods_img" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else></img>
            </div>
            <span class="clamp2 name">{{row.goods_name}}</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.created" class="strong_tips">已生成</span>
          <span v-show="row.handle.can_create" @click="openModal(row)"><a>生成</a></span>
          <Divider type="vertical" v-show="(row.handle.created || row.handle.can_create) && row.handle.down"/>
          <span v-show="row.handle.down" @click="handleDownload(row)"><a>下载</a></span>
        </template>
      </Table>
      <div class="handle_wrapper">
        <div class="action">
          <Checkbox v-model="isCheckAll" @on-change="handleCheck">当页全选</Checkbox>
          <ButtonGroup>
            <Button @click="handleCode('create')">批量生成</Button>
            <Button @click="handleCode('download')">批量下载</Button>
          </ButtonGroup>
        </div>
        <div v-show="pageTotal">
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
      </div>
    </Card>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import Conf from '@/config/index';

export default {
  components: {
    SearchForm
  },
  data () {
    return {
      condition: {
        keywords: '',
        search_type: 1,
        sale_type: '0',
        is_on_sale: 0,
        cat_id: 0,
        vcat_id: 0
      },
      goodSaleType: {},
      isCheckAll: false,
      selectedData: [],
      applet: [],
      tableLoading: false
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.goodsAppletCodeList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.goodSaleType = res.data && res.data.sale_type;
          this.applet = res.data && res.data.applet;
        }
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    openModal (row) {
      this.create([row.goods_id]);
    },
    handleCode (type) {
      if (this.selectedData.length === 0) {
        this.$Message.error('请选择商品');
        return false;
      }
      const goodsIds = this.selectedData.map(item => {
        return item.goods_id;
      });
      if (type === 'create') {
        this.create(goodsIds);
      } else if (type === 'download') {
        this.download(goodsIds);
      }
    },
    handleDownload (row) {
      this.download([row.goods_id]);
    },
    create (data) {
      this.tableLoading = true;
      return this.$ajax.post(this.$api.goodsCreateAppletCode, {
        goods_ids: data
      }).then((response) => {
        var res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
        }
        this.loadData();
        this.selectedData = [];
        this.tableLoading = false;
        this.isCheckAll = false;
      });
    },
    download (data) {
      this.tableLoading = true;
      return this.$ajax.post(this.$api.goodsAppletCodeDown, {
        goods_ids: data
      }).then((response) => {
        var res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          const a = document.createElement('a');
          a.href = Conf.DOWNLOAD_URL + res.data.downloadUrl;
          a.download = '下载商品二维码';
          a.id = 'downloadAction';
          document.body.append(a);

          const downloadAction = document.getElementById('downloadAction');
          downloadAction.click();
          downloadAction.remove();
        }
        this.loadData();
        this.selectedData = [];
        this.tableLoading = false;
        this.isCheckAll = false;
      });
    },
    handleCheck () {
      this.tableData.forEach((item, index) => {
        if ('_checked' in item) {
          item._checked = this.isCheckAll;
        } else {
          this.$set(this.tableData[index], '_checked', this.isCheckAll);
        }
      });
      this.selectedData = [...this.tableData].filter(item => item._checked);
    },
    handleCheckAll () {
      this.isCheckAll = true;
    },
    handleCheckChange (selection) {
      this.selectedData = selection;
      let allLen = this.tableData.length;
      this.isCheckAll = allLen > 0 && allLen === selection.length;
      const hasSelected = this.selectedData.map(item => item.goods_id);
      this.tableData.forEach((item, index) => {
        this.$set(this.tableData[index], '_checked', hasSelected.includes(item.goods_id));
      });
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.appletcode-list{
  .handle_wrapper{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 10px 0 10px;
    .action{
      padding-left: 22px;
    }
  }
}
</style>
