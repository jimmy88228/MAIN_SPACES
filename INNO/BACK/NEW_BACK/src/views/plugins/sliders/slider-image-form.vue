<style lang="less">
.slider-add-form{
	.image-box{
		height: 80px;
		line-height:75px;
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
    <div>
    	<Modal
	        v-model="modalShow"
	        class="slider-add-form"
	        :title="modalTitle"
	        :loading="modalLoading"
	        :width="500"
	        @on-ok="modalOk">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
	        	<FormItem prop="title" label="名称">
					<Input v-model="formItem.title" placeholder="请输入名称" style="width:250px;" />
	            </FormItem>
	            <FormItem prop="img_format" label="图片">
		        	<div class="image-box" @click="selectImage('img_format')" :style="sliderStyle">
			            <Icon v-show="(formItem.img_format=='')" type="md-add" size="30" title="添加图片"></Icon>
			        </div>
		        </FormItem>
		        <FormItem prop="source_id_str" label="关联到">
				    <!--添加链接组件-->
					<linkTo :itemIndex="0" :selectLink="selectLink" @on-selected="onSelectLink"></linkTo>
	            </FormItem>
	        	<FormItem label="是否启用">
					<i-switch v-model="formItem.enable" size="large">
		                <span slot="open">启用</span>
		                <span slot="close">关闭</span>
			        </i-switch>
				</FormItem>
				<FormItem label="排序">
					<Input v-model="formItem.sort" type="number" style="width:60px;" /> ( 数字大的排前面 )
	            </FormItem>
	        </Form>

	    </Modal>

	    <!--用户图片管理组件-->
        <userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>
    </div>
</template>

<script>
/**
 * 轮播器列表
 */
import util from '@/libs/util.js';
import userImages from '@/views/my-components/user-images/user-images.vue';
import linkTo from '@/views/my-components/link-to/link-to';

export default {
  name: 'sliderImageForm',
  components: {
    	userImages,
    	linkTo
  },
  data () {
    return {
      // 模态框
        	modalShow: false,
        	modalTitle: '轮播图片表单',
        	modalLoading: true,

        	formItem: {
        id: 0,
        title: '',
        img: '',
        img_format: '',
        source_id: 0,
        source_id_str: '',
        sort: 0,
        enable: false
        	},

        	// 表单数据规则
        	ruleValidate: {
        img_format: [{ required: true, type: 'string', message: '图片不能为空', trigger: 'blur' }]
        // source_id_str: [{ required: true, type:'string', message: '关联活动不能为空', trigger: 'blur' }],
        	},

        	// 源关联选中
        	selectLink: {}
    }
  },
  computed: {
    	sliderStyle () {
   			return {
   				'background-image': 'url(' + this.formItem.img_format + ')'
   			};
   		}
  },
  methods: {
    	/**
    	 * @desc 初始化方法
    	 */
    init () {

    },
    openModal (row) {
        	this.modalShow = true;

        	if (row == 0) {
        		this.formItem.id = 0;
        		this.formItem.title = '';
        		this.formItem.img = '';
        		this.formItem.img_format = '';
        		this.formItem.type = '';
        		this.formItem.source_id = 0;
        		this.formItem.activity_name = '';
        		this.formItem.source_id_str = '';
        		this.formItem.sort = 0;
        		this.formItem.enable = false;
        	} else {
        		this.formItem.id = row.id;
        		this.formItem.title = row.title;
        		this.formItem.img = row.img;
        		this.formItem.img_format = row.img_format;
        		this.formItem.type = row.source_type;
        		this.formItem.source_id = row.source_id;
        		this.formItem.activity_name = row.activity_name;
        		this.formItem.source_id_str = row.source_id > 0 ? 'success' : '';
        		this.formItem.sort = row.sort;
        		this.formItem.enable = row.enable == 1;
        	}

        	this.selectLink = {
        		code: this.formItem.type,
        		name: this.formItem.activity_name
        	};
    },
    // 选择商品图片
    	selectImage (objName) {
    		this.$refs['user-images'].showModal({
        		name: objName,
        		multi: 0,
        		selectedImage: this.formItem[objName]
        	});
    	},
    	// 选择图片的回调
    	returnImageUrl (obj) {
    		this.$set(this.formItem, obj.name, obj.val);

    		// 检查某个字段
      this.$refs.formValidate.validateField('img_format', (msg) => {
        // 检查图片是否为空
      });
    	},
    	// 链接到 选中后的回调
    	onSelectLink (index, selectedLink) {
    		this.selectLink = selectedLink;
    		this.formItem.type = this.selectLink.code;
    		this.formItem.source_id = this.selectLink.id;
    		this.formItem.activity_name = this.selectLink.name;
    	},
    // 保存表单修改
    	modalOk (code) {
    		this.$refs.formValidate.validate((valid) => {
        if (valid) {
          // ajax 获取场景列表
		        	util.ajax.post((this.formItem.id == 0 ? util.apiUrl.sliderImageAdd : util.apiUrl.sliderImageEdit), {
		        		id: this.formItem.id,
		        		title: this.formItem.title,
		        		img: this.formItem.img_format,
		        		type: this.formItem.type,
		        		source_id: this.formItem.source_id,
		        		activity_name: this.formItem.activity_name,
		        		sort: this.formItem.sort,
		        		enable: this.formItem.enable
		        	})
		    		.then((response) => {
		    			var res = response.data;
		    			this.spinShow = false;

		    			if (res.code) {
		    				this.$Message.success(res.message);
		    				this.modalShow = false;

		    				this.$emit('on-success', res);
		    			} else {
		    				// 验证失败，不关闭模态框
		                	this.modalShow = true;
		                    this.$Message.error(res.message);
		                    this.modalLoading = false;

		                    setTimeout(() => {
			                    this.modalLoading = true;
			                }, 50);
		    			}
		    		});
        } else {
                	// 验证失败，不关闭模态框
                	this.modalShow = true;
          this.$Message.error('必填项不能为空！');
          this.modalLoading = false;

          setTimeout(() => {
	                    this.modalLoading = true;
	                }, 50);
        }
      });
    	}
  },
  watch: {
  },
  mounted () {
    this.init();
  },
  created () {

  }
};
</script>
