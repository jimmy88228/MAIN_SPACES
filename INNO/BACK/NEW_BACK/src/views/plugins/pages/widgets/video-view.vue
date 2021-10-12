<style lang="less">
.editor-video-view{
	.empty{
		text-align: center;
		padding:50px 20px;
		color:#515a6e;
	}

	.video-js .vjs-big-play-button{
		left: 45%;
		top: 40%;
		width: 1.5em;
		border-radius: 100%;
		height: 1.5em;
		line-height: 1.4em;
	}
}
</style>

<template>
	<div class="editor-video-view">

		<div v-if="typeof(info.src) != 'undefined' && info.src != '' ">
			<!--视频播放器-->
			<video-player ref="videoPlayer" :options="playerOptions"></video-player>
		</div>

		<!--空白的情况-->
		<div v-else class="empty">
			<Icon type="ios-film-outline" size="60" color="#2d8cf0"></Icon>
			<div>请点击编辑视频</div>
		</div>

	</div>
</template>

<script>
/**
 * 视频渲染组件
 */
// 载入videojs 组件
import 'video.js/dist/video-js.css';
import { videoPlayer } from 'vue-video-player';

export default {
  name: 'videoView',
  components: {
    videoPlayer
  },
  props: {
    currIndex: {
      type: [Number, String],
      default: 0
    },
    // 是否使用用在 tab 导航页面内
		inTab:{
			type: Boolean,
			default: false,
		},
		// 表示tab 在左边
		inLeft:{
			type: Boolean,
			default: false,
		}
  },
  data () {
	    return {
      info: {},
      dataList: [],

      // 播放器配置
      playerOptions: {
        autoplay: false,
        width:  ( this.inLeft ? 285 : 375 ),
			    sources: [{
			        type: 'video/mp4',
			        src: ''
			    }],
			    notSupportedMessage: ' '
      }
    }
  },
  computed: {
  },
  methods: {
    init () {
      this.dataList = this.inTab ? this.$store.state.app.tabPageCompList : this.$store.state.app.pageCompList;
      this.info = this.dataList[this.currIndex].setting;

      this.$set(this.playerOptions.sources[0], 'src', this.info.src);
    }
  },
  watch: {
    // 观察子项变化开关
    '$store.state.app.pageCompItemChange' (to) {
      this.$nextTick(() => {
        this.$set(this.playerOptions.sources[0], 'src', this.info.src);
      });

      setTimeout(() => {
        // 开关复位
        this.$store.commit('setPageCompItemChange', false);
      }, 500);
    }
  },
  mounted () {
	    this.init();
  }
}
</script>
