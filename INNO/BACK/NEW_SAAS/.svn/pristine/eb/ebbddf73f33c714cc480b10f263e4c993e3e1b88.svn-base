export default {
	methods: {
		confirm() {
			this.$refs.infoRef.$children.forEach(item => {
				if (item.$options && item.$options.name === 'CouponExtendInfo') {
					this.extendForm = item;
					this.extendFormItem = item.formItem;
				}
			});
			this.$refs.formValidate.validate(basicValid => {
				this.extendForm.checkExtendInfo && this.extendForm.checkExtendInfo().then(extendValid => {
					if (basicValid && extendValid) {
						this.spinShow = true;
						return this.$ajax.post(this.$route.params.id ? (this.isEditStaus ? this.$api.couponsEdit : this.$api.couponsCopy) :
								this.$api.couponsAdd, {
									type_id: this.$route.params.id || 0,
									send_type: this.$route.query.pid,
									bonus_type: this.$route.query.id,
									type_name: this.formItem.typeName,
									is_show_name: this.formItem.isShowName,
									bonus_desc: this.formItem.bonusDesc,
									// 非折扣优惠券
									min_goods_amount: this.formItem.fullDiscount.amount,
									type_money: this.formItem.fullDiscount.discount,
									is_hide_money_show: this.formItem.fullDiscount.isHideMoneyShow,
									// 折扣优惠券
									min_amount: this.formItem.discount.startAmount,
									max_amount: this.formItem.discount.endAmount,
									discount: this.formItem.discount.discount,
									// 有效期
									validity_limit_type: this.formItem.validityTime.validityLimitType,
									use_start_date: this.formItem.validityTime.validDateRange[0] || '',
									use_end_date: this.formItem.validityTime.validDateRange[1] || '',
									validity_value: this.formItem.validityTime.validityLimitType == 2 ? this.formItem.validityTime.validityMonth :
										(this.formItem.validityTime.validityLimitType == 3 ? this.formItem.validityTime.validityDay : ''),
                            		freeze_time: this.formItem.validityTime.freezeTime,//冻结时间
									can_overlying: this.formItem.canOverlying,
									overlying_count: this.formItem.overlyingCount,
									is_mutex: this.formItem.isMutex,
                            		no_overlying_bonus: this.formItem.noOverlyingBonus,
									can_join_promote: this.formItem.canJoinPromote,
									restore_market_price: this.formItem.restoreMarketPrice,
									is_multiple_discount: this.formItem.isMultipleDiscount,
									max_use_goods: this.formItem.maxUseGoods,
									in_shippingfee: this.formItem.inShippingfee,
                            		is_calc_comm: this.formItem.isCalcComm,
									// 扩展信息
									is_allow_point: this.extendFormItem.isAllowPoint,
									is_allow_prepaidcard: this.extendFormItem.isAllowPrepaidcard,
									give_type: this.extendFormItem.giveType,
									share_image: this.extendFormItem.shareImage,
									share_title: this.extendFormItem.shareTitle,
									share_desc: this.extendFormItem.shareDesc,
									is_writeoff_self: this.extendFormItem.isWriteoffSelf,
									receive_time: this.extendFormItem.receiveTime,
									receive_time_type: this.extendFormItem.receiveTimeType,
									wxgroup_select: this.extendFormItem.wxgroupSelect.length === 0 ? '' : this.extendFormItem.wxgroupSelect.map(
										item => item.id).join(),
									tag_id: this.extendFormItem.tagId.length === 0 ? '' : this.extendFormItem.tagId.map(item => item.id).join(),
									limited_type: this.extendFormItem.limitedType,
									binding_cat: this.extendFormItem.cat,
									binding_vcat: this.extendFormItem.vcat,
									goods_brand_ids: this.extendFormItem.goodsBrandIds.length === 0 ? '' : this.extendFormItem.goodsBrandIds.map(
										item => item.id).join(),
									binding_goods: this.extendFormItem.bindingGoods,
									exclude_goods: this.extendFormItem.excludeGoods,
									create_num: this.extendFormItem.createNum,
									type_code: this.extendFormItem.typeCode,
									is_binding_erp_user: this.extendFormItem.isBindingErpUser,
									low_stock_notice: this.extendFormItem.lowStockNotice,
									store_select: this.extendFormItem.storeSelect.length === 0 ? '' : this.extendFormItem.storeSelect.map(item =>
										item.id).join(),
									payment_id: this.extendFormItem.paymentId,
									discount_type_id: this.extendFormItem.discountTypeId,
									is_log_income: this.extendFormItem.isLogIncome,
									copy_image_main: this.extendFormItem.copyImageMain,
									copy_image_expire: this.extendFormItem.copyImageExpire
								})
							.then(response => {
								const res = response.data;
								if (res.code) {
									this.$Message.success(res.message);
									// 保存成功不需要离开页面提示
									this.$emit('setStatus');
									this.$router.go(-1);
								}
								this.spinShow = false;
							});
					}
				})
			});
		}
	}
}
