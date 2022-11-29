<template>
    <rewrite-area class="flex-b-c">
        <div class="flex-s-c">
            <p class="m-r-10">次数限制：{{isLimit ? '按次数计算中' : '不限制次数中'}}</p>
            <Button :loading="limitLoading" @click="setLimit">{{ isLimit ? '设置为不限制次数' : '设置为按次数计算' }}</Button>
        </div>
        <div>
            <Button type="primary" @click="add">新增次数</Button>
        </div>
    </rewrite-area>
</template>

<script>
export default {
    name: "actIndexSearchForm",
    data() {
        return {};
    },
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
        isLimit: Boolean,
        limitLoading: Boolean
    },
    methods: {
        setLimit(){
            this.$emit("setLimit");
        },
        add(){
            this.$emit("add");
        }
    },
};
</script>

<style>
</style>