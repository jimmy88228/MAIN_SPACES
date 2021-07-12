<template>
    <div class="multi-cascader">
        <div class="select" :class="{'ivu-select-visible': showDrop}" @click.stop="handleExpand" ref="select">
            <span v-if="idCollection.length === 0">请选择</span>
            <div v-else>
                <div class="ivu-tag ivu-tag-checked" v-for="(item, index) in idCollection" :key="index">
                    <span class="ivu-tag-text">{{item.value}}</span>
                    <i class="ivu-icon ivu-icon-ios-close" @click.stop="removeItem(item, index)"></i>
                </div>
            </div>
            <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
        </div>
        <transition name="fade">
            <div class="menu" v-show="showDrop" :style="menuTop">
                <template v-if="data.length > 0">
                    <ul class="parent_menu">
                        <li v-for="(item, index) in data" :key="item.value" class="parent_menu_item" :class="{'active': curIndex === index}" @click.stop="selectParentItem(item, index)">
                            {{item.label}}
                            <i class="ivu-icon ivu-icon-ios-arrow-forward menu_item_arrow"></i>
                        </li>
                    </ul>
                    <ul class="parent_menu" v-if="selectSonCol.length > 0">
                        <li v-for="item in selectSonCol" :key="item.value" class="parent_menu_item" :class="{'active': idCollection.some(selectItem => selectItem.value === item.value)}" @click.stop="selectId(item)">
                            {{item.label}}
                        </li>
                    </ul>
                </template>
                <template v-else>
                    <span class="empty">暂无可选值</span>
                </template>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showDrop: false,
            curIndex: -1,
            allKinds: {},
            selectSonCol: [],
            idCollection: this.value || [],
            selectHeight: '32px',
            // 读取接口数据首次加载不通知父级
            isLoadedFirst: false
        }
    },
    computed: {
        menuTop() {
            return {
                top: this.selectHeight
            }
        }
    },
    props: {
        data: {
            type: Array,
            default() {
                return [];
            }
        },
        value: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    mounted () {
        window.addEventListener('click', () => {
            this.showDrop = false;
        });
    },
    methods: {
        handleExpand() {
            this.showDrop = !this.showDrop;
        },
        selectParentItem(item, index) {
            this.selectSonCol = this.allKinds[item.value];
            this.curIndex = index;
        },
        selectId(selectItem) {
            let hasId = this.idCollection.some(item => item.id === selectItem.id);
            if (hasId) return false;
            this.idCollection.push(selectItem);
        },
        removeItem(item, index) {
            this.idCollection.splice(index, 1);
        }
    },
    watch: {
        idCollection(nV) {
            this.$nextTick(() => {
                this.selectHeight = this.$refs.select.getBoundingClientRect().height || 32 + 'px';
                // 读取接口数据首次加载不通知父级
                if (!this.isLoadedFirst) {
                    this.isLoadedFirst = true;
                    return false;
                }
                this.$emit('on-change', nV);
            });
        },
        data: {
          handler(nV) {
            console.log('============')
            console.log(nV);
            [...nV].forEach(item => {
                this.allKinds[item.value] = item.children;
                console.log(this.allKinds)
            });
          },
          immediate: true
        },
        value(nV) {
            this.idCollection = [...nV];
        }
    }
}
</script>

<style lang="less" scoped>
.multi-cascader{
    position: relative;
    .select{
        cursor: pointer;
        position: relative;
        display: inline-block;
        flex-wrap: wrap;
        min-width: 260px;
        box-sizing: border-box;
        vertical-align: middle;
        color: #515a6e;
        font-size: 14px;
        line-height: normal;
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #dcdee2;
        transition: all .2s ease-in-out;
        min-height: 30px;
        padding-left: 8px;
        padding-right: 24px;
        line-height: 30px;
        .col_wrapper{
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
            .col_item{
                list-style: none;
            }
        }
    }
    .menu{
        display: flex;
        position: absolute;
        will-change: top, left;
        transform-origin: center top;
        left: 0;
        margin: 5px 0;
        background-color: #fff;
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0,0,0,.2);
        z-index: 900;
        .parent_menu{
            display: inline-block;
            min-width: 100px;
            height: 180px;
            margin: 0;
            padding: 5px 0!important;
            vertical-align: top;
            list-style: none;
            border-right: 1px solid #e8eaec;
            overflow: auto;
            .parent_menu_item{
                position: relative;
                padding-right: 36px;
                transition: all .2s ease-in-out;
                margin: 0;
                line-height: normal;
                padding: 7px 16px;
                clear: both;
                color: #515a6e;
                font-size: 14px!important;
                white-space: nowrap;
                list-style: none;
                cursor: pointer;
                &:hover{
                    background-color: #f3f3f3;
                }
                .menu_item_arrow{
                    font-size: 12px;
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    -webkit-transform: translateY(-50%);
                    transform: translateY(-50%);
                }
            }
        }
    }
    .active{
        background-color: #f3f3f3;
        color: #2d8cf0 !important;
    }
    .empty{
        padding: 10px;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .6s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
}
</style>
