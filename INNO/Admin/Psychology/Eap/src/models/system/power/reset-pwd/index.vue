<template>
    <Drawer class="page-drawer-area" :transfer="false" :inner="true" :closable="false" v-model="drawerShow" :width="530">
        <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'">
            <div class="edit-title bold">{{title}}</div>
            <div class="edit-cont" v-bar>
                <div class="edit-cont-area">
                    <Form :label-width="100">
                        <FormItem label="用户名">{{adminInfo.user_name}}</FormItem>
                        <FormItem label="账号">
                            <Input class="base-input" readonly v-model="adminInfo.account"></Input>
                        </FormItem>
                        <FormItem label="密码">
                            <Input class="base-input" readonly v-model="passwd"></Input>
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
            adminInfo: {},
            passwd:"",
        };
    },
    methods: {
        showDrawer({ adminInfo = {} }) {
            this.drawerShow = true;
            this.adminInfo = adminInfo || {};
            this.passwd = adminInfo.passwd_salt? '******' : adminInfo.pwd;
        },
        resetPwd() {
          let id = this.adminInfo.id;
          if (!Number(id)) {
                this.$Message.warning("无效人员id");
                return Promise.reject();
            }
            this.pageLoading = true;
            return this.$MainApi
                .adminUserPasswordReset({
                    data: {
                        id,
                    },
                })
                .then((res) => {
                    if (res.code) {
                        this.$Message.success(res.message || "重置成功");
                        this.drawerShow = false;
                        this.$emit('resetPwd')
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