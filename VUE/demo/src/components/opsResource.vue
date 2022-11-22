<!-- opsResource ：directives,filters -->
<template>
  <div>
    <div v-demo-directives="'vnode：data->directives[0]->value->' + 441 + 1" data-name="jimmy"></div>
    <div>filters：{{params | capitalize()}}</div> <!-- | 前面是传参值，后面是函数 -->
    <div>getJimmy：{{getJimmy('jimmy')}}</div> <!-- | 前面是传参值，后面是函数 -->
  </div>
</template>

<script>
export default {
    data() {
        return {
            capitalize: "",
            params:"jimmy",
            di_val:""
        }
    },
    mounted(){
    },
    directives: { //选项directives
      "demo-directives": function(el, binding, vnode) {
        /** el可以获取当前dom节点，并且进行编译，也可以操作事件。binding指的是一个对象，一般不用。vnode 是 Vue 编译生成的虚拟节点 **/
        el.style.color = "red"; //操作style所有样式
        let _dir = vnode.data.directives[0]||{}; //vnode directives值
        el.innerHTML = _dir.value; //dom处理
        console.log("directives", el, vnode.context.$route,vnode); //获取当前路由信息
      }
    },
    filters: {  //选项filters
      capitalize: function(value) { //首字母大写
        if (!value)  return "";
        value = value.toString();
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
    },
    methods: {
      getJimmy(value) {
        return value
      }
    },
    //   components:{} //详见 views/Index.vue
};
</script>

<style lang="less" scoped>
</style>