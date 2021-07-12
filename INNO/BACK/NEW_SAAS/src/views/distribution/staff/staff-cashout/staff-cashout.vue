<template>
  <div class="brand-list">
    <Card>
      <Row>
        <Col span="20">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="4" class="btn-group">
          <Button type="primary" @click="handleExport">导出</Button>
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
        <template slot-scope="{ row }" slot="transfer_time">
          <p>{{row.transfer_time | initDate}}</p>
          <p>{{row.transfer_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="create_time">
          <p>{{row.create_time | initDate}}</p>
          <p>{{row.create_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="confirm_time">
          <p>{{row.confirm_time | initDate}}</p>
          <p>{{row.confirm_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span @click="editBrand(row)" v-show="row.handle.view"><a>查看</a></span>
          <Divider type="vertical" v-show="row.handle.transfer && row.handle.view"/>
          <span @click="openModal(row)" v-show="row.handle.transfer"><a>转账</a></span>
          <!-- <span @click="openModal(row)"><a>转账</a></span> -->
          <Divider type="vertical" v-show="row.handle.check"/>
          <span @click="handleShen(row, 1)" v-show="row.handle.check"><a>审核</a></span>
          <Divider type="vertical" v-show="row.handle.audit"/>
          <span @click="handleShen(row, 2)" v-show="row.handle.audit"><a>审核失败</a></span>
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
    <!--异步处理导出excel组件-->
    <div class="col">
      <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
    </div>
    <Modal
        v-model="modal1"
        title="转账"
        @on-ok="handleModal1OK"
        @on-cancel="handleModal1Cancel">
        <Form ref="formSearch" :model="moda1Form">
          <FormItem label="转账方式" prop="payment_type">
            <RadioGroup v-model="moda1Form.payment_type">
              <Radio label="0">微信转账</Radio>
              <Radio label="2">线下转账</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="转账金额" prop="request_amount" v-show="moda1Form.payment_type == 2">
            {{moda1Form.request_amount}}
          </FormItem>
          <FormItem label="转账备注" prop="confirm_remark" v-show="moda1Form.payment_type == 2">
            <Input type="textarea" :rows="3" v-model="moda1Form.confirm_remark"/>
          </FormItem>
        </Form>
    </Modal>
    <Modal
        v-model="modal2"
        title="提现审核"
        @on-ok="handleModal2OK"
        @on-cancel="handleModal2Cancel">
        <Form ref="formSearch" :model="moda2Form">
          <FormItem label="提现状态" prop="status_str">
            {{moda2Form.status_str}}
          </FormItem>
          <FormItem label="审核状态" prop="status">
            <Select v-model="moda2Form.status" style="width: 200px;">
              <Option :value="1" v-if="this.currentType === 1">审核通过</Option>
              <Option :value="2">审核失败</Option>
            </Select>
          </FormItem>
          <FormItem label="审核备注" prop="confirm_remark">
            <Input type="textarea" :rows="3" v-model="moda2Form.confirm_remark"/>
          </FormItem>
        </Form>
    </Modal>
    <Modal
        v-model="modal3"
        title="提现审核"
        footer-hide>
        <Form ref="formSearch" :model="moda3Form">
          <FormItem label="提现状态" prop="status_str">
            {{moda3Form.status_str}}
          </FormItem>
          <FormItem label="审核备注" prop="confirm_remark">
            <Input type="textarea" :rows="3" v-model="moda3Form.confirm_remark"/>
          </FormItem>
          <FormItem label="备注" prop="remark">
            {{moda3Form.remark}}
          </FormItem>
        </Form>
    </Modal>
    <BrandForm ref="brandForm" @on-success="onFormSuccess"></BrandForm>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import BrandForm from './brand-form';

export default {
  components: {
    SearchForm,
    notice,
    BrandForm
  },
  data () {
    return {
      canCreate: {},
      condition: {
        start_time: '',  //开始时间
        end_time: '',//结束时间
        searchq: '',  //搜索值
        dateType: '1', //时间 1 申请时间 2 审核时间 3  转款时间
        status: '-1',  //审核状态 -1 全部 0 申请中 1 审核通过 2 审核失败 4 已转账 6 转账失败
        searchq_type: 'dstb_staff_name'   //搜索类型dstb_staff_name分销员名称 real_name 昵称 dstb_staff_phone 电话
      },
      moda1Form: {
        id: 0,
        payment_type: '1',
        request_amount: 0,
        confirm_remark: ''
      },
      moda2Form: {
        id: 0,
        status_str: '',
        status: '1',
        confirm_remark: ''
      },
      moda3Form: {
        status_str: '',
        confirm_remark: '',
        remark: ''
      },
      jobIdCol: [],
      modal1: false,
      modal2: false,
      modal3: false,
      currentType: 1
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    openModal (row) {
      this.$refs.brandForm.setData(row).show();
    },
    clearOptions () {
      this.condition = {
        searchq: '',
        type: 1
      };
      this.$refs.search.clearOptions();
    },
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.staffCashoutList, params)
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
    editBrand ({status_str, confirm_remark, remark}) {
      this.moda3Form = {
        status_str,
        confirm_remark,
        remark
      }
      this.modal3 = true;
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
    handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.$ajax.post(this.$api.staffCashoutListExport, {
            ...this.condition
          }).then((response) => {
							var res = response.data;
							if (res.code) {
								var jobId = res.data;
								// 打开异步提示组件
								this.jobIdCol.push(jobId);
								this.$nextTick(() => {
									this.$refs[`notice${jobId}`][0].showNotice(jobId);
								});
								this.$Message.success(res.message);
							} else {
								this.$Message.error(res.message);
							}
					});
				}
			});
    },
    handleFinish () {
      this.loadData();
    },
    handleChange ({payment_type, request_amount, confirm_remark, id}) {
      this.moda1Form = {
        id,
        payment_type,
        request_amount,
        confirm_remark
      }
      this.modal1 = true;
    },
    handleShen ({status_str, confirm_remark, id}, type) {
      this.moda2Form = {
        id,
        status_str,
        status: '-1',
        confirm_remark
      };
      this.currentType = type;
      this.modal2 = true;
    },
    handleModal1OK () {
      this.modal1 = false;
    },
    handleModal1Cancel () {
      this.modal1 = false;
    },
    handleModal2OK () {
      const url = this.currentType === 1 ? this.$api.staffCashoutCheck : this.$api.staffCashoutAudit;
      return this.$ajax.post(url, {
        status: this.moda2Form.status,
        remark: this.moda2Form.confirm_remark,
        cashout_id: this.moda2Form.id
      })
      .then(_ => {
        this.$Message.success('修改成功!')
        this.modal2 = false;
      })
    },
    handleModal2Cancel () {
      this.modal2 = false;
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


