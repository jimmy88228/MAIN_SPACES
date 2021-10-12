<template>
    <div class="search-form">
        <Form>
            <div class="flex f-just-between">
                <div>
                    <FormItem label="日期">
                        <div class="flex f-align-center">
                            <date-select ref="dateSelect" :is-clear="false" :is-input="false" defaultTime="week" dateType="report" :limitTime="['today','default']" class="space-nowrap" @sT="handleStart" @eT="handleEnd" @extra="search" extra/>
                            
                        </div>
                    </FormItem>
                    <FormItem>
						客服人员：
						<Tag v-if="formSearch.workerSearchName!='' " closable @on-close="workerClose" size="large">{{formSearch.workerSearchName}}</Tag>
						<Button v-else @click="onSelectWorker">选择客服人员...</Button>
					</FormItem>
                    &nbsp;&nbsp;
                    <Button type="primary" @click="search" icon="ios-search">搜索</Button>
                </div>
                <div><Button type="primary" @click="handleExport">导出</Button></div>
            </div>
        </Form>

        <!--选择在线客服-->
		<csWorkerSelect ref="cs-worker-select" :canSelectAll="true" @on-ok="onSelectOk"></csWorkerSelect>
    </div>
</template>
<script>
import DateSelect from '@/views/my-components/date-select/index.vue';
import csWorkerSelect from '@/views/my-components/cs-worker-select/cs-worker-select';
export default {
    name: "searchForm",
    components: {
        csWorkerSelect,
        DateSelect
    },
    props:["formSearch"],
    data(){
        return {
            // formSearch:{
            //     start_time: "",
            //     end_time: "",
            // }
            formSearch:{
				searchq:'',
				searchTime:[],
				workerSearchId: '',
				workerSearchName:'',
			},
        }
    },
    methods:{
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
        // 清除选中的客服人员
		workerClose(){
			this.formSearch.workerSearchName = '';
			this.formSearch.workerSearchId = 0;

			this.$nextTick(()=>{
				this.searchPage();
			});
		},
		// 打开客服选择器
		onSelectWorker(){
			this.$refs['cs-worker-select'].openModal( [], 'radio' );
		},
		// 选管客服的组件的 回调
		onSelectOk( items ){
			if( items.length > 0 ){
				this.$set( this.formSearch, 'workerSearchId', items[0]['id'] );
				this.$set( this.formSearch, 'workerSearchName', items[0]['nick_name'] );
			}
		},
    }
}
</script>