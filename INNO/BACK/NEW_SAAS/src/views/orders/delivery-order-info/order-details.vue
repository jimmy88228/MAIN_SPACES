<template>
  <div class="order_details">
    <Form ref="form" :label-width="72" label-colon>
      <Row>
        <Col span="8" class="order_details_item">
          <span class="title">收货人信息</span>
          <FormItem label="收货人"><p>{{orderAddress.consignee}}</p></FormItem>
          <FormItem label="手机"><p>{{orderAddress.mobile}}</p></FormItem>
          <FormItem label="收货地址"><p>{{orderAddress.district}}</p></FormItem>
          <FormItem label="详细地址"><p>{{orderAddress.address}}</p></FormItem>
        </Col>
        <Col span="8" class="order_details_item">
          <span class="title">配送信息</span>
          <FormItem label="配送方式"><p>{{orderAddress.delivery_way}}</p></FormItem>
          <FormItem label="发货单号"><p>{{orderAddress.delivery_sn || '未发货'}}</p></FormItem>
          <FormItem label="发货时间"><p>{{orderAddress.deliver_sn_time || '未发货'}}</p></FormItem>
          <FormItem label="发货门店"><p>{{ordreMessage.store_name || '--'}}</p></FormItem>
          <FormItem label="快递公司">
            <p>
              <Select v-model="shippingId" class="basic_select" v-show="editLogistics">
                <Option :value="0">请选择</Option>
                <Option v-for="item in shippingList" :value="item.shipping_id" :key="item.shipping_id">{{ item.shipping_name }}</Option>
              </Select>
              <span v-show="!editLogistics">{{orderAddress.shipping_name}}</span>
            </p>
          </FormItem>
          <FormItem label="物流单号">
            <span v-show="!editLogistics">{{orderAddress.invoice_no || '未填写'}}</span>
            <a v-show="!editLogistics" @click="editLogistics = true">编辑</a>
            <div class="edit_logi" v-show="editLogistics">
              <Input type="textarea" placeholder="请输入物流单号,多个物流单号用“#”隔开" v-model="invoiceNo" class="input"/>
              <div class="btn_group">
                <a @click="cancelEdit" class="handle">取消</a>
                <a @click="confirmEdit" class="handle">保存</a>
              </div>
            </div>
            <p>（多个物流单号用“#”隔开）</p>
          </FormItem>
        </Col>
        <Col span="8" class="order_details_item">
          <span class="title">买家信息</span>
          <FormItem label="会员卡号"><p>{{ordreMessage.user_name ? ordreMessage.user_name : '匿名用户'}}</p></FormItem>
          <FormItem label="姓名" v-if="orderAddress.idetntiy_name"><p>{{orderAddress.idetntiy_name}}</p></FormItem>
          <FormItem label="身份证" v-if="!!orderAddress.hasCross"><p>{{orderAddress.identity_no}}</p></FormItem>
        </Col>
      </Row>
    </Form>
    <!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>

export default {
  props: {
    orderAddress: {
      type: Object,
      required: true
    },
    ordreMessage: {
      type: Object,
      required: true
    },
    sn: {
      required: true
    }
  },
  data() {
    return {
      spinShow: false,
      shippingList: [],
      shippingId: 0,
      shippingName: '',
      editLogistics: false,
      invoiceNo: '',
      showSelectShipping: false
    }
  },
  methods: {
    // 快递公司
    loadshippingList () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.shippingSimpleList, {
        delivery_id: this.sn
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.shippingList = res.data;
        }
        this.spinShow = false;
      })
    },
    cancelEdit() {
      this.editLogistics = false;
    },
    // 物流单号编辑
    confirmEdit() {
      if (!this.invoiceNo) {
        this.$Message.error('请填写物流单号');
        return false;
      } else if (!this.shippingId) {
        this.$Message.error('请填写快递公司');
        return false;
      }
      this.shippingList.forEach(item => {
        if (item.shipping_id === this.shippingId) {
          this.shippingName = item.shipping_name;
        }
      });
      this.spinShow = true;
      return this.$ajax.post(this.$api.changeDelivery, {
        delivery_id: this.sn,
        invoice_no: this.invoiceNo,
        shipping_id: this.shippingId,
        shipping_name: this.shippingName
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.orderAddress.invoice_no = this.invoiceNo;
          this.orderAddress.shipping_name = this.shippingName;
          this.$Message.success(res.message);
          this.$emit('reload');
        } else {
          this.$Message.error(res.message);
        }
        this.spinShow = false;
        this.editLogistics = false;
      })
    },
  },
  mounted () {
    this.loadshippingList();
  },
  watch: {
    orderAddress: {
      handler(nV) {
        this.invoiceNo = nV && nV.invoice_no;
      },
      immediate: true
    },
    ordreMessage: {
      handler(nV) {
        this.shippingId = nV && Number(nV.shipping_id);
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.order_details{
  margin: 10px 0;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  .order_details_item{
    .title{
      display: inline-block;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
  }
  .basic_input, .basic_textarea{
    width: 260px;
  }
  .logistics_edit{
    white-space: normal;
    word-break: break-all;
  }
  .edit_logi{
    display: flex;
    margin-top: 10px;
    .btn_group{
      display: flex;
      align-items: center;
      .handle{
        display: inline-block;
        width: 40px;
        text-align: center;
      }
    }
  }
}
.user_details, .store_details{
  white-space: normal;
  word-break: break-all;
  .title{
    text-align: center;
    font-weight: 600;
  }
}
</style>
<style lang="less">
.order_details{
  .ivu-form-item{
    margin-bottom: 4px;
  }
  .form_name{
    .ivu-form-item-label{
      padding: 10px 18px 10px 0;
    }
  }
  .baisc_select{
    width: 80px;
  }
}
</style>
