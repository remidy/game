MY.Team = function () {};

MY.Team.prototype.init = function (id, cash, color, selectedColor) {
	this.id = id;
	this.cash = cash;
	this.color = color;
	this.selectedColor = selectedColor;
};

MY.Team.prototype.addCash = function (cash) {
	this.cash += cash;
};

MY.Team.prototype.removeCash = function (cash) {
	this.cash -= cash;
};