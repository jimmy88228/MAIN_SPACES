<template>
  <div class="register-activity">
    <Card>
      <div class="btn_group">
        <Button type="primary" icon="md-add" v-if="canCreate.add" @click="createActivity">添加活动</Button>
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
        <template slot-scope="{ row }" slot="is_enable">
          <i-switch v-model="row.is_enable" size="large" true-value="1" false-value="0" :before-change="handleChange.bind(this, row)">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.qrcode"/>
          <span v-show="row.handle.qrcode" @click="goQrcode(row)"><a>活动二维码</a></span>
          <Divider type="vertical" v-show="row.handle.qrcode && row.handle.record"/>
          <span v-show="row.handle.record" @click="goRecord(row)"><a>活动记录</a></span>
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
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.registerActivityList, params)
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
        name: 'register-activity-add'
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
    },
    goRecord (row) {
      this.$router.push({
        name: 'register-activity-record',
        params: {
          id: row.id
        }
      })
    },
    goQrcode (row) {
      this.$router.push({
        name: 'register-activity-qrcode',
        params: {
          id: row.id
        }
      })
    },
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
