MY.Application = function () {};

MY.Application.prototype.init = function (canvas) {
	this.canvas = canvas;

	this.resize();

	this.input = new MY.Input();
	this.input.init(this.canvas);
	
	this.initState(MY.ApplicationStates.MAIN_MENU);

	this.now = 0;
	this.deltaTime = 0;

	MY.PubSub.subscribe("state", this.handleState, this);

	this.canvas.addEventListener("contextmenu", this.handleContextMenuEvent.bind(this));

	window.addEventListener("resize", this.handleResizeEvent.bind(this));

	window.requestAnimationFrame(this.loop.bind(this));
};

MY.Application.prototype.initState = function (state) {
	this.state = new state();
	this.state.init(this.canvas);
};

MY.Application.prototype.cleanupState = function () {
	this.state.cleanup();
};

MY.Application.prototype.handleState = function (stateId) {
	this.cleanupState();
	this.initState(stateId);
};

MY.Application.prototype.handleContextMenuEvent = function (event) {
	event.preventDefault();
};

MY.Application.prototype.handleResizeEvent = function () {
	this.resize();
};

MY.Application.prototype.loop = function (time) {
	var slowStep = 1000 / 60;
	var prevTime = this.now;
	var elapsed = time - prevTime;

	this.now = time;
	this.deltaTime += Math.max(Math.min(slowStep * 3, elapsed), 0);

	while (this.deltaTime >= slowStep) {
		this.deltaTime -= slowStep;

		this.state.update(1 / 60);
	}

	this.state.render(this.deltaTime / slowStep);

	window.requestAnimationFrame(this.loop.bind(this));
};

MY.Application.prototype.resize = function (width, height) {
	var width = window.innerWidth;
	var height = window.innerHeight;
	this.canvas.width = width;
	this.canvas.height = height;
	MY.PubSub.publish("resize", width, height);
};