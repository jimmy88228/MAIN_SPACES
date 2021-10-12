<style lang="less">
.qw-worker-select{
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
    		class="qw-worker-select"
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
				        			<!-- <div><Avatar :src="( item.avatar_format != null ? item.avatar_format : '') " icon="md-person" size="large"></Avatar></div> -->
				        			<div>{{item.staff_code}}</div>
				        		</div>
				        	</Col>
				        	<div v-if="selectItems.length == 0" style="text-align: center;">暂无选中项</div>
				        </Row>

	    			</Card>
	    		</Col>
	    		<Col :span="20">

	    			<div class="table-topbar">
			        	<Form ref="formSearch" :model="formSearch" inline>
							
							<FormItem  class="store_select">
								<store-select :data="storeData" type="radio" @del-tag="handleTag">
									<Button type="dashed" @click="handleSelect" class="basic_select">选择所属店铺</Button>
								</store-select>
							</FormItem>
			
			        		<FormItem>
					            <Input v-model="formSearch.searchq" style="width:250px;" placeholder="" clearable search enter-button
					            	@on-search="searchPage"
									@on-clear="searchPage"
									@keydown.native.enter.prevent ="searchPage">
									<Select v-model="formSearch.searchqType" slot="prepend" style="width:90px">
									    <Option value="mobile">店员手机号</Option>
										<Option value="code">店员代码</Option>
										<Option value="staff_name">员工姓名</Option>
									</Select>
								</Input>
					        </FormItem>
			        	</Form>
					</div>

	    			<Table ref="select-table" :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"
	    				@on-select="onTableSelect"
	    				@on-select-cancel="onTableSelectCancel"
	    				@on-select-all="onSelectAll"
	    				@on-select-all-cancel="onSelectAllCancel">
					</Table>
					<div v-show="pageTotal>0" style="margin:10px;overflow: hidden">
				        <div style="float: right;">
				            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
				        </div>
				    </div>
					
	    		</Col>
	    	</Row>
	    	<Spin size="large" fix v-if="spinShow"></Spin>
			<div slot="footer"> <Button style="width:100px" size="default" long  @click="onCloce">取消</Button> <Button style="width:100px" type="info" size="default" long  @click="onOk">确定</Button> </div>
	    </Modal>
	</div>
</template>

<script>
import util from '@/libs/util.js';
import StoreSelect from '@/views/my-components/list-component/index-edit';

export default {
	name: 'userSelect',
    components: {
		StoreSelect,
    },
	props:{
		canSelectAll:{
			type:Boolean,
			default: false,
		}
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
    		modalTitle:'选择员工',
    		modalLoading: true,
            spinShow:false,

            // 选中的项
            selectItems:[],
            // 选择模式, radio 是单选，否则就是多选
            selectModel:'radio',

            // 列表
        	columns:[],
        	data:[],
        	tableHeight: 425,
        	tableLoading: false,
        	pageTotal: 0,
        	pageSize: 15,
          excludeOneself:0,

        	// 搜索表单
        	formSearch:{
        		searchq:'',
				searchqType:'mobile',
				store_id:0
        	},

        	// 用户状态列
        	statusList:[],

			c_type: '1',
			store_id:0,
			storeData: []
    	}
    },
    methods: {
    	init(){

    	},
    	// 父组件调用的方法
    	openModal( selectItems, type, c_type ){
    		this.showModal = true;
        // this.excludeOneself = exclude_oneself; // 是否排除自己

    		// type 是模式，radio 表示单选
			if (c_type == 1) {
				this.selectModel = 'radio';
			} else {
				this.selectModel = type;
			}
    		

			this.c_type = c_type;
		
		// 重新初始化选中项
		this.selectItems = [];

    		// 这样赋值是取消双向绑定
    		for(var i in selectItems){
    			typeof( selectItems[i].id ) != 'undefined' ? this.selectItems[i] = selectItems[i] : '';
    		}
    		// 初始化数据
    		this.initData();
    	},
    	// 初始化数据
    	initData(){
    		this.tableLoading = true;

			// ajax 请求获取初始化数据，然后动态更新下面数据源
        	util.ajax.post( util.apiUrl.qwContactStaffList, {
        		isInit: 2,
            	exclude_oneself: this.excludeOneself,
        		pageSize: this.pageSize,
				canSelectAll: ( this.canSelectAll ? 1 : 0 ),
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


        },
        // 切换分页
        changePage ( page ) {

			this.tableLoading = true;
            // ajax 请求获取数据，然后动态更新下面数据源
        	util.ajax.post( util.apiUrl.qwContactStaffList, {
        		isInit: 2,
        		page:page,
				searchq: this.formSearch.searchq,
				searchqType: this.formSearch.searchqType,
				store_id: this.formSearch.store_id,
            // excloud_oneself: this.excludeOneself,
        		pageSize: this.pageSize,
				// canSelectAll: ( this.canSelectAll ? 1 : 0),
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
        	util.ajax.post( util.apiUrl.qwContactStaffList, {
        		isInit: 2,
            exclude_oneself: this.excludeOneself,
        		searchq: this.formSearch.searchq,
				searchqType: this.formSearch.searchqType,
				store_id: this.formSearch.store_id,
        		// status: this.formSearch.status,
        		pageSize: this.pageSize,
				// canSelectAll: ( this.canSelectAll ? 1 : 0 ),
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
			var error = 0;
			if (this.c_type == '1') {
				if (this.selectItems.length > 1) {
					this.$Message.error('类型为单人时只能选1个人');	
					error=1;
				}
			} else {
				if (this.selectItems.length > 100) {
					this.$Message.error('类型为多人时最多选100人');
					error=1;
				}
			}
			if (error == 0) {
				// 给父组件传递数据
				this.$emit('on-ok', this.selectItems );

				this.showModal = false;
			}
    		
    	},
		onCloce(){
			this.showModal = false;
		},
		handleSelect() {
			this.$selectContent({
				mode: 'store',
				type: 'radio',
				data: this.storeData,
				getList: (data) => {
					this.storeData = data;
					this.formSearch.store_id = data[0].id;
				}
			})
		},
		handleTag(data) {
			this.storeData = data;
			this.formSearch.store_id = 0;
		},
    },
    mounted () {
        this.init();
    },
}
</script>
