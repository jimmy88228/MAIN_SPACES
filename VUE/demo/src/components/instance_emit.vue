<!-- instance_data ：$emit,$on,$once,$off-->
<template>
    <div>
        <emit-button v-on:emit_test3="handle_btn_emit"></emit-button>
    </div>
</template>

<script>
    import Vue from 'vue'
    Vue.component('emit-button', {
        methods:{
            btnFnc(){
                this.$emit('emit_test3',31);
            }
        },
        template: `
            <button v-on:click="btnFnc">
                Click me to be emit
            </button>
        `
    })
    export default {
        data(){
            return {
                jimmy:441
            }
        },
        mounted(){
            var fnc = function (_params) {
                console.log('fnc',_params);
            }
            this.$on('emit_test',fnc);
            this.$emit('emit_test',1);
            this.$emit('emit_test',2);
            this.$off('emit_test')
            this.$emit('emit_test',3);
            
            this.$once('emit_test2',fnc);
            this.$emit('emit_test2',21);
            this.$emit('emit_test2',22);
        },
        methods: {
            handle_btn_emit(_params) {
                console.log('handle_btn_emit',_params)
            }
        },
    }
</script>

<style lang="less" scoped>

</style>
