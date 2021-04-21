<!-- instance_life_cycle ：$mount,$forceUpdate,appendChild,el,$nextTick,$destroy-->
<template>
    <div>
        <div id="app"></div>
        <div id="app2"></div>
        <div id="app3"></div>
        <div>{{jimmy}}</div>
        <div>{{jimmy2.a}}</div>
        <div :class="{ t1:!bool,t2:bool }">anim</div>
        <div v-if="bool" :class="[bool_class?'t1':'t2','t']">anim2</div>
    </div>
</template>

<script>
    import Vue from 'vue';
    var MyComponent = Vue.extend({
        template: '<div>Hello!</div>'
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
        mounted(){
            // new MyComponent().$mount('#app');//无el （需mount手动挂载） 
            // new MyComponent({el:"#app2"});//有el,直接new
            
            var component = new MyComponent().$mount();
            document.getElementById('app3').appendChild(component.$el); //渲染后挂载
            console.log('document',document)
            console.log('component',component);
            setTimeout(()=>{
                this.bool = true;
                this.$nextTick(()=>{
                    setTimeout(() => {
                        this.bool_class = true;
                    }, 100);
                })
                this.$forceUpdate(); //暂时无法验证
            },1000)
            setTimeout(() => {
                this.$destroy();//完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。//最好不使用
            }, 1500);
        }
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