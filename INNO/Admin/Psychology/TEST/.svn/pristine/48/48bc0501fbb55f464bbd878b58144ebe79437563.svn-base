<template>
    <div>
        <div class="early-warn-area">
            <count-info @clickTap="e=>getPoint(e)" class="m-t-10 m-b-15" type="list" :info-data="examineInfo"></count-info>
            <div class="survey-list">
                <div class="survey-item" v-for="(item, index) in levelList" :key="index">
                    <div class="item-area" @click="getPoint('formal', item.id)">
                        <div class="area-content">
                            <div class="color-circle flex-c-e" :style="'background:'+[warnText[item.id].color]+';'">
                                <div class="color-text">{{warnText[item.id].text}}</div>
                            </div>
                            <p class="item-tip">{{item.level_name}}</p>
                            <span class="item-val">{{item.get_user_count}}</span>
                        </div>
                        <span class="text-arrow-radius">查看</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CountInfo from "./count-info.vue";
export default {
    name: "earlyWarnIndex",
    components: {CountInfo},
    data() {
        return {
            examineInfo: {},
            levelList: [],
            warnText:{
                '1':{
                    text:"轻",
                    color:"linear-gradient(180deg, rgb(189, 220, 241) 0%, rgb(230, 248, 255) 100%)",
                },
                '2':{
                    text:"中",
                    color:"linear-gradient(157deg, rgba(145, 183, 254,0.78) 0%, rgba(187, 222, 254,0.78) 100%)",
                },
                '3':{
                    text:"重",
                    color:"linear-gradient(180deg, rgba(202, 0, 11,0.66) 0%, rgba(255, 116, 0,0.66) 100%)",
                }
            }
        };
    },
    methods: {
        onLoadData(page, extraData) {
            return this.$MainApi
                .forewarningList({
                    data: {},
                    other: {
                        isShowLoad: true,
                        isErrorMsg: true
                    }
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        this.examineInfo = data.info || {};
                        this.levelList = data.items || [];
                    }
                });
        },
        getPoint(key, param) {
            let name = "",query = {};
            if(key == 'formal'){ 
                name = "earlyWarnFormal"
                query = {
                    levelState: param||0,
                };
            }else{
                name = "earlyWarnExamine";
                query = {
                    state: Number(key||0),
                };
            } 
            this.$router.push({
                name: name,
                query: query,
            });
        },
    },
    mounted() {
        this.onLoadData();
    },
};
</script>

<style lang="less" scoped>
.early-warn-area {
    // display: flex;
    .survey-item {
        width:240px; 
        margin-right: 10px;
        flex-shrink: 0;
        .item-area-list {
            // height: 100%;
            display: flex;
            flex-direction: column;
            .list-item {
                flex: 1;
            }
        }
        .item-area {
            background: #ffffff;
            border-radius: 10px;
            position: relative;
            padding: 25px;
            height: 160px;
            overflow: hidden;
            cursor: pointer;
            .tip {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #909090;
                line-height: 22px;
                vertical-align: middle;
                display: inline-block;
            }
            .val {
                font-size: 26px;
                font-family: Helvetica-Light, Helvetica;
                font-weight: 300;
                color: #222222;
                line-height: 31px;
                vertical-align: middle;
                display: inline-block;
            }
            .area-content {
                padding-top: 35px;
                .item-icon {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(
                        180deg,
                        #bddcf1 0%,
                        #e6f8ff 100%
                    );
                    margin: 0 auto;
                    display: block;
                    margin-bottom: 11px;
                }
                .item-tip {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #909090;
                    line-height: 20px;
                    margin-bottom: 10px;
                }
                .item-val {
                    font-size: 26px;
                    font-family: Helvetica-Light, Helvetica;
                    font-weight: 300;
                    color: #222222;
                    line-height: 31px;
                }
            }
        }
        .item-area:hover {
            box-shadow: 0px 0px 10px #e0e0e0;
        }
    }
    .survey-list{
        flex: 3;
        display: flex;
    }
    .color-circle{
        width: 202px;
        height: 188px;
        border-radius: 0px 0 100px 160px;
        position: absolute;
        right: -53px;
        top: -104px;
        color: #fff;
        font-size: 32px;
    }
    .color-text{
        padding-bottom: 25px;
    }
}
</style>