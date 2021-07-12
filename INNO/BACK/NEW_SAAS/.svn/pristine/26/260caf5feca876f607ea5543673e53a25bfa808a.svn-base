<template>
  <div class="area-allocation">
    <PageTopBase>
      <div class="content">
        <div class="tips">
          <Alert show-icon>
            什么是转移店铺?
            <Icon type="ios-bulb-outline" slot="icon"></Icon>
            <template slot="desc">在添加线下店铺或者在线下店铺管理中,如果需要对线下店铺的所属渠道进行变更,那么你可以通过此功能,正确管理你的店铺所属渠道。</template>
          </Alert>
        </div>
        <div class="header">
          <label class="title">从此渠道</label>
          <span>{{agentData.name}}</span>
          <Divider type="vertical" />
          <label class="title">转移到</label>
          <Cascader class="basic_cascader" :data="sortToCatList" v-model="currentSortTo" :render-format="renderSort" @on-change="selectToSortCat" filterable change-on-select transfer></Cascader>
          <Button type="primary" @click="modalOk" class="btn">开始转移</Button>
        </div>
        <Checkbox class="checkbox" v-model="isCheckAll" label="选中该渠道下的所有店铺" border :disabled="tableData.length === 0" @on-change="handleCheck">选中该渠道下的所有店铺</Checkbox>
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
                <span>已选店铺</span>
                <span v-if="isCheckAll">{{pageTotal}}</span>
                <span v-if="!isCheckAll && store_ids.length > 0">{{store_ids.length}}</span>
              </div>
              <template v-if="!isCheckAll && store_ids.length > 0">
                <div v-for="(item, index) in store_ids" :key="item.id">
                  <p class="select_item">{{`${index+1}.${item.name}(${item.code})`}}</p>
                </div>
              </template>
              <template>
                <p v-if="isCheckAll">请查看表格中所选的店铺</p>
                <p v-if="!isCheckAll && store_ids.length === 0">暂无数据</p>
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
const COLUMNS = [
  {
    type: 'selection',
    width: 60,
    align: 'center'
  },
  {
    title: '店铺名称',
    key: 'name',
    align: 'left'
  },
  {
    title: '店铺代码',
    key: 'code',
    align: 'left'
  }
];

export default {
  props: ['agent'],
  data () {
    return {
      spinShow: false,
      sortToCatList: [],
      currentSortTo: [],
      formSearch: {
        from_cat_id: 0,
        to_cat_id: 0
      },
      columns: COLUMNS,
      store_ids: [],
      isCheckAll: false,
      pageTotal: 0,
      pageSize: Conf.PAGE_SIZE_DEF,
      currentPage: Conf.PAGE_START,
      pageSizeOpts: Conf.PAGE_SIZE_OPTS,
      tableLoading: false,
      tableData: [],
      specTableHeight: 500
    }
  },
  components: {
    PageTopBase
  },
  computed: {
    agentData () {
      return JSON.parse(this.agent);
    }
  },
  methods: {
    renderSort (labels) {
      return labels.slice(labels.length - 1).join('/');
    },
    // 重置数据
    reset () {
      this.formSearch.from_cat_id = 0;
      this.formSearch.to_cat_id = 0;
      this.store_ids = [];
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
      return this.$ajax.post(this.$api.shiftstorelist, {
        id: this.agentData.id
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
      this.$ajax.post(this.$api.getAgent)
      .then(response => {
        const res = response.data;
        if (res.code) {
          const origin = res.data && res.data.items;

          this.sortToCatList = this.handleSortList(origin);
          this.sortToCatList.unshift(defaultItem);
        }
      });
    },
    handleSortList (context) {
      const format = context.map(item => {
        return {
          value: item.value,
          label: item.label,
          parent_id: item.p_id,
          children: item.children.length ? this.handleSortList(item.children) : []
        }
      });
      return format;
    },
    selectToSortCat (value, selectedData) {
      this.formSearch.to_cat_id = selectedData[selectedData.length - 1].value;
    },
    // 表格操作
    handleSelect (selection, row) {
      this.store_ids.push(row);
    },
    handleSelectCancel (selection, row) {
      const goodsId = row.id;
      this.store_ids.forEach((item, index) => {
        if (item.id == goodsId) this.store_ids.splice(index, 1);
      });
    },
    handleSelectAll (selection) {
      const exitId = this.store_ids.map(item => item.id);
      const filter = selection.filter(item => exitId.indexOf(item.id) == -1);
      filter.forEach(item => {
        this.store_ids.push(item);
      });
    },
    handleSelectAllCancel () {
      const exitId = this.store_ids.map(item => item.id);
      const filter = this.tableData.filter(item => exitId.indexOf(item.id) != -1);
      const delCol = filter.map(item => item.id);
      for (let i = this.store_ids.length - 1; i >= 0; i--) {
        if (delCol.indexOf(this.store_ids[i].id) != -1) {
          this.store_ids.splice(i, 1);
        }
      }
    },
    handleCheck (bool) {
      if (bool) {
        // 全选需要勾选所有数据
        this.tableData.forEach((item, index) => {
          this.$set(this.tableData[index], '_checked', true);
        });
        this.store_ids = [];
      } else {
        // 每次切换页面需要重新读取选中的数据
        if (this.store_ids.length > 0) {
          this.tableData.forEach((item, index) => {
            this.store_ids.forEach(selectItem => {
              if (selectItem.id == item.id) {
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
    modalOk () {
      if (!this.formSearch.to_cat_id) {
        this.$Message.error('请选择转移渠道');
        return false;
      } else if (this.formSearch.from_cat_id == this.formSearch.to_cat_id) {
        this.$Message.error('请选择两个不同渠道');
        return false;
      } else if (this.store_ids.length === 0 && !this.isCheckAll) {
        this.$Message.error('请选择转移的店铺');
        return false;
      }
      this.spinShow = true;
      this.$ajax.post(this.$api.channelShift, {
        from_id: this.formSearch.from_cat_id,
        target_id: this.formSearch.to_cat_id,
        store_ids: this.store_ids,
        isCheckAll: this.isCheckAll ? 1 : 0
      })
    		.then((response) => {
    			var res = response.data;
    			if (res.code) {
            // 初始化数据
            this.$Message.success(res.message);

            // 把数据返回给父级
            this.$emit('on-success');
            this.spinShow = false;
            this.reset();
            this.initData();
    			}
        });
    }
  },
  mounted () {
    this.specTableHeight = document.body.clientHeight - 400;
    this.formSearch.from_cat_id = JSON.parse(this.agent).id;
    this.loadExtraData();
    this.initData();
  }
}
</script>

<style lang="less">
.area-allocation{
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
