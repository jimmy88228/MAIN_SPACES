<template>
	<div class="phone_form">
		<PageTopBase isSave @save="confirm">
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140" label-colon>
				<FormItem label="任务名称" prop="name">
					<Input v-model="formItem.name" placeholder="请输入任务名称" class="basic_input" />
				</FormItem>
				<FormItem label="执行时间" prop="exec_time">
					<DatePicker 
					 	type="datetime" 
						v-model="formItem.exec_time"
						:time-picker-options="{disabledHours: disabledHours, disabledMinutes: disabledMinutes}"
						:options="dashedtime"
						format="yyyy-MM-dd HH:mm:ss" 
						placeholder="请输入执行时间" 
						style="width: 200px">
					</DatePicker>
				</FormItem>
				<FormItem label="是否自动重拨">
					<i-switch size="large" v-model="formItem.is_recall" :true-value="1" :false-value="0">
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
					<!-- <span>备注：</span> -->
				</FormItem>
				<FormItem label="重拨间隔" prop="recall_interval" v-if="formItem.is_recall==1">
					<InputNumber
                		v-model="formItem.recall_interval"
						:min="0"
						style="width:100px;"/> 分钟
				</FormItem>
				<FormItem label="重拨次数" prop="recall_count" v-if="formItem.is_recall==1">
					<InputNumber
                		v-model="formItem.recall_count"
						:min="0"
						style="width:100px;"/> 次
				</FormItem>
				<FormItem prop="robot_def_id" label="AI 话术">
					<Select v-model="formItem.robot_def_id" style="width:300px">
						<Option v-for="item in robotData" :value="Number(item.robot_def_id)" :key="Number(item.robot_def_id)">{{ item.robot_name }}</Option>
					</Select>
				</FormItem>
				<FormItem  label="外呼方式">
					<RadioGroup v-model="formItem.user_phone_type">
						<Radio :label="1">线路</Radio>
						<Radio :label="2">手机号</Radio>
						<Radio :label="3">固话</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="外呼号码" :prop="formItem.user_phone_type==1 ? 'line_value' : formItem.user_phone_type==2 ? 'cell_value': 'fixed_value' ">
					<Select 
						v-model="formItem.line_value" 
						v-if="formItem.user_phone_type==1" 
						style="width:300px">
						<Option v-for="item in lineData" :value="item.user_phone_id" :key="item.user_phone_id">{{ item.phone }}</Option>
					</Select>
					<Select 
						v-model="formItem.cell_value" 
						multiple
						filterable 
						v-if="formItem.user_phone_type==2" 
						style="width:300px"
						>
						<Option v-for="item in cellData" :value="item.user_phone_id" :key="item.user_phone_id">{{ item.phone }}</Option>
					</Select>
					<Select 
						v-model="formItem.fixed_value" 
						v-if="formItem.user_phone_type==3" 
						style="width:300px">
						<Option v-for="item in fixedData" :value="item.user_phone_id" :key="item.user_phone_id">{{ item.phone }}</Option>
					</Select>
				</FormItem>
				<FormItem label="是否发送挂机短信">
					<i-switch size="large" v-model="formItem.sms_type" :true-value="1" :false-value="0">
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</FormItem>
				<FormItem v-if="formItem.sms_type>0">
					<CheckboxGroup v-model="formItem.sms_send_level">
						<Checkbox label="A级(有明确意向)"></Checkbox>
						<Checkbox label="B级(可能有意向)"></Checkbox>
						<Checkbox label="C级(明确拒绝)"></Checkbox>
						<Checkbox label="D级(用户忙)"></Checkbox>
						<Checkbox label="E级(拨打失败)"></Checkbox>
						<Checkbox label="F级(无效客户)"></Checkbox>
					</CheckboxGroup>
				</FormItem>
				<FormItem v-if="formItem.sms_type>0">
					<Select v-model="formItem.sms_template_id" style="width:300px">
						<Option v-for="item in noteData" :value="Number(item.template_id)" :key="Number(item.template_id)">{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="是否开启弹性坐席">
					<i-switch size="large" v-model="formItem.open_elasticity" :true-value="1" :false-value="0">
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</FormItem>
				<FormItem label="是否自动加微">
					<i-switch size="large" v-model="formItem.auto_add_wx" :true-value="1" :false-value="0">
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</FormItem>
			</Form>
		</PageTopBase>
		<!--加载提示-->
		<Spin size="large" fix v-show="spinShow"></Spin>
	</div>
</template>
<script>

	import PageTopBase from '@/views/my-components/page-top-base/index';
	import DateH from "@/libs/date-manager.js";
	export default {
		components: {
			PageTopBase,
		},
		data() {
			return {
				formItem: {
					name: '',
					exec_time:'',
					is_recall:0,
					recall_interval:0,
					recall_count:0,
					robot_def_id:0,
					user_phone_type:1,
					user_phone_ids:"",
					sms_type:0,
					open_elasticity:0,
					auto_add_wx:0,
					line_value:"0",
					cell_value:[],
					fixed_value:"0",
					sms_send_level:[],
					sms_template_id:0,
				},
				robotData:[],
				fixedData:[],
				lineData:[],
				noteData:[],
				cellData:[],
				ruleValidate: {
					cell_value: [{
						required: true,
						message: '外呼号码不能为空',
						type: 'array',
						trigger: 'change'
					}],
					line_value: [{
						required: true,
						message: '外呼号码不能为空',
						trigger: 'change',
						validator: this.changelinevalue
					}],
					fixed_value: [{
						required: true,
						message: '外呼号码不能为空',
						trigger: 'change',
						validator: this.changefixedvalue
					}],
					robot_def_id: [{
						required: true,
						message: 'AI 话术不能为空',
						type: 'number',
						min:1,
						trigger: 'change'
					}],
					recall_interval: [{
						required: true,
						message: '重拨间隔不能小于等于0',
						type: 'number',
						min:1,
						trigger: 'blur'
					}],
					recall_count: [{
						required: true,
						message: '重拨次数不能小于等于0',
						type: 'number',
						min:1,
						trigger: 'blur'
					}],
					exec_time: [{
						required: true,
						message: '执行时间不能为空',
						type: 'date',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '任务名称不能为空',
						trigger: 'blur'
					}],
				},
				dashedtime: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
				spinShow: false,
				id:this.$route.query.id
			}
		},
		computed: {
			disabledHours: {
				get(){
					let exec_time = (this.formItem && this.formItem.exec_time) || "";
					return DateH.getDisabledHour(exec_time);
				}
			},
			disabledMinutes: {
				get(){
					let exec_time = (this.formItem && this.formItem.exec_time) || "";
					return DateH.getDisabledMin(exec_time);
				}
			}
		},
		methods: {
			changelinevalue (rule, value, callback) {
				if (Number(value)>0) {
					callback();
				} else {
					callback(new Error('外呼号码不能为空'));
				}
			},
			changefixedvalue (rule, value, callback) {
				if (Number(value)>0) {
					callback();
				} else {
					callback(new Error('外呼号码不能为空'));
				}
			},
			loadData() {
				this.spinShow = true;
				return this.$ajax.post(this.$api.phoneCallInfo, {
						id: Number(this.id) || 0
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.robotData = res.data && res.data.robot_data;
							this.fixedData = res.data && res.data.fixed_data;
							this.lineData = res.data && res.data.line_data;
							this.noteData = res.data && res.data.note_data;
							this.cellData = res.data && res.data.cell_data;
							if (Number(this.id)) {
								const itemsMes = (res.data && res.data.items) || {};
								this.formItem.name = itemsMes.name;
								this.formItem.exec_time = itemsMes.exec_time;
								this.formItem.is_recall =Number(itemsMes.is_recall);
								this.formItem.recall_interval =Number(itemsMes.recall_interval);
								this.formItem.recall_count =Number(itemsMes.recall_count);
								this.formItem.robot_def_id =Number(itemsMes.robot_def_id);
								this.formItem.user_phone_type = Number(itemsMes.user_phone_type);
								this.formItem.user_phone_ids =itemsMes.user_phone_ids;
								this.formItem.sms_type = Number(itemsMes.sms_type);
								this.formItem.open_elasticity = Number(itemsMes.open_elasticity);
								this.formItem.auto_add_wx = Number(itemsMes.auto_add_wx);
								this.formItem.line_value =itemsMes.line_value;
								this.formItem.cell_value =itemsMes.cell_value || [];
								this.formItem.fixed_value = itemsMes.fixed_value;
								this.formItem.sms_send_level =itemsMes.sms_send_level?itemsMes.sms_send_level.split(","):[];
								this.formItem.sms_template_id =Number(itemsMes.sms_template_id);
							}
							this.spinShow = false;
						}
					});
			},
			confirm() {
				this.$refs.formValidate.validate((valid) => {
					if (valid) {
						//确认之后给formItem.user_phone_ids赋值
						if(Number(this.formItem.user_phone_type)==1){
							this.formItem.user_phone_ids=this.formItem.line_value;
						}else if(Number(this.formItem.user_phone_type)==2){
							this.formItem.user_phone_ids=this.formItem.cell_value.join(",");
						}else{
							this.formItem.user_phone_ids=this.formItem.fixed_value;
						}
						this.spinShow = true;
						this.$ajax.post(Number(this.id) ? this.$api.phoneCallEdit : this.$api.phoneCallAdd, {
								id: this.id ? this.id : 0,
								name: this.formItem.name,
								exec_time: this.formItem.exec_time,
								is_recall: this.formItem.is_recall,
								recall_interval:Number(this.formItem.is_recall)?this.formItem.recall_interval:0,
								recall_count:Number(this.formItem.is_recall)?this.formItem.recall_count:0,
								robot_def_id: this.formItem.robot_def_id,
								user_phone_type: this.formItem.user_phone_type,
								user_phone_ids: this.formItem.user_phone_ids,
								sms_type: this.formItem.sms_type,
								open_elasticity: this.formItem.open_elasticity,
								auto_add_wx: this.formItem.auto_add_wx,
								sms_template_id:this.formItem.sms_type==1?this.formItem.sms_template_id:0,
								sms_send_level:this.formItem.sms_type==1 && this.formItem.sms_send_level ?this.formItem.sms_send_level.join(","):"",
							})
							.then((response) => {
								const res = response.data;
								if (res.code) {
									this.$Message.success(res.message);
									this.spinShow = false;
									this.$router.go(-1);
								}
							}).finally(()=>{
								this.spinShow = false;
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
	}
</style>
