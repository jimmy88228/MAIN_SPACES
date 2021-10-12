<template>
  <div class="assets-list">
    <Card>
      <Row>
        <Col span="18">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="6" class="btn-group">
          <Button type="primary" icon="md-add" @click="createActivity" v-if="canCreate.add">创建活动</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="name">
          <div class="img_list_wrap">
            <div>
              <p class="name">活动名称: {{row.name}}</p>
              <p class="name">显示内容: {{row.enable_str}}</p>
            </div>
          </div>
        </template>
        <template slot-scope="{ row }" slot="begin_time">
          <p>{{row.begin_time | initDate}}</p>
          <p>{{row.begin_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="end_time">
          <p>{{row.end_time | initDate}}</p>
          <p>{{row.end_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.status" @click="editStatus(row)"><a>停止</a></span>
          <Divider type="vertical" v-show="row.handle.status && row.handle.edit"/>
          <span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除资产吗？')"><a>删除</a></span>
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
      canCreate: {},
      condition: {
        searchq: '',
        status: '0',
        start_time: '',
        end_time: ''
      }
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.popupAdvertRemindList, params)
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
    openModal (row) {
      this.$refs.brandForm.setData(row).show();
    },
    editBrand (index, row) {
      this.openModal(row);
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.popupAdvertRemindRemove, {
        id: row.id
      });
    },
    createActivity() {
      this.$router.push({
        name: 'popup-assets-add'
      })
    },
    editItem(row) {
      this.$router.push({
        name: 'popup-assets-edit',
        params: {
          id: row.id
        }
      })
    },
    editStatus(row) {
      this.spinShow = true;
      return this.$ajax.post(this.$api.popupAdvertRemindStatus, {
        id: row.id
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.loadData();
        }
        this.spinShow = false;
      });
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.assets-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>

