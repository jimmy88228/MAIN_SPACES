<template>
    <div class="p-t-15">
        <Form class="edit-activity" :label-width="140" ref="actSettingForm" :model="actSetting">
            <FormItem label="活动详情" prop="detail_bg_img">
                <img-view uploadType="activity" :img="actSetting.detail_bg_img" @selectImg="(data)=>selectActImg(data, 'detail_bg_img')" @delImg="actSetting.detail_bg_img = ''"></img-view>
                <!-- <span class="notice">建议尺寸200*200px</span> -->
            </FormItem>
            <FormItem label="活动详情底色" prop="detail_bg_color">
                <ColorPicker v-model="actSetting.detail_bg_color" />
            </FormItem>
            <FormItem label="做题背景" prop="answer_bg_img">
                <img-view uploadType="activity" :img="actSetting.answer_bg_img" @selectImg="(data)=>selectActImg(data, 'answer_bg_img')" @delImg="actSetting.answer_bg_img = ''"></img-view>
                <!-- <span class="notice">建议尺寸200*200px</span> -->
            </FormItem>
        </Form>
    </div>
</template>

<script>
export default {
    props: {
        actSetting: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    data() {
        return {};
    },
    methods: {
        initData() {},
        selectActImg(data, key) {
            this.$set(this.actSetting, key, data);
        },
        save() {
          
            if(!Number(this.pageQuery.id)){
              this.$Message.warning("无效活动ID");
              return Promise.reject();
            }
            let req = "appraisalActivityCustomSave";
            return this.$MainApi[req]({
                data: {
                    activity_id: this.pageQuery.id,
                    ...this.actSetting
                },
            }).then((res) => {
                if (!res.code) {
                    this.$Message.warning(res.message);
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
.operate-area {
    position: sticky;
    left: 0px;
    bottom: 0px;
    padding-left: 140px;
    background-color: #fff;
}
</style>