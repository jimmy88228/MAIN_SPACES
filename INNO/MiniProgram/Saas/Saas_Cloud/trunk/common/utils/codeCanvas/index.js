var barcode = require('./barcode');
var qrcode = require('./qrcode');

function convert_length(length) {
	return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
}

function barc(id, code, width, height,callback) {
  barcode.code128(wx.createCanvasContext(id), code, convert_length(width), convert_length(height), callback)
}

function barc_custom(id, code, width, height, that, callback) {
  barcode.code128(wx.createCanvasContext(id, that), code, convert_length(width), convert_length(height), callback)
}

function qrc(componentOrId, code, width, height,callback) {
	return new Promise(resolve => {
		let ctx = typeof componentOrId === "object" ? componentOrId : wx.createCanvasContext(componentOrId)
		console.log("ctx=====================>", ctx)
		qrcode.api.draw(code, {
			ctx,
			width: convert_length(width),
			height: convert_length(height)
		}, null, null, callback)
		resolve(ctx)
	})
}
function qrc_custom(id, code, width, height, that, callback) {
	qrcode.api.draw(code, {
    ctx: wx.createCanvasContext(id, that),
		width: convert_length(width),
		height: convert_length(height)
  }, null, null, callback)
}

module.exports = {
	barcode: barc,
  barcode_custom: barc_custom,
	qrcode: qrc,
  qrcode_custom: qrc_custom,
}