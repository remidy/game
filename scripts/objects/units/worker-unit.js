MY.WorkerUnit = function () {
	MY.Unit.call(this);
};

MY.WorkerUnit.prototype = Object.create(MY.Unit.prototype);

MY.WorkerUnit.prototype.init = function (map, config, levelObjectId) {
	config.type = "WorkerUnit";
	MY.Unit.prototype.init.call(this, map, config, levelObjectId);

	this.range = 320;

	this.lastBuildTime = Date.now();
	
	this.buildingObject = null;
	this.buildingNode = null;
	
	this.cash = 0;
	this.isCashing = false;
	this.lastCashTime = Date.now();
	
	this.resourceObject = null;
	this.resourceNode = null;
	
	this.cashBuildingObject = null;
	this.cashBuildingNode = null;
	
	this.buildings = ["CashBuilding", "SoldierBuilding"];
};

MY.WorkerUnit.prototype.update = function (deltaTime) {
	this.isBusy = false;

	if (this.buildingObject !== null) {
		if (!this.isMoving) {
			this.doBuild();

			this.isBusy = true;
		}
	} else if (this.resourceObject !== null) {
		if (!this.isMoving) {
			this.doCash();

			this.isBusy = true;
		}
	}
	
	MY.Unit.prototype.update.call(this, deltaTime);
};

MY.WorkerUnit.prototype.doBuild = function () {
	if (this.buildingNode !== null && this.x === this.buildingNode.x && this.y === this.buildingNode.y) {
		var now = Date.now();
		if (now - this.lastBuildTime > 100) {
			var progress = 1;
			if (this.buildingObject.progress + progress < 100) {
				this.buildingObject.progress += progress;
			} else {
				this.buildingObject.progress = 100;
				this.buildingObject = null;
				this.buildingNode = null;
			}
			this.lastBuildTime = now;
		}
	} else if (!this.isMoving) {
		this.buildingNode = MY.Util.getNode(this, this.buildingObject);
		this.moveTo(this.buildingNode.row, this.buildingNode.col);
	}
};

MY.WorkerUnit.prototype.doCash = function () {
	if (this.cash === 100 || this.resourceObject.cash === 0) {
		if (this.cashBuildingNode !== null && this.x === this.cashBuildingNode.x && this.y === this.cashBuildingNode.y) {
			this.cashBuildingObject.addCash(this.cash);
			this.cash = 0;
			this.moveTo(this.resourceNode.row, this.resourceNode.col);
			if (this.resourceObject !== null && this.resourceObject.cash === 0) {
				this.resourceObject = null;
				this.resourceNode = null;
			}
		} else {
			this.isCashing = false;
			var cashBuildings = this.getCashBuildings();
			if (cashBuildings.length > 0) {
				this.cashBuildingObject = cashBuildings[0];
				this.cashBuildingNode = this.cashBuildingObject.moveToUnitNode;
				this.moveTo(this.cashBuildingNode.row, this.cashBuildingNode.col);
			}
		}
	} else {
		if (this.resourceNode !== null && this.x === this.resourceNode.x && this.y === this.resourceNode.y) {
			this.isCashing = true;
		}
		if (this.isCashing) {
			var now = Date.now();
			if (now - this.lastCashTime > 100) {
				var cash = 10;
				if (this.resourceObject.cash < cash) {
					cash = this.resourceObject.cash;
				}
				this.cash += cash;
				this.resourceObject.removeCash(cash);
				this.lastCashTime = now;
			}
		} else if (this.resourceNode === null) {
			this.resourceNode = MY.Util.getNode(this, this.resourceObject);
			this.moveTo(this.resourceNode.row, this.resourceNode.col);
		}
	}
};

MY.WorkerUnit.prototype.getCashBuildings = function () {
	var cashBuildings = [];
	for (var id in MY.Objects.objects[this.team.id]) {
		var object = MY.Objects.objects[this.team.id][id];
		if (object instanceof MY.CashBuilding && object.progress === 100) {
			cashBuildings.push(object);
		}
	}
	return cashBuildings;
};