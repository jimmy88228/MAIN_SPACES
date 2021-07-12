<style lang="less">
.store-select{
	.select-body{
    	overflow: hidden auto;
    	height: 440px;
    	padding-top:10px;
    	font-size:12px;
    	
		.select-box{
			position: relative;
			border:1px solid #eee;
			border-radius: 5px;
			padding:10px;
			background: #efefef;
			margin-bottom: 10px;
			text-align: center;
			
			.close{
				position: absolute;
				right:-10px;
				top:-10px;
				width:30px;
				height:30px;
				cursor: pointer;
				
				.close-icon{
					color:#ccc;
					font-size:22px;
					
					&:hover{
						color:orangered
					}
				}
			}
		}
	}
	
	.table-topbar{
        .ivu-form-item{
            margin-bottom: 10px;
        }
		.ivu-input-icon-clear{
			right:50px;
	    }
    }
    .selected-title{
		font-size:12px;
    }
}	
</style>

<template>
	<div>
		<Modal 
    		v-model="showModal"
    		:loading="modalLoading"
    		:title="modalTitle"
    		:width="880"
    		:styles="{top:'20px'}"
    		class="store-select"
	    	@on-ok="onOk">
	    	
	    	<Row :gutter="10">
	    		<Col :span="4">
	    			<Card>
	    				<p slot="title" class="selected-title">已选项  <span v-if="selectModel=='radio'" style="color:red;">[单选模式]</span><span v-else>[多选模式]</span></p>
				        <a slot="extra" style="cursor: pointer;display:none;" @click="cleanSelect">清空已选</a>
				        
				        <Row :gutter="10" class="select-body" :style="getContentHeight">
				        	<Col :span="22" v-for="(item,index) in selectItems" :name="index" :key="index">
				        		<div class="select-box">
				        			<div class="close" @click="onCloseSelect(index)">
				        				<Icon type="md-close-circle" class="close-icon"></Icon>
				        			</div>
									<div><Avatar icon="" class="ivu-icon ionmy ion-my-store" style="font-size:24px;" size="large"></Avatar></div>
				        			<div>{{item.name}}</div>
				        			<div>{{item.store_sn}}</div>
				        		</div>
				        	</Col>
				        	<div v-if="selectItems.length == 0" style="text-align: center;">暂无选中项</div>
				        </Row>

	    			</Card>
	    		</Col>
	    		<Col :span="20">
	    			
	    			<div class="table-topbar">
			        	<Form ref="formSearch" :model="formSearch" inline>
			        		<FormItem>
			        			<Select v-model="formSearch.status" placeholder="状态" style="width:110px" clearable>
			        				<Option value="-1">全部状态</Option>
			        				<Option v-for="(item, key) in statusList" :value="key" :key="key">{{item}}</Option>
							    </Select>
					        </FormItem>
			        		<FormItem>
					            <Input v-model="formSearch.searchq" style="width:230px;" placeholder="店铺名称/店铺编码 模糊查询" clearable search enter-button 
					            	@on-search="searchPage"
							@on-clear="searchPage"
							@keydown.native.enter.prevent ="searchPage"></Input>
					        </FormItem>
			        	</Form>
					</div>
					
	    			<Table ref="select-table" :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data" 
	    				@on-select="onTableSelect"
	    				@on-select-cancel="onTableSelectCancel"
	    				@on-select-all="onSelectAll"
	    				@on-select-all-cancel="onSelectAllCancel"></Table>
					<div v-show="pageTotal>0" class="table-pager-footer">
				        <div style="float: right;">
				            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
				        </div>
				    </div>
	    		</Col>
	    	</Row>
	    	<Spin size="large" fix v-if="spinShow"></Spin>
	    	
	    </Modal>	
	</div>
</template>	

