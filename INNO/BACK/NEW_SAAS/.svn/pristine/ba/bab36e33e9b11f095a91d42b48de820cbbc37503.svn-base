<template>
    <div class="search-form">
        <Form inline :label-width="80">
            <div class="flex f-just-between">
                <div>
                    <FormItem label="选择日期">
                        <div class="flex f-align-center">
                        <date-select ref="dateSelect" class="space-nowrap" dateType="report" defaultTime="yesterday" @sT="handleStart" @eT="handleEnd" @extra="search" extra/>
                        &nbsp;&nbsp;<Button type="primary" @click="search" icon="ios-search">搜索</Button>&nbsp;&nbsp;
                        <a class="space-nowrap" @click="isShowExtra = !isShowExtra">{{ isShowExtra ? "普通搜索" :"高级搜索" }}</a>
                        </div>
                    </FormItem>
                </div>
            </div>
            <transition name="fade">
                <div v-show="isShowExtra">
                    <Row>
                        <Col span="7">
                            <FormItem label="查询类型">
                                <RadioGroup v-model="formSearch.returnType" type="button" btn-type="primary" @on-change="search">
																	<div class="flex">
																		<Radio v-for="(item, index) in filterType" :key="index" :label="item.id" border>{{ item.name }}</Radio>
																	</div>
																</RadioGroup>
                            </FormItem>
                        </Col>
                        <!-- <Col span="7">
                            <FormItem label="订单来源">
                                <Select v-model="formSearch.platform_src" class="basic-width" >
                                    <Option v-for="(item, index) in orderSources" :key="index" :value="item">{{ item }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="7">
                            <FormItem label="订单类型">
                                <Select v-model="formSearch.order_type" class="basic-width">
                                    <Option v-for="(item, index) in orderTypes" :key="index" :value="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col> -->
                        <Col span="7">
                            <FormItem label="渠道类型">
                                <Cascader :data="agentList" v-model="formSearch.agentId" class="basic-width"></Cascader>
                            </FormItem>
                        </Col>
                        <Col span="7">
                            <FormItem label="选择店铺">
                                <store-select class="basic-width" :data="storeData" type="checkbox" @del-tag="delTag">
                                    <Button type="dashed" @click="handleStoreSelected" class="basic-width">选择筛选店铺</Button>
                                </store-select>
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </transition>
        </Form>
    </div>
</template>
<script>
import util from '@/libs/util.js';
import DateSelect from '@/views/my-components/date-select/index.vue';
import StoreSelect from '@/views/my-components/list-component/index-edit';
export default {
    name: "searchForm",
    components: {
        DateSelect,
        StoreSelect
    },
    props:["formSearch"],
    data(){
        return {
            isShowExtra: false,
            // orderSources:[],
            filterType:[
							{id: "HH", name: "按时"}, {id: "dd", name: "按日"}, {id: "MM", name: "按月"}
						],
            agentList:[],
            storeData:[],
        }
    },
    mounted(){
        this.initParams();
        // this.getOrderSource();
        this.getAgentList();
    },
    methods:{
        initParams(){
        },
     //    getOrderSource(){
					// return util.ajax.post(util.apiUrl.salesStatsInfo).then(e =>{
					// 	let res = e.data || {};
					// 	if(res.code) {
					// 		let platform_src = res.data && res.data.platform_src || [];
					// 		this.orderSources = ["all"].concat(platform_src);
					// 		return Promise.resolve()
					// 	}
					// 	return Promise.reject()
					// }).catch(e=>{
					// 	this.$Message.warning("请求出错");
					// })
     //    },
        getAgentList(){
				return util.ajax.post(util.apiUrl.getAgent,{
					brand_id: 0
				}).then(e =>{
					let res = e.data || {};
					if(res.code) {
						this.agentList = (res.data && res.data.items) || [];
						return Promise.resolve()
					}
					return Promise.reject()
				}).catch(e=>{
					this.$Message.warning("请求出错");
				})
			},
			delTag(data){
				this.installIds(data);
			},
			handleStoreSelected (selected) {
				let agentId = this.formSearch.agentId.slice(-1) || [];
				this.$selectContent({
					mode: 'store',
					type: 'checkbox',
					extraAddtion: { agent_id: (agentId[0] || 0), brand_id: 0 },
					data: this.storeData,
					getList: (data) => {
						this.installIds(data);
					}
				});
			},
			handleStart (date) {
					this.formSearch.start_time = date;
			},
			handleEnd (date) {
					this.formSearch.end_time = date;
			},
			handleExport(){
					this.$emit("on-handleExport", this.formSearch);
			},
			search(){
					this.$emit("on-search", this.formSearch);
			},
			installIds(data){
				let ids = "";
				for(let i = 0; i < data.length; i++){
					let id = data[i].id;
					ids = ids ? (ids + "," + id) : id;
				}
				this.storeData = data;
				this.formSearch.storeIds = ids;
			}
		}
}
</script>
<style  lang="less">
    .search-form{
        .basic-width{
            width: 180px;
        }
    }
</style>
