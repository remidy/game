MY.Game = function () {};

MY.Game.prototype.init = function (canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext("2d");
	
	this.scenario = new MY.Scenario();
	this.scenario.init();
	
	this.map = this.scenario.map;
	
	this.menu = new MY.Menu();
	this.menu.init(this, this.canvas.width - 70, 0, 70, this.canvas.height);
	
	this.viewport = new MY.Viewport();
	this.viewport.init(this.map, this.canvas, 0, 0, this.canvas.width - this.menu.width, this.canvas.height);
	
	this.player = this.scenario.teams.Team1;
	
	this.selectedObjects = [];
	
	this.building = null;
	
	this.hasWon = false;
	this.hasLost = false;
	
	this.mouseX = 0;
	this.mouseY = 0;
	this.isMouseDown = false;
	
	MY.Mediator.subscribe("mousedown", this.handleMouseDown, this);
	MY.Mediator.subscribe("mousemove", this.handleMouseMove, this);
	MY.Mediator.subscribe("mouseup", this.handleMouseUp, this);
};

MY.Game.prototype.update = function (deltaTime) {
	this.updateGameOver();
	
	if (!(this.hasWon || this.hasLost)) {
		this.viewport.update(deltaTime);
		
		var teamId,
			objectId,
			object;
		
		for (teamId in MY.ObjectManager.objects) {
			for (objectId in MY.ObjectManager.objects[teamId]) {
				object = MY.ObjectManager.objects[teamId][objectId];
				object.update(deltaTime);
			}
		}
		
		for (teamId in MY.ObjectManager.objects) {
			for (objectId in MY.ObjectManager.objects[teamId]) {
				object = MY.ObjectManager.objects[teamId][objectId];
				if (object.health === 0 || object.x < 0 || object.x > this.map.width || object.y < 0 || object.y > this.map.height) {
					MY.ObjectManager.remove(object);
				}
			}
		}
	}
};

MY.Game.prototype.render = function () {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	this.map.render(this.context, this.viewport);
	
	for (var teamId in MY.ObjectManager.objects) {
		for (var objectId in MY.ObjectManager.objects[teamId]) {
			MY.ObjectManager.objects[teamId][objectId].render(this.context, this.viewport);
		}
	}
	
	if (!(this.hasWon || this.hasLost)) {
		if (this.isMouseDown) {
			var mouseDownBox = this.getMouseDownBox();
			
			this.context.strokeStyle = "rgb(0, 255, 0)";
			this.context.strokeRect(mouseDownBox.x1 - this.viewport.x, mouseDownBox.y1 - this.viewport.y, mouseDownBox.x2 - mouseDownBox.x1, mouseDownBox.y2 - mouseDownBox.y1);
		} else if (this.building !== null) {
			var grid = MY.Config.buildings[this.building].grid,
				row = Math.floor((this.mouseY + this.viewport.y) / this.map.nodeHeight),
				col = Math.floor((this.mouseX + this.viewport.x) / this.map.nodeWidth);
			for (var i = 0, l = grid.length; i < l; i += 1) {
				for (var j = 0, m = grid[i].length; j < m; j += 1) {
					if (grid[i][j] > 0) {
						var node = this.map.getNodeByRowCol(row + i, col + j),
							object = node.object;
						
						this.context.fillStyle = object === null ? "rgba(0, 0, 255, 0.5)" : "rgba(255, 0, 0, 0.5)";
						this.context.fillRect(node.x - this.viewport.x, node.y - this.viewport.y, this.map.nodeWidth, this.map.nodeHeight);
					}
				}
			}
		}
	}
	
	this.menu.render(this.context, this.viewport);
	
	if (this.hasWon || this.hasLost) {
		this.context.fillStyle = "rgba(0, 0, 0, 0.5)";
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.context.fillStyle = "rgb(255, 255, 255)";
		this.context.fillText(this.hasWon ? "Won" : "Lost", 2, 12);
	}
};

MY.Game.prototype.handleMouseDown = function (event) {
	if (event.clientX < this.menu.x) {
		var x = event.clientX + this.viewport.x,
			y = event.clientY + this.viewport.y;
		
		this.isMouseDown = true;
		this.mouseDownBox = {
			x1: x,
			y1: y,
			x2: x,
			y2: y
		};
	}
};

MY.Game.prototype.handleMouseMove = function (event) {
	this.mouseX = event.clientX;
	this.mouseY = event.clientY;
	
	this.viewport.moveToX = event.clientX;
	this.viewport.moveToY = event.clientY;
	
	if (this.isMouseDown) {
		this.mouseDownBox.x2 = event.clientX + this.viewport.x;
		this.mouseDownBox.y2 = event.clientY + this.viewport.y;
	}
};

