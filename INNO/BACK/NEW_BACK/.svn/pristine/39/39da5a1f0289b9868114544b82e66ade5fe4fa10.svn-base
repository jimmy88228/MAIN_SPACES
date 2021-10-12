<style lang="less">
</style>

<template>
	<div>
		<Modal
	        v-model="modalShow"
	        :title="modalTitle"
	        :loading="modalLoading"
	        :width="700"
	        @on-ok="modalOk">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">

		        <FormItem label="日志状态" prop="status">
		            <i-switch v-model="formItem.status_format" size="large">
		                <span slot="open">通过</span>
		                <span slot="close">不过</span>
		            </i-switch>
		        </FormItem>

				<FormItem label="详细内容">
					<div v-html="formItem.content"></div>
				</FormItem>
	        </Form>

	    </Modal>
	</div>
</template>

<script>
import util from '@/libs/util.js';

export default {
  name: 'commentForm',
  components: {

  },
  data () {
    return {
        	// 模态框
        	modalShow: false,
        	modalEditIndex: '',
        	modalTitle: '编辑/审核评论',
        	modalLoading: true,

        	// 表单数据规则
        	ruleValidate: {
        // messageTitle:[{ required: true, message: '消息标题不能为空', trigger: 'blur' },],
        	},

        	// 表单内容
        	formItem: {
        		status_format: false,
        		content: ''
        	},

        	row: {}
    }
  },
  methods: {
    init () {
    },
    // 打开模态框
    openModel (row) {
      this.row = row;
      this.formItem.content = row.content;

      this.modalShow = true;
        	// 重置表单
        	this.$refs.formValidate.resetFields();
    },
    // 点击确认按钮事件
    modalOk () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	var status = this.formItem.status_format == true ? 1 : 3;
                	this.modalLoading = true;

                	// ajax 保存数据
                	util.ajax.post(util.apiUrl.commentEdit, {
                		id: this.row.id,
                		status: status
	            	})
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		    				// 保存成功
	                        this.$Message.success(res.message);
	                        this.modalShow = false;
	                        this.modalLoading = false;

	                        this.$emit('on-success', {
	                        	status: status,
	                        	status_format: status == 1 ? '通过' : '不通过'
	                        });
	                    } else {
		    				this.modalShow = true;
                    		this.$Message.error(res.message);

                    		this.modalLoading = false;
		                    setTimeout(() => {
			                    this.modalLoading = true;
			                }, 50);
		    			}
		    		});
        } else {
                	// 验证失败，不关闭模态框
                	this.modalShow = true;
          this.$Message.error('必填项不能为空！');
          this.modalLoading = false;

          setTimeout(() => {
	                    this.modalLoading = true;
	                }, 50);
        }
      });
    }
  },
  mounted () {
    this.init();
  }
};
</script>
