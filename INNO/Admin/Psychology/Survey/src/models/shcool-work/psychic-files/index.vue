<template>
    <div class="psychic-files">
        <div class="text-r p-10 download-file"><Button type="primary" @click="exportFile" :loading="downloadIng" icon="md-cloud-download">下载档案</Button></div>
        <msgSummary ref="msgSummaryRef" @studentDataCallback="loadDataCallback" ></msgSummary>
        <div class="activity-record">
            <Tabs value="actRecord" :animated="false">
                <TabPane label="活动记录" name="actRecord">
                    <actTable ref="actTableRef" :type="pageQuery.type" :userId="userId" ></actTable>
                </TabPane>
                <TabPane label="心理轨迹" name="psychicTravel">
                    <psychicTable ref="psychicTableRef" :userId="userId" ></psychicTable>
                </TabPane>
            </Tabs>
        </div>
        <downloadTemplate ref="downloadTemplateRef" :downloadData="downloadData"></downloadTemplate>
        <!--导出-->
        <mpNotice :ref="'notice' + item" v-for="item in jobIdCol" :key="item"></mpNotice>
    </div>
</template>

<script>
// import answer from "@/models/survey/activity/assess/answer/index";
import actTable from "./act-table/index";
import psychicTable from "./psychic-table/index";
import msgSummary from "./cps/msg-summary.vue";
import downloadTemplate from "./download/psychic-file-template.vue";
import mpNotice from "@/components/main-components/mq-notice/mq-notice";
export default {
    components: { actTable, psychicTable ,msgSummary, downloadTemplate, mpNotice},
    data() {
        return {
            userId: 0,
            downloadData: {},
            downloadIng: false,
            jobIdCol: [],
        };
    }, 
    methods: {
        init() {
            this.userId = Number(this.pageQuery.userId) || 0;
        },
        downloadFile(){
            if(this.downloadIng) return;
            this.downloadIng = true;
            let allProm = [];
            if(this.$refs["msgSummaryRef"]){
                allProm.push(this.$refs["msgSummaryRef"].getAllMeddleRecord())
            }
            if(this.$refs["actTableRef"]){
                allProm.push(this.$refs["actTableRef"].getAllData())
            }
            if(this.$refs["psychicTableRef"]){
                allProm.push(this.$refs["psychicTableRef"].getAllData())
            }
            Promise.all(allProm).then((result)=>{
                // 整理数据
                result.map((item)=>{
                    for(let i in item){
                        this.downloadData[i] = item[i];
                    }
                })
                this.$refs["downloadTemplateRef"] && this.$refs["downloadTemplateRef"].tableToExcel(()=>{
                    this.downloadIng = false;
                });
                setTimeout(()=>{
                    this.downloadIng = false;
                }, 2000)
            }).catch((error)=>{
                let msg = error.message || '数据请求错误';
                this.$Message.warning(msg);
                this.downloadIng = false;
            })
        },
        loadDataCallback(detail){
            for(let i in detail){
                this.downloadData[i] = detail[i];
            } 
        },
        exportFile(){
            this.downloadIng = true;
            return this.$MainApi.psychologyFilesExport({
                data: {
                    user_id: Number(this.pageQuery.userId) || 0
                },
                other: {
                    isErrorMsg: true
                }
            }).then(res=>{
                let data = res.data;
                if (data) {
                    this.jobIdCol.push(data);
                    this.$nextTick(() => {
                        this.$refs[`notice${data}`][0].showNotice(data);
                    });
                }
            }).finally(()=>{
                this.downloadIng = false;
            })
        }
    },
    mounted() {
        this.init(); 
    },
};
</script>

<style lang="less" scoped>
.psychic-files {
    padding-right: 10px;
    .download-file{
        position: absolute;
        top: 0px;
        right: 10px;
        transform: translateY(-100%);
    }
    .activity-record {
        padding: 20px;
        margin-right: 10px;
        border-radius: 5px;
        background-color: #fff;
    }
}
</style>