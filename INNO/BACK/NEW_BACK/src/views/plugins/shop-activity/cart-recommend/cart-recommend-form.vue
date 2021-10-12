<template>
  <div>
    <Modal
      class="cart-ecommend-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <Form ref="formValidate" :model="formItem"  :rules="ruleValidate" :label-width="120">
          <FormItem label="活动推荐名称" prop="active_name">
            <Input v-model="formItem.active_name" placeholder="请输入活动推荐名称"></Input>
          </FormItem>
          <FormItem label="是否启用" prop="is_enabled">
            <i-switch v-model="formItem.is_enabled" size="large" true-value="1" false-value="0" @on-change="handleSwitchChange">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          <FormItem
            ref="dateRange"
            label="时间范围"
            prop="dateRange"
            v-if="formItem.is_enabled == 1"
            :rules="[{type: 'change', type: 'array', checkValidRange}]"
            :show-message="formItem.is_enabled == 1">
            <DatePicker type="datetimerange" placeholder="请选择时间范围" style="width: 340px;" v-model="formItem.dateRange" @on-change="handleChange"></DatePicker>
          </FormItem>
          <FormItem label="选择页面" prop="page_id">
            <Select v-model="formItem.page_id">
              <Option v-for="item in pageList" :key="item.page_id" :value="item.page_id">{{item.page_name}}</Option>
            </Select>
          </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';

export default {
  mixins: [Dialog],
  data () {
    return {
      formItem: {
        active_name: '',
        is_enabled: '0',
        dateRange: [],
        page_id: '',
        id: 0
      },
      pageList: [],
      // 表单数据规则
      ruleValidate: {
        active_name: [{ required: true, message: '活动推荐名称不能为空', trigger: 'blur' }],
        page_id: [{ required: true, message: '页面不能为空', trigger: 'change', type: 'number' }]
      }
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
    handleChange (val) {
      this.formItem.dateRange = val;
    },
    handleSwitchChange () {
      this.$refs.dateRange && (this.$refs.dateRange.validateState = '');
    },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post((this.formItem.id === 0 ? this.$api.cartRecommendAdd : this.$api.cartRecommendEdit), {
            id: this.formItem.id,
            is_enabled: this.formItem.is_enabled,
            stime: this.formItem.dateRange[0] || '',
            etime: this.formItem.dateRange[1] || '',
            active_name: this.formItem.active_name,
            page_id: this.formItem.page_id
	          })
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		    				// 保存成功
                this.$Message.success(res.message);
                this.modalShow = false;

                // 把数据返回给父级
                this.$emit('on-success', {
                  type: this.formItem.id === 0 ? 'add' : 'edit',
                  data: res.data
                });
	              } else {
		    				this.showLoading();
		    			}
		    		});
        } else {
          // 验证失败，不关闭模态框
          this.showLoading();
        }
      });
    },
    // 打开模态框
    setData (row) {
    // 重置表单
      this.$refs.formValidate.resetFields();
      this.formItem.dateRange = []; //这里无法被api重置到，手动清空

    // 初始化表单数据
      this.formItem.id = typeof (row.id) !== 'undefined' ? Number(row.id) : 0;
      if (this.formItem.id === 0) {
        this.modalTitle = '添加活动';
      } else {
        this.modalTitle = '编辑活动';
        this.formItem.active_name = row.active_name;
        this.formItem.is_enabled = row.is_enabled;
        this.formItem.page_id = Number(row.page_id);
        this.formItem.dateRange = [row.stime, row.etime];
      }

      this.loadData();
      return this;
    },
    loadData () {
      return this.$ajax.post(this.$api.cartRecommendInfo, {
        id: this.formItem.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          if (!res.data) return false;
          const {pageList} = res.data;
          this.pageList = pageList;
        }
      });
    },
  }
}
</script>
