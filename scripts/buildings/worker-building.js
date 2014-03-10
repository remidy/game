MY.WorkerBuilding = function () {
	MY.Building.call(this);
};

MY.WorkerBuilding.prototype = Object.create(MY.Building.prototype);

MY.WorkerBuilding.prototype.init = function (team, node, map, progress) {
	MY.Building.prototype.init.call(this, "WorkerBuilding", team, node, map, progress);
	
	this.units = ["WorkerUnit"];
};