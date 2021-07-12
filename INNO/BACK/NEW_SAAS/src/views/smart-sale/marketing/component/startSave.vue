<template>
    <Modal v-model="showModal" width="600">
        <p slot="header">
            <div class="flex f-align-center m-bottom-10 ">
                <div class="space-nowrap fw-bold fs-18">节点设置-开始&nbsp;&nbsp;</div>
                <Input style="width:250px"/>
            </div>
        </p>
        <Form inline label-position="right">
            <template v-if="createType == 'multi'">
                <FormItem label="周期范围">
                    <div class="p-left-15">
                        <RadioGroup v-model="setting.cycle_range">
                            <Radio :label="1">
                                <span>长期执行 *系统将长期执行，只能手动停止</span>
                            </Radio>
                            <Radio :label="2">
                                <span>指定时间段</span> 
                                <div class="p-left-15"><dateSelect ref="dateSelect" :customDate="[setting.start_time, setting.end_time]" class="inline-b space-nowrap" @sT="handleStart" @eT="handleEnd" /></div>
                            </Radio>
                        </RadioGroup>
                    </div>
                </FormItem>
                <FormItem label="周期时间">
                    <div class="p-left-15">
                        <RadioGroup v-model="setting.range_type">
                            <Radio :label="1">
                                <span>每天:</span>
                            </Radio>
                            <Radio :label="2">
                                <span>每周:</span>
                                <div class="p-left-20">
                                    <CheckboxGroup v-model="rangTimeVal">
                                        <Checkbox label="1">
                                            <span>星期一</span>
                                        </Checkbox>
                                        <Checkbox label="2">
                                            <span>星期二</span>
                                        </Checkbox>
                                        <Checkbox label="3">
                                            <span>星期三</span>
                                        </Checkbox>
                                        <Checkbox label="4">
                                            <span>星期四</span>
                                        </Checkbox>
                                        <Checkbox label="5">
                                            <span>星期五</span>
                                        </Checkbox>
                                        <Checkbox label="6">
                                            <span>星期六</span>
                                        </Checkbox>
										<Checkbox label="7">
										    <span>星期日</span>
										</Checkbox>
                                    </CheckboxGroup>
									<TimePicker type="time" placeholder="选择时间点" style="width: 168px" v-model="setting.time"></TimePicker>&nbsp;执行
                                </div>
                            </Radio>
							<Radio :label="3">
							    <span>每月:</span>
							    <div class="p-left-20 flex">
							        第&nbsp;<Input placeholder="输入指定的日" style="width: 168px"/>&nbsp;天&nbsp;
									<TimePicker type="time" placeholder="选择时间点" style="width: 168px"></TimePicker>&nbsp;执行
							    </div>
							</Radio>
                        </RadioGroup>
                    </div>
                </FormItem>
            </template>
            <template v-else>
                <div class="p-left-15 p-top-20">
                    <RadioGroup v-model="setting.single_time">
                        <div class="m-bottom-15">
                            <Radio label="on">
                                <span>发布后立即运行</span>
                            </Radio>
                        </div>
                        <div class="m-bottom-15">
                            <Radio label="false">
                                <span>发布后至指定时间运行</span>
								<DatePicker type="datetime" v-model="setting.single_date" placeholder="请选择开始运行时间" style="width: 200px"></DatePicker>
                            </Radio>
                        </div>
                    </RadioGroup>
                </div>
            </template>
        </Form>
		<div slot="footer">
			<Button type="default" @click="showModal = false">取消</Button>
			<Button type="primary" @click="saveSetting">确定</Button>
		</div>
    </Modal>
</template>
<script>
    import dateSelect from "@/views/my-components/date-select/index";
    export default {
        name: "startSave",
        props:["createType"],
        components: {
            dateSelect
        },
        data(){
            return {
                formSearch: {
                    searchq: "",
                },
                showModal: false,
                setting: {
					single_time: "on",
					cycle_range: 0,
					range_type: 0
				}
            }
        },
		computed:{
			rangTimeVal:{
				get(){
					let setting = this.setting;
					let vals = (setting.range_val && setting.range_val.split(",")) || []
					console.log("vals", vals)
					return vals;
				},
				set(val){
					this.setting.range_val = val.join(",")
				}
			}
		},
        methods:{
            show(config, setting){
              this.showModal = true;
			  setting.single_time = setting.single_time + "";
			  this.config = config;
              this.setting = setting || {}
            },
            handleStart(date){
				this.setting.start_time = date;
            },
            handleEnd(date){
				this.setting.end_time = date;
            },
			checkSave(setting){
				let createType = this.createType || "";
				let warn = ""
				if(createType == "mulit"){
					if(setting.cycle_range == 2 && (!setting.start_time || !setting.end_time)){
						warn = "请完善周期范围指定时间段";
					} else if(!warn && (setting.range_type == 1 && !setting.time)){
						warn = "请完善周期时间指定每天时间段";
					}else if(!warn && (setting.range_type == 2 && (!setting.range_val || !setting.time))){
						warn = "请完善周期时间指定每周时间点";
					} else if(!warn && (setting.range_type == 3 && (!setting.range_val || !setting.time))){
						warn = "请完善周期时间指定每月时间点";
					}
				} else {
					if(setting.single_time == false && !setting.single_date) {
						warn = "请完善发布后的指定运行时间";
					}
				}
				if(warn){
					this.$Message.error("warn")
					return false;
				}
				return true
			},
			saveSetting(){
				let setting = this.setting || {};
				if(this.checkSave(setting)){
					this.showModal = false;
					this.$emit("saveMsg", {setting: this.setting, level: this.config.level})
				}
			}
        }
    }
</script>