<template>
  <div class="goods-allocation">
    <PageTopBase>
      <div class="content">
        <div class="tips">
          <Alert show-icon>
            什么是转移商品分类?
            <Icon type="ios-bulb-outline" slot="icon"></Icon>
            <template slot="desc">在添加商品或者在商品管理中,如果需要对商品的分类进行变更,那么你可以通过此功能,正确管理你的商品分类。</template>
          </Alert>
        </div>
        <div class="header">
          <label class="title">从此分类</label>
          <Cascader class="basic_cascader" :data="sortCatList" v-model="currentSort" :render-format="renderSort" @on-change="selectSortCat" @on-visible-change="handleSearch" filterable change-on-select transfer></Cascader>
          <Divider type="vertical" />
          <label class="title">转移到</label>
          <Cascader class="basic_cascader" :data="sortToCatList" v-model="currentSortTo" :render-format="renderSort" @on-change="selectToSortCat" filterable change-on-select transfer></Cascader>
          <Button type="primary" @click="modalOk" class="btn">开始转移</Button>
        </div>
        <Checkbox class="checkbox" v-model="isCheckAll" label="选中该分类下的所有商品" border :disabled="tableData.length === 0" @on-change="handleCheck">选中该分类下的所有商品</Checkbox>
        <Row type="flex">
          <Col span="18">
            <Table
                ref="myTable"
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
                :height="specTableHeight"
                @on-select="handleSelect"
                @on-select-cancel="handleSelectCancel"
                @on-select-all="handleSelectAll"
                @on-select-all-cancel="handleSelectAllCancel"></Table>
          </Col>
          <Col span="5" offset="1">
            <Card class="card">
              <div class="calc_good" slot="title">
                <span>已选商品</span>
                <span v-if="isCheckAll">{{pageTotal}}</span>
                <span v-if="!isCheckAll && goods_ids.length > 0">{{goods_ids.length}}</span>
              </div>
              <template v-if="!isCheckAll && goods_ids.length > 0">
                <div v-for="(item, index) in goods_ids" :key="item.goods_id">
                  <p class="select_item">{{`${index+1}.${item.goods_name}(${item.goods_sn})`}}</p>
                </div>
              </template>
              <template>
                <p v-if="isCheckAll">请查看表格中所选的商品</p>
                <p v-if="!isCheckAll && goods_ids.length === 0">暂无数据</p>
              </template>
            </Card>
          </Col>
        </Row>
        <div v-show="pageTotal" class="list_page left">
          <Page
            :total="pageTotal"
            :page-size="pageSize"
            :current="currentPage"
            :page-size-opts="pageSizeOpts"
            @on-change="onChangePage"
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
import Conf from '@/config/index';
import PageTopBase from '@/views/my-components/page-top-base/index';

const defaultItem = {
  value: 0,
  label: '请选择',
  children: []
};
const defaultParams = {
  isInit: 1,
  searchq: '',
  type: 1,
  is_delete: 0,
  is_on_sale: 0,
  sale_type: '0',
  sale_kind: 0,
  is_on_image: 0,
  platform_src: ''
};
const COLUMNS = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '商品货号',
    key: 'goods_sn',
    align: 'left'
  },
  {
    title: '商品名称',
    key: 'goods_name',
    align: 'left'
  }
];

