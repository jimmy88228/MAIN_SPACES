<template>
	<div class="add-comment">
		<Form :label-width="80" ref="selfCommentForm" :model="formData" :rules="validateRules">
			<FormItem label="头像" prop="user_image">
				<image-edit :img="formData.user_image" @selectImg="chooseUserImg('user_image', formData.user_image)" @delImg="delImg('user_image')"></image-edit>
			</FormItem>
			<FormItem label="名称" prop="real_name">
				<Input v-model="formData.real_name" style="width:200px;"/>
			</FormItem>
			<FormItem label="商品信息" prop="product_id">
				<div><span class="goods_row_t">订单号：</span>{{formData.order_sn}}</div>
				<div>
					<span class="goods_row_t">款号： </span>
					<Select style="width:200px;" transfer filterable v-model="formData.goods_id" @on-change="changeGoods">
						<Option v-for="(item, index) in goodsList" :key="index" :value="item.goods_id">{{item.goods_sn}}</Option>
					</Select>
				</div>
				<div>
					<span class="goods_row_t">颜色 / 尺码： </span>
					<Select style="width:200px;" transfer v-model="formData.product_id">
						<Option v-for="(item, index) in sizeColor" :key="index" :value="item.product_id">{{item.name}}</Option>
					</Select>
				</div>
				<div v-if="typeIndex == 2">
					<span class="goods_row_t">店铺名： </span>
					<Select style="width:200px;" transfer v-model="formData.store_id">
						<Option v-for="(item, index) in storeList" :key="index" :value="item.id">{{item.name}}</Option>
					</Select>
				</div>
			</FormItem>
			<FormItem label="评分" prop="comment_level">
				<div style="margin:0 15px;margin-bottom:20px;" class="flex">
					<div class="f-shrink0" style="width:300px;">
						<Slider v-model="formData.comment_level" :step="1" :min="1" :max="5" :marks="marks"></Slider>
					</div>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<span>{{formData.comment_level}}分</span>
				</div>
			</FormItem>
			<FormItem label="评分内容" prop="comment_content">
				<div>
					<Input type="textarea" v-model="formData.comment_content" placeholder="请输入需要评论的内容" class="m-bottom-10" style="width:300px;"/>
					<div>
						<div class="pre-view">
							<div v-for="(item, index) in imageArr" class="pre-view-item">
								<div class="img-view">
									<img :src="item.src" />
								</div>
								<Icon type="ios-close-circle-outline" size="20" class="del-pre" @click="delImg('imageArr', index)"/>
							</div>
						</div>
						<div class="">
							<p class="add-point" @click="chooseUserImg('imageArr', imageArr)">
								<Icon type="md-add" class="add-point-icon" size="40"/>
							</p>
						</div>
					</div>
				</div>
			</FormItem>
			<FormItem label="操作">
				<i-switch value="1" true-value="1" false-value="0" :disabled="true" class="comment_switch">
					<span slot="open">正面评论&nbsp;<Icon type="md-repeat" size="15"/></span>
					<span slot="close"><Icon type="md-repeat" size="15"/>&nbsp;负面评论</span>
				</i-switch>
			</FormItem>
		</Form>
	</div>
