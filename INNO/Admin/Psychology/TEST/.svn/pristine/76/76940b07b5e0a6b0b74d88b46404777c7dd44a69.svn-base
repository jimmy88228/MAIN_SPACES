<template>
    <Tabs :value="curTab" @on-click="changeTab" class="report-list-index" :class="'list-len-'+listTabs.length">
        <TabPane :label="item.model_name" :name="item.name" v-for="(item,index) in listTabs" :key="index">
            <div v-show="curIndex == index" :class="listTabs.length>1?'mt-style':''">
                <reportList :ref="item.name"></reportList>
            </div>
        </TabPane>
    </Tabs>
</template>

<script>
import reportList from "./list.vue"
export default {
    components: {
        reportList,
    },
    data() {
        return {
            // reportItems: [],
            // reportAnalyseList: [],
            // userInfo: {},
            // modelInfo: {},
            // modelTime: "",
            // req: {
            //     default: "appraisalScheduleReport",
            //     task: "assessmentTaskReport",
            //     psychic: "psychologyReport",
            //     earlyWarn: "psychologyReport"
            // },
            // ruleTypeKey: {
            //     dimension: "分", // 维度统计
            //     total: "分", // 总分统计
            //     average: "分", // 总均分
            //     whole_positive: "项", // 整体阳性项目数
            //     whole_negative: "项", // 整体阴性项目数
            //     whole_positive_average: "分", // 整体阳性症状均分
            // },
            // inited:false, 
            listTabs:[],
            curTab:"",
            curIndex:0
        };
    },
    methods: {
        getList(){
            let recordId = this.pageQuery.recordId || "";
            let modelId = this.pageQuery.modelId || 0;
             return this.$MainApi.getAssignModelList({
                    data: { 
                        record_id: recordId + "", 
                    },
                    other: {
                        isErrorMsg: true
                    }
                })
                .then((res) => {
                    let items = res.data && res.data.items||[];
                    items.forEach((item,index)=>{
                        item.name = 'tab'+item.model_id+'_'+item.record_id;
                    })
                    this.listTabs = items;
                    this.$nextTick(()=>{
                        let tabName = ''
                        if(recordId && Number(modelId)){
                            tabName = 'tab' + modelId + '_' + recordId;
                        } else {
                            tabName = items[0].name;
                        }
                        this.changeTab(tabName);
                    })
                })
        },
        changeTab(name){
            this.curTab = name;
            let curIndex = 0;
            let item = this.listTabs.find((item,index)=>{
                curIndex = index
                return item.name == name;
            });
            this.curIndex = curIndex;
            this.$refs[this.curTab] && this.$refs[this.curTab][0].loadData({modelId:item.model_id,recordId:item.record_id});
        }
    }, 
    mounted() {
        this.getList();
    },
};
</script>
 

<style lang="less">
.report-list-index{
    &.list-len-1{
        .ivu-tabs-bar{
            display: none;
        }
    }
}
</style>
<style lang="less" scoped>
.report-list-index{
    .mt-style{
        margin-top: 40px;
    }    
}
</style>