MY.Config = {
	objectTypes: {
		"CashBuilding": {
			class: MY.CashBuilding,
			color: "rgb(0, 0, 255)",
			cost: 2000,
			grid: [
				[1, 1, 1],
				[0, 2, 0],
				[0, 3, 0]
			],
			height: 64,
			id: "CashBuilding",
			name: "Cash Building",
			require: ["WorkerBuilding"],
			width: 96
		},
		"SoldierBuilding": {
			class: MY.SoldierBuilding,
			color: "rgb(0, 0, 255)",
			cost: 1000,
			grid: [
				[1, 1, 1],
				[1, 1, 1],
				[1, 2, 1],
				[0, 3, 0]
			],
			height: 96,
			id: "SoldierBuilding",
			name: "Soldier Building",
			require: ["WorkerBuilding", "CashBuilding"],
			width: 96
		},
		"SoldierUnit": {
			building: MY.SoldierBuilding,
			class: MY.SoldierUnit,
			color: "rgb(0, 0, 255)",
			cost: 200,
			id: "SoldierUnit",
			name: "Soldier Unit",
			require: ["SoldierBuilding"]
		},
		"WorkerBuilding": {
			class: MY.WorkerBuilding,
			color: "rgb(0, 0, 255)",
			cost: 4000,
			grid: [
				[1, 1, 1, 1, 1],
				[1, 1, 1, 1, 1],
				[1, 1, 1, 1, 1],
				[1, 1, 1, 1, 1],
				[1, 1, 2, 1, 1],
				[0, 0, 3, 0, 0]
			],
			height: 160,
			id: "WorkerBuilding",
			name: "Worker Building",
			require: [],
			width: 160
		},
		"WorkerUnit": {
			building: MY.WorkerBuilding,
			class: MY.WorkerUnit,
			color: "rgb(0, 0, 255)",
			cost: 100,
			id: "WorkerUnit",
			name: "Worker Unit",
			require: ["WorkerBuilding"]
		}
	}
};