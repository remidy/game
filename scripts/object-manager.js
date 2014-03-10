MY.ObjectManager = {
	objects: {},
	id: 0,
	
	add: function (object) {
		this.id += 1;
		if (this.objects[object.team.id] === undefined) {
			this.objects[object.team.id] = {};
		}
		this.objects[object.team.id][this.id] = object;
		return this.id;
	},
	
	remove: function (object) {
		delete this.objects[object.team.id][object.objectId];
	}
};