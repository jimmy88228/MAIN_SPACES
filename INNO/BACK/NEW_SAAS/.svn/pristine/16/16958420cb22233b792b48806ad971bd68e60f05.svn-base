<template>
  <div class="customer-service">
    <PageTopBase isSave @save="confirm">
      <Row>
        <Col span="11">
          <Card class="card_wrapper">
            <titleBar>基本信息</titleBar>
            <Form ref="formItem" :model="formItem" :label-width="120">
              <FormItem label="用户搜索">
                <Input
                  v-model="formItem.keywords"
                  class="basic_select"
                  placeholder="手机号或卡号"
                  clearable
                  search
                  enter-button
                  @on-search="searchPage"
                  @on-clear="searchPage"
                  @keydown.native.enter.prevent="searchPage"/>
              </FormItem>
              <FormItem label="用户信息">
                <div>
                  <p>昵称：{{formItem.name}}</p>
                  <p>卡号：{{formItem.cardNum}}</p>
                  <p>手机：{{formItem.mobile}}</p>
                </div>
              </FormItem>
              <FormItem label="截止付款时间">
                <DatePicker type="datetime" :options="options" placeholder="请输入截止付款时间" v-model="formItem.endTime"></DatePicker>
              </FormItem>
              <FormItem label="支付方式">
                <Radio v-model="formItem.isChecked">微信支付</Radio>
              </FormItem>
              <FormItem label="所属分销员">
                <staff-select :data="staffData" type="radio" @del-tag="handleTag">
                  <Button type="dashed" @click="handleSelect" class="basic_select">选择分销员</Button>
                </staff-select>
              </FormItem>
            </Form>
          </Card>
        </Col>
        <Col span="11" offset="2">
          <Card class="card_wrapper">
            <titleBar>收货人信息</titleBar>
            <Form ref="formConsignee" :model="formConsignee" :rules="ruleValidate" :label-width="120">
              <FormItem label="收货人" prop="consignee">
                <Input
                  v-model="formConsignee.consignee"
                  class="basic_select"
                  placeholder="请输入收货人"
                  :disabled="readonly"/>
              </FormItem>
              <FormItem label="区域" prop="areaId">
                <Cascader
                    class="basic_input"
                    v-model="formConsignee.area"
                    :data="areaList"
                    :clearable="isClear"
                    :style="areaStyle"
                    :disabled="readonly"
                    ref="areaRef"
                    filterable
                    change-on-select
                    transfer
                    :render-format="formatArea"
                    @on-change="selectArea"></Cascader>
              </FormItem>
              <FormItem label="地址" prop="address">
                <Input
                  v-model="formConsignee.address"
                  class="basic_select"
                  placeholder="请输入详细地址"
                  :disabled="readonly"/>
              </FormItem>
              <FormItem label="手机" prop="mobile">
                <Input
                  v-model="formConsignee.mobile"
                  class="basic_select"
                  placeholder="请输入正确手机号"
                  :disabled="readonly"/>
              </FormItem>
              <FormItem label="备注">
                <Input
                  v-model="formConsignee.note"
                  type="textarea"
                  :row="3"
                  class="basic_select"
                  placeholder="请输入备注"/>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="handleAction">{{canEdit ? '编辑' : '保存'}}</Button>
              </FormItem>
            </Form>
          </Card>
        </Col>
      </Row>
      <Card class="card_product">
        <titleBar>商品信息</titleBar>
        <div class="select_goods_wrapper">
          <Button type="dashed" @click="handleGoodsSelect" class="basic_select">选择商品</Button>
        </div>
        <Table
          :columns="columns"
          :data="tableData">
          <template slot-scope="{ row }" slot="name">
            <div class="img_list_wrap">
              <div class="img_fixed">
                <img :src="row.goods_thumb2" v-if="row.goods_thumb2" :alt="row.goods_thumb2" v-viewer/>
                <img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else />
              </div>
              <div class="sort_wrapper">
                <p>{{row.goods_name}}</p>
                <p>{{row.goods_sn}}</p>
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="color">
            <span>{{row.get_products[0].color_name}}</span>
          </template>
          <template slot-scope="{ row }" slot="size">
            <span>{{row.get_products[0].size_name}}</span>
          </template>
          <template slot-scope="{ row }" slot="market">
            <span>{{row.get_products[0].market_price}}</span>
          </template>
          <template slot-scope="{ row }" slot="sale">
            <span>{{row.get_products[0].sale_price}}</span>
          </template>
          <template slot-scope="{ row, index }" slot="handle">
            <span @click="editGoods(row, index)"><a>编辑</a></span>
            <span @click="goodsClear(row)"><a>删除</a></span>
          </template>
      </Table>
      </Card>
      <Card class="card_info">
        <titleBar>费用信息</titleBar>
        <Form ref="formConsume" :model="formConsume" :label-width="120">
          <FormItem label="商品总金额">
            <p>{{formConsume.totalAmount}}元</p>
          </FormItem>
          <FormItem label="物流信息">
            <p>{{formConsume.logistics}}</p>
          </FormItem>
          <FormItem label="+运费">
            <Input
              v-model="formConsume.fare"
              type="number"
              class="basic_input"
              placeholder="请输入运费"/>
            <label>元</label>
          </FormItem>
          <FormItem label="订单总金额">
            <p>{{formConsume.orderAmount}}元</p>
          </FormItem>
          <FormItem label="使用优惠券">
            <Select v-model="formConsume.coupon" class="basic_select">
              <Option value="0"></Option>
            </Select>
            <span>获取可用优惠券（仅显示账户的有效优惠券）</span>
          </FormItem>
          <FormItem label="积分抵扣">
            <Input
              v-model="formConsume.intergal"
              type="number"
              class="basic_input"
              placeholder="请输入积分抵扣"/>
            <span>用户积分:{{formConsume.hasIntergal}}</span>
            <span>当前可用积分:{{formConsume.canUseIntergal}}</span>
          </FormItem>
          <FormItem label="使用余额">
            <Input
              v-model="formConsume.money"
              type="number"
              class="basic_input"
              placeholder="请输入使用余额"/>
              <span>账户余额:{{formConsume.userAmount}}</span>
              <span>当前可用余额:{{formConsume.userUseAmount}}</span>
          </FormItem>
          <FormItem label="实收金额">
            <p>{{formConsume.realMoney}}元</p>
          </FormItem>
        </Form>
      </Card>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </PageTopBase>
    <Modal
        v-model="showEdit"
        title="编辑商品"
        :mask-closable="isClose"
        @on-ok="confirmEdit">
        <div style="text-align: center;margin-bottom: 10px;">
          <label>数量:</label>
          <InputNumber  v-model="goodsNumber"  :max="inventory"  class="basic_input"></InputNumber>
        </div>
        <div style="text-align: center;">
          <label>售价:</label>
          <Input v-model="goodsPrice" type="number" class="basic_input"/>
        </div>
    </Modal>
  </div>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import titleBar from '@/views/my-components/title-bar/title-bar';
