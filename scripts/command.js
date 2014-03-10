MY.Command = function () {};

MY.Command.prototype.init = function (x, y, color) {
	this.x = x;
	this.y = y;
	this.color = color;
	this.width = 32;
	this.height = 32;
};

MY.Command.prototype.render = function (context) {
	context.fillStyle = this.color;
	context.fillRect(this.x, this.y, this.width, this.height);
};