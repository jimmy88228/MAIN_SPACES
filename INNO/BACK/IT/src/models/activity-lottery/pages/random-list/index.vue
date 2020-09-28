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
                        <Button type="primary" @click="activePrize">点击开奖</Button>
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
            activeModel: false
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
