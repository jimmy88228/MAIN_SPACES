<template>
  <PageTopBase isSave @save="confirm">
    <div class="time-limit-form">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
        <FormItem label="名称" prop="activity_name">
          <Input v-model="formItem.activity_name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
        </FormItem>
        <FormItem label="有效期" prop="validTimeRange">
          <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleDateChange"></DatePicker>
        </FormItem>
        <template slot-scope="{ row }" slot="is_enable">
          <Tag type="dot" :color="row.is_enable === '1' ? 'success' : 'error'">{{row.is_enable === '1'  ? '开启' : '关闭'}}</Tag>
        </template>
        <FormItem label="是否可用" prop="is_enable">
          <i-switch size="large" v-model="formItem.is_enable" true-value="1" false-value="0">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="微信分享标题" prop="share_title">
          <Input v-model="formItem.share_title" placeholder="请输入微信分享标题" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
        </FormItem>
        <FormItem label="活动备注" prop="activity_remark">
          <Input
            type="textarea"
            class="basic_textarea"
            v-model="formItem.activity_remark"
            placeholder="请输入活动备注"
            :rows="3"
            :maxlength="150"
            show-word-limit/>
        </FormItem>
        <FormItem prop="tag_id" label="打标签">
          <tag-select :data="formItem.tag_id" type="checkbox" @del-tag="handleTag">
            <Button type="dashed" @click="handleTagSelected" class="basic_select">选择标签</Button>
          </tag-select>
        </FormItem>
        <FormItem prop="card" label="添加充值卡">
          <Transfer
            :data="cardData"
            :target-keys="formItem.targetKey"
            :render-format="render"
            @on-change="handleChange"></Transfer>
        </FormItem>
      </Form>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import Control from '@/libs/page-control';
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
        is_enable: '0',
        from_time: '',
        to_time: '',
        share_title: '',
        activity_remark: '',
        tag_id: [],
        targetKey: [],
        rechargecard_id: ''
      },
      ruleValidate: {
        activity_name: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        gift_points: [{required: true, message: '充值面额不能为空', trigger: 'blur', type: 'number'}]
      },
      cardData: [],
      spinShow: false
    }
  },
  methods: {
    render () {

    },
    handleChange () {

    },
    handleDateChange ([from_time, to_time]) {
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
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.storeRechargecardActivityInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.items;
          if (data) {
            this.formItem = {
              ...data,
              validTimeRange: [data.from_time, data.to_time],
              tag_id: data.tag_data
            }
          }
        }
        this.spinShow = false;
      });
    },
    confirm () {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.spinShow = true;
          return this.$ajax.post(this.id ? this.$api.storeRechargecardActivityEdit : this.$api.storeRechargecardActivityAdd, {
            ...this.formItem,
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
