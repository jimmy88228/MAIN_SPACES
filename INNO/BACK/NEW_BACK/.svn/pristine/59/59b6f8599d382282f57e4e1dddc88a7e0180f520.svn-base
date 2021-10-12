<style lang="less">
.weixin-member-card{
	.table-bg-image{
		background-size:100% auto !important;
	}
	.table-topbar{
		margin-bottom: 10px;
	}
}	
</style>

<template>
	<div class="weixin-member-card">
		<div v-show="showList">
			<!--列表搜索框-->
			<div class="table-topbar">
				<Row type="flex">
					<Col style="flex:1 1 0%;">
						微信会员卡
						<helpTips tipsContent="1.要开通微信会员卡，需要在微信公众号后台开通“卡券功能”；" placement="right-start">
							<div><a @click="showTipsModal">点击站内查看详情</a></div>
							<div>2.当公众号端点击领卡按钮，会自动引导去领取状态是“已开启”的会员卡</div>
						</helpTips>
					</Col>
					<Col style="width:170px;text-align: right;">
						<Button type="info" icon="md-add" @click="editCard(0)">创建会员卡</Button>
            <Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
					</Col>
				</Row>	
			</div>
			
			<!--列表-->
			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
			
		</div>
		
		<!--编辑器-->
		<weixinMemberCardEditor ref="weixin-member-card-editor" @on-success="editorCallback" @on-close="onEditorClose"></weixinMemberCardEditor>
		
		<!--领券二维码-->
		<weixinMemberCardQrcode ref="weixin-member-card-qrcode"></weixinMemberCardQrcode>
	</div>
</template>	

<script>
import helpTips from '@/views/my-components/help-tips/help-tips';
import weixinMemberCardEditor from './weixin-member-card-editor';
import weixinMemberCardQrcode from './weixin-member-card-qrcode';

