export default{
	data(){
		return {
			
		}
	},
	methods:{
		setImage (index, type) {
		  let defaultImg = '';
		  // 匹配到默认图的优先使用/或没有选择
		  let isDefault = /assets/g.test(this.tableData.data[index].prizeImg);
		  if (isDefault || this.tableData.data[index].prizeImg === '') {
		    switch (type) {
		      case 1:
		        defaultImg = this.imgCol['point'];
		        break;
		      case 2:
		        defaultImg = this.imgCol['bonus'];
		        break;
		      case 3:
		        defaultImg = this.imgCol['inkind'];
		        break;
		      default:
		        defaultImg = this.imgCol['wetryharder'];
		        break;
		    }
		    this.tableData.data[index].prizeImg = defaultImg;
		  }
		},
		delItem (index) {
		  this.tableData.data.splice(index, 1);
		},
		handleSetData (key, index, val) {
			console.log("handleSetData", key);
		  if (key === 'prizeType') {
		    this.setImage(index, val);
				this.$set(this.tableData.data[index], 'relatedValue', 0);
		  }
		  this.$nextTick(() => {
		    this.tableData.data[index][key] = val;
		  })
		},
		handleCouponSelected (selected, index) {
			let related_data = this.tableData.data[index].related_data || {};
		  this.$selectContent({
		    mode: 'matrix-coupon',
		    type: 'radio',
				listKey: 'type_id',
		    data: [related_data],
		    getList: (data) => {
					this.$set(this.tableData.data[index], "related_data", data[0]);
					this.$set(this.tableData.data[index], "relatedValue", data[0].type_id);
		      this.$refs.formRewardValidate.validateField(`data.${index}.relatedValue`);
		    }
		  });
		},
		handleCouponClose (data, index) {
			this.$set(this.tableData.data[index], "related_data", []);
			this.$set(this.tableData.data[index], "relatedValue", 0);
		  this.$refs.formRewardValidate.validateField(`data.${index}.relatedValue`);
		},
		handleGiftSelected (selected, index) {
			let related_data = this.tableData.data[index].related_data;
			let prizeType = this.tableData.data[index].prizeType;
		  this.$selectContent({
		    mode: 'matrix-gift',
		    type: 'radio',
				listKey: 'goods_id',
				extraAddtion: { type: prizeType == 2 ? 0 : 1 },
		    data: related_data && [related_data],
		    getList: (data) => {
		      this.$set(this.tableData.data[index], "related_data", data[0]);
		      this.$set(this.tableData.data[index], "relatedValue", data[0].goods_id);
		      this.$refs.formRewardValidate.validateField(`data.${index}.relatedValue`);
		    }
		  });
		},
		handleGiftClose (data, index) {
			this.$set(this.tableData.data[index], "related_data", []);
			this.$set(this.tableData.data[index], "relatedValue", 0);
			this.$refs.formRewardValidate.validateField(`data.${index}.relatedValue`);
		},
		// 调起图片选择器
		openImagesModal (url, index) {
		  this.$selectMaterial({
		    type: 'image',
		    selectedData: url,
		    getList: (item) => {
		      this.tableData.data[index].prizeImg = item.src;
		    }
		  });
		},
		handleDelImg (index) {
		  this.tableData.data[index].prizeImg = '';
		  this.setImage(index, this.tableData.data[index].prizesType);
		},
		allowBack() {
		  this.isGlobalLeaveTip = false;
		},
	}
}