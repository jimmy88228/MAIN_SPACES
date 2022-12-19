<template>
    <div>
        <!-- <Drawer class="page-drawer-area" :lock-scroll="true" :closable="false" v-model="drawerShow" :transfer="false" :inner="true" :width="500">
            <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'">
                <div class="edit-title bold">{{title}}</div>
                <div class="edit-cont" v-bar>
                    <div class="edit-cont-area">
                        <Form :label-width="100" :model="schoolInfo" ref="formDataRef" :rules="ruleValidate">
                            <div class="item-header">学校信息</div>
                            <FormItem label="学校ID" prop="school_code">
                                <Input class="base-input" v-model="schoolInfo.school_code"></Input>
                            </FormItem>
                            <FormItem label="学校名称" prop="school_name">
                                <Input class="base-input" v-model="schoolInfo.school_name"></Input>
                            </FormItem>
                            <FormItem label="学校管理员" v-if="schoolInfo.id">
                                <div class="admin-area flex-s-c base-input">
                                    <div class="admin-list f-wrap">
                                        <div class="admin-item" v-for="(item, index) in adminList" :key="index">
                                            {{item.name}}
                                        </div>
                                    </div>
                                    <a class="add-admin" @click="bindAdmin(schoolInfo.id)">更改</a>
                                </div>
                            </FormItem>
                            <div class="item-header">联系方式</div>
                            <FormItem label="联系人" prop="contact">
                                <Input class="base-input" v-model="schoolInfo.contact"></Input>
                            </FormItem>
                            <FormItem label="联系电话" prop="contact_way">
                                <Input class="base-input" v-model="schoolInfo.contact_way"></Input>
                            </FormItem>
                        </Form>
                        <div class="edit-foot">
                            <Button class="m-r-10" type="primary" @click="checkUpdate">保存</Button>
                            <Button @click="confirmUpdate">取消</Button>
                        </div>
                        <Spin fix v-if="pageLoading"></Spin>
                    </div>
                </div>
            </div>
        </Drawer> -->
        <rewrite-drawer v-model="drawerShow" :inner="true">
            <div class="bold" slot="header">{{title}}</div>
            <!-- <div class="edit-cont"> -->
                <div class="edit-cont-area">
                    <Form :label-width="100" :model="schoolInfo" ref="formDataRef" :rules="ruleValidate">
                        <div class="item-header">学校信息</div>
                        <FormItem label="学校ID" prop="school_code">
                            <Input class="base-input" v-model="schoolInfo.school_code"></Input>
                        </FormItem>
                        <FormItem label="学校名称" prop="school_name">
                            <Input class="base-input" v-model="schoolInfo.school_name"></Input>
                        </FormItem>
                        <FormItem label="学校管理员" v-if="schoolInfo.id">
                            <div class="admin-area flex-s-c base-input">
                                <div class="admin-list f-wrap">
                                    <div class="admin-item" v-for="(item, index) in adminList" :key="index">
                                        {{item.name}}
                                    </div>
                                </div>
                                <a class="add-admin" @click="bindAdmin(schoolInfo.id)">更改</a>
                            </div>
                        </FormItem>
                        <div class="item-header">联系方式</div>
                        <FormItem label="联系人" prop="contact">
                            <Input class="base-input" v-model="schoolInfo.contact"></Input>
                        </FormItem>
                        <FormItem label="联系电话" prop="contact_way">
                            <Input class="base-input" v-model="schoolInfo.contact_way"></Input>
                        </FormItem>
                    </Form>
                    <!-- <div class="edit-foot">
                        <Button class="m-r-10" type="primary" @click="checkUpdate">保存</Button>
                        <Button @click="confirmUpdate">取消</Button>
                    </div> -->
                    <Spin fix v-if="pageLoading"></Spin>
                </div>
            <!-- </div> -->
            <div slot="footer">
                <Button class="m-r-10" type="primary" @click="checkUpdate">保存</Button>
                <Button @click="confirmUpdate">取消</Button>
            </div>
        </rewrite-drawer>
        <bindAdmin ref="bindAdminRef"></bindAdmin>
    </div>
</template>

<script>
import bindAdmin from "./bind-admin/index";
export default {
    name: "editSchoolMaint",
    props: {
        title: {
            type: String,
            default: "标题",
        },
    },
    components: { bindAdmin },
    data() {
        return {
            drawerShow: false,
            structureId: 0,
            schoolInfo: {
                id: 0,
                school_name: "",
                contact: "",
                contact_way: "",
                school_code:""
            },
            adminList: [],
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
        showDrawer({ id }) {
            this.$refs["formDataRef"] && this.$refs["formDataRef"].resetFields();
            this.structureId = id || 0;
            this.drawerShow = true;
            this.schoolInfo = {};
            this.onLoadData(id);
        },
        onLoadData(id) {
            if (!id) return Promise.reject();
            this.pageLoading = true;
            return this.$MainApi
                .schoolMaintInfo({
                    data: {
                        id: id,
                    },
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        let get_type = data.get_type || {};
                        let schoolInfo = {
                            id: data.id,
                            school_name: data.structure_name,
                            school_type: get_type.school_type,
                            school_code: get_type.school_code,
                            contact: data.contact,
                            contact_way: data.contact_way,
                        };
                        let adminList = [];
                        if (data.get_admin instanceof Array) {
                            adminList = data.get_admin;
                        } else {
                            adminList = [data.get_admin];
                        }
                        this.adminList = this.installAdmin(adminList);
                        this.schoolInfo = schoolInfo;
                    }
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        installAdmin(data) {
            let arr = [];
            for (let i = 0; i < data.length; i++) {
                let get_user = data[i].get_user || {};
                let item = {
                    id: data[i].admin_id,
                    name: get_user.user_name,
                };
                arr.push(item);
            }
            return arr;
        },
        removeAdmin() {},
        bindAdmin(schoolId) {
            this.$refs["bindAdminRef"] &&
                this.$refs["bindAdminRef"].showModal({
                    schoolId: schoolId,
                    confirm: (data) => {
                        this.bindAdminEvent(data);
                    },
                });
        },
        bindAdminEvent(data) {
            if (data.length > 0) {
                let arr = [];
                for (let i = 0; i < data.length; i++) {
                    arr.push({
                        id: data[i].admin_id,
                        name: data[i].admin_name,
                    });
                }
                this.adminList = arr;
            } else {
                this.adminList = [];
            }
        },
        checkUpdate() {
            this.$refs["formDataRef"].validate((valid) => {
                if (valid) {
                    this.updateSchoolInfo();
                } else {
                    this.$Message.warning("请完善信息");
                }
            });
        },
        updateSchoolInfo() {
            let schoolInfo = this.schoolInfo || {};
            !Number(schoolInfo.id) && delete schoolInfo.id;
            let req = Number(schoolInfo.id)
                ? "updateSchoolMaint"
                : "addSchoolMaint";
            this.pageLoading = true;
            return this.$MainApi[req]({
                data: schoolInfo,
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
    border: 1px solid #efefef;
    padding-bottom: 20px;
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
}
</style>