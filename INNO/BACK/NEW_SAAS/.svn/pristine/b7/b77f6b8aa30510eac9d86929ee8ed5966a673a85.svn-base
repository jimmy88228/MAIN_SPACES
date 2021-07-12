<template>
  <PageTopBase>
    <template v-slot:action>
      <div class="steps">
        <Steps :current="currentStep">
            <Step title="填写积分商城活动信息" @click.native="handleStep(0)" style="cursor: pointer;"></Step>
            <Step title="完善活动商品信息" @click.native="handleStep(1)" style="cursor: pointer;"></Step>
        </Steps>
      </div>
    </template>
    <transition-group name="fade">
      <div class="kan-activity-form" v-show="showBaisc" key="basic">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140" v-friendly-errors>
          <FormItem label="活动名称" prop="name">
            <Input v-model="formItem.name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="活动时间" prop="validTimeRange">
            <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleDate"></DatePicker>
          </FormItem>
          <FormItem label="活动图片" prop="picture">
            <image-edit :img="formItem.picture" @selectImg="openImagesModal('picture', formItem.picture )" @delImg="handleDelImg('picture')">
              <p class="strong_tips">图片尺寸最佳是360*180，格式为 jpg 或 png，图片大小控制在200KB</p>
            </image-edit>
          </FormItem>
          <FormItem label="是否启用" prop="enable">
            <i-switch size="large" v-model="formItem.enable" true-value="1" false-value="0">
              <span slot="open">启用</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          <FormItem label="是否使用积分抵扣" prop="allow_use_point">
            <i-switch v-model="formItem.allow_use_point" true-value="1" false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          <FormItem label="显示销量" prop="is_show_exchange_number">
            <i-switch v-model="formItem.is_show_exchange_number" true-value="1" false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          <FormItem label="运费" prop="shipping_free">
            <InputNumber :min="0" v-model="formItem.shipping_free"></InputNumber>
            <label>元</label>
          </FormItem>
          <FormItem label="启用免运费规则" prop="freeShippingRule">
            <Checkbox v-model="formItem.freeShippingRule" true-value="1" false-value="0">开启</Checkbox>
            <RadioGroup v-model="formItem.freeShippingType" v-show="formItem.freeShippingRule == 1" @on-change="handleFreeShippingTypeChange">
              <Radio label="1">
                <span>满</span>
                <FormItem
                  ref="shippingAmountValue"
                  prop="shippingAmountValue"
                  :rules="freeShippingPriceRule"
                  style="display: inline-block;"
                  :show-message="formItem.freeShippingType == 1">
                  <InputNumber :min="0" v-model="formItem.shippingAmountValue" :disabled="formItem.freeShippingType != 1"></InputNumber>
                </FormItem>
                <label>元</label>
              </Radio>
              <Radio label="2">
                <span>满</span>
                <FormItem
                  ref="shippingNumValue"
                  prop="shippingNumValue"
                  :rules="freeShippingNumRule"
                  style="display: inline-block;"
                  :show-message="formItem.freeShippingType == 2">
                  <InputNumber :min="0" v-model="formItem.shippingNumValue" :disabled="formItem.freeShippingType != 2"></InputNumber>
                </FormItem>
                <label>件</label>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="虚拟销量" prop="virtual_exchange_number">
            <InputNumber :min="0" v-model="formItem.virtual_exchange_number"></InputNumber>
          </FormItem>
          <FormItem label="活动排序">
            <edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
          </FormItem>
          <FormItem label="享受优惠会员等级" prop="rank_ids">
            <Select v-model="formItem.rank_ids" multiple class="basic_select">
              <Option v-for="item in levelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="每人限购次数" prop="limit_count">
            <InputNumber :min="0" v-model="formItem.limit_count"></InputNumber>
            <span class="strong_tips">每个会员允许参加购买的次数，0表示不限制</span>
          </FormItem>
          <FormItem label="兑换条件" prop="exchange_conditions">
            <Input
              type="textarea"
              class="basic_textarea"
              v-model="formItem.exchange_conditions"
              placeholder="请输入规则描述"
              :rows="3"
              :maxlength="150"
              show-word-limit/>
          </FormItem>
        </Form>
      </div>
      <div v-show="!showBaisc" key="goods" class="integral-activity-select-wrapper">
        <Button type="dashed" @click="handleSelect" class="basic_select">积分商品</Button>
        <goodsSelect :data="formItem.goodsSelect" @get-spec-data="handleSpecData" @clear-goods-data="handleClear" v-show="formItem.goodsSelect && formItem.goodsSelect.length"/>
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

