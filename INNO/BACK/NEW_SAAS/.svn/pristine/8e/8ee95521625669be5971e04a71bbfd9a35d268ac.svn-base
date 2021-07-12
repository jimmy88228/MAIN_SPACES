<style lang="less">

</style>

<template>
	<div></div>
</template>

<script>
/**
 * 后台 websocket 组件
 * 进行全局监听
 */
import util from '@/libs/util.js';
import Cookies from 'js-cookie';

export default {
	name: 'kefuWebsocket',
    data () {
    	return {
    		// websocket
            websock: null,
	        reconnectData:null,
	        lockReconnect:false,    // 避免重复连接，因为onerror之后会立即触发 onclose
	        timeout: 30000,          //30s一次心跳检测
	        timeoutObj:null,
	        serverTimeoutObj:null,

	        // ws url 地址
	        wsUrl: '',

          // 音效对象
          audio:{},
          enableVoice: 1,
    	}
    },
    methods: {
		// 由 main.vue 触发 init(); 这样可以根据开发组件的情况来启用websocket
    	init( enableVoice = 1 ){
    		if( util.kefuWs != '' ){
    			this.wsUrl = util.kefuWs + this.getWorkerToken() ;
    			this.initWebsocket();

          // 初始化音效
          this.audio = new Audio();
          this.audio.src = this.$util.apiHost + "/../image/show/assets-audios-kefuCalling.mp3";
          this.enableVoice = enableVoice ;
    		}
    	},
    	// 获取客服人员的token
		getWorkerToken(){
			return 'worker/'+ Cookies.get('accessToken');
		},
    	// 初始化 websocket
        initWebsocket(){

			// url 后面是设备ID
          this.websock = new WebSocket( this.wsUrl );

          this.websock.onopen = this.websocketonopen;          //连接成功
          this.websock.onmessage = this.websocketonmessage;    //广播成功
          this.websock.onerror = this.websocketonerror;        //连接断开，失败
          this.websock.onclose = this.websocketclose;          //连接关闭
        },
        //连接成功
        websocketonopen(){
	        // console.log('kefu-ws连接成功');
	        this.heatBeat();

			this.$store.commit('setCsWebsocketStatus', 1);
	    },
	    //连接失败
	    websocketonerror(){
	    	if( util.isDebug ){
	    		alert('ws连接失败，正在重连');
	    	}
	        console.log('kefu-ws连接失败');

        this.$store.commit('setCsWebsocketStatus', 2);
            this.reconnect();
        },
        // 各种问题导致的 连接关闭
        websocketclose( e ){
        console.log('kefu-ws断开连接');
        console.log( e.code+'|'+e.reason+'|'+e.wasClean);

        if( Number( e.code ) == 431 ){
          console.log('ws被踢走');
          this.$store.commit('setCsWebsocketStatus', 431);
        }
        else{
          this.$store.commit('setCsWebsocketStatus', 3);
          this.reconnect();
        }
	    },
	    // 数据接收
	    websocketonmessage( rs ){
	    	// 把消息放入到 store
	    	if( typeof( rs.data ) == 'string' ){
	    		try{
		    		var objData = JSON.parse( rs.data );

		    		switch( objData.action ){

						// 收到微信客服消息（用户从微信客服发回的内容）
						case 'csSession':
							this.$store.commit('setCsSession', objData.data );
							this.$store.commit('setKefuCount', 1 );
              this.$Notice.info({
                  title: '客服提醒',
                  desc: '收到用户客服消息'
              });

              // 播放音效
              if( this.enableVoice == 1 ){
                this.audio.play();
              }
							break;

						// 收到等待计入的用户信息
						case 'refreshWaitingSession':
							this.$store.commit('setWaitingSession', objData.data );
							break;

		    			// 心跳，不用理处理
		    			case 'heart':
		    				break;

		    			// ws 连接关闭提示，不用处理
		    			case 'close':
		    				break;
		    		}
		    	}
	    		catch( err ){
	    			console.log(err);
	    		}
	    	}

	    	// 收到消息会刷新心跳检测，如果一直收到消息，就推迟心跳发送
	        this.heatBeat();
			// console.log( 'kefu-ws-client 接收到信息=' + rs.data );
	    },
	    // 数据发送
	    websocketsend(data){
	        this.websock.send( JSON.stringify(data) );
	        // console.log( 'kefu-ws发送了信息=' + JSON.stringify(data) );
	    },
	    // socket重连
	    reconnect(){
	    	// 如果未登录，后台就不重连ws了
	    	if( Cookies.get('accessToken') == '' || Cookies.get('accessToken') == null ){
	    		console.log('kefu-ws 不再重连');
	    		return;
	    	}

	    	// console.log('reconnect...');
	    	//这里很关键，因为连接失败之后之后会相继触发 连接关闭，不然会连接上两个 WebSocket
	        if( this.lockReconnect ){
	        	console.log('return reconnect');
	            return ;
	        }
	        else{
	        	// console.log('begin reconnect');
	        	var that = this;
		        this.lockReconnect = true;
		        this.reconnectData && clearTimeout( this.reconnectData );
		        this.reconnectData = setTimeout( ()=>{
		        	console.log('reconnecting');

            if( util.kefuWs != '' ){
              that.lockReconnect = false;

                // 重新发起websocket
                try{
                  that.initWebsocket();
                  console.log('已经发起重连');
                }
                catch( err) {
                  console.log( err );
                }

			       }

		        },5000); // 发起重连的停顿时间
	        }
	    },
	    //心跳检测
	    heatBeat(){
	        this.timeoutObj && clearTimeout(this.timeoutObj);
	        this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
	        this.timeoutObj = setTimeout(()=>{
	        	// 发送心跳数据
				this.websocketsend({action:"heart"});
				// console.log('kefu-ws 发送心跳数据...');
	            this.serverTimeoutObj = setTimeout(()=> {
	            	// 如果  N秒之后没有收到 后台返回的心跳检测数据 断开socket，断开后会启动重连机制
	                this.websock.close();
	            }, 10000); // 心跳得不到响应，发生重连的时间
	        }, this.timeout);
	    },
    },
    watch:{

    },
    mounted () {
    	// 关闭自启动 websocket
		//this.init();
    },
    destroyed() {
    	this.websock.close();
    },
}
</script>
