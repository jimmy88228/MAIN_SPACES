<template>
    <div class="psychic-files">
        <msgSummary></msgSummary>
        <div class="activity-record">
            <Tabs value="actRecord" :animated="false">
                <TabPane label="活动记录" name="actRecord">
                    <actTable :type="pageQuery.type" :userId="userId"></actTable>
                </TabPane>
                <TabPane label="心理轨迹" name="psychicTravel">
                    <psychicTable :userId="userId"></psychicTable>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>

<script>
import actTable from "./act-table/index";
import psychicTable from "./psychic-table/index";
import msgSummary from "./cps/msg-summary.vue"
export default {
    components: {  actTable, psychicTable,msgSummary },
    data() {
        return { 
            userId: 0, 
        };
    }, 
    methods: {
        init() {
            this.userId = Number(this.pageQuery.userId) || 0;
        },
    },
    mounted() {
        this.init(); 
    },
};
</script>

<style lang="less" scoped>
.psychic-files {
    padding-right: 10px;
    .activity-record {
        padding: 20px;
        margin-right: 10px;
        border-radius: 5px;
        background-color: #fff;
    }
}
</style>