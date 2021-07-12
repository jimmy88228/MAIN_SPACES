<template>
  <div class="brand-list">
    <Card>
      <p style="margin-bottom: 24px;">注：升级规则按照顺序依次从小到大向上升级，排序越大等级越高；关联会员等级后会同步修改，一天仅执行一次升级规则。</p>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot="is_enabled" slot-scope={row}>
          <i-switch size="large" v-model="row.is_enabled" true-value="1" false-value="0" :before-change="handleEnableChange.bind(this, row)">
            <span slot="open">启用</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot="handle" slot-scope={row}>
          <Button type="primary" @click="handleRule(row)">升级规则</Button>
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
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';

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
      return this.$ajax.post(this.$api.distributionRankSettingList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    handleRule (row) {
      this.$router.push({
        name: 'distribution-rank-add',
        params: {
          id: row.id
        }
      })
    },
    toggleChange (row) {
      return this.$ajax.post(this.$api.distributionRankSettingStatus, {
        Upgrade_id: row.Upgrade_id,
		    is_enabled: row.is_enabled == 1 ? 0 : 1
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.loadData();
        }
      });
    },
    handleEnableChange (row) {
      return new Promise((resolve, reject) => {
        this.toggleChange(row);
        reject();
      })
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.brand-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
