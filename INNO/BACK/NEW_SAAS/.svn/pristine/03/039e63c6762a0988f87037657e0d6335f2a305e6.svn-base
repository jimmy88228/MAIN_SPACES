<template>
  <div class="pin-group-list">
    <Card>
      <Row type="flex">
        <Col style="flex:1 1 0%;">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col style="width:270px;text-align: right;">
          <Button type="success" icon="md-add" @click="createActivity" v-if="canCreate.add">创建活动</Button>
		  <Button type="info" @click="handleSet">砍价设置</Button>
		  <Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="name">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.activity_img" v-if="row.activity_img" :alt="row.activity_name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.activity_name" v-viewer v-else />
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
          <Tag type="dot" :color="row.is_enabled === '1' ? 'success' : (row.is_enabled === '0' ? 'error' : 'warning')">{{row.is_enabled === '1'  ? '开启' : (row.is_enabled === '0' ? '关闭' : '过期')}}</Tag>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="handleEdit(row)"><a>编辑</a></span>
          <span v-show="row.handle.data" @click="handleStatistics(row)"><a>数据统计</a></span>
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
    <KanForm ref="kanForm"></KanForm>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import KanForm from './kan-form';

export default {
  components: {
    SearchForm,
    KanForm
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        status: -1,
        start_time: '',
        end_time: ''
      },
      pageData: []
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.bargainActivityList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
          this.pageData = res.data && [res.data.page_data];
        }
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    onDelItem (row) {
      return this.$ajax.post(this.$api.goodsBrandRemove, {
        goods_brand_id: row.goods_brand_id
      });
    },
    createActivity () {
      this.$router.push({
        name: 'kan-activity-add'
      })
    },
    handleStatistics (row) {
      this.$router.push({
        name: 'kan-activity-statistics',
        params: {
          id: row.id
        }
      })
    },
    handleEdit (row) {
      this.$router.push({
        name: 'kan-activity-edit',
        params:{
          id: row.id
        }
      })
    },
    handleSet () {
      var pageData = this.pageData[0] == null ? [{id: '-1', 'name': '暂无选项！'}] : this.pageData;
      this.$refs.kanForm.show().setData(pageData);
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.pin-group-list{
  .btn-group{
    text-align: right;
  }
}
</style>
