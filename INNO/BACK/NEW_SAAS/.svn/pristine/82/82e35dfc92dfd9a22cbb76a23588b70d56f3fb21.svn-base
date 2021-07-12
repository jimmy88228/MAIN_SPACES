<style lang="less">
.credits-form{

}
</style>

<template>
	<div>
		<Modal
	        v-model="modalShow"
	        :title="modalTitle"
	        :loading="modalLoading"
	        class="credits-form"
	        @on-ok="modalOk">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="150">

		        <FormItem :label="formItem.name" prop="val">
		            <Input v-model="formItem.val" placeholder="请输入可获得的成长值" style="width:200px"></Input>
		        </FormItem>
		        <FormItem>
		        	{{formItem.desc}}
		        </FormItem>
	        </Form>
	   	</Modal>

	</div>
</template>

<script>
import util from '@/libs/util.js';

export default {
  name: 'creditsForm',
  components: {

  },
  props: {

  },
  data () {
    return {
        	// 表单内容
        	formItem: {
        	},

        	// 表单数据规则
        	ruleValidate: {
        	},

        	// 模态框
        	modalShow: false,
        	modalTitle: '配置成长值',
        	modalLoading: true
    }
  },
  methods: {
    	// 初始化方法
    init () {
    },
    // 打开模态框
    openModal (row) {
        	this.modalShow = true;

    		// 初始化表单数据
      this.formItem.name = row.name;
      this.formItem.val = row.val;
      this.formItem.desc = row.desc;
      this.formItem.key = row.key;
    },
    // 模态框确认事件
    modalOk () {
        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	// ajax 保存编辑数据
                	util.ajax.post(util.apiUrl.creditsEdit, {
                		key: this.formItem.key,
                		val: this.formItem.val,
                		name: this.formItem.name
                	})
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		    				// 保存成功
	                        this.$Message.success(res.message);
	                        this.modalShow = false;

                        	// 回调给列表
                        	this.$emit('on-save', {});
	                    } else {
		    				this.modalShow = true;
                    		this.$Message.error(res.message);
                    		this.modalLoading = false;

	                        setTimeout(() => {
			                    this.modalLoading = true;
			                }, 50);
		    			}
		    		});
        }
      });
    }
  },
  mounted () {
    this.init();
  }
}
</script>
