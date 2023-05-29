<template>
    <hold-layout :isFull="true" class="relate-school">
        <searchForm 
        :selectedNum="selectData.length" 
        @search="loadData()" 
        :activityTimeState="activityTimeState" 
        :searchForm="searchForm" 
        @setBatchRelate="setBatchRelate" 
        @batchImport="batchImport"
        :relatIng="relatIng"
        ></searchForm>
        <rewrite-table ref="myTable" class="full-table" :columns="columns" :data="list" :loading="tableLoading" @on-selection-change="selectDataEvent">
            <template slot="state" slot-scope="{ row }">
                <p :class="{'c_success': row.state == 1}">{{row.state_str}}</p>
            </template>
            <template slot="get_self" slot-scope="{ row }">
                <p >{{(row.get_self && row.get_self.structure_name) || "--"}}</p>
            </template>
            <template slot="handle" slot-scope="{ row, index }">
                <div class="operate-area">
                    <a class="operate" v-hasAction="['appraisal_activity_school']" :class="{'invalid': row.state == 1}" @click="setRelate(row, index)">{{ row.state ? '取消关联' : '关联' }}</a>
                </div>
            </template>
        </rewrite-table>
        <rewrite-page ref='rewritePage' :selectedNum="selectData.length" isShowAllSel @on-sel-all="onSelAll" slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
import searchForm from "./search-form.vue";
export default {
    name: "relateSchool",
    mixins: [ListMixin, mixins],
    components: { searchForm },
    data() {
        return {
            searchForm: {
                activityid: 0,
                searchq: "",
                state: "",
                area_id: 0,
                street_id: 0
            },
            selectData: [],
            relatIng: false
        };
    },
    computed: {
        ids() {
            let selectData = this.selectData || [];
            let ids = [];
            if (selectData instanceof Array) {
                for (let i = 0; i < selectData.length; i++) {
                    if (selectData[i].id) {
                        ids.push(selectData[i].id);
                    }
                }
            }
            return ids;
        },
    },
    methods: {
        init(){
            this.activityTimeState = Number(this.pageQuery.activityTimeState) || 0;
        },
        onLoadData(page, extraData , all=false) {
            this.searchForm.activityid = Number(this.pageQuery.activityId);
            return this.$MainApi
                .appraisalSchool({
                    data: {
                        ...this.searchForm,
                        ...extraData,
                    },
                })
                .then((res) => {
                    console.log("列表", res);
                    if (res.code) {
                        if(all){
                            return res;    
                        } 
                        let data = res.data || {};
                        let items = data.items || [];
                        // let ids = this.selectData.map(item=>item.id);
                        items.map((item)=>{
                            item._checked = this.ids.includes(item.id);
                        })
                        this.data = {
                            total: data.total,
                            list: items,
                        };
                    }
                });
        }, 
        selectDataEvent(data) {
            let selIds = data.map(item=>item.id);
            let ids = this.list.map(item=>item.id); 
            let tempData = JSON.parse(JSON.stringify(this.selectData));
            tempData = tempData.filter(item=>!ids.includes(item.id));
            tempData = tempData.concat(data);
            this.selectData = JSON.parse(JSON.stringify(tempData));
            this.list.forEach(item=>{
                item._checked = !!selIds.includes(item.id);
            })
            this.$refs.rewritePage.setCheckAll(this.total >0 && this.selectData.length >= this.total);
        },
        onSelAll(e){
            this.list.forEach(item=>{
                item._checked = !!e;
            })
            if(e){
                this.loadAllData().then(()=>{
                    this.selectData = this.listAllData || [];
                })
            }else{
                this.selectData = [];   
            }
        },
        batchImport() {
            this.$UIModule({
                mode: "batch-import",
                options: {
                    canCreate: { upload: true, download: true },
                    uploadUrl: "batchImportAppraisalSchool",
                    downloadUrl: "batchTplAppraisalSchool",
                },
                success: () => {
                    this.loadData();
                },
            });
        },
        setRelate(row, index) {
            if(row.state && !row.handle.cancel){
                this.$Message.warning("该学校已关联班级，不可取消关联");
                return;
            } else if(row.state && this.activityTimeState >= 2){ //活动进行中不可取消关联
                this.$Message.warning("活动已进行,不可取消关联");
                return;
            }
            this.relatIng = true;
            this.batchRelateSchool([row.id], row.state != 1).then(() => {
                this.$set(
                    this.data.list[index],
                    "state",
                    row.state == 1 ? 0 : 1
                );
                this.$set(
                    this.data.list[index],
                    "state_str",
                    row.state == 1 ? "未关联" : "已关联"
                );
                // 同步选择数据
                let idIndex = this.ids.indexOf(row.id)
                if(idIndex != -1){
                    this.selectData[idIndex].state = row.state == 1 ? 0 : 1
                    this.selectData[idIndex].state_str = row.state == 1 ? "未关联" : "已关联"
                }
            }).finally(()=>{
                this.relatIng = false;
            })
        },
        setBatchRelate(setRelate) {
            this.relatIng = true;
            this.batchRelateSchool(this.ids, setRelate).then(() => {
                for (let i = 0; i < this.list.length; i++) {
                    let id = this.list[i].id;
                    let idIndex = this.ids.indexOf(id)
                    if (id && idIndex != -1) {
                        this.$set(
                            this.data.list[i],
                            "state",
                            setRelate ? 1 : 0
                        );
                        this.$set(
                            this.data.list[i],
                            "state_str",
                            setRelate ? "已关联" : "未关联"
                        );
                    }
                }
                this.selectData.map((item)=>{
                    item.state = setRelate ? 1 : 0
                    item.state_str = setRelate ? "已关联" : "未关联"
                })
            }).finally(()=>{
                this.relatIng = false;
            })
        },
        batchRelateSchool(ids, setRelate) {
            if (ids.length == 0) {
                this.$Message.warning("请选择设置的学校");
                return Promise.reject();
            }
            let req = setRelate
                ? "batchAddAppraisalSchool"
                : "batchCancelAppraisalSchool";
            return this.$MainApi[req]({
                data: {
                    activityid: this.searchForm.activityid,
                    ids: ids,
                },
            }).then((res) => {
                if (res.code) {
                    this.$Message.success(
                        res.message || (setRelate ? "关联成功" : "取消成功")
                    );
                    return Promise.resolve();
                } else {
                    this.$Message.warning(
                        res.message || (setRelate ? "关联失败" : "取消失败")
                    );
                    return Promise.reject();
                }
            });
        },
        _clearListSelect(){
            this.onSelAll(false)
            this.$refs.rewritePage.setCheckAll(false);
        }
    },
    mounted() {
        this.init();
        this.loadData();
    },
};
</script>

<style lang="less" scoped>
.relate-school {
}
</style>