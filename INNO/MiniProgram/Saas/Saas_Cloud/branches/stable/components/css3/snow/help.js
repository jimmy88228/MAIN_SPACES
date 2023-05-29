

function Snow(x, y, radius) {
  this.x = x;
  this.y = y;
  this.sx = 0;
  this.sy = 0;
  this.deg = 0;
  this.radius = radius;
  this.ax = Math.random() < 0.5 ? 0.005 : -0.005;
  this.r = Math.random()*4;
  this.op = Math.random()+0.01;
}

Snow.prototype.update = function() {
  const deltaDeg = Math.random() * 0.6 + 0.2;

  this.sx += this.ax;
  if (this.sx >= SPEED_LIMIT_X || this.sx <= -SPEED_LIMIT_X) {
    this.ax *= -1;
  }

  if (this.sy < SPEED_LIMIT_Y) {
    this.sy += G;
  }

  this.deg += deltaDeg;
  this.x += this.sx;
  this.y += this.sy;
}

Snow.prototype.draw = function() {
  const radius = this.radius;
  ctx.save();
  ctx.fillStyle = `rgba(255, 255, 255, ${this.op})`;
  this.op -= 0.005;
  this.op < 0 && (this.op = 0.8);
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
  ctx.fill();
  ctx.translate(this.x, this.y);
  // ctx.drawImage(snowImage, -radius, -radius, radius * 2, radius * 2);
  ctx.restore();
}

// export default Snow