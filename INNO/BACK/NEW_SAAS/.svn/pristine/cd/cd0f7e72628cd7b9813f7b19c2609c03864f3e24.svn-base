<template>
  <div class="coupon-list">
    <Card>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="handle">
          <div>
            <span v-show="row.handle.edit" @click="handleDeviceEdit(row.machine_id)"><a>修改</a></span>
          </div>
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
 // name: 'deviceList',
    data () {
      return {
        canCreate: {},
        fixedData: {
          number: 0
        },
      }
    },
    mixins: [Mixin, PageHelper],
    methods: {
      onLoadData (page,data) {
        let params = Object.assign({}, data, this.condition);
        return this.$ajax.post(this.$api.devicesList,params)
        .then(response => {
          const res = response.data;
          if (res.code) {
            this.data = res.data;
            this.canCreate = res.data && res.data.canCreate;
          }
        });
      },

      handleDeviceEdit(id){
        this.$router.push({
          name:'device-edit',
          params:{
            id:id
          }
        })
      }
    },
    mounted () {
     this.loadData();
  }
}
</script>

<style lang="less" scoped>
.coupon-list{
  .coupon-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align:right;
  }
}
</style>
