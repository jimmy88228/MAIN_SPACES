<template>
  <PageTopBase>
    <template v-slot:action>
      <div class="steps">
        <Steps :current="currentStep">
            <Step title="填写砍价活动信息" @click.native="handleStep(0)" style="cursor: pointer;"></Step>
            <Step title="完善活动商品信息" @click.native="handleStep(1)" style="cursor: pointer;"></Step>
        </Steps>
      </div>
    </template>
    <transition-group name="fade">
      <div class="kan-activity-form" v-show="showBaisc" key="basic">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140" v-friendly-errors>
          <FormItem label="活动名称" prop="activity_name">
            <Input v-model="formItem.activity_name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="活动时间" prop="validTimeRange">
            <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleDateChange"></DatePicker>
          </FormItem>
          <FormItem label="活动图片" prop="activity_img">
            <image-edit :img="formItem.activity_img" @selectImg="openImagesModal('activity_img', formItem.activity_img )" @delImg="handleDelImg('activity_img')">
              <p class="strong_tips">图片尺寸最佳是360*180，格式为 jpg 或 png，图片大小控制在200KB</p>
            </image-edit>
          </FormItem>
          <FormItem label="是否启用" prop="is_enabled">
            <i-switch size="large" v-model="formItem.is_enabled" true-value="1" false-value="0">
              <span slot="open">启用</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          <FormItem label="是否新用户才能帮砍" prop="limit_new_user">
            <i-switch v-model="formItem.limit_new_user" true-value="1" false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          <FormItem label="运费" prop="shipping_free">
            <InputNumber :min="0" v-model="formItem.shipping_free"></InputNumber>
            <label>元</label>
          </FormItem>
          <FormItem label="启用免运费规则" prop="free_shipping_rule">
            <Checkbox v-model="formItem.free_shipping_rule" true-value="2" false-value="0">开启</Checkbox>
            <FormItem
              ref="freeShippingPrice"
              prop="free_shipping_rule_value"
              :rules="freeShippingPriceRule"
              style="display: inline-block;">
              <span>满</span>
              <InputNumber :min="0" v-model="formItem.free_shipping_rule_value" :disabled="formItem.free_shipping_rule != 2"></InputNumber>
              <label>元</label>
            </FormItem>
          </FormItem>
          <FormItem label="活动排序">
            <edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
          </FormItem>
          <FormItem label="每人限购次数" prop="pre_limit_buy_times">
            <InputNumber :min="0" v-model="formItem.pre_limit_buy_times"></InputNumber>
            <span class="strong_tips">每个会员允许参加购买的次数，0表示不限制</span>
          </FormItem>
          <FormItem label="帮砍人数">
            <RadioGroup v-model="formItem.mans_limit_kind" vertical class="radio_group" @on-change="handleChange">
              <Radio label="0" class="radio_24">固定人数</Radio>
              <Radio label="1">随机人数</Radio>
            </RadioGroup>
            <div class="people_wrapper">
              <FormItem
                ref="people"
                class="formitem_20"
                prop="people"
                :rules="[{type: 'number', trigger: 'blur', validator: checkPeople}]">
                <InputNumber :min="2" :max="1000" v-model="formItem.people" :disabled="formItem.mans_limit_kind != 0"></InputNumber>
                <span>人</span>
              </FormItem>
              <div class="people_range">
                <FormItem
                  ref="peopleStart"
                  class="item"
                  prop="peopleStart"
                  :rules="[{type: 'number', trigger: 'blur', validator: checkPeopleStart}]">
                  <InputNumber class="margin_10" :min="2" :max="1000" v-model="formItem.peopleStart" :disabled="formItem.mans_limit_kind != 1"></InputNumber>
                  <span>-</span>
                </FormItem>
                <FormItem
                  ref="peopleEnd"
                  class="item"
                  prop="peopleEnd"
                  :rules="[{type: 'number', trigger: 'blur', validator: checkPeopleEnd}]">
                  <InputNumber class="margin_10" :min="2" :max="1000" v-model="formItem.peopleEnd" :disabled="formItem.mans_limit_kind != 1"></InputNumber>
                  <span>人砍至底价</span>
                </FormItem>
              </div>
            </div>
          </FormItem>
          <FormItem label="发起人砍第一刀">
            <RadioGroup v-model="formItem.is_self_haggle">
              <Radio label="1">允许</Radio>
              <Radio label="0">不允许</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="购买规则" prop="activity_rule">
            <Select v-model="formItem.activity_rule" class="basic_select">
              <Option value="0">底价购买</Option>
              <Option value="1">随时购买</Option>
            </Select>
          </FormItem>
          <FormItem label="砍价有效期" prop="validity_hours">
            <InputNumber :min="1" v-model="formItem.validity_hours"></InputNumber>
            <span>小时</span>
          </FormItem>
          <FormItem label="支付有效期" prop="validity_pay_hours">
            <InputNumber :min="1" v-model="formItem.validity_pay_hours"></InputNumber>
            <span>小时</span>
          </FormItem>
          <FormItem label="允许帮砍次数" prop="limit_help_count">
            <InputNumber :min="0" v-model="formItem.limit_help_count"></InputNumber>
            <span>次</span>
            <p class="strong_tips">每个用户能够参与该活动帮砍的次数，0表示不限制</p>
          </FormItem>
          <FormItem label="帮砍赠送优惠券" prop="coupons">
            <coupon-select :data="formItem.coupons" type="checkbox" @del-tag="handleCouponClose">
              <Button type="dashed" @click="handleCouponSelected" class="basic_select">选择优惠券</Button>
            </coupon-select>
          </FormItem>
          <FormItem label="砍价详情绑定活动页" prop="pages">
            <page-select :data="formItem.pages" type="radio" @del-tag="handlePageClose">
              <Button type="dashed" @click="handlePageSelected" class="basic_select">选择活动页</Button>
            </page-select>
          </FormItem>
          <FormItem label="微信分享标题" prop="share_title">
            <Input v-model="formItem.share_title" placeholder="请输入微信分享标题" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="微信分享图片" prop="share_picture">
            <image-edit :img="formItem.share_picture" @selectImg="openImagesModal('share_picture', formItem.share_picture )" @delImg="handleDelImg('share_picture')">
              <p class="strong_tips">图片尺寸最佳是360*360，格式为 jpg 或 png，图片大小控制在200KB</p>
            </image-edit>
          </FormItem>
          <FormItem label="规则描述" prop="rule_description">
            <Input
              type="textarea"
              class="basic_textarea"
              v-model="formItem.rule_description"
              placeholder="请输入规则描述"
              :rows="3"
              :maxlength="150"
              show-word-limit/>
          </FormItem>
          <FormItem label="商品详情">
            <rich-text :rich-text-data="formItem.goods_desciption" @get-rich-text="handleRichText"/>
          </FormItem>
        </Form>
      </div>
      <div v-show="!showBaisc" key="goods" class="bargin-activity-select-wrapper">
        <Button type="dashed" @click="handleSelect" class="basic_select">选择商品</Button>
        <goodsSelect :data="formItem.goodsSelect" @get-spec-data="handleSpecData" @clear-goods-data="handleClear" v-show="formItem.goodsSelect.length"/>
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
import CouponSelect from '@/views/my-components/list-component/index-edit';
import PageSelect from '@/views/my-components/list-component/index-edit';
import RichText from '@/views/my-components/rich-text/index';

