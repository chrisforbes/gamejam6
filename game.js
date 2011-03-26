// Tile definitions
var imageSheet = new Image();
imageSheet.src = 'sprites.png';
var selectedPanel = null;
var nearestTileX = null;
var nearestTileY = null;

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


function isEqualDir(d1, d2) {
    return d1[0] == d2[0] && d1[1] == d2[1];
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

$(function() {
	setInterval( "main()", 50 );
});

function main() {
    var ctx = $('canvas')[0].getContext('2d');
    ctx.clearRect(0,0, 256, 256);

    // Draw the map
    for (var y = 0; y < map.height; y++)
        for (var x = 0; x < map.width; x++) {
            map.cells[y*map.width + x].drawPreBeam(x,y,ctx);
        }
    
    // Draw lasers
    map.getCell([2,2]).actor.shoot(2,2,ctx);
    
    // Actors
    for (var y = 0; y < map.height; y++)
        for (var x = 0; x < map.width; x++) {
            map.cells[y*map.width + x].drawPostBeam(x,y,ctx);
        }
            
    
    if (selectedPanel == null || nearestTileX == null) return;
    ctx.shadowColor = "rgba(0,0,0,0.75)";
    ctx.shadowOffsetX = -3;
    ctx.shadowOffsetY = -3;
    ctx.drawImage(imageSheet, selectedPanel.origin[0] * tileSize,
        selectedPanel.origin[1] * tileSize, tileSize, tileSize,
        nearestTileX + 3, nearestTileY + 3, tileSize, tileSize);
    ctx.shadowColor = "rgba(0,0,0,0)";
}
