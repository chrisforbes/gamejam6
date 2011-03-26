// Tile definitions
var tiles = {
    "wall" : {
        "allowPlace" : false,
        "allowBeam" : false,
        "color" : "black"
    },

    "floor" : {
        "allowPlace" : true,
        "allowBeam" : true,
        "color" : "gray"
    }
}

// Objects
var objects = {
    "emitter" : {
        "color" : "red"
    },
    "target" : {
        "color" : "green"
    }
}

// Cells
function Cell(tile, object) {
    this.tile = tile;
    this.object = object;
    
    this.draw = function(x,y,ctx) {
        ctx.fillStyle = tile.color;
        ctx.fillRect(x*32, y*32, 32, 32);
        
        if (object)
        {
            ctx.fillStyle = object.color;
            ctx.fillRect(x*32+4, y*32+4, 24, 24);
        }
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