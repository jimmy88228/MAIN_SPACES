<template>
    <div>
        <Modal v-model="showAll" :width="500" class-name="notice-more-modal" class="notice-more-modal-area">
            <div slot="header">错误原因</div>
            <p v-for="(item, index) in errorData" :key="index">{{item}}</p>
            <div slot="footer">
                <Button type="primary" @click="showAll = false">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    name: "mqNotice",
    components: {},
    data() {
        return {
            jobId: 0,
            percent: 0,
            // 停止ajax 加载刷新进度
            stopLoad: false,
            // 下载文件地址
            downloadUrl: "",
            downloadShow: "none",
            // 处理结果
            resultMsg: "",
            resultMsgShow: "none",
            resultMsgColor: "auto",
            // 检查job进度的时间
            second: 5000,
            type: "download",
            timer: null,
            errorData: [],
            showAll: false
        };
    },
    methods: {
        // 初始化
        init() {},
        showNotice(jobId, type = "download") {
            // download 显示下载链接
            // none 隐藏链接
            this.jobId = jobId;
            this.percent = 0;
            this.downloadUrl = "";
            this.downloadShow = "none";
            this.resultMsg = "";
            this.resultMsgShow = "none";
            this.resultMsgColor = "auto";
            this.stopLoad = false;
            this.type = type;
            this.$Notice.info({
                duration: 0,
                title: "正在处理任务",
                onClose: () => {
                    if (this.timer) {
                        clearTimeout(this.timer);
                        this.timer = null;
                    }
                    this.stopLoad = true;
                    if (this.$store.state.app.isNoticeModal) return;
                },
                render: (h) => {
                    let msgList = [];
                    this.errorData.map((item, index)=>{
                        msgList.push(
                            h("p", {
                                style: { color: this.resultMsgColor }
                            }, item)
                        )
                    })
                    let minList = msgList.slice(0, 2);
                    return h("div", [
                        // 进度条
                        h("Progress", {
                            props: {
                                percent: this.percent,
                            },
                        }),
                        // 下载提示
                        h("a",
                            {
                                style: {
                                    display: this.downloadShow,
                                    marginTop: "5px",
                                },
                                on: {
                                    click: () => {
                                        window.open(this.downloadUrl);
                                    },
                                },
                            },"下载"),
                        // 消息提示
                        h("strong",
                            {
                                style: {
                                    display: this.resultMsgShow,
                                    marginTop: "5px",
                                    color: this.resultMsgColor,
                                },
                            },
                            this.resultMsg
                        ),
                        this.percent > 100 ? h(
                            "p",
                            {
                                style: {
                                    display: "flex",
                                    marginTop: "5px",
                                    alignItems: "flex-end",
                                    justifyContent: "space-between"
                                },
                            },
                            [
                                h("p", minList),
                                h("strong",{
                                    style: { whiteSpace: "nowrap", textDecoration: "underline", cursor: "pointer", color: "#2F8CEE", fontSize: "12px" , display: msgList.length > minList.length ? 'block' : 'none'},
                                    on: {
                                        click:()=>{
                                            this.showAll = true;
                                        }
                                    }
                                },"查看更多"),
                            ]
                        ) : '',
                    ]);
                },
            });
            // 监听进度
            this.checkProgress();
        },
        // 检查进度
        checkProgress() {
            // n 秒一次检查进度
            this.timer = window.setTimeout(() => {
                if (this.percent < 100 && this.stopLoad == false) {
                    // ajax 请求获取初始化数据，然后动态更新下面数据源
                    this.$MainApi.mqProgress({
                            data: {
                                job_id: this.jobId,
                            },
                        })
                        .then((res) => {
                            if (res.code) {
                                let data = res.data || {};
                                this.percent = data.percent;
                                if(this.percent > 100){ // 错误
                                    this.resultMsgShow = "block";
                                    this.resultMsg = data.message;
                                    this.resultMsgColor = "red";
                                    this.errorData = data.error_data || [];
                                    this.$emit("finish");
                                } else if(this.percent == 100){
                                    if (this.type == "download" && data.isDownload)  this.downloadShow = "block";
                                    this.downloadUrl = data.downloadUrl;
                                    this.resultMsgShow = "block";
                                    this.resultMsg = data.message || '操作成功';
                                    this.resultMsgColor = "green";
                                    this.$emit("finish");
                                    // 通知父组件，处理完毕
                                    this.$emit("on-success");
                                }
                                // 递归处理
                                this.checkProgress();
                            } else {
                                // 进度出错提示
                                this.resultMsgShow = "block";
                                this.resultMsg = res.message;
                                this.resultMsgColor = "red";
                            }
                        });
                }
            }, this.second);
        },
    },
    mounted() {
        this.init();
    },
};
</script>
<style lang="less">
.notice-more-modal-area{
    .ivu-modal-mask{
        z-index: 1100 !important;
    }
    .notice-more-modal{
        z-index: 1100 !important;
    }
}
    
</style>
