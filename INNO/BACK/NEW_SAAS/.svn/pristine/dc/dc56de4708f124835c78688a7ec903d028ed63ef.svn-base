<style lang="less">
.brand-verify-log{

}
</style>

<template>
	<div class="brand-verify-log">
		<Modal
	        v-model="modalShow" draggable
	        :title="modalTitle"
	        :loading="modalLoading"
	        :width="650"
	        :footer-hide="true">

	        <div v-if="currentStatus == 0 || currentStatus == 3" >
		        <Form ref="formValidate" :model="formItem" :rules="ruleLog">
		        	<FormItem label="审核状态：">
			            <i-switch v-model="formItem.status" size="large">
			                <span slot="open">通过</span>
			                <span slot="close">不过</span>
			            </i-switch>
			        </FormItem>
		        	<FormItem prop="remark" label="备注原因">
						<Input v-model="formItem.remark" type="textarea" :autosize="{minRows: 2,maxRows: 3}" placeholder="请输入备注原因，信息会反馈给用户..." style="width:50%;" />
		            </FormItem>
		            <div style="text-align: center;">
		            	<Button type="primary" style="width:90px" @click="saveLog">提交</Button>
		            </div>
		        </Form>

		        <Divider dashed />
	        </div>

	        <titleBar>日志历史</titleBar>
	        <Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>

	    </Modal>
	</div>
</template>

<script>
import util from '@/libs/util.js';
import titleBar from '@/views/my-components/title-bar/title-bar';

/**
 * 品牌编辑 审核和日志组件
 */
export default {
  name: 'brandVerifyLog',
  components: {
    titleBar
  },
  data () {
    return {
        	// 列表
        	columns: [],
        	data: [],
        	tableHeight: 220,
        	tableLoading: false,

        	// 模态框
        	modalShow: false,
        	modalTitle: '品牌审核',
        	modalLoading: true,

        	// 当前编辑的品牌id
        	currentBrandId: 0,
        	currentStatus: 0,

        	// 审核表单
        	formItem: {
        		status: false,
        		remark: ''
        	},

        	// 审核表单规则
        	ruleLog: {
        		remark: [{ required: true, message: '备注原因不能为空', trigger: 'blur' }]
        	}
    }
  },
  methods: {
    	// 初始化方法
    init () {
    },
    // 提供给父组件调用
    initSet (brandId, status) {
        	this.modalLoading = true;
        	this.modalShow = true;
        	this.currentBrandId = brandId;
        	this.currentStatus = status;

        	if (this.currentStatus == 0 || this.currentStatus == 3) {
        		// 重置表单
        		window.setTimeout(() => {
        			this.$refs.formValidate.resetFields();
        		}, 1000);

        		this.tableHeight = 220;
        	} else {
        		this.tableHeight = 400;
        	}

        	this.tableLoading = true;
        	// ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.brandVerifylog, {
        		brandId: this.currentBrandId
        	})
    		.then((response) => {
          this.tableLoading = false;
    			var res = response.data;

    			if (res.code) {
    				// 初始化日志列表
    				this.columns = res.data.columns;
    				this.data = res.data.items;

    				// 状态标识
    				this.columns[1].render = (h, params) => {
              const row = params.row;
              var color = '';

              switch (row.brand_status) {
                        	case 0:
                        		color = 'warning';
                        		break;
                        	case 1:
                        		color = 'success';
                        		break;
                        	case 3:
                        		color = 'error';
                        		break;
              }

              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, row.status_format);
            };
    			} else {
    				this.$Message.error(res.message);
    			}
    		});
    },
    // 保存日志
    saveLog () {
        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	this.modalLoading = true;

                	// ajax 保存编辑数据
                	util.ajax.post(util.apiUrl.brandAddVerifyLog, {
                		brandId: this.currentBrandId,
            status: this.formItem.status,
            remark: this.formItem.remark
	            	})
		    		.then((response) => {
		    			var res = response.data;
		    			this.modalLoading = false;

		    			if (res.code) {
		    				// 保存成功
	                        this.$Message.success(res.message);

                this.modalShow = false;

                // 把状态传递给父组件
                this.$emit('on-save', res.data);
	                    } else {
                    		this.$Message.error(res.message);

                    		this.modalShow = true;
			                this.modalLoading = false;

                    		setTimeout(() => {
			                    this.modalLoading = true;
			                }, 50);
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
}
</script>
