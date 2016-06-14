MY.Game = function () {};

MY.Game.prototype.init = function (canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext("2d");
	
	this.scenario = new MY.Scenario();
	this.scenario.init(this);
	
	this.map = this.scenario.map;
	
	this.commands = new MY.Commands();
	this.commands.init(this, this.canvas.width - 70, 0, 70, this.canvas.height);
	
	this.camera = new MY.Camera();
	this.camera.init(this.map, this.canvas, 0, 0, this.canvas.width - this.commands.width, this.canvas.height);

	this.selector = new MY.Selector();
	this.selector.init(this);
	
	this.player = this.scenario.teams.Team1;

	this.nonPlayer = new MY.NonPlayer();
	this.nonPlayer.init(this, this.scenario.teams.Team2);

	this.building = null;
	
	this.hasWon = false;
	this.hasLost = false;
	
	this.mouseX = 0;
	this.mouseY = 0;

	MY.PubSub.subscribe("resize", this.handleResize, this);
	MY.PubSub.subscribe("mousedown", this.handleMouseDown, this);
	MY.PubSub.subscribe("mousemove", this.handleMouseMove, this);
	MY.PubSub.subscribe("mouseup", this.handleMouseUp, this);
};

MY.Game.prototype.cleanup = function () {
	MY.PubSub.unsubscribe("resize", this.handleResize, this);
	MY.PubSub.unsubscribe("mousedown", this.handleMouseDown, this);
	MY.PubSub.unsubscribe("mousemove", this.handleMouseMove, this);
	MY.PubSub.unsubscribe("mouseup", this.handleMouseUp, this);
};

MY.Game.prototype.update = function (deltaTime) {
	this.updateGameOver();
	
	if (!(this.hasWon || this.hasLost)) {
		this.camera.update(deltaTime);

		this.nonPlayer.update();
		
		this.updateObjects(deltaTime);

		this.updateObjectsInCamera();

		this.commands.update();
	}
};

MY.Game.prototype.updateObjects = function (deltaTime) {
	var teamId;
	var objectId;
	var object;

	for (teamId in MY.Objects.objects) {
		if (teamId !== "undefined") {
			for (objectId in MY.Objects.objects[teamId]) {
				object = MY.Objects.objects[teamId][objectId];
				object.update(deltaTime);
			}
		}
	}

	for (teamId in MY.Objects.objects) {
		if (teamId !== "undefined") {
			for (objectId in MY.Objects.objects[teamId]) {
				object = MY.Objects.objects[teamId][objectId];
				if (object.health === 0 || object.x < 0 || object.x > this.map.width || object.y < 0 || object.y > this.map.height) {
					MY.Objects.remove(object);
				}
			}
		}
	}
};

MY.Game.prototype.render = function () {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	this.map.render(this.context, this.camera);
	
	this.renderObjects();
	
	if (!(this.hasWon || this.hasLost)) {
		if (this.selector.isMouseDown) {
			this.selector.render(this.context, this.camera);
		} else if (this.building !== null) {
			this.renderBuildingGrid();
		}
	}
	
	this.commands.render(this.context, this.camera);
	
	if (this.hasWon || this.hasLost) {
		this.renderGameOver();
	}
};

MY.Game.prototype.renderObjects = function () {
	for (var teamId in this.objectsInCamera) {
		if (teamId !== "undefined") {
			var objects = this.objectsInCamera[teamId];
			for (var objectId in objects) {
				objects[objectId].render(this.context, this.camera);
			}
		}
	}
};

MY.Game.prototype.renderGameOver = function () {
	this.context.fillStyle = "rgba(0, 0, 0, 0.5)";
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

	this.context.fillStyle = "rgb(255, 255, 255)";
	this.context.fillText(this.hasWon ? "Won" : "Lost", 2, 12);
};

MY.Game.prototype.renderBuildingGrid = function () {
	var grid = MY.Config.objectTypes[this.building].grid;
	var row = Math.floor((this.mouseY + this.camera.y) / this.map.nodeHeight);
	var col = Math.floor((this.mouseX + this.camera.x) / this.map.nodeWidth);
	for (var i = 0, l = grid.length; i < l; i += 1) {
		for (var j = 0, m = grid[i].length; j < m; j += 1) {
			if (grid[i][j] > 0) {
				var node = this.map.getNodeByRowCol(row + i, col + j);
				var object = node.object;

				this.context.fillStyle = object === null ? "rgba(0, 0, 255, 0.5)" : "rgba(255, 0, 0, 0.5)";
				this.context.fillRect(node.x - this.camera.x, node.y - this.camera.y, this.map.nodeWidth, this.map.nodeHeight);
			}
		}
	}
};

MY.Game.prototype.handleResize = function (width, height) {
	this.commands.x = width - this.commands.width;
	this.commands.height = height;

	this.camera.width = width - this.commands.width;
	this.camera.height = height;
};

MY.Game.prototype.handleMouseDown = function (event) {
	if (event.clientX < this.commands.x) {
		this.selector.handleMouseDown(event);
	}
};

MY.Game.prototype.handleMouseMove = function (event) {
	this.mouseX = event.clientX;
	this.mouseY = event.clientY;
	
	this.camera.moveToX = event.clientX;
	this.camera.moveToY = event.clientY;

	this.selector.handleMouseMove(event);
};

