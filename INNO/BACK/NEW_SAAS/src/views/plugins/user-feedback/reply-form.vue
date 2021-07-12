<style lang="less">	
.reply-form{
	.ivu-select-dropdown{
		z-index: 1000;
	}
}

.reply-img-box{
	float:left;
	width:50px;
	margin-right:10px;
	margin-bottom:10px;
	
	.image-item{
		height: 50px;
		line-height:55px;
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
.slick-reply-feedbackImg-item{
	float:left;
	z-index:100;
}
</style>

<template>
	<div class="reply-form">
		<Modal v-model="modalShow"
		title="回复"
		width="700"
		:styles="modalStyles()"
		@on-ok="modalOk">
			
	        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
		       <FormItem label="上传图片">
					<!--图片列表-->
					<SlickList v-model="formItem.images" :useDragHandle="true" axis="x">
						<SlickItem v-for="(img, indexImg) in formItem.images" :index="indexImg" :key="indexImg" :name="indexImg" 
						v-if="indexImg <=4 "
						class="slick-reply-feedbackImg-item reply-img-box">
							<div class="image-item" :style="'background-image: url('+img+');'" title="点击查看大图" @click.stop="showImage(img)">
								<Icon type="ios-close-circle-outline" class="close" title="删除图片" @click.stop="onRemoveImage(indexImg)"/>
								<Icon v-handle class="handle" type="md-apps" title="拖动排序" />
							</div>
						</SlickItem>
					</SlickList>

					<div class="reply-img-box" v-if="formItem.images.length < 5 ">
						<div class="image-item" @click="selectImages('images')" style="cursor: pointer;">
							<Icon type="md-add" size="25" title="添加图片"></Icon>
						</div>
					</div>
				   
					<div style="margin-left:20px;">最多上传5张图片</div>
				</FormItem>
				
			    <FormItem label="回复内容" prop="content">
					<Input v-model="formItem.content" maxlength="130" show-word-limit type="textarea" :rows="6" 
					placeholder="" style="width:500px;"></Input>
				</FormItem>	
	        </Form>
			
	   	</Modal>
		
		<!--用户图片管理组件-->
		<userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>	

<script>
import util from '@/libs/util.js';
import userImages from '@/views/my-components/user-images/user-images.vue';
import {SlickList, SlickItem, HandleDirective } from 'vue-slicksort';

export default {
	name: 'replyForm',
    components: {
		userImages,
		SlickList,
		SlickItem,
    },
    data() {

        return {
        	// 模态框
        	modalShow: false,
        	spinShow: false,
			
        	// 表单内容
        	formItem: {
				feedback_id: 0,
        		images:[],
        		content:'',
        	},
        	
        	// 表单数据规则
        	ruleValidate:{
				content:[{ required: true, message: '问题描述不能为空', trigger: 'blur' },],
        	},

        	statusList:[],
        };
    },
    methods: {
    	init(){
    	},
		// modal 的样式
		modalStyles(){
			return {
				top: (document.body.clientHeight - 400) + 'px'
			}
		},
		// 打开模态框
		openModal ( feedback_id ){
			this.modalShow = true;
			this.formItem.feedback_id = feedback_id;
			
			// 编辑时候的初始化数据
			this.formItem.images = [];
			this.formItem.content = '';
		},
    	// 模态框确认事件
        modalOk (){
        	this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                	this.spinShow = true;
                	util.ajax.post( util.apiUrl.userFeedbackReplyAdd, {
                		feedback_id:this.formItem.feedback_id,
                		images: this.formItem.images,
                		content: this.formItem.content,
                	})
                	.then( (response) => {
						this.spinShow = false;
		    			var res = response.data;
		    			if( res.code ){
		    				this.$Message.success( res.message );
							
							this.modalShow = false;
							
		    				// 通知父级回调
		    				this.$emit('on-save', res.data );
		    			}
		    			else{
		    				this.$Message.error( res.message );
		    			}
					});
                	
                }
                else{
                	// 验证失败，不关闭模态框
                	this.modalShow = true;
                    this.$Message.error('必填项不能为空！');
                }
          	});
        },
		// 删除单张图片
		onRemoveImage( index ){
			this.$delete( this.formItem.images, index);
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
			this.formItem.images = [];
			for(var i in obj.val ){
				if( i <=4 ){
					this.formItem.images.push(obj.val[i]);
				}
			}
			
		},
		// 查看大图
		showImage( imgSrc ){
			util.viewImage( imgSrc, this );
		}
    },
    mounted () {
        this.init();
    },
}
</script>