<template>
    <div class="search-form">
        <Form inline :label-width="80">
            <div class="flex f-just-between">
                <div>
                    <FormItem label="选择日期">
                        <div class="flex f-align-center">
                        <date-select ref="dateSelect" class="space-nowrap" dateType="report" defaultTime="today" @sT="handleStart" @eT="handleEnd" @extra="search" extra/>
                        &nbsp;&nbsp;<Button type="primary" @click="search" icon="ios-search">搜索</Button>&nbsp;&nbsp;
                            <Button type="primary" @click="handleExport">导出</Button>
                        </div>
                    </FormItem>
                </div>
            </div>
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
    },
    methods:{
			initParams(){
					let query = this.$route.query || {};
					this.brandId = query.brandId;
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
				this.formSearch.storeIds = ids;
			},
			handleStoreSelected (selected) {
				let agentId = this.formSearch.agentId.slice(-1) || [];
				this.$selectContent({
					mode: 'store',
					type: 'checkbox',
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
