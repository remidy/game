MY.Objects = {
	objects: {},
	id: 0,
	
	add: function (object) {
		var teamId = MY.Objects.getTeamId(object);
		if (MY.Objects.objects[teamId] === undefined) {
			MY.Objects.objects[teamId ] = {};
		}
		MY.Objects.id += 1;
		MY.Objects.objects[teamId][MY.Objects.id] = object;
		return MY.Objects.id;
	},
	
	remove: function (object) {
		var teamId = MY.Objects.getTeamId(object);
		delete MY.Objects.objects[teamId][object.objectId];
	},

	getTeamId: function (object) {
		var teamId;
		if (object.team !== undefined) {
			teamId = object.team.id;
		}
		return teamId;
	}
};