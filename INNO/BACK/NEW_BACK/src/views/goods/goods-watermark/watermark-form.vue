<style lang="less" scoped>
.watermark-form{
    .cur_mark{
        margin-bottom: 10px;
    }
    .watermark-form_type{
        display: flex;
        align-items: center;
        justify-content: space-between;
        // .watermark-form_select{
        //     margin-right: 20px;
        // }
    }
    .watermark-form_list{
        display: flex;
        width: 720px;
        height: 370px;
        max-height: 370px;
        border: 1px solid #eee;
        overflow-x: hidden;
        overflow-y: scroll;
        flex-wrap: wrap;
        margin: 0 auto;
        text-align: center;
        .watermark-form_item{
            position: relative;
            border: 2px solid rgba(0, 0, 0, 0.04);
            width: 120px;
            height: 160px;
            margin: 10px;
            border-radius: 5px;
            background: #fff;
            cursor: pointer;
            &:hover{
                box-shadow: 0 0 3px 4px rgba(0,0,0,.05);
            }
            &.watermark-form_item--selected{
                border: 2px solid red;
            }
            .watermark-form_item--fixed{
                position: absolute;
                right: -1px;
                bottom: 0;
                font-size: 24px;
                color: red;
                display: block;
            }
            .watermark-form_img{
                width: 100%;
                height: 120px;
                object-fit: cover;
                padding-top: 2px;
            }
            .watermark-form_name{
                font-size: 12px;
                margin-top: 10px;
                word-break: break-all;
            }
        }
    }
}
</style>
<template>
    <div>
        <Modal
            class="watermark-form"
	        v-model="modalShow"
	        :title="modalTitle"
	        :loading="modalLoading"
            :mask-closable="false"
            :width="750"
	        @on-ok="confirm">
                <!-- <p class="cur_mark">当前水印分类：{{waterMarkType}}</p> -->
                <div class="watermark-form_type">
                    <Select v-model="waterMarkType" class="watermark-form_select" placeholder="请选择水印分类" @on-change="handleChange">
                        <Option v-for="(value, name) in watermarkCat" :value="name" :key="name">{{value}}</Option>
                    </Select>
                    <!-- <Button type="primary">获取水印</Button> -->
                </div>
                <Divider />
                <div class="watermark-form_list">
                    <div class="watermark-form_item"
                        :class="{'watermark-form_item--selected': item.id == saveMarkId}"
                        v-for="item in watermarkList"
                        :key="item.id"
                        @click="selectMark(item.id)">
                        <img :src="item.watermark_url" class="watermark-form_img"/>
                        <span class="watermark-form_name">{{item.watermark_name}}</span>
                        <Icon class="checked-icon ionmy ion-my-checked watermark-form_item--fixed" v-if="item.id == saveMarkId"></Icon>
                    </div>
                </div>
        </Modal>
    </div>
</template>
<script>

export default {
  data () {
    return {
      modalShow: false,
        	modalTitle: '选择水印',
      modalLoading: true,
      waterMarkType: '',
      watermarkCat: null,
      watermarkList: null,
      waterMarkAll: null,
      // 存储水印id
      saveMarkId: '',
      goods_id: 0
    }
  },
  methods: {
    confirm () {
      if (this.saveMarkId && this.goods_id) {
        return this.$ajax.post(this.$api.goodsWatermarkEdit, {
          goods_id: this.goods_id,
          watermark_id: this.saveMarkId
        })
          .then((response) => {
            var res = response.data;
            if (res.code) {
              // 保存成功
              this.$Message.success(res.message);
              this.modalShow = false;

              // 把数据返回给父级
              this.$emit('on-success', {
                type: 'edit',
                data: res.data
              });
            } else {
              this.modalShow = true;
              this.modalLoading = false;

              setTimeout(() => {
                this.modalLoading = true;
              }, 50);
            }
          });
      } else {
        this.modalShow = true;
        this.$Message.success('请选择水印~');
        this.modalLoading = false;

        setTimeout(() => {
          this.modalLoading = true;
        }, 50);
      }
    },
    // 打开模态框
    openModal (row, watermark_cat, watermark_list) {
      this.goods_id = row.goods_id;
      this.saveMarkId = row.watermark_id || '';

      const waterMarkAll = {};
      const sortMark = Object.keys(watermark_cat);
      sortMark.forEach(item => {
        if (!(item in sortMark)) waterMarkAll[item] = [];
        watermark_list.forEach(markItem => {
          if (item == markItem.watermark_cat) waterMarkAll[item].push(markItem);
        });
      });
      // 初始化数据,默认选中第一组数据
      this.watermarkCat = watermark_cat;
      this.waterMarkAll = waterMarkAll;
      if (this.saveMarkId) {
        // 读取到存在的水印id
        for (const key in sortMark) {
          this.waterMarkAll[sortMark[key]].forEach(item => {
            if (item.id == this.saveMarkId) this.waterMarkType = sortMark[key];
          })
        }
      } else {
        // 默认展示
        this.waterMarkType = sortMark[0];
      }
      this.watermarkList = this.waterMarkAll[this.waterMarkType];

        	this.modalShow = true;
    },
    selectMark (markId) {
      this.saveMarkId = markId;
    },
    handleChange (current) {
      this.watermarkList = this.waterMarkAll[current];
    }
  }
}
</script>
