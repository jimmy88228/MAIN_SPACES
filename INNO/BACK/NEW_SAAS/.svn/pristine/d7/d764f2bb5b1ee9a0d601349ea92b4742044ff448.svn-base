<style lang="less">
	.brand-options{
	.ivu-tabs-tab{
		font-size:12px;
		line-height:23px;
	}
	.tips{
		margin-left:0px;
		width:100%;
		float: left;
	}
	.ivu-form{
		margin-right:10px;
	}
	.editor-box{
		overflow:hidden auto;
	}

	.image-box{
		height: 70px;
		line-height:70px;
		width:70px;
		background:center center no-repeat;
		background-size: 100% auto;
		border: 1px solid #eee;
	    border-radius: 5px;
	    text-align: center;
	    position: relative;
	    cursor: pointer;
	    float: left;
    	margin-right: 10px;

    .ivu-icon{
      line-height:70px;
    }
		.close{
			font-size:20px;
			font-weight: bold;
			color:#ed4014;
			position: absolute;
			right:-10px;
			top:-10px;
			cursor: pointer;
      line-height: 20px;
		}
    }
}

.options-img-box{
	float:left;
	width:70px;
	margin-right:10px;
	margin-bottom:10px;

	.image-item{
		height: 70px;
		line-height:80px;
		width:100%;
		background:center center no-repeat;
		background-size: 100% auto;
		border: 1px solid #eee;
	    border-radius: 5px;
	    text-align: center;
	    position: relative;
		cursor: pointer;

		&:hover{
			.close, .handle{
				display: block;
			}
		}
		.close{
			font-size:20px;
			font-weight: bold;
			color:#ed4014;
			position: absolute;
			right:-10px;
			top:-10px;
			display: none;
			cursor: pointer;
		}
		.handle{
			font-size:20px;
			cursor:move;
			position: absolute;
	    	left: -5px;
	    	top: -10px;
	    	display: none;
		}
	}
}
.slick-optionsImg-item{
	float:left;
	z-index:100;
}
</style>