<script>
export default {
	name: 'store-select',
    components: {
		
    },
	computed: {
		// 获取内容框高度
		getContentHeight(){
			var tHeight = this.tableHeight = document.body.clientHeight - 320;
			
			// 动态计算弹出框的高度
			return {
				height: tHeight +'px',
				display: 'block',
			};
		},
	},
    data () {
    	return {
    		// 模态框
    		showModal:false, 
    		modalTitle:'选择门店',
    		modalLoading: true,
            spinShow:false, 
            
            // 选中的项
            selectItems:[],
            // 选择模式, radio 是单选，否则就是多选
            selectModel:'radio',
            
            // 超级管理员才用到的品牌ID
            selectBrandId: 0,
            
            // 列表
        	columns:[],
        	data:[],
        	tableHeight: 425,
        	tableLoading: false,
        	pageTotal: 0,
        	pageSize: 15,
        	
        	// 搜索表单
        	formSearch:{
        		searchq:'',
        	},
        	
        	// 用户状态列
        	statusList:[],
    	}
    },
    methods: {
    	init(){
    		
    	},
    	// 父组件调用的方法
    	openModal( selectItems, type, brand_id = 0 ){
    		this.showModal = true;
    		
    		// type 是模式，radio 表示单选
    		this.selectModel = type;
    		this.selectBrandId = brand_id;
    		
		// 重新初始化选中项
		this.selectItems = [];

    		// 这样赋值是取消双向绑定
    		for(var i in selectItems){
    			this.selectItems[i] = selectItems[i];
    		}
    		// 初始化数据
    		this.initData();
    	},
    	// 初始化数据
    	initData(){
    		this.tableLoading = true;
    		
			// ajax 请求获取初始化数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.storeList, {
        		isInit: 2,
				cancel: 'N',
        		pageSize: this.pageSize,
        		selectBrandId: this.selectBrandId,
        	})
    		.then( (response) => {
    			this.tableLoading = false;
    			var res = response.data;
    			
    			if( res.code ){
    				// 初始化表
    				this.initTable( res );
					
    				// 初始化表数据
    				this.data = this.checkData( res.data.items );
    				this.pageTotal = Number( res.data.total );
    				this.pageSize = Number( res.data.pageSize );

    				this.statusList =  res.data.statusList;
    			}
    			
			});
    	},
    	// 初始化表
        initTable( res ){

			this.columns = res.data.columns;
			
			// 状态标识
			this.columns[ (this.columns.length-1) ]['render'] = (h, params) => {
                const row = params.row;
                const color = row.cancel == 'N' ? 'success' : 'error';
                const text = row.cancel == 'N' ? '营业中' :  '已关闭';

                return h('Tag', {
                    props: {
                        type: 'dot',
                        color: color
                    }
                }, text);
            };
 
        },
        // 切换分页
        changePage ( page ) {
			
			this.tableLoading = true;
            // ajax 请求获取数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.storeList, {
        		isInit: 2,
				cancel: 'N',
        		page:page,
        		pageSize: this.pageSize,
        	})
    		.then( (response) => {
    			var res = response.data;
    			if( res.code ){
    				// 初始化表数据
    				this.data = this.checkData( res.data.items );
    				this.pageTotal = Number( res.data.total );
    				this.pageSize = Number( res.data.pageSize );
    			}
    			
    			this.tableLoading = false;
			});
			
        },
        // 搜索
        searchPage(){
        	
        	this.tableLoading = true;
        	// ajax 请求获取数据，然后动态更新下面数据源
        	this.$ajax.post( this.$api.storeList, {
        		isInit: 2,
				cancel: 'N',
        		searchq: this.formSearch.searchq,
        		status: this.formSearch.status,
        		pageSize: this.pageSize,
        	})
    		.then( (response) => {
    			var res = response.data;
    			if( res.code ){
    				// 初始化表数据
    				this.data = this.checkData( res.data.items );
    				this.pageTotal = Number( res.data.total );
    				this.pageSize = Number( res.data.pageSize );
    			}
    			
    			this.tableLoading = false;
			});
        },
        // 检查数据，把已选的加入勾选
        checkData( dataList ){
        	for(var i in dataList){
				var is_checked = false;
				
				if( this.selectItems.length > 0 ){
					for(var j in this.selectItems){
						if( dataList[i].id == this.selectItems[j].id ){
							is_checked = true;
							break;
						}
					}
				}
				this.$set( dataList[i], '_checked', is_checked);
			}
        	
        	return dataList;
        },
        // 清空选择的项(清空的功能屏蔽，目前还不能做到绑定)
        cleanSelect(){
        	// 清空数组
        	this.$set(this, 'selectItems', []);
        	
        	// 更新列表的信息
        	this.data = this.checkData( this.data );
        },
        // table 选中事件
        onTableSelect(selection, row){
        	if( this.selectModel == 'radio'){
        		this.$set( this.selectItems, 0, row );
        		// 更新列表的信息
        		this.data = this.checkData( this.data );
        	}
        	else{
        		this.selectItems.push( row );
        	}
        },
        // 删除某项
        onCloseSelect(index){
        	this.$delete(this.selectItems, index);
        	
        	// 更新列表的信息
        	this.data = this.checkData( this.data );
        },
        // 取消选中
        onTableSelectCancel(selection, row){
        	for(var i in this.selectItems){
        		if( this.selectItems[i].id == row.id ){
        			this.$delete(this.selectItems, i);
        			break;
        		}
        	}
        },
        // 全选
        onSelectAll( selection ){
        	if( this.selectModel == 'radio'){
        		this.$refs['select-table'].selectAll(false);
        		this.$Message.error('单选模式下，此项无效');
        		return ;
        	}
        	
        	for(var j in selection ){
        		var inArray = false;
        		
        		if( this.selectItems.length > 0 ){
		        	for(var i in this.selectItems){
		        		if( this.selectItems[i].id == selection[j].id ){
		        			inArray = true;
		        			break;
		        		}
		        	}
	        	}
        		
	        	if( inArray == false ){
	        		this.selectItems.push( selection[j] );	
	        	}
	        	
        	}
        },
        // 全选取消
        onSelectAllCancel(){
        	if( this.selectModel == 'radio'){
        		return ;
        	}
        	
        	for(var i in this.data){
        		for( var j in this.selectItems ){
	        		if( this.selectItems[j].id == this.data[i].id ){
	        			this.$delete(this.selectItems, j);
	        			break;
	        		}
        		}
        	}
        },
        // 模态框确认按钮
    	onOk(){
    		// 给父组件传递数据
    		this.$emit('on-ok', this.selectItems );
    		
    		this.showModal = false;
    	},
    },
    mounted () {
        this.init();
    },
}
</script>