<template>
	<div class="discount-buy-activity">
		<PageTopBase isSave @save="confirmForm">
			<template v-slot:action>
			  <div class="steps">
			    <Steps :current="tabIndex">
			        <Step title="活动设置" @click.native="showAds(0)" style="cursor: pointer;"></Step>
			        <Step title="换购商品" @click.native="showAds(1)" style="cursor: pointer;"></Step>
			    </Steps>
			  </div>
			</template>
			<Tabs v-model="tabIndex">
				<TabPane label="活动设置">
					<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="150">
						<FormItem label="活动名称" prop="name">
							<Input v-model.trim="formItem.name" class="w_300" clearable placeholder="活动名称"></Input>
						</FormItem>
						<FormItem label="活动时间" prop="end_time">
							<dateSelect defaultTime="" :customDate="[formItem.begin_time, formItem.end_time]"
								@sT="changeStartDate" @eT="changeEndDate"></dateSelect>
								<Input v-show="false" v-model="formItem.end_time"></Input>
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
								<Tree :data="catData" @on-check-change="(arr)=>changeTree(arr, 'limit_ids')"
									show-checkbox multiple empty-text="暂无标准分类"></Tree>
							</div>
						</FormItem>
						<FormItem label="使用的商品分类--自定义分类" prop="exclude_goods" v-if="formItem.limit_type == 2">
							<p class="class_name">自定义分类</p>
							<div class="class_tree">
								<Tree :data="vcatData" @on-check-change="(arr)=>changeTree(arr, 'limit_ids')"
									show-checkbox multiple empty-text="暂无自定义分类"></Tree>
							</div>
						</FormItem>
						<FormItem label="排除商品" prop="exclude_goods" v-if="formItem.limit_type < 3">
							<Input type="textarea" :cols="50" :rows="3" class="w_300"
								v-model="formItem.exclude_goods"></Input>
							<span style="color:red; margin-left:10px;">*写商品货号，多条码用英文逗号分隔</span>
						</FormItem>
						<FormItem v-if="formItem.limit_type < 3">
							<Button type="info" @click="openUpload('exclude_goods')">导入排除商品</Button>
						</FormItem>
						<FormItem label="商品绑定" prop="binding_goods" v-if="formItem.limit_type==3">
							<Input type="textarea" :cols="50" :rows="3" class="w_300"
								v-model="formItem.binding_goods"></Input>
							<span style="color:red; margin-left:10px;">*写商品货号，多条码用英文逗号分隔</span>
						</FormItem>
						<FormItem v-if="formItem.limit_type == 3">
							<Button type="info" @click="openUpload('binding_goods')">导入绑定商品</Button>
						</FormItem>

						<FormItem label="每单限制数量" prop="order_buy_limit">
							<InputNumber :min=0 v-model="formItem.order_buy_limit"></InputNumber> 件
							<span style="color:red; margin-left:10px;">*每个订单允许换购商品的数量</span>
						</FormItem>

						<FormItem label="活动展示图" prop="activity_img">
							<div class="flex">
								<div class="f-shrink0">
									<image-edit :img="formItem.activity_img"
										@selectImg="openImagesModal('goods_img', formItem.goods_img, 'image')"
										@delImg="handleDelImg" />
										<Input v-model="formItem.activity_img" v-show="false"></Input>
								</div>
								&nbsp;&nbsp;&nbsp;&nbsp;
								<ol class="inline-b p-left-15">
									<li>小于500K的图片</li>
									<li>JPG/PNG格式</li>
								</ol>
							</div>
						</FormItem>
					</Form>
				</TabPane>
				<TabPane label="换购商品">
					<activityGoods ref="ac-goods" @update-goods="activityGoodsUpdate" @show-loading="showSpin">
					</activityGoods>
				</TabPane>
			</Tabs>
		</PageTopBase>
		<!--加载提示-->
		<Spin size="large" fix v-show="spinShow"></Spin>
		<!--导入-->
		<BatchImport ref="batchImportRef" @on-success="onImportSuccess" ></BatchImport>
	</div>
