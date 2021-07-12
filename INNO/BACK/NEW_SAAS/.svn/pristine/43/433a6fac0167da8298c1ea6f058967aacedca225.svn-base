<style lang="less">
.brand-info{
	.info-body{
		margin-top: 50px;
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

	.ivu-col-span-8{
		width:32%;
	}
}
</style>

<template>
    <div class="brand-info">
        <Card>
            <div slot="title" class="title">
               	<Icon type="md-cube"></Icon> 企业信息
            </div>

            <!--用户图片管理组件-->
            <userImages ref="userImages" @on-return-url="returnImageUrl"></userImages>

            <div class="info-body">
		        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
		        	<Row :gutter="30">
			        	<Col :span="12">
					        <FormItem label="品牌Logo：" prop="logo">
					        	<div class="image-box" @click="openImagesModal('logo', formItem.logo_format )" :style="'background-image: url('+formItem.logo_format+');'">
						            <Icon type="md-add" size="30" v-show="(formItem.logo_format==''?true:false)"></Icon>
						        </div>
					        </FormItem>
			        	</Col>
			        	<Col :span="12">
		        			<FormItem label="服务号二维码：" prop="wx_qrcode">
					        	<div class="image-box" @click="openImagesModal('wx_qrcode', formItem.wx_qrcode_format)" :style="'background-image: url('+formItem.wx_qrcode_format+');'">
						            <Icon type="md-add" size="30" v-show="(formItem.wx_qrcode_format==''?true:false)"></Icon>
						        </div>
					        </FormItem>
			        	</Col>
			        </Row>

			        <Row :gutter="30">
		        		<Col :span="12">
					        <FormItem label="品牌名称：" prop="name">
					        	<Input v-model="formItem.name" placeholder="品牌名称"></Input>
					        </FormItem>
			        	</Col>
			        	<Col :span="12">
					        <FormItem label="联系人：" prop="linkman">
					        	<Input v-model="formItem.linkman" placeholder="品牌联系人"></Input>
					        </FormItem>
			        	</Col>
			        </Row>

			        <Row :gutter="30">
		        		<Col :span="12">
					        <FormItem label="联系电话：">
					        	<Input v-model="formItem.tel" placeholder="品牌联系电话"></Input>
					        </FormItem>
			        	</Col>
			        	<Col :span="12">
					        <FormItem label="手机号：">
					        	<Input v-model="formItem.mobile" placeholder="品牌联系人手机号"></Input>
					        </FormItem>
			        	</Col>
			        </Row>

					<Row :gutter="30">
		        		<Col :span="12">
					        <FormItem label="省/市/区：">
					            <al-selector v-model="formItem.arr_area" level="2" />
					        </FormItem>
					    </Col>
					    <Col :span="12">
					        <FormItem label="详细地址：">
					        	<Input v-model="formItem.address" placeholder="请输入详细地址"></Input>
					        </FormItem>
					    </Col>
			        </Row>

			        <Row :gutter="30">
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
			        <Spin size="large" fix v-if="save_loading"></Spin>
		        </Form>
		        <Divider />
		        <div style="text-align: center;"><Button type="primary" @click="modalOk">保存</Button></div>
	        </div>
        </Card>

    </div>
</template>

<script>
import util from '@/libs/util.js';
import userImages from '@/views/my-components/user-images/user-images.vue';

export default {
  components: {
    userImages
  },
  data () {
    return {
      formItem: {
            	arr_area: [],
        		logo: '',
        		logo_format: '',
        		wx_qrcode: '',
        		wx_qrcode_format: ''
      },

      save_loading: false,

      // 表单数据规则
        	ruleValidate: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
        	}
    };
  },
  methods: {
    	init () {
    		this.save_loading = true;
      // ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.brandInfo, {

        	})
    		.then((response) => {
    			var res = response.data;
    			this.save_loading = false;

    			if (res.code) {
            // 初始化表单数据
            this.formItem = res.data;
            this.formItem.arr_area = res.data.arr_area_format;
    			}
        });
       	},
    // 调起图片选择器
    openImagesModal (name, url) {
        	var obj = {
        		name: name,
        selectedImage: url
        	};
        	this.$refs.userImages.showModal(obj);
    },
    // 图片选择组件的回调
    	returnImageUrl (obj) {
    		this.$set(this.formItem, obj.name + '_format', obj.val);
    		// 获取图片的相对名称
    		this.$set(this.formItem, obj.name, this.basename(obj.val));
    	},
    	// 类似php 的basename 函数
    	basename (str) {
      var idx = str.lastIndexOf('/')
      idx = idx > -1 ? idx : str.lastIndexOf('\\')
      if (idx < 0) {
			    return str;
      }
      return str.substring(idx + 1);
    },
    // 保存事件
    modalOk () {
        	this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	this.save_loading = true;

                	// ajax 保存编辑数据
                	util.ajax.post(util.apiUrl.brandInfoEdit, {
        				logo: this.formItem.logo_format,
        				wx_qrcode: this.formItem.wx_qrcode,
        				name: this.formItem.name,
        				linkman: this.formItem.linkman,
        				tel: this.formItem.tel,
        				mobile: this.formItem.mobile,
        				arr_area: this.formItem.arr_area,
        				address: this.formItem.address
	            	})
		    		.then((response) => {
		    			var res = response.data;
		    			this.save_loading = false;

		    			if (res.code) {
		    				// 保存成功
	                        this.$Message.success(res.message);

	                        this.$store.commit('setLogoBrandName', { logo: this.formItem.logo_format, brandName: this.formItem.name });
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
};
</script>
