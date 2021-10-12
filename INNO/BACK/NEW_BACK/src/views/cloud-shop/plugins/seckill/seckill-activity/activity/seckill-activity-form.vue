<template>
  <PageTopBase>
    <template v-slot:action>
      <div class="steps">
        <Steps :current="currentStep">
            <Step title="填写秒杀活动信息" @click.native="handleStep(0)" style="cursor: pointer;"></Step>
            <Step title="完善活动商品信息" @click.native="handleStep(1)" style="cursor: pointer;"></Step>
            <Step title="完善广告信息" @click.native="handleStep(2)" style="cursor: pointer;"></Step>
        </Steps>
      </div>
    </template>
    <transition-group name="fade">
      <div class="seckill-activity-form" v-show="showMan.showBaisc" key="basic">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140" v-friendly-errors>
          <FormItem label="活动名称" prop="name">
            <Input v-model="formItem.name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="活动时间" prop="validTimeRange">
            <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleChange"></DatePicker>
          </FormItem>
          <FormItem label="资格开放时间" prop="ready_time">
            <DatePicker 
              v-model="formItem.ready_time"
              type="datetime"
              :disabled="!formItem.start_time"
              placeholder="请选择资格开放时间"
              :options="disabledTime"
              ></DatePicker>
          </FormItem>
           <FormItem label="活动显示时间" prop="validShowTimeRange">
            <DatePicker v-model="formItem.validShowTimeRange" type="datetimerange" placeholder="请选择活动显示时间" class="time_range" @on-change="handleShowChange"></DatePicker>
            <p class="strong_tips">*控制秒杀活动在小程序商城的显示时间</p>
          </FormItem>
          <FormItem label="活动图片" prop="picture">
            <image-edit :img="formItem.picture" @selectImg="openImagesModal('picture', formItem.picture )" @delImg="handleDelImg('picture')">
              <p class="strong_tips">图片尺寸最佳是700*550，格式为 jpg 或 png，图片大小控制在500KB</p>
            </image-edit>
          </FormItem>
          <FormItem label="允许使用的优惠券" prop="coupons">
            <coupon-select :data="formItem.coupons" type="checkbox" @del-tag="handleCouponClose">
              <Button type="dashed" @click="handleCouponSelected" class="basic_select">{{couponText}}</Button>
            </coupon-select>
            <p class="strong_tips">*不选优惠券，则活动不允许使用优惠券</p>
          </FormItem>
          <FormItem label="是否开启" prop="enable">
            <i-switch v-model="formItem.enable" true-value="1" false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          <FormItem label="限制新会员助力" prop="limit_new_user">
            <i-switch v-model="formItem.limit_new_user" true-value="1" false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
            <p class="strong_tips">注册时间24小时以内判定为新会员</p>
          </FormItem>
          <FormItem label="商品布局">
            <RadioGroup v-model="formItem.layout_type">
              <Radio label="1">一行1个</Radio>
              <Radio label="2">一行2个</Radio>
              <Radio label="3">一行3个</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="享受优惠会员等级" prop="user_level">
            <UserRank :value.sync="formItem.user_level"/>
          </FormItem>
          <FormItem label="邀请条件" prop="share_condition">
            <InputNumber :min="0" v-model="formItem.share_condition"></InputNumber>
            <span>人助力</span>
            <p class="strong_tips">设置为0人助力，则不需要邀请好友即可购买秒杀商品</p>
          </FormItem>
          <FormItem label="助力次数限制" prop="limit_help_count">
            <InputNumber :min="0" v-model="formItem.limit_help_count"></InputNumber>
            <span>次</span>
            <p class="strong_tips">每场活动帮助其他用户助力次数限制。设置为0，则为不限制</p>
          </FormItem>
          <FormItem label="活动限购" prop="limit_count">
            <InputNumber :min="0" v-model="formItem.limit_count"></InputNumber>
            <span>件</span>
            <p class="strong_tips">设置为0，则为不限购</p>
          </FormItem>
          <FormItem label="运费" prop="shipping_fee">
            <InputNumber :min="0" v-model="formItem.shipping_fee"></InputNumber>
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
          <FormItem label="活动规则" prop="rules">
            <Input
              type="textarea"
              class="basic_textarea"
              v-model="formItem.rules"
              placeholder="请输入活动规则"
              :rows="3"
              :maxlength="150"
              show-word-limit/>
          </FormItem>
          <FormItem label="微信分享标题" prop="share_title">
            <Input v-model="formItem.share_title" placeholder="请输入微信分享标题" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="微信分享图片" prop="share_img">
            <image-edit :img="formItem.share_img" @selectImg="openImagesModal('share_img', formItem.share_img )" @delImg="handleDelImg('share_img')">
              <p class="strong_tips">图片尺寸最佳是360*360，格式为 jpg 或 png，图片大小控制在200KB</p>
            </image-edit>
          </FormItem>
        </Form>
      </div>
      <div v-show="showMan.showGoods" key="goods" class="seckill-activity-select-wrapper">
        <Button type="dashed" @click="handleSelect" class="basic_select">选择商品</Button>
        <goods-page-table ref="goodsTable" :id="id" :goods-data="selectedData" :activityStoreStock="activityStoreStock" @get-data="handlePageData" @get-edit-data="handleEditData"></goods-page-table>
      </div>
      <div v-show="showMan.showTopAd" key="topAd">
        <AdPage ref="adPage" :data="adPageData"/>
      </div>
    </transition-group>
    <template v-slot:footer>
      <Divider />
      <div style="text-align: center;">
        <Button type="default" @click="goBack">取消</Button>
        <Button type="primary" @click="confirm" v-show="currentStep === 2">保存</Button>
        <Button type="success" @click="next" v-show="currentStep >= 0 && currentStep < 2">下一步</Button>
        <Button type="success" @click="foward" v-show="currentStep > 0">上一步</Button>
      </div>
    </template>
    <multi-norms ref="multiNorms" title="选择可用商品" :selected="selectedData" @get-data="handleData" requestName="ShopGoodsList"></multi-norms>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import EditSort from '@/views/my-components/edit-sort/edit-sort';
