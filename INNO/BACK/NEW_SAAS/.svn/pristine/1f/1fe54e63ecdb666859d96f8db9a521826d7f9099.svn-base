<template>
  <PageTopBase isSave @save="confirm">
    <div class="coupon-activity-form">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
        <FormItem label="活动名称" prop="activityName">
          <Input v-model="formItem.activityName" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
        </FormItem>
        <FormItem label="活动时间" prop="validTimeRange">
          <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleTime"></DatePicker>
        </FormItem>
        <FormItem label="活动状态" prop="isEnabled">
          <i-switch size="large" v-model="formItem.isEnabled" :true-value="1" :false-value="0">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <FormItem label="活动总数量" prop="total_qtys">
          <InputNumber :min="0" v-model="formItem.total_qtys"></InputNumber>
          <p class="strong_tips">整个活动允许购买的数量</p>
        </FormItem>
        <FormItem label="总购买次数">
          <FormItem :label-width="0" prop="allowBuys">
            <InputNumber :min="0" v-model="formItem.allowBuys"></InputNumber>
            <p class="strong_tips">单个会员享受的次数，0表示不限</p>
          </FormItem>
          <FormItem :label-width="0" prop="perDays" style="display: inline-block;">
            <label>每</label>
            <InputNumber :min="0" v-model="formItem.perDays"></InputNumber>
            <label>天可购买</label>
          </FormItem>
          <FormItem :label-width="0" prop="perTimes" style="display: inline-block;">
            <InputNumber :min="0" v-model="formItem.perTimes"></InputNumber>
            <label>次</label>
          </FormItem>
        </FormItem>
        <FormItem label="付费金额" prop="price">
          <InputNumber :min="0" v-model="formItem.price"></InputNumber>
          <label>人民币</label>
        </FormItem>
        <FormItem label="发放的优惠券" prop="coupons">
          <coupon-select :data="formItem.coupons" type="checkbox" @del-tag="handleCouponClose">
            <Button type="dashed" @click="handleCouponSelected" class="basic_select">选择优惠券</Button>
          </coupon-select>
          <p class="strong_tips">预生成券的可售数量为：当前数量减100，例如预生成200张券实际可售数量为100张</p>
        </FormItem>
        <FormItem label="销量起点" prop="buyTimeFake">
          <InputNumber :min="0" v-model="formItem.buyTimeFake"></InputNumber>
        </FormItem>
        <FormItem label="活动图" prop="imgUrl">
          <image-edit :img="formItem.imgUrl" @selectImg="openImagesModal('imgUrl', formItem.imgUrl )" @delImg="handleDelImg('imgUrl')">
            <p class="strong_tips">图片用于购劵礼包的展示,图片尺寸最佳是650*650，格式为 jpg 或 png，图片大小控制在1M</p>
          </image-edit>
        </FormItem>
        <FormItem label="活动描述" prop="activityDesc">
          <rich-text :rich-text-data="formItem.activityDesc" @get-rich-text="handleRichText"/>
        </FormItem>
      </Form>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import CouponSelect from '@/views/my-components/list-component/index-edit';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import RichText from '@/views/my-components/rich-text/index';

export default {
  props: ['id'],
  components: {
    PageTopBase,
    CouponSelect,
    ImageEdit,
    RichText
  },
  data () {
    const checkValidRange = (rule, value, callback) => {
      if (!value[0] && !value[1]) {
        callback(new Error('活动时间不能为空'));
      } else {
        callback();
      }
    }
    return {
      formItem: {
        activityName: '',
        validTimeRange: [],
        fromTime: '',
        toTime: '',
        isEnabled: 0,
        total_qtys: 0,
        allowBuys: 0,
        perDays: 0,
        perTimes: 0,
        price: 0,
        coupons: [],
        buyTimeFake: 0,
        buyTimeReal: 0, //没啥用
        imgUrl: ''
      },
      ruleValidate: {
        activityName: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        total_qtys: [{required: true, message: '活动总数量不能为空', trigger: 'blur', type: 'number'}],
        price: [{required: true, message: '付费金额不能为空', trigger: 'blur', type: 'number'}],
        coupons: [{required: true, trigger: 'change', type: 'array', min: 1, message: '优惠券不能为空'}],
      },
      spinShow: false
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.couponsBagActivityInfo, {
        activityId: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data;
          if (data) {
            this.formItem = Object.assign({}, data, {
              validTimeRange: [data.fromTime, data.toTime],
              coupons: data.bouns_data
            });
          }
        }
        this.spinShow = false;
      });
    },
    handleTime ([fromTime, toTime]) {
      this.formItem.fromTime = fromTime;
      this.formItem.toTime = toTime;
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
    },
    handleCouponClose (data) {
      this.formItem.coupons = data;
      this.$refs.formValidate.validateField('coupons');
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
    handleRichText (content) {
      this.formItem.activityDesc = content;
    },
    confirm () {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.spinShow = true;
          this.$ajax.post(this.id ? this.$api.couponsBagActivityEdit : this.$api.couponsBagActivityAdd, {
            ...this.formItem,
            activityId: this.id || 0,
            buyTimeReal: this.formItem.buyTimeReal,
            bonus_ids: this.formItem.coupons.map(item => item.id).join(),
            descImgUrl: '', //没啥用
            remark: '' //没啥用
          })
          .then(response => {
            const res = response.data;
            if (res.code) {
              this.data = res.data;
              this.$Message.success(res.message);
              this.$router.go(-1);
            }
            this.spinShow = false;
          });
        }
      });
    }
  },
  mounted () {
    if (this.id) this.loadData();
  }
}
</script>

<style lang="less" scoped>
.coupon-activity-form{
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .time_range{
    width: 340px;
  }
}
</style>

