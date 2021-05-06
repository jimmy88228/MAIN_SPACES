<template>
  <div id="app">
    <div id="nav">
      | <router-link to="/">Index</router-link> |
      <router-link to="/GlobalApi">GlobalApi</router-link> |
      <router-link to="/ExtendDemo">ExtendDemo</router-link> |
      <router-link to="/OpsData">OpsData</router-link> |
      <router-link to="/OpsDom">OpsDom</router-link> |
      <router-link to="/Lifecycle">Lifecycle</router-link> |
      <router-link to="/OpsResource">OpsResource</router-link> |
      <router-link to="/Combination">Combination</router-link> |
      <router-link to="/opsElse">opsElse</router-link> |
      <router-link to="/InstanceProperty">InstanceProperty</router-link> |
      <router-link to="/InstanceData">InstanceData</router-link> |
      <router-link to="/InstanceEmit">InstanceEmit</router-link> |
      <router-link to="/instanceLifeCycle">instanceLifeCycle</router-link> |
      <router-link to="/vInstructions">vInstructions</router-link> | 
    </div>
    <div id="app2"></div>
    <transition name="fade">
      <router-view class="pst_ab ROUTER-VIEW"/>
    </transition>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
}

#nav {
  padding: 10px 0 20px 0;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.fade-enter-active{
  opacity: 0;
  transition: all 300ms linear;
}
.fade-enter-to{
  opacity: 1;
}
.fade-leave-active{
  opacity: 1;
  transition: all 300ms linear;
}
.fade-leave-to{
  opacity: 0;
}
.pst_ab{
  position: absolute;
  width: 100%;
}
ul{
  padding: 0;
  margin: 0;
}
.li {
  // list-style-type: none;
}
h1,h2,h3{
  margin: 0;
}
.i_b{
  display: inline-block;
  vertical-align: middle;
}
</style>
