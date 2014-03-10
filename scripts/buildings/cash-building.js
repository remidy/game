MY.CashBuilding = function () {
	MY.Building.call(this);
};

MY.CashBuilding.prototype = Object.create(MY.Building.prototype);

MY.CashBuilding.prototype.init = function(team, node, map, progress) {
	MY.Building.prototype.init.call(this, "CashBuilding", team, node, map, progress);
};

MY.CashBuilding.prototype.addCash = function (cash) {
	this.team.addCash(cash);
};