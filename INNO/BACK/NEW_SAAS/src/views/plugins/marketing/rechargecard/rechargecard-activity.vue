<template>
  <div class="register-activity">
    <Card>
      <div class="btn_group">
        <Button type="primary" icon="md-add" @click="createActivity">新增充值卡</Button>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="name">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.activity_image" v-if="row.activity_image" :alt="row.activity_name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.activity_name" v-viewer v-else></img>
            </div>
            <span class="name">{{row.activity_name}}</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="from_time">
          <p>{{row.from_time | initDate}}</p>
          <p>{{row.from_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="to_time">
          <p>{{row.to_time | initDate}}</p>
          <p>{{row.to_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="is_enabled">
          <Tag type="dot" :color="Number(row.is_enabled) === 1 ? 'success' : 'error'">
            {{Number(row.is_enabled) === 1 ? '开启' : '关闭'}}
          </Tag>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
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
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';

export default {
  data () {
    return {
      canCreate: {},
      spinShow: false
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data);
      return this.$ajax.post(this.$api.storeRechargecardList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    createActivity () {
      this.$router.push({
        name: 'store-rechargecard-add'
      })
    },
    editItem (row) {
      this.$router.push({
        name: 'register-activity-edit',
        params: {
         id: row.id
        }
      })
    },
    handleToggle (row) {
      this.spinShow = true;
      return this.$ajax.post(this.$api.registerActivityStatus, {
        id: row.id,
        is_enable: +row.is_enable ? 0 : 1
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
    handleChange (row) {
      return new Promise((resolve, reject) => {
        this.handleToggle(row);
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
.register-activity{
  .btn_group{
    text-align: right;
    margin-bottom: 24px;
  }
}
</style>
