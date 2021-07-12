<style lang="less">

</style>

<template>
	<div>
		<Modal
    		v-model="showM"
    		title="发送微信消息"
    		:width="880"
    		:styles="{top:'100px'}"
    		class="image-text"
	    	>
        <div class="p-left-15 m-bottom-15 model-tip">
          <div>1、素材来自微信公众号后台，在创建群发，请到微信公众号后台设置到群发素材。</div>
          <div>2、服务号群发消息给个人，一个月最多发送4次，超过次数个人会接收不到。</div>
        </div>
	    	<Tabs type="card" @on-click="changeTab">
          <TabPane label="文本信息" icon="md-bookmarks">
            <Input type="textarea" v-model="viewVal"/>
          </TabPane>
          <TabPane label="图片信息" icon="md-images">
            <image-edit class="lable-img-edit" :img="this.viewVal" @selectImg="openImagesModal" @delImg="this.viewVal = ''">
              <p class="strong_tips">图片尺寸最佳是900*383，格式为 jpg 或 png，图片大小控制在200KB</p>
            </image-edit>
          </TabPane>
          <!-- <TabPane label="图文信息" icon="md-paper">
            <div>
              <div></div>
            </div>
          </TabPane> -->
      </Tabs>
      <div slot="footer">
        <Button type="default" @click="showM = false">取消</Button>&nbsp;&nbsp;
        <Button type="primary" @click="okEvent">确定</Button>
      </div>
	    </Modal>
	</div>
</template>

<script>
import imageEdit from '@/views/my-components/image-edit/image-edit'
export default {
  name: 'imageText',
  components: {
    imageEdit
  },
  data () {
    	return {
        showM: false,
        viewVal: "",
    	}
	},
  computed: {},
  mounted () {
    
  },
  methods: {
    showModal(config){
      this.showM = true;
    },
    openImagesModal () {
      this.$selectMaterial({
        type: 'image',
        selectedData: "",
        getList: (item) => {
          console.log("图片", item)
          this.viewVal = item.src;
        }
      });
    },
    changeTab(val){
      this.viewVal = "";
    },
    okEvent(){
      if(!this.viewVal) {
        this.$Message.warning("发送内容不能为空");
        return;
      }
      this.showM = false;
      this.$emit("on-ok", {
        data: this.viewVal
      });
    }
  }
}
</script>
<style lang="less">
  .image-text{
    .model-tip{
      color:red;
    }
    .ivu-tabs-tabpane{
      min-height:300px;
      .lable-img-edit{
        .image-box{
          border:1px dashed #d2d2d2;
          width:300px;
          height:127px;
          .ivu-icon-md-add{
            line-height:130px;
          }
          .img{
            height:100%;
          }
          .mask{
            width:100%;
            height:100%;
          }
          .img{
            width:100%;
            display:block;
          }
        }
        .strong_tips{
          padding-top:10px;
        }
      }
      
      textarea.ivu-input{
        min-height:200px;
      }
    }
  }
</style>