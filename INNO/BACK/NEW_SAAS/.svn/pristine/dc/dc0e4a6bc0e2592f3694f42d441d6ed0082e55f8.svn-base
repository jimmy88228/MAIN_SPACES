<style lang="less">
	
</style>
<template>
    <div @click="showMessage" class="message-con">
        <Tooltip :content="mesCount > 0 ? '有客服消息' : '暂无消息'" placement="bottom">
            <Badge :count="mesCount" dot>
                <Icon type="" class="ionmy ion-my-kefu2" :size="22"></Icon>
            </Badge>
        </Tooltip>
    </div>
</template>

<script>
import util from '@/libs/util.js';
export default {
    name: 'customerServiceTip',
    props: {
    },
	data(){
		return {
			mesCount: 0,
		}
	},
    methods: {
        showMessage () {
            this.$router.push('/plugins/cs-session');
        }
    },
	watch:{
		'$store.state.app.kefuCount'(to){
			this.mesCount = to;
		}
	}
};
</script>