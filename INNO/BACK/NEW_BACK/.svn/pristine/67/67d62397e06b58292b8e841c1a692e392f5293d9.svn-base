<style lang="less">
.cs-blackbook-form{
	.ivu-avatar-large .ivu-icon{
		font-size: 70px;
    	line-height: 100px;
	}

	.image-box{
		width: 80px;
		height:80px;
		line-height:90px;
		border: 1px solid #eee;
	    border-radius: 5px;
	    text-align: center;
	    float:left;
	    cursor: pointer;
	    background: center center no-repeat;
	    background-size: 100% auto;
	}
}
</style>

<template>
	<div>

		<Modal v-model="modalShow"
      class="cs-blackbook-form"
      title="添加黑名单"
      :loading="modalLoading"
      @on-ok="modalOk">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">

				<FormItem label="拉黑用户" prop="user_id_str">
          	<Tag v-if="formItem.user_id != 0 " size="large" :closable="canSelectUser" @on-close="userClose">
          		<Avatar :src="formItem.avatar" size="small" icon="md-person"></Avatar>
          		{{formItem.nick_name}}
          	</Tag>
            <Button v-else type="dashed" icon="md-add" @click="onSelectUser">选择用户</Button>
				</FormItem>
        <FormItem label="类型">
          <RadioGroup v-model="formItem.type">
              <Radio :label="0">永久拉黑</Radio>
              <Radio :label="1">临时拉黑</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-show="formItem.type==1" label="拉黑时长">
          <Select v-model="formItem.hours">
              <Option :value="24">拉黑24小时</Option>
              <Option :value="48">拉黑48小时</Option>
          </Select>
        </FormItem>
        <FormItem label="原因备注">
        	<Input v-model="formItem.remark" placeholder="" type="textarea" :rows="4" maxlength="120" show-word-limit></Input>
        </FormItem>

	        </Form>
	    </Modal>

    <!--选择用户-->
    <userSelect ref="user-select" :canSelectAll="true" @on-ok="onSelectOk"></userSelect>

	</div>
</template>

<script>
import userSelect from '@/views/my-components/user-select/user-select';

export default {
	name: 'csBlackBookForm',
    components: {
        userSelect,
    },
    data () {
        return {
        	// 管理员 表单内容
        	formItem: {},
          canSelectUser: false,

        	// 表单数据规则
        	ruleValidate:{
            user_id_str:[{ required: true, message: '关联管理员不能为空', trigger: 'blur' },],
        	},

        	// 模态框
        	modalShow: false,
          modalLoading: true,

        }
    },
    methods: {
    	// 初始化方法
        init () {

        },
        // 添加用户
        openModal( row ){
        	this.modalShow = true;
          this.canSelectUser = row.user_id == 0 ? true : false;

          if( row.user_id == 0 ){
            // 在管理列表添加黑名单
            this.formItem = {
              hours:24,
              type: 0,
              user_id: 0,
              user_id_str: '',
              nick_name: '',
              avatar: '',
              remark:'',
            };
          }
          else{
            // 这个是在聊天界面添加黑名单
            this.formItem = {
              hours:24,
              type: 0,
              user_id: row.user_id,
              user_id_str: 'OK',
              nick_name: row.nick_name,
              avatar: row.avatar,
              remark:'',
            };
          }
        },
        // 返回列表
        goBack(){
        	this.modalShow = false;
        },
        // 模态框确认事件
        modalOk (){
        	this.$refs['formValidate'].validate((valid) => {
                if (valid) {

                	// ajax 保存编辑数据
                	this.$ajax.post( this.$api.csBlackBookAdd, {
                user_id: this.formItem.user_id,
        				avatar: this.formItem.avatar,
        				nick_name: this.formItem.nick_name,
                type: this.formItem.type,
                hours: this.formItem.hours,
        				remark: this.formItem.remark,

	            	})
		    		.then( (response) => {
		    			var res = response.data;

		    			if( res.code ){
		    				// 保存成功
	                        this.$Message.success( res.message );
                this.modalShow = false;
                this.$emit('on-success');
	                    }
		    			else{
                    		this.$Message.error( res.message );
		    			}
		    		});
                }
                else {
                  this.$Message.error('必填项不能为空！');
                  this.modalShow = true;
                  this.modalLoading = false;
                  setTimeout(() => {
                  	this.modalLoading = true;
                  }, 50);
                }
           });
        },

    // 清除选中的用户
    userClose(){
    	this.formItem.user_id = 0;
    	this.formItem.nick_name = '';
      this.formItem.avatar = '';
      this.formItem.user_id_str = '';
    },
    // 打开用户选择器
    onSelectUser(){
    	this.$refs['user-select'].openModal( [], 'radio' );
    },
    // 选用户的组件的 回调
    onSelectOk( items ){
    	if( items.length > 0 ){
        this.formItem.user_id = items[0]['id'];
        this.formItem.nick_name = items[0]['real_name'];
        this.formItem.avatar = items[0]['wx_avatar'];
        this.formItem.user_id_str = 'OK';

        // 检查某个字段
        this.$refs['formValidate'].validateField('user_id_str', ( msg )=>{
          // 检查图片是否为空
        });
    	}
    },
    },
    mounted () {
        this.init();
    },
}
</script>
