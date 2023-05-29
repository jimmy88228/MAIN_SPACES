<template>
	<Drawer :title="title" closable 
	v-model="openDrawer" 
	class="layout-setting"
	:mask-style="{backgroundColor:'rgba(55,55,55,.2)'}">
		<Form ref="formValidate" :model="setting" :label-width="160" label-position="left">
			<!-- <FormItem label="颜色风格">
				<ColorPicker v-model="formItem.style_color" recommend :editable="false" :hue="false" :colors="colors" 
				@on-change="onColorChange"/>
			</FormItem>	 -->
			<FormItem label="开启标签栏">
				<i-switch v-model="setting.openPageTags" size="large" @on-change="onPageTagsChange">
					<span slot="open">开启</span>
					<span slot="close">关闭</span>
				</i-switch>
			</FormItem>	
		</Form>	
	</Drawer>
</template>
<script>

export default{
    props: {
        title: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            openDrawer: false,
            setting: {
                openPageTags: false
            }
        }
    },
    methods:{
        init(){
            this.setting.openPageTags = this.$utils.cache.get("openPageTags");
            this.$store.commit("setOpenPageTags", this.setting.openPageTags);
        },
        showLayout(){
            this.openDrawer = true;
        },
        onPageTagsChange(state){
            this.$store.commit("setOpenPageTags", state);
            this.$utils.cache.set("openPageTags", state);
        }
    },
    mounted(){
       this.init();     
    }
}
</script>
<style scoped lang="less">

</style>