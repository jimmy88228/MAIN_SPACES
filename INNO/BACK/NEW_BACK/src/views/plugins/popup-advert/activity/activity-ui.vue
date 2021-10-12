<template>
  <div class="activity-ui">
    <div class="container">
      <div class="box" :style="boxStyle">
        <div class="header">
          <img v-if="topImg" class="img" :src="topImg"/>
          <p v-else>顶部宣传图</p>
        </div>
        <div class="content">
          <div class="scroll" v-if="content.length">
            <img v-for="item in content" :key="item.id" class="img" :src="item.src"/>
          </div>
          <p class="text" v-else>广告图</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['topImg', 'color', 'content'],
  computed: {
    boxStyle() {
      return {
        background: this.color
      }
    }
  }
}
</script>

<style lang="less" scoped>
.activity-ui{
  .container{
    width: 400px;
    height: 800px;
    background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 100px 0;
    .box{
      width: 360px;
      height: 600px;
      background: #8240de;
      border-radius: 10px;
      margin: 0 auto;
      color: #ffffff;
      .header{
        height: 100px;
        border-bottom: 1px solid #ffffff;
        text-align: center;
        line-height: 100px;
        .img{
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      .content{
        text-align: center;
        .scroll{
          width: 100%;
          height: 450px;
          scrollbar-width: none; /* firefox */
          -ms-overflow-style: none; /* IE 10+ */
          overflow-x: hidden;
          overflow-y: scroll;
          padding: 20px;
          .img{
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          &::-webkit-scrollbar {
            display: none; /* Chrome Safari */
          }
        }
        .text{
          line-height: 500px;
        }
      }
    }
  }
}
</style>
