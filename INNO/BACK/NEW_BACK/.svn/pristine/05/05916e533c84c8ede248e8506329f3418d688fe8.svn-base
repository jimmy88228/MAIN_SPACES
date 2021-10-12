<template>
    <div class="brand-list">
      <Card>
        <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary" icon="md-add" @click="createActivity">添加活动</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="is_enabled">
          <Tag type="dot" :color="row.is_enabled === '1' ? 'success' : 'error'">{{row.is_enabled === '1'  ? '开启' : '关闭'}}</Tag>
        </template>
        <template slot-scope="{ row }" slot="list">
          <List>
              <ListItem v-for="item in row.activity_info" :key="item.id">{{item.name}}</ListItem>
          </List>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="handleView(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.send"/>
          <span v-show="row.handle.send" @click="goPai(row)"><a>派券</a></span>
          <Divider type="vertical"/>
          <span @click="handleWater(row)"><a>查看流水</a></span>
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
import PageTopBase from '@/views/my-components/page-top-base/index';

export default {
  components: {
    SearchForm,
    PageTopBase
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: ''
      }
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.distributionCouponsActivityList, params)
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
        name: 'distribution-coupons-form'
      })
    },
    handleView (row) {
      this.$router.push({
          name: 'distribution-coupons-edit',
          params: {
            id: row.id
          }
        })
    },
    handleWater (row) {
      this.$router.push({
          name: 'pai-water-form',
          params: {
            id: row.id
          }
        })
    },
    goPai (row) {
      this.$router.push({
        name: 'pai-coupons-form',
        params: {
          id: row.id
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
.brand-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