export default {
  props: ['id'],
  components: {
    PageTopBase,
    ImageEdit,
    EditSort,
    goodsSelect
  },
  mixins: [Control],
  data () {
    const checkValidRange = (rule, value, callback) => {
      if (!value[0] && !value[1]) {
        callback(new Error('活动时间不能为空'));
      } else {
        callback();
      }
    }
    const checkfreeShippingPriceRule = (rule, value, callback) => {
      if (this.formItem.freeShippingRule == 1 && this.formItem.freeShippingType == 1) {
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
      if (this.formItem.freeShippingRule == 1 && this.formItem.freeShippingType == 2) {
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
      formItem: {
        name: '',
        validTimeRange: [],
        start_time: '',
        end_time: '',
        picture: '',
        enable: '0',
        allow_use_point: '0',
        is_show_exchange_number: '0',
        sort: 0,
        rank_ids: [],
        limit_count: 0,
        shipping_free: 0,
        virtual_exchange_number: 0,
        free_shipping_rule: '0',
        free_shipping_rule_value: 0,
        exchange_conditions: '',
        goodsSelect: [],
        goodsSpecSelect: [],
        freeShippingRule: '0',
        freeShippingType: '1',
        shippingAmountValue: 0,
        shippingNumValue: 0,
      },
      ruleValidate: {
        name: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        picture: [{required: true, message: '活动图片不能为空', trigger: 'change'}],
        limit_count: [{required: true, message: '每人限购次数不能为空', trigger: 'blur', type: 'number'}],
        shipping_free: [{required: true, message: '运费不能为空', trigger: 'blur', type: 'number'}],
        virtual_exchange_number: [{required: true, message: '虚拟销量不能为空', trigger: 'blur', type: 'number'}],
        goodsSelect: [{required: true, message: '请选择积分商品',trigger: 'change', type: 'array', min: 1}],
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
      levelList: [],
      spinShow: false
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.integralGoodsInfo, {
        id: this.id || 0
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.items;
          if (data) {
            this.formItem = Object.assign({}, data, {
              validTimeRange: [data.start_time, data.end_time],
              shipping_free: +data.shipping_free,
              free_shipping_rule_value: +data.free_shipping_rule_value,
              virtual_exchange_number: +data.virtual_exchange_number,
              sort: +data.sort,
              limit_count: +data.limit_count,
              rank_ids: data.rank_data.map(item => item.id),
              goodsSelect: data.get_mk_product.filter(item => {
                item.goods_name = data.goods_data.goods_name;
                item.goods_sn = data.goods_data.goods_sn;
                item.get_products = [
                  Object.assign(item.get_product, {
                    inventory: +(item.inventory),
                    market_price:  +(item.market_price),
                    sale_price:  +(item.sale_price),
                    integral: +item.integral,
                    enable: item.enable
                  })
                ];
                return true;
              }),
              freeShippingRule: (data.free_shipping_rule == 2 || data.free_shipping_rule == 1) ? '1' : '0',
              shippingAmountValue: data.free_shipping_rule == 2 ? +data.free_shipping_rule_value : 0,
              shippingNumValue: data.free_shipping_rule == 1 ? +data.free_shipping_rule_value : 0,
              freeShippingType: data.free_shipping_rule == 2 ? '1' : '2'
            });
          }
          if (res.data && res.data.rank) {
            this.levelList = res.data.rank;
          }
        }
        this.spinShow = false;
      });
    },
    handleDate ([start_time, end_time]) {
      this.formItem.start_time = start_time;
      this.formItem.end_time = end_time;
    },
    openImagesModal (name, url) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.formItem[name] = item.src;
          if (name === 'picture') this.$refs.formValidate.validateField('picture');
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
      this.$refs.shippingAmountValue.validateState = '';
      this.$refs.shippingNumValue.validateState = '';
    },
    handleSelect () {
      this.$selectContent({
        mode: 'goods',
        type: 'radio',
        data: this.formItem.goodsSelect,
        getList: (data) => {
          this.formItem.goodsSelect = data;
        }
      })
    },
    handleSpecData (specData) {
      this.formItem.goodsSpecSelect = specData;
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
    confirm () {
      this.$refs.formValidate.validate(valid => {
        if (valid && this.sortVaild) {
          this.spinShow = true;
            return this.$ajax.post(this.id ? this.$api.integralGoodsEdit : this.$api.integralGoodsAdd, {
              id: this.id,
              goods_data_state: 2,
              name: this.formItem.name,
              start_time: this.formItem.start_time,
              end_time: this.formItem.end_time,
              picture: this.formItem.picture,
              enable: this.formItem.enable,
              allow_use_point: this.formItem.allow_use_point,
              is_show_exchange_number: this.formItem.is_show_exchange_number,
              sort: this.formItem.sort,
              rank_ids: this.formItem.rank_ids.join(),
              limit_count: this.formItem.limit_count,
              shipping_free: this.formItem.shipping_free,
              virtual_exchange_number: this.formItem.virtual_exchange_number,
              free_shipping_rule: this.formItem.freeShippingRule == 0 ? 0 : (this.formItem.freeShippingType == 2 ? 1 : 2),
              free_shipping_rule_value: this.formItem.shippingAmountValue || this.formItem.shippingNumValue,
              exchange_conditions: this.formItem.exchange_conditions,
              goods_id: this.formItem.goodsSelect[0].goods_id,
              goods_data: this.formItem.goodsSpecSelect
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
    this.loadData();
  }
}
</script>

<style lang="less">
.kan-activity-form{
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .time_range{
    width: 340px;
  }
  .radio_group{
    vertical-align: top;
    .radio_24{
      margin-bottom: 24px;
    }
  }
  .people_wrapper{
    display: inline-block;
    .formitem_20{
      margin-bottom: 20px;
    }
    .people_range{
      .item{
        display: inline-block;
        .margin_10{
          margin: 0 10px;
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
.integral-activity-select-wrapper{
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

