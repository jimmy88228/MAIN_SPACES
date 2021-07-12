<style lang="less">
.cuser-form{

}
</style>

<template>
	<div class="cuser-form">
		<Card v-show="modalShow">
			<div slot="title">
				<Tooltip content="返回">
					<Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/>
				</Tooltip>
			</div>
			<div slot="extra">
				<Button v-if="formItem.handle.edit" type="primary" @click="modalOk">保存</Button>
			</div>

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
	        	<Row>
	        		<Col :span="12">
				        <FormItem label="启用/锁定：">
				            <i-switch v-model="formItem.status" size="large">
				                <span slot="open">启用</span>
				                <span slot="close">锁定</span>
				            </i-switch>
				        </FormItem>
		        	</Col>
		        	<Col :span="12">
				        <FormItem label="头像：" prop="avatar">
				        	<span style="cursor:pointer;">
				            	<Avatar :src="formItem.wx_avatar" size="large" icon="md-person" shape="square" />
				           </span>
				        </FormItem>
		        	</Col>
		        </Row>

		        <Row>
	        		<Col :span="12">
				        <FormItem label="用户名：">
				            {{formItem.name}}
				        </FormItem>
		        	</Col>
		        	<Col :span="12">
				        <FormItem label="昵称：">
				            {{formItem.wx_nick_name}}
				        </FormItem>
		        	</Col>
		        </Row>

		        <Row>
	        		<Col :span="12">
				        <FormItem label="性别：">
				            {{formItem.gender_format}}
				        </FormItem>
		        	</Col>
		        	<Col :span="12">
				        <FormItem label="手机号：">
				            {{formItem.mobile}}
				        </FormItem>
		        	</Col>
		        </Row>

		        <Row>
	        		<Col :span="12">
				        <FormItem label="注册时间：">
				            {{formItem.created_at_format}}
				        </FormItem>
		        	</Col>
		        	<Col :span="12">
				        <FormItem label="最后修改时间：">
				            {{formItem.updated_at_format}}
				        </FormItem>
		        	</Col>
		        </Row>

		        <Row>
	        		<Col :span="12">
				        <FormItem label="注册终端：">
				            {{formItem.register_from_format}}
				        </FormItem>
				    </Col>
		        </Row>

	        </Form>

			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>

	    </Card>
	</div>
</template>

<script>
import util from '@/libs/util.js';

export default {
  name: 'cuserForm',
  components: {

  },
  data () {
    return {
        	// 个人用户 表单内容
        	formItem: {
        		handle: {
        			edit: false
        		}
        	},

        	// 表单数据规则
        	ruleValidate: {

        	},

        	// 模态框
        	modalShow: false,
        	modalEditIndex: 0,

        	spinShow: false
    }
  },
  methods: {
    	// 初始化方法
    init () {

    },
    // 编辑按钮
    editUser (index, row) {
        	this.modalEditIndex = index;

        	this.modalShow = true;

    		// 重置表单
        	this.$refs.formValidate.resetFields();

    		// 初始化表单数据
    		row.status = row.status == 1;
        	this.formItem = row;
    },
    // 返回列表
    goBack () {
        	this.modalShow = false;

        	this.$emit('on-close', {});
    },
    // 模态框确认事件
    modalOk () {
        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	this.spinShow = true;

                	// ajax 保存编辑数据
                	util.ajax.post(util.apiUrl.cuserEdit, {
                		id: this.formItem.id,
        				status: this.formItem.status
	            	})
		    		.then((response) => {
		    			var res = response.data;
		    			this.spinShow = false;

		    			if (res.code) {
		    				// 保存成功
	                        this.$Message.success(res.message);

                this.$emit('on-save', { index: this.modalEditIndex, data: res.data });
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
}
</script>
