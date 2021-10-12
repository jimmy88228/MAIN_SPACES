<template>
  <div class="activity-ui">
    <div class="container">
      <div class="box" :style="boxStyle">
        <div class="header">
          <p>{{couponData.name}}</p>
          <p>你还有{{couponData.num}}张优惠券待使用</p>
          <p>即将到期的优惠券</p>
        </div>
        <div class="content">
          <div v-for="item in couponData.list" :key="item.id" class="item">
            <div class="left">
              <p class="name">{{item.name}}</p>
              <p class="sign">{{item.outday}}天后到期</p>
              <span v-if="item.canUse" class="use">去使用</span>
            </div>
            <div class="right">
              <p class="sign">{{item.discount}}{{item.type === 1 ? '折' : '元'}}</p>
              <p>满xx元可用</p>
            </div>
          </div>
        </div>
        <div class="footer">
          <a class="more">查看更多</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['color', 'couponData'],
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
    height: 600px;
    background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 100px 0;
    .box{
      width: 360px;
      background: #8240de;
      border-radius: 10px;
      margin: 0 auto;
      color: #ffffff;
      padding: 20px;
      .header{
        text-align: center;
      }
      .content{
        .sign{
          color: red;
        }
        .item{
          display: flex;
          align-items: flex-start;
          color: #000;
          width: 320px;
          box-sizing: border-box;
          padding: 10px;
          background: #fff;
          margin-bottom: 10px;
          .left{
            margin-right: 10px;
            flex-basis: 60%;
            border-right: 1px solid #000;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            .name{
             text-overflow: ellipsis;
             white-space: nowrap;
             overflow: hidden;
            }
            .use{
              display: inline-block;
              padding: 4px 6px;
              color: #fff;
              background: red;
              border-radius: 2px;
              margin-top: 4px;
            }
          }
        }
      }
      .footer{
        text-align: center;
        .more{
          display: inline-block;
          width: 100px;
          height: 30px;
          line-height: 30px;
          border-radius: 5px;
          background: #f90;
          color: #fff;
        }
      }
    }
  }
}
</style>
