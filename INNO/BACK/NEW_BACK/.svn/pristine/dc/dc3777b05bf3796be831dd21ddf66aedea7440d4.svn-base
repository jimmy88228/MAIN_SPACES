<style lang="less">
.official-account{
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
	.basic_num{
    	display: inline-block;
		width: 140px;
	}
}
</style>

<template>
    <div class="official-account">
        <Card>
            <div slot="title" class="title">
               	<Icon type="md-cube"></Icon> 关注公众号提醒
            </div>

            <!--用户图片管理组件-->
            <userImages ref="userImages" @on-return-url="returnImageUrl"></userImages>

            <div class="info-body">
		        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
		        	<Row :gutter="30">
			        	<Col :span="12">
					        <FormItem label="活动时间：" prop="time">
								<DatePicker type="datetimerange" v-model="formItem.validityTime" placeholder="请选择有效期" style="width: 340px;"
										confirm transfer></DatePicker>
							</FormItem>
			        	</Col>
			        </Row>

			        <Row :gutter="30">
		        		<Col :span="12">
					       <FormItem label="是否启用：" prop="is_enabled">
								<RadioGroup v-model="formItem.is_enabled">
								<Radio label="1" >是</Radio>
								<Radio label="0" >否</Radio>
								</RadioGroup>
							</FormItem>
			        	</Col>
			        </Row>

			        <Row :gutter="30">
						<Col :span="12">
					        <FormItem label="广告位：" prop="logo">
					        	<div class="image-box" @click="openImagesModal('ad_slot_img', formItem.ad_slot_img )" :style="'background-image: url('+formItem.ad_slot_img+');'">
						            <Icon type="md-add" size="30" v-show="(formItem.ad_slot_img==''?true:false)"></Icon>
						        </div>
					        </FormItem>
			        	</Col>
			        </Row>

					<Row :gutter="30">
		        		<Col :span="12">
					        <FormItem label="跳转路径：" prop="jump_path">
					        	<Input v-model="formItem.jump_path" placeholder="请输入跳转路径"></Input>
					        </FormItem>
					    </Col>
			        </Row>

			        <Row :gutter="30">
		        		<Col :span="12">
					        <FormItem label="推送评率：" prop="push_frequency_type_show">
								<RadioGroup v-model="formItem.push_frequency_type_show">
									<Radio label="1" >一次推送</Radio>
									<Radio label="2" >多次推送</Radio>
									<div v-show="formItem.push_frequency_type_show == 2">
										<span >
											每<input-num v-model="formItem.push_frequency_type" class="basic_num" ></input-num> 天推送一次
										</span> 
									</div>
								</RadioGroup>
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
import DateSelect from '@/views/my-components/date-select/index.vue';
import InputNum from '@/views/my-components/input-num/input-num';

export default {
  components: {
    userImages,
	DateSelect,
	InputNum
  },
  data () {
    return {
      formItem: {
				// from_time: '',
				// to_time: '',
				is_enabled: '0',
				ad_slot_img: '',
				jump_path: '',
				push_frequency_type_show: '0',
				push_frequency_type: '1',
				validityTime: []



      },

      save_loading: false,

      // 表单数据规则
        	ruleValidate: {
        // name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
        	}
    };
  },
  methods: {
    	init () {
    		this.save_loading = true;
      // ajax 请求获取初始化数据，然后动态更新下面数据源
        	this.$ajax.post(this.$api.seckillOfficialAccountInfo, {

        	})
    		.then((response) => {
    			var res = response.data;
    			this.save_loading = false;

    			if (res.code) {
					// 初始化表单数据
					this.formItem = res.data;
					console.log(this.formItem)
    			}
        });
       	},
    // 调起图片选择器
    openImagesModal (name, url) {
        	var obj = {
				type: "IMAGE",
        		name: name,
        		selectedImage: url
        	};
        	this.$refs.userImages.showModal(obj);
    },
    // 图片选择组件的回调
    	returnImageUrl (obj) {
			console.log("obj", obj)
    		this.$set(this.formItem, obj.name + '_format', obj.val);
    		// 获取图片的相对名称
    		this.$set(this.formItem, obj.name, obj.val);
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
                	this.$ajax.post(this.$api.seckillOfficialAccountSave, {
        				ad_slot_img: this.formItem.ad_slot_img,
						is_enabled: this.formItem.is_enabled,
						jump_path: this.formItem.jump_path,
						push_frequency_type_show: this.formItem.push_frequency_type_show,
						push_frequency_type: this.formItem.push_frequency_type,
						validityTime:this.formItem.validityTime
	            	})
		    		.then((response) => {
		    			var res = response.data;
		    			this.save_loading = false;

		    			if (res.code) {
		    				// 保存成功
	                        this.$Message.success(res.message);
	                    } else {
                    		this.$Message.error(res.message);
		    			}
		    		});
        } else {
          this.$Message.error('必填项不能为空！');
        }
      });
    },
	handleStart(date) {
		this.formSearch.from_time = date;
	},
	handleEnd(date) {
		this.formSearch.to_time = date;
	},
  },
  mounted () {
    this.init();
  }
};
</script>
