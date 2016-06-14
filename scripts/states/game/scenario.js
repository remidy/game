MY.Scenario = function () {};

MY.Scenario.prototype.init = function (game) {
	this.game = game;

	this.scenario = MY.Scenarios.Scenario1;
	
	this.map = new MY.Map();
	this.map.init();
	
	this.initTeams();
	this.initObjects();
};

MY.Scenario.prototype.initTeams = function () {
	this.teams = {};
	for (var id in this.scenario.teams) {
		var scenarioTeam = this.scenario.teams[id];
		
		var team = new MY.Team();
		team.init(id, scenarioTeam.cash, scenarioTeam.color, scenarioTeam.selectedColor);
		
		this.teams[id] = team;
	}
};

MY.Scenario.prototype.initObjects = function () {
	var levelObjectTypes = this.scenario.objects;
	for (var levelObjectTypeId in levelObjectTypes) {
		var levelObjects = levelObjectTypes[levelObjectTypeId];
		for (var levelObjectId in levelObjects) {
			var levelObject = levelObjects[levelObjectId];
			levelObject.team = this.teams[levelObject.team];

			var object = new MY.Config.objectTypes[levelObject.type].class();
			object.init(this.map, levelObject, levelObjectId);
		}
	}
};