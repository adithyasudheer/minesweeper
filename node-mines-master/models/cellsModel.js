'use strict';

var repository = require('./repository.js');

//var covers = require('./logic/covers.js');
//var board = require('./logic/field.js');
//var geo = require('./logic/geometry.js');
var MineGrid = require('./logic/minegrid.js');
var gridObj = new MineGrid();

module.exports = {
    getAll,
    getCell,
    uncover,
    triggerFlag
};

function getAll(id) {
    var field = repository.load(id);
    if (!field) {
        return;
    }

    return gridObj
        .getAll(field.size)
        .map((point) => createUpdate(field, point));
}

function getCell(id, x, y) {
    var cell = toCell(id, x, y);
    if (!cell) {
        return;
    }
    return toUpdate(cell);
}

function triggerFlag(id, x, y) {
    var cell = toCell(id, x, y);
    if (!cell) {
        return;
    }

    gridObj.switchFlag(cell.field.covers, cell.point);
    repository.save(cell.field);
    return toUpdate(cell);
}

function uncover(id, x, y) {
    var cell = toCell(id, x, y);
    var field = cell.field;
    var point = cell.point;

    if (!cell) {
        return;
    }
    var result = gridObj
        .uncoverDeep(field, point)
        .map((point) => createUpdate(field, point));

    field.state = gridObj.getGameState(field);
    if (field.state === 'loose') {
        field.mines.forEach((p) => gridObj.uncoverDeep(field, p));
        result = result.concat(field.mines.map((point) => createUpdate(field, point)));
    }

    repository.save(field);
    return result;
}

function toCell(id, x, y) {
    var field = repository.load(id);
    if (!field) {
        return;
    }

    var point = {
        x: parseInt(x),
        y: parseInt(y)
    };

    if (!gridObj.isInRange(point, field.size)) {
        return;
    }

    return {
        field,
        point
    };
}

function toUpdate(cell) {
    return createUpdate(cell.field, cell.point);
}

function createUpdate(field, point) {
    return {
        point: point,
        value: getCellValue(field, point)
    };
}

function getCellValue(field, point) {
    return gridObj.isCovered(field.covers, point) ?
        (gridObj.hasFlag(field.covers, point) ? "flagged" : "covered") :
        (gridObj.hasMineAt(field, point) ? "mine" : gridObj.getWarningsAt(field, point));
}
