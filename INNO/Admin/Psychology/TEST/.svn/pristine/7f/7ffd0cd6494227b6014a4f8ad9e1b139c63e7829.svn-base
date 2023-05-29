<template>
    <hold-layout :isFull="true">
        <searchForm @search="loadData" @create="editOrgan()" @removeIds="batchRemoveItem()" :searchForm="searchForm"></searchForm>
        <rewrite-table ref="myTable" class="full-table" :columns="columns" :data="list" :loading="tableLoading" @on-selection-change="selectAct">
            <template slot="time" slot-scope="{ row }">
                <div class="time-p flex-s-c">
                    <p class="t-item">{{row.start_time}}</p>~<p class="t-item">{{row.end_time}}</p>
                </div>
            </template>
            <template slot="state" slot-scope="{ row }">
                <Tag type="dot" :color="stateKey[row.state].type">{{row.state_str}}</Tag>
            </template>
            <template slot="handle" slot-scope="{ row, index }">
                <div class="operate-area">
                    <p class="operate-line">
                        <a class="operate" @click="editOrgan(row.id)">编辑</a>
                        <!-- <a class="operate" @click="removeItem(row.id, index)">删除</a> -->
                    </p>
                </div>
            </template>
        </rewrite-table>
        <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import mixins from "./mixins";
import searchForm from "./search-form.vue";
export default {
    name: "gaugeIndex",
    mixins: [ListMixin, mixins],
    components: { searchForm },
    data() {
        return {
            searchForm: {
                searchq: ""
            },
            selectData: [],
            stateKey: {
                "-1": {
                    name: "全部",
                    type: "primary",
                },
                0: {
                    name: "关闭",
                    type: "error",
                },
                1: {
                    name: "未开始",
                    type: "primary",
                },
                2: {
                    name: "进行中",
                    type: "success",
                },
                3: {
                    name: "已结束",
                    type: "warning"
                },
            },
        };
    },
    computed: {
        ids() {
            let selectData = this.selectData || [];
            let ids = [];
            if (selectData instanceof Array) {
                for (let i = 0; i < selectData.length; i++) {
                    if (selectData[i].id) {
                        ids.push(selectData[i].id);
                    }
                }
            }
            return ids;
        },
    },
    methods: {
        onLoadData(page, extraData) {
            return this.$MainApi.transferCourtyardList({
              data: {
                  ...this.searchForm,
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
                      list: data.items
                  };
              }
          });
        },
        selectAct(selectData) {
            this.selectData = selectData || [];
        },
        editOrgan(id) {
            this.$router.push({
                name: id?"transferChannelDetail":"transferChannelAdd",
                query: {
                    id: id || 0,
                },
            });
        },
        removeItem(id, index){
          this.batchRemoveActReq([id]).then(()=>{
            this.delItem(index);
          })
        },
        batchRemoveItem(){
          this.batchRemoveActReq(this.ids).then(()=>{
            this.delItems(this.ids);
          })
        },
        batchRemoveActReq(ids) {
            if (ids.length == 0 || !ids[0]) {
                this.$Message.warning("请勾选删除项！");
                return Promise.reject(); 
            }
            this.tableLoading = true;
            return this.$MainApi.appraisalActRemove({
                data: {
                    ids: ids,
                },
            })
            .then((res) => {
                if (res.code) {
                    this.$Message.success(res.message || "删除成功");
                    return Promise.resolve();
                } else {
                    this.$Message.warning(res.message || "删除失败");
                    return Promise.reject();
                }
            })
            .finally(() => {
                this.tableLoading = false;
            });
        },
    },
    mounted() {
        this.loadData();
    },
};
</script>

<style>
</style>