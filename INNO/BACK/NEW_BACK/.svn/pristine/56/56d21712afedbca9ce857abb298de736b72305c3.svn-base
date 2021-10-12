<style lang="less">
.cs-reply-form{
	.ivu-avatar-large .ivu-icon{
		font-size: 70px;
    	line-height: 100px;
	}
	
	.material-box{
		width:200px;

		.img-box{
			width:100%;
			height:120px;
			background: center center no-repeat;
			background-size: 100% auto;
		}
		.text-box{
			font-size:12px;
			white-space: pre-wrap;
			line-height: 1.5;
			height:125px;
			overflow: hidden;
		}
		.close{
			position: absolute;
			top:5px;
			right:10px;
			cursor: pointer;
			
			&:hover{
				color:red;
			}
		}
	}
}	
</style>

<template>
	<div class="cs-reply-form">

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
				<FormItem v-if="isAdd" label="关键词名称" prop="name">
					<Input v-model="formItem.name" placeholder="" type="textarea" :rows="5" style="width:200px;"></Input>
					<div>一行表示一个关键词；换行表示多个</div>
				</FormItem>
				<FormItem v-else label="关键词名称" prop="name">
					<Input v-model="formItem.name" placeholder="" style="width:200px;"></Input>
				</FormItem>
				
				<FormItem label="绑定素材内容" prop="material_content">
					
					<Card v-if="formItem.material_id != 0 " class="material-box">
						<template v-if="formItem.material_img_src != ''">
							<div v-if="formItem.material_type =='CARD' " class="clamp">{{formItem.material_content}}</div>
							<div class="img-box" :style="{'background-image': 'url('+ formItem.material_img_src +')' }"></div>
						</template>
						<template v-else>
							<div class="text-box" v-html="formItem.material_content"></div>
						</template>
						
						<Icon type="md-close" class="close" @click="materialClose"></Icon>
					</Card>
					
					<template v-else>
						<Poptip placement="right">
							<Button type="default">选择客服素材...</Button>
							
							<div slot="content">
								<Button type="success" @click="openSelectMaterial('TEXT')">文本</Button>
								<Button type="info" @click="openSelectMaterial('IMAGE')">图片</Button>
								<Button type="warning" @click="openSelectMaterial('CARD')">小程序卡片</Button>
							</div>
						</Poptip>
					</template>
				</FormItem>
	        </Form>
			
			<div class="form-footer-button-box">
				<Button @click="goBack">取消</Button>
				<Button type="primary" @click="modalOk">保存</Button>
			</div>	
	    </Card>
	    
		<!--客服素材选择器-->
		<csMaterialSelect ref="cs-material-select" @on-ok="onSelectMaterial"></csMaterialSelect>
				
        <!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>	
</template>	

<script>
import csMaterialSelect from '@/views/my-components/cs-material-select/cs-material';

export default {
	name: 'csReplyForm',
    components: {
		csMaterialSelect,
    },
    data () {
        return {
        	// 管理员 表单内容
        	formItem: {
				name:'',
				material_id: 0,
				material_content:'',
			},
        	
        	// 表单数据规则
        	ruleValidate:{
				name:[{ required: true, message: '关键词名称不能为空', trigger: 'blur' },],
				material_content:[{ required: true, message: '关联客服素材不能为空', trigger: 'blur' },],
        	},
        	
        	// 模态框
        	modalShow: false,
        	modalEditIndex: 0,
        	
			isAdd: false,
        	spinShow: false,
        }
    },
    methods: {
    	// 初始化方法
        init () {
        	
        },
        // 添加用户
        openModal( row ){
        	this.modalShow = true;

			if( row.id === 0 ){
				this.isAdd = true;
				this.formItem = {
					id: 0,
					name:'',
					material_id: 0,
					material_type: '',
					material_content: '',
					material_img_src: '',
				};
			}
			else{
				this.isAdd = false;
				this.formItem = {
					id: row.id,
					name: row.name,
					material_id: row.material_id,
					material_type: row.material_type,
					material_content: row.material_content,
					material_img_src: row.material_img_src,
				};
			}

        },
        // 返回列表
        goBack(){
        	this.modalShow = false;
        	
        	this.$emit('on-close', {});
        },
        // 模态框确认事件
        modalOk (){
        	this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                	this.spinShow = true;
                	
                	// ajax 保存编辑数据
                	this.$ajax.post( ( this.isAdd ? this.$api.csKeywordAdd : this.$api.csKeywordEdit ), {
						id: this.formItem.id,
        				name: this.formItem.name,
        				material_id: this.formItem.material_id,
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
		    		});
                }
                else {
                    this.$Message.error('必填项不能为空！');
                }
           });
        },
		// 打开选择素材的框
		openSelectMaterial( type ){
			this.$refs['cs-material-select'].showModal({
				multi: 0,
				type: type,
			});
		},
		// 选中素材的回调
		onSelectMaterial( obj ){
			this.formItem.material_id = obj.id;
			this.formItem.material_img_src = obj.img_src_format;
			this.formItem.material_content = obj.content;
			this.formItem.material_type = obj.type;
			
			// 检查某个字段
			this.$refs['formValidate'].validateField('material_content', ( msg )=>{
				// 检查是否为空
			});
		},
		// 清除选中的管理员
		materialClose(){
			this.formItem.material_id = 0;
			this.formItem.material_content = '';
		},
    },
    mounted () {
        this.init();
    },
}
</script>