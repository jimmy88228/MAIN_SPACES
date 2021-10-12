<template>
	<pageTopBase :isSave="!editId" @save="saveTaskInfo" class="notice-details-area" >
		<Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="120">
				<FormItem label="通知名称" prop="name">
					<Input
							class="basic_input"
							v-model="formData.name"
							placeholder="请输入通知名称"
							clearable>
					</Input>
				</FormItem>
				<FormItem label="自动执行时间" prop="exec_time">
					<DatePicker 
					:time-picker-options="{disabledHours: disabledHours, disabledMinutes: disabledMinutes}"
					format="yyyy-MM-dd HH:mm" 
					type="datetime" 
					:options="dateOptions" 
					:value="formData.exec_time" 
					@on-change="changeExeCTime" 
					placeholder="选择执行时间" 
					class="basic_select"></DatePicker>
					<span style="color:red;font-size:12px;">执行时间不能小于当前时间</span>
				</FormItem>
				<FormItem label="推送类型" prop="tpl_group">
					<Select class="basic_select" v-model="formData.tpl_group" @on-change="changeTplGroup">
						<Option value="">请选择</Option>
						<Option :value="index" v-for="(item, index) in groupList" :key="index">{{item}}</Option>
					</Select>
				</FormItem>
				<FormItem label="消息模板" prop="tpl_type">
					<Select class="basic_select" v-model="formData.tpl_type" @on-change="changeTpl">
						<Option value="">请选择</Option>
						<Option :value="item.type" v-for="(item, index) in templateList" :key="item.type">{{item.title}}</Option>
					</Select>
				</FormItem>
				<FormItem label="推送标签" prop="push_label" v-if="showTag">
					<!-- <Button type="dashed" @click="handleSelected" class="basic_select" style="margin-bottom: 24px;">选择优惠券</Button> -->
					<labels-select :data="formData.labels" type="checkbox" @del-tag="handleLabelClose">
						<Button type="dashed" @click="handleLabelSelected" class="basic_select">选择标签</Button>
					</labels-select>
				</FormItem>
				<FormItem label="标题">
					<div class="m-bottom-15">{{formData.tpl_type_str || '通知标题'}}</div>
					<div class="flex push-card-area">
						<div class="push-card">
							<div class="card-content">
								<div>{{formData.tpl_type_str || '通知标题'}}</div>
								<div class="card-c-items">
									<div class="card-c-item flex" v-for="(item, index) in cardParams" :key="item.params_name" v-if="item.params_name != 'path'">
										<div class="card-c-label f-shrink0">{{item.title}}</div>
										<div class="card-c-content" v-if="item.data_type == 'NVARCHAR'">{{formData.params_json[item.params_name] || ''}}</div>
										<div class="card-c-content" v-if="item.data_type == 'DATETIME'">{{gettime(formData.params_json[item.params_name])}}</div>
									</div>
								</div>
							</div>
							<div class="flex f-just-between f-align-center card-point">
								<span>详情</span>
								<Icon type="ios-arrow-forward" />
							</div>
						</div>
						<div class="push-card-edit">
							<div class="push-card-edit-stay">
								<FormItem 
								:label="item.title + ':'" 
								:prop="'params_json.' + item.params_name" 
								v-for="(item, index) in cardParams" 
								:rules="{required: true, message: item.title +'不能为空!', trigger: 'blur', type: item.data_type == 'DATETIME' ? 'date' : 'string'}"
								:key="item.params_name">
									<Input
									:type="item.params_name == 'activity_tips' ? 'textarea' : 'text'"
									style="width: 300px;"
									:maxlength="item.max_length"
									:show-word-limit="true"
									v-model="formData.params_json[item.params_name]"
									:placeholder="'请输入'+item.title"
									clearable v-if="item.data_type == 'NVARCHAR'">
									</Input>	
									<DatePicker v-model="formData.params_json[item.params_name]" type="datetime" placeholder="选择时间" style="width: 200px" v-if="item.data_type == 'DATETIME'"></DatePicker>
								</FormItem>
								
								<div style="min-width:300px;width:100%;" class="text-c" v-if="cardParams.length < 1">暂无可编辑通知字段</div>
							</div>
						</div>
					</div>
				</FormItem>
		</Form>
	</pageTopBase>
