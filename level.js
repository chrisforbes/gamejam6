// Cells
function Cell(tile, actor) {
    this.tile = tile;
    this.actor = actor;
    
    this.draw = function(x,y,ctx) {
        ctx.drawImage(imageSheet, 32*tile.origin[0], 32*tile.origin[1], 32, 32, x*32, y*32, 32, 32);
        
        if (actor)
            ctx.drawImage(imageSheet, 32*actor.origin[0], 32*actor.origin[1], 32, 32, x*32, y*32, 32, 32);
    }
    
    this.beamHit = function(color, dir) {
        if (!tile.allowBeam)
            return undefined;
        
        if (actor && actor.beamHit)
            return actor.beamHit(color, dir);
            
        return dir;
    }
}

var tiles = {
    "wall" : {
        "allowPlace" : false,
        "allowBeam" : false,
        "origin" : [3,3],
    },
    "floor" : {
        "allowPlace" : true,
        "allowBeam" : true,
        "origin" : [3,2],
    }
}

// Level definition
var floorCell = new Cell(tiles.floor, undefined);
var wallCell = new Cell(tiles.wall, undefined);
var emitterCell = new Cell(tiles.floor, new Laser("green", "e"));
var targetCell = new Cell(tiles.floor, new Target("green", "s"));
var mirrorNWCell = new Cell(tiles.floor, new Mirror("nw"));
var mirrorNECell = new Cell(tiles.floor, new Mirror("ne"));
var mirrorSECell = new Cell(tiles.floor, new Mirror("se"));
var mirrorSWCell = new Cell(tiles.floor, new Mirror("sw"));

var map = {
    "width" : 6,
    "height" : 4,
    "cells" : [wallCell,wallCell,wallCell,wallCell,wallCell,wallCell,
               wallCell,targetCell,floorCell,mirrorSWCell,mirrorSWCell,wallCell,
               wallCell,floorCell,emitterCell,mirrorNWCell,mirrorNECell,wallCell,
               wallCell,wallCell,wallCell,wallCell,wallCell,wallCell],
    "getCell" : function(xy) { return this.cells[xy[1]*map.width + xy[0]]; }
}
