MY.Node = function () {};

MY.Node.prototype.init = function (terrain, row, col, width, height) {
	this.terrain = terrain;
	this.row = row;
	this.col = col;
	this.width = width;
	this.height = height;
	this.x = this.col * this.width;
	this.y = this.row * this.height;
	this.object = null;
};

MY.Node.prototype.update = function (map) {
	this.n = map.getNodeByRowCol(this.row - 1, this.col);
	this.s = map.getNodeByRowCol(this.row + 1, this.col);
	this.e = map.getNodeByRowCol(this.row, this.col + 1);
	this.w = map.getNodeByRowCol(this.row, this.col - 1);
};

MY.Node.prototype.render = function (context, viewport) {
	context.fillStyle = this.terrain.color;
	context.fillRect(this.x - viewport.x, this.y - viewport.y, this.width, this.height);
};

MY.Node.prototype.getCost = function () {
	var cost = this.terrain.cost;
	if (this.object !== null) {
		cost += 10;
	}
	return cost;
};