MY.Game.prototype.handleMouseUp = function (event) {
	var id,
		object;
	
	if (this.isMouseDown && (this.mouseDownBox.x1 !== this.mouseDownBox.x2 || this.mouseDownBox.y1 !== this.mouseDownBox.y2)) {
		if (event.shiftKey) {
			for (id in MY.ObjectManager.objects[this.player.id]) {
				object = MY.ObjectManager.objects[this.player.id][id];
				if (object instanceof MY.Building || object instanceof MY.Unit) {
					if (!object.isSelected && MY.Util.boxCollides(MY.Util.getObjectBox(object), this.getMouseDownBox())) {
						object.isSelected = true;
						this.selectedObjects.push(object);
					}
				}
			}
		} else {
			this.selectedObjects = [];
			for (id in MY.ObjectManager.objects[this.player.id]) {
				object = MY.ObjectManager.objects[this.player.id][id];
				if (object instanceof MY.Building || object instanceof MY.Unit) {
					if (MY.Util.boxCollides(MY.Util.getObjectBox(object), this.getMouseDownBox())) {
						object.isSelected = true;
						this.selectedObjects.push(object);
					} else {
						object.isSelected = false;
					}
				}
			}
		}
	} else {
		if (event.clientX < this.menu.x) {
			var row = Math.floor((event.clientY + this.viewport.y) / this.map.nodeHeight),
				col = Math.floor((event.clientX + this.viewport.x) / this.map.nodeWidth),
				node = this.map.getNodeByRowCol(row, col);

			object = node.object;
			
			if (event.leftButton) {
				this.handleLeftButton(event, object);
			} else if (event.rightButton) {
				this.handleRightButton(event, row, col, node, object);
			}
		} else {
			this.menu.handleMouseUp(event);
		}
	}
	
	this.isMouseDown = false;
};

MY.Game.prototype.handleLeftButton = function (event, object) {
	var i,
		l;
	
	if (event.shiftKey) {
		if (object !== null && object.team !== undefined && object.team === this.player) {
			var isObjectSelected = false;
			for (i = 0, l = this.selectedObjects.length; i < l; i += 1) {
				if (this.selectedObjects[i] === object) {
					isObjectSelected = true;
					this.selectedObjects.splice(i, 1);
					break;
				}
			}
			if (!isObjectSelected) {
				this.selectedObjects.push(object);
			}
			object.isSelected = !isObjectSelected;
		}
	} else {
		if (this.selectedObjects.length > 0) {
			for (i = 0, l = this.selectedObjects.length; i < l; i += 1) {
				this.selectedObjects[i].isSelected = false;
			}
			this.selectedObjects = [];
		}
		if (object !== null && object.team !== undefined && object.team === this.player) {
			object.isSelected = true;
			this.selectedObjects.push(object);
		}
	}
	
	this.building = null;
};

MY.Game.prototype.handleRightButton = function (event, row, col, node, object) {
	var i,
		l,
		selectedObject;
	
	if (this.selectedObjects.length > 0) {
		if (object !== null) {
			if (object.team !== undefined) {
				if (object.team !== this.player) {
					for (i = 0, l = this.selectedObjects.length; i < l; i += 1) {
						selectedObject = this.selectedObjects[i];
						selectedObject.attackObject = object;
					}
				}
			} else if (object instanceof MY.Resource) {
				for (i = 0, l = this.selectedObjects.length; i < l; i += 1) {
					selectedObject = this.selectedObjects[i];
					if (selectedObject instanceof MY.WorkerUnit) {
						selectedObject.resourceObject = object;
					}
				}
			}
		}
		if (object === null || (object !== null && object.team === undefined)) {
			selectedObject = this.selectedObjects[0];
			if (this.selectedObjects.length === 1 && selectedObject instanceof MY.Building) {
				selectedObject.moveToUnitNode = node;
			} else {
				if (this.building === null) {
					for (i = 0, l = this.selectedObjects.length; i < l; i += 1) {
						selectedObject = this.selectedObjects[i];
						if (selectedObject instanceof MY.Unit && !(selectedObject instanceof MY.WorkerUnit && object instanceof MY.Resource)) {
							selectedObject.moveTo(row, col);
						}
					}
				} else {
					this.player.removeCash(MY.Config.buildings[this.building].cost);
					
					var building = new MY[this.building];
					building.init(this.player, this.map.getNodeByRowCol(Math.floor((event.clientY + this.viewport.y) / this.map.nodeHeight), Math.floor((event.clientX + this.viewport.x) / this.map.nodeWidth)), this.map, 0);
					
					selectedObject.buildingObject = building;
					
					this.building = null;
				}
			}
		}
	}
};

MY.Game.prototype.updateGameOver = function () {
	var hasWon = true,
		hasLost = true;
	
	for (var teamId in MY.ObjectManager.objects) {
		for (var objectId in MY.ObjectManager.objects[teamId]) {
			if (teamId === this.player.id) {
				hasLost = false;
			} else {
				hasWon = false;
			}
			if (!hasWon && !hasLost) {
				break;
			}
		}
	}
	
	this.hasWon = hasWon;
	this.hasLost = hasLost;
};

MY.Game.prototype.getMouseDownBox = function () {
	var mouseDownBox = {};
	if (this.mouseDownBox.x1 > this.mouseDownBox.x2) {
		mouseDownBox.x1 = this.mouseDownBox.x2;
		mouseDownBox.x2 = this.mouseDownBox.x1;
	} else {
		mouseDownBox.x1 = this.mouseDownBox.x1;
		mouseDownBox.x2 = this.mouseDownBox.x2;
	}
	if (this.mouseDownBox.y1 > this.mouseDownBox.y2) {
		mouseDownBox.y1 = this.mouseDownBox.y2;
		mouseDownBox.y2 = this.mouseDownBox.y1;
	} else {
		mouseDownBox.y1 = this.mouseDownBox.y1;
		mouseDownBox.y2 = this.mouseDownBox.y2;
	}
	return mouseDownBox;
};