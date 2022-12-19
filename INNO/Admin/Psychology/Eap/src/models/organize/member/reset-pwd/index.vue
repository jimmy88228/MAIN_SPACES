<template>
    <Drawer class="page-drawer-area" :transfer="false" :inner="true" :closable="false" v-model="drawerShow" :width="530">
        <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'">
            <div class="edit-title bold">{{title}}</div>
            <div class="edit-cont" v-bar>
                <div class="edit-cont-area">
                    <Form :label-width="100">
                        <FormItem label="用户名">{{adminInfo.admin_name}}</FormItem>
                        <FormItem label="账号">
                            <Input class="base-input" readonly v-model="adminInfo.admin_account"></Input>
                        </FormItem>
                        <FormItem label="密码">
                            <Input class="base-input" readonly v-model="adminInfo.admin_passwd"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="resetPwd">重置密码</Button>
                            <Button @click="drawerShow = false">取消</Button>
                        </FormItem>
                    </Form>
                    <Spin fix v-if="pageLoading"></Spin>
                </div>
            </div>
        </div>
    </Drawer>
</template>

<script>
export default {
    name: "reset-pwd",
    props: {
        title: {
            type: String,
            default: "重置密码",
        },
    },
    data() {
        return {
            drawerShow: false,
            adminInfo: {}
        };
    },
    methods: {
        showDrawer({ adminInfo = {} }) {
            this.drawerShow = true;
            this.adminInfo = adminInfo || {};
            // this.onLoadData(adminInfo.admin_id)
        },
        onLoadData(adminId) {
            if (!adminId) return Promise.reject();
            this.pageLoading = true;
            return this.$MainApi
                .peopleInfo({
                    data: {
                        admin_id: adminId,
                    },
                    other: {
                        isErrorMsg: true
                    }
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        this.adminInfo = data;
                    }
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        resetPwd() {
          let adminId = this.adminInfo.admin_id;
          if (!Number(adminId)) {
                this.$Message.warning("无效人员id");
                return Promise.reject();
            }
            this.pageLoading = true;
            return this.$MainApi
                .peopleRest({
                    data: {
                        admin_id: adminId,
                    },
                })
                .then((res) => {
                    if (res.code) {
                        this.$Message.success(res.message || "重置成功");
                        this.drawerShow = false;
                        return Promise.resolve();
                    } else {
                        this.$Message.warning(res.message || "重置失败");
                        return Promise.reject();
                    }
                }).finally(()=>{
                  this.pageLoading = false;
                })
            
        },
    },
};
</script>

<style lang="less" scoped>
@import "@/assets/css/variables.less";
.page-drawer-area {
    .edit-cont-area {
        border: 0 none !important;
    }
}
</style>