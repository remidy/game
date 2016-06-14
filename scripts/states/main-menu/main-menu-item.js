MY.MainMenuItem = function () {};

MY.MainMenuItem.prototype.init = function (stateId, text, x, y) {
	this.stateId = stateId;
	this.text = text;
	this.x = x;
	this.y = y;
	this.width = 320;
	this.height = 32;
};

MY.MainMenuItem.prototype.render = function (context) {
	context.strokeRect(this.x, this.y, this.width, this.height);
	context.fillText(this.text, this.x + (this.width / 2) - (context.measureText(this.text).width / 2), this.y + 21);
};