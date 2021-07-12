<template>
  <div class="money-coupon-list">
      <div class="search">
        <Row type="flex">
          <Col style="flex:1 1 0%;">
            <Form ref="formValidate" inline>
              <FormItem label="有效期" :label-width="60" class="date-form-item">
                <date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd"/>
              </FormItem>
              <FormItem>
                <Input
                  class="basic_input"
                  v-model="condition.searchq"
                  placeholder="请输入名称/编码"
                  clearable
                  search
                  enter-button
                  @on-search="searchPage"
                  @on-clear="searchPage"
                  @keydown.native.enter.prevent/>
              </FormItem>
            </Form>
          </Col>
          <Col style="width:320px;text-align: right;">
            <div v-if="isValidList">
              <Button type="info" icon="md-add" @click="openModal({})" class="add">新增现金券</Button>
              <Button type="success" @click="handleImport">批量导入现金券</Button>
            </div>
          </Col>
        </Row>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="validDate">
          <span>{{row.from_date}}</span>
          <span>~</span>
          <span>{{row.to_date}}</span>
        </template>
        <template slot-scope="{ row }" slot="modifyDate">
			<div v-if="row.is_used === 'Y'">
				<p>{{row.modify_date | initDate}}</p>
				<p>{{row.modify_date | initTime}}</p>
			</div>
			<div v-else>
				--
			</div>
        </template>
        <template slot-scope="{ row }" slot="isUsed">
          <Tag type="dot" :color="row.is_used === 'Y' ? 'success' : 'error'">{{row.is_used === 'Y'  ? '已使用' : '未使用'}}</Tag>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <template v-if="isValidList">
            <span v-if="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
            <Divider type="vertical"/>
            <span v-if="row.handle.remove" @click="delItem(row, '删除提示', '确定删除该类型吗？', 1)"><a>删除</a></span>
            <Divider type="vertical" v-if="Number(row.order_id)"/>
            <span v-if="Number(row.order_id)" @click="goOrder(row)"><a>查看订单</a></span>
          </template>
          <template v-if="!isValidList">
            <span @click="delItem(row, '还原提示', '确定还原该类型吗？', 2)"><a>还原</a></span>
          </template>
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
    <money-coupon-form ref="discountForm" @on-success="() => {loadData()}"/>
    <BatchImport ref="batchImport" @on-success="onImportSuccess"></BatchImport>
  </div>
</template>
<script>
import DateSelect from '@/views/my-components/date-select/index.vue';
import BatchImport from '@/views/my-components/batch-import/batch-import';
import MoneyCouponForm from './money-coupon-form';
import PageHelper from '@/libs/page-helper.js';
import Mixin from './mixin';

export default {
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        start_time: '',
        end_time: ''
      },
      typeMap: {
        'money-coupon-list': 1,
        'recycle-bin': 2
      }
    }
  },
  computed: {
    isValidList () {
      return this.$route.query.act === 'money-coupon-list';
    }
  },
  mixins: [Mixin, PageHelper],
  components: {
    MoneyCouponForm,
    DateSelect,
    BatchImport
  },
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition, {
        show_type: this.typeMap[this.$route.query.act]
      });
      return this.$ajax.post(this.$api.moneyBonuslist, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    searchPage () {
      this.loadData();
    },
    openModal (row) {
      this.$refs.discountForm.setData(row).show();
    },
    editItem (row) {
      this.openModal(row);
    },
    onDelItem (row, args) {
      return this.$ajax.post(this.$api.moneyBonusRemove, {
        coupon_id: row.coupon_id,
        enable: args[0] //删除还是还原
      });
    },
    goOrder (row) {
      let routeUrl = this.$router.resolve({
        name: 'order-info',
        params: {
          sn: row.order_id
        }
      });
      window.open(routeUrl.href, '_blank');
    },
    handleStart (date) {
      this.condition.start_time = date;
    },
    handleEnd (date) {
      this.condition.end_time = date;
    },
    handleImport () {
      this.$refs.batchImport.openModal(this.canCreate, this.$api.moneyBonusImport, this.$api.moneyBonusDownTemplate);
    },
    onImportSuccess () {
      this.loadData();
    }
  }
}
</script>

<style lang="less">
.money-coupon-list{

  .date-form-item{
    .ivu-form-item-content{
      width: 100%;
    }
  }
  .coupon-list_import{
    margin-right: 10px;
  }
  .btn-group{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .add{
      margin-right: 10px;
    }
  }
  .ivu-input-icon{
    right: 50px;
  }
}
</style>
