<template>
    <div>
        <Drawer class="page-drawer-area" :transfer="false" :inner="true" :closable="false" v-model="drawerShow" :width="450">
            <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'">
                <div class="edit-title bold">{{title}}</div>
                <div class="edit-cont" v-bar>
                    <div class="edit-cont-area">
                        <Form :label-width="120" :model="examineInfo" ref="examineInfoForm" :rules="ruleValidate">
                            <div class="item-header">人员信息</div>
                            <FormItem label="姓名">
                                {{userInfo.member_name}}
                            </FormItem>
                            <FormItem label="组织">
                                {{userInfo.structure_name}}
                            </FormItem>
                            <FormItem label="心理预警等级">
                                {{examineInfo.show_level_name || "无"}}
                            </FormItem>
                            <div class="item-header">审核情况</div>
                            <FormItem label="审核情况" prop="state">
                                <RadioGroup v-model="examineInfo.state">
                                    <Radio :label="item.id" v-for="item in examineType" :key="item.key">{{item.name}}</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="预警等级" prop="level_id" v-if="examineInfo.state == 1">
                                <data-select class="base-320" type="warn-level" ref="gradeSelectRef" valueKey="id" nameKey="level_name" v-model="examineInfo.level_id"></data-select>
                            </FormItem>
                            <FormItem label="预警记录" prop="examine_remark">
                                <Input class="base-textarea" type="textarea" v-model="examineInfo.examine_remark"></Input>
                            </FormItem>
                        </Form>
                        <div class="edit-foot" v-if="examineState == 0">
                            <Button class="m-r-10" type="primary" @click="checkExamineInfo">保存</Button>
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
    name: "editExamine",
    props: {
        title: {
            type: String,
            default: "标记等级",
        },
    },
    components: {  },
    data() {
        return {
            drawerShow: false,
            examineType: [
                {
                    id: 1,
                   name: "需预警" 
                },
                {
                    id: 2,
                   name: "无需预警" 
                },
            ],
            examineInfo: {
                record_id: 0,
                state: 1,
                level_id: 0,
                examine_remark: "",
                model_id: 0
            },
            examineState: 0,
            userInfo: {},
            ruleValidate: {
                examine_remark: [
                    {
                        required: true,
                        type: "string",
                        validator: this._checkString,
                        message: "请完善预警记录",
                        trigger: "blur",
                    },
                ],
                state: [
                    {
                        required: true,
                        type: "number",
                        validator: this._checkThanInt,
                        message: "请选择审核类型",
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
        showDrawer(examineInfo = {}) {
            this.drawerShow = true;
            this.$refs["examineInfoForm"] && this.$refs["examineInfoForm"].resetFields();
            this.examineState = examineInfo.state || 0;
            let getrank = examineInfo.get_warn_user && examineInfo.get_warn_user.getrank||{};
            let _examineInfo = {
                ...examineInfo,
                record_id: examineInfo.record_id,
                state: examineInfo.state,
                level_id: getrank.id || 0,
                examine_remark: examineInfo.examine_remark,
                model_id:examineInfo.model_id
            };
            this.userInfo = examineInfo.get_record || {};
            this.$set(this, "examineInfo", _examineInfo);
            console.log('examineInfo',this.examineInfo)
        },
        checkExamineInfo() {
            this.$refs["examineInfoForm"].validate((valid) => {
                if (valid) {
                    this.updateExamineInfo();
                } else {
                    this.$Message.warning("请完善信息");
                }
            });
        },
        updateExamineInfo() {
            let examineInfo = this.examineInfo || {};
            this.pageLoading = true;
            return this.$MainApi
                .forewarningSignGrade({
                    data: examineInfo,
                })
                .then((res) => {
                    if (res.code) {
                        this.$Message.success(res.message || "编辑成功");
                        this.confirmUpdate();
                    } else {
                        this.$Message.warning(res.message || "编辑失败");
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
    .edit-cont-area{
      border: 0 !important;
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