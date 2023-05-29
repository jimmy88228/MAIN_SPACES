<template>
    <div class="menu-item-area">
        <template v-if="data.children && data.children.length > 0 && !data.isPath">
            <Submenu :name="data.actionCode" v-if="actionCodeMap[data.actionCode] && actionCodeMap[data.actionCode].isAction">
                <template slot="title">
                    <span class="menu-item-icon" :style="getMenuIconStyle(data.actionCode)"></span>
                    {{ data.title }}
                </template>
                <template v-for="item in data.children">
                    <menuItemLoop :data="item" :key="item.actionCode"></menuItemLoop>
                </template>
            </Submenu>
        </template>
        <template v-else>
            <MenuItem :name="data.actionCode" v-if="actionCodeMap[data.actionCode] && actionCodeMap[data.actionCode].isAction">
            <span class="menu-item-point"></span>
            {{data.title}}
            </MenuItem>
        </template>
    </div>
</template>

<script>
import menuItemLoop from "./menu-item-loop.vue";
import PageHelper from "@/helper/page-helper";
// import imgIcon from "@/assets/images/menu/psychologyAppraisal.png";
// console.log("imgIcon", imgIcon);
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