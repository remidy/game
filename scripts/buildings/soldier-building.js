MY.SoldierBuilding = function () {
	MY.Building.call(this);
};

MY.SoldierBuilding.prototype = Object.create(MY.Building.prototype);

MY.SoldierBuilding.prototype.init = function (team, node, map, progress) {
	MY.Building.prototype.init.call(this, "SoldierBuilding", team, node, map, progress);
	
	this.units = ["SoldierUnit"];
};