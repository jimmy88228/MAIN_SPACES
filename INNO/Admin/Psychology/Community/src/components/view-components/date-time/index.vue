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
	:time-picker-options="timePicker"
	:value="inputValue"
	@on-change="selectChange"
	@on-clear="clearSelect"
	:clearable="clearable"
	:disabled="disabled"
	:readonly="readonly"
	:editable="editable"
	class="date-picker"
	:class="type + '-picker'"
	></DatePicker>
</template>
<script>
	import DateH from "@/helper/date-manager.js";
	import DateUtil from "@/helper/utils/date-util.js"
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
			// options:Object,
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
			},
			readonly: {
				type: Boolean,
				default: false
			},
			editable: {
				type: Boolean,
				default: false
			},
			beforeNow: Boolean, // 限制只可选以前时间
			afterNow: Boolean, // 限制只可选以后时间
			limitDate: String, // 限制可选时间 before 2022-10-01(限制小于不可选)，after 2022-10-01(限制大于不可选)，2022-10-01（这个日期不可选）
			isEnd: Boolean,
			isSetTime: Boolean,
			setSTime: {
				type: String,
				default: '00:00:00'
			},
			setETime: {
				type: String,
				default: '23:59:59'
			},
		},
		data(){
			return {
				inputValue: '',
				timePicker: {}
			}
		},
		computed:{
			options(){
				let that = this;
				return {
					disabledDate (date) {
							let beforeNow = that.beforeNow;
							let afterNow = that.afterNow;
							let result = false;
							let todayDate = new Date().setHours(0,0,0,0);
							let _date = date.setHours(0,0,0,0);
							let _dateValue = (date && date.valueOf()) || 0
							if(beforeNow){
								if(_dateValue < Date.now() || _date == todayDate){
									result = false;
								} else {
									result = true;
								}
							}
							if(afterNow && !result){
								if(date.valueOf() > Date.now() || _date == todayDate){
									result = false;
								} else {
									result = true;
								}
							}
							if(that.limitDate && !result){
								let limitDateArr = that.limitDate.match(/\d{4}(\/|-)\d{2}(\/|-)\d{2}(| \d{2}:\d{2}(:\d{2}|))/g) || [];
								if(limitDateArr.length > 0){
									let limitDateStr = limitDateArr[0];
									let limitDate = new Date(limitDateStr).valueOf();
									if(that.limitDate.indexOf('before') != -1){
										if(date.valueOf() < limitDate && date.setHours(0,0,0,0) != new Date(limitDateStr).setHours(0,0,0,0)){
											result = true
										} else {
											result = false
										}
									} else if(that.limitDate.indexOf('after') != -1){
										if(date.valueOf() > limitDate){
											result = true
										} else {
											result = false
										}
									}
								}
							}
							return result;
					}
				}
			},
		},
		methods:{
			setTimePicker(date){
				let timePicker = {};
				if(this.beforeNow || this.afterNow){
					let currStart = date instanceof Array ? date[0] : date;
					let currEnd = date instanceof Array ? date[1] : date;
					timePicker = { disabledHours: DateH.getDisabledHour(currStart, this.beforeNow ? 'before' : 'after'), disabledMinutes: DateH.getDisabledMin(currEnd, this.beforeNow ? 'before' : 'after') }
				} else {
					timePicker = {};
				}
				this.timePicker = timePicker;
			},
			selectChange(data){
				data = this.setLimitTime(data);
				this.inputValue = data;
				this.$emit('change', data);
				this.setTimePicker(data);
				this.initInput(data);
			},
			clearSelect(){
				if(this.type.indexOf('rang') != -1){
					this.inputValue = [];
				} else {
					this.inputValue = "";
				}
				this.$emit('change', this.inputValue);
			},
			setLimitTime(data){
				if(!data) return data;
				if(this.isSetTime){
					let regexp = /\d{2}:\d{2}(:\d{2}|)/g;
					let setSTime = this.setSTime;
					let setETime = this.setETime;
					
					if(data instanceof Array){
						for(let i = 0; i < data.length; i++){
							if(data[i]){
								let hasTimer = data[i].indexOf(":");
								data[i] = hasTimer != -1 ? data[i].replace(regexp, this.isEnd ? setETime : setSTime) : (data[i] + ' ' + (this.isEnd ? setETime : setSTime));
								// 格式
								data[i] = DateUtil.formatStr(data[i], this.format)
							}
						}
					} else {
						let hasTimer = data.indexOf(":");
						data = hasTimer != -1 ? data.replace(regexp, this.isEnd ? setETime : setSTime) : (data + ' ' + (this.isEnd ? setETime : setSTime));
						// 格式
						data = DateUtil.formatStr(data, this.format)
					}
				}
				return data
			},
			initInput(data){
				let element = this.$el || {};
				let datePickerRel = element.getElementsByClassName("ivu-date-picker-rel");
				if(!datePickerRel || datePickerRel.length == 0) { return; }
				let input = datePickerRel[0].getElementsByClassName("ivu-input");
				if(input[0]) { 
					input[0].innerHTML = data;
					input[0].value = data;
				 }
			}
		},
		mounted(){},
		watch:{
			value:{
				handler(nV) {
					this.inputValue = this.setLimitTime(nV);
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