export default {
  props: ['id'],
  components: {
    PageTopBase,
    ImageEdit,
    EditSort,
    goodsSelect,
    CouponSelect,
    PageSelect,
    RichText
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
      if (this.formItem.free_shipping_rule == 2) {
        if (value !== 0 && !value) {
          callback(new Error('价格不能为空'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    const checkRule = (rule, value, callback) => {
      if (value === -1) {
        callback(new Error('请选择购买规则'));
      } else {
        callback();
      }
    }
    return {
      formItem: {
        activity_name: '',
        validTimeRange: [],
        from_time: '',
        to_time: '',
        activity_img: '',
        is_enabled: '0',
        limit_new_user: '0',
        sort: 0,
        mans_limit_kind: '0',
        people: 2,
        peopleStart: 2,
        peopleEnd: 100,
        is_self_haggle: '0',
        activity_rule: -1,
        pre_limit_buy_times: 0,
        validity_hours: 1,
        validity_pay_hours: 1,
        limit_help_count: 0,
        coupons: [],
        pages: [],
        shipping_free: 0,
        free_shipping_rule: '0',
        free_shipping_rule_value: 0,
        share_title: '',
        share_picture: '',
        rule_description: '',
        goodsSelect: [],
        goodsSpecSelect: [],
        goods_desciption: ''
      },
      ruleValidate: {
        activity_name: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        activity_img: [{required: true, message: '活动图片不能为空', trigger: 'change'}],
        activity_rule: [{required: true, trigger: 'change', validator: checkRule}],
        pre_limit_buy_times: [{required: true, message: '每人限购次数不能为空', trigger: 'blur', type: 'number'}],
        validity_hours: [{required: true, message: '砍价有效期不能为空', trigger: 'blur', type: 'number'}],
        validity_pay_hours: [{required: true, message: '支付有效期不能为空', trigger: 'blur', type: 'number'}],
        shipping_free: [{required: true, message: '运费不能为空', trigger: 'blur', type: 'number'}],
        goodsSelect: [{required: true, message: '请选择砍价商品',trigger: 'change', type: 'array', min: 1}]
      },
      freeShippingPriceRule: [
        {trigger: 'blur', type: 'number', validator: checkfreeShippingPriceRule}
      ],
      sortVaild: false,
      currentStep: 0,
      showBaisc: true,
      spinShow: false
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      this.$ajax.post(this.$api.bargainActivityInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.items;
          if (data) {
            let goodsData;
            if (Array.isArray(data.goods_data) && data.goods_data.length === 0) {
              goodsData = [];
            } else {
              goodsData = [
                {
                  goods_name: data.goods_name,
                  goods_sn: data.goods_sn,
                  get_products: data.goods_data
                }
              ];
            }
            Object.assign(this.formItem, {
              ...data,
              validTimeRange: [data.from_time, data.to_time],
              people: this.formItem.mans_limit_kind === '0' ? +data.mans_from : 2,
              peopleStart: this.formItem.mans_limit_kind === '1' ? +data.mans_from : 2,
              peopleEnd: this.formItem.mans_limit_kind === '1' ? +data.mans_to : 100,
              coupons: data.bonus_data,
              shipping_free: +data.shipping_free,
              free_shipping_rule_value: +data.free_shipping_rule_value,
              pre_limit_buy_times: +data.pre_limit_buy_times,
              people: +data.mans_from,
              peopleStart: +data.mans_from,
              peopleEnd: +data.mans_to,
              validity_hours: +data.validity_hours,
              validity_pay_hours: +data.validity_pay_hours,
              limit_help_count: +data.limit_help_count,
              goodsSelect: goodsData
            })
          }
        }
        this.spinShow = false;
      });
    },
    handleDateChange ([from_time, to_time]) {
      this.formItem.from_time = from_time;
      this.formItem.to_time = to_time;
    },
    checkPeople (rule, value, callback) {
      if (this.formItem.mans_limit_kind == 0 && !value) {
        callback(new Error('固定人数不能为空'));
      } else {
        callback();
      }
    },
    checkPeopleStart (rule, value, callback) {
      if (this.formItem.mans_limit_kind == 1) {
        if (!value) {
          callback(new Error('人数不能为空'));
        } else if (value > this.formItem.peopleEnd || value == this.formItem.peopleEnd) {
          callback(new Error('需小于最多人数'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    checkPeopleEnd (rule, value, callback) {
      if (this.formItem.mans_limit_kind == 1) {
        if (!value) {
          callback(new Error('人数不能为空'));
        } else if (value < this.formItem.peopleStart) {
          callback(new Error('需大于最少人数'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    handleChange () {
      this.$refs.people.validateState = '';
      this.$refs.peopleStart.validateState = '';
      this.$refs.peopleEnd.validateState = '';
    },
    handleRichText (content) {
      this.formItem.goods_desciption = content;
    },
    openImagesModal (name, url) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.formItem[name] = item.src;
          if (name === 'activity_img') this.$refs.formValidate.validateField('activity_img');
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
        mode: 'goods',
        type: 'radio',
        data: this.formItem.goodsSelect,
        getList: (data) => {
          this.formItem.goodsSelect = data;
        }
      })
    },
    handleCouponSelected () {
      this.$selectContent({
        mode: 'coupon',
        type: 'checkbox',
        data: this.formItem.coupons,
        getList: (data) => {
          this.formItem.coupons = data;
        }
      })
    },
    handleCouponClose (data) {
      this.formItem.coupons = data;
    },
    handlePageSelected  () {
      this.$selectContent({
        mode: 'pages',
        type: 'radio',
        data: this.formItem.pages,
        getList: (data) => {
          this.formItem.pages = data;
        }
      })
    },
    handlePageClose (data) {
      this.formItem.pages = data;
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
      //如果所有商品状态都关闭，活动也要关闭
      let on_is_enabled=0;
      for(let i=0;i<this.formItem.goodsSpecSelect.length;i++){
        if(Number(this.formItem.goodsSpecSelect[i].is_enabled)==1){
          on_is_enabled=1;
        }
      }
      if(on_is_enabled==0){
        this.formItem.is_enabled="0";
      }

      this.spinShow = true;
      return this.$ajax.post(this.id ? this.$api.bargainActivityEdit : this.$api.bargainActivityAdd, {
        ...this.formItem,
        id: this.id,
        goods_data_state: 2,
        goods_id: this.formItem.goodsSpecSelect.length>0?this.formItem.goodsSpecSelect[0].goods_id:0,
        mans_from: this.formItem.mans_limit_kind == 0 ? this.formItem.people : this.formItem.peopleStart,
        mans_to: this.formItem.peopleEnd,
        bonus_ids: this.formItem.coupons.map(item => item.id).join(),
        page_id: this.formItem.pages.map(item => item.id).join(),
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
  },
  mounted () {
    if (this.id) this.loadData();
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
.bargin-activity-select-wrapper{
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

