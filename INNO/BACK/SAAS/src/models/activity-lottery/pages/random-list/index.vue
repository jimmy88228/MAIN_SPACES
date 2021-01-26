<template>
    <div class="cev-root bg-page spin-box">
        <div class="cev-root" v-bar>
            <div class="bg-shadow padding20 list-box">
                <div class="cev-toolbar">
                    <div class="left">
                        {{ title }}
                    </div>
                    <div class="right">
                        <Input class="inputable" placeholder="请输入搜索内容" v-model="keywords" clearable/>
                        <Button type="primary" @click="e=>loadData()">
                            <i class="iconfont min r5 icon-search"></i>搜索
                        </Button>
                        <Button type="primary" @click="activePrize" v-if="authJson.btn_set_random_rule">设为中奖</Button>
                        <Upload
                            :before-upload="handleBeforeUpload"
                            :format="format"  
                            action="/"
                            :on-format-error="handleFormatError"
                            class="_upload"
                            v-if="authJson.btn_import_random_rule"
                            >
                            <Button type="primary">
                                <i class="iconfont min r5 icon-add"></i>导入开奖名单
                            </Button>
                        </Upload>
                        <Poptip confirm title="是否清空开奖名单" @on-ok="cleanRandomUser" v-if="authJson.btn_clear_lottery_user">
                            <Button type="warning" >清空开奖名单</Button>
                        </Poptip>
                    </div>
                </div>
                <Table ref="table" class="table" :columns="columns" :data="list" border>
                    <template slot="action" slot-scope="p">
                        <div v-if="p.row.eroll_count > p.row.lottery_count">
                            <Input placeholder="开奖人数" type="number" @on-blur="e=>changeCount(e,p.row._index)"  clearable/>
                        </div>
                    </template>
                </Table>
                <Page
                    v-if="showPage"
                    :total="count"
                    :current="pageIndex"
                    :page-size="pageSize"
                    :page-size-opts="pageSizeOpts"
                    @on-change="e=>loadData(e)"
                    @on-page-size-change="handlePageSizeChange"
                    show-sizer
                    show-elevator
                    show-total
                    transfer
                ></Page>
            </div>
        </div>
        <Spin v-if="loading" class="spin" size="large" fix></Spin>
    </div>
</template>

