<style lang="less" scoped>
	.promotions{
		background-color: #fff;
		padding: 1rem;
		width: 100%;
		min-width: 1280px;
	}
</style>
<style lang="less">
	.noPadding{
		.ivu-table-cell{
			padding-left: 1px !important;
			padding-right: 1px !important;
		}
	}
</style>

<template>
	<div class="promotions">
		<div class="table-list" v-show="!infoShow">
			<div class="flex">
				<!-- <DatePicker v-model="datetime" type="datetimerange" placeholder="执行时间" style="width: 300px"></DatePicker> -->
				<dateSelect></dateSelect>&nbsp;
				<Input v-model="keyword"  placeholder="活动名称，支持模糊查询" clearable class="basic_input"></Input>&nbsp;
				<Button type="primary">搜索</Button>&nbsp;
				<Button type="primary" @click="addActivity">+新增活动</Button>
			</div>
			<Table :columns="columns" :loading="tableLoading" :height="tableHeight" :data="data"></Table>
			<div style="margin: 10px;overflow: hidden">
				<div style="float: right;">
					<Page :total="totalCount" :page-size="pageSize" :current="formSearch.page" @on-change="changePage" show-total></Page>
				</div>
				<div class="fr">每页条数&nbsp;&nbsp;<InputNumber v-model="pageSize" :step="5" :precision="0" :active-change="false" @on-change="changePage(-1)"></InputNumber></div>
			</div>
		</div>
		<!-- <div v-show="infoShow && showType=='activity'">
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
				<FormItem label="活动名称" prop="active_name">
					<Input v-model="formItem.active_name"  placeholder="活动名称" clearable style="width: 300px"></Input>
				</FormItem>
				<FormItem label="执行时间" prop="execution_date">
					<DatePicker v-model="formItem.execution_date" format="yyyy-MM-dd HH:mm" :options="dateOption" type="datetime" placeholder="执行时间" style="width: 300px"></DatePicker>
				</FormItem>
				<FormItem label="是否开启" prop="is_enabled" v-if="formItem.id>0">
					<div>
						<i-switch v-model="formItem.is_enabled" trueValue="1" falseValue="0" size="large">
							<span slot="open" >开启</span>
							<span slot="close">关闭</span>
						</i-switch>
					</div>
				</FormItem>
				<Button @click="infoShow=false">返回</Button>
				<Button type="primary" @click="saveActivity" v-if="formItem.is_finish==0">保存</Button>
            </Form>
		</div> -->
		<div v-show="infoShow && showType=='goods'">
			<Row style="text-align:right;margin-bottom:10px;">
				<Col>
					<DatePicker v-model="goods.datetime" type="datetimerange" placeholder="活动时间段" style="width: 200px"></DatePicker>
					<Input v-model="goods.keyword"  placeholder="货号/条码，支持模糊查询" clearable style="width: 200px"></Input>
					<Button type="primary" @click="changeGoodsPage(1)">搜索</Button>
					<Button type="primary" @click="exportData">导出</Button>
					<Button type="primary" @click="uploadModal=true" v-if="formItem.is_finish==0">导入</Button>
					<Button type="info" @click="modalShow=true" v-if="formItem.is_finish==0">+添加商品</Button>
				</Col>
			</Row>
			<Table ref="goodsTable" class="goods_list" :columns="goods_column" :loading="tableLoading" :height="tableHeight" :data="goods_data">
				<!-- <template slot-scope="{ row, index }" slot="stime">
					<DatePicker type="datetime" placeholder="开始时间" style="width: 150px"></DatePicker>
				</template>
				<template slot-scope="{row,index}" slot="etime">
					<DatePicker type="datetime" placeholder="结束时间" style="width: 150px"></DatePicker>
				</template> -->
			</Table>
			<div style="margin: 10px;overflow: hidden">
				<Button @click="infoShow=false">返回</Button>
				<div style="float: right;">
					<Page :total="goodsTotal" :page-size="goods.pageSize" :current="goods.page" @on-change="changeGoodsPage" show-total></Page>
				</div>
				<div class="fr">每页条数&nbsp;&nbsp;<InputNumber v-model="goods.pageSize" :step="5" :precision="0" :active-change="false" @on-change="changeGoodsPage(-1)"></InputNumber></div>
			</div>
		</div>
		<Modal title="导入商品" width="350" v-model="uploadModal" class="importModal" footer-hide>
	    	<div>
				<Upload
					ref="upload"
					:before-upload="handleUpload"
					:action="uploadServer"
					:data = "uploadData"
					:format="['xlsx']"
					:on-format-error="handleFormatError"
					:on-success="uploadResult">
					<Button icon="ios-cloud-upload-outline">选择文件</Button>
				</Upload>
				<div style="color:red;">*将会把现有的商品清除，文件格式仅支持xlsx</div>
				<div v-if="file !== ''" style="margin-bottom:0.5rem;">Upload file: {{ file.name }} </div>
				<Button type="primary" @click.native="downloadTemplate">下载模板</Button>
				<Button type="info" @click="upload" :loading="loadingStatus">{{ loadingStatus ? '上传中' : '确定上传' }}</Button>
				<div v-if="uploadError.length>0">
					<div style="font-weight:bold;margin-top:1rem;color:red;font-size:16px;">上传错误：</div>
					<div v-for="item in uploadError">{{item}}</div>
				</div>
			</div>
		</Modal>

		<Modal
			v-model="modalShow"
			title="选择商品"
			:width="700"
			@on-ok="addGoods">

			<Input v-model="goods.searchq" placeholder="请输入 商品货号 进行搜索" clearable style="width:200px"></Input>
			<Button type="info" icon="ios-search" @click="searchGoods" shape="circle">搜索</Button>	
			<div>&nbsp;</div>
			<Table 
				:loading="tableLoading2" 
				:height="tableHeight2" 
				:columns="columns2" 
				:data="data2">
			</Table>

		</Modal>
	</div>

