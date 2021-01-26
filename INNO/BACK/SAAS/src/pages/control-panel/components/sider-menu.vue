<template>
    <div id="sider" :class="{'sider-hover':isEnterSider}">
        <div id="sider-menu-box" v-bar="{preventParentScroll: true}" @mouseenter="enterSider" @mouseleave="leaveSider">
            <Menu theme="light" width="200px" :open-names="menuParent" :active-name="menuName" accordion @on-select="onMenuSelect">
                <template v-for="item in menus">
                    <Submenu v-if="!item.isHide&&item.childs&&item.childs.length>0" :name="item.name" :key="item.name">
                        <template slot="title">
                            <i :class="['icon' ,'iconfont', item.icon]"/>
                            {{ item.title }}
                        </template>
                        <template v-for="sitem in item.childs">
                            <MenuItem v-if="!item.isHide" :name="sitem.to" :key="sitem.name">
                                <i :class="['icon' ,'iconfont', sitem.icon]"/>
                                {{ sitem.title }}
                            </MenuItem>
                        </template>
                    </Submenu>
                    <MenuItem v-else-if="!item.isHide" :name="item.to" :key="item.name">
                        <i :class="['icon' ,'iconfont', item.icon]" :key="item.name"/>
                        {{ item.title }}
                    </MenuItem>
                </template>
            </Menu>
        </div>
    </div>
</template>

<script>
import PageHelper from "@/helper/page-helper";
import Promise from "bluebird";
export default {
    name: "SiderMenu",
    computed: {
        menuCurrent() {
            let e = PageHelper.menuCurrent;
            return e || {};
        },
        menuName() {
            return this.menuCurrent.name;
        },
        menuParent() {
            return [this.menuCurrent.parent];
        },
        menus() {
            return PageHelper.menus;
        }
    },
    props: {
        beforeSelect: {
            type: Function
        }
    },
    data() {
        return {
            isEnterSider: false
        };
    },
    mounted(){
        // console.log("111", this.$adminInfo)
    },
    methods: {
        onMenuSelect(name) {
            this.$Modal.remove();
            if (!this.beforeSelect || !this.beforeSelect(name)) {
                this.$router.push({ name: name });
                this.$emit("select", name);
            }
        },
        enterSider() {
            this.$Modal.remove();
            if (this.lsp && this.lsp.isPending()) {
                this.lsp.cancel();
            }
            this.isEnterSider = true;
        },
        leaveSider() {
            this.$Modal.remove();
            if (this.lsp && this.lsp.isPending()) {
                this.lsp.cancel();
            }
            this.lsp = Promise.delay(200).then(() => {
                this.isEnterSider = false;
            });
        }
    }
};
</script>
<style lang="less" scoped>
    @import "~@/assets/css/variables.less";
    #sider {
        top: 0;
        left: 0;
        position: absolute;
        height: 100%;
        min-height: 0;
        overflow-x: hidden;
        width: 50px !important;
        min-width: 0px !important;
        max-width: 200px !important;
        flex: none !important;
        transition: all 0.4s;
        background: @bg-cp-color;
        z-index: 10000;
    }

    #sider-menu-box {
        width: 200px;
        height: 100%;
    }

    #sider-menu-box .ivu-menu {
        width: 100%;
    }

    #sider-menu-box .ivu-menu .icon {
        text-align: center;
        width: 50px;
        height: 50px;
        font-size: 18px;
        margin-right: 0px;
        display: inline-block;
    }

    #sider .ivu-menu .ivu-menu-submenu .ivu-menu-item {
        padding-left: 0px !important;
        transition: background, color, padding-left 0.4s, 0.4s, 0.4s;
    }

    #sider.sider-hover {
        width: 200px !important;
    }

    #sider.sider-hover .ivu-menu .ivu-menu-submenu .ivu-menu-item {
        padding-left: 16px !important;
    }
</style>
