<template>
    <div>
        <Modal v-model="isVisible" class="template-modal-class" :class-name="'template-modal ' + modalClass" :title="title" :width="modalWidth" :mask-closable="isCloseMask" @on-visible-change="handleModal" transfer>
            <div class="container">
                <div class="left" v-if="!hideSelect">
                    <Card class="left-card">
                        <div class="card_header p-t-10 p-b-10 m-b-10">
                            <p class="mode fs-14"> 已选{{selectedData.length}}项 <span class="warn-notice">[{{ type === "radio" ? "单选模式" : "多选模式" }}]</span> </p>
                            <p class="fs-14" v-if="limitSelectNum > 0"> [{{ selectedData.length + "/" + limitSelectNum }}] </p>
                        </div>
                        <div class="selected_wrapper">
                            <div class="selected_wrapper_area" v-bar>
                                <div class="wrapper_area_items">
                                    <!-- 已选数据 -->
                                    <slot name="selected" v-bind:selectedData="selectedData" v-bind:delItem="delItem">
                                        <span class="item" v-for="item in selectedData" :key="item.id">
                                            <p class="select-view-img" :style="'background-image:url(' + item.img + ')'" v-if="item.img"></p>
                                            <p class="title text-clamp3">{{ item.name || "&nbsp;" }}</p>
                                            <Icon v-if="!item._disabled" type="ios-close-circle-outline" class="close" title="删除" @click="delItem(item.id)" />
                                        </span>
                                    </slot>
                                    <div class="empty text-c invalid p-t-20 p-b-20" v-show="selectedData.length === 0">
                                        暂无选中项
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div class="right">
                    <!-- 搜索 -->
                    <div class="search">
                        <slot name="search" v-bind:searchPage="searchPage" v-bind:data="data"></slot>
                    </div>
                    <!-- <div class="text-l m-b-10 m-t-10">
                        <template v-if="isShowChooseAll">
                            <Checkbox v-model="chooseAll" @on-change="changeChooseAll">全选所有</Checkbox>
                            <p class="flex" style="font-size:12px;">数据量多的情况下，会出现卡顿,建议增加筛选条件</p>
                        </template>
                    </div> -->
                    <div :style="'height:' + defaultHeight + 'px;'">
                        <slot name="select-ui">
                            <template>
                                <Table class="modal-template-table" :loading="tableLoading" :height="defaultHeight" row-key="id" :columns="tableColumn" :data="list" ref="myTable" @on-select-cancel="handleSelectCancel" @on-select="handleSelect" @on-select-all="handleSelectAll" @on-select-all-cancel="handleCancelAll"></Table>
                            </template>
                        </slot>
                    </div>
                    <rewrite-page :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
                </div>
            </div>
            <div slot="footer">
                <Button type="default" @click="cancel">取消</Button>
                <Button type="primary" @click="comfirm">确定</Button>
            </div>
            <slot name="hidefooter"></slot>
        </Modal>
    </div>
