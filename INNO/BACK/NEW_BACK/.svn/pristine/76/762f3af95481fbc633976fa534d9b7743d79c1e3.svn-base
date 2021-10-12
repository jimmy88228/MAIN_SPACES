<template>
  <div class="related-form">
    <PageTopBase :is-save="isSave" @save="handleInfoAdd">
      <div>
        <SearchForm @on-search="onSearchPage"></SearchForm>
        <Checkbox
          class="checkbox"
          v-model="module_is_check_all"
          label="选中所有供应商"
          border
          :disabled="tableData.length === 0 || searchForm.selectRange == 1"
          @on-change="$_handleCheckAll">选中所有供应商</Checkbox>
        <Table
          ref="myTable"
          :loading="tableLoading"
          :height="tableHeight"
          :columns="mergeColumns"
          :data="tableData"
          @on-select="$_handleSelect"
          @on-select-cancel="$_handleSelectCancel"
          @on-select-all="$_handleSelectAll"
          @on-select-all-cancel="$_handleSelectAllCancel"></Table>
        <div v-show="pageTotal" class="related-list_page">
          <Page
            :total="pageTotal"
            :page-size="pageSize"
            :current="currentPage"
            :page-size-opts="pageSizeOpts"
            @on-change="e => onChangePage(e)"
            @on-page-size-change="handlePageSizeChange"
            show-elevator
            show-total
            show-sizer></Page>
        </div>
      </div>
    </PageTopBase>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import SearchForm from './search-form';
import PageHelper from '@/libs/page-helper.js';
import TableHelper from '@/libs/table-helper.js';
import Mixin from './mixin';
import Conf from '@/config/index.js';
import PageTopBase from '@/views/my-components/page-top-base/index';

const checkColumn = {
  type: 'selection',
  width: 60,
  align: 'center',
  key: 'selection'
};

