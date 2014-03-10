MY.Config = {
	buildings: {
		"WorkerBuilding": {
			id: "WorkerBuilding",
			require: [],
			name: "Worker Building",
			width: 160,
			height: 160,
			grid: [
				[1, 1, 1, 1, 1],
				[1, 1, 1, 1, 1],
				[1, 1, 1, 1, 1],
				[1, 1, 1, 1, 1],
				[1, 1, 2, 1, 1],
				[0, 0, 3, 0, 0]
			],
			cost: 4000,
			color: "rgb(0, 0, 255)"
		},
		"SoldierBuilding": {
			id: "SoldierBuilding",
			require: [MY.WorkerBuilding],
			name: "Soldier Building",
			width: 96,
			height: 96,
			grid: [
				[1, 1, 1],
				[1, 1, 1],
				[1, 2, 1],
				[0, 3, 0]
			],
			cost: 1000,
			color: "rgb(0, 0, 255)"
		},
		"CashBuilding": {
			id: "CashBuilding",
			require: [MY.WorkerBuilding],
			name: "Cash Building",
			width: 96,
			height: 64,
			grid: [
				[1, 1, 1],
				[0, 2, 0],
				[0, 3, 0]
			],
			cost: 2000,
			color: "rgb(0, 0, 255)"
		}
	},
	units: {
		"WorkerUnit": {
			id: "WorkerUnit",
			require: [MY.WorkerBuilding],
			name: "Worker Unit",
			cost: 100,
			color: "rgb(0, 0, 255)",
			building: MY.WorkerBuilding
		},
		"SoldierUnit": {
			id: "SoldierUnit",
			require: [MY.SoldierBuilding],
			name: "Soldier Unit",
			cost: 200,
			color: "rgb(0, 0, 255)",
			building: MY.SoldierBuilding
		}
	}
};