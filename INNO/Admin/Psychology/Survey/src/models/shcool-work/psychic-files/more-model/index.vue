<template>
    <Modal v-model="modalShow" :footer-hide="true" class="hide-close" :width="1100">
        <div class="module-header flex-b-c m-b-20">
            <div class="model-modal-title fs-18 bold">心理测评量表</div>
            <Button size="large" @click="modalShow = false">关闭</Button>
        </div>
        <div class="model-cont">
            <div class="cont-table">
                <div class="m-item" v-for="(item, index) in modelList" :key="index" @click="checkPoint(item)">
                    <div class="m-item-tip">{{item.model_name}}</div>
                    <div class="m-item-cont">
                        <div>
                            <template v-if="item.complete_time">
                                <p>{{item.points}}</p>
                                <span>{{item.complete_time}}测评得分</span>
                            </template>
                            <template v-else>
                                <div class="no-assess">未测评</div>
                            </template>
                        </div>
                    </div>
                    <span class="arrow-radius"></span>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script>
export default {
  props: {
    studentInfo: {
      type: Object,
      default:()=>{}
    },
    type: {
        type: String,
        default: ""
    }
  },
    data() {
        return {
            modelList: [],
            modalShow: false,
        };
    },
    methods: {
        showModule({ modelList }) {
            this.modalShow = true;
            this.modelList = modelList || [];
        },
        checkPoint(item){
            if(!item.complete_time) return;
            this.$router.push({
                name: this.type == 'earlyWarn' ? "earlyWarnPsychicFilesDetail" : "psychicFilesDetail",
                query: {
                    modelId: Number(item.model_id), 
                    userId: this.studentInfo.user_id + "",
                    type: this.type || ""
                }
            })
        },
    },
};
</script>

<style lang="less" scoped>
.module-header {
    .model-modal-title {
    }
}
.model-cont {
    font-size: 0px;
    position: relative;
    .cont-table {
        display: flex;
        flex-wrap: wrap;
        border-radius: 4px;
        overflow: hidden;
        min-height: 200px;
        .m-item {
            background-color: #fff;
            padding: 15px;
            width: 200px;
            min-height: 100%;
            border-radius: 10px;
            position: relative;
            border: 1px solid #efefef;
            margin-right: 10px;
            margin-bottom: 10px;
            flex-shrink: 0;
            cursor: pointer;
            .m-item-tip {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #333333;
                margin-bottom: 5px;
            }
            .m-item-cont {
                text-align: center;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 30px 0px;
                p {
                    font-family: PingFangSC-Medium;
                    color: #13b1a6;
                    letter-spacing: 1px;
                    font-size: 36px;
                    line-height: 56px;
                    height: 56px;
                    margin-bottom: 3px;
                }
                span {
                    font-family: PingFangSC-Regular;
                    font-size: 13px;
                    color: #b2b2b2;
                }
                .no-assess {
                    font-family: PingFangSC-Regular;
                    font-size: 28px;
                    color: #b2b2b2;
                }
            }
        }
        .m-item:hover{
          box-shadow: 0px 0px 10px #e0e0e0;
        }
    }
}
</style>