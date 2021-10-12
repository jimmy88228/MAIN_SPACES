<style lang="less">
.doc-cat-form{
	.image-box{
		height: 80px;
		line-height:90px;
		width:80px;
		background:center center no-repeat;
		background-size: 100% auto;
		border: 1px solid #eee;
	    border-radius: 5px;
	    text-align: center;
	    position: relative;
	    cursor: pointer;
	}
}	
</style>

<template>
	<Card v-show="modalShow" class="doc-cat-form">
		<div slot="title" class="icard-header">
			<Tooltip content="返回" placement="bottom-start">
				<Icon type="ios-arrow-dropleft" @click="goBack" class="card-back"/>
			</Tooltip>
			编辑文档分类
		</div>
		<div slot="extra">
			<Button type="primary" @click="modalOk">保存</Button>
		</div>
		
		<!--表单-->
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">

	        <FormItem v-show="false" label="上级分类" prop="parent_id_str">
        		<Select v-model="formItem.parent_id" style="width:200px;">
        			<Option v-for="(item,index) in catTree" :value="item.id" :key="index" :label="item.name">
        				<span v-if="item.level==1">&nbsp;&nbsp;</span>
        				<span v-else-if="item.level==2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        				<span>{{item.name}} <span v-if="item.level>0">[{{item.platform_format}}]</span></span>
        			</Option>
        		</Select>
			   	<div style="margin-left:10px;">(最多能创建到第二级)</div>
		    </FormItem>
		    <FormItem label="分类名" prop="name">
				<Input v-model="formItem.name" placeholder="请输入名称" style="width:200px;"></Input>
	        </FormItem>
			<FormItem label="适用平台">
				<RadioGroup v-model="formItem.platform">
					<Radio v-for="(item,index) in platformList" :key="index" :label="item.code">{{item.name}}</Radio>
				</RadioGroup>
				<div>如果文档是某个平台独有的，这里应该具体指定</div>
			</FormItem>
			<div class="form-footer-button-box">
				<Button type="default" @click="goBack">取消</Button>
				<Button type="primary" @click="modalOk">保存</Button>
			</div>
        </Form>
		
		<!--图片选择组件-->
		<UserImages ref="user-images" @on-return-url="returnImageUrl"></UserImages>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
   	</Card>	
</template>	

<script>
/**
 * 添加商品分类
 */
import UserImages from '@/views/my-components/user-images/user-images';

export default {
	name: 'docCatForm',
	components: {
		UserImages
	},
	props: {
	},
	data () {
		const checkParentId = (rule, val, callback) => {
    		if( this.formItem.id > 0 && this.formItem.id == val[ (val.length -1) ] ){
    			callback(new Error('上级分类不能是当前分类'));
            }
    		else{
    			callback();
            }
        };
    	return {
			// 模态框
        	modalShow: false,
        	// 加载提示
        	spinShow: false,
        	
        	// 父级树
        	catTree:[{
        		id: 0,
        		name: '[顶级分级]',
        		level: 0,
        	}],
        	
			platformList:[],
			
        	// 表单内容
        	formItem: {
        		name:'',
        		parent_id: 0,
        		parent_id_str: '',
				cover_img_format: '',
        		status: false,
				platform: 'all',
				handle:{
					edit:false,
				}
        	},

        	// 表单数据规则
        	ruleValidate:{
				name:[{ required: true, message: '分类名不能为空', trigger: 'blur' },],
				parent_id_str:[{validator:checkParentId,message:'上级分类不能是当前分类',trigger:'blur'}],
        	},
    	}
   	},
	computed: {
		bgStyle(){
			return {
				'background-image': 'url('+this.formItem.cover_img_format+')',
			};
		},
	},	
   	methods: {
    	// 初始化
    	init(){
    		
    	},
    	// 返回列表
        goBack(){
        	this.modalShow = false;
        	this.$emit('on-close', {});
        },
        catChange( val ){
        	this.formItem.parent_id_str = 'rs:'+val;
        	
        	// 检查某个字段
			this.$refs['formValidate'].validateField('parent_id_str', ( msg )=>{
				// 检查图片是否为空
			});
			
        },
        // 打开模态框
        openModal (data, row, platformList ){
        	this.modalShow = true;

        	// 组装父级分类树
        	this.catTree = [];
			this.platformList = platformList;
			console.log(platformList);
        	this.catTree.push({
        		id: 0,
        		name: '[顶级分级]',
        		level: 0,
        	});
			
        	for(var i in data){
        		this.catTree.push({
	        		id: data[i].id,
	        		name: data[i].name,
					platform_format: data[i].platform_format,
	        		level: 1
	        	});
        	}
        	
			if( typeof(row.id) == 'undefined' || row.id == 0 ){
				this.formItem.id = 0;
				this.formItem.name = '';
				this.formItem.parent_id = 0;
				this.formItem.parent_id_str = '';
				this.formItem.platform = 'all';
				this.formItem.handle = {
					edit:true
				};
			}
			else{
	    		// 编辑时候的初始化数据
	    		this.formItem.id = row.id;
	    		this.formItem.name = row.name;
	    		this.formItem.parent_id = row.parent_id;
	    		this.formItem.parent_id_str = 'rs:'+row.parent_id;
				this.formItem.platform = row.platform;
	        	this.formItem.handle = row.handle;
	        }
	
        },
        // 保存按钮
        modalOk(){
        	this.$refs['formValidate'].validate((valid) => {
                if (valid) {
		        	this.spinShow = true;
		        	
		        	this.$ajax.post( typeof(this.formItem.id) == 'undefined' || this.formItem.id == 0 || this.formItem.id == '' ? this.$api.docCatAdd : this.$api.docCatEdit, {
		        		id: this.formItem.id,
		 				parent_id: this.formItem.parent_id,
		 				name: this.formItem.name,
						platform: this.formItem.platform,
		        	})
		    		.then( (response) => {
		    			var res = response.data;
		    			this.spinShow = false;
		    			
		    			if( res.code ){
		    				this.$Message.success( res.message );
		    				
		    				this.modalShow = false;
		        			this.$emit('on-success', {});
		    			}
		    		});
    			}
            });
        },
		// 选择素材图片
		selectImage(objName, objType){
			this.$refs['user-images'].showModal({
				type: objType,
				name: objName, 
				multi:0, 
				selectedImage: this.formItem[ objName ],
			});
		},
		// 选择图片后的回调
		returnImageUrl(obj) {
		    this.$set( this.formItem, obj.name, obj.val );
		},
    },
    watch: {

    },
    mounted () {
    	this.init();
    },
}
</script>