MY.Game.prototype.handleMouseUp = function (event) {
	if (event.clientX < this.commands.x) {
		if (event.leftButton) {
			this.handleLeftButton(event);
		} else if (event.rightButton) {
			this.handleRightButton(event);
		}
		this.selector.handleMouseUp(event);
	} else {
		this.commands.handleMouseUp(event);
	}
};

MY.Game.prototype.handleLeftButton = function (event) {
	this.building = null;
};

MY.Game.prototype.handleRightButton = function (event) {
	var selectedObject;
	var row;
	var col;
	
	if (this.selector.selectedObjects.length > 0) {
		var mousePoint = this.getMousePoint(event);

		if (this.building === null) {
			var object = this.getObjectByPoint(mousePoint);
			var i;
			var l;

			if (object !== null) {
				if (object.team !== undefined) {
					if (object.team !== this.player) {
						for (i = 0, l = this.selector.selectedObjects.length; i < l; i += 1) {
							selectedObject = this.selector.selectedObjects[i];
							selectedObject.attackObject = object;
						}
					} else if (object instanceof MY.Building && object.progress < 100) {
						for (i = 0, l = this.selector.selectedObjects.length; i < l; i += 1) {
							selectedObject = this.selector.selectedObjects[i];
							if (selectedObject instanceof MY.WorkerUnit) {
								selectedObject.buildingObject = object;
							}
						}
					}
				} else if (object instanceof MY.Resource) {
					for (i = 0, l = this.selector.selectedObjects.length; i < l; i += 1) {
						selectedObject = this.selector.selectedObjects[i];
						if (selectedObject instanceof MY.WorkerUnit) {
							selectedObject.resourceObject = object;
						}
					}
				}
			}
			if (object === null || (object !== null && object.team === undefined)) {
				selectedObject = this.selector.selectedObjects[0];
				if (this.selector.selectedObjects.length === 1 && selectedObject instanceof MY.Building) {
					selectedObject.moveToUnitNode = this.getNodeByXY(mousePoint.x, mousePoint.y);
				} else {
					row = Math.floor(mousePoint.y / this.map.nodeHeight);
					col = Math.floor(mousePoint.x / this.map.nodeWidth);

					for (i = 0, l = this.selector.selectedObjects.length; i < l; i += 1) {
						selectedObject = this.selector.selectedObjects[i];
						if (selectedObject instanceof MY.Unit && !(selectedObject instanceof MY.WorkerUnit && object instanceof MY.Resource)) {
							selectedObject.moveTo(row, col);
						}
					}
				}
			}
		} else {
			row = Math.floor(mousePoint.y / this.map.nodeHeight);
			col = Math.floor(mousePoint.x / this.map.nodeWidth);

			if (this.canBuild(this.building, row, col)) {
				this.player.removeCash(MY.Config.objectTypes[this.building].cost);

				var config = {
					progress: 0,
					team: this.player,
					x: col * this.map.nodeWidth,
					y: row * this.map.nodeHeight
				};

				var building = new MY[this.building]();
				building.init(this.map, config);

				this.selector.selectedObjects[0].buildingObject = building;

				this.building = null;
			}
		}
	}
};

MY.Game.prototype.canBuild = function (buildingId, row, col) {
	var canBuild = true;
	var grid = MY.Config.objectTypes[buildingId].grid;

	for (var i = 0, l = grid.length; i < l; i += 1) {
		for (var j = 0, m = grid[i].length; j < m; j += 1) {
			if (grid[i][j] > 0) {
				var node = this.map.getNodeByRowCol(row + i, col + j);
				var object = node.object;

				if (object !== null) {
					canBuild = false;
					break;
				}
			}
		}
	}

	return canBuild;
};

MY.Game.prototype.updateGameOver = function () {
	var hasWon = true;
	var hasLost = true;
	
	for (var teamId in MY.Objects.objects) {
		if (teamId !== "undefined") {
			for (var objectId in MY.Objects.objects[teamId]) {
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
	}
	
	this.hasWon = hasWon;
	this.hasLost = hasLost;
};

MY.Game.prototype.getMousePoint = function (event) {
	return {
		x: event.clientX + this.camera.x,
		y: event.clientY + this.camera.y
	};
};

MY.Game.prototype.getObjectByPoint = function (point) {
	for (var teamId in this.objectsInCamera) {
		var team = MY.Objects.objects[teamId];
		for (var objectId in team) {
			var object = team[objectId];
			if (MY.Util.isPointInRect(point, MY.Util.getObjectRect(object))) {
				return object;
			}
		}
	}
	return null;
};

MY.Game.prototype.updateObjectsInCamera = function () {
	var cameraRect = {
		x1: this.camera.x,
		x2: this.camera.x + this.camera.width,
		y1: this.camera.y,
		y2: this.camera.y + this.camera.height
	};

	this.objectsInCamera = {};

	for (var teamId in MY.Objects.objects) {
		var team = MY.Objects.objects[teamId];
		for (var objectId in team) {
			var object = team[objectId];
			if (MY.Util.isRectInRect(MY.Util.getObjectRect(object), cameraRect)) {
				if (this.objectsInCamera[teamId] === undefined) {
					this.objectsInCamera[teamId] = {};
				}
				this.objectsInCamera[teamId][object.objectId] = object;
			}
		}
	}
};