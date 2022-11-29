<template>
    <rewrite-area class="text-r">
        <Button type="primary" @click="add">&nbsp;新 增&nbsp;</Button>
    </rewrite-area>
</template>

<script>
export default {
    name: "funnyTestTypeSearchForm",
    data() {
        return {};
    },
    props: {
    },
    methods: {
        add(){
            this.$emit("add");
        }
    },
};
</script>

<style>
</style>