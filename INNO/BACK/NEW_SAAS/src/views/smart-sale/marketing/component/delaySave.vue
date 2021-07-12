<template>
    <Modal v-model="showModal">
        <p slot="header">
            <div class="flex f-align-center m-bottom-10 ">
                <div class="space-nowrap fw-bold fs-18">节点设置-延时&nbsp;&nbsp;</div>
                <Input style="width:250px" />
            </div>
        </p>
        <Form inline label-position="right">
            <div class="p-left-15 p-top-20">
                <RadioGroup v-model="setting.delayType">
                    <div class="m-bottom-15">
                        <Radio label="hours">
							<template v-if="setting.delayType == 'hours'">
								<Input style="width:120px" number v-model="setting.hours"/>&nbsp;小时
							</template>
							<template v-else>
								<Input style="width:120px" number />&nbsp;小时
							</template>
						</Radio>
                    </div>
                    <div class="m-bottom-15">
                        <Radio label="days">
							<template v-if="setting.delayType == 'days'">
								<Input style="width:120px" number v-model="setting.days"/>&nbsp;天
							</template>
							<template v-else>
								<Input style="width:120px" number />&nbsp;天
							</template>
                        </Radio>
                    </div>
                </RadioGroup>
            </div>
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
					delayType: ""
				}
            }
        },
        methods:{
            show(config, setting){
              this.showModal = true;
			  this.settingHandle(setting);
			  this.config = config || {}
            },
			settingHandle(setting){
				setting.delayType = setting.days ? "days" : "hours";
				this.setting = setting;
			},
			saveSetting(){
				this.showModal = false;
				this.$emit("saveMsg", {setting: this.setting, level: this.config.level})
			}
        }
    }
</script>