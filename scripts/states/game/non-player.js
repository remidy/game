MY.NonPlayer = function () {};

MY.NonPlayer.prototype.init = function (game, team) {
	this.game = game;
	this.team = team;
};

MY.NonPlayer.prototype.update = function () {
	var objects = MY.Objects.objects[this.team.id];
	for (var objectId in objects) {
		var object = objects[objectId];
		if (!object.isBusy) {
			if (object instanceof MY.SoldierUnit) {
				this.updateSoldierUnit(object);
			} else if (object instanceof MY.WorkerUnit) {
				this.updateWorkerUnit(object);
			}
		}
	}
};

MY.NonPlayer.prototype.updateSoldierUnit = function (soldierUnit) {
	for (var teamId in MY.Objects.objects) {
		if (teamId !== "undefined" && teamId !== soldierUnit.team.id) {
			for (var objectId in MY.Objects.objects[teamId]) {
				var object = MY.Objects.objects[teamId][objectId];
				if (MY.Util.getDistance(soldierUnit.x, soldierUnit.y, object.x, object.y) <= soldierUnit.attackRange) {
					soldierUnit.attackObject = object;
					break;
				}
			}
		}
	}
};

MY.NonPlayer.prototype.updateWorkerUnit = function (workerUnit) {
	var cashBuildings = this.getCashBuildings();
	var resourceObject = MY.Util.getObject(workerUnit, this.game.map.resources, this.filterResourceObject);
	if (cashBuildings.length > 0) {
		if (cashBuildings.length === 1 && cashBuildings[0].progress < 100) {
			workerUnit.buildingObject = cashBuildings[0];
		} else {
			workerUnit.resourceObject = resourceObject;
		}
	} else {
		this.buildCashBuilding(workerUnit, resourceObject);
	}
};

MY.NonPlayer.prototype.buildCashBuilding = function (object, resourceObject) {
	var rowsCols = this.getRowsCols();
	for (var i = 0, l = rowsCols.length; i < l; i += 1) {
		var rowCol = rowsCols[i];
		var node = resourceObject.nodes[0];
		var row = node.row + rowCol.row;
		var col = node.col + rowCol.col;
		if (this.game.canBuild("CashBuilding", row, col)) {
			var config = {
				progress: 0,
				team: this.team,
				x: col * this.game.map.nodeWidth,
				y: row * this.game.map.nodeHeight
			};

			var cashBuilding = new MY.CashBuilding();
			cashBuilding.init(this.game.map, config);

			object.buildingObject = cashBuilding;

			break;
		}
	}
};

MY.NonPlayer.prototype.filterResourceObject = function (object, resourceObject) {
	return resourceObject.cash > 0 && MY.Util.isObjectInRange(object, resourceObject);
};

MY.NonPlayer.prototype.getCashBuildings = function () {
	var cashBuildings = [];
	var objects = MY.Objects.objects[this.team.id];
	for (var objectId in objects) {
		var object = objects[objectId];
		if (object instanceof MY.CashBuilding) {
			cashBuildings.push(object);
		}
	}
	return cashBuildings;
};

MY.NonPlayer.prototype.getRowsCols = function () {
	return [
		{
			row: -4,
			col: -2
		}
	]
};