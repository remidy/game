MY.require("scripts/application.js");

window.addEventListener("load", function () {
	var application = new MY.Application();
	application.init(document.getElementById("canvas"));
});