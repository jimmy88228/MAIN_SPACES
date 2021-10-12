<template>
  <div class="offline-coupon-list">
      <div class="search">
        <Row>
          <Col span="20">
            <Input
              class="basic_input"
              v-model="condition.searchq"
              placeholder="请输入名称/编码"
              clearable
              search
              enter-button
              @on-search="searchPage"
              @on-clear="searchPage"
              @keydown.native.enter.prevent/>
          </Col>
          <Col span="4" class="btn-group">
            <Button type="primary" icon="md-add" @click="openModal({})" v-if="canCreate.add">新增付款方式</Button>
          </Col>
        </Row>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="enable">
          <Tag type="dot" :color="Number(row.is_enabled) ? 'success' : 'error'">{{Number(row.is_enabled)  ? '开启' : '关闭'}}</Tag>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(index, row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除该付款方式吗？')"><a>删除</a></span>
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
    <payment-form ref="paymentForm" @on-success="onLoadData"/>
  </div>
</template>
<script>
import PaymentForm from './payment-form';
import PageHelper from '@/libs/page-helper.js';
import Mixin from './mixin';

export default {
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: ''
      }
    }
  },
  mixins: [Mixin, PageHelper],
  components: {
    PaymentForm
  },
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.paymentList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    searchPage () {
      this.loadData();
    },
    openModal (row) {
      this.$refs.paymentForm.setData(row).show();
    },
    editItem (index, row) {
      this.openModal(row);
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.paymentRemove, {
        id: row.id
      });
    }
  }
}
</script>

<style lang="less">
.offline-coupon-list{
  .search{
    margin-bottom: 24px;
  }
  .coupon-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
  .ivu-input-icon{
    right: 50px;
  }
}
</style>
