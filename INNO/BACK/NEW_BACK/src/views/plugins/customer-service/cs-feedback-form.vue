<style lang="less">
.cs-feedback-form{
	.ivu-select-dropdown{
		z-index: 1000;
	}
}

.feedback-img-box{
	float:left;
	width:70px;
	margin-right:10px;
	margin-bottom:10px;

	.image-item{
		height: 70px;
		line-height:80px;
		width:100%;
		background:center center no-repeat;
		background-size: 100% auto;
		border: 1px solid #eee;
	    border-radius: 5px;
	    text-align: center;
	    position: relative;
		cursor: pointer;

		&:hover{
			.close, .handle{
				display: block;
			}
		}
		.close{
			font-size:20px;
			font-weight: bold;
			color:#ed4014;
			position: absolute;
			right:-10px;
			top:-10px;
			display: none;
			cursor: pointer;
		}
		.handle{
			font-size:20px;
			cursor:move;
			position: absolute;
	    	left: -5px;
	    	top: -10px;
	    	display: none;
		}
	}
}
.slick-feedbackImg-item{
	float:left;
	z-index:100;
}
</style>

<template>
	<div>
		<Modal
		    v-model="modalShow"
			class="cs-feedback-form"
			width="600"
			:styles="{top: '20px'}"
		    title="添加客服工单"
		    :loading="modalLoading"
		    @on-ok="modalOk">

	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
				<FormItem label="关联用户">
					<Avatar :src="typeof(sessInfo.get_user_info) != 'undefined' ? sessInfo.get_user_info.wx_avatar : '' " />
					<span style="margin-left:5px;">{{typeof(sessInfo.get_user_info) != 'undefined' ? sessInfo.get_user_info.wx_nick_name : ''}}</span>
				</FormItem>
				<FormItem label="指派给" prop="admin_id_str">
					<adminstor-select :data="adminstorData" type="radio" @del-tag="handleTag">
            <Button @click="openSelectAdmin" type="default">选择管理员...</Button>
          </adminstor-select>
					<div>这里选定的就是工单的处理人员</div>
				</FormItem>
				<FormItem label="分类" prop="cat_id_str">
					<Select v-model="formItem.cat_id" style="width:200px;" @on-change="onCatChange">
						<OptionGroup v-for="(cat0,index0) in catTree" :key="index0" :label="cat0.name">
							<Option v-for="(cat1,index1) in cat0.get_children" :key="index1" :value="cat1.id" style="text-indent:10px;">
								{{cat1.name}}
							</Option>
						</OptionGroup>
					</Select>
				</FormItem>
		        <FormItem label="问题描述" prop="fb_content">
					<Input v-model="formItem.fb_content" maxlength="250" show-word-limit type="textarea" :rows="6"
					placeholder="请输入问题描述..." style="width:400px;"></Input>
		        </FormItem>
				<FormItem label="优先级">
					<Select v-model="formItem.level" style="width:200px;">
						<Option v-for="(item,index) in levelList" :key="index" :value="index" style="text-indent:10px;">
							{{item.name}}
						</Option>
					</Select>
				</FormItem>
		        <FormItem label="上传图片">
					<!--图片列表-->
					<SlickList v-model="formItem.fb_images" :useDragHandle="true" axis="x">
						<SlickItem v-for="(img, indexImg ) in formItem.fb_images" :index="indexImg" :key="indexImg" :name="indexImg"
						v-if="indexImg <=4 "
						class="slick-feedbackImg-item feedback-img-box">
							<div class="image-item" :style="'background-image: url('+img+');'" title="点击查看大图" @click.stop="showImage(img)">
								<Icon type="ios-close-circle-outline" class="close" title="删除图片" @click.stop="onRemoveImage(indexImg)"/>
								<Icon v-handle class="handle" type="md-apps" title="拖动排序" />
							</div>
						</SlickItem>
					</SlickList>

					<div class="feedback-img-box" v-if="formItem.fb_images.length < 5 ">
						<div class="image-item" @click="selectImages('fb_images')" style="cursor: pointer;">
					        <Icon type="md-add" size="30" title="添加图片"></Icon>
					    </div>
					</div>

					<div style="width:100%;float:left;">如果有需要，可以上传图片说明，最多上传5张图片</div>
			    </FormItem>

	        </Form>
	   	</Modal>

		<!--用户图片管理组件-->
		<userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>

	</div>
