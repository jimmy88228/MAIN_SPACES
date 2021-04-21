<!-- instance_property ：$options,el,$parent,$child,$slots,$scopedSlots,v-slot,$refs... -->
<template>
    <div>
        <div>
            {{data.a}}
        </div>
        <div>{{jimmy1}}</div>
        <div>{{jimmy2}}</div>
        <div id="template1"></div>
        <child>
            <!-- <template slot="child_head"> --> <!-- 旧的、弃用的写法 -->

            <!-- <template v-slot:child_head> --> <!-- 写法2 -->
            <template #child_head>
                <div>head</div>
            </template>
            <template> <!-- 默认slot -->
                <div>content</div>
            </template>
            <template v-slot:child_footer="{ slotData:slotDataDiy,slotObj }"> <!-- 自定义命名diy --> <!-- 把插槽里面的数据带出来并重新操作数据插回去 -->
                <div>footer</div>
                <div>{{slotDataDiy}}</div>
                <div v-if="slotObj.a===1">{{slotObj.a}},{{slotObj.b}}, {{slotObj.a}}+{{slotObj.b}}={{slotObj.a+slotObj.b}}</div>
            </template>
        </child>
        <div class="box"> 
            <slot name="head"></slot>
            <slot></slot>
            <slot name="footer"></slot>
        </div>
        <div id="jimmy"></div>
        <base-input ref="usernameInput"></base-input>
    </div>
</template>

<script>
    var template1 = `<div>jimmy template1 new</div>`;
    import Vue from "vue";
    import child from './combin_child.vue';
    var Demo_extend = Vue.extend({ //Api extend
        name: "extend",
        template: `<div>异步注册extend组件 Demo_extend</div>
                `,
        props: [],
        data: function() {
            return {
            };
        }
    });
    Vue.component('base-input', { 
        data(){
            return {
            }
        },
        methods: {
            _focusFnc: function () { // 父级组件可调用的函数
                console.log('组件里 _focusFnc 被调用',this.$refs);

                console.log('组件里调用 <input> 的focus()',this);
                this.$refs.input.focus()
            }
        },
        template: `
            <input ref="input">
        `
    })
    
    export default {
        name:"instance_property",
        customOption: 'foo',
        customOption2: {a:441,b:442},
        created: function () {
            console.log('this.$options',this.$options,this.$options.customOption,this.$options.customOption2) // => 'foo'
        },
        data() {
            return {
                data: {a:441},
                slotData:{isShow:true,data:'slotData'}
            }
        },
        components: {
            child,
        },
        props:{
            jimmy1:{
                type:Number,
                default:0
            },
            jimmy2:{
                type:String,
                default:""
            },
        },
        mounted () {
            this.init();
        },
        methods: {
           init(){
                new Vue({
                    el:"#template1",
                    template:template1
                });
                console.log('$parent',this.$parent,'\n$children',this.$children,'\n$root',this.$root)
                console.log('slots',this.$slots) //被调用 实例化时才会获取到$slots的信息，跳到当前页面没有数据
                console.log('scopedSlots',this.$scopedSlots) //访问作用域插槽，该对象都包含每一个插槽相应的VNode 的函数
                console.log('isServer',this.$isServer)
                console.log('listeners ',this.$listeners ) //?
                new Demo_extend({ //可以异步注册组件
                    propsData: {    //propsData 在new的时候用
                        
                    }
                }).$mount("#jimmy"); //挂载到#jimmy
                console.log('父组件',this.$refs);
                //this.$refs.usernameInput 控制组件内部
                this.$refs.usernameInput._focusFnc();
            }
        }
    } 
</script>

<style lang="less" scoped>

</style>