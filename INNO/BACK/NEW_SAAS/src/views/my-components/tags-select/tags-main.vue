<style lang="less">
.tags-main{
	padding:0 20px 10px;
}
</style>

<template>
	<div class="tags-main">
		<!--标签列表-->
		<Tag v-for="(item,index) in userTagsList" :key="index" closable
		:size="size=='default' ? 'default' : size "
		@on-close="closeTag(index, item.id)">{{item.get_tag_info.name}}</Tag>
		<Button icon="md-add" type="dashed" :size=" size =='default' ? 'small' : 'default' " @click="showModal">添加标签</Button>

		<!--标签选择框-->
		<Modal
	        v-model="modalShow"
	        :styles="{top: '20px'}"
	        :width="modalWidth"
	        :title="modalTitle"
	        @on-ok="onOk">

	        <!--标签列表-->
			<tagsList ref="tags-list" :tagsType="tagsType" :userId="userId" @on-add-success="initList" @on-selected-item="selectedMitem"></tagsList>
	    </Modal>

		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>

<script>
import Cookies from 'js-cookie';
import tagsList from './tags-list';

export default {
	name: 'tagsMain',
	components: {
		tagsList,
    },
	props:{
		// 标签类型
		tagsType:{
			type:String,
			default: '',
		},
		// 用户ID
		userId:{
			type:Number,
			default: 0,
		},
		size:{
			type:String,
			default: 'default'
		},
    // 扩展关联ID
    objectId:{
      type:Number,
      default: 0,
    }
	},
	data () {
        return {
			modalShow:false,
    		modalTitle: '选择标签',
    		modalWidth: 940,

    		spinShow: false,

			// 用户关联的标签列表
			userTagsList: [],

            // 选中的标签
            selectedIndex:'',
            selectedImgUrl:'',
			selectedItem:{},

            // 是否支持多选
            multi:0,
            multiSelectedTagsBind:[],
            multiSelectedTags:[],// 分双向绑定
            multiSelectedItem:[],
        };
    },
    computed: {

    },
    methods: {
    	init(){
			this.spinShow = true;
			// ajax 请求获取初始化数据，
			this.$ajax.post( this.$api.tagRelatedList, {
				isInit: 1,
				type: this.tagsType,
				user_id: this.userId,
        object_id: this.objectId,
			})
			.then( (response) => {
				var res = response.data;
				this.spinShow = false;
				if( res.code ){
					this.userTagsList = res.data.items;
          this.multiSelectedTags = [];
				}
				else{
					this.$Message.error('获取列表失败');
				}
			});
    	},
    	// 提供给父级调用
    	showModal(){
			var obj = {};
    		this.multi = (typeof( obj.multi ) == 'undefined' || ( typeof( obj.multi ) != 'undefined' && obj.multi == 1 ) ) ? 1 : 0;
    		this.modalTitle = this.multi == 1 ? '选择标签 - 多选模式' : '选择标签 - 单选模式';

    		// 单选模式，传递之前选中的标签
    		this.selectedImgUrl = typeof( obj.selectedImage ) != 'undefined' ? obj.selectedImage : '';

    		// 多选模式，传递之前选中的标签
    		if ( typeof( obj.selectedImages ) != 'undefined' ){
    			// 双向绑定至
    			this.multiSelectedTagsBind = obj.selectedImages;
    			// 非双向绑定值
    			this.multiSelectedTags = [];
    			for( var i in obj.selectedImages){
    				this.multiSelectedTags.push( obj.selectedImages[ i ] );
    			}
    		}

    		this.modalShow = true;

    		// 重新加载列表数据
    		this.initList();
    	},
    	// 加载标签列表
        initList(){
        	this.spinShow = true;

			// ajax 请求获取初始化数据，
			this.$ajax.post( this.$api.tagsList, {
				isInit: 1,
				type: this.tagsType,
        user_id: this.userId,
			})
			.then( (response) => {
				var res = response.data;
				this.spinShow = false;

				if( res.code ){
					// 初始化用户素材列表的组件
					this.$refs['tags-list'].initData( res, this.multi, this.multiSelectedTagsBind, this.selectedImgUrl );

					// 清除上传选中的curr
					if( this.multi == 1 && this.multiSelectedTagsBind.length == 0 ){
						this.$nextTick(()=>{
							var arrDom = document.querySelectorAll('.list-item.curr');
							for( var i in arrDom ){
								this.removeClass( arrDom[i], 'curr') ;
							}
						});
					}

					this.modalTitle += ' [' + res.data.typeName + '] ';
				}
			});

        },
        // 确认按钮
    	onOk(){
			var tags_ids = [];
    		// 返回指定参数名的值给父级
    		if( this.multi == 0 ){
    			// 单选的返回
				tags_ids.push( this.selectedImgUrl.id );
    		}
    		else{
    			// 多选的返回
				for(var i in this.multiSelectedTags){
					tags_ids.push( this.multiSelectedTags[i].id );
				}
    		}

			// 保存选中的标签，加关联
			this.spinShow = true;
			this.$ajax.post( this.$api.tagRelatedAdd, {
				type: this.tagsType,
				user_id: this.userId,
				tags_ids: tags_ids,
        object_id: this.objectId,
			})
			.then( (response) => {
				var res = response.data;
				this.spinShow = false;
				if( res.code ){
					this.$Message.success( res.message );

					// 刷新关联列表
					this.init();
				}
			});
    	},
        // 选中标签
        selectedMitem( index, url, item ){
        	if( this.multi == 0 ){
        		// 单选
	        	this.selectedIndex = index;
	        	this.selectedImgUrl = url;
				this.selectedItem = item;
	        	if( document.querySelector('.list-item.curr')  != null ){
	        		this.removeClass( document.querySelector('.list-item.curr'), 'curr') ;
	        	}

	        	this.addClass( document.getElementById( index ), 'curr');
        	}
        	else{
        		// 多选
        		this.selectedIndex = index;
        		var mIndex = this.multiSelectedTags.indexOf( url );
        		if( mIndex == -1 ){
        			// 如果数组没有，就添加
	        		this.multiSelectedTags.push(url);
					this.multiSelectedItem.push(item);
	        		this.addClass( document.getElementById( index ), 'curr');
	        	}
        		else{
        			if( this.multiSelectedTagsBind.indexOf( url ) !== -1 ){
        				this.$Message.error('此项不能取消！');
        			}
        			else{
	        			// 如果数组已经存在，就减去
	        			this.$delete(this.multiSelectedTags, mIndex );
						this.$delete(this.multiSelectedItem, mIndex);
	        			this.removeClass( document.getElementById( index ), 'curr');
        			}
        		}

        	}
        },
        hasClass(ele, cls) {
		    return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
		},
		//为指定的dom元素添加样式
		addClass(ele, cls) {
		    if (!this.hasClass(ele, cls)) ele.className += " " + cls;
		},
		//删除指定dom元素的样式
		removeClass(ele, cls) {
		    if (this.hasClass(ele, cls)) {
		        var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
		        ele.className = ele.className.replace(reg, " ");
		    }
		},
		// 删除标签
		closeTag( index, related_id ){
			this.$Modal.confirm({
			    title: '操作提示',
			    content: '确定删除用户关联的标签吗？这里只删除关联关系。',
			    okText: '确定',
			    cancelText: '取消',
			    onOk: () => {
					this.spinShow = true;
					// ajax 请求获取初始化数据，
					this.$ajax.post( this.$api.tagRelatedRemove, {
						id: related_id,
					})
					.then( (response) => {
						var res = response.data;
						this.spinShow = false;
						if( res.code ){
							this.$delete(this.userTagsList, index);
						}
					});
				}
			});
		}
    },
    // 侦听数据的变化
    watch: {

    },
    mounted () {
	    // 改由父组件初始化
		  // this.init();
    },
};
</script>