</template>

<script>
import userImages from '@/views/my-components/user-images/user-images.vue';
import AdminstorSelect from '@/views/my-components/list-component/index-edit';
import {SlickList, SlickItem, HandleDirective } from 'vue-slicksort';

/**
 * 添加客服工单 - 表单
 */
export default {
	name: 'feedbackForm',
	directives: { handle: HandleDirective }, // vue-slicksort 的拖动手柄需要这个
    components: {
		userImages,
		AdminstorSelect,
		SlickList,
		SlickItem,
    },
    data () {
        return {
        	// 模态框
        	modalShow: false,
        	modalEditIndex: '',
			modalLoading: true,

			// 会话详情
			sessInfo:{},
        	// 表单内容
        	formItem: {
        		fb_images:[],
        		fb_content:'',
				admin_id: 0,
				admin_id_str: '',
				cat_id: 0,
				cat_id_str: '',
				level: 0,
        	},
        	catTree:[],
			levelList: [],

        adminstorData:{},

        	// 表单数据规则
        	ruleValidate:{
				fb_content:[{ required: true, message: '问题描述不能为空', trigger: 'blur' },],
				admin_id_str:[{ required: true, message: '指派人员不能为空', trigger: 'blur' },],
				cat_id_str:[{ required: true, message: '分类不能为空', trigger: 'blur' },],
        	},

        };
    },
    methods: {
    	init(){
    	},
        // 打开模态框
        openModal( sessInfo, catTree, levelList ){
        	this.modalShow = true;
			this.sessInfo = sessInfo;
			this.catTree = catTree;
			this.levelList = levelList;

    		// 重置表单
        	this.formItem.fb_images = [];
        	this.formItem.fb_content = '';
        	this.formItem.admin_id = 0;
        	this.formItem.admin_id_str = '';
        	this.formItem.cat_id = 0;
        	this.formItem.cat_id_str = '';
        	this.formItem.level = 0;
        },
    	// 模态框确认事件
        modalOk (){
        	this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                	this.$ajax.post( this.$api.csFeedbackAdd, {
						session_id: this.sessInfo.id,
						user_id: this.sessInfo.get_user_info.id,
						content_type: 5, // 固定5 表示客服工单
                		fb_content: this.formItem.fb_content,
						fb_images: this.formItem.fb_images,
						handler_admin_id: this.formItem.admin_id,
						cat_id: this.formItem.cat_id,
						level: this.formItem.level,
                	})
                	.then( (response) => {
		    			var res = response.data;
		    			if( res.code ){
		    				this.$Message.success( res.message );

		    				// 通知父级回调
		    				this.$emit('on-save', res.data );

							this.modalShow = false;
		    			}
		    			else{
							this.modalShow = true;
		    				this.$Message.error( res.message );

							this.modalLoading = false;
							setTimeout(() => {
								this.modalLoading = true;
							}, 50);
		    			}
					});
                }
                else{
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
		// 删除单张图片
		onRemoveImage( index ){
			this.$delete( this.formItem.fb_images, index);
		},
		// 选择图片（多图）
		selectImages(objName ){
			this.$refs['user-images'].showModal({
				name: objName,
				multi:1,
				selectedImages: [],
			});
		},
		// 选择图片的回调
		returnImageUrl( obj ){
			this.formItem.fb_images = [];
			for(var i in obj.val ){
				if( i <=4 ){
					this.formItem.fb_images.push(obj.val[i]);
				}
			}

		},
		// 查看大图
		showImage( imgSrc ){
			this.$util.viewImage( imgSrc, this );
		},
		// 打开选择管理员的框
		openSelectAdmin(){
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
			});
		},
		// 清除选中的管理员
		handleTag(){
			this.formItem.admin_id = 0;
			this.formItem.admin_id_str = '';
		},
		onCatChange( val ){
			if( this.formItem.cat_id > 0 ){
				this.formItem.cat_id_str = 'OK';
			}
			else{
				this.formItem.cat_id_str = '';
			}

			// 检查某个字段
			this.$refs['formValidate'].validateField('cat_id_str', ( msg )=>{
				// 检查图片是否为空
			});
		}
    },
    mounted () {
        this.init();
    },
}
</script>