</template>
<script>
	import PageTopBase from '@/views/my-components/page-top-base/index';
	import ImageEdit from '@/views/my-components/image-edit/image-edit';
	import activityGoods from './discount-buy-activity-goods.vue';
	import dateSelect from '@/views/my-components/date-select/index.vue';
	import BatchImport from '@/views/my-components/batch-import/batch-import';
	export default {
		props: {},
		components: {
			PageTopBase,
			ImageEdit,
			activityGoods,
			dateSelect,
			BatchImport
		},
		data() {
			const checkValidRange = (rule, value, callback) => {
				if (!value[0] && !value[1]) {
					callback(new Error('活动时间不能为空'));
				} else {
					callback();
				}
			}
			return {
				showSpin: false,
				tabIndex: 0,
				formItem: {
					activity_img: "",
					begin_time: "",
					binding_goods: "",
					enable: "1",
					end_time: "",
					exclude_goods: "",
					id: 0,
					limit_ids: [],
					limit_type: "0",
					name: "",
					order_buy_limit: 0
				},
				ruleValidate: {
					name: [{
						required: true,
						message: '活动名称不能为空',
						trigger: 'blur',
					}],
					end_time: [{
						required: true,
						message: '活动时间不能为空',
						trigger: 'blur',
					}],
					begin_time: [{
						required: true,
						trigger: 'change',
						message: '活动时间不能为空',
						type: 'string',
					}],
					activity_img: [{
						required: true,
						trigger: 'change',
						message: '活动图片不能为空',
						type: 'string',
					}],
				},
				catData: [],
				vcatData: [],
				imageUploadUrl: "",
				spinShow: false,
				activity_rules: [],
				uploadData: {
					type: "",
				}
			}
		},
		computed: {
			limitIdsJson: {
				get() {
					let limit_ids = this.formItem.limit_ids || [];
					let ids = {};
					for (let i = 0; i < limit_ids.length; i++) {
						ids[limit_ids[i]] = {}
					}
					return ids;
				},
				set() {}
			}
		},
		methods: {
			showAds(index) {
				if(index == 1 && !this.formItem.id){
					this.$Message.warning("请先保存活动信息");
					return;
				}
				this.tabIndex = index || 0;
				if (index == 1) this.$refs["ac-goods"].getActivityRule(this.formItem.id || 0, this.activity_rules);
			},
			initParams() {
				var query = this.$route.query || {};
				this.formItem.id = parseInt(query.id) || 0;
			},
			edit_info() {
				this.$refs['formValidate'].resetFields();
				if (!this.formItem.id) return;
				this.$store.commit("setLoading", true);
				this.$ajax.post(this.$api.BargainBuyInfo, {
						id: this.formItem.id
					})
					.then((response) => {
						let res = response.data || {};
						if (res.code == 1) {
							let data = res.data || {};
							let items = data.items || {};
							items.order_buy_limit = parseInt(items.order_buy_limit) || 0;
							items.limit_ids = items.limit_ids || [];
							this.formItem = items;
							this.activity_rules = data.activity_rules || [];
							this.installSelectTreeData(items);
						}
						console.log(this.formItem)
					}).finally(() => {
						this.$store.commit("setLoading", false);
					})
			},
			getCatTree() {
				this.$ajax.post(this.$api.catTree)
					.then((response) => {
						let res = response.data || {};
						if (res.code == 1) {
							let data = res.data || {};
							this.catData = this.installClassData(data || [], true);
						}
					})
			},
			getVCatTree() {
				this.$ajax.post(this.$api.vcatTree)
					.then((response) => {
						let res = response.data || {};
						if (res.code == 1) {
							let data = res.data || {};
							this.vcatData = this.installClassData(data || [], true);
						}
					})
			},
			changeTree(arr, name) {
				let _arr = []
				for (let i = 0; i < arr.length; i++) {
					let value = arr[i].value || 0;
					if (value) {
						_arr.push(value)
					}
				}
				this.$set(this.formItem, name, _arr);
			},
			installSelectTreeData(data) {
				if (data.limit_type == 1) {
					this.catData = this.installClassData(this.catData, true, this.limitIdsJson);
				} else if (data.limit_type == 2) {
					this.vcatData = this.installClassData(this.vcatData, true, this.limitIdsJson);
				}
			},
			installClassData(data, expand, idsJson = {}) {
				for (let i = 0; i < data.length; i++) {
					data[i].title = data[i].title || data[i].vcat_name;
					data[i].value = data[i].value || data[i].cat_id || data[i].vcat_id
					data[i].expand = expand;
					if (idsJson[data[i].value]) {
						data[i].checked = true;
					} else {
						data[i].checked = false;
					}
					let children = data[i].children || []
					if (children.length > 0) {
						this.installClassData(children, expand, idsJson);
					}
				}
				return data;
			},
			activityGoodsUpdate(data, goodsInfo) {
				this.formItem.goodsList = data;
				this.formItem.goods_num = this.formItem.goodsList.length;
			},
			
			//导入模块
			openUpload(type = 'exclude_goods') {
				this.uploadData.type = type;
				this.$refs.batchImportRef.openModal({
						upload: true,
						download: true
					}, this.$api.BargainBuyImport, this.$api.BargainBuyTpl);
			},
			onImportSuccess(res) {
				if (this.uploadData.type == 'exclude_goods') {
					this.formItem.exclude_goods = res.data_str || "";
				} else {
					this.formItem.binding_goods = res.data_str || "";
				}
				this.$Message.success(res.msg);
			},
			
			
			changeStartDate(date) {
				this.formItem.begin_time = date;
			},
			changeEndDate(date) {
				this.formItem.end_time = date;
			},
			openImagesModal(name, url, key) {
				this.$selectMaterial({
					type: 'image',
					selectedData: url,
					getList: (item) => {
						console.log("img",item)
						//this.formItem[name] = item.src;
						this.formItem.activity_img = item.src;
					}
				});
			},
			//刪除圖片
			handleDelImg(name, key) {
				this.formItem.activity_msg[key][name] = '';
			},
			confirmForm(){
				if(this.tabIndex == 0){
					this.$refs.formValidate.validate((valid)=>{
						if(valid){
							this.$store.commit("setLoading", true);
							let req = this.formItem.id ? 'BargainBuyEdit' : 'BargainBuyAdd';
							this.$ajax.post(this.$api[req], this.formItem)
							.then((response)=>{
								console.log("保存", response)
								let res = response.data || {};
								if (res.code) {
									let data = res.data || {};
									if(data.id){
										this.formItem.id = data.id;
										this.$Message.success('保存成功');
										this.$refs['ac-goods'].getActivityRule(this.formItem.id, this.activity_rules);
										this.tabIndex = 1;
									}
									// this.tabIndex = 1;
									// if (this.formItem.id>0) {
									// 	this.$set(this.data[this.editIndex],'name',response.data.data.name);
									// 	this.$set(this.data[this.editIndex],'activityDate',response.data.data.activityDate);
									// 	this.$set(this.data[this.editIndex],'activity_img',response.data.data.activity_img);
									// 	this.$set(this.data[this.editIndex],'enable',response.data.data.enable);
									// 	this.$refs['ac-goods'].getActivityRule(this.formItem.id);
									// }else{
									// 	this.formItem.id = response.data.data.id;
									// 	this.data.push(response.data.data);
									// 	let activeInfo = {id:this.formItem.id, activityDate: this.formItem.activityDate}
									// 	this.$refs['ac-goods'].getActivityRule(this.formItem.id);
									// }
								}else{
									this.$Message.error(response.data.msg);
								}
							}).finally(()=>{
								this.$store.commit("setLoading", false);
							})
						} else {
							this.$Message.warning("请完善活动信息");
						}
					})
					
				} else if(this.tabIndex == 1){
					this.$refs["ac-goods"].checkSave();
				}
			},






			// delActivity(key) {
			// 	this.formItem.activity_msg.splice(key, 1);
			// },
			// addImage(type) {
			// 	let lastId = this.formItem.activity_msg[this.formItem.activity_msg.length - 1] ? this.formItem.activity_msg
			// 		.length : 0;
			// 	if (lastId < 8) {
			// 		this.formItem.activity_msg.push({
			// 			id: 0,
			// 			msgtype: type,
			// 			title: '',
			// 			content: '',
			// 			pic_url: '',
			// 			urlpath: '',
			// 			media_id: '',
			// 			appid: ''
			// 		});
			// 	} else {
			// 		this.$Message.error('（图片/网页/小程序）最多添加8个！');
			// 	}
			// },
			// openImagesModal(name, url, key) {
			// 	this.$selectMaterial({
			// 		type: 'image',
			// 		selectedData: url,
			// 		getList: (item) => {
			// 			//this.formItem[name] = item.src;
			// 			this.formItem.activity_msg[key][name] = item.src;
			// 			if (name === 'activeImage') this.$refs.formValidate.validateField('activeImage');
			// 		}
			// 	});
			// },
			// //刪除圖片
			// handleDelImg(name, key) {
			// 	this.formItem.activity_msg[key][name] = '';
			// },

			// //日期
			// handleChange([start_time, end_time]) {
			// 	this.formItem.start_time = start_time;
			// 	this.formItem.end_time = end_time;
			// 	this.formItem.validTimeRange = [start_time, end_time];
			// },
			// loadData() {
			// 	if (this.formItem.id > 0) {
			// 		this.spinShow = true;
			// 		return this.$ajax.post(this.$api.addwxAwardInfo, {
			// 				id: this.formItem.id
			// 			})
			// 			.then(response => {
			// 				const res = response.data;
			// 				if (res.code) {
			// 					if (res.data.id != undefined) {
			// 						var tmpData = res.data;
			// 						this.formItem.id = tmpData.id;
			// 						this.formItem.name = tmpData.name;
			// 						this.formItem.start_time = tmpData.from_time;
			// 						this.formItem.end_time = tmpData.to_time;
			// 						this.formItem.validTimeRange = [tmpData.from_time, tmpData.to_time];
			// 						this.formItem.subscribe_notice = tmpData.subscribe_notice;
			// 						this.formItem.give_point = tmpData.give_point;
			// 						this.formItem.coupons = tmpData.give_coupon_ids;
			// 						this.formItem.storeSelect = res.stores;
			// 						this.formItem.is_enabled = tmpData.is_enabled == 1 ? '1' : '0';
			// 						this.formItem.force_subscribe = tmpData.force_subscribe == 1 ? '1' : '0';
			// 						this.formItem.activity_msg = res.activity_msg;
			// 						this.formItem.wechatData = tmpData.wechat_data || [];
			// 					}
			// 				} else {
			// 					this.$Message.error(res.message);
			// 				}
			// 				this.spinShow = false;
			// 			});
			// 	}
			// },
			// confirm() {
			// 	this.$refs.formValidate.validate((valid) => {
			// 		if (valid) {
			// 			this.spinShow = true;
			// 			this.$ajax.post(Number(this.formItem.id) > 0 ? this.$api.addwxAwardEdit : this.$api
			// 					.addwxAwardAdd, {
			// 						id: this.formItem.id,
			// 						name: this.formItem.name,
			// 						start_time: this.formItem.start_time,
			// 						end_time: this.formItem.end_time,
			// 						is_enabled: this.formItem.is_enabled,
			// 						force_subscribe: this.formItem.force_subscribe,
			// 						subscribe_notice: this.formItem.subscribe_notice,
			// 						give_point: this.formItem.give_point, //积分
			// 						storeSelect: this.formItem.storeSelect.map(item => item.id).join(), //选择门店数据
			// 						coupons: this.formItem.coupons.map(item => item.id).join(), //优惠券
			// 						activity_msg: this.formItem.activity_msg,
			// 						worker_ids: this.formItem.wechatData.map(item => item.id).join(","), //企微号
			// 					})
			// 				.then((response) => {
			// 					const res = response.data;
			// 					if (res.code) {
			// 						this.$Message.success(res.message);
			// 						this.spinShow = false;
			// 						this.$router.go(-1);
			// 					} else {
			// 						this.$Message.error(res.message);
			// 						this.spinShow = false;
			// 						return false;
			// 					}
			// 				});
			// 		}
			// 	})
			// }
		},
		mounted() {
			this.initParams();
			this.getCatTree();
			this.getVCatTree();
			this.edit_info();
		}
	}
</script>

<style lang="less">
	.discount-buy-activity {
		background-color: #fff;
		padding: 1rem 1rem 0.5rem;
		min-width: 1020px;
		.steps{
			position: absolute;
			width: 60%;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
		.ivu-tabs-bar{
			display: none;
		}
		.class_name {
			width: 400px;
			font-size: 16px;
			color: #65656E;
			font-weight: bold;
			background-color: #f9f9f9;
			padding-left: 10px;
		}

		.class_tree {
			width: 400px;
			height: 250px;
			overflow-y: auto;
			overflow-x: hidden;
			background-color: #efefef;
			padding-left: 10px;
		}
	}
</style>
