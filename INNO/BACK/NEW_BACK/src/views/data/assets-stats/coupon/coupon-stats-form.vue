<template>
    <div class="search-form">
        <Form inline :label-width="80">
            <div class="flex f-just-between">
								<FormItem label="创建日期">
										<div class="flex f-align-center">
										<date-select ref="dateSelect1" class="space-nowrap" dateType="report" defaultTime="week" @sT="date=>handleDate('start_time', date)" @eT="date=>handleDate('end_time', date)" @extra="search" extra/>
										&nbsp;&nbsp;
										<Input
											class=""
											style="width:230px"
											v-model="formSearch.searchq"
											placeholder="优惠券名称,编码"
											clearable
											search
											enter-button
											@on-search="search()"
											@on-clear="search()"
											@keydown.native.enter.prevent="search()"></Input>
										</div>
								</FormItem>
            </div>
						<FormItem label="统计日期">
						    <div class="flex f-align-center">
						    <date-select ref="dateSelect2" class="space-nowrap" dateType="report" defaultTime="" @sT="date=>handleDate('report_start_time', date)" @eT="date=>handleDate('report_end_time', date)"/>
						    </div>
						</FormItem>
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
        return {}
    },
    mounted(){
        this.initParams();
    },
    methods:{
        initParams(){
          let query = this.$route.query || {};
					this.brandId = query.brandId;
        },
				handleDate(key, date){
					if(key){
						this.formSearch[key] = date;
					}
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
