<template>
    <div class="reserve-detail">
         <div class="box">
            <div class="title-box flex-s-c">
                <div class="m-r-10 font-24">预约时间</div>
                <div class="state" :class="{active:roomInfo.state==1||roomInfo.state==2}">{{stateText[roomInfo.state]}}</div>
            </div>
            <div class="time-box flex-c-c flex-col">
                <div class="time-text m-b-20">{{timeText}}</div>
                <div class="time-tip">共 1小时30分钟</div>
            </div>
         </div>
         <div class="box flex-s-c">
            <div class="portrait-box m-r-30">
                <div class="cir-state" :class="{active:userInfo.state == 1}"></div>
                <image class="img-user" mode="aspectFit" :src="userInfo.pic||''"></image>
            </div>
            <div class="user-info">
                <div class="name">{{userInfo.name||''}}</div>
                <div class="user-state" :class="{active:userInfo.state == 1}">{{userState[userInfo.state]}}</div>
            </div>
         </div>
    </div>  
</template>

<script>
const pageOption = Page.BaseComp({
    props: {
        roomInfo: {
            type: Object,
            default: ()=>({})
        },
    },
    computed:{
        timeText(){
            console.log('this.roomInfo',this.roomInfo)
            let time = this.roomInfo && this.roomInfo.time || {};
            return time[0] && time[1] ? time[0] + ' - ' + time[1] :'';
        },
        userInfo(){
            return this.roomInfo && this.roomInfo.userInfo || {};
        }
    },
    data() {
        return {
            stateText:{
                0:"已关闭",
                1:"待开始",
                2:"进行中",
                3:"已结束",
            },
            userState:{
                0:"不在房间",
                1:"在线"
            }
        }
    },
    methods: { 
    },
})
export default pageOption
</script>

<style lang="scss" scoped> 
.reserve-detail{
    box-sizing: border-box;
    .box{
        padding: 30rpx;
        box-sizing: border-box;
        border-radius: 20rpx;
        margin-bottom: 20rpx;
        background-color: #fff;
        &:last-child{
            margin-bottom: 0;
        }
        .state{
            font-size:16rpx;
            padding: 4rpx 6rpx;
            color: #b2b2b2;
            background-color:rgba(231,231,231,0.27);
            border-radius: 6rpx;
            border: 1px solid;
            border-color: rgba(141,141,141,0.27);
            &.active{
                color: #21B014;
                background-color:rgba(227, 255, 231, 0.5); 
                border-color: rgba(53,172,71,0.5);
            }
        }
        .time-box{
            height: 180rpx;
        }
        .time-text{
            font-size: 48rpx;
            margin-top: 10rpx;
        }
        .time-tip{
            font-size: 20rpx;
            color: #727272;
            border-radius: 6rpx;
            padding: 6rpx 18rpx;
            background-color: rgba(230,230,230,0.34);   
        }
        .portrait-box{
            width: 88rpx;
            height: 88rpx;
            position: relative;
            margin-right: 20rpx;
            .cir-state{
                width:  18rpx;
                height:  18rpx;
                border-radius: 50%;
                background-color: #ACACAC;
                border: 1px solid #fff;
                position: absolute;
                top:0;
                left: 0;
                z-index: 2;
            }
            .img-user{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: #F6F6F6;
            }
            .user-info{
                .name{
                    font-size: 22rpx;
                    margin-bottom: 10rpx;
                }
                .user-state{
                    font-size: 20rpx;
                    background-color: #B2B2B2;
                    &.active{
                        background-color: #21B014;
                    }
                }
                
            }
        } 
    }
}
</style> 