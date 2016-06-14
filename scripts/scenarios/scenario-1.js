MY.Scenarios = {};

MY.Scenarios.Scenario1 = {
	map: "scripts/maps/map-1.js",
	teams: {
		"Team1": {
			cash: 10000,
			color: "rgb(0, 0, 255)",
			selectedColor: "rgb(0, 255, 0)"
		},
		"Team2": {
			cash: 10000,
			color: "rgb(255, 0, 0)",
			selectedColor: "rgb(0, 0, 0)"
		}
	},
	objects: {
		buildings: {
			"Building1": {
				type: "WorkerBuilding",
				team: "Team1",
				x: 64,
				y: 64
			},
			"Building2": {
				type: "WorkerBuilding",
				team: "Team2",
				x: 800,
				y: 800
			}
		},
		units: {
			"Unit1": {
				type: "WorkerUnit",
				team: "Team1",
				x: 256,
				y: 64
			},
			"Unit2": {
				type: "WorkerUnit",
				team: "Team1",
				x: 256,
				y: 128
			},
			"Unit3": {
				type: "SoldierUnit",
				team: "Team1",
				x: 256,
				y: 192
			},
			"Unit4": {
				type: "WorkerUnit",
				team: "Team2",
				x: 736,
				y: 800
			},
			"Unit5": {
				type: "WorkerUnit",
				team: "Team2",
				x: 736,
				y: 864
			},
			"Unit6": {
				type: "SoldierUnit",
				team: "Team2",
				x: 736,
				y: 928
			}
		}
	}
};