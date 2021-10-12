<template>
  <div class="register-list">
    <Card>
      <div class="note">
        <span>注册返利：被邀请人注册后获得的返利。</span>
      </div>
      <div class="btn-group">
        <Button type="primary" icon="md-add" @click="openModal" v-if="canCreate.add">添加规则</Button>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="start_time">
          <p>{{row.start_time | initDate}}</p>
          <p>{{row.start_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="end_time">
          <p>{{row.end_time | initDate}}</p>
          <p>{{row.end_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="is_enabled">
          <Tag type="dot" :color="Number(row.is_enabled) ? 'success' : 'error'">{{Number(row.is_enabled)  ? '开启' : '关闭'}}</Tag>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(index, row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除该注册返利吗？')"><a>删除</a></span>
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
    <register-form ref="registerForm" @on-success="onLoadData"/>
  </div>
</template>
<script>
import RegisterForm from './register-form';
import PageHelper from '@/libs/page-helper.js';
import Mixin from './mixin';

export default {
  data () {
    return {
      canCreate: {}
    }
  },
  mixins: [Mixin, PageHelper],
  components: {
    RegisterForm
  },
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data);
      return this.$ajax.post(this.$api.registerRebateList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    openModal (row) {
      this.$refs.registerForm.setData(row).show();
    },
    editItem (index, row) {
      console.log('row',row);
      this.openModal(row);
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.registerRebateRemove, {
        id: row.id
      });
    }
  }
}
</script>

<style lang="less">
.register-list{
  .coupon-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
    margin-bottom: 24px;
  }
}
</style>
