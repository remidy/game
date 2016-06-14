MY.Camera = function () {};

MY.Camera.prototype.init = function (map, canvas, x, y, width, height) {
	this.map = map;
	this.canvas = canvas;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.moveToX = this.x;
	this.moveToY = this.y;
	this.speed = 320;
	this.distance = 10;
	
	this.updateMinRow();
	this.updateMaxRow();
	this.updateMinCol();
	this.updateMaxCol();
};

MY.Camera.prototype.update = function (deltaTime) {
	var speed = Math.round(this.speed * deltaTime);
	
	if (this.moveToX < this.distance) {
		this.moveLeft(speed);
	} else if (this.moveToX > this.canvas.width - this.distance) {
		this.moveRight(speed);
	}
	if (this.moveToY < this.distance) {
		this.moveUp(speed);
	} else if (this.moveToY > this.canvas.height - this.distance) {
		this.moveDown(speed);
	}
	
	this.updateMinRow();
	this.updateMaxRow();
	this.updateMinCol();
	this.updateMaxCol();
};

MY.Camera.prototype.moveLeft = function (speed) {
	if (this.x - speed < 0) {
		this.x = 0;
	} else {
		this.x -= speed;
	}
};

MY.Camera.prototype.moveRight = function (speed) {
	if (this.x + speed > this.map.width - this.width) {
		this.x = this.map.width - this.width;
	} else {
		this.x += speed;
	}
};

MY.Camera.prototype.moveUp = function (speed) {
	if (this.y - speed < 0) {
		this.y = 0;
	} else {
		this.y -= speed;
	}
};

MY.Camera.prototype.moveDown = function (speed) {
	if (this.y + speed > this.map.height - this.height) {
		this.y = this.map.height - this.height;
	} else {
		this.y += speed;
	}
};

MY.Camera.prototype.updateMinRow = function () {
	this.minRow = Math.floor(this.y / this.map.nodeHeight);
};

MY.Camera.prototype.updateMaxRow = function () {
	this.maxRow = Math.ceil((this.y + this.height) / this.map.nodeHeight);
};

MY.Camera.prototype.updateMinCol = function () {
	this.minCol = Math.floor(this.x / this.map.nodeWidth);
};

MY.Camera.prototype.updateMaxCol = function () {
	this.maxCol = Math.ceil((this.x + this.width) / this.map.nodeWidth);
};