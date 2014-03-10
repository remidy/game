MY.Menu = function () {};

MY.Menu.prototype.init = function (game, x, y, width, height) {
	this.game = game;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.commandWidth = 32;
	this.commandHeight = 32;
	this.numberOfCommandsPerRow = 2;
};

MY.Menu.prototype.render = function (context) {
	context.fillStyle = "rgb(0, 0, 0)";
	context.fillRect(this.x, this.y, this.width, this.height);
	
	context.fillStyle = "rgb(255, 255, 255)";
	context.fillText(this.game.player.cash, this.x + 2, this.y + 12);
	
	if (this.game.selectedObjects.length === 1) {
		var commands = this.getCommands();
		if (commands.length > 0) {
			var row,
				i,
				l,
				x,
				y,
				command,
				selectedObject = this.game.selectedObjects[0];
			
			row = 0;
			for (i = 0, l = commands.length; i < l; i += 1) {
				x = this.x + 2 + (i % 2 * 34);
				y = this.y + 34 + (row * 34);
				command = commands[i];
				
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
				
				if (!command.buy) {
					context.fillStyle = "rgba(0, 0, 0, 0.5)";
					context.fillRect(x, y, this.commandWidth, this.commandHeight);
				}
				
				if (i % this.numberOfCommandsPerRow === 1) {
					row += 1;
				}
			}
			
			if (this.game.mouseX >= this.x) {
				row = 0;
				for (i = 0, l = commands.length; i < l; i += 1) {
					if (this.isCommand({clientX: this.game.mouseX, clientY: this.game.mouseY}, i, row)) {
						x = this.x + 4 + (i % 2 * 34);
						y = this.y + 46 + (row * 34);
						command = commands[i];
						
						var width = Math.ceil(context.measureText(command.name).width),
							height = 10;
						
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

MY.Menu.prototype.handleMouseUp = function (event) {
	if (this.game.selectedObjects.length === 1) {
		var i,
			j,
			l,
			selectedObject = this.game.selectedObjects[0];
		
		if (selectedObject instanceof MY.Building && selectedObject.progress === 100) {
			j = 0;
			for (i = 0, l = selectedObject.units.length; i < l; i += 1) {
				if (this.isCommand(event, i, j)) {
					var unit = selectedObject.units[i];
					if (event.leftButton) {
						var cost = MY.Config.units[unit].cost;
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
				for (i = 0, l = selectedObject.buildings.length; i < l; i += 1) {
					if (this.isCommand(event, i, j)) {
						var building = selectedObject.buildings[i];
						if (this.game.player.cash >= MY.Config.buildings[building].cost) {
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

MY.Menu.prototype.getCommands = function () {
	if (this.game.selectedObjects.length === 1) {
		var selectedObject = this.game.selectedObjects[0];
		if (selectedObject instanceof MY.Building) {
			return this.getBuildingCommands(selectedObject);
		} else if (selectedObject instanceof MY.Unit) {
			return this.getUnitCommands(selectedObject);
		}
	}
	return [];
};

MY.Menu.prototype.getBuildingCommands = function (selectedObject) {
	var commands = [];
	for (var i = 0, l = selectedObject.units.length; i < l; i += 1) {
		var unit = MY.Config.units[selectedObject.units[i]];
		commands[i] = {
			id: unit.id,
			name: unit.name,
			cost: unit.cost,
			color: unit.color,
			buy: this.game.player.cash >= unit.cost
		};
	}
	return commands;
};

MY.Menu.prototype.getUnitCommands = function (selectedObject) {
	var commands = [];
	if (selectedObject instanceof MY.WorkerUnit) {
		for (var i = 0, l = selectedObject.buildings.length; i < l; i += 1) {
			var building = MY.Config.buildings[selectedObject.buildings[i]];
			commands[i] = {
				name: building.name,
				cost: building.cost,
				color: building.color,
				buy: this.game.player.cash >= building.cost
			};
		}
	}
	return commands;
};

MY.Menu.prototype.isCommand = function (event, i, j) {
	var point = {};
	point.x = event.clientX;
	point.y = event.clientY;
	
	var box = {};
	box.x1 = this.x + 2 + (i % 2 * 34);
	box.y1 = this.y + 34 + (j * 34);
	box.x2 = box.x1 + this.commandWidth;
	box.y2 = box.y1 + this.commandHeight;
	
	return MY.Util.isPointInBox(point, box);
};

MY.Menu.prototype.isInstanceof = function (type) {
	for (var i = 0, l = this.game.selectedObjects.length; i < l; i += 1) {
		if (!this.game.selectedObjects[i] instanceof type) {
			return false;
		}
	}
	return true;
};