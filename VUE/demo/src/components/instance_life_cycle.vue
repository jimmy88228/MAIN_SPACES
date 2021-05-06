<!-- instance_life_cycle ：$mount,el,appendChild,$forceUpdate,$nextTick,$destroy-->
<template>
    <div> 
        <!-- <div id="app2"></div> -->
        <div id="app3"></div>
        <div id="app4"></div>
        <div>{{jimmy}}</div>
        <div>{{jimmy2.a}}??</div>
        <div :class="{ t1:!bool,t2:bool }">anim</div>
        <div v-if="bool" :class="[bool_class?'t1':'t2', 't']">anim2</div>
        <diy-cmpt @emitTap="handle_emit"></diy-cmpt>
    </div>
</template>

<script>
    import Vue from 'vue';
    var MyComponent2 = Vue.extend({
        template: '<div>Hello1 $mount挂载</div>'
    })
    var MyComponent3 = Vue.extend({
        template: '<div>Hello2 el挂载</div>'
    })
    var MyComponent4 = Vue.extend({
        template: '<div>Hello3 $mount+appendChild</div>'
    })
    
    export default {
        data(){
            return {
                jimmy:441,
                jimmy2:'',
                bool:false,
                bool_class:false
            }
        },
        beforeMount(){
             Vue.component('diy-cmpt',{
                data(){
                    return {
                        num:0
                    }
                },
                mounted () {
                    console.log('组件mounted')
                    this._btnFnc();
                },
                methods:{
                    _btnFnc(){
                        this.$emit('emitTap',{num:this.num++,name:'jimmy'});
                    }
                },
                template: `
                    <button @click="_btnFnc">
                        Click me to be emit
                    </button>
                `
            })
        },
        beforeUpdate(){
            console.log('beforeUpdate')
        },
        updated(){
            console.log('updated')
        },
        beforeDestroy(){
            console.log('beforeDestroy')
        },
        destroyed(){
            console.log('destroyed')
        },
        mounted(){
            //可挂载到App.vue的模板 和 当前组件的模板↓ （优先App.vue）

            //1 $mount挂载
            new MyComponent2().$mount('#app3');//无el （需mount手动挂载） 

            //2 el挂载
            new MyComponent3({el:"#app4"});//有el,直接new

            //3 $mount+appendChild
            var component = new MyComponent4().$mount();
            document.getElementById('app2').appendChild(component.$el); //渲染后挂载
            console.log('document',document)
            console.log('component',component);
            setTimeout(()=>{
                this.bool = true;
                this.$nextTick(()=>{
                    setTimeout(() => {
                        this.bool_class = true;
                    }, 100);
                    setTimeout(() => {
                        this.$forceUpdate(); //强制刷新
                    }, 500);
                })
            },1000)
            setTimeout(() => {
                console.log('$destroy')
                this.$destroy();//完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。//最好不使用
            }, 3000);
        },
        methods: {
            handle_emit(value) {
                console.log('handle_emit',value)
            }
        },
    }
</script>

<style lang="less" scoped>
.t{
    transition: all 1s 0.2s;
    color: blue;
}
.t1{ 
    color: red
}
.t2{
}
// .t1::after{
//     content: "haha";
//     color: red;
// }
</style>