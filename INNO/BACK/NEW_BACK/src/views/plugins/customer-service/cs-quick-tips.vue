<style lang="less">

</style>

<template>
	<div>
		<Poptip v-model="showPoptip" placement="top-start">
			<div slot="content">
				<CellGroup style="height:250px;width:400px;">
					<vue-scroll ref="vue-scroll" :ops="scrollOptions">
						<Cell v-for="(item, index) in replyTextList" :key="index"
						:title="item"
						:selected="index == currIndex"
						:id="'cell-'+index"
						@click.native="quickSelect(item)"/>
					</vue-scroll>
				</CellGroup>
			</div>
		</Poptip>
	</div>
</template>

<script>
/**
 * 聊天快速回复 组件
 */
export default {
	name:"csQuickTips",
	props:{
		// admin info
		info:{
			type:Object,
			default:()=>{}
		},
	},
	data () {
	    return {
			showPoptip:false,
			replyTextList: [],

			// 虚拟滚动条
			scrollOptions:{
				mode: 'native',
				bar:{
					keepShow: true,
					background: '#c8c8c8',
					size:'3px',
				},
				// 滚动轨道
				rail:{
					size:'3px',
				},
				scrollPanel:{
					scrollingX:false,
				}
			},

			currIndex: 0,
		}
	},
	methods: {
		// 提供给父组件调用
		showModal( inputMsg ){
      if( inputMsg.trim() != '' ){
        var newList = [];
        var hasMatch = false;

        for(var i in this.replyTextList){
          if( this.replyTextList[i].indexOf( inputMsg ) !== -1 ){
            hasMatch = true;
            // 匹配的内容放到队列头
            newList.unshift( this.replyTextList[i] );
          }
          else{
            // 未匹配的放到队列尾
            newList.push( this.replyTextList[i] );
          }
        }

        // 如果存在配置内容
        if( hasMatch ){
          this.replyTextList = this.uniqueArr( newList );
          this.currIndex = 0;
          this.$refs['vue-scroll'].scrollIntoView("#cell-"+ 0 , 200 );
          this.showPoptip = true;
        }
        else{
          this.showPoptip = false;
        }
      }
      else{
        // 如果内容为空，则不提示
        this.showPoptip = false;
      }
		},
    // 数组去重
    uniqueArr(arr){
      var hash=[];
      for (var i = 0; i < arr.length; i++) {
         if(hash.indexOf(arr[i])==-1){
          hash.push(arr[i]);
         }
      }
      return hash;
    },
		// 选中并返回给父组件
		quickSelect( item ){
			this.showPoptip = false;
			this.$emit('on-select', item );
		},
		// 选中
		select(){
			this.showPoptip = false;
			this.$emit('on-select', this.replyTextList[ this.currIndex ] );
		},
		// 键盘上移键
		up(){
			if( this.currIndex > 0 ){
				this.currIndex --;
				this.$refs['vue-scroll'].scrollIntoView("#cell-"+ this.currIndex , 200 );
			}
		},
		down(){
			if( this.currIndex < this.replyTextList.length ){
				this.currIndex ++;
				this.$refs['vue-scroll'].scrollIntoView("#cell-"+ this.currIndex , 200 );
			}
		}
	},
	watch: {
		'showPoptip' ( to ){
			this.$emit('on-change', to );
		},
		'info' ( to ){
			for(var i in this.info.quickReply){
				for(var j in this.info.quickReply[i].children ){
					this.replyTextList.push( this.info.quickReply[i].children[j] );
				}
			}
		}
	},
}
</script>
