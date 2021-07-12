<template>
  <div>
    <PageTopBase isSave @save="confirm">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
        <FormItem label="模板名称" prop="active_name">
          <Input v-model="formItem.active_name" placeholder="请输入模板名称" class="basic_input"></Input>
        </FormItem>
        <FormItem label="活动时间" prop="time_type">
          <RadioGroup v-model="formItem.time_type" @on-change="handleTypeChange">
            <Radio label="0">不限</Radio>
            <Radio label="1">时间范围</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          label="时间范围"
          ref="dateRange"
          v-if="formItem.time_type == 1"
          prop="dateRange"
          :rules="[{required: true, message: '有效期不能为空', trigger: 'change', type: 'array', validator: checkValidRange}]"
          :show-message="formItem.time_type == 1">
          <DatePicker type="datetimerange" placeholder="请选择有效期" style="width: 340px;" v-model="formItem.dateRange" @on-change="handleChange"></DatePicker>
        </FormItem>
        <UniversalTemplate ref="editTemplate" :selected="formItem.selectedData"></UniversalTemplate>
      </Form>
    </PageTopBase>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import UniversalTemplate from '@/views/my-components/custom-module/universal/index';

export default {
  props: ['id'],
  components: {
    PageTopBase,
    UniversalTemplate
  },
  data () {
    return {
      formItem: {
        active_name: '',
        time_type: '0',
        dateRange: [],
        stime: '',
        etime: '',
        selectedData: []
      },
      selectCoupon: [],
      ruleValidate: {
        active_name: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }]
      },
      spinShow: false
    }
  },
  methods: {
    checkValidRange (rule, value, callback) {
      if (!value[0] && !value[1]) {
        callback(new Error('活动时间不能为空'));
      } else {
        callback();
      }
    },
    handleTypeChange() {
       this.$refs.dateRange && (this.$refs.dateRange.validateState = '');
    },
    handleChange ([stime, etime]) {
      this.formItem.dateRange = [stime, etime];
      this.formItem.stime = stime;
      this.formItem.etime = etime;
    },
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.cloudGoodsRecommendInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data;
          data && (this.formItem = {
            ...data,
            dateRange: [data.stime, data.etime],
            selectedData: data.get_goods_recommended_template_modules.map(item => {
              return {
                type: +item.bind_type,
                lineType: item.get_goods_recommended_template_item.length,
                adList: item.get_goods_recommended_template_item.map(c => {
                  return {
                    pic: c.img_path,
                    name: c.tag,
                    linkType: c.func_type,
                    linkUrl: c.link_url,
                    related_id: c.related_id,
                    related_data: c.related_data
                  }
                })
              }
            })
          });
        }
        this.spinShow = false;
      });
    },
    confirm () {
      let result = this.$refs.editTemplate.$children[0].data;
      if (!result.length) {
        this.$Message.error('请完善内容！');
      }
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.spinShow = true;
		  if(this.formItem.time_type != 1){
			  this.formItem.dateRange = [];
		  }
          return this.$ajax.post(this.id ? this.$api.cloudGoodsRecommendEdit : this.$api.cloudGoodsRecommendAdd, {
            ...this.formItem,
            id: this.id,
            ids_list_state: 2,
            ids_list: result
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
      });
    }
  },
  mounted () {
    if (this.id) this.loadData();
  }
}
</script>
