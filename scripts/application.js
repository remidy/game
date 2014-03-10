MY.require("scripts/building.js");
MY.require("scripts/bullet.js");
MY.require("scripts/command.js");
MY.require("scripts/config.js");
MY.require("scripts/game.js");
MY.require("scripts/input.js");
MY.require("scripts/map.js");
MY.require("scripts/mediator.js");
MY.require("scripts/menu.js");
MY.require("scripts/node.js");
MY.require("scripts/object-manager.js");
MY.require("scripts/pathfinding.js");
MY.require("scripts/resource.js");
MY.require("scripts/scenario.js");
MY.require("scripts/team.js");
MY.require("scripts/terrain.js");
MY.require("scripts/unit.js");
MY.require("scripts/util.js");
MY.require("scripts/viewport.js");

MY.Application = function () {};

MY.Application.prototype.init = function (canvas) {
	this.canvas = canvas;
	
	this.canvas.oncontextmenu = function (event) {
		event.preventDefault();
	};
	
	this.input = new MY.Input();
	this.input.init(this.canvas);
	
	this.game = new MY.Game();
	this.game.init(this.canvas);
	
	this.lastTime = Date.now();
	this.main();
};

MY.Application.prototype.main = function () {
	var now = Date.now(),
		deltaTime = (now - this.lastTime) / 1000,
		that = this;
	
	this.game.update(deltaTime);
	this.game.render();
	
	this.lastTime = now;
	window.requestAnimationFrame(function () {
		that.main.apply(that);
	});
};