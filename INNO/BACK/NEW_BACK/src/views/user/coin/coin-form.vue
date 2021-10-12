<style lang="less">
.coin-form{

}
</style>

<template>
	<div>
		<Modal
	        v-model="modalShow"
	        :title="modalTitle"
	        :loading="modalLoading"
	        class="coin-form"
	        @on-ok="modalOk">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="150">

				<FormItem v-if="formItem.key=='coin_expire'" :label="formItem.name" prop="val">
					<!--有效期-->
					<RadioGroup v-model="formItem.val" @on-change="radioChange" vertical>
				        <Radio label="forever">
				            <span>永久有效</span>
				        </Radio>
				        <Radio label="nyears">
				            <span>每个虚拟币有效期为</span>
				        </Radio>
				        <div v-show="nyearsShow">
				        	<Select v-model="formItem.extVal" style="width:100px">
						        <Option value="1">1年</Option>
						        <Option value="2">2年</Option>
						        <Option value="3">3年</Option>
						    </Select>
							<div>示例：若设置每个虚拟币有效期为1年，则用户今年1月1日获得的虚拟币，将在明年1月1日过期</div>
				        </div>
				    </RadioGroup>
				</FormItem>

		        <FormItem v-else :label="formItem.name" prop="val">
		            <Input v-model="formItem.val" placeholder="请输入可获得的虚拟币" style="width:200px"></Input>
		        </FormItem>

		        <FormItem v-show="formItem.desc!='-'">
		        	{{formItem.desc}}
		        </FormItem>

	        </Form>
	   	</Modal>

	</div>
</template>

<script>
import util from '@/libs/util.js';

export default {
  name: 'coinForm',
  components: {

  },
  props: {

  },
  data () {
    return {
        	// 表单内容
        	formItem: {
        		extVal: ''
        	},

        	// 表单数据规则
        	ruleValidate: {
        	},

        	// 模态框
        	modalShow: false,
        	modalTitle: '配置虚拟币规则',
        	modalLoading: true,

        	// 是否显示nyear
        	nyearsShow: false
    }
  },
  methods: {
    	// 初始化方法
    init () {
    },
    // 打开模态框
    openModal (row) {
        	this.modalShow = true;

        	var arrVal = row.val.split('|');

    		// 初始化表单数据
      this.formItem.name = row.name;
      this.formItem.val = arrVal.length > 1 ? arrVal[0] : row.val;
      this.formItem.desc = row.desc;
      this.formItem.key = row.key;
      this.formItem.extVal = arrVal.length > 1 ? arrVal[1] : '';

      this.radioChange(this.formItem.val);
    },
    // 模态框确认事件
    modalOk () {
        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	// ajax 保存编辑数据
                	util.ajax.post(util.apiUrl.coinEdit, {
                		key: this.formItem.key,
                		val: (this.formItem.extVal == '' ? this.formItem.val : this.formItem.val + '|' + this.formItem.extVal),
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
    },
    radioChange (val) {
        	if (val == 'nyears') {
        		this.nyearsShow = true;
        	} else {
        		this.nyearsShow = false;
        		this.formItem.extVal = '';
        	}
    }
  },
  computed: {

  },
  mounted () {
    this.init();
  }
}
</script>
