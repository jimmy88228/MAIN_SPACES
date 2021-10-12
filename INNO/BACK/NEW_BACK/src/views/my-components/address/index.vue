<template>
	<div class="address">
		<Cascader class="basic_input" :value="initData" :data="areaList" :clearable="isClear" :style="areaStyle" :disabled="disabled"
		 ref="areaRef" filterable change-on-select transfer :render-format="formatArea" @on-change="selectArea"></Cascader>
	</div>
</template>

<script>
	import addressHandle from "./dataHandle.js";
	export default {
		props: {
			disabled: {
				type: Boolean,
				default: false,
			},
			selectRange: {
				type: String,
				default: "" //选择范围到 prov表示直到省， city表示能选到市，默认情况下选到区
			},
			initData: {
				type: Array,
				default: ()=>[]
			}
		},
		data() {
			return {
				areaList: [],
				isClear: false,
				calcWidth: 'auto'
			}
		},
		computed: {
			areaStyle() {
				return {
					width: this.calcWidth
				}
			},
		},
		methods: {
			loadData() {
				addressHandle.getAddressData(this.selectRange)
				.then((data) => {
					this.areaList = data;
				})
			},
			formatArea(labels) {
				this.$nextTick(() => {
					// 获取到文字的宽度+关闭按钮的宽度
					this.calcWidth = this.$refs.areaRef.$el.childNodes[0].childNodes[4].offsetWidth + 14 + 'px';
				});
				return labels.join('/');
			},
			selectArea(value, selectedData) {
				console.log("选择地址value", value, selectedData)
				this.$nextTick(() => {
					// 获取到文字的宽度+关闭按钮的宽度
					this.calcWidth = this.$refs.areaRef.$el.childNodes[0].childNodes[4].offsetWidth + 14 + 'px';
					this.$emit("selectArea", selectedData);
				});
			}
		},
		mounted() {
			this.loadData();
		}
	}
</script>

<style>

</style>
