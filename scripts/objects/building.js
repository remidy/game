MY.Building = function () {};

MY.Building.prototype.init = function (map, config, levelObjectId) {
	this.map = map;
	this.id = config.type;
	this.team = config.team;
	this.progress = config.progress !== undefined ? config.progress : 100;
	
	var building = MY.Config.objectTypes[this.id];
	
	this.x = config.x;
	this.y = config.y;
	this.width = building.width;
	this.height = building.height;
	this.grid = building.grid;

	this.nodes = this.getNodes();

	this.units = [];
	this.unitQueue = [];
	this.lastUnitTime = Date.now();
	
	this.isSelected = false;

	this.health = 1000;
	
	this.objectId = MY.Objects.add(this, levelObjectId);
};

MY.Building.prototype.update = function (deltaTime) {
	if (this.unitQueue.length > 0) {
		var now = Date.now();
		if (now - this.lastUnitTime > 100) {
			var progress = 1;
			if (this.unitQueue[0].progress + progress < 100) {
				this.unitQueue[0].progress += progress;
			} else {
				this.unitQueue[0].progress = 0;
				var unit = new MY[this.unitQueue.pop().type]();
				unit.init(this.map, {
					team: this.team,
					x: this.addUnitNode.x,
					y: this.addUnitNode.y
				});
				if (this.addUnitNode !== this.moveToUnitNode) {
					unit.moveTo(this.moveToUnitNode.row, this.moveToUnitNode.col);
				}
			}
			this.lastUnitTime = now;
		}
	}
};

MY.Building.prototype.render = function (context, camera) {
	context.fillStyle = this.isSelected ? this.team.selectedColor : this.team.color;
	for (var i = 0, l = this.grid.length; i < l; i += 1) {
		var row = this.grid[i];
		for (var j = 0, m = row.length; j < m; j += 1) {
			var col = row[j];
			if (col === 1 || col === 2) {
				context.fillRect(this.x + (j * this.map.nodeWidth) - camera.x, this.y + (i * this.map.nodeHeight) - camera.y, this.map.nodeWidth, this.map.nodeHeight);
			}
		}
	}
	
	if (this.progress > 0 && this.progress < 100) {
		context.fillStyle = "rgb(255, 255, 255)";
		context.fillText(this.progress, this.x + 2 - camera.x, this.y + 12 - camera.y);
	} else if (this.unitQueue.length > 0) {
		context.fillStyle = "rgb(255, 255, 255)";
		context.fillText(this.unitQueue[0].progress, this.x + 2 - camera.x, this.y + 12 - camera.y);
	}
};

MY.Building.prototype.addUnit = function (type, cost) {
	var unit = {
		type: type,
		cost: cost,
		progress: 0
	};
	this.unitQueue.push(unit);
};

MY.Building.prototype.removeUnit = function (type) {
	for (var i = this.unitQueue.length - 1; i >= 0; i += 1) {
		var unit = this.unitQueue[i];
		if (unit.type === type) {
			this.team.addCash(unit.cost);
			this.unitQueue.splice(i, 1);
			break;
		}
	}
};

MY.Building.prototype.getNodes = function () {
	var nodes = [];
	var leftTopNode = this.map.getNodeByXY(this.x, this.y);
	for (var i = 0, l = this.grid.length; i < l; i += 1) {
		var row = this.grid[i];
		for (var j = 0, m = row.length; j < m; j += 1) {
			var col = row[j];
			if (col > 0) {
				var node = this.map.getNodeByRowCol(leftTopNode.row + i, leftTopNode.col + j);
				if (col < 3) {
					nodes.push(node);
					node.object = this;
				}
				if (col === 2) {
					this.addUnitNode = node;
				} else if (col === 3) {
					this.moveToUnitNode = node;
				}
			}
		}
	}
	return nodes;
};

MY.Building.prototype.removeHealth = function (damage) {
	if (this.health - damage > 0) {
		this.health -= damage;
	} else {
		this.health = 0;
	}
};


MY.TransformBuilding = function () {};

MY.TransformBuilding.prototype = Object.create(MY.Building.prototype);

MY.TransformBuilding.prototype.init = function (config) {
	MY.Building.prototype.init.call(this, config);
};