<style lang="less">
.editor-video-form{
	padding:5px;

	.video-box{
		width:90px;

		.image-box{
			height: 90px;
			width:100%;
			background:center center no-repeat;
			background-size: 100% auto;
			line-height:100px;
			border: 1px solid #eee;
		    border-radius: 5px;
		    text-align: center;
		    position: relative;
			cursor: pointer;

			&:hover{
				.close, .play{
					display: block;
				}
			}
			.close{
				font-size:20px;
				color:#ed4014;
				position: absolute;
				right:-10px;
				top:-10px;
				display: none;
				cursor: pointer;
        line-height: 1;
        background-color: #fff;
        border-radius: 100%;
			}
			.play{
				font-size:20px;
				font-weight: bold;
				color:#2d8cf0;
				position: absolute;
				right:-10px;
				top:20px;
				display: none;
				cursor: pointer;
				background: #fff;
				border-radius: 100%;
        line-height: 1;
			}
		}
	}
}

.video-list-modal{
	.ivu-modal-content{
		background: transparent;
		box-shadow: none;
	}

	.video-js{
		width: 100%;
		min-height: 300px;
	}
}
</style>

<template>
	<div class="editor-video-form">
		<titleBar>视频组件 设置</titleBar>

		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="top">
			<FormItem label="选择视频" prop="src">
				<div class="video-box">
					<div class="image-box" @click="selectVideo('src','VIDEO')" :style="(formItem.src!='' && formItem.src!=null ? 'background-color:#000' : '')">
						<Icon v-if="(formItem.src=='' || formItem.src==null)" type="md-add" size="30" title="添加视频"></Icon>
						<template v-else>
							<Icon type="md-play" size="30" color="#fff"></Icon>
							<Icon type="ios-close-circle" class="close" title="删除" @click.stop="onRemoveVideo"/>
							<Icon type="md-arrow-dropright-circle" class="play" title="播放" @click.stop="onPlayVideo"/>
						</template>
					</div>
				</div>
				<div>建议：20M以内的视频</div>
			</FormItem>
		</Form>

		<!--用户视频管理组件-->
		<userImages ref="user-images" @on-return-url="returnVideoUrl"></userImages>

		<Modal
			v-model="modalPlayShow"
		    title=""
		    :styles="{top: '20px'}"
		    class="video-list-modal"
		    :loading="modalPlayLoading"
		    footer-hide>
			<!--视频播放器-->
			<video-player ref="videoPlayer" :options="playerOptions"></video-player>
		</Modal>
	</div>
</template>

<script>
/**
 * 视频小工具
 */
import titleBar from '@/views/my-components/title-bar/title-bar';
import userImages from '@/views/my-components/user-images/user-images';
// 载入videojs 组件
import 'video.js/dist/video-js.css';
import { videoPlayer } from 'vue-video-player';

export default {
  name: 'videoForm',
  components: {
    titleBar,
    userImages,
    videoPlayer
  },
  props: {
    currIndex: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
    return {
      formItem: {

      },

      dataList: [],

      // 表单数据规则
      ruleValidate: {},

      modalPlayShow: false,
      modalPlayLoading: false,

      // 播放器配置
      playerOptions: {
        autoplay: true,
			    sources: [{
			        type: 'video/mp4',
			        src: ''
			    }],
			    notSupportedMessage: '此视频暂无法播放，请稍后再试'
      }
    }
  },
  computed: {

  },
  methods: {
    init () {
      // 双向绑定store 的数据
      this.dataList = this.$store.state.app.pageCompList;
      this.formItem = this.dataList[this.currIndex].setting;
    },
    // 选择商品视频
    selectVideo (name, objType) {
      this.$refs['user-images'].showModal({
        name: name,
        type: objType,
        multi: 0,
        selectedImages: this.formItem.src
      });
    },
    // 选择视频的回调
    returnVideoUrl (obj) {
      this.$set(this.formItem, 'src', obj.val);
      this.$store.commit('setPageCompItemChange', true);
    },
    // 删除视频
    onRemoveVideo () {
      this.$Modal.confirm({
			    title: '提示',
			    content: '确定清除视频吗？',
			    onOk: () => {
          this.formItem.src = '';
        }
      });
    },
    onPlayVideo () {
      this.modalPlayShow = true;
      this.modalPlayLoading = true;

      this.playerOptions.sources[0].src = this.formItem.src;
    }
  },
  watch: {
    'currIndex' (to) {
      this.init();
    }
  },
  mounted () {
    this.init();
  }
}
</script>
