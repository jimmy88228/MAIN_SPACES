<template>
	<div class="discount_buy_activity">
		<div v-show="!infoShow && !report.show">
			<div class="table-topbar">
				<Row>
					<Col span="22">
						<Form inline>
							<FormItem>
								<Input v-model="formSearch.searchq" style="width:200px;margin-right:10px" placeholder="活动名称，支持模糊搜索" clearable></Input>
								<Button type="info" @click.native="changePage">搜索</Button>&nbsp;
							</FormItem>
						</Form>
					</Col>
					<Col span="2">
							<Button type="primary" @click="edit_info(-1)">+添加活动</Button>&nbsp;&nbsp;
					</Col>
				</Row>
			</div>
			<Table :loading="tableLoading" :columns="tableColumns" :data="data" :height="tableHeight" @on-selection-change="handleSelectAll"></Table>
			<div style="margin: 10px;overflow: hidden">
				<div style="float: right;">
					<Page :total="pageTotal" :page-size="pageSize" :current="formSearch.page" @on-change="changePage" show-total></Page>
				</div>
				<div class="fr">每页条数&nbsp;&nbsp;<InputNumber v-model="pageSize" :step="5" :precision="0" :active-change="false" @on-change="changePage(-1)"></InputNumber></div>
			</div>
		</div>
		
		<div v-show="infoShow">
			<Tabs v-model="tabIndex"  @on-click="showAds">
				<TabPane label="活动设置">
					<div>
						<Button @click.native="infoShow=false">返回</Button>
						<Button type="info" @click="saveInfo">保存</Button>
					</div>
					<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="150">
						<FormItem label="活动名称" prop="name">
							<Input v-model.trim="formItem.name" class="w_300" clearable placeholder="活动名称"></Input>
						</FormItem>
						<FormItem label="活动时间" prop="activityDate">
							<DatePicker v-model="formItem.activityDate" format="yyyy-MM-dd HH:mm" placeholder="请选择活动开始/结束时间" type="datetimerange" class="w_300"></DatePicker>
						</FormItem>
						<FormItem label="是否开启" prop="enable">
							<i-switch v-model="formItem.enable" true-value='1' false-value='0' size="large">
								<span slot="open">启用</span>
								<span slot="close">关闭</span>
							</i-switch>
						</FormItem>
						<FormItem label="商品限制" prop="limit_type">
							<RadioGroup v-model="formItem.limit_type">
								<Radio label="0">不限制</Radio>
								<Radio label="1">标准分类</Radio>
								<Radio label="2">自定义分类</Radio>
								<Radio label="3">绑定商品</Radio>
							</RadioGroup>
						</FormItem>
						<FormItem label="使用的商品分类" prop="exclude_goods" v-if="formItem.limit_type == 1">
							<p class="class_name">标准分类</p>
							<div class="class_tree">
								<Tree :data="catData" @on-check-change="(arr)=>changeTree(arr, 'limit_ids')" show-checkbox multiple empty-text="暂无标准分类"></Tree>
							</div>
						</FormItem>
						<FormItem label="使用的商品分类--自定义分类" prop="exclude_goods" v-if="formItem.limit_type == 2">
							<p class="class_name">自定义分类</p>
							<div class="class_tree">
								<Tree :data="vcatData" @on-check-change="(arr)=>changeTree(arr, 'limit_ids')" show-checkbox multiple empty-text="暂无自定义分类"></Tree>
							</div>
						</FormItem>
						<FormItem label="排除商品" prop="exclude_goods" v-if="formItem.limit_type < 3">
							<Input type="textarea" :cols="50" :rows="3" class="w_300" v-model="formItem.exclude_goods"></Input>
							<span style="color:red; margin-left:10px;">*写商品货号，多条码用英文逗号分隔</span>
						</FormItem>
						<FormItem  v-if="formItem.limit_type < 3">
							<Button  type="info" @click="openUpload('exclude_goods')">导入排除商品</Button>
						</FormItem>
						<FormItem label="商品绑定" prop="binding_goods" v-if="formItem.limit_type==3">
							<Input type="textarea" :cols="50" :rows="3" class="w_300" v-model="formItem.binding_goods"></Input>
							<span style="color:red; margin-left:10px;">*写商品货号，多条码用英文逗号分隔</span>
						</FormItem>
						<FormItem  v-if="formItem.limit_type == 3">
							<Button type="info" @click="openUpload('binding_goods')">导入绑定商品</Button>
						</FormItem>
						
						<FormItem label="每单限制数量" prop="order_buy_limit">
							<InputNumber :min=0 v-model="formItem.order_buy_limit"></InputNumber> 件
							<span style="color:red; margin-left:10px;">*每个订单允许换购商品的数量</span>
						</FormItem>
					
						<FormItem label="活动展示图" prop="activity_img">
							<div v-if="formItem.activity_img" class="image-upload-list" style="float:left; ">
								<div class="bg" :style="{backgroundImage:'url('+cdnHost+'/'+formItem.activity_img+')'}">
									<div class="image-upload-list-cover">
										<Icon type="ios-eye-outline" @click.native="handleView(cdnHost+'/'+formItem.activity_img)"></Icon>
										<Icon type="ios-trash-outline" @click.native="formItem.activity_img=''"></Icon>
									</div>
								</div>
							</div>
							<Upload 
								ref="upload"
								type="drag"
								style="width:100px;float:left;"
								v-show="!formItem.activity_img"
								:action="imageUploadUrl" 
								:data="{index:'activity_img'}"
								:show-upload-list="false"
								:max-size="500" 
								:on-exceeded-size="handleMaxSize2" 
								:format="['jpg','png']" 
								:on-format-error="handleFormatError" 
								:on-success="uploadSuccess" >
								<div style="width: 98px;height:98px;line-height:100px;">
									<Icon type="ios-cloud-upload-outline" size="35"></Icon>
								</div>
							</Upload>
							<ol>
								<li>小于500K的图片</li>
								<li>JPG/PNG格式</li>
								<!-- <li>只能上传1张</li>
								<li>建议长宽：360*360</li> -->
							</ol>
						</FormItem> 
					</Form>
				</TabPane>
				<TabPane label="换购商品" :disabled="(this.formItem.id == 0 ? true : false)">
					<activityGoods 
						ref="ac-goods" 
						@update-goods="activityGoodsUpdate"
						@show-loading="showSpin">
					</activityGoods>
				</TabPane>
			</Tabs>
		</div>
		<Spin size="large" fix v-if="spinShow"></Spin>
		<Modal title="图片预览" footer-hide v-model="imageViewShow" :width="50">
			<img :src="imageViewUrl" v-if="imageViewShow" style="width: 100%">
		</Modal>
		<!--导入组件-->
		<BatchImport ref="batchImportRef" @on-success="onImportSuccess" :upLoadPayLoad="upLoadPayLoad"></BatchImport>
	</div>

