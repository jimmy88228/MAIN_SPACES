<style lang="less">
.cs-image-modal{
	.ivu-input-icon-clear{
		right:50px;
    }
	.upload-btn-box{
		width:100%;
		height: 35px;
	}
	.image-cat{
		height:380px;
		width:100%;
    	margin-top: 10px;
    	border-top:1px solid #ddd;
		padding-top:5px;
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
				width:140px;
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
				.view{
					display:none;
					position: absolute;
				    font-size: 24px;
				    right: -10px;
				    top: 20px;
				    color:#2db7f5;
				    background: #fff;
				    border-radius: 100%;
				}
				.more{
					display:none;
					position: absolute;
					font-size: 22px;
					right: -10px;
					top: 50px;
					height: 20px;
					
					.ivu-poptip-rel{
						height: 20px;
						width: 24px;
						.more-btn{
							position: absolute;
							left:0;
							top: 0px;
						}
					}
					&.show{
						display: block;
					}
					
					.more-btn{
						border-radius: 100%;
						background: #19be6b;
						color:#fff;
					}
				}
				&:hover .view, 
				&:hover .more, 
				&:hover .img-remark-box .remark, 
				&:hover .lock.not_lock {
					display:block;
				}
				
				.lock{
					position: absolute;
					font-size: 20px;
					left: -10px;
					top: -10px;
					color:#ddd;
					background: #fff;
					border-radius: 100%;
					padding:3px;
					
					&.is_lock{
						color:orangered;
					}
					&.not_lock{
						display:none;
					}
					
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
					.remark{
						display:none;
					}
				}
				
				.checked-icon{
					position: absolute;
					right: -1px;
				    bottom: 0;
				    font-size: 24px;
				    color: #dedede;
				    //display:none;
				}
			}
			.act-thumb{
				background:no-repeat center center;
				background-size: 100% auto;
				height:120px;
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
	
	.cell-box{
		padding: 0;

		&:hover{
			background: transparent;
		}
		.ivu-cell-main{
			width:100%;
		}
		.ivu-menu{
			&::after{
				width:0;
			}
		}
	}
	
	.ivu-menu-vertical{
		.ivu-menu-submenu-title,
		.ivu-menu-item{
			padding: 7px 10px;
			font-size:12px;
		}
	} 
}	
	
.image-list-view{
	.ivu-modal-mask,.ivu-modal-wrap{
		z-index:2065 !important;
	}
	.img-box{
		width:100%;
		height:600px;
		background:center center no-repeat;
		background-size:100% auto;
	}
}
</style>

<template>
	<div class="cs-image-modal">
    	<!--上传按钮-->
    	<div class="upload-btn-box">
			<Button v-if="can.canCreate" style="float:left;margin-right:10px;" @click="openSettingCat">分类管理</Button>
			
			<template v-if="can.canCreate">
				<Upload ref="upload"
				multiple
				style="float:left;"
				name="image_file"
				accept="image/gif, image/jpeg, image/png"
				:show-upload-list="false"
				:data="uploadExtData"
				:max-size="2048" 
				:format="['jpg','jpeg','png','gif']" 
				:action="posterUploadUrl" 
				:on-exceeded-size="posterMaxSize" 
				:on-format-error="posterFormatError" 
				:before-upload="posterBeforeUpload"
				:on-success="posterUploadSuccess">
					<div>
						<Button type="primary" icon="md-add">上传图片</Button>
					</div>
				</Upload>
			</template>
			
    		<Input v-model="searchq" 
			search enter-button clearable
			placeholder="搜索图片备注关键词"  
			style="width:200px;float:right;" 
			@on-search="goSearch"
			@on-clear="goSearch"
			@keydown.native.enter.prevent ="goSearch"/>
    	</div>
    	
    	<Row :gutter="8" style="display:flex;">
			<Col style="width:180px;">
				
        		<!--分类名-->
        		<CellGroup class="image-cat" :style="getContentHeight">

					<vue-scroll ref="vue-scroll" :ops="scrollOptions">
						<Cell class="cell-box">
							<Menu ref="cat-menu" active-name="all" :open-names="openNames" width="165px" accordion>
								<MenuItem name="all" @click.native="showUserCatImg(0)">全部分类</MenuItem>
								<Submenu v-for="(cat,cindex) in userCats" :key="cindex" :name="cindex"
								v-if="cat.children.length > 0 " :class="'image-cat-menu'+cindex">
									<template slot="title">
										{{cat.name}}
									</template>
									<MenuItem v-for="(cat2,cindex2) in cat.children" :key="cindex2" 
									:name="cindex+'-'+cindex2"
									@click.native="showUserCatImg(cat2.id)">{{cat2.name}}</MenuItem>
								</Submenu>
							</Menu>
							<Button size="small" type="info" icon="md-add" @click="openSettingCat" style="margin-top:10px;">添加分类</Button>
						</Cell>
        			</vue-scroll>
        		</CellGroup>
			</Col>
			
			<Col style="flex: 1 1 0%;">
	        	<!--图片列表-->
	        	<div class="scroll-content" :style="getContentHeight">

	        		<Row class="list-box">
	        			
	        			<!--上传中的图片列表（只是临时看，不能操作）-->
	        			<Col v-for="(item,index0) in uploadList" :key="('u'+index0)" :id="('uxx'+index0)" span="6">
							<div v-if="item.status === 'finished'">
							    <div class="act-thumb" :style="'background-image:url('+item.url+')'"></div>
							</div>
							<div v-else>
							    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info style="margin-top:60px;"></Progress>
							</div>
						</Col>
						
						<!--数据库中的图片列表（可以操作）-->
		        		<Col v-for="(item,index) in list" :key="('e'+index)" :id="('cs-image'+timestamp+index)" span="6" 
		        			:class="itemClass(item)" @click.native="selectedImg('cs-image'+timestamp+index, item)">
				        	<div class="act-thumb" :style="'background-image:url('+( (item.width > 400 || item.height > 400) ? item.thumb_format : item.img_src_format)+')'" 
				        		title="请点击选择图片">
				        		<Icon v-if="can.canRemove" type="md-close-circle" class="close" @click.stop="removeImage(item.id, 'list', index)" title="删除图片"></Icon>
				        		<Icon type="md-alert" class="view" title="查看图片信息" @click.stop="showImage(item)" />
								
								<Poptip v-model="item.showPop" class="more" :class="item.showPop==true ? 'show':''" placement="bottom" title="移动到分类">
									<Icon type="ios-more" class="more-btn" title="移动到分类" />
									<div class="api" slot="content">
										<Select v-model="item.cat_id" size="small">
											<OptionGroup v-for="(cat, i1) in userCats" :key="i1" :label="cat.name">
												<Option v-for="(cat2,i2) in cat.children" :value="cat2.id" :key="i2">
												{{ cat2.name }}
												</Option>
											</OptionGroup>
										</Select>	
										<div style="text-align: center;margin-top:10px;">
											<Button size="small" @click="cancelPopTip(index, item)">取消</Button> 
											<Button type="primary" size="small" @click="moveToCat(index, item)">保存</Button>
										</div>
									</div>	
								</Poptip>
								
								<Icon class="checked-icon ionmy ion-my-checked"></Icon>
				        	</div>
				        	
				        	<div class="img-remark-box" title="请点击选择图片">
				        		<Row v-show="item.edit==false">
						        	<Col class="img-remark" span="18">{{item.content}}</Col>
									<Col span="6" v-if="can.canEdit">
										<Icon class="icon remark" type="md-create" title="修改备注信息" @click.stop="editRemark(index,item.id,'list')" />
									</Col>
								</Row>
								<Row v-show="item.edit" :gutter="5">
									<Col span="15"><Input size="small" v-model="item.content" placeholder="备注"/></Col>
									<Col span="9">
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
				
				<!--加载提示-->
				<Spin size="large" fix v-if="spinShow"></Spin>
	        </Col>
	    </Row>   

    	<div v-show="pageTotal>0" style="margin: 5px 10px 0 10px;overflow: hidden">
	        <div style="float: right;">
	            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
	        </div>
	    </div>

		<Modal footer-hide
			class="image-list-view"
			v-model="modalView"
			title="">
			<div class="img-box" :style="{'background-image':'url('+imgSrc+')'}"></div>
		</Modal>
		
		<!--分类设置组件-->
		<catSetting ref="cat-setting" catType="IMAGE"></catSetting>

    </div>
</template>

<script>
/**
 * 素材管理
 */
import util from '@/libs/util.js';	
import Cookies from 'js-cookie';
import catSetting from './cat-setting';

export default {
	name:'csTextList',
	components: {
		catSetting,
    },
    props: {
    	fromMenu:{
    		type:Number,
    		default: 0,
    	},
    },
    data () {
    	return {
    		// 图片列表
			list:[],
			
			// 用户的分类
			userCats:[],
			openNames: [],
			
			spinShow:false,
			
			searchq:'',
    		pageTotal: 0,
        	pageSize: 20,
        	
        	multi:0,
        	multiSelectedImgUrlBind:[],
        	
			timestamp: 0,
			// 虚拟滚动条
			scrollOptions:{
				mode: 'native',
				bar:{
					keepShow: true,
					background: '#c8c8c8',
					size:'3px',
				},
				// 滚动轨道
				rail:{
					size:'3px',
				},
				scrollPanel:{
					scrollingX:false,
				}
			},
			
			// 权限控制
    		can:{
	    		canCreate:false,
	    		canEdit:false,
	    		canRemove:false,
    		},
    		
    		// 上传中的文件列表
    		uploadList:[],
            
            // 海报上传地址
            posterUploadUrl:'',
            
            // 选中的图片
            selectedImgUrl:'',
            
            // 上传文件数的计数器
            uploadNum:0,
            
            // 用户素材分类（选中分类ID）
            showUserCatIndex:0,
			
			modalView:false,
			imgSrc:'',
			viewItem:{},
    	}
    },
    computed: {
    	uploadExtData(){
    		return {
    			cat_id: this.showUserCatIndex,
				type: 'IMAGE',
    		};
    	},
    	// 获取内容框高度
    	getContentHeight(){
			// 在后台菜单打开的情况下才使用
    		if( this.fromMenu == 1 ){
    			return {
    				height: (document.body.clientHeight - 250) +'px',
				display: 'block',
    			};
    		}
    		else{
				// 动态计算弹出框的高度
    			return {
					height: ( document.body.clientHeight - 300) +'px',
				};
    		}
    	},
    },
    methods: {
    	init(){
			// 初始化上传地址(提供给组件使用)
    		this.posterUploadUrl = util.apiHost + util.apiUrl.csMaterialAdd + '?access-token='+Cookies.get('accessToken');
    		this.fromMenu == 1 ? this.pageSize = 40 : '';
    	},
    	// 初始化数据
    	initData(res, multi, multiSelectedImgUrlBind, selectedImgUrl){
    		this.searchq = '';
			this.multi = multi;
			this.multiSelectedImgUrlBind = multiSelectedImgUrlBind;
			this.selectedImgUrl = selectedImgUrl;
			this.showUserCatIndex = 0;
			this.timestamp = (new Date().getTime());

			if( typeof(res.data.total) != 'undefined' ){
				this.pageTotal = res.data.total;
	    		this.list = res.data.items;
				this.userCats = res.data.userCats;
				this.can = res.data.can;
				this.openNames = ['0'];
			}
			
			this.$nextTick(()=>{
				document.querySelector('.image-cat-menu0 .ivu-menu-submenu-title').click();
			});
			
			// 清理上传列表
    		if( this.can.canCreate ){
    			this.$nextTick(()=>{
					this.$refs['upload'].clearFiles();
    				this.uploadList = this.$refs['upload'].fileList;
				});
    		}
    	},
    	// 搜索按钮
        goSearch(){
        	this.spinShow = true;
        	
        	// ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post( util.apiUrl.csMaterialList, {
        		pageSize: this.pageSize,
 				searchq: this.searchq,
 				cat_id: this.showUserCatIndex,
				type: 'IMAGE',
        	})
    		.then( (response) => {
    			var res = response.data;
    			
    			if( res.code ){
    				this.list = res.data.items;

    				this.spinShow = false;
    				this.pageTotal = res.data.total;
    			}
    			else{
    				this.$Notice.warning({
		                title: '获取图片列表失败',
		                desc: res.message,
		            });
    			}
    		});
    		
        },
        // 分页
        changePage( page ){
        	this.spinShow = true;
        	
        	// ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post( util.apiUrl.csMaterialList, {
        		pageSize: this.pageSize,
 				searchq: this.searchq,
 				page: page,
 				cat_id: this.showUserCatIndex,
				type: 'IMAGE',
        	})
    		.then( (response) => {
    			var res = response.data;
    			this.spinShow = false;
    			
    			if( res.code ){
    				this.list = res.data.items;
    				
    				this.spinShow = false;
    				this.pageTotal = res.data.total;
    			}
    			else{
    				this.$Notice.warning({
		                title: '获取图片列表失败',
		                desc: res.message,
		            });
    			}
    		});
        },
        // 列表的css 类
        itemClass( item ){
        	return 'list-item '+( this.multi == 1 ? 'multi' : '' )
        			+( ( this.selectedImgUrl !='' && item.img_src_format == this.selectedImgUrl) ? ' curr' : '' )
        			+( ( this.multiSelectedImgUrlBind.length > 0 && this.multiSelectedImgUrlBind.indexOf( item.img_src_format ) !== -1 ) ?  ' disabled' : '' );
        },
        // 选中图片
        selectedImg( index, item ){
        	this.$emit('on-selected-item', index, item );
        },
        // 更新备注信息
        editRemark(index, id, type){
        	if( type == 'list' ){
        		this.$set( this.list[index], 'edit', true);
        	}
        	else if( type == 'uploadList' ){
        		this.$set( this.uploadList[index], 'edit', true);
        	}
        },
        // 取消按钮
        cancelRemark(index, id, type){
        	if( type == 'list' ){
        		this.$set( this.list[index], 'edit', false);
        	}
        	else if( type == 'uploadList' ){
        		this.$set( this.uploadList[index], 'edit', false);
        	}
        },
        // 保存备注信息
        saveRemark(index, id, type){

        	var img_remark = '';
        	var img_id = 0;
        	if( type == 'list' ){
        		img_remark = this.list[index].content;
        		img_id = this.list[index].id;
        	}
        	else if( type == 'uploadList' ){
        		img_remark = this.uploadList[index].content;
        		img_id = this.uploadList[index].id;
        	}
        	
        	util.ajax.post( util.apiUrl.csMaterialEdit, {
        		id: img_id,
 				content: img_remark,
        	})
    		.then( (response) => {
    			var res = response.data;
    			
    			if( res.code ){
    				this.$Message.success( res.message );
    				
    				if( type == 'list' ){
		        		this.$set( this.list[index], 'edit', false);
		        	}
		        	else if( type == 'uploadList' ){
		        		this.$set( this.uploadList[index], 'edit', false);
		        	}
    			}
    			else{
    				this.$Message.error( res.message );
    			}
    		});
        },
        // 图片上传处理
        posterMaxSize (file) {
            this.$Notice.warning({
                title: '超过了最大文件限制',
                desc: '文件  ' + file.name + ' 超过了 2M，请控制在2M以内.'
            });
        },
        posterFormatError(file){
        	this.$Notice.warning({
                title: '图片格式错误',
                desc: '文件 ' + file.name + ' 格式不正确, 请选择 jpg/gif/png 图片文件'
           });
        },
        // ajax上传前
        posterBeforeUpload(){
        	this.uploadNum ++;
        },
        // 文件上传成功
        posterUploadSuccess(res, file){
        	this.uploadNum --;
        	if( this.uploadNum == 0 ){
        		// 全部上传成功后，刷新一次图片列表
        		this.changePage( 1 );
        		
        		this.uploadList = [];
        	}
        	
        	if( res.code ){
				
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
        	}
        	else{
        		// 上传失败
	        	this.$Notice.warning({
	                title: '上传失败',
	                desc: res.message
	            });
        	}
        },
        // 删除图片
        removeImage ( id, type, index ) {
        	
        	this.$Modal.confirm({
                title: '删除提示',
                content: '如果图片在使用中，删除图片会影响到使用中的项目，确定无使用再删除，删除吗？',
                onOk: () => {
		        	this.spinShow = true;
		            
		            // ajax 请求获取初始化数据
		        	util.ajax.post( util.apiUrl.csMaterialRemove, {
		 				id: id,
		        	})
		    		.then( (response) => {
		    			this.spinShow = false;
		    			var res = response.data;
		    			
		    			if( res.code ){
		    				if( type == 'uploadList'){
		    					this.$delete( this.uploadList , index);
		    				}
		    				else if( type == 'list'){
		    					this.$delete( this.list , index);
		    				}
		    			}
		    			else{
		    				this.$Notice.warning({
				                title: '删除失败',
				                desc: res.message,
				            });
		    			}
		    		});
		    	}
            });    
        },
        // 显示用户分类下的素材图片
		showUserCatImg( catId ){
			if( catId != this.showUserCatIndex ){
				this.showUserCatIndex = catId;
				
				// 更新列表信息
				this.changePage( 1 );
			}
		},
		// 打开分类设置
		openSettingCat(){
			this.$refs['cat-setting'].onOpenPopTip( this.userCats );
		},
		// 取消按钮
		cancelPopTip( index, item ){
			item.showPop = false;
		},
		// 移动到分类
		moveToCat( index, item ){
			if( item.cat_id != item.old_cat_id ){
				this.spinShow = true;
				
				// ajax 请求获取初始化数据，
				util.ajax.post( util.apiUrl.csMaterialMoveCat, {
					id: item.id,
					cat_id: item.cat_id,
				})
				.then( (response) => {
					this.spinShow = false;
					var res = response.data;
					
					if( res.code ){
						// 从当前的列表中移除
						this.$delete( this.list, index );
						item.showPop = false;
						
						this.$Message.success('操作成功');
					}
					else{
						this.$Notice.warning({
							title: '操作失败',
							desc: res.message,
						});
					}
				});
			}
			else{
				item.showPop = false;
			}
		},
		// 查看大图
		showImage( item ){
			this.viewItem = item;
			
			var imgSrc = item.img_src_format ;
			if( imgSrc != '' ){
				this.modalView = true;
				this.imgSrc = imgSrc.replace('_thumb.jpg','', imgSrc);
		   	}
		}
    },
    mounted () {
    	this.init();
    },
}
</script>