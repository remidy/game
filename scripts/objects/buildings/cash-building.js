MY.CashBuilding = function () {};

MY.CashBuilding.prototype = Object.create(MY.Building.prototype);

MY.CashBuilding.prototype.init = function(map, config, levelObjectId) {
	config.type = "CashBuilding";
	MY.Building.prototype.init.call(this, map, config, levelObjectId);
};

MY.CashBuilding.prototype.addCash = function (cash) {
	this.team.addCash(cash);
};