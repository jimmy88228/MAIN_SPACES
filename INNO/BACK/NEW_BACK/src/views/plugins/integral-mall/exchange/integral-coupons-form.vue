<template>
  <PageTopBase isSave @save="confirm">
    <div class="kan-activity-form">
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
        <FormItem label="优惠券" prop="couponData">
          <coupon-select :data="formItem.couponData" type="radio" @del-tag="handleStoreClose">
            <Button type="dashed" @click="handleSelected" class="basic_select">选择优惠券</Button>
          </coupon-select>
        </FormItem>
        <FormItem label="是否启用" prop="enable">
          <i-switch size="large" v-model="formItem.enable" true-value="1" false-value="0">
            <span slot="open">启用</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <FormItem label="显示销量" prop="is_show_exchange_number">
          <i-switch v-model="formItem.is_show_exchange_number" true-value="1" false-value="0">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="库存" prop="inventory">
          <InputNumber :min="0" v-model="formItem.inventory"></InputNumber>
        </FormItem>
        <FormItem label="已兑换数量" prop="exchange_number">
          <InputNumber :min="0" v-model="formItem.exchange_number" :disabled="formItem.id != 0"></InputNumber>
        </FormItem>
        <FormItem label="消耗积分" prop="integral">
          <InputNumber :min="1" v-model="formItem.integral"></InputNumber>
        </FormItem>
        <FormItem label="虚拟销量" prop="virtual_exchange_number">
          <InputNumber :min="0" v-model="formItem.virtual_exchange_number"></InputNumber>
        </FormItem>
        <FormItem label="活动排序">
          <edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
        </FormItem>
        <FormItem label="享受优惠会员等级" prop="userRank">
          <Select v-model="formItem.userRank" multiple class="basic_select">
            <Option v-for="item in levelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="购买限制">
          <FormItem label="每人限购次数" prop="limit_count" :label-width="100" class="item_24">
            <InputNumber :min="0" v-model="formItem.limit_count"></InputNumber>
            <span class="strong_tips">每个会员允许参加购买的次数，0表示不限制</span>
          </FormItem>
          <FormItem label="每" prop="limit_day" :label-width="20" class="inline day_line">
            <InputNumber :min="0" v-model="formItem.limit_day"></InputNumber>
            <span>天可以兑换</span>
          </FormItem>
          <FormItem :label-width="0" prop="limit_day_buy_time" class="inline">
            <InputNumber :min="0" v-model="formItem.limit_day_buy_time"></InputNumber>
            <span>次</span>
          </FormItem>
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
    <Spin size="large" fix v-if="spinShow"></Spin>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import EditSort from '@/views/my-components/edit-sort/edit-sort';
import Control from '@/libs/page-control';
import CouponSelect from '@/views/my-components/list-component/index-edit';

export default {
  props: ['id'],
  components: {
    PageTopBase,
    ImageEdit,
    EditSort,
    CouponSelect
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
    const checkLimit = (rule, value, callback) => {
      if (value !== 0 && !value) {
        callback(new Error('限购次数不能为空'));
      } else {
        callback();
      }
    }
    const checkDay = (rule, value, callback) => {
      if (value !== 0 && !value) {
        callback(new Error('天数不能为空'));
      } else {
        callback();
      }
    }
    const checkTimes = (rule, value, callback) => {
      if (value !== 0 && !value) {
        callback(new Error('次数不能为空'));
      } else {
        callback();
      }
    }
    return {
      spinShow: false,
      formItem: {
        name: '',
        validTimeRange: [],
        start_time: '',
        end_time: '',
        picture: '',
        couponData: [],
        enable: '0',
        is_show_exchange_number: '0',
        sort: 0,
        userRank: [],
        limit_count: 0,
        limit_day: 0,
        limit_day_buy_time: 0,
        inventory: 0,
        exchange_number: 0,
        integral: 1,
        virtual_exchange_number: 0,
        isFreeShipping: '0',
        freeShippingPrice: 0,
        exchange_conditions: '',
        goodsSpecSelect: [],
        id: 0
      },
      ruleValidate: {
        name: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        picture: [{required: true, message: '活动图片不能为空', trigger: 'change'}],
        couponData: [{required: true, message: '优惠券不能为空', trigger: 'change', type: 'array', min: 1}],
        limit_count: [{trigger: 'blur', type: 'number', validator: checkLimit}],
        limit_day: [{message: '天数不能为空', trigger: 'blur', type: 'number', validator: checkDay}],
        limit_day_buy_time: [{trigger: 'blur', type: 'number', validator: checkTimes}],
        inventory: [{required: true, message: '库存不能为空', trigger: 'blur', type: 'number'}],
        integral: [{required: true, message: '消耗积分不能为空', trigger: 'blur', type: 'number'}],
        virtual_exchange_number: [{required: true, message: '虚拟销量不能为空', trigger: 'blur', type: 'number'}]
      },
      sortVaild: false,
      levelList: []
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.intergralCouponsInfo, {
        id: this.id || 0
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.items;
          if (data) {
            this.formItem = Object.assign({}, data, {
              validTimeRange: [data.start_time, data.end_time],
              couponData: [data.bonus_data],
              inventory: +data.inventory,
              exchange_number: +data.exchange_number,
              integral: +data.integral,
              virtual_exchange_number: +data.virtual_exchange_number,
              sort: +data.sort,
              limit_count: +data.limit_count,
              limit_day: +data.limit_day,
              limit_day_buy_time: +data.limit_day_buy_time,
              userRank: data.rank_data.map(item => item.id),
              id: data.id
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
    handleSelected (selected) {
      this.$selectContent({
        mode: 'coupon',
        type: 'radio',
        data: this.formItem.couponData,
        getList: (data) => {
          this.formItem.couponData = data;
          this.$refs.formValidate.validateField('couponData');
        }
      });
    },
    handleStoreClose (data) {
      this.formItem.couponData = data;
      this.$refs.formValidate.validateField('couponData');
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
      this.$refs.freeShippingPrice.validateState = '';
      this.$refs.freeShippingNumber.validateState = '';
    },
    confirm () {
      this.$refs.formValidate.validate(valid => {
        if (valid && this.sortVaild) {
          this.spinShow = true;
          return this.$ajax.post(this.id ? this.$api.intergralCouponsEdit : this.$api.intergralCouponsAdd, {
            id: this.id,
            ...this.formItem,
            type_id: this.formItem.couponData.map(item => item.id).join(),
            rank_ids: this.formItem.userRank.join()
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
  .item_24{
    margin-bottom: 24px;
  }
  .inline{
    display: inline-block;
  }
  .day_line{
    width: 180px;
  }
}
</style>



