<template>
    <hold-layout :isFull="true">
        <div class="activity-name" v-if="activityInfo.activityName">{{activityInfo.activityName}}</div>
        <searchForm class="m-b-10" :stateList="stateList" :searchForm="searchForm" @search="loadData"  @exportHandle="exportHandle"></searchForm>
        <count-info type="detail" :isRefresh="checkPage == 1" :currState="currState" :base-info="activityInfo.baseInfo"></count-info>
        <!-- flex-table -->
        <Table class="full-table showBorder " ref="myTable" :columns="columns" :data="list" border :loading="tableLoading" :span-method="setSpan">
            <template slot="member_info" slot-scope="{ row, index }">
                <div class="range-item">
                    {{row.get_record && row.get_record.member_name || '--'}}
                </div>
            </template>
            <template slot="structure" slot-scope="{ row, index }">
                <div class="range-item">
                {{row.get_record && row.get_record.structure_name || '--'}}
                </div>
            </template>
            <!-- <template slot="create_time" slot-scope="{ row, index }">
                <div class="range-item" v-for="(item,item_i) in row.range" :key="item_i">
                    {{item.create_time||""}}
                </div>
            </template>
            <template slot="model_name" slot-scope="{ row, index }">
                <div class="range-box">
                    <div class="range-item wideLineHeight" v-for="(item,item_i) in row.range" :key="item_i">
                        <div class="text-flow2" style="line-height:normal;">{{item.model_name||""}}</div>
                    </div>
                </div>
            </template>
            
            <template slot="getrank" slot-scope="{ row, index }">
                <div class="range-box">
                    <div class="range-item" v-for="(item,item_i) in row.range" :key="item_i">
                        {{item.show_level_name||""}}
                    </div>
                </div>
            </template>
            <template slot="coefficient_points" slot-scope="{ row, index }">
                <div class="range-box">
                    <div class="range-item wideLineHeight" v-for="(item,item_i) in row.range" :key="item_i">
			{{(!item.coefficient_points || item.coefficient_points == '0.00') ? "--" : item.coefficient_points}}
                    </div>
                </div>
            </template>
            <template slot="points_str" slot-scope="{ row, index }">
                <div class="range-box">
                    <div class="range-item wideLineHeight" v-for="(item,item_i) in row.range" :key="item_i">
                        {{item.points_str||"--"}}
                    </div>
                </div>
            </template>
            <template slot="state_str" slot-scope="{ row, index }">
                <div class="range-box">
                    <div style="line-height: 30px;" class="range-item" v-for="(item,item_i) in row.range" :key="item_i">
                        <div>
                            {{item.state_str}}
                        </div>
                        <div v-if="item.show_state_str">{{item.show_state_str}}</div>
                    </div>
                </div>
            </template>
            <template slot="handle" slot-scope="{ row, index }">
                <div class="range-box">
                    <div style="line-height: 30px;" class="range-item" v-for="(item,item_i) in row.range" :key="item_i">
                        <div class="operate-area">
                            <a class="operate" @click="getPsychicFile(item)" v-hasAction="'forewarning_survey_check_view_file'">查看档案</a>
                        </div>
                        <div class="operate-area">
                            <a class="operate" @click="examine(item)" v-hasAction="[item.state == 0, 'forewarning_survey_sign_grade']">审核标记</a>
                        </div>
                        <div class="operate-area">
                            <a class="operate" @click="checkAnswer(item)" v-hasAction="true">查看答案</a>
                        </div>
                    </div>
                </div>
            </template> -->
            <template slot="create_time" slot-scope="{ row, index }">
                <div class="range-item" >
                    {{row.create_time||""}}
                </div>
            </template>
            <template slot="model_name" slot-scope="{ row, index }">
                <div class="range-box">
                    <div class="range-item wideLineHeight" >
                        <div class="text-flow2" style="line-height:normal;">{{row.model_name||"--"}}</div>
                    </div>
                </div>
            </template>
            
            <template slot="getrank" slot-scope="{ row, index }">
                <div class="range-box">
                    <div class="range-item" >
                        {{row.show_level_name||""}}
                    </div>
                </div>
            </template>
            <template slot="coefficient_points" slot-scope="{ row, index }">
                <div class="range-box">
                    <div class="range-item wideLineHeight" >
                        {{(row.mainRuleCount > 0) ? (row.coefficient_points || '--') : '--'}}
                    </div>
                </div>
            </template>
            <template slot="points_str" slot-scope="{ row, index }">
                <div class="range-box">
                    <div class="range-item wideLineHeight w-nowrap" >
                        {{(row.mainRuleCount > 0) ? (row.points_str || "--") : "--"}}
                    </div>
                </div>
            </template>
            <template slot="state_str" slot-scope="{ row, index }">
                <div class="range-box">
                    <div style="line-height: 30px;" class="range-item" >
                        <div>
                            {{row.state_str}}
                        </div>
                        <div v-if="row.show_state_str">{{row.show_state_str}}</div>
                    </div>
                </div>
            </template>
            <template slot="handle" slot-scope="{ row, index }">
                <div class="range-box">
                    <div style="line-height: 30px;" class="range-item" >
                        <div class="operate-area">
                            <a class="operate" @click="getPsychicFile(row)" v-hasAction="'forewarning_survey_check_view_file'">查看档案</a>
                        </div>
                        <div class="operate-area">
                            <a class="operate" @click="examine(row)" v-hasAction="[row.state == 0, 'forewarning_survey_sign_grade']">审核标记</a>
                        </div>
                        <div class="operate-area">
                            <a class="operate" @click="checkAnswer(row)" v-hasAction="true">查看答案</a>
                        </div>
                    </div>
                </div>
            </template>
        </Table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <editExamine ref="editExamineRef" @confirm="handleUpdate"></editExamine>
        <mpNotice :ref="'notice' + item" v-for="item in jobIdCol" :key="item"></mpNotice>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form.vue";
