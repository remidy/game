MY.Util = {
	isRectInRect: function (rect1, rect2) {
		return rect1.x2 > rect2.x1 && rect1.x1 <= rect2.x2 && rect1.y2 > rect2.y1 && rect1.y1 <= rect2.y2;
	},

	getDirections: function () {
		return ["n", "s", "e", "w"];
	},
	
	getDistance: function (x1, y1, x2, y2) {
		var x = x2 - x1;
		var y = y2 - y1;
		return Math.sqrt(x * x + y * y);
	},
	
	getNode: function (object1, object2) {
		var directions = MY.Util.getDirections();
		var x = object1.x + (object1.width / 2);
		var y = object1.y + (object1.height / 2);
		var node1 = null;
		var distance1 = 0;
		for (var i = 0, l = object2.nodes.length; i < l; i += 1) {
			for (var j = 0, m = directions.length; j < m; j += 1) {
				var node2 = object2.nodes[i][directions[j]];
				if (node2 !== null && node2.object === null || node2.object === object1) {
					var distance2 = MY.Util.getDistance(x, y, node2.x + (node2.width / 2), node2.y + (node2.height / 2));
					if (node1 === null || distance1 > distance2) {
						node1 = node2;
						distance1 = distance2;
					}
				}
			}
		}
		return node1;
	},

	getObject: function (object, objects, filter) {
		var object1 = null;
		var distance1 = 0;
		for (var i = 0, l = objects.length; i < l; i += 1) {
			var object2 = objects[i];
			if (filter === undefined || filter(object, object2)) {
				var distance2 = MY.Util.getDistance(object.x + (object.width / 2), object.y + (object.height / 2), object2.x + (object2.width / 2), object2.y + (object2.height/ 2));
				if (object1 === null || distance2 < distance1) {
					object1 = object2;
					distance1 = distance2;
				}
			}
		}
		return object1;
	},

	getObjectRect: function (object) {
		return {
			x1: object.x,
			x2: object.x + object.width,
			y1: object.y,
			y2: object.y + object.height
		};
	},
	
	getRangeNode: function (object1, object2, map, range) {
		var rangeInNodes = Math.floor(range / 32);
		var object2Node = map.getNodeByXY(object2.x, object2.y);
		var minRow = object2Node.row - rangeInNodes;
		var maxRow = object2Node.row + rangeInNodes;
		var minCol = object2Node.col - rangeInNodes;
		var maxCol = object2Node.col + rangeInNodes;
		var x = object2.x + (object2.width / 2);
		var y = object2.y + (object2.height / 2);
		for (var i = minRow; i < maxRow; i += 1) {
			for (var j = minCol; j < maxCol; j += 1) {
				var node = map.getNodeByRowCol(i, j);
				if (node.object === null && MY.Util.getDistance(x, y, node.x + (node.width / 2), node.y + (node.height / 2)) === range) {
					return node;
				}
			}
		}
		return null;
	},

	isObjectInRange: function (object1, object2) {
		return MY.Util.getDistance(object1.x, object1.y, object2.x, object2.y) <= object1.range;
	},
	
	isPointInRect: function (point, rect) {
		return !(point.x < rect.x1 || point.x > rect.x2 || point.y < rect.y1 || point.y > rect.y2);
	}
};