<template>
    <div class="msg-detail">
        <div class="msg-box flex-s-c">
            <image :src="info.profilePicture" class="img-user m-r-30 f-shrink-0" :class="{'img-empty':!info.profilePicture}" mode="aspectFit"></image>
            <div class="msg">
                <div class="name">{{info.userName}}</div>
                <!-- <div class="edit-box flex-s-c" @click="edit">
                    <image class="img-edit m-r-5" mode="aspectFit"></image>
                    <div>编辑我的个人信息</div>
                </div> -->
            </div>
        </div>
        <div class="btn-box flex-b-c">
            <div class="btn flex-c-c" @click="jump(item)" :class="{sm:item.id==2}" v-for="item in btnList" :key="item.id">
                {{item.text}}
            </div>
        </div>
    </div>  
</template>

<script>
const app = getApp(); 
const pageOption = Page.BaseComp({
    data() {
        return {
            info:{}, 
            btnList:[{
                id:0,
                text:"预约记录",
                url:"/pages/counseling/reserve-record/reserve-record"
            },{
                id:1,
                text:"我的坐班表",
                url:"/pages/counseling/reserve-time/reserve-time"
            },{
                id:2,
                text:"设置",
                url:"/pages/counseling/reserve-setting/reserve-setting"
            }],
        }
    },
    mounted () {
        this._checkLogin().then(()=>{
            this.info = app.IM.userInfo||{};
        })
    },
    methods: {
        edit(){

        },
        jump(e) {
            console.log(e);
            this.jumpAction(e.url||"");
        }
    },
})
export default pageOption
</script>

<style lang="scss" scoped>
.msg-detail{
    min-height: 276rpx;
    background-color: #fff;
    padding: 30rpx;
    box-sizing: border-box;
    .msg-box{
        margin-bottom: 40rpx;
        .img-user{
            width: 130rpx;
            height: 130rpx;
            border-radius: 50%;
            overflow: hidden;
            &.img-empty{
                background: #F6F6F6;
            }
        }
        .name{
            font-size: 38rpx;
            font-weight: bold;
        }
    }
    .btn-box{
        width: 100%;
    }
    .btn{
        width: 268rpx;
        height: 80rpx;
        background: #FFFFFF;
        border-radius: 6rpx;
        border: 1px solid #DDDDDD;
        font-size: 22rpx;
        &.sm{
            width: 130rpx;
        }
    }
}
</style>