<template>
	<div class="brand-options" v-show="modalShow">
		<Card>
			<div slot="title">
				<Tooltip v-if="canGoBack" content="返回" placement="bottom-start">
					<Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28" />
				</Tooltip>
				<Icon v-else type="md-settings" size="24"></Icon>
				<span style="margin:0 0 0 10px;">{{modalTitle}}</span>
			</div>
			<div slot="extra">
				<Button type="primary" v-if="canSetting" @click="modalOk">保存</Button>
			</div>
			<template v-if="canSetting">
				<Tabs type="card" :animated="false">
					<TabPane v-for="(group0,gindex) in dataList" :key="'tab'+gindex" :label="group0.groupName">
						<div class="editor-box" :style="'height:'+boxHeight+'px;'">
							<Form :label-width="240">

								<template v-for="(group,index0) in group0.children">
									<titleBar>{{group.name}}</titleBar>
									<FormItem v-for="(item,index) in group.children" :name="'g'+index" :key="index0+'-'+index" :label="item.name"
									 v-show="item.type =='csText4' && csLevel < 4 ? false : ( item.type =='csText5' && csLevel < 5 ? false : true) ">
										<Input v-if="item.type=='text'" v-model="item.value" style="width:400px;">
										<span v-if="item.text_prepend != null && item.text_prepend != ''" slot="append">{{item.text_prepend}}</span>
										<span v-if="item.text_append != null && item.text_append != ''" slot="append">{{item.text_append}}</span>
										</Input>
										<Input v-if="item.type=='email'" type="email" v-model="item.value" style="width:200px;"></Input>
										<Input v-if="item.type=='password'" type="password" v-model="item.value" style="width:200px;"></Input>
										<Input v-if="item.type=='number'" type="number" v-model="item.value" style="width:150px;">
										<span v-if="item.text_prepend != null && item.text_prepend != ''" slot="append">{{item.text_prepend}}</span>
										<span v-if="item.text_append != null && item.text_append != ''" slot="append">{{item.text_append}}</span>
										</Input>
										<InputNumber v-if="item.type=='inputNumber'" :max="item.extend.max" :min="item.extend.min" v-model="item.value"></InputNumber>
										<Input v-if="item.type=='textarea'" type="textarea" v-model="item.value" style="width:60%;" :autosize="{minRows: 5}"></Input>

										<RadioGroup v-if="item.type=='radio'" v-model="item.value">
											<Radio v-for="(option,oindex) in item.options" :name="'radio'+oindex" :key="oindex" :label="option.code">
												<span>{{option.name}}</span>
											</Radio>
										</RadioGroup>

										<i-switch v-if="item.type=='switch'" v-model="item.value" size="large">
											<span slot="open">{{item.options != null ? item.options.open : '开启'}}</span>
											<span slot="close">{{item.options != null ? item.options.close : '关闭'}}</span>
										</i-switch>

										<!--颜色选择-->
										<ColorPicker v-if="item.type=='color'" v-model="item.value" />

										<!--单文件选择-->
										<div v-if="item.type=='file'" :class="(item.value=='' ? 'image-box':'')" @click="selectFile(item.code,item.value)">
											<Icon v-show="(item.value=='')" type="md-add" size="30" title="选择文件"></Icon>
											<Tag v-if="item.value!=''" @click.native="selectFile(item.code,item.value)">{{item.value}}</Tag>
										</div>

										<!--单图选择-->
										<div v-if="item.type=='image'" class="image-box" @click="selectImage(item.code,item.value)" :style="'background-image:url('+item.value+')'">
											<Icon v-show="(item.value=='')" type="md-add" size="30" title="选择图片(单图)"></Icon>
											<Icon v-show="(item.value!='')" type="ios-close-circle-outline" class="close" title="删除图片" @click.stop="item.value = '' " />
										</div>

										<!--多图选择-->
										<div v-if="item.type=='images'">
											<!--图片列表-->
											<SlickList v-model="item.value" :useDragHandle="true" axis="x">
												<SlickItem v-for="(img, indexImg ) in item.value" :index="indexImg" :key="indexImg" :name="indexImg" class="slick-optionsImg-item options-img-box">
													<div class="image-item" :style="'background-image: url('+img+');'" title="点击查看大图" @click.stop="showImage(img)">
														<Icon type="ios-close-circle-outline" class="close" title="删除图片" @click.stop="onRemoveImage(item.value, index)" />
														<Icon v-handle class="handle" type="md-apps" title="拖动排序" />
													</div>
												</SlickItem>
											</SlickList>

											<div class="options-img-box">
												<div class="image-item" @click="selectImages(item.code,item.value)" style="cursor: pointer;">
													<Icon type="md-add" size="30" title="添加图片(多图)"></Icon>
												</div>
											</div>
										</div>

										<!--客服评价设置组件-->
										<RadioGroup v-if="item.type=='csLevel'" v-model="item.value" @on-change="csLevelChange">
											<Radio v-for="(option,oindex) in item.options" :name="'radio'+oindex" :key="oindex" :label="option.code">
												<span>{{option.name}}</span>
											</Radio>
										</RadioGroup>

										<!--客服评价名称-->
										<Input v-if="item.type=='csText1'" v-model="item.value" style="width:200px;"></Input>
										<Input v-if="item.type=='csText2'" v-model="item.value" style="width:200px;"></Input>
										<Input v-if="item.type=='csText3'" v-model="item.value" style="width:200px;"></Input>
										<Input v-if="item.type=='csText4'" v-model="item.value" style="width:200px;"></Input>
										<Input v-if="item.type=='csText5'" v-model="item.value" style="width:200px;"></Input>

										<!--时间范围选择-->
										<TimePicker v-if="item.type=='timerange'" v-model="item.value" format="HH点mm分" type="timerange" placement="bottom-end"
										 placeholder="" style="width:200px"></TimePicker>
										
										<!--优惠券选择组件-->
										<template v-if=" item.type == 'coupons' ">
											<coupon-select :data="item.value" type="checkbox" 
											@del-tag="data => handleCouponClose(data, index, item)">
												<Button type="dashed" class="basic_select"
												@click="(selected) => handleCouponSelected(selected, index, item)" >选择优惠券</Button>
											</coupon-select>
										</template>
										
										<!--选择组件，初始化的列表参数是特定添加的-->
										<Select v-if="item.type=='select-multi'" v-model="item.value" multiple style="width:300px">
											<Option v-if="item.code=='daily_question_banks'" v-for="(opItem,opindex) in bankList" :key="opindex" :value="String(opItem.id)">{{opItem.name}}</Option>

											<Option v-if="item.code=='duty_work_salary_item'" v-for="(opItem,opindex) in salaryItemList" :key="opindex"
											 :value="String(opItem.code)">{{opItem.name}}</Option>
										</Select>

										<Button v-if="item.type=='button'" @click="clickButton(item.click)">{{item.button_name}}</Button>

										<!--备注内容-->
										<div class="tips">{{item.desc}}</div>

									</FormItem>
								</template>
							</Form>
						</div>
					</TabPane>

				</Tabs>

				<div class="form-footer-button-box">
					<Button v-if="canGoBack" @click="goBack">取消</Button>
					<Button type="primary" @click="modalOk">保存</Button>
				</div>
			</template>
			<template v-else>
				<div style="padding:20px 0;text-align: center;">{{errorMsg}}</div>
			</template>
		</Card>

		<!--用户图片管理组件-->
		<userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>

		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>

	</div>
