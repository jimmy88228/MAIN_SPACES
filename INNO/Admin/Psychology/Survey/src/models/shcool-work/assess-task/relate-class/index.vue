<template>
    <hold-layout :isFull="true">
        <searchForm 
        :selectedNum="selectData.length" 
        :activityTimeState="activityTimeState" 
        :searchForm="searchForm" 
        @search="loadData" 
        @batchRelate="setBatchRelate" 
        @batchCode="batchCreateCode" 
        @batchLink="batchCreateLink"
        :batchCodeIng="batchCodeIng"
        :relatIng="relatIng"
        ></searchForm>
        <rewrite-table ref="myTable" class="full-table" :columns="columns" :data="list" :loading="tableLoading" @on-selection-change="selectDataEvent">
            <template slot="campus" slot-scope="{ row }">
                {{(row.get_class && row.get_class.campus) || "--"}}
            </template>
            <template slot="gradeType" slot-scope="{ row }">
                {{(row.get_class && row.get_class.grade_type_str) || "--"}}
            </template>
            <template slot="grade" slot-scope="{ row }">
                <template v-if="row.get_class">
                    {{row.get_class.grade + '(' + row.get_class.school_year + ')'}}
                </template>
                <template v-else>--</template>
            </template>
            <template slot="class" slot-scope="{ row }">
                {{(row.get_class && row.get_class.class) || "--"}}
            </template>
            <template slot="admin" slot-scope="{ row }">
                <p>
                    <span v-for="(item, index) in row.get_admin" :key="item.admin_id">{{item.get_user && item.get_user.user_name}}<template v-if="row.get_admin.length > 1 && index < (row.get_admin.length - 1)">，</template></span>
                    <span class="invalid" v-if="!row.get_admin || row.get_admin.length == 0">--</span>
                </p>
            </template>
            <template slot="extend" slot-scope="{ row }">
                <div class="operate-area">
                    <a class="operate" @click="createCode(row)" v-hasAction="[row.state == 1,'assessment_tasks_batch_class_code']">生成二维码</a>
                    <a class="operate" v-hasAction="[row.state == 1,'assessment_tasks_batch_class_link']" @click="createLink(row)">生成链接</a>
                </div>
            </template>
            <template slot="handle" slot-scope="{ row, index }">
                <div class="operate-area">
                    <a class="operate" v-hasAction="'assessment_tasks_batch_class_link'" @click="setRelate(row, index)" :class="{ 'invalid': (row.state == 1 && activityTimeState >= 2)}">
                    <!-- <a class="operate" v-hasAction="'assessment_tasks_batch_class_link'" @click="setRelate(row, index)" :class="{ 'invalid': row.state != 1 || (row.state == 1 && activityTimeState >= 2)}"> -->
                        {{row.state == 1 ? row.state_str : "关联"}}
                    </a>
                </div>
            </template>
        </rewrite-table>
        <rewrite-page :selectedNum="selectData.length" ref='rewritePage' isShowAllSel slot="footer" @on-sel-all="onSelAll" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <!--异步处理导出excel组件-->
        <mpNotice :ref="'notice' + item" v-for="item in jobIdCol" :key="item"></mpNotice>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form.vue";
