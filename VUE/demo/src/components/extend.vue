<!-- extend ： Vue.extend,new ..., Vue.component  -->
<template>
  <div>
    <h3 class="i_b">Vue.extend:</h3>
    <div id="jimmy"></div>
    <div>
        <h3 class="i_b">Vue.component:</h3>
        <counter class="i_b"></counter>
    </div>
    <CombinationChild></CombinationChild>
  </div>
</template>

<script>
import Vue from "vue";
let dataArr = [
  { id: 0, name: "第一页" },
  { id: 1, name: "第二页" }
];
var Demo_extend = Vue.extend({
  name: "extend_cmt",
  template: `
          <div class="i_b">
            <ul>
              <li class="li i_b" v-for="(data,i) in dataArr" :key="id">
                {{data.name}}
              </li>
            </ul>
          </div>
        `,
  props: ["dataArr"],
  data: function() {
    return {
      label: "441 "
    };
  }
});

Vue.component("counter", { //只能页面加载时同步注册组件,new XXX可以异步

  //1.组件名为"conter"; 2.data 写函数; 3.template 写组件的内容（元素和触发的事件）
  data: function() {
    return { count: 0 };
  },
  template: '<div v-on:click="count++">点击计算点击次数：{{count}}次</div>'
});
import combin_child from '@/components/combin_child.vue';
export default {
  name: "extend",
  components: {
    CombinationChild:combin_child
  },
  mounted() {
    if (this.inited) return;
    this.init();
    this.inited = true;
  },
  methods: {
    init() {
      new Demo_extend({ //可以异步注册组件
        propsData: {    //propsData 在new的时候用
          dataArr: dataArr
        }
      }).$mount("#jimmy"); //挂载到#jimmy
    }
  }
};
</script>

<style lang="less" scoped>
</style>