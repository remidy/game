MY.Commands = function () {};

MY.Commands.prototype.init = function (game, x, y, width, height) {
	this.game = game;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.commands = [];
	this.commandWidth = 32;
	this.commandHeight = 32;
	this.numberOfCommandsPerRow = 2;
};

MY.Commands.prototype.update = function () {
	this.commands = this.getCommands();
};

MY.Commands.prototype.render = function (context) {
	context.fillStyle = "rgb(0, 0, 0)";
	context.fillRect(this.x, this.y, this.width, this.height);
	
	context.fillStyle = "rgb(255, 255, 255)";
	context.fillText(this.game.player.cash, this.x + 2, this.y + 12);

	var selectedObjects = this.game.selector.selectedObjects;
	if (selectedObjects.length === 1) {
		if (this.commands.length > 0) {
			var row;
			var i;
			var l;
			var x;
			var y;
			var command;
			var selectedObject = selectedObjects[0];
			
			row = 0;
			for (i = 0, l = this.commands.length; i < l; i += 1) {
				x = this.x + 2 + (i % 2 * 34);
				y = this.y + 34 + (row * 34);
				command = this.commands[i];
				
				context.fillStyle = command.color;
				context.fillRect(x, y, this.commandWidth, this.commandHeight);
				
				if (selectedObject instanceof MY.Building) {
					var numberOfUnits = 0;
					for (var j = 0, m = selectedObject.unitQueue.length; j < m; j += 1) {
						if (selectedObject.unitQueue[j].type === command.id) {
							numberOfUnits += 1;
						}
					}
					if (numberOfUnits > 0) {
						context.fillStyle = "rgb(255, 255, 255)";
						context.fillText(numberOfUnits, x + 2, y + 28);
					}
				}
				
				if (!command.canBuy) {
					context.fillStyle = "rgba(0, 0, 0, 0.5)";
					context.fillRect(x, y, this.commandWidth, this.commandHeight);
				}
				
				if (i % this.numberOfCommandsPerRow === 1) {
					row += 1;
				}
			}
			
			if (this.game.mouseX >= this.x) {
				row = 0;
				for (i = 0, l = this.commands.length; i < l; i += 1) {
					if (this.isCommand({clientX: this.game.mouseX, clientY: this.game.mouseY}, i, row)) {
						x = this.x + 4 + (i % 2 * 34);
						y = this.y + 46 + (row * 34);
						command = this.commands[i];
						
						var width = Math.ceil(context.measureText(command.name).width);
						var height = 10;
						
						context.fillStyle = "rgba(0, 0, 0, 0.5)";
						context.fillRect(this.x - width - 4, this.y + 32, width + 4, height + 4);
						
						context.fillStyle = "rgb(255, 255, 255)";
						context.fillText(command.name, this.x - width - 2, this.y + 44);
						
						break;
					}
					
					if (i % this.numberOfCommandsPerRow === 1) {
						row += 1;
					}
				}
			}
		}
	}
};

MY.Commands.prototype.handleMouseUp = function (event) {
	if (this.game.selector.selectedObjects.length === 1) {
		var i;
		var j;
		var l;
		var selectedObject = this.game.selector.selectedObjects[0];
		
		if (selectedObject instanceof MY.Building && selectedObject.progress === 100) {
			j = 0;
			for (i = 0, l = selectedObject.units.length; i < l; i += 1) {
				if (this.isCommand(event, i, j)) {
					var unit = selectedObject.units[i];
					if (event.leftButton) {
						var cost = MY.Config.objectTypes[unit].cost;
						if (this.game.player.cash >= cost) {
							this.game.player.removeCash(cost);
							selectedObject.addUnit(unit, cost);
							break;
						}
					} else if (event.rightButton) {
						selectedObject.removeUnit(unit);
					}
				}
				if (i % this.numberOfCommandsPerRow === 1) {
					j += 1;
				}
			}
		} else if (selectedObject instanceof MY.Unit) {
			if (selectedObject instanceof MY.WorkerUnit) {
				j = 0;
				for (i = 0, l = this.commands.length; i < l; i += 1) {
					if (this.isCommand(event, i, j)) {
						var building = this.commands[i].id;
						if (this.commands[i].canBuy) {
							this.game.building = building;
							break;
						}
					}
					if (i % this.numberOfCommandsPerRow === 1) {
						j += 1;
					}
				}
			}
		}
	}
};

MY.Commands.prototype.getCommands = function () {
	if (this.game.selector.selectedObjects.length === 1) {
		var selectedObject = this.game.selector.selectedObjects[0];
		if (selectedObject instanceof MY.Building) {
			return this.getBuildingCommands(selectedObject);
		} else if (selectedObject instanceof MY.Unit) {
			return this.getUnitCommands(selectedObject);
		}
	}
	return [];
};

MY.Commands.prototype.getBuildingCommands = function (selectedObject) {
	var commands = [];
	for (var i = 0, l = selectedObject.units.length; i < l; i += 1) {
		var unit = MY.Config.objectTypes[selectedObject.units[i]];
		commands[i] = {
			id: unit.id,
			name: unit.name,
			cost: unit.cost,
			color: unit.color,
			canBuy: selectedObject.progress === 100 && this.game.player.cash >= unit.cost
		};
	}
	return commands;
};

MY.Commands.prototype.getUnitCommands = function (selectedObject) {
	var commands = [];
	if (selectedObject instanceof MY.WorkerUnit) {
		for (var i = 0, l = selectedObject.buildings.length; i < l; i += 1) {
			var building = MY.Config.objectTypes[selectedObject.buildings[i]];
			commands[i] = {
				id: building.id,
				name: building.name,
				cost: building.cost,
				color: building.color,
				canBuy: this.game.player.cash >= building.cost && this.canBuy(building.id)
			};
		}
	}
	return commands;
};

MY.Commands.prototype.isCommand = function (event, i, j) {
	var point = {};
	point.x = event.clientX;
	point.y = event.clientY;
	
	var rect = {};
	rect.x1 = this.x + 2 + (i % 2 * 34);
	rect.y1 = this.y + 34 + (j * 34);
	rect.x2 = rect.x1 + this.commandWidth;
	rect.y2 = rect.y1 + this.commandHeight;
	
	return MY.Util.isPointInRect(point, rect);
};

MY.Commands.prototype.canBuy = function (building) {
	for (var i = 0, l = MY.Config.objectTypes[building].require.length; i < l; i += 1) {
		var canBuy = false;
		for (var objectId in MY.Objects.objects[this.game.player.id]) {
			if (MY.Objects.objects[this.game.player.id][objectId].id === MY.Config.objectTypes[building].require[i] && MY.Objects.objects[this.game.player.id][objectId].progress === 100) {
				canBuy = true;
				break;
			}
		}
		if (!canBuy) {
			return false;
		}
	}
	return true;
};