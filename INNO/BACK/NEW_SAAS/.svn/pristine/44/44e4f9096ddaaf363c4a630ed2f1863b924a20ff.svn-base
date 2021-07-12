<style lang="less">
.cs-worker-form{
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
	<div class="cs-worker-form">

		<Card v-show="modalShow">
			<div slot="title">
				<Tooltip content="返回" placement="bottom-start">
					<Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/>
				</Tooltip>
			</div>
			<div slot="extra">
				<Button type="primary" @click="modalOk">保存</Button>
			</div>
			
	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
				<FormItem label="客服昵称" prop="nick_name">
					<Input v-model="formItem.nick_name" placeholder="" style="width:200px;" maxlength="18" show-word-limit></Input>
					<div>注意：如果更新了客服昵称，客服需要重新登录才能生效</div>
				</FormItem>
				<FormItem label="客服头像" prop="avatar_format">
					<div class="image-box" @click="openImagesModal('avatar', formItem.avatar_format )"
					:style="'background-image: url('+formItem.avatar_format+');'">
						<Icon type="md-add" size="30" v-show="(formItem.avatar_format==''|| formItem.avatar_format==null ?true:false)"></Icon>
					</div>
				</FormItem>
				<FormItem label="绑定管理员" prop="admin_id_str">
          <template v-if="isAdd">
            <adminstor-select :data="adminstorData" type="radio" @del-tag="handleTag">
              <Button type="dashed" @click="onSelectAdmin" class="basic_select">选择管理员</Button>
            </adminstor-select>
          </template>
          <template v-else>
          	<Tag v-if="formItem.admin_id != 0 " size="large">
          		<Avatar :src="formItem.get_admin_info != null ? formItem.get_admin_info.wx_avatar : ''" size="small" icon="md-person"></Avatar>
          		<template v-if="formItem.get_admin_info != null">
          		{{formItem.get_admin_info.name}} {{formItem.get_admin_info.wx_nick_name}}
          		</template>
          	</Tag>
          </template>
				</FormItem>
				<FormItem label="客服分组">
					<Select v-model="formItem.group_id" placeholder="请选择客服分组" style="width:180px">
						<Option :value="0">默认分组</Option>
						<Option v-for="(item, key) in groupList" :value="item.id" :key="key">{{item.name}}</Option>
					</Select>
				</FormItem>
	        </Form>
			
			<div class="form-footer-button-box">
				<Button @click="goBack">取消</Button>
				<Button type="primary" @click="modalOk">保存</Button>
			</div>	
	    </Card>
	    
	    <!--用户图片管理组件-->
    	<userImages ref="userImages" @on-return-url="returnImageUrl"></userImages>
			
        <!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>

<script>
import userImages from '@/views/my-components/user-images/user-images.vue';
import AdminstorSelect from '@/views/my-components/list-component/index-edit';

export default {
	name: 'csWorkerForm',
    components: {
        userImages,
        AdminstorSelect
    },
    data () {
        return {
        	// 管理员 表单内容
        	formItem: {},
        	
        	// 表单数据规则
        	ruleValidate:{
				nick_name:[{ required: true, message: '昵称不能为空', trigger: 'blur' },],
				avatar_format:[{ required: true, message: '客服头像不能为空', trigger: 'blur' },],
				admin_id_str:[{ required: true, message: '关联管理员不能为空', trigger: 'blur' },],
        	},
        	
        	// 模态框
        	modalShow: false,
        	modalEditIndex: 0,
        	
			groupList:[],
			isAdd: false,
          spinShow: false,
          adminstorData: []
        }
    },
    methods: {
    	// 初始化方法
        init () {
        	
        },
        // 添加用户
        openModal( row, groupList ){
        	this.modalShow = true;
			this.groupList = groupList;
			
			if( row.admin_id === 0 ){
				this.isAdd = true;
				this.formItem = {
					id: 0,
					nick_name:'',
					avatar_format: '',
					admin_id: 0,
					admin_id_str: '',
					group_id: 0,
				};
			}
			else{
				this.isAdd = false;
				this.formItem = {
					id: row.id,
					nick_name: row.nick_name,
					avatar_format: row.avatar_format,
					admin_id: row.admin_id,
					get_admin_info: row.get_admin_info,
					admin_id_str: 'OK',
					group_id: row.group_id,
				};
			}

        },
        // 返回列表
        goBack(){
        	this.modalShow = false;

        	this.$emit('on-close', {});
        },
        // 调起图片选择器
        openImagesModal( name, url ){
        	var obj = {
        		name: name,
            selectedImage: url,
            type: 'IMAGE',
        	};
        	this.$refs['userImages'].showModal( obj );
        },
        // 图片选择组件的回调
    	returnImageUrl( obj ){
    		this.$set(this.formItem,obj.name+'_format', obj.val);
			
			// 检查某个字段
			this.$refs['formValidate'].validateField('avatar_format', ( msg )=>{
				// 检查图片是否为空
			});
    	},
        // 模态框确认事件
        modalOk (){
        	this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                	this.spinShow = true;
                	
                	// ajax 保存编辑数据
                	this.$ajax.post( ( this.isAdd ? this.$api.csWorkerAdd : this.$api.csWorkerEdit ), {
						id: this.formItem.id,
        				avatar: this.formItem.avatar_format,
        				nick_name: this.formItem.nick_name,
        				admin_id: this.formItem.admin_id,
						group_id: this.formItem.group_id,
	            	})
		    		.then( (response) => {
		    			var res = response.data;
		    			this.spinShow = false;

		    			if( res.code ){
		    				// 保存成功
	                        this.$Message.success( res.message );
							this.$emit('on-save');
							this.goBack();
	                    }
		    			else{
                    		this.$Message.error( res.message );
		    			}
		    		});
                }
                else {
                    this.$Message.error('必填项不能为空！');
                }
           });
        },
    onSelectAdmin(){
      this.$selectContent({
        mode: 'adminstor',
        type: 'radio',
        data: this.adminstorData,
        getList: (data) => {
          this.adminstorData = data;

          this.formItem.admin_id = data[0].id;
          this.formItem.get_admin_info = {
            wx_nick_name: data[0].wx_nick_name,
            wx_avatar: data[0].wx_avatar,
            name: data[0].name,
          };
          this.formItem.admin_id_str = 'OK';

          // 检查某个字段
          this.$refs['formValidate'].validateField('admin_id_str', ( msg )=>{
            // 检查图片是否为空
          });
        }
      })
    },
    handleTag (data) {
      this.adminstorData = data;
      this.formItem.admin_id = 0;
      this.formItem.admin_id_str = '';
    },
    },
    mounted () {
        this.init();
    },
}
</script>
