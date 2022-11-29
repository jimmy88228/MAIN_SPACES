<template>
  <div class="operate-view">
    <div class="operate-btn">
      <div></div>
      <p class="play">
        <span class="play-item"></span>
        <span class="play-item"></span>
      </p>
      <div></div>
    </div>
    <div class="operate-progress">
      <span class="progress-l">00:04</span>
      <p class="progress"><span></span></p>
      <span class="progress-r">11:50</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "operateBar",
  data(){
    return{

    }
  }
}
</script>

<style lang="less" scoped>
.operate-view{
  padding: 10px;
  .operate-btn{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .play{
      .play-item{
        display: inline-block;
        width: 3px;
        height: 12px;
        border-radius: 8px;
        background-color:#B2B2B2;
      }
    }
  }
  .operate-progress{
    display: flex;
    align-items: center;
    justify-content: space-between;
    color:#B2B2B2;
    .progress-l{
      margin-right: 5px;
    }
    .progress-r{
      margin-left: 5px;
    }
    .progress{
      background-color:#F6F6F6;
      flex: 1;
      height: 6px;
      position:relative;
      border-radius: 6px;
      overflow: hidden;
      span{
        display: inline-block;
        width: 20%;
        height:100%;
        background-color:#AFDAAB;
        position:absolute;
        top:0px;
        left:0px;
      }
    }
  }
}
</style>