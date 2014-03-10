MY.Scenarios = {};

MY.Scenarios.Scenario1 = {
	map: "scripts/maps/map-1.js",
	teams: {
		"Team1": {
			cash: 2000,
			color: "rgb(0, 0, 255)",
			selectedColor: "rgb(0, 255, 0)"
		},
		"Team2": {
			cash: 2000,
			color: "rgb(255, 0, 0)",
			selectedColor: "rgb(0, 255, 0)",
			orders: [
				
			]
		}
	},
	buildings: {
		"Building1": {
			type: "WorkerBuilding",
			team: "Team1",
			row: 2,
			col: 2
		}
	},
	units: {
		"Unit1": {
			type: "WorkerUnit",
			team: "Team1",
			row: 2,
			col: 8
		},
		"Unit2": {
			type: "WorkerUnit",
			team: "Team1",
			row: 4,
			col: 8
		},
		"Unit3": {
			type: "SoldierUnit",
			team: "Team1",
			row: 6,
			col: 8
		},
		"Unit4": {
			type: "SoldierUnit",
			team: "Team2",
			row: 10,
			col: 10
		},
		"Unit5": {
			type: "SoldierUnit",
			team: "Team2",
			row: 10,
			col: 12
		}
	}
};