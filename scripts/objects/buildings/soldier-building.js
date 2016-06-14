MY.SoldierBuilding = function () {};

MY.SoldierBuilding.prototype = Object.create(MY.Building.prototype);

MY.SoldierBuilding.prototype.init = function (map, config, levelObjectId) {
	config.type = "SoldierBuilding";
	MY.Building.prototype.init.call(this, map, config, levelObjectId);
	
	this.units = ["SoldierUnit"];
};