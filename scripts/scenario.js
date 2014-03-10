MY.require("scripts/scenarios/scenario-1.js");

MY.Scenario = function () {};

MY.Scenario.prototype.init = function () {
	this.scenario = MY.Scenarios.Scenario1;
	
	this.map = new MY.Map();
	this.map.init();
	
	this.initTeams();
	this.initBuildings();
	this.initUnits();
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

MY.Scenario.prototype.initBuildings = function () {
	this.buildings = {};
	for (var id in this.scenario.buildings) {
		var scenarioBuilding = this.scenario.buildings[id];
		
		var building = new MY[scenarioBuilding.type]();
		building.init(this.teams[scenarioBuilding.team], this.map.getNodeByRowCol(scenarioBuilding.row, scenarioBuilding.col), this.map);
		
		this.buildings[id] = building;
	}
};

MY.Scenario.prototype.initUnits = function () {
	this.units = {};
	for (var id in this.scenario.units) {
		var scenarioUnit = this.scenario.units[id];
		
		var unit = new MY[scenarioUnit.type]();
		unit.init(this.teams[scenarioUnit.team], this.map.getNodeByRowCol(scenarioUnit.row, scenarioUnit.col), this.map);
		
		this.units[id] = unit;
	}
};