import StaffSelect from '@/views/my-components/list-component/index-edit';
import Mixin from './mixin';

export default {
  mixins: [Mixin],
  components: {
    titleBar,
    PageTopBase,
    StaffSelect
  },
  data () {
    const checkPhone = function (rule, val, callback) {
      const reg = /^\d{11}$|^\d{5,6}$/;
      if (reg.test(val)) {
        callback();
      } else {
        callback(new Error('请填写正确的电话'));
      }
    }
    return {
      formItem: {
        userId: 0,
        staffId: 0,
        keywords: '',
        name: '--',
        cardNum: '--',
        mobile: '--',
        endTime: '',
        isChecked: true
      },
      formConsignee: {
        consignee: '',
        address: '',
        mobile: '',
        note: '',
        area: [],
        areaId: '0',
        country: 0
      },
      formConsume: {
        totalAmount: 0,
        logistics: '暂无配送快递',
        fare: 0,
        orderAmount: '--',
        coupon: '0',
        intergal: 0,
        money: 0,
        realMoney: '--',
        hasIntergal: '--',
        canUseIntergal: '--',
        userAmount: '--',
        userUseAmount: '--'
      },
      ruleValidate: {
        consignee: [{ required: true, message: '收货人不能为空', trigger: 'blur' }],
        areaId: [{ required: true, message: '区域不能为空', trigger: 'change', type: 'number'}],
        address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
        mobile: [{ required: true, validator: checkPhone, trigger: 'blur' }]
      },
      canEdit: true,
      readonly: true,
      spinShow: false,
      options: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      tableData: [],
      showEdit: false,
      isClose: false,
      goodsNumber: 0,
      inventory: 0,
      goodsPrice: 0,
      areaList: [],
      isClear: false,
      calcWidth: 'auto',
      staffData: [],
      goodsData: [],
      goodsList:[],
    }
  },
  computed: {
    areaStyle () {
      return {
        width: this.calcWidth
      }
    }
  },
  methods: {
    loadData () {
      return this.$ajax.post(this.$api.addresssMessage)
    		.then(response => {
    			const res = response.data;
    			if (res.code) {
            this.areaList = res.data;
          }
        });
    },
    formatArea (labels) {
      this.$nextTick(() => {
        // 获取到文字的宽度+关闭按钮的宽度
        this.calcWidth = this.$refs.areaRef.$el.childNodes[0].childNodes[4].offsetWidth + 14 + 'px';
      });
      return labels.join('/');
    },
    selectArea (value, selectedData) {
      this.formConsignee.areaId = Number(selectedData[selectedData.length - 1].value);
      this.$refs.formConsignee.validateField('areaId');
      this.$nextTick(() => {
        // 获取到文字的宽度+关闭按钮的宽度
        this.calcWidth = this.$refs.areaRef.$el.childNodes[0].childNodes[4].offsetWidth + 14 + 'px';
      });
    },
    searchPage () {
      if (!this.formItem.keywords) {
        this.$Message.error('请填写搜索内容!');
        return false;
      }
      this.spinShow = true;
      return this.$ajax.post(this.$api.orderUsersSearch, {
        seachq: this.formItem.keywords
       })
    		.then(response => {
    			const res = response.data;
    			if (res.code) {
            this.formItem.name = res.data && res.data.real_name;
            this.formItem.cardNum = res.data && res.data.card_num;
            this.formItem.mobile = res.data && res.data.mobile_phone;
            this.formItem.userId = res.data && res.data.user_id;
            const defaultAddress = res.data && res.data.default_address;
            this.formConsignee.consignee = defaultAddress && defaultAddress.consignee;
            this.formConsignee.address = defaultAddress && defaultAddress.address;
            this.formConsignee.mobile = defaultAddress && defaultAddress.mobile;
            this.formConsignee.areaId = defaultAddress && defaultAddress.address_id;
            this.formConsignee.country = defaultAddress && defaultAddress.country;
            const province = defaultAddress && String(defaultAddress.province);
            const city = defaultAddress && String(defaultAddress.city);
            const district = defaultAddress && String(defaultAddress.district);
            this.formConsignee.area = [province, city, district];
          }
          this.spinShow = false;
        });
    },
    handleAction () {
      if (this.canEdit) {
        this.readonly = false;
        this.canEdit = false;
      } else {
        this.$refs.formConsignee.validate(valid => {
          if (valid) {
            this.spinShow = true;
            return this.$ajax.post(this.$api.orderConsigneeSave, {
              user_id: this.formItem.userId,
              address_id: this.formConsignee.areaId,
              country: this.formConsignee.country,
              consignee: this.formConsignee.consignee,
              province: this.formConsignee.area[0],
              city: this.formConsignee.area[1],
              district: this.formConsignee.area[2],
              mobile: this.formConsignee.mobile,
              address: this.formConsignee.address
            }).then(response => {
              const res = response.data;
              if (res.code) {
                this.$Message.success(res.message);
              }
              this.spinShow = false;
            })
          }
        })
      }
    },
    handleGoodsSelect () {
      this.$selectContent({
        mode: 'goods',
        
        type: 'checkbox',
        data: this.goodsData,
        getList: (data) => {
          this.formConsume.totalAmount=0;
          if(data){
            for(var i=0;i<data.length;i++){
              if(data[i].goods_number>0){
                data[i].goods_number=1;
                this.formConsume.totalAmount=this.formConsume.totalAmount+Number(data[i].get_products[0].sale_price);
                //获取基本信息
                var goodsArr={
                  goods_id:data[i].goods_id,
                  product_id:data[i].product_id,
                  market_price:data[i].get_products[0].market_price,
                  sale_price:data[i].get_products[0].sale_price,
                  exchange_point:0,
                  number:data[i].goods_number,
                };
                  this.goodsList.push(goodsArr);
              }
            }
            this.getOrderCheckout();
          }
          this.goodsData = data;
          this.tableData = data;
        }
      })
    },
    getOrderCheckout(){
      if(this.formItem.userId<1 || this.goodsList.length<1){
        return;
      }
      return this.$ajax.post(this.$api.orderCheckout, {
          user_id: this.formItem.userId,
          bonus_id: 0,
          erp_point: 0,
          use_point: 0,
          use_balance: 0,
          shipping_fee: 0,
          is_self_order_enable:0,
          dstb_staff_code:'',
          goods_list: this.goodsList,
        }).then(response => {
          const res = response.data;
          if (res.code) {
           console.log("orderCheckout",res.data);
          }  
        })
    },
    editGoods (row, index) {
      this.showEdit = true;
      this.goodsNumber = row.goods_number;
      this.inventory = row.inventory;
      this.goodsPrice = row.get_products[0].sale_price;
      this.editIndex = index;
    },
    goodsClear (row) {
      const index = this.tableData.findIndex(item => item.goods_id == row.goods_id);
      this.tableData.splice(index, 1);
      this.goodsData = JSON.parse(JSON.stringify(this.tableData));
    },
    confirmEdit () {
      //减去原价格
      this.formConsume.totalAmount=this.formConsume.totalAmount-Number(this.tableData[this.editIndex].get_products[0].sale_price);
      //加上新价格
      this.formConsume.totalAmount=this.formConsume.totalAmount+Number(this.goodsPrice);
      this.tableData[this.editIndex].goods_number = this.goodsNumber;
      this.tableData[this.editIndex].get_products[0].sale_price = this.goodsPrice;
    },
    handleSelect () {
      this.$selectContent({
        mode: 'staff',
        type: 'radio',
        data: this.staffData,
        getList: (data) => {
          this.staffData = data;
          this.formItem.staffId = data[0].id;
        }
      })
    },
    handleTag (data) {
      this.staffData = data;
      this.formItem.staffId = 0;
    },
    confirm () {
      const now = Date.now();
      if (this.formItem.name === '--' || this.formItem.mobile === '--' || this.formItem.cardNum === '--') {
        this.$Message.error('请获取用户信息!');
        return false;
      }
      if (this.formItem.endTime.valueOf() < now) {
        this.$Message.error('截止付款时间不能小于当前时间!');
        return false;
      }
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less">
.customer-service{
  .card_wrapper{
    height: 440px;
  }
  .address_wrapper{
    margin-bottom: 10px;
  }
  .card_product{
    margin-top: 20px;
    .select_goods_wrapper{
      text-align: right;
      margin-bottom: 10px;
    }
  }
  .card_info{
    margin-top: 20px;
  }
  .ivu-form-item:last-child{
    margin-bottom: 0;
  }
  .ivu-input-icon{
    right: 50px;
  }
}
</style>
