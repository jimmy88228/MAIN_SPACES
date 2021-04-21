<!-- opsData ： data,props,computed,watch-->
<template>
  <div class="main">
    <div>
      <h3 class="i_b">props:</h3>
      <div class="i_b">{{prop_data1}}</div>
      <div class="i_b">{{prop_data2}}</div>
    </div>
    <div>
      <h3 class="i_b">computed:</h3>
      <button @click="onTap">按钮</button>
      <span>data1.a:{{data1.a}},</span>
      <span>aDouble:{{aDouble}},</span>
      <span>aPlus:{{aPlus}}</span>
      <div>data2:{{temp}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data1: { a: 440 },
      data2: "",
      temp: ""
    };
  },
  created () {
      this.$watch("data1.a", function(val, oldval) {
      console.log("watch主动调用", val, oldval);
    });
  },
  mounted() {
    this.data2 = this.aPlus;
  },
  props: {
    prop_data1: {
      type: String,
      default: "",
      required: false,
      validator:(value)=>{
        console.log('validator',this);
        return value; //return不是true的话会报vue warn
      }
      //  function(value) {
      //   console.log('validator',this);
      //   return value; //return不是true的话会报vue warn
      // }
    },
    prop_data2: {
      type: String,
      default: ""
      // required:true,
      //   validator: function(value) {
      //     return value;
      //   }
    },
    prop_data3: {
      type: String,
      default: ""
    }
  },
  computed: {
    aDouble() {
      return this.data1.a * 2;
    },
    aPlus: {
      // 读取 和 设置set
      get: function() {
        return this.data1.a * 2;
      },
      set: function(v) {
        this.data1.a = v / 2;
      }
    }
  },
  watch: {
    aPlus: function(val) { //写法1
      console.log("监听computed对象的值1", val);
    },
    data2(val) { //写法2
      console.log("监听 data2", val);
      this.temp = val;
    },
    data1: {
      handler: function(val, oldval) {
        console.log("深度监听obj", val.a, oldval.a, val);
      },
      deep: true //对象内部的属性监听，也叫深度监听
    },
    "data1.a": function(val, oldval) {
      console.log("对象的值监听obj的属性值", val, oldval);
    },
    
  },
  methods: {
    onTap() {
      console.log("---1", this.aDouble, this.aPlus);
      this.aPlus = this.data1.a; //设置了set才能赋值
      this.data2 = "" + this.aPlus;
      console.log("---2", this.aDouble, this.aPlus);
    }
  }
};
</script>

<style lang="less" scoped>
</style>