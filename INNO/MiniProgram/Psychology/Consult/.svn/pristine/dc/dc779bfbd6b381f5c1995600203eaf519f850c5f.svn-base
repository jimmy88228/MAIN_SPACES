<template>
    <div class="reserve-detail">
         <div class="box">
            <div class="title-box flex-s-c">
                <div class="m-r-10 font-24">预约时间</div>
                <div class="state" v-if="roomInfo.stateText" :class="{active:roomInfo.appointmentType=='STARTING'||roomInfo.appointmentType=='UNSTART'}">{{roomInfo.stateText}}</div>
            </div>
            <div class="time-box flex-c-c flex-col">
                <div class="date-text font-20 C_7f">{{roomInfo.scheduleDay||''}}</div>
                <div class="time-text bold m-b-20 flex-c-c">
                    <span>{{roomInfo.timeFrameArr && roomInfo.timeFrameArr[0]||''}}</span>
                    <span class="m-l-20 m-r-20 row-line"></span>
                    <span>{{roomInfo.timeFrameArr && roomInfo.timeFrameArr[1]||''}}</span>
                </div>
                <div class="time-tip">共 {{timeDuration||''}}</div>
            </div>
         </div>
         <div class="box flex-s-c">
            <div class="portrait-box m-r-30"> 
                <div class="cir-state" :class="{active:onlineInfo.online}"></div>
                <image class="img-user" mode="aspectFit" :src="roomInfo.profilePicture||(staticAddress+'/common/default-header.png')"></image>
                <!-- <image class="img-user" :class="{'img-empty':!roomInfo.profilePicture}" mode="aspectFit" :src="roomInfo.profilePicture||''"></image> -->
            </div>
            <div class="user-info">
                <div class="name">{{roomInfo.userName||''}}{{peerIdentify}}</div>
                <div class="user-state" :class="{active:onlineInfo.online}">{{onlineInfo.online?'在线':'不在房间'}}</div>
            </div>
         </div>
    </div>  
</template>

<script>
import dateUtil from "@/common/support/utils/date-util.js"
const pageOption = Page.BaseComp({
    computed:{ 
        timeDuration(){
            return this.roomInfo.timeDuration && dateUtil.spanFormat(parseInt(this.roomInfo.timeDuration)*1000,'H小时m分钟',true) || ""
        }, 
        peerIdentify(){
            return this.isPsyConsultant == 1 ? '（咨询者）':'（咨询师）' //对方职称
        }
    },
    props: {
        onlineInfo: {
            type: Object,
            default: ()=>({})
        },
        roomInfo: {
            type: Object,
            default: ()=>({})
        },
        isPsyConsultant:String

    },
    data() {
        return {
        }
    },
    methods: {  
        loadData(params) {
            return this.getAppointmentRoomInfo(params).then(res=>{
                if(res.code){  
                    return res.data||{}
                }
                return Promise.reject(res)
            })
        },  
        getAppointmentRoomInfo(params){
            return this.$Http(this.$Apis.getAppointmentRoomInfo,{
                data:params,
                other:{
                    showLoading:!this.isInited
                }
            }).finally(()=>{
                this.isInited = true;
            })
        }
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
            padding-bottom: 45rpx;
        }
        .date-text{
            margin-top: 55rpx;
        }
        .time-text{
            font-size: 48rpx;
            margin: 20rpx 0;
        }
        .row-line{
            width: 20rpx;
            height: 5rpx;
            background: #000;
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
                &.active{
                    background-color: #39CA2D;
                }
            }
            .img-user{
                width: 100%;
                height: 100%;
                overflow: hidden;
                border-radius: 50%;
                &.img-empty{
                    background: #F6F6F6;
                }
            }
            .user-info{
                .name{
                    font-size: 22rpx;
                    margin-bottom: 10rpx;
                }
                
            }
        } 
        .user-state{
            font-size: 20rpx;
            color: #B2B2B2;
            &.active{
                color: #21B014;
            }
        }
    }
}
</style> 