<template>
    <div>
        <rewrite-drawer v-model="drawerShow" :inner="true" :width="460">
            <div class="bold flex-b-c" slot="header">
                <div>
                    <span class="m-r-5">{{(step != 2 || editType == 'grade') ? title : "班级创建"}}</span>
                    <span class="desc-notice" v-if="!schoolId">步骤{{step}}/{{fullStep}}</span>
                </div>
                <div class="desc-notice" v-if="step == 2 && editType != 'grade'">班级数量为0时则不会生成</div>
            </div>
                <div class="edit-cont-area">
                    <Tabs class="edit-school-tabs" :value="step">
                        <TabPane label="学校" :name="1">
                            <schoolForm 
                            ref="schoolFormRef" 
                            :schoolId="schoolId"
                            :schoolInfo="schoolInfo" 
                            :defaultCampus="defaultCampus" 
                            :defaultContact="defaultContact"
                            @setCampousClass="setCampousClass"
                            ></schoolForm>
                        </TabPane>
                        <TabPane label="班级" :name="2">
                            <classForm ref="classFormRef" :schoolId="schoolId" :editType="editType" :setClassIndex="setClassIndex" :classData="schoolInfo.class_data" :schoolInfo="schoolInfo"></classForm>
                        </TabPane>
                    </Tabs>
                    <Spin fix v-if="pageLoading"></Spin>
                </div>
            <div slot="footer" class="flex-b-c p-l-20 p-r-20">
                <Button @click="getPrev">{{(step > initStep && editType != 'grade') ? '上一步' : '取消'}}</Button>
                <div>
                    <Button class="m-r-10" type="primary" v-if="step < fullStep && !schoolId" @click="getNext">下一步</Button>
                    <Button class="m-r-10" type="primary" v-if="(step == fullStep || schoolId) && editType != 'grade'" @click="checkUpdate">保存</Button>
                </div>
            </div>
        </rewrite-drawer>
        <!-- <bindAdmin ref="bindAdminRef"></bindAdmin> -->
    </div>
</template>

