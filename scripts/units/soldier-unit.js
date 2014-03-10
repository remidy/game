MY.SoldierUnit = function () {
	MY.Unit.call(this);
};

MY.SoldierUnit.prototype = Object.create(MY.Unit.prototype);

MY.SoldierUnit.prototype.init = function (team, node, map) {
	MY.Unit.prototype.init.call(this, team, node, map);
	
	this.attackSpeed = 500;
	this.attackRange = 96;
};