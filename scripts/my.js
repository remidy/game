var MY = {
	require: function (src, eventListener) {
		var element = document.createElement("script");
		if (eventListener !== undefined) {
			element.addEventListener("load", eventListener);
		}
		element.src = src;
		
		document.head.appendChild(element);
	}
};