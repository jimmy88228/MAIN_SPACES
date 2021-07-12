<template>
    <div class="search-form">
        <Form inline :label-width="80">
            <div class="flex f-just-between">
                <div>
                    <FormItem label="选择日期">
                        <div class="flex f-align-center">
                        <date-select ref="dateSelect" class="space-nowrap" dateType="report" defaultTime="month" @sT="handleStart" @eT="handleEnd" @extra="search" extra/>
                        &nbsp;&nbsp;
                        <Input
                        class=""
                        style="width:250px"
                        v-model="formSearch.searchq"
                        placeholder="请输入商品名"
                        clearable
                        search
                        enter-button
                        @on-search="search"
                        @on-clear="search"
                        @keydown.native.enter.prevent="search">
                        </Input>
                        <!-- <Button type="primary" @click="search" icon="ios-search">搜索</Button> -->
                        &nbsp;&nbsp;<a class="space-nowrap" @click="isShowExtra = !isShowExtra">{{ isShowExtra ? "普通搜索" :"高级搜索" }}</a>
                        </div>
                    </FormItem>
                </div>
            </div>
            <transition name="fade">
                <div v-show="isShowExtra">
                    <Row>
                        <Col span="5">
                            <FormItem label="查询类型" >
                                <RadioGroup class="flex" v-model="formSearch.choose_type" type="button" btn-type="primary" @on-change="search">
                                    <Radio v-for="(item, index) in filterType" :key="index" :label="item.id" border>{{ item.name }}</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span="5">
                            <FormItem label="订单来源">
                                <Select v-model="formSearch.platform_src" class="basic-width" >
                                    <Option v-for="(item, index) in orderSources" :key="index" :value="item">{{ item }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="5">
                            <FormItem label="商品品牌">
															<store-select type="radio" :data="brandInfo">
																	<div slot="content">
																		<Tag
																		  color="primary"
																		  type="dot"
																		  closable
																			@on-close="delBrand(item.id)"
																		  size="large"
																		  class="flex_tag"
																		  v-for="item in brandInfo"
																		  v-if="item.goods_brand_id > 0"
																		  :key="item.goods_brand_id">
																		  {{item.goods_brand_name}}
																		</Tag>
																	</div>
															    <Button style="border-style:dashed;" @click="handleBrandSelect" class="basic-width">选择商品品牌</Button>
															</store-select>
                            </FormItem>
                        </Col>
                        <Col span="3">
                            <FormItem label="显示数量">
                                <Select v-model="formSearch.top_num" class="basic-width" style="width:100px;">
                                    <Option v-for="(item, index) in countSelect" :key="index" :value="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="5">
                            <FormItem label="渠道类型">
                                <Cascader :data="agentList" v-model="formSearch.agent_id" class="basic-width"></Cascader>
                            </FormItem>
                        </Col>
                        <Col span="5">
                            <FormItem label="所属店铺">
                                <store-select class="basic-width" :data="storeData" type="radio">
                                    <Button type="dashed" @click="handleStoreSelected" class="basic-width">选择筛选店铺</Button>
                                </store-select>
                            </FormItem>
                        </Col>
                        <Col span="5">
                            <FormItem label="分类">
                                <CatComp :is-auto-load="true" @get-cat-id="id => handleCatData(id)"/>
                                <!-- <Select v-model="formSearch.cat_id" class="basic-width">
                                    <Option v-for="(item, index) in orderTypes" :key="index" :value="item.id">{{ item.name }}</Option>
                                </Select> -->
                            </FormItem>
                        </Col>
                        <Col span="5">
                            <Checkbox true-value="Y" false-value="" v-model="formSearch.is_time">时间筛选</Checkbox>
                            <Checkbox true-value="Y" false-value="" v-model="formSearch.is_scope">时间范围</Checkbox>
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
// import BrandSelect from '@/views/my-components/list-component/brand-select/index';
import CatComp from '@/views/my-components/cat-comp/index';
export default {
    name: "searchForm",
    components: {
        DateSelect,
        StoreSelect,
        // BrandSelect,
        CatComp
    },
    props:["formSearch"],
    data(){
        return {
            isShowExtra: false,
            orderSources:[],
            filterType:[
							{id: "1", name: "按款式"}, {id: "2", name: "分类"}, {id: "3", name: "按条码"}
						],
            orderTypes:[
							{id: 0, name: "全部"}, {id: 1, name: "普通订单"}, {id: 2, name: "积分抵扣订单"}, {id: 3, name: "现金券抵扣订单"}, {id: 4, name: "优惠券抵扣订单"}
            ],
            countSelect: [
                {id: "0", name: "显示全部"},
                {id: "20", name: "TOP20"}
            ],
            agentList:[],
            storeData:[],
            brandInfo: []
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
				delBrand(){
					this.brandInfo = [];
					this.formSearch.goods_brand_id = 0;
				},
        handleBrandSelect(){
           this.$selectContent({
						mode: 'goods-brand',
						type: 'radio',
						listKey: 'goods_brand_id',
						getList: (data) => {
							console.log(data);
							this.formSearch.goods_brand_id = data[0].id;
							this.brandInfo = data;
					}
			});
        },
        handleCatData(cat_id){
            this.formSearch.cat_id = cat_id;
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
        .flex{
            display:flex;
        }
    }
</style>
