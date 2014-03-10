MY.Util = {
	boxCollides: function (box1, box2) {
		return !(box1.x2 <= box2.x1 || box1.x1 > box2.x2 || box1.y2 <= box2.y1 || box1.y1 > box2.y2);
	},
	
	getDirections: function () {
		return ["n", "s", "e", "w"];
	},
	
	getDistance: function (x1, y1, x2, y2) {
		var x = x2 - x1,
			y = y2 - y1;
		return Math.sqrt(x * x + y * y);
	},
	
	getNode: function (object1, object2) {
		var directions = this.getDirections(),
			x = object1.x + (object1.width / 2),
			y = object1.y + (object1.height / 2),
			node1 = null,
			distance1;
		for (var i = 0, l = object2.nodes.length; i < l; i += 1) {
			for (var j = 0, m = directions.length; j < m; j += 1) {
				var node2 = object2.nodes[i][directions[j]];
				if (node2 !== null && node2.object === null || node2.object === object1) {
					var distance2 = this.getDistance(x, y, node2.x + (node2.width / 2), node2.y + (node2.height / 2));
					if (node1 === null || distance1 > distance2) {
						node1 = node2;
						distance1 = distance2;
					}
				}
			}
		}
		return node1;
	},
	
	getObjectBox: function (object) {
		return {
			x1: object.x,
			x2: object.x + object.width,
			y1: object.y,
			y2: object.y + object.height
		};
	},
	
	getRangeNode: function (object1, object2, map, range) {
		var rangeInNodes = Math.floor(range / 32),
			minRow = object2.node.row - rangeInNodes,
			maxRow = object2.node.row + rangeInNodes,
			minCol = object2.node.col - rangeInNodes,
			maxCol = object2.node.col + rangeInNodes,
			x = object2.x + (object2.width / 2),
			y = object2.y + (object2.height / 2);
		for (var i = minRow; i < maxRow; i += 1) {
			for (var j = minCol; j < maxCol; j += 1) {
				var node = map.getNodeByRowCol(i, j);
				if (node.object === null && this.getDistance(x, y, node.x + (node.width / 2), node.y + (node.height / 2)) === range) {
					return node;
				}
			}
		}
		return null;
	},
	
	isPointInBox: function (point, box) {
		return !(point.x < box.x1 || point.x > box.x2 || point.y < box.y1 || point.y > box.y2);
	}
};