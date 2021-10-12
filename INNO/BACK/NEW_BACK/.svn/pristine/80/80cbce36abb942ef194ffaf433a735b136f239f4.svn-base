<style lang="less">
.doc-eform{	
	.ivu-select-dropdown{
		z-index:1000;
	}
	.ivu-spin-fix{
		z-index:1001;
	}
	.editor-box{
		.ivu-form-item-content{
			line-height:1;
		}
	}
}
</style>

<template>
	<Card v-show="modalShow" class="doc-eform">
		<div slot="title" class="icard-header">
			<Tooltip content="返回" placement="bottom-start">
				<Icon type="ios-arrow-dropleft" @click="goBack" class="card-back"/>
			</Tooltip>
			编辑系统文档
		</div>
		<div slot="extra">
			<Button type="primary" @click="modalOk">保存</Button>
		</div>
		
		<!--表单-->
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
			
			<FormItem label="标题" prop="title">
				<Input v-model="formItem.title" placeholder="请输入标题" style="width:300px;"></Input>
	        </FormItem>
	        <FormItem label="分类" prop="cat_id">
        		<Select v-model="formItem.cat_id" style="width:200px;">
        			<Option v-for="(item,index) in catTree" :value="item.id" :key="index" :label="item.name">
        				<span v-if="item.level==1">&nbsp;&nbsp;</span>
        				<span v-else-if="item.level==2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        				<span>{{item.name}} <span v-if="item.level>0">[{{item.platform_format}}]</span></span>
        			</Option>
        		</Select>
				<a @click="settingCat" style="margin-left:10px;">设置分类</a>
		    </FormItem>
			<FormItem v-if=" formItem.id == 0 " label="作者" prop="author_str">
				<Select v-model="formItem.author" style="width:200px;" @on-change="onAuthorChange">
					<Option v-for="(item,index) in authorList" :key="index" 
					v-if="item.enable == true"
					:value="item.name" 
					:label="item.name">
					</Option>
				</Select>
			</FormItem>	
			<FormItem v-else label="作者" prop="author">
				{{formItem.author}}
			</FormItem>
		    <div class="editor-box">
				<FormItem label="内容" prop="content">
					<!--编辑器组件-->
					<UEditor ref="ueditor"></UEditor>
				</FormItem>
			</div>
			
			<div class="form-footer-button-box">
				<Button type="default" @click="goBack">取消</Button>
				<Button type="primary" @click="modalOk">保存</Button>
			</div>
        </Form>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
   	</Card>	
</template>	

<script>
/**
 * 编辑文档表单
 */
import UEditor from '@/views/my-components/ueditor/ueditor';

export default {
	name: 'docForm',
	components: {
		UEditor,
	},
	props: {
	},
	data () {
    	return {
			// 模态框
        	modalShow: false,
        	// 加载提示
        	spinShow: false,
        	
        	// 父级树
        	catTree:[],
        	
			// 作者列表
			authorList: [],
			
        	// 表单内容
        	formItem: {
        		name: '',
        		title:'',
        		parent_id: 0,
        		status: false,
        		content: '',
				author: '',
				author_str: '',
        	},

        	// 表单数据规则
        	ruleValidate:{
				title:[{ required: true, message: '标题不能为空', trigger: 'blur' },],
				author_str: [{ required: true, message: '请选择作者', trigger: 'blur' },],
        	},
        	
        	// ueditor 配置
        	ueditorConfig:{
      			initialFrameHeight:380,
				initialFrameWidth:680,
      			autoFloatEnabled:false, // 取消工具条悬浮
      			toolbars:[],  // 工具条配置
        	},
        	
        	initEditor: false,
    	}
   	},
   	methods: {
    	// 初始化
    	init(){
    		
    	},
    	
        // 打开模态框
        openModal (row, data, toolbars, authorList ){
        	this.modalShow = true;
        	this.authorList = authorList;
			
        	if( this.initEditor == false ){
        		this.spinShow = true;
        		this.ueditorConfig.toolbars = toolbars;

				this.$nextTick(()=>{
					// 配置加载完毕，才初始化 ueditor
					this.$refs['ueditor'].init( this.ueditorConfig );
					this.initEditor = true;
					
					window.setTimeout(() => {
						this.spinShow = false;
					}, 1000);
				});
        	}
        	
        	// 组装父级分类树
        	this.catTree = [];
        	for(var i in data){
        		this.catTree.push({
	        		id: data[i].id,
	        		name: data[i].name,
					platform_format: data[i].platform_format,
	        		level: 1
	        	});
        	
        		for(var j in data[i].get_children ){
        			// 第二级
        			this.catTree.push({
		        		id: data[i].get_children[j].id,
		        		name: data[i].get_children[j].name,
						platform_format: data[i].get_children[j].platform_format,
		        		level: 2,
		        	});
        		}
        	}
        	
			// 自定义按钮的图片类型
			this.$store.commit('setUeditorImageType', 'docDesc');
							
			if( typeof(row.id) == 'undefined' || row.id == 0 ){
				this.formItem.id = 0;
				this.formItem.title = '';
				this.formItem.cat_id = 0;
				this.formItem.content = '';
				this.formItem.author = '';
				this.formItem.author_str = '';
			}
			else{
	    		// 编辑时候的初始化数据
	    		this.formItem.id = row.id;
	    		this.formItem.title = row.title;
	    		this.formItem.cat_id = row.cat_id;
	    		this.formItem.content = row.content;
				this.formItem.author = row.author;
				this.formItem.author_str = 'OK';
	        }
			
    		// 让ueditor 加入编辑的内容
    		this.spinShow = true;
    		window.setTimeout(()=>{
    			var ue = this.$refs['ueditor'].getUE();
				ue.setContent( this.formItem.content );
				this.spinShow = false;
    		}, 2000);
        },
        // 保存按钮
        modalOk(){
        	this.$refs['formValidate'].validate((valid) => {
                if (valid) {
		        	this.spinShow = true;
		        	
		        	this.$ajax.post( ( this.formItem.id == 0 ? this.$api.docAdd : this.$api.docEdit ), {
		        		id: this.formItem.id,
		 				cat_id: this.formItem.cat_id,
		 				title: this.formItem.title,
		 				author: this.formItem.author,
		 				content: this.$refs.ueditor.getUEContent(),
		        	})
		    		.then( (response) => {
		    			var res = response.data;
		    			this.spinShow = false;
		    			
		    			if( res.code ){
		    				this.$Message.success( res.message );
		    				
		    				this.modalShow = false;
		        			this.$emit('on-success', res );
		    			}
		    		});
				}
            });    
        },
		// 返回列表
		goBack(){
			this.modalShow = false;
			this.$emit('on-close', {});
		},
		// 作者组件变动
		onAuthorChange( val ){
			this.formItem.author_str = "OK";
			// 检查某个字段
			this.$refs['formValidate'].validateField('author_str', ( msg )=>{
				// 检查图片是否为空
			});
		},
		settingCat(){
			this.$router.push('/system/doc-cat');
		}
    },
    watch: {

    },
    mounted () {
    	this.init();
    },
}
</script>