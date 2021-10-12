<style lang="less">
	.edit-share-rule{
		.number-input{
			width: 70px;
		}
		.reward-item{
			display:inline-block;
			.r-i-title{
				background-color:#E5F5FE;
				padding-left:10px;
			}
			.r-i-cont{
				padding: 10px 0px;
			}
			.remove-rule{
				cursor: pointer;
				
			}
		}
	}
</style>
<template>
  <PageTopBase :isSave="true" @save="saveRule">
    <div class="edit-share-rule">
        <Form ref="formData" :model="formData" :label-width="160" :rules="ruleValidate">
					<FormItem label="活动名称" prop="name">
					  <Input
						v-model="formData.name"
						class="basic_input"
						placeholder="请输入活动名称"
						clearable/>
					</FormItem>
					<FormItem label="活动时间" prop="end_time">
					  <date-select ref="dateSelect" :customDate="[formData.start_time, formData.end_time]" @sT="handleStart" @eT="handleEnd"/>
					</FormItem>
					<FormItem label="是否开启">
					  <i-switch v-model="formData.enable" :true-value="1" :false-value="0">
							<span slot="open">开</span>
							<span slot="close">关</span>
						</i-switch>
					</FormItem>
					<FormItem label="限制新会员">
					  <RadioGroup v-model="formData.limit_new_user">
							<Radio :label="1"><span>是</span></Radio>
							<Radio :label="0"><span>否</span></Radio>
						</RadioGroup>
					</FormItem>
					<FormItem label="允许奖励层级循环次数" prop="reward_loop">
						<div class="flex f-align-center">
							<Input
							type="number"
							v-model="formData.reward_loop"
							class="number-input"
							placeholder="允许奖励循环次数限制"
							/>
							<p class="notice">&nbsp;*邀请层级循环奖励超过允许次数，将不再赠送奖励</p>
						</div>
					</FormItem>
					<FormItem label="分享模式">
					  <Select v-model="formData.share_type" class="basic_select">
							<Option :value="1">邀请好友参与</Option>
							<Option :value="2">邀请好友助力</Option>
						</Select>
					</FormItem>
					<FormItem label="奖励条件" prop="rule">
					  <div>
							<div v-for="(item, index) in formData.rule" :key="index">
								<div class="reward-item">
										<p class="r-i-title flex f-just-between f-align-center">
											<span>{{index + 1}}级奖励</span>
											<Icon type="ios-close-circle" @click="removeRule(index)" class="remove-rule" size="28" color="#0088ff"/>
										</p>
										<div class="r-i-cont">
											<div class="flex" v-if="formData.share_type == 2">
												每完成邀请达到&nbsp;
												<FormItem :prop="`rule.${index}.invite_condition`" :rules="ruleValidate.invite_condition">
													<Input type="number" class="number-input" v-model="item.invite_condition"/>
												</FormItem> &nbsp;
												人助力,赠送&nbsp;
												<FormItem :prop="`rule.${index}.invite_condition`" :rules="ruleValidate.invite_condition">
													<Input type="number" class="number-input" v-model="item.self_reward"/>
												</FormItem> &nbsp;次抽奖机会
											</div>
											<div class="flex f-align-center" v-else-if="formData.share_type == 1">
												每完成邀请达到&nbsp;
												<FormItem :prop="`rule.${index}.invite_condition`" :rules="ruleValidate.invite_condition">
													<Input type="number" class="number-input" v-model="item.invite_condition"/>
												</FormItem> &nbsp;
												参与活动,赠送&nbsp;
												<FormItem :prop="`rule.${index}.invite_condition`" :rules="ruleValidate.invite_condition">
													<Input type="number" class="number-input" v-model="item.self_reward"/>
												</FormItem> &nbsp;
												次抽奖机会;同时受邀者赠送&nbsp;
												<FormItem :prop="`rule.${index}.invite_condition`" :rules="ruleValidate.invite_condition">
													<Input type="number" class="number-input" v-model="item.friend_reward"/>
												</FormItem> &nbsp;次抽奖机会
											</div>
										</div>
									</div>
							</div>
							<div><Button type="primary" @click="addRule"><Icon type="md-add" />新增奖励</Button></div>
						</div>
					</FormItem>
					<FormItem label="抽奖活动关联" >
							<!-- <div><Button type="dashed">选择关联活动</Button></div> -->
							<div v-for="(item, index) in formData.get_lottery_activity" :key="index" v-if="index < 5" style="margin-bottom: 5px;"><Button type="dashed">{{item.name}}</Button></div>
							<template v-if="formData.get_lottery_activity.length > 5">
								<Poptip transfer>
										<a style="margin-top:10px;">查看全部(共{{formData.get_lottery_activity.length}}个)</a>
										<div slot="title"><i>绑定的抽奖活动</i></div>
										<div slot="content" >
											<div style="max-width:500px;" class="space-wrap">
												<Button type="dashed" style="margin-bottom:10px;" class="m-right-10" v-for="(item, index) in formData.get_lottery_activity" :key="item.id">{{item.name}}</Button>
											</div>
										</div>
								</Poptip>
							</template>
					</FormItem>
				</Form>
    </div>
  </PageTopBase>
