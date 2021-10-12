export default {
	data() {
		return {
			ruleBasicValidate: {
				typeName: [{
					required: true,
					message: '优惠券名称不能为空',
					trigger: 'blur'
				}],
				fullDiscount: [{
					required: true,
					trigger: 'blur',
					type: 'object'
				}],
				discount: [{
					required: true,
					trigger: 'blur',
					type: 'object'
				}],
				validityTime: [{
					required: true,
					trigger: 'change',
					type: 'object'
				}]
			},
			startAmountRule: [{
					required: true,
					message: '订单金额不能为空',
					trigger: 'blur',
					type: 'number'
				},
				{
					message: '请填写正确的订单金额',
					trigger: 'blur',
					type: 'number',
					min: 0
				},
				{
					validator: this.checkDiscount,
					trigger: 'blur'
				}
			],
			endAmountRule: [{
					required: true,
					message: '订单金额不能为空',
					trigger: 'blur',
					type: 'number'
				},
				{
					message: '请填写正确的订单金额',
					trigger: 'blur',
					type: 'number',
					min: 0
				},
				{
					validator: this.checkDiscount,
					trigger: 'blur'
				}
			],
			discountRule: [{
					required: true,
					message: '优惠券折扣不能为空',
					trigger: 'blur',
					type: 'number'
				},
				{
					message: '请填写正确的优惠券折扣',
					trigger: 'blur',
					type: 'number',
					min: 0,
					max: 1
				}
			],
			fullDiscountAmountRule: [{
					required: true,
					message: '订单金额不能为空',
					trigger: 'blur',
					type: 'number'
				},
				{
					message: '请填写正确的订单金额',
					trigger: 'blur',
					type: 'number',
					min: 0
				},
				/*
				{
					validator: this.checkFulldiscount,
					trigger: 'blur'
				}*/
			],
			//freeze_time
			freezeTimeRule: [{
					required: true,
					message: '领券冻结时间不能为空',
					trigger: 'blur',
					type: 'number'
				},
				{
					message: '请填写正确的领券冻结时间',
					trigger: 'blur',
					type: 'number',
					min: 0
				}
			],
			fullDiscountRule: [{
					required: true,
					message: '优惠券面值不能为空',
					trigger: 'blur',
					type: 'number'
				},
				{
					message: '请填写正确的优惠券面值',
					trigger: 'blur',
					type: 'number',
					min: 0
				},
				/*
				{
					validator: this.checkFulldiscount,
					trigger: 'blur'
				}*/
			],
			validDateRangeRule: [{
				validator: this.checkValidTime,
				trigger: 'change'
			}],
			validityMonthRule: [{
				validator: this.checkValidTime,
				trigger: 'blur'
			}],
			validityDayRule: [{
				validator: this.checkValidTime,
				trigger: 'blur'
			}],
			ruleExtendValidate: {
				// receiveTime: [{
				// 		required: true,
				// 		message: '请输入领券次数限制',
				// 		trigger: 'blur',
				// 		type: 'number'
				// 	}
				// ],
				wxgroupSelect: [{
					message: '请选择微信群',
					type: 'array'
				}],
				tagId: [{
					message: '请选择标签',
					type: 'array',
					validator: this.checkTag
				}]
			},
			createNumRule: [{
					required: true,
					message: '请输入预生成优惠券数量',
					trigger: 'blur',
					type: 'number'
				},
				{
					message: '预生成优惠券数量至少大于1',
					trigger: 'blur',
					type: 'number',
					min: 1
				}
			],
			storeSelectRule: [{
				message: '请选择店铺',
				type: 'array'
			}],
			typeCodeRule: [{
				required: true,
				message: '请输入优惠券编码',
				trigger: 'blur'
			}],
		}
	},
	methods: {
		checkFulldiscount(rule, value, callback) {
			const {
				field
			} = rule;
			if (field.includes('amount')) {
				if (Number(this.formItem.fullDiscount.discount) && Number(value) < Number(this.formItem.fullDiscount.discount)) {
					callback(new Error('需大于优惠券面值'));
				} else {
					callback();
				}
			} else if (field.includes('discount')) {
				if (Number(this.formItem.fullDiscount.amount) && Number(value) > Number(this.formItem.fullDiscount.amount)) {
					callback(new Error('需小于订单金额'));
				} else {
					callback();
				}
			} else {
				callback();
			}
		},
		checkDiscount(rule, value, callback) {
			const {
				field
			} = rule;
			if (field.includes('startAmount')) {
				if (Number(this.formItem.discount.endAmount) && Number(value) > Number(this.formItem.discount.endAmount)) {
					callback(new Error('需小于最大金额'));
				} else {
					callback();
				}
			} else if (field.includes('endAmount')) {
				if (Number(this.formItem.discount.startAmount) && Number(value) < Number(this.formItem.discount.startAmount)) {
					callback(new Error('需大于最小金额'));
				} else {
					callback();
				}
			} else {
				callback();
			}
		},
		checkValidTime(rule, value, callback) {
			const {
				field
			} = rule;
			if (this.formItem.validityTime.validityLimitType == 1 && field.includes('validDateRange')) {
				if (value.join() === '' || value.join() === ',') {
					callback(new Error('请填写有效期'));
				} else {
					callback();
				}
			} else if (this.formItem.validityTime.validityLimitType == 2 && field.includes('validityMonth') || this.formItem.validityTime
				.validityLimitType == 3 && field.includes('validityDay')) {
				if (!value) {
					callback(new Error('请填写有效期'));
				} else {
					callback();
				}
			} else {
				callback();
			}
		},
		checkTag(rule, value, callback) {
			if (this.isCopyStaus) {
				// 复制券的必选标签 -- jiege
				if (value.length === 0) {
					callback(new Error('请选择标签'));
				} else {
					callback();
				}
			} else {
				callback();
			}
		}
	}
}
