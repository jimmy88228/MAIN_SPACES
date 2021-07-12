<style lang="less">
</style>

<template>
	<Card v-show="modalShow">
		<div slot="title">
			<Tooltip content="返回">
				<Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/>
			</Tooltip>
		</div>
		<div slot="extra">
			<Button v-if="formItem.handle.edit" type="primary" @click="modalOk">保存</Button>
		</div>

		<!--表单-->
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">

	        <FormItem label="上级分类" prop="parent_id_str">
        		<Select v-model="formItem.parent_id" style="width:200px;" @on-change="catChange">
        			<Option v-for="(item,index) in catTree" :value="item.id" :key="index" :label="item.name">
        				<span v-if="item.level==1">&nbsp;&nbsp;</span>
        				<span v-else-if="item.level==2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        				<span>{{item.name}}</span>
        			</Option>
        		</Select>
			   	<span style="margin-left:10px;">(上级分类最多能选到第二级，最多能创建到第三级)</span>
		    </FormItem>
		    <FormItem label="分类名" prop="cat_name">
				<Input v-model="formItem.cat_name" placeholder="请输入名称" style="width:200px;"></Input>
	        </FormItem>
	        <FormItem label="排序号" prop="sort">
				<Input v-model="formItem.sort" type="number" placeholder="请输入排序号" style="width:80px;"></Input>
				<span>数字越大的排前面</span>
	        </FormItem>
	        <FormItem label="前端是否显示" prop="status">
				<i-switch v-model="formItem.status" size="large">
	                <span slot="open">显示</span>
	                <span slot="close">隐藏</span>
		        </i-switch>
	        </FormItem>
        </Form>

		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
   	</Card>
</template>

<script>
/**
 * 添加商品分类
 */
import util from '@/libs/util.js';

export default {
  name: 'articleCatForm',
  components: {

  },
  props: {
  },
  data () {
    const checkParentId = (rule, val, callback) => {
    		if (this.formItem.id > 0 && this.formItem.id == val[(val.length - 1)]) {
    			callback(new Error('上级分类不能是当前分类'));
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
        		id: 0,
        		name: '[顶级分级]',
        		level: 0
        	}],

        	// 表单内容
        	formItem: {
        		cat_name: '',
        		parent_id: 0,
        		parent_id_str: '',
        		sort: 0,
        		status: false,
        handle: {
          edit: false
        }
        	},

        	// 表单数据规则
        	ruleValidate: {
        cat_name: [{ required: true, message: '分类名不能为空', trigger: 'blur' }],
        parent_id_str: [{ validator: checkParentId, message: '上级分类不能是当前分类', trigger: 'blur' }]
        	}
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
    catChange (val) {
        	this.formItem.parent_id_str = 'rs:' + val;

        	// 检查某个字段
      this.$refs.formValidate.validateField('parent_id_str', (msg) => {
        // 检查图片是否为空
      });
    },
    // 打开模态框
    openModal (row, data) {
        	this.modalShow = true;

        	// 重置表单
        	this.$refs.formValidate.resetFields();

        	// 组装父级分类树
        	this.catTree = [];

        	this.catTree.push({
        		id: 0,
        		name: '[顶级分级]',
        		level: 0
        	});
        	for (var i in data) {
        		this.catTree.push({
	        		id: data[i].id,
	        		name: data[i].name,
	        		level: 1
	        	});

        		for (var j in data[i].get_children) {
        			// 第二级
        			this.catTree.push({
		        		id: data[i].get_children[j].id,
		        		name: data[i].get_children[j].name,
		        		level: 2
		        	});
        		}
        	}

      if (row.id == 0) {
        this.formItem.id = 0;
        this.formItem.cat_name = '';
        this.formItem.parent_id = 0;
        this.formItem.parent_id_str = '';
        this.formItem.sort = 0;
        this.formItem.status = false;
        this.formItem.handle = {
          edit: true
        };
      } else {
	    		// 编辑时候的初始化数据
	    		this.formItem.id = row.cat_id;
	    		this.formItem.cat_name = row.cat_name;
	    		this.formItem.parent_id = row.parent_id;
	    		this.formItem.parent_id_str = 'rs:' + row.parent_id;
	    		this.formItem.sort = row.sort;
	    		this.formItem.status = row.status == 1;
	        	this.formItem.handle = row.handle;
	        }
    },
    // 保存按钮
    modalOk () {
        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
		        	this.spinShow = true;

		        	util.ajax.post((this.formItem.id == 0 ? util.apiUrl.articleCatAdd : util.apiUrl.articleCatEdit), {
		        		id: this.formItem.id,
		 				parent_id: this.formItem.parent_id,
		 				cat_name: this.formItem.cat_name,
		 				sort: this.formItem.sort,
		 				status: this.formItem.status
		        	})
		    		.then((response) => {
		    			var res = response.data;
		    			this.spinShow = false;

		    			if (res.code) {
		    				this.$Message.success(res.message);

		    				this.modalShow = false;
		        			this.$emit('on-success', {});
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
