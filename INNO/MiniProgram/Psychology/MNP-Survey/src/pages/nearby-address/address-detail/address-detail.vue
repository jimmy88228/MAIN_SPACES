<template>
	<view class="">
		<page-nav>
			<template slot="title"> 导航 </template>
		</page-nav>
		<view class="map_view">
			<map id="map" class="map" :longitude="longitude" :latitude="latitude" :controls="controls"
				@controltap="controltap" :markers="markers" @markertap="markertap" :polyline="polyline"
				:show-location="loc_f==0" :scale="scale">
			</map>
			<view class="msg_box" @click="toNavigate">
				<view class="stroe_name">
					<view class="name">{{detailData.name}}</view>
				</view>
				<view class="store_info flex-s-c font-22">
					<image :src="requireStatic('/nearby-address/address.png')" mode="aspectFit" />{{detailData.address}}</view>
				<view v-if="detailData.telephone" class="store_info flex-s-c font-22">
					<image :src="requireStatic('/nearby-address/telephone.png')" mode="aspectFit" />{{detailData.telephone}}
				</view>
				<view class="store_info flex-s-c font-22">
					<image :src="requireStatic('/nearby-address/time.png')" mode="aspectFit" />{{detailData.serviceTime}}
				</view>
				<view class="btn_box">
					<view class="btn_l" @click.stop="toNavigate">
						<image :src="requireStatic('/nearby-address/btn_l.png')" mode="aspectFit" class="img_btn_l"></image>
						<view>路线导航</view>
					</view>
					<view v-if="detailData.telephone" class="btn_r" :class="detailData.telephone ? '':'disabled'" :data-phone="detailData.telephone" @click.stop="tap_phone">
						<image :src="requireStatic('/nearby-address/btn_r.png')" mode="aspectFit" class="img_btn_r"></image>
						<view>呼叫机构</view>
					</view>
					<view v-if="detailData.psychicHotline" class="btn_l btn_heart" :class="detailData.psychicHotline ? '':'disabled'"
						@click.stop="tap_psychicHotline">
						<image :src="requireStatic('/nearby-address/heart_color.png')" mode="aspectFit" class="img_btn_l">
						</image>
						<view>心理咨询热线</view>
					</view>
					<view v-if="detailData.residentBookPhone" class="btn_r btn_store" :class="detailData.residentBookPhone ? '':'disabled'"
						@click.stop="tap_residentBookPhone">
						<image :src="requireStatic('/nearby-address/store_color.png')" mode="aspectFit" class="img_btn_r">
						</image>
						<view>线下驻场预约</view>
					</view>
				</view>
			</view>
			<oriPopup ref="oriPopup" @change="popupChange" type="center">
				<template v-slot:content>
					<view class="popup-content" @click="hidePopup">
						<view class="popup_telephone"  :style="{'opacity':popupShow?1:0,'transition':'0.4s all'}">
							<view v-if="showPsychicHotline" class="popup_info" :data-phone="detailData.psychicHotline" @click.stop="tap_phone">
								<view class="C_ff8d8d font-20 m-b-10">心理咨询热线</view>
								<view class="C_ff8d8d font-34">{{detailData.psychicHotline}}</view>
							</view>
							<view v-if="showResidentBookPhone" class="popup_info" :data-phone="detailData.residentBookPhone" @click.stop="tap_phone">
								<view class="C_93b53e font-20 m-b-10">线下驻场预约</view>
								<view class="C_93b53e font-34">{{detailData.residentBookPhone}}</view>
							</view>
							<image v-show="showPsychicHotline" :src="requireStatic('/nearby-address/heart_telephone.png')" mode="widthFix"  :data-phone="detailData.psychicHotline" @click.stop="tap_phone"/>
							<image v-show="showResidentBookPhone" :src="requireStatic('/nearby-address/store_telepphone.png')" mode="widthFix"  :data-phone="detailData.residentBookPhone" @click.stop="tap_phone"/>
						</view>
						<view class="filter-blur-background" :style="{'opacity':popupShow?1:0}"></view>
					</view>
				</template>
			</oriPopup>
		</view>
	</view>
