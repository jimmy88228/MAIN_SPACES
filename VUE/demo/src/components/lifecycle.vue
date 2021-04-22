<!-- lifecycle ： beforeCreate,created,beforeMount,mounted,activated,beforeUpdate,updated,deactivated,beforeDestroy,destroyed,errorCaptured -->
<template>
  <div>
    <div>生命周期log {{jimmyData.a}},{{jimmyData.b}}</div>
    <div v-if="bool">123</div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      jimmyData: {a:0},
      bool:true
    }
  }, 
  methods: {
    cln_intvl(){
      clearInterval(this.setId); 
    }
  },
  beforeCreate() {//在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。
    console.log("beforeCreate",this.$el,this);
  },
  created() {//在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，property 和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el property 目前尚不可用。
    console.log("created",this.$el,this);
  },
  beforeMount() {//在挂载开始之前被调用：相关的 render 函数首次被调用。该钩子在服务器端渲染期间不被调用。
    console.log("beforeMount",this.$el,this);
  },
  mounted() {  //实例被挂载后调用，这时 el 被新创建的 vm.$el 替换了。如果根实例挂载到了一个文档内的元素上，当 mounted 被调用时 vm.$el 也在文档内。
    console.log("mounted",this.$el,this);
    let num = 1; 
    this.setId = setInterval(() => {
      // this.jimmyData.b = num; //新属性，没有Vue.set的话不会引起页面刷新，但会因为this.bool的变化被顺带刷新渲染了

      this.jimmyData.b && (this.jimmyData.b = num); //先Vue.set新属性，后续直接赋值也能页面渲染更新
      !this.jimmyData.b && Vue.set(this.jimmyData,'b',num); //新增的属性也能强制页面渲染更新
      this.bool = this.jimmyData.b % 2 == 0;
      num+=1;
      if(num>=5){
        this.cln_intvl();
        return
      }
    }, 1000);
  },
  beforeUpdate: function () {//数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。
    console.log('beforeUpdate');
  },
  updated: function () {//由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。//该钩子在服务器端渲染期间不被调用。
    //注意 updated 不会保证所有的子组件也都一起被重绘。如果你希望等到整个视图都重绘完毕，可以在 updated 里使用 vm.$nextTick：
    this.$nextTick(function () {
      console.log('updated');
    })
  },
  activated() { //被 keep-alive 缓存的组件激活时调用。
    console.log("activated");
  },
  deactivated() {//被 keep-alive 缓存的组件停用时调用。
    console.log("deactivated");
  },
  beforeDestroy() {//实例销毁之前调用。在这一步，实例仍然完全可用。
    console.log("beforeDestroy");
    this.cln_intvl();
  },
  destroyed() {//实例销毁后调用。该钩子被调用后，对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。
    console.log("destroyed");
  },
  errorCaptured() {//当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。
    console.log("errorCaptured");
  },
 
};
</script>

<style lang="less" scoped>
</style>