import mixins from "./mixins";
import editExamine from "./edit-examine/index.vue";
import mpNotice from "@/components/main-components/mq-notice/mq-notice";
import CountInfo from "../count-info.vue";
export default {
    name: "studentIndex",
    mixins: [ListMixin, mixins],
    components: { searchForm, editExamine,mpNotice,CountInfo },
    data() {
        return {
            jobIdCol:[],
	        stateList: [
                {
                    id: -1,
                    name: "全部",
                },
                {
                    id: 0,
                    name: "未审核",
                },
                {
                    id: 1,
                    name: "审核通过",
                },
                {
                    id: 2,
                    name: "复核已通过",
                },
            ],
            searchForm: {
                searchq: "",
                model_id: '',
                min_value:0,
                max_value:0,
                range_id:0,
                state: -2, // -1 全部 0:未审核  1:审核通过  2:复核已通过
                prent_structure_ids: [],
                activityid: 0
            },
            activityInfo: {
                activityName: "",
                activityId: "",
                baseInfo:{}
            },
            checkPage:1,
            keySpan: {}
        };
    },
    computed:{
        currState(){
            let currState = {};
            let stateList = this.stateList || [];
            for(let i = 0; i < stateList.length; i++){
                if(stateList[i].id == this.searchForm.state){
                    currState = stateList[i]
                    break;
                }
            }
            return currState
        }
    },
    methods: {
        init(){
            let state = this.pageQuery.state;
            state = (state == 0 || state > 0) ? state : -1;
            this.searchForm.state = Number(state);
            this.searchForm.structure_id = this.pageQuery.structureId || 0;
            this.searchForm.prent_structure_ids = this.pageQuery.prentStructureIds || [];
            this.searchForm.activityid = this.pageQuery.activityId || 0;
            this.activityInfo.activityId = this.pageQuery.activityId || 0
        },
        onLoadData(page, extraData) {
            return this.$MainApi
                .forewarningExamineList({
                    data: {
                        ...this.searchForm,
                        ...extraData,
                    },
                    other: {
                        isErrorMsg: true
                    }
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        let actData = data.data || {}
                        this.checkPage = page;
                        this.activityInfo.activityName = actData.activity_name;
                        this.activityInfo.baseInfo = {
                            total:data.total||0,
                            user_count:data.user_count||0,
                        }
                        let items = data.items || [];
                        this.keySpan = {};
                        items.map((item)=>{
                            item.show_level_name = this.getLevelName(item);
                            item.show_state_str = this.getStateStr(item);
                            let label = ''+(item.record_id)+(item.user_id);
                            if(!this.keySpan[label]){
                                this.keySpan[label] = []
                            }
                            this.keySpan[label].push(item)
                        })
                        // let obj = {},list=[];
                        // items = items.forEach(item=>{
                        //     item.show_level_name = this.getLevelName(item);
                        //     item.show_state_str = this.getStateStr(item);
                        //     let label = ''+(item.record_id)+(item.user_id);
                        //     obj[label] || (obj[label] = {...item,range:[]})
                        //     obj[label].range.push(item);
                        // })
                        // for(let item in obj){
                        //     list.push(obj[item]);
                        // }
                        this.data = {
                            total: data.total,
                            list: items,
                        };
                    }
                });
        },
        setSpan({ row, column, rowIndex, columnIndex }){
            let label = ''+(row.record_id)+(row.user_id);
            if(column.isRow){
                return [1, 1]
            } else {
                let keySpan = this.keySpan || {};
                let labelSpan = keySpan[label];
                if(labelSpan && labelSpan.length){
                    if((row.model_id || row.model_id == 0) && row.model_id == labelSpan[0].model_id){
                        return [labelSpan.length, 1];
                    } else {
                        return [0, 0]
                    }
                } else {
                    return [1, 1]
                }
            }
        },
        getPsychicFile(row) {
            this.$UIModule({
                mode: "clause-view",
                success:()=>{
                    this.$router.push({
                        name: "earlyWarnPsychicFiles",
                        query: {
                            userId: row.user_id || 0,
                            type: "earlyWarn"
                        },
                    });
                }
            })
            
        },
        examine(row){
            this.$refs["editExamineRef"] && this.$refs["editExamineRef"].showDrawer(row)
        },
        getLevelName(row){
            let getWarnRank = row.get_warn_user && row.get_warn_user.getrank || {};
            let empty = !!(row.get_warn_user && row.get_warn_user.warning_level == 0) ? '已解除':'无'
            let name = getWarnRank.level_name || empty;
            return name;
        },
        getStateStr(row){
            let name = row.getrank && row.getrank.level_name || "";
            return row.state == 1 &&  name ? `(标记为${name})` : ""
        }, 
        exportHandle(){
            return this.$MainApi.forewarningCheckExport({
                data: {
                    ...this.searchForm,
                    activityid:this.pageQuery.activityId||0,
                },
                other: {
                    isErrorMsg: true
                }
            })
            .then((res) => {
                if (res.code) {
                    let data = res.data;
                    if (data) {
                        this.jobIdCol.push(data);
                        this.$nextTick(() => {
                            this.$refs[`notice${data}`][0].showNotice(data);
                        });
                    }
                    return data || {};
                }
            });
        },
	
        checkAnswer(row){
            this.$UIModule({
                mode: "clause-view",
                success: () => { 
                    this.$router.push({
                        name:"earlyWarnPsychicFilesAnswer",
                        query: {
                            modelName: row.model_name,
                            modelId: Number(row.model_id),
                            recordId: row.record_id + "",
                            type: "earlyWarn",
                            userId: row.user_id + "",
                        },
                    });
                }
            })

        },
    },
    mounted() {
        this.init();
        this.loadData();
    },
};
</script>

<style lang="less" scoped>
.activity-name{
  padding-left:10px; 
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #7F7F7F;
  line-height: 22px;
  margin-bottom: 15px;
}
.range-box{ 
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.range-item{
    width: 100%;
    border-bottom: 1px solid #e8eaec; 
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex;
    box-sizing:border-box;
    padding: 5px 16px;
    &:last-child{
        border-bottom: none;
    }
    &.wideLineHeight{
        line-height: 60px;
    }
}
</style>