MY.Bullet = function () {};

MY.Bullet.prototype.init = function (fromObject, toObject, damage) {
	this.fromObject = fromObject;
	this.toObject = toObject;
	this.damage = damage;
	this.x = this.fromObject.x + (this.fromObject.width / 2);
	this.y = this.fromObject.y + (this.fromObject.height / 2);
	this.width = 2;
	this.height = 2;
	this.speed = 320;
	this.angle = Math.atan2(this.toObject.y + (this.toObject.width / 2) - this.y, this.toObject.x + (this.toObject.height / 2) - this.x);
	this.health = 1;
	this.team = fromObject.team;
	
	this.objectId = MY.Objects.add(this);
};

MY.Bullet.prototype.update = function (deltaTime) {
	var speed = this.speed * deltaTime;
	
	this.x += Math.round(Math.cos(this.angle) * speed);
	this.y += Math.round(Math.sin(this.angle) * speed);
	
	if (MY.Util.isRectInRect(MY.Util.getObjectRect(this), MY.Util.getObjectRect(this.toObject))) {
		this.toObject.removeHealth(this.damage);
		this.health = 0;
	}
};

MY.Bullet.prototype.render = function (context, camera) {
	context.fillStyle = "rgb(0, 0, 0)";
	context.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
};