export default {
  props: ['id'],
  mixins: [PageHelper, TableHelper, Mixin],
  components: {
    SearchForm,
    PageTopBase
  },
  data () {
    return {
      searchForm: {
        searchq: '',
        type: 1,
        selectRange: 1
      },
      supplierId: 0,
      mergeColumns: [],
      // 所选的关联供应商(已选供应商)
      editSelectSupply: [],
      // 所选的关联供应商(全部供应商)
      tempSelectSupply: [],
      pageSize: Conf.PAGE_SIZE_DEF,
      pageSizeOpts: Conf.PAGE_SIZE_OPTS,
      spinShow: false,
      isSave: true
    }
  },
  methods: {
    onChangePage (page) {
      this.spinShow = true;
      this.currentPage = page;
      // 静态数据全部展示, 接口的需要按分页展示
      const searchForm = this.searchForm;
      return this.$ajax.post(this.$api.goodsSupplierList, {
        page: page,
        pageSize: this.pageSize,
        ...searchForm
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          this.data = res.data;
          this.initData();
          // 勾选状态
          this.$_handle_selection();
        }
        this.spinShow = false;
      });
    },
    handlePageSizeChange (pageSize) {
      this.spinShow = true;
      this.pageSize = pageSize;
      const searchForm = this.searchForm;
      return this.$ajax.post(this.$api.goodsSupplierList, {
        page: 1,
        pageSize: this.pageSize,
        ...searchForm
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          this.data = res.data;
          this.initData();
          // 勾选状态
          this.$_handle_selection();
        }
        this.spinShow = false;
      });
    },
    onSearchPage (searchForm) {
      this.spinShow = true;
      this.searchForm = { ...searchForm };
      if (this.searchForm.selectRange == 1) {
        // 静态数据不再请求接口
        this.tableLoading = false;
        this.loadStaticData();
      } else {
        return this.$ajax.post(this.$api.goodsSupplierList, {
          page: 1,
          pageSize: this.pageSize,
          ...searchForm
        })
        .then((response) => {
          var res = response.data;
          if (res.code) {
            this.data = res.data;
            this.initData('search');
            // 勾选状态
            this.$_handle_selection();
            this.currentPage = 1;
          }
          this.spinShow = false;
        });
      }
    },
    initData (type = 'change') {
      if (type == 'search') {
        // 搜索筛选了关联供应商
        let result = [];
        const reg = new RegExp(this.searchForm.searchq);
        if (this.searchForm.searchq) {
          const supply = this.selectSupply.map(item => item.get_cross_goods_suppliers);
          if (this.searchForm.type == 1) {
            result = supply.filter(item => reg.test(item.suppliers_name));
          } else if (this.searchForm.type == 2) {
            result = supply.filter(item => reg.test(item.suppliers_code));
          }
          this.tempSelectSupply = result;
        }
      } else {
        this.tempSelectSupply = [...this.selectSupply];
      }
      // 增加主供应商
      this.tableData.forEach((item, index) => {
        this.tempSelectSupply.some(selectItem => {
          this.$set(this.tableData[index], 'is_master', (item.id == selectItem.suppliers_id && !!Number(selectItem.is_master)) || false);
          return item.id == selectItem.suppliers_id && !!Number(selectItem.is_master);
        });
      });
      // 第一次赋值/搜索的时候赋值
      // 切换分页不赋值，会导致所选数据清空
      if (this.searchForm.selectRange == 2 && this.module_reload_data && (type == 'search' || this.module_select_data.length === 0)) {
        this.module_select_data = [...this.tempSelectSupply].map(item => {
          return {
            id: item.suppliers_id || item.id
          }
        });
      }
    },
    handleInfoAdd () {
      // 逐个选或全选
      const editData = this.searchForm.selectRange == 1 && this.editSelectSupply.length === 0;
      const selectData = this.searchForm.selectRange == 2 && this.module_select_data.length === 0;
      if (editData) {
        this.$Message.error('请选择供应商');
        return false;
      }
      if (!this.module_is_check_all && selectData) {
        this.$Message.error('请选择供应商');
        return false;
      }
      this.spinShow = true;
      return this.$ajax.post(this.$api.goodsRelatedInformationAdd, {
        goods_id: this.id,
        ids: this.searchForm.selectRange == 1 ? this.editSelectSupply.map(item => item.suppliers_id) : this.module_select_data.map(item => item.id),
        searchq: this.searchForm.searchq,
        type: this.searchForm.type,
        is_all: this.module_is_check_all && this.searchForm.selectRange == 2 ? 1 : 0
      })
    		.then((response) => {
    			var res = response.data;
          if (res.code) {
            this.$Message.success(res.message);
            this.$emit('on-success');
          }
          this.spinShow = false;
        });
    },
    handleInfoSetting () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.goodsRelatedInformationSetting, {
        goods_id: this.id,
        suppliers_id: this.supplierId
      }).then(response => {
        var res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.selectSupply.forEach(item => {
            if (item.id == res.data.id) {
              item['is_master'] = "1";
            } else {
              item['is_master'] = "0";
            }
          });
          this.editSelectSupply = [...this.selectSupply];
          // 默认展示所选的数据
          this.data = {
            items: this.selectSupply.map(item => {
              return Object.assign({}, item.get_cross_goods_suppliers, {
                special_id: item.id
              })
            })
          };
          this.initData();
        }
        this.spinShow = false;
      });
    },
    loadSelected () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.goodsRelatedInformationDec, {
        goods_id: this.id,
        ...this.searchForm
      })
      .then((response) => {
        var res = response.data;
        this.spinShow = false;
        if (res.code) {
          return res.data && res.data.items;
        }
      });
    },
    loadStaticData () {
      this.loadSelected().then(res => {
        this.selectSupply = res;
        this.editSelectSupply = [...this.selectSupply];
        // 默认展示所选的数据
        this.data = {
          items: this.selectSupply.map(item => {
            return Object.assign({}, item.get_cross_goods_suppliers, {
              special_id: item.id
            })
          })
        };
        this.initData();
        this.mergeColumns = [...this.cusColumns];
      });
    },
    delData (id) {
      this.spinShow = true;
      return this.$ajax.post(this.$api.goodsRelatedInformationDelte, {
        suppliers_ids: [id]
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.loadStaticData()
        }
        this.spinShow = false;
      });
    }
  },
  mounted () {
    this.loadStaticData();
  },
  watch: {
    searchForm: {
      handler () {
        if (this.searchForm.selectRange == 1) {
          this.mergeColumns = [...this.cusColumns];
          // 静态数据搜索
          const reg = new RegExp(this.searchForm.searchq);
          if (this.searchForm.searchq) {
            const supply = this.selectSupply.map(item => item.get_cross_goods_suppliers);
            let result = [];
            if (this.searchForm.type == 1) {
              result = supply.filter(item => reg.test(item.suppliers_name));
            } else if (this.searchForm.type == 2) {
              result = supply.filter(item => reg.test(item.suppliers_code));
            }
            this.data = {
              items: result
            };
          } else {
            this.data = {
              items: this.selectSupply.map(item => item.get_cross_goods_suppliers)
            };
          }
          this.initData();
        } else {
          this.mergeColumns = [checkColumn, ...this.cusColumns];
          this.mergeColumns.forEach((item, index) => {
            if (item.key == 'handle') this.mergeColumns.splice(index, 1);
          });
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="less">
.related-form{
  .related-list_page{
    margin: 10px 10px 0 10px;
    overflow: hidden;
    text-align: right;
  }
  .btn-group{
    text-align: right;
  }
  .checkbox{
    margin-bottom: 10px;
  }
}
</style>
