// Tile definitions
var wall = {
    "allowPlace" : false,
    "allowBeam" : false,
    "color" : "black"
}

var floor = {
    "allowPlace" : true,
    "allowBeam" : true,
    "color" : "gray"
}

// Objects
var emitter = {
    "color" : "red"
}

var target = {
    "color" : "green"
}

// Cells
var floorCell = {
    "tile" : floor
};

var wallCell = {
    "tile" : wall
}

var emitterCell = {
    "tile" : floor,
    "object" : emitter
}

var targetCell = {
    "tile" : floor,
    "object" : target
}

var emitter = {
    "allowPlace" : false,
    "allowBeam" : false,
    "color" : "red"
}

var target = {
    "allowPlace" : false,
    "allowBeam" : true,
    "color" : "green"
}


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
    renderMapLayer(ctx);
        
    // Draw lasers
}

function renderMapLayer(ctx)
{
    for (var y = 0; y < map.height; y++)
        for (var x = 0; x < map.width; x++){
            var cell = map.cells[y*map.width + x];
            ctx.fillStyle = cell.tile.color;
            ctx.fillRect(x*32, y*32, 32, 32);
            if (cell.object) {
                ctx.fillStyle = cell.object.color;
                ctx.fillRect(x*32+4, y*32+4, 24, 24);
            }
        }
}