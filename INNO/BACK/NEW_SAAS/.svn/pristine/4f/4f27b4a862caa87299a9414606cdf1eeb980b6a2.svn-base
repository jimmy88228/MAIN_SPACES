<style lang="less">
</style>

<template>
	<div>
		<Modal
	        v-model="modalShow"
	        class="brand-plugins"
	        :title="modalTitle"
	        :loading="modalLoading"
	        :width="500"
	        @on-ok="modalOk">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
	        	<FormItem label="是否授权">
					<i-switch v-model="formItem.admin_status_format" size="large">
		                <span slot="open">权限</span>
		                <span slot="close">禁用</span>
			        </i-switch>
				</FormItem>
				<FormItem prop="begin_time_str" label="授权开始时间">
		        	<DatePicker v-model="formItem.begin_time" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="注册时间" style="width:200px" @on-change="beginTimeChange"></DatePicker>
		        </FormItem>
		        <FormItem prop="expire_time_str" label="授权到期时间">
		        	<DatePicker v-model="formItem.expire_time" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="注册时间" style="width:200px" @on-change="expireTimeChange">
		        	</DatePicker>
		        </FormItem>
				<FormItem prop="remark" label="授权备注">
					<Input v-model="formItem.remark" type="textarea" :autosize="{minRows:2,Rows:6}" placeholder="请输入备注原因" style="width:350px;" />
	            </FormItem>
	        </Form>

	        <!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>
	    </Modal>
	</div>
</template>

<script>
import util from '@/libs/util.js';

/**
 * 品牌编辑 授权表单组件
 */
export default {
  name: 'brandPluginsForm',
  components: {
  },
  data () {
    return {
        	// 模态框
        	modalShow: false,
        	modalTitle: '品牌组件授权',
        	modalLoading: true,
        	spinShow: false,

        	// 当前编辑的品牌id
        	currentBrandId: 0,
        	currentPlguinCode: '',
        	
        	formItem:{
        		remark:'',
        		begin_time:'',
				begin_time_str: '',
        		expire_time: '',
        		expire_time_str: '',
        		admin_status_format:false,
        	},

        	// 表单数据规则
        	ruleValidate:{
				begin_time_str:[{ required: true, type:'string', message: '开始时间不能为空', trigger: 'blur' }],
				expire_time_str:[{ required: true, type:'string', message: '到期时间不能为空', trigger: 'blur' }],
				remark:[{ required: true, type:'string', message: '备注不能为空', trigger: 'blur' }],
        	},
        }
    },
    methods: {
    	// 初始化方法
        init () {
        },
        // 提供给父组件调用
        openModal( code, admin_status_format, beginTime, expireTime , brandId ){
        	this.modalShow = true;
        	this.currentBrandId = brandId;
        	this.currentPlguinCode = code;
        	this.formItem.admin_status_format = admin_status_format;
        	this.formItem.expire_time = expireTime;
        	this.formItem.expire_time_str = expireTime;
			this.formItem.begin_time = beginTime;
			this.formItem.begin_time_str = beginTime;
        	this.formItem.remark = '';
        },
		beginTimeChange( val ){
			this.formItem.begin_time_str = val;
			
			// 检查某个字段
			this.$refs['formValidate'].validateField('begin_time_str', ( msg )=>{
			});
		},
        expireTimeChange( val1 ){
        	this.formItem.expire_time_str = val1;
        	
        	// 检查某个字段
			this.$refs['formValidate'].validateField('expire_time_str', ( msg )=>{
			});
        },
        // 保存表单修改
    	modalOk( code ){
    		this.$refs['formValidate'].validate((valid) => {
                if (valid) {
		    		this.spinShow = true;
					// ajax 获取场景列表
		        	util.ajax.post( util.apiUrl.updateBrandPlugin, {
						brand_id : this.currentBrandId,
						code: this.currentPlguinCode,
						status: this.formItem.admin_status_format,
						remark: this.formItem.remark,
						begin_time: this.formItem.begin_time,
						expire_time: this.formItem.expire_time,
		        	})
		    		.then((response) => {
		    			var res = response.data;
		    			this.spinShow = false;

		    			if (res.code) {
		    				this.$Message.success(res.message);
		    				this.modalShow = false;
		    				
		    				this.$emit('on-success', res.data );
		    			}
		    			else{
		    				// 验证失败，不关闭模态框
		                	this.modalShow = true;
		                    this.$Message.error(res.message);
		                    this.modalLoading = false;

		                    setTimeout(() => {
			                    this.modalLoading = true;
			                }, 50);
		    			}
		    		});
				}
                else{
                	// 验证失败，不关闭模态框
                	this.modalShow = true;
          this.$Message.error('必填项不能为空！');
          this.modalLoading = false;

          setTimeout(() => {
	                    this.modalLoading = true;
	                }, 50);
                }
            });    
    	},
    },
    mounted () {
        this.init();
    },
}
</script>
