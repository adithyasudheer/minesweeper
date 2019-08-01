'use strict';

//var covers = require('./covers.js');
//var board = require('./field.js');
//var geo = require('./geometry.js');
var MineGrid = require('./logic/minegrid.js');
var gridObj = new MineGrid();

var field;
var events = [];

module.exports = {
    start,
    quit,
    uncover,
    flag,
    getEvents
};

function getEvents() {
  return events;
}

function start(minesCount, size) {
    field = gridObj.populate(minesCount, size);
    return gridObj
      .getAll(size)
      .map(update);
}

function quit() {
    return gridObj
      .uncoverRange(field.covers, field.mines)
      .map(update);
}

function flag(point) {
    gridObj.switchFlag(field.covers, point);
    return update(point);
}

function uncover(point) {
    return gridObj
        .uncoverDeep(field, point)
        .map(update);
}

function update(point) {
  var e = {
      point: point,
      value: getCellValue(point)
  };
  events.push(e);
  return e;
}

function getCellValue(point) {
    return gridObj.isCovered(field.covers, point) ?
        (gridObj.hasFlag(field.covers, point) ? "flagged" : "covered") :
        (gridObj.hasMineAt(field, point) ? "mine" : gridObj.getWarningsAt(field, point));
}
