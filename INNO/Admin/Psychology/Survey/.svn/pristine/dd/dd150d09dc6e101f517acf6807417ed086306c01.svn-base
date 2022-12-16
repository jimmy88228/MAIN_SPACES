<template>
    <div>
        <rewrite-drawer class="edit-admin-drawer" :inner="true" v-model="drawerShow" :width="430">
            <div class="bold" slot="header">{{title}}</div>
            <div class="edit-cont-area">
                <Form :label-width="80" :model="teacherInfo" ref="teacherInfoForm" :hide-required-mark="true" :rules="ruleValidate">
                    <FormItem prop="name">
                        <span slot="label" :class="{'required-after': !Number(teacherInfo.user_id)}">姓名</span>
                        <p v-if="Number(teacherInfo.user_id)">{{teacherInfo.name}}</p>
                        <custom-input regType="name" class="base-input" v-model="teacherInfo.name" v-else></custom-input>
                    </FormItem>
                    <FormItem prop="mobile_phone">
                        <span slot="label" :class="{'required-after': !Number(teacherInfo.user_id)}">手机号</span>
                        <p v-if="Number(teacherInfo.user_id)">{{teacherInfo.mobile_phone}}</p>
                        <custom-input type="number" isInt :maxlength="11" class="base-input" v-else v-model="teacherInfo.mobile_phone"></custom-input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button class="m-r-10" type="primary" @click="checkTeacherInfo" v-if="!Number(teacherInfo.user_id)">保存</Button>
                <Button @click="drawerShow = false">{{Number(teacherInfo.user_id) ? '返回' : '取消'}}</Button>
            </div>
        </rewrite-drawer>
        <!-- <Drawer class="page-drawer-area" :transfer="false" :inner="true" :closable="false" v-model="drawerShow" :width="430">
            <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'" v-bar>
                <div>
                    <div class="edit-title bold">{{title}}</div>
                    <div class="edit-cont">
                        <div class="edit-cont-area">
                            <Form :label-width="80" :model="teacherInfo" ref="teacherInfoForm" :hide-required-mark="true" :rules="ruleValidate">
                                <FormItem prop="name">
                                    <span slot="label" :class="{'required-after': !Number(teacherInfo.user_id)}">姓名</span>
                                    <p v-if="Number(teacherInfo.user_id)">{{teacherInfo.name}}</p>
                                    <custom-input regType="name" class="base-input" v-model="teacherInfo.name" v-else></custom-input>
                                </FormItem>
                                <FormItem prop="mobile_phone">
                                    <span slot="label" :class="{'required-after': !Number(teacherInfo.user_id)}">手机号</span>
                                    <p v-if="Number(teacherInfo.user_id)">{{teacherInfo.mobile_phone}}</p>
                                    <custom-input type="number" isInt :maxlength="11" class="base-input" v-else v-model="teacherInfo.mobile_phone"></custom-input>
                                </FormItem>
                            </Form>
                            <div class="edit-foot">
                                <Button class="m-r-10" type="primary" @click="checkTeacherInfo" v-if="!Number(teacherInfo.user_id)">保存</Button>
                                <Button @click="drawerShow = false">{{Number(teacherInfo.user_id) ? '返回' : '取消'}}</Button>
                            </div>
                            <Spin fix v-if="pageLoading"></Spin>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer> -->
    </div>
</template>

<script>
export default {
    name: "editSchoolMaint",
    props: {
        title: {
            type: String,
            default: "编辑教师",
        },
    },
    components: { },
    data() {
        return {
            drawerShow: false,
            teacherInfo: {
                id: 0,
                user_id: 0,
                name: "",
                mobile_phone: "",
            },
            ruleValidate: {
                name: [
                    {
                        required: true,
                        type: "string",
                        validator: this._checkString,
                        message: "请填写老师名称",
                        trigger: "blur",
                    },
                ],
                mobile_phone: [
                    {
                        required: true,
                        type: "string",
                        validator: this._checkPhone,
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        showDrawer(teacherInfo = {}) {
            this.drawerShow = true;
            this.$refs["teacherInfoForm"] && this.$refs["teacherInfoForm"].resetFields(); 
            let _teacherInfo = {
                id: teacherInfo.id || 0,
                user_id: teacherInfo.user_id || 0,
                name: teacherInfo.name || "",
                mobile_phone: teacherInfo.mobile_phone || "",
            };
            this.$set(this, "teacherInfo", _teacherInfo);
            console.log("teacherInfo", this.teacherInfo)
        },
        checkTeacherInfo() {
            this.$refs["teacherInfoForm"].validate((valid) => {
                if (valid) {
                    this.updateTeacherInfo();
                } else {
                    this.$Message.warning("请完善信息");
                }
            });
        },
        updateTeacherInfo() {
            let teacherInfo = this.teacherInfo || {};
            this.pageLoading = true;
            let req = teacherInfo.id ? 'teacherManagementUpdate' : 'teacherManagementAdd'
            return this.$MainApi[req]({
                    data: teacherInfo,
                })
                .then((res) => {
                    if (res.code) {
                        this.$Message.success(res.message || (teacherInfo.id ? '编辑成功' : '新增成功'));
                        this.confirmUpdate();
                    } else {
                        this.$Message.warning(res.message || (teacherInfo.id ? '编辑失败' : '新增失败'));
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
// @import "@/assets/css/variables.less";
// .page-drawer-area {
//     .edit-cont-area{
//       border: 0 !important;
//     }
//     .edit-title{
//         margin-bottom: 20px;
//     }
// }
</style>