MY.Mediator = {
	topics: {},
	
	subscribe: function (topic, callback, context) {
		if (!this.topics[topic]) {
			this.topics[topic] = [];
		}
		this.topics[topic].push({
			callback: callback,
			context: context
		});
		return this;
	},
	
	publish: function (topic) {
		if (!this.topics[topic]) {
			return false;
		}
		var args = Array.prototype.slice.call(arguments, 1);
		for (var i = 0, l = this.topics[topic].length; i < l; i += 1) {
			var subscription = this.topics[topic][i];
			subscription.callback.apply(subscription.context, args);
		}
		return this;
	}
};