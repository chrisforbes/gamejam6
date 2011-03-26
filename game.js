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

function Laser(color,dir) {
    this.color = color;
    var c = 4;
    switch(color) {
        case "red": c = 4; break;
        case "green": c = 2; break;
        case "blue": c = 3; break;
        case "white": c = 1; break;
    }
    switch (dir) {
        case "n":
            this.origin = [7,c];
            this.direction = [0,-1];
        break;
        case "e":
            this.origin = [4,c];
            this.direction = [1,0];
        break;
        case "s":
            this.origin = [5,c];
            this.direction = [0,1];
        break;
        case "w":
            this.origin = [6,c];
            this.direction = [-1,0];
        break;
    }

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
            drawBeam(this.color, [cx,cy], curDir, newDir, ctx);
            curDir = newDir;
            cx += curDir[0];
            cy += curDir[1];
        }
    }
}


function isEqualDir(d1, d2) {
    return d1[0] == d2[0] && d1[1] == d2[1];
}

function Mirror(type) {
    if (type == "nw") {
        this.origin = [2,0];
        this.dirs = [[[1,0],[0,-1]],[[0,1],[-1,0]]];
    } else if (type == "sw") {
        this.origin = [2,1];
        this.dirs = [[[0,-1],[-1,0]],[[1,0],[0,1]]];
    } else if (type == "ne") {
        this.origin = [3,0];
        this.dirs = [[[0,1],[1,0]],[[-1,0],[0,-1]]];
    } else if (type == "se") {
        this.origin = [3,1];
        this.dirs = [[[0,-1],[1,0]],[[-1,0],[0,1]]];
    }
    
    this.beamExitDirection = function(dir) {
        for (var d in this.dirs) {
            if (isEqualDir(dir, this.dirs[d][0]))
                return this.dirs[d][1];
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

function drawBeam(color, xy, d0, d1, ctx) {
    var origin = undefined;
    for (var i in beamArt)
        if (isEqualDir(beamArt[i][0],d0) && isEqualDir(beamArt[i][1],d1)) {
            origin = beamArt[i][2];
            break;
        }
    var o = 0;
    switch(color) {
        case "green": o = 128; break;
        case "blue": o = 64; break;
    }
    ctx.drawImage(imageSheet, 32*origin[0], 32*origin[1]+o, 32, 32, xy[0]*32, xy[1]*32, 32, 32);
}



// Level definition
var floorCell = new Cell(tiles.floor, undefined);
var wallCell = new Cell(tiles.wall, undefined);
var emitterCell = new Cell(tiles.floor, new Laser("green", "e"));
var targetCell = new Cell(tiles.floor, new Target([4,6]));
var mirrorNWCell = new Cell(tiles.floor, new Mirror("nw"));
var mirrorNECell = new Cell(tiles.floor, new Mirror("ne"));
var mirrorSECell = new Cell(tiles.floor, new Mirror("se"));
var mirrorSWCell = new Cell(tiles.floor, new Mirror("sw"));

var map = {
    "width" : 6,
    "height" : 4,
    "cells" : [wallCell,wallCell,wallCell,wallCell,wallCell,wallCell,
               wallCell,targetCell,floorCell,mirrorSECell,mirrorSWCell,wallCell,
               wallCell,floorCell,emitterCell,mirrorNWCell,mirrorNECell,wallCell,
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
    map.getCell([2,2]).object.shoot(2,2,ctx);
}