</template>
<script>
	import pageTopBase from "@/views/my-components/page-top-base/index.vue";
	import DateH from "@/libs/date-manager.js";
	import LabelsSelect from '@/views/my-components/list-component/index-edit';
	// import dateSelect from "@/views/my-components/date-select/index.vue";
	export default{
		data(){
			return {
				formData: {
					exec_time: "",
					tag_ids:[],
					labels: []
				},
				templateList: [],
				tpl_info: [],
				groupList:[],
				editId: 0,
				ruleValidate: {
					name: [{ required: true, message: '请输入通知名称', trigger: 'blur' }],
					exec_time: [{ required: true, trigger: 'blur', validator: (rule, value, callback)=>{
						if (!value) {
							callback(new Error('请输入通知执行时间'));
						} else {
							let dateT = new Date(value).getTime();
							let nowT = new Date().getTime();
							if(nowT > dateT){
								callback('通知执行时间不能小于当前时间');
							} else {
								callback();
							}
						}
					} }],
					tpl_group: [{ required: true, message: '请选择推送类型', trigger: 'change' }],
					tpl_type: [{ required: true, message: '请选择消息模板', trigger: 'change' }]
				},
				dateOptions: {
					disabledDate(date){
						return date && date.valueOf() < Date.now() - 86400000;
					}
				},
				showTag:false,
				// disabledHours: [],
				// disabledMinutes: []
			}
		},
		components:{
			pageTopBase,
			LabelsSelect
			// dateSelect
		},
		computed:{
			templateJson:{
				get(){
					let templateList = this.templateList || [];
					let json = {};
					for(let i = 0; i < templateList.length; i++){
						let type = templateList[i].type;
						json[type] = templateList[i];
					}
					return json;
				}
			},
			cardParams:{
				get(){
					let templateJson = this.templateJson;
					let formData = this.formData || {};
					let result = [];
					if(formData.tpl_type && templateJson[formData.tpl_type]){
						result = templateJson[formData.tpl_type].params_content || []
					}
					return result;
				}
			},
			disabledHours: {
				get(){
					let exec_time = (this.formData && this.formData.exec_time) || "";
					return DateH.getDisabledHour(exec_time);
				}
			},
			disabledMinutes: {
				get(){
					let exec_time = (this.formData && this.formData.exec_time) || "";
					return DateH.getDisabledMin(exec_time);
				}
			}
		},
		methods:{
			initPrams(){
				let query  = this.$route.query || {};
				this.editId = query.id || 0;
			},
			changeExeCTime(date){
				this.formData.exec_time = date;
			},
			getNoticeDetail(){
				this.$store.commit('setLoading', true);
				return this.$ajax.post(this.$api.getSubmsgTaskInfo, {
					id: this.editId || 0
				})
				.then(response => {
				  const res = response.data;
				  if (res.code) {
				    let data = res.data;
						// this.templateList = data.tpl_info || [];
						
						this.tpl_info = data.tpl_info || [];
						this.groupList = data.tpl_group || [];
						let task_info = data.task_info || {};
						task_info.params_json = task_info.params_json || {};
						task_info.exec_time = task_info.exec_time || "";
						this.formData = task_info;
						if (data.tpl_info != []) {
							console.log(data.task_info)
							console.log(this.tpl_info)
							this.templateList =  this.tpl_info[task_info.tpl_group] || [];
							console.log(this.tpl_info[task_info.tpl_group])
							if (task_info.tpl_group == 'SIGN_PUSH') {
								this.showTag = true;
							}
						}
				  }
				}).finally(()=>{
					this.$store.commit('setLoading', false);
				})
			},
			changeTplGroup(group) {
				console.log(group)
				if (group != 'undefined') {
					this.templateList = this.tpl_info[group] || [];
					if (group == 'SIGN_PUSH') {
						this.showTag = true;
					} else {
						this.showTag = false;
					}

				}
			},
			changeTpl(type){
				let templateJson = this.templateJson || {};
				this.formData.tpl_type_str = (templateJson[type] && templateJson[type].title) || "";
			},
			saveTaskInfo(){
				if(this.editId) return;
				this.$refs.formData.validate((valid)=>{
					console.log("valid", valid);
					console.log("formData", this.formData);
					if(valid){
						this.$store.commit('setLoading', true);
						if (this.formData.labels != undefined) {
							this.formData.tag_ids = this.formData.labels.map(item => item._id).join();
						} else {
							this.formData.tag_ids = [];
						}
						return this.$ajax.post(this.$api.addSubmsgTask, {
							...this.formData
						})
						.then(response => {
						  const res = response.data;
						  if (res.code) {
						    this.$Message.success(res.message);
								this.$router.go(-1);
						  } else {
								this.$Message.warning(res.message);
							}
						}).finally(()=>{
							this.$store.commit('setLoading', false);
						})
					}
				})
			},
			handleLabelSelected () {
				let val = this.formData.labels || [];
				let vals = [];
				for (let i = 0; i < val.length; i++) {
					vals.push({
						id: 'manual' + val[i].id,
						tabType: 'manual',
						name: val[i].name
					})
				}
				this.$selectContent({
					mode: 'labels',
          type: 'checkbox',
					modeStyle: 'tab',
					showTab: 'manual',
					reqConfig: 'labels',
					data: vals,
					getList: (data) => {
						let ids = [];
						for(let i = 0; i < data.length; i++){
							let tabType = data[i].tabType || "";
							let id = data[i].id;
							id = id.replace(new RegExp(tabType,'gm'),'');
							ids.push({
								...data[i],
								id: id
							});
						}
						this.$set(this.formData, 'labels', ids);
					}
				})
			},
			handleLabelClose (data) {
				this.formData.labels = data;
			},
			gettime(t){
				if(!t) return "";
				var _time=new Date(t);
				var   year=_time.getFullYear();//2017
				var   month=_time.getMonth()+1;//7
				var   date=_time.getDate();//10
				var   hour=_time.getHours();//10
				var   minute=_time.getMinutes();//56
				var   second=_time.getSeconds();//15
				return   year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;//这里自己按自己需要的格式拼接
			}
		},
		mounted(){
			this.initPrams();
			this.getNoticeDetail();
		},
		watch:{}
	}
</script>
<style lang="less">
	.notice-details-area{
		.push-card-area{
			align-items: flex-start;
		}
		.push-card{
			flex-shrink: 0;
			width: 300px;
			box-sizing: border-box;
			border: 1px solid #dcdee2;
			.card-content{
				min-height: 200px;
				padding:20px;
				.card-c-items{
					margin-top:30px;
					.card-c-label{
						color:#D2D2D2;
						width:120px;
					}
				}
			}
			.card-point{
				border-top: 1px solid #dcdee2;
				height:40px;
				padding:0px 20px;
			}
		}
		.push-card-edit{
			.push-card-edit-stay{
				padding: 20px;
				border: 1px solid #E1E1E1;
				border-radius: 5px;
				background-color:#F6F6F6;
				margin-left:50px;
			}
			.ivu-form-item{
				display:flex;
				margin-bottom: 24px;
			}
		}
	}
</style>