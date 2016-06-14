MY.Input = function () {};

MY.Input.prototype.init = function (canvas) {
	canvas.addEventListener("mousedown", this.handleMouseDownEvent.bind(this));
	canvas.addEventListener("mousemove", this.handleMouseMoveEvent.bind(this));
	canvas.addEventListener("mouseup", this.handleMouseUpEvent.bind(this));
};

MY.Input.prototype.handleMouseDownEvent = function (event) {
	MY.PubSub.publish("mousedown", this.getEvent(event));
};

MY.Input.prototype.handleMouseMoveEvent = function (event) {
	MY.PubSub.publish("mousemove", this.getEvent(event));
};

MY.Input.prototype.handleMouseUpEvent = function (event) {
	MY.PubSub.publish("mouseup", this.getEvent(event));
};

MY.Input.prototype.getEvent = function (event) {
	return {
		clientX: event.clientX,
		clientY: event.clientY,
		leftButton: event.button === 0,
		rightButton: event.button === 2,
		shiftKey: event.shiftKey
	};
};