</template>
<script>
	import ImageEdit from '@/views/my-components/image-edit/image-edit';
	export default {
		inject: ['searchPage'],
		props: [ "type" ],//   wapTab,  storeTab 类型(1微商城 2店铺)
		components: {
			ImageEdit
		},
		data(){
			return {
				marks: {
					1: "1",
					2: "2",
					3: "3",
					4: "4",
					5: "5"
				},
				formData:{
					order_sn: "",
					goods_id: 0,
					product_id: 0,
					real_name: "",
					user_image: "",
					comment_level: 5,
					comment_content: "",
					image_arr: [],
					store_id: 0,
					// store_user_image: "",
					// store_real_name: "",
					// store_goods_id: 0,
					// store_product_id: "",
					// store_comment_level: "",
					// store_comment_content: "",
					// store_image_arr: []
				},
				imageArr: [],
				validateRules: {
					user_image: { required: true, message: '请选择头像', trigger: 'blur' },
					real_name: { required: true, message: '请输入名称', trigger: 'blur' },
					goods_id: { required: true, message: '请选择款号', trigger: 'change' },
					product_id: { required: true, message: '请选择颜色/尺码', trigger: 'change' },
					comment_content: { required: true, message: '请填写评分内容', trigger: 'blur' }
				},
				goodsList: [],
				storeList: [],
				sizeColor: [],
			}
		},
		computed:{
			typeIndex(){
				let type = this.type || "";
				return type == "storeTab" ? 2 : 1;
			}
		},
		watch:{
			imageArr(nV){
				let arr = [];
				for(let i = 0; i < nV.length; i++){
					arr.push(nV[i].src);
				}
				this.formData["image_arr"] = arr || [];
			}
		},
		methods:{
			chooseUserImg(type, data){
				if(!(data instanceof Array) && !data){ data = "" };
				this.$selectMaterial({
				  type: 'image',
					multi: data instanceof Array ? 1 : 0,
				  selectedData: data,
				  getList: (item) => {
						console.log("item", item)
						if(type == "imageArr"){
							this.imageArr = item || [];
						} else {
							this.formData[type] = item && item.src;
						}
				  }
				});
			},
			delImg(type, index){
				console.log("type", type);
				if(type == "imageArr"){
					this.imageArr.splice(index, 1);
				} else {
					this.formData[type] = "";
				}
				
			},
			changeGoods(data){
				this.loadData(data);
			},
			loadData(goodsId){
				return this.$ajax.post(this.$api.goodsNewComment,{
					type: this.typeIndex,
					goods_id: goodsId || this.formData.goods_id,
				}).then((response) => {
						var res = response.data;
						if (res.code) {
							let data = res.data || {};
							this.goodsList = data.goods_list || [];
							this.storeList = data.store_list || [];
							this.sizeColor = data.size_color || [];
							this.formData.order_sn = data.order_sn || ""
						}
				}).finally(()=>{
					this.isExportTime = false;
				})
			},
			checkForm(){
				return new Promise((rs, rj)=>{
					this.$refs["selfCommentForm"].validate((valid)=>{
						if(valid){
							this.submitForm().then(rs()).catch(rj());
						}
						rj();
					})
				})
				
			},
			submitForm(){
				let typeIndex = this.typeIndex;
				let formData = this.formData || {};
				let reqData = {};
				if(typeIndex == 2){
					reqData = {
						"order_sn": formData.order_sn,
						"store_id": formData.store_id,
						"store_user_image": formData.user_image,
						"store_real_name": formData.real_name,
						"store_goods_id": formData.goods_id,
						"store_product_id": formData.product_id,
						"store_comment_level": formData.comment_level,
						"store_comment_content": formData.comment_content,
						"store_image_arr": formData.image_arr
					}
				} else {
					reqData = formData || {};
				}
				return new Promise((rs, rj)=>{
					if(this.isSubmiting) return rj();
					this.isSubmiting = true
					this.$ajax.post(this.$api.goodsAddSelfComment,{
						type: this.typeIndex,
						...reqData
					}).then((response) => {
							var res = response.data;
							this.isSubmiting = false;
							if (res.code) {
								this.searchPage();
								this.$Message.error(res.message);
								return rs();
							} else {
								this.$Message.error(res.message);
							}
							return rj();
					}).catch(()=>{
						this.isSubmiting = false;
						return rj();
					})
				})
			}
		}
		
	}
</script>
<style lang="less">
	.add-comment{
		width: 100%;
		height: 400px;
		padding:0px 10px;
		overflow-y: auto;
		.goods_row_t{
			width: 100px;
			display:inline-block;
			text-align:right;
			padding-right:10px;
		}
		.comment_switch{
			width:100px;
			background: none;
			.ivu-switch-inner{
				color:#FE8337;
				left: 19px;
			}
		}
		.comment_switch:after{
			background-color:#FE8337;
			opacity: 0.5;
			display: none;
		}
		.comment_switch.ivu-switch-checked{
			.ivu-switch-inner{
				color:#28A5FF;
				left: 19px;
			}
		}
		.comment_switch.ivu-switch-checked:after{
			left: 78px;
			background:#28A5FF;
		}
		.pre-view{
			
			.pre-view-item{
				width:80px;
				height:80px;
				position:relative;
				border:1px solid #eee;
				margin-right:8px;
				margin-bottom:5px;
				display:inline-block;
				.img-view{
					width:100%;
					height:100%;
					overflow: hidden;
					position:relative;
					img{
						width:100%;
						position:absolute;
						top:50%;
						left:50%;
						transform: translate(-50%, -50%);
					}
				}
				.del-pre{
					opacity: 0;
					position:absolute;
					top:0px;
					right:0px;
					transform: translate(50%, -50%);
					cursor: pointer;
				}
			}
			.pre-view-item:hover{
				.del-pre{
					opacity: 1;
				}
			}
		}
		.add-point{
			position: relative;
			width: 80px;
			height: 80px;
			line-height: 80px;
			border: 1px solid #eee;
			border-radius: 5px;
			text-align: center;
			cursor: pointer;
			background: center center no-repeat;
			background-size: contain;
			.add-point-icon{
				position:absolute;
				top:50%;
				left:50%;
				transform: translate(-50%, -50%);
			}
		}
		.ivu-poptip-body{
			text-align:left;
		}
	}
</style>