</template>

<script type="text/javascript">

	import activityGoods from './discount-buy-activity-goods.vue';
	import PageHelper from '@/libs/page-helper.js';
	import Mixin from './mixin.js';
	import BatchImport from '@/views/my-components/batch-import/batch-import';
	
	export default {
		components:{
			activityGoods,
			BatchImport
		},
		data(){
			return {
				infoShow:false,
				spinShow:false,
				editIndex:-1,
				tableLoading:false,
				tableHeight:600,
				data:[],
				column:[],
				pageSize:15,
				pageTotal:0,
				formSearch:{
					isInit:1,
					page:1,
					searchq:'',
				},
				tabIndex:0,
				formItem:{
					id:0,
					name:'',
					activityDate:[],
					enable:'0',
					activity_img:'',
					limit_type: '0',
					order_buy_limit: 0,
					exclude_goods:'',
					binding_goods:'',
					limit_ids: []
				},
				shipping:{
					shipping_amount_value:0,
					shipping_num_value:1,
					is_free_shipping:false,
				},
				ruleValidate:{},
				userRank:[],
				checkAll:false,
				indeterminate:false,
				//
				imageUploadUrl:'',
				cdnHost: util.cdnHost,
				imageViewUrl:'',
				imageViewShow:false,

				// 报表
				report:{
					show:false,
					page:1,
					pageSize:15,
					totalCount:0,
					sortField:'',
					sortBy:'',
					activityDate:[new Date(this.getDay(-6)),new Date(this.getNowFormatDate())],
					tableHeight:500,
				},
				reportDetail:{
					launchUsers:0,
					helpUsers:0,
					succUsers:0,
					pageVisits:0,
					userVisits:0,
					newUsers:0,
					orderUsers:0,
					orderCount:0,
					goodsCount:0,
					orderAmount:0
				},
				goodsList:[],
				goods_column:[],
				adData:{},
				lotteryList:[],
				goodsBrand:[],
				collageGroup:[],
				presellList:[],
				// 已选优惠券信息
				bonusStr:'',
				selectedBonus:{},
				bonusList:{},
				bonusPageTotal: 0,
				bonusPageSize: 15,
				spinBonusShow:false,
                activityIds: [], //选中活动ids
				// 导入
				uploadModal: false,
				loadingStatus: false,
				file: '',
				uploadServer: util.apiHost + '/discountBuyActivity/importGoodsReturnStr?access-token=' + Cookies('accessToken'),
				uploadError: [],
				uploadData: {type: ''},
				catData: [],
				vcatData: []
			}
		},
		computed:{
			limitIdsJson:{
				get(){
					let limit_ids = this.formItem.limit_ids || [];
					let ids = {};
					for(let i = 0; i < limit_ids.length; i++){
						ids[limit_ids[i]] = {}
					}
					return ids;
				},
				set(){}
			}
		},
		methods:{
			handleSelectAll (obj) {
					this.activityIds = obj.map(item => item.id);
			},
			changePage(page){
				if (this.formSearch.isInit==1) {
					// 动态计算表高度
					this.tableHeight = document.body.clientHeight - 210;
				}
				this.tableLoading = true;
				this.formSearch.page = (page>0)? page: this.formSearch.page;
				this.formSearch.pageSize = this.pageSize;
				util.ajax.post(util.apiUrl.getDiscountBuyActivity,this.formSearch)
				.then( (response)=>{
					let res = response.data || {};
					let data = res.data || {};
					this.tableLoading = false;
					if (this.formSearch.isInit==1) {
						this.formSearch.isInit = 0;
						this.adData = data.ads_Data;
						this.column = data.column;
						this.goods_column = data.report_column;
						this.imageUploadUrl = data.imgUploadServer;

						// 图片
    					this.column[ 0 ]['render']= (h, params) => {
							return h('div', [
								h('Avatar', {
									props: {
										icon:(params.row.activity_img !='' ? '' : 'images'),
										shape:'square',
										size:'large',
									},
									style:{
										margin:'5px 0',
										width:'80px',
										height:'80px',
										border:'1px solid #eee',
										background: (params.row.picture !='' ? 'url('+util.cdnHost+'/'+params.row.activity_img+') center center/100% no-repeat' : '') ,backgroundSize: '100% auto',
									},
								})
							]);
						};
						// 操作按钮
						this.column[ (this.column.length-1) ]['render'] = (h, params) => {
							var buttons = [];
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
										this.edit_info(params.index, params.row, 0)
									}
								}
							}, '编辑') );
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
										this.delActive(params.index, params.row)
									}
								}
							}, '删除') );
							return h('div',{style:{textAlign:'center'}},buttons);
						}
						// 状态标识
						this.column[ (this.column.length-2) ]['render'] = (h, params) => {
							const row = params.row;
							const color = row.enable == 1 ? 'success' : 'error';
							const text = row.enable == 1 ? '开启' : '关闭';

							return h('Tag', {
								props: {
									type: 'dot',
									color: color
								}
							}, text);
						};
						this.goods_column[ 0 ]['render']= (h, params) => {
							return h('div', [
								h('Avatar', {
									props: {
										icon:(params.row.picture !='' ? '' : 'images'),
										shape:'square',
										size:'large',
									},
									style:{
										margin:'5px 0',
										width:'80px',
										height:'80px',
										border:'1px solid #eee',
										background: (params.row.picture !='' ? 'url('+params.row.picture+') center center/100% no-repeat' : '') ,backgroundSize: '100% auto',
									},
								})
							]);
						};
					}
					
					if (res.code==1) {
						data.order_buy_limit = parseInt(data.order_buy_limit) || 0
						this.data = data.items;
						this.pageTotal = data.totalCount;
						this.formSearch.page = data.page;
						this.pageSize = data.pageSize;
						this.catData = this.installClassData(data.cat || [], true);
						this.vcatData = this.installClassData(data.vcat || [], true);
					}
				})
			},
			getNowFormatDate() {
					var date = new Date();
					var seperator1 = "-";
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					var strDate = date.getDate();
					if (month >= 1 && month <= 9) {
							month = "0" + month;
					}
					if (strDate >= 0 && strDate <= 9) {
							strDate = "0" + strDate;
					}
					var currentdate = year + seperator1 + month + seperator1 + strDate + ' 23:59:59';
					return currentdate;
			},
			doHandleMonth(month){
					var m = month;
					if(month.toString().length == 1){
							m = "0" + month;
					}
					return m;
			},
			changeTree(arr, name){
				let _arr = []
				for(let i = 0; i < arr.length; i++){
					let value = arr[i].value || 0;
					if(value){
						_arr.push(value)
					}
				}
				this.$set(this.formItem, name, _arr);
			},
			installSelectTreeData(data){
				if(data.limit_type == 1){
					this.catData = this.installClassData(this.catData, true, this.limitIdsJson);
				}else if(data.limit_type == 2){
					this.vcatData = this.installClassData(this.vcatData, true, this.limitIdsJson);
				}
			},
			getDay(day){
					var today = new Date();
					var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
					today.setTime(targetday_milliseconds); //注意，这行是关键代码
					var tYear = today.getFullYear();
					var tMonth = today.getMonth();
					var tDate = today.getDate();
					tMonth = this.doHandleMonth(tMonth + 1);
					tDate = this.doHandleMonth(tDate);
					console.log('时间：', tYear+"-"+tMonth+"-"+tDate);
					return tYear+"-"+tMonth+"-"+tDate+' 00:00:00';
			},
			edit_info(index,items, is_copy){
				this.editIndex = index;
				this.infoShow = true;
				this.$refs['formValidate'].resetFields();
				this.formItem.id = 0;
				this.tabIndex = 0;
				this.indeterminate = false;
				this.checkAll = false;
				this.formItem.name = '';
				this.formItem.activityDate = [];
				this.formItem.enable = '0';
				this.formItem.activity_img = '';
				this.formItem.limit_type = '0';
				this.formItem.order_buy_limit = 0;
				this.formItem.exclude_goods = '';
				this.formItem.binding_goods = '';
				this.formItem.limit_ids = [];
				if (index >= 0) {
					this.spinShow = true;
					util.ajax.post( util.apiUrl.getDiscountBuyActivityInfo,{id:items.id})
					.then( (response)=>{
						this.spinShow = false;
						let res = response.data || {};
						if (res.code==1) {
							let data = res.data || {};
							data.order_buy_limit = parseInt(data.order_buy_limit) || 0;
							data.limit_ids = data.limit_ids || [];
							this.formItem = data;
							this.installSelectTreeData(data);
							let activeInfo = {id:this.formItem.id, activityDate: this.formItem.activityDate};
						}else{
							this.changePage();
							this.infoShow = false;
						}
						console.log(this.formItem)
					})
				}else{
					// this.searchBonus();
				}
			},
			saveInfo(){
				this.spinShow = true;
				util.ajax.post(util.apiUrl.saveDiscountBuyActivity,this.formItem)
				.then( (response)=>{
					this.spinShow = false;
					if (response.data.code==1) {
						this.tabIndex = 1;
						if (this.formItem.id>0) {
							this.$set(this.data[this.editIndex],'name',response.data.data.name);
							this.$set(this.data[this.editIndex],'activityDate',response.data.data.activityDate);
							this.$set(this.data[this.editIndex],'activity_img',response.data.data.activity_img);
							this.$set(this.data[this.editIndex],'enable',response.data.data.enable);
							this.$refs['ac-goods'].getActivityRule(this.formItem.id);
						}else{
							this.formItem.id = response.data.data.id;
							this.data.push(response.data.data);
							let activeInfo = {id:this.formItem.id, activityDate: this.formItem.activityDate}
							this.$refs['ac-goods'].getActivityRule(this.formItem.id);
						}
						this.$Message.success('保存成功')
					}else{
						this.$Message.error(response.data.msg);
					}
				})
			},
			delActive(index,row){
				this.$Modal.confirm({
							title: '超值购活动',
							content: '确定要删除该活动吗，<span style="color:red;">数据将不可恢复，请谨慎操作！</span>点确定继续删除',
							okText: '确定',
							onOk: () => {
								util.ajax.post(util.apiUrl.deleteDiscountBuyActivity,{id:row.id})
								.then( (response)=>{
									if (response.data.code==1) {
										this.$Message.success('删除成功!');
										this.$delete(this.data,index);
									}else{
										this.$Message.error(response.data.msg);
									}
							})
							}
				});
							
			},
			activityGoodsUpdate(data,goodsInfo){
				this.formItem.goodsList = data;
				this.formItem.goods_num = this.formItem.goodsList.length;
			},
			showSpin(val){
				this.spinShow = val;
			},
			// 上传图片
			uploadSuccess(res,file){
				let data = res.data || {};
				if(data.imageUrl){
					console.log(data)
					let index = data.params.index;
					this.formItem[index] = data.imageUrl;
				}
			},
			handleMaxSize (file) {
				this.$Notice.warning({
					title: '超过了最大文件限制',
					desc: '文件  ' + file.name + ' 超过了 1M，请控制在1M以内.'
				});
			},
			handleMaxSize2 (file) {
				this.$Notice.warning({
					title: '超过了最大文件限制',
					desc: '文件  ' + file.name + ' 超过了 200K，请控制在200K以内.'
				});
			},
			handleFormatError(file){
				this.$Notice.warning({
					title: '上传文件格式错误',
					desc: '文件 ' + file.name + ' 格式不正确, 请选择 jpg/png 图片文件'
				});
			},

			handleView(imgurl){
				this.imageViewShow = true;
				this.imageViewUrl = imgurl;
				console.log(imgurl);
			},

			showAds(index){
				if(index == 1){ //活动规则
					
					this.$refs["ac-goods"].getActivityRule(this.formItem.id || 0);
				}
			},
				
			//导入模块
			openUpload (type = 'exclude_goods') {
				this.uploadData.type = type;
							this.$refs.batchImportRef.openModal({
								upload: true,
								download: true
							}, util.apiHost + '/discountBuyActivity/importGoodsReturnStr', util.apiHost + '/discountBuyActivity/downloadGoodsTemplate');
				this.uploadModal = true;
				this.uploadError = [];
			},

			onImportSuccess(res){
				if (this.uploadData.type == 'exclude_goods') {
					this.formItem.exclude_goods = res.data_str || "";
				} else {
					this.formItem.binding_goods = res.data_str || "";
				}
				this.$Message.success(res.msg);
			},
			
			installClassData(data, expand, idsJson = {}){
				for(let i = 0; i < data.length; i++){
					data[i].expand = expand;
					if(idsJson[data[i].value]){
						data[i].checked = true;
					} else {
						data[i].checked = false;
					}
					let children = data[i].children || []
					if(children.length > 0){
						this.installClassData(children, expand, idsJson);
					}
				}
				return data;
			}
		},
		mounted(){
			this.changePage(1);
		},
		watch: {
		    'formItem.limit_new_user' (nV) {
			}
		}
	}

</script>

<style lang="less" scoped>
	.discount_buy_activity{
		background-color: #fff;
		padding: 1rem 1rem 0.5rem;
		min-width: 1020px;
		.class_name{
			width: 400px;
			font-size:16px;
			color:#65656E;
			font-weight:bold;
			background-color:#f9f9f9;
			padding-left:10px;
		}
		.class_tree{
			width: 400px;
			height: 250px;
			overflow-y: auto;
			overflow-x: hidden;
			background-color:#efefef;
			padding-left:10px;
		}
	}
	.w_300{
		width: 300px;
	}
</style>

