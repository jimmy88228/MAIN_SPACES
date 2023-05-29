var barcode = require('./barcode');
var qrcode = require('./qrcode');
const sha1 = require("../../../../common/support/libs/sha1/index.js");

function getOrderInfoParams({order_id = 0, order_sn = ""}) {
  let timestamp = new Date().getTime();
  return {
    timestamp,
    signature: sha1(order_id+order_sn+timestamp)
  }
}

function convert_length(length) {
	return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
}

function barc(id, code, width, height) {
	barcode.code128(wx.createCanvasContext(id), code, convert_length(width), convert_length(height))
}

function qrc(id, code, width, height) {
	qrcode.api.draw(code, {
		ctx: wx.createCanvasContext(id),
		width: convert_length(width),
		height: convert_length(height)
	})
}

module.exports = {
	barcode: barc,
  qrcode: qrc,
  getOrderInfoParams: getOrderInfoParams
}