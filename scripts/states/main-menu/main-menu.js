MY.MainMenu = function () {};

MY.MainMenu.prototype.init = function (canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext("2d");

	var gameMainMenuItem = new MY.MainMenuItem();
	gameMainMenuItem.init(MY.ApplicationStates.GAME, "Game", 32, 32);

	this.mainMenuItems = [gameMainMenuItem];

	MY.PubSub.subscribe("mouseup", this.handleMouseUp, this);
};

MY.MainMenu.prototype.cleanup = function () {
	MY.PubSub.unsubscribe("mouseup", this.handleMouseUp, this);
};

MY.MainMenu.prototype.update = function (deltaTime) {

};

MY.MainMenu.prototype.render = function () {
	for (var i = 0, l = this.mainMenuItems.length; i < l; i += 1) {
		this.mainMenuItems[i].render(this.context);
	}
};

MY.MainMenu.prototype.handleMouseUp = function (event) {
	for (var i = 0, l = this.mainMenuItems.length; i < l; i += 1) {
		if (MY.Util.isPointInRect({x: event.clientX, y: event.clientY}, MY.Util.getObjectRect(this.mainMenuItems[i]))) {
			MY.PubSub.publish("state", this.mainMenuItems[i].stateId);
			break;
		}
	}
};