import CouponSelect from '@/views/my-components/list-component/index-edit';
import Control from '@/libs/page-control';
import goodsSelect from './goods-select';
import MultiNorms from '@/views/my-components/multi-norms/index';
import GoodsPageTable from './goods-page-table';
import AdPage from './ad-page';
import UserRank from '@/views/my-components/user-rank/index';

export default {
  props: ['id'],
  components: {
    PageTopBase,
    ImageEdit,
    EditSort,
    goodsSelect,
    CouponSelect,
    MultiNorms,
    GoodsPageTable,
    AdPage,
    UserRank
  },
  mixins: [Control],
  data () {
    const _this = this
    const checkValidRange = (rule, value, callback) => {
      if (!value[0] && !value[1]) {
        callback(new Error('活动时间不能为空'));
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
      formItem: {
        name: '',
        validTimeRange: [],
        validShowTimeRange: [],
        start_time: '',
        end_time: '',
        show_start_time: '',
        show_end_time: '',
        ready_time: '',
        picture: '',
        enable: '0',
        coupons: [],
        limit_new_user: '0',
        layout_type: '1',
        user_level: [],
        share_condition: 0,
        limit_help_count: 0,
        limit_count: 1,
        shipping_fee: 0,
        isFreeShipping: '0',
        freeShippingType: '1',
        freeShippingPrice: 0,
        freeShippingNumber: 0,
        rules: '',
        share_title: '',
        share_img: '',
        goodsSelect: [],
        goodsSpecSelect: []
      },
      ruleValidate: {
        name: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        // coupons: [{required: true, trigger: 'change', type: 'array', min: 1, message: '优惠券不能为空'}],
        user_level: [{required: true, trigger: 'change', type: 'array', min: 1, message: '请选择会员等级'}],
        ready_time: [{required: true, message: '资格开放时间不能为空', trigger: 'change', type: 'date'}],
        picture: [{required: true, message: '活动图片不能为空', trigger: 'change'}],
        limit_help_count: [{required: true, message: '助力次数限制不能为空', trigger: 'blur', type: 'number'}],
        share_condition: [{required: true, message: '邀请条件不能为空', trigger: 'blur', type: 'number'}],
        limit_count: [{required: true, message: '活动限购不能为空', trigger: 'blur', type: 'number'}],
        shipping_fee: [{required: true, message: '运费不能为空', trigger: 'blur', type: 'number'}]
      },
      freeShippingPriceRule: [
        {trigger: 'blur', type: 'number', validator: checkfreeShippingPriceRule}
      ],
      freeShippingNumRule: [
        {trigger: 'blur', type: 'number', validator: checkfreeShippingNumRule}
      ],
      sortVaild: false,
      currentStep: 0,
      showMan: {
        showBaisc: true,
        showGoods: false,
        showTopAd: false
      },
      showMap: {
        '0': 'showBaisc',
        '1': 'showGoods',
        '2': 'showTopAd'
      },
      selectedData: [],
      spinShow: false,
      adPageData: {},
      disabledTime: {
          disabledDate (date) {
            if(!_this.formItem.start_time) return false;
            return date && date.valueOf() > (new Date(_this.formItem.start_time)).getTime();
          }
      },
			activityStoreStock: {}
    }
  },
  computed: {
    couponText () {
      const len = this.formItem.coupons.length;
      return len > 0 ? `选择优惠券(已选${len}张)` : '选择优惠券';
    }
  },
  methods: {
    loadAdData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.cloudSeckillActivityAdvertInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data;
          this.adPageData = data;
          console.log(this.adPageData)
        }
        this.spinShow = false;
      });
    },
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.cloudSeckillActivityInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.items;
          data && (this.formItem = {
            ...data,
            user_level: data.rank_data.map(item => item.id),
            isFreeShipping: +data.free_shipping ? '1' : '0',
            freeShippingType: +data.free_shipping ? data.free_shipping : '1',
            freeShippingPrice: +data.free_shipping === 1 ? +data.free_shipping_limit : 0,
            freeShippingNumber: +data.free_shipping === 2 ? +data.free_shipping_limit : 0,
            validTimeRange: [data.start_time, data.end_time],
            validShowTimeRange: [data.show_start_time, data.show_end_time],
            share_condition: +data.share_condition,
            limit_help_count: +data.limit_help_count,
            limit_count: +data.limit_count,
            shipping_fee: +data.shipping_fee,
            coupons: data.bouns_data //待对接
          });
          let goodData = data.get_activity_goods.map(item => {
            return {
              ...item,
              get_products: item.sku_data
            }
          })
          this.handleData(goodData);
					this.activityStoreStock = data.activity_store_stock || {};
        }
        this.spinShow = false;
      });
    },
    handleChange ([start_time, end_time]) {
      this.formItem.start_time = start_time;
      this.formItem.end_time = end_time;
      if(!start_time){
        this.formItem.ready_time='';
      }
    },
    handleShowChange ([start_time, end_time]) {
      this.formItem.show_start_time = start_time;
      this.formItem.show_end_time = end_time;
    },
    handlePageData (data) {
      this.selectedData = data;
    },
    handleEditData (key, index, value) {
      this.selectedData[index][key] = value;
    },
    handleData (data) {
      let rebuildData = JSON.parse(JSON.stringify(data)).filter(item => {
        item._checked = false;
        item.price = item.price || 0;
        item.sale_number = item.sale_number || 0;
        item.goodsInventory = item.goodsInventory || 0;
        item.limit_count = +item.limit_count || 0;
        item.fake_sales = +item.fake_sales || 0;
        item.sort = +item.sort || 0;
        item.enable = +item.enable || 0;
        item.allow_direct_buy = +(item.allow_direct_buy) || 0;
        item.task_data = item.task_data && item.task_data.length ? item.task_data : [];
        item.get_products.forEach(c => {
          c.sale_number = c.sale_number || 0;
          c.product_number = c.product_number || 0;
          c.market_price = +c.market_price || 0;
          c.price = +c.price || 0;
          c.inventory = +c.inventory || 0;
          c.enable = +c.enable || 0;
          c.is_sellout = +c.is_sellout || 0;
        });
        return item;
      });
      this.selectedData = rebuildData;
    },
    openImagesModal (name, url) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.formItem[name] = item.src;
          this.$refs.formValidate.validateField(name);
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
      this.$refs.multiNorms.setData().show();
        // this.$selectContent({
        //     mode: "cloud-goods",
        //     getList:()=>{
        //
        //     }
        // })
    },
    handleSpecData (specData) {
      this.formItem.goodsSpecSelect = specData;
    },
    handleCouponSelected () {
      this.$selectContent({
        mode: 'coupon',
        type: 'checkbox',
        data: this.formItem.coupons,
        getList: (data) => {
          this.formItem.coupons = data;
          this.$refs.formValidate.validateField('coupons');
        }
      });

        this.$selectContent({
            mode: 'cloud-goods',
            type: 'checkbox',
            data: this.formItem.goodsSelect,
            getList: (data) => {
                this.formItem.goodsSelect = data;
                this.$refs.formValidate.validateField('goodsSelect');
            }
        });
    },
    handleCouponClose (data) {
      this.formItem.coupons = data;
      this.$refs.formValidate.validateField('coupons');
    },
    handleClear () {
      this.formItem.goodsSelect = [];
    },
    showModule () {
      const moduleStr = this.showMap[this.currentStep];
      for (let key in this.showMan) {
        this.showMan[key] = false;
      }
      this.showMan[moduleStr] = true;
    },
    next () {
      if (this.currentStep === 0) {
        this.$refs.formValidate.validate(valid => {
          if (valid) {
            this.currentStep++;
            this.showModule();
          }
        })
      } else if (this.currentStep === 1) {
        this.$refs.goodsTable.checkValidate(valid => {
          if (valid) {
            this.currentStep++;
            this.showModule();
          }
        })
      }
    },
    foward () {
      this.currentStep--;
      this.showModule();
    },
    handleStep (step) {
      const diff = step - this.currentStep;
      for (let i = 0, len = Math.abs(diff); i < len; i++) {
        if (diff > 0) {
          this.next();
        } else if (diff < 0) {
          this.foward();
        }
      }
    },
    goBack () {
      this.$router.go(-1);
    },
    confirm () {
      this.$refs.adPage.getData((adData) => {
        this.$refs.formValidate.validate(valid => {
          if (valid) {
            this.selectedData.forEach(item => {
              item['sku_data'] = item.get_products; //接口改字段了 => get_products => sku_data
            });
            this.spinShow = true;
            return this.$ajax.post(this.id ? this.$api.cloudSeckillActivityEdit : this.$api.cloudSeckillActivityAdd, {
              ...this.formItem,
              user_level: this.formItem.user_level.join(),
              free_shipping: +this.formItem.isFreeShipping ? (+this.formItem.freeShippingType) : 0,		//运费规则 0关 1 满元 2满件
              free_shipping_limit: +this.formItem.isFreeShipping ? (+this.formItem.freeShippingType === 1 ? this.formItem.freeShippingPrice : this.formItem.freeShippingNumber) : 0,
              bonus_ids: this.formItem.coupons.map(item => item.id).join(),
              goods_data: this.selectedData,
              banner_data: adData,
              id: this.id,
              goods_data_state: 2,
              banner_data_state: 5
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
      })
    }
  },
  watch: {
    "$route.params.showgoods":{
          handler(nV) {
           if(Number(nV)>0){
            this.currentStep++;
            this.showModule();
           }
          },
          immediate: true  
    },
    currentStep(nV) {
      if (nV === 2) {
        if (this.id) this.loadAdData();
      }
    }
  },
  mounted () {
    if (this.id) this.loadData();
  }
}
</script>

<style lang="less">
.seckill-activity-form{
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .time_range{
    width: 340px;
  }
}
</style>
<style lang="less" scoped>
.seckill-activity-select-wrapper{
  text-align: center;
}
.steps{
  position: absolute;
  width: 80%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
