// Tile definitions
var imageSheet = new Image();
imageSheet.src = 'sprites.png';

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

var beamArt = [
    [[1,0], [1,0],   [8,0]],
    [[1,0], [0,1],   [9,1]],
    [[1,0], [0,-1],  [9,0]],
    [[-1,0],[-1,0], [8,0]],
    [[-1,0],[0,-1], [10,0]],
    [[-1,0],[0,1],  [10,1]],
    [[0,1], [0,1],   [8,1]],
    [[0,1], [-1,0],  [9,0]],
    [[0,1], [1,0],   [10,0]],
    [[0,-1],[0,-1], [8,1]],
    [[0,-1],[-1,0], [9,1]],
    [[0,-1],[1,0],  [10,1]]
];

// Objects
function Target(origin) {
    this.origin = origin;
}

function Laser(origin,direction) {
    this.origin = origin;
    this.direction = direction;
    
    this.shoot = function(x,y,ctx) {
        ctx.fillStyle = "rgba(128,128,255,0.75)";
        var curDir = [this.direction[0], this.direction[1]];
        var cx = x;
        var cy = y;
        while (true) {
            newDir = map.getCell([cx,cy]).beamExitDirection(curDir);
            if (newDir == undefined)
            {
                ctx.fillRect(cx*32+11, cy*32+11, 10,10)
                break;
            }
            drawBeam([cx,cy], curDir, newDir, ctx);
            curDir = newDir;
            cx += curDir[0];
            cy += curDir[1];
        }
    }
}


function isEqualDir(d1, d2) {
    return d1[0] == d2[0] && d1[1] == d2[1];
}

// origin = artwork origin
// dirs = array of dir -> dir for in/out
function Mirror(origin,dirs) {
    this.origin = origin;
    this.dirs = dirs;
    
    this.beamExitDirection = function(dir) {
        for (var d in dirs) {
            if (isEqualDir(dir, dirs[d][0]))
                return dirs[d][1];
        }
            
        return undefined;
    }
}

// Cells
function Cell(tile, object) {
    this.tile = tile;
    this.object = object;
    
    this.draw = function(x,y,ctx) {
        ctx.drawImage(imageSheet, 32*tile.origin[0], 32*tile.origin[1], 32, 32, x*32, y*32, 32, 32);
        
        if (object)
            ctx.drawImage(imageSheet, 32*object.origin[0], 32*object.origin[1], 32, 32, x*32, y*32, 32, 32);
    }
    
    this.beamExitDirection = function(dir) {
        if (!tile.allowBeam)
            return undefined;
        
        if (object && object.beamExitDirection)
            return object.beamExitDirection(dir);
            
        return dir;
    }
}

function drawBeam(xy, d0, d1, ctx) {
    var origin = undefined;
    for (var i in beamArt)
        if (isEqualDir(beamArt[i][0],d0) && isEqualDir(beamArt[i][1],d1)) {
            origin = beamArt[i][2];
            break;
        }
    
    ctx.drawImage(imageSheet, 32*origin[0], 32*origin[1], 32, 32, xy[0]*32, xy[1]*32, 32, 32);
}



// Level definition
var floorCell = new Cell(tiles.floor, undefined);
var wallCell = new Cell(tiles.wall, undefined);
var emitterCell = new Cell(tiles.floor, new Laser([4,4], [1,0]));
var targetCell = new Cell(tiles.floor, new Target([4,6]));
var mirrorCell = new Cell(tiles.floor, new Mirror([2,0], [[[1,0],[0,-1]],[[0,1],[-1,0]]]));
var mirror2Cell = new Cell(tiles.floor, new Mirror([2,1], [[[0,-1],[-1,0]],[[1,0],[0,1]]]));

var map = {
    "width" : 6,
    "height" : 4,
    "cells" : [wallCell,wallCell,wallCell,wallCell,wallCell,wallCell,
               wallCell,targetCell,floorCell,mirror2Cell,floorCell,wallCell,
               wallCell,emitterCell,floorCell,mirrorCell,floorCell,wallCell,
               wallCell,wallCell,wallCell,wallCell,wallCell,wallCell],
    "getCell" : function(xy) { return this.cells[xy[1]*map.width + xy[0]]; }
}

$(function() {
	setInterval( "main()", 50 );
});


function main()
{
    var ctx = $('canvas')[0].getContext('2d');
    ctx.clearRect(0,0, 256, 256);

    // Draw the map
    for (var y = 0; y < map.height; y++)
        for (var x = 0; x < map.width; x++) {
            map.cells[y*map.width + x].draw(x,y,ctx);
        }
            
    
    // Draw lasers
    map.getCell([1,2]).object.shoot(1,2,ctx);
}