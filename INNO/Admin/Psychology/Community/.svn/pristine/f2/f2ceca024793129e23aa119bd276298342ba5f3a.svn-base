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
                        <FormItem label="分组" prop="group_id">
                            <!-- <data-cascader :transfer="true" v-if="drawerShow" placeholder="请选择组织" :isAuto="false" :isLimitMain="true" ref="organizeCascader" :reqData="{ type: 2 }" class="base-320" type="organize" v-model="memberInfo.structure_ids" valueKey="id" labelKey="structure_name" @change="changeStructure"></data-cascader> -->
                            <data-select 
                            class="base-320"
                            ref="memberGroupSelectRef"
                            type="memberGroup" 
                            :isAuto="false"
                            :params="{page: 1, pageSize: 1000}"
                            v-model="memberInfo.group_id"
                            ></data-select>
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
                member_name: "",
                mobile_phone: "",
                group_id: 0,
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
            },
        };
    },
        methods: {
        dismiss(){
            this.drawerShow = false;
        },
        showDrawer(memberInfo = {}) {
            this.drawerShow = true;
            this.$refs["formDataRef"] && this.$refs["formDataRef"].resetFields();
            let _memberInfo = {
                id: memberInfo.id || 0,
                group_id: memberInfo.group_id || 0,
                member_name: memberInfo.member_name || "",
                mobile_phone: memberInfo.mobile_phone,
            };
            this.memberInfo = _memberInfo;
            this.$refs["memberGroupSelectRef"] && this.$refs["memberGroupSelectRef"].getData();
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
            let req = Number(memberInfo.id) ? "structureGroupMemberUpdate" : "structureGroupMemberAdd";
            this.pageLoading = true;
            return this.$MainApi[req]({
                data: memberInfo,
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