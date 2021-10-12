<template>
	<Modal v-model="isShowModal" :title="title" class-name="staff-data-modal" :width="width">
		<Table :columns="columns" :data="viewData" ></Table>
	</Modal>
</template>
<script>
	export default{
		props: {
			width: {
				type: String | Number,
				default(){
					return 800
				}
			},
			columns: {
				type: Array,
				default(){
					return []
				}
			},
			title: {
				type: String,
				default(){
					return ""
				}
			}
		},
		data(){
			return {
				viewData: [],
				isShowModal: false
			}
		},
		methods:{
			showModal({viewData}){
				this.isShowModal = true;
				this.viewData = viewData || [];
			},
			onOk(){
				this.$emit("success");
			},
			onCancel(){
				this.$emit("fail");
			}
		}
	}
</script>
<style lang="less">
	.staff-data-modal{
		.ivu-modal-body{
			height: calc(100vh - 300px);
			overflow-x: hidden;
			overflow-y: auto;
		}
	}
</style>