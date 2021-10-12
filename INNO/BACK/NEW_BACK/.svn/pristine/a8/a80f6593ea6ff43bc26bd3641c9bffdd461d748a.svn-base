<template>
  <PageTopBase>
    <template v-slot:action>
      <div class="steps">
        <Steps :current="currentStep">
            <Step title="填写预售活动信息" @click.native="handleStep(0)" style="cursor: pointer;"></Step>
            <Step title="完善活动商品信息" @click.native="handleStep(1)" style="cursor: pointer;"></Step>
        </Steps>
      </div>
    </template>
    <transition-group name="fade">
      <div class="presale-activity-form" v-show="showBaisc" key="basic">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140" v-friendly-errors>
          <FormItem label="活动名称" prop="activityName">
            <Input v-model="formItem.activityName" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="预售类型" prop="activityType">
            <Select v-model="formItem.activityType" class="basic_select" :disabled="Number(id) ? true : false">
              <Option :value="1">全款付</Option>
              <Option :value="2">定金</Option>
              <Option :value="3">定金+(固定)膨胀金</Option>
              <Option :value="4">定金+(动态)膨胀金</Option>
            </Select>
          </FormItem>
          <FormItem label="预售时间" prop="validTimeRange">
            <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择预售时间" class="time_range"></DatePicker>
          </FormItem>
          <FormItem
            label="尾款时间"
            prop="lastTimeRange"
            v-if="formItem.activityType !== 1 && formItem.activityType !== -1"
            :rules="[
              {required: true, trigger: 'change', type: 'array', validator: checklastTimeRange}
            ]">
            <DatePicker v-model="formItem.lastTimeRange" type="datetimerange" placeholder="请选择尾款时间" class="time_range"></DatePicker>
          </FormItem>
          <FormItem label="预计发货时间" prop="estimateDeliveryDate">
            <DatePicker v-model="formItem.estimateDeliveryDate" type="datetime" placeholder="请选择预计发货时间"></DatePicker>
          </FormItem>
          <FormItem label="活动图片" prop="image">
            <image-edit :img="formItem.image" @selectImg="openImagesModal('image', formItem.image )" @delImg="handleDelImg('image')">
              <p class="strong_tips">图片尺寸最佳是360*360，格式为 jpg 或 png，图片大小控制在200KB</p>
            </image-edit>
          </FormItem>
          <FormItem label="是否启用" prop="isEnabled">
            <i-switch v-model="formItem.isEnabled" true-value="1" false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          <FormItem label="是否允许使用积分">
            <RadioGroup v-model="formItem.isAllowPoint">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否允许使用优惠券">
            <RadioGroup v-model="formItem.isAllowCoupon">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="销量">
            <RadioGroup v-model="formItem.isShowSaleNumber">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="退还定金" prop="isallowReturnDeposit">
            <i-switch size="large" v-model="formItem.isallowReturnDeposit" true-value="1" false-value="0" :disabled="Number(id) ? true : false">
              <span slot="open">退款</span>
              <span slot="close">不退</span>
            </i-switch>
          </FormItem>
          <FormItem label="每人限购次数" prop="limitUserBuys">
            <InputNumber :min="0" v-model="formItem.limitUserBuys"></InputNumber>
            <span class="strong_tips">每个会员允许参加购买的次数，0表示不限制</span>
          </FormItem>
          <FormItem label="每单限购数量" prop="limitBuys">
            <InputNumber :min="0" v-model="formItem.limitBuys"></InputNumber>
            <span class="strong_tips">0 表示不做限制</span>
          </FormItem>
          <FormItem label="运费" prop="shippingFee">
            <InputNumber :min="0" v-model="formItem.shippingFee"></InputNumber>
            <label>元</label>
          </FormItem>
          <FormItem label="启用免运费规则" prop="isFreeShipping">
            <Checkbox v-model="formItem.isFreeShipping" true-value="1" false-value="0">开启</Checkbox>
            <RadioGroup v-model="formItem.freeShippingType" v-show="formItem.isFreeShipping == 1" @on-change="handleFreeShippingTypeChange">
              <Radio label="1">
                <span>满</span>
                <FormItem
                  ref="freeShippingPrice"
                  prop="freeShippingPrice"
                  :rules="freeShippingPriceRule"
                  style="display: inline-block;"
                  :show-message="formItem.freeShippingType == 1">
                  <InputNumber :min="0" v-model="formItem.freeShippingPrice" :disabled="formItem.freeShippingType != 1"></InputNumber>
                </FormItem>
                <label>元</label>
              </Radio>
              <Radio label="2">
                <span>满</span>
                <FormItem
                  ref="freeShippingNumber"
                  prop="freeShippingNumber"
                  :rules="freeShippingNumRule"
                  style="display: inline-block;"
                  :show-message="formItem.freeShippingType == 2">
                  <InputNumber :min="0" v-model="formItem.freeShippingNumber" :disabled="formItem.freeShippingType != 2"></InputNumber>
                </FormItem>
                <label>件</label>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="活动排序">
            <edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
          </FormItem>
          <FormItem label="虚拟销量" prop="virtualSaleNumber">
            <InputNumber :min="0" v-model="formItem.virtualSaleNumber"></InputNumber>
          </FormItem>
          <FormItem label="不退定金协议" prop="depositDesc">
            <Input
              type="textarea"
              class="basic_textarea"
              v-model="formItem.depositDesc"
              placeholder="请输入不退定金协议"
              :rows="3"
              :maxlength="150"
              show-word-limit/>
          </FormItem>
          <FormItem label="预售规则标题" prop="ruleTitle">
            <Input v-model="formItem.ruleTitle" placeholder="请输入预售规则标题" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="预售规则描述" prop="ruleDesc">
            <Input
              type="textarea"
              class="basic_textarea"
              v-model="formItem.ruleDesc"
              placeholder="请输入预售规则描述"
              :rows="3"
              :maxlength="150"
              show-word-limit/>
          </FormItem>
          <FormItem label="商品详情">
            <rich-text :rich-text-data="formItem.richTextData" @get-rich-text="handleRichText"/>
          </FormItem>
        </Form>
      </div>
      <div v-show="!showBaisc" key="goods" class="presale-activity-select-wrapper">
        <Button type="dashed" @click="handleSelect" class="basic_select" v-if="!id || !formItem.goodsSelect.length">选择商品</Button>
        <goodsSelect
          :id="id"
          :data="formItem.goodsSelect"
          :gallery="goodsGallery"
          :type="formItem.activityType"
          @get-spec-data="handleSpecData"
          @get-store-goods-data="handleStoreGoodsData"
          @get-img-data="handleImgData"
          @clear-goods-data="handleClear"
          @on-validate-table="handleValidateTable"
          v-show="formItem.goodsSelect.length"/>
      </div>
    </transition-group>
    <template v-slot:footer>
      <Divider />
      <div style="text-align: center;">
        <Button type="default" @click="goBack">取消</Button>
        <Button type="primary" @click="confirm" v-show="currentStep === 1">保存</Button>
        <Button type="success" @click="next" v-show="currentStep === 0">下一步</Button>
        <Button type="success" @click="foward" v-show="currentStep === 1">上一步</Button>
      </div>
    </template>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import EditSort from '@/views/my-components/edit-sort/edit-sort';
