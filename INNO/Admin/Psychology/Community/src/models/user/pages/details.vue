<template>
    <div class="bg-page cev-root spin-box">
        <div class="cev-root" v-bar>
            <div class="bg-shadow padding20">
                <h3 class="card-title">会员详情:</h3>
                <CellGroup class="grid">
                    <Row class="row">
                        <Col class="col group" span="22">
                        <Row class="row">
                            <Col class="col" span="8">
                            <Cell title="会员名" :extra="userInfo.userName" />
                            </Col>
                            <Col class="col" span="8">
                            <Cell title="性别" :extra="userInfo.gender == 0 ? '未知' : userInfo.gender == 1 ? '男' : '女'" />
                            </Col>
                            <Col class="col" span="8">
                            <Cell title="手机号" :extra="userInfo.mobilePhone || '---'"/>
                            </Col>
                        </Row>
                        <Row class="row">
                            <Col class="col" span="12">
                            <Cell title="注册IP" :extra="userInfo.ip" />
                            </Col>
                            <Col class="col" span="12">
                            <Cell title="注册时间" :extra="userInfo.createTime" />
                            </Col>
                            <!-- <Col class="col" span="8">
                            <Cell title="最近登录时间" :extra="userInfo.lastLoginTime" />
                            </Col> -->
                        </Row>
                        </Col>
                        <Col class="col img-avatar-box" span="2">
                        <img class="img-avatar" :src="userInfo.avatar" />
                        </Col>
                    </Row>
                    <Row class="row">
                        <Col class="col" span="8">
                        <Cell title="国家" :extra="userInfo.country||'---'" />
                        </Col>
                        <Col class="col" span="8">
                        <Cell title="省" :extra="userInfo.province||'---'" />
                        </Col>
                        <Col class="col" span="8">
                        <Cell title="市" :extra="userInfo.city||'---'" />
                        </Col>
                    </Row>
                </CellGroup>
            </div>
        </div>
        <Spin v-if="loading" class="spin" size="large" fix></Spin>
    </div>
</template>

<script>
import { MainApi } from "@/helper/manager/http-manager";
export default {
    mixins: [MainApi],
    data() {
        return {
            loading: false,
            userInfo: {}
        };
    },
    mounted() {
        this.userId = this.$route.query.userId;
        this.loadData();
    },
    methods: {
        loadData() {
            if (!this.userId) {
                this.$Message.error("找不到用户");
                return;
            }
            this.loading = true;
            MainApi.postUserDetail({
                data: {
                    userId: this.userId
                }
            })
                .then(res => {
                    if (res.code === "1") {
                        this.userInfo = res.data || {};
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    this.$Message.error(msg || "获取用户信息失败");
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>
<style>
    #ivu-cell-h .ivu-cell-item {
        height: 100px;
    }
</style>

<style lang="less" scoped>
    .img-avatar-box {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        max-height: 120px;
        min-height: 120px;
        .img-avatar {
            width: 80px;
            height: 80px;
        }
    }
    .grid {
        margin: 10px;
    }
    .grid {
        border: 1px dashed #ddd;
        .row {
            border-bottom: 1px dashed #ddd;
        }
        .col {
            height: 60px;
            padding: 10px;
            position: relative;
        }
        .col::after {
            content: "";
            position: absolute;
            top: 0;
            width: 2px;
            bottom: 0;
            right: 0;
            border-right: 1px dashed #ddd;
        }
        .col.group {
            height: unset;
            padding: unset;
        }
    }
    .grid > .row:last-child {
        border-bottom: none;
    }
    .col > .row:last-child {
        border-bottom: none;
    }
    .row > .col:last-child::after {
        border-right: none;
    }
</style>
