<template>
<div>
    <rewrite-drawer class="edit-admin-drawer" :inner="true" v-model="drawerShow" :width="430">
        <div class="bold" slot="header">{{title}}</div>
        <div class="edit-cont-area">
            <Form :label-width="100" :model="adminInfo" ref="formDataRef" :rules="ruleValidate" :hide-required-mark="true">
                <FormItem prop="admin_name">
                    <span slot="label" :class="{'required-after': isRegister != 1}">人员名称</span>
                    <div v-if="isRegister == 1">{{adminInfo.admin_name}}</div>
                    <custom-input v-else regType="name" class="base-320" v-model="adminInfo.admin_name"></custom-input>
                </FormItem>
                <FormItem prop="role_id">
                    <span slot="label" class="required-after">授权角色</span>
                    <template v-if="adminInfo.admin_id && !_structureLimit(['edu_school'])">
                        {{adminInfo.role_name}}
                    </template>
                    <roleSelect v-show="!adminInfo.admin_id || _structureLimit(['edu_school'])" v-model="adminInfo.role_id" valueKey="role_id" nameKey="role_name" @change="changeRole" :initCallback="initRoleData"></roleSelect>
                </FormItem>
                <FormItem v-if="adminInfo.structure_type == 'edu_area' || (adminInfo.structure_type == 'edu_street' && _structureType == 'edu_customer')" prop="area_relevance_id">
                    <span slot="label" class="required-after">关联区</span>
                    <data-select v-model="adminInfo.area_relevance_id" @change="changeArea" class="base-320" type="adminArea" ref="areaSelectRef" valueKey="area_id" nameKey="area_name"></data-select>
                </FormItem>
                <FormItem v-if="adminInfo.structure_type == 'edu_street'" prop="street_relevance_id">
                    <span slot="label" class="required-after">关联街道</span>
                    <data-select v-model="adminInfo.street_relevance_id" @change="changeStreet" :params="{ area_id: (_structureType == 'edu_customer' ? adminInfo.area_relevance_id : _structureId)}" class="base-320" type="street" ref="streetSelectRef" valueKey="street_id" nameKey="street_name"></data-select>
                </FormItem>
                <FormItem v-else-if="adminInfo.structure_type == 'edu_school'" prop="school_relevance_id">
                    <span slot="label" class="required-after">关联学校</span>
                    <data-select v-model="adminInfo.school_relevance_id" :params="{ area_id: _structureId }" class="base-320" type="school" ref="schoolSelectRef" valueKey="school_id" nameKey="school_name"></data-select>
                </FormItem>
                <template v-else-if="adminInfo.structure_type == 'edu_class'">
                    <FormItem prop="relevance_id">
                        <span slot="label" class="required-after">关联班级</span>
                        <Button :type="adminInfo.relevance_id && adminInfo.relevance_id.length ? 'primary' : 'default'" @click="chooseRelevance">
                            {{adminInfo.relevance_id && adminInfo.relevance_id.length > 0 ? '更换关联班级' : '选择关联班级'}}</Button>
                    </FormItem>
                </template>
                <FormItem prop="admin_phone">
                    <span slot="label" :class="{'required-after': isRegister != 1}">手机号</span>
                    <div v-if="isRegister == 1">{{adminInfo.admin_phone}}</div>
                    <custom-input v-else type="number" isInt :maxlength="11" class="base-320" v-model="adminInfo.admin_phone"></custom-input>
                </FormItem>
            </Form>
        </div>
        <div slot="footer">
            <Button type="primary" @click="checkUpdateInfo">保存</Button>
            <Button @click="drawerShow = false">取消</Button>
        </div>
    </rewrite-drawer>
    <classOrganizeViewModal ref="classOrganizeModalRef" :multiple="true" :isRelation="true" :isLImitMain="adminInfo.role_type == 'class_teacher' ? true : false" @success="chooseRelevanceCallback"></classOrganizeViewModal>
</div>
</template>

