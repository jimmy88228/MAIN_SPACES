<template>
  <div class="record-list">
    <PageTopBase>
      <Row>
        <Col span="12">
          <Form ref="formSearch" :model="condition" inline :label-width="70">
            <FormItem :label-width="0" class="search_wrapper">
              <Input
                v-model="condition.keywords"
                style="width:400px;"
                placeholder="关键词搜索"
                clearable
                search
                enter-button
                @on-search="searchPage"
                @on-clear="searchPage"
                @keydown.native.enter.prevent="searchPage">
                <Select v-model="condition.search_type" slot="prepend" style="width: 100px;">
                  <Option :value="1">用户名</Option>
                  <Option :value="2">手机号</Option>
                  <Option :value="3">会员卡号</Option>
                </Select>
              </Input>
            </FormItem>
            <FormItem label="创建时间" class="date_wrapper">
              <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="createTime">
          <p>{{row.created_at_format | initDate}}</p>
          <p>{{row.created_at_format | initTime}}</p>
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
    </PageTopBase>
  </div>
</template>
<script>
import Mixin from './record-mixin.js';
import PageHelper from '@/libs/page-helper.js';
import DateSelect from '@/views/my-components/date-select/index.vue';
import PageTopBase from '@/views/my-components/page-top-base/index';

export default {
  components: {
    DateSelect,
    PageTopBase
  },
  data () {
    return {
      canCreate: {},
      condition: {
        keywords: '',
        search_type: 1,
        startTime: '',
        endTime: ''
      }
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    handleStart (date) {
      this.condition.startTime = date;
    },
    handleEnd (date) {
      this.condition.endTime = date;
    },
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.goodsBrandList, params)
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
    onDelItem (row) {
      return this.$ajax.post(this.$api.goodsBrandRemove, {
        goods_brand_id: row.goods_brand_id
      });
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less">
.record-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
  .ivu-form-item-content{
    width: 100%;
  }
  .ivu-input-icon{
        right: 50px;
    }
}
</style>
