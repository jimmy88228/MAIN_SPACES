<template>
  <div class="seckill-group-list">
    <Card>
      <div class="btn-group">
        <Button type="primary" icon="md-add" @click="openModal({})" v-if="canCreate.add">添加分组</Button>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="enable">
          <Tag type="dot" :color="row.enable === '1' ? 'success' : 'error'">{{row.enable === '1'  ? '启用' : '关闭'}}</Tag>
        </template>
        <template slot-scope="{ row }" slot="is_default">
          <i-switch v-model="row.is_default" true-value="1" false-value="0" :before-change="handleChange.bind(this, row)">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="list">
          <List>
              <ListItem v-for="item in row.activity_info" :key="item.id">{{item.name}}</ListItem>
          </List>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(index, row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除该分组吗？')"><a>删除</a></span>
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
    <SeckillGroupForm ref="brandForm" @on-success="onFormSuccess"></SeckillGroupForm>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import Mixin from './mixin.js';
import SeckillGroupForm from './seckill-group-form';
import PageHelper from '@/libs/page-helper.js';

export default {
  components: {
    SeckillGroupForm
  },
  data () {
    return {
      canCreate: {},
      spinShow: false
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      return this.$ajax.post(this.$api.cloudSeckillGroupList, data)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    openModal (row) {
      this.$refs.brandForm.setData(row).show();
    },
    editItem (index, row) {
      this.openModal(row);
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.cloudSeckillGroupRemove, {
        id: row.id
      });
    },
    handleToggle (row) {
      this.spinShow = true;
      return this.$ajax.post(this.$api.cloudSeckillGroupStatus, {
        id: row.id,
        is_default: +row.is_default ? 0 : 1
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
    onFormSuccess () {
      this.loadData();
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.seckill-group-list{
  .btn-group{
    text-align: right;
    margin-bottom: 24px;
  }
}
</style>
