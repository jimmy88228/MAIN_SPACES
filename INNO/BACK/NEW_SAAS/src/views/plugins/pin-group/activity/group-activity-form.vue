<template>
  <PageTopBase>
    <template v-slot:action>
      <div class="steps">
        <Steps :current="currentStep">
            <Step title="填写拼团活动信息" @click.native="handleStep(0)" style="cursor: pointer;"></Step>
            <Step title="完善活动商品信息" @click.native="handleStep(1)" style="cursor: pointer;"></Step>
        </Steps>
      </div>
    </template>
    <transition-group name="fade">
      <div class="group-activity-form" v-show="showBaisc" key="basic">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140" v-friendly-errors>
          <FormItem label="活动名称" prop="activityName">
            <Input v-model="formItem.activityName" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="活动时间" prop="validTimeRange">
            <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleTime"></DatePicker>
          </FormItem>
          <FormItem label="活动图片" prop="activeImage">
            <image-edit :img="formItem.activeImage" @selectImg="openImagesModal('activeImage', formItem.activeImage )" @delImg="handleDelImg('activeImage')">
              <p class="strong_tips">图片尺寸最佳是360*180，格式为 jpg 或 png，图片大小控制在200KB</p>
            </image-edit>
          </FormItem>
          <!-- <FormItem label="拼团商品" prop="goodsSelect">
            <Button type="dashed" @click="handleSelect" class="basic_select" v-if="!id">选择商品</Button>
            <goodsSelect
              :id="id"
              :data="formItem.goodsSelect"
              @get-spec-data="handleSpecData"
              @clear-goods-data="handleClear"
              @on-validate-table="handleValidateTable"
              v-show="formItem.goodsSelect.length"/>
          </FormItem> -->
          <FormItem label="活动状态" prop="isEnabled">
            <i-switch size="large" v-model="formItem.isEnabled" true-value="1" false-value="0" :disabled="isDisabledActivity">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          <FormItem label="显示单独购买按钮" prop="isAloneBuy">
            <i-switch size="large" v-model="formItem.isAloneBuy" true-value="1" false-value="0">
              <span slot="open">显示</span>
              <span slot="close">隐藏</span>
            </i-switch>
          </FormItem>
          <FormItem label="排序号">
            <edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
          </FormItem>
          <FormItem label="销量">
            <RadioGroup v-model="formItem.isShowSaleNumber">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="虚拟销量" prop="virtualSaleNumber">
            <InputNumber :min="0" v-model="formItem.virtualSaleNumber"></InputNumber>
          </FormItem>
          <FormItem label="参团人数" prop="joinMans">
            <InputNumber :min="2" v-model="formItem.joinMans" :active-change="false"></InputNumber>
            <label>人</label>
          </FormItem>
          <FormItem label="每单限购数量" prop="limitBuys">
            <InputNumber :min="1" v-model="formItem.limitBuys"></InputNumber>
            <label>件</label>
          </FormItem>
          <FormItem label="开团有效期" prop="validityLimitValue">
            <InputNumber :min="1" v-model="formItem.validityLimitValue"></InputNumber>
            <label>小时</label>
          </FormItem>
          <FormItem label="模拟成团" prop="isStartVirtualGroup">
            <Checkbox v-model="formItem.isStartVirtualGroup" true-value="1" false-value="0">开启模拟成团</Checkbox>
            <p class="strong_tips">开启模拟成团后，拼团有效期内人数未满的团，系统将会模拟“匿名买家”凑满人数，使该团成团。</p>
            <p class="strong_tips">你只需要对已付款参团的真实买家发货。建议合理开启，以提高成团率。</p>
          </FormItem>
          <FormItem label="团长优惠" prop="isCaptainDiscount">
            <Checkbox v-model="formItem.isCaptainDiscount" true-value="1" false-value="0">团长享受优惠价</Checkbox>
            <p class="strong_tips">开启团长（开团人）优惠后，团长将享受更优惠价格，有助于提高开团率和成团率。</p>
            <p class="strong_tips">请注意：模拟成团的团长也能享受团长优惠，请谨慎设置，避免资金损失。</p>
            <RadioGroup v-model="formItem.leaderDiscountType" v-show="formItem.isCaptainDiscount == 1" @on-change="handleLeaderDiscountChange">
              <Radio label="1">
                <span>立减</span>
                <FormItem
                  ref="discountAmount"
                  prop="discountAmount"
                  :rules="leaderDiscountPirceRule"
                  style="display: inline-block;"
                  :show-message="formItem.leaderDiscountType == 1">
                  <InputNumber :min="0" v-model="formItem.discountAmount" :disabled="formItem.leaderDiscountType != 1"></InputNumber>
                </FormItem>
                <label>元</label>
              </Radio>
              <Radio label="2">
                <span>立享</span>
                <FormItem
                  ref="discountRate"
                  prop="discountRate"
                  :rules="leaderDiscountDisRule"
                  style="display: inline-block;"
                  :show-message="formItem.leaderDiscountType == 2">
                  <InputNumber :min="0" v-model="formItem.discountRate" :disabled="formItem.leaderDiscountType != 2"></InputNumber>
                </FormItem>
                <label>折</label>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="运费" prop="shippingFee">
            <InputNumber :min="0" v-model="formItem.shippingFee"></InputNumber>
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
          <FormItem label="拼团规则描述" prop="activityRemark">
            <Input
              type="textarea"
              class="basic_textarea"
              v-model="formItem.activityRemark"
              placeholder="请输入拼团规则描述"
              :rows="3"
              :maxlength="150"
              show-word-limit/>
          </FormItem>
          <FormItem label="微信分享图片" prop="shareImage">
            <image-edit :img="formItem.shareImage" @selectImg="openImagesModal('shareImage', formItem.shareImage )" @delImg="handleDelImg('shareImage')">
              <p class="strong_tips">图片尺寸最佳是360*360，格式为 jpg 或 png，图片大小控制在200KB</p>
            </image-edit>
          </FormItem>
          <FormItem label="微信分享标题" prop="shareTitle">
            <Input v-model="formItem.shareTitle" placeholder="请输入微信分享标题" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="微信分享说明" prop="shareRemark">
            <Input
              type="textarea"
              class="basic_textarea basic_textarea"
              v-model="formItem.shareRemark"
              placeholder="请输入微信分享说明"
              :rows="3"
              :maxlength="150"
              show-word-limit/>
          </FormItem>
        </Form>
      </div>
      <div v-show="!showBaisc" key="goods" class="group-activity-select-wrapper">
        <Button type="dashed" @click="handleSelect" class="basic_select" v-if="!id">选择商品</Button>
        <goodsSelect
          :id="id"
          :data="formItem.goodsSelect"
          @get-spec-data="handleSpecData"
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
    const checkLeaderDiscountPriceRule = (rule, value, callback) => {
      if (this.formItem.isCaptainDiscount == 1 && this.formItem.leaderDiscountType == 1) {
        // 团长优惠且立减
        if (value !== 0 && !value) {
          callback(new Error('立减不能为空'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    const checkLeaderDiscountDisRule = (rule, value, callback) => {
      if (this.formItem.isCaptainDiscount == 1 && this.formItem.leaderDiscountType == 2) {
        // 团长优惠且立享
        if (value !== 0 && !value) {
          callback(new Error('立享不能为空'));
        } else {
          callback();
        }
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
        activityName: '',
        validTimeRange: [],
        activeImage: '',
        isEnabled: '0',
        isAloneBuy: '1',
        sort: 0,
        isShowSaleNumber: '0',
        virtualSaleNumber: 0,
        joinMans: 2,
        limitBuys: 1,
        validityLimitValue: 1,
        isStartVirtualGroup: '0',
        isCaptainDiscount: '0',
        leaderDiscountType: '1',
        discountAmount: 0,
        discountRate: 0,
        shippingFee: 0,
        freeShippingRule: '0',
        freeShippingType: '1',
        shippingAmountValue: 0,
        shippingNumValue: 0,
        activityRemark: '',
        shareImage: '',
        shareTitle: '',
        shareRemark: '',
        goodsSelect: [],
        goodsSpecSelect: []
      },
      ruleValidate: {
        activityName: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        activeImage: [{required: true, message: '活动图片不能为空', trigger: 'change'}],
        virtualSaleNumber: [{required: true, message: '虚拟销量不能为空', trigger: 'blur', type: 'number'}],
        joinMans: [{required: true, message: '参团人数不能为空', trigger: 'blur', type: 'number'}],
        limitBuys: [{required: true, message: '每单限购数量不能为空', trigger: 'blur', type: 'number'}],
        validityLimitValue: [{required: true, message: '开团有效期不能为空', trigger: 'blur', type: 'number'}],
        shippingFee: [{required: true, message: '运费不能为空', trigger: 'blur', type: 'number'}]
      },
      leaderDiscountPirceRule: [
        {trigger: 'blur', type: 'number', validator: checkLeaderDiscountPriceRule}
      ],
      leaderDiscountDisRule: [
        {trigger: 'blur', type: 'number', validator: checkLeaderDiscountDisRule}
      ],
      freeShippingPriceRule: [
        {trigger: 'blur', type: 'number', validator: checkfreeShippingPriceRule}
      ],
      freeShippingNumRule: [
        {trigger: 'blur', type: 'number', validator: checkfreeShippingNumRule}
      ],
      sortVaild: false,
      spinShow: false,
      isValidTable: false,
      currentStep: 0,
      showBaisc: true
    }
  },
  computed: {
    isDisabledActivity () {
      return this.formItem.goodsSpecSelect.length === 0;
    }
  },
  methods: {
    handleTime (date) {
      this.formItem.validTimeRange = date;
    },
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.GroupActivityInfo, {
        activity_id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.items;
          if (data) {
            // 接口的数据结构不一致，初始化和商品选择组件结构一致
            let products = [];
            data.get_collage_group_goods && data.get_collage_group_goods.map(item => {
              products.push({
                id: item.id,
                goods_id: item.goods_id,
                product_id: item.product_id,
                color_name: item.get_products.color_name,
                size_name: item.get_products.size_name,
                product_number: item.get_products.product_number,
                market_price: Number(item.get_products.market_price),
                sale_price: Number(item.get_products.sale_price),
                active_number: Number(item.get_products.limit_qty),
                sale_qty: item.get_products.sale_qty,
                status: item.get_products.is_enabled
              })
            });
            this.formItem = {
              activityName: data.activity_name,
              validTimeRange: [data.from_date, data.to_date],
              activeImage: data.active_image,
              isEnabled: data.is_enabled == '1' ? '1' : '0', //这里有坑
              isAloneBuy: data.is_alone_buy,
              sort: data.sort,
              isShowSaleNumber: data.is_show_sale_number,
              virtualSaleNumber: Number(data.virtual_sale_number),
              joinMans: Number(data.join_mans),
              limitBuys: Number(data.limit_buys),
              validityLimitValue: Number(data.validity_limit_value),
              isStartVirtualGroup: data.is_start_VirtualGroup,
              isCaptainDiscount: Number(data.is_captain_discount) ? '1' : '0',
              leaderDiscountType: Number(data.is_captain_discount) ? (Number(data.is_captain_discount) === 1 ? '1' : '2') : '1',
              discountAmount: Number(data.discount_amount),
              discountRate: Number(data.discount_rate),
              shippingFee: Number(data.shipping_fee),
              freeShippingRule: Number(data.free_shipping_rule) ? '1' : '0',
              freeShippingType: Number(data.free_shipping_rule) ? (Number(data.free_shipping_rule) === 1 ? '2' : '1') : '1',
              shippingAmountValue: Number(data.shipping_amount_value),
              shippingNumValue: Number(data.shipping_num_value),
              activityRemark: data.activity_remark,
              shareImage: data.share_image,
              shareTitle: data.share_title,
              shareRemark: data.share_remark,
              goodsSelect: data.get_collage_group_goods && [
                {
                  goods_name: data.get_collage_group_goods[0].goods_name,
                  goods_sn: data.get_collage_group_goods[0].goods_sn,
                  goods_thumb2: data.get_collage_group_goods[0].get_products.thumb_url,
                  get_products: products
                }
              ],
              goodsSpecSelect: []
            }
            this.$nextTick(() => {
              Object.defineProperty(this, 'orginData', {
                value: JSON.parse(JSON.stringify(this.formItem))
              });
            })
          }
        }
        this.spinShow = false;
      });
    },
    openImagesModal (name, url) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.formItem[name] = item.src;
          if (name === 'activeImage') this.$refs.formValidate.validateField('activeImage');
        }
      });
    },
    handleDelImg (name) {
      this.formItem[name] = '';
    },
    handleSort (bool) {
      this.sortVaild = bool;
    },
    handleLeaderDiscountChange() {
      this.$refs.discountAmount.validateState = '';
      this.$refs.discountRate.validateState = '';
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
    handleValidateTable (bool) {
      this.isValidTable = bool;
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
      // 开始table数据校验，事件是固定的
      this.$emit('validate-table');
      let hasChange = this.id ? (JSON.stringify(this.orginData.goodsSpecSelect) !== JSON.stringify(this.formItem.goodsSpecSelect)) : true;
      let isStatusChangeOnly = false;
      if (this.id) {
        this.orginData.goodsSpecSelect.forEach(item => {
          this.formItem.goodsSpecSelect.some(child => {
            if (
              item.product_id == child.product_id &&
              item.market_price == child.market_price &&
              item.sale_price == child.sale_price &&
              item.active_number == child.active_number &&
              item.status != child.status
            ) {
              isStatusChangeOnly = true;
            }
            return (
              item.product_id == child.product_id &&
              item.market_price == child.market_price &&
              item.sale_price == child.sale_price &&
              item.active_number == child.active_number &&
              item.status != child.status
            )
          });
        })
      }
      this.$refs.formValidate.validate(valid => {
        if (valid && this.isValidTable) {
          this.spinShow = true;
          return this.$ajax.post(this.id ? this.$api.GroupActivityEdit : this.$api.GroupActivityAdd, {
            activity_id: this.id,
            goods_state: hasChange ? (isStatusChangeOnly ? 1 : 2) : 3, // 1: 只改变状态 2: 所有数据修改 3: 没有改动
            activity_name: this.formItem.activityName,
            start_time: this.formItem.validTimeRange[0],
            end_time: this.formItem.validTimeRange[1],
            active_image: this.formItem.activeImage,
            is_enabled: this.formItem.isEnabled,
            is_alone_buy: this.formItem.isAloneBuy,
            sort: this.formItem.sort,
            is_show_sale_number: this.formItem.isShowSaleNumber,
            virtual_sale_number: this.formItem.virtualSaleNumber, //虚拟销量
            join_mans: this.formItem.joinMans, //参与人数
            limit_buys: this.formItem.limitBuys,  //每单限购数量
            validity_limit_value: this.formItem.validityLimitValue, //开团有效期
            is_start_VirtualGroup: this.formItem.isStartVirtualGroup,  //模拟开团 0 未选择 1选中
            is_captain_discount: this.formItem.isCaptainDiscount == 1 ? (this.formItem.leaderDiscountType == 1 ? 1 : 2) : 0,  //团长优惠 0未开启 1立减 2立享
            discount_amount: this.formItem.discountAmount,  //立减的值
            discount_rate: this.formItem.discountRate,  //立享的值
            shipping_fee: this.formItem.shippingFee,  //运费
            free_shipping_rule: this.formItem.freeShippingRule == 1 ? (this.formItem.freeShippingType == 1 ? 2 : 1) : 0, //启用免运费规则 0未启用 1满多少件 2满多少元
            shipping_amount_value: this.formItem.shippingAmountValue, //满多少元的值
            shipping_num_value: this.formItem.shippingNumValue,	//满多少件的值
            activity_remark: this.formItem.activityRemark, //拼团规则描述,
            share_image: this.formItem.shareImage,  //微信分享图片
            share_title: this.formItem.shareTitle,  //微信分享标题
            share_remark: this.formItem.shareRemark,  //微信分享说明
            goods: this.formItem.goodsSpecSelect.map(item => {
              return {
                id: item.id,
                goods_id: item.goods_id,
                product_id: item.product_id,
                market_price: item.market_price,
                sale_price: item.sale_price,
                product_number: item.active_number, //活动库存
                is_enabled: item.status,
                sale_qty: item.sale_qty
              }
            })
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
.group-activity-form{
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .time_range{
    width: 340px;
  }
}
</style>
<style lang="less" scoped>
.group-activity-select-wrapper{
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
