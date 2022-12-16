<template>
	<DatePicker 
	:type="type" 
	:multiple="multiple"
	:format="format"
	:placement="placement"
	:placeholder="placeholder"
	:options="options"
	:size="size"
	:split-panels="splitPanels"
	:show-week-number="showWeekNumbers"
	:value="value"
	@on-change="selectChange"
	:clearable="clearable"
	:disabled="disabled"
	class="date-picker"
	:class="type + '-picker'"
	></DatePicker>
</template>
<script>
	import DateUtil from "@/helper/utils/date-util.js";
	export default{
		name: 'dateTime',
		model: {
			prop: 'value',
			event: 'change'
		},
		props: {
			type: {
				type: String,
				default: "date"
			},
			value: Date | Array,
			format: {
				type: String,
				default: "yyyy-MM-dd HH:mm"
			},
			placement: String,
			transfer: Boolean,
			multiple: Boolean,
			options:Object,
			size: String,
			"split-panels": Boolean,
			"show-week-numbers": Boolean,


			isFullW:{
				type: Boolean,
				default: false
			},
			clearable: {
				type: Boolean,
				default: true
			},
			disabled: {
				type: Boolean,
				default: false
			},
			placeholder: {
				type: String,
				default: ""
			}
		},
		data(){
			return {
				selectValue: 0
			}
		},
		methods:{
			selectChange(data){
				console.log("data",data);
				let _data = [];
				if(data instanceof Array){
					for(let i = 0; i < data.length; i++){
						if(data[i]){
							_data.push(DateUtil.formatStr(data[i], this.format));
						}
					}
				} else {
					_data = data ? DateUtil.formatStr(data, this.format) : ''
				}
				this.$emit('change', _data);
			}
		},
		mounted(){},
		watch:{
			value:{
				handler(nV) {
					
				},
				immediate: true
			},
		}
	}
</script>
<style lang="less" scoped>
	.date-picker{
		width:100%;
		min-width: 180px;
	}
	.datetimerange-picker{
		width:100%;
		min-width: 320px;
	}
	.daterange-picker{
		width:100%;
		min-width: 180px;
	}
</style>