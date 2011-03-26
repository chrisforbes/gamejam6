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

// Objects
var objects = {
    "emitter" : {
        "origin" : [4,4],
    },
    "target" : {
        "origin" : [4,6],
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
}

// Level definition
var floorCell = new Cell(tiles.floor, undefined);
var wallCell = new Cell(tiles.wall, undefined);
var emitterCell = new Cell(tiles.floor, objects.emitter);
var targetCell = new Cell(tiles.floor, objects.target);

var map = {
    "width" : 6,
    "height" : 4,
    "cells" : [wallCell,wallCell,wallCell,wallCell,wallCell,wallCell,
               wallCell,targetCell,floorCell,floorCell,floorCell,wallCell,
               wallCell,emitterCell,floorCell,floorCell,floorCell,wallCell,
               wallCell,wallCell,wallCell,wallCell,wallCell,wallCell],
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
        for (var x = 0; x < map.width; x++)
            map.cells[y*map.width + x].draw(x,y,ctx);
        
    // Draw lasers
}