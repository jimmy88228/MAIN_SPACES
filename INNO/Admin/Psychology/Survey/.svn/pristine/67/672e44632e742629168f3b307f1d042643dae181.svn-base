<template>
    <div>
        <Table ref="myTable" :columns="columns" :data="list" border :loading="tableLoading">
            <template slot="getrank" slot-scope="{ row, index }">
                {{row.getrank && row.getrank.level_name || "已解除"}}
            </template>
            <template slot="admin" slot-scope="{ row, index }">
                {{row.getadmin && row.getadmin.user_name || "--"}}
            </template>
            
        </Table>
        <rewrite-page :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    </div>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
export default {
    name: "psychicTable",
    mixins: [ListMixin, mixins],
    props: {
        userId: String | Number,
    },
    data() {
        return {};
    },
    methods: {
        onLoadData(page, extraData) {
            return this.$MainApi
                .psychologyFilesPsychic({
                    data: {
                        user_id: this.userId,
                        ...extraData,
                    },
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
        }
    },
    mounted() {},
    watch:{
        userId: {
            handler(nV) {
                if (nV) this.loadData();
            },
            immediate: true,
        },
    }
};
</script>

<style>
</style>