<script>
import bindAdmin from "./bind-admin/index";
import drawerForm from "@/components/view-components/drawer-form/index.vue";
import schoolForm from "./components/school-form.vue";
import classForm from "./components/class-form.vue";
import graderHelper from "./components/grade/grade.js";
export default {
    name: "editSchoolMaint",
    props: {
        title: {
            type: String,
            default: "标题",
        },
    },
    components: { drawerForm, bindAdmin, schoolForm, classForm },
    data() {
        return {
            step: 1,
            initStep: 1,
            fullStep: 2,
            drawerShow: false,
            structureId: 0,
            schoolId: 0,
            defaultCampus: {
                isEdit: false,
                isFoucs: false,
                id: 0,
                campus_id: 0,
                campus_name: "",
                new_campus_name: "",
                edu_type: [],
                new_edu_type: []
            },
            defaultContact: {
                name: "",
                mobile_phone: "",
                remark: ""
            },
            defaultSchoolInfo: {
                id: 0,
                structure_id: 0,
                structure_type: "",
                structure_name: "",
                school_name: "",
                school_code: "",
                campus_data: [],
                school_contact: [],
                admin_phone: "",
                class_data: [],
            },
            schoolInfo: {},
            setClassIndex: -1,
            adminList: [],
            editType: "",
            ruleValidate: {
                school_name: [
                    {
                        required: true,
                        validator: this._checkString,
                        trigger: "blur",
                        message: "请填写学校名称",
                    },
                ],
                school_code: [
                    {
                        required: true,
                        validator: this._checkString,
                        trigger: "blur",
                        message: "请填写学校编码",
                    },
                ],
                contact: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "请完善联系人",
                        trigger: "blur",
                    },
                ],
                contact_way: [
                    {
                        required: true,
                        validator: this._checkPhone,
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        showDrawer({ id, editType, structure_id, structure_name, structure_type }) {
            this.schoolId = id || 0;
            this.setClassIndex = -1;
            this.drawerShow = true;
            this.schoolInfo = JSON.parse(JSON.stringify(this.defaultSchoolInfo));
            this.editType = editType;
            this.setinitStep(editType);
            if(parseInt(id)){
                this.onLoadData(id);
            } else {
                this.schoolInfo = this.initSchoolData(JSON.parse(JSON.stringify(this.defaultSchoolInfo)));
                if(this._structureType == 'edu_street'){
                    structure_id = this._structureId;
                    structure_name = this._structureName;
                    structure_type = this._structureType;
                }
                this.$set(this.schoolInfo, "structure_id", structure_id);
                this.$set(this.schoolInfo, "structure_name", structure_name);
                this.$set(this.schoolInfo, "structure_type", structure_type);
            }
            graderHelper.schoolInitGrade();
        },
        setinitStep(editType){
            this.step = editType == 'grade' ? this.fullStep : this.initStep;
        },
        getNext(){
            this.checkForm().then(()=>{
                if(this.step < this.fullStep){
                    this.syncClassData();
                    this.step += 1;
                } else {
                    this.step = this.initStep;
                }
            }) 
        },
        getPrev(){
            if(this.editType == 'grade' || this.step == this.initStep){
                this.drawerShow = false;
            } else {
                this.step -= 1;
            }
        },
        setCampousClass(detail){
            this.syncClassData();
            if(!detail.isSync){
                this.setClassIndex = detail.index;
                this.getNext();
            }
        },
        initSchoolData(data){
            /**
             * 调整校区初始化数据
            */
           data = data || {}
            // 默认自带本部校区
            if(!data.campus_data || !data.campus_data.length){
                this.$set(data, "campus_data", [JSON.parse(JSON.stringify(this.defaultCampus))]);
                data.campus_data[0].campus_name = "本部";
                data.campus_data[0].new_campus_name = "本部";
            }
            // 默认至少一个联系人
            if(!data.school_contact || !data.school_contact.length){
                this.$set(data, "school_contact", [JSON.parse(JSON.stringify(this.defaultContact))]);
            }
            return data;
        },
        onLoadData(id) {
            if (!id) {
                return Promise.reject()
            };
            this.pageLoading = true;
            return this.$MainApi
                .schoolMaintInfo({
                    data: {
                        id: id,
                    },
                    other: {
                        isErrorMsg: true
                    }
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        let get_type = data.get_type || {};
                        let get_campus = data.get_campus || [];
                        let get_admin = data.get_admin || [];
                        let get_self = data.get_self || {};
                        let schoolInfo = {
                            id: data.id,
                            structure_id: get_self.id,
                            structure_name: get_self.structure_name,
                            school_name: data.structure_name,
                            school_code: get_type.school_code,
                            school_contact: data.get_contact,
                            campus_data: get_campus.map((item)=>{
                                this.$set(item, 'campus_id', item.id)
                                this.$set(item, 'isFoucs', false)
                                this.$set(item, 'isEdit', false)
                                this.$set(item, 'new_campus_name', item.campus_name);
                                this.$set(item, 'new_edu_type', item.edu_type);
                                return item;
                            }),
                            class_data: data.class_data,
                            admin_phone: get_admin[0] && get_admin[0].get_user && get_admin[0].get_user.mobile_phone
                        };
                        
                        // let adminList = [];
                        // if (data.get_admin instanceof Array) {
                        //     adminList = data.get_admin;
                        // } else {
                        //     adminList = [data.get_admin];
                        // }
                        // this.adminList = this.installAdmin(adminList);
                        this.schoolInfo = this.initSchoolData(schoolInfo)
                        console.log("schoolInfo", schoolInfo);
                        // this.schoolInfo = schoolInfo;
                    }
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        // installAdmin(data) {
        //     let arr = [];
        //     for (let i = 0; i < data.length; i++) {
        //         let get_user = data[i].get_user || {};
        //         let item = {
        //             id: data[i].admin_id,
        //             name: get_user.user_name,
        //         };
        //         arr.push(item);
        //     }
        //     return arr;
        // },
        // removeAdmin() {},
        // bindAdmin(schoolId) {
        //     this.$refs["bindAdminRef"] &&
        //         this.$refs["bindAdminRef"].showModal({
        //             schoolId: schoolId,
        //             confirm: (data) => {
        //                 this.bindAdminEvent(data);
        //             },
        //         });
        // },
        // bindAdminEvent(data) {
        //     if (data.length > 0) {
        //         let arr = [];
        //         for (let i = 0; i < data.length; i++) {
        //             arr.push({
        //                 id: data[i].admin_id,
        //                 name: data[i].admin_name,
        //             });
        //         }
        //         this.adminList = arr;
        //     } else {
        //         this.adminList = [];
        //     }
        // },
        syncClassData(){ // 将调整的校区数据同步到班级列表
            let gradeData = graderHelper.gradeList || {};
            let classData = this.schoolInfo.class_data || [];
            let campusData = this.schoolInfo.campus_data || [];
            let classJson = {};
            // 拼装对象元素
            classData.map((item)=>{
                let campusName = item.campus_name;
                let eduData = item.edu_data || [];
                classJson[campusName] = {}
                eduData.map((eItem)=>{
                    classJson[campusName][eItem.type] = eItem;
                })
            })
            let assembleClass = []
            campusData.map((item)=>{
                let campusName = item.campus_name;
                let newEduType = item.new_edu_type;
                let eduJson = JSON.parse(JSON.stringify(classJson[campusName] || {}));
                let assembleItem = {
                    campus_name: item.new_campus_name,
                    edu_data: []
                };
                newEduType.map((type)=>{
                    if(!eduJson[type]){
                        assembleItem.isNew = true;
                        assembleItem.edu_data.push({
                            type: type,
                            isNew: true,
                            type_data: gradeData[type] || []
                        })
                    } else {
                        assembleItem.edu_data.push(eduJson[type])
                    }
                })
                assembleClass.push(assembleItem)
                // 
                item.campus_name = item.new_campus_name;
            })
            this.schoolInfo.class_data = assembleClass;
            console.log("assembleClass", assembleClass);
        },
        checkForm(isAll){
            if(isAll){
                return this.$refs["schoolFormRef"] && this.$refs["schoolFormRef"].checkForm().then(()=>{
                    return this.$refs["classFormRef"] && this.$refs["classFormRef"].checkForm();
                })
            }
            if(this.step == this.initStep){ // 第一步
               return this.$refs["schoolFormRef"] && this.$refs["schoolFormRef"].checkForm();
            } else if(this.step == this.fullStep){ // 第二步
               return this.$refs["classFormRef"] && this.$refs["classFormRef"].checkForm();
            }
        },
        checkUpdate() {
            this.syncClassData();
            this.checkForm(true).then(()=>{
                this.updateSchoolInfo();
            }).catch((error)=>{
                console.log("error", error);
                if(error.warn_class || error.warn_class == 0){
                    this.$refs["schoolFormRef"] && this.$refs["schoolFormRef"].setCampusWarn(error.warn_class);
                }
            })
        },
        updateSchoolInfo() {
            let schoolInfo = this.schoolInfo || {};
            !Number(schoolInfo.id) && delete schoolInfo.id;
            let req = Number(schoolInfo.id)
                ? "updateSchoolMaint"
                : "addSchoolMaint";
            this.pageLoading = true;
            // 剔除校区多余字段
            let campusData = JSON.parse(JSON.stringify(schoolInfo.campus_data || []));
            campusData.map((item)=>{
                item.edu_type = item.new_edu_type;
                delete item.isEdit;
                delete item.isFoucs;
                delete item.new_edu_type;
                delete item.new_campus_name;
            })
            // 剔除学校联系人多余数组项
            let schoolContact = JSON.parse(JSON.stringify(schoolInfo.school_contact || []));
            schoolContact = schoolContact.filter((item)=>{
                return item.name || item.mobile_phone || item.remark;
            })
            // 剔除旧的班级数据
            let classData = JSON.parse(JSON.stringify(schoolInfo.class_data || []));
            classData = classData.filter((item)=>{
                let edu_data = item.edu_data || [];
                item.edu_data = edu_data.filter((eItem)=>{
                    let isNew = eItem.isNew;
                    delete eItem.isNew;
                    return isNew;
                })
                return item.edu_data.length
            })
            return this.$MainApi[req]({
                data: {
                    ...schoolInfo,
                    school_contact: schoolContact,
                    campus_data: campusData,
                    class_data: classData
                },
            })
            .then((res) => {
                if (res.code) {
                    this.$Message.success(res.message || "操作成功");
                    this.confirmUpdate();
                } else {
                    this.$Message.warning(res.message || "操作失败");
                }
            })
            .finally(() => {
                this.pageLoading = false;
            });
        },
        confirmUpdate() {
            this.drawerShow = false;
            this.$emit("confirm");
        },
    },
    mounted() {},
};
</script>

<style lang="less" scoped>
@import "@/assets/css/variables.less";
.edit-cont-area{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .item-header{
        padding-left: 20px;
        height: 60px;
        line-height: 60px;
        width: 100%;
        display: block;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #171717;
        margin-bottom: 20px;
        background: rgba(216, 216, 216, 0.11);
        border-top: 1px solid #f2f2f2;
        border-bottom: 1px solid #f2f2f2;
    }
    .admin-area {
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 5px;
        min-height: 32px;
        line-height: 1.5;
        padding: 4px 7px;
        .admin-list {
            display: flex;
            width: 100%;
            padding-right: 10px;
            min-height: 100%;
            .admin-item {
                padding: 0px 10px;
                line-height: 1.5;
                color: @primary-color;
                border: 1px solid fade(@primary-color, 30%);
                border-radius: @default-radius;
                background-color: fade(@primary-color, 10%);
                position: relative;
                margin: 2px;
                .admin-close {
                    position: absolute;
                    top: 0px;
                    right: 0px;
                    transform: translate(50%, -50%);
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity @transition-time;
                }
            }
            .admin-item:hover .admin-close {
                opacity: 1;
            }
        }
        .add-admin {
            flex-shrink: 0;
        }
    }
    .edit-school-tabs{
        /deep/.ivu-tabs-bar{
            display: none;
        }
    }
}
</style>