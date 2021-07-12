<template>
    <Card class="structure-page">
        <Divider class="i-flex" orientation="left">RFM统计周期设定</Divider>
        <div class="p-15 flex f-align-center">统计周期&nbsp;<Input style="width:80px;" />&nbsp;天</div>
        <div class="structure-set">
            <div class="set-title p-15">RFM参数设定</div>
            <div class="set-table p-15">
                <Table :max-height="600" :loading="tableLoading" :columns="columns" height="600" :data="tableData"  ref="myTable1">
                    
                </Table>
            </div>
        </div>
        <Spin :fix="true"></Spin>
    </Card>
</template>
<script>
import PageHelper from '@/libs/page-helper.js';
import mixins from "./mixins.js";
export default {
    name: "rfmStructure",
    mixins: [ PageHelper, mixins],
    data(){
        return {

        }
    },
    methods:{
        onLoadData(page, data){
			this.showSpin = true;

			// return util.ajax.post(util.apiUrl.salesDetailView, {
			// 	...data,
			// 	...formSearch,
			// 	agen_id: formSearch.agen_id.slice(-1)[0],
			// 	brand_id: this.brandId || 0,
			// }).then(e =>{
			// 	let res = e.data || {};
			// 	if(res.code) {
			// 		let data = res.data || {};
			// 		this.data = {
			// 			items: data.items,
			// 			total: data.totalCount
			// 		}
			// 	}
			// }).finally(()=>{
			// 	this.showSpin = false
			// })
		}
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

        }
    }
}
</style>