</template>
<script>
import DateSelect from '@/views/my-components/date-select/index.vue';
import PageTopBase from '@/views/my-components/page-top-base/index';
export default{
  mixins: [],
  components: {
		DateSelect,
		PageTopBase
  },
  data () {
    return {
			modalShow: false,
			formData: {
				name: "",
				start_time: "",
				end_time: "",
				limit_new_user: 0,
				share_type: 1,
				reward_loop: 0,
				enable: 1,
				rule: [],
				get_lottery_activity: []
			},
			ruleValidate: {
				name: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
				start_time: [{ required: true, message: '活动时间不能为空', trigger: 'blur' }],
				end_time: [{ required: true, message: '活动时间不能为空', trigger: 'blur' }],
				rule: [{ required: true, message: '请设置奖励条件', trigger: 'blur', type: 'array', min: 1 }],
				invite_condition: [{ required: true, trigger: 'blur', type: 'number', validator: this.validateNumberInput }],
				self_reward: [{ required: true, trigger: 'blur', type: 'number', validator: this.validateNumberInput }],
				friend_reward: [{ required: true, trigger: 'blur', type: 'number', validator: this.validateNumberInput }]
			},
			ruleId: 0,
    }
  },
	mounted(){
		this.initParams();
	},
  methods: {
		initParams(){
			let query = this.$route.query || {};
			console.log("query", query)
			this.ruleId = query.id || 0;
			this.getRuleDetail(query.id || 0);
		},
		getRuleDetail (id) {
			if(!id) return;
		  return this.$ajax.post(this.$api.MatrixSharingRulesInfo, {
				id: id
			}).then(response => {
		    const res = response.data;
		    if (res.code) {
		      let data = res.data || {};
					this.formData = {
						name: data.name || "",
						start_time: data.start_time || "",
						end_time: data.end_time || "",
						limit_new_user: parseInt(data.limit_new_user) || 0,
						share_type: parseInt(data.share_type) || 1,
						reward_loop: parseInt(data.reward_loop) || 0,
						enable: parseInt(data.enable) || 1,
						rule: data.rule || [],
						get_lottery_activity: data.get_lottery_activity || []
					}
		    }
		  });
		},
		validateNumberInput(rule, value, callback){
			if (!Number.isInteger(+value)) {
						callback(new Error('输入数字'));
			} 	 if (!(value > 0)) {
						callback(new Error('输入大于0的数字'));
			} else {
						callback();
			}
		},
		saveRule(){
			this.$refs["formData"].validate((valid)=>{
				if(valid){
					if(this.ruleId){
						this.editReq();
					} else {
						this.saveReq();
					}
				} else {
					this.$Message.error('请完善资料!');
				}
			})
		},
		saveReq(){
			console.log("formData", this.formData)
			return this.$ajax.post(this.$api.MatrixSharingRulesAdd, {
			  ...this.formData
			}).then((response) => {
					var res = response.data;
					if (res.code) {
						this.$router.go(-1);
			      this.$Message.success(res.message);
					} else {
						this.$Message.error(res.message);
					}
			});
		},
		editReq(){
			return this.$ajax.post(this.$api.MatrixSharingRulesEdit, {
				id: this.ruleId,
			  ...this.formData,
				is_rule: 1 // 1编辑过，2未编辑过
			}).then((response) => {
					var res = response.data;
					if (res.code) {
						this.$router.go(-1);
			      this.$Message.success(res.message);
					} else {
						this.$Message.error(res.message);
					}
			});
		},
    handleStart (date) {
      this.formData.start_time = date;
    },
    handleEnd (date) {
      this.formData.end_time = date;
    },
		addRule(){
			this.formData.rule.push({
				invite_condition: 0,				self_reward: 0,				friend_reward: 0
			})
		},
		removeRule(index){
			this.formData.rule.splice(index, 1);
		}
  }
}
</script>

