MY.require("scripts/buildings/cash-building.js");
MY.require("scripts/buildings/soldier-building.js");
MY.require("scripts/buildings/worker-building.js");

MY.Building = function () {};

MY.Building.prototype.init = function (id, team, node, map, progress) {
	this.id = id;
	this.team = team;
	this.node = node;
	this.map = map;
	this.progress = progress !== undefined ? progress : 100;
	
	var building = MY.Config.buildings[this.id];
	
	this.x = this.node.x;
	this.y = this.node.y;
	this.width = building.width;
	this.height = building.height;
	this.grid = building.grid;
	
	this.nodes = [];
	for (var i = 0, l = this.grid.length; i < l; i += 1) {
		var row = this.grid[i];
		for (var j = 0, m = row.length; j < m; j += 1) {
			var col = row[j];
			if (col > 0) {
				var node = this.map.getNodeByRowCol(this.node.row + i, this.node.col + j);
				if (col < 3) {
					this.nodes.push(node);
					node.object = this;
				} else {
					this.addUnitNode = node;
					this.moveToUnitNode = node;
				}
			}
		}
	}
	
	this.units = [];
	this.unitQueue = [];
	this.lastUnitTime = Date.now();
	
	this.isSelected = false;
	
	this.objectId = MY.ObjectManager.add(this);
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
				unit.init(this.team, this.addUnitNode, this.map);
				if (this.addNode !== this.moveToNode) {
					unit.moveTo(this.moveToNode.row, this.moveToNode.col);
				}
			}
			this.lastUnitTime = now;
		}
	}
};

MY.Building.prototype.render = function (context, viewport) {
	context.fillStyle = this.isSelected ? this.team.selectedColor : this.team.color;
	for (var i = 0, l = this.grid.length; i < l; i += 1) {
		var row = this.grid[i];
		for (var j = 0, m = row.length; j < m; j += 1) {
			var col = row[j];
			if (col === 1 || col === 2) {
				context.fillRect(this.x + (j * this.map.nodeWidth) - viewport.x, this.y + (i * this.map.nodeHeight) - viewport.y, this.map.nodeWidth, this.map.nodeHeight);
			}
		}
	}
	
	if (this.progress > 0 && this.progress < 100) {
		context.fillStyle = "rgb(255, 255, 255)";
		context.fillText(this.progress, this.x + 2 - viewport.x, this.y + 12 - viewport.y);
	} else if (this.unitQueue.length > 0) {
		context.fillStyle = "rgb(255, 255, 255)";
		context.fillText(this.unitQueue[0].progress, this.x + 2 - viewport.x, this.y + 12 - viewport.y);
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