import mixins from "./mixins";
import mpNotice from "@/components/main-components/mq-notice/mq-notice";
import Conf from "@/config";
export default {
    name: "assessTask",
    mixins: [ListMixin, mixins],
    components: { searchForm, mpNotice },
    data() {
        return {
            searchForm: {
                activityid: 0,
                campus_id: 0,
                school_id: 0,
                class_id: 0,
                state: -1,
            },
            selectData: [],
            h5Admin: Conf.H5_ADMIN,
            actDetail: {},
            activityTimeState: 0,
            batchCodeIng: false,
            relatIng: false
        };
    },
    computed: {
        ids() {
            let selectData = this.selectData || [];
            let ids = [];
            let hasNoRelate = 0;
            if (selectData instanceof Array) {
                for (let i = 0; i < selectData.length; i++) {
                    if (selectData[i].id) {
                        ids.push(selectData[i].id);
                        if(selectData[i].state != 1) hasNoRelate++;
                    }
                }
                this.hasNoRelate = hasNoRelate;
            }
            return ids;
        },
        relateIds(){
            let selectData = this.selectData || [];
            let ids = [];
            if (selectData instanceof Array) {
                for (let i = 0; i < selectData.length; i++) {
                    if (selectData[i].id && selectData[i].state == 1) {
                        ids.push(selectData[i].id);
                    }
                }
            }
            return ids;
        },
    },
    methods: {
        initData() {
            let id = this.pageQuery.id || 0;
            let schoolId = this.pageQuery.schoolId || 0;
            this.activityTimeState = Number(this.pageQuery.activityTimeState) || 0;
            this.$set(this.searchForm, "activityid", id);
            this.$set(this.searchForm, "school_id", schoolId);
            this.getTaskInfo();
        },
        getTaskInfo(){
            let id = this.pageQuery.id || 0;
            if (!id) return;
            let type = this.pageQuery.type || "";
            let req = type == 'task' ? 'assessmentTaskInfo' : 'appraisalActInfo'
            this.$MainApi[req]({
                    data: {
                        id: id,
                    }
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        this.actDetail = data;
                    }
                });
        },
        onLoadData(page, extraData , all=false) {
            let searchForm = this.searchForm || {};
            return this.$MainApi
                .relateClassList({
                    data: {
                        ...this.searchForm,
                        campus_id: searchForm.campus_id + "",
                        class_id:
                            (searchForm.grade_id || searchForm.class_id) + "",
                        ...extraData,
                    },
                })
                .then((res) => {
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
                    return res
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
        createCode(row) {
            let actName = this.pageQuery.actName || ""
            this.$UIModule({
                mode: "code-view",
                props: {
                    codeTip: `<p class="big-tip">${this._structureName} &nbsp; ${row.structure_name}</p><p class="tip">${actName}</p>`
                },
                options: {
                    path: "pages/activities/evaluating/detail/detail",
                    listParams: {
                        structure_id: this.actDetail.structure_id || 0,
                        structure_type: this.actDetail.structure_type || ''
                    },
                    params: {
                        activityId: this.searchForm.activityid,
                        schoolId: this.searchForm.school_id,
                        classId: row.id,
                    },
                    codeId: `surveys:${row.id}:${this.searchForm.activityid}`
                }
            });
        },
        batchCreateCode() {
            this.checkIds(this.relateIds, 'relate').then(()=>{
                if(this.ids.length > this.relateIds.length){ // 存在没关联组织二维码
                    this.$Modal.info({
                        title: "提示",
                        render: (h)=>{
                            return h('div', { attrs: { class: "text-c p-t-5 p-b-5 m-t-10" } }, [
                                h('p',{ style: { marginBottom: "10px", fontSize: "18px" } }, [
                                    h('span', "存在关联班级二维码 共"),
                                    h('span',{ attrs: { class: "primary-color bold" } }, this.relateIds.length),
                                    h('span', "个")
                                ]),
                                h('p', [
                                    h('span',{ style: { color: "#7f7f7f", fontSize: "12px" } }, "批量生产只对已关联组织有效"),
                                ])
                            ])
                        },
                        okText: "是否下载",
                        onOk:()=>{
                            this.chooseApplet();
                        },
                        closable: true
                    });
                } else {
                    this.chooseApplet();
                }
            })
        },
        chooseApplet(){
            this.$UIModule({
                mode: "code-view",
                props: {
                    isLimitCode: true
                },
                options: {
                    listParams: {
                        structure_id: this.actDetail.structure_id || 0,
                        structure_type: this.actDetail.structure_type || ''
                    },
                },
                success:(detail)=>{
                    let appletInfo = detail.appletInfo || {};
                    if(appletInfo.appid){
                        this.createCodeReq(this.relateIds, appletInfo.appid);
                    }
                }
            });
        },
        createCodeReq(ids, appid) {
            this.batchCodeIng = true;
            return this.$MainApi.batchClassCode({
                data: {
                    id: this.searchForm.activityid,
                    school_id: this.searchForm.school_id,
                    class_ids: ids,
                    appletId: appid
                },
                other: { isErrorMsg: true },
            })
            .then((res) => {
                let data = res.data;
                if (data) {
                    this.jobIdCol.push(data);
                    this.$nextTick(() => {
                        this.$refs[`notice${data}`][0].showNotice(data);
                    });
                }
                return data || {};
            }).finally(()=>{
                this.batchCodeIng = false;
            })
        },
        createLink(row) {
            this.$UIModule({
                mode: "link-view",
                props: {},
                options: {
                    listParams: {
                        structure_id: this.actDetail.structure_id,
                        structure_type: this.actDetail.structure_type
                    },
                    linkData: [
                        {
                            title: "班级+学号登录链接",
                            path: this.h5Admin + "/pages/login/class-sid-login",
                            params: {
                                id: this.searchForm.activityid,
                                schoolId: this.searchForm.school_id,
                                classId: row.id
                            },
                        },
                        // {
                        //     title: "学号+密码登录链接",
                        //     path: this.h5Admin + "/pages/startup/startup",
                        //     params: {
                        //         id: this.searchForm.activityid,
                        //         schoolId: this.searchForm.school_id,
                        //         classId: row.id
                        //     },
                        // },
                    ]
                }
            });
        },
        batchCreateLink() {
            if(this.ids.length > this.relateIds.length){ // 存在没关联组织链接
                this.$Modal.info({
                    title: "提示",
                    render: (h)=>{
                        return h('div', { attrs: { class: "text-c p-t-5 p-b-5 m-t-10" } }, [
                            h('p',{ style: { marginBottom: "10px", fontSize: "18px" } }, [
                                h('span', "存在关联班级链接 共"),
                                h('span',{ attrs: { class: "primary-color bold" } }, this.relateIds.length),
                                h('span', "个")
                            ]),
                            h('p', [
                                h('span',{ style: { color: "#7f7f7f", fontSize: "12px" } }, "批量生产只对已关联组织有效"),
                            ])
                        ])
                    },
                    okText: "是否下载",
                    onOk:()=>{
                        this.createLinkReq(this.relateIds);
                    },
                    closable: true
                });
            } else {
                this.createLinkReq(this.relateIds);
            }
        },
        createLinkReq(ids) {
            this.checkIds(ids).then(() => {
                return this.$MainApi
                    .batchClassLink({
                        data: {
                            id: this.searchForm.activityid,
                            school_id: this.searchForm.school_id,
                            class_ids: this.ids,
                        },
                        other: { isMsg: true },
                    })
                    .then((res) => {
                        let data = res.data;
                        if (data) {
                            this.jobIdCol.push(data);
                            this.$nextTick(() => {
                                this.$refs[`notice${data}`][0].showNotice(data);
                            });
                        }
                    });
            });
        },
        setRelate(row, index) {
            if(row.state && this.activityTimeState >= 2){ //活动进行中不可取消关联
                this.$Message.warning("活动已进行,不可取消关联");
                return;
            }
            this.relatIng = true;
            this.batchRelateReq([row.id], row.state != 1).then(() => {
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
            this.batchRelateReq(this.ids, setRelate).then(() => {
                for (let i = 0; i < this.list.length; i++) {
                    let id = this.list[i].id;
                    let idIndex = this.ids.indexOf(id);
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
                    item.state = setRelate ? 1 : 0;
                    item.state_str = setRelate ? "已关联" : "未关联";
                })
            }).finally(()=>{
                this.relatIng = false;
            })
        },
        batchRelateReq(ids, setRelate) {
            return this.checkIds(ids).then(() => {
                let req = setRelate ? "relateClassAdd" : "relateClassCancel";
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
                })
            });
        },
        checkIds(ids, type) {
            return new Promise((rs, rj) => {
                let warn = "";
                let searchForm = this.searchForm || {};
                if (ids.length == 0 || !ids[0]) {
                    warn = type == 'relate' ? "不存在可操作项" : "请选择操作项";
                } else if (!Number(searchForm.activityid)) {
                    warn = "无效活动ID";
                } else if (!Number(searchForm.school_id)) {
                    warn = "无效学校ID";
                }
                if (warn) {
                    this.$Message.warning(warn);
                    rj();
                } else {
                    rs();
                }
            });
        },
        _clearListSelect(){
            this.onSelAll(false)
            this.$refs.rewritePage.setCheckAll(false);
        }
    },
    mounted() {
        this.initData();
        this.loadData();
    },
};
</script>

<style>
</style>