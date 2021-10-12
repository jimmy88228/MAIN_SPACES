<style lang="less">
.rank-form{
	.ivu-form-item{
	    ol{
	        line-height: 25px;
	        margin-left: 30px;
	        float: left;
	        list-style: decimal;
	    }
	}

	.image-box{
		width: 100px;
		height:100px;
		line-height:100px;
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
		<Modal
	        v-model="modalShow"
	        :title="modalTitle"
	        :loading="modalLoading"
	        class="rank-form"
	        @on-ok="modalOk">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">

		        <FormItem label="等级名称" prop="rank_name">
		            <Input v-model="formItem.rank_name" placeholder="请输入等级名称"></Input>
		        </FormItem>
		        <FormItem label="成长值达到" prop="min_credits">
		            <InputNumber v-model="formItem.min_credits"></InputNumber>
		            <div><span>当会员总成长值达到这个数字，就可以自动升级；<a @click="goCredis">设置成长值</a> </span></div>
		        </FormItem>
		        <FormItem label="等级背景图" prop="avatar">
		        	<div class="image-box" @click="selectImages(rankImage)" :style="'background-image: url('+rankImage+');'">
			            <Icon type="ios-cloud-upload-outline" size="40" v-show="(rankImage==''?true:false)"></Icon>
			        </div>
				    <ol>
				    	<li>小于500K的图片</li>
				    	<li>JPG/PNG格式</li>
				    	<li>建议长宽：640x167</li>
				    </ol>
		        </FormItem>

	        </Form>
	   	</Modal>

		<!--用户图片管理组件-->
        <userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>

	</div>
</template>

<script>
import util from '@/libs/util.js';
import userImages from '@/views/my-components/user-images/user-images.vue';

export default {
  name: 'rankForm',
  components: {
    	userImages
  },
  props: {

  },
  data () {
    return {
        	// 表单内容
        	formItem: {
        		id: 0,
        		rank_name: '',
        		min_credits: 0
        	},

        	// 表单数据规则
        	ruleValidate: {
        rank_name: [{ required: true, type: 'string', message: '等级名称不能为空', trigger: 'blur' }],
        min_credits: [{ required: true, type: 'number', message: '成长值不能为空', trigger: 'blur' }]
        	},

        	// 模态框
        	modalShow: false,
        	modalTitle: '配置会员等级',
        	modalLoading: true,

      // 等级背景图片
      rankImage: ''
    }
  },
  methods: {
    	// 初始化方法
    init () {
    },
    // 打开模态框
    openModal (row) {
        	this.modalShow = true;
        	// 重置表单
        	this.$refs.formValidate.resetFields();

        	if (typeof (row.last_credits) !== 'undefined') {
        		this.ruleValidate.min_credits[1] = { type: 'number', min: row.last_credits, message: '用户名不能小于' + row.last_credits, trigger: 'blur' };
        	}

    		// 初始化表单数据
        	this.formItem.id = typeof (row.id) !== 'undefined' ? Number(row.id) : 0;
        	if (this.formItem.id == 0) {
        // 添加
        this.formItem = {
          id: 0,
	        		rank_name: '',
	        		min_credits: typeof (row.last_credits) !== 'undefined' ? row.last_credits : 0
        };
        this.rankImage = '';
        	} else {
        		this.formItem.id = row.id;
        		this.formItem.rank_name = row.rank_name;
        		this.formItem.min_credits = row.min_credits;

        		this.rankImage = row.rank_image_format;
        	}
    },
    // 模态框确认事件
    modalOk () {
        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	// ajax 保存编辑数据
                	util.ajax.post((this.formItem.id == 0 ? util.apiUrl.userRankAdd : util.apiUrl.userRankEdit), {
                		id: this.formItem.id,
                		rank_name: this.formItem.rank_name,
                		min_credits: this.formItem.min_credits,
                		rank_image: this.rankImage
                	})
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		    				// 保存成功
	                        this.$Message.success(res.message);
	                        this.modalShow = false;

                        	// 回调给列表
                        	this.$emit('on-save', {});
	                    } else {
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
    },
    // 打开选择图片组件
    selectImages (url) {
        	this.$refs['user-images'].showModal({
        name: 'rankImage',
        selectedImage: url
      });
    },
    // 图片选择组件的回调
    	returnImageUrl (obj) {
    		this.$set(this, obj.name, obj.val);
    	},
    	// 跳转到成长值管理
    	goCredis () {
    		this.$router.push('/user/credits');
    	}
  },
  mounted () {
    this.init();
  }
}
</script>