import Control from '@/libs/page-control';
import goodsSelect from './goods-select';
import RichText from '@/views/my-components/rich-text/index';

export default {
  props: ['id'],
  provide () {
    return {
      formInstance: this
    }
  },
  components: {
    PageTopBase,
    ImageEdit,
    EditSort,
    goodsSelect,
    RichText
  },
  mixins: [Control],
  data () {
    const checkValidRange = (rule, value, callback) => {
      if (!value[0] && !value[1]) {
        callback(new Error('预售时间不能为空'));
      } else {
        callback();
      }
    }
    const checkfreeShippingPriceRule = (rule, value, callback) => {
      if (this.formItem.isFreeShipping == 1 && this.formItem.freeShippingType == 1) {
        if (value !== 0 && !value) {
          callback(new Error('价格不能为空'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    const checkfreeShippingNumRule = (rule, value, callback) => {
      if (this.formItem.isFreeShipping == 1 && this.formItem.freeShippingType == 2) {
        if (value !== 0 && !value) {
          callback(new Error('件数不能为空'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    return {
      orginBasicData: null,
      formItem: {
        activityName: '',
        activityType: -1,
        validTimeRange: [],
        lastTimeRange: [],
        estimateDeliveryDate: '',
        image: '',
        isEnabled: '0',
        isallowReturnDeposit: '0',
        sort: 0,
        isAllowPoint: '0',
        isAllowCoupon: '0',
        isShowSaleNumber: '0',
        virtualSaleNumber: 0,
        limitUserBuys: 0,
        limitBuys: 1,
        shippingFee: 0,
        isFreeShipping: '0',
        freeShippingType: '1',
        freeShippingPrice: 0,
        freeShippingNumber: 0,
        depositDesc: '',
        ruleTitle: '',
        ruleDesc: '',
        richTextData: '',
        goodsSelect: [],
        goodsSpecSelect: [],
        storeGoodsInfo: []
      },
      goodsGallery: [],
      ruleValidate: {
        activityName: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        activityType: [{required: true, message: '请选择预售类型', trigger: 'change', type: 'number'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        estimateDeliveryDate: [{required: true, message: '预计发货时间不能为空', trigger: 'change', type: 'date'}],
        image: [{required: true, message: '活动图片不能为空', trigger: 'change'}],
        virtualSaleNumber: [{required: true, message: '虚拟销量不能为空', trigger: 'blur', type: 'number'}],
        limitUserBuys: [{required: true, message: '每人限购次数不能为空', trigger: 'blur', type: 'number'}],
        limitBuys: [{required: true, message: '每单限购数量不能为空', trigger: 'blur', type: 'number'}],
        shippingFee: [{required: true, message: '运费不能为空', trigger: 'blur', type: 'number'}]
      },
      freeShippingPriceRule: [
        {trigger: 'blur', type: 'number', validator: checkfreeShippingPriceRule}
      ],
      freeShippingNumRule: [
        {trigger: 'blur', type: 'number', validator: checkfreeShippingNumRule}
      ],
      sortVaild: false,
      currentStep: 0,
      showBaisc: true,
      isValidTable: false,
      isInit: true,
      spinShow: false
    }
  },
  methods: {
    loadData (page, data) {
      this.spinShow = true;
      return this.$ajax.post(this.$api.cloudPresaleActivityInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          const data = res.data && res.data.items;
          if  (!data) return false;
          const products = data.get_presale_activity_goods.map(item => {
            return {
              ...item,
              ...item.get_products,
              goods_rule: item.goods_rule.map(item => {
                return {
                  rule_type: Number(item.rule_type),
                  rule_rate: Number(item.rule_rate),
                  deposit_price: Number(item.deposit_price),
                  discount_price: Number(item.discount_price),
                  tail_price: Number(item.tail_price)
                }
              })
            }
          })
          const reverArr = Object.values(data.GoodsGallery).reverse();
          reverArr.forEach(item => {
            item.img_url = Object.values(item.img_url).reverse();
          });
          this.formItem = {
            activityName: data.activity_name,
            activityType: Number(data.activity_type),
            validTimeRange: [data.presale_begin_time, data.presale_end_time],
            lastTimeRange: [data.pay_begin_time, data.pay_end_time],
            estimateDeliveryDate: data.estimate_delivery_date,
            image: data.act_img,
            isEnabled: data.is_enabled,
            isallowReturnDeposit: data.isallow_return_deposit,
            sort: Number(data.sort),
            isAllowPoint: data.is_allow_point,
            isAllowCoupon: data.is_allow_coupon,
            isShowSaleNumber: data.is_show_sale_number,
            virtualSaleNumber: Number(data.virtual_sale_number),
            limitUserBuys: Number(data.limit_user_buys),
            limitBuys: Number(data.limit_buys),
            shippingFee: Number(data.shipping_fee),
            isFreeShipping: data.free_shipping_rule != 0 ? '1' : '0',
            freeShippingType: data.free_shipping_rule != 0 ? data.free_shipping_rule : '1',
            freeShippingPrice: data.free_shipping_rule == 1 ? Number(data.free_shipping_rule_value) : 0,
            freeShippingNumber: data.free_shipping_rule == 2 ? Number(data.free_shipping_rule_value) : 0,
            depositDesc: data.deposit_desc,
            ruleTitle: data.rule_title,
            ruleDesc: data.rule_desc,
            richTextData: data.goods_desc,
            goodsSelect:data.get_presale_activity_goods.length>0?[{
              goods_name: data.get_presale_activity_goods[0].goods_name || '',
              goods_sn: data.get_presale_activity_goods[0].goods_sn || '',
              goods_thumb: data.get_presale_activity_goods[0].goods_thumb || '',
              get_products: products || [],
            }]:[],
            goodsSpecSelect: [],
            storeGoodsInfo: [],
          }
          this.goodsGallery = reverArr;
          Object.defineProperty(this, 'originGallery', {
            value: JSON.parse(JSON.stringify(this.goodsGallery))
          });
        }
        this.spinShow = false;
      });
    },
    handleRichText (content) {
      this.formItem.richTextData = content;
    },
    checklastTimeRange (rule, value, callback) {
      if (!value[0] && !value[1]) {
        callback(new Error('尾款时间不能为空'));
      } else {
        callback();
      }
    },
    openImagesModal (name, url) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.formItem[name] = item.src;
          if (name === 'image') this.$refs.formValidate.validateField('image');
        }
      });
    },
    handleDelImg (name) {
      this.formItem[name] = '';
    },
    handleSort (bool) {
      this.sortVaild = bool;
    },
    handleFreeShippingTypeChange() {
      this.$refs.freeShippingPrice.validateState = '';
      this.$refs.freeShippingNumber.validateState = '';
    },
    handleSelect () {
      this.$selectContent({
        mode: 'cloud-goods',
        type: 'radio',
        data: this.formItem.goodsSelect,
        getList: (data) => {
          this.formItem.goodsSelect = data;
          if (!this.id) {
              let colorCollection = [];
              let colorIdStack = {};
              data[0].get_products.forEach((item, index) => {
                if (!colorIdStack[item.color_id]) {
                  colorCollection.push({
                    id: 'goodsGallery' + index,
                    color_name: item.color_name,
                    img_url: [data[0].goods_thumb]
                  });
                  colorIdStack[item.color_id] = true;
                }
              })
              this.goodsGallery = colorCollection;
            }
        }
      })
    },
    handleSpecData (specData) {
      this.formItem.goodsSpecSelect = specData;
      if (this.isInit) {
        this.orginBasicData = JSON.parse(JSON.stringify(this.formItem));
        this.isInit = false;
      }
    },
    handleImgData (imgData) {
      this.goodsGallery = imgData;
    },
    handleStoreGoodsData (storeGoodsData) {
      this.storeGoodsInfo = storeGoodsData;
    },
    handleClear () {
      this.formItem.goodsSelect = [];
    },
    next () {
      return this.$refs.formValidate.validate().then(valid => {
        if (valid) {
          this.currentStep = 1;
          this.showBaisc = false;
        }
      })
    },
    foward () {
      this.currentStep = 0;
      this.showBaisc = true;
    },
    handleStep (step) {
      step === 0 ? this.foward() : this.next();
    },
    goBack () {
      this.$router.go(-1);
    },
    handleValidateTable (bool) {
      // 校验table
      this.isValidTable = bool;
    },
    confirm () {
      if (this.goodsGallery.some(item => item.img_url.length === 0)) {
        this.$Message.error('请选择规格图片!');
        return false;
      }
      this.$emit('validate-table');
      this.$refs.formValidate.validate(valid => {
        if (valid && this.isValidTable) {
          this.spinShow = true;
          return this.$ajax.post(this.id ? this.$api.cloudPresaleActivityEdit : this.$api.cloudPresaleActivityAdd, {
            activity_id: this.id,
            goods_data_state: JSON.stringify(this.orginBasicData) === JSON.stringify(this.formItem) ? 1 : 2,		//goods_data是否有改动 1没改 2改了
            goods_gallery_state: JSON.stringify(this.originGallery) === JSON.stringify(this.goodsGallery) ? 1 : 2,	//goods_gallery 是否有改动 1没改 2改了
            activity_name: this.formItem.activityName,
            activity_type: this.formItem.activityType,
            start_time: this.formItem.validTimeRange[0],
            end_time:	this.formItem.validTimeRange[1],
            pay_start_time: this.formItem.activityType !== 1 ? this.formItem.lastTimeRange[0] : '',
            pay_end_time:	this.formItem.activityType !== 1 ? this.formItem.lastTimeRange[1] : '',
            estimate_delivery_date: this.formItem.estimateDeliveryDate,
            act_img: this.formItem.image,
            is_enabled: this.formItem.isEnabled,
            is_allow_point: this.formItem.isAllowPoint,
            is_allow_coupon: this.formItem.isAllowCoupon,
            isallow_return_deposit: this.formItem.isallowReturnDeposit,
            limit_user_buys: this.formItem.limitUserBuys,
            shipping_fee: this.formItem.shippingFee,
            free_shipping_rule: Number(this.formItem.isFreeShipping) ? Number(this.formItem.freeShippingType) : 0, //免运费规则 0 未选中 1满件 2满元
            free_shipping_rule_value: Number(this.formItem.freeShippingType) === 1 ? this.formItem.freeShippingPrice : this.formItem.freeShippingNumber, //免运费规则值
            sort: this.formItem.sort,
            is_show_sale_number: this.formItem.isShowSaleNumber,
            virtual_sale_number: this.formItem.virtualSaleNumber,
            limit_buys: this.formItem.limitBuys,
            deposit_desc: this.formItem.depositDesc,
            rule_title: this.formItem.ruleTitle,
            rule_desc: this.formItem.ruleDesc,
            goods_id: this.formItem.goodsSpecSelect[0].goods_id,
            goods_desc: this.formItem.richTextData, //富文本
            goods_data: this.formItem.goodsSpecSelect,
            goods_gallery: this.goodsGallery,
            store_goods_data: this.storeGoodsInfo
          })
          .then(response => {
            const res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
              this.isGlobalLeaveTip = false;
              this.$router.go(-1);
            }
            this.spinShow = false;
          });
        }
      })
    }
  },
  mounted () {
    if (this.id) this.loadData();
  }
}
</script>

<style lang="less">
.presale-activity-form{
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .time_range{
    width: 340px;
  }
}
</style>
<style lang="less" scoped>
.presale-activity-select-wrapper{
  text-align: center;
}
.steps{
  position: absolute;
  width: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
