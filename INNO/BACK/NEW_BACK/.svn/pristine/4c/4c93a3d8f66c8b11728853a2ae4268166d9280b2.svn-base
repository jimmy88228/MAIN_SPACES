<style lang="less">
.article-eform{
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
	<Card v-show="modalShow" class="article-eform">
		<div slot="title">
			<Tooltip content="返回">
				<Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/>
			</Tooltip>
		</div>
		<div slot="extra">
			<Button type="primary" @click="modalOk">保存</Button>
		</div>

		<!--表单-->
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">

			<FormItem label="文章标题" prop="title">
				<Input v-model="formItem.title" placeholder="请输入文章标题" style="width:300px;"></Input>
	        </FormItem>
	        <FormItem label="上级分类" prop="cat_id">
        		<Select v-model="formItem.cat_id" style="width:200px;">
        			<Option v-for="(item,index) in catTree" :value="item.cat_id" :key="index" :label="item.cat_name">
        				<span v-if="item.level==1">&nbsp;&nbsp;</span>
        				<span v-else-if="item.level==2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        				<span>{{item.cat_name}}</span>
        			</Option>
        		</Select>
		    </FormItem>
		    <FormItem label="文章别名" prop="name">
				<Input v-model="formItem.name" placeholder="请输入文章别名" style="width:300px;"></Input> (由数字，字符串和下划线组成)
	        </FormItem>
		    <FormItem label="是否启用" prop="status">
				<i-switch v-model="formItem.status" size="large">
	                <span slot="open">启用</span>
	                <span slot="close">关闭</span>
		        </i-switch>
	        </FormItem>

		    <div class="editor-box">
		    <FormItem label="内容" prop="content">
		        <!--编辑器组件-->
				<UEditor ref="ueditor"></UEditor>
			</FormItem>
			</div>

        </Form>

		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
   	</Card>
</template>

<script>
/**
 * 编辑文章表单
 */
import util from '@/libs/util.js';
import UEditor from '@/views/my-components/ueditor/ueditor.vue';

export default {
  name: 'articleForm',
  components: {
    UEditor
  },
  props: {
  },
  data () {
    const checkName = (rule, value, callback) => {
      if (/^[0-9a-zA-Z_]{4,50}$/.test(value) == false) {
        callback(new Error('格式不对，由至少4个数字、字符串和下划线组成'));
           	} else {
        callback();
      }
    };

    	return {
      // 模态框
        	modalShow: false,
        	// 加载提示
        	spinShow: false,

        	// 父级树
        	catTree: [{
        		cat_id: 0,
        		cat_name: '[顶级分级]',
        		level: 0
        	}],

        	// 表单内容
        	formItem: {
        		name: '',
        		title: '',
        		parent_id: 0,
        		sort: 0,
        		status: false,
        		content: ''
        	},

        	// 表单数据规则
        	ruleValidate: {
        title: [{ required: true, message: '文章标题不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '文章别名不能为空', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }]
        	},

        	// ueditor 配置
        	ueditorConfig: {
      			initialFrameHeight: 480,
      			autoFloatEnabled: false, // 取消工具条悬浮
      			toolbars: [[
			        'source', 'undo', 'redo', '|',
			        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain',
			        '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|',
			        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
			        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
			        'directionalityltr', 'directionalityrtl', 'indent', '|', 'insertimage', '|',
			        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
			        'link', 'unlink', 'anchor', '|',
			        'horizontal', 'spechars'
			    ]], // 工具条配置

      			// 图片上传接口(必须初始会的)
      			serverUrl: ''
        	},

        	initEditor: false
    	}
   	},
   	methods: {
    	// 初始化
    	init () {

    	},
    	// 返回列表
    goBack () {
        	this.modalShow = false;
        	this.$emit('on-close', {});
    },
    // 打开模态框
    openModal (row, data, uploadServer, toolbars) {
        	this.modalShow = true;

        	if (this.initEditor == false) {
        		this.spinShow = true;
        		this.ueditorConfig.serverUrl = uploadServer;
        		this.ueditorConfig.toolbars = toolbars;

        		// 配置加载完毕，才初始化 ueditor
        this.$refs.ueditor.init(this.ueditorConfig);
        this.initEditor = true;

        window.setTimeout(() => {
          this.spinShow = false;
        }, 1000);
        	}

        	// 重置表单
        	this.$refs.formValidate.resetFields();

        	// 组装父级分类树
        	this.catTree = [];

        	this.catTree.push({
        		cat_id: 0,
        		cat_name: '[顶级分级]',
        		level: 0
        	});
        	for (var i in data) {
        		this.catTree.push({
	        		cat_id: data[i].cat_id,
	        		cat_name: data[i].cat_name,
	        		level: 1
	        	});

        		for (var j in data[i].get_children) {
        			// 第二级
        			this.catTree.push({
		        		cat_id: data[i].get_children[j].cat_id,
		        		cat_name: data[i].get_children[j].cat_name,
		        		level: 2
		        	});
        		}
        	}

      if (typeof (row.article_id) === 'undefined' || row.article_id == 0) {
        this.formItem.article_id = 0;
        this.formItem.title = '';
        this.formItem.name = '';
        this.formItem.cat_id = 0;
        this.formItem.status = false;
        this.formItem.content = '';
      } else {
	    		// 编辑时候的初始化数据
	    		this.formItem.article_id = row.article_id;
	    		this.formItem.title = row.title;
	    		this.formItem.name = row.name;
	    		this.formItem.cat_id = row.cat_id;
	    		this.formItem.status = row.status == 1;
	    		this.formItem.content = row.content;
	        }

    		// 让ueditor 加入编辑的内容
    		this.spinShow = true;
    		window.setTimeout(() => {
    			var ue = this.$refs.ueditor.getUE();
        ue.setContent(this.formItem.content);
        this.spinShow = false;
    		}, 2000);
    },
    // 保存按钮
    modalOk () {
        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
		        	this.spinShow = true;

		        	util.ajax.post((this.formItem.article_id == 0 ? util.apiUrl.articleAdd : util.apiUrl.articleEdit), {
		        		article_id: this.formItem.article_id,
		 				cat_id: this.formItem.cat_id,
		 				title: this.formItem.title,
		 				name: this.formItem.name,
		 				content: this.$refs.ueditor.getUEContent(),
		 				status: this.formItem.status
		        	})
		    		.then((response) => {
		    			var res = response.data;
		    			this.spinShow = false;

		    			if (res.code) {
		    				this.$Message.success(res.message);

		    				this.modalShow = false;
		        			this.$emit('on-success', res);
		    			} else {
		    				this.$Message.error(res.message);
		    			}
		    		});
        }
      });
    }

  },
  watch: {

  },
  mounted () {
    	this.init();
  }
}
</script>
