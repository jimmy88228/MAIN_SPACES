<style lang="less">
.tags-list-body{
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
				width:150px;
				margin:10px;
				border-radius: 5px;
				background: #fff;
				cursor: pointer;

				.text-content{
					padding:10px;
					overflow: hidden;
					white-space: pre-wrap;
					font-size: 12px;
				}

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
				    right: 20px;
				    top: -10px;
				    color:#2db7f5;
				    background: #fff;
				    border-radius: 100%;
				}
				.more{
					display:none;
					position: absolute;
					font-size: 22px;
					right: 50px;
					top: -12px;
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

				.checked-icon{
					position: absolute;
					right: -1px;
				    bottom: 0;
				    font-size: 24px;
				    color: #dedede;
				}
			}
			.act-txt-box{
				background:no-repeat center center;
				background-size: 100% auto;
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
      background-color: #eee;

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
</style>

<template>
	<div class="tags-list-body">

    	<div class="upload-btn-box">
			<Button v-if="can.canCreate" style="float:left;margin-right:10px;" @click="openSettingCat">分类管理</Button>

			<template v-if="can.canCreate">
				<Button type="primary" icon="md-add" @click="openForm({id:0})">创建标签</Button>
			</template>

    		<Input v-model="searchq"
			search enter-button clearable
			placeholder="搜索标签"
			style="width:200px;float:right;"
			@on-search="goSearch"
			@on-clear="goSearch"
			@keydown.native.enter.prevent ="goSearch" />
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
								v-if="cat.children.length > 0 " :class="'tag-cat-menu'+cindex">
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
	        	<!--文本列表-->
	        	<div class="scroll-content" :style="getContentHeight">

	        		<Row class="list-box">

						<!--数据库中的列表（可以操作）-->
		        		<Col v-for="(item,index) in list" :key="('e'+index)" :id="('cs-text'+timestamp+index)" span="6"
		        			:class="itemClass(item)"
							@click.native="selectedItem('cs-text'+timestamp+index,item)">
				        	<div class="act-txt-box" title="请点击选择">
								<div class="text-content" v-html="item.name"></div>

				        		<Icon v-if="can.canRemove" type="md-close-circle" class="close" @click.stop="removeItem(item.id, 'list', index)" title="删除标签"></Icon>
				        		<Icon type="md-create" class="view" title="编辑信息" @click.stop="openForm(item)" />

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

		<!--分类设置组件-->
		<catSetting ref="cat-setting" :tagsType="tagsType"></catSetting>

		<!--标签编辑-->
		<tagsForm ref="tags-form" @on-success="onAddSuccess"></tagsForm>
    </div>
</template>

<script>
/**
 * 标签列表
 */
import catSetting from './cat-setting';
import tagsForm from './tags-form';

export default {
	name:'tagsList',
	components: {
		catSetting,
		tagsForm,
    },
    props: {
		tagsType:{
			type:String,
			default: '',
		},
    	fromMenu:{
    		type:Number,
    		default: 0,
    	},
      // 用户ID
      userId:{
      	type:Number,
      	default: 0,
      },
    },
    data () {
    	return {
    		// 列表
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
        	typeName: '',

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

            // 标签分类（选中分类ID）
            showUserCatIndex:0,
    	}
    },
    computed: {
    	uploadExtData(){
    		return {
    			cat_id: this.showUserCatIndex,
    		};
    	},
    	// 获取内容框高度
    	getContentHeight(){
			// 在后台菜单打开的情况下才使用
    		if( this.fromMenu == 1 ){
    			return {
    				height: (document.body.clientHeight - 250) +'px',
    			};
    		}
    		else{
				// 动态计算弹出框的高度
    			return {
					height: ( document.body.clientHeight - 300) +'px',
					display: 'block',
				};
    		}
    	},
    },
    methods: {
    	init(){
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
			this.typeName = res.data.typeName;

			if( typeof(res.data.total) != 'undefined' ){
				this.pageTotal = res.data.total;
	    		this.list = res.data.items;
				this.userCats = res.data.userCats;
				this.can = res.data.can;
				this.openNames = ['0'];
			}

			this.$nextTick(()=>{
				// this.$refs['cat-menu'].updateOpened();
				// updateOpened() 不生效，只能通过dom 来控制了
				document.querySelector('.tag-cat-menu0 .ivu-menu-submenu-title').click();
			});
    	},
		// 添加成功的回调
		onAddSuccess(){
			this.$emit('on-add-success');
		},
    	// 搜索按钮
        goSearch(){
        	this.spinShow = true;

        	// ajax 请求获取初始化数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.tagsList, {
        		pageSize: this.pageSize,
 				searchq: this.searchq,
 				cat_id: this.showUserCatIndex,
				type: this.tagsType,
        user_id: this.userId,
        	})
    		.then( (response) => {
    			var res = response.data;

    			if( res.code ){
    				this.list = res.data.items;

    				this.spinShow = false;
    				this.pageTotal = res.data.total;
    			}
    			else{
    				this.$Message.error('获取列表失败');
    			}
    		});

        },
        // 分页
        changePage( page ){
        	this.spinShow = true;

        	// ajax 请求获取初始化数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.tagsList, {
        		pageSize: this.pageSize,
 				searchq: this.searchq,
 				page: page,
 				cat_id: this.showUserCatIndex,
				type: 'TEXT',
        user_id: this.userId,
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
		                title: '获取列表失败',
		                desc: res.message,
		            });
    			}
    		});
        },
        // 列表的css 类
        itemClass( item ){
        	return 'list-item '+( this.multi == 1 ? 'multi' : '' )
        			+( ( this.selectedImgUrl !='' && item.img_src_format == this.selectedImgUrl) ? ' curr' : '' )
        			+( ( item.selected == 1 ) ?  ' disabled' : '' );
        },
        // 删除素材
        removeItem( id, type, index ) {

        	this.$Modal.confirm({
                title: '删除提示',
                content: '如果标签在使用中是不能删除的，删除吗？',
                onOk: () => {
		        	this.spinShow = true;

		            // ajax 请求获取初始化数据
		        	this.$ajax.post( this.$api.tagsRemvoe, {
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
        // 显示用户分类下的标签
		showUserCatImg( catId ){
			if( catId != this.showUserCatIndex ){
				this.showUserCatIndex = catId;

				// 更新列表信息
				this.changePage( 1 );
			}
		},
		// 打开编辑表单
		openForm(row){
			this.$refs['tags-form'].openModal(row, this.showUserCatIndex, this.tagsType, this.typeName);
		},
		// 打开分类设置
		openSettingCat(){
			this.$refs['cat-setting'].onOpenPopTip( this.userCats );
		},
		// 取消按钮
		cancelPopTip( index, item ){
			item.showPop = false;
		},
		// 选中素材
		selectedItem( index, item ){
      if( item.selected == 0 ){
        this.$emit('on-selected-item', index, item );
      }
      else{
        this.$Message.info('当前标签已经给用户打了');
      }
		},
		// 移动到分类
		moveToCat( index, item ){
			if( item.cat_id != item.old_cat_id ){
				this.spinShow = true;

				// ajax 请求获取初始化数据，
				this.$ajax.post( this.$api.tagMoveCat, {
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
    },
    mounted () {
    	this.init();
    },
}
</script>
