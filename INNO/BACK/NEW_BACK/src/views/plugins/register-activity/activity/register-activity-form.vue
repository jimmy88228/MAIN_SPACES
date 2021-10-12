<template>
  <PageTopBase isSave @save="confirm">
    <div class="time-limit-form">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
        <FormItem label="活动名称" prop="activity_name">
          <Input v-model="formItem.activity_name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
        </FormItem>
        <FormItem label="活动时间" prop="validTimeRange">
          <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleTime"></DatePicker>
        </FormItem>
        <FormItem label="设置礼包">
          <FormItem prop="gift_points" label="积分" :label-width="50">
            <InputNumber :min="0" v-model="formItem.gift_points"></InputNumber>
          </FormItem>
          <FormItem prop="gift_bonus" label="优惠券" :label-width="65">
            <coupon-select :data="formItem.gift_bonus" type="checkbox" @del-tag="e => handleCoupon('gift_bonus', e)">
              <Button type="dashed" @click="handleSelected('gift_bonus')" class="basic_select">选择优惠券</Button>
            </coupon-select>
          </FormItem>
          <FormItem prop="gift_activity_id" label="抽奖机会" :label-width="80">
            <Select v-model="formItem.gift_activity_id" class="basic_select">
              <Option value="0">2</Option>
              <Option value="1">4</Option>
            </Select>
            <InputNumber :min="0" v-model="formItem.gift_activity_num"></InputNumber>
          </FormItem>
        </FormItem>
        <FormItem label="活动背景图片" prop="background_image">
          <image-edit :img="formItem.background_image" @selectImg="openImagesModal('background_image', formItem.background_image )" @delImg="handleDelImg('background_image')">
            <p class="strong_tips">活动图片宽度会自动满屏显示，图片尺寸最佳是640*1008，格式为 jpg 或 png，图片大小控制在200KB</p>
          </image-edit>
        </FormItem>
        <FormItem label="提示框背景图片" prop="dialog_box">
          <image-edit :img="formItem.dialog_box" @selectImg="openImagesModal('dialog_box', formItem.dialog_box )" @delImg="handleDelImg('dialog_box')">
            <p class="strong_tips">活动图片宽度会自动满屏显示，图片尺寸最佳是300*250，格式为 jpg 或 png，图片大小控制在200KB</p>
          </image-edit>
        </FormItem>
        <FormItem label="微信推送图片" prop="activity_image">
          <image-edit :img="formItem.activity_image" @selectImg="openImagesModal('activity_image', formItem.activity_image )" @delImg="handleDelImg('activity_image')">
            <p class="strong_tips">图片尺寸最佳是500*400，格式为 jpg 或 png，图片大小控制在1MB</p>
          </image-edit>
        </FormItem>
        <FormItem label="微信分享图片" prop="share_image">
          <image-edit :img="formItem.share_image" @selectImg="openImagesModal('share_image', formItem.share_image )" @delImg="handleDelImg('share_image')">
            <p class="strong_tips">图片尺寸最佳是500*400，格式为 jpg 或 png，图片大小控制在1MB</p>
          </image-edit>
        </FormItem>
        <FormItem label="微信分享标题" prop="share_title">
          <Input v-model="formItem.share_title" placeholder="请输入分享标题" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
        </FormItem>
        <FormItem label="微信分享描述" prop="share_desc">
          <Input
            type="textarea"
            class="basic_textarea basic_textarea"
            v-model="formItem.share_desc"
            placeholder="请输入微信分享描述"
            :rows="3"
            :maxlength="150"
            show-word-limit/>
        </FormItem>
        <FormItem label="活动描述" prop="activity_desc">
          <Input
            type="textarea"
            class="basic_textarea basic_textarea"
            v-model="formItem.activity_desc"
            placeholder="活动描述"
            :rows="3"
            :maxlength="150"
            show-word-limit/>
        </FormItem>
        <FormItem prop="tag_id" label="打标签">
          <tag-select :data="formItem.tag_id" type="checkbox" @del-tag="handleTag">
            <Button type="dashed" @click="handleTagSelected" class="basic_select">选择标签</Button>
          </tag-select>
        </FormItem>
      </Form>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import Control from '@/libs/page-control';
import CouponSelect from '@/views/my-components/list-component/index-edit';
import TagSelect from '@/views/my-components/list-component/index-edit';

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
    CouponSelect,
    TagSelect
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
    return {
      formItem: {
        activity_name: '',
        validTimeRange: [],
        from_time: '',
        to_time: '',
        gift_points: 0,
        gift_bonus: [],
        gift_activity_id: '0',
        gift_activity_num: 0,
        background_image: '',
        dialog_box: '',
        activity_image: '',
        share_image: '',
        share_title: '',
        share_desc: '',
        activity_desc: '',
        tag_id: []
      },
      ruleValidate: {
        activity_name: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}]
      },
      spinShow: false
    }
  },
  methods: {
    handleTime ([from_time, to_time]) {
      this.formItem.from_time = from_time;
      this.formItem.to_time = to_time;
    },
    handleTagSelected () {
      this.$selectContent({
        mode: 'tag',
        type: 'checkbox',
        data: this.formItem.tag_id,
        getList: (data) => {
          this.formItem.tag_id = data;
        }
      });
    },
    handleTag (data) {
      this.formItem.tag_id = data;
    },
    handleSelected (key) {
      this.$selectContent({
        mode: 'coupon',
        type: 'checkbox',
        data: this.formItem[key],
        getList: (data) => {
          this.formItem[key] = data;
          this.$refs.formValidate.validateField(key);
        }
      });
    },
    handleCoupon (key, data) {
      this.formItem[key] = data;
      this.$refs.formValidate.validateField(key);
    },
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.registerActivityInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.items;
          if (data) {
            this.formItem = Object.assign({}, data, {
              validTimeRange: [data.from_time, data.to_time],
              gift_points: +data.gift_points,
              gift_activity_num: +data.gift_activity_num,
              gift_bonus: data.gift_bonus_data,
              tag_id: data.tag_arr
            });
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
          this.$refs.formValidate.validateField(name);
        }
      });
    },
    handleDelImg (name) {
      this.formItem[name] = '';
    },
    confirm () {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.spinShow = true;
          return this.$ajax.post(this.id ? this.$api.registerActivityEdit : this.$api.registerActivityAdd, {
            id: this.id,
            activity_name: this.formItem.activity_name,
            receive_type: 1, //没啥卵用
            from_time: this.formItem.from_time,
            to_time: this.formItem.to_time,
            gift_points: this.formItem.gift_points,
            gift_bonus: this.formItem.gift_bonus.map(item => item.id).join(),
            gift_activity_id: 0,
            gift_activity_num: this.formItem.gift_activity_num,
            background_image: this.formItem.background_image,
            dialog_box: this.formItem.dialog_box,
            activity_image: this.formItem.activity_image,
            share_image: this.formItem.share_image,
            share_desc: this.formItem.share_desc,
            share_title: this.formItem.share_title,
            activity_desc: this.formItem.activity_desc,
            tag_id: this.formItem.tag_id.map(item => item.id).join()
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
.time-limit-form{
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
</style>
