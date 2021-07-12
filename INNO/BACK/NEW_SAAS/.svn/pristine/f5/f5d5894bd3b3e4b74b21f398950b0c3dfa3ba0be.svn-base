<style lang="less">
.slider-image-list{
	.list-box{
		.list-item{
			border:1px solid rgba(0,0,0,.1);
			width:200px;
			margin:20px;
			border-radius: 5px;
			background: #fff;

			&:hover{
				box-shadow: 0 0 3px 4px rgba(0,0,0,.05);
			}
		}

		.act-create{
			height:240px;
			text-align: center;
			cursor: pointer;
		}
		.act-thumb{
			background:no-repeat center center;
			background-size: 100% auto;
			height:200px;
			position: relative;

			.qrcode-box{
				background:rgba(0,0,0,.2) no-repeat center center;
				background-size:contain;
				height:200px;
			}
		}
		.act-title{
			padding:10px;
			color:#fff;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			min-height:40px;
			position: absolute;
			width:100%;
			bottom:0;
			background: rgba(0,0,0,.3);
		}
		.act-name{
			padding:10px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			min-height:40px;
		}
		.act-ext{
			border-top:1px solid rgba(0,0,0,.04);
			margin:10px;
			padding-top:10px;
		}
	}
}
</style>

<template>
    <div class="slider-image-list">
    	<Card>
    		<p slot="title">轮播图片管理</p>
    		<div slot="extra">
				<Button type="primary" icon="md-add" size="small" @click="onAdd">添加图片</Button>
			</div>

        	<Row class="list-box">

        		<!--创建页面按钮-->
        		<Col span="6" class="list-item">
		        	<div class="act-create" @click="onAdd">
		        		<Icon type="ios-add" size="40"  style="margin-top:100px;" />
		        		<div>添加轮播图片</div>
		        	</div>
		        	<div class="act-ext">
		        		<Button long @click.native="onAdd">添加图片</Button>
		        	</div>
		        </Col>

		        <!--活动列表-->
		        <Col v-for="(item,index) in list" :key="('k'+index)" span="6" class="list-item">

		        	<div class="act-thumb" :style="'background-image:url('+item.img_format+')'">
		        		<transition name="tran-qrcode">
		        			<div class="qrcode-box" v-show="item.qrcode_show" :style="'background-image:url('+item.img_format+');'"></div>
		        		</transition>
		        		<div class="act-title">{{item.title}}</div>
		        	</div>
		        	<div class="act-name">关联活动：{{item.activity_name}}</div>
		        	<div class="act-ext">
		        		<Button @click.native="editAct(index,item)">编辑</Button>

		        		<span v-if="item.enable==1" style="color:green;margin-left:5px;cursor: pointer;" @click="updateStatus(index, item)" title="点击可关闭">已启用</span>
		        		<span v-else style="color:red;margin-left:5px;cursor: pointer;" @click="updateStatus(index, item)" title="点击可启用">已关闭</span>

		        		<span style="float:right;line-height:30px;">排序：{{item.sort}}</span>
		        	</div>
		        </Col>
		    </Row>

		    <!--分页-->
		    <div v-if="pageTotal>0" style="margin:10px;overflow: hidden">
		        <div style="float: right;">
		            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
		        </div>
		    </div>
	    </Card>

	    <!--添加图片的表单-->
	    <sliderImageForm ref="slider-image-form" @on-success="updateCallback"></sliderImageForm>

	    <!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
    </div>
</template>

<script>
/**
 * 轮播图列表
 */
import util from '@/libs/util.js';
import sliderImageForm from './slider-image-form';

export default {
  name: 'sliderImageList',
  components: {
    	sliderImageForm
  },
  data () {
    return {
        	list: [],
      pageTotal: 0,
        	pageSize: 20,
        	modalEditIndex: 0,

        	// 加载提示
        	spinShow: false
    }
  },
  computed: {
  },
  methods: {
    	/**
    	 * @desc 初始化方法
    	 */
    // 初始化
    	init () {
    		// 获取我的列表
    		this.initSet(1, 1);
    	},
    	// 初始化列表
    	initSet (isInit, page) {
    		this.spinShow = true;

        	util.ajax.post(util.apiUrl.sliderImageList, {
 				isInit: isInit,
 				page: page
        	})
    		.then((response) => {
    			var res = response.data;
    			this.spinShow = false;

    			if (res.code) {
    				this.list = res.data.items;
    			}
    		});
    	},
    	// 下一页
    	changePage (page) {
    		this.initSet(0, page);
    	},
    	// 添加按钮
    	onAdd () {
    		this.$refs['slider-image-form'].openModal(0);
    	},
    	// 编辑按钮
    	editAct (index, item) {
    		this.modalEditIndex = index;
    		this.$refs['slider-image-form'].openModal(item);
    	},
    	// 更新成功的回调
    	updateCallback (res) {
    		if (res.rsType == 'add') {
        		this.pageTotal++;
        // 新增： 给role 列表数组加入新数据
        this.list.unshift(res.data);
      } else {
            	for (var keyName in res.data) {
            		this.$set(this.list[this.modalEditIndex], keyName, res.data[keyName]);
            	}
      }
    	},
    	// 直接在列表更新状态
    updateStatus (index, row) {
        	this.spinShow = true;
        	var enable = (row.enable == 0 ? 1 : 0);

        	// ajax 保存数据
        	util.ajax.post(util.apiUrl.sliderImageUpdateStatus, {
        		id: row.id,
        enable: enable
        	})
    		.then((response) => {
    			this.spinShow = false;
    			var res = response.data;

    			if (res.code) {
    				// 保存成功
            this.$Message.success(res.message);

            // 更新列表的值
            this.$set(this.list[index], 'enable', enable);
          } else {
            		this.$Message.error(res.message);
    			}
    		});
    }
  },
  watch: {
  },
  mounted () {
    this.init();
  },
  created () {

  }
};
</script>