export default {
  props: ['type'], //cat:标准分类 custom-cat:自定义分类
  data () {
    return {
      spinShow: false,
      sortCatList: [],
      currentSort: [],
      sortToCatList: [],
      currentSortTo: [],
      formSearch: {
        from_cat_id: 0,
        to_cat_id: 0
      },
      columns: COLUMNS,
      goods_ids: [],
      isCheckAll: false,
      pageTotal: 0,
      pageSize: Conf.PAGE_SIZE_DEF,
      currentPage: Conf.PAGE_START,
      pageSizeOpts: Conf.PAGE_SIZE_OPTS,
      tableLoading: false,
      tableData: [],
      control: {
        save: false
      },
      specTableHeight: 500
    }
  },
  components: {
    PageTopBase
  },
  methods: {
    renderSort (labels) {
      return labels.slice(labels.length - 1).join('/');
    },
    // 重置数据
    reset () {
      this.formSearch.from_cat_id = 0;
      this.formSearch.to_cat_id = 0;
      this.goods_ids = [];
      this.currentSort = [];
      this.currentSortTo = [];
      this.data = [];
    },
    handlePageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.initData();
    },
    onChangePage (page) {
      this.currentPage = page;
      this.initData();
    },
    // 搜索
    searchPage () {
      this.currentPage = 1;
      this.initData();
    },
    // 初始化数据
    initData () {
      this.tableLoading = true;
      return this.$ajax.post(this.$api.goodsList, {
        page: this.currentPage,
        pageSize: this.pageSize,
        change_cat: 1, // 1:只查询当前分类 0:查询当前分类以及子分类
        cat_id: this.type == 'cat' ? this.formSearch.from_cat_id : 0,
        vcat_id: this.type == 'cat' ? 0 : this.formSearch.from_cat_id,
        ...defaultParams
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          this.data = res.data;
          this.pageTotal = res.data && res.data.total;
          this.tableData = res.data && res.data.items;
          this.handleCheck(this.isCheckAll);
          this.tableLoading = false;
        }
      });
    },
    loadExtraData () {
      this.$ajax.post(this.type == 'cat' ? this.$api.catTree : this.$api.vcatTree)
      .then(response => {
        const res = response.data;
        if (res.code) {
          const origin = res.data;
          this.sortCatList = this.handleSortList(origin);
          this.sortCatList.unshift(defaultItem);

          this.sortToCatList = this.handleSortList(origin);
          this.sortToCatList.unshift(defaultItem);
        }
      });
    },
    handleSortList (context) {
      const format = context.map(item => {
        return {
          value: item.cat_id || item.vcat_id,
          label: item.cat_name || item.vcat_name,
          parent_id: item.parent_id,
          children: item.children.length ? this.handleSortList(item.children) : []
        }
      });
      return format;
    },
    selectSortCat (value, selectedData) {
      this.formSearch.from_cat_id = selectedData[selectedData.length - 1].value;
      this.goods_ids = [];
    },
    selectToSortCat (value, selectedData) {
      this.formSearch.to_cat_id = selectedData[selectedData.length - 1].value;
    },
    // 表格操作
    handleSelect (selection, row) {
      this.goods_ids.push(row);
    },
    handleSelectCancel (selection, row) {
      const goodsId = row.goods_id;
      this.goods_ids.forEach((item, index) => {
        if (item.goods_id == goodsId) this.goods_ids.splice(index, 1);
      });
    },
    handleSelectAll (selection) {
      const exitId = this.goods_ids.map(item => item.goods_id);
      const filter = selection.filter(item => exitId.indexOf(item.goods_id) == -1);
      filter.forEach(item => {
        this.goods_ids.push(item);
      });
    },
    handleSelectAllCancel () {
      const exitId = this.goods_ids.map(item => item.goods_id);
      const filter = this.tableData.filter(item => exitId.indexOf(item.goods_id) != -1);
      const delCol = filter.map(item => item.goods_id);
      for (let i = this.goods_ids.length - 1; i >= 0; i--) {
        if (delCol.indexOf(this.goods_ids[i].goods_id) != -1) {
          this.goods_ids.splice(i, 1);
        }
      }
    },
    handleCheck (bool) {
      if (bool) {
        // 全选需要勾选所有数据
        this.tableData.forEach((item, index) => {
          this.$set(this.tableData[index], '_checked', true);
        });
        this.goods_ids = [];
      } else {
        // 每次切换页面需要重新读取选中的数据
        if (this.goods_ids.length > 0) {
          this.tableData.forEach((item, index) => {
            this.goods_ids.forEach(selectItem => {
              if (selectItem.goods_id == item.goods_id) {
                this.$set(this.tableData[index], '_checked', true);
              }
            });
          });
        } else {
          this.tableData.forEach((item, index) => {
            this.$set(this.tableData[index], '_checked', false);
          });
        }
      }
    },
    handleSearch (bool) {
      if (!bool) {
        if (this.formSearch.from_cat_id) this.searchPage();
      }
    },
    modalOk () {
      if (!this.formSearch.from_cat_id) {
        this.$Message.error('请选择从此分类');
        return false;
      } else if (!this.formSearch.to_cat_id) {
        this.$Message.error('请选择转移到分类');
        return false;
      } else if (this.formSearch.from_cat_id == this.formSearch.to_cat_id) {
        this.$Message.error('请选择两个不同分类');
        return false;
      } else if (this.goods_ids.length === 0 && !this.isCheckAll) {
        this.$Message.error('请选择转移的商品');
        return false;
      }
      const params = this.type == 'cat' ? {
        cat_id: this.formSearch.from_cat_id,
        to_cat_id: this.formSearch.to_cat_id,
        goods_ids: this.goods_ids.map(item => item.goods_id).join(','),
        // 是否全选该分类的所有商品 1：是，0：否
        all_goods: this.isCheckAll ? 1 : 0
      } : {
        vcat_id: this.formSearch.from_cat_id,
        to_vcat_id: this.formSearch.to_cat_id,
        goods_ids: this.goods_ids.map(item => item.goods_id).join(','),
        // 是否全选该分类的所有商品 1：是，0：否
        all_goods: this.isCheckAll ? 1 : 0
      };
      this.spinShow = true;
        	this.$ajax.post(this.type == 'cat' ? this.$api.goodsRapidAllocation : this.$api.goodsVcatRapidAllocation, params)
    		.then((response) => {
    			var res = response.data;
    			if (res.code) {
            // 初始化数据
            this.$Message.success(res.message);

            // 把数据返回给父级
            this.$emit('on-success');
            this.spinShow = false;
            this.reset();
    			}
        });
    }
  },
  mounted () {
    this.specTableHeight = document.body.clientHeight - 400;
    this.loadExtraData();
  }
}
</script>

<style lang="less">
.goods-allocation{
  .content{
    .header{
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .title{
        margin-right: 10px;
      }
      .cascader{
        width: 320px;
      }
      .btn{
        margin-left: 10px;
      }
    }
    .checkbox{
      margin-bottom: 10px;
    }
    .card{
      overflow-x: hidden;
      overflow-y: scroll;
      .calc_good{
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .select_item{
        margin-bottom: 4px;
      }
    }
  }
}
</style>
