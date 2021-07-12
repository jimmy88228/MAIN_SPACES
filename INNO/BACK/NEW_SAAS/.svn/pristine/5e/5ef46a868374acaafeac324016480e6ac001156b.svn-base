<style lang="less">

</style>

<template>
	<div>
		<Modal
    		v-model="showM"
    		:width="880"
    		:styles="{top:'100px'}"
    		class="image-text"
	    	>
				<p slot="header">
					<div class="flex f-align-center m-bottom-10 ">
						<div class="space-nowrap fw-bold fs-18">节点设置-{{tip}}&nbsp;&nbsp;</div>
						<Input style="width:250px"/>
					</div>
				</p>
				<div class="p-left-15 m-bottom-15 model-tip">
				  <div>1、素材来自微信公众号后台，在创建群发，请到微信公众号后台设置到群发素材。</div>
				  <div>2、服务号群发消息给个人，一个月最多发送4次，超过次数个人会接收不到。</div>
				</div>
				<Tabs type="card" @on-click="changeTab" :value="currTabs">
				<TabPane v-for="(item, index) in tabs" :key="index" :name="item.name" :label="item.label" v-if="setTab(item.name)">
					<template v-if="item.name == 'TEXT'">
						<Input type="textarea" v-model="setting.content"/>
					</template>
					<template v-else-if="item.name == 'IMAGE'">
						<image-edit class="lable-img-edit" :img="setting.img_url" @selectImg="openImagesModal" @delImg="setting.img_url = ''">
						  <p class="strong_tips">图片尺寸最佳是900*383，格式为 jpg 或 png，图片大小控制在200KB</p>
						</image-edit>
					</template>
					<template v-if="item.name == 'IMAGE-TEXT'">
						<div v-if="false" class="paper-view">
						  <Icon type="md-close-circle" size="25"  class="remove-paper"/>
						  <div class="paper-cont flex">
							<span class="paper-tip">图文</span>
							<p>图文名称</p>
						  </div>
						  <div class="paper-link flex f-just-between">
							<span>阅读全文</span>
							<span>&gt;</span>
						  </div>
						</div>
						<div v-else>
						  <div class="paper-choose">
							<span class="choose-add">+</span>
							<p >选择图文</p>
						  </div>
						</div>
					</template>
					<template v-if="item.name == 'APPLET'">
						<Form :label-width="100" style="width:80%;">
						  <FormItem label="自定义跳转" class="" prop="">
							<Input type="text" v-model="setting.card_url" placeholder="请输入小程序路径"/>
						  </FormItem>
						  <FormItem label="标题" class="" prop="">
							<Input type="text" v-model="setting.card_title" placeholder="请输入节点名称，10字以内"/>
						  </FormItem>
						  <FormItem label="图片" class="" prop="">
							<image-edit :img="setting.img_url">
							  <p class="strong_tips">*小于1M的图片，JPG/PNG格式只能上传一张</p>
							</image-edit>
						  </FormItem>
						</Form>
					</template>
				</TabPane>
			  </Tabs>
			  <div slot="footer">
				<Button type="default" @click="showM = false">取消</Button>&nbsp;&nbsp;
				<Button type="primary" @click="saveSetting">确定</Button>
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
			config: {},
			setting:{},
			tabs: [
				{
					name: "TEXT",
					label: "文本信息",
				},
				{
					name: "IMAGE",
					label: "图片信息"
				},
				{
					name: "IMAGE-TEXT",
					label: "图文信息"
				},
				{
					name: "APPLET",
					label: "小程序卡片"
				}
			],
			currTabs: "TEXT",
			tip:""
    	}
	},
  computed: {},
  mounted () {},
  methods: {
    showModal(config = {}, setting){
      this.showM = true;
	  this.config = config || {};
      this.tip = config.tip || "";
	  this.settingHandle(setting, config);
    },
	settingHandle(setting, config){
		console.log("config", config);
		console.log("before setting", setting);
		if(config.type != 11){
			setting = decodeURIComponent(setting);
			if(typeof(setting) == 'string'){
				setting = JSON.parse(setting);
			}
		} else {
			setting = {
				msg_type: "text",
				content: setting
			}
		}
		console.log("文本信息数据", setting);
		let currTabs = "";
		switch(setting.msg_type){
			case"text":
				currTabs = "TEXT";
				break;
			case"image":
				currTabs = "IMAGE";
				break;
			case"news":
				currTabs = "IMAGE-TEXT";
				break;
			case"miniprogrampage":
				currTabs = "APPLET";
				break;
		}
		this.currTabs = currTabs;
		this.setting = setting;
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
		this.currTabs = val;
		this.viewVal = "";
    },
	saveSetting(){
		if(!this.viewVal) {
		  this.$Message.warning("发送内容不能为空");
		  return;
		}
		this.showM = false;
		this.$emit("saveMsg", {setting: this.setting, level: this.config.level})
	},
	setTab(key){
		let hideTab = this.config.hideTab || [];
		if(hideTab instanceof Array){
			if(key){
				for(let i = 0; i < hideTab.length; i++){
					if(hideTab[i] == key){
						return false;
						break;
					}
				}
			} else {
				return true
			}
		}
		return true
	}
  }
}
</script>
<style lang="less">
  .image-text{
    .model-tip{
      color:red;
    }
    .ivu-tabs-nav-scroll{
      .ivu-tabs-nav{
        .ivu-tabs-tab{
          border-right-width:5px;
        }
      }
    }
    .ivu-tabs-tabpane{
      min-height:300px;
      .lable-img-edit{
        .image-box{
          border:1px dashed #d2d2d2;
          width:200px;
          height:84px;
          .ivu-icon-md-add{
            line-height:85px;
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
      .paper-view{
        margin:0px 5px;
        display:inline-block;
        min-width:300px;
        border:1px solid #efefef;
        border-radius: 10px;
        position:relative;
        .paper-cont{
          padding:10px;
          .paper-tip{
            background:#3F8748;
            color:#fff;
            padding:0px 5px;
            border-radius: 5px;
            margin-right:10px;
          }
        }
        .paper-link{
          border-top:1px solid #efefef;
          font-size:12px;
          padding:5px;
        }
        .remove-paper{
          position:absolute;
          top:0px;
          right:0px;
          transform: translate(40%, -40%);
          cursor: pointer;
        }
      }
      .paper-view:hover{
        box-shadow: 0px 0px 10px #ccc;
      }
      .paper-choose{
        border: 1px dashed #d2d2d2;
        color: #ababab;
        display:table-cell;
        vertical-align: middle;
        text-align:center;
        cursor: pointer;
        width:200px;
        height:84px;
        border-radius:5px;
        .choose-add{
          display:inline-block;
          font-size: 30px;
        }
      }
      .paper-choose:hover{
        border-color:#666;
        color:#666;
      }
      textarea.ivu-input{
        min-height:200px;
      }
    }
  }
</style>