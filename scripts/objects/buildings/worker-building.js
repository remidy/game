MY.WorkerBuilding = function () {};

MY.WorkerBuilding.prototype = Object.create(MY.Building.prototype);

MY.WorkerBuilding.prototype.init = function (map, config, levelObjectId) {
	config.type = "WorkerBuilding";
	MY.Building.prototype.init.call(this, map, config, levelObjectId);
	
	this.units = ["WorkerUnit"];
};