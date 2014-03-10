MY.Input = function () {};

MY.Input.prototype.init = function (canvas) {
	var that = this;
	
	canvas.addEventListener("mousedown", function (event) {
		MY.Mediator.publish("mousedown", that.getEvent(event));
	});
	
	canvas.addEventListener("mousemove", function (event) {
		MY.Mediator.publish("mousemove", that.getEvent(event));
	});
	
	canvas.addEventListener("mouseup", function (event) {
		MY.Mediator.publish("mouseup", that.getEvent(event));
	});
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