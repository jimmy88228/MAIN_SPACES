<template>
    <div>
        <Drawer class="page-drawer-area meddle-drawer" :transfer="false" :inner="true" :closable="false" v-model="drawerShow" :width="450">
            <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'">
                <div class="edit-title bold">{{title}}</div>
                <div class="edit-cont" v-bar>
                    <div class="edit-cont-area">
                        <Form :label-width="100" :model="meddleInfo" ref="meddleInfoForm" :rules="ruleValidate">
                            <FormItem label="评估建议" prop="examine_remark">
                                <custom-input  class="base-320 remark" type="textarea" v-model="meddleInfo.examine_remark" :maxlength="200" :show-word-limit="true"></custom-input>
                            </FormItem>
                            <FormItem label="干预方式" prop="intervention_id">
                                <data-select 
                                class="base-320" 
                                type="EAP-meddle" 
                                v-model="meddleInfo.intervention_id" 
                                valueKey="id" 
                                :isAuto="false"
                                ref="meddleSelectRef" 
                                :params="{ token: accessToken, full_url: apiUrl + '/custom/surveyIntervention' }" 
                                nameKey="intervention_name"></data-select>
                            </FormItem>
                            <FormItem label="干预日期" prop="examine_time">
                                <date-time class="base-320" type="datetime" v-model="meddleInfo.examine_time"></date-time>
                            </FormItem>
                            <FormItem label="干预者">
                                <p class="m-l-10">{{studentInfo.name}}</p>
                            </FormItem>
                            <FormItem label="预警等级" prop="level_id">
                                <div class="flex-b-c warn-level-item">
                                    <data-select 
                                    :isAuto="false" 
                                    :params="{ token: accessToken, full_url: apiUrl + '/custom/surveyLevel' }" 
                                    class="base-320" 
                                    :isShowDefault="true" 
                                    type="EAP-warn-level" 
                                    ref="warnLevelSelectRef" 
                                    v-model="meddleInfo.level_id" 
                                    valueKey="id" 
                                    nameKey="level_name">
                                        <Option slot="default-option" :value="0">预警解除</Option>
                                    </data-select>
                                    <a class="w-nowrap level-a" @click="warnLevelClick">调整等级</a>
                                </div>
                            </FormItem>
                        </Form>
                        <div class="edit-foot">
                            <Button class="m-r-10" type="primary" @click="checkMeddleInfo">保存</Button>
                            <Button @click="drawerShow = false">取消</Button>
                        </div>
                        <Spin fix v-if="pageLoading"></Spin>
                    </div>
                </div>

            </div>
        </Drawer>
    </div>
</template>

<script>
export default {
    name: "editSchoolMaint",
    props: {
        title: {
            type: String,
            default: "新增记录",
        },
    },
    components: { },
    data() {
        return {
            drawerShow: false,
            meddleInfo: {
                school_id: 0,
                user_id: 0,
                intervention_id: 0,
                level_id: -1,
                examine_remark: "",
                examine_time: "",
            },
            studentInfo:{},
            accessToken: "",
            apiUrl: "",
            ruleValidate: {
                examine_remark: [
                    {
                        required: true,
                        type: "string",
                        validator: this._checkString,
                        message: "请完善干预记录",
                        trigger: "blur",
                    },
                ],
                intervention_id: [
                    {
                        required: true,
                        type: "number",
                        validator: this._checkThanInt,
                        message: "请选择干预方式",
                        trigger: "blur",
                    },
                ],
                level_id: [
                    {
                        required: true,
                        type: "number",
                        validator: this._checkNativeInt,
                        message: "请选择预警等级",
                        trigger: "blur",
                    },
                ],
                examine_time: [
                    {
                        required: true,
                        type: "string",
                        validator: this._checkString,
                        message: "请选择干预时间",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        showDrawer({ userId, name, accessToken, apiUrl}) {
            this.drawerShow = true;
            this.$refs["meddleInfoForm"] && this.$refs["meddleInfoForm"].resetFields();
            this.meddleInfo.user_id = userId || 0;
            this.meddleInfo.intervention_id = 0;
            this.meddleInfo.level_id = -1;
            this.meddleInfo.examine_remark = "";
            this.meddleInfo.examine_time = "";
            this.studentInfo.name = name || "";
            this.accessToken = accessToken || "";
            this.apiUrl = apiUrl || "";
            this.initSelect();
        },
        initSelect(){
            this.$nextTick(()=>{
                this.$refs["warnLevelSelectRef"] && this.$refs["warnLevelSelectRef"].getData();
                this.$refs["meddleSelectRef"] && this.$refs["meddleSelectRef"].getData();
            })
        },
        warnLevelClick() {
            this.$refs["warnLevelSelectRef"] &&
                this.$refs["warnLevelSelectRef"].toggleMenu();
        },
        checkMeddleInfo() {
            this.$refs["meddleInfoForm"].validate((valid) => {
                if (valid) {
                    this.updateMeddleInfo();
                } else {
                    this.$Message.warning("请完善信息");
                }
            });
        },
        updateMeddleInfo() {
            let meddleInfo = this.meddleInfo || {};
            this.pageLoading = true;
            return this.$MainApi
                .getBackstageApi({
                    data: {
                        token: this.accessToken,
                        admin_name: this._adminName,
                        data: {
                            ...meddleInfo,
                            intervention_id: meddleInfo.intervention_id + "",
                        },
                        url: "forewarningSurvey/addRecord",
                        full_url: this.apiUrl + "/forewarningSurvey/addRecord"
                    },
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
.page-drawer-area {
    .edit-cont-area {
        border: 0 !important;
    }
    .warn-level-item {
        position: relative;
        .level-a {
            position: absolute;
            top: 50%;
            right: 1px;
            height: 30px;
            line-height: 30px;
            transform: translateY(-50%);
            padding: 0px 5px;
            background-color: #fff;
        }
    }
}
</style>
<style lang="less">
.meddle-drawer {
    .remark {
        textarea {
            min-height: 180px;
        }
    }
}
</style>