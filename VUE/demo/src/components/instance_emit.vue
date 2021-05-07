<!-- instance_data ：$emit,$on,$once,$off-->
<template>
    <div>
        <emit-diy-button v-on:emit_test3="handle_btn_emit"></emit-diy-button>

        <emit-diy-button @emit_test3="handle_btn_emit_2"></emit-diy-button> 

        <div>子组件 {{fromType}}</div>
    </div>
</template>

<script>
    import Vue from 'vue'
    export default {
        props: {
            fromType: {
                type: String,
                default: ''
            },
        },
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
                    _btnFnc(){
                        this.$emit('emit_test3',{num:this.num++,name:'jimmy'});
                    }
                },
                template: `
                    <button @click="_btnFnc">
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
            this.$emit('emit_test',3); //不再$on回调
            
            this.$once('emit_test2',fnc);
            this.$emit('emit_test2',21);
            this.$emit('emit_test2',22); //不再$once回调
        },
        methods: {
            handle_btn_emit(_params) {
                console.log('handle_btn_emit',_params)
                this.fromType = 'change';
                this.$emit('update:fromType', this.fromType)
                this.$emit('emitTap',{index:0})
            },
            handle_btn_emit_2(_params) {
                console.log('handle_btn_emit_2',_params)
                this.$emit('emitTap',{index:1})
            },
            clickTap(e){
                console.log('clickTap1',e)
            } ,
            clickTap2(e){
                console.log('clickTap2',e)
            }
        },
    }
</script>

<style lang="less" scoped>

</style>
