MY.Selector = function () {};

MY.Selector.prototype.init = function (game) {
	this.game = game;

	this.isMouseDown = false;
	this.selectedObjects = [];
};

MY.Selector.prototype.render = function (context, camera) {
	var mouseDownRect = this.getMouseDownRect();

	context.strokeStyle = "rgb(0, 255, 0)";
	context.strokeRect(mouseDownRect.x1 - camera.x, mouseDownRect.y1 - camera.y, mouseDownRect.x2 - mouseDownRect.x1, mouseDownRect.y2 - mouseDownRect.y1);
};

MY.Selector.prototype.getMouseDownRect = function () {
	var mouseDownRect = {};
	if (this.mouseDownRect.x1 > this.mouseDownRect.x2) {
		mouseDownRect.x1 = this.mouseDownRect.x2;
		mouseDownRect.x2 = this.mouseDownRect.x1;
	} else {
		mouseDownRect.x1 = this.mouseDownRect.x1;
		mouseDownRect.x2 = this.mouseDownRect.x2;
	}
	if (this.mouseDownRect.y1 > this.mouseDownRect.y2) {
		mouseDownRect.y1 = this.mouseDownRect.y2;
		mouseDownRect.y2 = this.mouseDownRect.y1;
	} else {
		mouseDownRect.y1 = this.mouseDownRect.y1;
		mouseDownRect.y2 = this.mouseDownRect.y2;
	}
	return mouseDownRect;
};

MY.Selector.prototype.handleMouseDown = function (event) {
	if (event.leftButton) {
		var x = event.clientX + this.game.camera.x;
		var y = event.clientY + this.game.camera.y;

		this.isMouseDown = true;
		this.mouseDownRect = {
			x1: x,
			y1: y,
			x2: x,
			y2: y
		};
	} else {
		this.isMouseDown = false;
	}
};

MY.Selector.prototype.handleMouseMove = function (event) {
	if (this.isMouseDown) {
		this.mouseDownRect.x2 = event.clientX + this.game.camera.x;
		this.mouseDownRect.y2 = event.clientY + this.game.camera.y;
	}
};

MY.Selector.prototype.handleMouseUp = function (event) {
	if (event.leftButton) {
		var id;
		var object;

		if (this.isMouseDown && (this.mouseDownRect.x1 !== this.mouseDownRect.x2 || this.mouseDownRect.y1 !== this.mouseDownRect.y2)) {
			if (event.shiftKey) {
				for (id in MY.Objects.objects[this.game.player.id]) {
					object = MY.Objects.objects[this.game.player.id][id];
					if (object instanceof MY.Unit) {
						if (!object.isSelected && MY.Util.isRectInRect(MY.Util.getObjectRect(object), this.getMouseDownRect())) {
							object.isSelected = true;
							this.selectedObjects.push(object);
						}
					}
				}
			} else {
				this.selectedObjects = [];
				for (id in MY.Objects.objects[this.game.player.id]) {
					object = MY.Objects.objects[this.game.player.id][id];
					if (object instanceof MY.Unit) {
						if (MY.Util.isRectInRect(MY.Util.getObjectRect(object), this.getMouseDownRect())) {
							object.isSelected = true;
							this.selectedObjects.push(object);
						} else {
							object.isSelected = false;
						}
					}
				}
			}
		} else {
			var i;
			var l;

			object = this.game.getObjectByPoint(this.game.getMousePoint(event));

			if (event.shiftKey) {
				if (object !== null && object.team !== undefined && object.team === this.game.player) {
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
				if (object !== null && object.team !== undefined && object.team === this.game.player) {
					object.isSelected = true;
					this.selectedObjects.push(object);
				}
			}
		}
	}
	this.isMouseDown = false;
};