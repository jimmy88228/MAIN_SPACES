<template>
    <div class="menu-item-area">
        <template v-if="data.children && data.children.length > 0 && !data.isPath">
            <Submenu :name="data.actionCode" v-if="actionCodeMap[data.actionCode] && actionCodeMap[data.actionCode].isAction">
                <template slot="title">
                    <span class="menu-item-icon" :style="getMenuIconStyle(data.actionCode)"></span>
                    {{ data.title }}
                </template>
                <template v-for="item in data.children">
                    <div :key="item.actionCode">
                        <menuItemLoop :data="item" ></menuItemLoop>
                    </div>
                </template>
            </Submenu>
        </template>
        <template v-else>
            <MenuItem :name="data.actionCode" v-if="actionCodeMap[data.actionCode] && actionCodeMap[data.actionCode].isAction">
                <template v-if="!data.parent || data.parent.length == 0">
                    <div class="ivu-menu-submenu-title" style="padding: 0px;">
                        <span class="menu-item-icon" :style="getMenuIconStyle(data.actionCode)"></span>
                        <span>{{ data.title }}</span>
                    </div>
                </template>
                <template v-else>
                    <span class="menu-item-point"></span>
                    {{data.title}}
                </template>
            </MenuItem>
        </template>
    </div>
</template>

<script>
import menuItemLoop from "./menu-item-loop.vue";
import PageHelper from "@/helper/page-helper";
export default {
    name: "menuItemLoop",
    components: {
        menuItemLoop,
    },
    props: {
        data: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    computed: {
        actionCodeMap() {
            return PageHelper.actionCodeMap || {};
        },
    },
    data() {
        return {
        };
    },
    methods: {
        getMenuIconStyle(actionCode) {
            try{
                let imgUrl = require("@/assets/images/menu/" + actionCode + ".png");
                if(!imgUrl){ return "" }
                let style =""
                if(actionCode){
                  style = "background-image:url(" + imgUrl + ");"
                }
                return style;
            }catch(e){ 
                return '';
            }
        },
    },
};
</script>

<style lang="less" scoped></style>