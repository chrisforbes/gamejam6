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

// Cells
function Cell(tile, actor) {
    this.tile = tile;
    this.actor = actor;
    
    this.drawPreBeam = function(x,y,ctx) {
        ctx.drawImage(imageSheet, 32*this.tile.origin[0], 32*this.tile.origin[1], 32, 32, x*32, y*32, 32, 32);
    }
    this.drawPostBeam = function(x,y,ctx) {
        if (actor)
            ctx.drawImage(imageSheet, 32*this.actor.origin[0], 32*this.actor.origin[1], 32, 32, x*32, y*32, 32, 32);
    }
    this.beamHit = function(color, dir) {
        if (!this.tile.allowBeam)
            return undefined;
        
        if (this.actor && this.actor.beamHit)
            return this.actor.beamHit(color, dir);
            
        return dir;
    }
}



// Level definition
var floorCell = new Cell(tiles.floor, undefined);
var wallCell = new Cell(tiles.wall, undefined);
var emitterCell = new Cell(tiles.floor, new Laser("green", "e"));
var laserRear = new Cell(tiles.floor, new LaserRear("e"));
var targetCell = new Cell(tiles.floor, new Target("green", "s"));
var mirrorNWCell = new Cell(tiles.floor, new Mirror("nw"));
var mirrorNECell = new Cell(tiles.floor, new Mirror("ne"));
var mirrorSECell = new Cell(tiles.floor, new Mirror("se"));
var mirrorSWCell = new Cell(tiles.floor, new Mirror("sw"));
var mirrorDoubleNWCell = new Cell(tiles.floor, new Mirror("double-nw"));
var mirrorDoubleNECell = new Cell(tiles.floor, new Mirror("double-ne"));
var filter = new Cell(tiles.floor, new Filter("green","e"));

var map = {
    "width" : 6,
    "height" : 4,
    "cells" : [wallCell,wallCell,wallCell,wallCell,wallCell,wallCell,
               wallCell,targetCell,filter,mirrorSWCell,mirrorSWCell,wallCell,
               wallCell,laserRear,emitterCell,mirrorDoubleNWCell,mirrorDoubleNECell,wallCell,
               wallCell,wallCell,wallCell,wallCell,wallCell,wallCell],
    "getCell" : function(xy) { return this.cells[xy[1]*map.width + xy[0]]; }
}
