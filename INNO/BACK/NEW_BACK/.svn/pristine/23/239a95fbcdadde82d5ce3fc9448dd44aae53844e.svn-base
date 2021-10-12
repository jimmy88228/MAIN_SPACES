<template>
	<pageTopBase :isBack="false" :isSave="true" @save="saveStructure">
    <div class="structure-page">
        <div class="page-divider">RFM统计周期设定</div>
        <div class="p-15 flex f-align-center">统计周期&nbsp;<Input style="width:80px;" v-model="formData.cycle_days"/>&nbsp;天</div>
        <div class="structure-set">
            <div class="set-title p-15">RFM参数设定</div>
            <div class="set-table p-15">
							<Form ref="formData" :model="formData" :rules="validateRule">
								<div class="structure-item" v-for="(tItem, tIndex) in formData.structureList" :key="tItem.title">
									<div class="s-item-title">{{tItem.title}}</div>
									
									<Table class="s-table-title" :max-height="600" :loading="tableLoading" :columns="columns" :data="tItem.list"  :ref="'myTable' + tIndex">
											<template slot-scope="{ row, index }" slot="rfm_para_min">
												<FormItem>
													<InputNumber :readonly="true" :min="0" :value="row.rfm_para_min"></InputNumber>&nbsp;{{row.unit}}
												</FormItem>
											</template>
											<template slot-scope="{ row, index }" slot="rfm_para_max">
												<FormItem 
												:prop="'structureList.' + tIndex + '.list.' + index + '.rfm_para_max'"
												:rules="{required: true, type:'number', validator:(rule, value, callback)=>checkMixMax(rule, value, callback, (tItem.list[index + 1] && tItem.list[index + 1].rfm_para_max) || '') , trigger: 'change'}"
												
												>
												<!--checkMixMax(tItem.list[index + 1].rfm_para_max, value, callback)-->
													<InputNumber @on-change="(val)=>{changeMaxDate(val, tIndex, index)}" :min="0" :value="row.rfm_para_max"></InputNumber>&nbsp;{{row.unit}}
												</FormItem>
											</template>
											<template slot-scope="{ row, index }" slot="rfm_type_name">
												<FormItem
												:prop="'structureList.' + tIndex + '.list.' + index + '.rfm_type_name'"
												:rules="{required: true, message: '描述不能为空', trigger: 'change'}"
												>
												<Input type="text" v-model="row.rfm_type_name"></Input>
												</FormItem>
											</template>
									</Table>
								</div>
							</Form>
						</div>
        </div>
    </div>
	</pageTopBase>
</template>
<script>
import pageTopBase from "@/views/my-components/page-top-base/index.vue";
// import PageHelper from '@/libs/page-helper.js';
import mixins from "./mixins.js";
export default {
    name: "rfmStructure",
		components:{
			pageTopBase
		},
    mixins: [ mixins],
    data(){
        return {
					tableLoading: false,
					formData:{
						cycle_days: 0,
						structureList: []
					},
					validateRule: {}
        }
    },
    methods:{
				checkMixMax(rule, value, callback, nextVal){
					if(nextVal && value > nextVal){
						return callback(new Error('上限值不可以大于下层上限值'));
					} else {
						if (!value) {
							return callback(new Error('请输入关键值'));
						} else {
							return callback();
						}
					}
				},
        changeMaxDate(val, tIndex, index){
					let structureList = this.formData.structureList;
					this.$set(this.formData.structureList[tIndex].list[index], "rfm_para_max", val);
					if(typeof(structureList[tIndex].list[index + 1]) != "undefined" && val){
						this.$set(this.formData.structureList[tIndex].list[index + 1], "rfm_para_min", val);
					}
				},
				getData(){
					this.$store.commit("setLoading", true);
					this.$ajax.post(this.$api.RfmStructureList,{}).then((response)=>{
						console.log("response", response);
						let res = response.data || {};
						if(res.code){
							let data = res.data || {};
							let list = data.list || {};
							this.formData = {
								cycle_days: (data.cycle_day && data.cycle_day[0].cycle_days) || 0,
								structureList: this.setIntData(list)
							}
						}
					}).finally(()=>{
						this.$store.commit("setLoading", false);
					})
				},
				setIntData(data){
					for(let i in data){
						let list = data[i].list || [];
						for(let j = 0; j < list.length; j++){
							list[j].rfm_para_max = parseInt(list[j].rfm_para_max);
							list[j].rfm_para_min = parseInt(list[j].rfm_para_min);
						}
					}
					return data;
				},
				saveStructure(){
					console.log("this.$refs", this.$refs);
					this.$refs.formData.validate((valid)=>{
						if(valid){
							let formData = this.formData || {};
							this.$ajax.post(this.$api.RfmStructureSave,{
								cycle_day: formData.cycle_days || 0,
								params: formData.structureList || {}
							}).then((response)=>{
								console.log("response", response);
								let res = response.data || {};
								if(res.code){
									let data = res.data || {};
									this.$Message.success(res.message);
								} else {
									this.$Message.warning(res.message);
								}
							}).finally(()=>{
								this.$store.commit("setLoading", false);
							})
						} else {
							this.$Message.warning("请输入正确信息");
						}
					})
				}
    },
		mounted(){
			this.getData();
		}
}
</script>
<style lang="less">
.structure-page{
    .structure-set{
        border:1px solid #efefef;
        .set-title{
            border-bottom:1px solid #efefef;
        }
        .set-table{
					.structure-item{
						border:1px solid #efefef;
						border-bottom: 0 none;
						margin-bottom: 20px;
						.s-item-title{
							height: 40px;
							line-height:40px;
							padding:0px 10px;
						}
						.ivu-form-item{
							margin:20px 0px;
						}
					}
        }
    }
}
</style>