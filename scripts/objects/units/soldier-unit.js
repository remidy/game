MY.SoldierUnit = function () {
	MY.Unit.call(this);
};

MY.SoldierUnit.prototype = Object.create(MY.Unit.prototype);

MY.SoldierUnit.prototype.init = function (map, config, levelObjectId) {
	config.type = "SoldierUnit";
	MY.Unit.prototype.init.call(this, map, config, levelObjectId);
	
	this.attackSpeed = 500;
	this.attackRange = 96;
};