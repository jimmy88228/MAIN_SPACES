<!-- combination : mixins,extends,getParent,getChild -->
<template>
    <div>
        <child></child>
    </div>
</template>

<script>
    import child from './combin_child.vue';
    var _extends = {
        created:function(){
            console.log('created comb extends',this);
            this.hello();
        },
        data(){
            return {
                ex_data:441
            }
        },
        methods: {
            hello: function() {
                console.log("comb from extends!");
            }
        }
    };
    var _mix = {
        created:function(){
            console.log('created comb _mix',this);
            this.hello2(); //不能和"外面"的函数名字重复
        },
        data(){
            return {
                ex_data:441
            }
        },
        methods: {
            hello2: function() {
                console.log("comb from _mix!");
            }
        }
    };
    export default {
        name:"combination",
        //节制地使用 $parent 和 $children - 它们的主要目的是作为访问组件的应急方法。更推荐用 props 和 events 实现父子组件通信
        //extend > mixins > 自身
        mixins: [_mix], //选项mixins //详见globalApi.Vue
        extends:_extends, //选项extends //extends在mixins生命周期前面，允许声明扩展另一个组件,无需使用 Vue.extend,这主要是为了便于扩展单文件组件
        components: {
            child, 
        },
        mounted () {
            this.getParent();
            this.getChild();
        },
        methods: {
            getParent() {
              console.log('combination getParent',this.$parent);  
            },
            getChild() {
              console.log('combination getChild',this.$children); 
            },
        },
    }
</script>

<style lang="less" scoped>

</style>