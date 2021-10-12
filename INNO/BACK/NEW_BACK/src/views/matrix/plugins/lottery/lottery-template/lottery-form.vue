<template>
  <div>
    <Modal
      class="lottery-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="maskClose"
      @on-ok="confirm">
        <Form ref="formValidate" :model="formItem"  :rules="ruleValidate" :label-width="80">
          <FormItem label="是否启用" prop="is_enabled">
            <i-switch true-value="1" false-value="0" size="large" v-model="formItem.is_enabled">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          <FormItem label="活动名称" prop="name">
            <Input v-model="formItem.name" placeholder="请输入活动名称"></Input>
          </FormItem>
          <FormItem label="活动时间" prop="validTimeRange">
            <DatePicker v-model="formItem.validTimeRange" type="datetimerange" style="width: 340px;" placeholder="请选择活动时间" class="time_range" @on-change="handleTime"></DatePicker>
          </FormItem>
          <FormItem label="选择页面" prop="page">
            <pages-select :data="formItem.page" type="radio" class="brand_select" @del-tag="handleCloseTag">
              <Button type="dashed" @click="handleSelect('page')" class="basic_select">选择自定义页</Button>
            </pages-select>
          </FormItem>
					<FormItem label="绑定抽奖" prop="activity_ids">
					  <Button type="dashed" @click="handleSelect('activity')" class="basic_select">{{ seletActivitys.length > 0 ? '已选择' + seletActivitys.length + '个活动' : '选择活动'}}</Button>
					</FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Dialog from '@/libs/dialog';
import PagesSelect from '@/views/my-components/list-component/index-edit';

export default {
  mixins: [Dialog],
  components: {
    PagesSelect
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
        id: 0,
        is_enabled: '0',
        name: '',
        validTimeRange: [],
        from_time: '',
        to_time: '',
        page: [],
				activity_ids: []
      },
			seletActivitys: [],
      // 表单数据规则
      ruleValidate: {
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        name: [{ required: true, message: '品牌名称不能为空', trigger: 'blur' }],
        page: [{ required: true, message: '选择页面不能为空', type: 'array', min: 1 }],
				activity_ids: [{ required: true, message: '绑定活动不能为空', type: 'array', min: 1 }],
      }
    }
  },
  methods: {
    handleSelect (type) {
			if(type == 'page'){
				this.$selectContent({
				  mode: 'pages',
				  type: 'radio',
				  data: this.formItem.page,
				  getList: (data) => {
				    this.formItem.page = data;
				    this.$refs.formValidate.validateField('page');
				  }
				})
			} else if(type == 'activity'){
				this.$selectContent({
				  mode: 'lottery',
				  type: 'checkbox',
				  data: this.seletActivitys,
				  getList: (data) => {
				    this.seletActivitys = data;
						let ids = [];
						for(let i = 0; i < data.length; i++){
							ids.push(data[i].activityId)
						}
						this.$set(this.formItem, 'activity_ids', ids);
				  }
				})
			}
     
    },
    handleCloseTag () {
      this.formItem.page = [];
    },
    handleTime ([from_time, to_time]) {
      this.formItem.validTimeRange = [from_time, to_time];
      this.formItem.from_time = from_time;
      this.formItem.to_time = to_time;
    },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post((this.formItem.id === 0 ? this.$api.lotteryTemplateAdd : this.$api.lotteryTemplateEdit), {
            ...this.formItem,
            page_id: this.formItem.page.map(item => item.id).join()
	          })
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		    				// 保存成功
                this.$Message.success(res.message);
                this.modalShow = false;

                // 把数据返回给父级
                this.$emit('on-success');
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
			let activity_data = row.activity_data || [],ids = [];
			for(let i = 0; i < activity_data.length; i++){
				ids.push(activity_data[i].id);
			}
      // 初始化表单数据
      this.formItem = {
        id: row.id ? row.id : 0,
        is_enabled: row.is_enabled ? row.is_enabled : '0',
        name: row.name,
        validTimeRange: row.from_time ? [row.from_time, row.to_time] : [],
        from_time: row.from_time ? row.from_time : '',
        to_time: row.to_time ? row.to_time : '',
        page: row.page_data ? row.page_data : [],
				activity_ids: ids 
      }
			this.seletActivitys = row.activity_data || [];
      if (this.formItem.id === 0) {
        this.modalTitle = '添加活动模板';
      } else {
        this.modalTitle = '编辑活动模板';
      }
      return this;
    }
  }
}
</script>
