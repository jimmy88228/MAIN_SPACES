<style lang="less">
.user-video-modal-body{
	.ivu-input-icon-clear{
		right:50px;
    }
	.upload-btn-box{
		width:100%;
		height: 35px;
	}
	.video-cat{
		height:100%;
		overflow-y: auto;
		overflow-x: hidden;
		width:100%;
    	margin-top: 10px;

    	.cat-item{
    		font-size:14px;
    		margin: 5px 5px 5px 0;
		    padding: 8px 20px 8px 10px;
		    cursor: pointer;
		    border-radius: 5px;
		    position: relative;
		    background: #efefef;

		    .edit-box{
		    	position: absolute;
		    	right:0;
		    	top:-4px;
		    	width:20px;

		    	i{
		    		display:none;
		    	}
		    }
		    &:hover .edit-box i{
	    		display:block;
	    		color:rgba(0,0,0,.4);
	    		margin-top:6px;
	    	}
    	}
    	.cat-item.curr{
    		color:#fff;
    		background: #5cadff;
    	}
	}

	.scroll-content{
		height:380px;
		overflow-y: auto;
		overflow-x: hidden;
		width:100%;
		border: 1px solid #eee;
    	margin-top: 10px;

		.list-box{
			.list-item{
				border:1px solid rgba(0,0,0,.04);
				width:120px;
				height:160px;
				margin:10px;
				border-radius: 5px;
				background: #fff;
				cursor: pointer;

				&:hover{
					box-shadow: 0 0 3px 4px rgba(0,0,0,.05);
				}
				.close{
					display:none;
					position: absolute;
				    font-size: 24px;
				    right: -10px;
				    top: -10px;
				    color:orangered;
				    background: #fff;
				    border-radius: 100%;
				}
				&:hover .close{
					display:block;
				}
				.play{
					display:none;
					position: absolute;
				    font-size: 22px;
				    right: -10px;
				    top: 20px;
				    color: #2db7f5;
				    background: #fff;
				    border-radius: 100%;
				    padding:0 0 0 1px;
				}
				&:hover .play{
					display:block;
				}

				.img-remark-box{
					font-size:12px;
					margin-top: 10px;

					.img-remark{
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.icon{
						font-size: 18px;
    					margin-left: 10px;
    					color:#ddd;
					}
				}

				.checked-icon{
					position: absolute;
					right: -1px;
				    bottom: 0;
				    font-size: 24px;
				    color: orangered;
				    display:none;
				}
			}
			.act-thumb{
				background:no-repeat center center #000;
				background-size: 100% auto;
				height:120px;
				line-height:120px;
				text-align: center;
			}
		}
		.list-item.curr{
			border:2px solid red;

			.checked-icon{
				color:red;
				display: block;
			}
		}
		.list-item.multi.curr{
			border:2px solid #2b85e4;

			.checked-icon{
				color:#2b85e4;
				display: block;
			}
		}
		.list-item.multi.disabled{
			border:2px solid #ddd;

			.checked-icon{
				color:#ddd;
				display:block;
			}
		}
	}

}

.video-list-modal{
	.ivu-modal-content{
		background: transparent;
		box-shadow: none;
	}

	.video-js{
		width: 100%;
    	min-height: 300px;
	}
}
</style>

<template>
	<div class="user-video-modal-body">
    	<!--上传按钮-->
    	<div v-if="can.canUpload" class="upload-btn-box">
    		<Upload ref="upload"
    		multiple
    		style="float:left;"
			:show-upload-list="false"
			name="video_file"
			:data="uploadExtData"
			:max-size="20480"
			:format="['mp4',]"
			:action="posterUploadUrl"
			:on-exceeded-size="posterMaxSize"
			:on-format-error="posterFormatError"
			:before-upload="posterBeforeUpload"
			:on-success="posterUploadSuccess">
				<div>
		            <Button type="info" icon="md-add">上传视频</Button>
		       	</div>
		    </Upload>

    		<Input v-model="searchq" placeholder="搜索视频备注关键词"  style="width:200px;float:right;" search enter-button clearable
				@on-search="goSearch"
				@on-clear="goSearch"
				@keydown.native.enter.prevent ="goSearch"/>
    	</div>

    	<Row :gutter="8">
			<Col span="4">
        		<!--分类名-->
        		<div class="video-cat" style="border-top:1px solid #ddd;padding-top:5px;">
        			<div :class="'cat-item'+(showUserCatIndex == 0 ? ' curr':'')" @click="showUserCatImg(0)">全部分类</div>
        			<div v-for="(cat,cindex) in userCats" :name="cindex" :key="cindex"
        				:class="'cat-item'+(showUserCatIndex == cat.id ? ' curr':'')" @click="showUserCatImg(cat.id)">
        				{{cat.name}}

        				<div class="edit-box">
        					<Icon v-if="can.canEditCat" type="md-settings" size="14" title="编辑分类" @click="openCatModal(cindex)"></Icon>
        					<Icon v-if="can.canRemoveCat" type="md-trash" size="14" title="删除分类" @click="onRemoveCat(cindex,cat.id)"></Icon>
        				</div>
        			</div>

        			<!--添加分类气泡-->
        			<Poptip v-model="showAddCatPop" placement="bottom-start" width="220" @on-popper-show="onAddCat">
	        			<div class="cat-item" style="background:#2db7f5;color:#fff;font-size:12px;padding:4px 10px;" v-if="can.canAddCat">
	        				<Icon type="md-add"></Icon> 创建分类
	        			</div>

	        			<div slot="content" style="padding:5px;">
	        				<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="60">
		        				<FormItem prop="name" label="分类名">
					                <Input v-model="formItem.name" size="small" placeholder="请输入分类名称"></Input>
					           	</FormItem>
				           	</Form>
				           	<div style="text-align: center;">
				           		<Button type="default" size="small" @click="closeCatPoptip">取消</Button>
				           		<Button type="primary" size="small" @click="addCat" :loading="addCatLoading">保存</Button>
				           	</div>
	        			</div>
        			</Poptip>

        		</div>
			</Col>

			<Col span="20">
	        	<!--视频列表-->
	        	<div class="scroll-content" :style="getContentHeight"  v-if="showScrollContent">

	        		<Row class="list-box">

	        			<!--上传中的视频列表（只是临时看，不能操作）-->
	        			<Col v-for="(item,index0) in uploadList" :key="('u'+index0)" :id="('vid'+index0)" span="6">
							<div v-if="item.status === 'finished'">
							    <div class="act-thumb">
							    	<Icon type="ios-play" color="#fff" size="35"></Icon>
							    </div>
							</div>
							<div v-else>
							    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info style="margin-top:60px;"></Progress>
							</div>
						</Col>

						<!--数据库中的视频列表（可以操作）-->
		        		<Col v-for="(item,index) in list" :key="('e'+index)" :id="('vxx'+timestamp+index)" span="6"
		        			:class="itemClass(item)" @click.native="selectedVideo('vxx'+timestamp+index, item.img_src_format)">
				        	<div class="act-thumb" title="请点击选择视频">
				        		<Icon type="ios-play" color="#fff" size="35"></Icon>
				        		<Icon v-if="can.canRemove" type="md-close-circle" class="close" @click="removeVideo(item.id, 'list', index)" title="删除视频"></Icon>
				        		<Icon type="md-arrow-dropright-circle" class="play" @click="playVideo(item.id, item.img_src_format)" title="播放视频"></Icon>
				        		<Icon class="checked-icon ionmy ion-my-checked"></Icon>
				        	</div>

				        	<div class="img-remark-box" title="请点击选择视频">
				        		<Row v-show="item.edit==false">
						        	<Col class="img-remark" span="18">{{item.img_remark}}</Col>
									<Col span="6" v-if="can.canEdit"><Icon class="icon" type="md-create" title="修改备注信息" @click.stop="editRemark(index,item.id,'list')" /></Col>
								</Row>
								<Row v-show="item.edit" :gutter="5">
									<Col span="14"><Input size="small" v-model="item.img_remark" placeholder="备注"/></Col>
									<Col span="10">
										<Button type="text" size="small" @click.stop="saveRemark(index,item.id,'list')" style="padding:0;">
											<Icon type="md-checkmark" color="#2d8cf0" size="18" />
										</Button>
										<Button type="text" size="small" @click.stop="cancelRemark(index,item.id,'list')" style="padding:0;">
											<Icon type="md-close" color="#ff9900" size="18" />
										</Button>
									</Col>
								</Row>
							</div>
				        </Col>

				    </Row>

	        	</div>
	        </Col>
	    </Row>

	    <!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>

    	<div v-show="pageTotal>0" style="margin: 5px 10px 0 10px;overflow: hidden">
	        <div style="float: right;">
	            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
	        </div>
	    </div>

	    <Modal
	        v-model="modalShow"
	        title="编辑分类名称"
	        :loading="modalLoading"
	        @on-ok="onSaveCat">
		    <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
				<FormItem prop="name" label="分类名">
	                <Input v-model="formItem.name" size="small" style="width:200px;" placeholder="请输入分类名称"></Input>
	           	</FormItem>
	       </Form>
		</Modal>

		<Modal
			v-model="modalPlayShow"
	        title=""
	        :styles="{top: '20px'}"
	        class="video-list-modal"
	        :loading="modalPlayLoading"
	        footer-hide>
			<!--视频播放器-->
			<video-player ref="videoPlayer" :options="playerOptions"></video-player>
		</Modal>
    </div>
</template>

<script>
/**
 * 视频素材管理
 */
import util from '@/libs/util.js';
import Cookies from 'js-cookie';
// 载入videojs 组件
import 'video.js/dist/video-js.css';
import { videoPlayer } from 'vue-video-player';

export default {
  name: 'userVideoList',
  components: {
    videoPlayer
  },
  props: {
    	fromMenu: {
    		type: Number,
    		default: 0
    	}
  },
  data () {
    	return {
    		// 视频列表
      list: [],

      // 用户的分类
      userCats: [],

      spinShow: false,

      searchq: '',
    		pageTotal: 0,
        	pageSize: 20,

        	multi: 0,
        	multiSelectedImgUrlBind: [],

        	modalPlayShow: false,
        	modalPlayLoading: false,

      // 权限控制
    		can: {
	    		canUpload: false,
	    		canEdit: false,
	    		canRemove: false,
	    		canAddCat: false,
	    		canEditCat: false,
	    		canRemoveCat: false
    		},

    		// 上传中的文件列表
    		uploadList: [],

      // 海报上传地址
      posterUploadUrl: '',

      // 选中的视频
      selectedImgUrl: '',

      // 上传文件数的计数器
      uploadNum: 0,

      // 用户素材分类（选中分类ID）
      showUserCatIndex: 0,
      showAddCatPop: false,
      addCatLoading: false,
      modalShow: false,
      modalLoading: true,

      timestamp: 0,
      // 添加页面 表单内容
        	formItem: {
        		id: 0,
        		index: 0,
        name: ''
        	},
        	// 表单数据规则
        	ruleValidate: {
        		name: [{ required: true, message: '分类名称不能为空', trigger: 'blur', max: 40 }]
        	},

        	// 播放器配置
      playerOptions: {
        autoplay: true,
		        sources: [{
		            type: 'video/mp4',
		            src: ''
		        }],
		        notSupportedMessage: '此视频暂无法播放，请稍后再试'
      },
      showScrollContent: false
    	}
  },
  computed: {
    	uploadExtData () {
    		return {
    			cat_id: this.showUserCatIndex,
    			type: 'video'
    		};
    	},
    	// 获取内容框高度（在后台菜单打开的情况下才使用）
    	getContentHeight () {
    		if (this.fromMenu == 1) {
    			return {
    				height: (document.body.clientHeight - 250) + 'px'
    			};
    		} else {
          return {
            height: (document.body.clientHeight - 280) + 'px',
          };
    		}
    	}
  },
  methods: {
    	init () {
      // 初始化上传地址(提供给组件使用)
    		this.posterUploadUrl = util.apiHost + util.apiUrl.uploadImages + '?access-token=' + Cookies.get('accessToken');

    		this.fromMenu == 1 ? this.pageSize = 40 : '';
    	},
    	// 初始化数据
    	initData (res, multi, multiSelectedImgUrlBind, selectedImgUrl) {
      this.showScrollContent = true;
    		this.searchq = '';
      this.multi = multi;
      this.multiSelectedImgUrlBind = multiSelectedImgUrlBind;
      this.selectedImgUrl = selectedImgUrl;
      this.showUserCatIndex = 0;

      this.timestamp = (new Date().getTime());

      if (typeof (res.data.total) !== 'undefined') {
        this.pageTotal = res.data.total;
	    		this.list = res.data.items;
        this.userCats = res.data.userCats;
        this.can = res.data.can;
      }

      // 清理上传列表
    		if (this.can.canUpload) {
    			window.setTimeout(() => {
    				this.$refs.upload.clearFiles();
    				this.uploadList = this.$refs.upload.fileList;
    			}, 3000);
    		}
    	},
    	// 搜索按钮
    goSearch () {
        	this.spinShow = true;

        	// ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.userImageList, {
        		type: 'video',
        		pageSize: this.pageSize,
 				searchq: this.searchq,
 				cat_id: this.showUserCatIndex
        	})
    		.then((response) => {
    			var res = response.data;

    			if (res.code) {
    				this.list = res.data.items;

    				this.spinShow = false;
    				this.pageTotal = res.data.total;
    			} else {
    				this.$Notice.warning({
		                title: '获取视频列表失败',
		                desc: res.message
		            });
    			}
    		});
    },
    // 分页
    changePage (page) {
        	this.spinShow = true;

        	// ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post(util.apiUrl.userImageList, {
        		type: 'video',
        		pageSize: this.pageSize,
 				searchq: this.searchq,
 				page: page,
 				cat_id: this.showUserCatIndex
        	})
    		.then((response) => {
    			var res = response.data;
    			this.spinShow = false;

    			if (res.code) {
    				this.list = res.data.items;

    				this.spinShow = false;
    				this.pageTotal = res.data.total;
    			} else {
    				this.$Notice.warning({
		                title: '获取视频列表失败',
		                desc: res.message
		            });
    			}
    		});
    },
    // 列表的css 类
    itemClass (item) {
        	return 'list-item ' + (this.multi == 1 ? 'multi' : '') +
        			((this.selectedImgUrl != '' && item.img_src_format == this.selectedImgUrl) ? ' curr' : '') +
        			((this.multiSelectedImgUrlBind.length > 0 && this.multiSelectedImgUrlBind.indexOf(item.img_src_format) !== -1) ? ' disabled' : '');
    },
    // 选中视频
    selectedVideo (index, url) {
        	this.$emit('on-selected-video', index, url);
    },
    // 更新备注信息
    editRemark (index, id, type) {
        	if (type == 'list') {
        		this.$set(this.list[index], 'edit', true);
        	} else if (type == 'uploadList') {
        		this.$set(this.uploadList[index], 'edit', true);
        	}
    },
    // 取消按钮
    cancelRemark (index, id, type) {
        	if (type == 'list') {
        		this.$set(this.list[index], 'edit', false);
        	} else if (type == 'uploadList') {
        		this.$set(this.uploadList[index], 'edit', false);
        	}
    },
    // 保存备注信息
    saveRemark (index, id, type) {
        	var img_remark = '';
        	var img_id = 0;
        	if (type == 'list') {
        		img_remark = this.list[index].img_remark;
        		img_id = this.list[index].id;
        	} else if (type == 'uploadList') {
        		img_remark = this.uploadList[index].img_remark;
        		img_id = this.uploadList[index].id;
        	}

        	util.ajax.post(util.apiUrl.userImageUpdateRemark, {
        		id: img_id,
 				img_remark: img_remark
        	})
    		.then((response) => {
    			var res = response.data;

    			if (res.code) {
    				this.$Message.success(res.message);

    				if (type == 'list') {
		        		this.$set(this.list[index], 'edit', false);
		        	} else if (type == 'uploadList') {
		        		this.$set(this.uploadList[index], 'edit', false);
		        	}
    			} else {
    				this.$Message.error(res.message);
    			}
    		});
    },
    // 视频上传处理
    posterMaxSize (file) {
      this.$Notice.warning({
        title: '超过了最大文件限制',
        desc: '文件  ' + file.name + ' 超过了 2M，请控制在2M以内.'
      });
    },
    posterFormatError (file) {
        	this.$Notice.warning({
        title: '视频格式错误',
        desc: '文件 ' + file.name + ' 格式不正确, 请选择 mp4 视频文件'
      });
    },
    // ajax上传前
    posterBeforeUpload () {
        	this.uploadNum++;
    },
    // 文件上传成功
    posterUploadSuccess (res, file) {
        	this.uploadNum--;
        	if (this.uploadNum == 0) {
        		// 全部上传成功后，刷新一次视频列表
        		this.changePage(1);

        		this.uploadList = [];
        	}

        	if (res.code) {
        // 修改状态
	        	file.url = res.data;
	        	file.status = 'finished';
	        	// 返回的素材id
        file.id = res.imgId;
        // 备注id
        file.img_remark = '';
        file.edit = false;

        // 上传成功
	        	this.$Notice.success({
	                title: '上传成功',
	                desc: 'success'
	            });
        	} else {
        		// 上传失败
	        	this.$Notice.warning({
	                title: '上传失败',
	                desc: res.message
	            });
        	}
    },
    // 删除视频
    removeVideo (id, type, index) {
        	this.$Modal.confirm({
        title: '删除提示',
        content: '如果视频在使用中，删除视频会影响到使用中的项目，确定无使用再删除，删除吗？',
        onOk: () => {
		        	this.spinShow = true;

		            // ajax 请求获取初始化数据，然后动态更新下面数据源
		        	util.ajax.post(util.apiUrl.userImageRemove, {
		 				id: id
		        	})
		    		.then((response) => {
		    			this.spinShow = false;
		    			var res = response.data;

		    			if (res.code) {
		    				if (type == 'uploadList') {
		    					this.$delete(this.uploadList, index);
		    				} else if (type == 'list') {
		    					this.$delete(this.list, index);
		    				}
		    			} else {
		    				this.$Notice.warning({
				                title: '删除失败',
				                desc: res.message
				            });
		    			}
		    		});
		    	}
      });
    },
    // 播放视频
    playVideo (id, src) {
        	this.modalPlayShow = true;
        	this.modalPlayLoading = true;
        	this.playerOptions.sources[0].src = src;
    },
    // 显示用户分类下的素材视频
    showUserCatImg (catId) {
      this.showUserCatIndex = catId;

      // 更新列表信息
      this.changePage(1);
    },
    // 关闭添加分类气泡
    closeCatPoptip () {
      this.showAddCatPop = false;
    },
    // 弹出气泡
    onAddCat () {
      this.formItem.name = '';

      this.showAddCatPop = true;
    },
    // 移除分类
    onRemoveCat (index, id) {
      this.$Modal.confirm({
        title: '删除提示',
        content: '确定删除素材分类吗？无视频的分类才能删除成功。',
        okText: '确定删除',
        cancelText: '取消',
        onOk: () => {
          this.spinShow = true;

          // ajax 提交数据
		        	util.ajax.post(util.apiUrl.userImageRemoveCat, {
		        		id: id
		        	})
		    		.then((response) => {
		    			var res = response.data;
		    			this.spinShow = false;

		    			if (res.code) {
		    				this.$delete(this.userCats, index);

		    				// 选中新分类
		    				this.showUserCatIndex = 0;

		    				// 关闭气泡
                this.showAddCatPop = false;
                this.$emit('reload-data');
		    			} else {
		    				this.$Message.error(res.message);
		    			}
            });
        }
      });
    },
    // 保存新增的素材分类
    addCat () {
      if (!this.formItem.name) {
        this.$Message.error('请输入分类名称');
        return false;
      }
      this.addCatLoading = true;

      this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	// ajax 提交数据
		        	util.ajax.post(util.apiUrl.userImageAddCat, {
		        		name: this.formItem.name,
		        		type: 'video'
		        	})
		    		.then((response) => {
		    			var res = response.data;
		    			this.addCatLoading = false;

		    			if (res.code) {
		    				this.userCats.push(res.data);

		    				// 选中新分类
		    				this.showUserCatIndex = res.data.id;

		    				// 刷新选中的
		    				this.showUserCatImg(res.data.id);

		    				// 关闭气泡
		    				this.showAddCatPop = false;
		    			} else {
		    				this.$Message.error(res.message);
		    			}
            });
        }
      });
    },
    // 打开分类名的编辑模态框
    openCatModal (index) {
      this.formItem.name = this.userCats[index].name;
      this.formItem.id = this.userCats[index].id;
      this.formItem.index = index;
      this.modalShow = true;
    },
    // 保存编辑
    onSaveCat () {
      this.modalLoading = true;

      this.$refs.formValidate.validate((valid) => {
        if (valid) {
                	// ajax 提交数据
		        	util.ajax.post(util.apiUrl.userImageUpdateCat, {
		        		name: this.formItem.name,
		        		id: this.formItem.id,
		        		type: 'video'
		        	})
		    		.then((response) => {
		    			var res = response.data;
		    			if (res.code) {
		    				this.$set(this.userCats[this.formItem.index], 'name', res.data.name);

		    				// 关闭模态框
		    				this.modalShow = false;
		    			} else {
		    				this.modalShow = true;
                    		this.$Message.error(res.message);
                    		this.modalLoading = false;

	                        setTimeout(() => {
			                    this.modalLoading = true;
			                }, 50);
		    			}
            });
        }
      });
    },
    hideContent () {
      this.showScrollContent = false;
    }
  },
  mounted () {
    	this.init();
  }
}
</script>
