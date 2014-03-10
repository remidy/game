MY.Viewport = function () {};

MY.Viewport.prototype.init = function (map, canvas, x, y, width, height) {
	this.map = map;
	this.canvas = canvas;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.mapWidth = this.map.width;
	this.mapHeight = this.map.height;
	this.canvasWidth = this.canvas.width;
	this.canvasHeight = this.canvas.height;
	
	this.moveToX = this.x;
	this.moveToY = this.y;
	this.speed = 320;
	this.distance = 10;
	
	this.updateMinRow();
	this.updateMaxRow();
	this.updateMinCol();
	this.updateMaxCol();
};

MY.Viewport.prototype.update = function (deltaTime) {
	var speed = Math.round(this.speed * deltaTime);
	
	if (this.moveToX < this.distance) {
		this.moveLeft(speed);
	} else if (this.moveToX > this.canvasWidth - this.distance) {
		this.moveRight(speed);
	}
	if (this.moveToY < this.distance) {
		this.moveUp(speed);
	} else if (this.moveToY > this.canvasHeight - this.distance) {
		this.moveDown(speed);
	}
	
	this.updateMinRow();
	this.updateMaxRow();
	this.updateMinCol();
	this.updateMaxCol();
};

MY.Viewport.prototype.moveLeft = function (speed) {
	if (this.x - speed < 0) {
		this.x = 0;
	} else {
		this.x -= speed;
	}
};

MY.Viewport.prototype.moveRight = function (speed) {
	if (this.x + speed > this.mapWidth - this.width) {
		this.x = this.mapWidth - this.width;
	} else {
		this.x += speed;
	}
};

MY.Viewport.prototype.moveUp = function (speed) {
	if (this.y - speed < 0) {
		this.y = 0;
	} else {
		this.y -= speed;
	}
};

MY.Viewport.prototype.moveDown = function (speed) {
	if (this.y + speed > this.mapHeight - this.height) {
		this.y = this.mapHeight - this.height;
	} else {
		this.y += speed;
	}
};

MY.Viewport.prototype.updateMinRow = function () {
	this.minRow = Math.floor(this.y / this.map.nodeHeight);
};

MY.Viewport.prototype.updateMaxRow = function () {
	this.maxRow = Math.ceil((this.y + this.height) / this.map.nodeHeight);
};

MY.Viewport.prototype.updateMinCol = function () {
	this.minCol = Math.floor(this.x / this.map.nodeWidth);
};

MY.Viewport.prototype.updateMaxCol = function () {
	this.maxCol = Math.ceil((this.x + this.width) / this.map.nodeWidth);
};