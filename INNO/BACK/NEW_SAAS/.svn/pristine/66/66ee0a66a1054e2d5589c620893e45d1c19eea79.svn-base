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
                                <RadioGroup v-model="formSearch.choose_type" type="button" btn-type="primary" @on-change="search">
                                    <Radio v-for="(item, index) in filterType" :key="index" :label="item.id" border>{{ item.name }}</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span="7">
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
                        </Col>
                    </Row>
                    <Row>
                        <Col span="7">
                            <FormItem label="渠道类型">
                                <Cascader :data="agentList" v-model="formSearch.agent_id" class="basic-width"></Cascader>
                            </FormItem>
                        </Col>
                        <Col span="7">
                            <FormItem label="选择店铺">
                                <store-select class="basic-width" :data="storeData" type="radio">
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
            orderSources:[],
            filterType:[
				{id: "hh", name: "按时"}, {id: "dd", name: "按日"}, {id: "mm", name: "按月"}
			],
            orderTypes:[
				{id: 0, name: "全部"}, {id: 1, name: "普通订单"}, {id: 2, name: "积分抵扣订单"}, {id: 3, name: "现金券抵扣订单"}, {id: 4, name: "优惠券抵扣订单"}
            ],
            agentList:[],
            storeData:[],
        }
    },
    mounted(){
        this.initParams();
        this.getOrderSource();
        this.getAgentList();
    },
    methods:{
        initParams(){
            let query = this.$route.query || {};
			this.brandId = query.brandId;
        },
        getOrderSource(){
			return util.ajax.post(util.apiUrl.salesStatsInfo,{
				brand_id: this.brandId || 0
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let platform_src = res.data && res.data.platform_src || [];
					this.orderSources = ["all"].concat(platform_src);
					return Promise.resolve()
				}
				return Promise.reject()
			}).catch(e=>{
				this.$Message.warning("请求出错");
			})
        },
        getAgentList(){
			return util.ajax.post(util.apiUrl.getAgent,{
				brand_id: this.brandId || 0
			}).then(e =>{
				let res = e.data || {};
				if(res.code) {
					this.agentList = res.data && res.data.items || [];
					return Promise.resolve()
				}
				return Promise.reject()
			}).catch(e=>{
				this.$Message.warning("请求出错");
			})
		},
        handleStoreSelected (selected) {
			let agent_id = this.formSearch.agent_id.slice(-1) || [];
			this.$selectContent({
				mode: 'store',
				type: 'radio',
				extraAddtion: { agent_id: (agent_id[0] || 0), brand_id: ( this.brandId || 0 ) },
				data: this.storeData,
				getList: (data) => {
					this.storeData = data;
					this.formSearch.storeId = data[0].id;
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
