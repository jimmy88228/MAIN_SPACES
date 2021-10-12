<template>
	<Modal v-model="isShowModal">
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
			<FormItem label="活动名称" prop="active_name">
				<Input v-model="formItem.active_name"  placeholder="活动名称" clearable style="width: 300px"></Input>
			</FormItem>
			<FormItem label="执行时间" prop="execution_date">
				<DatePicker v-model="formItem.execution_date" format="yyyy-MM-dd HH:mm" :options="dateOption" type="datetime" placeholder="执行时间" style="width: 300px"></DatePicker>
				<!-- <DatePicker type="formItem.execution_date" :options="options3" placeholder="Select date" style="width: 200px"></DatePicker> -->
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
	</Modal>
</template>
<script>
	export default{
		data(){
			isShowModal: false,
			formItem: {
				id:0,
				is_enabled:'0',
				active_name:'',
				execution_date:''
			},
			ruleValidate:{
				active_name: [ { required: true, message: '活动名称不能为空！', trigger: 'blur' } ],
			},
		},
		methods:{
			showModal(){
				this.isShowModal = true;
			}
		}
	}
</script>
<style lang="less">
	
</style>