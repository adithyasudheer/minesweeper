// JavaScript source code
"use strict";

var hashmap = require('./hashmap.js');
var toHashmap = hashmap.toHashmap;
var getKey = hashmap.getKey;

//module.exports.MineGrid;

module.exports = class MineGrid {
    constructor() {
        //const instance = this.constructor.instance;
        //if (instance) {
        //    return instance;
        //}
        //this.constructor.instance = this;

        //geometry.js
        this.DIRECTIONS = [{
            x: 0,
            y: 1
        }, {
            x: 0,
            y: -1
        }, {
            x: 1,
            y: 0
        }, {
            x: -1,
            y: 0
        }, {
            x: 1,
            y: 1
        }, {
            x: 1,
            y: -1
        }, {
            x: -1,
            y: 1
        }, {
            x: -1,
            y: -1
        }];
    }
    //geometry.js
    getAll(size) {
        var points = [];
        for (var x = 0; x < size.x; x++) {
            for (var y = 0; y < size.y; y++) {
                points.push({ x, y });
            }
        }
        return points;
    }

    //geometry.js
    getNeighbours(point, size) {
        return this.DIRECTIONS
            .map(d => this.add(point, d))
            .filter(n => this.isInRange(n, size));
    }
    //geometry.js
    add(point, direction) {
        return {
            x: point.x + direction.x,
            y: point.y + direction.y
        };
    }
    //geometry.js
    isInRange(point, size) {
        return point.x < size.x && point.x >= 0 && point.y < size.y && point.y >= 0;
    }





    //field.js
    uncoverDeep(field, point) {
        if (!this.isCovered(field.covers, point)) {
            return [];
        }

        this.uncover(field.covers, point);

        if (!this.isEmptyAt(field, point)) {
            return [point];
        }
        return this
            .getNeighbours(point, field.size)
            .reduce((current, neighbor) => {
                return current.concat(this.uncoverDeep(field, neighbor));
            }, [point]);
    }
    //field.js
    hasMineAt(field, point) {
        return field.mines[getKey(point)] !== undefined;
    }
    //field.js
    getWarningsAt(field, point) {
        var value = field.warnings[getKey(point)];
        return value ? value : 0;
    }
    //field.js
    isEmptyAt(field, point) {
        return !this.hasMineAt(field, point) && this.getWarningsAt(field, point) === 0;
    }
    //field.js
    getGameState(field) {
        if (field.state !== 'in-progress') {
            return field.state;
        }

        var anyMineUncovered =
            field
            .mines
            .filter((p) => !this.isCovered(field.covers, p))
            .length > 0;

        if (anyMineUncovered) {
            return 'loose';
        }

        var areOnlyMinesCovered = (this.count(field.covers) === field.mines.length);
        if (areOnlyMinesCovered) {
            return 'win';
        }
        return 'in-progress';
    }



    //covers.js
     create(size) {
         var allPoints = this.getAll(size);
         return toHashmap(allPoints, (p) => getKey(p), (p) => false);
     }
    //covers.js
     switchFlag(covers, point) {
         if (!this.isCovered(covers, point)) {
             return;
         }
         covers[getKey(point)] = !this.hasFlag(covers, point);
         return covers;
     }
    //covers.js
     uncover(covers, point) {
         delete covers[getKey(point)];
         return covers;
     }
    //covers.js
     uncoverRange(covers, points) {
         points.forEach((p) => this.uncover(covers, p));
         return covers;
     }

    //covers.js
     isCovered(covers, point) {
         return covers[getKey(point)] !== undefined;
     }
    //covers.js
     hasFlag(covers, point) {
         return covers[getKey(point)] === true;
     }
    //covers.js
     count(covers, point) {
         return Object.keys(covers).length;
     }
}