</template>
<script>
import ListMixin from "@/helper/mixin/list-mixin";
import Conf from "@/config/config";
export default {
    name: "modalTemplate",
    props: {
        loadParentData: {
            type: Function,
            default: null,
        },
        tableColumn: {
            type: Array,
            default() {
                return [];
            },
        },
        modalClass: {
            type: String,
            default() {
                return "";
            },
        },
        modalWidth: {
            type: Number,
            default() {
                return 800;
            },
        },
        defaultPageSize: {
            type: Number | String,
            default() {
                return Conf.PAGE_SIZE_DEF;
            },
        },
        propData: {
            type: Object,
            default: () => {},
        },
    },
    mixins: [ListMixin],
    data() {
        return {
            isVisible: false,
            isCloseMask: false,
            selectedData: [],
            // 存储已选ID
            hashMap: {},
            hideSelect: false,
            defaultHeight: 450,
            title: "",
            mode: "store",
            type: "radio",
            extraParam: {},
            selectData: [],
            limitSelectNum: 0,
            //
            isShowChooseAll: false,
            chooseAllLoading: false,
            chooseAll: false,
            // 虚拟滚动条
            scrollOptions: {
                mode: "native",
                bar: {
                    keepShow: false,
                    background: "#c8c8c8",
                    size: "3px",
                },
                // 滚动轨道
                rail: {
                    size: "3px",
                },
                scrollPanel: {
                    scrollingX: false,
                },
            },
            canEditSelect: true
        };
    },
    computed: {},
    methods: {
        showModal(options = {}) {
            this.isVisible = true;
            this.extraParam = options.extraParam || {};
            this.loadData();
        },
        hideModal() {
            this.isVisible = false;
        },
        comfirm() {
            if (this.selectedData.length === 0) {
                this.$Message.error("请选择内容!");
                return false;
            }
            if (
                this.limitSelectNum > 0 &&
                this.limitSelectNum < this.selectedData.length
            ) {
                this.$Message.error(
                    "选择数量不能大于" + this.limitSelectNum + "!"
                );
                return false;
            }
            this.hideModal();
            this.$parent.handleData(this.selectedData);
        },
        cancel() {
            this.hideModal();
            this.$parent.cancelHandle();
        },
        handleModal(bool) {
            if (!bool) {
                this.hideModal();
                setTimeout(() => {
                    this.$parent.handleDestroy();
                }, 1000);
            }
        },
        onLoadData(page, data) {
            return new Promise((rs, rj) => {
                this.$nextTick(() => {
                    if (
                        this.loadParentData &&
                        typeof this.loadParentData == "function"
                    ) {
                        data = {
                            ...data,
                            ...this.extraParam,
                        };
                        return this.loadParentData(page, data)
                            .then((result) => {
                                this.initTableData(result);
                                rs();
                            })
                            .catch(() => {
                                rj();
                            })
                            .finally(() => {
                                this.tableLoading = false;
                                this.setSelectAll();
                            });
                    } else {
                        rj();
                    }
                });
            });
        },
        setSelectAll() {
          this.$nextTick(() => {
              const dom = this.$refs.myTable.$el
                  .querySelector(".ivu-table-header")
                  .querySelector(".ivu-table-cell-with-selection");
              if (this.type === "radio" && dom) {
                  dom.style.display = "none";
                  this.isShowChooseAll = false;
              } else {
                  this.isShowChooseAll = true;
              }
          });
        },
        searchPage(searchData) {
            this.loadData();
        },
        changeChooseAll(state) {
            if (state) {
                let data = {
                    page: 1,
                    pageSize: 100000,
                    ...this.extraParam,
                };
                this.tableLoading = true;
                return this.loadParentData(1, data)
                    .then((result) => {
                        let items = result.items || [];
                        this.selectedData = [];
                        this.hashMap = {};
                        if (
                            this.limitSelectNum &&
                            items.length > this.limitSelectNum
                        ) {
                            items = items.slice(0, this.limitSelectNum);
                            this.$Message.warning(
                                "最多只能选择" + this.limitSelectNum + "个"
                            );
                        }
                        for (let i = 0; i < items.length; i++) {
                            this.selectedData.push({
                                ...items[i],
                                id: items[i].id,
                                name: items[i].name,
                            });
                            this.hashMap[items[i].id] = true;
                        }
                        this.setCheckStatus();
                    })
                    .catch((error) => {
                        this.$Message.warning("全选失败");
                        this.chooseAll = false;
                    })
                    .finally(() => {
                        this.tableLoading = false;
                    });
            } else {
                this.selectedData = [];
                this.hashMap = {};
                this.setCheckStatus();
            }
        },
        initTableData(data) {
            let list = data.list || [];
            let total = data.total || 0;
            list = this.setStatusLoop(list, "init");
            this.data = {
                list,
                total,
            };
            this.tableDataSet("init");
        },
        tableDataSet(type) {
            if (this.list instanceof Array) {
                this.list.forEach((item, index) => {
                    let _id = item.id;
                    if (_id) {
                        const index = this.selectedData.findIndex(
                            (sItem) => sItem.id == _id
                        );
                        if (index == 0 || (index && index != -1)) {
                            let _item = JSON.parse(JSON.stringify(item));
                            let sItem = this.selectedData[index] || {};
                            this.$set(this.selectedData, index, {
                                ...sItem,
                                ..._item,
                            });
                            if(type == 'init'){
                                item._disabled = sItem._disabled
                            }
                        }
                    }
                });
                if (type == "init") {
                    this.setCheckStatus();
                }
            }
        },
        // 选中项逻辑
        handleSelect(selected, latest) {
            console.log("选择type", this.type);
            if (
                this.limitSelectNum > 0 &&
                !(this.limitSelectNum > this.selectedData.length)
            ) {
                this.$Message.warning(
                    "最多只能勾选" + this.limitSelectNum + "个"
                );
                this.$nextTick(() => {
                    this.setCheckStatus();
                });
                return;
            }
            if (this.type === "radio") {
                this.$refs.myTable && this.$refs.myTable.selectAll(false);
                this.selectedData = [];
                this.hashMap = {};
                this.selectedData.push(latest);
                this.hashMap[latest.id] = true;
            } else {
                selected.forEach((item) => {
                    let id = item.id;
                    if (!(id in this.hashMap)) {
                        this.selectedData.push(item);
                        this.hashMap[id] = true;
                    }
                });
            }
            // 进行样式赋值
            this.setCheckStatus();
        },
        handleSelectCancel(selected, cancelItem) {
            this.delItem(cancelItem.id);
        },
        handleSelectAll(selected) {
            // 多选可见
            this.handleSelect(selected);
        },
        handleCancelAll(selected) {
            this.selectedData = [];
            this.hashMap = {};
        },
        delItem(id) {
            if (id in this.hashMap) {
                delete this.hashMap[id];
                const index = this.selectedData.findIndex(
                    (item) => item.id === id
                );
                this.selectedData.splice(index, 1);
                this.setCheckStatus();
            }
        },
        setCheckStatus() {
            this.setStatusLoop(this.list);
        },
        setStatusLoop(data, type) {
            for (let i = 0; i < data.length; i++) {
                let item = data[i] || {};
                let id = item.id;
                if (type == "init") {
                    item._checked = false;
                    item._disabled = false;
                    item._showChildren = true;
                } else {
                    if (id in this.hashMap) {
                        item._checked = true;
                    } else {
                        item._checked = false;
                    }
                }
                if (item.children && item.children.length > 0) {
                    this.setStatusLoop(item.children, type);
                } else {
                    item.children = [];
                }
            }
            return data;
        },
    },
    watch: {
        selectData(nV) {
            this.selectedData = [...nV];
            this.selectedData.forEach((item) => {
                this.hashMap[item.id] = true;
            });
        },
        propData: {
            handler({ mode, type, title, data, limitSelectNum, hideSelect }) {
                this.title = title;
                this.mode = mode;
                this.type = type;
                this.selectData = data || [];
                this.limitSelectNum = limitSelectNum || 0;
                this.hideSelect = hideSelect;
            },
            deep: true,
            immediate: true,
        },
        list: {
            handler(nV, oV) {
                this.tableDataSet();
            },
            deep: true,
            immediate: true,
        },
        defaultPageSize: {
            // 自定义默认页数
            handler(nV, oV) {
                this.pageSize = nV;
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less" >
.template-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    .larger-items {
        width: 620px;
        display: flex;
        flex-wrap: wrap;
        position: relative;
        .larger-item {
            cursor: pointer;
            margin: 10px;
            width: 130px;
            height: 231px;
            background-repeat: no-repeat;
            background-size: 100% auto;
            background-position: center center;
            background-color: #efefef;
            position: relative;
            overflow: hidden;
            .select-icon {
                position: absolute;
                right: 0px;
                bottom: 0px;
                background-color: #ff1c1f;
                border-radius: 3px;
            }
        }
        .larger-item:hover {
            opacity: 0.9;
        }
        .larger-item.selected::after {
            content: "";
            position: absolute;
            display: block;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            border: 2px solid #ff1c1f;
            box-sizing: border-box;
        }
    }
    .ivu-modal {
        top: 0;
    }
    // .search_input {
    //     width: 200px;
    // }
    // .ivu-input-icon {
    //     right: 50px;
    // }
    .container {
        display: flex;
        // align-items: flex-start;
        .left {
            flex-shrink: 0;
            margin-right: 10px;
            width: 200px;
            height: 570px;
            .left-card {
                height: 100%;
                .ivu-card-body{
                  display: block;
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  overflow: hidden;
                  padding: 6px;
                  .card_header {
                      font-size: 16px;
                      text-align: center;
                      border-bottom: 1px solid #e8eaec;
                  }
                  .selected_wrapper {
                      height: 100%;
                      flex: 1;
                      display: flex;
                      flex-direction: column;
                      height: 100%;
                      overflow-y: auto;
                      align-items: center;
                      // padding: 6px 0;
                      .selected_wrapper_area {
                          height:100%;
                          width:100%;
                          .wrapper_area_items{
                            padding:6px;
                            width:100%;
                            .item {
                                position: relative;
                                width: 95%;
                                padding: 4px 4px;
                                border-radius: 4px;
                                border: 1px solid #efefef;
                                text-align: center;
                                margin-bottom: 10px;
                                display: block;
                                .close {
                                    color: #ed4014;
                                    font-size: 18px;
                                    position: absolute;
                                    right: -8px;
                                    top: -8px;
                                    cursor: pointer;
                                    font-weight: bold;
                                }
                                .select-view-img {
                                    width: 60px;
                                    height: 60px;
                                    margin: 0 auto;
                                    background-size: 100% auto;
                                    background-repeat: no-repeat;
                                    background-position: center center;
                                }
                            }
                            .larger-img-item {
                                width: 80px;
                            }
                          }
                          
                      }
                  }
                }
                
            }
            
        }
        .right {
            width:100%;
        }
    }
    .ivu-modal-close{
        top: 0px;
        right: 0px;
        .ivu-icon-ios-close{
            color:#222;
            font-weight: bold;
        }
    }
    .ivu-modal-body{
        padding-top: 30px;
    }
    .modal-template-table{
        .ivu-table-header{
            thead tr th{
                background-color:#FDFBFC;
            }
            
        }
    }
    
}
</style>
