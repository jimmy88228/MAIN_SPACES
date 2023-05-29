<template>
    <div class="act-table">
        <Table ref="myTable" :columns="columns" :data="list" border :loading="tableLoading">
            <template slot="create_time" slot-scope="{ row }">
                <div class="box">
                    <div class="item">
                        <div>{{row.create_time}}</div>
                    </div>
                </div>
            </template>
            <template slot="admin" slot-scope="{ row }">
                <div class="box">
                    <div class="item">
                        <div>{{row.admin_name || '--'}}</div>
                    </div>
                </div>
            </template>
            <template slot="template" slot-scope="{ row }">
                <div class="box">
                    <div class="item">
                        <div>{{row.template_name || '--'}}</div>
                    </div>
                </div>
            </template>
            <template slot="handle" slot-scope="{ row }">
                <div class="box">
                    <div class="flex-c-c flex1">
                        <a class="operate" @click="checkVisitLog(row)">查看</a>
                    </div>
                </div>
            </template>
        </Table>
        <rewrite-page :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
        <visitLog ref="visitLogRef"></visitLog>
    </div>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
import visitLog from "./components/visit-log.vue";
export default {
    name: "actRecordTable",
    mixins: [ListMixin, mixins],
    components: { visitLog },
    props: {
        userId: String | Number,
        type: String
    },
    data() {
        return {
        };
    },
    methods: {
        onLoadData(page, extraData) {
            return this.$MainApi
                .followRecord({
                    data: {
                        user_id: this.userId,
                        ...extraData,
                    },
                    other: {
                        isErrorMsg: true
                    }
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        this.data = {
                            total: data.total,
                            list: data.items,
                        };
                    }
                });
        },
        checkVisitLog(row){
            this.$refs["visitLogRef"] && this.$refs["visitLogRef"].show(row);
        }
    },
    mounted() {},
    watch: {
        userId: {
            handler(nV) {
                if (nV) this.loadData();
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less">
.act-table{ 
    .ivu-table-cell{
        height: 100%;
    }
    .ivu-table-cell-slot{
        height: 100%;
    } 
}
</style>
<style lang="less" scoped>
.act-table{ 
    .box{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .item{
        flex: 1;
        display: flex;
        align-items: center;
    }
    .item:first-child{
        margin-bottom: 5px;
    }
    .operate-area{
        margin-top: 0;
    }
}
</style>