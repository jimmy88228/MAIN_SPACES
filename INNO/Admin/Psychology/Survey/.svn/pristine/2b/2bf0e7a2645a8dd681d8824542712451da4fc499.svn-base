<template>
    <div>
        <rewrite-drawer v-model="drawerShow" :inner="true" :width="418">
            <div class="bold" slot="header">{{title}}</div>
            <div class="edit-cont-area">
                <Form :label-width="100" :model="careInfo" ref="careInfoForm" :rules="ruleValidate">
                    <FormItem label="选择人员" prop="user_id">
                        <div class="choose-member">
                            <custom-input type="text" size="large" class="base-320" readonly v-model="memberInfo.student_name"></custom-input>
                            <a @click="chooseMember" class="choose-member-link">选择</a>
                        </div>
                    </FormItem>
                    <FormItem label="预警等级" prop="level_id">
                        <data-select size="large" type="warn-level" class="base-320" valueKey="id" nameKey="level_name" v-model="careInfo.level_id"></data-select>
                    </FormItem>
                    <FormItem label="预警记录" prop="examine_remark">
                        <custom-input  class="base-320" size="large" type="textarea" v-model="careInfo.examine_remark"></custom-input>
                    </FormItem>
                </Form>
                <Spin fix v-if="pageLoading"></Spin>
            </div>
            <div slot="footer">
                <Button class="m-r-10" type="primary" @click="checkExamineInfo">保存</Button>
                <Button @click="drawerShow = false">取消</Button>
            </div>
        </rewrite-drawer>
        <!-- <Drawer class="page-drawer-area" :transfer="false" :inner="true" :closable="false" v-model="drawerShow" :width="418">
            <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'">
                <div class="edit-title bold">{{title}}</div>
                <div class="edit-cont" v-bar>
                    <div class="edit-cont-area">
                        <Form :label-width="100" :model="careInfo" ref="careInfoForm" :rules="ruleValidate">
                            <FormItem label="选择人员" prop="user_id">
                                <div class="choose-member">
                                    <Input class="base-320" readonly v-model="memberInfo.student_name"></Input>
                                    <a @click="chooseMember" class="choose-member-link">选择</a>
                                </div>
                            </FormItem>
                            <FormItem label="预警等级" prop="level_id">
                                <data-select type="warn-level" class="base-320" valueKey="id" nameKey="level_name" v-model="careInfo.level_id"></data-select>
                            </FormItem>
                            <FormItem label="预警记录" prop="examine_remark">
                                <Input class="base-320" type="textarea" v-model="careInfo.examine_remark"></Input>
                            </FormItem>
                        </Form>
                        <div class="edit-foot">
                            <Button class="m-r-10" type="primary" @click="checkExamineInfo">保存</Button>
                            <Button @click="drawerShow = false">取消</Button>
                        </div>
                        <Spin fix v-if="pageLoading"></Spin>
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
            default: "添加关爱人员",
        },
    },
    data() {
        return {
            drawerShow: false,
            careInfo: {
                school_id: 0,
                user_id: "",
                level_id: "",
                examine_remark: "",
            },
            memberInfo: {},
            ruleValidate: {
                user_id: [
                    {
                        required: true,
                        type: "number",
                        validator: this._checkThanInt,
                        message: "请选择用户",
                        trigger: "blur",
                    },
                ],
                examine_remark: [
                    {
                        required: true,
                        type: "string",
                        validator: this._checkString,
                        message: "请填写预警记录",
                        trigger: "blur",
                    },
                ],
                level_id: [
                    {
                        required: true,
                        type: "number",
                        validator: this._checkThanInt,
                        message: "请选择预警等级",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        showDrawer() {
            this.drawerShow = true;
            this.$refs["careInfoForm"] && this.$refs["careInfoForm"].resetFields();
            this.careInfo.user_id = "";
            this.careInfo.level_id = "";
            this.careInfo.examine_remark = "";
            this.careInfo.school_id = this._structureId;
            this.memberInfo = {};
        },
        chooseMember() {
            this.$UIModule({
                mode: "member-view",
                props: {
                    isHideTabs: true,
                    currentTab: "student",
                    memberKey: "user_id"
                },
                options: {
                    selectData: this.memberInfo.user_id ? [this.memberInfo] : []
                },
                success:(data)=>{
                    if(data.length > 0){
                        this.careInfo.user_id = data[0].user_id || 0;
                        this.memberInfo = data[0] || {};
                    }
                    
                }
            });
        },
        checkExamineInfo() {
            this.$refs["careInfoForm"].validate((valid) => {
                if (valid) {
                    this.updateExamineInfo();
                } else {
                    this.$Message.warning("请完善信息");
                }
            });
        },
        updateExamineInfo() {
            let careInfo = this.careInfo || {};
            this.pageLoading = true;
            return this.$MainApi
                .forewarningAddPeople({
                    data: careInfo,
                })
                .then((res) => {
                    if (res.code) {
                        this.$Message.success(res.message || "添加成功");
                        this.confirmUpdate();
                    } else {
                        this.$Message.warning(res.message || "添加失败");
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
.edit-cont-area {
    .choose-member {
        position: relative;
        .choose-member-link {
            position: absolute;
            top: 50%;
            right: 4px;
            transform: translateY(-50%);
            height: 30px;
            line-height: 30px;
            background-color: #fff;
            padding: 0px 5px;
            z-index: 2;
        }
    }
}
</style>