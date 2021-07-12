<template>
  <div class="assembly-data-list">
    <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
      <template slot-scope="{ row }" slot="phone">
        <span>{{row.get_members.mobile_phone}}</span>
      </template>
      <template slot-scope="{ row }" slot="card">
        <span>{{row.get_members.card_num}}</span>
      </template>
      <template slot-scope="{ row }" slot="sendTime">
        <p>{{row.created_at | initDate}}</p>
        <p>{{row.created_at | initTime}}</p>
      </template>
      <template slot-scope="{ row }" slot="useTime">
        <p>{{row.get_user_repack_record && row.get_user_repack_record.created_at_fan | initDate}}</p>
        <p>{{row.get_user_repack_record && row.get_user_repack_record.created_at_fan | initTime}}</p>
      </template>
      <template slot-scope="{ row }" slot="handle">
        <span v-show="row.handle && row.handle.remove" @click="delItem(row, '删除提示', '确定删除该数据吗？')"><a>删除</a></span>
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
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import PageHelper from '@/libs/page-helper.js';
import Mixin from './mixin';

export default {
  mixins: [Mixin, PageHelper],
  props: ['id'],
  data () {
    return {
      condition: {
        searchq: '',
        start_time: '',
        end_time: ''
      },
      spinShow: false
    }
  },
  methods: {
    onLoadData (page, data) {
      this.spinShow = true;
      let params = Object.assign({}, data, this.condition, {
        id: this.id,
        is_remove: this.$route.query.act === 'use-list' ? undefined : (this.$route.query.act === 'send-list' ? 0 : 1)
      });
      const api = this.$route.query.act === 'use-list' ? this.$api.usedRedPacketAssembly : this.$api.redPacketAssembly;
      return this.$ajax.post(api, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
        }
        this.spinShow = false;
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    onDelItem(row) {
      return this.$ajax.post(this.$api.redPacketAssemblyRemove, {
        id: row.id
      });
    }
  }
}
</script>
