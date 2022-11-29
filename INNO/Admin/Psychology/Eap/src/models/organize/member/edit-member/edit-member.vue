<template>
    <Drawer class="page-drawer-area page-drawer-area-member" :transfer="false" :inner="true" :closable="false" v-model="drawerShow" :width="450">
        <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'">
            <div class="edit-title bold">{{title}}</div>
            <div class="edit-cont" v-bar>
                <div class="edit-cont-area">
                    <Form :label-width="100" :model="memberInfo" ref="formDataRef" :rules="ruleValidate">
                        <FormItem label="姓名" prop="member_name">
                            <div v-if="memberInfo.user_id">{{memberInfo.member_name}}</div>
                            <Input v-else class="base-320" v-model="memberInfo.member_name"></Input>
                            
                        </FormItem>
                        <FormItem label="手机号" prop="mobile_phone">
                            <div v-if="memberInfo.user_id">{{memberInfo.mobile_phone}}</div>
                            <Input v-else class="base-320" v-model="memberInfo.mobile_phone"></Input>
                        </FormItem>
                        <FormItem label="性别" v-if="memberInfo.id">
                            <span v-if="memberInfo.gender == 0">保密</span>
                            <span v-else-if="memberInfo.gender == 1">男</span>
                            <span v-else-if="memberInfo.gender == 2">女</span>
                            <span v-else>未知</span>
                        </FormItem>
                        <FormItem label="组织" prop="structure_ids">
                            <data-cascader :transfer="true" v-if="drawerShow" placeholder="请选择组织" :isAuto="false" :isLimitMain="true" ref="organizeCascader" :reqData="{ type: 2 }" class="base-320" type="organize" v-model="memberInfo.structure_ids" valueKey="id" labelKey="structure_name" @change="changeStructure"></data-cascader>
                        </FormItem>
                    </Form>
                    <div class="edit-foot">
                        <Button type="primary" @click="checkUpdateInfo">保存</Button>
                        <Button @click="dismiss()">取消</Button>
                    </div>
                    <Spin fix v-if="pageLoading"></Spin>
                </div>
            </div>
        </div>
    </Drawer>
</template>

<script>
export default {
    props: {
        title: String,
    },
    data() {
        return {
            drawerShow: false,
            memberInfo: {
                id: 0,
                user_id: 0,
                member_name: "",
                structure_id: 0,
                structure_ids: [],
                mobile_phone: "",
            },
            ruleValidate: {
                member_name: [
                    {
                        required: true,
                        validator: this._checkString,
                        trigger: "blur",
                        message: "请填写人员名称",
                    },
                ],
                mobile_phone: [
                    {
                        required: true,
                        validator: this._checkPhone,
                        trigger: "blur",
                    },
                ],
                gender: [
                    {
                        required: true,
                        validator: this._checkThanInt,
                        message: "请选择性别",
                        trigger: "blur",
                    },
                ],
                structure_ids: [
                    {
                        required: true,
                        validator: this._checkArray,
                        message: "请选择组织",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
        methods: {
        dismiss(){
            this.drawerShow = false;
        },
        changeStructure(value){
            console.log("value", value);
        },
        showDrawer(memberInfo = {}) {
            this.drawerShow = true;
            this.$refs["formDataRef"] && this.$refs["formDataRef"].resetFields();
            let _memberInfo = {
                id: memberInfo.id || 0,
                gender: memberInfo.gender,
                member_name: memberInfo.member_name || "",
                structure_id: memberInfo.structure_id || 0,
                structure_ids: (memberInfo.parent_id_info && memberInfo.parent_id_info.length > 0) ? [0, ...memberInfo.parent_id_info] : [],
                mobile_phone: memberInfo.mobile_phone,
                user_id: memberInfo.user_id
            };
            this.memberInfo = _memberInfo;
            this.$nextTick(()=>{
                this.$refs["organizeCascader"] && this.$refs["organizeCascader"].getData();
            })
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
            let memberInfo = this.memberInfo || {};
            !Number(memberInfo.id) && delete memberInfo.id;
            let req = Number(memberInfo.id) ? "structureMemberUpdate" : "structureMemberAdd";
            this.pageLoading = true;
            return this.$MainApi[req]({
                data: {
                    ...memberInfo,
                    structure_id: memberInfo.structure_ids.slice(-1)[0],
                },
                other: {
                    isErrorMsg: true
                }
            })
            .then((res) => {
                if (res.code) {
                    this.$Message.success(res.message || "操作成功");
                    this.dismiss();
                    this.$emit("confirm");
                } else {
                    this.$Message.warning(res.message || "操作失败");
                }
            })
            .finally(() => {
                this.pageLoading = false;
            });
        },
    },
    mounted() {},
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