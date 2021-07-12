<template>
  <PageTopBase>
    <div class="brand-list">
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <p>分销员：{{$route.query.name}} 总余额：{{totalAmount}}</p>
          <Poptip placement="left" v-model="showPoptip">
            <Button>余额扣减</Button>
            <div slot="content">
               <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
                  <FormItem label="扣减金额" prop="money">
                    <InputNumber v-model="formItem.money" :min="0" style="float:left;"/>
                  </FormItem>
                  <p class="strong_tips">*注意：只作扣减处理，允许扣减到负数</p>
                  <FormItem label="扣减原因" prop="reason">
                    <Input type="textarea" :rows="3" v-model="formItem.reason"/>
                  </FormItem>
                  <div style="text-align: center;">
                    <Button size="small" @click="onCancel">取消</Button>
                    <Button type="primary" size="small" @click="onSave">确定</Button>
                  </div>
                </Form>
            </div>
        </Poptip>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="name">
          <div class="img_list_wrap">
            <div class="img_fixed">
              <img :src="row.goods_brand_image" v-if="row.goods_brand_image" :alt="row.goods_brand_name" v-viewer/>
              <img src="@rs/images/default-img.jpg" :alt="row.goods_brand_name" v-viewer v-else></img>
            </div>
            <span class="name">{{row.goods_brand_name}}</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="createTime">
          <p>{{row.created_at_format | initDate}}</p>
          <p>{{row.created_at_format | initTime}}</p>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
          <span v-show="row.handle.edit" @click="editBrand(index, row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.edit && row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除商品品牌吗？')"><a>删除</a></span>
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
  </div>
  </PageTopBase>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import PageTopBase from '@/views/my-components/page-top-base/index';

export default {
  props: ['id'],
  components: {
    SearchForm,
    PageTopBase
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        type: 1
      },
      formItem: {
        money: 0,
        reason: ''
      },
      ruleValidate: {
        money: [{
          required: true,
          message: '金额不能为空',
          type: 'number'
        }]
      },
      showPoptip: false,
      totalAmount: 0
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    clearOptions () {
      this.condition = {
        searchq: '',
        type: 1
      };
      this.$refs.search.clearOptions();
    },
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition, {
        dstb_staff_id: this.id
      });
      return this.$ajax.post(this.$api.distributionStaffBalance, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
          this.totalAmount = res.data && res.data.total_amount;
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
      return this.$ajax.post(this.$api.goodsBrandRemove, {
        goods_brand_id: row.goods_brand_id
      });
    },
    handleImport () {
      this.$refs.batchImport.openModal(this.canCreate, this.$api.goodsBrandUpload, this.$api.goodsBrandDownload);
    },
    onImportSuccess () {
      this.loadData();
    },
    onSave () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          return this.$ajax.post(this.$api.distributionStaffBalanceMinus, {
            dstb_staff_id: this.id,
            ...this.formItem
          }).then(_ => {
            this.showPoptip = false;
          });
        }
      })
    },
    onCancel(){
			this.showPoptip = false;
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
