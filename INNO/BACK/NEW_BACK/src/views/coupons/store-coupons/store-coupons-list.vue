<template>
  <div class="store-coupons-list">
    <Card>
      <div class="btn-group">
        <Button type="primary" icon="md-add" v-if="canCreate.add" @click="createCoupon">新增店铺消费送券</Button>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="timeRange">
          <div>
            <span>{{row.from_time}}</span>
            <span>~</span>
            <span>{{row.to_time}}</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="storeName">
          <p v-for="item in row.store_name" :key="item">
            {{item}}
          </p>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除该活动吗？')"><a>删除</a></span>
          <Divider type="vertical" v-show="row.handle.distribution"/>
          <span v-show="row.handle.distribution" @click="goAssembly(row)"><a>发放流水</a></span>
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
  </div>
</template>
<script>
import PageHelper from '@/libs/page-helper.js';
import Mixin from './mixin';

export default {
  data () {
    return {
      canCreate: {}
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data);
      return this.$ajax.post(this.$api.CouponsMarketList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.CouponsMarketRemove, {
        id: row.id
      });
    },
    createCoupon () {
      this.$router.push({
        name: 'store-coupons-add'
      });
    },
    editItem (row) {
      this.$router.push({
        name: 'store-coupons-edit',
        params: {
          id: row.id
        }
      });
    },
    goAssembly (row) {
      this.$router.push({
        name: 'store-assembly-list',
        params: {
          id: row.id
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
.store-coupons-list{
  .coupon-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
    margin-bottom: 24px;
  }
}
</style>
