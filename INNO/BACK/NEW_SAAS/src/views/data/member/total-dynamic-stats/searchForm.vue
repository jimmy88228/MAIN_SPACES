<template>
    <div class="search-form">
        <Form inline :label-width="80">
            <div class="flex f-just-between">
                <div>
                    <FormItem label="选择日期">
                        <div class="flex f-align-center">
                        <date-select ref="dateSelect" class="space-nowrap" dateType="report" defaultTime="yesterday" @sT="handleStart" @eT="handleEnd" @extra="search" extra/>
                        &nbsp;&nbsp;<Button type="primary" @click="search" icon="ios-search">搜索</Button>&nbsp;&nbsp;
                        <!-- <a class="space-nowrap" @click="isShowExtra = !isShowExtra">{{ isShowExtra ? "普通搜索" :"高级搜索" }}</a> -->
                        </div>
                    </FormItem>
                </div>
            </div>
            <transition name="fade">
                <!-- <div v-show="isShowExtra"> -->
									<Row>
											<Col span="7">
													<FormItem label="渠道类型">
															<Cascader :data="agentList" v-model="formSearch.agentId" class="basic-width"></Cascader>
													</FormItem>
											</Col>
											<Col span="17">
													<FormItem label="选择店铺">
															<store-select :data="storeData" type="checkbox" @del-tag="delStore">
																	<Button type="dashed" @click="handleStoreSelected" class="basic-width">选择筛选店铺</Button>
															</store-select>
													</FormItem>
											</Col>
									</Row>
                <!-- </div> -->
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
            agentList:[],
            storeData:[],
        }
    },
    mounted(){
        this.initParams();
        this.getAgentList();
    },
    methods:{
			initParams(){
					let query = this.$route.query || {};
					this.brandId = query.brandId;
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
			delStore(data){
				this.installStore(data);
			},
			installStore(data){
				let ids = "";
				for(let i = 0; i < data.length; i++){
					let id = data[i].id;
					ids = ids ? (ids + "," + id) : id;
				}
				this.storeData = data;
				this.formSearch.storeId = ids;
			},
			handleStoreSelected (selected) {
				let agentId = this.formSearch.agentId.slice(-1) || [];
				this.$selectContent({
					mode: 'store',
					type: 'radio',
					extraAddtion: { agent_id: (agentId[0] || 0), brand_id: ( this.brandId || 0 ) },
					data: this.storeData,
					getList: (data) => {
						this.installStore(data);
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