<script>
import classOrganizeViewModal from "@/components/view-components/class-organize-view-modal/index.vue";
import roleSelect from "@/components/view-components/role-select/index.vue";
export default {
    props: {
        title: String,
    },
    components: { classOrganizeViewModal, roleSelect },
    data() {
        return {
            drawerShow: false,
            adminInfo: {
                admin_id: 0,
                admin_name: "",
                role_id: 0,
                role_type: "",
                role_name: "",
                structure_type: "",
                school_relevance_id: 0,
                street_relevance_id: 0,
                area_relevance_id: 0,
                relevance_id: [],
                admin_phone: "",
            },
            isRegister: 0,
            relevance_ids: [], 
            adminId: 0,
            ruleValidate: {
                admin_name: [
                    {
                        required: true,
                        validator: this._checkString,
                        trigger: "blur",
                        message: "请填写人员名称",
                    },
                ],
                role_id: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "请填写授权角色",
                        trigger: "change",
                    },
                ],
                admin_phone: [
                    {
                        required: true,
                        validator: this._checkPhone,
                        trigger: "blur",
                    },
                ],
                area_relevance_id: [
                    {
                        required: true,
                        validator: this._checkThanInt,
                        message: "请选择关联区",
                        trigger: "change",
                    },
                ],
                school_relevance_id: [
                    {
                        required: true,
                        validator: this._checkThanInt,
                        message: "请选择关联学校",
                        trigger: "change",
                    },
                ],
                street_relevance_id: [
                    {
                        required: true,
                        validator: this._checkThanInt,
                        message: "请选择关联街道",
                        trigger: "change",
                    },
                ],
                relevance_id: [
                    {
                        required: true,
                        validator: this._checkArray,
                        message: "请选择对应的值",
                        trigger: "change",
                    },
                ],
            },
            rolesList: []
        };
    },
    computed: {
    },
    methods: {
        showDrawer({ adminInfo = {} }) {
            this.drawerShow = true;
            this.$refs["formDataRef"] && this.$refs["formDataRef"].resetFields();
            this.adminInfo = {
                admin_id: 0,
                admin_name: "",
                role_id: 0,
                role_type: "",
                role_name: "",
                structure_type: "",
                school_relevance_id: 0,
                street_relevance_id: 0,
                area_relevance_id: 0,
                relevance_id: [],
                admin_phone: "",
            }
            this.isRegister = adminInfo.is_register || 0;
            this.relevance_ids = [];
            this.loadData(adminInfo)
        },
        loadData(adminInfo){
            if(!Number(adminInfo.admin_id)) return;
            this.pageLoading = true;
            this.$MainApi.peopleInfo({
                data: {
                    admin_id: adminInfo.admin_id
                },
                other: {
                    isErrorMsg: true
                }
            }).then((res)=>{
                if(res.code){
                    let data = res.data || {};
                    let get_a_role = data.get_a_role || {};
                    let get_data = data.get_data || [];
                    let get_self = get_data[0].get_self || {};
                    let _adminInfo = {
                        admin_id: data.admin_id || 0,
                        admin_name: data.admin_name || "",
                        role_type: "",
                        role_name: (get_a_role.get_role && get_a_role.get_role.role_name) || "",
                        structure_type: "",
                        role_id: get_a_role.role_id ? get_a_role.role_id : 0,
                        admin_phone: data.admin_phone,
                        school_relevance_id: get_data[0].id || 0,
                        street_relevance_id: get_data[0].id || 0,
                        area_relevance_id: get_self.id || get_data[0].id || 0,
                        is_register: adminInfo.is_register
                    }
                    if(get_data.length > 0){
                        let relevance_ids = [];
                        for(let i = 0; i < get_data.length; i++){
                            let id = get_data[i].id || 0;
                            if(id){
                                relevance_ids.push(id);
                            }
                        }
                        _adminInfo.relevance_id =  relevance_ids || [];
                    }
                    this.relevance_ids = data.get_data || []
                    this.adminInfo = _adminInfo || {};
                    this.setRoleType(_adminInfo.role_id);
                }
            }).finally(()=>{
                this.pageLoading = false;
            })
        },
        changeRole(){
            this.$set(this.adminInfo, "relevance_id", []);
            this.relevance_ids = [];
            this.$set(this.adminInfo, "street_relevance_id", 0);
            this.$set(this.adminInfo, "school_relevance_id", 0);
            this.$set(this.adminInfo, "area_relevance_id", 0);
        },
        changeStreet(data){
            this.$set(this.adminInfo, "relevance_id", [data]);
        },
        changeArea(data){
           this.$set(this.adminInfo, "relevance_id", [data]);
           this.$nextTick(()=>{
            this.$refs["streetSelectRef"] && this.$refs["streetSelectRef"].getData();
           })
        },
        chooseRelevance(){
            this.$refs["classOrganizeModalRef"] && this.$refs["classOrganizeModalRef"].showModal({
                selectData: this.relevance_ids || [],
                extra: {
                    expandHold: true,
                    reqParams: {
                        school_id: this._getReqStructureId,
                        school_name: this._getReqStructureName,
                        state: 2 // 0: 正常数据，1 毕业数据， 2全部数据（包含毕业）
                    }
                }
            });
        },
        chooseRelevanceCallback(data){
            if(data.length > 0){
                let selectData = [], selectFullData = [];
                for(let i = 0; i < data.length; i++){
                    if(data[i].type == 'school'){
                        selectData = [data[i].id];
                        selectFullData = [ data[i] ]
                        break;
                    } else if(data[i].type == 'class'){
                        selectData.push(data[i].id);
                        selectFullData.push(data[i]);
                    }
                }
                this.relevance_ids = selectFullData;
                this.adminInfo.relevance_id = selectData;
            } else {
                this.relevance_ids = [];
                this.adminInfo.relevance_id = [];
            }
        },
        checkUpdateInfo() {
            this.$refs["formDataRef"].validate((valid) => {
                if (valid) {
                    this.updateInfo();
                } else {
                    this.$Message.warning("请完善信息");
                }
            });
        },
        updateInfo() {
            let adminInfo = this.adminInfo || {};
            !Number(adminInfo.admin_id) && delete adminInfo.admin_id;
            let req = Number(adminInfo.admin_id) ? "peopleUpdate" : "peopleAdd";
            this.pageLoading = true;
            let relevance_id = []
            if(adminInfo.structure_type == "edu_school"){
                relevance_id = adminInfo.school_relevance_id || []
            } else {
                relevance_id = adminInfo.relevance_id || []
            }
            return this.$MainApi[req]({
                data: {
                    ...adminInfo,
                    role_id: adminInfo.role_id ? adminInfo.role_id + '' : '',
                    admin_phone: adminInfo.admin_phone ? adminInfo.admin_phone + "" : "",
                    relevance_id: relevance_id instanceof Array ? relevance_id : [relevance_id],
                },
            })
                .then((res) => {
                    if (res.code) {
                        this.$Message.success(res.message || "操作成功");
                        this.drawerShow = false;
                        this.$emit("confirm");
                    } else {
                        this.$Message.warning(res.message || "操作失败");
                    }
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        initRoleData(data){
            this.rolesList = data || [];
        },
        setRoleType(role_id){
            let rolesList = this.rolesList;
            if(!Number(role_id)){
                this.$set(this.adminInfo, "role_type", "");
                this.$set(this.adminInfo, "structure_type", "");
                this.$set(this.adminInfo, "role_name", "");
            } else {
                for(let i = 0; i < rolesList.length; i++){
                    if(rolesList[i].role_id == role_id){
                        this.$set(this.adminInfo, "structure_type", rolesList[i].structure_type || "")
                        this.$set(this.adminInfo, "role_type", rolesList[i].type || "")
                        this.$set(this.adminInfo, "role_name", rolesList[i].role_name || "");
                        break;
                    }
                }
            }
        }
    },
    mounted() {},
    watch:{
        "adminInfo.role_id": {
            handler:function(nV){
                this.setRoleType(nV);
            },
            immediate: true
        }
    }
};
</script>

<style lang="less" scoped>
@import "@/assets/css/variables.less";
.page-drawer-area{
  .edit-cont-area{
    border: 0 none !important;
  }
}
</style>