<script>
import { MainApi } from "@/helper/manager/http-manager";
import ListPageMixin from "@/helper/mixin/list-page";
import StringHelper from "@/helper/utils/string-util";
import Mixin from "./mixin";
export default {
    name: "RandomList",
    mixins: [ListPageMixin, Mixin],
    components: {},
    data() {
        return {
            keywords: "",
            activeModel: false,
            format: ["xls", "xlsx"],
            authJson: {}
        };
    },
    mounted() {
        this.initParams();
        this.getRuleDetail().finally(() => {
            this.loadData();
        });
    },
    methods: {
        initParams() {
            let query = this.$route.query || {};
            this.actId = query.actId;
            this.ruleId = query.ruleId;
            this.title = query.title;
            this.authJson = this.$store.state.authJson || {}
        },
        onLoadData(index, data) {
            this.loading = true;
            return MainApi.getEnrollInfoListBySpec({
                data: {
                    activityId: this.actId,
                    ruleId: this.ruleId,
                    keywords: this.keywords
                }
            }).then(res => {
                if (res.code === "1") {
                    let list = res.data || [];
                    this.data = {
                        count: list.length,
                        list: list
                    };
                } else {
                    return Promise.reject(res.msg);
                }
            })
            .catch(msg => {
                if (msg && StringHelper.trim(msg)) {
                        this.$Message.error(msg || "加载失败");
                    }
            })
            .finally(() => {
                this.loading = false;
            });
        },
        getRuleDetail() {
            if (!parseInt(this.ruleId)) return Promise.reject();
            this.loading = true;
            return MainApi.getRule({
                params: {
                    id: this.ruleId
                }
            })
                .then(res => {
                    if (res.code === "1") {
                        let data = res.data || {};
                        let specList = data.specList || [];
                        let specsColumns = [];
                        for (let i = 0; i < specList.length; i++) {
                            specsColumns.push({
                                title: specList[i].specName,
                                align: "center",
                                key: "spec_val_" + i,
                                idKey: "spec_val_id_" + i
                            });
                        }
                        let columnsL = this.columns.slice(0, 1);
                        let columnsR = this.columns.slice(1);
                        this.columns = columnsL.concat(specsColumns).concat(columnsR);
                        this.specsColumns = specsColumns;
                    } else {
                        return Promise.reject(res.msg);
                    }
                })
                .catch(msg => {
                    if (msg && StringHelper.trim(msg)) {
                        this.$Message.error(msg || "数据加载失败");
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        changeCount(e, index) {
            let value = e.target.value;
            let list = this.data.list || [];
            list[index].inputValue = value;
        },
        activePrize() {
            let data = this.data.list || [];
            let specVals = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].inputValue > 0) {
                    let specValIdList = [];
                    for (let j = 0; j < this.specsColumns.length; j++) {
                        let idVal = parseInt(data[i][this.specsColumns[j].idKey]);
                        specValIdList.push(idVal);
                    }
                    specVals.push({
                        storeName: data[i].store_name,
                        num: data[i].inputValue,
                        specValIdList
                    });
                }
            }
            if (specVals.length > 0) {
                this.$Modal.confirm({
                    title: "提示",
                    content: "是否确认开奖",
                    onOk:(() => {
                        activePrizeReq.call(this, specVals);
                    })
                });
            } else {
                this.$Message.info("请设置中奖人数");
            }
        },
        diyNetData(api, url, data) {
            if (!api || !url || !data) {
                return Promise.reject();
            }
            return api[url]({ ...data }).then(res => {
                        if (res.code === "1") {
                            return Promise.resolve(res.data);
                        } else {
                            return Promise.reject(res.msg);
                        }
                    }).catch(msg => {
                        this.$Message.error(msg || "加载失败");
                        return Promise.reject();
                    }).finally(() => {
                        this.loading = false;
                    });
        },
        handleBeforeUpload(file) {
            let param = new FormData();
            param.append("lottery_goods_excel", file, file.name);
            let incParams = {
                params: {
                    activityId: this.actId,
                    ruleId: this.ruleId
                },
                data: param
            };
            return this.diyNetData(MainApi, "postLotteryExcel", incParams).then(res => {
                console.log("res", res);
                this.$Message.success(`成功导入${res}名用户`);
                this.loadData();
            });
        },
        handleFormatError(file) {
            this.$Notice.warning({
                title: "格式不正确",
                desc: `请上传：${this.format.join("、")} 格式的文件`
            });
        },
        cleanRandomUser(){
            this.loading = true;
            return MainApi.clearLotteryUser({
                data: {
                    activityId: this.actId,
                    ruleId: this.ruleId
                }
            })
            .then(res => {
                if (res.code === "1") {
                    this.$Message.info("操作成功");
                    this.loadData();
                } else {
                    return Promise.reject(res.msg);
                }
            })
            .catch(msg => {
                if (msg && StringHelper.trim(msg)) {
                    this.$Message.error(msg || "操作失败");
                }
            })
            .finally(() => {
                this.loading = false;
            });
        }
    }
};
function activePrizeReq(data) {
    this.loading = true;
    return MainApi.rankAddByGoods({
        data: {
            activityId: this.actId,
            ruleId: this.ruleId,
            specVals: data
        }
    })
    .then(res => {
        if (res.code === "1") {
            this.$Message.info("设置成功");
            this.$nextTick(() => {
                this.loadData();
            });
        } else {
            return Promise.reject(res.msg);
        }
    })
    .catch(msg => {
        if (msg && StringHelper.trim(msg)) {
            this.$Message.error(msg || "数据加载失败");
        }
    })
    .finally(() => {
        this.loading = false;
    });
}
</script>
<style lang="less">
    ._upload{
        ul{
            margin: 0;
        }
    }
</style>