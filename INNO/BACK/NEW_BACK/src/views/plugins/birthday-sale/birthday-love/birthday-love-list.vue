<template>
  <div class="weixin-group-list">
    <Card>
      <div class="btn_group">
        <Button type="primary" icon="md-add" @click="createActicity">创建生日活动</Button>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="is_enable">
          <i-switch v-model="row.is_enable" true-value="1" false-value="0" size="large" :before-change="handleEnableChange.bind(this, row)">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="from_time">
          <p>{{row.from_time | initDate}}</p>
          <p>{{row.from_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="to_time">
          <p>{{row.to_time | initDate}}</p>
          <p>{{row.to_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="add_time">
          <p>{{row.add_time | initDate}}</p>
          <p>{{row.add_time | initTime}}</p>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span v-show="row.handle.send && row.handle.edit" @click="goRecord(row)"><a>发/领券记录</a></span>
          <Divider type="vertical" v-show="row.handle.send && row.handle.edit"/>
          <span v-show="row.handle.edit" @click="editBrand(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit"/>
          <span @click="delItem(row, '删除提示', '确定删除生日活动吗？')"><a>删除</a></span>
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
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';

export default {
  components: {
    SearchForm
  },
  data () {
    return {
      canCreate: {}
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data);
      return this.$ajax.post(this.$api.birthdayActivityList, params)
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
    createActicity () {
      this.$router.push({
        name: 'birthday-activity-add'
      });
    },
    goRecord (row) {
      this.$router.push({
        name: 'birthday-send-list',
        params: {
          id: row.id
        }
      });
    },
    editBrand (row) {
      this.$router.push({
        name: 'birthday-activity-edit',
        params: {
          id: row.id
        }
      });
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.birthdayActivityRemove, {
        id: row.id
      });
    },
    toggleChange (row) {
      return this.$ajax.post(this.$api.birthdayActivityStatus, {
        id: row.id,
		    is_enable: row.is_enable == 1 ? 0 : 1
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
.weixin-group-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn_group{
    text-align: right;
    margin-bottom: 24px;
  }
}
</style>
