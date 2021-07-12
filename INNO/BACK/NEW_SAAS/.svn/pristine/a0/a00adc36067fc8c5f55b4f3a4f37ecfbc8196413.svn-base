<style lang="less">
.reg-rsform{
	.ivu-col-span-8{
		width:32%;
	}
	.reg-form{
		margin: 20px;
	}
}
</style>

<template>
	<div class="reg-rsform">

		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100" class="reg-form">

	        <FormItem label="品牌名称：" prop="name">
	        	<Input v-model="formItem.name" placeholder="品牌名称"></Input>
	        </FormItem>

	        <FormItem label="联系人：" prop="linkman">
	        	<Input v-model="formItem.linkman" placeholder="品牌联系人"></Input>
	        </FormItem>

			<FormItem label="手机号：" prop="mobile">
	        	<Input v-model="formItem.mobile" placeholder="品牌联系人手机号"></Input>
	        </FormItem>

	        <FormItem label="联系电话：" prop="tel">
	        	<Input v-model="formItem.tel" placeholder="品牌联系电话"></Input>
	        </FormItem>

	        <FormItem label="省/市/区：">
	            <al-selector v-model="formItem.arr_area" level="2" />
	        </FormItem>

	        <FormItem label="详细地址：">
	        	<Input v-model="formItem.address" placeholder="请输入详细地址"></Input>
	        </FormItem>

			<Divider />

		    <div class="btn-box">
		    	<Button type="primary" style="width:90px;" @click="modalOk">保存</Button>
		    	<Button v-if="show_next_step" type="success" style="width:90px;" @click="nextStep">下一步</Button>
		    </div>

	        <Spin size="large" fix v-if="save_loading"></Spin>
        </Form>

	</div>
</template>

<script>
import util from '@/libs/util.js';

export default {
  name: 'registerResultForm',
  components: {

  },
  data () {
    	// 检查手机号
    	const checkMobile = (rule, val, callback) => {
    		if (/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(val)) {
            	callback();
      } else {
    			callback(new Error('格式有误'));
      }
    };

    return {
        	formItem: {
            	arr_area: []
      },

      save_loading: false,
      show_next_step: false,

      // 表单数据规则
        	ruleValidate: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        linkman: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: checkMobile, message: '格式有误', trigger: 'blur' }],
        tel: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }]
        	}
    }
  },
  methods: {
    	init () {

    	},
    	// 提供给父组件使用的方法
    	initSet (res) {
    		this.formItem = res.data;

    		this.formItem.arr_area = res.data.arr_area_format;
    		this.show_next_step = res.data.get_verify_log.length > 0;
    	},
    	// 下一步按钮事件
    	nextStep () {
    		this.$emit('next-step', {});
    	},
    	// 保存事件
    modalOk () {
        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	this.save_loading = true;

                	// ajax 保存编辑数据
                	util.ajax.post(util.apiUrl.brandInfoEdit, {
        				logo: this.formItem.logo,
        				wx_qrcode: this.formItem.wx_qrcode,
        				name: this.formItem.name,
        				linkman: this.formItem.linkman,
        				tel: this.formItem.tel,
        				mobile: this.formItem.mobile,
        				arr_area: this.formItem.arr_area,
        				address: this.formItem.address
	            	})
		    		.then((response) => {
		    			var res = response.data;
		    			this.save_loading = false;

		    			if (res.code) {
		    				// 保存成功
	                        this.$Message.success(res.message);
	                    } else {
                    		this.$Message.error(res.message);
		    			}
		    		});
        } else {
          this.$Message.error('必填项不能为空！');
        }
      });
    }
  },
  mounted () {
    this.init();
  }
};
</script>