</template>

<script>
	import SMH from "@/common/helper/show-msg-handler.js";
	import oriPopup from '@/components/ori-comps/popup/ori-popup'

	const app = getApp()
	const pageOption = Page.BasePage({
		components: {
			oriPopup
		},
		data() {
			return {
				options: {},
				key: '2dd89b6c37c754f9f98d7d6bd132b2e1',
				detailData: {},
				reduce: 0,
				reduceTime: 0,
				loc_f: 0,
				navPlace: app.SIH.navPlace,
				polyline: [],
				longitude: 0,
				latitude: 0,
				statusType: "",
				distance: "10000",
				time: "10000",
				showPanel: false,
				scale: 16,
				curLat: "0",
				curLon: "0",
				isInit: false,
				isInitTime: false,
				includePoints: [],
				controls: [{
					id: 1,
					iconPath: '',
					position: {
						left: 10,
						top: 10,
						width: 30,
						height: 30
					},
					clickable: true
				}],
				markers: [{
					iconPath: "",
					id: 0,
					latitude: 0,
					longitude: 0,
					width: 0,
					height: 0,
					callout: {
						content: "",
						borderRadius: 10,
						padding: 10,
						display: "ALWAYS",
						textAlign: "center",
					}
				}],
				popupShow: false,
				showPsychicHotline: false,
				showResidentBookPhone: false
			}
		},
		onLoad(options) {
			this.options = options
			this.Initmap()
		},
		onReady() {},
		onShow() {
			let _this = this;
			uni.getLocation({
				type: 'gcj02',
				success(res) {
					const latitude = res.latitude;
					const longitude = res.longitude;
					_this.curLat = latitude;
					_this.curLon = longitude;
					let points = _this.includePoints;
					points.push({
						longitude: longitude,
						latitude: latitude
					});
					console.log(points)
					_this.includePoints = points
				}
			});
		},
		methods: {
			Initmap() {
				var that = this;
				this.initData().then(res => {
					var markers = that.markers;
					markers[0].width = that.realMarker.call(that, 32, 39).width;
					markers[0].height = that.realMarker.call(that, 32, 39).height;
					markers[0].latitude = res.latitude;
					markers[0].longitude = res.longitude;
					markers[0].title = res.name;
					markers[0].callout.content = res.name;
					markers[0].iconPath = "../../../static/nearby-address/guide_point.png";
					this.markers = markers;
					this.longitude = res.longitude;
					this.latitude = res.latitude;
					this.includePoints.push({
						longitude: res.longitude,
						latitude: res.latitude
					})
					console.log("视野")
					console.log(that.includePoints)
				})
			},
			initData() {
				let options = this.options
				return this.$Http(this.$Apis.getPsyServiceStationById, {
					data: {
						id: options.id
					}
				}).then(e => {
					if (e.code == 1) {
						console.log(e)
						this.detailData = e.data || {};
						return Promise.resolve(e.data)
					}
					return Promise.reject(e)
				})
			},
			toNavigate(e) {
				let lat = parseFloat(this.latitude) || 0;
				let lon = parseFloat(this.longitude) || 0;
				let name = this.detailData.name || 0;
				uni.openLocation({
					latitude: lat,
					longitude: lon,
					scale: 18,
					address: name,
					complete: res => {
						console.log('complete', res)
					},
				})
			},
			realMarker(w, h) {
				let [scale, tranferWidth, tranferHeight] = [0, 0, 0];
				let windowWidth = app.SIH.windowWidth;
				scale = (750 / windowWidth).toFixed(2);
				tranferWidth = (w / scale).toFixed(2);
				tranferHeight = (h / scale).toFixed(2);
				return {
					width: Math.ceil(tranferWidth),
					height: Math.ceil(tranferHeight)
				};
			},
			controltap(e) {
				console.log('controltap', e);
				var detailData = this.detailData;
				var longitude = parseFloat(detailData.longitude);
				var latitude = parseFloat(detailData.latitude);
				var name = options.name;
				var address = options.address;
				console.log('openLocation')
				uni.openLocation({
					latitude: latitude,
					longitude: longitude,
					name: name,
					address: address
				})
			},
			tap_phone: function ({currentTarget}) {
				let dataset = currentTarget.dataset || "";
				let phone = dataset.phone || "";
				if (!phone || phone == "0") {
					app.SMH.showToast({
						title: "没有可拨打的电话号码"
					});
					return;
				}
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			tap_psychicHotline() {
				this.showPsychicHotline = true;
				this.$refs['oriPopup'].show()
			},
			tap_residentBookPhone() {
				this.showResidentBookPhone = true;
				this.$refs['oriPopup'].show()
			},
			goTo({
				currentTarget
			}) {
				uni.showLoading({
					title: '加载中',
				});
				let type = currentTarget.dataset.type;
				let typeName = type == 'car' ? '驾车' : type == 'walk' ? '步行' : type == 'ride' ? '骑行' : '前行'
				this.statusType = type;
				this.typeName = typeName;
				if (this.isInit) {
					this.reduce = -10;
				} else {
					this.reduce = 0;
				}
				if (this.isInitTime) {
					this.reduceTime = -10;
				} else {
					this.reduceTime = 0;
				}
				this.getPolyline(type);
			},
			getPolyline(_type) {
				var amap = new amapFile.AMapWX({
					key: this.key,
					success(res) {
						console.log(res, "调用成功")
					},
					fail(err) {
						console.log(err, "调用失败")
					}
				});
				console.log(amap, "获取回来的路线")

				var self = this;
				switch (_type) {
					case 'car':
						amap.getDrivingRoute(this.drawPolyline(this, "#0091ff"));
						break;
					case 'walk':
						amap.getWalkingRoute(this.drawPolyline(this, "#1afa29"));
						break;
					case 'ride':
						amap.getRidingRoute(this.drawPolyline(this, "#f8b693"));
						break;
					default:
						return false;
				}
			},
			drawPolyline(self, color) {
				let that = this;
				let _timer = setTimeout(function () {
					clearTimeout(_timer);
					uni.hideLoading();
				}, 6000)
				return {
					origin: this.curLon + ',' + this.curLat,
					destination: this.longitude + ',' + this.latitude,
					success(data) {
						console.log(data, '成功')
						uni.hideLoading();
						var points = [];
						if (data.paths && data.paths[0] && data.paths[0].steps) {
							var steps = data.paths[0].steps;
							for (var i = 0; i < steps.length; i++) {
								var poLen = steps[i].polyline.split(';');
								for (var j = 0; j < poLen.length; j++) {
									points.push({
										longitude: parseFloat(poLen[j].split(',')[0]),
										latitude: parseFloat(poLen[j].split(',')[1])
									})
								}
							}
						}
						let distance = 0;
						let distance_botm = 0;
						if (Number((data.paths[0].distance / 1000)) < 1) {
							distance = Number(data.paths[0].distance) + "米";
							distance_botm = Number(data.paths[0].distance) + "m";
						} else {
							distance = Number(data.paths[0].distance / 1000) + "千米";
							distance_botm = Number(data.paths[0].distance / 1000) + "km";
						}
						console.log('points', points)

						that.distance = distance;
						that.distance_botm = distance_botm;
						that.time = parseInt(data.paths[0].duration / 60) + "分钟 ";
						that.polyline = [{
							points: points,
							color: color,
							width: 6,
							arrowLine: true
						}]
						that.showPanel = true

					},
					fail(err) {
						if (err.infocode == '10044' || err.errcode == '10044') {
							SMH.showToast({
								title: "调用次数已达到上限"
							})
						}
						console.log(err, '调用失败')
					}
				}
			},
			popupChange(e) {
				if (e.show) {
					setTimeout(() => {
						this.popupShow = true
					}, 200);
				} else {
					this.showPsychicHotline = false;
					this.showResidentBookPhone = false;
					this.popupShow = false;
				}
			},
			hidePopup() {
				this.$refs['oriPopup'].dismiss()
			}
		},
	})
	export default pageOption
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
	}

	.map_view {
		position: relative;
		width: 100%;
	}

	.map {
		width: 750rpx;
		height: 750rpx;
	}

	.allWays {
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		height: 80rpx;
		background: white;
	}

	.ways {
		font-size: 28rpx;
		color: rgba(99, 102, 106, 1);
		width: 251rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}

	.statusActive {
		color: $uni-main-color;
		font-weight: bold;
	}

	.result {
		background: white;
		position: relative;
		margin: 15rpx auto;
		width: 720rpx;
		height: 64rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #333;
		border-radius: 10rpx;
	}

	.distance,
	.time {
		width: 600rpx;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.top_header {
		position: fixed;
		z-index: 11;
		width: 100%;
		left: 0;
		top: 0;
	}

	.wrapper {
		width: 80rpx;
		height: 80rpx;
		position: absolute;
		top: -120rpx;
		right: 10rpx;
		z-index: 11;
	}

	.currentPosi {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80rpx;
		height: 80rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 6rpx 12rpx 0px rgba(0, 0, 0, 0.08);
		border-radius: 50%;
		opacity: 0.8;
	}

	.innerPosi {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background: #459DEC;
	}


	.innerPosi::after {
		content: '';
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		background: #fff;
	}

	.innerPosiItem {
		content: '';
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		background: #459DEC;
		position: absolute;
	}

	.msg_box {
		width: 100%;
		box-sizing: border-box;
		padding-left: 110rpx;
		position: relative;
		background: #fff;
		padding: 30rpx;
	}

	.line {
		width: 1px;
		background: #f7f7f7;
		height: 30rpx;
	}

	.distance_msg,
	.typeName {
		font-size: 22rpx;
		line-height: 22rpx;
	}

	.line_style {
		width: 1px;
		margin: 0 20rpx;
		background: #333;
		height: 20rpx;
	}

	.store_msg {
		padding-bottom: 20rpx;
		font-size: 22rpx;
		line-height: 24rpx;
	}

	.store_msg.bold {
		padding-bottom: 26rpx;
		font-weight: bold;
		font-size: 28rpx;
	}

	.btn_box {
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.btn_l,
	.btn_r {
		width: 334rpx;
		height: 100rpx;
		display: flex;
		border-radius: 10rpx;
		flex-direction: column;
		align-items: center;
		background: #EFF8FF;
		font-size: 18rpx;
		color: #459DEC;
		justify-content: center;
		margin-top: 30rpx;
	}

	.btn_heart {
		background: rgba($color: #FFE0E0, $alpha: 0.23);
		color: #FF9E9E;
	}

	.btn_store {
		background: rgba($color: #E6F8B8, $alpha: 0.3);
		color: #93B53E;
	}

	.img_btn_l,
	.img_btn_r {
		width: 40rpx;
		height: 40rpx;
		padding-bottom: 5rpx;
	}

	.disabled {
		filter: grayscale(100%);
		filter: gray;
		/*ie9- */
		background: #ececec;
		color: cccccc;
	}

	/**/
	.stroe_name {
		font-size: 28rpx;
		font-weight: bold;
		margin-bottom: 32rpx;
		display: flex;
		align-items: center;
	}

	.store_info {
		margin-bottom: 18rpx;

		image {
			flex-shrink: 0;
			width: 20rpx;
			height: 20rpx;
			margin-right: 16rpx;
		}
	}

	.store_info:last-child {
		margin-bottom: 0;
	}

	.popup-content {
		background: transparent;
		width: 100vw;
		height: 100vh;
		position: relative;
		font-weight: bold;

		.popup_telephone {
			position: absolute;
			bottom: 60rpx;
			left: 0;
			width: 100%;
			height: 201rpx;
		}

		image {
			width: 100%;
			height: 201rpx;
		}

		.popup_info {
			position: absolute;
			left: 50%;
			top: 48%;
			transform: translateX(-50%);
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
		}
	}

	.filter-blur-background {
		position: fixed;
		transition: 0.3s all;
		opacity: 0;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(20rpx);
		z-index: -1;
	}
</style>