</template>

<script>
	import titleBar from '@/views/my-components/title-bar/title-bar';
	import userImages from '@/views/my-components/user-images/user-images.vue';
	import CouponSelect from '@/views/my-components/list-component/index-edit';
	import {
		SlickList,
		SlickItem,
		HandleDirective
	} from 'vue-slicksort';

	/**
	 * 这里作为设置组件
	 */
	export default {
		name: 'options',
		directives: {
			handle: HandleDirective
		}, // vue-slicksort 的拖动手柄需要这个
		components: {
			titleBar,
			userImages,
			SlickList,
			SlickItem,
			CouponSelect,
		},
		props: {
			// 需要显示的配置分组名
			showCodes: {
				type: Array,
				default: () => [],
			},
			// 指定品牌ID（超管组件专用参数）
			brandId: {
				type: Number,
				default: 0,
			}
		},
		data() {
			return {
				modalShow: false,
				modalTitle: '设置',
				dataList: [],
				boxHeight: 400,
				canSetting: true,
				errorMsg: '',

				spinShow: false,
				canGoBack: true,
				bankList: [],
				salaryItemList: [],

				csLevel: 3,
			}
		},
		methods: {
			init() {
				// 动态计算表高度
				this.boxHeight = document.body.clientHeight - 260;

				// 超管
				if (this.showCodes[0] == 'superAdmin') {
					this.spinShow = true;
					this.canGoBack = true;
					// ajax 请求获取初始化数据，
					this.$ajax.post(this.$api.globalSettingList, {

						})
						.then((response) => {
							this.spinShow = false;
							var res = response.data;

							if (res.code) {
								// 初始化类型
								this.dataList = res.data;
							}

						});
				}
				// 普通品牌
				else {
					this.spinShow = true;

					if (this.showCodes[0] == 'brandSetting') {
						this.canGoBack = true;
					} else {
						this.canGoBack = false;
					}

					// ajax 请求获取初始化数据，
					this.$ajax.post(this.$api.optionsList, {
							show_codes: this.showCodes,
							brand_id: this.brandId,
						})
						.then((response) => {
							this.spinShow = false;
							var res = response.data;

							if (res.code) {
								this.dataList = res.data.items;
								this.canSetting = true;

								this.bankList = res.data.bankList;
								this.salaryItemList = res.data.salaryItemList;

								// 把客服等级抽离出来
								for (var i in this.dataList) {
									for (var j in this.dataList[i].children) {
										for (var t in this.dataList[i].children[j].children) {
											if (this.dataList[i].children[j].children[t].type == 'csLevel') {
												this.csLevel = Number(this.dataList[i].children[j].children[t].value) == 0 ? 3 : Number(this.dataList[
													i].children[j].children[t].value);
												break;
											}
										}
									}
								}
							} else {
								this.$Message.error(res.message);
								this.errorMsg = res.message;
								this.canSetting = false;
							}
						});
				}
			},
			// 提供给父组件使用
			openModal(canGoBack = true) {
				//this.canGoBack = canGoBack;
				this.modalShow = true;
			},
			// 保存
			modalOk() {
				// 超管
				if (this.showCodes[0] == 'superAdmin') {
					this.spinShow = true;
					// ajax 请求获取初始化数据，然后动态更新下面数据源
					this.$ajax.post(this.$api.globalSettingSave, {
							data: this.dataList,
						})
						.then((response) => {
							this.spinShow = false;
							var res = response.data;

							if (res.code) {
								this.$Message.success(res.message);
							} else {
								this.$Message.error(res.message);
							}

						});
				}
				// 超管设置品牌
				else if (this.showCodes[0] == 'brandSetting') {
					this.spinShow = true;
					this.$ajax.post(this.$api.brandOptionSave, {
							data: this.dataList,
							brand_id: this.brandId,
						})
						.then((response) => {
							this.spinShow = false;
							var res = response.data;

							if (res.code) {
								this.$Message.success(res.message);

								if (this.canGoBack) {
									this.modalShow = false;
									this.$emit('on-success');
								}
							} else {
								this.$Message.error(res.message);
							}
						});
				}
				// 普通品牌
				else {
					this.spinShow = true;
					this.$ajax.post(this.$api.optionsSave, {
							data: this.dataList
						})
						.then((response) => {
							this.spinShow = false;
							var res = response.data;

							if (res.code) {
								this.$Message.success(res.message);

								if (this.canGoBack) {
									this.modalShow = false;
									this.$emit('on-success');
								}
							} else {
								this.$Message.error(res.message);
							}
						});
				}
			},
			// 选择文件(单文件)
			selectFile(objName, objVal) {
				this.$refs['user-images'].showModal({
					name: objName,
					multi: 0,
					selectedImage: objVal,
					type: 'FILE',
				});
			},
			// 选择图片(单图)
			selectImage(objName, objVal) {
				this.$refs['user-images'].showModal({
					name: objName,
					multi: 0,
					selectedImage: objVal,
				});
			},
			// 选择图片（多图）
			selectImages(objName, objVal) {
				this.$refs['user-images'].showModal({
					name: objName,
					multi: 1,
					selectedImages: objVal,
				});
			},
			// 选择图片的回调
			returnImageUrl(obj) {
				for (var i in this.dataList) {
					for (var j in this.dataList[i].children) {
						for (var k in this.dataList[i].children[j].children) {
							if (this.dataList[i].children[j].children[k].code == obj.name) {
								this.dataList[i].children[j].children[k].value = obj.val;
								break;
							}
						}
					}
				}
				//this.$set( this.formItem, obj.name, obj.val );
			},
			// 删除优惠券
			handleCouponClose(data, index, item ){
				item.value = data;
			},
			// 选择优惠券
			handleCouponSelected( selected, index, item ){
				this.$selectContent({
					mode: 'coupon',
					type: 'checkbox',
					data: item.value,
					getList: (data) => {
						item.value = data;
						//this.$refs.formValidate.validateField(`rules.${index}.coupons`);
					}
				});
			},
			// 删除单张图片
			onRemoveImage(objVal, index) {
				this.$delete(objVal, index);
			},
			// 等级变化
			csLevelChange(val) {
				this.csLevel = val;
			},
			// 返回列表
			goBack() {
				this.modalShow = false;
				this.$emit('on-close', {});
			},
			// 点击按钮事件
			clickButton(clickType) {
				if (clickType == 'testEmail') {
					this.$refs['test-email'].openModel();
				}
			},
			// 查看大图
			showImage(imgSrc) {
				this.$util.viewImage(imgSrc, this);
			}
		},
		mounted() {
			this.init();
		},
	}
</script>
