MY.Unit = function () {};

MY.Unit.prototype.init = function (map, config, levelObjectId) {
	this.map = map;
	this.id = config.type;
	this.team = config.team;
	this.x = config.x;
	this.y = config.y;

	this.moveToX = this.x;
	this.moveToY = this.y;
	this.path = null;
	this.pathI = 0;
	this.pathL = 0;
	
	this.width = 32;
	this.height = 32;
	
	this.isMoving = false;
	this.direction = "n";
	this.angle = 0;
	this.speed = 160;
	this.isSelected = false;
	
	this.attackDamage = 10;
	this.attackSpeed = 1000;
	this.attackRange = 32;
	this.attackObject = null;
	this.lastAttackTime = Date.now();
	this.health = 100;
	
	this.orders = [];
	this.isBusy = false;

	this.objectId = MY.Objects.add(this, levelObjectId);
};

MY.Unit.prototype.update = function (deltaTime) {
	if (this.x === this.moveToX && this.y === this.moveToY && this.pathI < this.pathL) {
		var node = this.map.getNodeByRowCol(this.path[this.pathI][1], this.path[this.pathI][0]);
		if (node.object !== null) {
			this.moveTo(this.path[this.path.length - 1][1], this.path[this.path.length - 1][0]);
			if (this.pathI < this.pathL) {
				node = this.map.getNodeByRowCol(this.path[this.pathI][1], this.path[this.pathI][0]);
			} else {
				node = this.node;
				
				this.path = null;
				this.pathI = 0;
				this.pathL = 0;
			}
		}
		this.moveToX = node.x;
		this.moveToY = node.y;
	}
	
	if (this.x !== this.moveToX || this.y !== this.moveToY) {
		this.doMove(deltaTime);

		this.isBusy = true;
	}
	
	if (this.attackObject !== null) {
		this.doAttack();

		this.isBusy = true;
	}
};

MY.Unit.prototype.render = function (context, camera) {
	context.fillStyle = this.isSelected ? this.team.selectedColor : this.team.color;
	context.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
};

MY.Unit.prototype.moveTo = function (row, col) {
	this.path = MY.Pathfinding.getPath(this.map.getGrid(), [Math.floor(this.x / this.map.nodeWidth), Math.floor(this.y / this.map.nodeHeight)], [col, row]);
	this.pathI = 1;
	this.pathL = this.path.length;
};

MY.Unit.prototype.doMove = function (deltaTime) {
	this.isMoving = true;
	var moveToDirection = this.getMoveToDirection();
	if (this.direction === moveToDirection) {
		var speed = Math.round(this.speed * deltaTime);
		
		if (this.x > this.moveToX) {
			this.moveLeft(speed);
		} else if (this.x < this.moveToX) {
			this.moveRight(speed);
		} else if (this.y > this.moveToY) {
			this.moveUp(speed);
		} else if (this.y < this.moveToY) {
			this.moveDown(speed);
		}
		
		if (this.x === this.moveToX && this.y === this.moveToY) {
			this.isMoving = false;

			this.pathI += 1;
			if (this.pathI === this.pathL) {
				this.path = null;
				this.pathI = 0;
				this.pathL = 0;
			}
		}
	}
};

MY.Unit.prototype.getMoveToDirection = function () {
	return "n";
	if (this.x > this.moveToX) {
		return "w";
	} else if (this.x < this.moveToX) {
		return "e";
	} else if (this.y > this.moveToY) {
		return "n";
	} else if (this.y < this.moveToY) {
		return "s";
	}
};

MY.Unit.prototype.moveLeft = function (speed) {
	if (this.x - speed > this.moveToX) {
		this.x -= speed;
	} else {
		this.x = this.moveToX;
	}
};

MY.Unit.prototype.moveRight = function (speed) {
	if (this.x + speed < this.moveToX) {
		this.x += speed;
	} else {
		this.x = this.moveToX;
	}
};

MY.Unit.prototype.moveUp = function (speed) {
	if (this.y - speed > this.moveToY) {
		this.y -= speed;
	} else {
		this.y = this.moveToY;
	}
};

MY.Unit.prototype.moveDown = function (speed) {
	if (this.y + speed < this.moveToY) {
		this.y += speed;
	} else {
		this.y = this.moveToY;
	}
};

MY.Unit.prototype.doAttack = function () {
	if (this.attackObject.health !== 0) {
		if (MY.Util.getDistance(this.x + (this.width / 2), this.y + (this.height / 2), this.attackObject.x + (this.attackObject.width / 2), this.attackObject.y + (this.attackObject.height / 2)) <= this.attackRange) {
			var now = Date.now();
			if (now - this.lastAttackTime > this.attackSpeed) {
				var bullet = new MY.Bullet();
				bullet.init(this, this.attackObject, this.attackDamage);

				this.lastAttackTime = now;
			}
		} else if (!this.isMoving) {
			var node = MY.Util.getRangeNode(this, this.attackObject, this.map, this.attackRange);
			if (node !== null) {
				this.moveTo(node.row, node.col);
			}
		}
	} else {
		this.attackObject = null;
	}
};

MY.Unit.prototype.removeHealth = function (damage) {
	if (this.health - damage > 0) {
		this.health -= damage;
	} else {
		this.health = 0;
	}
};