</template>

<script type="text/javascript">
	import Cookies from 'js-cookie';	
	import util from '@/libs/util.js';
	import dateSelect from '@/views/my-components/date-select/index';
	export default{
		components:{
			dateSelect
		},
		data(){
			return { 
				dateOption:{
					disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
				},
				keyword:'',
				datetime:'',
				spinShow:false,
				infoShow:false,
				showType:'goods',
				tableLoading:false,
				tableHeight:600,
				goods_column:[],
				columns:[],
				data:[],
				goods_data:[],
				totalCount:0,
				editIndex:-1,
				formItem:{
					id:0,
					is_enabled:'0',
					active_name:'',
					execution_date:''
				},
				ruleValidate:{
					active_name: [
                        { required: true, message: '活动名称不能为空！', trigger: 'blur' }
                    ],
                },
                pageSize:15,
                goodsTotal:0,
                goods:{
                	page:1,
                	pageSize:10,
                	goods_sn:'',
                	isExport:0,
                },
                formSearch:{
                	page:1,
                },

				// 导入
				uploadModal:false,
				loadingStatus:false,
				file:'',
				uploadData:{type:'upload',id:0},
				uploadServer:util.apiHost+'/customPrice/importGoods?access-token='+Cookies('accessToken'),
				uploadError:[],

				// 搜索列表
				modalShow:false,
				columns2:[
					{title:'商品货号',key:'goods_sn',align:'center'},
					{title:'商品类型',key:'sale_type',align:'center'},
					{title:'商品条码',key:'product_sn',align:'center'},
					{title:'市场价',key:'market_price',align:'center'},
					{title:'售价',key:'sale_price',align:'center'},
					{title:'上架',key:'is_onsale_str',align:'center'},
				],
				data2:[],
				tableHeight2: 400,
				tableLoading2: false,
			}
		},
		methods:{
			changePage(page,isInit=0){
				if (isInit==1) {
					// 动态计算表高度
					this.tableHeight = document.body.clientHeight - 205;
				}
				this.tableLoading = true;
				
				util.ajax.post(util.apiHost+'/customPrice/getActivityList',{
					isInit: isInit,
					searchq:this.keyword,
					datetime:this.datetime,
				})
				.then( (response)=>{
					this.tableLoading = false;
					if (response.data.code==1) {
						if (isInit==1) {
							this.columns = response.data.data.column;
							this.goods_column = response.data.data.goods_column;
							// 状态标识
							this.columns[ (this.columns.length-3) ]['render'] = (h, params) => {
								const row = params.row;
								const color = row.is_finish == 1 ? 'success' : 'error';
								const text = row.is_finish == 1 ? '已执行' : '待执行';

								return h('Tag', {
									props: {
										type: 'dot',
										color: color
									}
								}, text);
							};
							// 状态标识
							this.columns[ (this.columns.length-2) ]['render'] = (h, params) => {
								const row = params.row;
								const color = row.is_enabled == 1 ? 'success' : (row.is_enabled==2?'warning':'error');
								const text = row.is_enabled == 1 ? '启用' : (row.is_enabled==2?'过期':'关闭');

								return h('Tag', {
									props: {
									    type: 'dot',
									    color: color
									}
								}, text);
							};
							// 操作按钮
							this.columns[ (this.columns.length-1) ]['render'] = (h, params) => {
								var buttons = [];
								// 编辑按钮
								buttons.push( h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.addActivity(params.index, params.row)
										}
									}
								}, '编辑') );
								// 编辑按钮
								buttons.push( h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.infoShow = true;
											this.showType = 'goods';
											this.formItem = JSON.parse(JSON.stringify(params.row));
											console.log(this.formItem)
											this.changeGoodsPage(1);
										}
									}
								}, '商品列表') );
								if(params.row.is_enabled==0){
									// 编辑按钮
									buttons.push( h('Button', {
										props: {
											type: 'text',
											size: 'small'
										},
										style: {
											marginRight: '5px'
										},
										on: {
											click: () => {
												this.removeActivity(params.index, params.row)
											}
										}
									}, '移除') );
								}
								if(params.row.is_finish==1 && params.row.is_return==0){
									// 编辑按钮
									buttons.push( h('Button', {
										props: {
											type: 'text',
											size: 'small'
										},
										style: {
											marginRight: '5px'
										},
										on: {
											click: () => {
												this.reBackActivity(params.index, params.row)
											}
										}
									}, '清除促销') );
								}
								if(params.row.is_return==1){ 
									buttons.push( h('Tag', {
									props: {
										type: 'text',
										size: 'small' 
									},
									style: {
										marginRight: '5px'
									}
								}, '已清除') );
								}
								return h('div',{style:{textAlign:'center'}},buttons);
							}

							this.goods_column[this.goods_column.length-1]['render'] = (h,params) => {
								var buttons = [];
								// 编辑按钮
								/*buttons.push( h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.addActivity(params.index, params.row)
										}
									}
								}, '编辑') );*/
								// 删除按钮
								buttons.push( h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.removeGoods(params.index, params.row)
										}
									}
								}, '移除') );
								if (params.row.status>0) {
									buttons = '--'
								}
								return h('div',{style:{textAlign:'center'}},buttons);
							}
							this.goods_column[2]['render'] = (h, params)=>{
								var _temp = [];
								var self = this;
								var _products = params.row.products_list;
								for(var k in _products){
									_temp.push( h('div',{
										style: {
											borderBottom:(_products.length-1==k)?'':'1px #ccc dashed',
											height:'36px',
											wordWrap: 'break-word',
											display: 'flex',
											alignItems: 'center'
										},
									}, _products[k]['sku']));
								}

								return h('div',{},_temp);
							}
							this.goods_column[3]['render'] = (h, params)=>{
								var _temp = [];
								var self = this;
								var _products = params.row.products_list;
								for(var k in _products){
									_temp.push( h('div',{
										style: {
											borderBottom:(_products.length-1==k)?'':'1px #ccc dashed',
											height:'36px',
											lineHeight:'36px'
										},
									}, _products[k]['market_price']));
								}

								return h('div',{},_temp);
							}
							/*this.goods_column[4]['render'] = (h, params)=>{
								var _temp = [];
								var self = this;
								var _products = params.row.products_list;
								for(var k in _products){
									_temp.push( h('div',{
										style: {
											borderBottom:(_products.length-1==k)?'':'1px #ccc dashed',
											height:'36px',
											lineHeight:'36px'
										},
									}, _products[k]['current_sale_price']));
								}

								return h('div',{},_temp);
							}*/
							this.goods_column[4]['render'] = (h, params)=>{
								var _temp = [];
								var self = this;
								var _products = params.row.products_list;
								for (let k in _products) {
									if (_products[k]['isEdit']==1) {
										console.log(_products[k])
										_temp.push( h('Input',{
											props: {
												type:'text',
												value: _products[k]['_sale_price'],
											},
											style:{
												height:'36px',
												lineHeight:'36px'
											},
											on: {
												'on-blur':() => {
													_products[k]['isEdit'] = 0;
													params.row['products_list'][k]['isEdit'] = 0;
													var val = event.target.value;
													self.editProduct(params.index,k,val,_products[k]);
												},
											},
										}))
									}else{
										_temp.push( h('div',{
											style: {
												color: '#29a6ff',
												borderBottom:(_products.length-1==k)?'':'1px #ccc dashed',
												height:'36px',
												lineHeight:'36px',
												cursor:(_products[k]['product_id']>0)?'pointer':''
											},
											on:{
												click:()=>{
													// this.$set(this.data[params.index]['products_list'][k],'isEdit',1);
													if (_products[k]['product_id']>0 && _products[k]['status']==0) {
														params.row.products_list[k]['isEdit'] = 1;
													}

												},
											}
										}, (_products[k]['sale_price'])? _products[k]['sale_price']: '--'));
									}
								}
									

								return h('div',{},_temp);
							}
							this.goods_column[5]['render'] = (h, params)=>{
								var _temp = [];
								var self = this;
								var _products = params.row.products_list;
								for(var k in _products){
									_temp.push( h('div',{
										style: {
											borderBottom:(_products.length-1==k)?'':'1px #ccc dashed',
											height:'36px',
											lineHeight:'36px'
										},
									}, _products[k]['rebate']));
								}

								return h('div',{},_temp);
							}
							// 状态标识
							this.goods_column[ (this.goods_column.length-3) ]['render'] = (h, params) => {
								var _temp = [];
								var self = this;
								var _products = params.row.products_list;
								for(var k in _products){
									_temp.push( h('div',{
										style: {
											borderBottom:(_products.length-1==k)?'':'1px #ccc dashed',
											height:'36px',
											lineHeight:'36px'
										},
									}, _products[k]['status_str']));
								}

								return h('div',{},_temp);
								const row = params.row;
								const color = row.status == 1 ? 'success' : 'error';
								const text = row.status == 1 ? '已执行' : '待执行';

								return h('Tag', {
									props: {
										type: 'dot',
										color: color
									}
								}, text);
							};
							this.goods_column[(this.goods_column.length-2)]['render'] = (h,params) =>{
								var self = this;
								var cp = [];
								cp.push( h('div',{
									style:{
										color: '#2d8cf0',
										cursor: 'pointer'
									},
									on:{
										'click':()=>{
											if (params.row.status==0) {
												self.goods_data[params.index]['edit_etime'] = true;
											}
											
										}
									}
								},((params.row.stime)?params.row.datetime:'--')))
								/*cp.push( h('div',{
									style:{
										color: '#2d8cf0',
										cursor: 'pointer'
									},
									on:{
										'click':()=>{
											if (params.row.status==0) {
												self.goods_data[params.index]['edit_etime'] = true;
											}
											
										}
									}
								},params.row.etime))*/
								return h('DatePicker',{
									props:{
										type: 'datetimerange',
										confirm:true,
										value:params.row.datetime,
										open:params.row.edit_etime
									},
									on:{
										'on-clear':()=>{
											self.goods_data[params.index]['edit_etime'] = false;
										},
										'on-change':(date)=>{
											// params.row._stime = date;
											params.row.datetime = date;
										},
										'on-ok':()=>{
											params.row.edit_etime = false;
											self.goods_data[params.index]['edit_etime'] = false;
											console.log(params.row.etime)
											self.editProduct(params.index,'datetime',params.row.datetime,params.row);
										}
									}
								},cp);
							}
						}
						this.data = response.data.data.items;
						this.formSearch.page = response.data.data.page;
						this.totalCount = response.data.data.total;
					}
				})
			},
			/**
			 * [editProduct 编辑条码信息]
			 * @param  {[type]} index [rowindex]
			 * @param  {[type]} type  [修改类型：数字表示条码的第几个，datetime:活动时间
			 * @param  {[type]} val   [修改的值]
			 * @param  {[type]} item  [row]
			 * @return {[type]}       [description]
			 */
			editProduct(index,type,val,item){
				var id = 0;console.log(val);
				var p_index = type;
				if (type !='datetime') {
					type = 'product';
					id = item.id;
					console.log('product')
				}
				this.tableLoading = true;
				util.ajax.post( util.apiHost + '/customPrice/updateProduct',{
					type:type,
					val:val,
					id:id,
					goods_sn:this.goods_data[index]['goods_sn'],
					active_id:item.active_id
				}).then( (response)=>{
					this.tableLoading = false;
					if (type=='datetime') {
						this.$set(this.goods_data[index], 'stime', response.data.data[0]);
						this.$set(this.goods_data[index], 'etime', response.data.data[1]);
						this.$set(this.goods_data[index],'datetime',response.data.data);
					}
					if (response.data.code==1) {
						if (type=='product') {
							var rebate = (parseFloat(response.data.data)*100/parseFloat(item.market_price))
							rebate = Math.floor(rebate * 100) / 100;console.log(rebate);

							this.$set(this.goods_data[index]['products_list'][p_index],'rebate',rebate+'%');
							this.$set(this.goods_data[index]['products_list'][p_index],'sale_price',response.data.data);
							this.$set(this.goods_data[index]['products_list'][p_index],'_sale_price',response.data.data);
						}
						this.$Message.success('修改成功');

					}else {

						this.$Message.error('修改失败！');
					}
				})
			},
			removeGoods(index,item){
				util.ajax.post( util.apiHost+'/customPrice/removeGoods',{
					goods_sn:item.goods_sn,
					active_id:item.active_id
				}).then( (response)=>{
					if (response.data.code==1) {
						this.$delete(this.goods_data,index);
						this.goodsTotal -=1;
						this.$Message.success('删除成功！')
					}else{
						this.$Message.error(response.data.msg);
					}
				})
			},
			changeGoodsPage(page){
				if (page>0) {
					this.goods.page = page;
				}
				this.goods.id = this.formItem.id;
				this.tableLoading = true;
				util.ajax.post(util.apiHost+'/customPrice/getActivityGoods',this.goods)
				.then( (response)=>{
					this.tableLoading = false;
					if (response.data.code==1) {
						if (this.goods.isExport==1) {
							this.exportData(response.data.data.items);
							this.goods.isExport = 0;
							return false;
						}
						this.goods_data = response.data.data.items;
						this.goods.page = response.data.data.page;
						this.goods.pageSize = response.data.data.pageSize;
						this.goodsTotal = response.data.data.total;
						console.log(this.goods)
					}
				})
			},
			addActivity(index,item){
				this.infoShow = true;
				this.showType='activity';
				this.formItem={
					id:0,
					is_enabled:'0',
					active_name:'',
					execution_date:'',
					finish_date:'',
					is_finish:0,
				}
				this.editIndex = index;
				if (index>=0) {
					this.formItem = JSON.parse(JSON.stringify(item));
				}
			},
			saveActivity(){
				this.spinShow = true;
				if (this.formItem.execution_date==''){
					this.$Message.error('请选择活动时间');
					return ;
				}
				this.$refs['formValidate'].validate((valid) => {
					if (valid) {
						util.ajax.post(util.apiHost+'/customPrice/postActivityInfo', this.formItem)
						.then((response)=>{
							this.spinShow = false;
							var res=response.data;
							if(res.code=='1'){
								this.infoShow = false;
								this.$Message.success('保存成功');
								if (this.editIndex>=0) {
									this.$set(this.data[this.editIndex],'active_name',res.data.active_name);
									this.$set(this.data[this.editIndex],'is_enabled',res.data.is_enabled);
									this.$set(this.data[this.editIndex],'execution_date',res.data.execution_date);
								}else{
									res.data.is_finish +='';
									res.data.is_enabled +='';
									this.data.unshift(res.data);
								}
							}else{
								this.$Message.error(res.message);
							}
						});
					}
				})
			},
			removeActivity(index,item){ 
			 if (confirm("确定要移除吗？")) 
				{   
				 this.tableLoading = true;
				util.ajax.post( util.apiHost+'/customPrice/removeActivity',{
					active_id:item.id
				}).then( (response)=>{
					this.tableLoading = false;
					if (response.data.code==1) {
						this.$delete(this.data,index);
						this.totalCount -=1;
						this.$Message.success('删除成功！')
					}else{
						this.$Message.error(response.data.msg);
					}
				})
				}
			},
			reBackActivity(index,item){ 
				//var dataCount=this.getActiveGoodsCount(item.id);
  				this.tableLoading = true;
				util.ajax.post( util.apiHost+'/customPrice/getActivityGoodsCount',{
					active_id:item.id
				}).then( (response)=>{
					this.tableLoading = false;
				if (response.data.code==1) {
					var dataCount=response.data.data;
					var tips="注意：清除促销后，该活动里的"+dataCount+"款商品将恢复为“正常商品”状态！请慎重操作，是否确认继续？"
 					if (confirm(tips)) {   
						this.tableLoading = true;
						util.ajax.post(util.apiHost+'/customPrice/returnActivity',{
					  	  active_id:item.id
						}).then( (response)=>{
							this.tableLoading = false;
							if (response.data.code==1) { 
								this.totalCount -=1;
								this.$Message.success('清除成功！')
								this.changePage(1);
							}else{
								this.$Message.error(response.data.msg);
								this.tableLoading = false;
							}
						})
					 }
				 }
				else{
						this.tableLoading = false;
					}
				})
			},
			getActiveGoodsCount(activeId){  
			    this.tableLoading = true;
				util.ajax.post( util.apiHost+'/customPrice/getActivityGoodsCount',{
					active_id:activeId
				}).then( (response)=>{
					this.tableLoading = false;
					if (response.data.code==1) {
					  	return response.data.data;
					}else{
						return -1;
					}
				})
			
			},
			/**
			 * @function 搜索商品
			 */
			searchGoods( ){
				if (this.goods.searchq=='') {
					this.$Message.error('请输入货号');
					return false;
				}
				this.tableLoading2 = true;
				// ajax 请求获取数据，然后动态更新下面数据源
				util.ajax.post( util.apiHost + '/customPrice/searchGoods', {
					searchq: this.goods.searchq,
					searchType: 'goodsSn',
					active_id:this.formItem.id
				})
				.then( (response) => {
					this.tableLoading2 = false;
					var res = response.data;

					if( res.code ){
						// 初始化表数据
						// this.columns2 = res.data.columns;
						this.data2 = res.data;
						this.goods.goods_sn = this.goods.searchq;
					}
					else{
						this.data2 = [];
						this.$Notice.error({
							title: '搜索结果提示',
							desc: res.message
						});
					}
				});
			},
			addGoods(){
				util.ajax.post( util.apiHost + '/customPrice/addGoods', {
					searchq: this.goods.goods_sn,
					active_id:this.formItem.id
				})
				.then( (response) => { 
					var res = response.data;

					if( res.code==1 ){
						this.data2 = [];
						this.modalShow = false;
						this.$Message.success('添加成功！')
						this.changeGoodsPage(1);
					}
					else{
						this.data2 = [];
						this.$Notice.error({
							title: '搜索结果提示',
							desc: res.msg
						});
					}
				});
			},
			// 上传
			handleUpload (file) {
				this.file = file;
				return false;
			},
			handleFormatError (file) {
				this.$Notice.warning({
					title: '文件格式不正式',
					desc: ' ' + file.name + '文件格式不正式， 请选择xlsx格式的文件，或重新下载模板'
				});

				setTimeout(()=>{
					this.loadingStatus = false;
				},500)
				
			},
			upload () {
				this.uploadData.id = this.formItem.id;
				this.$refs.upload.post(this.file);console.log(this.uploadData)
				this.loadingStatus = true;
			},
			uploadResult(response,file){console.log(9)
				this.loadingStatus = false;
				this.uploadError = response.data;
				this.file = '';
				if (response.code==1) {
					this.$Message.success(response.msg);
					this.changeGoodsPage(1);
				}else{
					this.$Message.error(response.msg);
				}
				
				console.log(response);
			},
			downloadTemplate(){
				window.open(window.location.origin+'/inno/file/多促销价上传模板.xlsx','_blank');
			},
			// 导入/导出
			exportData(data){
				if (this.goods.isExport==0) {
					this.goods.isExport = 1;
					this.changeGoodsPage(0);
					return true;
				}
				var columns = JSON.parse(JSON.stringify(this.goods_column));
				this.$delete(columns,columns.length-1);
				this.$refs.goodsTable.exportCsv({
					filename: '导出商品信息',
					columns:columns,
					data:data
				}); 
			},
		},
		mounted(){
			this.changePage(1,1);
		}
	}
</script>