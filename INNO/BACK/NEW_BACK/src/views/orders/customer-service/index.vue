<template>
  <div class="customer-service">
    <PageTopBase isSave @save="confirm">
      <Row class="basic-info-area">
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
							<FormItem label="自下单提成" v-if="formItem.dstb_staff_id > 0">
							  <i-switch v-model="formItem.is_self_order_enable" :trueValue="1" :falseValue="0" size="large">
							  	<span slot="open">是</span>
							  	<span slot="close">否</span>
							  </i-switch>
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
                  v-model="formConsume.postscript"
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
          <Button type="primary" ghost  @click="handleGoodsSelect" class="basic_select">选择商品</Button>
        </div>
        <Table
          :columns="columns"
          :data="productData">
          <template slot-scope="{ row }" slot="name">
            <div class="img_list_wrap">
              <div class="img_fixed">
                <img :src="row.goods_img" v-if="row.goods_img" :alt="row.goods_img" v-viewer/>
                <img src="@rs/images/default-img.jpg" :alt="row.goods_name" v-viewer v-else />
              </div>
              <div class="sort_wrapper">
                <p>{{row.goods_name}}</p>
                <p>{{row.goods_sn}}</p>
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="color">
            <span>{{row.color_name}}</span>
          </template>
          <template slot-scope="{ row }" slot="size">
            <span>{{row.size_name}}</span>
          </template>
          <template slot-scope="{ row }" slot="market">
            <span>{{row.market_price}}</span>
          </template>
          <template slot-scope="{ row }" slot="sale">
            <span>{{row.sale_price}}</span>
          </template>
          <template slot-scope="{ row, index }" slot="handle">
						<div class="v-lines">
							<a @click="editGoods(row, index)">编辑</a>
							<span class="v-line" >|</span>
							<Poptip
									confirm
									title="确定删除该商品SKU么？"
									transfer
									@on-ok="goodsClear(row, index)">
									<a>删除</a>
							</Poptip>
							<span class="v-line" >|</span>
						</div>
          </template>
      </Table>
      </Card>
      <Card class="card_info">
        <titleBar>费用信息</titleBar>
        <Form ref="formConsume" :model="formConsume" :label-width="120">
          <FormItem label="商品总金额">
            <p>{{feeInfo.totalGoodsAmount}}元</p>
          </FormItem>
          <FormItem label="物流信息">
            <p>暂无配送快递</p>
          </FormItem>
          <FormItem label="+运费">
            <InputNumber
              v-model="formConsume.shipping_fee"
              type="number"
              class="basic_input"
							style="width:150px"
							@on-blur="getOrderCheckout()"
              placeholder="请输入运费"/>
            <label>元</label>
          </FormItem>
          <FormItem label="订单总金额">
            <p>{{feeInfo.totalPrice}}元</p>
          </FormItem>
          <FormItem label="-使用优惠券">
            <Select v-model="formConsume.bonus_id" class="basic_select" style="width:150px">
              <Option :value="item.bonus_id" v-for="(item, index) in feeInfo.bonus_list" :key="index">{{item.type_name}}</Option>
            </Select>
            <span>获取可用优惠券（仅显示账户的有效优惠券）</span>
          </FormItem>
          <FormItem label="-积分抵扣">
						<div class="flex">
							<div>
								<InputNumber
									v-model="formConsume.use_point"
									:min="0" 
									:max="feeInfo.canUseIntegral"
									type="number"
									style="width:150px"
									class="basic_input"
									@on-change="getOrderCheckout()"
									placeholder="请输入积分抵扣"/>
							</div>
							<div style="padding-left:5px;">
								<p>用户积分: {{formItem.user_point || 0}}</p>
								<p>当前可用积分: {{feeInfo.canUseIntegral || 0}}</p>
								<p v-if="feeInfo.totalIntegral>0">商品已扣积分：{{feeInfo.totalIntegral}}</p>
								<p v-if="feeInfo.exchange_rate>0">积分抵扣比例：{{feeInfo.integralRate}}积分抵扣{{feeInfo.exchange_rate}}元</p>
							</div>
						</div>
					</FormItem>
          <FormItem label="-使用余额">
            <InputNumber
              v-model="formConsume.use_balance"
							:min="0" 
							:max="feeInfo.canUsebalance"
              type="number"
              class="basic_input"
							style="width:150px"
							@on-change="getOrderCheckout()"
              placeholder="请输入使用余额"/>
              <span>账户余额:{{feeInfo.accountBalance}}</span>
              <span>当前可用余额:{{feeInfo.canUsebalance}}元</span>
          </FormItem>
          <FormItem label="实收金额">
            <p>{{feeInfo.totalPrice}}元</p>
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
        <div style="padding-left:50px;margin-bottom: 10px;">
          <label>数量:</label>
          <InputNumber  v-model="editProduct.number"  :max="editProduct.product_number" class="basic_input"></InputNumber>
        </div>
        <div style="padding-left:50px;">
          <label>售价:</label>
          <Input v-model="editProduct.sale_price" type="number" class="basic_input" />
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
        user_point: 0,
        userId: 0,
        dstb_staff_id: 0,
        keywords: '',
        name: '--',
        cardNum: '--',
        mobile: '--',
        endTime: '',
        isChecked: true,
				is_self_order_enable: 0
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
			feeInfo: {
        canUseIntegral:0
      },
      formConsume: {
        bonus_id: 0,
	      erp_point: 0,
				use_point: 0,
	      use_balance: 0,
				shipping_fee: 0,
	      is_self_order_enable:0,
	      dstb_staff_code:'',
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
      // goodsNumber: 0,
      // inventory: 0,
      // goodsPrice: 0,
      areaList: [],
      isClear: false,
      calcWidth: 'auto',
      staffData: [],
      goodsData: [],
      goodsList:[],
			
			
			productData: [],
			editProduct: {
				product_number: 0,
				number: 0,
				sale_price: 0
			}
    }
  },
  computed: {
    areaStyle () {
      return {
        width: this.calcWidth
      }
    },
		productIds(){
			let productIds = {};
			let productData = this.productData || [];
			for(let i = 0; i < productData.length; i++){
				let product_id = productData[i].product_id || 0;
				if(product_id){
						productIds[product_id] = productData[i]
				}
			}
			return productIds;
		},
		
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
						let data = res.data || {};
						const defaultAddress = data.default_address || {};
						const province = String(defaultAddress.province) || "";
						const city = String(defaultAddress.city) || "";
						const district = String(defaultAddress.district) || "";
            this.formItem.name = data.real_name;
            this.formItem.cardNum = data.card_num;
            this.formItem.mobile = data.mobile_phone;
            this.formItem.userId = data.user_id;
						this.formItem.user_point = data.pay_points || 0;
						this.formItem.dstb_staff_id = data.dstb_staff_id || 0;
						this.formItem.dstb_staff_level = data.dstb_staff_level || 0;
            this.formConsignee.consignee = defaultAddress.consignee || "";
            this.formConsignee.address = defaultAddress.address || "";
            this.formConsignee.mobile = defaultAddress.mobile || "";
            this.formConsignee.areaId = defaultAddress.address_id || "";
            this.formConsignee.country = defaultAddress.country || "";
            this.formConsignee.area = [province, city, district];
						this.formConsume.address_id = defaultAddress.address_id || "";
						// if(res.erp_point && res.erp_point.code == 1){
							
						// }
          }
          this.spinShow = false;
					this.getOrderCheckout(false);
					this.getErpPoint();
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
              
            }).finally(()=>{
							this.spinShow = false;
						})
          }
        })
      }
    },
    handleGoodsSelect () {
			this.$selectModule({
				mode: "SKU",
				type: "checkbox",
				data: [],
				getList: (data) => {
					console.log("data", data);
					let selectPro = [];
					for(let i = 0; i < data.length; i++){
						let item = data[i] || {};
						let id = item.id || 0;
						let product = item.product || {};
						if(product.product_number > 0 && !this.productIds[id]){
							selectPro.push({
								id: item.id,
								name: item.name,
								goods_id: item.goods_id,
								exchange_point:0,
								number: 1,
								product_number: parseInt(product.product_number),
								goods_img: item.goods_img,
								goods_name: item.goods_name,
								goods_sn: item.goods_sn,
								product_id: product.product_id,
								color_name: product.color_name,
								size_name: product.size_name,
								market_price: parseFloat(product.market_price),
								sale_price: parseFloat(product.sale_price)
							});
						}
					}
					this.productData = this.productData.concat(selectPro);
					this.getOrderCheckout();
				}
			})
			// return;
   //    this.$selectContent({
   //      mode: 'goods',
        
   //      type: 'checkbox',
   //      data: this.goodsData,
   //      getList: (data) => {
					
   //        this.formConsume.totalAmount=0;
   //        if(data){
   //          for(var i=0;i<data.length;i++){
   //            if(data[i].goods_number>0){
   //              data[i].goods_number=1;
   //              this.formConsume.totalAmount=this.formConsume.totalAmount+Number(data[i].get_products[0].sale_price);
   //              //获取基本信息
   //              var goodsArr={
   //                goods_id:data[i].goods_id,
   //                product_id:data[i].product_id,
   //                market_price:data[i].get_products[0].market_price,
   //                sale_price:data[i].get_products[0].sale_price,
   //                exchange_point:0,
   //                number:data[i].goods_number,
   //              };
   //                this.goodsList.push(goodsArr);
   //            }
   //          }
   //          this.getOrderCheckout();
   //        }
   //        this.goodsData = data;
   //        this.tableData = data;
					
   //      }
   //    })
    },
    getOrderCheckout (checkGoods = true){
			let formItem = this.formItem || {};
			if(formItem.userId < 1){
				this.$Message.error("请选择用户信息");
				return Promise.reject();
			}
			
			if(this.productData.length < 1){
				if(checkGoods){
					this.$Message.error("请选择商品信息");
				}
				return Promise.reject();
			}
			let formConsume = this.formConsume || {};
      return this.$ajax.post(this.$api.orderCheckout, {
          user_id: this.formItem.userId,
          ...formConsume,
          goods_list: this.productData,
        }).then(response => {
          const res = response.data;
          if (res.code) {
					 let data = res.data || {};
					 let bonus_list = data.bonus_list || [];
					 bonus_list.unshift({'bonus_id':0,'type_name':'选择优惠券'});
					 data.bonus_list = bonus_list || [];
					 this.feeInfo = data;
					 this.feeInfo.integralRate = (this.feeInfo.exchange_rate)*100;
					 this.formConsume.use_point = this.feeInfo.integralExchange || 0;
					 this.is_ok = true;
          } else {
						this.is_ok = false;
					}
        })
    },
    editGoods (row, index) {
      this.showEdit = true;
			this.editProduct = JSON.parse(JSON.stringify(row)) || {};
      this.editIndex = index;
    },
    goodsClear (row, index) {
			console.log("index", index)
			this.productData.splice(index, 1);
			this.getOrderCheckout();
    },
    confirmEdit () {
			let editProduct = this.editProduct || {};
			this.$set(this.productData[this.editIndex], "number", editProduct.number);
			this.$set(this.productData[this.editIndex], "sale_price", editProduct.sale_price);
			this.getOrderCheckout();
      // //减去原价格
      // this.formConsume.totalAmount=this.formConsume.totalAmount-Number(this.tableData[this.editIndex].get_products[0].sale_price);
      // //加上新价格
      // this.formConsume.totalAmount=this.formConsume.totalAmount+Number(this.goodsPrice);
      // this.tableData[this.editIndex].goods_number = this.goodsNumber;
      // this.tableData[this.editIndex].get_products[0].sale_price = this.goodsPrice;
    },
    handleSelect () {
      this.$selectContent({
        mode: 'staff',
        type: 'radio',
        data: this.staffData,
        getList: (data) => {
          this.staffData = data;
          this.formItem.dstb_staff_id = data[0].id;
        }
      })
    },
    handleTag (data) {
      this.staffData = data;
      this.formItem.dstb_staff_id = 0;
    },
		getErpPoint(){
			let formItem = this.formItem || {};
			if(!formItem.userId){ return; }
			return this.$ajax.post(this.$api.getErpPoint, {
					user_id: formItem.userId
				}).then(response => {
					const res = response.data;
					this.formItem.user_point = res.data || 0;
          if(this.formItem.user_point==0){
            this.feeInfo.canUseIntegral=0
          }
          
				})
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
			if(this.productData.length < 1){
				this.$Message.error('请完善商品信息!');
				return false;
			}
			if(!this.is_ok){
				this.getOrderCheckout();
				return false;
			}
			this.spinShow = true;
			this.formConsume.is_self_order_enable = this.formItem.dstb_staff_id ? this.formConsume.is_self_order_enable : 0;
			this.formConsume.staff_dstb_code = (this.formItem.dstb_staff_level == 1) ? '': (this.staffData[0] && this.staffData[0].staff_code);
			return this.$ajax.post(this.$api.orderServiceSave, {
				order_info: {
					user_id: this.formItem.userId,
		      ...this.formConsume,
					goods_list: this.productData,
					pay_end_time: this.formItem.endTime
				}
			}).then(response => {
				const res = response.data;
				this.$Message.success(res.message);
				if (res.code) {
					this.$router.go(-1);
				}
			}).finally(()=>{
				this.spinShow = false;
			})
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less">
.customer-service{
	.basic-info-area{
		align-items: stretch;
	}
  .card_wrapper{
    height: 100%;
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
