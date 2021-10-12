<template>
	<div class="phone_form">
		<PageTopBase isSave @save="confirm">
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140" label-colon>
				<FormItem label="任务名称" prop="plan_name">
					<Input v-model="formItem.plan_name" placeholder="请输入任务名称" class="basic_input" />
				</FormItem>
				<FormItem label="推送时间" prop="plan_exec_time">
					<DatePicker type="datetime" v-model="formItem.plan_exec_time"
						:time-picker-options="{disabledHours: disabledHours, disabledMinutes: disabledMinutes}"
						:options="dashedtime" format="yyyy-MM-dd HH:mm:ss" placeholder="请输入执行时间" style="width: 200px">
					</DatePicker>
				</FormItem>
				<FormItem prop="ai_task_id" label="绑定呼出任务">
					<Select v-model="formItem.ai_task_id" style="width:300px">
						<Option v-for="item in taskData" :value="Number(item.id)" :key="Number(item.id)">{{ item.name }}
						</Option>
					</Select>
				</FormItem>
				<FormItem prop="" label="推送消息">
					<Poptip title="">
						<Button class="" type="primary">+添加推动内容</Button>
						<div slot="title"></div>
						<div slot="content">
							<div class="flex msg-types">
								<div class="f-shrink0 msg-type" v-for="(item, index) in msgTypes"
									@click="chooseMsg(item)" :key="item.id"
									:style="{'background-color': item.iconBg, 'color': '#fff'}">
									<Icon :type="item.icon" size="20" />
									<p>{{item.typeName}}</p>
								</div>
							</div>
						</div>
					</Poptip>
					<div class="p-top-15">
						<Tag 
						type="dot" 
						class="msg-point m-bottom-10"
						closable color="primary"  
						v-for="(item, index) in msgList" 
						:key="index" 
						@on-close="delMsg(index)">
						<div class="tag_bg" @click="chooseMsg(item, index)"></div>
						{{item.typeName}}
						</Tag>
					</div>
				</FormItem>
			</Form>
		</PageTopBase>
		<imageTextSave ref="imageTextSave" title="选择推送消息" @saveMsg="saveMsg"></imageTextSave>
	</div>
</template>
<script>
	import imageTextSave from '@/views/smart-sale/marketing/component/imageTextSave';
	import PageTopBase from '@/views/my-components/page-top-base/index';
	import DateH from "@/libs/date-manager.js";
	export default {
		components: {
			PageTopBase,
			imageTextSave
		},
		data() {
			return {
				msgTypes: {
					"1": {
						id: 1,
						icon: 'ios-mail',
						iconBg: '#0CC194',
						hideTab: ['miniprogrampage'],
						typeName: '公众号消息'
					},
					"2": {
						id: 2,
						icon: 'md-phone-portrait',
						iconBg: '#5F7AEA',
						hideTab: ['image', 'news', 'miniprogrampage'],
						typeName: '手机短信'
					},
					"3": {
						id: 3,
						icon: 'md-chatboxes',
						iconBg: '#2BDC70',
						typeName: '客服消息'
					}
				},
				msgList: [],
				formItem: {
					plan_name: '',
					plan_exec_time: '',
					ai_task_id: 0,
					chart_type: 0,
					chart_setting: []
				},
				taskData: [],
				ruleValidate: {
					ai_task_id: [{
						required: true,
						message: '请选择绑定呼出任务',
						type: 'number',
						min: 1,
						trigger: 'change'
					}],
					plan_exec_time: [{
						required: true,
						message: '推送时间不能为空',
						type: 'date',
						trigger: 'blur'
					}],
					plan_name: [{
						required: true,
						message: '任务名称不能为空',
						trigger: 'blur'
					}],
				},
				dashedtime: {
					disabledDate(date) {
						return date && date.valueOf() < Date.now() - 86400000;
					}
				},
				spinShow: false,
				id: this.$route.query.id
			}
		},
		computed: {
			disabledHours: {
				get() {
					let exec_time = (this.formItem && this.formItem.exec_time) || "";
					return DateH.getDisabledHour(exec_time);
				}
			},
			disabledMinutes: {
				get() {
					let exec_time = (this.formItem && this.formItem.exec_time) || "";
					return DateH.getDisabledMin(exec_time);
				}
			}
		},
		methods: {
			loadData() {
				this.$store.commit("setLoading", true);
				return this.$ajax.post(this.$api.newNotificationInfo, {
						id: Number(this.id) || 0
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.taskData = res.data && res.data.task_data;
							if (Number(this.id)) {
								const itemsMes = (res.data && res.data.items) || {};
								this.formItem.plan_name = itemsMes.plan_name;
								this.formItem.plan_exec_time = itemsMes.plan_exec_time;
								this.formItem.ai_task_id = Number(itemsMes.ai_task_id);
							}
						}
					}).finally(() => {
						this.$store.commit("setLoading", false);
					})
			},
			chooseMsg(item, index) {
				console.log("触发编辑");
				this.editIndex = null;
				let id = item.id || 0;
				let msgTypes = this.msgTypes || {};
				let setting = {
					id: id,
					typeName: item.typeName || "",
					content: "",
					image: "",
					img_url: "",
					msg_type: "text",
					new: ""
				};
				if(index || index == 0){
					this.editIndex = index;
					setting = item || {};
				}
				this.$refs["imageTextSave"].showModal({
					hideTab: msgTypes[id].hideTab
				}, setting);
			},
			delMsg(index){
				this.$delete(this.msgList, index);
			},
			saveMsg(data) {
				let setting = data.setting || {};
				if(this.editIndex || this.editIndex == 0){
					this.msgList[this.editIndex] == setting
				} else {
					this.msgList.push(setting);
				}
				console.log("msgList", this.msgList)
			},
			confirm() {
				this.$refs.formValidate.validate((valid) => {
					if (valid) {
						this.$store.commit("setLoading", true);
						this.$ajax.post(Number(this.id) ? this.$api.newNotificationEdit : this.$api
								.newNotificationAdd, {
									id: this.id ? this.id : 0,
									plan_name: this.formItem.plan_name,
									plan_exec_time: this.formItem.plan_exec_time,
									ai_task_id: this.formItem.ai_task_id,
									chart_type: Number(this.formItem.chart_type),
									chart_setting: this.formItem.chart_setting,
								})
							.then((response) => {
								const res = response.data;
								if (res.code) {
									this.$Message.success(res.message);
									this.$router.go(-1);
								}
							}).finally(() => {
								this.$store.commit("setLoading", false);
							})
					}
				})
			},
		},
		mounted() {
			this.loadData();
		}
	}
</script>

<style lang="less">
	.phone_form {
		.ivu-cascader-label {
			width: auto;
			text-overflow: unset;
			overflow: visible;
		}

		.store_title {
			display: flex;
			align-items: center;

			.store-form_back {
				margin-right: 20px;
			}
		}

		.basic_input,
		.basic_date,
		.basic_select {
			width: 260px;
		}

		.mini_input {
			width: 100px;
		}

		.addr_wrapper {
			margin: 10px 0 0 0;
		}

		.msg-types {
			.msg-type {
				padding: 10px;
				border: 1px solid #efefef;
				border-radius: 6px;
				cursor: pointer;
				margin: 5px;
				text-align: center;
				.ivu-icon {}
			}
		}
		.msg-point{
			cursor: pointer;
			position:relative;
			.tag_bg{
				position: absolute;
				width:100%;
				height:100%;
				top:0px;
				left:0px;
			}
			.ivu-icon-ios-close{
				z-index: 10;
			}
		}
	}
</style>