export default {
	name: 'weixinMemberCard',
    components: {
		helpTips,
		weixinMemberCardEditor,
		weixinMemberCardQrcode,
    },
    data() {
    	return {
			showList: true,
			
			columns:[],
			data:[],
			tableHeight: 500,
			tableLoading: false,
		}
	},
	methods: {
		// 提供给父组件进行初始化
		init(){
			// 动态计算表高度
			this.tableHeight = document.body.clientHeight - 230;
			
			this.initData( true );
		},
		// 初始化列表数据
		initData( isInit = false ){
			this.tableLoading = true;
			// ajax 请求获取初始化数据，然后动态更新下面数据源
			this.$ajax.post( this.$api.weixinMemberCardList, {
				isInit: isInit,
			})
			.then( (response) => {
				this.tableLoading = false;
				var res = response.data;
				
				if( res.code ){
					// 初始化表
					if( isInit ){
						this.initTable( res );
					}
					
					// 初始化表数据
					this.data = res.data.items;
				}
				
			});
		},
		// 表头初始化
		initTable( res ){
		
			this.columns = res.data.columns;
			const _this = this;
      
			// 图文
			this.columns[ 0 ]['render']= (h, params) => {
				return h('Row', {
			    		props: {
			    			type:"flex", 
			    			justify:"start",
			    		}
			    	},[
			    	h('Col', {
			    		style:{
			    		}},
			    		[h('Avatar', {
							props: {
								src: params.row.background_pic_url_format,
								icon: 'md-image',
								size: 'large',
								shape: 'square',
							},
							style:{
								marginRight:'5px',
								marginTop: '10px',
								marginBottom: '10px',
								cursor: 'pointer',
							},
							class:'table-bg-image',
						}),
			        ] ),
			        h('Col', {
			        	style:{
			        		padding:'8px 5px 5px 5px',
			        		width: '65%',
			        	}},
			        	[h('div', {
			            	style:{
			            		fontWeight: 'blod',
			            		overflow: 'hidden',
								display: '-webkit-box',
								'-webkit-line-clamp': 2,
								'-webkit-box-orient': 'vertical',
								wordBreak: 'break-all',
								'line-height': 4,
			            	}
			            }, params.row.title ),
			        ]),
			    ]);
			
			};
			
		    // 状态标识
		    this.columns[ (this.columns.length-2) ]['render'] = (h, params) => {
		        const row = params.row;
		        
            return h('i-switch',{
            					props: {
            					    size: 'large',
            						value: Number( row.status ),
            						'true-value': 1,
            						'false-value': 2,
            						'before-change'() {
            							return new Promise((resolve) => {
            								_this.updateStatus(params.index, row);
            							});
            						},
            					},
            				},[
            					h('span', {
            						slot: 'open'
            					}, '启用'),
            					h('span', {
            						slot: 'close'
            					}, '关闭')
            				]);
		    };
			
		   	// 操作按钮
			this.columns[ (this.columns.length-1) ]['render'] = (h, params) => {
		        var buttons = [];

				// 编辑按钮
				buttons.push( 
					h('span', {	
							attrs:{
								title:'编辑'
							}
						},
						[ h('span', {
							class:'table-handle-button',
							on: {
								click: () => {
									this.editCard( params.row.id )
								}
							}
						},'编辑') ]
					) 
				);
				
				// 二维码
				buttons.push( 
					h('span',
						{	
							attrs:{
								title:'领卡二维码'
							}
						},
						[ h('span', {
							props: {
								custom: 'ionmy ion-my-qrcode',
								size: '22'
							},
							class:'table-handle-button',
							on: {
								click: () => {
									this.viewQrcode( params.row )
								}
							}
						},'领卡二维码') ]
					) 
				);
				
				
				// 删除
				buttons.push( 
					h('span',{	
							attrs:{
								title:'删除'
							}
						},
						[ h('span', {
							class:'table-handle-button',
							on: {
								click: () => {
									this.removeCard(params.index, params.row )
								}
							}
						},'删除') ]
					) 
				);
		        return h('div',buttons);
		   };
		   
		},
		// 编辑卡券
		editCard( id ){
			this.showList = false;
			this.$refs['weixin-member-card-editor'].openModal( id );
		},
		// 编辑器的回调
		editorCallback(){
			this.showList = true;
			
			// 刷新列表信息
			this.initData();
		},
		onEditorClose(){
			this.showList = true;
		},
		// 更新会员卡状态
		updateStatus( index, row ){
			this.tableLoading = true;
			// ajax 请求获取数据
			this.$ajax.post( this.$api.weixinMemberCardStatus, {
				id: row.id,
			})
			.then( (response) => {
				this.tableLoading = false;
				var res = response.data;
				if( res.code ){
					// 保存成功
					this.$Message.success( res.message );
					
					// 更新列表的值
					this.$set( this.data[ index ], 'status', res.data );
				}
			});
		},
		// 删除会员卡
		removeCard(index, row ){
			
			this.$Modal.confirm({
		        title: '操作提示',
		        content: '确定删除微信会员卡吗？',
		        okText: '确定',
		        cancelText: '取消',
		        onOk: () => {
		        	
		        	this.tableLoading = true;
		        	// ajax 请求获取数据
		        	this.$ajax.post( this.$api.weixinMemberCardRemove, {
		        		id: row.id,
		        	})
		    		.then( (response) => {
					this.tableLoading = false;
		    			var res = response.data;
		    			if( res.code ){
		    				// 删除后
		    				this.$delete( this.data, index);
		    				this.$Message.success( res.message );
		    			}
		    			
					});
					
		        }
		    });    
		},
		// 显示帮助提示的图片
		showTipsModal(){
			var imgSrc = this.$util.apiHost + '/../assets/images/weixin-card.jpg';
			this.$Modal.info({
				title: '',
				width: '950',
				content: '<div style="width:100%;height:350px;background:url('+imgSrc+') center center no-repeat;background-size:100% auto;"></div>',
				closable: true,
				'footer-hide': true,
				'mask-closable': true,
			});
			
			this.$nextTick(()=>{
				document.querySelector('.ivu-modal-confirm-body').style.paddingLeft = '0';
			});
		},
		// 查看领券二维码
		viewQrcode( row ){
			this.$refs['weixin-member-card-qrcode'].openModal( row );
		}
	},
}
</script>		