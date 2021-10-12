export default {
	watch: {
		columns(orderColum) {
			const _this = this;
			this.columnsData = [...orderColum].map(item => {
				switch (item.key) {
					
					case 'name':
						return {
							...item,
							render: function(h, params) {
								if( params.row.canHomePage ){
									return h('div', {
											style:{},
										},
										[
											h('div', {
												style:{}
											}, params.row.name),
											h('div',{
												style:{
													display: ( params.row.is_default_bind == 1 ? 'block' :'none' ),
												}
											},[
												h('Tag',{
													props:{
														color:'primary'
													}
												},"默认绑定店铺"),
											]),
											h('div',{
												style:{}
											},
											[
												h('a', {
													style:{
														marginRight: '5px',
														fontSize: '12px',
														display: ( _this.type != 1 ? 'block' : 'none')
													},
													on:{
														click: () => {
															_this.setHomePage(params.index, params.row);
														}
													}
												}, '[修改主页]' ),
												h('span', {
													style:{
														fontSize: '12px',
													}
												}, ( params.row.home_page_id > 0 ? params.row.home_page_name : '全云店默认主页') )
											]),
										]
									);
								}
								else{
									return h('div', {
										style:{}
									}, params.row.name);
								}
							}
						}
					
					/*
					case 'status':
						return {
							...item,
							render: function(h, params) {
								return h('i-switch', {
									props: {
										size: 'large',
										value: params.row.status,
										'true-value': 1,
										'false-value': 0,
										'before-change': function() {
											return new Promise((resolve, reject) => {
												//_this.setDefaultStore(params.row.id);
												reject();
											});
										}
									}
								}, [
									h('span', {
										slot: 'open'
									}, '正常'),
									h('span', {
										slot: 'close'
									}, '关闭')
								]);
							}
						}*/
						
					case 'enable_self_get':
						return {
							...item,
							render: function(h, params) {
								const text = params.row.enable_self_get == 1 || params.row.enable_self_get == 'true' ? '开' : '关';
								return h('Tag', {
									props: {
										type: 'dot',
										color: params.row.enable_self_get == 1 || params.row.enable_self_get == 'true' ? 'success' : 'error'
									},
								}, text);
							}
						}
						
					case 'handle':
						return {
							...item,
							fixed: 'right',
							render: function(h, params) {
								const wrapper = [];
								if (params.row.handle.edit && _this.type != 1) {
									// 编辑按钮
									wrapper.push(
										h('span', [
											h('a', {
												on: {
													click: () => {
														_this.$router.push({
															name: 'store-edit',
															params: {
																id: Number(params.row.id)
															}
														});
													}
												}
											}, '编辑'),
											h('Divider', {
												props: {
													type: "vertical"
												}
											})
										])
									);
								}
								if (params.row.handle.remove && _this.type != 1) {
									wrapper.push(
										h('span', [
											h('a', {
												on: {
													click: () => {
														_this.removeStore(params.row.id, 'remove');
													}
												}
											}, '关闭'),
											h('Divider', {
												props: {
													type: "vertical"
												}
											})
										])
									);
								}
								if (params.row.handle.isDefaultBind && _this.type != 1) {
									wrapper.push(
										h('span', [
											h('a', {
												on: {
													click: () => {
														_this.$router.push({
															name: 'staff-list',
															query: {
																store_id: Number(params.row.id)
															}
														});
													}
												}
											}, '店铺店员'),
											h('Divider', {
												props: {
													type: "vertical"
												}
											})
										])
									);
								}
								if(params.row.is_default_bind == 0 && _this.type != 1){
									wrapper.push(
										h('span', [
											h('a', {
												on: {
													click: () => {
														_this.setDefaultStore(params.row.id);
													}
												}
											}, '设为默认店铺'),
											h('Divider', {
												props: {
													type: "vertical"
												}
											})
										])
									);
								}
								
								if (params.row.handle.weixinQrcode && _this.type != 1) {
									wrapper.push(
										h('span', [
											h('a', {
												on: {
													click: () => {
														_this.handleWeixin(params.row);
													}
												}
											}, '微信二维码'),
											h('Divider', {
												props: {
													type: "vertical"
												}
											})
										])
									);
								}
								if (params.row.handle.appletQrcode && _this.type != 1) {
									wrapper.push(
										h('span', [
											h('a', {
												on: {
													click: () => {
														_this.handleAppletQrcode(params.row);
													}
												}
											}, '小程序二维码'),
											h('Divider', {
												props: {
													type: "vertical"
												}
											})
										])
									);
								}
								if (_this.type == 1) {
									wrapper.push(
										h('a', {
											on: {
												click: () => {
													_this.removeStore(params.row.id, 'reset');
												}
											}
										}, '启用')
										
									);
								}
								return h('div', { 
									style:{
										padding:'5px 0',
									},
								}, wrapper);
							}
						}
					default:
						return item;
				}
			});
		}
	}
}
