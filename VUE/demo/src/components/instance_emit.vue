<!-- instance_data ：$emit,$on,$once,$off-->
<template>
    <div>
        <emit-diy-button v-on:emit_test3="handle_btn_emit"></emit-diy-button>
        <emit-diy-button @emit_test3="handle_btn_emit2"></emit-diy-button>
    </div>
</template>

<script>
    import Vue from 'vue'
    export default {
        data(){
            return {
                jimmy:441
            }
        },
        beforeMount(){
            //在mounted之前挂载都行
            Vue.component('emit-diy-button', { //Api component 
                data(){
                    return {
                        num:0
                    }
                },
                methods:{
                    btnFnc(){
                        this.$emit('emit_test3',num);
                    }
                },
                template: `
                    <button v-on:click="btnFnc">
                        Click me to be emit
                    </button>
                `
            }) 
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
            },
            handle_btn_emit2(_params) {
                console.log('handle_btn_emit2',_params)
            }
        },
    }
</script>

<style lang="less" scoped>

</style>
