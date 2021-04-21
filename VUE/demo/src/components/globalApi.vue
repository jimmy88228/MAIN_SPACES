<!-- globalApi ： mixin,nextTick,set,diretive ... -->
<template>
  <div>
    <h3 style="margin-top:20px;">globalApi：</h3>
    <div>
      <div class="i_b">directive:</div>
      <div class="i_b" v-diy-directive="200">{{mixinData.a}}，{{mixinData.b}}</div>
    </div>
    <div>
      <div class="i_b" @click="onTap">directive:</div>
      <div class="i_b" v-diy-directive:mixinData.c="441" v-if="clickBool">{{mixinData.c}}</div>
    </div>
    <div id="compile"></div>
  </div>
</template>

<script>
import Vue from "vue";
// var res = Vue.compile('<div><span>441441</span></div>') //??compile
// new Vue({
//     el:'#compile',
//   data: {  },
//   render: res.render,
//   staticRenderFns: res.staticRenderFns
// })

// const state = Vue.observable({ count: 0 })   //??observable
// const Demo = {
//   render(h) {
//     return h('button', {
//       on: { click: () => { state.count++;console.log('进来',state) }}
//     }, `count is: ${state.count}`)
//   }
// }

var myMixin = {
  created: function() {
    //mixin 生命周期较先
    console.log("mixin 生命周期较先");
    console.log("created from mixin");
    this.hello();
  },
  data() {
    return {
      mixinData: { b: 2, c: "v-if inserted" }
    };
  },
  methods: {
    hello: function() {
      console.log("fnc from mixin!");
    }
  }
};
export default {
  mixins: [myMixin],   //9
  created() {
    console.log("created from page");
  },
  mounted() {
    console.log("Vue.version", Vue.version);
    this._directive(); //1
    this._nextTick();  //2
    this._set();       //3
  },
  data() {
    return {
      clickBool: true
    };
  },
  methods: {
    _nextTick() {
      let that = this;
      Vue.nextTick().then(() => {
        console.log("nextTick this==that",  this == that, this);
      });
    },
    _set() {
      Vue.set(this.mixinData, "a", 'Vue set'); //响应
      // Vue.delete(this.mixinData,'a'); //响应
    },
    _directive() {
      Vue.directive("diy-directive", {
        bind: function(el, binding, vnode) { //el, binding, vnode 都会有
          //3.1 if true 会执行
          console.log("directive bind", el, binding, vnode); //binding.value = 200 、 binding.value = 441
        },
        inserted: function(el) {
          //4 if true 会执行
          console.log('directive inserted');
          el.style.color = "gray";
        },
        update: function(el) {
          //1
          console.log('directive update');
          el.style.color = "red";
        },
        componentUpdated: function() {
          //2
          console.log('directive componentUpdated');
        },
        unbind: function() {
          //3.2 if false 会执行
          console.log('directive unbind');
        }
      });
    },
    onTap() {
      this.clickBool = !this.clickBool;
    } 
  }
};
</script>

<style lang="less" scoped>
</style>