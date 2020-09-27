<template>
    <Breadcrumb class="breadcrumb">
        <BreadcrumbItem class="breadcrumb-item" v-for="(item,index) in breadcrumbList" :key="item.name" :to="index<length?{ name: item.to }:null">{{item.title}}</BreadcrumbItem>
    </Breadcrumb>
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
        }
    }
};
</script>
<style lang="less">
    @import "~@/assets/css/variables.less";
    .breadcrumb .breadcrumb-item .ivu-breadcrumb-item-link {
        color: #aaa;
    }
    .breadcrumb .breadcrumb-item:last-child .ivu-breadcrumb-item-link {
        color: #ddd;
    }
    .breadcrumb .breadcrumb-item a.ivu-breadcrumb-item-link:hover {
        color: @link-hover-color;
    }
</style>
