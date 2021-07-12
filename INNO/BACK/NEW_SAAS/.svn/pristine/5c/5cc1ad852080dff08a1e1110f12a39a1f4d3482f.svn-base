<template>
	<Card class="goods-editor">
		<Steps :current="currentStep" class="step-box">
      <Step title="编辑基本信息" class="step-item" @click.native="onPreStep"></Step>
      <Step title="编辑商品详情" class="step-item" @click.native="onNextStep"></Step>
	  </Steps>

    <div class="editor-box" v-show="currentStep==0" :style="'height:'+boxHeight+'px;'">
      <!--编辑基本信息组件-->
      <goodsEditorBasic ref="goods-editor-basic" @on-next-step="nextStepCallback" @on-success="basicSaveSuccess"></goodsEditorBasic>
    </div>
    
    <div v-show="currentStep==1" :style="'height:'+boxHeight+'px;overflow:hidden'">
      <!--编辑商品描述编辑器组件-->
      <editorMain ref="goods-page-editor" pageType="goods"></editorMain>
    </div>
    
    <div style="text-align: center;border-top:1px solid #eee;padding-top:10px;">
      <Button @click="back" v-if="goodsInfo.handle.add || goodsInfo.handle.edit">返回至列表</Button>
      <Button v-show="currentStep == 1" type="default" @click="onPreStep">上一步</Button>
      <Button v-show="currentStep == 1" v-if="goodsInfo.handle.add || goodsInfo.handle.edit" type="primary" @click="onSaveGoodsAndPublic">保存并发布</Button>

      <Button v-show="currentStep == 0" v-if="goodsInfo.handle.add || goodsInfo.handle.edit" type="primary" @click="onSaveGoods">保存</Button>
      <Button v-show="currentStep == 0" type="success" @click="onNextStep">下一步</Button>
    </div>
    <!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</Card>
</template>

<script>
import util from '@/libs/util.js';
import goodsEditorBasic from './goods-editor-basic';
import editorMain from '@/views/plugins/pages/editor-main';
import Control from '@/libs/page-control';

export default {
  components: {
    goodsEditorBasic,
    editorMain
  },
  mixins: [Control],
  data () {
    	return {
      currentStep: 0,
      boxHeight: 400,
      goodsCode: '',
      spinShow: false,
      currGoodsId: 0,
      waitForNext: false,

      goodsInfo:{
      	handle:{}
      },
    	}
   	},
   	methods: {
    	// 初始化
    	init () {
    		// 动态计算表高度
        	this.boxHeight = document.body.clientHeight - 195;
        	// 获取url 传递的参数
        	this.goodsCode = this.$route.params.id ? this.$route.params.id : '0';
        	// 加载数据
        	this.initData();
    	},
    	// 加载数据
    initData () {
      this.spinShow = true;
      // ajax 请求获取数据
      util.ajax.post(util.apiUrl.goodsInfo, {
          goods_id: this.goodsCode
        })
      .then((response) => {
        this.spinShow = false;
        var res = response.data;
        if (res.code) {
          this.goodsInfo = res;
          // 初始化组件数据
          this.$refs['goods-editor-basic'].initData(res);

          this.currGoodsId = typeof (res.data.goods_id) !== 'undefined' ? res.data.goods_id : 0;
          if (this.currGoodsId > 0) {
              this.$refs['goods-page-editor'].initData(this.currGoodsId);
            }
          }
      });
    },
    // 保存商品
    onSaveGoods (callback = null) {
      // this.spinShow = true;
      // 触发基本信息组件保存
      this.$refs['goods-editor-basic'].saveGoods(callback);
    },
    onSaveGoodsAndPublic () {
      // 触发商品描述信息的保存
      this.$refs['goods-page-editor'].onPageSave();
    },
    // 保存后的回调
    basicSaveSuccess () {
      this.spinShow = false;
    },
    // 上一步
    onPreStep () {
      this.currentStep = 0;
    },
    // 下一步
    onNextStep () {
      if (this.currGoodsId == 0) {
        // 必须保持完毕才能走下一步
        this.waitForNext = true;
        this.onSaveGoods((goodsId)=>{
          //this.currGoodsId = goodsId;
          this.nextStepCallback();
        });
        // this.nextStepCallback();
      } else {
        this.$refs['goods-editor-basic'].nextStep(this.currentStep);

        // 触发一下事件，让部分组件重新生效
        this.$nextTick(() => {
          var myEvent = new window.Event('resize');
          window.dispatchEvent(myEvent);
        });
      }
    },
    // 下一步回调
    nextStepCallback () {
      this.currentStep = 1;
    },
    back () {
      this.$router.go(-1);
    }
  },
  watch: {
    // 监听新goodsId的创建
    '$store.state.app.newGoodsId': {
      handler: function(to) {
        if (this.waitForNext == true) {
          this.waitForNext = false;
          this.currGoodsId = to;
          
          // 初始化商品描述编辑器
          this.$refs['goods-page-editor'].initData(this.currGoodsId);

          this.spinShow = true;
          setTimeout(() => {
            this.spinShow = false;
            this.$refs['goods-editor-basic'].nextStep(this.currentStep);

            // 触发一下事件，让部分组件重新生效
            this.$nextTick(() => {
              var myEvent = new window.Event('resize');
              window.dispatchEvent(myEvent);
            });
          }, 3000); // 这里一定要给够时间给编辑器初始化
        }
      },
      immediate: true
    }
    
    // '$store.state.app.newGoodsId' (to) {
    //   if (this.waitForNext == true) {
    //     this.waitForNext = false;
    //     this.currGoodsId = to;

    //     // 初始化商品描述编辑器
    //     this.$refs['goods-page-editor'].initData(this.currGoodsId);

    //     this.spinShow = true;
    //     setTimeout(() => {
    //       this.spinShow = false;
    //       this.$refs['goods-editor-basic'].nextStep(this.currentStep);

    //       // 触发一下事件，让部分组件重新生效
    //       this.$nextTick(() => {
    //         var myEvent = new window.Event('resize');
    //         window.dispatchEvent(myEvent);
    //       });
    //     }, 3000); // 这里一定要给够时间给编辑器初始化
    //   }
    // }
  },
  mounted () {
    	this.init();
  }
}
</script>

<style lang="less">
.goods-editor{
	.ivu-card-body{
		padding-right:2px;
	}
	.editor-box{
		overflow:hidden auto;
	}
	.step-box{
		padding-bottom:15px;
		border-bottom:1px solid #eee;
    padding-left:20px;
    padding-right:20px;

		.step-item{
			cursor: pointer;
		}
	}
}
</style>
