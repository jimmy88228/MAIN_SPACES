<template>
    <div class="breadcrumb">
        <p class="breadcrumb-item" v-for="(item ,index) in breadcrumbList" :key="item.name" @click="jump(item)">
            <template v-if="item.to">
                <a class="breadcrumb-item-txt">{{item.title}}</a>
            </template>
            <template v-else>
                <span class="breadcrumb-item-txt">{{item.title}}</span>
            </template>
            <span class="breadcrumb-item-separator">/</span>
        </p>
    </div>
</template>
<script>
import PageHelper from "@/helper/page-helper";
export default {
    name: "BreadcrumbBar",
    computed: {
        breadcrumbList() {
            return PageHelper.breadcrumbList;
        },
        length() {
            return PageHelper.breadcrumbList.length;
        },
    },
    methods: {
        jump(item) {
            if(!item.name) return;
            this.$router.push({
                name: item.name,
                query: item.query || {},
                params: item.params || {}
            })
        },
    },
};
</script>
<style lang="less" scoped>
@import "~@/assets/css/variables.less";
.breadcrumb {
    padding: 0px 0px 0px 28px;
    line-height: 68px;
    .breadcrumb-item {
        display: inline-block;
        .breadcrumb-item-txt {
            padding: 0px 5px;
            color: #515a6e;
            transition: color 0.2s ease-in-out;
        }
        .breadcrumb-item-txt:hover {
            color: @link-hover-color;
        }
        .breadcrumb-item-separator {
            display: inline-block;
            color: #dcdee2;
            margin: 0 8px;
        }
    }
    .breadcrumb-item:last-child {
        font-weight: bold;
        .breadcrumb-item-separator {
            display: none;
        }
    }
}
</style>
