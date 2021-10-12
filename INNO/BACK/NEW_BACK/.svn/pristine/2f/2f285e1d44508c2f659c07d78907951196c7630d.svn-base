<style lang="less">
</style>

<template>
	<div>
		<Card>
			<Tabs>
		        <TabPane label="我的图片">
					<userImagesList ref="user-images-list" :fromMenu="1"></userImagesList>
				</TabPane>
			    <TabPane label="我的视频">
			    	<!--我的视频列表-->
			        <userVideoList ref="user-video-list" :fromMenu="1"></userVideoList>
			    </TabPane>
			</Tabs>
		</Card>

		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>

	</div>
</template>

<script>
/**
 * 素材管理
 */
import util from '@/libs/util.js';
import userImagesList from '@/views/my-components/user-images/user-images-list';
import userVideoList from '@/views/my-components/user-images/user-video-list';

export default {
  components: {
    userImagesList,
    userVideoList
  },
  data () {
    	return {
    		spinShow: false,
    		showUserCatIndex: 0

    	}
  },
  computed: {

  },
  methods: {
    	init () {
      // 加载数据，
        	this.spinShow = true;

        	// ajax 请求获取初始化数据，（图片列表）
        	util.ajax.post(util.apiUrl.userImageList, {
        		pageSize: 40,
 				isInit: 1,
 				cat_id: this.showUserCatIndex
        	})
    		.then((response) => {
    			var res = response.data;

    			if (res.code) {
    				// 初始化用户素材列表的组件
    				this.$refs['user-images-list'].initData(res, false, [], []);

    				this.spinShow = false;
    			} else {
    				this.$Notice.warning({
		                title: '获取图片列表失败',
		                desc: res.message
		            });
    			}
    		});

      // ajax 请求获取初始化数据，（视频列表）
        	util.ajax.post(util.apiUrl.userImageList, {
        		pageSize: 40,
 				isInit: 1,
 				type: 'video',
 				cat_id: this.showUserCatIndex
        	})
    		.then((response) => {
    			var res = response.data;

    			if (res.code) {
    				// 初始化用户素材列表的组件
    				this.$refs['user-video-list'].initData(res, false, [], []);

    				this.spinShow = false;
    			} else {
    				this.$Notice.warning({
		                title: '获取视频列表失败',
		                desc: res.message
		            });
    			}
    		});
    	}
  },
  mounted () {
    	this.init();
  }
}
</script>
