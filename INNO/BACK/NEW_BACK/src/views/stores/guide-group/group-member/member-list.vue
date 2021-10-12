<template>
  <div class="member-list">
    <PageTopBase>
      <label>当前组名: {{groupName}}</label>
      <SearchForm ref="search" @on-search="searchPage"></SearchForm>
      <Table
        :loading="tableLoading"
        :height="tableHeight"
        :columns="tableColumns"
        :data="tableData"
        ref="myTable"
        @on-selection-change="getSelectGoods"
        @on-select-all="handleSelectAll">
        <template slot-scope="{ row }" slot="staffInfo">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.portrait_path" v-if="row.portrait_path" :alt="row.staff_name"/>
              <img src="@rs/images/default-img.jpg" :alt="row.staff_name" v-else/>
            </div>
            <span class="name">{{row.staff_name}}</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <template v-if="row.handle.status !== 'none'">
            <span v-if="row.handle.status === 'select'"><a @click="handleMember(row.staff_id, 'select')">选择</a></span>
            <span v-else><a @click="handleMember(row.staff_id, 'cancel')">取消</a></span>
          </template>
        </template>
      </Table>
      <div class="handle_wrapper">
        <div style="padding-left: 12px;">
          <Checkbox v-model="isCheckAll" @on-change="handleCheck">当页全选</Checkbox>
          <ButtonGroup>
            <Button @click="handleAllJoin">加入</Button>
            <Button @click="handleAllRemove">移除</Button>
          </ButtonGroup>
        </div>
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
      </div>
      <Spin size="large" fix v-show="spinShow"></Spin>
    </PageTopBase>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import PageTopBase from '@/views/my-components/page-top-base/index';

export default {
  props: ['id'],
  components: {
    SearchForm,
    PageTopBase
  },
  data () {
    return {
      condition: {
        searchq: '',
        type: 1,
        store_id: 0,
        current_group: 0
      },
      groupName: '示例组名',
      isCheckAll: false,
      selectMembers: [],
      spinShow: false
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition, {
        current_group: this.id
      });
      return this.$ajax.post(this.$api.shopSettingAdd, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
          this.groupName = res.data && res.data.group_name;
        }
        // 数据加载重置
        this.reset();
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    handleCheck () {
      this.tableData.forEach((item, index) => {
        if ('_checked' in item && !('_disabled' in item)) {
          item._checked = this.isCheckAll;
        } else if (!('_disabled' in item)) {
          this.$set(this.tableData[index], '_checked', this.isCheckAll);
        }
      });
      this.selectMembers = [...this.tableData].filter(item => item._checked);
    },
    getSelectGoods (selection) {
      this.selectMembers = selection;
      let allLen = this.tableData.length;
      let disabledLen = this.tableData.filter(item => item._disabled).length;
      const allowLen = allLen - disabledLen;
      this.isCheckAll = allowLen > 0 && allowLen === selection.length;
      const hasSelected = this.selectMembers.map(item => item.staff_id);
      this.tableData.forEach((item, index) => {
        if (!('_disabled' in item)) this.$set(this.tableData[index], '_checked', hasSelected.includes(item.staff_id));
      });
    },
    handleSelectAll () {
      this.isCheckAll = true;
    },
    handleMember (staffId, type) {
      this.spinShow = true;
      return this.$ajax.post(this.$api.shopSettingAddselect, {
        group_id: this.id,
        staff_id: staffId,
        val: type === 'select' ? 1 : 2
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.loadData();
        }
        this.spinShow = false;
      });
    },
    handleAllJoin () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.shopSettingAddjoin, {
        group_id: this.id,
        staff_id: this.selectMembers.map(item => item.staff_id)
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.loadData();
        }
        this.reset();
      });
    },
    handleAllRemove () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.shopSettingAddremove, {
        group_id: this.id,
        staff_id: this.selectMembers.map(item => item.staff_id)
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.loadData();
        }
        this.reset();
      });
    },
    reset () {
      this.selectMembers = [];
      this.spinShow = false;
      this.isCheckAll = false;
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.member-list{
  .member-list_import{
    margin-right: 10px;
  }
  .handle_wrapper{
    margin: 10px 10px 0 10px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
}
</style>
