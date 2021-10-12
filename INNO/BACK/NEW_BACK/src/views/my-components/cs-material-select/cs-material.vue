<style lang="less">
	
</style>

<template>
	<div>
		<Modal
	        v-model="modalShow"
	        :styles="{top: '20px'}"
	        :width="modalWidth"
	        :title="modalTitle"
	        @on-ok="onOk">
	        
	        <template v-if="mediaName == 'IMAGE' ">
	        	<!--客服图片列表-->
			    <imageList ref="image-list" @on-selected-item="selectedMitem"></imageList>
	        </template>

			<template v-else-if="mediaName == 'CARD' ">
				<!--小程序卡片列表-->
			    <cardList ref="card-list" @on-selected-item="selectedMitem"></cardList>
			</template>
			
	        <template v-else>
	        	<!--客服文本列表-->
				<textList ref="text-list" @on-add-success="initData" @on-selected-item="selectedMitem"></textList>
		    </template>
		    
		    <!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>
	    </Modal>    
	</div>	
</template>	

<script>
import util from '@/libs/util.js';
import Cookies from 'js-cookie';
import textList from './text-list';
import imageList from './image-list';
import cardList from './card-list';

export default {
	name: 'csMaterial',
	components: {
		textList,
		imageList,
		cardList,
    },
	data () {
        return {
			currTabName: 'TEXT',
			
			// 返回出去的字段的名称
			cbName:'',
			
			modalShow:false,
    		modalTitle: '选择图片',
    		modalWidth: 940,
			
    		spinShow: false,

            // 选中的图片
            selectedIndex:'',
            selectedImgUrl:'',
			selectedItem:{},
			
            // 是否支持多选图片
            multi:0,
            multiSelectedImgUrlBind:[],
            multiSelectedImgUrl:[],// 分双向绑定
            multiSelectedItem:[],

            mediaName: 'TEXT',
        };
    },
    computed: {

    },
    methods: {
    	init(){

    	},
    	// 提供给父级调用
    	showModal( obj ){
    		this.cbName = obj.name;
    		this.multi = (typeof( obj.multi ) != 'undefined' && obj.multi == 1 ) ? 1 : 0;
    		this.modalTitle = this.multi == 1 ? '选择素材 - 多选模式' : '选择素材 - 单选模式';
    		
    		// 单选模式，传递之前选中的图片
    		this.selectedImgUrl = typeof( obj.selectedImage ) != 'undefined' ? obj.selectedImage : '';
    		
    		// 多选模式，传递之前选中的图片
    		if ( typeof( obj.selectedImages ) != 'undefined' ){
    			// 双向绑定至
    			this.multiSelectedImgUrlBind = obj.selectedImages;
    			// 非双向绑定值
    			this.multiSelectedImgUrl = [];
    			for( var i in obj.selectedImages){
    				this.multiSelectedImgUrl.push( obj.selectedImages[ i ] );
    			}
    		}

    		this.modalShow = true;
    		
    		// 素材类型的判断
    		if( typeof( obj.type ) != 'undefined' && obj.type == 'IMAGE' ){
    			this.currTabName  = 'IMAGE';
    			this.mediaName = 'IMAGE';
    		}
    		else if( typeof( obj.type ) != 'undefined' && obj.type == 'CARD' ){
    			this.currTabName =  'CARD';
    			this.mediaName = 'CARD';
    		}
    		else{
    			this.currTabName = 'TEXT';
    			this.mediaName = 'TEXT';
    		}
    		
    		// 重新加载列表数据
    		this.initData();
    	},
    	// 加载数据，
        initData(){
        	this.spinShow = true;
        	
        	if( this.mediaName == 'TEXT' ){
	        	// ajax 请求获取初始化数据，
	        	util.ajax.post( util.apiUrl.csMaterialList, {
	        		type: 'TEXT',
	 				isInit: 1,
	 				cat_id: this.showUserCatIndex,
	        	})
	    		.then( (response) => {
	    			var res = response.data;
	    			
	    			if( res.code ){
	    				// 初始化用户素材列表的组件
	    				this.$refs['text-list'].initData( res, this.multi, this.multiSelectedImgUrlBind, this.selectedImgUrl );
	    				
	    				this.spinShow = false;
						
						// 清除上传选中的curr
						if( this.multi == 1 && this.multiSelectedImgUrlBind.length == 0 ){
							this.$nextTick(()=>{
								var arrDom = document.querySelectorAll('.list-item.curr');
								for( var i in arrDom ){
									this.removeClass( arrDom[i], 'curr') ;
								}
							});
						}
	    			}
	    			else{
	    				this.$Notice.warning({
			                title: '获取图片列表失败',
			                desc: res.message,
			            });
	    			}
	    		});
    		}
        	else if( this.mediaName == 'IMAGE' ){
	    		// ajax 请求获取初始化数据，（视频列表）
	        	util.ajax.post( util.apiUrl.csMaterialList, {
	        		type: 'IMAGE',
	 				isInit: 1,
	 				cat_id: this.showUserCatIndex,
	        	})
	    		.then( (response) => {
	    			var res = response.data;
	    			
	    			if( res.code ){
	    				// 初始化用户素材列表的组件
	    				this.$refs['image-list'].initData( res, this.multi, this.multiSelectedImgUrlBind, this.selectedImgUrl );
	    				
	    				this.spinShow = false;
	    			}
	    			else{
	    				this.$Notice.warning({
			                title: '获取列表失败',
			                desc: res.message,
			            });
	    			}
	    		});
    		}
        	else if( this.mediaName == 'CARD' ){
	    		// ajax 请求获取初始化数据，（音频列表）
	        	util.ajax.post( util.apiUrl.csMaterialList, {
	        		type: 'CARD',
	 				isInit: 1,
	 				cat_id: this.showUserCatIndex,
	        	})
	    		.then( (response) => {
	    			var res = response.data;
	    			
	    			if( res.code ){
	    				// 初始化用户素材列表的组件
	    				this.$refs['card-list'].initData( res, this.multi, this.multiSelectedImgUrlBind, this.selectedImgUrl );
	    				
	    				this.spinShow = false;
	    			}
	    			else{
	    				this.$Notice.warning({
			                title: '获取列表失败',
			                desc: res.message,
			            });
	    			}
	    		});
    		}
        },
        // 确认按钮
    	onOk(){
    		// 返回指定参数名的值给父级
    		if( this.multi == 0 ){
    			// 单选的返回
    			this.$emit('on-ok', this.selectedImgUrl );
    		}
    		else{
    			// 多选的返回
    			this.$emit('on-ok', this.multiSelectedImgUrl );
    		}
    	},
        // 选中素材
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
        		var mIndex = this.multiSelectedImgUrl.indexOf( url );
        		if( mIndex == -1 ){
        			// 如果数组没有，就添加
	        		this.multiSelectedImgUrl.push(url);
					this.multiSelectedItem.push(item);
	        		this.addClass( document.getElementById( index ), 'curr');
	        	}
        		else{
        			if( this.multiSelectedImgUrlBind.indexOf( url ) !== -1 ){
        				this.$Message.error('此项不能取消！');
        			}
        			else{
	        			// 如果数组已经存在，就减去
	        			this.$delete(this.multiSelectedImgUrl, mIndex );
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
		
    },
    // 侦听数据的变化
    watch: {

    },
    mounted () {
		this.init();
    },
};
</script>